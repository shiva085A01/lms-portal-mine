import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminNavbar } from '../../components/layout/AdminNavbar';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import {
  ShieldCheck,
  Users,
  BookOpen,
  Video,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  Layers,
  Activity,
  Plus,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/overview');
        if (res.success) {
          setAnalytics(res.data);
        }
      } catch (err) {
        toast.error('Failed to load system analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const metrics = analytics?.metrics || {
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalStudyRooms: 0,
    totalSeminars: 0,
    totalFeedbacks: 0,
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <AdminNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-brand-950/40 border border-amber-500/20 shadow-glow">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Platform Operations & Governance
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              System Administration
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Real-time platform metrics aggregated directly from your MongoDB database. Manage courses, supervise student feedback, and oversee webinars.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/admin/users">
                <Button size="sm" variant="primary" icon={Users}>
                  Manage Users
                </Button>
              </Link>
              <Link to="/admin/seminars">
                <Button size="sm" variant="glass" icon={Video}>
                  Manage Seminars
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Real Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <GlassCard className="p-4 border-brand-500/20">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-semibold uppercase">Students</span>
              <Users className="w-4 h-4 text-brand-400" />
            </div>
            <p className="text-2xl font-bold text-white">{metrics.totalStudents}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Registered in DB</p>
          </GlassCard>

          <GlassCard className="p-4 border-emerald-500/20">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-semibold uppercase">Courses</span>
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400">{metrics.totalCourses}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Live catalog</p>
          </GlassCard>

          <GlassCard className="p-4 border-indigo-500/20">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-semibold uppercase">Enrollments</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-bold text-indigo-400">{metrics.totalEnrollments}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Total active</p>
          </GlassCard>

          <GlassCard className="p-4 border-amber-500/20">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-semibold uppercase">Study Rooms</span>
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-400">{metrics.totalStudyRooms}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Collaboration hubs</p>
          </GlassCard>

          <GlassCard className="p-4 border-pink-500/20">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-semibold uppercase">Seminars</span>
              <Video className="w-4 h-4 text-pink-400" />
            </div>
            <p className="text-2xl font-bold text-pink-400">{metrics.totalSeminars}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Scheduled webinars</p>
          </GlassCard>

          <GlassCard className="p-4 border-cyan-500/20">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-semibold uppercase">Feedback</span>
              <MessageSquare className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-cyan-400">{metrics.totalFeedbacks}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Student submissions</p>
          </GlassCard>
        </div>

        {/* Real Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Registered Users */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-400" />
                <h3 className="font-bold text-sm text-white">Recent User Registrations</h3>
              </div>
              <Link to="/admin/users" className="text-xs text-brand-400 hover:underline">
                View All Users →
              </Link>
            </div>

            <div className="space-y-3">
              {analytics?.recentUsers?.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/40 flex items-center justify-center font-bold text-xs text-brand-300">
                      {u.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-200">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.email}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        u.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-300'
                          : u.role === 'instructor'
                          ? 'bg-pink-500/20 text-pink-300'
                          : 'bg-brand-500/20 text-brand-300'
                      }`}
                    >
                      {u.role}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Catalog Courses */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Production Courses in DB</h3>
              </div>
              <Link to="/student/courses" className="text-xs text-emerald-400 hover:underline">
                View Catalog →
              </Link>
            </div>

            <div className="space-y-3">
              {analytics?.recentCourses?.map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs"
                >
                  <div className="min-w-0 pr-3">
                    <p className="font-bold text-slate-200 truncate">{c.title}</p>
                    <span className="text-[10px] text-slate-400">{c.category}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-emerald-400 font-bold">{c.enrolledStudentsCount} Enrolled</span>
                    <p className="text-[10px] text-amber-400 mt-0.5">★ {c.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
