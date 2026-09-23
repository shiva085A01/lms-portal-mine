import React, { useState, useEffect } from 'react';
import { StudentNavbar } from '../../components/layout/StudentNavbar';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import {
  Video,
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const Seminars = () => {
  const { user } = useAuth();
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);

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

  const handleRegister = async (seminarId) => {
    try {
      setRegisteringId(seminarId);
      const res = await api.post(`/seminars/${seminarId}/register`);
      if (res.success) {
        toast.success('Registered for webinar! Meeting link ready.');
        fetchSeminars();
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <StudentNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 text-xs font-semibold mb-2">
            <Video className="w-3.5 h-3.5" /> Industry Tech Talks & Webinars
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Live Seminars & Masterclasses</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Interactive virtual sessions led by principal architects, engineering managers, and industry researchers.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-72 rounded-2xl bg-slate-900/60 animate-pulse border border-white/5"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {seminars.map((seminar) => {
              const isRegistered = seminar.registrations?.some(
                (regId) => (regId._id || regId).toString() === user?.id
              );
              return (
                <GlassCard key={seminar._id} className="p-0 overflow-hidden flex flex-col justify-between group">
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-[21/9] w-full bg-slate-800 overflow-hidden">
                      <img
                        src={seminar.thumbnail}
                        alt={seminar.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950/80 text-pink-300 backdrop-blur-md border border-white/10">
                          {seminar.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-brand-400" />
                          {new Date(seminar.date).toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          {seminar.time} ({seminar.duration})
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">
                        {seminar.title}
                      </h3>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {seminar.description}
                      </p>

                      {/* Speaker Profile */}
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                        <img
                          src={seminar.speaker?.avatar}
                          alt={seminar.speaker?.name}
                          className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                        />
                        <div className="text-xs">
                          <p className="font-bold text-white">{seminar.speaker?.name}</p>
                          <p className="text-[11px] text-slate-400">
                            {seminar.speaker?.role} • {seminar.speaker?.company}
                          </p>
                        </div>
                      </div>

                      {/* Key Takeaways */}
                      {seminar.keyTakeaways?.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                            Key Takeaways
                          </span>
                          {seminar.keyTakeaways.map((point, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
                    <span className="text-xs text-slate-400">
                      {seminar.registrations?.length || 0} Registered
                    </span>

                    {isRegistered ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <UserCheck className="w-4 h-4" /> Registered
                        </span>
                        <a
                          href={seminar.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button size="sm" variant="primary" icon={ExternalLink}>
                            Join Session
                          </Button>
                        </a>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="primary"
                        isLoading={registeringId === seminar._id}
                        onClick={() => handleRegister(seminar._id)}
                      >
                        Reserve Free Seat
                      </Button>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Seminars;
