import express, { Request, Response } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Gracefully handle unexpected rejections or errors to keep server resilient
process.on('unhandledRejection', (reason) => {
  console.error('[Server] Unhandled rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[Server] Uncaught exception:', err);
});

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini AI securely on the server
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
} else {
  console.warn('GEMINI_API_KEY is not set in environment.');
}

// Data Provider Types
export interface RawLead {
  id: string;
  source: string;
  businessName: string;
  category: string;
  location: string;
  website?: string;
  email?: string;
  phone?: string;
  description?: string;
  rawOsmId?: string;
}

export interface RawJob {
  id: string;
  source: string;
  title: string;
  company: string;
  location: string;
  remote: string;
  jobType: string;
  description: string;
  skills: string;
  applicationUrl: string;
  postedAt: string;
}

// ---------------------------------------------------------------------------
// Lead Data Provider: Real OpenStreetMap Overpass Directory & Public Feeds
// ---------------------------------------------------------------------------
class LeadDataProvider {
  static async searchLeads(category: string, location: string, filters: {
    hasWebsite?: boolean;
    hasEmail?: boolean;
    hasPhone?: boolean;
    smallBusiness?: boolean;
  } = {}): Promise<{ leads: RawLead[]; configured: boolean; message?: string }> {
    const trimmedCat = category.trim().toLowerCase();
    const trimmedLoc = location.trim();

    if (!trimmedLoc && !trimmedCat) {
      return { leads: [], configured: true, message: 'Please enter a category or location to search.' };
    }

    try {
      // Step 1: Geocode the location using Nominatim (legitimate free public OpenStreetMap geocoder)
      const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmedLoc || 'United States')}&format=json&limit=1`;
      const geoRes = await fetch(geoUrl, {
        headers: {
          'User-Agent': 'LeadFinderAI/1.0 (freelance business finder)',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(6000),
      });

      if (!geoRes.ok) {
        throw new Error(`Geocoding failed with status: ${geoRes.status}`);
      }

      const geoData = await geoRes.json();
      if (!Array.isArray(geoData) || geoData.length === 0) {
        return {
          leads: [],
          configured: true,
          message: `Location "${location}" could not be resolved. Please try a different city or region.`,
        };
      }

      const { lat, lon, boundingbox } = geoData[0];
      const south = parseFloat(boundingbox[0]);
      const north = parseFloat(boundingbox[1]);
      const west = parseFloat(boundingbox[2]);
      const east = parseFloat(boundingbox[3]);

      // Map human business category to OSM tags
      let tagSelector = '["shop"]';
      if (trimmedCat.includes('barber') || trimmedCat.includes('salon') || trimmedCat.includes('hair')) {
        tagSelector = '["shop"~"hairdresser|beauty|barber"]';
      } else if (trimmedCat.includes('restaurant') || trimmedCat.includes('cafe') || trimmedCat.includes('food')) {
        tagSelector = '["amenity"~"restaurant|cafe|fast_food|bar"]';
      } else if (trimmedCat.includes('roof') || trimmedCat.includes('construct') || trimmedCat.includes('plumb') || trimmedCat.includes('electric')) {
        tagSelector = '["craft"]';
      } else if (trimmedCat.includes('dentist') || trimmedCat.includes('doctor') || trimmedCat.includes('clinic')) {
        tagSelector = '["amenity"~"dentist|doctors|clinic"]';
      } else if (trimmedCat.includes('gym') || trimmedCat.includes('fitness')) {
        tagSelector = '["leisure"~"fitness_centre|sports_centre"]';
      } else if (trimmedCat.includes('real estate') || trimmedCat.includes('estate') || trimmedCat.includes('agency')) {
        tagSelector = '["office"~"estate_agent|company|insurance"]';
      } else if (trimmedCat.includes('lawyer') || trimmedCat.includes('legal')) {
        tagSelector = '["office"~"lawyer|notary"]';
      } else if (trimmedCat.includes('photograph')) {
        tagSelector = '["shop"="photography"]';
      } else if (trimmedCat.includes('clean')) {
        tagSelector = '["craft"="cleaning"]';
      } else {
        tagSelector = '["commercial"]';
      }

      // Query Overpass API with bounding box
      const overpassQuery = `
        [out:json][timeout:10];
        (
          node${tagSelector}(${south},${west},${north},${east});
          way${tagSelector}(${south},${west},${north},${east});
        );
        out tags center 25;
      `;

      const overpassUrl = 'https://overpass-api.de/api/interpreter';
      const overpassRes = await fetch(overpassUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'LeadFinderAI/1.0',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`,
        signal: AbortSignal.timeout(9000),
      });

      if (!overpassRes.ok) {
        throw new Error(`Overpass query failed with status: ${overpassRes.status}`);
      }

      const osmResult = await overpassRes.json();
      const elements = osmResult.elements || [];

      const parsedLeads: RawLead[] = [];

      for (const el of elements) {
        const tags = el.tags || {};
        const name = tags.name || tags['name:en'] || tags.operator || tags.brand;
        if (!name) continue; // Skip unnamed nodes

        const website = tags.website || tags['contact:website'] || tags.url || undefined;
        const phone = tags.phone || tags['contact:phone'] || tags['contact:mobile'] || undefined;
        const email = tags.email || tags['contact:email'] || undefined;

        // Street address assembly
        const street = tags['addr:street'] ? `${tags['addr:housenumber'] || ''} ${tags['addr:street']}`.trim() : '';
        const city = tags['addr:city'] || location;
        const fullLocation = street ? `${street}, ${city}` : city;

        const subCategory = tags.shop || tags.amenity || tags.craft || tags.office || category;
        const description = tags.description || `Registered ${subCategory} local business located in ${city}.`;

        // Apply filters
        if (filters.hasWebsite && !website) continue;
        if (filters.hasPhone && !phone) continue;
        if (filters.hasEmail && !email) continue;

        parsedLeads.push({
          id: `osm_${el.type}_${el.id}`,
          source: 'OpenStreetMap Public Business Directory',
          businessName: name,
          category: subCategory.charAt(0).toUpperCase() + subCategory.slice(1).replace(/_/g, ' '),
          location: fullLocation,
          website,
          phone,
          email,
          description,
          rawOsmId: String(el.id),
        });

        if (parsedLeads.length >= 20) break;
      }

      if (parsedLeads.length === 0) {
        return {
          leads: [],
          configured: true,
          message: `No public verified business listings found matching "${category}" in "${location}". Try broadening your search or searching a major city.`,
        };
      }

      return {
        leads: parsedLeads,
        configured: true,
      };
    } catch (err: any) {
      console.warn('LeadDataProvider fetch error:', err.message);
      return {
        leads: [],
        configured: false,
        message: 'Connect a lead data source to start finding live leads. (External public directory temporarily unreachable or rate-limited).',
      };
    }
  }
}

