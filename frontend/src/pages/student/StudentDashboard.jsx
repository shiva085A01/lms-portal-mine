import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StudentNavbar } from '../../components/layout/StudentNavbar';
import { Button } from '../../components/ui/Button';
import { StudioTiltCard } from '../../components/ui/StudioTiltCard';
import {
  BookOpen,
  Film,
  Users,
  Video,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  Play,
  Flame,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Heart,
  Share2,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [upcomingSeminars, setUpcomingSeminars] = useState([]);
  const [learningShorts, setLearningShorts] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch enrollments
        const enrollRes = await api.get('/courses/my/enrolled');
        if (enrollRes.success) {
          setEnrolledCourses(enrollRes.data || []);
        }

        // Fetch webinars
        const semRes = await api.get('/seminars');
        if (semRes.success) {
          setUpcomingSeminars((semRes.data || []).slice(0, 3));
        }

        // Fetch reels shorts
        const shortsRes = await api.get('/learning-shorts');
        if (shortsRes.success) {
          setLearningShorts((shortsRes.data || []).slice(0, 4));
        }

        // Fetch certificates
        const certRes = await api.get('/certificates/my');
        if (certRes.success) {
          setCertificates(certRes.data || []);
        }
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalCompletedLessons = enrolledCourses.reduce(
    (acc, e) => acc + (e.completedLessons?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col font-sans transition-colors duration-300">
      <StudentNavbar />

      {/* Subtle Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-terracotta-500/10 blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[150px] pointer-events-none"></div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-500/20 text-terracotta-300 text-xs font-semibold font-mono">
              <Sparkles className="w-3.5 h-3.5 text-terracotta-400 animate-pulse" /> Active Student Curriculum
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Welcome back, <span className="text-amber-300">{user?.name}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
              Track course milestone progress, launch classroom lessons, join live peer study rooms, and complete assignments with AI rubric assessments.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/student/courses">
                <Button size="sm" variant="terracotta" icon={BookOpen} className="text-white shadow-md shadow-terracotta-900/40 font-semibold">
                  Browse Courses
                </Button>
              </Link>
              <Link to="/student/certificates">
                <Button size="sm" variant="outline" icon={Award} className="text-amber-300 border-amber-400/60 hover:bg-amber-400/20 font-semibold">
                  My Certificates ({certificates.length})
                </Button>
              </Link>
              <Link to="/student/learning-shorts">
                <Button size="sm" variant="amber" icon={Film} className="font-semibold text-stone-950 shadow-md shadow-amber-900/40">
                  Learning Shorts
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm">
            <div className="flex items-center justify-between text-stone-600 dark:text-stone-400 mb-2">
              <span className="text-xs font-medium">Enrolled Courses</span>
              <BookOpen className="w-4 h-4 text-terracotta-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-parchment-50">{enrolledCourses.length}</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 font-mono">Active academic tracks</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm">
            <div className="flex items-center justify-between text-stone-600 dark:text-stone-400 mb-2">
              <span className="text-xs font-medium">Lessons Finished</span>
              <CheckCircle2 className="w-4 h-4 text-jade-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-jade-600 dark:text-jade-400">{totalCompletedLessons}</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 font-mono">Completed modules</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm">
            <div className="flex items-center justify-between text-stone-600 dark:text-stone-400 mb-2">
              <span className="text-xs font-medium">Verified Certificates</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-600 dark:text-amber-400">{certificates.length}</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 font-mono">Academic honors</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm">
            <div className="flex items-center justify-between text-stone-600 dark:text-stone-400 mb-2">
              <span className="text-xs font-medium">Upcoming Seminars</span>
              <Video className="w-4 h-4 text-terracotta-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-parchment-50">{upcomingSeminars.length}</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 font-mono">Live masterclasses</p>
          </div>
        </div>

        {/* Section 1: Enrolled Courses & Continue Learning */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-terracotta-500" />
              <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-parchment-50">My Active Courses</h2>
            </div>
            <Link to="/student/courses" className="text-xs text-terracotta-600 dark:text-terracotta-400 hover:underline flex items-center gap-1 font-semibold">
              Explore All Courses <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-44 rounded-3xl bg-stone-200 dark:bg-ink-900/60 animate-pulse border border-stone-300 dark:border-ink-800"></div>
              ))}
            </div>
          ) : enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledCourses.map((enrollment) => {
                const c = enrollment.course;
                if (!c) return null;
                const pct = enrollment.completionPercentage || 0;
                return (
                  <StudioTiltCard key={enrollment._id} className="p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-terracotta-500/10 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-500/20">
                          {c.category || 'Engineering'}
                        </span>
                        <span className="text-stone-500 dark:text-stone-400 font-mono text-xs">{c.duration || '8 weeks'}</span>
                      </div>

                      <h3 className="text-base font-serif font-bold text-stone-900 dark:text-parchment-50 mb-1">{c.title}</h3>
                      <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mb-4 leading-relaxed">{c.description}</p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-stone-100 dark:border-ink-800">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-500 dark:text-stone-400">Course Progress</span>
                        <span className="font-mono font-bold text-terracotta-600 dark:text-terracotta-400">
                          {pct}%
                        </span>
                      </div>

                      <div className="w-full h-2 bg-stone-200 dark:bg-ink-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            pct === 100 ? 'bg-jade-500' : 'bg-gradient-to-r from-terracotta-500 to-amber-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        {enrollment.certificateIssued ? (
                          <span className="text-[11px] font-mono text-jade-600 dark:text-jade-400 font-bold flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" /> Certificate Earned
                          </span>
                        ) : (
                          <span className="text-[11px] text-stone-400 font-mono">
                            {enrollment.completedLessons?.length || 0} Lessons done
                          </span>
                        )}

                        <Link to={`/student/courses/${c._id || c}/learn`}>
                          <Button size="sm" variant="terracotta" icon={Play} className="text-xs py-1 px-3.5">
                            Launch Classroom
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </StudioTiltCard>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm space-y-4">
              <p className="text-sm text-stone-600 dark:text-stone-400 font-medium">You haven&apos;t enrolled in any courses yet.</p>
              <div>
                <Link to="/student/courses">
                  <Button size="sm" variant="terracotta" icon={BookOpen} className="text-white font-semibold shadow-md shadow-terracotta-500/30 px-5 py-2">
                    Browse Catalog & Enroll
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Learning Shorts & Live Seminars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Learning Shorts Preview Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-parchment-50">Quick Learning Shorts (Reels)</h2>
              </div>
              <Link to="/student/learning-shorts" className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold">
                View All Shorts <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {learningShorts.map((short) => (
                <Link to="/student/learning-shorts" key={short._id} className="group">
                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 dark:border-ink-800 shadow-sm">
                    <img
                      src={short.thumbnail}
                      alt={short.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-2.5">
                      <span className="self-start text-[9px] font-mono uppercase bg-black/60 text-amber-300 px-1.5 py-0.5 rounded backdrop-blur-md">
                        {short.category}
                      </span>
                      <div>
                        <p className="text-[11px] font-bold text-white line-clamp-2 leading-tight drop-shadow-md">
                          {short.title}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-stone-300 mt-1 font-mono">
                          <span>❤️ {short.likesCount}</span>
                          <span>👁️ {short.viewsCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Upcoming Seminars Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-parchment-50">Live Webinars</h2>
              </div>
              <Link to="/student/seminars" className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold">
                All Seminars <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingSeminars.map((sem) => (
                <div
                  key={sem._id}
                  className="p-4 rounded-2xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold uppercase">
                      {sem.category}
                    </span>
                    <h4 className="text-xs font-serif font-bold text-stone-900 dark:text-parchment-50 line-clamp-1">{sem.title}</h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-terracotta-500" />
                      {new Date(sem.date).toLocaleDateString()} • {sem.time}
                    </p>
                  </div>
                  <a
                    href={sem.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-xs px-2.5 py-1 rounded-xl bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 transition-colors"
                  >
                    Join
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
