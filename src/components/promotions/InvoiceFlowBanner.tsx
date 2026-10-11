import React from 'react';
import { ExternalLink, Receipt, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const InvoiceFlowBanner: React.FC = () => {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 shadow-2xl p-6 sm:p-8 md:p-10">
          {/* Subtle decorative glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/90 text-indigo-300 border border-indigo-700/50 shadow-sm">
                <Receipt className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next-Gen Invoicing Suite</span>
                <span className="w-1 h-1 rounded-full bg-indigo-400" />
                <span className="text-cyan-300">InvoiceFlow AI</span>
              </div>

              {/* Heading */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Found Your Next Client? <span className="bg-gradient-to-r from-indigo-300 via-cyan-300 to-white bg-clip-text text-transparent">Get Paid Professionally.</span>
              </h2>

              {/* Description */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Manage invoices, track payments, organize clients, and simplify your billing with InvoiceFlow AI.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Automated Payment Tracking</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Branded Invoices & PDF Export</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Client Financial Ledger</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
              <a
                href="https://invoiceflowai.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-400 hover:via-indigo-500 hover:to-cyan-400 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore InvoiceFlow AI</span>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </a>
              <span className="text-[11px] text-slate-400 text-center lg:text-right">
                Seamless cloud invoicing for freelancers & agencies
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
