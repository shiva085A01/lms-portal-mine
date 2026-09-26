import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Lock,
  CheckCircle2,
  X,
  LogIn,
  UserPlus,
} from 'lucide-react';

export function BookshelfPage() {
  const { isAuthenticated, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

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
          2. FLOATING RETURN TO HOME BUTTON (Just Below Fixed Navbar)
         ========================================================================= */}
      <div className="fixed top-[68px] left-4 sm:left-6 z-40 flex items-center">
        <Link to="/">
          <Button
            size="sm"
            variant="secondary"
            icon={ArrowLeft}
            className="backdrop-blur-md bg-black/80 border-white/20 hover:bg-black hover:border-amber-500/50 text-xs px-3.5 py-1.5 shadow-2xl text-white font-semibold cursor-pointer"
          >
            ← Return to Home
          </Button>
        </Link>
      </div>

      {/* =========================================================================
          3. 3D THREE.JS CANVAS & INTERACTIVE BOOKSHELF (Clean & Unobstructed)
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
          4. INTERACTIVE LOGIN PROMPT MODAL (Triggered when clicking inside a book)
         ========================================================================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-stone-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-5 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
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
                Sign In to Access Module
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Sign in to your LearnSphere student account to open active course chapters, access code assignments, and receive automated Gemini AI rubric evaluations.
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
