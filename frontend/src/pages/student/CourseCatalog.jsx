import React, { useState, useEffect } from 'react';
import { StudentNavbar } from '../../components/layout/StudentNavbar';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Star,
  Users,
  Layers,
  ChevronDown,
  ChevronUp,
  Play,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState(null); // For syllabus modal
  const [enrollingId, setEnrollingId] = useState(null);

  const categories = [
    'All',
    'Full-Stack',
    'AI & Machine Learning',
    'Data Structures & Algorithms',
    'Cloud & DevOps',
  ];

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedDifficulty !== 'All') params.append('difficulty', selectedDifficulty);

      const res = await api.get(`/courses?${params.toString()}`);
      if (res.success) {
        setCourses(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load courses from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedDifficulty]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrollingId(courseId);
      const res = await api.post(`/courses/${courseId}/enroll`);
      if (res.success) {
        toast.success('Successfully enrolled in course!');
        // Refresh courses to update enrolled count
        fetchCourses();
      }
    } catch (err) {
      toast.error(err.message || 'Enrollment failed');
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <StudentNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5" /> Production Curriculum Catalog
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Course Catalog</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Browse industry-standard engineering courses with integrated modules, videos, and assessments.
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses or topics..."
                className="glass-input pl-9 pr-4 py-2 text-xs w-full"
              />
            </div>
            <Button type="submit" size="sm" variant="glass">
              Search
            </Button>
          </form>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-slate-900/60 animate-pulse border border-white/5"></div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {courses.map((course) => (
              <GlassCard key={course._id} className="p-0 overflow-hidden flex flex-col justify-between group">
                <div>
                  {/* Thumbnail Banner */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950/80 text-brand-300 backdrop-blur-md border border-white/10">
                        {course.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/90 text-white backdrop-blur-md">
                        {course.isFree ? 'Free Access' : `$${course.price}`}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" /> {course.rating} ({course.ratingCount})
                      </span>
                      <span>{course.difficulty}</span>
                      <span>{course.duration}</span>
                    </div>

                    <h3 className="text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-brand-300 transition-colors">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Instructor: <strong className="text-slate-300">{course.instructorName}</strong></span>
                      <span>{course.modules?.length || 0} Modules</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="glass"
                    className="flex-1 text-xs"
                    onClick={() => setSelectedCourse(course)}
                  >
                    View Syllabus
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    className="flex-1 text-xs"
                    isLoading={enrollingId === course._id}
                    onClick={() => handleEnroll(course._id)}
                  >
                    Enroll Now
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <GlassCard className="p-12 text-center border-dashed border-white/10">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No courses match your filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Try adjusting your search terms or select "All" categories to view available programs.
            </p>
            <Button
              size="sm"
              variant="glass"
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </Button>
          </GlassCard>
        )}

        {/* Course Syllabus Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto glass-card p-6 border-brand-500/30">
              <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider">
                    {selectedCourse.category} • {selectedCourse.difficulty}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1">{selectedCourse.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              {/* Learning Outcomes */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  What you will learn:
                </h4>
                <div className="space-y-1.5">
                  {selectedCourse.learningOutcomes?.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modules & Lessons */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
                  Curriculum Modules ({selectedCourse.modules?.length || 0}):
                </h4>
                <div className="space-y-3">
                  {selectedCourse.modules?.map((mod, modIdx) => (
                    <div key={modIdx} className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span>{mod.title}</span>
                        <span className="text-[11px] text-slate-400 font-normal">{mod.lessons?.length || 0} lessons</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{mod.description}</p>

                      <div className="space-y-1 pt-1">
                        {mod.lessons?.map((les, lesIdx) => (
                          <div
                            key={lesIdx}
                            className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-950/60 border border-white/5"
                          >
                            <span className="flex items-center gap-2 text-slate-300">
                              <Play className="w-3 h-3 text-brand-400" />
                              {les.title}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">{les.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Button size="sm" variant="glass" onClick={() => setSelectedCourse(null)}>
                  Close
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    handleEnroll(selectedCourse._id);
                    setSelectedCourse(null);
                  }}
                >
                  Enroll in this Course
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseCatalog;
