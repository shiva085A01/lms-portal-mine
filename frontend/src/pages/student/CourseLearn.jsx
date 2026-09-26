import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StudentNavbar } from '../../components/layout/StudentNavbar';
import { Button } from '../../components/ui/Button';
import { StudioTiltCard } from '../../components/ui/StudioTiltCard';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Play,
  FileText,
  Video,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  HelpCircle,
  Send,
  MessageSquare,
  Star,
  Clock,
  User,
  ShieldCheck,
  Code2,
  ExternalLink,
  CheckSquare,
  AlertCircle,
  Bell,
  Download,
  Share2,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const CourseLearn = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeTab, setActiveTab] = useState('curriculum'); // 'curriculum' | 'assignments' | 'quizzes' | 'discussions' | 'announcements' | 'reviews' | 'certificate'
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Assignment states
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionCode, setSubmissionCode] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [aiEvaluation, setAiEvaluation] = useState(null);
  const [isEvaluatingAI, setIsEvaluatingAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mySubmissions, setMySubmissions] = useState([]);

  // Quiz states
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  // Q&A discussion states
  const [newQuestion, setNewQuestion] = useState('');
  const [replyText, setReplyText] = useState({});
  const [isPostingQuestion, setIsPostingQuestion] = useState(false);

  // Review states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Fetch Course & Enrollment details
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/courses/${id}`);
      if (res.success && res.data) {
        setCourse(res.data);

        // Set default first lesson
        if (res.data.modules?.length > 0 && res.data.modules[0].lessons?.length > 0) {
          setActiveLesson(res.data.modules[0].lessons[0]);
        }

        // Set default assignment and quiz
        if (res.data.assignments?.length > 0) {
          setSelectedAssignment(res.data.assignments[0]);
        }
        if (res.data.quizzes?.length > 0) {
          setActiveQuiz(res.data.quizzes[0]);
        }
      }

      // Fetch user's enrollment
      const enrollRes = await api.get('/courses/my/enrolled');
      if (enrollRes.success && enrollRes.data) {
        const found = enrollRes.data.find((e) => e.course?._id === id || e.course === id);
        if (found) {
          setEnrollment(found);
        } else {
          // Auto enroll if not enrolled
          const autoEnroll = await api.post(`/courses/${id}/enroll`);
          if (autoEnroll.success) {
            setEnrollment(autoEnroll.data);
          }
        }
      }

      // Fetch student's submissions for this course
      const subRes = await api.get('/submissions/my');
      if (subRes.success && subRes.data) {
        const courseSubs = subRes.data.filter((s) => s.course?._id === id || s.course === id);
        setMySubmissions(courseSubs);
      }
    } catch {
      toast.error('Could not load course workspace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  // Handle Mark Lesson Complete / Incomplete
  const handleToggleLessonComplete = async (lessonTitle) => {
    if (!lessonTitle) return;
    const isCompleted = enrollment?.completedLessons?.includes(lessonTitle);
    try {
      const res = await api.post(`/courses/${id}/progress`, {
        lessonTitle,
        completed: !isCompleted,
      });
      if (res.success) {
        setEnrollment(res.data);
        if (!isCompleted) {
          toast.success(`Marked "${lessonTitle}" as completed!`);
          if (res.data.completionPercentage === 100) {
            toast.success('🎉 100% Course Completed! Verified Certificate Awarded!', { duration: 5000 });
          }
        }
      }
    } catch {
      toast.error('Failed to update lesson progress');
    }
  };

  // AI Rubric Pre-Check for Assignment
  const handleRunAIRubricCheck = async () => {
    if (!submissionCode.trim()) {
      toast.error('Please enter your solution code to run AI evaluation');
      return;
    }

    try {
      setIsEvaluatingAI(true);
      const res = await api.post('/ai/evaluate', {
        taskPrompt: selectedAssignment?.taskPrompt || selectedAssignment?.title,
        studentCode: submissionCode,
        rubric: selectedAssignment?.rubric,
        language: 'javascript',
      });
      if (res.success && res.data) {
        setAiEvaluation(res.data);
        toast.success(`AI Evaluation Score: ${res.data.score}/100 (${res.data.letterGrade})`);
      }
    } catch (err) {
      toast.error(err.message || 'AI evaluation service unavailable');
    } finally {
      setIsEvaluatingAI(false);
    }
  };

  // Submit Assignment to Instructor
  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!submissionCode && !submissionUrl && !submissionNotes) {
      toast.error('Please provide code or repository URL');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        courseId: id,
        assignmentId: selectedAssignment?._id || 'assign-1',
        assignmentTitle: selectedAssignment?.title || 'Course Assignment',
        codeOrText: submissionCode,
        submissionUrl,
        notes: submissionNotes,
        autoEvaluate: true,
      };

      const res = await api.post('/submissions', payload);
      if (res.success) {
        toast.success('Assignment submitted to instructor for official grading!');
        setMySubmissions((prev) => [res.data, ...prev.filter((s) => s._id !== res.data._id)]);
      }
    } catch (err) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Quiz Answers
  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    try {
      setIsSubmittingQuiz(true);
      const answersArray = activeQuiz.questions.map((_, idx) =>
        quizAnswers[idx] !== undefined ? quizAnswers[idx] : -1
      );

      const res = await api.post('/quizzes/submit', {
        courseId: id,
        quizId: activeQuiz._id || 'quiz-1',
        quizTitle: activeQuiz.title,
        userAnswers: answersArray,
      });

      if (res.success) {
        setQuizResult(res.data);
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err.message || 'Quiz submission failed');
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  // Post Question in Course Q&A
  const handlePostQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      setIsPostingQuestion(true);
      const res = await api.post(`/courses/${id}/questions`, { question: newQuestion });
      if (res.success) {
        toast.success('Question posted to Course Q&A!');
        setNewQuestion('');
        fetchCourseData();
      }
    } catch (err) {
      toast.error(err.message || 'Could not post question');
    } finally {
      setIsPostingQuestion(false);
    }
  };

  // Post Answer in Course Q&A
  const handlePostAnswer = async (questionId) => {
    const text = replyText[questionId];
    if (!text || !text.trim()) return;

    try {
      const res = await api.post(`/courses/${id}/questions/${questionId}/answers`, { answer: text });
      if (res.success) {
        toast.success('Reply submitted!');
        setReplyText((prev) => ({ ...prev, [questionId]: '' }));
        fetchCourseData();
      }
    } catch (err) {
      toast.error(err.message || 'Could not submit reply');
    }
  };

  // Submit Course Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      setIsSubmittingReview(true);
      const res = await api.post(`/courses/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      if (res.success) {
        toast.success('Thank you for rating this course!');
        setReviewComment('');
        fetchCourseData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col">
        <StudentNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-terracotta-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-mono text-xs text-stone-500">Loading interactive classroom workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col">
        <StudentNavbar />
        <div className="max-w-xl mx-auto py-20 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-stone-400 mx-auto" />
          <h2 className="text-xl font-bold font-serif">Course not found</h2>
          <Link to="/student/courses">
            <Button size="sm" variant="terracotta">Return to Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const completionPct = enrollment?.completionPercentage || 0;
  const isCompleted = completionPct === 100;

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col font-sans selection:bg-terracotta-500/20 selection:text-terracotta-200">
      <StudentNavbar />

      {/* Course Header Banner */}
      <div className="border-b border-stone-200 dark:border-ink-800 bg-white dark:bg-ink-900/90 backdrop-blur-md px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono">
              <Link to="/student/courses" className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 flex items-center gap-1">
                <ChevronLeft className="w-3.5 h-3.5" /> Courses
              </Link>
              <span className="text-stone-300 dark:text-stone-600">/</span>
              <span className="text-terracotta-600 dark:text-terracotta-400 font-semibold">{course.category}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-white leading-tight">
              {course.title}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Instructor: <strong className="text-stone-800 dark:text-stone-200">{course.instructorName || 'Faculty Lead'}</strong> • {course.difficulty} • {course.duration}
            </p>
          </div>

          {/* Course Progress Summary Bar */}
          <div className="flex items-center gap-4 bg-stone-50 dark:bg-ink-850 border border-stone-200 dark:border-ink-750 px-4 py-3 rounded-2xl shrink-0">
            <div className="text-right">
              <div className="text-xs font-bold font-mono text-stone-900 dark:text-white">
                {completionPct}% Complete
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">
                {enrollment?.completedLessons?.length || 0} Lessons finished
              </div>
            </div>
            <div className="w-24 h-2.5 bg-stone-200 dark:bg-ink-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isCompleted ? 'bg-jade-500' : 'bg-terracotta-500'
                }`}
                style={{ width: `${completionPct}%` }}
              ></div>
            </div>
            {isCompleted && (
              <button
                onClick={() => setActiveTab('certificate')}
                className="px-3 py-1.5 rounded-xl bg-jade-500/15 text-jade-700 dark:text-jade-300 border border-jade-500/30 text-xs font-bold flex items-center gap-1.5 animate-pulse cursor-pointer"
              >
                <Award className="w-4 h-4 text-jade-500" />
                Certificate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-b border-stone-200 dark:border-ink-800 bg-white/50 dark:bg-ink-900/50 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
          {[
            { id: 'curriculum', label: 'Curriculum & Video Content', icon: BookOpen },
            { id: 'assignments', label: `Assignments & AI Lab (${course.assignments?.length || 0})`, icon: Code2 },
            { id: 'quizzes', label: `Quizzes (${course.quizzes?.length || 0})`, icon: CheckSquare },
            { id: 'discussions', label: `Course Q&A (${course.discussions?.length || 0})`, icon: MessageSquare },
            { id: 'announcements', label: `Announcements (${course.announcements?.length || 0})`, icon: Bell },
            { id: 'reviews', label: `Reviews (${course.rating || 5.0}★)`, icon: Star },
            { id: 'certificate', label: 'Verified Certificate', icon: Award, highlight: isCompleted },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-terracotta-500 text-white shadow-sm'
                    : tab.highlight
                    ? 'bg-jade-500/15 text-jade-700 dark:text-jade-300 border border-jade-500/30'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-ink-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {/* =========================================================
            TAB 1: CURRICULUM & INTERACTIVE VIDEO LECTURE
           ========================================================= */}
        {activeTab === 'curriculum' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Video Player & Active Lesson Notes */}
            <div className="lg:col-span-8 space-y-4">
              <div className="rounded-3xl overflow-hidden bg-black aspect-video relative shadow-xl border border-stone-800">
                {activeLesson?.contentType === 'video' ? (
                  <video
                    key={activeLesson?.contentUrl}
                    controls
                    className="w-full h-full object-contain"
                    src={activeLesson?.contentUrl}
                    poster={course.thumbnail}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-stone-300 bg-gradient-to-br from-stone-900 to-stone-950 space-y-4">
                    <FileText className="w-16 h-16 text-terracotta-400" />
                    <div>
                      <h3 className="text-lg font-bold text-white">{activeLesson?.title}</h3>
                      <p className="text-xs text-stone-400 mt-1 max-w-md">{activeLesson?.description}</p>
                    </div>
                    {activeLesson?.contentUrl && (
                      <a
                        href={activeLesson.contentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-terracotta-500 text-white text-xs font-semibold hover:bg-terracotta-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" /> Open Interactive Reading Material
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Lesson Control & Details Bar */}
              <div className="p-5 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-terracotta-500/10 text-terracotta-600 dark:text-terracotta-400 font-bold">
                      {activeLesson?.contentType || 'video'}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">{activeLesson?.duration || '15 min'}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-white">
                    {activeLesson?.title || 'Select a lesson from the curriculum sidebar'}
                  </h2>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {activeLesson?.description || course.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={enrollment?.completedLessons?.includes(activeLesson?.title) ? 'jade' : 'terracotta'}
                    icon={enrollment?.completedLessons?.includes(activeLesson?.title) ? CheckCircle2 : Circle}
                    onClick={() => handleToggleLessonComplete(activeLesson?.title)}
                    className="text-xs"
                  >
                    {enrollment?.completedLessons?.includes(activeLesson?.title)
                      ? 'Completed'
                      : 'Mark Complete'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: Modules & Lessons Hierarchy Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-ink-800">
                  <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-terracotta-500" />
                    Course Modules
                  </h3>
                  <span className="text-[11px] font-mono text-stone-500">
                    {course.modules?.length || 0} Modules
                  </span>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {course.modules?.map((mod, modIdx) => (
                    <div key={modIdx} className="space-y-2">
                      <div className="text-xs font-bold text-stone-800 dark:text-stone-200 font-mono flex items-center justify-between">
                        <span>{mod.title}</span>
                        <span className="text-[10px] text-stone-400">{mod.lessons?.length || 0} lessons</span>
                      </div>

                      <div className="space-y-1">
                        {mod.lessons?.map((les, lesIdx) => {
                          const isCurrent = activeLesson?.title === les.title;
                          const isDone = enrollment?.completedLessons?.includes(les.title);
                          return (
                            <button
                              key={lesIdx}
                              onClick={() => setActiveLesson(les)}
                              className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                                isCurrent
                                  ? 'bg-terracotta-500/15 border border-terracotta-500/30 text-terracotta-700 dark:text-terracotta-300 font-semibold'
                                  : 'bg-stone-50 dark:bg-ink-850 hover:bg-stone-100 dark:hover:bg-ink-800 text-stone-700 dark:text-stone-300 border border-transparent'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate pr-2">
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-jade-500 shrink-0" />
                                ) : isCurrent ? (
                                  <Play className="w-4 h-4 text-terracotta-500 shrink-0 fill-current" />
                                ) : (
                                  <Circle className="w-4 h-4 text-stone-400 shrink-0" />
                                )}
                                <span className="truncate">{les.title}</span>
                              </div>
                              <span className="text-[10px] font-mono text-stone-400 shrink-0">{les.duration}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: ASSIGNMENTS & AI RUBRIC LAB
           ========================================================= */}
        {activeTab === 'assignments' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Assignment List & Selection */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm space-y-3">
                <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-amber-500" />
                  Course Coding Milestones
                </h3>

                <div className="space-y-2">
                  {course.assignments?.map((assign, idx) => {
                    const isSelected = selectedAssignment?._id === assign._id || selectedAssignment?.title === assign.title;
                    const sub = mySubmissions.find((s) => s.assignmentTitle === assign.title || s.assignmentId === assign._id?.toString());
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedAssignment(assign);
                          setAiEvaluation(null);
                        }}
                        className={`w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500/40 text-stone-900 dark:text-white shadow-sm'
                            : 'bg-stone-50 dark:bg-ink-850 border-stone-200 dark:border-ink-800 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className="truncate">{assign.title}</span>
                          {sub?.status === 'graded' ? (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-jade-500/20 text-jade-700 dark:text-jade-300 font-mono">
                              Graded: {sub.score}/100
                            </span>
                          ) : sub ? (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono">
                              Submitted
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-stone-200 dark:bg-ink-700 text-stone-600 dark:text-stone-400 font-mono">
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">{assign.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* My Previous Submissions Box */}
              {mySubmissions.length > 0 && (
                <div className="p-5 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase text-stone-700 dark:text-stone-300">
                    Graded Submissions History
                  </h4>
                  <div className="space-y-2">
                    {mySubmissions.map((sub, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-200 dark:border-ink-800 text-xs space-y-1.5">
                        <div className="flex items-center justify-between font-semibold">
                          <span>{sub.assignmentTitle}</span>
                          <span className="font-mono text-terracotta-600 dark:text-amber-400">
                            {sub.score !== null ? `${sub.score}/100 (${sub.letterGrade})` : 'Under Review'}
                          </span>
                        </div>
                        {sub.instructorFeedback && (
                          <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-stone-700 dark:text-stone-300">
                            <strong>Faculty Feedback:</strong> {sub.instructorFeedback}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Code Submission & AI Evaluator */}
            <div className="lg:col-span-8 space-y-5">
              {selectedAssignment ? (
                <div className="p-6 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm space-y-5">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 font-mono">
                        Assignment Lab • {selectedAssignment.points || 100} Points
                      </span>
                    </div>
                    <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white mt-1">
                      {selectedAssignment.title}
                    </h2>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                      {selectedAssignment.description}
                    </p>
                    <div className="mt-2.5 p-3 rounded-2xl bg-stone-50 dark:bg-ink-850 border border-stone-200 dark:border-ink-800 text-xs font-mono text-stone-700 dark:text-stone-300">
                      <strong>Task Prompt:</strong> {selectedAssignment.taskPrompt}
                    </div>
                  </div>

                  <form onSubmit={handleSubmitAssignment} className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-amber-500" /> Solution Code / Implementation (JavaScript / Python)
                        </label>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={handleRunAIRubricCheck}
                          isLoading={isEvaluatingAI}
                          icon={Sparkles}
                          className="text-[11px] text-amber-600 dark:text-amber-400 border-amber-500/30"
                        >
                          Run AI Rubric Pre-Check
                        </Button>
                      </div>
                      <textarea
                        rows={8}
                        value={submissionCode}
                        onChange={(e) => setSubmissionCode(e.target.value)}
                        placeholder="// Paste your implementation code here...&#10;export function solution() {&#10;  // Your logic here&#10;}"
                        className="w-full p-3.5 rounded-2xl font-mono text-xs bg-stone-900 text-stone-100 border border-stone-700 focus:outline-none focus:border-amber-500 leading-relaxed"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-mono font-bold text-stone-700 dark:text-stone-300 uppercase block mb-1">
                          GitHub / Repository Link (Optional)
                        </label>
                        <input
                          type="url"
                          value={submissionUrl}
                          onChange={(e) => setSubmissionUrl(e.target.value)}
                          placeholder="https://github.com/your-username/repo"
                          className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-terracotta-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono font-bold text-stone-700 dark:text-stone-300 uppercase block mb-1">
                          Implementation Notes / Edge Cases
                        </label>
                        <input
                          type="text"
                          value={submissionNotes}
                          onChange={(e) => setSubmissionNotes(e.target.value)}
                          placeholder="Handled null inputs, O(1) space complexity..."
                          className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-terracotta-500"
                        />
                      </div>
                    </div>

                    {/* AI Rubric Evaluation Card */}
                    {aiEvaluation && (
                      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4" /> AI Rubric Assessment Result
                          </span>
                          <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">
                            {aiEvaluation.score}/100 ({aiEvaluation.letterGrade})
                          </span>
                        </div>
                        <p className="text-xs text-stone-700 dark:text-stone-200">{aiEvaluation.summary}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {aiEvaluation.rubricBreakdown?.map((rub, i) => (
                            <div key={i} className="p-2 rounded bg-white/80 dark:bg-ink-900/80 border border-amber-500/20">
                              <div className="flex justify-between font-semibold text-[11px]">
                                <span>{rub.criterion}</span>
                                <span>{rub.score}/{rub.maxScore}</span>
                              </div>
                              <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">{rub.comment}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                      <Button
                        type="submit"
                        size="md"
                        variant="terracotta"
                        isLoading={isSubmitting}
                        icon={Send}
                      >
                        Submit Assignment for Instructor Grading
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="p-12 text-center rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800">
                  <Code2 className="w-12 h-12 text-stone-400 mx-auto mb-2" />
                  <p className="text-sm font-serif font-bold">No assignment selected</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: INTERACTIVE QUIZZES
           ========================================================= */}
        {activeTab === 'quizzes' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {activeQuiz ? (
              <div className="p-6 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-ink-800">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-terracotta-600 dark:text-terracotta-400">
                      Timed Checkpoint • {activeQuiz.timeLimitMinutes} Mins
                    </span>
                    <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white mt-0.5">
                      {activeQuiz.title}
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{activeQuiz.description}</p>
                  </div>
                  <div className="text-right font-mono text-xs text-stone-500">
                    {activeQuiz.questions?.length || 0} Questions
                  </div>
                </div>

                {/* Question List */}
                <div className="space-y-6">
                  {activeQuiz.questions?.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 rounded-2xl bg-stone-50 dark:bg-ink-850 border border-stone-200 dark:border-ink-800 space-y-3">
                      <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-white">
                        {qIdx + 1}. {q.question}
                      </p>

                      <div className="space-y-2">
                        {q.options?.map((opt, optIdx) => {
                          const isSelected = quizAnswers[qIdx] === optIdx;
                          return (
                            <label
                              key={optIdx}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-terracotta-500/15 border-terracotta-500 text-terracotta-800 dark:text-terracotta-200 font-semibold'
                                  : 'bg-white dark:bg-ink-900 border-stone-200 dark:border-ink-750 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${qIdx}`}
                                checked={isSelected}
                                onChange={() => setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                                className="w-4 h-4 text-terracotta-500"
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>

                      {/* Quiz Result Answer Review */}
                      {quizResult && quizResult.answers && quizResult.answers[qIdx] && (
                        <div className={`p-3 rounded-xl text-xs ${
                          quizResult.answers[qIdx].isCorrect
                            ? 'bg-jade-500/15 text-jade-800 dark:text-jade-200 border border-jade-500/30'
                            : 'bg-rose-500/15 text-rose-800 dark:text-rose-200 border border-rose-500/30'
                        }`}>
                          <p className="font-bold">
                            {quizResult.answers[qIdx].isCorrect ? '✅ Correct Answer!' : '❌ Incorrect'}
                          </p>
                          <p className="text-[11px] mt-1">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Score Banner */}
                {quizResult && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-terracotta-600 to-amber-600 text-white text-center space-y-1">
                    <h3 className="text-lg font-bold">Quiz Score: {quizResult.score}%</h3>
                    <p className="text-xs text-white/90">
                      {quizResult.passed ? '🎉 Congratulations, you passed!' : 'Review the explanations above and try again!'}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    size="md"
                    variant="terracotta"
                    isLoading={isSubmittingQuiz}
                    onClick={handleSubmitQuiz}
                  >
                    Submit Quiz for Evaluation
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800">
                <CheckSquare className="w-12 h-12 text-stone-400 mx-auto mb-2" />
                <p className="text-sm font-serif font-bold">No quizzes available in this course</p>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 4: COURSE Q&A & STUDENT-INSTRUCTOR DISCUSSIONS
           ========================================================= */}
        {activeTab === 'discussions' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Ask Question Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm space-y-4">
              <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-terracotta-500" />
                Ask a Question to the Course Instructor & Peers
              </h3>
              <form onSubmit={handlePostQuestion} className="space-y-3">
                <textarea
                  rows={3}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. How does the JWT authorization header get validated on subsequent requests?"
                  className="w-full p-3.5 text-xs rounded-2xl bg-stone-50 dark:bg-ink-850 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-terracotta-500"
                ></textarea>
                <div className="flex justify-end">
                  <Button type="submit" size="sm" variant="terracotta" isLoading={isPostingQuestion} icon={Send}>
                    Post Question
                  </Button>
                </div>
              </form>
            </div>

            {/* Questions Thread List */}
            <div className="space-y-4">
              {course.discussions?.length === 0 ? (
                <div className="p-10 text-center rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800">
                  <MessageSquare className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs text-stone-500">No questions posted yet. Be the first to ask!</p>
                </div>
              ) : (
                course.discussions?.map((disc) => (
                  <div key={disc._id} className="p-5 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-terracotta-500/20 text-terracotta-600 font-bold text-xs flex items-center justify-center">
                          {disc.userName?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-stone-900 dark:text-white">{disc.userName}</span>
                          <span className="ml-2 text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-100 dark:bg-ink-800 text-stone-500">
                            {disc.userRole}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(disc.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 pl-9">
                      {disc.question}
                    </p>

                    {/* Answers Thread */}
                    {disc.answers?.length > 0 && (
                      <div className="ml-9 space-y-2 pt-2 border-t border-stone-100 dark:border-ink-800">
                        {disc.answers.map((ans, aIdx) => (
                          <div key={aIdx} className="p-3 rounded-2xl bg-stone-50 dark:bg-ink-850 border border-stone-200 dark:border-ink-750 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-100">
                                <span>{ans.userName}</span>
                                {ans.userRole === 'instructor' && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono font-bold">
                                    INSTRUCTOR
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-stone-400 font-mono">
                                {new Date(ans.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{ans.answer}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input */}
                    <div className="ml-9 flex gap-2 pt-2">
                      <input
                        type="text"
                        value={replyText[disc._id] || ''}
                        onChange={(e) => setReplyText((prev) => ({ ...prev, [disc._id]: e.target.value }))}
                        placeholder="Write a reply to this question..."
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-stone-50 dark:bg-ink-850 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-terracotta-500"
                      />
                      <Button size="sm" variant="secondary" onClick={() => handlePostAnswer(disc._id)}>
                        Reply
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: INSTRUCTOR ANNOUNCEMENTS
           ========================================================= */}
        {activeTab === 'announcements' && (
          <div className="max-w-3xl mx-auto space-y-4">
            {course.announcements?.length === 0 ? (
              <div className="p-10 text-center rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800">
                <Bell className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                <p className="text-xs text-stone-500">No announcements posted for this course yet.</p>
              </div>
            ) : (
              course.announcements?.map((ann, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-mono text-terracotta-600 dark:text-terracotta-400 font-bold">
                      {ann.authorName || course.instructorName}
                    </span>
                    <span className="font-mono">{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-stone-900 dark:text-white">{ann.title}</h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{ann.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* =========================================================
            TAB 6: REVIEWS & RATINGS
           ========================================================= */}
        {activeTab === 'reviews' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Submit Review Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm space-y-4">
              <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                Rate & Review this Course
              </h3>

              <form onSubmit={handleSubmitReview} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-stone-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with the modules, clarity of lectures, and project assignments..."
                  className="w-full p-3.5 text-xs rounded-2xl bg-stone-50 dark:bg-ink-850 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-terracotta-500"
                ></textarea>

                <div className="flex justify-end">
                  <Button type="submit" size="sm" variant="terracotta" isLoading={isSubmittingReview}>
                    Submit Course Review
                  </Button>
                </div>
              </form>
            </div>

            {/* Existing Reviews List */}
            <div className="space-y-3">
              {course.reviews?.map((rev, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 dark:text-white">{rev.studentName}</span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold font-mono">
                      <Star className="w-3.5 h-3.5 fill-current" /> {rev.rating}.0
                    </div>
                  </div>
                  <p className="text-stone-600 dark:text-stone-300">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 7: VERIFIED CERTIFICATE OF COMPLETION
           ========================================================= */}
        {activeTab === 'certificate' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {isCompleted ? (
              <div className="p-8 rounded-3xl bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-amber-500/40 text-white shadow-2xl space-y-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="space-y-2">
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-300 shadow-lg">
                    <Award className="w-8 h-8" />
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold block">
                    Official Credential of Completion
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    Certificate of Academic Mastery
                  </h2>
                </div>

                <div className="py-4 border-y border-stone-800 space-y-2">
                  <p className="text-xs text-stone-400">This certifies that</p>
                  <h3 className="text-2xl font-serif font-bold text-amber-300">
                    {enrollment?.studentName || 'Sarah Connor'}
                  </h3>
                  <p className="text-xs text-stone-300 max-w-lg mx-auto leading-relaxed">
                    has successfully completed all modules, assignments, and coding evaluations for
                  </p>
                  <h4 className="text-lg font-serif font-bold text-white">{course.title}</h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-stone-400 text-left bg-stone-900/60 p-4 rounded-2xl border border-stone-800">
                  <div>
                    <span className="text-[10px] text-stone-500 block">CREDENTIAL ID</span>
                    <span className="text-amber-400 font-bold">{enrollment?.certificateId || 'CERT-FUL-891042'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">HONOR GRADE</span>
                    <span className="text-white font-bold">A+ Honors</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">FACULTY LEAD</span>
                    <span className="text-white font-bold">{course.instructorName || 'Dr. Alan Turing'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">VERIFIED STATUS</span>
                    <span className="text-jade-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Button
                    size="md"
                    variant="amber"
                    icon={Download}
                    onClick={() => window.print()}
                  >
                    Print / Download Credential
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm space-y-3">
                <Award className="w-12 h-12 text-stone-400 mx-auto" />
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white">Certificate Locked</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                  Complete 100% of the course modules, quizzes, and assignment milestones to earn and unlock your verifiable credential. Current progress: <strong>{completionPct}%</strong>.
                </p>
                <Button size="sm" variant="terracotta" onClick={() => setActiveTab('curriculum')}>
                  Continue Learning
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseLearn;
