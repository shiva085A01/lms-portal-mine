import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StudentNavbar } from '../../components/layout/StudentNavbar';
import { StudioTiltCard } from '../../components/ui/StudioTiltCard';
import { Button } from '../../components/ui/Button';
import {
  BookOpen,
  Search,
  Filter,
  Star,
  Clock,
  User,
  CheckCircle2,
  Play,
  X,
  Sparkles,
  ChevronRight,
  Award,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const CourseCatalog = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollingId, setEnrollingId] = useState(null);

  const categories = ['All', 'Full-Stack', 'Frontend', 'Backend', 'AI & Machine Learning', 'Cloud & DevOps', 'Data Structures & Algorithms'];

  const fetchCoursesAndEnrollments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);

      const [coursesRes, enrollRes] = await Promise.all([
        api.get(`/courses?${params.toString()}`),
        api.get('/courses/my/enrolled').catch(() => ({ success: false })),
      ]);

      if (coursesRes.success && coursesRes.data) {
        setCourses(coursesRes.data);
      }

      if (enrollRes.success && Array.isArray(enrollRes.data)) {
        const ids = new Set(enrollRes.data.map((e) => e.course?._id || e.course));
        setEnrolledCourseIds(ids);
      }
    } catch {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndEnrollments();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCoursesAndEnrollments();
  };

  const handleEnrollAndLaunch = async (courseId) => {
    try {
      setEnrollingId(courseId);
      const res = await api.post(`/courses/${courseId}/enroll`);
      if (res.success) {
        toast.success('Enrolled! Entering classroom...');
        setEnrolledCourseIds((prev) => new Set(prev).add(courseId));
        setTimeout(() => {
          navigate(`/student/courses/${courseId}/learn`);
        }, 300);
      }
    } catch (err) {
      toast.error(err.message || 'Enrollment failed');
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col font-sans transition-colors duration-300">
      <StudentNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-500/10 text-terracotta-700 dark:text-terracotta-300 text-xs font-semibold font-mono mb-2 border border-terracotta-500/20">
              <BookOpen className="w-3.5 h-3.5" /> Academic Curriculum Catalog
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-parchment-50">Course Catalog</h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              Browse industry-standard engineering tracks with integrated modules, videos, assignments, and AI code assessments.
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses or topics..."
                className="w-full bg-white dark:bg-ink-900 border border-stone-300 dark:border-ink-700 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-900 dark:text-parchment-100 placeholder-stone-400 focus:outline-none focus:border-terracotta-500"
              />
            </div>
            <Button type="submit" size="sm" variant="terracotta">
              Search
            </Button>
          </form>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-200 dark:border-ink-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-terracotta-500 text-white shadow-sm'
                  : 'bg-white dark:bg-ink-900 text-stone-600 dark:text-stone-400 border border-stone-300 dark:border-ink-800 hover:border-stone-400 dark:hover:border-ink-700'
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
              <div key={n} className="h-80 rounded-3xl bg-stone-200 dark:bg-ink-900/60 animate-pulse border border-stone-300 dark:border-ink-800"></div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {courses.map((course) => {
              const isEnrolled = enrolledCourseIds.has(course._id);
              return (
                <StudioTiltCard key={course._id} className="p-0 overflow-hidden flex flex-col justify-between group">
                  <div>
                    {/* Thumbnail Banner */}
                    <div className="relative aspect-video w-full overflow-hidden bg-stone-900">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-900/90 text-terracotta-300 backdrop-blur-md border border-stone-800 font-mono">
                          {course.category}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-jade-600/90 text-white backdrop-blur-md font-mono">
                          {course.isFree ? 'Free Access' : `$${course.price}`}
                        </span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" /> {course.rating || 5.0} ({course.ratingCount || 10})
                        </span>
                        <span>{course.difficulty}</span>
                        <span className="font-mono">{course.duration}</span>
                      </div>

                      <h3 className="text-base font-serif font-bold text-stone-900 dark:text-parchment-50 line-clamp-2 leading-snug group-hover:text-terracotta-600 dark:group-hover:text-amber-300 transition-colors">
                        {course.title}
                      </h3>

                      <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      <div className="pt-2 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between border-t border-stone-100 dark:border-ink-800">
                        <span>Instructor: <strong className="text-stone-800 dark:text-stone-200">{course.instructorName}</strong></span>
                        <span className="font-mono">{course.modules?.length || 0} Modules</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-5 pt-0 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1 text-xs"
                      onClick={() => setSelectedCourse(course)}
                    >
                      Syllabus
                    </Button>

                    {isEnrolled ? (
                      <Link to={`/student/courses/${course._id}/learn`} className="flex-1">
                        <Button
                          size="sm"
                          variant="jade"
                          icon={Play}
                          className="w-full text-xs"
                        >
                          Enter Classroom
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        size="sm"
                        variant="terracotta"
                        className="flex-1 text-xs"
                        isLoading={enrollingId === course._id}
                        onClick={() => handleEnrollAndLaunch(course._id)}
                      >
                        Enroll Now
                      </Button>
                    )}
                  </div>
                </StudioTiltCard>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm">
            <BookOpen className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-parchment-50 mb-1">No courses match your filter</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 max-w-sm mx-auto mb-4 leading-relaxed">
              Try adjusting your search terms or select &quot;All&quot; categories to view available programs.
            </p>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Course Syllabus Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 border border-stone-200 dark:border-terracotta-500/30 rounded-3xl bg-white dark:bg-ink-900 shadow-2xl space-y-4">
              <div className="flex items-start justify-between pb-4 border-b border-stone-200 dark:border-ink-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-terracotta-600 dark:text-terracotta-400 tracking-wider font-mono">
                    {selectedCourse.category} • {selectedCourse.difficulty}
                  </span>
                  <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-parchment-50 mt-1">{selectedCourse.title}</h2>
                  <p className="text-xs text-stone-500 mt-0.5">Faculty Lead: <strong>{selectedCourse.instructorName}</strong></p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-ink-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Learning Outcomes */}
              <div>
                <h4 className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                  What you will master:
                </h4>
                <div className="space-y-1.5">
                  {selectedCourse.learningOutcomes?.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
                      <CheckCircle2 className="w-4 h-4 text-jade-500 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modules & Lessons */}
              <div>
                <h4 className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-3">
                  Curriculum Modules ({selectedCourse.modules?.length || 0}):
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {selectedCourse.modules?.map((mod, modIdx) => (
                    <div key={modIdx} className="p-3.5 rounded-2xl bg-stone-50 dark:bg-ink-850 border border-stone-200 dark:border-ink-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-white">
                        <span>{mod.title}</span>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">{mod.lessons?.length || 0} lessons</span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">{mod.description}</p>

                      <div className="space-y-1 pt-1">
                        {mod.lessons?.map((les, lesIdx) => (
                          <div
                            key={lesIdx}
                            className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800"
                          >
                            <span className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                              <Play className="w-3 h-3 text-terracotta-500" />
                              {les.title}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">{les.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200 dark:border-ink-800">
                <Button size="sm" variant="secondary" onClick={() => setSelectedCourse(null)}>
                  Close
                </Button>
                <Button
                  size="sm"
                  variant="terracotta"
                  onClick={() => {
                    handleEnrollAndLaunch(selectedCourse._id);
                    setSelectedCourse(null);
                  }}
                >
                  {enrolledCourseIds.has(selectedCourse._id) ? 'Launch Classroom' : 'Enroll in this Course'}
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
