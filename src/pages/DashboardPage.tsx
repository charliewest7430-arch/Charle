import React from 'react';
import {
  Search,
  Briefcase,
  Bookmark,
  BriefcaseBusiness,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Building2,
  MapPin,
  TrendingUp,
  Database,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SavedLead, SavedJob } from '../types';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { BannerAd } from '../components/ads/BannerAd';
import { InvoiceFlowDashboardCard } from '../components/promotions/InvoiceFlowDashboardCard';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  savedLeads: SavedLead[];
  savedJobs: SavedJob[];
  totalLeadsSearchedCount?: number;
  totalJobsSearchedCount?: number;
  onOpenLeadDetails?: (lead: SavedLead) => void;
  onOpenJobDetails?: (job: SavedJob) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  savedLeads,
  savedJobs,
  totalLeadsSearchedCount = 0,
  totalJobsSearchedCount = 0,
  onOpenLeadDetails,
  onOpenJobDetails,
}) => {
  const { user, userAccount, freelancerProfile } = useAuth();

  const displayName =
    user?.displayName || userAccount?.name || user?.email?.split('@')[0] || 'Freelancer';

  const recentSavedLeads = savedLeads.slice(0, 3);
  const recentSavedJobs = savedJobs.slice(0, 3);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome & Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Freelance Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {displayName}!
          </h1>
          <p className="text-sm text-slate-300 font-medium">
            Category:{' '}
            <span className="text-indigo-300 font-semibold">
              {freelancerProfile?.category || 'General Freelancer'}
            </span>{' '}
            • Ready to discover clients and opportunities.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('leads')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-md shadow-cyan-500/20 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Find Leads</span>
          </button>
          <button
            onClick={() => onNavigate('jobs')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all border border-slate-700"
          >
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <span>Find Jobs</span>
          </button>
        </div>
      </div>

      {/* InvoiceFlow AI Promotional Card */}
      <InvoiceFlowDashboardCard />

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Leads Found */}
        <div
          onClick={() => onNavigate('leads')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-700/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-300 mb-3">
            <span className="text-xs font-semibold text-slate-300">Leads Explored</span>
            <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {totalLeadsSearchedCount > 0 ? totalLeadsSearchedCount : 'Live'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Open public directory</p>
        </div>

        {/* Saved Leads */}
        <div
          onClick={() => onNavigate('saved-leads')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-700/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-300 mb-3">
            <span className="text-xs font-semibold text-slate-300">Saved Leads</span>
            <Bookmark className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {savedLeads.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Bookmarked prospects</p>
        </div>

        {/* Jobs Found */}
        <div
          onClick={() => onNavigate('jobs')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-700/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-300 mb-3">
            <span className="text-xs font-semibold text-slate-300">Jobs Available</span>
            <Briefcase className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {totalJobsSearchedCount > 0 ? totalJobsSearchedCount : '25+'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Verified remote feed</p>
        </div>

        {/* Saved Jobs */}
        <div
          onClick={() => onNavigate('saved-jobs')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-700/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-300 mb-3">
            <span className="text-xs font-semibold text-slate-300">Saved Jobs</span>
            <BriefcaseBusiness className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {savedJobs.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active bookmarks</p>
        </div>
      </div>

      {/* Non-intrusive Ad slot placeholder */}
      <BannerAd position="in-feed" showPlaceholder={false} />

      {/* Recent Opportunities Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Saved Leads */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Recent Saved Leads</h2>
            </div>
            {savedLeads.length > 0 && (
              <button
                onClick={() => onNavigate('saved-leads')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>View all ({savedLeads.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {recentSavedLeads.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <Building2 className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-300 font-medium">No saved leads yet.</p>
              <button
                onClick={() => onNavigate('leads')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Local Businesses</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSavedLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => onOpenLeadDetails && onOpenLeadDetails(lead)}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors truncate">
                        {lead.businessName}
                      </span>
                      <ScoreBadge score={lead.score} size="sm" />
                    </div>
                    <div className="text-xs text-slate-300 flex items-center gap-2 truncate font-medium">
                      <span>{lead.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {lead.location}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Saved Jobs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BriefcaseBusiness className="w-4 h-4 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Recent Saved Jobs</h2>
            </div>
            {savedJobs.length > 0 && (
              <button
                onClick={() => onNavigate('saved-jobs')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>View all ({savedJobs.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {recentSavedJobs.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <Briefcase className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-300 font-medium">No saved jobs yet.</p>
              <button
                onClick={() => onNavigate('jobs')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/60 transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Search Remote Jobs</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSavedJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => onOpenJobDetails && onOpenJobDetails(job)}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors truncate">
                        {job.title}
                      </span>
                      <ScoreBadge score={job.matchScore} size="sm" label="Match" />
                    </div>
                    <div className="text-xs text-slate-300 flex items-center gap-2 truncate font-medium">
                      <span>{job.company}</span>
                      <span>•</span>
                      <span className="text-emerald-400">{job.remote}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
