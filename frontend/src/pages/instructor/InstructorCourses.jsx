import React, { useState, useEffect } from 'react';
import { InstructorNavbar } from '../../components/layout/InstructorNavbar';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  BookOpen,
  PlusCircle,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  Users,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State for creating a course
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Full Stack Web Development',
    difficulty: 'Intermediate',
    estimatedDurationHours: 20,
    tags: 'React, Node.js, Express, MongoDB',
    modules: [
      {
        title: 'Module 1: Foundations & Architecture',
        lessons: [
          {
            title: 'Project Setup & Environment',
            durationMinutes: 45,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          },
        ],
      },
    ],
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/courses');
      if (res.success) {
        setCourses(res.data || []);
      }
    } catch {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddModule = () => {
    setFormData((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          title: `Module ${prev.modules.length + 1}: Advanced Concepts`,
          lessons: [
            {
              title: 'Lesson 1: Deep Dive',
              durationMinutes: 30,
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            },
          ],
        },
      ],
    }));
  };

  const handleRemoveModule = (index) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Please enter course title and description');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        estimatedDurationHours: Number(formData.estimatedDurationHours) || 10,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        modules: formData.modules,
        published: true,
      };

      const res = await api.post('/courses', payload);
      if (res.success) {
        toast.success('Course created and published successfully!');
        setShowModal(false);
        setFormData({
          title: '',
          description: '',
          category: 'Full Stack Web Development',
          difficulty: 'Intermediate',
          estimatedDurationHours: 20,
          tags: 'React, Node.js, Express, MongoDB',
          modules: [
            {
              title: 'Module 1: Foundations',
              lessons: [{ title: 'Overview', durationMinutes: 30, videoUrl: '' }],
            },
          ],
        });
        fetchCourses();
      }
    } catch (err) {
      toast.error(err.message || 'Error creating course');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <InstructorNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-purple-400" />
              Curriculum & Course Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Design, publish, and manage interactive courses with structured modules and video lessons.
            </p>
          </div>

          <Button
            size="md"
            variant="primary"
            icon={PlusCircle}
            onClick={() => setShowModal(true)}
          >
            Create New Course
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900/80 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <span className="text-xs text-slate-400">
            Showing {filteredCourses.length} course{filteredCourses.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-sm">
              Loading courses...
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-300 font-semibold text-base">No courses found</p>
              <p className="text-slate-500 text-xs mt-1">Click "Create New Course" to get started.</p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <GlassCard
                key={course._id}
                className="p-5 flex flex-col justify-between border-white/10 hover:border-purple-500/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {course.category}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Published
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-100 text-base group-hover:text-purple-300 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      <span>{course.estimatedDurationHours || 15}h duration</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{course.modules?.length || 1} modules</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/5">
                  <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    {course.enrolledStudentsCount || 0} enrolled
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                    {course.difficulty}
                  </span>
                </div>
              </GlassCard>
            ))
          )}
        </div>

        {/* Create Course Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-purple-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-lg text-white">Create New Course</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-4">
                <Input
                  label="Course Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Master Modern Distributed Systems with Go & Kafka"
                  required
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Course Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Comprehensive hands-on course covering architectural patterns, event-driven pipelines, and high-throughput systems."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950/80 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-white/10 text-slate-200 focus:outline-none focus:border-purple-500/50"
                    >
                      <option>Full Stack Web Development</option>
                      <option>Artificial Intelligence & ML</option>
                      <option>Data Structures & Algorithms</option>
                      <option>DevOps & Cloud Architecture</option>
                      <option>Cybersecurity & Defense</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Difficulty
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-white/10 text-slate-200 focus:outline-none focus:border-purple-500/50"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>

                  <Input
                    label="Est. Duration (Hours)"
                    type="number"
                    value={formData.estimatedDurationHours}
                    onChange={(e) =>
                      setFormData({ ...formData, estimatedDurationHours: e.target.value })
                    }
                  />
                </div>

                <Input
                  label="Keywords / Tags (comma separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="React, Microservices, Node.js"
                />

                {/* Modules Builder */}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-400" /> Syllabus Modules ({formData.modules.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddModule}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Module
                    </button>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {formData.modules.map((mod, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-slate-300">{mod.title}</span>
                        {formData.modules.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveModule(idx)}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

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
                    Publish Course
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

export default InstructorCourses;
