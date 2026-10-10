import React, { useState } from 'react';
import {
  Briefcase,
  Building,
  MapPin,
  Clock,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Job } from '../../types';
import { ScoreBadge } from '../common/ScoreBadge';

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  onToggleSave: (job: Job) => void;
  onViewDetails: (job: Job) => void;
  onMatchWithAI?: (job: Job) => Promise<void>;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved = false,
  onToggleSave,
  onViewDetails,
  onMatchWithAI,
}) => {
  const [isMatching, setIsMatching] = useState(false);

  const handleMatch = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onMatchWithAI || isMatching) return;
    setIsMatching(true);
    try {
      await onMatchWithAI(job);
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="group relative rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 p-5 shadow-lg hover:shadow-indigo-500/5 transition-all flex flex-col justify-between">
      <div>
        {/* Top Header: Remote badge and Match Score */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-800/40">
              {job.remote || 'Remote'}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {job.jobType}
            </span>
            <ScoreBadge score={job.matchScore} label="Match Score" />
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(job);
            }}
            title={isSaved ? 'Remove from saved jobs' : 'Save job'}
            className={`p-2 rounded-xl transition-all ${
              isSaved
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 fill-cyan-400" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1">
          {job.title}
        </h3>

        {/* Company and Location */}
        <div className="flex items-center gap-3 text-xs text-slate-300 mb-3 flex-wrap font-medium">
          <div className="flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-semibold text-slate-200">{job.company}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[160px]">{job.location}</span>
          </div>
          {job.postedAt && (
            <div className="flex items-center gap-1 text-slate-300 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{job.postedAt}</span>
            </div>
          )}
        </div>

        {/* Description Excerpt */}
        <p className="text-sm text-slate-300 line-clamp-2 mb-4 leading-relaxed font-normal">
          {job.description || 'Verified remote opportunity.'}
        </p>

        {/* AI Match Explanation */}
        {job.matchReason && (
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-cyan-300 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Fit Analysis</span>
            </div>
            <p className="text-slate-300 leading-relaxed italic">"{job.matchReason}"</p>
          </div>
        )}

        {/* Skills Tags */}
        {job.skills && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.skills
              .split(',')
              .slice(0, 4)
              .map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/70 text-slate-300 border border-slate-700/60"
                >
                  {skill.trim()}
                </span>
              ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
        {onMatchWithAI && job.matchScore === undefined && (
          <button
            onClick={handleMatch}
            disabled={isMatching}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-900/60 to-cyan-900/60 hover:from-indigo-800/60 hover:to-cyan-800/60 text-cyan-300 border border-cyan-700/50 transition-colors"
          >
            {isMatching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Matching...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Analyze Match
              </>
            )}
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <a
            href={job.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
          >
            <span>Apply</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={() => onViewDetails(job)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
