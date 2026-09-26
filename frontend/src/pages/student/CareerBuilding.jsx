import React, { useState, useEffect } from 'react';
import { StudentNavbar } from '../../components/layout/StudentNavbar';
import { Button } from '../../components/ui/Button';
import { StudioTiltCard } from '../../components/ui/StudioTiltCard';
import {
  Briefcase,
  CheckCircle2,
  Building,
  Clock,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const CareerBuilding = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [completedItems, setCompletedItems] = useState({});

  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/career?category=${activeTab}`);
        if (res.success) {
          setResources(res.data || []);
        }
      } catch {
        toast.error('Failed to load career resources');
      } finally {
        setLoading(false);
      }
    };
    fetchCareerData();
  }, [activeTab]);

  const toggleChecklist = (id) => {
    setCompletedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const tabs = [
    { id: 'all', label: 'All Resources' },
    { id: 'resume', label: 'Resume Building' },
    { id: 'dsa', label: 'DSA Roadmap' },
    { id: 'interview', label: 'System Design & Interviews' },
    { id: 'skill_roadmap', label: 'Career Roadmaps' },
  ];

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col font-sans transition-colors duration-300">
      <StudentNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-500/10 text-terracotta-700 dark:text-terracotta-300 text-xs font-semibold font-mono mb-2 border border-terracotta-500/20">
            <Briefcase className="w-3.5 h-3.5" /> Placement & Career Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-parchment-50">Career Acceleration Hub</h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            ATS resume templates, top 75 algorithmic patterns, system design frameworks, and industry roadmaps.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-200 dark:border-ink-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'bg-white dark:bg-ink-900 text-stone-600 dark:text-stone-400 border border-stone-300 dark:border-ink-800 hover:border-stone-400 dark:hover:border-ink-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-64 rounded-3xl bg-stone-200 dark:bg-ink-900/60 animate-pulse border border-stone-300 dark:border-ink-800"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {resources.map((res) => (
              <StudioTiltCard key={res._id} className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-mono">
                      {res.category.replace('_', ' ')}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-stone-400" /> {res.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-parchment-50 mb-2">{res.title}</h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">{res.description}</p>

                  <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 mb-4 font-mono">
                    <Building className="w-3.5 h-3.5 text-amber-500" />
                    <span>Targeted: <strong className="text-stone-900 dark:text-stone-200">{res.companyTag}</strong></span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5 font-mono">
                    {res.skills?.map((skill, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-ink-900 border border-stone-200 dark:border-ink-800 text-stone-700 dark:text-stone-300">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Interactive Checklist */}
                  {res.checklist?.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-ink-900 border border-stone-200 dark:border-ink-800 space-y-2.5">
                      <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block font-mono">
                        Actionable Checklist
                      </span>
                      {res.checklist.map((item, idx) => {
                        const checkKey = `${res._id}-${idx}`;
                        const isDone = !!completedItems[checkKey];
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleChecklist(checkKey)}
                            className="flex items-start gap-2.5 cursor-pointer text-xs group select-none"
                          >
                            <div className={`w-4 h-4 rounded-md border mt-0.5 shrink-0 flex items-center justify-center transition-colors ${
                              isDone
                                ? 'bg-jade-500 border-jade-500 text-white'
                                : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-ink-950 group-hover:border-stone-400'
                            }`}>
                              {isDone && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <div className="flex-1">
                              <p className={`font-semibold transition-colors ${isDone ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-800 dark:text-stone-200'}`}>
                                {item.item}
                              </p>
                              {item.description && (
                                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{item.description}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </StudioTiltCard>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CareerBuilding;
