import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Video,
  CheckSquare,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export const InstructorNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const instructorNavItems = [
    { label: 'Faculty Dashboard', path: '/instructor/dashboard', icon: LayoutDashboard },
    { label: 'My Courses', path: '/instructor/courses', icon: BookOpen },
    { label: 'Submissions & AI Grading', path: '/instructor/grading', icon: CheckSquare },
    { label: 'Student Roster', path: '/instructor/students', icon: Users },
    { label: 'Live Seminars', path: '/instructor/seminars', icon: Video },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200/80 dark:border-ink-800/80 bg-white/90 dark:bg-ink-900/90 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/instructor/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-600 via-marigold-500 to-amber-400 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white dark:bg-ink-900 rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-amber-500" />
              </div>
            </div>
            <div>
              <span className="text-lg font-serif font-bold tracking-tight text-stone-900 dark:text-parchment-50">
                LearnSphere
              </span>
              <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-mono font-bold uppercase tracking-wider">
                Faculty Hub
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1.5">
            {instructorNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-sm'
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
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-bold text-xs text-amber-600 dark:text-amber-300">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'I'}
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-stone-900 dark:text-stone-200 leading-tight">{user?.name || 'Instructor'}</p>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">Verified Faculty</p>
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
          {instructorNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
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

export default InstructorNavbar;
