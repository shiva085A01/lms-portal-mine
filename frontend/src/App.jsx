import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './components/ui/Button';
import { StudioTiltCard } from './components/ui/StudioTiltCard';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { InteractiveBackground } from './components/ui/InteractiveBackground';
import { LMSInteractiveHeroCard } from './components/ui/LMSInteractiveHeroCard';
import { ThreeGlobeHero } from './components/ui/ThreeGlobeHero';
import { useTheme } from './context/ThemeContext';
import {
  Compass,
  Sparkles,
  BookOpen,
  Film,
  Users,
  Briefcase,
  ArrowRight,
  PlayCircle,
  Zap,
  Award,
  BarChart3,
  ShieldCheck,
  Layers,
  Star,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Terminal,
  GraduationCap,
  Cpu,
} from 'lucide-react';

export function App() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [heroView, setHeroView] = useState('globe'); // 'globe' | 'simulator'
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const faqs = [
    {
      q: 'How does the AI Rubric Evaluation work?',
      a: 'Our Gemini AI engine evaluates your code submissions line-by-line according to industry software standards, calculating algorithmic complexity, security checks, and offering constructive strengths and areas for improvement.',
    },
    {
      q: 'What are Learning Shorts (Reels)?',
      a: 'Learning Shorts are bite-sized, 30-to-60 second vertical educational videos covering core algorithms, design patterns, and code tips with synchronized quiz checkpoints.',
    },
    {
      q: 'Can instructors track and grade student submissions automatically?',
      a: 'Yes. Faculty dashboards provide instant AI pre-grading, customizable rubric sliders, attendee tracking for webinars, and full student performance analytics.',
    },
    {
      q: 'What is the Interactive 3D Module Library?',
      a: 'The 3D Bookshelf renders full-dimensional volume geometry representing curated engineering tracks, allowing tactile exploration and 1-click chapter launching.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-parchment-50 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col justify-between overflow-x-hidden selection:bg-terracotta-500 selection:text-white font-sans transition-colors duration-300">
      {/* Dynamic Interactive Canvas Background that responds to mouse movement & clicks */}
      <InteractiveBackground />

      {/* Subtle Warm Ambient Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-terracotta-500/10 blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[150px] pointer-events-none z-0"></div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-stone-200/80 dark:border-ink-800/80 bg-white/95 dark:bg-ink-900/95 backdrop-blur-xl px-4 sm:px-6 py-3.5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-terracotta-600 via-amber-600 to-terracotta-400 p-0.5 shadow-md shadow-terracotta-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white dark:bg-ink-900 rounded-[14px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-terracotta-500" />
              </div>
            </div>
            <div>
              <span className="text-xl font-serif font-bold tracking-tight text-stone-900 dark:text-white block leading-tight">
                LearnSphere
              </span>
              <span className="text-[10px] text-terracotta-600 dark:text-amber-400 tracking-wider font-semibold uppercase block -mt-0.5 font-mono">
                Learning Management System
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-stone-700 dark:text-stone-200">
            <Link to="/login" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-terracotta-500" /> Courses
            </Link>
            <Link to="/login" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <Film className="w-4 h-4 text-amber-500" /> Learning Shorts
            </Link>
            <Link to="/login" className="hover:text-jade-600 dark:hover:text-jade-400 transition-colors flex items-center gap-1.5">
              <Users className="w-4 h-4 text-jade-500" /> Study Rooms
            </Link>
            <Link to="/bookshelf" className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /> 3D Bookshelf
            </Link>
          </nav>

          {/* Actions & Theme Toggle */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button size="sm" variant="secondary" className="text-xs">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" variant="terracotta" className="text-xs shadow-md shadow-terracotta-500/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex-1 flex flex-col gap-24 sm:gap-32">
        
        {/* =========================================
            SECTION 1: HERO & INTERACTIVE LMS CARD
           ========================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pt-2 sm:pt-6">
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta-500/10 border border-terracotta-500/25 text-terracotta-700 dark:text-terracotta-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-terracotta-500 animate-pulse" />
              <span className="font-mono uppercase tracking-wider text-[11px]">Next-Generation LMS Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 dark:text-white leading-[1.12]">
              Master In-Demand Skills with{' '}
              <span className="editorial-heading italic font-normal text-terracotta-600 dark:text-amber-300">
                Interactive Learning
              </span>{' '}
              & AI Mentorship
            </h1>

            <p className="text-stone-600 dark:text-stone-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Accelerate your engineering journey with real-time AI code evaluations, Reels-style bite-sized learning shorts, collaborative peer study pods, and 3D bookshelf curriculums.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link to="/register">
                <Button size="lg" variant="terracotta" icon={ArrowRight} className="shadow-lg shadow-terracotta-500/25 text-sm px-7 py-3.5">
                  Explore LMS Portal
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary" icon={PlayCircle} className="text-sm px-7 py-3.5">
                  Sign In to LMS
                </Button>
              </Link>
            </div>

            {/* Live Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-stone-200 dark:border-ink-800">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-ink-850 border border-stone-200 dark:border-ink-800 shadow-sm">
                <div className="text-2xl font-serif font-bold text-stone-900 dark:text-white">50+</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">Curated Courses</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-ink-850 border border-stone-200 dark:border-ink-800 shadow-sm">
                <div className="text-2xl font-serif font-bold text-terracotta-600 dark:text-terracotta-400">10k+</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">Active Learners</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-ink-850 border border-stone-200 dark:border-ink-800 shadow-sm">
                <div className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400">24/7</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">AI Code Rubrics</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-ink-850 border border-stone-200 dark:border-ink-800 shadow-sm">
                <div className="text-2xl font-serif font-bold text-jade-600 dark:text-jade-400">96%</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">Career Placement</div>
              </div>
            </div>
          </div>

          {/* Interactive 3D Globe & LMS Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center w-full space-y-3">
            {/* Showcase Mode Switcher */}
            <div className="inline-flex p-1 rounded-2xl bg-stone-200/80 dark:bg-ink-850/80 border border-stone-300/80 dark:border-ink-700/80 text-xs font-semibold backdrop-blur-md">
              <button
                type="button"
                onClick={() => setHeroView('globe')}
                className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                  heroView === 'globe'
                    ? 'bg-terracotta-500 text-white shadow-md shadow-terracotta-500/30'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-parchment-100'
                }`}
              >
                3D Knowledge Globe
              </button>
              <button
                type="button"
                onClick={() => setHeroView('simulator')}
                className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                  heroView === 'simulator'
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-parchment-100'
                }`}
              >
                Interactive LMS Hub
              </button>
            </div>

            <div className="w-full max-w-lg">
              {heroView === 'globe' ? (
                <ThreeGlobeHero />
              ) : (
                <LMSInteractiveHeroCard />
              )}
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 2: 4 CORE LMS PILLARS
           ========================================= */}
        <section className="w-full space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-terracotta-600 dark:text-amber-400 font-mono">
              Core Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white">
              Engineered for High-Impact Learning
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              Four unified modules engineered to master complex concepts through interaction, feedback, and collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: AI Evaluation */}
            <StudioTiltCard className="p-6 flex flex-col justify-between group bg-white dark:bg-ink-850 border-stone-200 dark:border-ink-700/80 shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-terracotta-500/10 dark:bg-terracotta-500/20 border border-terracotta-500/30 flex items-center justify-center text-terracotta-600 dark:text-terracotta-400 group-hover:scale-110 transition-transform">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white">AI Rubric Evaluator</h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  Automated line-by-line code reviews, time/space complexity analysis, and actionable personalized feedback powered by Gemini.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-ink-800 flex items-center text-xs font-semibold text-terracotta-600 dark:text-terracotta-400 group-hover:translate-x-1 transition-transform">
                <span>Try evaluator</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </StudioTiltCard>

            {/* Feature 2: Scrollable Learning Shorts */}
            <StudioTiltCard className="p-6 flex flex-col justify-between group bg-white dark:bg-ink-850 border-stone-200 dark:border-ink-700/80 shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                  <Film className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white">Bite-Sized Reels</h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  Vertical microlearning feed with hands-on video snippets, embedded code walkthroughs, and checkpoint drill quizzes.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-ink-800 flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>Watch Shorts</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </StudioTiltCard>

            {/* Feature 3: Virtual Study Pods */}
            <StudioTiltCard className="p-6 flex flex-col justify-between group bg-white dark:bg-ink-850 border-stone-200 dark:border-ink-700/80 shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-jade-500/10 dark:bg-jade-500/20 border border-jade-500/30 flex items-center justify-center text-jade-600 dark:text-jade-400 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white">Virtual Study Rooms</h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  Join real-time peer study pods, track focus with built-in Pomodoro goals, and participate in scheduled live webinars.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-ink-800 flex items-center text-xs font-semibold text-jade-600 dark:text-jade-400 group-hover:translate-x-1 transition-transform">
                <span>Join Study Pod</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </StudioTiltCard>

            {/* Feature 4: Career Hub */}
            <StudioTiltCard className="p-6 flex flex-col justify-between group bg-white dark:bg-ink-850 border-stone-200 dark:border-ink-700/80 shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-terracotta-500/10 dark:bg-terracotta-500/20 border border-terracotta-500/30 flex items-center justify-center text-terracotta-600 dark:text-terracotta-400 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white">Career Acceleration</h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  ATS resume checklists, curated top 75 algorithmic patterns, system design frameworks, and industry roadmaps.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-ink-800 flex items-center text-xs font-semibold text-terracotta-600 dark:text-terracotta-400 group-hover:translate-x-1 transition-transform">
                <span>Explore Careers</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </StudioTiltCard>
          </div>
        </section>

        {/* =========================================
            SECTION 3: 3D INTERACTIVE BOOKSHELF SHOWCASE
           ========================================= */}
        <section className="rounded-3xl p-8 sm:p-12 border border-stone-200 dark:border-terracotta-500/30 bg-gradient-to-br from-stone-100 via-stone-50 to-white dark:from-ink-900 dark:via-ink-850 dark:to-ink-900 relative overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> 3D Volume Exploration
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white">
                Interactive Three.js Module Library
              </h2>
              <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed max-w-xl">
                Experience course materials rendered as real-time 3D books. Inspect spines, rotate dimensional volumes, and jump directly into active learning chapters.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link to="/bookshelf">
                  <Button size="md" variant="amber" icon={ArrowRight}>
                    Launch 3D Bookshelf
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="md" variant="secondary">
                    View Enrolled Courses
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="p-6 rounded-3xl bg-white dark:bg-ink-950 border border-stone-200 dark:border-ink-800 text-center space-y-3 w-full max-w-sm shadow-md">
                <div className="aspect-video w-full rounded-2xl bg-stone-100 dark:bg-ink-900 flex flex-col items-center justify-center border border-stone-200 dark:border-ink-800 text-xs text-stone-500 font-mono gap-2 p-4">
                  <BookOpen className="w-8 h-8 text-amber-500" />
                  <span className="dark:text-stone-400">[ 3D Bookshelf Engine Ready ]</span>
                </div>
                <div className="text-left space-y-1">
                  <div className="text-xs font-bold text-stone-900 dark:text-white">Working Volumes Shelf v2.0</div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">Three.js WebGL Architecture with route bindings</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 4: POPULAR CURRICULUM PATHS
           ========================================= */}
        <section className="w-full space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-terracotta-600 dark:text-amber-400 font-mono">
                Industry Curricula
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-white">
                Popular Learning Tracks
              </h2>
            </div>
            <Link to="/login" className="text-xs font-semibold text-terracotta-600 dark:text-amber-400 hover:underline flex items-center gap-1">
              View all courses <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StudioTiltCard className="p-6 bg-white dark:bg-ink-850 border-stone-200 dark:border-ink-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs px-2.5 py-1 rounded-full bg-terracotta-500/10 text-terracotta-700 dark:text-terracotta-300 font-semibold border border-terracotta-500/20 font-mono">
                  Full-Stack Web
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">12 Weeks</span>
              </div>
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-white mb-2">
                Modern MERN & Next.js Architecture
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mb-4 leading-relaxed">
                Master modern full-stack development, serverless APIs, MongoDB optimization, and AI integrations.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-ink-800 text-xs text-stone-600 dark:text-stone-300">
                <span className="flex items-center gap-1 font-mono">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> 4.9 (1.2k reviews)
                </span>
                <span className="font-semibold text-terracotta-600 dark:text-amber-400">Free Access</span>
              </div>
            </StudioTiltCard>

            <StudioTiltCard className="p-6 bg-white dark:bg-ink-850 border-stone-200 dark:border-ink-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold border border-amber-500/20 font-mono">
                  AI & ML
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">8 Weeks</span>
              </div>
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-white mb-2">
                Generative AI & LLM Engineering
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mb-4 leading-relaxed">
                Build retrieval augmented generation (RAG) pipelines, prompt systems, and fine-tuned embeddings.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-ink-800 text-xs text-stone-600 dark:text-stone-300">
                <span className="flex items-center gap-1 font-mono">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> 4.95 (840 reviews)
                </span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">Free Access</span>
              </div>
            </StudioTiltCard>

            <StudioTiltCard className="p-6 bg-white dark:bg-ink-850 border-stone-200 dark:border-ink-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs px-2.5 py-1 rounded-full bg-jade-500/10 text-jade-700 dark:text-jade-300 font-semibold border border-jade-500/20 font-mono">
                  Career Track
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">6 Weeks</span>
              </div>
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-white mb-2">
                DSA & System Design Accelerator
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mb-4 leading-relaxed">
                Ace technical interviews at top tier tech companies with daily practice drills and mock evaluation.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-ink-800 text-xs text-stone-600 dark:text-stone-300">
                <span className="flex items-center gap-1 font-mono">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> 4.88 (2.1k reviews)
                </span>
                <span className="font-semibold text-jade-600 dark:text-jade-400">Free Access</span>
              </div>
            </StudioTiltCard>
          </div>
        </section>

        {/* =========================================
            SECTION 5: FREQUENTLY ASKED QUESTIONS
           ========================================= */}
        <section className="w-full max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-500/10 text-terracotta-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider font-mono border border-terracotta-500/20">
              <HelpCircle className="w-3.5 h-3.5 text-terracotta-500" /> Got Questions?
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
              Learn how LearnSphere accelerates both individual learners and academic institutions.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-ink-900/90 border border-stone-200 dark:border-ink-800 overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between text-sm font-semibold text-stone-900 dark:text-white hover:text-terracotta-600 dark:hover:text-amber-400 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeFaq === idx ? 'rotate-180 text-terracotta-500' : 'text-stone-400'}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-stone-700 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-ink-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            SECTION 6: CTA BANNER
           ========================================= */}
        <section className="w-full">
          <div className="p-8 sm:p-12 rounded-3xl border border-stone-200 dark:border-ink-800 bg-white dark:bg-ink-900 text-center relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white">
                Ready to Start Learning?
              </h2>
              <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
                Join thousands of students and instructors transforming their education with AI code mentorship, interactive 3D bookshelves, and peer study pods.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Link to="/register">
                  <Button size="lg" variant="terracotta" icon={ArrowRight} className="shadow-lg shadow-terracotta-500/25 px-8">
                    Create Free Account
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="secondary" className="px-8">
                    Sign In to Portal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-stone-200 dark:border-ink-800 bg-white/95 dark:bg-ink-950/95 backdrop-blur-md pt-12 pb-6 px-6 text-stone-500 dark:text-stone-400 text-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-terracotta-600 to-amber-500 p-0.5 shadow-sm">
                <div className="w-full h-full bg-white dark:bg-ink-900 rounded-[10px] flex items-center justify-center">
                  <Compass className="w-4 h-4 text-terracotta-500" />
                </div>
              </div>
              <span className="text-base font-serif font-bold text-stone-900 dark:text-parchment-50">LearnSphere LMS</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Empowering engineers and educators through AI code evaluation, bite-sized shorts, and interactive 3D modules.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono font-semibold text-stone-900 dark:text-parchment-50 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">Course Catalog</Link></li>
              <li><Link to="/login" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">Learning Shorts</Link></li>
              <li><Link to="/login" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">Study Rooms</Link></li>
              <li><Link to="/bookshelf" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">3D Bookshelf</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-semibold text-stone-900 dark:text-parchment-50 uppercase tracking-wider mb-3">Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">Student Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">Instructor Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">Admin Console</Link></li>
              <li><Link to="/login" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">AI Evaluation Hub</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-semibold text-stone-900 dark:text-parchment-50 uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">Career Roadmaps</Link></li>
              <li><Link to="/login" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">DSA Patterns</Link></li>
              <li><Link to="/login" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">System Design</Link></li>
              <li><Link to="/login" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">Weekly Feedback</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-stone-200 dark:border-ink-850 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} LearnSphere Learning Management System. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-700 dark:hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-700 dark:hover:text-stone-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-700 dark:hover:text-stone-300 cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
