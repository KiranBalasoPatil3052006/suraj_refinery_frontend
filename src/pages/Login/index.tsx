import React, { useState } from 'react';
import { login } from '../../services/authApi';
import { SBALogo } from '../../components/common/SBALogo';
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      await login(email.trim(), password);
      onLoginSuccess();
    } catch (err) {
      const apiError = err as Error & { code?: string };
      if (apiError.code === 'UNAUTHORIZED') {
        setError('Invalid email or password. Please verify credentials.');
      } else {
        setError(apiError.message || 'Login failed. Please verify credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eaeff1] text-slate-800 flex flex-col items-center justify-start sm:py-6 font-sans select-none">
      {/* Desktop Responsive Toolbar */}
      <aside className="hidden md:flex items-center justify-between w-full max-w-2xl px-4 py-2 mb-3 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-xs text-xs">
        <div className="flex items-center space-x-2 text-slate-700 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-serif font-bold text-brand-900">SURAJ BULLION ACCESSORIES</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 font-normal">Assay Portal</span>
        </div>

        <div className="flex items-center space-x-1.5 text-brand-800 font-medium bg-brand-50/80 px-2.5 py-1 rounded-lg border border-brand-100">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
          <span className="text-[11px] font-semibold">Secure Admin Access</span>
        </div>
      </aside>

      {/* Main Container matching mobile frame across App */}
      <div className="w-full max-w-[430px] bg-slate-50 min-h-screen sm:min-h-[890px] sm:max-h-[920px] sm:overflow-y-auto sm:rounded-[40px] sm:shadow-phone sm:border-[8px] sm:border-slate-800/90 relative flex flex-col justify-between">
        <div className="w-full flex-1 flex flex-col items-center justify-center my-auto py-4">
          {/* Top Brand Header with Logo & Tamil subtitle */}
          <header className="w-full pt-4 pb-1 px-4 flex flex-col items-center justify-center">
            <SBALogo size="lg" showTamil={true} align="center" />
            <h1
              className="text-2xl sm:text-[28px] font-serif font-bold text-brand-900 tracking-tight mt-3 mb-2 text-center"
              style={{ fontFamily: '"Playfair Display", "Cinzel", Georgia, serif' }}
            >
              Sign In
            </h1>
          </header>

          {/* Primary Form Surface Card */}
          <main className="w-full px-3 sm:px-4 pb-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft-card p-4 sm:p-5 space-y-4">

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[13px] font-semibold text-slate-800 block">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-slate-400 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      placeholder="admin@surajbullion.com"
                      autoComplete="email"
                      className={`w-full pl-9 pr-3 py-2.5 bg-white text-slate-800 text-sm border rounded-xl shadow-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                        error
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                          : 'border-slate-300 focus:border-brand-700 focus:ring-brand-700/20'
                      }`}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-[13px] font-semibold text-slate-800 block">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-slate-400 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="Enter admin password"
                      autoComplete="current-password"
                      className={`w-full pl-9 pr-10 py-2.5 bg-white text-slate-800 text-sm border rounded-xl shadow-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                        error
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                          : 'border-slate-300 focus:border-brand-700 focus:ring-brand-700/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 flex items-start space-x-2 text-xs text-red-700 animate-in fade-in duration-200">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-brand-800 hover:bg-brand-850 active:bg-brand-900 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-btn active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 text-white stroke-[2.5]" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>

                {/* Brand Footer Slogan */}
                <div className="pt-2 pb-0.5 flex flex-col items-center justify-center select-none">
                  <div className="flex items-center space-x-2 text-brand-800/70">
                    <span className="text-[9px]">◆</span>
                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase">
                      PURITY BUILDS TRUST
                    </span>
                    <span className="text-[9px]">◆</span>
                  </div>
                </div>
              </form>
            </div>
          </main>
        </div>

        {/* Bottom Home Indicator & Copyright */}
        <div className="pb-3 text-center select-none shrink-0">
          <p className="text-[10.5px] text-slate-400 font-medium">
            © {new Date().getFullYear()} Suraj Bullion Accessories • Coimbatore
          </p>
          <div className="hidden sm:flex justify-center pb-1 pt-2 pointer-events-none">
            <div className="w-32 h-1 bg-slate-400 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
