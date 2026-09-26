import React, { useState, useEffect } from 'react';
import { StudentNavbar } from '../../components/layout/StudentNavbar';
import { StudioTiltCard } from '../../components/ui/StudioTiltCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Plus,
  Target,
  MessageSquare,
  Sparkles,
  ArrowRight,
  LogOut,
  UserCheck,
  X,
  Play,
  Clock,
  Layers,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const StudyRooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: '',
    topic: '',
    courseCategory: 'Full-Stack',
    maxMembers: 8,
    currentGoal: '',
  });

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/study-rooms');
      if (res.success) {
        setRooms(res.data || []);
      }
    } catch {
      toast.error('Failed to load study rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/study-rooms', newRoom);
      if (res.success) {
        toast.success('Study room created successfully!');
        setShowCreateModal(false);
        setNewRoom({
          name: '',
          topic: '',
          courseCategory: 'Full-Stack',
          maxMembers: 8,
          currentGoal: '',
        });
        fetchRooms();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create room');
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      const res = await api.post(`/study-rooms/${roomId}/join`);
      if (res.success) {
        toast.success('Joined study room!');
        fetchRooms();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to join study room');
    }
  };

  const handleLeaveRoom = async (roomId) => {
    try {
      const res = await api.post(`/study-rooms/${roomId}/leave`);
      if (res.success) {
        toast.success('Left study room');
        fetchRooms();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to leave room');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col font-sans transition-colors duration-300">
      <StudentNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-jade-500/10 text-jade-700 dark:text-jade-300 text-xs font-semibold font-mono mb-2 border border-jade-500/20">
              <Users className="w-3.5 h-3.5" /> Peer Collaboration Pods
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-parchment-50">Study Rooms</h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              Join focused study pods, conduct peer code reviews, and build capstone projects with fellow students.
            </p>
          </div>

          <Button
            size="md"
            variant="terracotta"
            onClick={() => setShowCreateModal(true)}
            icon={Plus}
          >
            Create Study Room
          </Button>
        </div>

        {/* Room Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-3xl bg-stone-200 dark:bg-ink-900/60 animate-pulse border border-stone-300 dark:border-ink-800"></div>
            ))}
          </div>
        ) : rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {rooms.map((room) => {
              const isMember = room.members?.some(
                (m) => (m._id || m).toString() === user?.id
              );
              return (
                <StudioTiltCard key={room._id} className="p-5 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-jade-500/10 text-jade-700 dark:text-jade-300 border border-jade-500/20 font-mono">
                        {room.courseCategory}
                      </span>
                      <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                        {room.members?.length || 0} / {room.maxMembers} Members
                      </span>
                    </div>

                    <h3 className="text-base font-serif font-bold text-stone-900 dark:text-parchment-50 mb-1.5 group-hover:text-terracotta-600 dark:group-hover:text-amber-300 transition-colors">
                      {room.name}
                    </h3>

                    <p className="text-xs text-stone-600 dark:text-stone-400 mb-3 leading-relaxed">{room.topic}</p>

                    {room.currentGoal && (
                      <div className="p-3 rounded-2xl bg-stone-50 dark:bg-ink-900 border border-stone-200 dark:border-ink-800 flex items-start gap-2 text-xs mb-4">
                        <Target className="w-4 h-4 text-jade-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-semibold block font-mono">Current Goal</span>
                          <span className="text-stone-800 dark:text-stone-200 font-medium">{room.currentGoal}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer with Member Avatars & Join/Leave Button */}
                  <div className="pt-3 border-t border-stone-100 dark:border-ink-800 flex items-center justify-between">
                    <div className="flex -space-x-2 overflow-hidden">
                      {room.members?.slice(0, 4).map((member, idx) => (
                        <div
                          key={idx}
                          className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-ink-900 bg-terracotta-500/20 text-terracotta-700 dark:text-terracotta-300 flex items-center justify-center text-[10px] font-bold border border-terracotta-500/30"
                        >
                          {(member.name || 'U').charAt(0)}
                        </div>
                      ))}
                      {(room.members?.length || 0) > 4 && (
                        <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-ink-900 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center text-[10px] font-bold font-mono">
                          +{room.members.length - 4}
                        </div>
                      )}
                    </div>

                    {isMember ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleLeaveRoom(room._id)}
                        className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 py-1 px-3"
                      >
                        Leave Pod
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="terracotta"
                        onClick={() => handleJoinRoom(room._id)}
                        disabled={room.members?.length >= room.maxMembers}
                        className="text-xs py-1 px-3"
                      >
                        {room.members?.length >= room.maxMembers ? 'Room Full' : 'Join Pod'}
                      </Button>
                    )}
                  </div>
                </StudioTiltCard>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm">
            <Users className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-parchment-50 mb-1">No Active Study Pods</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 max-w-sm mx-auto mb-4 leading-relaxed">
              Start a new peer study group and invite your classmates to collaborate in real-time.
            </p>
            <Button size="sm" variant="terracotta" onClick={() => setShowCreateModal(true)}>
              Create First Pod
            </Button>
          </div>
        )}

        {/* Create Study Room Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-lg p-6 border border-stone-200 dark:border-terracotta-500/30 rounded-3xl bg-white dark:bg-ink-900 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-ink-800">
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-parchment-50">Create Peer Study Pod</h3>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-ink-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRoom} className="space-y-4">
                <Input
                  label="Pod Name"
                  placeholder="e.g. MERN Stack Weekend Build"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  required
                />

                <Input
                  label="Discussion Topic / Focus Area"
                  placeholder="e.g. Redis caching & JWT auth troubleshooting"
                  value={newRoom.topic}
                  onChange={(e) => setNewRoom({ ...newRoom, topic: e.target.value })}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                      Category
                    </label>
                    <select
                      value={newRoom.courseCategory}
                      onChange={(e) => setNewRoom({ ...newRoom, courseCategory: e.target.value })}
                      className="w-full text-xs rounded-xl px-3 py-2.5 bg-white dark:bg-ink-950 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white"
                    >
                      <option value="Full-Stack">Full-Stack</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="AI & Data">AI & Data</option>
                      <option value="DevOps">DevOps</option>
                    </select>
                  </div>

                  <Input
                    label="Max Seats"
                    type="number"
                    min="2"
                    max="20"
                    value={newRoom.maxMembers}
                    onChange={(e) => setNewRoom({ ...newRoom, maxMembers: parseInt(e.target.value) || 8 })}
                  />
                </div>

                <Input
                  label="Current Goal"
                  placeholder="e.g. Complete Milestone 3 project repository"
                  value={newRoom.currentGoal}
                  onChange={(e) => setNewRoom({ ...newRoom, currentGoal: e.target.value })}
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-stone-200 dark:border-ink-800">
                  <Button size="sm" variant="secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" variant="terracotta">
                    Create Pod
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

export default StudyRooms;
