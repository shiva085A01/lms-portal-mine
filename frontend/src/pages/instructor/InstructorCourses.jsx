import React, { useState, useEffect } from 'react';
import { InstructorNavbar } from '../../components/layout/InstructorNavbar';
import { Button } from '../../components/ui/Button';
import { StudioTiltCard } from '../../components/ui/StudioTiltCard';
import {
  BookOpen,
  PlusCircle,
  Users,
  Clock,
  Layers,
  Search,
  X,
  Plus,
  Trash2,
  Video,
  Sparkles,
  Edit,
  Code2,
  CheckSquare,
  Bell,
  Star,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [selectedCourseForAnnounce, setSelectedCourseForAnnounce] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [announcementData, setAnnouncementData] = useState({
    title: '',
    content: '',
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Full-Stack',
    difficulty: 'Intermediate',
    duration: '8 weeks',
    modules: [
      {
        title: 'Module 1: Foundations',
        description: 'Core concepts and environment setup',
        lessons: [
          {
            title: 'Lesson 1: Introduction',
            description: 'Overview and architecture',
            contentType: 'video',
            contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duration: '15 min',
          },
        ],
      },
    ],
    assignments: [
      {
        title: 'Milestone 1: Project Architecture Setup',
        description: 'Implement core modules and unit tests',
        taskPrompt: 'Write clean modular functions meeting requirements.',
        rubric: 'Functional correctness (40%), Clean code (30%), Complexity (30%)',
        points: 100,
      },
    ],
    quizzes: [
      {
        title: 'Module 1 Knowledge Check',
        description: 'Test fundamental concepts',
        timeLimitMinutes: 10,
        questions: [
          {
            question: 'What is the primary benefit of modular code architecture?',
            options: ['Maintainability and testability', 'Slower execution', 'Bigger bundle size', 'No difference'],
            correctAnswerIndex: 0,
            explanation: 'Modular architecture separates concerns and improves testability.',
          },
        ],
      },
    ],
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/courses/instructor/my-courses');
      if (res.success && res.data) {
        setCourses(res.data);
      }
    } catch {
      toast.error('Could not load instructor courses');
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
          title: `Module ${prev.modules.length + 1}: Next Topic`,
          description: 'Module objectives and hands-on exercises',
          lessons: [
            {
              title: 'Lesson 1: Deep Dive',
              description: 'Implementation walk-through',
              contentType: 'video',
              contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
              duration: '20 min',
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

  const handleAddLesson = (modIndex) => {
    setFormData((prev) => {
      const updated = [...prev.modules];
      updated[modIndex].lessons.push({
        title: `Lesson ${updated[modIndex].lessons.length + 1}: New Topic`,
        description: 'Lesson notes',
        contentType: 'video',
        contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: '15 min',
      });
      return { ...prev, modules: updated };
    });
  };

  const handleCreateOrUpdateCourse = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Please enter course title and description');
      return;
    }

    try {
      setSubmitting(true);
      if (editingCourseId) {
        const res = await api.put(`/courses/${editingCourseId}`, formData);
        if (res.success) {
          toast.success('Course curriculum updated successfully!');
          setShowModal(false);
          setEditingCourseId(null);
          fetchCourses();
        }
      } else {
        const res = await api.post('/courses', formData);
        if (res.success) {
          toast.success('Course created and published successfully!');
          setShowModal(false);
          fetchCourses();
        }
      }
    } catch (err) {
      toast.error(err.message || 'Course saving failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await api.delete(`/courses/${courseId}`);
      if (res.success) {
        toast.success('Course deleted');
        setCourses((prev) => prev.filter((c) => c._id !== courseId));
      }
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementData.title || !announcementData.content) {
      toast.error('Please fill in title and announcement content');
      return;
    }

    try {
      const res = await api.post(`/courses/${selectedCourseForAnnounce._id}/announcements`, announcementData);
      if (res.success) {
        toast.success('Announcement broadcasted to enrolled students!');
        setShowAnnouncementModal(false);
        setAnnouncementData({ title: '', content: '' });
      }
    } catch (err) {
      toast.error(err.message || 'Announcement broadcast failed');
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col font-sans transition-colors duration-300">
      <InstructorNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold font-mono mb-2 border border-amber-500/20">
              <BookOpen className="w-3.5 h-3.5" /> Faculty Curriculum Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-parchment-50">
              Curriculum & Course Management
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              Design, publish, and manage interactive courses with structured modules, video lessons, quizzes, and coding assignments.
            </p>
          </div>

          <Button
            size="md"
            variant="amber"
            icon={PlusCircle}
            onClick={() => {
              setEditingCourseId(null);
              setShowModal(true);
            }}
          >
            Create New Course
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-ink-900 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500"
            />
          </div>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
            Showing {filteredCourses.length} course{filteredCourses.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-stone-500 dark:text-stone-400 text-sm font-mono">
              Loading courses...
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="col-span-full py-12 text-center p-12 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm space-y-3">
              <BookOpen className="w-12 h-12 text-stone-400 mx-auto" />
              <p className="text-stone-800 dark:text-stone-200 font-serif font-bold text-base">No courses found</p>
              <p className="text-stone-500 dark:text-stone-400 text-xs">Click &quot;Create New Course&quot; to get started.</p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <StudioTiltCard
                key={course._id}
                className="p-5 flex flex-col justify-between group bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-mono">
                      {course.category}
                    </span>
                    <span className="text-[10px] font-semibold text-jade-700 dark:text-jade-300 bg-jade-500/10 px-2.5 py-0.5 rounded-full border border-jade-500/20 font-mono">
                      {course.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-stone-900 dark:text-white line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-ink-850 border border-stone-100 dark:border-ink-800 text-xs font-mono text-stone-500 space-y-1">
                    <div className="flex justify-between">
                      <span>{course.enrolledStudentsCount || 0} Learners Enrolled</span>
                      <span className="text-amber-500 font-bold">{course.rating || 5.0}★</span>
                    </div>
                    <div className="flex justify-between text-[11px] pt-1 border-t border-stone-200 dark:border-ink-750">
                      <span>{course.modules?.length || 0} Modules</span>
                      <span>{course.assignments?.length || 0} Assignments</span>
                      <span>{course.quizzes?.length || 0} Quizzes</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-stone-100 dark:border-ink-800 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Bell}
                    className="flex-1 text-xs"
                    onClick={() => {
                      setSelectedCourseForAnnounce(course);
                      setShowAnnouncementModal(true);
                    }}
                  >
                    Broadcast
                  </Button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCourse(course._id)}
                    className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 cursor-pointer"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </StudioTiltCard>
            ))
          )}
        </div>

        {/* Create / Edit Course Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 rounded-3xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-ink-800">
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  {editingCourseId ? 'Edit Course Curriculum' : 'Create & Publish New Course'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOrUpdateCourse} className="space-y-4 text-xs">
                <div>
                  <label className="font-mono font-bold uppercase text-stone-600 dark:text-stone-400 block mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Full-Stack Next.js & AI Systems Architecture"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-mono font-bold uppercase text-stone-600 dark:text-stone-400 block mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono"
                    >
                      <option value="Full-Stack">Full-Stack</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                      <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-mono font-bold uppercase text-stone-600 dark:text-stone-400 block mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-mono font-bold uppercase text-stone-600 dark:text-stone-400 block mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g. 8 weeks"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono font-bold uppercase text-stone-600 dark:text-stone-400 block mb-1">
                    Course Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Comprehensive overview of learning objectives, hands-on projects, and real-world outcomes..."
                    className="w-full p-3 text-xs rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                  ></textarea>
                </div>

                {/* Modules & Lessons Builder */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono font-bold uppercase text-stone-800 dark:text-stone-200">
                      Curriculum Modules ({formData.modules.length})
                    </h4>
                    <Button type="button" size="sm" variant="secondary" icon={Plus} onClick={handleAddModule}>
                      Add Module
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {formData.modules.map((mod, modIdx) => (
                      <div key={modIdx} className="p-4 rounded-2xl bg-stone-50 dark:bg-ink-850 border border-stone-200 dark:border-ink-800 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <input
                            type="text"
                            value={mod.title}
                            onChange={(e) => {
                              const updated = [...formData.modules];
                              updated[modIdx].title = e.target.value;
                              setFormData({ ...formData, modules: updated });
                            }}
                            className="flex-1 font-bold text-xs px-2 py-1 rounded bg-white dark:bg-ink-900 border border-stone-300 dark:border-ink-700"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveModule(modIdx)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Lessons in Module */}
                        <div className="space-y-2 pl-3 border-l-2 border-amber-500/40">
                          {mod.lessons.map((les, lesIdx) => (
                            <div key={lesIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input
                                type="text"
                                placeholder="Lesson Title"
                                value={les.title}
                                onChange={(e) => {
                                  const updated = [...formData.modules];
                                  updated[modIdx].lessons[lesIdx].title = e.target.value;
                                  setFormData({ ...formData, modules: updated });
                                }}
                                className="px-2 py-1 rounded bg-white dark:bg-ink-900 border border-stone-300 dark:border-ink-700"
                              />
                              <input
                                type="text"
                                placeholder="Video URL (.mp4)"
                                value={les.contentUrl}
                                onChange={(e) => {
                                  const updated = [...formData.modules];
                                  updated[modIdx].lessons[lesIdx].contentUrl = e.target.value;
                                  setFormData({ ...formData, modules: updated });
                                }}
                                className="px-2 py-1 rounded bg-white dark:bg-ink-900 border border-stone-300 dark:border-ink-700 font-mono text-[11px]"
                              />
                              <input
                                type="text"
                                placeholder="Duration (15 min)"
                                value={les.duration}
                                onChange={(e) => {
                                  const updated = [...formData.modules];
                                  updated[modIdx].lessons[lesIdx].duration = e.target.value;
                                  setFormData({ ...formData, modules: updated });
                                }}
                                className="px-2 py-1 rounded bg-white dark:bg-ink-900 border border-stone-300 dark:border-ink-700"
                              />
                            </div>
                          ))}

                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="text-[10px] py-0.5 px-2"
                            onClick={() => handleAddLesson(modIdx)}
                          >
                            + Add Lesson
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-stone-100 dark:border-ink-800">
                  <Button type="button" size="sm" variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" variant="amber" isLoading={submitting}>
                    {editingCourseId ? 'Save Changes' : 'Publish Course'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Broadcast Announcement Modal */}
        {showAnnouncementModal && selectedCourseForAnnounce && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg p-6 bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 rounded-3xl shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-ink-800">
                <h3 className="text-base font-serif font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-500" />
                  Broadcast Announcement
                </h3>
                <button
                  onClick={() => setShowAnnouncementModal(false)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-stone-500">
                Send an official announcement to all students enrolled in <strong>{selectedCourseForAnnounce.title}</strong>.
              </p>

              <form onSubmit={handlePostAnnouncement} className="space-y-3">
                <div>
                  <label className="font-mono font-bold uppercase text-stone-600 dark:text-stone-400 block mb-1">
                    Announcement Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={announcementData.title}
                    onChange={(e) => setAnnouncementData({ ...announcementData, title: e.target.value })}
                    placeholder="e.g. Live Q&A Office Hours This Wednesday"
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="font-mono font-bold uppercase text-stone-600 dark:text-stone-400 block mb-1">
                    Announcement Content *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={announcementData.content}
                    onChange={(e) => setAnnouncementData({ ...announcementData, content: e.target.value })}
                    placeholder="Provide details, meeting links, or milestone tips for your students..."
                    className="w-full p-3 rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-stone-100 dark:border-ink-800">
                  <Button type="button" size="sm" variant="secondary" onClick={() => setShowAnnouncementModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" variant="amber">
                    Send to Learners
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
