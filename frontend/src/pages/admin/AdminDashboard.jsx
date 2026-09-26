import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminNavbar } from '../../components/layout/AdminNavbar';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { StudioTiltCard } from '../../components/ui/StudioTiltCard';
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
  Cpu,
  Database,
  CheckCircle2,
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
    <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col font-sans selection:bg-terracotta-500/20 selection:text-terracotta-200">
      <AdminNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 w-full space-y-8">
        {/* Operations Header */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-white dark:bg-gradient-to-br dark:from-ink-900 dark:via-ink-850 dark:to-ink-900 border border-stone-200 dark:border-ink-700/80 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-500/10 border border-terracotta-500/20 text-terracotta-600 dark:text-terracotta-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-3.5 h-3.5" /> Operations & System Governance
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-parchment-50 tracking-tight mb-2">
                Executive Control Plane
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-xl">
                Real-time telemetries aggregated directly from the MongoDB cluster. Supervise active student enrollments, faculty curriculums, and platform health.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/admin/users">
                <Button size="sm" variant="terracotta" icon={Users}>
                  Manage Directory
                </Button>
              </Link>
              <Link to="/admin/seminars">
                <Button size="sm" variant="secondary" icon={Video}>
                  Broadcast Seminars
                </Button>
              </Link>
              <Link to="/admin/feedback">
                <Button size="sm" variant="outline" icon={MessageSquare}>
                  Student Sentiment
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Real Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <StudioTiltCard className="p-4 bg-white dark:bg-ink-850/90 border-stone-200 dark:border-ink-700/80 hover:border-terracotta-500/40">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Students</span>
              <Users className="w-4 h-4 text-terracotta-500 dark:text-terracotta-400" />
            </div>
            <p className="text-2xl font-serif font-bold text-stone-900 dark:text-parchment-50">{metrics.totalStudents}</p>
            <p className="text-[10px] text-stone-500 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-jade-500 dark:text-jade-400" /> Active in DB
            </p>
          </StudioTiltCard>

          <StudioTiltCard className="p-4 bg-white dark:bg-ink-850/90 border-stone-200 dark:border-ink-700/80 hover:border-amber-500/40">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Courses</span>
              <BookOpen className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            </div>
            <p className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400">{metrics.totalCourses}</p>
            <p className="text-[10px] text-stone-500 mt-1">Live course catalog</p>
          </StudioTiltCard>

          <StudioTiltCard className="p-4 bg-white dark:bg-ink-850/90 border-stone-200 dark:border-ink-700/80 hover:border-jade-500/40">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Enrollments</span>
              <TrendingUp className="w-4 h-4 text-jade-500 dark:text-jade-400" />
            </div>
            <p className="text-2xl font-serif font-bold text-jade-600 dark:text-jade-400">{metrics.totalEnrollments}</p>
            <p className="text-[10px] text-stone-500 mt-1">Active learners</p>
          </StudioTiltCard>

          <StudioTiltCard className="p-4 bg-white dark:bg-ink-850/90 border-stone-200 dark:border-ink-700/80 hover:border-marigold-500/40">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Study Pods</span>
              <Layers className="w-4 h-4 text-marigold-500 dark:text-marigold-400" />
            </div>
            <p className="text-2xl font-serif font-bold text-amber-700 dark:text-marigold-400">{metrics.totalStudyRooms}</p>
            <p className="text-[10px] text-stone-500 mt-1">Peer hubs online</p>
          </StudioTiltCard>

          <StudioTiltCard className="p-4 bg-white dark:bg-ink-850/90 border-stone-200 dark:border-ink-700/80 hover:border-terracotta-500/40">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Seminars</span>
              <Video className="w-4 h-4 text-terracotta-500 dark:text-terracotta-400" />
            </div>
            <p className="text-2xl font-serif font-bold text-terracotta-600 dark:text-terracotta-400">{metrics.totalSeminars}</p>
            <p className="text-[10px] text-stone-500 mt-1">Scheduled webinars</p>
          </StudioTiltCard>

          <StudioTiltCard className="p-4 bg-white dark:bg-ink-850/90 border-stone-200 dark:border-ink-700/80 hover:border-amber-500/40">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Feedback</span>
              <MessageSquare className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            </div>
            <p className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400">{metrics.totalFeedbacks}</p>
            <p className="text-[10px] text-stone-500 mt-1">Weekly surveys</p>
          </StudioTiltCard>
        </div>

        {/* Real Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Registered Users */}
          <div className="p-6 rounded-3xl bg-white dark:bg-ink-850/80 border border-stone-200 dark:border-ink-700/70 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-ink-700/60">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-terracotta-500 dark:text-terracotta-400" />
                <h3 className="font-serif font-bold text-base text-stone-900 dark:text-parchment-100">Recent User Registrations</h3>
              </div>
              <Link to="/admin/users" className="text-xs text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium flex items-center gap-1">
                View All Directory <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {loading ? (
                [1, 2, 3].map((n) => (
                  <div key={n} className="h-14 rounded-2xl bg-stone-100 dark:bg-ink-900/60 border border-stone-200 dark:border-ink-800 animate-pulse"></div>
                ))
              ) : analytics?.recentUsers?.length > 0 ? (
                analytics.recentUsers.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-ink-900/60 border border-stone-200 dark:border-ink-800/80 hover:border-stone-300 dark:hover:border-ink-700 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-terracotta-500/10 border border-terracotta-500/20 flex items-center justify-center font-serif font-bold text-xs text-terracotta-600 dark:text-terracotta-300">
                        {u.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-stone-900 dark:text-parchment-100">{u.name}</p>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">{u.email}</p>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <span
                        className={`text-[10px] font-mono font-semibold uppercase px-2.5 py-1 rounded-full ${
                          u.role === 'admin'
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30'
                            : u.role === 'instructor'
                            ? 'bg-terracotta-500/15 text-terracotta-600 dark:text-terracotta-300 border border-terracotta-500/30'
                            : 'bg-jade-500/15 text-jade-600 dark:text-jade-300 border border-jade-500/30'
                        }`}
                      >
                        {u.role}
                      </span>
                      <p className="text-[10px] text-stone-400 dark:text-stone-500 hidden sm:block">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-500 py-4 text-center">No recent user registrations.</p>
              )}
            </div>
          </div>

          {/* Catalog Courses */}
          <div className="p-6 rounded-3xl bg-white dark:bg-ink-850/80 border border-stone-200 dark:border-ink-700/70 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-ink-700/60">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <h3 className="font-serif font-bold text-base text-stone-900 dark:text-parchment-100">Live LMS Courses in DB</h3>
              </div>
              <Link to="/student/courses" className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium flex items-center gap-1">
                Explore Catalog <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {loading ? (
                [1, 2, 3].map((n) => (
                  <div key={n} className="h-14 rounded-2xl bg-stone-100 dark:bg-ink-900/60 border border-stone-200 dark:border-ink-800 animate-pulse"></div>
                ))
              ) : analytics?.recentCourses?.length > 0 ? (
                analytics.recentCourses.map((c) => (
                  <div
                    key={c._id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-ink-900/60 border border-stone-200 dark:border-ink-800/80 hover:border-stone-300 dark:hover:border-ink-700 transition-colors text-xs"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="font-medium text-stone-900 dark:text-parchment-100 truncate">{c.title}</p>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono uppercase">{c.category}</span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">{c.enrolledStudentsCount || 0} Enrolled</span>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">★ {c.rating || 5.0}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-500 py-4 text-center">No LMS courses registered yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
