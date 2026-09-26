import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { Lock, ArrowRight, Compass, KeyRound } from 'lucide-react';

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await resetPassword(token, password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
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
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-terracotta-500/10 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[140px] pointer-events-none"></div>

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
            Create New Password
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            Please enter and confirm your updated secure password
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-ink-900/90 border border-stone-200 dark:border-ink-800 shadow-2xl backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Minimum 6 characters"
              icon={Lock}
              error={error}
              required
              autoFocus
            />

            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              placeholder="Re-enter your new password"
              icon={KeyRound}
              required
            />

            <Button
              type="submit"
              variant="terracotta"
              size="lg"
              className="w-full mt-2 shadow-md shadow-terracotta-500/20"
              isLoading={loading}
              icon={ArrowRight}
            >
              Update Password & Login
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-200 dark:border-ink-800 text-center">
            <Link
              to="/login"
              className="text-xs text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
