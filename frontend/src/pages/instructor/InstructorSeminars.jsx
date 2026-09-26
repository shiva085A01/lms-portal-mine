import React, { useState, useEffect } from 'react';
import { InstructorNavbar } from '../../components/layout/InstructorNavbar';
import { Button } from '../../components/ui/Button';
import { StudioTiltCard } from '../../components/ui/StudioTiltCard';
import {
  Video,
  PlusCircle,
  Calendar,
  Clock,
  ExternalLink,
  Users,
  Sparkles,
  CheckCircle2,
  X,
  Share2,
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
      toast.error('Could not load seminars');
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
          name: formData.speaker,
          role: 'Faculty Lead',
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
    <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col font-sans transition-colors duration-300">
      <InstructorNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-parchment-50 flex items-center gap-2">
              <Video className="w-7 h-7 text-amber-500" />
              Live Masterclasses & Seminars
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              Host interactive technical webinars, Q&A panels, and architectural code teardowns.
            </p>
          </div>

          <Button
            size="md"
            variant="amber"
            icon={PlusCircle}
            onClick={() => setShowModal(true)}
          >
            Host New Masterclass
          </Button>
        </div>

        {/* Seminars Grid with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-stone-500 dark:text-stone-400 text-sm font-mono">
              Loading seminars...
            </div>
          ) : seminars.length === 0 ? (
            <div className="col-span-full py-12 text-center p-12 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm">
              <Video className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <p className="text-stone-800 dark:text-stone-200 font-serif font-bold text-base">No masterclasses scheduled</p>
              <p className="text-stone-500 dark:text-stone-400 text-xs mt-1">Host your first live seminar to interact directly with enrolled learners.</p>
            </div>
          ) : (
            seminars.map((sem) => (
              <StudioTiltCard
                key={sem._id}
                className="p-5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-mono">
                      Live Broadcast
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                      {sem.duration || '60 mins'}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-stone-900 dark:text-parchment-50 text-base group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors line-clamp-1">
                    {sem.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    {sem.description}
                  </p>

                  <div className="mt-4 p-3 rounded-2xl bg-stone-50 dark:bg-ink-900 border border-stone-200 dark:border-ink-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-stone-500 dark:text-stone-400 text-[10px] font-mono">Host / Speaker</p>
                      <p className="font-bold text-stone-800 dark:text-stone-200">{sem.speaker?.name || (typeof sem.speaker === 'string' ? sem.speaker : 'Faculty Lead')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-stone-500 dark:text-stone-400 text-[10px] font-mono">Date</p>
                      <p className="font-bold text-stone-800 dark:text-stone-200 font-mono">{new Date(sem.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-ink-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-mono">
                    <Users className="w-3.5 h-3.5 text-amber-500" />
                    <span>{sem.registrations?.length || 0} Registered</span>
                  </div>
                  {sem.meetingLink && (
                    <a
                      href={sem.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      Broadcast Room <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </StudioTiltCard>
            ))
          )}
        </div>

        {/* Schedule Seminar Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-lg p-6 border border-stone-200 dark:border-amber-500/30 rounded-3xl bg-white dark:bg-ink-900 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-ink-800">
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-parchment-50">Schedule Live Seminar</h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-ink-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSeminar} className="space-y-4 text-xs">
                <div>
                  <label className="text-stone-700 dark:text-stone-300 font-semibold block mb-1">Seminar Topic / Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Consensus in Distributed Systems"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full text-xs rounded-xl px-3.5 py-2.5 bg-stone-50 dark:bg-ink-950 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-stone-700 dark:text-stone-300 font-semibold block mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Summary of the masterclass session..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full text-xs rounded-xl p-3 bg-stone-50 dark:bg-ink-950 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-700 dark:text-stone-300 font-semibold block mb-1">Date & Time</label>
                    <input
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full text-xs rounded-xl px-3.5 py-2.5 bg-stone-50 dark:bg-ink-950 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-stone-700 dark:text-stone-300 font-semibold block mb-1">Duration (Mins)</label>
                    <input
                      type="number"
                      min="15"
                      max="180"
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 60 })}
                      className="w-full text-xs rounded-xl px-3.5 py-2.5 bg-stone-50 dark:bg-ink-950 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-stone-700 dark:text-stone-300 font-semibold block mb-1">Meeting Link (Google Meet / Zoom)</label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={formData.meetLink}
                    onChange={(e) => setFormData({ ...formData, meetLink: e.target.value })}
                    className="w-full text-xs rounded-xl px-3.5 py-2.5 bg-stone-50 dark:bg-ink-950 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-stone-200 dark:border-ink-800">
                  <Button size="sm" variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" variant="amber" isLoading={submitting}>
                    Schedule Seminar
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
