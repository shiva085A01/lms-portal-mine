import React, { useState, useEffect } from 'react';
import { AdminNavbar } from '../../components/layout/AdminNavbar';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StudioTiltCard } from '../../components/ui/StudioTiltCard';
import {
  Video,
  Plus,
  Calendar,
  Clock,
  ExternalLink,
  Users,
  Sparkles,
  Layers,
  X,
  Radio,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminSeminars = () => {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSeminar, setNewSeminar] = useState({
    title: '',
    description: '',
    category: 'Full-Stack',
    speakerName: '',
    speakerRole: '',
    speakerCompany: '',
    date: '',
    time: '06:00 PM EST',
    duration: '90 mins',
    meetingLink: '',
  });

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

  const handleCreateSeminar = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newSeminar.title,
        description: newSeminar.description,
        category: newSeminar.category,
        speaker: {
          name: newSeminar.speakerName,
          role: newSeminar.speakerRole,
          company: newSeminar.speakerCompany,
        },
        date: newSeminar.date || new Date(),
        time: newSeminar.time,
        duration: newSeminar.duration,
        meetingLink: newSeminar.meetingLink || 'https://meet.google.com/xyz',
      };

      const res = await api.post('/seminars', payload);
      if (res.success) {
        toast.success('Webinar scheduled successfully!');
        setShowModal(false);
        fetchSeminars();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create seminar');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col font-sans selection:bg-terracotta-500/20 selection:text-terracotta-200">
      <AdminNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900/90 border border-stone-200 dark:border-ink-700/80 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-500/10 border border-terracotta-500/20 text-terracotta-600 dark:text-terracotta-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Radio className="w-3.5 h-3.5 text-terracotta-600 dark:text-terracotta-400 animate-pulse" /> Live Broadcast Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-parchment-50">Masterclasses & Webinars</h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-xl mt-1">
              Publish platform-wide technical sessions, supervise speaker rosters, and broadcast links.
            </p>
          </div>

          <Button size="md" variant="terracotta" onClick={() => setShowModal(true)} icon={Plus}>
            Schedule Masterclass
          </Button>
        </div>

        {/* Seminars Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {[1, 2].map((n) => (
              <div key={n} className="h-56 rounded-3xl bg-stone-100 dark:bg-ink-900/60 animate-pulse border border-stone-200 dark:border-ink-800"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {seminars.map((seminar) => (
              <StudioTiltCard key={seminar._id} className="p-6 bg-white dark:bg-ink-850/90 border-stone-200 dark:border-ink-700/80 hover:border-terracotta-500/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-3">
                    <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-1 rounded-full bg-terracotta-500/15 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-500/30">
                      {seminar.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 font-mono text-xs">
                      <Users className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                      {seminar.registrations?.length || 0} RSVPs
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-parchment-50 mb-2">{seminar.title}</h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mb-4 leading-relaxed">{seminar.description}</p>

                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-ink-900/70 border border-stone-200 dark:border-ink-800 text-xs text-stone-700 dark:text-stone-300 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-stone-900 dark:text-parchment-100">{seminar.speaker?.name}</p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {seminar.speaker?.role} • {seminar.speaker?.company}
                      </p>
                    </div>
                    <div className="text-right font-mono text-[11px] text-stone-500 dark:text-stone-400">
                      <p>{new Date(seminar.date).toLocaleDateString()}</p>
                      <p className="text-amber-600 dark:text-amber-400 font-semibold">{seminar.time}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 dark:border-ink-700/70 flex items-center justify-between mt-5">
                  <a
                    href={seminar.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium flex items-center gap-1.5"
                  >
                    Launch Stream Link <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-[11px] font-mono text-stone-500">{seminar.duration || '90 mins'}</span>
                </div>
              </StudioTiltCard>
            ))}
          </div>
        )}

        {/* Schedule Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-ink-950/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-lg bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-ink-800">
                <div>
                  <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-parchment-50">Schedule LMS Masterclass</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Broadcast an interactive session to all students</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-900 dark:hover:text-parchment-100 hover:bg-stone-100 dark:hover:bg-ink-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSeminar} className="space-y-4 text-xs">
                <Input
                  label="Seminar Title"
                  placeholder="e.g. Distributed Caching with Redis"
                  value={newSeminar.title}
                  onChange={(e) => setNewSeminar({ ...newSeminar, title: e.target.value })}
                  required
                />

                <Input
                  label="Description"
                  placeholder="Summary of the masterclass session..."
                  value={newSeminar.description}
                  onChange={(e) => setNewSeminar({ ...newSeminar, description: e.target.value })}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Speaker Name"
                    placeholder="e.g. Alex Rivera"
                    value={newSeminar.speakerName}
                    onChange={(e) => setNewSeminar({ ...newSeminar, speakerName: e.target.value })}
                    required
                  />

                  <Input
                    label="Speaker Company"
                    placeholder="e.g. Stripe"
                    value={newSeminar.speakerCompany}
                    onChange={(e) => setNewSeminar({ ...newSeminar, speakerCompany: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Date"
                    type="date"
                    value={newSeminar.date}
                    onChange={(e) => setNewSeminar({ ...newSeminar, date: e.target.value })}
                    required
                  />

                  <Input
                    label="Time"
                    placeholder="06:00 PM EST"
                    value={newSeminar.time}
                    onChange={(e) => setNewSeminar({ ...newSeminar, time: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Broadcast URL (Zoom / Google Meet)"
                  placeholder="https://meet.google.com/..."
                  value={newSeminar.meetingLink}
                  onChange={(e) => setNewSeminar({ ...newSeminar, meetingLink: e.target.value })}
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-stone-200 dark:border-ink-800">
                  <Button size="sm" variant="outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" variant="terracotta">
                    Publish Masterclass
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSeminars;
