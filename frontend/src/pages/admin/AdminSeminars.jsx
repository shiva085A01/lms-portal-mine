import React, { useState, useEffect } from 'react';
import { AdminNavbar } from '../../components/layout/AdminNavbar';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Video,
  Plus,
  Calendar,
  Clock,
  ExternalLink,
  Users,
  Sparkles,
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
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <AdminNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 text-xs font-semibold mb-2">
              <Video className="w-3.5 h-3.5" /> Seminar Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Live Webinar Schedule</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Schedule masterclasses, track student registrations, and broadcast meeting links.
            </p>
          </div>

          <Button size="md" variant="primary" onClick={() => setShowModal(true)} icon={Plus}>
            Schedule Seminar
          </Button>
        </div>

        {/* Seminars Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-48 rounded-2xl bg-slate-900/60 animate-pulse border border-white/5"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {seminars.map((seminar) => (
              <GlassCard key={seminar._id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="text-[10px] uppercase font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                      {seminar.category}
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Users className="w-3.5 h-3.5 text-brand-400" />
                      {seminar.registrations?.length || 0} Registered
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{seminar.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">{seminar.description}</p>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{seminar.speaker?.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {seminar.speaker?.role} • {seminar.speaker?.company}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(seminar.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4">
                  <a
                    href={seminar.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-brand-400 hover:underline flex items-center gap-1"
                  >
                    Meeting Link <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Schedule Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-lg glass-card p-6 border-pink-500/30">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <h3 className="text-lg font-bold text-white">Schedule New Webinar</h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSeminar} className="space-y-4">
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
                  label="Google Meet / Zoom URL"
                  placeholder="https://meet.google.com/..."
                  value={newSeminar.meetingLink}
                  onChange={(e) => setNewSeminar({ ...newSeminar, meetingLink: e.target.value })}
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <Button size="sm" variant="glass" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" variant="primary">
                    Publish Webinar
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
