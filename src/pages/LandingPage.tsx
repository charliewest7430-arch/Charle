import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Briefcase,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCircle2,
  Building2,
  TrendingUp,
  Globe,
  ArrowRight,
  Zap,
  Lock,
  Compass,
} from 'lucide-react';
import { BannerAd } from '../components/ads/BannerAd';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { InvoiceFlowBanner } from '../components/promotions/InvoiceFlowBanner';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenAuth,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is LeadFinder AI really 100% free?',
      a: 'Yes, completely free. There are no monthly subscriptions, no paid upgrades, no credit card requirements, and no hidden token fees. The platform is designed to empower freelancers everywhere and will be supported through non-intrusive advertising in the future.',
    },
    {
      q: 'Where do the business leads and jobs come from?',
      a: 'We strictly connect to legitimate, public, permitted data sources such as the OpenStreetMap Public Business Directory and verified remote job board feeds like Remotive. We never invent fake companies, fabricate phone numbers, or generate hallucinated contact details.',
    },
    {
      q: 'How does the Gemini AI scoring work?',
      a: 'Gemini evaluates each business against pragmatic freelance market signals: digital presence, website status, business category, and contact accessibility. For jobs, Gemini compares the verified job requirements against your freelancer skills profile to calculate an AI Match Score.',
    },
    {
      q: 'Can I bookmark and save leads and jobs for later?',
      a: 'Yes! When you create your free account, all saved opportunities are stored privately in your personal Cloud Firestore database, accessible whenever you return.',
    },
  ];

  return (
    <div className="min-h-screen text-slate-100 flex flex-col">
      {/* Top Banner Ad Slot Placeholder */}
      <BannerAd position="top" showPlaceholder={false} />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* 100% Free Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              100% Free
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-medium text-slate-300">
              No Subscriptions. No Paid Plans. No Credits.
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Find Clients. Find Jobs.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Grow Your Freelance Career.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Use AI to discover potential clients and freelance opportunities
            faster — completely free.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('leads')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-cyan-500/25 transition-all group"
            >
              <Search className="w-5 h-5 text-cyan-200 group-hover:scale-110 transition-transform" />
              <span>Find Leads</span>
              <ArrowRight className="w-4 h-4 text-cyan-200" />
            </button>

            <button
              onClick={() => onNavigate('jobs')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-base transition-all"
            >
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <span>Find Jobs</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Real Verified Feeds Only</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Gemini AI Smart Scoring</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-400" />
              <span>Private Firestore Bookmarks</span>
            </div>
          </div>
        </div>
      </section>

      {/* InvoiceFlow AI Promotional Banner */}
      <InvoiceFlowBanner />

      {/* Interactive Feature Previews */}
      <section className="py-16 bg-slate-950/60 border-y border-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Section: AI Lead Finder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-800/50">
                <Search className="w-3.5 h-3.5" />
                Product 1: AI Lead Finder
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Discover Local & Commercial Clients That Need Digital Services
              </h2>
              <p className="text-slate-300 leading-relaxed font-normal">
                Search local businesses by industry and location (e.g. Roofing companies,
                Restaurants, Dental clinics, Gyms). Discover companies lacking modern
                websites or digital marketing and receive immediate AI Opportunity Scoring.
              </p>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Real public business directory integration</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>AI Lead Score from 0 to 100 with actionable outreach angles</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Direct link to legitimate original websites</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('leads')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  <span>Explore Lead Finder</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Lead Card Mockup */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                  Roofing Company
                </span>
                <ScoreBadge score={92} label="AI Lead Score" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Apex Peak Roofing</h3>
                <p className="text-xs text-slate-400 mt-0.5">Houston, Texas • Registered Commercial Business</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Why this is a high-opportunity lead:
                </div>
                <p className="text-slate-300 italic font-medium">
                  "Strong potential lead because the company has an established local client base but lacks a responsive mobile website and online booking form."
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                <span className="text-emerald-400 font-medium">Phone listed • Verified address</span>
                <span className="text-cyan-400 font-medium">Suggested approach included</span>
              </div>
            </div>
          </div>

          {/* Section: AI Job Finder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Interactive Job Card Mockup */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl relative space-y-4 order-2 lg:order-1">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                  100% Remote
                </span>
                <ScoreBadge score={95} label="AI Match Score" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Senior React & TypeScript Developer</h3>
                <p className="text-xs text-slate-400 mt-0.5">CloudScale Labs • Worldwide Remote • Contract</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  AI Compatibility Match:
                </div>
                <p className="text-slate-300 italic font-medium">
                  "Strong 95% match with your profile. The project requires modern TypeScript, Tailwind CSS, and API integrations, aligning directly with your verified skills."
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                <span>Verified Remotive feed listing</span>
                <span className="text-indigo-400 font-medium">Direct apply link</span>
              </div>
            </div>

            <div className="space-y-4 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-950/70 text-indigo-400 border border-indigo-800/50">
                <Briefcase className="w-3.5 h-3.5" />
                Product 2: AI Job Finder
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Find High-Paying Remote & Freelance Job Postings
              </h2>
              <p className="text-slate-300 leading-relaxed font-normal">
                Search verified freelance and remote positions across development, design,
                marketing, writing, and operations. Gemini AI compares every opportunity
                against your freelancer preferences.
              </p>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Real job listings from trusted feeds (Remotive, etc.)</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>AI Match Score comparing candidate skills to job requirements</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Takes you straight to the original application portal</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('jobs')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  <span>Explore Job Finder</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold text-white">How LeadFinder AI Works</h2>
          <p className="text-slate-300 font-medium">
            Four simple steps to find real freelance work and potential clients without paying a cent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="font-bold text-white text-base">Select Your Target</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Search by business category (e.g. Barber, Roofing, Gym) or remote job role (e.g. React Developer, UI Designer).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/60 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="font-bold text-white text-base">Ingest Live Data</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Our data engine queries legitimate public directories and verified remote job feeds in real-time.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-violet-950 text-violet-400 border border-violet-800/60 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="font-bold text-white text-base">Gemini AI Scoring</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              AI calculates scores (0-100), highlights service needs, and provides tailored outreach pitch suggestions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center font-bold text-lg">
              4
            </div>
            <h3 className="font-bold text-white text-base">Save & Pitch</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Bookmark promising opportunities to your private Firestore account and apply or pitch with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Why Freelancers Choose LeadFinder AI */}
      <section className="py-16 bg-slate-950/70 border-t border-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl font-bold text-white">Why Freelancers Love LeadFinder AI</h2>
            <p className="text-slate-300 font-medium">Built by freelancers, for freelancers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <Zap className="w-6 h-6 text-cyan-400" />
              <h3 className="font-bold text-white">100% Free Forever</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                No credit system, no paywalls, no monthly subscription tier. Every feature is unlocked for everyone.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <Globe className="w-6 h-6 text-indigo-400" />
              <h3 className="font-bold text-white">Zero Fake Data</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                We refuse to invent mock emails or fake companies. You only receive data from verified feeds and lawful sources.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <Sparkles className="w-6 h-6 text-violet-400" />
              <h3 className="font-bold text-white">Gemini Intelligence</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                State-of-the-art AI analysis helps you understand the prospect's needs before you write your first sentence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-slate-300 font-medium">Everything you need to know about LeadFinder AI</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-semibold text-white hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-cyan-400 shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 ml-4" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/70 via-indigo-950/70 to-slate-900 border border-indigo-800/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Ready to find your next freelance client?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-medium">
              Join thousands of freelancers discovering leads and remote jobs faster.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-cyan-500/25 transition-all"
            >
              Get Started Completely Free
            </button>
            <button
              onClick={() => onNavigate('leads')}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-base font-bold transition-all"
            >
              Browse Leads Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/30 flex items-center justify-center text-cyan-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-300">LeadFinder AI</span>
            <span>— 100% Free Freelance Discovery</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button onClick={() => onNavigate('leads')} className="hover:text-white transition-colors">
              Lead Finder
            </button>
            <button onClick={() => onNavigate('jobs')} className="hover:text-white transition-colors">
              Job Finder
            </button>
            <button onClick={() => onNavigate('sources')} className="hover:text-white transition-colors">
              Data Feeds
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
