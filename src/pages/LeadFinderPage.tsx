import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Filter,
  Sparkles,
  Building2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Bookmark,
  RefreshCw,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { Lead } from '../types';
import { LeadCard } from '../components/leads/LeadCard';
import { LeadDetailsModal } from '../components/leads/LeadDetailsModal';
import { BannerAd } from '../components/ads/BannerAd';

interface LeadFinderPageProps {
  onToggleSaveLead: (lead: Lead) => void;
  savedLeadIds: Set<string>;
}

export const LeadFinderPage: React.FC<LeadFinderPageProps> = ({
  onToggleSaveLead,
  savedLeadIds,
}) => {
  const [category, setCategory] = useState('Roofing company');
  const [location, setLocation] = useState('Houston, Texas');
  const [hasWebsite, setHasWebsite] = useState(false);
  const [hasPhone, setHasPhone] = useState(false);
  const [hasEmail, setHasEmail] = useState(false);
  const [smallBusinessOnly, setSmallBusinessOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Selected lead for detail modal
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const categoryPresets = [
    'Roofing company',
    'Restaurant',
    'Barber',
    'Cleaning company',
    'Plumber',
    'Electrician',
    'Dentist',
    'Gym',
    'Real estate agency',
    'Lawyer',
    'Photographer',
    'Construction company',
  ];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!category.trim() && !location.trim()) {
      setError('Please provide a business category or location to search.');
      return;
    }

    setLoading(true);
    setError(null);
    setInfoMessage(null);
    setHasSearched(true);

    try {
      const response = await fetch('/api/leads/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          location,
          filters: {
            hasWebsite,
            hasPhone,
            hasEmail,
            smallBusiness: smallBusinessOnly,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch leads from directory');
      }

      const fetchedLeads: Lead[] = data.leads || [];
      setLeads(fetchedLeads);

      if (data.message) {
        setInfoMessage(data.message);
      }

      // Automatically trigger AI scoring for top leads in the background
      if (fetchedLeads.length > 0) {
        scoreLeadsBatch(fetchedLeads.slice(0, 5));
      }
    } catch (err: any) {
      console.error('Lead search error:', err);
      setError(err.message || 'Something went wrong searching leads. Please try again.');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  // Score individual or batch of leads with Gemini AI
  const scoreLeadWithAI = async (leadToScore: Lead) => {
    try {
      const res = await fetch('/api/leads/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: leadToScore }),
      });
      const data = await res.json();

      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadToScore.id
            ? {
                ...l,
                score: data.score,
                scoreReason: data.scoreReason,
                opportunity: data.opportunity,
                suggestedApproach: data.suggestedApproach,
                aiPowered: data.aiPowered,
              }
            : l
        )
      );

      if (selectedLead && selectedLead.id === leadToScore.id) {
        setSelectedLead((prev) => (prev ? { ...prev, ...data } : null));
      }
    } catch (err) {
      console.error('Failed to score lead:', err);
    }
  };

  const scoreLeadsBatch = async (batch: Lead[]) => {
    for (const lead of batch) {
      if (lead.score === undefined) {
        await scoreLeadWithAI(lead);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
            <Search className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Lead Finder</h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
            100% Free
          </span>
        </div>
        <p className="text-sm text-slate-400">
          Search real commercial businesses by location and category. Gemini analyzes digital signals to score prospect potential.
        </p>
      </div>

      {/* Search Interface */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Business Category / Industry
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Roofing company, Dentist, Barber"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Location Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Location (City, State/Region, Country)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Houston, Texas or London, UK"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-slate-400 font-semibold mr-1">Popular categories:</span>
            {categoryPresets.slice(0, 6).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCategory(preset)}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  category.toLowerCase() === preset.toLowerCase()
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-700/60 font-semibold'
                    : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Filters Toggle & Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showFilters ? 'Hide Advanced Filters' : 'Optional Filters (Website, Contact)'}</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching Directory...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Find Leads</span>
                </>
              )}
            </button>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-3">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasWebsite}
                  onChange={(e) => setHasWebsite(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                />
                <span>Must have website</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPhone}
                  onChange={(e) => setHasPhone(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                />
                <span>Must have phone</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasEmail}
                  onChange={(e) => setHasEmail(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                />
                <span>Must have email</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smallBusinessOnly}
                  onChange={(e) => setSmallBusinessOnly(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                />
                <span>Local commercial focus</span>
              </label>
            </div>
          )}
        </form>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{error}</p>
            <p className="text-slate-400 mt-1">
              Connect a lead data source or try a major metropolitan area (e.g. "Houston, Texas", "Chicago, Illinois", "London, UK").
            </p>
          </div>
        </div>
      )}

      {infoMessage && !error && (
        <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-300 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>{infoMessage}</span>
        </div>
      )}

      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">
              {hasSearched ? `Leads Found (${leads.length})` : 'Search for Live Leads'}
            </h2>
            {leads.length > 0 && (
              <span className="text-xs text-slate-400">
                • Verified public directory records
              </span>
            )}
          </div>

          {leads.length > 0 && (
            <button
              onClick={() => scoreLeadsBatch(leads)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Score All with Gemini</span>
            </button>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse space-y-3"
              >
                <div className="h-4 bg-slate-800 rounded w-1/3" />
                <div className="h-6 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded w-1/2" />
                <div className="h-12 bg-slate-950 rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state after search */}
        {!loading && hasSearched && leads.length === 0 && (
          <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4 max-w-xl mx-auto">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Leads Found</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              No leads found. Try a different industry or location, or connect an external lead data source.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-2 text-xs">
              <button
                onClick={() => {
                  setCategory('Roofing company');
                  setLocation('Houston, Texas');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
              >
                Try "Roofing company in Houston, Texas"
              </button>
              <button
                onClick={() => {
                  setCategory('Restaurant');
                  setLocation('London, UK');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
              >
                Try "Restaurant in London, UK"
              </button>
            </div>
          </div>
        )}

        {/* Initial Empty state */}
        {!loading && !hasSearched && (
          <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3 max-w-xl mx-auto">
            <Search className="w-10 h-10 text-cyan-500/60 mx-auto" />
            <h3 className="text-lg font-bold text-white">Start Your Lead Search</h3>
            <p className="text-sm text-slate-300 font-medium">
              Enter a business category and city above to retrieve live verified businesses and compute Gemini AI Lead Scores.
            </p>
          </div>
        )}

        {/* Leads Grid */}
        {!loading && leads.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                isSaved={savedLeadIds.has(lead.id)}
                onToggleSave={onToggleSaveLead}
                onViewDetails={(l) => setSelectedLead(l)}
                onScoreWithAI={scoreLeadWithAI}
              />
            ))}
          </div>
        )}
      </div>

      {/* Banner Ad Placeholder */}
      <BannerAd position="bottom" showPlaceholder={false} />

      {/* Lead Details Modal */}
      <LeadDetailsModal
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        isSaved={selectedLead ? savedLeadIds.has(selectedLead.id) : false}
        onToggleSave={onToggleSaveLead}
      />
    </div>
  );
};
