import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, User, Phone, Brain, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'student',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear field-specific error
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: formData.role,
      password: formData.password,
    });
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
      {/* Background ambient gradient orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-600/20 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent-500/20 blur-[130px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-6">
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
          <h2 className="text-2xl font-bold text-white mt-4 mb-1">Create an Account</h2>
          <p className="text-xs sm:text-sm text-slate-400">Join thousands of students and mentors on LearnSphere</p>
        </div>

        {/* Register Glassmorphic Form Card */}
        <GlassCard className="border-white/10 shadow-2xl backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Johnson"
              icon={User}
              error={errors.name}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@domain.com"
                icon={Mail}
                error={errors.email}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                icon={Phone}
                helperText="Optional"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 tracking-wide block mb-2">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'student' }))}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                    formData.role === 'student'
                      ? 'border-brand-500 bg-brand-500/15 text-white shadow-glow'
                      : 'border-white/10 bg-slate-900/60 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-semibold text-slate-200">Student</p>
                    <p className="text-[10px] text-slate-400">Learn & earn certificates</p>
                  </div>
                  {formData.role === 'student' && <CheckCircle2 className="w-4 h-4 text-brand-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'instructor' }))}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                    formData.role === 'instructor'
                      ? 'border-accent-500 bg-accent-500/15 text-white shadow-glow'
                      : 'border-white/10 bg-slate-900/60 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-semibold text-slate-200">Instructor</p>
                    <p className="text-[10px] text-slate-400">Teach courses & assess</p>
                  </div>
                  {formData.role === 'instructor' && <CheckCircle2 className="w-4 h-4 text-accent-400" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                icon={Lock}
                error={errors.password}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                icon={Lock}
                error={errors.confirmPassword}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
              icon={ArrowRight}
            >
              Complete Registration
            </Button>
          </form>
        </GlassCard>

        {/* Footer Link to Login */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-brand-400 hover:text-brand-300 font-semibold transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
