import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { Mail, ArrowLeft, Send, CheckCircle2, ExternalLink, Compass } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devInfo, setDevInfo] = useState(null);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (result.success) {
      setSubmitted(true);
      if (result.data?.devResetUrl) {
        setDevInfo(result.data);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-parchment-50 dark:bg-ink-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden font-sans transition-colors duration-300">
      {/* Theme Toggle Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Background ambient warm glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-terracotta-500/10 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-terracotta-600 via-amber-600 to-terracotta-400 p-0.5 shadow-md shadow-terracotta-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white dark:bg-ink-900 rounded-[14px] flex items-center justify-center">
                <Compass className="w-6 h-6 text-terracotta-500" />
              </div>
            </div>
            <div className="text-left">
              <span className="text-2xl font-serif font-bold tracking-tight text-stone-900 dark:text-white block leading-tight">
                LearnSphere
              </span>
              <span className="text-[11px] text-terracotta-600 dark:text-amber-400 font-mono font-semibold tracking-wide uppercase">
                Learning Management System
              </span>
            </div>
          </Link>
          <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-white mt-6 mb-1.5">
            Reset Password
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            Enter your email to receive password reset instructions
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-ink-900/90 border border-stone-200 dark:border-ink-800 shadow-2xl backdrop-blur-2xl">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                icon={Mail}
                required
                autoFocus
              />

              <Button
                type="submit"
                variant="terracotta"
                size="lg"
                className="w-full mt-2 shadow-md shadow-terracotta-500/20"
                isLoading={loading}
                icon={Send}
              >
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-jade-500/10 border border-jade-500/30 flex items-center justify-center text-jade-500 mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white">Check Your Email</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                If an account with <strong className="text-stone-900 dark:text-stone-200">{email}</strong> exists,
                a password reset link has been dispatched.
              </p>

              {/* Dev Mode Reset Link Banner */}
              {devInfo && (
                <div className="mt-4 p-3 rounded-2xl bg-terracotta-500/10 border border-terracotta-500/20 text-left">
                  <div className="flex items-center justify-between text-xs font-semibold text-terracotta-700 dark:text-terracotta-300 mb-1">
                    <span>Development Mode Link:</span>
                    <span className="text-[10px] bg-terracotta-500/20 px-1.5 py-0.5 rounded font-mono">Quick Test</span>
                  </div>
                  <Link
                    to={`/reset-password/${devInfo.resetToken}`}
                    className="text-xs text-terracotta-600 dark:text-terracotta-400 hover:underline break-all flex items-center gap-1 mt-1 font-mono"
                  >
                    Click to Open Reset Password Page <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </Link>
                </div>
              )}

              <Button
                variant="secondary"
                size="sm"
                className="w-full mt-4"
                onClick={() => setSubmitted(false)}
              >
                Resend Another Request
              </Button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-stone-200 dark:border-ink-800 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
