import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { Mail, Lock, Sparkles, Compass, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

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
      } else if (result.user.role === 'instructor') {
        navigate('/instructor/dashboard', { replace: true });
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
    } else if (role === 'instructor') {
      setFormData({
        email: 'instructor@lms.com',
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
    <div className="relative min-h-screen bg-parchment-50 dark:bg-ink-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden font-sans transition-colors duration-300">
      {/* Theme Toggle Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Background ambient warm glows */}
      <div className="absolute top-[-15%] left-[-15%] w-[500px] h-[500px] rounded-full bg-terracotta-500/10 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Logo Header */}
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
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            Sign in to access your LMS dashboard and courses
          </p>
        </div>

        {/* Login Tactile Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-ink-900/90 border border-stone-200 dark:border-ink-800 shadow-2xl backdrop-blur-2xl">
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
              <label className="flex items-center gap-2 cursor-pointer text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-300 dark:border-ink-700 bg-stone-50 dark:bg-ink-950 text-terracotta-500 focus:ring-terracotta-500/30"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="terracotta"
              size="lg"
              className="w-full mt-2 shadow-md shadow-terracotta-500/20"
              isLoading={loading}
              icon={ArrowRight}
            >
              Sign In to LMS
            </Button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-stone-200 dark:border-ink-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 1-Click Demo Fill
              </span>
              <span className="text-[10px] text-stone-500 font-mono">Instant Test</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('student')}
                className="px-2.5 py-2 rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-200 dark:border-ink-750 text-xs text-stone-700 dark:text-stone-300 hover:border-terracotta-500/50 hover:text-stone-900 dark:hover:text-white transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <span className="font-medium">Student</span>
                <span className="text-[9px] text-terracotta-600 dark:text-terracotta-400 bg-terracotta-500/10 px-1 py-0.5 rounded font-mono font-bold">Fill</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('instructor')}
                className="px-2.5 py-2 rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-200 dark:border-ink-750 text-xs text-stone-700 dark:text-stone-300 hover:border-amber-500/50 hover:text-stone-900 dark:hover:text-white transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <span className="font-medium">Faculty</span>
                <span className="text-[9px] text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded font-mono font-bold">Fill</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="px-2.5 py-2 rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-200 dark:border-ink-750 text-xs text-stone-700 dark:text-stone-300 hover:border-jade-500/50 hover:text-stone-900 dark:hover:text-white transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <span className="font-medium">Admin</span>
                <span className="text-[9px] text-jade-600 dark:text-jade-400 bg-jade-500/10 px-1 py-0.5 rounded font-mono font-bold">Fill</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link to Register */}
        <p className="text-center text-xs text-stone-600 dark:text-stone-300 mt-6">
          Don&apos;t have an account yet?{' '}
          <Link
            to="/register"
            className="text-terracotta-600 dark:text-amber-400 hover:underline font-bold transition-colors ml-1"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
