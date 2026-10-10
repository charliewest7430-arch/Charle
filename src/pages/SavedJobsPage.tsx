import React, { useState } from 'react';
import {
  BriefcaseBusiness,
  Building,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
  ArrowRight,
  Briefcase,
} from 'lucide-react';
import { SavedJob, Job } from '../types';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { JobDetailsModal } from '../components/jobs/JobDetailsModal';

interface SavedJobsPageProps {
  savedJobs: SavedJob[];
  onRemoveSavedJob: (jobId: string) => void;
  onNavigate: (page: string) => void;
}

export const SavedJobsPage: React.FC<SavedJobsPageProps> = ({
  savedJobs,
  onRemoveSavedJob,
  onNavigate,
}) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleOpenJob = (saved: SavedJob) => {
    const job: Job = {
      id: saved.jobId,
      source: 'Saved Jobs',
      title: saved.title,
      company: saved.company,
      location: saved.location,
      remote: saved.remote,
      jobType: saved.jobType,
      description: saved.description,
      skills: saved.skills,
      applicationUrl: saved.applicationUrl,
      postedAt: saved.postedAt,
      matchScore: saved.matchScore,
      matchReason: saved.matchReason,
    };
    setSelectedJob(job);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/50">
              <BriefcaseBusiness className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white">Saved Jobs</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
              {savedJobs.length} Bookmarked
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Your private collection of verified remote jobs and freelance contracts in Cloud Firestore.
          </p>
        </div>

        <button
          onClick={() => onNavigate('jobs')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/60 text-xs font-semibold transition-colors"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Find More Jobs</span>
        </button>
      </div>

      {/* Jobs List */}
      {savedJobs.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4 max-w-xl mx-auto">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Saved Jobs Yet</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            When you discover matching remote or contract opportunities in the Job Finder, bookmark them to track and apply at your own pace.
          </p>
          <button
            onClick={() => onNavigate('jobs')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all"
          >
            <Briefcase className="w-4 h-4" />
            <span>Search Remote Jobs</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map((saved) => (
            <div
              key={saved.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                      {saved.remote}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300">
                      {saved.jobType}
                    </span>
                    <ScoreBadge score={saved.matchScore} label="Match" />
                  </div>

                  <button
                    onClick={() => onRemoveSavedJob(saved.jobId)}
                    title="Remove from saved jobs"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{saved.title}</h3>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 flex-wrap">
                  <div className="flex items-center gap-1 text-slate-300 font-semibold">
                    <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{saved.company}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{saved.location}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {saved.description || 'Verified remote posting.'}
                </p>

                {saved.matchReason && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 italic">
                    "{saved.matchReason}"
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <a
                  href={saved.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  <span>Apply on Company Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => handleOpenJob(saved)}
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
      <JobDetailsModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        isSaved={true}
        onToggleSave={() => {
          if (selectedJob) {
            onRemoveSavedJob(selectedJob.id);
            setSelectedJob(null);
          }
        }}
      />
    </div>
  );
};
