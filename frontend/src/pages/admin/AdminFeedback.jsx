import React, { useState, useEffect } from 'react';
import { AdminNavbar } from '../../components/layout/AdminNavbar';
import { GlassCard } from '../../components/ui/GlassCard';
import {
  MessageSquare,
  Star,
  User,
  Calendar,
  Sparkles,
  TrendingUp,
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
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <AdminNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-2">
              <MessageSquare className="w-3.5 h-3.5" /> Student Sentiment & Feedback
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Student Feedback Oversight</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Aggregated weekly academic surveys and student difficulties retrieved from MongoDB.
            </p>
          </div>

          <GlassCard className="p-3 px-5 flex items-center gap-4">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Average Rating</p>
              <p className="text-xl font-bold text-amber-400 flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" /> {averageRating} / 5
              </p>
            </div>
            <div className="pl-4 border-l border-white/10">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Responses</p>
              <p className="text-xl font-bold text-white">{feedbacks.length}</p>
            </div>
          </GlassCard>
        </div>

        {/* Feedback List */}
        {loading ? (
          <div className="space-y-4 pt-2">
            {[1, 2].map((n) => (
              <div key={n} className="h-36 rounded-xl bg-slate-900/60 animate-pulse border border-white/5"></div>
            ))}
          </div>
        ) : feedbacks.length > 0 ? (
          <div className="space-y-4 pt-2">
            {feedbacks.map((fb) => (
              <GlassCard key={fb._id} className="p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/40 flex items-center justify-center font-bold text-xs text-brand-300">
                      {fb.studentName?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">{fb.studentName || fb.student?.name}</p>
                      <p className="text-[11px] text-slate-400">Week {fb.weekNumber} Feedback</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <Star className="w-3.5 h-3.5 fill-current" /> {fb.rating} Stars
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(fb.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                      Concepts Mastered:
                    </span>
                    <p className="text-slate-200">{fb.learned}</p>
                  </div>

                  {fb.difficulties && (
                    <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">
                        Reported Difficulties:
                      </span>
                      <p className="text-slate-200">{fb.difficulties}</p>
                    </div>
                  )}
                </div>

                {fb.suggestions && (
                  <div className="text-xs text-slate-400 pt-1">
                    <strong className="text-slate-300">Suggestion:</strong> {fb.suggestions}
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        ) : (
          <GlassCard className="p-12 text-center text-xs text-slate-400">
            No student feedback submitted yet.
          </GlassCard>
        )}
      </main>
    </div>
  );
};

export default AdminFeedback;
