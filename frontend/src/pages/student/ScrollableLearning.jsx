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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLike = async () => {
    if (!currentShort) return;
    try {
      const res = await api.post(`/learning-shorts/${currentShort._id}/like`);
      if (res.success) {
        setLikedMap((prev) => ({
          ...prev,
          [currentShort._id]: res.data.isLiked,
        }));
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
    <div className="min-h-screen bg-stone-100 dark:bg-[#121110] text-stone-900 dark:text-[#f5efe6] flex flex-col overflow-hidden">
      <StudentNavbar />

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-2 sm:p-4 max-w-6xl mx-auto w-full gap-8">
        {/* Left Side: Short Info & Controls for Desktop */}
        <div className="hidden lg:flex flex-col justify-center max-w-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold font-mono">
            <Film className="w-3.5 h-3.5" /> Reels-Style Learning
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">
            Vertical Microlearning
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            Absorb bite-sized computer science concepts in under 60 seconds. Swipe up or down to cycle through core architectural topics.
          </p>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#1c1917] border border-stone-200 dark:border-white/10 space-y-2 text-xs shadow-md">
            <div className="flex justify-between text-stone-600 dark:text-stone-400 font-mono">
              <span>Feed Progress</span>
              <span className="text-terracotta-600 dark:text-terracotta-400 font-bold">{currentIndex + 1} / {shorts.length || 1}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-[#121110] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-terracotta-500 to-amber-500 rounded-full transition-all"
                style={{ width: `${((currentIndex + 1) / (shorts.length || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Center: Vertical Video Reel Card */}
        <div className="relative w-full max-w-[390px] sm:max-w-[420px] aspect-[9/16] max-h-[82vh] rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-[#0f0e0c] flex flex-col justify-between">
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
                <span className="text-xs font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 border border-white/10 font-mono">
                  {currentShort.topic}
                </span>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-stone-800"
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
                        ? 'bg-rose-600 text-white shadow-lg'
                        : 'bg-black/50 text-white hover:bg-black/70'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedMap[currentShort._id] ? 'fill-current' : ''}`} />
                  </div>
                  <span className="text-[11px] font-bold text-white drop-shadow font-mono">
                    {currentShort.likesCount || 0}
                  </span>
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-all">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-white drop-shadow">Share</span>
                </button>

                {/* Bookmark Button */}
                <button
                  type="button"
                  onClick={() => toast.success('Short bookmarked to your LMS profile!')}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-all">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-white drop-shadow">Save</span>
                </button>
              </div>

              {/* Bottom Info Gradient Overlay */}
              <div className="relative z-10 p-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent space-y-2 pointer-events-auto">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-terracotta-500/30 border border-terracotta-500/50 flex items-center justify-center text-xs font-bold text-terracotta-300">
                    {currentShort.author?.charAt(0) || 'L'}
                  </div>
                  <span className="text-xs font-bold text-stone-200">{currentShort.author}</span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug drop-shadow">
                  {currentShort.title}
                </h3>

                <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed drop-shadow">
                  {currentShort.description}
                </p>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1.5 pt-1 font-mono">
                  {currentShort.tags?.map((tag, idx) => (
                    <span key={idx} className="text-[10px] text-amber-300 font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-stone-500 text-xs font-mono">
              Loading Reels...
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        <div className="flex flex-row lg:flex-col items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            disabled={currentIndex === 0}
            onClick={handlePrev}
            icon={ChevronUp}
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
          />
          <Button
            size="sm"
            variant="secondary"
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
