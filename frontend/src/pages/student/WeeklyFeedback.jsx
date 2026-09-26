import React, { useState, useEffect } from 'react';
import { StudentNavbar } from '../../components/layout/StudentNavbar';
import { Button } from '../../components/ui/Button';
import {
  MessageSquare,
  Star,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  History,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const WeeklyFeedback = () => {
  const [weekNumber, setWeekNumber] = useState(1);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [learned, setLearned] = useState('');
  const [difficulties, setDifficulties] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState('High');

  const [pastFeedback, setPastFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPastFeedback = async () => {
    try {
      const res = await api.get('/feedback/my');
      if (res.success) {
        setPastFeedback(res.data || []);
      }
    } catch {
      // Ignore initial load error if endpoint is optional
    }
  };

  useEffect(() => {
    fetchPastFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!learned.trim()) {
      toast.error('Please share what key concepts you learned');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        weekNumber,
        rating,
        learned,
        difficulties,
        suggestions,
        confidenceLevel,
      };

      const res = await api.post('/feedback', payload);
      if (res.success) {
        toast.success('Weekly feedback submitted successfully!');
        setLearned('');
        setDifficulties('');
        setSuggestions('');
        fetchPastFeedback();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col font-sans transition-colors duration-300">
      <StudentNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-500/10 text-terracotta-700 dark:text-terracotta-300 text-xs font-semibold font-mono mb-2 border border-terracotta-500/20">
            <MessageSquare className="w-3.5 h-3.5" /> Continuous Curriculum Improvement
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-parchment-50">Weekly Academic Feedback</h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Your feedback directly shapes our academic curriculum pace, mentor office hours, and assignment rubrics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submission Form */}
          <div className="lg:col-span-2">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Week Number & Rating Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1.5 font-sans">
                      Curriculum Week
                    </label>
                    <select
                      value={weekNumber}
                      onChange={(e) => setWeekNumber(parseInt(e.target.value, 10))}
                      className="w-full text-xs rounded-xl px-3.5 py-2.5 bg-stone-50 dark:bg-ink-950 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white font-sans"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((wk) => (
                        <option key={wk} value={wk}>
                          Week {wk} of Term
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1.5 font-sans">
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
                          className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              (hoverRating || rating) >= star
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-stone-300 dark:text-stone-700'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-2 font-mono">
                        {rating} / 5
                      </span>
                    </div>
                  </div>
                </div>

                {/* What I Learned */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1.5 font-sans">
                    What key concepts did you master this week? <span className="text-terracotta-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={learned}
                    onChange={(e) => setLearned(e.target.value)}
                    placeholder="e.g. Mastered Mongoose index optimization, React memoization with useMemo, and JWT bearer authentication..."
                    className="w-full text-xs rounded-xl p-3 bg-stone-50 dark:bg-ink-950 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white placeholder-stone-400 resize-none font-sans"
                    required
                  />
                </div>

                {/* Difficulties */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1.5 font-sans">
                    What topics or bugs felt difficult or unclear?
                  </label>
                  <textarea
                    rows={2}
                    value={difficulties}
                    onChange={(e) => setDifficulties(e.target.value)}
                    placeholder="e.g. Setting up CORS credentials across separate origins, handling token refresh..."
                    className="w-full text-xs rounded-xl p-3 bg-stone-50 dark:bg-ink-950 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white placeholder-stone-400 resize-none font-sans"
                  />
                </div>

                {/* Suggestions */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1.5 font-sans">
                    Suggestions for mentors or platform features
                  </label>
                  <input
                    type="text"
                    value={suggestions}
                    onChange={(e) => setSuggestions(e.target.value)}
                    placeholder="e.g. More interactive quiz checkpoints in the reels learning feed..."
                    className="w-full text-xs rounded-xl px-3.5 py-2.5 bg-stone-50 dark:bg-ink-950 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white placeholder-stone-400 font-sans"
                  />
                </div>

                {/* Confidence Level */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-2 font-sans">
                    Current Confidence Level:
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['High', 'Medium', 'Low'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setConfidenceLevel(level)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          confidenceLevel === level
                            ? 'bg-terracotta-500/15 border-terracotta-500 text-terracotta-700 dark:text-terracotta-300 shadow-sm'
                            : 'bg-stone-50 dark:bg-ink-950 border-stone-200 dark:border-ink-800 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-ink-700'
                        }`}
                      >
                        {level} Confidence
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="terracotta"
                  size="md"
                  className="w-full"
                  isLoading={loading}
                  icon={Send}
                >
                  Submit Weekly Feedback
                </Button>
              </form>
            </div>
          </div>

          {/* Past Submissions History */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-terracotta-500" />
              <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-parchment-50">Your Submission History</h3>
            </div>

            <div className="space-y-3">
              {pastFeedback.length > 0 ? (
                pastFeedback.map((fb) => (
                  <div key={fb._id} className="p-4 space-y-2 rounded-2xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-terracotta-600 dark:text-terracotta-400 font-mono">Week {fb.weekNumber}</span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold font-mono">
                        <Star className="w-3 h-3 fill-current" /> {fb.rating} / 5
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-snug line-clamp-2">
                      {fb.learned}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-ink-800 text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                      <span>Confidence: <strong className="text-stone-800 dark:text-stone-200">{fb.confidenceLevel}</strong></span>
                      <span>{new Date(fb.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-2xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 text-center text-xs text-stone-500 dark:text-stone-400">
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
