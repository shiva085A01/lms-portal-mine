import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Video,
  CheckSquare,
  BarChart2,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

export const InstructorNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const instructorNavItems = [
    { label: 'Instructor Portal', path: '/instructor/dashboard', icon: LayoutDashboard },
    { label: 'My Courses', path: '/instructor/courses', icon: BookOpen },
    { label: 'Live Seminars', path: '/instructor/seminars', icon: Video },
    { label: 'Submissions & AI Grading', path: '/instructor/grading', icon: CheckSquare },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0f1d]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/instructor/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 shadow-glow group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight gradient-text">LearnSphere</span>
              <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold uppercase tracking-wider">
                Instructor Hub
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            {instructorNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-glow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-bold text-xs text-purple-300">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'I'}
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-slate-200 leading-tight">{user?.name || 'Instructor'}</p>
                <p className="text-[10px] text-purple-400 font-mono">Verified Faculty</p>
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

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-2xl px-4 py-4 space-y-1 animate-slide-up">
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
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
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