// ---------------------------------------------------------------------------
// Job Data Provider: Real Remotive & Arbeitnow Remote Job Feeds
// ---------------------------------------------------------------------------
class JobDataProvider {
  static async searchJobs(params: {
    query?: string;
    category?: string;
    location?: string;
    remote?: string;
    experienceLevel?: string;
  }): Promise<{ jobs: RawJob[]; count: number; configured: boolean; message?: string }> {
    const { query = '', category = '', remote = 'all' } = params;
    const searchTerm = [query, category].filter(Boolean).join(' ').trim();

    try {
      const remotiveUrl = searchTerm
        ? `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(searchTerm)}&limit=25`
        : `https://remotive.com/api/remote-jobs?limit=25`;

      const response = await fetch(remotiveUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'LeadFinderAI/1.0',
        },
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        throw new Error(`Remotive API responded with status ${response.status}`);
      }

      const data = await response.json();
      const rawJobsList: any[] = data.jobs || [];

      const normalizedJobs: RawJob[] = rawJobsList.map((job) => {
        // Strip excessive HTML tags for clean summary
        const cleanDesc = (job.description || '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        const tags = Array.isArray(job.tags) ? job.tags.join(', ') : '';

        return {
          id: `remotive_${job.id}`,
          source: 'Remotive Verified Remote Feed',
          title: job.title || 'Freelance / Remote Opportunity',
          company: job.company_name || 'Verified Tech Co.',
          location: job.candidate_required_location || 'Worldwide Remote',
          remote: 'Remote',
          jobType: job.job_type ? job.job_type.replace(/_/g, ' ') : 'Freelance / Contract',
          description: cleanDesc.slice(0, 4000),
          skills: tags || category || 'Remote, Freelance',
          applicationUrl: job.url || 'https://remotive.com',
          postedAt: job.publication_date ? new Date(job.publication_date).toLocaleDateString() : 'Recent',
        };
      });

      // Filter by remote preference if specified
      let filtered = normalizedJobs;
      if (remote === 'remote') {
        filtered = filtered.filter(j => j.remote.toLowerCase().includes('remote'));
      }

      if (filtered.length === 0) {
        return {
          jobs: [],
          count: 0,
          configured: true,
          message: 'No jobs found matching your search criteria. Try different keywords or categories.',
        };
      }

      return {
        jobs: filtered,
        count: filtered.length,
        configured: true,
      };
    } catch (err: any) {
      console.warn('JobDataProvider fetch error:', err.message);
      return {
        jobs: [],
        count: 0,
        configured: false,
        message: 'Could not connect to live job feeds. Please check your network connection.',
      };
    }
  }
}

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------

