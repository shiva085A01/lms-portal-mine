import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, ArrowLeft, Send, CheckCircle2, ExternalLink, Brain } from 'lucide-react';

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
    <div className="relative min-h-screen bg-[#090d16] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background ambient orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-600/20 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent-500/20 blur-[130px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-accent-500 p-0.5 shadow-glow group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#090d16] rounded-[14px] flex items-center justify-center">
                <Brain className="w-6 h-6 text-brand-400" />
              </div>
            </div>
            <div className="text-left">
              <span className="text-2xl font-black tracking-tight gradient-text block">LearnSphere</span>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">AI-Powered LMS</span>
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-white mt-6 mb-2">Reset Password</h2>
          <p className="text-sm text-slate-400">
            Enter your email to receive password reset instructions
          </p>
        </div>

        <GlassCard className="border-white/10 shadow-2xl backdrop-blur-2xl">
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
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={loading}
                icon={Send}
              >
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Check Your Email</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If an account with <strong className="text-slate-200">{email}</strong> exists,
                a password reset link has been dispatched.
              </p>

              {/* Dev Mode Reset Link Banner */}
              {devInfo && (
                <div className="mt-4 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-left">
                  <div className="flex items-center justify-between text-xs font-semibold text-brand-300 mb-1">
                    <span>Development Mode Link:</span>
                    <span className="text-[10px] bg-brand-500/20 px-1.5 py-0.5 rounded">Quick Test</span>
                  </div>
                  <Link
                    to={`/reset-password/${devInfo.resetToken}`}
                    className="text-xs text-brand-400 hover:text-brand-300 underline break-all flex items-center gap-1 mt-1"
                  >
                    Click to Open Reset Password Page <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </Link>
                </div>
              )}

              <Button
                variant="glass"
                size="sm"
                className="w-full mt-4"
                onClick={() => setSubmitted(false)}
              >
                Resend Another Request
              </Button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ForgotPassword;
