import React, { useState, useEffect } from 'react';
import { ExternalLink, Receipt, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'invoiceflow_dashboard_card_dismissed';

export const InvoiceFlowDashboardCard: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState<boolean>(true); // start hidden until mounted to avoid layout flash

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed !== 'true') {
        setIsDismissed(false);
      }
    } catch {
      // In case localStorage is blocked in iframe/sandbox
      setIsDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore storage errors
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 p-5 shadow-lg transition-all">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left side: Icon & Text content */}
        <div className="flex items-start gap-3.5 pr-8 sm:pr-0">
          <div className="p-2.5 rounded-xl bg-indigo-950/90 border border-indigo-700/50 text-indigo-400 shrink-0 mt-0.5">
            <Receipt className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Ready to Invoice Your Clients?
              </h3>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                Featured Partner
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Create professional invoices and manage your business billing with InvoiceFlow AI.
            </p>
          </div>
        </div>

        {/* Right side: Action Button & Dismiss */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0">
          <a
            href="https://invoiceflowai.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Discover InvoiceFlow</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            aria-label="Dismiss promotional card"
            title="Dismiss this notice"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
