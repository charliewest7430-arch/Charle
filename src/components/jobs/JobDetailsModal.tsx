import React from 'react';
import {
  Briefcase,
  Building,
  MapPin,
  Clock,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { Job } from '../../types';
import { Modal } from '../common/Modal';
import { ScoreBadge } from '../common/ScoreBadge';

interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave: (job: Job) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  isOpen,
  onClose,
  isSaved = false,
  onToggleSave,
}) => {
  if (!job) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-400" />
          <span className="truncate max-w-[320px] sm:max-w-md">{job.title}</span>
        </div>
      }
      maxWidth="3xl"
    >
      <div className="space-y-6 text-slate-200">
        {/* Header Details */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-base font-bold text-white flex items-center gap-1.5">
                <Building className="w-4 h-4 text-indigo-400" />
                {job.company}
              </span>
              <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                {job.remote}
              </span>
              <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {job.jobType}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{job.location}</span>
              </div>
              {job.postedAt && (
                <div className="flex items-center gap-1 text-slate-300 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Posted: {job.postedAt}</span>
                </div>
              )}
              <span className="text-slate-300 font-medium">Source: {job.source}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ScoreBadge score={job.matchScore} size="lg" label="AI Match" />
            <button
              onClick={() => onToggleSave(job)}
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
                  <span>Save Job</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Match Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Gemini AI Compatibility Analysis
            </h4>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
            <div>
              <span className="text-xs font-semibold text-slate-300">Match Assessment:</span>
              <p className="text-sm text-slate-300 leading-relaxed font-normal mt-1">
                {job.matchReason ||
                  'Evaluated against freelance requirements and modern remote tech stacks.'}
              </p>
            </div>

            {/* Strengths & Gaps */}
            {(job.strengths?.length || job.gaps?.length) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {job.strengths && job.strengths.length > 0 && (
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/30 text-xs">
                    <span className="font-semibold text-emerald-300 flex items-center gap-1 mb-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Key Profile Strengths:
                    </span>
                    <ul className="space-y-1 text-slate-300">
                      {job.strengths.map((s, idx) => (
                        <li key={idx}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.gaps && job.gaps.length > 0 && (
                  <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/30 text-xs">
                    <span className="font-semibold text-amber-300 flex items-center gap-1 mb-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      Considerations:
                    </span>
                    <ul className="space-y-1 text-slate-300">
                      {job.gaps.map((g, idx) => (
                        <li key={idx}>• {g}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}

            {job.applicationTip && (
              <div className="pt-2 text-xs flex items-start gap-2 text-cyan-300 bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-800/30">
                <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Pitch Strategy: </span>
                  <span className="text-slate-300">{job.applicationTip}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Skills & Technologies */}
        {job.skills && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Key Skills & Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {job.skills.split(',').map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Full Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Job Description & Requirements
          </h4>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 max-h-72 overflow-y-auto text-sm text-slate-300 whitespace-pre-line leading-relaxed font-normal">
            {job.description}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-300 font-medium">
            Legitimate verified application URL via {job.company}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Close
            </button>

            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all"
            >
              <span>Apply on Company Site</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};
