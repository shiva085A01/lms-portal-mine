import React, { useState, useEffect } from 'react';
import { AdminNavbar } from '../../components/layout/AdminNavbar';
import { GlassCard } from '../../components/ui/GlassCard';
import { StudioTiltCard } from '../../components/ui/StudioTiltCard';
import {
  MessageSquare,
  Star,
  User,
  Calendar,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const res = await api.get('/feedback');
        if (res.success) {
          setFeedbacks(res.data || []);
        }
      } catch {
        toast.error('Failed to load student feedback');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  const averageRating = feedbacks.length
    ? (feedbacks.reduce((acc, f) => acc + (f.rating || 5), 0) / feedbacks.length).toFixed(1)
    : '5.0';

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col font-sans selection:bg-terracotta-500/20 selection:text-terracotta-200">
      <AdminNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900/90 border border-stone-200 dark:border-ink-700/80 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <MessageSquare className="w-3.5 h-3.5" /> Sentiment Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-parchment-50">Student Sentiment Oversight</h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-xl mt-1">
              Aggregated weekly check-in reflections, mastery markers, and reported friction points.
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 px-6 rounded-2xl bg-stone-50 dark:bg-ink-850/90 border border-stone-200 dark:border-ink-700/80 shadow-md">
            <div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-mono tracking-wider">Average Rating</p>
              <p className="text-xl font-serif font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mt-0.5">
                <Star className="w-4 h-4 fill-current text-amber-500 dark:text-amber-400" /> {averageRating} <span className="text-xs text-stone-500 font-sans">/ 5.0</span>
              </p>
            </div>
            <div className="pl-5 border-l border-stone-200 dark:border-ink-700/80">
              <p className="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-mono tracking-wider">Total Submissions</p>
              <p className="text-xl font-serif font-bold text-stone-900 dark:text-parchment-50 mt-0.5">{feedbacks.length}</p>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        {loading ? (
          <div className="space-y-4 pt-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-40 rounded-3xl bg-stone-100 dark:bg-ink-900/60 animate-pulse border border-stone-200 dark:border-ink-800"></div>
            ))}
          </div>
        ) : feedbacks.length > 0 ? (
          <div className="space-y-4 pt-2">
            {feedbacks.map((fb) => (
              <div
                key={fb._id}
                className="p-6 rounded-3xl bg-white dark:bg-ink-850/90 border border-stone-200 dark:border-ink-700/80 hover:border-stone-300 dark:hover:border-ink-600 transition-all shadow-xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-ink-700/70 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-terracotta-500/10 border border-terracotta-500/20 flex items-center justify-center font-serif font-bold text-sm text-terracotta-600 dark:text-terracotta-300">
                      {fb.studentName?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-stone-900 dark:text-parchment-50">{fb.studentName || fb.student?.name}</p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">Week {fb.weekNumber} Academic Submission</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 font-mono font-semibold bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
                      <Star className="w-3.5 h-3.5 fill-current text-amber-500 dark:text-amber-400" /> {fb.rating} Stars
                    </span>
                    <span className="text-[11px] text-stone-400 dark:text-stone-500 font-mono">
                      {new Date(fb.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-ink-900/70 border border-stone-200 dark:border-ink-800">
                    <div className="flex items-center gap-1.5 text-jade-600 dark:text-jade-400 font-mono font-semibold text-[11px] uppercase tracking-wider mb-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Concepts Mastered
                    </div>
                    <p className="text-stone-700 dark:text-parchment-200 leading-relaxed">{fb.learned}</p>
                  </div>

                  {fb.difficulties && (
                    <div className="p-4 rounded-2xl bg-stone-50 dark:bg-ink-900/70 border border-stone-200 dark:border-ink-800">
                      <div className="flex items-center gap-1.5 text-terracotta-600 dark:text-terracotta-400 font-mono font-semibold text-[11px] uppercase tracking-wider mb-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Friction Points & Blockers
                      </div>
                      <p className="text-stone-600 dark:text-stone-300 leading-relaxed">{fb.difficulties}</p>
                    </div>
                  )}
                </div>

                {fb.suggestions && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-700 dark:text-amber-300 font-mono text-[11px] uppercase mr-1.5">Curriculum Suggestion:</strong>
                      <span>{fb.suggestions}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 rounded-3xl bg-white dark:bg-ink-850/60 border border-stone-200 dark:border-ink-700/80 text-center text-xs text-stone-500 dark:text-stone-400 font-mono">
            No student reflections or feedback logged yet.
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminFeedback;
