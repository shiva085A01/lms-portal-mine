import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from './components/ui/GlassCard';
import { Button } from './components/ui/Button';
import { Sparkles, Server, CheckCircle2, ShieldCheck, Video, Brain, BookOpen, Users, Briefcase } from 'lucide-react';
import api from './services/api';

export function App() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkBackendHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/health');
      setHealthStatus(response);
    } catch (err) {
      setError(err.message || 'Could not connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Background ambient gradient orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-600/15 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent-500/15 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-indigo-500/10 blur-[140px] pointer-events-none"></div>

      {/* Top Navigation Bar */}
      <header className="relative z-10 border-b border-white/5 bg-slate-950/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-accent-500 p-0.5 shadow-glow">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-brand-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight gradient-text">LearnSphere</span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-medium">LMS v1.0</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <span className={`w-2 h-2 rounded-full ${healthStatus?.success ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              Backend API: {healthStatus?.success ? 'Online' : 'Checking...'}
            </div>

            <Link to="/login">
              <Button size="sm" variant="glass">
                Sign In
              </Button>
            </Link>

            <Link to="/register">
              <Button size="sm" variant="primary">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-brand-400" />
            PHASE 1: PROJECT SCAFFOLDING COMPLETE
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Next-Gen AI-Powered <br />
            <span className="gradient-text">Learning Management System</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            A production-ready full-stack educational ecosystem featuring automated AI evaluations, Reels-style scrollable microlearning, virtual study rooms, and interactive career pipelines.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/login">
              <Button size="lg" variant="primary" className="shadow-glow">
                Sign In to Portal
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="glass">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>

        {/* System Diagnostics Card */}
        <div className="max-w-2xl mx-auto w-full mb-12">
          <GlassCard className="border-brand-500/20 shadow-glow">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-brand-400" />
                <h3 className="font-semibold text-slate-200">System Diagnostics</h3>
              </div>
              <span className="text-xs text-slate-400">Phase 1 Verification</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-slate-900/60 border border-white/5">
                <span className="text-slate-400">Frontend Environment</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> React 18 + Vite + Tailwind CSS
                </span>
              </div>

              <div className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-slate-900/60 border border-white/5">
                <span className="text-slate-400">Backend Server (Port 5000)</span>
                {healthStatus?.success ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> {healthStatus.message}
                  </span>
                ) : error ? (
                  <span className="text-rose-400 text-xs">{error}</span>
                ) : (
                  <span className="text-amber-400 text-xs">Waiting for server boot...</span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-slate-900/60 border border-white/5">
                <span className="text-slate-400">Next Step</span>
                <span className="text-brand-300 font-medium">Phase 2: MongoDB Atlas Connection</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-slate-200 mb-1">AI Evaluation Engine</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated assignment rubric grading and quiz analytics with instant personalized feedback.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4">
                <Video className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-slate-200 mb-1">Scrollable Learning</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Reels & TikTok-style vertical microlearning short feed with autoplay and course checkpoints.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-slate-200 mb-1">Study Rooms & Seminars</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Peer study groups, webinar registrations, and community learning spaces.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-slate-200 mb-1">Career Command Center</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Resume guidance, DSA roadmaps, interview prep checklists, and placement resources.
              </p>
            </div>
          </GlassCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-4 px-6 text-center text-xs text-slate-500">
        LearnSphere LMS Portal • Built with React, Vite, Tailwind CSS, Node.js, Express & MongoDB Atlas
      </footer>
    </div>
  );
}

export default App;
