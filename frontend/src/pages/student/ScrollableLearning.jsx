import React, { useState, useEffect, useRef } from 'react';
import { StudentNavbar } from '../../components/layout/StudentNavbar';
import { Button } from '../../components/ui/Button';
import {
  Film,
  Heart,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Share2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const ScrollableLearning = () => {
  const [shorts, setShorts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likedMap, setLikedMap] = useState({});
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const res = await api.get('/learning-shorts');
        if (res.success && res.data) {
          setShorts(res.data);
          // Record view on the first short
          if (res.data.length > 0) {
            api.post(`/learning-shorts/${res.data[0]._id}/view`).catch(() => {});
          }
        }
      } catch {
        toast.error('Failed to load learning shorts');
      }
    };
    fetchShorts();
  }, []);

  const currentShort = shorts[currentIndex] || null;

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Like current short
  const handleLike = async () => {
    if (!currentShort) return;
    try {
      const res = await api.post(`/learning-shorts/${currentShort._id}/like`);
      if (res.success) {
        setLikedMap((prev) => ({
          ...prev,
          [currentShort._id]: res.data.isLiked,
        }));
        // Update local count
        setShorts((prev) =>
          prev.map((s, idx) =>
            idx === currentIndex ? { ...s, likesCount: res.data.likesCount } : s
          )
        );
        toast.success(res.data.isLiked ? 'Liked short!' : 'Removed like');
      }
    } catch {
      toast.error('Could not process like');
    }
  };

  // Next short
  const handleNext = () => {
    if (currentIndex < shorts.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setIsPlaying(true);
      if (shorts[nextIdx]?._id) {
        api.post(`/learning-shorts/${shorts[nextIdx]._id}/view`).catch(() => {});
      }
    }
  };

  // Previous short
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col overflow-hidden">
      <StudentNavbar />

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-2 sm:p-4 max-w-6xl mx-auto w-full gap-6">
        {/* Left Side: Short Info & Controls for Desktop */}
        <div className="hidden lg:flex flex-col justify-center max-w-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold">
            <Film className="w-3.5 h-3.5" /> Reels-Style Learning
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Vertical Microlearning
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Absorb bite-sized computer science concepts in under 60 seconds. Swipe up or down to cycle through core architectural topics.
          </p>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Feed Progress</span>
              <span className="text-brand-400 font-bold">{currentIndex + 1} / {shorts.length || 1}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-pink-500 rounded-full transition-all"
                style={{ width: `${((currentIndex + 1) / (shorts.length || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Center: Vertical Video Reel Card (Mobile: 100vh full-bleed, Desktop: 420px width) */}
        <div className="relative w-full max-w-[390px] sm:max-w-[420px] aspect-[9/16] max-h-[82vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950 flex flex-col justify-between">
          {currentShort ? (
            <>
              {/* HTML5 Video Element */}
              <video
                ref={videoRef}
                key={currentShort._id}
                src={currentShort.videoUrl}
                poster={currentShort.thumbnail}
                autoPlay
                playsInline
                loop
                muted={isMuted}
                onClick={togglePlay}
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              />

              {/* Top Gradient Overlay */}
              <div className="relative z-10 p-4 bg-gradient-to-b from-black/80 via-black/20 to-transparent flex items-center justify-between pointer-events-auto">
                <span className="text-xs font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-pink-300 border border-white/10">
                  {currentShort.topic}
                </span>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-slate-900"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Pause Icon Indicator Overlay */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <Play className="w-8 h-8 fill-current translate-x-0.5" />
                  </div>
                </div>
              )}

              {/* Right Action Floating Column */}
              <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4">
                {/* Like Button */}
                <button
                  type="button"
                  onClick={handleLike}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div
                    className={`w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                      likedMap[currentShort._id]
                        ? 'bg-rose-500/80 text-white shadow-glow'
                        : 'bg-black/40 text-white hover:bg-black/60'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedMap[currentShort._id] ? 'fill-current' : ''}`} />
                  </div>
                  <span className="text-[11px] font-bold text-white drop-shadow">
                    {currentShort.likesCount || 0}
                  </span>
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-all">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-white drop-shadow">Share</span>
                </button>

                {/* Bookmark Button */}
                <button
                  type="button"
                  onClick={() => toast.success('Short bookmarked to your profile!')}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-all">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-white drop-shadow">Save</span>
                </button>
              </div>

              {/* Bottom Info Gradient Overlay */}
              <div className="relative z-10 p-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent space-y-2 pointer-events-auto">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-brand-500/30 border border-brand-500/50 flex items-center justify-center text-xs font-bold text-brand-300">
                    {currentShort.author?.charAt(0) || 'L'}
                  </div>
                  <span className="text-xs font-bold text-slate-200">{currentShort.author}</span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug drop-shadow">
                  {currentShort.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed drop-shadow">
                  {currentShort.description}
                </p>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentShort.tags?.map((tag, idx) => (
                    <span key={idx} className="text-[10px] text-brand-300 font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              Loading Reels...
            </div>
          )}
        </div>

        {/* Right Side Navigation Arrows for Desktop & Tablets */}
        <div className="flex flex-row lg:flex-col items-center gap-3">
          <Button
            size="sm"
            variant="glass"
            disabled={currentIndex === 0}
            onClick={handlePrev}
            icon={ChevronUp}
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
          />
          <Button
            size="sm"
            variant="glass"
            disabled={currentIndex >= shorts.length - 1}
            onClick={handleNext}
            icon={ChevronDown}
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
          />
        </div>
      </main>
    </div>
  );
};

export default ScrollableLearning;
