import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from './components/ui/GlassCard';
import { Button } from './components/ui/Button';
import { VantaGlobe } from './components/ui/VantaGlobe';
import {
  Brain,
  Sparkles,
  BookOpen,
  Video,
  Users,
  Briefcase,
  ArrowRight,
  GraduationCap,
  Star,
  PlayCircle,
  Zap,
  Award,
  BarChart3,
  Shield,
  Layers,
  Compass,
} from 'lucide-react';

export function App() {
  return (
    <div className="relative min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between overflow-x-hidden">
      {/* 3D Vanta Globe Background */}
      <div className="fixed inset-0 z-0 opacity-75 pointer-events-none">
        <VantaGlobe
          color={0xff3f81}
          color2={0x6366f1}
          backgroundColor={0x090d16}
          size={1.0}
          mouseControls={true}
          touchControls={true}
          gyroControls={false}
        />
      </div>

      {/* Ambient Lighting Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-brand-600/15 blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-accent-500/15 blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[45%] left-[50%] -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-indigo-500/10 blur-[160px] pointer-events-none z-0"></div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-accent-500 p-0.5 shadow-glow group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-brand-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight gradient-text block">LearnSphere</span>
              <span className="text-[10px] text-slate-400 tracking-wider font-semibold uppercase block -mt-1">Next-Gen LMS</span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link to="/login" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-slate-400" /> Courses
            </Link>
            <Link to="/login" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
              <Video className="w-4 h-4 text-pink-400" /> Learning Shorts
            </Link>
            <Link to="/login" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" /> Study Rooms
            </Link>
            <Link to="/bookshelf" className="hover:text-brand-400 transition-colors flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> 3D Bookshelf
            </Link>
          </nav>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button size="sm" variant="glass" className="hover:border-white/20">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" variant="primary" className="shadow-glow">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Landing Sections Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col gap-24">
        
        {/* =========================================
            SECTION 1: HERO SECTION
           ========================================= */}
        <section className="text-center max-w-4xl mx-auto pt-6 sm:pt-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-300 text-xs font-semibold mb-8 backdrop-blur-md shadow-inner">
            <Sparkles className="w-4 h-4 text-brand-400 animate-pulse" />
            <span>AI-POWERED INTELLIGENT LEARNING PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.15]">
            Master In-Demand Skills with <br className="hidden sm:inline" />
            <span className="gradient-text">Interactive AI Mentorship</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Accelerate your career with real-time AI code evaluations, TikTok-style bite-sized learning shorts, virtual study pods, and industry placement tracks.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="primary" icon={ArrowRight} className="shadow-glow text-base px-8 py-3.5">
                Explore Portal
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="glass" icon={PlayCircle} className="text-base px-8 py-3.5">
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
            <GlassCard className="py-4 px-3 text-center border-white/5 bg-slate-900/40">
              <div className="text-2xl sm:text-3xl font-black text-white">50+</div>
              <div className="text-xs text-slate-400 mt-0.5">Interactive Courses</div>
            </GlassCard>
            <GlassCard className="py-4 px-3 text-center border-white/5 bg-slate-900/40">
              <div className="text-2xl sm:text-3xl font-black text-brand-400">10k+</div>
              <div className="text-xs text-slate-400 mt-0.5">Active Learners</div>
            </GlassCard>
            <GlassCard className="py-4 px-3 text-center border-white/5 bg-slate-900/40">
              <div className="text-2xl sm:text-3xl font-black text-pink-400">24/7</div>
              <div className="text-xs text-slate-400 mt-0.5">AI Rubric Evaluation</div>
            </GlassCard>
            <GlassCard className="py-4 px-3 text-center border-white/5 bg-slate-900/40">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">96%</div>
              <div className="text-xs text-slate-400 mt-0.5">Placement Rate</div>
            </GlassCard>
          </div>
        </section>

        {/* =========================================
            SECTION 2: CORE PILLARS & FEATURES
           ========================================= */}
        <section className="w-full">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3">
              Built for Modern Learners & Instructors
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Everything you need to upskill, collaborate, and land high-paying roles in one unified platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: AI Evaluation */}
            <GlassCard className="p-6 flex flex-col justify-between group hover:border-brand-500/40 transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">AI Rubric Evaluator</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Automated grading for code, quizzes, and assignments with instant personalized strengths & weaknesses feedback.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-brand-400 group-hover:translate-x-1 transition-transform">
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </GlassCard>

            {/* Feature 2: Scrollable Learning */}
            <GlassCard className="p-6 flex flex-col justify-between group hover:border-pink-500/40 transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-5 group-hover:scale-110 transition-transform">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Bite-Sized Reels</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Vertical microlearning short feed with hands-on code snippets, checkpoint quizzes, and autoplay navigation.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-pink-400 group-hover:translate-x-1 transition-transform">
                <span>Watch Shorts</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </GlassCard>

            {/* Feature 3: Study Pods */}
            <GlassCard className="p-6 flex flex-col justify-between group hover:border-emerald-500/40 transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Virtual Study Rooms</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Collaborative live study spaces, peer discussions, breakout rooms, and live interactive webinars.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>Join a Room</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </GlassCard>

            {/* Feature 4: Career Command Center */}
            <GlassCard className="p-6 flex flex-col justify-between group hover:border-amber-500/40 transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Career Acceleration</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Resume optimization, curated DSA roadmaps, mock technical interview checklists, and recruiter connections.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>Build Career</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </GlassCard>
          </div>
        </section>

        {/* =========================================
            SECTION 3: COURSE & ROADMAP PLACEHOLDER
            (Ready for your custom UI components)
           ========================================= */}
        <section className="w-full">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-2">Curated Curriculum</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Popular Learning Paths</h2>
            </div>
            <Link to="/login" className="text-sm font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all tracks <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6 border-white/10 hover:border-brand-500/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs px-2.5 py-1 rounded-md bg-brand-500/20 text-brand-300 font-semibold">Full-Stack Web</span>
                <span className="text-xs text-slate-400">12 Weeks</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">MERN & Next.js AI Architecture</h3>
              <p className="text-xs text-slate-400 mb-4">Master modern full-stack development, serverless APIs, MongoDB optimization, and AI integrations.</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-slate-300">
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 4.9 (1.2k reviews)</span>
                <span className="font-semibold text-white">Free Access</span>
              </div>
            </GlassCard>

            <GlassCard className="p-6 border-white/10 hover:border-pink-500/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs px-2.5 py-1 rounded-md bg-pink-500/20 text-pink-300 font-semibold">AI & Machine Learning</span>
                <span className="text-xs text-slate-400">8 Weeks</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Generative AI & LLM Engineering</h3>
              <p className="text-xs text-slate-400 mb-4">Build retrieval augmented generation (RAG) pipelines, prompt systems, and fine-tuned embeddings.</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-slate-300">
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 4.95 (840 reviews)</span>
                <span className="font-semibold text-white">Free Access</span>
              </div>
            </GlassCard>

            <GlassCard className="p-6 border-white/10 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold">Career Track</span>
                <span className="text-xs text-slate-400">6 Weeks</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">DSA & System Design Accelerator</h3>
              <p className="text-xs text-slate-400 mb-4">Ace technical interviews at top tier tech companies with daily practice drills and mock evaluation.</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-slate-300">
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 4.88 (2.1k reviews)</span>
                <span className="font-semibold text-white">Free Access</span>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* =========================================
            SECTION 4: CALL TO ACTION BANNER
           ========================================= */}
        <section className="w-full">
          <GlassCard className="p-8 sm:p-12 border-brand-500/30 bg-gradient-to-r from-brand-950/50 via-slate-900/60 to-accent-950/40 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to Level Up Your Skills?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mb-8">
                Join thousands of students and instructors transforming their learning with AI mentorship and collaborative study pods.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" variant="primary" icon={ArrowRight} className="shadow-glow px-8">
                    Create Free Account
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="glass" className="px-8">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </section>

      </main>

      {/* =========================================
          SECTION 5: FOOTER
         ========================================= */}
      <footer className="relative z-10 border-t border-white/5 bg-slate-950/80 backdrop-blur-md pt-12 pb-6 px-6 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-accent-500 p-0.5">
                <div className="w-full h-full bg-[#090d16] rounded-[6px] flex items-center justify-center">
                  <Brain className="w-4 h-4 text-brand-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white">LearnSphere</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering the next generation of engineers with AI evaluation, bite-sized shorts, and interactive study rooms.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-white transition-colors">Course Catalog</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Learning Shorts</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Study Rooms</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Live Seminars</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-white transition-colors">Student Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Instructor Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Admin Command Center</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">AI Evaluation Demo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-white transition-colors">Career Roadmaps</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">DSA Cheat Sheets</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Weekly Feedback</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} LearnSphere LMS Portal. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
