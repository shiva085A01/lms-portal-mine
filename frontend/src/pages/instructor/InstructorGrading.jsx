import React, { useState } from 'react';
import { InstructorNavbar } from '../../components/layout/InstructorNavbar';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import {
  CheckSquare,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  User,
  Code,
  FileText,
  ChevronRight,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const InstructorGrading = () => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [gradeScore, setGradeScore] = useState(92);
  const [instructorNotes, setInstructorNotes] = useState('');

  const [submissions, setSubmissions] = useState([
    {
      id: 'sub-1',
      studentName: 'Alex Mercer',
      studentEmail: 'alex@student.lms.com',
      assignmentTitle: 'Project 3: Distributed Rate Limiter with Redis & Express',
      courseTitle: 'Full Stack Web Development & Microservices',
      submittedAt: 'Today at 08:30 AM',
      status: 'pending',
      repoUrl: 'https://github.com/alex-dev/rate-limiter-redis',
      codeSnippet: `// Sliding window counter rate limiter\nasync function rateLimiter(req, res, next) {\n  const ip = req.ip;\n  const key = \`rate_limit:\${ip}\`;\n  const current = await redis.incr(key);\n  if (current === 1) {\n    await redis.expire(key, 60);\n  }\n  if (current > 100) {\n    return res.status(429).json({ error: "Too many requests" });\n  }\n  next();\n}`,
      aiSummary: 'Excellent algorithm implementation using Sliding Window counter with Redis expiration. Code adheres to clean architecture.',
      aiScore: 94,
    },
    {
      id: 'sub-2',
      studentName: 'Elena Rostova',
      studentEmail: 'elena@student.lms.com',
      assignmentTitle: 'Mini Project: Trie Tree Auto-Complete Engine',
      courseTitle: 'Data Structures & Algorithms in Java & C++',
      submittedAt: 'Yesterday at 4:15 PM',
      status: 'pending',
      repoUrl: 'https://github.com/elena/trie-autocomplete',
      codeSnippet: `class TrieNode {\n  Map<Character, TrieNode> children = new HashMap<>();\n  boolean isEndOfWord;\n}\npublic List<String> autocomplete(String prefix) {\n  TrieNode curr = root;\n  for (char c : prefix.toCharArray()) {\n    if (!curr.children.containsKey(c)) return Collections.emptyList();\n    curr = curr.children.get(c);\n  }\n  return collectWords(curr, prefix);\n}`,
      aiSummary: 'Clean DFS traversal. Recommended optimization: store top 5 frequency suggestions directly on nodes for O(1) prefix lookup.',
      aiScore: 90,
    },
    {
      id: 'sub-3',
      studentName: 'Jordan Lee',
      studentEmail: 'jordan@student.lms.com',
      assignmentTitle: 'Kubernetes Helm Deployment & CI/CD Pipeline',
      courseTitle: 'DevOps & Cloud Architecture',
      submittedAt: '2 days ago',
      status: 'graded',
      repoUrl: 'https://github.com/jordan/helm-cicd',
      codeSnippet: `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: {{ .Release.Name }}-app\nspec:\n  replicas: {{ .Values.replicaCount }}\n  template:\n    spec:\n      containers:\n        - name: app\n          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"`,
      aiSummary: 'Comprehensive Helm values templates with automated rolling updates and health probe endpoints configured.',
      aiScore: 96,
    },
  ]);

  const activeSubmission = selectedSubmission || submissions[0];

  const handleRunAIEvaluation = () => {
    setEvaluating(true);
    setTimeout(() => {
      setEvaluating(false);
      setGradeScore(activeSubmission.aiScore || 92);
      setInstructorNotes(
        `AI Rubric Evaluation: ${activeSubmission.aiSummary}\n\nInstructor Remarks: Approved with high marks. Great attention to performance standards and edge cases.`
      );
      toast.success('AI Rubric Analysis complete!');
    }, 1000);
  };

  const handleApproveGrade = () => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === activeSubmission.id ? { ...s, status: 'graded' } : s))
    );
    toast.success(`Grade (${gradeScore}/100) and evaluation published to student!`);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <InstructorNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <CheckSquare className="w-7 h-7 text-purple-400" />
            AI-Assisted Submission Evaluation & Grading
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review submitted student code repositories, run automated rubric analysis, and provide feedback.
          </p>
        </div>

        {/* 2-Column Evaluation Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Submissions Queue */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between">
              <span>Student Submissions</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300">
                {submissions.filter((s) => s.status === 'pending').length} Pending
              </span>
            </h3>

            <div className="space-y-2.5">
              {submissions.map((sub) => {
                const isSelected = activeSubmission.id === sub.id;
                return (
                  <GlassCard
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubmission(sub);
                      setInstructorNotes('');
                    }}
                    className={`p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple-500/50 bg-purple-950/20 shadow-glow'
                        : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-200 line-clamp-1">
                        {sub.studentName}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          sub.status === 'graded'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-300 line-clamp-1">{sub.assignmentTitle}</p>
                    <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {sub.submittedAt}
                    </p>
                  </GlassCard>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Submission Details & Grading Studio */}
          <div className="lg:col-span-2 space-y-4">
            <GlassCard className="p-6 border-white/10 space-y-6">
              {/* Submission Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                    {activeSubmission.courseTitle}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-1.5">
                    {activeSubmission.assignmentTitle}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Submitted by <strong className="text-slate-200">{activeSubmission.studentName}</strong> ({activeSubmission.studentEmail})
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  icon={Sparkles}
                  isLoading={evaluating}
                  onClick={handleRunAIEvaluation}
                >
                  Run AI Rubric Evaluation
                </Button>
              </div>

              {/* Code / Submission Preview */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-cyan-400" /> Submitted Code Architecture
                  </span>
                  <a
                    href={activeSubmission.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-400 hover:underline"
                  >
                    View Git Repo
                  </a>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 border border-white/10 font-mono text-xs text-slate-300 overflow-x-auto">
                  <code>{activeSubmission.codeSnippet}</code>
                </pre>
              </div>

              {/* AI Rubric Findings */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Rubric Analysis
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    AI Score: {activeSubmission.aiScore}/100
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeSubmission.aiSummary}
                </p>
              </div>

              {/* Grading Input & Remarks */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  <div className="w-36">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Final Score / 100
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={gradeScore}
                      onChange={(e) => setGradeScore(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-white/10 text-white font-bold text-base focus:border-purple-500/50"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Faculty Remarks & Student Feedback
                    </label>
                    <input
                      type="text"
                      placeholder="Add custom instructor comments..."
                      value={instructorNotes}
                      onChange={(e) => setInstructorNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:border-purple-500/50"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <Button
                    size="md"
                    variant="primary"
                    icon={Send}
                    onClick={handleApproveGrade}
                  >
                    Publish Grade & Notify Student
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorGrading;
