import React, { useState } from 'react';
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Building2,
  Loader2,
} from 'lucide-react';
import { Lead } from '../../types';
import { ScoreBadge } from '../common/ScoreBadge';

interface LeadCardProps {
  lead: Lead;
  isSaved?: boolean;
  onToggleSave: (lead: Lead) => void;
  onViewDetails: (lead: Lead) => void;
  onScoreWithAI?: (lead: Lead) => Promise<void>;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  isSaved = false,
  onToggleSave,
  onViewDetails,
  onScoreWithAI,
}) => {
  const [isScoring, setIsScoring] = useState(false);

  const handleScore = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onScoreWithAI || isScoring) return;
    setIsScoring(true);
    try {
      await onScoreWithAI(lead);
    } finally {
      setIsScoring(false);
    }
  };

  return (
    <div className="group relative rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 p-5 shadow-lg hover:shadow-cyan-500/5 transition-all flex flex-col justify-between">
      <div>
        {/* Top Header: Category and Score */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
              {lead.category}
            </span>
            <ScoreBadge score={lead.score} label="Lead Score" />
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(lead);
            }}
            title={isSaved ? 'Remove from saved leads' : 'Save lead'}
            className={`p-2 rounded-xl transition-all ${
              isSaved
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 fill-cyan-400" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Business Name */}
        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1">
          {lead.businessName}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-3">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{lead.location}</span>
        </div>

        {/* Description / Summary */}
        <p className="text-sm text-slate-300 line-clamp-2 mb-4 leading-relaxed font-normal">
          {lead.description || 'Public registered business entity.'}
        </p>

        {/* AI Analysis Reason if available */}
        {lead.scoreReason && (
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-cyan-300 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Evaluation</span>
            </div>
            <p className="text-slate-300 leading-relaxed italic">"{lead.scoreReason}"</p>
          </div>
        )}

        {/* Contact Badges (Only legitimate data) */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
          {lead.website ? (
            <a
              href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
            >
              <Globe className="w-3 h-3 text-cyan-400" />
              <span className="truncate max-w-[140px]">Website</span>
              <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-60" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/30 text-amber-300 border border-amber-800/30">
              <Globe className="w-3 h-3 text-amber-400" />
              <span>No website listed (High Need)</span>
            </span>
          )}

          {lead.phone && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{lead.phone}</span>
            </span>
          )}

          {lead.email && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700">
              <Mail className="w-3 h-3 text-blue-400" />
              <span className="truncate max-w-[140px]">{lead.email}</span>
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
        {onScoreWithAI && lead.score === undefined && (
          <button
            onClick={handleScore}
            disabled={isScoring}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-900/60 to-indigo-900/60 hover:from-cyan-800/60 hover:to-indigo-800/60 text-cyan-300 border border-cyan-700/50 transition-colors"
          >
            {isScoring ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Score with AI
              </>
            )}
          </button>
        )}

        <button
          onClick={() => onViewDetails(lead)}
          className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
