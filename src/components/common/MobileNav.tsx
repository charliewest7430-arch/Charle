import React from 'react';
import {
  LayoutDashboard,
  Search,
  Briefcase,
  Bookmark,
  User,
} from 'lucide-react';

interface MobileNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  savedTotalCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentPage,
  onNavigate,
  savedTotalCount = 0,
}) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Search },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'saved-leads', label: 'Saved', icon: Bookmark, badge: savedTotalCount > 0 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || (item.id === 'saved-leads' && currentPage === 'saved-jobs');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl relative transition-colors ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
