import React from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  showPlaceholder?: boolean;
}

/**
 * Reusable advertising container component designed for future integration
 * with Google AdSense, Monetag, or HilltopAds.
 * In MVP, renders a discreet container ready for script injection without intrusive popups.
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  slotId = 'default-slot',
  format = 'horizontal',
  className = '',
  showPlaceholder = false,
}) => {
  // Configured to be non-intrusive; renders empty container unless showPlaceholder is on for dev
  if (!showPlaceholder) {
    return (
      <div
        id={`ad-container-${slotId}`}
        data-ad-slot={slotId}
        data-ad-format={format}
        className={`ad-slot-ready ${className}`}
        aria-hidden="true"
      />
    );
  }

  const heightClass =
    format === 'horizontal' ? 'h-20' : format === 'rectangle' ? 'h-64' : 'h-96';

  return (
    <div
      id={`ad-container-${slotId}`}
      className={`w-full ${heightClass} rounded-xl border border-dashed border-slate-700/60 bg-slate-900/40 p-3 flex flex-col items-center justify-center text-xs text-slate-300 ${className}`}
    >
      <span className="font-semibold tracking-wider uppercase text-[10px] text-slate-300">
        Advertisement Slot
      </span>
      <span className="text-[11px] mt-0.5 text-slate-300 font-medium">Ready for AdSense / Monetag / HilltopAds</span>
    </div>
  );
};
