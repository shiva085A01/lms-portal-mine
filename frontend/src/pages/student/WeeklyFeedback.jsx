import React, { useState, useEffect } from 'react';
import { StudentNavbar } from '../../components/layout/StudentNavbar';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  MessageSquare,
  Star,
  Send,
  History,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const WeeklyFeedback = () => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [weekNumber, setWeekNumber] = useState(2);
  const [learned, setLearned] = useState('');
  const [difficulties, setDifficulties] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState('High');
  const [loading, setLoading] = useState(false);
  const [pastFeedback, setPastFeedback] = useState([]);

  const fetchPastFeedback = async () => {
    try {
      const res = await api.get('/feedback/my');
      if (res.success) {
        setPastFeedback(res.data || []);
      }
    } catch {
      // Silently catch
    }
  };

  useEffect(() => {
    fetchPastFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!learned.trim()) {
      toast.error('Please share what you learned this week');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/feedback', {
        weekNumber,
        rating,
        learned,
        difficulties,
        suggestions,
        confidenceLevel,
      });

      if (res.success) {
        toast.success('Weekly feedback submitted successfully! Thank you.');
        setLearned('');
        setDifficulties('');
        setSuggestions('');
        fetchPastFeedback();
      }
    } catch (err) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <StudentNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-semibold mb-2">
            <MessageSquare className="w-3.5 h-3.5" /> Continuous Improvement
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Weekly Academic Feedback</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Your feedback directly shapes our curriculum pace, mentor office hours, and assignment rubrics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submission Form */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Week Number & Rating Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Curriculum Week
                    </label>
                    <select
                      value={weekNumber}
                      onChange={(e) => setWeekNumber(parseInt(e.target.value, 10))}
                      className="glass-input w-full text-xs"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((wk) => (
                        <option key={wk} value={wk}>
                          Week {wk} of Term
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Overall Week Rating (1-5 Stars)
                    </label>
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              (hoverRating || rating) >= star
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-400 ml-2">
                        {rating} / 5
                      </span>
                    </div>
                  </div>
                </div>

                {/* What I Learned */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    What key concepts did you master this week? <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={learned}
                    onChange={(e) => setLearned(e.target.value)}
                    placeholder="e.g. Mastered Mongoose index optimization, React memoization with useMemo, and JWT bearer authentication..."
                    className="glass-input w-full text-xs resize-none"
                    required
                  />
                </div>

                {/* Difficulties */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    What topics or bugs felt difficult or unclear?
                  </label>
                  <textarea
                    rows={2}
                    value={difficulties}
                    onChange={(e) => setDifficulties(e.target.value)}
                    placeholder="e.g. Setting up CORS credentials across separate origins, handling token refresh..."
                    className="glass-input w-full text-xs resize-none"
                  />
                </div>

                {/* Suggestions */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Suggestions for mentors or platform features
                  </label>
                  <input
                    type="text"
                    value={suggestions}
                    onChange={(e) => setSuggestions(e.target.value)}
                    placeholder="e.g. More interactive quiz checkpoints in the reels learning feed..."
                    className="glass-input w-full text-xs"
                  />
                </div>

                {/* Confidence Level */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Current Confidence Level:
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['High', 'Medium', 'Low'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setConfidenceLevel(level)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                          confidenceLevel === level
                            ? 'bg-brand-500/20 border-brand-500 text-brand-300 shadow-glow'
                            : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        {level} Confidence
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  isLoading={loading}
                  icon={Send}
                >
                  Submit Weekly Feedback
                </Button>
              </form>
            </GlassCard>
          </div>

          {/* Past Submissions History */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-brand-400" />
              <h3 className="text-sm font-bold text-white">Your Submitted History</h3>
            </div>

            <div className="space-y-3">
              {pastFeedback.length > 0 ? (
                pastFeedback.map((fb) => (
                  <GlassCard key={fb._id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-brand-300">Week {fb.weekNumber}</span>
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-current" /> {fb.rating} / 5
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-snug line-clamp-2">
                      {fb.learned}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-500">
                      <span>Confidence: <strong className="text-slate-300">{fb.confidenceLevel}</strong></span>
                      <span>{new Date(fb.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </GlassCard>
                ))
              ) : (
                <div className="p-6 rounded-xl bg-slate-900/60 border border-white/5 text-center text-xs text-slate-400">
                  No previous feedback submitted yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeeklyFeedback;
