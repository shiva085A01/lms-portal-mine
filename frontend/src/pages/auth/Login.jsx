import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, Sparkles, Brain, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      if (from) {
        navigate(from, { replace: true });
      } else if (result.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    }
  };

  // Quick Demo Credentials fill helper
  const handleQuickFill = (role) => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@lms.com',
        password: 'Password@123',
      });
    } else {
      setFormData({
        email: 'student@lms.com',
        password: 'Password@123',
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#090d16] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background ambient gradient orbs */}
      <div className="absolute top-[-15%] left-[-15%] w-[500px] h-[500px] rounded-full bg-brand-600/20 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[500px] h-[500px] rounded-full bg-accent-500/20 blur-[130px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Logo Header */}
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
          <h2 className="text-2xl font-bold text-white mt-6 mb-2">Welcome Back</h2>
          <p className="text-sm text-slate-400">Sign in to your learning dashboard</p>
        </div>

        {/* Login Glassmorphic Form Card */}
        <GlassCard className="border-white/10 shadow-2xl backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@domain.com"
              icon={Mail}
              required
              autoFocus
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              icon={Lock}
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900/80 text-brand-500 focus:ring-brand-500/30"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-brand-400 hover:text-brand-300 transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
              icon={ArrowRight}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Quick Demo Fill
              </span>
              <span className="text-[10px] text-slate-500">1-click test</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('student')}
                className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 hover:bg-slate-700/60 hover:text-white transition-all text-left flex items-center justify-between"
              >
                <span>Student</span>
                <span className="text-[10px] text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded">Fill</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 hover:bg-slate-700/60 hover:text-white transition-all text-left flex items-center justify-between"
              >
                <span>Admin</span>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">Fill</span>
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Footer Link to Register */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Don&apos;t have an account yet?{' '}
          <Link
            to="/register"
            className="text-brand-400 hover:text-brand-300 font-semibold transition-colors"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
