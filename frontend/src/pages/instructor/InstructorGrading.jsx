import React, { useState, useEffect } from 'react';
import { InstructorNavbar } from '../../components/layout/InstructorNavbar';
import { Button } from '../../components/ui/Button';
import { StudioTiltCard } from '../../components/ui/StudioTiltCard';
import {
  CheckSquare,
  FileCode,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Code2,
  Clock,
  User,
  ExternalLink,
  Award,
  Terminal,
  Send,
  BookOpen,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const InstructorGrading = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [submittingGrade, setSubmittingGrade] = useState(false);
  const [gradeScore, setGradeScore] = useState(90);
  const [letterGrade, setLetterGrade] = useState('A');
  const [instructorNotes, setInstructorNotes] = useState('');

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/submissions/instructor');
      if (res.success && res.data) {
        setSubmissions(res.data);
        if (res.data.length > 0) {
          const first = res.data[0];
          setSelectedSubmission(first);
          setGradeScore(first.score !== null && first.score !== undefined ? first.score : 90);
          setLetterGrade(first.letterGrade || 'A');
          setInstructorNotes(first.instructorFeedback || '');
        }
      }
    } catch {
      toast.error('Could not load student submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleSelectSubmission = (sub) => {
    setSelectedSubmission(sub);
    setGradeScore(sub.score !== null && sub.score !== undefined ? sub.score : 90);
    setLetterGrade(sub.letterGrade || 'A');
    setInstructorNotes(sub.instructorFeedback || '');
  };

  // Run AI Rubric Assessment on student's submitted code
  const handleRunAIEvaluation = async () => {
    if (!selectedSubmission) return;
    try {
      setEvaluating(true);
      const res = await api.post('/ai/evaluate', {
        taskPrompt: selectedSubmission.assignmentTitle,
        studentCode: selectedSubmission.codeOrText,
        rubric: 'Functional correctness (40%), Clean code (30%), Time/Space complexity (30%)',
        language: 'javascript',
      });

      if (res.success && res.data) {
        const evalData = res.data;
        setGradeScore(evalData.score || 90);
        setLetterGrade(evalData.letterGrade || 'A');
        setInstructorNotes(
          `AI Rubric Assessment Summary: ${evalData.summary}\n\nFaculty Notes: Excellent execution of required functionality. Code meets modular software engineering standards.`
        );

        // Update selected submission in state with AI evaluation
        setSelectedSubmission((prev) => ({
          ...prev,
          aiEvaluation: evalData,
          score: evalData.score,
          letterGrade: evalData.letterGrade,
        }));

        toast.success(`AI Rubric Evaluation Complete: ${evalData.score}/100 (${evalData.letterGrade})`);
      }
    } catch (err) {
      toast.error(err.message || 'AI evaluation failed');
    } finally {
      setEvaluating(false);
    }
  };

  // Publish Grade to Database
  const handleApproveGrade = async () => {
    if (!selectedSubmission) return;
    try {
      setSubmittingGrade(true);
      const res = await api.put(`/submissions/${selectedSubmission._id}/grade`, {
        score: gradeScore,
        letterGrade,
        instructorFeedback: instructorNotes,
      });

      if (res.success) {
        toast.success(`Grade (${gradeScore}/100) published to ${selectedSubmission.studentName}!`);
        // Refresh local list
        setSubmissions((prev) =>
          prev.map((s) => (s._id === selectedSubmission._id ? res.data : s))
        );
        setSelectedSubmission(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit grade');
    } finally {
      setSubmittingGrade(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col font-sans transition-colors duration-300">
      <InstructorNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold font-mono mb-2 border border-amber-500/20">
            <CheckSquare className="w-3.5 h-3.5" /> Faculty Evaluation Suite
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-parchment-50 flex items-center gap-2">
            AI-Assisted Submission Evaluation & Grading
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
            Review submitted student code repositories, run automated rubric analysis via Gemini, and publish official marks.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-mono text-xs text-stone-500">Loading student assignment submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm space-y-3">
            <CheckSquare className="w-12 h-12 text-stone-400 mx-auto" />
            <h3 className="text-base font-serif font-bold">No student submissions pending</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              When students submit assignment milestones in your courses, they will appear here for grading.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Roster of Submissions */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-mono font-bold uppercase text-stone-500 dark:text-stone-400">
                  Student Submissions ({submissions.length})
                </span>
              </div>

              <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
                {submissions.map((sub) => {
                  const isSelected = selectedSubmission?._id === sub._id;
                  const isGraded = sub.status === 'graded';
                  return (
                    <button
                      key={sub._id}
                      onClick={() => handleSelectSubmission(sub)}
                      className={`w-full text-left p-4 rounded-2xl transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/40 text-stone-900 dark:text-white shadow-sm'
                          : 'bg-white dark:bg-ink-900 border-stone-200 dark:border-ink-800 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold">{sub.studentName}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                            isGraded
                              ? 'bg-jade-500/15 text-jade-700 dark:text-jade-300'
                              : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {isGraded ? `${sub.score}/100 (${sub.letterGrade})` : 'Pending Grade'}
                        </span>
                      </div>
                      <p className="text-xs font-serif font-semibold text-stone-800 dark:text-stone-200 truncate">
                        {sub.assignmentTitle}
                      </p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                        {sub.courseTitle}
                      </p>
                      <span className="text-[10px] text-stone-400 font-mono block mt-2">
                        Submitted {new Date(sub.submittedAt).toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Grading Pane & Code Inspector */}
            <div className="lg:col-span-8 space-y-6">
              {selectedSubmission && (
                <div className="p-6 rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm space-y-6">
                  {/* Submission Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-ink-800">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold">
                        {selectedSubmission.courseTitle}
                      </span>
                      <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-white mt-1">
                        {selectedSubmission.assignmentTitle}
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Student: <strong className="text-stone-800 dark:text-stone-200">{selectedSubmission.studentName}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="amber"
                        icon={Sparkles}
                        onClick={handleRunAIEvaluation}
                        isLoading={evaluating}
                      >
                        Run AI Rubric Analysis
                      </Button>
                    </div>
                  </div>

                  {/* Submission Repository URL & Notes */}
                  {(selectedSubmission.submissionUrl || selectedSubmission.notes) && (
                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-ink-850 border border-stone-200 dark:border-ink-750 text-xs space-y-1.5">
                      {selectedSubmission.submissionUrl && (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-500">Repository Link:</span>
                          <a
                            href={selectedSubmission.submissionUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-terracotta-600 dark:text-amber-400 underline flex items-center gap-1 font-mono"
                          >
                            {selectedSubmission.submissionUrl} <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                      {selectedSubmission.notes && (
                        <div>
                          <span className="font-bold text-stone-500">Student Notes:</span> {selectedSubmission.notes}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Student Code Viewer */}
                  <div>
                    <label className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase block mb-1.5 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-amber-500" /> Submitted Code Implementation
                    </label>
                    <div className="rounded-2xl bg-stone-900 text-stone-100 p-4 font-mono text-xs overflow-x-auto max-h-72 border border-stone-800 leading-relaxed">
                      <pre>{selectedSubmission.codeOrText || '// No inline code submitted'}</pre>
                    </div>
                  </div>

                  {/* AI Rubric Evaluation Card */}
                  {selectedSubmission.aiEvaluation && (
                    <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" /> AI Rubric Pre-Assessment
                        </span>
                        <span className="text-sm font-bold font-mono text-amber-600 dark:text-amber-400">
                          AI Score: {selectedSubmission.aiEvaluation.score}/100 ({selectedSubmission.aiEvaluation.letterGrade})
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 dark:text-stone-300">{selectedSubmission.aiEvaluation.summary}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {selectedSubmission.aiEvaluation.rubricBreakdown?.map((rub, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-ink-900 border border-amber-500/20">
                            <div className="flex justify-between font-bold text-[11px]">
                              <span>{rub.criterion}</span>
                              <span className="text-amber-600 dark:text-amber-400">{rub.score}/{rub.maxScore}</span>
                            </div>
                            <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">{rub.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Instructor Grading Input Form */}
                  <div className="p-5 rounded-2xl bg-stone-50 dark:bg-ink-850 border border-stone-200 dark:border-ink-800 space-y-4">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                      Official Faculty Assessment
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-mono font-bold text-stone-600 dark:text-stone-400 uppercase block mb-1">
                          Score (0 - 100)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={gradeScore}
                          onChange={(e) => setGradeScore(Number(e.target.value))}
                          className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-ink-900 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white font-mono focus:outline-none focus:border-amber-500 font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono font-bold text-stone-600 dark:text-stone-400 uppercase block mb-1">
                          Letter Grade
                        </label>
                        <input
                          type="text"
                          value={letterGrade}
                          onChange={(e) => setLetterGrade(e.target.value)}
                          placeholder="A+, A, B, etc."
                          className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-ink-900 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white font-mono focus:outline-none focus:border-amber-500 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono font-bold text-stone-600 dark:text-stone-400 uppercase block mb-1">
                        Instructor Feedback & Remarks
                      </label>
                      <textarea
                        rows={3}
                        value={instructorNotes}
                        onChange={(e) => setInstructorNotes(e.target.value)}
                        placeholder="Provide personalized remarks, optimization advice, and encouragement to the student..."
                        className="w-full p-3.5 text-xs rounded-xl bg-white dark:bg-ink-900 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
                      ></textarea>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        size="md"
                        variant="amber"
                        icon={Send}
                        isLoading={submittingGrade}
                        onClick={handleApproveGrade}
                      >
                        Publish Grade & Feedback to Student
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default InstructorGrading;
