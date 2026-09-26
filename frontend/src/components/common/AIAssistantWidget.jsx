import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import {
  Sparkles,
  X,
  Send,
  Compass,
  Code2,
  Bot,
  Zap,
  CheckCircle2,
  AlertCircle,
  Copy,
  Terminal,
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
      content: 'Hello! I am **LearnSphere AI Tutor**. Ask questions, analyze code algorithms, or request an interactive study drill.',
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

  if (!user) return null; // Only show for logged in users

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
          content: '⚠️ ' + (err.message || 'AI service error. Please verify GEMINI_API_KEY in backend/.env.'),
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
        toast.success('Generated new AI Quiz drill!');
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
      {/* Floating LMS Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-terracotta-600 via-terracotta-500 to-amber-600 text-white font-bold text-xs shadow-lg shadow-terracotta-500/30 hover:scale-105 active:scale-95 transition-all duration-200 group border border-terracotta-400/40 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
          <span className="tracking-wide">AI Tutor & Evaluator</span>
        </button>
      )}

      {/* AI Assistant Modal Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[95vw] sm:w-[500px] h-[650px] max-h-[85vh] flex flex-col rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-terracotta-500/30 shadow-2xl backdrop-blur-2xl overflow-hidden animate-slide-up font-sans transition-colors duration-300">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 dark:border-ink-800 bg-stone-50 dark:bg-ink-850">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-terracotta-600 to-amber-500 p-0.5 flex items-center justify-center shadow-sm">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-parchment-50 flex items-center gap-1.5">
                  LearnSphere AI <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-terracotta-500/15 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-500/30 font-mono">Gemini LMS</span>
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">24/7 Intelligent Learning Companion</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-ink-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex border-b border-stone-200 dark:border-ink-800 bg-stone-100/80 dark:bg-ink-950 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'chat'
                  ? 'text-terracotta-600 dark:text-terracotta-400 border-b-2 border-terracotta-500 bg-terracotta-500/10'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Bot className="w-4 h-4" /> AI Tutor
            </button>
            <button
              onClick={() => setActiveTab('evaluate')}
              className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'evaluate'
                  ? 'text-terracotta-600 dark:text-terracotta-400 border-b-2 border-terracotta-500 bg-terracotta-500/10'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Code2 className="w-4 h-4" /> Code Evaluator
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'quiz'
                  ? 'text-terracotta-600 dark:text-terracotta-400 border-b-2 border-terracotta-500 bg-terracotta-500/10'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-500" /> Quiz Generator
            </button>
          </div>

          {/* ================= TAB 1: AI TUTOR CHAT ================= */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden bg-white dark:bg-ink-900">
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-xl bg-terracotta-500/15 border border-terracotta-500/30 flex items-center justify-center text-terracotta-600 dark:text-terracotta-400 shrink-0 mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-terracotta-500 text-white rounded-tr-none'
                          : 'bg-stone-100 dark:bg-ink-850 text-stone-900 dark:text-stone-200 border border-stone-200 dark:border-ink-750 rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex items-center gap-2 text-xs text-terracotta-600 dark:text-terracotta-400 animate-pulse pl-9">
                    <Sparkles className="w-3.5 h-3.5" /> Thinking...
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSendChat} className="p-3 border-t border-stone-200 dark:border-ink-800 bg-stone-50 dark:bg-ink-850 flex gap-2">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask a technical question..."
                  className="flex-1 bg-white dark:bg-ink-950 border border-stone-300 dark:border-ink-700 rounded-xl px-3.5 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-terracotta-500"
                />
                <Button type="submit" size="sm" variant="terracotta" isLoading={chatLoading} disabled={!inputQuery.trim()}>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
            </div>
          )}

          {/* ================= TAB 2: CODE EVALUATOR ================= */}
          {activeTab === 'evaluate' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-ink-900">
              <form onSubmit={handleRunEvaluation} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1 font-mono">
                    Assignment Goal / Task Description
                  </label>
                  <input
                    type="text"
                    value={evalTask}
                    onChange={(e) => setEvalTask(e.target.value)}
                    placeholder="e.g. Implement an LRU Cache with O(1) get and put"
                    className="w-full bg-stone-50 dark:bg-ink-950 border border-stone-300 dark:border-ink-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-terracotta-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 font-mono">Your Code Submission</label>
                    <select
                      value={evalLanguage}
                      onChange={(e) => setEvalLanguage(e.target.value)}
                      className="bg-stone-50 dark:bg-ink-950 border border-stone-300 dark:border-ink-700 text-[10px] rounded-lg px-2 py-0.5 text-stone-700 dark:text-stone-300 font-mono"
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
                    placeholder="Paste your source code here..."
                    className="w-full font-mono bg-stone-900 text-amber-300 dark:bg-ink-950 border border-stone-800 dark:border-ink-700 rounded-xl p-3 text-xs placeholder-stone-600 focus:outline-none focus:border-terracotta-500"
                    required
                  />
                </div>

                <Button type="submit" size="sm" variant="terracotta" className="w-full" isLoading={evalLoading}>
                  <Sparkles className="w-4 h-4 mr-1.5" /> Run AI Evaluation
                </Button>
              </form>

              {/* Evaluation Result Display */}
              {evalResult && (
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-ink-850 border border-terracotta-500/30 space-y-3 animate-slide-up">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-ink-750">
                    <div>
                      <span className="text-2xl font-serif font-bold text-terracotta-600 dark:text-terracotta-400">{evalResult.score}/100</span>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-jade-500/15 text-jade-700 dark:text-jade-300 font-semibold border border-jade-500/30 font-mono">
                        Grade {evalResult.letterGrade}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                      {evalResult.timeComplexity} | {evalResult.spaceComplexity}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">{evalResult.summary}</p>

                  <div className="space-y-1.5 pt-2 border-t border-stone-200 dark:border-ink-750">
                    <h5 className="text-[11px] font-mono font-bold text-jade-600 dark:text-jade-400 uppercase tracking-wide">Key Strengths</h5>
                    <ul className="text-xs text-stone-600 dark:text-stone-300 list-disc list-inside space-y-0.5">
                      {evalResult.strengths?.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-stone-200 dark:border-ink-750">
                    <h5 className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">Actionable Improvements</h5>
                    <ul className="text-xs text-stone-600 dark:text-stone-300 list-disc list-inside space-y-0.5">
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-ink-900">
              <form onSubmit={handleGenerateQuiz} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={quizTopic}
                    onChange={(e) => setQuizTopic(e.target.value)}
                    placeholder="Topic (e.g. MongoDB Aggregation, Docker, React)..."
                    className="flex-1 bg-stone-50 dark:bg-ink-950 border border-stone-300 dark:border-ink-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-terracotta-500"
                    required
                  />
                  <select
                    value={quizDifficulty}
                    onChange={(e) => setQuizDifficulty(e.target.value)}
                    className="bg-stone-50 dark:bg-ink-950 border border-stone-300 dark:border-ink-700 text-xs rounded-xl px-2 text-stone-700 dark:text-stone-300 font-mono"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <Button type="submit" size="sm" variant="amber" className="w-full" isLoading={quizLoading}>
                  <Zap className="w-4 h-4 mr-1.5" /> Generate 4-Question Drill
                </Button>
              </form>

              {quizData && (
                <div className="space-y-4 pt-2">
                  {quizData.questions?.map((q, qIndex) => {
                    const selected = selectedAnswers[qIndex];
                    const isAnswered = selected !== undefined;
                    const isCorrect = selected === q.correctAnswerIndex;

                    return (
                      <div key={qIndex} className="p-3.5 rounded-2xl bg-stone-50 dark:bg-ink-850 border border-stone-200 dark:border-ink-750 space-y-2.5">
                        <div className="text-xs font-bold text-stone-900 dark:text-white flex items-start gap-2">
                          <span className="text-terracotta-600 dark:text-terracotta-400 font-mono">Q{qIndex + 1}.</span>
                          <span>{q.question}</span>
                        </div>

                        {q.codeSnippet && (
                          <pre className="p-2 rounded-xl bg-stone-900 font-mono text-[11px] text-amber-300 overflow-x-auto border border-stone-800">
                            {q.codeSnippet}
                          </pre>
                        )}

                        <div className="space-y-1.5">
                          {q.options?.map((opt, optIndex) => {
                            let btnStyle = 'border-stone-200 dark:border-ink-750 bg-white dark:bg-ink-950 text-stone-700 dark:text-stone-300 hover:border-terracotta-500/40';
                            if (isAnswered) {
                              if (optIndex === q.correctAnswerIndex) {
                                btnStyle = 'border-jade-500 bg-jade-500/20 text-jade-800 dark:text-jade-200';
                              } else if (selected === optIndex) {
                                btnStyle = 'border-rose-500 bg-rose-500/20 text-rose-800 dark:text-rose-200';
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
                                className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {isAnswered && (
                          <div className={`p-2.5 rounded-xl text-[11px] ${isCorrect ? 'bg-jade-500/10 text-jade-700 dark:text-jade-300 border border-jade-500/20' : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20'}`}>
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
