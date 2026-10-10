import React from 'react';
import { Sparkles } from 'lucide-react';

interface ScoreBadgeProps {
  score?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  label = 'AI Score',
  size = 'md',
  showIcon = true,
}) => {
  if (score === undefined || score === null) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
        {showIcon && <Sparkles className="w-3 h-3 text-slate-300" />}
        Not scored
      </span>
    );
  }

  let colorClasses = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50';
  let dotColor = 'bg-emerald-400';

  if (score < 50) {
    colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
    dotColor = 'bg-slate-300';
  } else if (score < 70) {
    colorClasses = 'bg-amber-950/80 text-amber-300 border-amber-700/50';
    dotColor = 'bg-amber-400';
  } else if (score < 85) {
    colorClasses = 'bg-blue-950/80 text-blue-300 border-blue-700/50';
    dotColor = 'bg-blue-400';
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs'
      : size === 'lg'
      ? 'px-3.5 py-1.5 text-sm font-semibold'
      : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs tracking-tight ${colorClasses} ${sizeClasses}`}
    >
      {showIcon && <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse" />}
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{label}:</span>
      <span className="font-bold">{score}/100</span>
    </span>
  );
};
