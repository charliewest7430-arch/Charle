import React, { useState, useEffect } from 'react';
import {
  User,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Code,
  MapPin,
  Clock,
  Loader2,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, userAccount, freelancerProfile, saveFreelancerProfile } = useAuth();

  const [category, setCategory] = useState('');
  const [skills, setSkills] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate (2-4 yrs)');
  const [preferredJobType, setPreferredJobType] = useState('Freelance / Contract');
  const [preferredLocations, setPreferredLocations] = useState('Worldwide Remote');
  const [remotePreference, setRemotePreference] = useState('Remote Only');
  const [bio, setBio] = useState('');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (freelancerProfile) {
      setCategory(freelancerProfile.category || 'Web & Software Development');
      setSkills(freelancerProfile.skills || 'React, TypeScript, Tailwind CSS, API Integration');
      setExperienceLevel(freelancerProfile.experienceLevel || 'Intermediate (2-4 yrs)');
      setPreferredLocations(freelancerProfile.preferredLocations || 'Worldwide Remote');
      setRemotePreference(freelancerProfile.remotePreference || 'Remote Only');
      setBio(freelancerProfile.bio || '');
    }
  }, [freelancerProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await saveFreelancerProfile({
        category,
        skills,
        experienceLevel,
        preferredLocations,
        remotePreference,
        bio,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/50">
            <User className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-extrabold text-white">Freelancer Profile</h1>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          This profile directly feeds Gemini AI's job matching engine to compute personal match scores (0-100) and strategic pitch suggestions.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-indigo-500/20">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              {user?.displayName || userAccount?.name || 'Freelancer'}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{user?.email}</span>
              {user?.emailVerified ? (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                  Verified
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-950 text-amber-400 border border-amber-800/40">
                  Unverified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Cloud Firestore encrypted record</span>
        </div>
      </div>

      {/* Success / Error alerts */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Freelancer profile saved successfully! AI job matching updated.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Freelance Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Freelance Category / Primary Discipline
            </label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Full-Stack Web Developer, UI/UX Designer, Copywriter"
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Junior (0-2 yrs)">Junior (0-2 yrs)</option>
              <option value="Intermediate (2-4 yrs)">Intermediate (2-4 yrs)</option>
              <option value="Senior (5-8 yrs)">Senior (5-8 yrs)</option>
              <option value="Lead / Staff (8+ yrs)">Lead / Staff (8+ yrs)</option>
              <option value="Agency Owner">Agency Owner</option>
            </select>
          </div>

          {/* Remote Preference */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Remote Preference
            </label>
            <select
              value={remotePreference}
              onChange={(e) => setRemotePreference(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Remote Only">Remote Only</option>
              <option value="Remote Preferred">Remote Preferred</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Open to Onsite">Open to Onsite</option>
            </select>
          </div>

          {/* Preferred Locations */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Preferred Timezones or Locations
            </label>
            <input
              type="text"
              value={preferredLocations}
              onChange={(e) => setPreferredLocations(e.target.value)}
              placeholder="e.g. Worldwide, US Timezones, Europe, UTC+1"
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Key Skills & Technologies (Comma-separated)
          </label>
          <input
            type="text"
            required
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. React, TypeScript, Next.js, Tailwind CSS, Node.js, PostgreSQL, UI Design"
            className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Gemini AI uses these skill tags to match against incoming job requirements.
          </p>
        </div>

        {/* Short Bio */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Short Freelancer Bio / Elevator Pitch
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Describe your background, what kind of clients you help, and the problems you solve..."
            className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Firestore...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
