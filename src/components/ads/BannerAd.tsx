import React from 'react';
import { AdSlot } from './AdSlot';

interface BannerAdProps {
  position?: 'top' | 'bottom' | 'in-feed';
  className?: string;
  showPlaceholder?: boolean;
}

/**
 * Reusable BannerAd component for placement above or below content streams.
 */
export const BannerAd: React.FC<BannerAdProps> = ({
  position = 'in-feed',
  className = '',
  showPlaceholder = false,
}) => {
  return (
    <div className={`my-4 w-full flex justify-center ${className}`}>
      <AdSlot
        slotId={`banner-${position}`}
        format="horizontal"
        showPlaceholder={showPlaceholder}
        className="max-w-4xl"
      />
    </div>
  );
};
