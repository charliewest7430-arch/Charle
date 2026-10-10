import React from 'react';
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Sparkles,
  Building2,
  Lightbulb,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { Lead } from '../../types';
import { Modal } from '../common/Modal';
import { ScoreBadge } from '../common/ScoreBadge';

interface LeadDetailsModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave: (lead: Lead) => void;
}

export const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({
  lead,
  isOpen,
  onClose,
  isSaved = false,
  onToggleSave,
}) => {
  if (!lead) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-cyan-400" />
          <span className="truncate max-w-[320px] sm:max-w-md">{lead.businessName}</span>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-6 text-slate-200">
        {/* Header Details */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/40">
                {lead.category}
              </span>
              <span className="text-xs text-slate-300 font-medium">Source: {lead.source}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{lead.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ScoreBadge score={lead.score} size="lg" label="AI Lead Score" />
            <button
              onClick={() => onToggleSave(lead)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSaved
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 fill-cyan-400" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save Lead</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Business Overview */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Business Overview
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {lead.description || 'Public registered business entity.'}
          </p>
        </div>

        {/* AI Analysis Cards */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Gemini AI Lead Intelligence
            </h4>
          </div>

          {/* Reasoning */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Why this could be a good prospect:
            </span>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {lead.scoreReason ||
                'Local commercial enterprise with potential for digital presence and online customer acquisition modernization.'}
            </p>
          </div>

          {/* Opportunity */}
          {lead.opportunity && (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
                Identified Digital Services Opportunities:
              </span>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">{lead.opportunity}</p>
            </div>
          )}

          {/* Suggested Outreach Approach */}
          {lead.suggestedApproach && (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-amber-400" />
                Suggested Freelancer Approach:
              </span>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">{lead.suggestedApproach}</p>
            </div>
          )}
        </div>

        {/* Verified Contact Channels */}
        <div className="pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            Public Contact Channels (Strictly Verified)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="overflow-hidden">
                <div className="text-[10px] text-slate-300 font-medium">Website</div>
                {lead.website ? (
                  <span className="font-semibold text-slate-200 truncate block">
                    {lead.website}
                  </span>
                ) : (
                  <span className="text-amber-400 italic">No website registered</span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="overflow-hidden">
                <div className="text-[10px] text-slate-300 font-medium">Phone</div>
                <span className="font-semibold text-slate-200 truncate block">
                  {lead.phone || 'Not publicly listed'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2.5 sm:col-span-2">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="overflow-hidden">
                <div className="text-[10px] text-slate-300 font-medium">Email</div>
                <span className="font-semibold text-slate-200 truncate block">
                  {lead.email || 'Not published in open directory'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Close
          </button>

          {lead.website && (
            <a
              href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition-all"
            >
              <span>Visit Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
};
