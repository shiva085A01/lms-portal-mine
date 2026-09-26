import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  BookOpen,
  Video,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminNavItems = [
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Course Governance', path: '/admin/courses', icon: BookOpen },
    { label: 'Manage Seminars', path: '/admin/seminars', icon: Video },
    { label: 'Student Feedback', path: '/admin/feedback', icon: MessageSquare },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200/80 dark:border-ink-800/80 bg-white/90 dark:bg-ink-900/90 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-terracotta-600 via-amber-600 to-terracotta-500 p-0.5 shadow-md shadow-terracotta-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white dark:bg-ink-900 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-terracotta-500" />
              </div>
            </div>
            <div>
              <span className="text-lg font-serif font-bold tracking-tight text-stone-900 dark:text-parchment-50">
                LearnSphere
              </span>
              <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-terracotta-500/15 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-500/30 font-mono font-bold uppercase tracking-wider">
                Admin Console
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1.5">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-terracotta-500/15 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-500/30 shadow-sm'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-ink-800/60'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle size="sm" />

            <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-stone-200 dark:border-ink-800">
              <div className="w-8 h-8 rounded-xl bg-terracotta-500/15 border border-terracotta-500/30 flex items-center justify-center font-bold text-xs text-terracotta-600 dark:text-terracotta-300">
                A
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-stone-900 dark:text-stone-200 leading-tight">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-terracotta-600 dark:text-terracotta-400 font-mono">Executive Admin</p>
              </div>
            </div>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              icon={LogOut}
              className="text-xs"
            >
              <span className="hidden sm:inline">Logout</span>
            </Button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-stone-100 dark:bg-ink-850 border border-stone-200 dark:border-ink-750 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 dark:border-ink-800 bg-white/95 dark:bg-ink-900/95 backdrop-blur-2xl px-4 py-4 space-y-1 animate-slide-up">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    isActive
                      ? 'bg-terracotta-500/15 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-500/30'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-ink-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
