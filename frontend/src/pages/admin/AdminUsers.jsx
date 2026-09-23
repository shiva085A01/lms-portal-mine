import React, { useState, useEffect } from 'react';
import { AdminNavbar } from '../../components/layout/AdminNavbar';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import {
  Users,
  Search,
  Filter,
  Shield,
  UserCheck,
  Calendar,
  Mail,
  Phone,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter !== 'All') params.append('role', roleFilter);

      const res = await api.get(`/users?${params.toString()}`);
      if (res.success) {
        setUsers(res.data || []);
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

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <AdminNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold mb-2">
              <Users className="w-3.5 h-3.5" /> User Directory
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Registered Users</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Query and supervise all student, mentor, and administrator records stored in MongoDB.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-80">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="glass-input pl-9 pr-4 py-2 text-xs w-full"
              />
            </div>
            <Button type="submit" size="sm" variant="glass">
              Search
            </Button>
          </form>
        </div>

        {/* Role Filters */}
        <div className="flex gap-2 pt-2 border-t border-white/5">
          {['All', 'student', 'instructor', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                roleFilter === role
                  ? 'bg-amber-500 text-slate-950 shadow-glow'
                  : 'bg-slate-900 text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* User Table */}
        <GlassCard className="p-0 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading users from MongoDB...</div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-white/10 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Skills / Interests</th>
                    <th className="py-3 px-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs text-slate-200">
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-white">{u.name}</p>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            u.role === 'admin'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : u.role === 'instructor'
                              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                              : 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 font-mono">
                        {u.phone || '—'}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {u.skills?.length > 0 ? (
                            u.skills.map((s, idx) => (
                              <span key={idx} className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-white/5 text-slate-300">
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500 text-[11px]">—</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No users found matching query.
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  );
};

export default AdminUsers;
