import React from 'react';
import { Sparkles, LogOut, User, Compass, Briefcase, Bookmark, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenAuth,
}) => {
  const { user, userAccount, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-600 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                LeadFinder <span className="text-cyan-400">AI</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-700/50">
                100% Free
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Find Clients. Find Jobs. No Subscriptions.</p>
          </div>
        </div>

        {/* Desktop Quick Nav (If logged out) */}
        {!user && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => onNavigate('landing')}
              className={`hover:text-white transition-colors ${currentPage === 'landing' ? 'text-cyan-400 font-semibold' : ''}`}
            >
              Overview
            </button>
            <button
              onClick={() => onNavigate('leads')}
              className={`hover:text-white transition-colors ${currentPage === 'leads' ? 'text-cyan-400 font-semibold' : ''}`}
            >
              Lead Finder
            </button>
            <button
              onClick={() => onNavigate('jobs')}
              className={`hover:text-white transition-colors ${currentPage === 'jobs' ? 'text-cyan-400 font-semibold' : ''}`}
            >
              Job Finder
            </button>
            <button
              onClick={() => onNavigate('sources')}
              className={`hover:text-white transition-colors ${currentPage === 'sources' ? 'text-cyan-400 font-semibold' : ''}`}
            >
              Data Sources
            </button>
            <a
              href="https://uplcm.com/4/12005298"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="hover:text-amber-300 transition-colors flex items-center gap-1 text-amber-400 font-medium"
            >
              <span>Perks</span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold border border-amber-500/30">
                Deals
              </span>
            </a>
          </nav>
        )}

        {/* Auth / Profile Area */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('profile')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-sm font-medium transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold border border-indigo-500/30">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="truncate max-w-[120px]">{user.displayName || user.email?.split('@')[0]}</span>
              </button>

              <button
                onClick={() => logout()}
                title="Log out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-400 hover:to-indigo-500 shadow-md shadow-cyan-500/20 transition-all font-semibold"
              >
                Sign Up Free
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
