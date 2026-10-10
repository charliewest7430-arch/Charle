import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    sendPasswordReset,
    error,
    clearError,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const resetState = () => {
    clearError();
    setLocalError(null);
    setSuccessMessage(null);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSwitchMode = (newMode: 'login' | 'signup' | 'forgot') => {
    resetState();
    setMode(newMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);
    setSuccessMessage(null);

    if (mode === 'signup') {
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
      }
      setLoading(true);
      try {
        await signUpWithEmail(email, password, name);
        setSuccessMessage('Account created! A verification email has been sent.');
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (err: any) {
        // Handled in context
      } finally {
        setLoading(false);
      }
    } else if (mode === 'login') {
      setLoading(true);
      try {
        await signInWithEmail(email, password);
        onClose();
      } catch (err: any) {
        // Handled in context
      } finally {
        setLoading(false);
      }
    } else if (mode === 'forgot') {
      if (!email.trim()) {
        setLocalError('Please enter your email address.');
        return;
      }
      setLoading(true);
      try {
        await sendPasswordReset(email);
        setSuccessMessage('Password reset link sent to your email.');
      } catch (err: any) {
        // Handled in context
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    clearError();
    setLocalError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      // Handled in context
    } finally {
      setGoogleLoading(false);
    }
  };

  const activeError = localError || error;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>
            {mode === 'login'
              ? 'Log In to LeadFinder AI'
              : mode === 'signup'
              ? 'Create Your Free Account'
              : 'Reset Your Password'}
          </span>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Subtitle / Free badge notice */}
        <div className="text-xs text-slate-400 flex items-center justify-between">
          <span>100% Free for Freelancers. No paid plans.</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-700/50">
            No Card Required
          </span>
        </div>

        {/* Error Message */}
        {activeError && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{activeError}</span>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Google Sign In Button */}
        {mode !== 'forgot' && (
          <>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-200 hover:text-white transition-all shadow-xs"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-300 font-medium absolute">
                Or with email
              </span>
            </div>
          </>
        )}

        {/* Email Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9.5 pr-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="freelancer@example.com"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9.5 pr-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('forgot')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9.5 pr-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9.5 pr-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all mt-4"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'login'
                    ? 'Log In'
                    : mode === 'signup'
                    ? 'Create Free Account'
                    : 'Send Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Bottom switch mode */}
        <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800/80">
          {mode === 'login' && (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('signup')}
                className="font-semibold text-cyan-400 hover:text-cyan-300 underline"
              >
                Sign up free
              </button>
            </p>
          )}

          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className="font-semibold text-cyan-400 hover:text-cyan-300 underline"
              >
                Log in
              </button>
            </p>
          )}

          {mode === 'forgot' && (
            <p>
              Remembered your password?{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className="font-semibold text-cyan-400 hover:text-cyan-300 underline"
              >
                Back to log in
              </button>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};
