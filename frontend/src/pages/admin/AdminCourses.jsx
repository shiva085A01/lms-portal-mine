import React, { useState, useEffect } from 'react';
import { AdminNavbar } from '../../components/layout/AdminNavbar';
import { StudioTiltCard } from '../../components/ui/StudioTiltCard';
import { Button } from '../../components/ui/Button';
import {
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  ShieldCheck,
  Star,
  Users,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/courses/admin/all');
      if (res.success && res.data) {
        setCourses(res.data);
      }
    } catch {
      toast.error('Could not load platform courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleUpdateStatus = async (courseId, newStatus, isPublished) => {
    try {
      setActionLoadingId(courseId);
      const res = await api.put(`/courses/${courseId}/status`, {
        status: newStatus,
        published: isPublished,
      });

      if (res.success) {
        toast.success(`Course status updated to "${newStatus}"!`);
        setCourses((prev) =>
          prev.map((c) => (c._id === courseId ? { ...c, status: newStatus, published: isPublished } : c))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to permanently delete this course and remove all associated enrollments?')) {
      return;
    }

    try {
      setActionLoadingId(courseId);
      const res = await api.delete(`/courses/${courseId}`);
      if (res.success) {
        toast.success('Course deleted from platform');
        setCourses((prev) => prev.filter((c) => c._id !== courseId));
      }
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filtered = courses.filter((c) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.instructorName?.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase());

    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && (c.status === statusFilter || (statusFilter === 'published' && c.published));
  });

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col font-sans selection:bg-terracotta-500/20 selection:text-terracotta-200">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-500/10 text-terracotta-700 dark:text-terracotta-300 text-xs font-semibold font-mono mb-2 border border-terracotta-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Platform Academic Governance
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-white">
              Course Governance & Catalog Moderation
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              Approve instructor curriculums, moderate published tracks, and manage course statuses across the platform.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search course title, faculty, or topic..."
              className="w-full bg-white dark:bg-ink-900 border border-stone-300 dark:border-ink-700 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-terracotta-500"
            />
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['All', 'published', 'pending', 'draft', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-terracotta-500 text-white shadow-sm'
                  : 'bg-white dark:bg-ink-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-ink-800 hover:border-stone-400'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Courses Table / Cards */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-terracotta-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-mono text-xs text-stone-500">Loading platform catalog...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm space-y-3">
            <BookOpen className="w-12 h-12 text-stone-400 mx-auto" />
            <h3 className="text-base font-serif font-bold">No courses found matching criteria</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => {
              const isApproved = course.status === 'published' || course.published;
              return (
                <StudioTiltCard
                  key={course._id}
                  className="p-5 bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-terracotta-500/10 text-terracotta-700 dark:text-terracotta-300">
                        {course.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                          isApproved
                            ? 'bg-jade-500/15 text-jade-700 dark:text-jade-300'
                            : course.status === 'pending'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                            : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {course.status || (course.published ? 'published' : 'draft')}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-serif font-bold text-stone-900 dark:text-white line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-stone-50 dark:bg-ink-850 border border-stone-100 dark:border-ink-800 text-xs font-mono text-stone-600 dark:text-stone-300 space-y-1">
                      <div>Faculty: <strong className="text-stone-900 dark:text-white">{course.instructorName || 'Staff'}</strong></div>
                      <div className="flex justify-between text-[11px] pt-1 border-t border-stone-200 dark:border-ink-750">
                        <span>{course.enrolledStudentsCount || 0} Enrolled</span>
                        <span>{course.modules?.length || 0} Modules</span>
                        <span className="text-amber-500 font-bold">{course.rating || 5.0}★</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 dark:border-ink-800 space-y-2">
                    <div className="flex items-center gap-2">
                      {!isApproved ? (
                        <Button
                          size="sm"
                          variant="jade"
                          icon={CheckCircle2}
                          className="flex-1 text-xs"
                          isLoading={actionLoadingId === course._id}
                          onClick={() => handleUpdateStatus(course._id, 'published', true)}
                        >
                          Approve & Publish
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={XCircle}
                          className="flex-1 text-xs"
                          isLoading={actionLoadingId === course._id}
                          onClick={() => handleUpdateStatus(course._id, 'draft', false)}
                        >
                          Unpublish
                        </Button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteCourse(course._id)}
                        className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 cursor-pointer"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </StudioTiltCard>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCourses;
