import React, { useState, useEffect } from 'react';
import { InstructorNavbar } from '../../components/layout/InstructorNavbar';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Video,
  PlusCircle,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  Sparkles,
  X,
  CheckCircle2,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const InstructorSeminars = () => {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    speaker: 'Dr. Sarah Jenkins',
    date: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
    meetLink: 'https://meet.google.com/xyz-abcd-lms',
    durationMinutes: 60,
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
    if (!formData.title || !formData.description) {
      toast.error('Please enter seminar title and description');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title,
        description: formData.description,
        speaker: {
          name: formData.speaker || 'Lead Instructor',
          role: 'Faculty Instructor',
          company: 'LearnSphere LMS',
        },
        date: formData.date,
        meetingLink: formData.meetLink,
        duration: `${formData.durationMinutes || 60} mins`,
      };

      const res = await api.post('/seminars', payload);
      if (res.success) {
        toast.success('Seminar scheduled successfully!');
        setShowModal(false);
        setFormData({
          title: '',
          description: '',
          speaker: 'Dr. Sarah Jenkins',
          date: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
          meetLink: 'https://meet.google.com/xyz-abcd-lms',
          durationMinutes: 60,
        });
        fetchSeminars();
      }
    } catch (err) {
      toast.error(err.message || 'Error scheduling seminar');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <InstructorNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <Video className="w-7 h-7 text-cyan-400" />
              Live Masterclasses & Seminars
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Host interactive interactive workshops, Q&A office hours, and technical webinars.
            </p>
          </div>

          <Button
            size="md"
            variant="primary"
            icon={PlusCircle}
            onClick={() => setShowModal(true)}
          >
            Schedule Masterclass
          </Button>
        </div>

        {/* Seminar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-sm">
              Loading seminars...
            </div>
          ) : seminars.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <Video className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-300 font-semibold text-base">No scheduled seminars</p>
              <p className="text-slate-500 text-xs mt-1">Schedule your first seminar today.</p>
            </div>
          ) : (
            seminars.map((sem) => (
              <GlassCard
                key={sem._id}
                className="p-5 flex flex-col justify-between border-white/10 hover:border-cyan-500/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      Live Workshop
                    </span>
                    <span className="text-[10px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 flex items-center gap-1">
                      <Users className="w-3 h-3" /> {sem.registrations?.length || 0} RSVPs
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-100 text-base group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {sem.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {sem.description}
                  </p>

                  <div className="space-y-1.5 mt-4 pt-4 border-t border-white/5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{new Date(sem.date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      <span>{sem.durationMinutes || 60} Minutes</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium truncate max-w-[140px]">
                    Speaker: {sem.speaker?.name || (typeof sem.speaker === 'string' ? sem.speaker : 'Faculty Lead')}
                  </span>
                  <a
                    href={sem.meetingLink || sem.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/30 transition-colors"
                  >
                    <span>Launch Meet</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </GlassCard>
            ))
          )}
        </div>

        {/* Schedule Seminar Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Video className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-lg text-white">Schedule Masterclass</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSeminar} className="space-y-4">
                <Input
                  label="Masterclass Topic"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. System Design Interview Deep Dive: Uber Architecture"
                  required
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Description & Objectives
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="We will analyze distributed caching, geohash indexing, and driver matching algorithms live."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950/80 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Host / Speaker Name"
                    value={formData.speaker}
                    onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                    required
                  />

                  <Input
                    label="Duration (Minutes)"
                    type="number"
                    value={formData.durationMinutes}
                    onChange={(e) =>
                      setFormData({ ...formData, durationMinutes: Number(e.target.value) })
                    }
                  />
                </div>

                <Input
                  label="Date & Time"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />

                <Input
                  label="Video Meeting Link (Google Meet / Zoom)"
                  value={formData.meetLink}
                  onChange={(e) => setFormData({ ...formData, meetLink: e.target.value })}
                  placeholder="https://meet.google.com/..."
                  required
                />

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <Button
                    type="button"
                    variant="glass"
                    size="sm"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={submitting}
                  >
                    Schedule & Broadcast
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

export default InstructorSeminars;
