import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CompleteShelfLandingPage } from '../shaders/landing-pages/CompleteShelfLandingPage';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import {
  Compass,
  BookOpen,
  Film,
  Users,
  Terminal,
  Sparkles,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Lock,
  CheckCircle2,
  X,
  Layers,
  GraduationCap,
  Star,
  Clock,
  Eye,
  LogIn,
  UserPlus,
} from 'lucide-react';

export function BookshelfPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [selectedVolumeIndex, setSelectedVolumeIndex] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showInspector, setShowInspector] = useState(true);

  // Curated 3D Volume Tracks matching the 3D Bookshelf library
  const volumes = [
    {
      id: 'vol-1',
      title: 'Vol I: Full-Stack MERN & Next.js Architecture',
      instructor: 'Dr. Arvind Raman',
      role: 'Ex-Google Staff Engineer',
      spineColor: 'border-l-4 border-l-terracotta-500',
      badge: 'Bestseller',
      badgeColor: 'bg-terracotta-500/20 text-terracotta-400 border border-terracotta-500/30',
      duration: '12 Weeks',
      modules: 36,
      rating: 4.92,
      description: 'Master modern full-stack development, serverless APIs, MongoDB performance, GraphQL, and production deployment.',
      chapters: [
        'Chapter 1: React 19 Architecture & Server Components',
        'Chapter 2: Scalable REST & GraphQL APIs with Express & NestJS',
        'Chapter 3: RBAC Authentication & JWT Refresh Tokens',
        'Chapter 4: Redis Caching, Docker Containers & Cloud CI/CD',
      ],
      targetRoute: '/student/courses',
    },
    {
      id: 'vol-2',
      title: 'Vol II: Generative AI, RAG & LLM Systems',
      instructor: 'Prof. Elena Rostova',
      role: 'AI Research Lead, Stanford PhD',
      spineColor: 'border-l-4 border-l-amber-500',
      badge: 'Trending 2026',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      duration: '10 Weeks',
      modules: 28,
      rating: 4.96,
      description: 'Build enterprise-grade LLM applications, multimodal RAG pipelines, vector search with Pinecone, and fine-tuning.',
      chapters: [
        'Chapter 1: Transformer Architectures & Attention Mechanisms',
        'Chapter 2: Retrieval Augmented Generation & Vector Indexing',
        'Chapter 3: Autonomous AI Agents & Function Execution',
        'Chapter 4: LoRA Fine-Tuning, Quantization & Latency Bounds',
      ],
      targetRoute: '/student/courses',
    },
    {
      id: 'vol-3',
      title: 'Vol III: DSA Patterns & System Design Architecture',
      instructor: 'Marcus Chen',
      role: 'Principal Systems Architect',
      spineColor: 'border-l-4 border-l-jade-500',
      badge: 'Top Placement',
      badgeColor: 'bg-jade-500/20 text-jade-300 border border-jade-500/30',
      duration: '8 Weeks',
      modules: 48,
      rating: 4.89,
      description: 'Master the top 75 algorithmic patterns (Sliding Window, DP, Graphs) and distributed systems architectures.',
      chapters: [
        'Chapter 1: Array Patterns, Two-Pointers & Monotonic Queues',
        'Chapter 2: Graph Traversals, Dijkstra & Topological Sort',
        'Chapter 3: Dynamic Programming: Memoization & Tabulation',
        'Chapter 4: System Design: Load Balancers, Kafka & Sharding',
      ],
      targetRoute: '/student/courses',
    },
    {
      id: 'vol-4',
      title: 'Vol IV: Cloud Native DevOps & Kubernetes SRE',
      instructor: 'Sarah Jenkins',
      role: 'DevOps Lead & Cloud Consultant',
      spineColor: 'border-l-4 border-l-blue-500',
      badge: 'Industry Essential',
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      duration: '9 Weeks',
      modules: 30,
      rating: 4.87,
      description: 'Hands-on orchestration with Docker, Kubernetes clusters, Terraform infrastructure-as-code, and Prometheus monitoring.',
      chapters: [
        'Chapter 1: Container Hardening & Multi-Stage Docker Builds',
        'Chapter 2: Kubernetes Pods, Ingress & Helm Deployments',
        'Chapter 3: Infrastructure as Code with Terraform & AWS',
        'Chapter 4: Observability with Prometheus & OpenTelemetry',
      ],
      targetRoute: '/student/courses',
    },
  ];

  const currentVolume = volumes[selectedVolumeIndex];

  // Handler when clicking "Read Volume" / "Open Chapters"
  const handleOpenVolume = (volume) => {
    if (isAuthenticated) {
      navigate(volume.targetRoute);
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0a09] text-stone-100 flex flex-col justify-between select-none">
      
      {/* =========================================================================
          1. FIXED TOP NAVBAR (Always Accessible to Switch Options or Return Home)
         ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-xl px-4 sm:px-6 py-3 transition-colors duration-300 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-terracotta-600 via-amber-600 to-terracotta-400 p-0.5 shadow-md shadow-terracotta-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <Compass className="w-4 h-4 text-terracotta-500" />
              </div>
            </div>
            <div>
              <span className="text-lg font-serif font-bold tracking-tight text-white block leading-tight">
                LearnSphere
              </span>
              <span className="text-[10px] text-amber-400 tracking-wider font-semibold uppercase block -mt-0.5 font-mono">
                3D Bookshelf Library
              </span>
            </div>
          </Link>

          {/* Center Fixed Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-stone-300">
            <Link to="/" className="hover:text-terracotta-400 transition-colors flex items-center gap-1">
              <span>Home</span>
            </Link>
            <Link to="/#courses" className="hover:text-terracotta-400 transition-colors flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-terracotta-500" /> Courses
            </Link>
            <Link to="/#shorts" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <Film className="w-3.5 h-3.5 text-amber-500" /> Shorts
            </Link>
            <Link to="/#studyrooms" className="hover:text-jade-400 transition-colors flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-jade-500" /> Study Pods
            </Link>
            <Link to="/#rubric" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-terracotta-500" /> AI Rubric
            </Link>
            <Link
              to="/bookshelf"
              className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20 flex items-center gap-1 font-bold"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> 3D Bookshelf
            </Link>
            <Link to="/#masterclasses" className="hover:text-blue-400 transition-colors flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-500" /> Masterclasses
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle size="sm" />
            
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/student/dashboard">
                  <Button size="sm" variant="terracotta" className="text-xs shadow-md">
                    Student Dashboard
                  </Button>
                </Link>
                <div className="w-8 h-8 rounded-xl bg-terracotta-500/20 border border-terracotta-500/40 flex items-center justify-center font-bold text-xs text-amber-300 font-mono">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button size="sm" variant="secondary" className="text-xs bg-white/10 hover:bg-white/20 border-white/20 text-white">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" variant="terracotta" className="text-xs shadow-md shadow-terracotta-500/25">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. FLOATING BREADCRUMB & RETURN TO HOME BAR (Just Below Navbar)
         ========================================================================= */}
      <div className="fixed top-[64px] left-4 sm:left-6 z-40 flex items-center gap-2.5">
        <Link to="/">
          <Button
            size="sm"
            variant="secondary"
            icon={ArrowLeft}
            className="backdrop-blur-md bg-black/75 border-white/15 hover:bg-black/90 hover:border-amber-500/40 text-xs px-3.5 py-1.5 shadow-xl text-white font-medium cursor-pointer"
          >
            ← Return to Home
          </Button>
        </Link>
        <button
          onClick={() => setShowInspector(!showInspector)}
          className="backdrop-blur-md bg-black/75 border border-white/15 hover:border-amber-500/40 text-xs px-3 py-1.5 rounded-xl shadow-xl text-stone-300 hover:text-white font-mono flex items-center gap-1.5 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          {showInspector ? 'Hide Volume Inspector' : 'Show Volume Inspector'}
        </button>
      </div>

      {/* =========================================================================
          3. 3D THREE.JS CANVAS BACKGROUND & INTERACTIVE SHELF
         ========================================================================= */}
      <div className="w-full h-full pt-16">
        <CompleteShelfLandingPage
          headingFont="iowan-old-style"
          bodyFont="inter"
          headingWeight="400"
          bodyWeight="400"
          primaryColor="#d95d39"
          headingSize={60}
          bodySize={12}
          headingLetterSpacing={-0.055}
          className="w-full h-full"
        />
      </div>

      {/* =========================================================================
          4. FLOATING VOLUME INSPECTOR (Bottom Bar with Chapter Preview & Actions)
         ========================================================================= */}
      {showInspector && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-6 z-40 max-w-5xl mx-auto backdrop-blur-2xl bg-black/85 border border-white/15 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4 animate-fadeIn">
          
          {/* Top Bar: Volume Selector Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> 3D Volumes
              </span>
              <span className="text-[11px] text-stone-400 font-mono hidden md:inline">
                • Click book spine or volume below to inspect chapters
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
              {volumes.map((vol, idx) => (
                <button
                  key={vol.id}
                  type="button"
                  onClick={() => setSelectedVolumeIndex(idx)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                    selectedVolumeIndex === idx
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/30'
                      : 'bg-stone-900/80 text-stone-400 hover:text-white border border-white/10'
                  }`}
                >
                  Vol {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Volume Details & Chapters */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            
            {/* Left 7 Cols: Metadata & Chapters */}
            <div className="lg:col-span-8 space-y-2.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${currentVolume.badgeColor}`}>
                  {currentVolume.badge}
                </span>
                <span className="text-xs font-serif font-bold text-white">
                  {currentVolume.title}
                </span>
                <span className="text-[11px] font-mono text-stone-400">
                  By {currentVolume.instructor}
                </span>
              </div>

              {/* Chapters list preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-stone-300 font-mono">
                {currentVolume.chapters.map((ch, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-1.5 truncate">
                    <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{ch}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 4 Cols: Open Volume Action (Triggers Auth Modal if not signed in) */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch justify-center gap-2 pt-2 lg:pt-0 border-t sm:border-t-0 lg:border-l border-white/10 lg:pl-4">
              <Button
                size="sm"
                variant="amber"
                icon={ArrowRight}
                onClick={() => handleOpenVolume(currentVolume)}
                className="w-full text-xs font-bold py-2.5 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                {isAuthenticated ? 'Open Course Chapter →' : 'Read Chapter (Sign In) →'}
              </Button>
              <div className="text-[10px] text-stone-400 font-mono text-center">
                {isAuthenticated ? '🟢 Full Student Access Active' : '🔒 Login required to track quiz checkpoints'}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          5. INTERACTIVE LOGIN PROMPT MODAL (Triggered when clicking inside a book)
         ========================================================================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-stone-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-5 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-terracotta-500 p-0.5 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                  <Lock className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                Sign In to Read Volume
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                You selected <strong>"{currentVolume.title}"</strong>. Sign in to access full course lessons, AI code evaluations, and verifiable certificates.
              </p>
            </div>

            {/* Quick Benefits */}
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono text-stone-300">
              <div className="flex items-center gap-2 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-jade-400" />
                <span>Line-by-line Gemini AI code rubric review</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-jade-400" />
                <span>Synchronized video lessons & quizzes</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-jade-400" />
                <span>Verifiable digital certificate upon completion</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <Link to="/login?redirect=/bookshelf" className="block">
                <Button size="md" variant="amber" icon={LogIn} className="w-full text-xs font-bold py-3 shadow-md shadow-amber-500/25">
                  Sign In to Continue
                </Button>
              </Link>
              <Link to="/register" className="block">
                <Button size="md" variant="secondary" icon={UserPlus} className="w-full text-xs bg-white/10 hover:bg-white/20 border-white/20 text-white py-3">
                  Create Free Student Account
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-full text-center text-xs font-mono text-stone-400 hover:text-stone-200 py-1 cursor-pointer"
              >
                Continue Exploring 3D Shelf as Guest
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default BookshelfPage;
