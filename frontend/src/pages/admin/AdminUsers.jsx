import React, { useState, useEffect } from 'react';
import { AdminNavbar } from '../../components/layout/AdminNavbar';
import { Button } from '../../components/ui/Button';
import { StudioTiltCard } from '../../components/ui/StudioTiltCard';
import {
  Users,
  Search,
  Filter,
  Shield,
  UserCheck,
  Calendar,
  Mail,
  Phone,
  Sparkles,
  PlusCircle,
  X,
  Trash2,
  ShieldCheck,
  UserX,
  CheckCircle2,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    phone: '',
    bio: '',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter !== 'All') params.append('role', roleFilter);

      const res = await api.get(`/users?${params.toString()}`);
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch {
      toast.error('Failed to load users from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  // Admin Change Role
  const handleChangeRole = async (userId, newRole) => {
    try {
      const res = await api.put(`/users/${userId}/role`, { role: newRole });
      if (res.success) {
        toast.success(`Role updated to ${newRole}`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update role');
    }
  };

  // Admin Toggle Status
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const res = await api.put(`/users/${userId}/status`, { isActive: !currentStatus });
      if (res.success) {
        toast.success(res.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: !currentStatus } : u))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to toggle user status');
    }
  };

  // Admin Delete User
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${userName}"?`)) {
      return;
    }
    try {
      const res = await api.delete(`/users/${userId}`);
      if (res.success) {
        toast.success('User account deleted');
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err) {
      toast.error(err.message || 'Delete user failed');
    }
  };

  // Admin Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Please enter name, email, and password');
      return;
    }

    try {
      setCreating(true);
      const res = await api.post('/users', newUser);
      if (res.success) {
        toast.success(`User ${newUser.name} created as ${newUser.role}!`);
        setShowCreateModal(false);
        setNewUser({
          name: '',
          email: '',
          password: '',
          role: 'student',
          phone: '',
          bio: '',
        });
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col font-sans selection:bg-terracotta-500/20 selection:text-terracotta-200">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Header and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900/90 border border-stone-200 dark:border-ink-700/80 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-500/10 border border-terracotta-500/20 text-terracotta-600 dark:text-terracotta-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" /> Identity & Directory Administration
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-parchment-50">
              Member Directory & Access Governance
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-xl mt-1">
              Supervise student, faculty, and administrator accounts registered in the database with full role promotion and status privileges.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="md"
              variant="terracotta"
              icon={PlusCircle}
              onClick={() => setShowCreateModal(true)}
            >
              Add New User
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['All', 'student', 'instructor', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-2 rounded-2xl text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  roleFilter === role
                    ? 'bg-terracotta-500 text-white shadow-md shadow-terracotta-500/20'
                    : 'bg-white dark:bg-ink-850 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-ink-700/80 hover:border-stone-400'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-80">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search member by name or email..."
                className="w-full bg-white dark:bg-ink-900 border border-stone-300 dark:border-ink-700 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-terracotta-500"
              />
            </div>
            <Button type="submit" size="sm" variant="secondary">
              Search
            </Button>
          </form>
        </div>

        {/* User Cards / Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-terracotta-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-mono text-xs text-stone-500">Querying user records from MongoDB...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm space-y-3">
            <Users className="w-12 h-12 text-stone-400 mx-auto" />
            <h3 className="text-base font-serif font-bold">No members found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((member) => (
              <StudioTiltCard
                key={member._id}
                className="p-5 bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-terracotta-500/15 border border-terracotta-500/30 flex items-center justify-center font-bold text-xs text-terracotta-600 dark:text-terracotta-300">
                        {member.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-stone-900 dark:text-white">{member.name}</h3>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">{member.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded ${
                        member.role === 'admin'
                          ? 'bg-terracotta-500/15 text-terracotta-700 dark:text-terracotta-300'
                          : member.role === 'instructor'
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                          : 'bg-stone-200 dark:bg-ink-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      Role: {member.role}
                    </span>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                        member.isActive !== false
                          ? 'bg-jade-500/15 text-jade-700 dark:text-jade-300'
                          : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {member.isActive !== false ? <CheckCircle2 className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                      {member.isActive !== false ? 'Active' : 'Suspended'}
                    </span>
                  </div>

                  {member.bio && (
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {member.bio}
                    </p>
                  )}

                  <div className="text-[10px] text-stone-400 font-mono pt-2 border-t border-stone-100 dark:border-ink-800">
                    Registered: {new Date(member.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Role Mutation & Privileges Actions */}
                <div className="pt-4 border-t border-stone-100 dark:border-ink-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[10px] font-mono text-stone-400 uppercase">Change Role:</span>
                    <select
                      value={member.role}
                      onChange={(e) => handleChangeRole(member._id, e.target.value)}
                      className="flex-1 text-xs px-2 py-1 rounded-lg bg-stone-50 dark:bg-ink-850 border border-stone-200 dark:border-ink-700 text-stone-800 dark:text-white font-mono focus:outline-none"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      variant={member.isActive !== false ? 'outline' : 'jade'}
                      className="flex-1 text-xs"
                      onClick={() => handleToggleStatus(member._id, member.isActive !== false)}
                    >
                      {member.isActive !== false ? 'Suspend User' : 'Activate User'}
                    </Button>

                    <button
                      type="button"
                      onClick={() => handleDeleteUser(member._id, member.name)}
                      className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 cursor-pointer"
                      title="Delete User Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </StudioTiltCard>
            ))}
          </div>
        )}

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg p-6 bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 rounded-3xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-ink-800">
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-terracotta-500" />
                  Create Member Account
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
                <div>
                  <label className="font-mono font-bold uppercase text-stone-600 dark:text-stone-400 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="e.g. Dr. Ada Lovelace"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white focus:outline-none focus:border-terracotta-500"
                  />
                </div>

                <div>
                  <label className="font-mono font-bold uppercase text-stone-600 dark:text-stone-400 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="ada@lms.com"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white focus:outline-none focus:border-terracotta-500"
                  />
                </div>

                <div>
                  <label className="font-mono font-bold uppercase text-stone-600 dark:text-stone-400 block mb-1">
                    Initial Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Password@123"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white focus:outline-none focus:border-terracotta-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono font-bold uppercase text-stone-600 dark:text-stone-400 block mb-1">
                      Assigned Role
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white focus:outline-none focus:border-terracotta-500 font-mono"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-mono font-bold uppercase text-stone-600 dark:text-stone-400 block mb-1">
                      Phone (Optional)
                    </label>
                    <input
                      type="text"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white focus:outline-none focus:border-terracotta-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono font-bold uppercase text-stone-600 dark:text-stone-400 block mb-1">
                    Bio / Faculty Background
                  </label>
                  <textarea
                    rows={2}
                    value={newUser.bio}
                    onChange={(e) => setNewUser({ ...newUser, bio: e.target.value })}
                    placeholder="Short academic bio or specialization..."
                    className="w-full p-3 text-xs rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white focus:outline-none focus:border-terracotta-500"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-stone-100 dark:border-ink-800">
                  <Button type="button" size="sm" variant="secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" variant="terracotta" isLoading={creating}>
                    Create Account
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

export default AdminUsers;
