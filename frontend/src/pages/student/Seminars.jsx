import React, { useState, useEffect } from 'react';
import { StudentNavbar } from '../../components/layout/StudentNavbar';
import { Button } from '../../components/ui/Button';
import { StudioTiltCard } from '../../components/ui/StudioTiltCard';
import {
  Video,
  Calendar,
  Clock,
  ExternalLink,
  Users,
  Sparkles,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export const Seminars = () => {
  const { user } = useAuth();
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rsvpLoadingId, setRsvpLoadingId] = useState(null);

  const fetchSeminars = async () => {
    try {
      setLoading(true);
      const res = await api.get('/seminars');
      if (res.success) {
        setSeminars(res.data || []);
      }
    } catch {
      toast.error('Failed to load seminars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeminars();
  }, []);

  const handleRSVP = async (seminarId) => {
    try {
      setRsvpLoadingId(seminarId);
      const res = await api.post(`/seminars/${seminarId}/register`);
      if (res.success) {
        toast.success('Successfully registered for seminar!');
        fetchSeminars();
      }
    } catch (err) {
      toast.error(err.message || 'RSVP failed');
    } finally {
      setRsvpLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col font-sans transition-colors duration-300">
      <StudentNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold font-mono mb-2 border border-amber-500/20">
              <Video className="w-3.5 h-3.5" /> Technical Seminars & Masterclasses
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-parchment-50">Live Industry Webinars</h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              Join live masterclasses hosted by staff engineers, architects, and industry leaders.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-72 rounded-3xl bg-stone-200 dark:bg-ink-900/60 animate-pulse border border-stone-300 dark:border-ink-800"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {seminars.map((seminar) => {
              const isRegistered = seminar.registrations?.some(
                (regId) => (regId._id || regId).toString() === user?.id
              );
              return (
                <StudioTiltCard key={seminar._id} className="p-0 overflow-hidden flex flex-col justify-between group">
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-[21/9] w-full bg-stone-900 overflow-hidden">
                      <img
                        src={seminar.thumbnail}
                        alt={seminar.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-stone-900/90 text-amber-300 backdrop-blur-md border border-stone-800 font-mono">
                          {seminar.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-terracotta-500" />
                          {new Date(seminar.date).toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          {seminar.time} ({seminar.duration})
                        </span>
                      </div>

                      <h3 className="text-base font-serif font-bold text-stone-900 dark:text-parchment-50 group-hover:text-terracotta-600 dark:group-hover:text-amber-300 transition-colors">
                        {seminar.title}
                      </h3>

                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        {seminar.description}
                      </p>

                      {/* Speaker Profile */}
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-ink-900 border border-stone-200 dark:border-ink-800">
                        <img
                          src={seminar.speaker?.avatar}
                          alt={seminar.speaker?.name}
                          className="w-10 h-10 rounded-full object-cover border border-stone-300 dark:border-ink-700 shrink-0"
                        />
                        <div className="text-xs">
                          <p className="font-bold text-stone-900 dark:text-white">{seminar.speaker?.name}</p>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">
                            {seminar.speaker?.role} • {seminar.speaker?.company}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-mono pt-1">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-amber-500" />
                          {seminar.registrations?.length || 0} Registered Attendees
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-5 pt-0 border-t border-stone-100 dark:border-ink-800 flex items-center justify-between mt-2">
                    {seminar.meetingLink && isRegistered ? (
                      <a
                        href={seminar.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-terracotta-600 dark:text-terracotta-400 hover:underline font-semibold"
                      >
                        Join Live Broadcast <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-stone-500 dark:text-stone-400">
                        {isRegistered ? 'RSVP Confirmed' : 'Registration Open'}
                      </span>
                    )}

                    <Button
                      size="sm"
                      variant={isRegistered ? 'secondary' : 'terracotta'}
                      onClick={() => !isRegistered && handleRSVP(seminar._id)}
                      disabled={isRegistered}
                      isLoading={rsvpLoadingId === seminar._id}
                      icon={isRegistered ? CheckCircle2 : undefined}
                      className="text-xs"
                    >
                      {isRegistered ? 'Registered' : 'Reserve Seat (Free)'}
                    </Button>
                  </div>
                </StudioTiltCard>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Seminars;
