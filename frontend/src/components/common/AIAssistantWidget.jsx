import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import {
  Sparkles,
  X,
  Send,
  Brain,
  Code2,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Bot,
  User,
  Zap,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AIAssistantWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'evaluate' | 'quiz'

  // Chat State
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am **LearnSphere AI Tutor**. How can I help you with your coding journey today?',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef(null);

  // Evaluator State
  const [evalCode, setEvalCode] = useState('');
  const [evalTask, setEvalTask] = useState('');
  const [evalLanguage, setEvalLanguage] = useState('javascript');
  const [evalResult, setEvalResult] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);

  // Quiz State
  const [quizTopic, setQuizTopic] = useState('React Hooks & State');
  const [quizDifficulty, setQuizDifficulty] = useState('intermediate');
  const [quizData, setQuizData] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    if (activeTab === 'chat' && isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab, isOpen]);

  if (!user) return null; // Only show for logged in students/instructors

  // Handle Send Chat
  const handleSendChat = async (e) => {
    e?.preventDefault();
    if (!inputQuery.trim() || chatLoading) return;

    const userMsg = { role: 'user', content: inputQuery.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setChatLoading(true);

    try {
      const res = await api.post('/ai/tutor-chat', {
        question: userMsg.content,
        chatHistory: messages,
      });

      if (res.success && res.data?.reply) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: res.data.reply },
        ]);
      } else {
        throw new Error(res.message || 'No response received from AI.');
      }
    } catch (err) {
      toast.error(err.message || 'Could not connect to AI Tutor.');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ ' + (err.message || 'AI service error. Please ensure GEMINI_API_KEY is configured in backend/.env.'),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle Code Evaluation
  const handleRunEvaluation = async (e) => {
    e?.preventDefault();
    if (!evalCode.trim() || evalLoading) return;

    setEvalLoading(true);
    setEvalResult(null);

    try {
      const res = await api.post('/ai/evaluate', {
        taskPrompt: evalTask || 'General clean code evaluation',
        studentCode: evalCode,
        language: evalLanguage,
      });

      if (res.success && res.data) {
        setEvalResult(res.data);
        toast.success('AI Evaluation completed!');
      } else {
        throw new Error(res.message || 'Failed to evaluate code.');
      }
    } catch (err) {
      toast.error(err.message || 'Could not run AI Evaluation.');
    } finally {
      setEvalLoading(false);
    }
  };

  // Handle Quiz Generation
  const handleGenerateQuiz = async (e) => {
    e?.preventDefault();
    if (!quizTopic.trim() || quizLoading) return;

    setQuizLoading(true);
    setQuizData(null);
    setSelectedAnswers({});

    try {
      const res = await api.post('/ai/generate-quiz', {
        topic: quizTopic,
        difficulty: quizDifficulty,
        count: 4,
      });

      if (res.success && res.data) {
        setQuizData(res.data);
        toast.success('Generated new AI Quiz!');
      } else {
        throw new Error(res.message || 'Failed to generate quiz.');
      }
    } catch (err) {
      toast.error(err.message || 'Could not generate quiz.');
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <>
      {/* Floating Sparkle Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-brand-600 via-indigo-600 to-pink-500 text-white font-bold text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group border border-white/20"
        >
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>LearnSphere AI</span>
        </button>
      )}

      {/* AI Assistant Modal Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[95vw] sm:w-[500px] h-[650px] max-h-[85vh] flex flex-col rounded-2xl bg-slate-950/95 border border-brand-500/30 shadow-2xl backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-slate-900/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-pink-500 p-0.5 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  LearnSphere AI <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">Gemini 1.5</span>
                </h3>
                <p className="text-[11px] text-slate-400">24/7 Intelligent Learning Companion</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex border-b border-white/5 bg-slate-900/40 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'chat'
                  ? 'text-brand-400 border-b-2 border-brand-400 bg-brand-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-4 h-4" /> AI Tutor
            </button>
            <button
              onClick={() => setActiveTab('evaluate')}
              className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'evaluate'
                  ? 'text-brand-400 border-b-2 border-brand-400 bg-brand-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4" /> Code Evaluator
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'quiz'
                  ? 'text-brand-400 border-b-2 border-brand-400 bg-brand-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" /> Quiz Generator
            </button>
          </div>

          {/* ================= TAB 1: AI TUTOR CHAT ================= */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-lg bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 flex-shrink-0 mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-brand-600 text-white rounded-tr-none'
                          : 'bg-slate-900/90 text-slate-200 border border-white/5 rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex items-center gap-2 text-xs text-brand-400 animate-pulse pl-9">
                    <Sparkles className="w-3.5 h-3.5" /> LearnSphere AI is thinking...
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSendChat} className="p-3 border-t border-white/10 bg-slate-900/60 flex gap-2">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask a question (e.g., Explain useEffect cleanup)..."
                  className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <Button type="submit" size="sm" variant="primary" isLoading={chatLoading} disabled={!inputQuery.trim()}>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
            </div>
          )}

          {/* ================= TAB 2: CODE EVALUATOR ================= */}
          {activeTab === 'evaluate' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <form onSubmit={handleRunEvaluation} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Assignment / Task Goal
                  </label>
                  <input
                    type="text"
                    value={evalTask}
                    onChange={(e) => setEvalTask(e.target.value)}
                    placeholder="e.g. Write a function to reverse a linked list in O(n)"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-300">Your Code Submission</label>
                    <select
                      value={evalLanguage}
                      onChange={(e) => setEvalLanguage(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-[10px] rounded px-1.5 py-0.5 text-slate-300"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="typescript">TypeScript</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                  <textarea
                    rows={6}
                    value={evalCode}
                    onChange={(e) => setEvalCode(e.target.value)}
                    placeholder="Paste your solution code here..."
                    className="w-full font-mono bg-slate-950 border border-slate-700/80 rounded-lg p-3 text-xs text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <Button type="submit" size="sm" variant="primary" className="w-full" isLoading={evalLoading}>
                  <Sparkles className="w-4 h-4 mr-1.5" /> Evaluate Submission
                </Button>
              </form>

              {/* Evaluation Result Display */}
              {evalResult && (
                <div className="p-4 rounded-xl bg-slate-900 border border-brand-500/30 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <div>
                      <span className="text-2xl font-black text-brand-400">{evalResult.score}/100</span>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                        Grade {evalResult.letterGrade}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {evalResult.timeComplexity} | {evalResult.spaceComplexity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{evalResult.summary}</p>

                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">Key Strengths</h5>
                    <ul className="text-xs text-slate-300 list-disc list-inside space-y-0.5">
                      {evalResult.strengths?.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <h5 className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">Actionable Improvements</h5>
                    <ul className="text-xs text-slate-300 list-disc list-inside space-y-0.5">
                      {evalResult.improvements?.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: AI QUIZ GENERATOR ================= */}
          {activeTab === 'quiz' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <form onSubmit={handleGenerateQuiz} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={quizTopic}
                    onChange={(e) => setQuizTopic(e.target.value)}
                    placeholder="Enter topic (e.g. MongoDB Aggregation, Redux Toolkit)..."
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    required
                  />
                  <select
                    value={quizDifficulty}
                    onChange={(e) => setQuizDifficulty(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2 text-slate-300"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <Button type="submit" size="sm" variant="primary" className="w-full" isLoading={quizLoading}>
                  <Zap className="w-4 h-4 mr-1.5 text-amber-300" /> Generate 4-Question Drill
                </Button>
              </form>

              {quizData && (
                <div className="space-y-4 pt-2">
                  {quizData.questions?.map((q, qIndex) => {
                    const selected = selectedAnswers[qIndex];
                    const isAnswered = selected !== undefined;
                    const isCorrect = selected === q.correctAnswerIndex;

                    return (
                      <div key={qIndex} className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-2.5">
                        <div className="text-xs font-bold text-white flex items-start gap-2">
                          <span className="text-brand-400">Q{qIndex + 1}.</span>
                          <span>{q.question}</span>
                        </div>

                        {q.codeSnippet && (
                          <pre className="p-2 rounded bg-black/60 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                            {q.codeSnippet}
                          </pre>
                        )}

                        <div className="space-y-1.5">
                          {q.options?.map((opt, optIndex) => {
                            let btnStyle = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800/80';
                            if (isAnswered) {
                              if (optIndex === q.correctAnswerIndex) {
                                btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-200';
                              } else if (selected === optIndex) {
                                btnStyle = 'border-rose-500 bg-rose-500/20 text-rose-200';
                              }
                            }

                            return (
                              <button
                                key={optIndex}
                                type="button"
                                disabled={isAnswered}
                                onClick={() =>
                                  setSelectedAnswers((prev) => ({
                                    ...prev,
                                    [qIndex]: optIndex,
                                  }))
                                }
                                className={`w-full text-left p-2 rounded-lg border text-xs transition-all ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {isAnswered && (
                          <div className={`p-2 rounded text-[11px] ${isCorrect ? 'bg-emerald-950/50 text-emerald-300' : 'bg-amber-950/50 text-amber-300'}`}>
                            {isCorrect ? '✓ Correct! ' : '✗ Incorrect. '}
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AIAssistantWidget;
