import React, { useState, useEffect } from 'react';
import { StudentNavbar } from '../../components/layout/StudentNavbar';
import { StudioTiltCard } from '../../components/ui/StudioTiltCard';
import { Button } from '../../components/ui/Button';
import {
  Award,
  CheckCircle2,
  Download,
  Share2,
  ExternalLink,
  Sparkles,
  Calendar,
  User,
  BookOpen,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const StudentCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/certificates/my');
        if (res.success && res.data) {
          setCertificates(res.data);
        }
      } catch {
        toast.error('Could not load certificates');
      } finally {
        setLoading(false);
      }
    };

    fetchCerts();
  }, []);

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-ink-950 text-stone-900 dark:text-parchment-100 flex flex-col font-sans selection:bg-terracotta-500/20 selection:text-terracotta-200">
      <StudentNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold font-mono mb-2 border border-amber-500/20">
            <Award className="w-3.5 h-3.5" /> Verified Credentials & Honors
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-white">
            Academic Certificates & Badges
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
            Official verifiable credentials earned upon mastering complete curriculum modules and assignments.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-64 rounded-3xl bg-stone-200 dark:bg-ink-900 animate-pulse border border-stone-300 dark:border-ink-800"></div>
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-ink-900 border border-stone-200 dark:border-ink-800 shadow-sm space-y-3">
            <Award className="w-12 h-12 text-stone-400 mx-auto" />
            <h3 className="text-base font-serif font-bold">No certificates earned yet</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Finish 100% of your course lessons and milestones to generate your official credential.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <StudioTiltCard
                key={cert._id}
                className="p-6 bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 border-2 border-amber-500/30 text-white flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                      {cert.certificateId}
                    </span>
                    <span className="text-xs text-jade-400 font-mono font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-serif font-bold text-white">{cert.courseTitle}</h3>
                    <p className="text-xs text-stone-300 mt-1">
                      Awarded to <strong className="text-amber-300">{cert.studentName}</strong> ({cert.grade})
                    </p>
                  </div>

                  <div className="text-[11px] text-stone-400 font-mono space-y-1 pt-2 border-t border-stone-800">
                    <div>Faculty Lead: <span className="text-white">{cert.instructorName}</span></div>
                    <div>Issued: <span className="text-white">{new Date(cert.issueDate).toLocaleDateString()}</span></div>
                  </div>
                </div>

                <div className="pt-5 flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="amber"
                    icon={Download}
                    className="flex-1 text-xs text-stone-950 font-bold"
                    onClick={() => {
                      setSelectedCert(cert);
                      setTimeout(() => window.print(), 200);
                    }}
                  >
                    Print Certificate
                  </Button>
                </div>
              </StudioTiltCard>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentCertificates;
