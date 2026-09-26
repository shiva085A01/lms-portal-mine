import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { NotificationsDropdown } from '../common/NotificationsDropdown';
import {
  Compass,
  LayoutDashboard,
  BookOpen,
  Film,
  Users,
  Video,
  Briefcase,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Sparkles,
  Award,
} from 'lucide-react';

export const StudentNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Courses', path: '/student/courses', icon: BookOpen },
    { label: 'Certificates', path: '/student/certificates', icon: Award },
    { label: 'Shorts', path: '/student/learning-shorts', icon: Film, badge: 'Reels' },
    { label: 'Study Rooms', path: '/student/study-rooms', icon: Users },
    { label: 'Seminars', path: '/student/seminars', icon: Video },
    { label: 'Career Hub', path: '/student/career', icon: Briefcase },
    { label: 'Feedback', path: '/student/feedback', icon: MessageSquare },
    { label: '3D Library', path: '/bookshelf', icon: Sparkles },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200/80 dark:border-ink-800/80 bg-white/95 dark:bg-ink-900/95 backdrop-blur-xl transition-colors duration-300 shadow-sm">
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-5">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo */}
          <Link to="/student/dashboard" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-terracotta-600 via-amber-600 to-terracotta-400 p-0.5 shadow-md shadow-terracotta-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white dark:bg-ink-900 rounded-[14px] flex items-center justify-center">
                <Compass className="w-4 h-4 text-terracotta-500" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-base sm:text-lg font-serif font-bold tracking-tight text-stone-900 dark:text-parchment-50 block leading-tight">
                LearnSphere
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-terracotta-500/15 text-terracotta-700 dark:text-terracotta-300 font-mono font-semibold uppercase">
                Student
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden xl:flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-terracotta-500/15 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-500/30 shadow-sm'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-ink-800/60'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold uppercase font-mono">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Right Action Controls: Theme, Notifications, User Badge & Logout */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Theme Toggle */}
            <ThemeToggle size="sm" />

            {/* Working Interactive Notifications */}
            <NotificationsDropdown />

            {/* User Mini Profile */}
            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-ink-800">
              <div className="w-8 h-8 rounded-xl bg-terracotta-500/15 border border-terracotta-500/30 flex items-center justify-center font-bold text-xs text-terracotta-600 dark:text-terracotta-300 shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="text-left text-xs max-w-[110px] lg:max-w-[130px]">
                <p className="font-semibold text-stone-900 dark:text-stone-200 leading-tight truncate">{user?.name}</p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 font-mono truncate">Student Portal</p>
              </div>
            </div>

            {/* Visible Logout Button */}
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              icon={LogOut}
              className="text-xs shrink-0 font-semibold px-2.5 sm:px-3 py-1.5"
            >
              <span className="hidden sm:inline">Logout</span>
            </Button>

            {/* Mobile / Tablet Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-stone-100 dark:bg-ink-850 border border-stone-200 dark:border-ink-750 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-200 dark:border-ink-800 bg-white/95 dark:bg-ink-900/95 backdrop-blur-2xl px-4 py-4 space-y-1 animate-slide-up">
          <div className="p-3 mb-2 rounded-2xl bg-terracotta-500/10 border border-terracotta-500/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-terracotta-600/20 border border-terracotta-500/40 flex items-center justify-center font-bold text-sm text-terracotta-600 dark:text-terracotta-300">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900 dark:text-white">{user?.name}</p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">{user?.email}</p>
            </div>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-terracotta-500/15 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-500/30'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-ink-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold uppercase font-mono">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default StudentNavbar;
