import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { InstructorNavbar } from '../../components/layout/InstructorNavbar';
import { Button } from '../../components/ui/Button';
import {
  BookOpen,
  Users,
  Video,
  FileCheck,
  PlusCircle,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Layers,
  CheckSquare,
  Award,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [seminars, setSeminars] = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalSubmissions: 0,
    pendingSubmissions: 0,
    totalQuizAttempts: 0,
    totalSeminars: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        setLoading(true);
        // Fetch instructor specific analytics from database
        const [analyticsRes, coursesRes, seminarsRes, submissionsRes] = await Promise.all([
          api.get('/analytics/instructor').catch(() => ({ success: false })),
          api.get('/courses/instructor/my-courses').catch(() => ({ success: false })),
          api.get('/seminars').catch(() => ({ success: false })),
          api.get('/submissions/instructor').catch(() => ({ success: false })),
        ]);

        if (analyticsRes.success && analyticsRes.data) {
          setStats({
            totalCourses: analyticsRes.data.totalCourses || 0,
            totalStudents: analyticsRes.data.totalStudents || 0,
            totalSubmissions: analyticsRes.data.totalSubmissions || 0,
            pendingSubmissions: analyticsRes.data.pendingSubmissions || 0,
            totalQuizAttempts: analyticsRes.data.totalQuizAttempts || 0,
            totalSeminars: analyticsRes.data.totalSeminars || 0,
          });
        }

        if (coursesRes.success && coursesRes.data) {
          setCourses(coursesRes.data);
        }

        if (seminarsRes.success && seminarsRes.data) {
          setSeminars(seminarsRes.data.slice(0, 3));
        }

        if (submissionsRes.success && submissionsRes.data) {
          const pending = submissionsRes.data.filter((s) => s.status !== 'graded');
          setPendingSubmissions(pending.slice(0, 4));
        }
      } catch {
        toast.error('Could not load instructor data');
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [user]);

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col font-sans transition-colors duration-300">
      <InstructorNavbar />

      {/* Ambient background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-terracotta-500/10 blur-[150px] pointer-events-none"></div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Faculty Control Hub
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Welcome, <span className="text-amber-300">{user?.name || 'Professor'}</span>!
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
                Manage your curriculum, conduct live masterclasses, evaluate student submissions with automated AI rubric grading, and track learner growth.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/instructor/courses">
                <Button size="md" variant="amber" icon={PlusCircle}>
                  Create Course
                </Button>
              </Link>
              <Link to="/instructor/grading">
                <Button size="md" variant="outline" icon={CheckSquare} className="text-amber-300 border-amber-400/60 hover:bg-amber-400/20">
                  Grade Submissions
                </Button>
              </Link>
              <Link to="/instructor/students">
                <Button size="md" variant="secondary" icon={Users}>
                  Student Roster
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Real Dynamic Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
              <span className="text-xs font-mono font-medium">My Courses</span>
              <BookOpen className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-parchment-50">{stats.totalCourses}</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 font-mono">Published curriculums</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
              <span className="text-xs font-mono font-medium">Enrolled Students</span>
              <Users className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-600 dark:text-amber-400">{stats.totalStudents}</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 font-mono">Learner enrollments</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
              <span className="text-xs font-mono font-medium">Submissions Received</span>
              <CheckSquare className="w-4 h-4 text-terracotta-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-terracotta-600 dark:text-terracotta-400">{stats.totalSubmissions}</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 font-mono">{stats.pendingSubmissions} Pending evaluation</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
              <span className="text-xs font-mono font-medium">Quiz Attempts</span>
              <Award className="w-4 h-4 text-jade-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-jade-600 dark:text-jade-400">{stats.totalQuizAttempts}</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 font-mono">Auto-evaluated tests</p>
          </div>
        </div>

        {/* Section 1: My Courses & Submissions Pending Review */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Courses List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-parchment-50 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                Active Faculty Curriculums
              </h2>
              <Link to="/instructor/courses" className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold">
                Manage Courses <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="h-44 rounded-3xl bg-stone-200 dark:bg-ink-900/60 animate-pulse border border-stone-300 dark:border-ink-800"></div>
            ) : courses.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 space-y-3">
                <p className="text-xs text-stone-500">No courses created yet.</p>
                <Link to="/instructor/courses">
                  <Button size="sm" variant="amber">Create Your First Course</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {courses.slice(0, 3).map((course) => (
                  <div
                    key={course._id}
                    className="p-4 rounded-2xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold">
                        {course.category}
                      </span>
                      <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-white">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[11px] text-stone-500 font-mono">
                        <span>{course.enrolledStudentsCount || 0} Learners Enrolled</span>
                        <span>{course.modules?.length || 0} Modules</span>
                        <span className="text-amber-500 font-bold">{course.rating || 5.0}★</span>
                      </div>
                    </div>

                    <Link to="/instructor/courses">
                      <Button size="sm" variant="secondary" className="text-xs shrink-0">
                        Edit Syllabus
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Submissions Queue */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-parchment-50 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-terracotta-500" />
                Submissions Awaiting Grading
              </h2>
              <Link to="/instructor/grading" className="text-xs text-terracotta-600 dark:text-terracotta-400 hover:underline flex items-center gap-1 font-semibold">
                Evaluation Center <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingSubmissions.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-jade-500 mx-auto" />
                <p className="text-xs text-stone-500">All student submissions are graded!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingSubmissions.map((sub) => (
                  <div
                    key={sub._id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5 truncate">
                      <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate">
                        {sub.assignmentTitle}
                      </h4>
                      <p className="text-[11px] text-stone-500 truncate font-mono">
                        {sub.studentName} • {sub.courseTitle}
                      </p>
                    </div>
                    <Link to="/instructor/grading">
                      <Button size="sm" variant="amber" className="text-xs py-1 px-3 shrink-0">
                        Grade with AI
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;
