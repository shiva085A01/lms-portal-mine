import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import {
  Brain,
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
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0f1d]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/student/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-accent-500 p-0.5 shadow-glow group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Brain className="w-4 h-4 text-brand-400" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight gradient-text">LearnSphere</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-semibold uppercase">
                Student
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-glow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 font-bold uppercase tracking-wider animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Right User & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Indicator */}
            <div className="relative">
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-slate-900/80 border border-white/10 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </div>

            {/* User Profile Mini Badge */}
            <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/40 flex items-center justify-center font-bold text-xs text-brand-300">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-slate-200 leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-400">Student Portal</p>
              </div>
            </div>

            <Button
              size="sm"
              variant="glass"
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
              className="lg:hidden p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-2xl px-4 py-4 space-y-1 animate-slide-up">
          <div className="p-3 mb-2 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-600/30 border border-brand-500/40 flex items-center justify-center font-bold text-sm text-brand-300">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <p className="text-xs font-bold text-white">{user?.name}</p>
              <p className="text-[10px] text-slate-400">{user?.email}</p>
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
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 font-bold uppercase">
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
