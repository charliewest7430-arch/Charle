import React from 'react';
import {
  LayoutDashboard,
  Search,
  Briefcase,
  Bookmark,
  BriefcaseBusiness,
  User,
  Database,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  savedLeadsCount?: number;
  savedJobsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  savedLeadsCount = 0,
  savedJobsCount = 0,
}) => {
  const { user } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Lead Finder', icon: Search, badge: 'AI' },
    { id: 'jobs', label: 'Job Finder', icon: Briefcase, badge: 'Live' },
    {
      id: 'saved-leads',
      label: 'Saved Leads',
      icon: Bookmark,
      count: savedLeadsCount,
    },
    {
      id: 'saved-jobs',
      label: 'Saved Jobs',
      icon: BriefcaseBusiness,
      count: savedJobsCount,
    },
    { id: 'profile', label: 'Freelancer Profile', icon: User },
    { id: 'sources', label: 'Data Sources & Feeds', icon: Database },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-slate-800 bg-slate-950 p-4 min-h-[calc(100vh-4rem)]">
      {/* Platform banner */}
      <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/30">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
            Free Freelance Hub
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          Zero subscriptions. Powered by Gemini AI scoring & verified live feeds.
        </p>
      </div>

      {/* Main Nav */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/70 to-indigo-950/70 text-cyan-300 border border-cyan-800/50 shadow-xs'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                    {item.badge}
                  </span>
                )}
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                    {item.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 mt-auto">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Real feeds only. No fabricated leads or fake jobs.</span>
        </div>
      </div>
    </aside>
  );
};
