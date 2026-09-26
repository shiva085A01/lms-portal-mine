import React, { useState } from 'react';
import { StudioTiltCard } from './StudioTiltCard';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  Play,
  Code2,
  Award,
  Flame,
  ArrowRight,
  HelpCircle,
  Clock,
  Terminal,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const LMSInteractiveHeroCard = () => {
  const [activeTab, setActiveTab] = useState('course'); // 'course' | 'ai' | 'quiz'
  const [quizSelected, setQuizSelected] = useState(null);
  const [lessonProgress, setLessonProgress] = useState(68);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <StudioTiltCard
      className={`p-6 sm:p-7 rounded-3xl border shadow-2xl transition-all duration-300 relative overflow-hidden backdrop-blur-xl ${
        isDark
          ? 'bg-ink-850/95 border-ink-700/80 shadow-terracotta/10'
          : 'bg-white/95 border-stone-200 shadow-xl shadow-stone-200/50'
      }`}
    >
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Header with Interactive Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-ink-750">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-terracotta-500 animate-pulse"></div>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            Interactive LMS Demo
          </span>
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-ink-900 p-1 rounded-2xl border border-stone-200 dark:border-ink-800">
          <button
            type="button"
            onClick={() => setActiveTab('course')}
            className={`px-3 py-1 text-xs font-medium rounded-xl transition-all cursor-pointer ${
              activeTab === 'course'
                ? 'bg-terracotta-500 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-parchment-100'
            }`}
          >
            Course Pod
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1 text-xs font-medium rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'ai'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-parchment-100'
            }`}
          >
            <Sparkles className="w-3 h-3" /> AI Evaluator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1 text-xs font-medium rounded-xl transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-jade-500 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-parchment-100'
            }`}
          >
            Live Quiz
          </button>
        </div>
      </div>

      {/* Tab 1: Course Pod View */}
      {activeTab === 'course' && (
        <div className="space-y-4 pt-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-terracotta-500/10 text-terracotta-600 dark:text-terracotta-400 border border-terracotta-500/20">
                Full-Stack Architecture
              </span>
              <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-parchment-50 mt-1">
                Distributed Microservices & Docker
              </h4>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold">
              <Flame className="w-3.5 h-3.5 fill-current" /> 14-Day Streak
            </div>
          </div>

          {/* Interactive Progress Bar */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-ink-900/80 border border-stone-200 dark:border-ink-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-stone-600 dark:text-stone-400">Curriculum Progress</span>
              <span className="font-bold text-terracotta-600 dark:text-terracotta-400">{lessonProgress}%</span>
            </div>
            <div className="h-2 w-full bg-stone-200 dark:bg-ink-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-terracotta-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${lessonProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[11px] text-stone-500 dark:text-stone-400 pt-1">
              <span>Module 4 of 6</span>
              <button
                type="button"
                onClick={() => setLessonProgress((p) => (p >= 100 ? 25 : p + 8))}
                className="text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium cursor-pointer"
              >
                + Complete Next Step
              </button>
            </div>
          </div>

          {/* Modules list */}
          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-ink-900/60 border border-stone-200 dark:border-ink-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-jade-500 shrink-0" />
                <span className="font-medium text-stone-800 dark:text-stone-200">1. Containerization Fundamentals</span>
              </div>
              <span className="text-[10px] font-mono text-jade-600 dark:text-jade-400 bg-jade-500/10 px-2 py-0.5 rounded-full">Completed</span>
            </div>

            <div className="p-3 rounded-2xl bg-terracotta-500/10 border border-terracotta-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Play className="w-4 h-4 text-terracotta-600 dark:text-terracotta-400 fill-current shrink-0" />
                <span className="font-semibold text-stone-900 dark:text-parchment-50">2. Docker Compose Multi-Node Setup</span>
              </div>
              <span className="text-[10px] font-mono text-terracotta-600 dark:text-terracotta-300 bg-terracotta-500/20 px-2 py-0.5 rounded-full font-bold">In Progress</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Code Evaluator */}
      {activeTab === 'ai' && (
        <div className="space-y-3 pt-4 animate-fade-in text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-stone-900 text-stone-200 dark:bg-ink-950 border border-stone-800 dark:border-ink-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-stone-400 border-b border-stone-800 pb-2">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>AsyncQueue.js</span>
              </div>
              <span className="text-jade-400 font-bold">● AI Analysis Active</span>
            </div>
            <pre className="text-[11px] text-stone-300 overflow-x-auto">
              <code>{`async function processBatch(tasks) {
  return await Promise.all(
    tasks.map(t => worker.execute(t))
  );
}`}</code>
            </pre>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-stone-800 dark:text-stone-200 space-y-1.5 font-sans">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" /> AI Feedback Summary
            </div>
            <p className="text-xs leading-relaxed text-stone-700 dark:text-stone-300">
              Optimal non-blocking concurrency achieved. Time complexity <strong className="font-mono">O(N)</strong> with balanced resource consumption.
            </p>
            <div className="flex gap-2 pt-1">
              <span className="px-2 py-0.5 rounded-md bg-jade-500/15 text-jade-700 dark:text-jade-300 text-[10px] font-mono font-bold">
                ✓ Concurrency Safe
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-mono font-bold">
                ★ 98/100 Score
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Quiz Demo */}
      {activeTab === 'quiz' && (
        <div className="space-y-3 pt-4 animate-fade-in">
          <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 text-xs font-mono">
            <HelpCircle className="w-4 h-4 text-jade-500" />
            <span>Quick Knowledge Check:</span>
          </div>

          <p className="font-serif font-bold text-sm text-stone-900 dark:text-parchment-50">
            Which data structure provides O(1) average lookup time?
          </p>

          <div className="space-y-2 pt-1">
            {[
              { id: 'a', label: 'Binary Search Tree', correct: false },
              { id: 'b', label: 'Hash Table / Map', correct: true },
              { id: 'c', label: 'Linked List', correct: false },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setQuizSelected(opt.id)}
                className={`w-full p-3 rounded-2xl text-left text-xs font-medium border transition-all cursor-pointer flex items-center justify-between ${
                  quizSelected === opt.id
                    ? opt.correct
                      ? 'bg-jade-500/15 border-jade-500 text-jade-700 dark:text-jade-300'
                      : 'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300'
                    : 'bg-stone-50 dark:bg-ink-900/60 border-stone-200 dark:border-ink-800 text-stone-700 dark:text-stone-300 hover:border-stone-400 dark:hover:border-ink-700'
                }`}
              >
                <span>{opt.label}</span>
                {quizSelected === opt.id && (
                  <span className="font-mono text-[10px] font-bold uppercase">
                    {opt.correct ? '✓ Correct!' : '✕ Try Again'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer metric */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-ink-750 text-[11px] text-stone-500 dark:text-stone-400 font-mono mt-4">
        <span>Try interacting with the tabs above</span>
        <span className="text-terracotta-600 dark:text-terracotta-400 font-medium">Real-Time Sync</span>
      </div>
    </StudioTiltCard>
  );
};

export default LMSInteractiveHeroCard;