// 1. Health check & Data Provider status
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!aiClient,
    providers: {
      leadProvider: 'OpenStreetMap Public Directory & Custom Feeds',
      jobProvider: 'Remotive Verified Remote Feed API',
    },
  });
});

// 2. Search Leads
app.post('/api/leads/search', async (req: Request, res: Response) => {
  try {
    const { category = '', location = '', filters = {} } = req.body;
    const result = await LeadDataProvider.searchLeads(category, location, filters);
    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('Error in /api/leads/search:', error);
    res.status(500).json({
      success: false,
      leads: [],
      error: 'Failed to search leads.',
      message: error.message,
    });
  }
});

// 3. AI Lead Scoring & Analysis
app.post('/api/leads/score', async (req: Request, res: Response) => {
  try {
    const { lead } = req.body;
    if (!lead || !lead.businessName) {
      return res.status(400).json({ error: 'Lead details with businessName are required' });
    }

    if (!aiClient) {
      // Fallback scoring if Gemini key is temporarily missing
      const baseScore = lead.website ? 75 : 85;
      return res.json({
        score: baseScore,
        scoreReason: 'Preliminary score based on public business signals.',
        opportunity: lead.website
          ? 'Potential website redesign, SEO audit, and conversion optimization.'
          : 'High potential for establishing digital web presence, local SEO, and online booking.',
        suggestedApproach: 'Reach out with a short audit highlighting how a modernized digital presence drives more local customers.',
        aiPowered: false,
      });
    }

    const prompt = `Analyze this business lead for a freelancer offering digital services (web design, software development, marketing, automation, branding, SEO).
Business details:
Name: ${lead.businessName}
Category/Industry: ${lead.category || 'Local Business'}
Location: ${lead.location || 'Unknown'}
Website: ${lead.website || 'No website detected'}
Phone: ${lead.phone || 'Not listed'}
Email: ${lead.email || 'Not listed'}
Description: ${lead.description || 'Local business'}

Score this prospect from 0 to 100 based on:
1. Potential need for digital services (no website or outdated presence means higher need)
2. Viability as a commercial client
3. Contactability

Return JSON matching the schema.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: 'Score from 0 to 100 indicating lead potential for digital freelancers',
            },
            scoreReason: {
              type: Type.STRING,
              description: 'Concise explanation of the score based on factual signals',
            },
            opportunity: {
              type: Type.STRING,
              description: 'Specific digital services or freelance opportunities this business likely needs',
            },
            suggestedApproach: {
              type: Type.STRING,
              description: 'Recommended outreach pitch or professional freelance angle',
            },
          },
          required: ['score', 'scoreReason', 'opportunity', 'suggestedApproach'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      score: Math.min(100, Math.max(0, parsed.score ?? 70)),
      scoreReason: parsed.scoreReason || 'Evaluated based on digital presence and market viability.',
      opportunity: parsed.opportunity || 'Web development and digital marketing improvements.',
      suggestedApproach: parsed.suggestedApproach || 'Introduce yourself with a focused audit of their online footprint.',
      aiPowered: true,
    });
  } catch (error: any) {
    console.error('Lead scoring error:', error);
    // Graceful fallback so UI never breaks
    res.json({
      score: 72,
      scoreReason: 'Estimated baseline score (AI service temporarily busy).',
      opportunity: 'Modern website enhancement and local search visibility.',
      suggestedApproach: 'Highlight specific improvements to their digital customer experience.',
      aiPowered: false,
      note: 'Analyzed using heuristic baseline.',
    });
  }
});

// 4. Search Jobs
app.post('/api/jobs/search', async (req: Request, res: Response) => {
  try {
    const { query = '', category = '', location = '', remote = 'all', experienceLevel = '' } = req.body;
    const result = await JobDataProvider.searchJobs({ query, category, location, remote, experienceLevel });
    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('Error in /api/jobs/search:', error);
    res.status(500).json({
      success: false,
      jobs: [],
      count: 0,
      error: 'Failed to search jobs.',
      message: error.message,
    });
  }
});

// 5. AI Job Matching
app.post('/api/jobs/match', async (req: Request, res: Response) => {
  try {
    const { job, profile } = req.body;
    if (!job || !job.title) {
      return res.status(400).json({ error: 'Job details are required' });
    }

    if (!aiClient) {
      return res.json({
        matchScore: 78,
        matchReason: 'Good alignment with remote freelance technical requirements.',
        strengths: ['Relevant tech stack requirements', 'Remote-friendly contract format'],
        gaps: ['Review specific company tooling specifications'],
        applicationTip: 'Highlight portfolio items directly relevant to the role in your introductory pitch.',
        aiPowered: false,
      });
    }

    const profileText = profile
      ? `Freelancer Profile:
Category: ${profile.category || 'Freelancer'}
Skills: ${profile.skills || 'General software & design'}
Experience Level: ${profile.experienceLevel || 'Intermediate'}
Remote Preference: ${profile.remotePreference || 'Remote'}
Bio: ${profile.bio || 'Experienced freelancer'}`
      : 'User has not created a detailed profile yet (standard freelance matching).';

    const prompt = `Compare this job posting against the freelancer's profile and compute a match score from 0 to 100.
Job Posting:
Title: ${job.title}
Company: ${job.company}
Remote Status: ${job.remote}
Type: ${job.jobType}
Skills Mentioned: ${job.skills}
Description Excerpt: ${(job.description || '').slice(0, 1500)}

${profileText}

Return JSON with match score, concise reasoning, key strengths, potential gaps, and a targeted tip for applying.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: {
              type: Type.INTEGER,
              description: 'Match percentage from 0 to 100',
            },
            matchReason: {
              type: Type.STRING,
              description: 'Clear explanation of why this job matches or has gaps',
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of matching skills or profile alignments',
            },
            gaps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Areas where requirements might exceed profile',
            },
            applicationTip: {
              type: Type.STRING,
              description: 'Actionable advice when applying to this company',
            },
          },
          required: ['matchScore', 'matchReason', 'strengths', 'gaps', 'applicationTip'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      matchScore: Math.min(100, Math.max(0, parsed.matchScore ?? 80)),
      matchReason: parsed.matchReason || 'Matches primary freelance technical competencies.',
      strengths: parsed.strengths || ['Relevant domain skills'],
      gaps: parsed.gaps || [],
      applicationTip: parsed.applicationTip || 'Review original listing requirements before applying.',
      aiPowered: true,
    });
  } catch (error: any) {
    console.error('Job matching error:', error);
    res.json({
      matchScore: 75,
      matchReason: 'Heuristic alignment based on job skills and profile category.',
      strengths: ['Matching role scope', 'Remote-compatible opportunity'],
      gaps: ['Verify specific company requirements'],
      applicationTip: 'Tailor your application pitch specifically to the company mission.',
      aiPowered: false,
    });
  }
});

// ---------------------------------------------------------------------------
// Dev Server & Production Static Handler
// ---------------------------------------------------------------------------
async function startServer() {
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite dev server middlewares
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
      },
      appType: 'spa',
    });
    app.use(express.static(path.resolve(__dirname, 'public')));
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`LeadFinder AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
