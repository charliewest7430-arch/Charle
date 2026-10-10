import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  Filter,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Bookmark,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';
import { Job } from '../types';
import { useAuth } from '../context/AuthContext';
import { JobCard } from '../components/jobs/JobCard';
import { JobDetailsModal } from '../components/jobs/JobDetailsModal';
import { BannerAd } from '../components/ads/BannerAd';

interface JobFinderPageProps {
  onToggleSaveJob: (job: Job) => void;
  savedJobIds: Set<string>;
}

export const JobFinderPage: React.FC<JobFinderPageProps> = ({
  onToggleSaveJob,
  savedJobIds,
}) => {
  const { freelancerProfile } = useAuth();

  const [query, setQuery] = useState('React Developer');
  const [category, setCategory] = useState('');
  const [remote, setRemote] = useState('all');
  const [experienceLevel, setExperienceLevel] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const keywordPresets = [
    'Frontend Developer',
    'React Developer',
    'WordPress Developer',
    'Graphic Designer',
    'UI/UX Designer',
    'Web Designer',
    'Software Developer',
    'Virtual Assistant',
  ];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setLoading(true);
    setError(null);
    setInfoMessage(null);
    setHasSearched(true);

    try {
      const response = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          category,
          remote,
          experienceLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to search verified job feeds');
      }

      const fetchedJobs: Job[] = data.jobs || [];
      setJobs(fetchedJobs);

      if (data.message) {
        setInfoMessage(data.message);
      }

      // Automatically evaluate AI match score for top jobs
      if (fetchedJobs.length > 0) {
        matchJobsBatch(fetchedJobs.slice(0, 5));
      }
    } catch (err: any) {
      console.error('Job search error:', err);
      setError(err.message || 'Something went wrong searching jobs. Please try again.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Evaluate AI Match score with Gemini
  const matchJobWithAI = async (jobToMatch: Job) => {
    try {
      const res = await fetch('/api/jobs/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job: jobToMatch,
          profile: freelancerProfile,
        }),
      });
      const data = await res.json();

      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobToMatch.id
            ? {
                ...j,
                matchScore: data.matchScore,
                matchReason: data.matchReason,
                strengths: data.strengths,
                gaps: data.gaps,
                applicationTip: data.applicationTip,
                aiPowered: data.aiPowered,
              }
            : j
        )
      );

      if (selectedJob && selectedJob.id === jobToMatch.id) {
        setSelectedJob((prev) => (prev ? { ...prev, ...data } : null));
      }
    } catch (err) {
      console.error('Failed to match job:', err);
    }
  };

  const matchJobsBatch = async (batch: Job[]) => {
    for (const job of batch) {
      if (job.matchScore === undefined) {
        await matchJobWithAI(job);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/50">
            <Briefcase className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Job Finder</h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
            100% Free
          </span>
        </div>
        <p className="text-sm text-slate-400">
          Discover verified remote and freelance opportunities. Gemini calculates AI Match Scores against your skills profile.
        </p>
      </div>

      {/* Search Interface */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Job Title / Keyword */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Job Title or Keyword
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Frontend Developer, UI Designer, WordPress"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Category / Discipline */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category (Optional)
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Software Development, Design, Writing"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Keyword presets */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-slate-400 font-semibold mr-1">Popular roles:</span>
            {keywordPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setQuery(preset)}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  query.toLowerCase() === preset.toLowerCase()
                    ? 'bg-indigo-950 text-indigo-300 border-indigo-700/60 font-semibold'
                    : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              <span>{showFilters ? 'Hide Advanced Filters' : 'Filter by Remote & Experience'}</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Fetching Verified Feeds...</span>
                </>
              ) : (
                <>
                  <Briefcase className="w-4 h-4" />
                  <span>Find Jobs</span>
                </>
              )}
            </button>
          </div>

          {/* Filters Area */}
          {showFilters && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Workplace Preference</label>
                <select
                  value={remote}
                  onChange={(e) => setRemote(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="all">All Workplace Formats</option>
                  <option value="remote">Remote Only</option>
                  <option value="hybrid">Hybrid / Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="all">All Experience Tiers</option>
                  <option value="junior">Entry / Junior</option>
                  <option value="mid">Mid-Level</option>
                  <option value="senior">Senior / Lead</option>
                </select>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {infoMessage && !error && (
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>{infoMessage}</span>
        </div>
      )}

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">
              {hasSearched ? `Jobs Found (${jobs.length})` : 'Browse Verified Job Feeds'}
            </h2>
            {jobs.length > 0 && (
              <span className="text-xs text-slate-400">• Verified remote postings</span>
            )}
          </div>

          {jobs.length > 0 && (
            <button
              onClick={() => matchJobsBatch(jobs)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Match All with AI Profile</span>
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse space-y-3"
              >
                <div className="h-4 bg-slate-800 rounded w-1/4" />
                <div className="h-6 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded w-1/3" />
                <div className="h-12 bg-slate-950 rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && hasSearched && jobs.length === 0 && (
          <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4 max-w-xl mx-auto">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No jobs found</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              No jobs found. Try changing your search filters or searching broad keywords like "React", "Frontend", or "Design".
            </p>
          </div>
        )}

        {/* Initial empty state */}
        {!loading && !hasSearched && (
          <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3 max-w-xl mx-auto">
            <Briefcase className="w-10 h-10 text-indigo-500/60 mx-auto" />
            <h3 className="text-lg font-bold text-white">Find Your Next Remote Contract</h3>
            <p className="text-sm text-slate-300 font-medium">
              Click Find Jobs or enter a title to query verified public feeds with real company apply links.
            </p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={savedJobIds.has(job.id)}
                onToggleSave={onToggleSaveJob}
                onViewDetails={(j) => setSelectedJob(j)}
                onMatchWithAI={matchJobWithAI}
              />
            ))}
          </div>
        )}
      </div>

      {/* Banner Ad Placeholder */}
      <BannerAd position="bottom" showPlaceholder={false} />

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        isSaved={selectedJob ? savedJobIds.has(selectedJob.id) : false}
        onToggleSave={onToggleSaveJob}
      />
    </div>
  );
};
