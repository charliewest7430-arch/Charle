import React, { useState } from 'react';
import {
  Bookmark,
  Building2,
  Trash2,
  ExternalLink,
  MapPin,
  Sparkles,
  ArrowRight,
  Search,
} from 'lucide-react';
import { SavedLead, Lead } from '../types';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { LeadDetailsModal } from '../components/leads/LeadDetailsModal';

interface SavedLeadsPageProps {
  savedLeads: SavedLead[];
  onRemoveSavedLead: (leadId: string) => void;
  onNavigate: (page: string) => void;
}

export const SavedLeadsPage: React.FC<SavedLeadsPageProps> = ({
  savedLeads,
  onRemoveSavedLead,
  onNavigate,
}) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleOpenLead = (saved: SavedLead) => {
    const lead: Lead = {
      id: saved.leadId,
      source: 'Saved Leads',
      businessName: saved.businessName,
      category: saved.category,
      location: saved.location,
      website: saved.website,
      email: saved.email,
      phone: saved.phone,
      description: saved.description,
      score: saved.score,
      scoreReason: saved.scoreReason,
      opportunity: saved.opportunity,
      suggestedApproach: saved.suggestedApproach,
    };
    setSelectedLead(lead);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              <Bookmark className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white">Saved Leads</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
              {savedLeads.length} Bookmarked
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Your private list of verified business leads stored in Cloud Firestore.
          </p>
        </div>

        <button
          onClick={() => onNavigate('leads')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 text-xs font-semibold transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Find More Leads</span>
        </button>
      </div>

      {/* Leads List */}
      {savedLeads.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4 max-w-xl mx-auto">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Saved Leads Yet</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            When you discover promising commercial leads in the Lead Finder, click the bookmark icon to save them to your private dashboard.
          </p>
          <button
            onClick={() => onNavigate('leads')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Search Leads Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedLeads.map((saved) => (
            <div
              key={saved.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                      {saved.category}
                    </span>
                    <ScoreBadge score={saved.score} label="AI Score" />
                  </div>

                  <button
                    onClick={() => onRemoveSavedLead(saved.leadId)}
                    title="Remove from saved leads"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{saved.businessName}</h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{saved.location}</span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {saved.description || 'Public registered business entity.'}
                </p>

                {saved.scoreReason && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 italic">
                    "{saved.scoreReason}"
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                {saved.website ? (
                  <a
                    href={saved.website.startsWith('http') ? saved.website : `https://${saved.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-500 italic">No website listed</span>
                )}

                <button
                  onClick={() => handleOpenLead(saved)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details modal */}
      <LeadDetailsModal
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        isSaved={true}
        onToggleSave={() => {
          if (selectedLead) {
            onRemoveSavedLead(selectedLead.id);
            setSelectedLead(null);
          }
        }}
      />
    </div>
  );
};
