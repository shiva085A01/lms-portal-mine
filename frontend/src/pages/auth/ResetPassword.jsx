import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Lock, ArrowRight, Brain, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

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
    <div className="relative min-h-screen bg-[#090d16] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background ambient orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-600/20 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent-500/20 blur-[130px] pointer-events-none"></div>

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
          <h2 className="text-2xl font-bold text-white mt-6 mb-2">Create New Password</h2>
          <p className="text-sm text-slate-400">
            Please enter and confirm your updated secure password
          </p>
        </div>

        <GlassCard className="border-white/10 shadow-2xl backdrop-blur-2xl">
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
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
              icon={ArrowRight}
            >
              Update Password & Login
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <Link
              to="/login"
              className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ResetPassword;
