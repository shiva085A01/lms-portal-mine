import React, { useState, useEffect } from 'react';
import { InstructorNavbar } from '../../components/layout/InstructorNavbar';
import { StudioTiltCard } from '../../components/ui/StudioTiltCard';
import { Button } from '../../components/ui/Button';
import {
  Users,
  Search,
  BookOpen,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Mail,
  Award,
  Clock,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const InstructorStudents = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/instructor/students');
      if (res.success && res.data) {
        setEnrollments(res.data);
      }
    } catch {
      toast.error('Could not load student roster');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = enrollments.filter((e) =>
    e.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.student?.email?.toLowerCase().includes(search.toLowerCase()) ||
    e.course?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col font-sans selection:bg-terracotta-500/20 selection:text-terracotta-200">
      <InstructorNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold font-mono mb-2 border border-amber-500/20">
              <Users className="w-3.5 h-3.5" /> Learner Cohorts & Enrollment
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-white">
              Enrolled Student Roster
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              Track student milestone progression, completion percentages, and engagement across all your courses.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or course..."
              className="w-full bg-white dark:bg-ink-900 border border-stone-300 dark:border-ink-700 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-mono text-xs text-stone-500">Loading student cohorts...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm space-y-3">
            <Users className="w-12 h-12 text-stone-400 mx-auto" />
            <h3 className="text-base font-serif font-bold">No enrolled students found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Students who enroll in your published courses will appear in this roster.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <StudioTiltCard
                key={item._id}
                className="p-5 bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-bold text-xs text-amber-600 dark:text-amber-300">
                        {item.student?.name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-stone-900 dark:text-white">{item.student?.name}</h3>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">{item.student?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-ink-850 border border-stone-100 dark:border-ink-800 text-xs space-y-1">
                    <div className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                      {item.course?.title}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                      <span>Category: {item.course?.category}</span>
                      <span className="font-mono">{new Date(item.enrolledAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-stone-500">Course Progress</span>
                      <span className="font-bold text-stone-900 dark:text-white">{item.completionPercentage || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 dark:bg-ink-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          item.completionPercentage === 100 ? 'bg-jade-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${item.completionPercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {item.student?.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.student.skills.slice(0, 3).map((sk, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-stone-100 dark:bg-ink-800 text-stone-600 dark:text-stone-400 font-mono">
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-100 dark:border-ink-800 flex justify-between items-center text-xs">
                  <span className="text-[11px] text-stone-400 font-mono">
                    Status: <strong className={item.status === 'completed' ? 'text-jade-500' : 'text-amber-500'}>{item.status}</strong>
                  </span>
                  {item.certificateIssued && (
                    <span className="text-[10px] font-mono font-bold text-jade-600 dark:text-jade-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Certified
                    </span>
                  )}
                </div>
              </StudioTiltCard>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default InstructorStudents;
