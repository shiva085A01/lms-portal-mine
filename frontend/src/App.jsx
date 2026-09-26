import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './components/ui/Button';
import { StudioTiltCard } from './components/ui/StudioTiltCard';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { InteractiveBackground } from './components/ui/InteractiveBackground';
import { LMSInteractiveHeroCard } from './components/ui/LMSInteractiveHeroCard';
import { ThreeGlobeHero } from './components/ui/ThreeGlobeHero';
import { useTheme } from './context/ThemeContext';
import {
  Compass,
  Sparkles,
  BookOpen,
  Film,
  Users,
  Briefcase,
  ArrowRight,
  PlayCircle,
  Zap,
  Award,
  BarChart3,
  ShieldCheck,
  Layers,
  Star,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Terminal,
  GraduationCap,
  Cpu,
  Clock,
  Calendar,
  Video,
  MessageSquare,
  Code2,
  Check,
  RefreshCw,
  Volume2,
  VolumeX,
  Eye,
  Play,
  Pause,
  FileText,
  CheckSquare,
  ChevronRight,
  Share2,
  Heart,
  TrendingUp,
  Search,
  Filter,
  Menu,
  X,
} from 'lucide-react';

export function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [heroView, setHeroView] = useState('globe'); // 'globe' | 'simulator'
  const [activeCourseCategory, setActiveCourseCategory] = useState('all');
  const [previewSyllabusCourse, setPreviewSyllabusCourse] = useState(null);
  const [selectedShort, setSelectedShort] = useState(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const [isEvaluatingCode, setIsEvaluatingCode] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  
  // Pomodoro Live Demo State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('pomodoro'); // 'pomodoro' | 'shortBreak'
  const [audioAmbient, setAudioAmbient] = useState(false);

  // ATS Checklist interactive demo state
  const [atsChecklist, setAtsChecklist] = useState({
    metrics: true,
    skills: true,
    formatting: true,
    projects: false,
    github: true,
    actionVerbs: false,
  });

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // ScrollSpy to highlight active navbar section reliably as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['courses', 'shorts', 'studyrooms', 'rubric', 'bookshelf-section', 'masterclasses', 'career', 'faq'];
      const scrollPosition = window.scrollY + 160;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pomodoro timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimerModeChange = (mode) => {
    setTimerMode(mode);
    setIsTimerRunning(false);
    if (mode === 'pomodoro') setTimerSeconds(25 * 60);
    else if (mode === 'shortBreak') setTimerSeconds(5 * 60);
  };

  // Sample Courses Catalog with detailed syllabus
  const coursesCatalog = [
    {
      id: 'course-1',
      title: 'Full-Stack MERN & Next.js Architecture',
      category: 'web',
      badge: 'Bestseller',
      badgeColor: 'bg-terracotta-500 text-white',
      instructor: 'Dr. Arvind Raman',
      instructorTitle: 'Ex-Google Staff Engineer',
      instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      rating: 4.92,
      reviewsCount: 1420,
      duration: '12 Weeks',
      level: 'Intermediate',
      lessonsCount: 36,
      studentsCount: 3840,
      description: 'Master enterprise full-stack development, serverless APIs, MongoDB performance tuning, GraphQL, and AI integration.',
      tags: ['React 19', 'Node.js', 'MongoDB', 'Next.js', 'TypeScript'],
      syllabus: [
        { week: 'Week 1-3', topic: 'Modern React Architecture, Server Components & TypeScript Best Practices' },
        { week: 'Week 4-6', topic: 'Scalable REST & GraphQL APIs with Express, NestJS, and MongoDB Aggregations' },
        { week: 'Week 7-9', topic: 'Authentication, OAuth2, JWT Refresh Tokens, RBAC Security Protocols' },
        { week: 'Week 10-12', topic: 'CI/CD Pipelines, Docker Containers, Redis Caching, and Cloud Deployments' },
      ],
    },
    {
      id: 'course-2',
      title: 'Generative AI, RAG & LLM Application Engineering',
      category: 'ai',
      badge: 'Trending 2026',
      badgeColor: 'bg-amber-500 text-stone-950 font-bold',
      instructor: 'Prof. Elena Rostova',
      instructorTitle: 'AI Research Lead, Stanford PhD',
      instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
      rating: 4.96,
      reviewsCount: 980,
      duration: '10 Weeks',
      level: 'Advanced',
      lessonsCount: 28,
      studentsCount: 2910,
      description: 'Build enterprise-grade LLM applications, multimodal RAG pipelines, vector search with Pinecone/Qdrant, and fine-tuning.',
      tags: ['Gemini API', 'LangChain', 'Vector DB', 'Python', 'PyTorch'],
      syllabus: [
        { week: 'Week 1-2', topic: 'Transformer Architectures, Attention Mechanisms & Prompt Engineering' },
        { week: 'Week 3-5', topic: 'Retrieval Augmented Generation (RAG), Chunking Strategies & Vector Indexing' },
        { week: 'Week 6-8', topic: 'Autonomous AI Agents, Tool Calling, Function Execution & Guardrails' },
        { week: 'Week 9-10', topic: 'Model Evaluation, Latency Optimization, LoRA Fine-Tuning & Deployment' },
      ],
    },
    {
      id: 'course-3',
      title: 'Data Structures, Algorithms & System Design Accelerator',
      category: 'dsa',
      badge: 'Top Placement',
      badgeColor: 'bg-jade-600 text-white',
      instructor: 'Marcus Chen',
      instructorTitle: 'Principal Systems Architect',
      instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      rating: 4.89,
      reviewsCount: 2150,
      duration: '8 Weeks',
      level: 'All Levels',
      lessonsCount: 48,
      studentsCount: 5200,
      description: 'Master the top 75 algorithmic patterns (Sliding Window, Dynamic Programming, Graphs) and distributed systems architectures.',
      tags: ['DSA', 'System Design', 'Microservices', 'Algorithms', 'Kafka'],
      syllabus: [
        { week: 'Week 1-2', topic: 'Array Patterns, Two-Pointers, Sliding Window, Monotonic Stacks & Queues' },
        { week: 'Week 3-4', topic: 'Trees, Heaps, Graph Traversals (BFS/DFS, Dijkstra, Topological Sort)' },
        { week: 'Week 5-6', topic: 'Dynamic Programming: Memoization, Tabulation & State Machine Optimization' },
        { week: 'Week 7-8', topic: 'System Design: Load Balancers, Distributed Caching, Kafka, Sharding & CAP Theorem' },
      ],
    },
    {
      id: 'course-4',
      title: 'Cloud Native DevOps, Kubernetes & SRE Practice',
      category: 'cloud',
      badge: 'Industry Essential',
      badgeColor: 'bg-blue-600 text-white',
      instructor: 'Sarah Jenkins',
      instructorTitle: 'DevOps Lead & Cloud Consultant',
      instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      rating: 4.87,
      reviewsCount: 760,
      duration: '9 Weeks',
      level: 'Intermediate',
      lessonsCount: 30,
      studentsCount: 1890,
      description: 'Hands-on orchestration with Docker, Kubernetes clusters, Terraform infrastructure-as-code, and Prometheus monitoring.',
      tags: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD'],
      syllabus: [
        { week: 'Week 1-2', topic: 'Container Fundamentals, Multi-Stage Docker Builds & Security Hardening' },
        { week: 'Week 3-5', topic: 'Kubernetes Core Objects: Pods, Services, Deployments, Ingress & Helm Charts' },
        { week: 'Week 6-7', topic: 'Infrastructure as Code with Terraform & AWS Cloud Provisioning' },
        { week: 'Week 8-9', topic: 'Observability: Prometheus, Grafana, OpenTelemetry & Incident Management' },
      ],
    },
  ];

  const filteredCourses = activeCourseCategory === 'all' 
    ? coursesCatalog 
    : coursesCatalog.filter(c => c.category === activeCourseCategory);

  // Learning Shorts Sample Data
  const learningShorts = [
    {
      id: 'short-1',
      title: 'Two-Pointer Technique in 45 Seconds',
      category: 'Algorithms',
      duration: '0:45',
      views: '18.4k',
      likes: '1.9k',
      instructor: 'Marcus Chen',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80',
      description: 'Learn how the two-pointer pattern turns O(n²) brute force array searches into lightning-fast O(n) linear scans.',
      codeSnippet: `// Two-Pointer Sorted Pair Sum - O(n)
function hasPairWithSum(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return true;
    if (sum < target) left++;
    else right--;
  }
  return false;
}`,
      quiz: {
        question: 'What is the required precondition for using the standard Two-Pointer technique for pair sum?',
        options: [
          'The array must contain only positive integers',
          'The input array must be sorted in ascending order',
          'The array must have an even length',
          'The array must fit in cache memory',
        ],
        correctIndex: 1,
        explanation: 'The Two-Pointer approach relies on monotonic ordering: if the sum is too small, incrementing the left pointer increases the sum; if too large, decrementing the right pointer decreases it.',
      },
    },
    {
      id: 'short-2',
      title: 'React 19 useActionState in 50 Seconds',
      category: 'Web Dev',
      duration: '0:50',
      views: '24.1k',
      likes: '2.8k',
      instructor: 'Dr. Arvind Raman',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&auto=format&fit=crop&q=80',
      description: 'Eliminate manual isLoading and error states in form submissions with React 19 native action handling hooks.',
      codeSnippet: `// React 19 Action State Pattern
const [state, formAction, isPending] = useActionState(
  async (prevState, formData) => {
    const res = await updateProfile(formData);
    return res.data;
  },
  initialState
);`,
      quiz: {
        question: 'What does the third return value of useActionState (isPending) represent?',
        options: [
          'Whether the user has focused an input field',
          'Whether the async action is currently in-flight',
          'Whether the form is dirty and touched',
          'Whether the component has rendered for the first time',
        ],
        correctIndex: 1,
        explanation: 'isPending is a built-in boolean indicating if the asynchronous form action transition is currently executing.',
      },
    },
    {
      id: 'short-3',
      title: 'Token Bucket Rate Limiting Explained',
      category: 'System Design',
      duration: '0:55',
      views: '16.7k',
      likes: '1.4k',
      instructor: 'Prof. Elena Rostova',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80',
      description: 'How Stripe, Cloudflare, and Twitter protect backend APIs from spikes using the mathematical Token Bucket algorithm.',
      codeSnippet: `// Token Bucket Rate Limiter
class TokenBucket {
  constructor(capacity, refillRatePerSec) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRatePerSec;
    this.lastRefill = Date.now();
  }
}`,
      quiz: {
        question: 'Why is Token Bucket preferred over Fixed Window Counter in production APIs?',
        options: [
          'It uses zero memory allocation',
          'It prevents traffic spikes at window boundaries while allowing controlled bursts',
          'It only works with Redis clusters',
          'It enforces strict FIFO queueing',
        ],
        correctIndex: 1,
        explanation: 'Fixed window counters suffer from double-burst problems at boundary resets; Token Bucket smoothly refills tokens while permitting capacity-limited bursts.',
      },
    },
    {
      id: 'short-4',
      title: 'Vector Embeddings & Cosine Distance',
      category: 'AI / RAG',
      duration: '0:58',
      views: '31.2k',
      likes: '3.6k',
      instructor: 'Dr. Arvind Raman',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&auto=format&fit=crop&q=80',
      description: 'How semantic search converts unstructured text into high-dimensional geometric vectors for sub-millisecond retrieval.',
      codeSnippet: `// Cosine Similarity between vectors A & B
function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magA * magB);
}`,
      quiz: {
        question: 'What does a cosine similarity value of 1.0 indicate between two embedding vectors?',
        options: [
          'The vectors are completely orthogonal (unrelated)',
          'The vectors point in exactly the same semantic direction',
          'The vectors have opposite semantic meanings',
          'The vectors have an identical Euclidean length',
        ],
        correctIndex: 1,
        explanation: 'Cosine similarity measures the angle between vectors: 1.0 represents angle 0° (identical direction/meaning), 0 represents 90° (orthogonal/unrelated).',
      },
    },
  ];

  // AI Code Rubric Sandbox Problems
  const sandboxProblems = [
    {
      id: 'prob-1',
      title: 'Two Sum Problem (Optimized Hash Map)',
      language: 'JavaScript',
      difficulty: 'Easy / Core',
      code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      evaluation: {
        overallScore: 98,
        correctness: 100,
        timeComplexity: 'O(n) - Linear Time',
        spaceComplexity: 'O(n) - Hash Map Storage',
        codeQuality: 96,
        summary: 'Exemplary solution utilizing single-pass Hash Map for optimal amortized constant lookup.',
        strengths: [
          'Optimal O(n) single pass time complexity avoiding nested O(n²) loops.',
          'Clean idiomatic use of JavaScript Map object with proper key-value indexing.',
          'Safe return of empty array fallback for non-matching edge cases.',
        ],
        suggestions: [
          'Consider validating input array length (nums.length < 2) for immediate fail-fast boundary handling.',
        ],
      },
    },
    {
      id: 'prob-2',
      title: 'LRU Cache Implementation (Doubly Linked List)',
      language: 'JavaScript',
      difficulty: 'Hard / System',
      code: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}`,
      evaluation: {
        overallScore: 95,
        correctness: 100,
        timeComplexity: 'O(1) - Constant Get and Put',
        spaceComplexity: 'O(capacity) - Memory Bounded',
        codeQuality: 92,
        summary: 'Clever exploitation of JavaScript Map insertion ordering semantics to achieve strict O(1) eviction.',
        strengths: [
          'Strict O(1) constant time get() and put() operations without custom DLL boilerplate.',
          'Correct eviction of the Least Recently Used element via Map iterator keys().next().value.',
        ],
        suggestions: [
          'In multi-threaded or low-level production systems, an explicit Doubly Linked List with Node pointers provides higher deterministic memory guarantees.',
        ],
      },
    },
    {
      id: 'prob-3',
      title: 'Valid Parentheses Validator (Stack)',
      language: 'JavaScript',
      difficulty: 'Easy / Stack',
      code: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      evaluation: {
        overallScore: 97,
        correctness: 100,
        timeComplexity: 'O(n) - Single Scan',
        spaceComplexity: 'O(n) - Stack Memory',
        codeQuality: 95,
        summary: 'Optimal stack-based bracket matching with lookup table for clean readability and branch minimization.',
        strengths: [
          'Clean reverse lookup hash table simplifies opening vs closing bracket checks.',
          'Early exit return false on mismatch dramatically speeds up invalid inputs.',
        ],
        suggestions: [
          'Add an initial length check (if s.length % 2 !== 0 return false) for instant O(1) odd-length rejection.',
        ],
      },
    },
  ];

  const handleRunEvaluation = () => {
    setIsEvaluatingCode(true);
    setEvaluationResult(null);
    setTimeout(() => {
      setEvaluationResult(sandboxProblems[selectedProblemIndex].evaluation);
      setIsEvaluatingCode(false);
    }, 1200);
  };

  // Live Study Rooms Data
  const liveStudyRooms = [
    {
      id: 'room-1',
      title: 'Deep Work: LeetCode Grind & Dynamic Programming',
      category: 'Competitive Coding',
      activeMembers: 19,
      maxCapacity: 25,
      pomodoroStatus: 'Focus Sprint (18m remaining)',
      ambientTrack: 'Lo-Fi Chill Beats',
      host: 'Marcus K.',
      statusColor: 'text-jade-500',
      statusBg: 'bg-jade-500/10 border-jade-500/30',
      tags: ['DP', 'Graphs', 'Blind 75'],
    },
    {
      id: 'room-2',
      title: 'Full-Stack Architecture & Microservices Study Pod',
      category: 'System Architecture',
      activeMembers: 24,
      maxCapacity: 30,
      pomodoroStatus: 'Live Whiteboard Session',
      ambientTrack: 'Deep Focus Synth',
      host: 'Prof. Elena R.',
      statusColor: 'text-terracotta-500',
      statusBg: 'bg-terracotta-500/10 border-terracotta-500/30',
      tags: ['Kafka', 'Docker', 'NestJS'],
    },
    {
      id: 'room-3',
      title: 'Generative AI & LLM Paper Review Pod',
      category: 'Machine Learning',
      activeMembers: 15,
      maxCapacity: 20,
      pomodoroStatus: 'Screen Sharing: Llama-3 Arch',
      ambientTrack: 'Rain & Thunder Library',
      host: 'Dr. Arvind R.',
      statusColor: 'text-amber-500',
      statusBg: 'bg-amber-500/10 border-amber-500/30',
      tags: ['Attention', 'LoRA', 'RAG'],
    },
    {
      id: 'room-4',
      title: 'Cloud & Kubernetes DevOps Late Night Sprint',
      category: 'Cloud Infrastructure',
      activeMembers: 11,
      maxCapacity: 20,
      pomodoroStatus: 'Silent Co-Working',
      ambientTrack: 'Coffee Shop Ambience',
      host: 'Sarah J.',
      statusColor: 'text-blue-500',
      statusBg: 'bg-blue-500/10 border-blue-500/30',
      tags: ['AWS', 'K8s', 'Terraform'],
    },
  ];

  // Upcoming Live Seminars & Masterclasses
  const upcomingMasterclasses = [
    {
      id: 'sem-1',
      title: 'Building Resilient Cloud Microservices with AWS & Kubernetes',
      speaker: 'Dr. Arvind Raman',
      speakerRole: 'Ex-Google Staff Engineer',
      date: 'Sept 28, 2026',
      time: '6:00 PM - 7:30 PM IST',
      attendees: '1,420 Registered',
      badge: 'Live Interactive Masterclass',
      level: 'Advanced',
    },
    {
      id: 'sem-2',
      title: 'Production-Ready RAG & Vector Databases at Scale',
      speaker: 'Prof. Elena Rostova',
      speakerRole: 'AI Research Lead, Stanford PhD',
      date: 'Oct 02, 2026',
      time: '7:30 PM - 9:00 PM IST',
      attendees: '2,150 Registered',
      badge: 'Keynote Seminar',
      level: 'All Levels',
    },
    {
      id: 'sem-3',
      title: 'Cracking FAANG System Design Interviews in 2026',
      speaker: 'Marcus Chen',
      speakerRole: 'Principal Systems Architect',
      date: 'Oct 06, 2026',
      time: '5:00 PM - 6:30 PM IST',
      attendees: '3,200 Registered',
      badge: 'Career Accelerator',
      level: 'Intermediate',
    },
  ];

  // Student Testimonials
  const testimonials = [
    {
      id: 't-1',
      name: 'Aditya Sharma',
      role: 'Software Engineer at Google',
      placedAt: 'Google',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      review:
        'The automated AI Rubric feedback was a complete game-changer. Getting instant complexity breakdowns and line-by-line code suggestions allowed me to master system design patterns twice as fast as traditional bootcamps.',
    },
    {
      id: 't-2',
      name: 'Pooja Sundaram',
      role: 'AI Engineer at Microsoft',
      placedAt: 'Microsoft',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      review:
        'The bite-sized Learning Shorts and peer study rooms kept me consistent every single day. The 3D bookshelf and interactive assignments prepared me thoroughly for senior-level technical loops.',
    },
    {
      id: 't-3',
      name: 'Rahul Varma',
      role: 'Full-Stack Developer at Amazon',
      placedAt: 'Amazon',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
      review:
        'From zero distributed systems knowledge to architecting resilient microservices on AWS. The faculty mentors and real-time coding labs provided the exact real-world experience top tech recruiters look for.',
    },
  ];

  // FAQs
  const faqs = [
    {
      q: 'How does the AI Rubric Evaluation work?',
      a: 'Our Gemini AI engine evaluates your code submissions line-by-line according to industry software standards, calculating algorithmic complexity, security checks, and offering constructive strengths and areas for improvement.',
    },
    {
      q: 'What are Learning Shorts (Reels)?',
      a: 'Learning Shorts are bite-sized, 30-to-60 second vertical educational videos covering core algorithms, design patterns, and code tips with synchronized quiz checkpoints to reinforce retention.',
    },
    {
      q: 'Can instructors track and grade student submissions automatically?',
      a: 'Yes. Faculty dashboards provide instant AI pre-grading, customizable rubric sliders, attendee tracking for webinars, and full student performance analytics.',
    },
    {
      q: 'What is the Interactive 3D Module Library?',
      a: 'The 3D Bookshelf renders full-dimensional volume geometry representing curated engineering tracks, allowing tactile exploration and 1-click chapter launching without upfront login barriers.',
    },
    {
      q: 'Are certificates provided upon course completion?',
      a: 'Yes! Upon completing course assignments, passing the final quiz benchmark, and having submissions evaluated by instructors, you earn verifiable, shareable digital certificates with unique verification IDs.',
    },
    {
      q: 'Is there any cost to create an account and access open previews?',
      a: 'Creating a LearnSphere account is 100% free. You get immediate access to public learning tracks, virtual study pods, learning shorts, and open AI rubric evaluation sandboxes.',
    },
  ];

  // Calculate ATS Score from checklist
  const atsScore = Math.round(
    (Object.values(atsChecklist).filter(Boolean).length / Object.keys(atsChecklist).length) * 100
  );

  return (
    <div className="relative min-h-screen bg-parchment-50 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col justify-between selection:bg-terracotta-500 selection:text-white font-sans transition-colors duration-300">
      {/* Dynamic Interactive Canvas Background */}
      <InteractiveBackground />

      {/* Subtle Warm Ambient Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-terracotta-500/10 blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute top-[75%] left-[-5%] w-[450px] h-[450px] rounded-full bg-jade-500/10 blur-[150px] pointer-events-none z-0"></div>

      {/* =========================================================================
          1. 100% FIXED TOP NAVBAR CONTAINER (Always Visible Across All Sections)
         ========================================================================= */}
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
        {/* Top Cohort Announcement Ticker */}
        <div className="bg-gradient-to-r from-terracotta-600 via-amber-600 to-terracotta-700 text-white text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium shadow-sm flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-200 shrink-0" />
          <span className="truncate">
            <strong>Next Cohort Starts Oct 2026:</strong> Explore live curriculum previews, interactive shorts, and study pods below!
          </span>
          <Link to="/register" className="underline font-bold hover:text-amber-100 shrink-0 ml-1">
            Join Free →
          </Link>
        </div>

        {/* Main Sticky Glassmorphic Navbar */}
        <header className="border-b border-stone-200/80 dark:border-ink-800/80 bg-white/95 dark:bg-ink-900/95 backdrop-blur-xl px-4 sm:px-6 py-2.5 sm:py-3 transition-colors duration-300 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-terracotta-600 via-amber-600 to-terracotta-400 p-0.5 shadow-md shadow-terracotta-500/20 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-white dark:bg-ink-900 rounded-[14px] flex items-center justify-center">
                  <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-terracotta-500" />
                </div>
              </div>
              <div>
                <span className="text-lg sm:text-xl font-serif font-bold tracking-tight text-stone-900 dark:text-white block leading-tight">
                  LearnSphere
                </span>
                <span className="text-[10px] text-terracotta-600 dark:text-amber-400 tracking-wider font-semibold uppercase block -mt-0.5 font-mono">
                  Learning Management System
                </span>
              </div>
            </a>

            {/* Center Navigation Links with Active Highlighting */}
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3 text-xs font-semibold text-stone-700 dark:text-stone-200">
              <a
                href="#courses"
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeSection === 'courses'
                    ? 'bg-terracotta-500 text-white font-bold shadow-sm'
                    : 'hover:text-terracotta-600 dark:hover:text-terracotta-400 hover:bg-stone-100 dark:hover:bg-ink-800'
                }`}
              >
                <BookOpen className={`w-3.5 h-3.5 ${activeSection === 'courses' ? 'text-white' : 'text-terracotta-500'}`} />
                <span>Courses</span>
              </a>

              <a
                href="#shorts"
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeSection === 'shorts'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'hover:text-amber-600 dark:hover:text-amber-400 hover:bg-stone-100 dark:hover:bg-ink-800'
                }`}
              >
                <Film className={`w-3.5 h-3.5 ${activeSection === 'shorts' ? 'text-stone-950' : 'text-amber-500'}`} />
                <span>Shorts</span>
              </a>

              <a
                href="#studyrooms"
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeSection === 'studyrooms'
                    ? 'bg-jade-600 text-white font-bold shadow-sm'
                    : 'hover:text-jade-600 dark:hover:text-jade-400 hover:bg-stone-100 dark:hover:bg-ink-800'
                }`}
              >
                <Users className={`w-3.5 h-3.5 ${activeSection === 'studyrooms' ? 'text-white' : 'text-jade-500'}`} />
                <span>Study Pods</span>
              </a>

              <a
                href="#rubric"
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeSection === 'rubric'
                    ? 'bg-terracotta-600 text-white font-bold shadow-sm'
                    : 'hover:text-terracotta-600 dark:hover:text-amber-400 hover:bg-stone-100 dark:hover:bg-ink-800'
                }`}
              >
                <Terminal className={`w-3.5 h-3.5 ${activeSection === 'rubric' ? 'text-white' : 'text-terracotta-500'}`} />
                <span>AI Rubric</span>
              </a>

              <Link
                to="/bookshelf"
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition-all flex items-center gap-1.5 font-bold shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>3D Bookshelf</span>
              </Link>

              <a
                href="#masterclasses"
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeSection === 'masterclasses'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'hover:text-blue-600 dark:hover:text-blue-400 hover:bg-stone-100 dark:hover:bg-ink-800'
                }`}
              >
                <Calendar className={`w-3.5 h-3.5 ${activeSection === 'masterclasses' ? 'text-white' : 'text-blue-500'}`} />
                <span>Masterclasses</span>
              </a>

              <a
                href="#career"
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeSection === 'career'
                    ? 'bg-stone-800 text-white font-bold shadow-sm'
                    : 'hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-ink-800'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-stone-500" />
                <span>Careers</span>
              </a>
            </nav>

            {/* Right Action Controls & Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle size="sm" />
              
              <Link to="/login">
                <Button size="sm" variant="secondary" className="text-xs px-3 sm:px-4">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" className="hidden sm:inline-flex">
                <Button size="sm" variant="terracotta" className="text-xs shadow-md shadow-terracotta-500/20 font-medium px-4">
                  Get Started
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-xl bg-stone-100 dark:bg-ink-850 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden pt-3 pb-2 border-t border-stone-200 dark:border-ink-800 mt-2 space-y-1 animate-fadeIn">
              <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold">
                <a
                  href="#courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-stone-50 dark:bg-ink-850 flex items-center gap-2 text-stone-800 dark:text-stone-200"
                >
                  <BookOpen className="w-4 h-4 text-terracotta-500" /> Courses
                </a>
                <a
                  href="#shorts"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-stone-50 dark:bg-ink-850 flex items-center gap-2 text-stone-800 dark:text-stone-200"
                >
                  <Film className="w-4 h-4 text-amber-500" /> Shorts (Reels)
                </a>
                <a
                  href="#studyrooms"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-stone-50 dark:bg-ink-850 flex items-center gap-2 text-stone-800 dark:text-stone-200"
                >
                  <Users className="w-4 h-4 text-jade-500" /> Study Pods
                </a>
                <a
                  href="#rubric"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-stone-50 dark:bg-ink-850 flex items-center gap-2 text-stone-800 dark:text-stone-200"
                >
                  <Terminal className="w-4 h-4 text-terracotta-500" /> AI Rubric
                </a>
                <Link
                  to="/bookshelf"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" /> 3D Bookshelf
                </Link>
                <a
                  href="#masterclasses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-stone-50 dark:bg-ink-850 flex items-center gap-2 text-stone-800 dark:text-stone-200"
                >
                  <Calendar className="w-4 h-4 text-blue-500" /> Masterclasses
                </a>
              </div>
            </div>
          )}
        </header>
      </div>

      {/* =========================================================================
          MAIN CONTENT AREA (With pt-28 Offset for Fixed Header)
         ========================================================================= */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-12 flex-1 flex flex-col gap-20 sm:gap-28">
        
        {/* =========================================
            SECTION 1: HERO & INTERACTIVE LMS CARD
           ========================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pt-2 sm:pt-4">
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta-500/10 border border-terracotta-500/25 text-terracotta-700 dark:text-terracotta-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-terracotta-500 animate-pulse" />
              <span className="font-mono uppercase tracking-wider text-[11px]">Next-Generation LMS Platform v2.4</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 dark:text-white leading-[1.12]">
              Master In-Demand Skills with{' '}
              <span className="editorial-heading italic font-normal text-terracotta-600 dark:text-amber-300">
                Interactive Learning
              </span>{' '}
              & AI Mentorship
            </h1>

            <p className="text-stone-600 dark:text-stone-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Accelerate your engineering journey with real-time AI code evaluations, Reels-style bite-sized learning shorts, collaborative peer study pods, and 3D bookshelf curriculums.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a href="#courses">
                <Button size="lg" variant="terracotta" icon={ArrowRight} className="shadow-lg shadow-terracotta-500/25 text-sm px-7 py-3.5 cursor-pointer">
                  Explore Course Catalog
                </Button>
              </a>
              <a href="#rubric">
                <Button size="lg" variant="secondary" icon={Terminal} className="text-sm px-7 py-3.5 cursor-pointer">
                  Try AI Rubric Demo
                </Button>
              </a>
            </div>

            {/* Quick Skill Tags */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-mono">
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-700 dark:text-stone-300">Popular:</span>
              <a href="#courses" className="px-2.5 py-1 rounded-lg bg-stone-200/70 dark:bg-ink-800 border border-stone-300/60 dark:border-ink-700 hover:text-terracotta-500">Full-Stack MERN</a>
              <a href="#courses" className="px-2.5 py-1 rounded-lg bg-stone-200/70 dark:bg-ink-800 border border-stone-300/60 dark:border-ink-700 hover:text-amber-500">Generative AI / RAG</a>
              <a href="#courses" className="px-2.5 py-1 rounded-lg bg-stone-200/70 dark:bg-ink-800 border border-stone-300/60 dark:border-ink-700 hover:text-jade-500">System Design</a>
              <a href="#courses" className="px-2.5 py-1 rounded-lg bg-stone-200/70 dark:bg-ink-800 border border-stone-300/60 dark:border-ink-700 hover:text-blue-500">Kubernetes & SRE</a>
            </div>

            {/* Live Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-200 dark:border-ink-800">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-ink-850 border border-stone-200 dark:border-ink-800 shadow-sm">
                <div className="text-2xl font-serif font-bold text-stone-900 dark:text-white">50+</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">Curated Courses</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-ink-850 border border-stone-200 dark:border-ink-800 shadow-sm">
                <div className="text-2xl font-serif font-bold text-terracotta-600 dark:text-terracotta-400">10k+</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">Active Learners</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-ink-850 border border-stone-200 dark:border-ink-800 shadow-sm">
                <div className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400">24/7</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">AI Code Rubrics</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-ink-850 border border-stone-200 dark:border-ink-800 shadow-sm">
                <div className="text-2xl font-serif font-bold text-jade-600 dark:text-jade-400">96%</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">Career Placement</div>
              </div>
            </div>
          </div>

          {/* Interactive 3D Globe & LMS Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center w-full space-y-3">
            {/* Showcase Mode Switcher */}
            <div className="inline-flex p-1 rounded-2xl bg-stone-200/80 dark:bg-ink-850/80 border border-stone-300/80 dark:border-ink-700/80 text-xs font-semibold backdrop-blur-md shadow-inner">
              <button
                type="button"
                onClick={() => setHeroView('globe')}
                className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                  heroView === 'globe'
                    ? 'bg-terracotta-500 text-white shadow-md shadow-terracotta-500/30 font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-parchment-100'
                }`}
              >
                3D Knowledge Globe
              </button>
              <button
                type="button"
                onClick={() => setHeroView('simulator')}
                className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                  heroView === 'simulator'
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30 font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-parchment-100'
                }`}
              >
                Interactive LMS Hub
              </button>
            </div>

            <div className="w-full max-w-lg">
              {heroView === 'globe' ? (
                <ThreeGlobeHero />
              ) : (
                <LMSInteractiveHeroCard />
              )}
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 2: FEATURED COURSES CATALOG PREVIEW
           ========================================= */}
        <section id="courses" className="w-full space-y-8 scroll-mt-28">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-500/10 text-terracotta-700 dark:text-terracotta-300 text-xs font-bold uppercase tracking-wider font-mono border border-terracotta-500/20 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-terracotta-500" /> Curated Engineering Tracks
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white">
                Explore Top Course Curricula
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                Preview real module syllabi, instructor credentials, and hands-on projects before enrolling.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 p-1 rounded-2xl bg-stone-100 dark:bg-ink-850 border border-stone-200 dark:border-ink-750">
              {[
                { id: 'all', label: 'All Courses' },
                { id: 'web', label: 'Full-Stack' },
                { id: 'ai', label: 'AI & LLMs' },
                { id: 'dsa', label: 'DSA & Systems' },
                { id: 'cloud', label: 'DevOps & Cloud' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCourseCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeCourseCategory === tab.id
                      ? 'bg-terracotta-500 text-white shadow-sm font-semibold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <StudioTiltCard
                key={course.id}
                className="p-6 bg-white dark:bg-ink-850 border-stone-200 dark:border-ink-800 shadow-sm flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Badge & Rating header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold font-mono ${course.badgeColor}`}>
                      {course.badge}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-stone-600 dark:text-stone-300">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                      <span className="font-bold text-stone-900 dark:text-white">{course.rating}</span>
                      <span className="text-stone-400 text-[11px]">({course.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Course Title & Summary */}
                  <div>
                    <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white group-hover:text-terracotta-600 dark:group-hover:text-amber-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Instructor Bio Bar */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-50 dark:bg-ink-900 border border-stone-200/60 dark:border-ink-800">
                    <img
                      src={course.instructorAvatar}
                      alt={course.instructor}
                      className="w-9 h-9 rounded-full object-cover border border-terracotta-500/30"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1">
                        {course.instructor}
                        <CheckCircle2 className="w-3.5 h-3.5 text-jade-500 inline" />
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                        {course.instructorTitle}
                      </div>
                    </div>
                  </div>

                  {/* Quick Metadata */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-stone-100 dark:border-ink-800 text-[11px] font-mono text-stone-600 dark:text-stone-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-terracotta-500" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-amber-500" />
                      <span>{course.lessonsCount} Modules</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-jade-500" />
                      <span>{course.studentsCount}+ Enrolled</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {course.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-ink-800 text-stone-700 dark:text-stone-300 font-mono"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Expandable Syllabus Preview */}
                  {previewSyllabusCourse === course.id && (
                    <div className="p-4 rounded-xl bg-stone-50 dark:bg-ink-900 border border-terracotta-500/30 space-y-2.5 animate-fadeIn">
                      <div className="text-xs font-bold text-stone-900 dark:text-white flex items-center justify-between">
                        <span className="font-mono text-terracotta-600 dark:text-amber-400 uppercase tracking-wider text-[11px]">
                          Curriculum Syllabus Breakdown
                        </span>
                        <button
                          onClick={() => setPreviewSyllabusCourse(null)}
                          className="text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-white cursor-pointer"
                        >
                          Close ×
                        </button>
                      </div>
                      <div className="space-y-2 text-xs">
                        {course.syllabus.map((syl, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-terracotta-500/10 text-terracotta-600 dark:text-amber-400 font-bold whitespace-nowrap">
                              {syl.week}
                            </span>
                            <span className="text-[11px] leading-snug">{syl.topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="mt-5 pt-4 border-t border-stone-100 dark:border-ink-800 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setPreviewSyllabusCourse(previewSyllabusCourse === course.id ? null : course.id)}
                    className="text-xs font-semibold text-terracotta-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {previewSyllabusCourse === course.id ? 'Hide Syllabus' : 'Preview Syllabus'}
                  </button>

                  <div className="flex items-center gap-2">
                    <Link to="/register">
                      <Button size="sm" variant="terracotta" icon={ArrowRight} className="text-xs shadow-sm">
                        Enroll Free
                      </Button>
                    </Link>
                  </div>
                </div>
              </StudioTiltCard>
            ))}
          </div>
        </section>

        {/* =========================================
            SECTION 3: INTERACTIVE LEARNING SHORTS (REELS) PREVIEW
           ========================================= */}
        <section id="shorts" className="w-full space-y-8 scroll-mt-28">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider font-mono border border-amber-500/20 mb-2">
                <Film className="w-3.5 h-3.5 text-amber-500" /> Vertical Microlearning Feed
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white">
                Interactive Learning Shorts (Reels)
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                Bite-sized 30-60 second technical reels with synchronized code walkthroughs and checkpoint quizzes.
              </p>
            </div>

            <div className="text-xs text-stone-500 dark:text-stone-400 font-mono">
              ⚡ Click any reel to launch live video player & quiz sandbox
            </div>
          </div>

          {/* Shorts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {learningShorts.map((short) => (
              <div
                key={short.id}
                onClick={() => {
                  setSelectedShort(short);
                  setSelectedQuizOption(null);
                  setQuizSubmitted(false);
                }}
                className={`group cursor-pointer rounded-2xl p-4 bg-white dark:bg-ink-850 border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between ${
                  selectedShort?.id === short.id
                    ? 'border-amber-500 ring-2 ring-amber-500/30 dark:border-amber-500'
                    : 'border-stone-200 dark:border-ink-800'
                }`}
              >
                <div className="space-y-3">
                  {/* Thumbnail with overlay & Play button */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-900">
                    <img
                      src={short.thumbnail}
                      alt={short.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-95 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-white font-bold backdrop-blur-sm border border-white/20">
                          {short.category}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500 text-stone-950 font-bold">
                          {short.duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-white text-[11px] font-mono">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> {short.views}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-amber-500/90 text-stone-950 flex items-center justify-center group-hover:scale-110 shadow-md transition-transform">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Title & Instructor */}
                  <div>
                    <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2">
                      {short.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono mt-1">
                      By {short.instructor}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-ink-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                  <span className="flex items-center gap-1 text-terracotta-600 dark:text-amber-400 font-semibold">
                    <Zap className="w-3.5 h-3.5" /> Includes Quiz
                  </span>
                  <span>Try Demo →</span>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Player Modal / Sandbox when a Short is clicked */}
          {selectedShort && (
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-stone-900 via-ink-950 to-stone-950 text-white border border-amber-500/30 shadow-2xl relative overflow-hidden animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
                
                {/* Left: Video Player Mockup & Code Walkthrough */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500 text-stone-950">
                      ▶ Playing Short: {selectedShort.title}
                    </span>
                    <button
                      onClick={() => setSelectedShort(null)}
                      className="text-xs font-mono text-stone-400 hover:text-white px-2 py-1 rounded bg-white/10 cursor-pointer"
                    >
                      Close Player ×
                    </button>
                  </div>

                  {/* Mock Video Container */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-stone-800 flex flex-col justify-between p-4">
                    <img
                      src={selectedShort.thumbnail}
                      alt={selectedShort.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                    <div className="relative z-10 flex items-center justify-between text-xs font-mono">
                      <span className="px-2 py-0.5 rounded bg-black/70 text-amber-400 font-bold border border-amber-500/30">
                        {selectedShort.category} • HD 1080p
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/70 text-stone-300">
                        {selectedShort.duration}
                      </span>
                    </div>

                    <div className="relative z-10 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/30 cursor-pointer hover:scale-105 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-1" />
                      </div>
                    </div>

                    {/* Scrubber bar */}
                    <div className="relative z-10 space-y-1.5">
                      <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
                        <div className="w-3/4 h-full bg-amber-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                        <span>0:32 / {selectedShort.duration}</span>
                        <span>Instructor: {selectedShort.instructor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Code Snippet Box */}
                  <div className="rounded-2xl bg-ink-900 border border-stone-800 p-4 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between text-stone-400 text-[11px] pb-2 border-b border-stone-800">
                      <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <Code2 className="w-3.5 h-3.5" /> Synchronized Code Snippet
                      </span>
                      <span>JavaScript ES6</span>
                    </div>
                    <pre className="text-stone-300 text-[11px] overflow-x-auto leading-relaxed">
                      {selectedShort.codeSnippet}
                    </pre>
                  </div>
                </div>

                {/* Right: Checkpoint Quiz Interactive Drill */}
                <div className="lg:col-span-6 space-y-5 rounded-2xl bg-ink-900/90 border border-stone-800 p-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">
                    <Award className="w-4 h-4" /> Checkpoint Knowledge Drill
                  </div>

                  <h4 className="text-base font-serif font-bold text-white">
                    {selectedShort.quiz.question}
                  </h4>

                  <div className="space-y-2.5">
                    {selectedShort.quiz.options.map((option, oIdx) => {
                      const isSelected = selectedQuizOption === oIdx;
                      const isCorrect = oIdx === selectedShort.quiz.correctIndex;
                      let optionStyle = 'border-stone-800 bg-ink-850 hover:border-stone-700 text-stone-300';

                      if (quizSubmitted) {
                        if (isCorrect) {
                          optionStyle = 'border-jade-500 bg-jade-500/20 text-jade-300 font-bold';
                        } else if (isSelected && !isCorrect) {
                          optionStyle = 'border-red-500 bg-red-500/20 text-red-300';
                        }
                      } else if (isSelected) {
                        optionStyle = 'border-amber-500 bg-amber-500/10 text-amber-300 font-semibold';
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => {
                            if (!quizSubmitted) setSelectedQuizOption(oIdx);
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${optionStyle}`}
                        >
                          <span>{option}</span>
                          {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-jade-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Submit / Feedback Controls */}
                  <div className="pt-2">
                    {!quizSubmitted ? (
                      <Button
                        size="sm"
                        variant="amber"
                        disabled={selectedQuizOption === null}
                        onClick={() => setQuizSubmitted(true)}
                        className="w-full text-xs font-bold py-2.5 cursor-pointer"
                      >
                        Submit Answer
                      </Button>
                    ) : (
                      <div className="space-y-3 animate-fadeIn">
                        <div className="p-3.5 rounded-xl bg-ink-800 border border-stone-700 text-xs text-stone-300 leading-relaxed">
                          <strong className="text-amber-400 block mb-1">Explanation:</strong>
                          {selectedShort.quiz.explanation}
                        </div>
                        <div className="flex items-center gap-3">
                          <Link to="/register" className="flex-1">
                            <Button size="sm" variant="terracotta" className="w-full text-xs">
                              Sign Up for Full Shorts Library →
                            </Button>
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedQuizOption(null);
                              setQuizSubmitted(false);
                            }}
                            className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-mono text-stone-300 cursor-pointer"
                          >
                            Retry
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}
        </section>

        {/* =========================================
            SECTION 4: VIRTUAL STUDY ROOMS & LIVE POMODORO PODS
           ========================================= */}
        <section id="studyrooms" className="w-full space-y-8 scroll-mt-28">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-jade-500/10 text-jade-700 dark:text-jade-400 text-xs font-bold uppercase tracking-wider font-mono border border-jade-500/20 mb-2">
                <Users className="w-3.5 h-3.5 text-jade-500" /> Real-Time Peer Collaboration
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white">
                Live Virtual Study Pods & Focus Rooms
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                Drop into synchronized co-working pods, shared Pomodoro goals, and live problem-solving sessions.
              </p>
            </div>

            <Link to="/register">
              <Button size="sm" variant="jade" icon={Users} className="text-xs">
                Create or Join Room
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 8 Cols: Active Room Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {liveStudyRooms.map((room) => (
                <div
                  key={room.id}
                  className="p-5 rounded-2xl bg-white dark:bg-ink-850 border border-stone-200 dark:border-ink-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-jade-500/40 transition-all"
                >
                  <div className="space-y-2.5">
                    {/* Header: Status & Live indicator */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${room.statusBg} ${room.statusColor} flex items-center gap-1.5`}>
                        <span className="w-2 h-2 rounded-full bg-current animate-ping"></span>
                        LIVE POD
                      </span>
                      <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
                        {room.activeMembers}/{room.maxCapacity} Members
                      </span>
                    </div>

                    <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-white leading-snug">
                      {room.title}
                    </h3>

                    {/* Metadata details */}
                    <div className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-jade-500" />
                        <span className="font-medium">{room.pomodoroStatus}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                        <Volume2 className="w-3.5 h-3.5 text-stone-400" />
                        <span>Stream: {room.ambientTrack}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {room.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-ink-900 text-stone-600 dark:text-stone-400"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-ink-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                      Host: {room.host}
                    </span>
                    <Link to="/register">
                      <span className="font-semibold text-jade-600 dark:text-jade-400 hover:underline flex items-center gap-1">
                        Enter Pod <ArrowRight className="w-3 h-3" />
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Right 4 Cols: Interactive On-Page Pomodoro Sandbox */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-ink-850 border border-stone-200 dark:border-ink-800 shadow-md space-y-5 text-center">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-jade-600 dark:text-jade-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Guest Focus Timer
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-jade-500/10 text-jade-700 dark:text-jade-300 font-semibold">
                  Interactive
                </span>
              </div>

              {/* Mode Toggles */}
              <div className="inline-flex p-1 rounded-xl bg-stone-100 dark:bg-ink-900 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => handleTimerModeChange('pomodoro')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    timerMode === 'pomodoro'
                      ? 'bg-jade-600 text-white font-bold shadow-sm'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-white'
                  }`}
                >
                  25m Sprint
                </button>
                <button
                  type="button"
                  onClick={() => handleTimerModeChange('shortBreak')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    timerMode === 'shortBreak'
                      ? 'bg-jade-600 text-white font-bold shadow-sm'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-white'
                  }`}
                >
                  5m Break
                </button>
              </div>

              {/* Timer Display */}
              <div className="py-3">
                <div className="text-5xl font-mono font-bold tracking-tight text-stone-900 dark:text-white">
                  {formatTimer(timerSeconds)}
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono mt-1">
                  {isTimerRunning ? '🟢 Focus Session In Progress...' : 'Ready to start'}
                </div>
              </div>

              {/* Play / Pause / Reset buttons */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant={isTimerRunning ? 'secondary' : 'jade'}
                  icon={isTimerRunning ? Pause : Play}
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="text-xs px-5 cursor-pointer"
                >
                  {isTimerRunning ? 'Pause' : 'Start Focus'}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={RefreshCw}
                  onClick={() => handleTimerModeChange(timerMode)}
                  className="text-xs cursor-pointer"
                >
                  Reset
                </Button>
              </div>

              {/* Ambient Audio Toggle */}
              <div className="pt-3 border-t border-stone-100 dark:border-ink-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  {audioAmbient ? <Volume2 className="w-3.5 h-3.5 text-jade-500" /> : <VolumeX className="w-3.5 h-3.5" />}
                  Lo-Fi Sound Ambience
                </span>
                <button
                  type="button"
                  onClick={() => setAudioAmbient(!audioAmbient)}
                  className={`text-[11px] px-2 py-0.5 rounded font-mono font-semibold transition-all cursor-pointer ${
                    audioAmbient
                      ? 'bg-jade-500 text-white'
                      : 'bg-stone-200 dark:bg-ink-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {audioAmbient ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================
            SECTION 5: LIVE AI RUBRIC & CODE EVALUATION PLAYGROUND
           ========================================= */}
        <section id="rubric" className="w-full space-y-8 scroll-mt-28">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-500/10 text-terracotta-700 dark:text-terracotta-300 text-xs font-bold uppercase tracking-wider font-mono border border-terracotta-500/20 mb-2">
                <Terminal className="w-3.5 h-3.5 text-terracotta-500" /> Gemini AI Mentorship Sandbox
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white">
                Live AI Code Rubric Evaluator
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                Test how our real-time AI evaluates algorithmic complexity, code hygiene, and edge case coverage.
              </p>
            </div>

            {/* Problem Selector */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-stone-500 dark:text-stone-400">Sample Problem:</span>
              <select
                value={selectedProblemIndex}
                onChange={(e) => {
                  setSelectedProblemIndex(Number(e.target.value));
                  setEvaluationResult(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-ink-850 border border-stone-300 dark:border-ink-700 text-stone-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-terracotta-500"
              >
                {sandboxProblems.map((prob, idx) => (
                  <option key={prob.id} value={idx}>
                    {prob.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 6 Cols: Mock Code Editor */}
            <div className="lg:col-span-6 rounded-3xl bg-ink-950 text-stone-200 border border-stone-800 p-5 shadow-xl space-y-3 font-mono">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 text-xs text-stone-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-jade-500/80 inline-block"></span>
                  <span className="text-[11px] text-stone-400 font-bold ml-1">
                    solution.{sandboxProblems[selectedProblemIndex].language.toLowerCase() === 'javascript' ? 'js' : 'py'}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-amber-400">
                  {sandboxProblems[selectedProblemIndex].difficulty}
                </span>
              </div>

              {/* Code text */}
              <pre className="text-xs text-amber-200/90 leading-relaxed overflow-x-auto p-2 bg-black/40 rounded-xl max-h-[320px]">
                {sandboxProblems[selectedProblemIndex].code}
              </pre>

              {/* Action */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-stone-500">
                  ⚡ Ready for Gemini AST analysis
                </span>
                <Button
                  size="sm"
                  variant="terracotta"
                  icon={isEvaluatingCode ? RefreshCw : Zap}
                  disabled={isEvaluatingCode}
                  onClick={handleRunEvaluation}
                  className="text-xs shadow-md shadow-terracotta-500/30 cursor-pointer"
                >
                  {isEvaluatingCode ? 'Evaluating AST...' : 'Run AI Evaluation'}
                </Button>
              </div>
            </div>

            {/* Right 6 Cols: Real-time Evaluation Result Box */}
            <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-ink-850 border border-stone-200 dark:border-ink-800 p-6 shadow-md space-y-5">
              {!evaluationResult && !isEvaluatingCode && (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-terracotta-500/10 text-terracotta-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-serif font-bold text-stone-900 dark:text-white">
                    Click "Run AI Evaluation" to Inspect
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                    Our AI models generate instantaneous complexity proofs, code hygiene scorecards, and constructive feedback.
                  </p>
                </div>
              )}

              {isEvaluatingCode && (
                <div className="text-center py-12 space-y-4 animate-pulse">
                  <RefreshCw className="w-8 h-8 text-terracotta-500 animate-spin mx-auto" />
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-stone-900 dark:text-white font-mono">
                      Analyzing Complexity & Guardrails...
                    </div>
                    <div className="text-xs text-stone-500">
                      Computing Big-O Bounds & Static Type Consistency
                    </div>
                  </div>
                </div>
              )}

              {evaluationResult && !isEvaluatingCode && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Score & Verdict Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-ink-800">
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wider text-terracotta-600 dark:text-amber-400 font-bold">
                        AI Rubric Scorecard
                      </div>
                      <div className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
                        {evaluationResult.overallScore}/100 Grade A+
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-jade-500/10 border border-jade-500/30 flex items-center justify-center text-jade-600 dark:text-jade-400 font-serif font-bold text-lg">
                      98%
                    </div>
                  </div>

                  {/* Complexity Badges */}
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-ink-900 border border-stone-200 dark:border-ink-800">
                      <span className="text-stone-500 text-[10px] block uppercase font-bold">Time Complexity</span>
                      <span className="font-bold text-terracotta-600 dark:text-amber-400">{evaluationResult.timeComplexity}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-ink-900 border border-stone-200 dark:border-ink-800">
                      <span className="text-stone-500 text-[10px] block uppercase font-bold">Space Complexity</span>
                      <span className="font-bold text-jade-600 dark:text-jade-400">{evaluationResult.spaceComplexity}</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed italic">
                    "{evaluationResult.summary}"
                  </p>

                  {/* Strengths */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-jade-600 dark:text-jade-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Key Strengths
                    </div>
                    {evaluationResult.strengths.map((str, idx) => (
                      <div key={idx} className="text-xs text-stone-700 dark:text-stone-300 flex items-start gap-1.5">
                        <span className="text-jade-500 font-bold">•</span>
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>

                  {/* Constructive Recommendations */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Gemini Recommendations
                    </div>
                    {evaluationResult.suggestions.map((sug, idx) => (
                      <div key={idx} className="text-xs text-stone-700 dark:text-stone-300 flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link to="/register">
                      <Button size="sm" variant="terracotta" className="w-full text-xs">
                        Unlock Full AI Code Mentorship Suite →
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* =========================================
            SECTION 6: 3D INTERACTIVE BOOKSHELF SHOWCASE
           ========================================= */}
        <section id="bookshelf-section" className="rounded-3xl p-8 sm:p-12 border border-stone-200 dark:border-terracotta-500/30 bg-gradient-to-br from-stone-100 via-stone-50 to-white dark:from-ink-900 dark:via-ink-850 dark:to-ink-900 relative overflow-hidden shadow-xl scroll-mt-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider font-mono border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> 3D Volume Exploration
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white">
                Interactive Three.js Module Bookshelf
              </h2>
              <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed max-w-xl">
                Experience course materials rendered as real-time 3D books. Inspect spines, rotate dimensional volumes, and jump directly into active learning chapters with WebGL acceleration. No upfront login required to explore!
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link to="/bookshelf">
                  <Button size="md" variant="amber" icon={ArrowRight} className="font-bold shadow-md shadow-amber-500/20">
                    Launch 3D Bookshelf
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="md" variant="secondary">
                    View Enrolled Courses
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="p-6 rounded-3xl bg-white dark:bg-ink-950 border border-stone-200 dark:border-ink-800 text-center space-y-3 w-full max-w-sm shadow-md">
                <div className="aspect-video w-full rounded-2xl bg-stone-100 dark:bg-ink-900 flex flex-col items-center justify-center border border-stone-200 dark:border-ink-800 text-xs text-stone-500 font-mono gap-2 p-4">
                  <BookOpen className="w-8 h-8 text-amber-500 animate-bounce" />
                  <span className="dark:text-stone-300 font-bold">[ 3D Bookshelf Engine v2.0 Ready ]</span>
                  <span className="text-[10px] text-stone-400">Interactive Mesh Geometry & Raycast Selection</span>
                </div>
                <div className="text-left space-y-1">
                  <div className="text-xs font-bold text-stone-900 dark:text-white">Three.js WebGL Spatial Library</div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">Tactile spine inspection with 1-click chapter launch</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 7: LIVE INDUSTRY MASTERCLASSES & WEBINARS
           ========================================= */}
        <section id="masterclasses" className="w-full space-y-8 scroll-mt-28">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider font-mono border border-blue-500/20 mb-2">
                <Calendar className="w-3.5 h-3.5 text-blue-500" /> Scheduled Faculty Masterclasses
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white">
                Upcoming Live Industry Seminars
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                Participate in live interactive seminars hosted by senior engineers and research leaders.
              </p>
            </div>

            <Link to="/register">
              <Button size="sm" variant="secondary" icon={ArrowRight} className="text-xs">
                View Full Calendar
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingMasterclasses.map((seminar) => (
              <div
                key={seminar.id}
                className="p-6 rounded-3xl bg-white dark:bg-ink-850 border border-stone-200 dark:border-ink-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                      {seminar.badge}
                    </span>
                    <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                      {seminar.level}
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-stone-900 dark:text-white leading-snug">
                    {seminar.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-terracotta-600 dark:text-amber-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{seminar.date} • {seminar.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span><strong>{seminar.speaker}</strong> ({seminar.speakerRole})</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-ink-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-stone-500">
                    {seminar.attendees}
                  </span>
                  <Link to="/register">
                    <Button size="sm" variant="terracotta" className="text-xs">
                      Reserve Free Pass
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            SECTION 8: CAREER ROADMAP & ATS RESUME CHECKLIST
           ========================================= */}
        <section id="career" className="w-full space-y-8 scroll-mt-28">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-500/10 text-terracotta-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider font-mono border border-terracotta-500/20 mb-2">
                <Briefcase className="w-3.5 h-3.5 text-terracotta-500" /> Career Acceleration & Placement
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white">
                Career Roadmaps & Interactive ATS Checker
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                Evaluate your technical resume readiness against top Tier-1 tech screening criteria.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left 6: Career Pathways */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-ink-850 border border-stone-200 dark:border-ink-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-terracotta-500" /> Full-Stack Architect Track
                  </span>
                  <span className="text-[11px] font-mono text-jade-600 dark:text-jade-400 font-bold">$135k - $190k Avg</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  Covers React 19, Node.js microservices, Redis caching, CI/CD pipelines, and high-concurrency systems.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-ink-850 border border-stone-200 dark:border-ink-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-amber-500" /> Generative AI & RAG Engineer Track
                  </span>
                  <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold">$150k - $210k Avg</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  Master embedding models, vector search, LangChain agents, guardrails, and fine-tuning pipelines.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-ink-850 border border-stone-200 dark:border-ink-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-jade-500" /> Cloud DevOps & SRE Track
                  </span>
                  <span className="text-[11px] font-mono text-jade-600 dark:text-jade-400 font-bold">$140k - $195k Avg</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  Infrastructure as Code with Terraform, Kubernetes clustering, Prometheus monitoring, and zero-downtime deployments.
                </p>
              </div>
            </div>

            {/* Right 6: Interactive ATS Checklist Sandbox */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-850 border border-stone-200 dark:border-ink-800 shadow-md space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-terracotta-600 dark:text-amber-400 font-bold">
                    Interactive Resume Readiness Tool
                  </div>
                  <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white">
                    ATS Score Calculator
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-serif font-bold text-terracotta-600 dark:text-amber-400 font-mono">
                    {atsScore}%
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    {atsScore >= 80 ? '🟢 Screening Ready' : '🟡 Needs Optimization'}
                  </div>
                </div>
              </div>

              {/* Interactive Checkbox Items */}
              <div className="space-y-2.5">
                {[
                  { key: 'metrics', label: 'Quantifiable metrics included (e.g. "Reduced API latency by 35%")' },
                  { key: 'skills', label: 'Specific tech keywords match target role (Docker, React, Redis, Python)' },
                  { key: 'formatting', label: 'Clean single-column formatting without unparseable table graphics' },
                  { key: 'projects', label: 'Live deployed production links & system architecture diagrams' },
                  { key: 'github', label: 'Active GitHub repository links with clean README documentation' },
                  { key: 'actionVerbs', label: 'Strong technical action verbs (Engineered, Architected, Refactored)' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-50 dark:bg-ink-900 border border-stone-200/60 dark:border-ink-800 text-xs text-stone-800 dark:text-stone-200 cursor-pointer hover:border-terracotta-500/40 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={atsChecklist[item.key]}
                      onChange={(e) =>
                        setAtsChecklist({
                          ...atsChecklist,
                          [item.key]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-terracotta-600 accent-terracotta-500"
                    />
                    <span className="leading-snug">{item.label}</span>
                  </label>
                ))}
              </div>

              <div className="pt-2">
                <Link to="/register">
                  <Button size="sm" variant="terracotta" className="w-full text-xs">
                    Get Full Career Mentorship & Mock Interviews →
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================
            SECTION 9: STUDENT & ALUMNI SUCCESS TESTIMONIALS
           ========================================= */}
        <section id="testimonials" className="w-full space-y-8 scroll-mt-28">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider font-mono border border-amber-500/20">
              <Award className="w-3.5 h-3.5 text-amber-500" /> Proven Outcomes
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white">
              Trusted by Engineers at Top Tech Companies
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              See how our students transformed their careers with AI rubric feedback and peer study rooms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="p-6 rounded-3xl bg-white dark:bg-ink-850 border border-stone-200 dark:border-ink-800 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed italic">
                    "{test.review}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-stone-100 dark:border-ink-800">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
                  />
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-white">
                      {test.name}
                    </div>
                    <div className="text-[11px] text-terracotta-600 dark:text-amber-400 font-mono">
                      {test.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            SECTION 10: FREQUENTLY ASKED QUESTIONS
           ========================================= */}
        <section id="faq" className="w-full max-w-3xl mx-auto space-y-6 scroll-mt-28">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-500/10 text-terracotta-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider font-mono border border-terracotta-500/20">
              <HelpCircle className="w-3.5 h-3.5 text-terracotta-500" /> Got Questions?
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
              Everything you need to know about LearnSphere LMS features, pricing, and certifications.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-ink-900/90 border border-stone-200 dark:border-ink-800 overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between text-sm font-semibold text-stone-900 dark:text-white hover:text-terracotta-600 dark:hover:text-amber-400 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeFaq === idx ? 'rotate-180 text-terracotta-500' : 'text-stone-400'}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-stone-700 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-ink-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            SECTION 11: FINAL CONVERSION CTA BANNER
           ========================================= */}
        <section className="w-full">
          <div className="p-8 sm:p-12 rounded-3xl border border-stone-200 dark:border-ink-800 bg-white dark:bg-ink-900 text-center relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-500/10 text-terracotta-700 dark:text-amber-300 text-xs font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5 text-terracotta-500" /> Start Your Learning Journey Today
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white">
                Ready to Level Up Your Engineering Career?
              </h2>
              <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
                Join thousands of students and instructors transforming their education with real-time AI code mentorship, interactive 3D bookshelves, and peer study pods.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Link to="/register">
                  <Button size="lg" variant="terracotta" icon={ArrowRight} className="shadow-lg shadow-terracotta-500/25 px-8">
                    Create Free Account
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="secondary" className="px-8">
                    Sign In to Portal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* =========================================
          FOOTER
         ========================================= */}
      <footer className="relative z-10 border-t border-stone-200 dark:border-ink-800 bg-white/95 dark:bg-ink-950/95 backdrop-blur-md pt-12 pb-6 px-6 text-stone-500 dark:text-stone-400 text-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-terracotta-600 to-amber-500 p-0.5 shadow-sm">
                <div className="w-full h-full bg-white dark:bg-ink-900 rounded-[10px] flex items-center justify-center">
                  <Compass className="w-4 h-4 text-terracotta-500" />
                </div>
              </div>
              <span className="text-base font-serif font-bold text-stone-900 dark:text-parchment-50">LearnSphere LMS</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Empowering engineers and educators through AI code evaluation, bite-sized shorts, 3D module libraries, and real-time study pods.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-jade-500 inline-block animate-pulse"></span>
              <span className="text-[11px] font-mono text-jade-600 dark:text-jade-400 font-semibold">
                All LMS Systems Operational (v2.4.0)
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono font-semibold text-stone-900 dark:text-parchment-50 uppercase tracking-wider mb-3">Interactive Modules</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#courses" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">Course Catalog</a></li>
              <li><a href="#shorts" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Learning Shorts (Reels)</a></li>
              <li><a href="#studyrooms" className="hover:text-jade-600 dark:hover:text-jade-400 transition-colors">Virtual Study Pods</a></li>
              <li><a href="#rubric" className="hover:text-terracotta-600 dark:hover:text-amber-400 transition-colors">AI Rubric Playground</a></li>
              <li><Link to="/bookshelf" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">3D Bookshelf</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-semibold text-stone-900 dark:text-parchment-50 uppercase tracking-wider mb-3">Role Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">Student Classroom</Link></li>
              <li><Link to="/login" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">Instructor Grading Suite</Link></li>
              <li><Link to="/login" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">Admin Governance Console</Link></li>
              <li><Link to="/register" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">Register New Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-semibold text-stone-900 dark:text-parchment-50 uppercase tracking-wider mb-3">Career & Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#career" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">Career Roadmaps</a></li>
              <li><a href="#career" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">ATS Resume Checklist</a></li>
              <li><a href="#masterclasses" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">Upcoming Masterclasses</a></li>
              <li><a href="#faq" className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">Platform FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-stone-200 dark:border-ink-850 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} LearnSphere Learning Management System. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-700 dark:hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-700 dark:hover:text-stone-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-700 dark:hover:text-stone-300 cursor-pointer">System Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
