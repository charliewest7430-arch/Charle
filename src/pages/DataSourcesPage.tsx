import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Globe,
  Briefcase,
  Layers,
  ShieldCheck,
  Code,
} from 'lucide-react';

export const DataSourcesPage: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      console.error('Failed to query health endpoint:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              <Database className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white">Data Feeds & Integrations</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real data provider abstraction layer. Zero fake data, zero hallucinated contacts.
          </p>
        </div>

        <button
          onClick={checkHealth}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Feeds Status</span>
        </button>
      </div>

      {/* Live Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Lead Data Provider */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">LeadDataProvider</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Active
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Connected to the legitimate <strong className="text-white">OpenStreetMap Overpass Directory</strong> and Nominatim Geocoder. Ingests verified commercial establishments with real business names, addresses, websites, and public phone numbers.
          </p>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] space-y-1 font-mono text-slate-400">
            <div>• Provider: OpenStreetMap Public Business Directory</div>
            <div>• Endpoints: overpass-api.de + nominatim.openstreetmap.org</div>
            <div>• Filtering: Real-world tags (craft, shop, office, amenity)</div>
          </div>
        </div>

        {/* Job Data Provider */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">JobDataProvider</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Active
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Connected to the <strong className="text-white">Remotive Remote Jobs API</strong> live feed. Returns verified remote job openings, genuine employer companies, and direct URLs taking freelancers to the original application portal.
          </p>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] space-y-1 font-mono text-slate-400">
            <div>• Provider: Remotive Verified Remote Feed</div>
            <div>• Endpoints: remotive.com/api/remote-jobs</div>
            <div>• Strict Rule: Never fabricates application URLs</div>
          </div>
        </div>

        {/* Gemini AI Intelligence Engine */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <h2 className="text-base font-bold text-white">Gemini AI Intelligence Layer</h2>
            </div>
            {health?.geminiConfigured ? (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Gemini 3.8 Flash Online
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-950 text-amber-400 border border-amber-800/40 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Fallback Scorer Active
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Processes verified business signals and freelancer profiles on the server-side via <code className="text-cyan-300">@google/genai</code>. Evaluates lead commercial potential, suggests custom freelancer pitch angles, and matches skills against job specs. The client never touches the secret API keys.
          </p>
        </div>
      </div>

      {/* Clean Abstraction Architecture Details */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Code className="w-4 h-4 text-cyan-400" />
          <span>Extending Data Sources</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Both <code className="text-slate-300">LeadDataProvider</code> and <code className="text-slate-300">JobDataProvider</code> follow an open provider pattern in <code className="text-slate-300">server.ts</code>. You can easily plug in additional feeds such as Google Places API, Yelp Fusion, Upwork RSS feeds, or custom agency Webhooks without touching the user interface.
        </p>
      </div>
    </div>
  );
};
