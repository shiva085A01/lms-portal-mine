import React, { useState, useEffect } from 'react';
import { StudentNavbar } from '../../components/layout/StudentNavbar';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Plus,
  LogIn,
  LogOut,
  Target,
  CheckCircle2,
  Sparkles,
  Lock,
  Globe,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const StudyRooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // New room form state
  const [newRoom, setNewRoom] = useState({
    name: '',
    topic: '',
    description: '',
    courseCategory: 'Full-Stack',
    currentGoal: '',
    maxMembers: 10,
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
    if (!newRoom.name || !newRoom.topic) {
      toast.error('Room name and topic are required');
      return;
    }

    try {
      const res = await api.post('/study-rooms', newRoom);
      if (res.success) {
        toast.success('Study room created successfully!');
        setShowCreateModal(false);
        setNewRoom({
          name: '',
          topic: '',
          description: '',
          courseCategory: 'Full-Stack',
          currentGoal: '',
          maxMembers: 10,
        });
        fetchRooms();
      }
    } catch (err) {
      toast.error(err.message || 'Could not create room');
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      setActionLoadingId(roomId);
      const res = await api.post(`/study-rooms/${roomId}/join`);
      if (res.success) {
        toast.success('Joined study room!');
        fetchRooms();
      }
    } catch (err) {
      toast.error(err.message || 'Could not join room');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleLeaveRoom = async (roomId) => {
    try {
      setActionLoadingId(roomId);
      const res = await api.post(`/study-rooms/${roomId}/leave`);
      if (res.success) {
        toast.success('Left study room');
        fetchRooms();
      }
    } catch (err) {
      toast.error(err.message || 'Could not leave room');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <StudentNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-2">
              <Users className="w-3.5 h-3.5" /> Peer Collaboration Spaces
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Study Rooms</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Join focused study groups, conduct mock code reviews, and build capstone projects with fellow students.
            </p>
          </div>

          <Button
            size="md"
            variant="primary"
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
              <div key={n} className="h-64 rounded-2xl bg-slate-900/60 animate-pulse border border-white/5"></div>
            ))}
          </div>
        ) : rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {rooms.map((room) => {
              const isMember = room.members?.some(
                (m) => (m._id || m).toString() === user?.id
              );
              return (
                <GlassCard key={room._id} className="p-5 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                        {room.courseCategory}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {room.members?.length || 0} / {room.maxMembers} Members
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-emerald-300 transition-colors">
                      {room.name}
                    </h3>

                    <p className="text-xs text-slate-400 mb-3">{room.topic}</p>

                    {room.currentGoal && (
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-start gap-2 text-xs mb-4">
                        <Target className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Current Goal</span>
                          <span className="text-slate-200">{room.currentGoal}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer with Member Avatars & Join/Leave Button */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                    <div className="flex -space-x-2 overflow-hidden">
                      {room.members?.slice(0, 4).map((member, idx) => (
                        <div
                          key={idx}
                          className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-200"
                          title={member.name || 'Member'}
                        >
                          {member.name ? member.name.charAt(0).toUpperCase() : 'M'}
                        </div>
                      ))}
                      {(room.members?.length || 0) > 4 && (
                        <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-400">
                          +{room.members.length - 4}
                        </div>
                      )}
                    </div>

                    {isMember ? (
                      <Button
                        size="sm"
                        variant="danger"
                        className="text-xs"
                        isLoading={actionLoadingId === room._id}
                        onClick={() => handleLeaveRoom(room._id)}
                        icon={LogOut}
                      >
                        Leave
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="primary"
                        className="text-xs"
                        disabled={room.members?.length >= room.maxMembers}
                        isLoading={actionLoadingId === room._id}
                        onClick={() => handleJoinRoom(room._id)}
                        icon={LogIn}
                      >
                        {room.members?.length >= room.maxMembers ? 'Room Full' : 'Join Room'}
                      </Button>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        ) : (
          <GlassCard className="p-12 text-center border-dashed border-white/10">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No active study rooms yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Be the first to create a collaborative study room for your favorite course or topic.
            </p>
            <Button size="sm" variant="primary" onClick={() => setShowCreateModal(true)}>
              Create First Room
            </Button>
          </GlassCard>
        )}

        {/* Create Study Room Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-lg glass-card p-6 border-emerald-500/30">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <h3 className="text-lg font-bold text-white">Create New Study Room</h3>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateRoom} className="space-y-4">
                <Input
                  label="Room Name"
                  placeholder="e.g. React & Vite UI Engineers"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  required
                />

                <Input
                  label="Primary Topic"
                  placeholder="e.g. Component architecture & custom hooks"
                  value={newRoom.topic}
                  onChange={(e) => setNewRoom({ ...newRoom, topic: e.target.value })}
                  required
                />

                <Input
                  label="Current Learning Goal"
                  placeholder="e.g. Building full-stack capstone dashboards"
                  value={newRoom.currentGoal}
                  onChange={(e) => setNewRoom({ ...newRoom, currentGoal: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Category</label>
                    <select
                      value={newRoom.courseCategory}
                      onChange={(e) => setNewRoom({ ...newRoom, courseCategory: e.target.value })}
                      className="glass-input text-xs"
                    >
                      <option value="Full-Stack">Full-Stack</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="Data Structures & Algorithms">DSA & Algorithms</option>
                    </select>
                  </div>

                  <Input
                    label="Max Members"
                    type="number"
                    min="2"
                    max="25"
                    value={newRoom.maxMembers}
                    onChange={(e) => setNewRoom({ ...newRoom, maxMembers: parseInt(e.target.value, 10) || 10 })}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <Button size="sm" variant="glass" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" variant="primary">
                    Create & Join Room
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
