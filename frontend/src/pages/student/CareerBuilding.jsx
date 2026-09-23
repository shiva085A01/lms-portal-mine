import React, { useState, useEffect } from 'react';
import { StudentNavbar } from '../../components/layout/StudentNavbar';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import {
  Briefcase,
  FileText,
  Code2,
  Compass,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Building,
  Clock,
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
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <StudentNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold mb-2">
            <Briefcase className="w-3.5 h-3.5" /> Placement & Career Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Career Acceleration Hub</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            ATS resume templates, top 75 algorithmic patterns, system design frameworks, and industry roadmaps.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-glow'
                  : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:bg-slate-800/60 hover:text-slate-200'
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
              <div key={n} className="h-64 rounded-2xl bg-slate-900/60 animate-pulse border border-white/5"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {resources.map((res) => (
              <GlassCard key={res._id} className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/20">
                      {res.category.replace('_', ' ')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {res.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{res.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{res.description}</p>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <Building className="w-3.5 h-3.5 text-amber-400" />
                    <span>Targeted: <strong className="text-slate-200">{res.companyTag}</strong></span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {res.skills?.map((skill, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-white/10 text-slate-300">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Interactive Checklist */}
                  {res.checklist?.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 space-y-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Actionable Checklist
                      </span>
                      {res.checklist.map((item, idx) => {
                        const checkKey = `${res._id}-${idx}`;
                        const isDone = !!completedItems[checkKey];
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleChecklist(checkKey)}
                            className="flex items-start gap-2.5 cursor-pointer text-xs group"
                          >
                            <div className={`w-4 h-4 rounded border mt-0.5 shrink-0 flex items-center justify-center transition-colors ${
                              isDone
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-slate-600 bg-slate-950 group-hover:border-slate-400'
                            }`}>
                              {isDone && <CheckCircle2 className="w-3 h-3" />}
                            </div>
                            <div className="flex-1">
                              <p className={`font-semibold transition-colors ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                {item.item}
                              </p>
                              {item.description && (
                                <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CareerBuilding;
