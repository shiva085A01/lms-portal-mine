import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { Mail, Lock, User, Phone, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';

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
    <div className="relative min-h-screen bg-parchment-50 dark:bg-ink-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden font-sans transition-colors duration-300">
      {/* Theme Toggle Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Background ambient warm glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-terracotta-500/10 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-6">
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
          <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-white mt-4 mb-1">
            Create an Account
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            Join thousands of students and instructors on LearnSphere LMS
          </p>
        </div>

        {/* Register Studio Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-ink-900/90 border border-stone-200 dark:border-ink-800 shadow-2xl backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Elena Rostova"
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
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 tracking-wide block mb-2 font-mono">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'student' }))}
                  className={`p-3 rounded-2xl border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                    formData.role === 'student'
                      ? 'border-terracotta-500 bg-terracotta-500/15 text-stone-900 dark:text-white shadow-sm'
                      : 'border-stone-200 dark:border-ink-800 bg-stone-50 dark:bg-ink-950 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-ink-700'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-semibold text-stone-900 dark:text-stone-200">Student</p>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">Learn & submit code</p>
                  </div>
                  {formData.role === 'student' && <CheckCircle2 className="w-4 h-4 text-terracotta-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'instructor' }))}
                  className={`p-3 rounded-2xl border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                    formData.role === 'instructor'
                      ? 'border-amber-500 bg-amber-500/15 text-stone-900 dark:text-white shadow-sm'
                      : 'border-stone-200 dark:border-ink-800 bg-stone-50 dark:bg-ink-950 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-ink-700'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-semibold text-stone-900 dark:text-stone-200">Instructor</p>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">Publish & grade</p>
                  </div>
                  {formData.role === 'instructor' && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
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
              variant="terracotta"
              size="lg"
              className="w-full mt-2 shadow-md shadow-terracotta-500/20"
              isLoading={loading}
              icon={ArrowRight}
            >
              Complete Registration
            </Button>
          </form>
        </div>

        {/* Footer Link to Login */}
        <p className="text-center text-xs text-stone-600 dark:text-stone-300 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-terracotta-600 dark:text-amber-400 hover:underline font-bold transition-colors ml-1"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
