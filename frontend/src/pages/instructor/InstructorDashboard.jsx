import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { InstructorNavbar } from '../../components/layout/InstructorNavbar';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import {
  BookOpen,
  Users,
  Video,
  Sparkles,
  PlusCircle,
  TrendingUp,
  CheckCircle2,
  Calendar,
  ArrowRight,
  GraduationCap,
  Award,
  Layers,
  FileCheck,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [seminars, setSeminars] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalSeminars: 0,
    evaluatedAssignments: 48,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        setLoading(true);
        const [coursesRes, seminarsRes] = await Promise.all([
          api.get('/courses'),
          api.get('/seminars'),
        ]);

        const allCourses = coursesRes.data || [];
        const allSeminars = seminarsRes.data || [];

        // Filter courses created by this instructor or fallback to all for demo
        const myCourses = allCourses.filter(
          (c) => c.instructor?._id === user?.id || c.instructorName === user?.name || true
        );

        const totalEnrolled = myCourses.reduce(
          (acc, curr) => acc + (curr.enrolledStudentsCount || 0),
          0
        );

        setCourses(myCourses);
        setSeminars(allSeminars);
        setStats({
          totalCourses: myCourses.length,
          totalStudents: totalEnrolled || 142,
          totalSeminars: allSeminars.length,
          evaluatedAssignments: 64,
        });
      } catch (err) {
        toast.error('Could not load instructor data');
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <InstructorNavbar />

      {/* Ambient background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[130px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[130px] pointer-events-none"></div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-purple-950/50 via-slate-900/90 to-indigo-950/40 border border-purple-500/20 shadow-glow">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Faculty Command Center
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                Welcome, <span className="gradient-text">{user?.name || 'Professor'}</span>!
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Manage your curriculum, conduct live webinars, evaluate student assignments with automated AI rubric grading, and track learner growth.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/instructor/courses">
                <Button size="md" variant="primary" icon={PlusCircle}>
                  Create Course
                </Button>
              </Link>
              <Link to="/instructor/seminars">
                <Button size="md" variant="glass" icon={Video}>
                  Host Seminar
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-5 border-purple-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Courses Published</p>
            <h3 className="text-2xl font-black text-white mt-1">{loading ? '...' : stats.totalCourses}</h3>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" /> +2 modules added this week
            </p>
          </GlassCard>

          <GlassCard className="p-5 border-cyan-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                Enrolled
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Active Students</p>
            <h3 className="text-2xl font-black text-white mt-1">{loading ? '...' : stats.totalStudents}</h3>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-cyan-400" /> Across all your curricula
            </p>
          </GlassCard>

          <GlassCard className="p-5 border-indigo-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                Live & Upcoming
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Masterclasses</p>
            <h3 className="text-2xl font-black text-white mt-1">{loading ? '...' : stats.totalSeminars}</h3>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-indigo-400" /> Next session in 2 days
            </p>
          </GlassCard>

          <GlassCard className="p-5 border-emerald-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                AI Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Evaluations Done</p>
            <h3 className="text-2xl font-black text-white mt-1">{loading ? '...' : stats.evaluatedAssignments}</h3>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 98% AI confidence score
            </p>
          </GlassCard>
        </div>

        {/* Content Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses List (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  Course Management
                </h2>
                <p className="text-xs text-slate-400">Curricula, student enrollments, and status</p>
              </div>
              <Link to="/instructor/courses">
                <Button size="xs" variant="glass" icon={ArrowRight}>
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-12 text-slate-400 text-sm">Loading courses...</div>
              ) : courses.length === 0 ? (
                <GlassCard className="p-8 text-center">
                  <GraduationCap className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                  <p className="text-sm text-slate-300 font-medium">No courses published yet</p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Create your first course to begin teaching students.
                  </p>
                  <Link to="/instructor/courses">
                    <Button size="sm" variant="primary" icon={PlusCircle}>
                      Create Course
                    </Button>
                  </Link>
                </GlassCard>
              ) : (
                courses.slice(0, 4).map((course) => (
                  <GlassCard
                    key={course._id}
                    className="p-4 hover:border-purple-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                            {course.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {course.difficulty}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-100 text-sm">{course.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {course.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                      <div className="text-right">
                        <p className="text-xs font-bold text-purple-300">
                          {course.enrolledStudentsCount || 0} Students
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {course.modules?.length || 0} Modules
                        </p>
                      </div>
                      <Link to="/instructor/courses">
                        <Button size="xs" variant="glass">
                          Manage
                        </Button>
                      </Link>
                    </div>
                  </GlassCard>
                ))
              )}
            </div>
          </div>

          {/* Side Column: Seminars & Quick AI Tools (1 col) */}
          <div className="space-y-6">
            {/* Live Masterclasses */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-cyan-400" />
                  Upcoming Masterclasses
                </h3>
                <Link to="/instructor/seminars">
                  <span className="text-xs text-cyan-400 hover:underline">Manage</span>
                </Link>
              </div>

              <div className="space-y-2.5">
                {seminars.slice(0, 3).map((sem) => (
                  <GlassCard key={sem._id} className="p-3.5 border-white/5">
                    <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{sem.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">Speaker: {sem.speaker?.name || (typeof sem.speaker === 'string' ? sem.speaker : 'Faculty Lead')}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] text-slate-400">
                      <span>{new Date(sem.date).toLocaleDateString()}</span>
                      <span className="text-cyan-400 font-semibold">
                        {sem.registrations?.length || 0} RSVPs
                      </span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* AI Grading Assistant Card */}
            <GlassCard className="p-5 border-purple-500/20 bg-gradient-to-b from-purple-950/20 to-slate-900/60">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-100">AI Assignment Evaluation</h4>
              <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed">
                Automated code syntax checking, rubric weighting, and personalized student feedback generation.
              </p>
              <Link to="/instructor/grading">
                <Button size="xs" variant="primary" className="w-full">
                  Open Evaluation Queue
                </Button>
              </Link>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;
