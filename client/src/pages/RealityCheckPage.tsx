import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  ArrowRight, 
  HelpCircle, 
  Target, 
  Award,
  BookOpen
} from 'lucide-react';
import { ResumeRealityCheck } from '../types';
import { generateAssessment } from '../services/api';
import { LoadingOverlay } from '../components/LoadingOverlay';

export const RealityCheckPage: React.FC = () => {
  const navigate = useNavigate();

  const [realityCheck, setRealityCheck] = useState<ResumeRealityCheck | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedSession = sessionStorage.getItem('hirelens_sessionId');
    const storedData = sessionStorage.getItem('hirelens_realityCheck');

    if (storedData) {
      try {
        setRealityCheck(JSON.parse(storedData));
        setSessionId(storedSession);
      } catch (e) {
        console.error('Failed to parse reality check data');
      }
    } else {
      // If no session data, redirect back to setup
      navigate('/setup');
    }
  }, [navigate]);

  const handleStartAssessment = async () => {
    if (!sessionId) return;
    try {
      setIsGenerating(true);
      setError(null);
      const res = await generateAssessment(sessionId);
      sessionStorage.setItem('hirelens_assessmentId', res.assessmentId);
      sessionStorage.setItem('hirelens_assessmentBundle', JSON.stringify(res.bundle));
      navigate('/assessment');
    } catch (err: any) {
      console.error('Assessment gen error:', err);
      setError(err.message || 'Failed to generate assessment bundle.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!realityCheck) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400">Loading Resume Reality Check data...</p>
      </div>
    );
  }

  const { targetAlignment, technicalClaims, extractedSkills, candidateName } = realityCheck;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      
      {isGenerating && (
        <LoadingOverlay
          title="Synthesizing Tailored Assessment"
          steps={[
            'Curating 5 Aptitude speed & reasoning problems...',
            'Structuring 5 CS fundamentals questions (OS, DBMS, Networks)...',
            'Formulating 2 algorithmic coding problems...',
            'Linking project defense prompts directly to your resume claims...',
          ]}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-xs text-cyan-300 mb-3">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          <span>Stage 2 of 5: Resume Reality Check</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Resume Reality Check for {candidateName}
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Can you defend the technical claims made on your resume under live interviewer scrutiny?
        </p>
      </div>

      {/* Target Alignment & Benchmark Summary Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Alignment Gauge Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              Role Alignment Bar
            </span>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-mono font-extrabold text-white">
                {targetAlignment.alignmentScore}%
              </span>
              <span className="text-xs font-semibold text-emerald-400">Match</span>
            </div>
            <p className="text-xs text-slate-400">
              Target: <span className="text-slate-200 font-medium">{targetAlignment.targetCompany}</span> — {targetAlignment.targetRole}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2 rounded-full"
                style={{ width: `${targetAlignment.alignmentScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Company Hiring Bar Insight */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
            <Target className="w-4 h-4 text-indigo-400" />
            Recruiter Expectation & Hiring Bar
          </span>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {targetAlignment.companyBarInsight}
          </p>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
            <span className="text-amber-400 font-semibold mr-1">Gap Analysis:</span>
            {targetAlignment.gapSummary}
          </div>
        </div>

      </div>

      {/* Skills Comparison Matrix */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 mb-8 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          Skill Alignment Comparison
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Matched Skills */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-2.5">
              <CheckCircle2 className="w-4 h-4" />
              Verified Skills on Resume ({extractedSkills.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {extractedSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg text-xs bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 mb-2.5">
              <AlertTriangle className="w-4 h-4" />
              Target Role Gaps ({targetAlignment.missingSkills.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {targetAlignment.missingSkills.length > 0 ? (
                targetAlignment.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-xs bg-rose-950/40 border border-rose-800/40 text-rose-300 font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No major stack gaps identified.</span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Technical Claims Under Reality Check */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Resume Claims Under Scrutiny ({technicalClaims.length})
            </h3>
            <p className="text-xs text-slate-400">
              Technical claims extracted from your resume that will trigger in-depth defense questions in your assessment.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {technicalClaims.map((claim, idx) => (
            <div
              key={claim.id || idx}
              className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-indigo-300 font-mono">
                  [{claim.projectOrExperience}]
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    claim.riskLevel === 'HIGH'
                      ? 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                      : 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                  }`}
                >
                  {claim.riskLevel} Verifiability Risk
                </span>
              </div>

              {/* Claim Text */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200">
                "{claim.claim}"
              </div>

              {/* Defense Question */}
              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-200 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-cyan-300 mb-0.5">
                    Interviewer Reality Check Question:
                  </span>
                  <span>{claim.defenseQuestion}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3.5 mb-6 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* CTA Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 glass-panel rounded-2xl border border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-white">Ready for the 360° Readiness Assessment?</h4>
          <p className="text-xs text-slate-400">
            5 Aptitude, 5 CS Fundamentals, 2 DSA coding patterns + Claim Defense questions.
          </p>
        </div>

        <button
          onClick={handleStartAssessment}
          disabled={isGenerating}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <span>Generate Assessment & Begin</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
