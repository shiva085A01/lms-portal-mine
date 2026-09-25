import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StudentNavbar } from '../../components/layout/StudentNavbar';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import {
  BookOpen,
  Film,
  Users,
  Video,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
  PlayCircle,
  ExternalLink,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [upcomingSeminars, setUpcomingSeminars] = useState([]);
  const [trendingShorts, setTrendingShorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [coursesRes, seminarsRes, shortsRes] = await Promise.all([
          api.get('/courses/my/enrolled'),
          api.get('/seminars'),
          api.get('/learning-shorts'),
        ]);

        if (coursesRes.success) setEnrolledCourses(coursesRes.data || []);
        if (seminarsRes.success) setUpcomingSeminars(seminarsRes.data || []);
        if (shortsRes.success) setTrendingShorts((shortsRes.data || []).slice(0, 3));
      } catch (err) {
        toast.error('Could not load dashboard data from database');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <StudentNavbar />

      {/* Background ambient orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-600/15 blur-[130px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent-500/15 blur-[130px] pointer-events-none"></div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-brand-900/40 via-slate-900/80 to-slate-900/50 border border-brand-500/20 shadow-glow">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Continuous Learning Pipeline
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Welcome back, <span className="gradient-text">{user?.name}</span>!
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Track your course progress, join active peer study rooms, watch Reels-style learning shorts, and advance your engineering career.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/student/courses">
                <Button size="sm" variant="primary" icon={BookOpen}>
                  Browse Courses
                </Button>
              </Link>
              <Link to="/student/learning-shorts">
                <Button size="sm" variant="glass" icon={Film}>
                  Scrollable Learning
                </Button>
              </Link>
              <Link to="/bookshelf">
                <Button size="sm" variant="glass" icon={Sparkles} className="border-amber-500/30 text-amber-300 hover:text-white hover:bg-amber-500/10">
                  3D Module Bookshelf
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Real Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Enrolled Courses</span>
              <BookOpen className="w-4 h-4 text-brand-400" />
            </div>
            <p className="text-2xl font-bold text-white">{enrolledCourses.length}</p>
            <p className="text-[11px] text-slate-400 mt-1">Live in MongoDB</p>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Learning Streak</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400">4 Days</p>
            <p className="text-[11px] text-slate-400 mt-1">Keep it consistent!</p>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Active Seminars</span>
              <Video className="w-4 h-4 text-pink-400" />
            </div>
            <p className="text-2xl font-bold text-pink-400">{upcomingSeminars.length}</p>
            <p className="text-[11px] text-slate-400 mt-1">Upcoming webinars</p>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Study Hours</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-400">18.5 hrs</p>
            <p className="text-[11px] text-slate-400 mt-1">Estimated this term</p>
          </GlassCard>
        </div>

        {/* Section 1: Enrolled Courses & Continue Learning */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-400" />
              <h2 className="text-lg font-bold text-white">My Enrolled Courses</h2>
            </div>
            <Link to="/student/courses" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold">
              Explore All Courses <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-40 rounded-xl bg-slate-900/60 animate-pulse border border-white/5"></div>
              ))}
            </div>
          ) : enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledCourses.map((enrollment) => {
                const c = enrollment.course;
                if (!c) return null;
                return (
                  <GlassCard key={enrollment._id} className="p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/20">
                          {c.category}
                        </span>
                        <span className="text-xs text-slate-400">{c.duration}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-1.5 line-clamp-1">{c.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4">{c.description}</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-400">Course Progress</span>
                        <span className="text-brand-400 font-bold">{enrollment.completionPercentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-4">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, enrollment.completionPercentage)}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <span className="text-[11px] text-slate-400">
                          {c.modules?.length || 0} Modules • {c.rating} ★
                        </span>
                        <Link to="/student/courses">
                          <Button size="sm" variant="primary" icon={PlayCircle}>
                            Continue Lesson
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          ) : (
            <GlassCard className="p-8 text-center border-dashed border-white/10">
              <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No courses enrolled yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                Explore our catalog of production courses in Full-Stack, AI/ML, and Algorithms to start learning.
              </p>
              <Link to="/student/courses">
                <Button size="sm" variant="primary">
                  Browse Course Catalog
                </Button>
              </Link>
            </GlassCard>
          )}
        </div>

        {/* Section 2: Trending Learning Shorts & Upcoming Seminars */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learning Shorts Spotlight */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-pink-400" />
                <h2 className="text-lg font-bold text-white">Scrollable Microlearning Shorts</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold uppercase">
                  Reels
                </span>
              </div>
              <Link to="/student/learning-shorts" className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 font-semibold">
                Open Reels Feed <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {trendingShorts.map((short) => (
                <Link key={short._id} to="/student/learning-shorts">
                  <GlassCard className="p-3 h-full group hover:border-pink-500/40 transition-all flex flex-col justify-between">
                    <div>
                      <div className="aspect-[9/12] rounded-lg overflow-hidden bg-slate-800 relative mb-2">
                        <img
                          src={short.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600'}
                          alt={short.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-2">
                          <span className="text-[10px] font-bold text-white bg-slate-950/80 px-1.5 py-0.5 rounded">
                            {short.duration}s
                          </span>
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-2 group-hover:text-pink-300 transition-colors">
                        {short.title}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 mt-2 border-t border-white/5">
                      <span>{short.topic}</span>
                      <span className="text-pink-400 font-semibold">{short.likesCount} ❤️</span>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>

          {/* Upcoming Seminars List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">Live Seminars</h2>
              </div>
              <Link to="/student/seminars" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingSeminars.map((s) => (
                <GlassCard key={s._id} className="p-4 border-white/5">
                  <div className="flex items-start gap-3">
                    <img
                      src={s.speaker?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                      alt={s.speaker?.name}
                      className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider block">
                        {s.category}
                      </span>
                      <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">{s.title}</h4>
                      <p className="text-[11px] text-slate-400 mb-2">
                        {s.speaker?.name} • {s.speaker?.company}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-brand-400" /> {new Date(s.date).toLocaleDateString()}
                        </span>
                        <Link to="/student/seminars">
                          <span className="text-brand-400 font-bold hover:underline">Details →</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
