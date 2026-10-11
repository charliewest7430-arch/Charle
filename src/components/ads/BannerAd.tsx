import React from 'react';
import { ExternalLink, Sparkles, Gift } from 'lucide-react';

export const MONETAG_DIRECT_LINK = 'https://uplcm.com/4/12005298';

interface BannerAdProps {
  position?: 'top' | 'bottom' | 'in-feed';
  className?: string;
  showPlaceholder?: boolean;
}

/**
 * Reusable Sponsored Partner Banner linking to the Monetag Direct Link.
 */
export const BannerAd: React.FC<BannerAdProps> = ({
  position = 'in-feed',
  className = '',
}) => {
  return (
    <div className={`my-4 w-full flex justify-center ${className}`}>
      <a
        href={MONETAG_DIRECT_LINK}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="w-full max-w-4xl p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/70 border border-indigo-500/30 hover:border-indigo-400/60 shadow-lg shadow-indigo-950/20 transition-all flex flex-col sm:flex-row items-center justify-between gap-3 text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
            {position === 'top' ? (
              <Gift className="w-5 h-5 text-indigo-400" />
            ) : (
              <Sparkles className="w-5 h-5 text-indigo-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                Partner Deal
              </span>
              <span className="text-[10px] bg-indigo-900/60 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-700/50 font-medium">
                Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5">
              Top Software, Cloud Tools & Exclusive Offers for Freelancers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 group-hover:text-white shrink-0 bg-indigo-600/30 group-hover:bg-indigo-600/50 px-3.5 py-2 rounded-lg border border-indigo-500/40 transition-colors">
          <span>Explore Offer</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </a>
    </div>
  );
};
