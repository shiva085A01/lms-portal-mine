import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
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
  Bell,
  Menu,
  X,
  Sparkles,
  Award,
} from 'lucide-react';
import api from '../../services/api';

export const StudentNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const res = await api.get('/notifications');
        if (res.success && res.data) {
          setUnreadNotifications(res.data.unreadCount || 0);
        }
      } catch {
        // Silently catch in navbar poll
      }
    };
    fetchNotificationCount();
  }, []);

  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Courses', path: '/student/courses', icon: BookOpen },
    { label: 'Certificates', path: '/student/certificates', icon: Award },
    {
      label: 'Learning Shorts',
      path: '/student/learning-shorts',
      icon: Film,
      badge: 'Reels',
    },
    { label: 'Study Rooms', path: '/student/study-rooms', icon: Users },
    { label: 'Seminars', path: '/student/seminars', icon: Video },
    { label: 'Career Hub', path: '/student/career', icon: Briefcase },
    { label: 'Weekly Feedback', path: '/student/feedback', icon: MessageSquare },
    { label: '3D Library', path: '/bookshelf', icon: Sparkles, badge: '3D' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200/80 dark:border-ink-800/80 bg-white/90 dark:bg-ink-900/90 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/student/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-terracotta-600 via-amber-600 to-terracotta-400 p-0.5 shadow-md shadow-terracotta-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white dark:bg-ink-900 rounded-[14px] flex items-center justify-center">
                <Compass className="w-4 h-4 text-terracotta-500" />
              </div>
            </div>
            <div>
              <span className="text-lg font-serif font-bold tracking-tight text-stone-900 dark:text-parchment-50">
                LearnSphere
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] px-2 py-0.5 rounded-full bg-terracotta-500/15 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-500/30 font-mono font-semibold uppercase">
                Student
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-terracotta-500/15 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-500/30 shadow-sm'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-ink-800/60'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold uppercase tracking-wider font-mono">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Right User & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Light/Dark Mode Toggle */}
            <ThemeToggle size="sm" />

            {/* Notification Indicator */}
            <div className="relative">
              <button
                type="button"
                className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-ink-850 border border-stone-200 dark:border-ink-750 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-terracotta-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </div>

            {/* User Profile Mini Badge */}
            <div className="hidden xl:flex items-center gap-2.5 pl-2 border-l border-stone-200 dark:border-ink-800 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-terracotta-500/15 border border-terracotta-500/30 flex items-center justify-center font-bold text-xs text-terracotta-600 dark:text-terracotta-300 shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="text-left text-xs whitespace-nowrap">
                <p className="font-semibold text-stone-900 dark:text-stone-200 leading-tight">{user?.name}</p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">Student Portal</p>
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

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-stone-100 dark:bg-ink-850 border border-stone-200 dark:border-ink-750 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 dark:border-ink-800 bg-white/95 dark:bg-ink-900/95 backdrop-blur-2xl px-4 py-4 space-y-1 animate-slide-up">
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
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold uppercase font-mono">
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
