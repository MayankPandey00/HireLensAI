import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Network, 
  RefreshCw, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  Flame,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlacementReadinessReport } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';

export const ResultsDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState<PlacementReadinessReport | null>(null);

  useEffect(() => {
    const rawReport = sessionStorage.getItem('hirelens_report');
    if (rawReport) {
      try {
        const parsed: PlacementReadinessReport = JSON.parse(rawReport);
        setReport(parsed);

        // Trigger celebratory confetti if readiness is decent
        if (parsed.overallReadiness >= 65) {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#6366f1', '#a855f7'],
          });
        }
      } catch (e) {
        console.error('Failed to parse report');
      }
    } else {
      navigate('/setup');
    }
  }, [navigate]);

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400">
        Loading Placement Readiness Report...
      </div>
    );
  }

  const { overallReadiness, targetCompany, targetRole, candidateName, categoryScores, topRisks, verdictSummary } = report;

  const categories = [
    { key: 'technicalKnowledge', label: 'Technical Knowledge (CS)', score: categoryScores.technicalKnowledge, weight: '20%' },
    { key: 'aptitude', label: 'Aptitude & Logic', score: categoryScores.aptitude, weight: '15%' },
    { key: 'dsa', label: 'Data Structures & Algorithms', score: categoryScores.dsa, weight: '25%' },
    { key: 'communication', label: 'Communication & STAR', score: categoryScores.communication, weight: '10%' },
    { key: 'projectDefense', label: 'Project Defense', score: categoryScores.projectDefense, weight: '20%' },
    { key: 'roleAlignment', label: 'Role Alignment', score: categoryScores.roleAlignment, weight: '10%' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-xs text-cyan-300 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Placement Readiness Report • Audit Complete</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Readiness Audit: {candidateName}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Target: <span className="text-cyan-300 font-semibold">{targetCompany}</span> — {targetRole}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/mindmap"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all"
          >
            <Network className="w-4 h-4" />
            <span>Open Learning Mindmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/setup"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Start New Audit"
          >
            <RefreshCw className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Hero Score & Executive Critique Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        
        {/* Radial Overall Readiness Score Gauge */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center shadow-xl">
          <ScoreGauge score={overallReadiness} size={200} label="Readiness Score" />
          <p className="text-xs text-slate-400 mt-4 max-w-xs">
            Benchmarked against successful candidates hired at <span className="text-slate-200 font-semibold">{targetCompany}</span>.
          </p>
        </div>

        {/* Executive Verdict & USP Highlight */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Auditor Diagnostic Summary
            </span>
            <span className="text-xs font-mono text-slate-400">
              HireLens AI Engine
            </span>
          </div>

          <h2 className="text-xl font-bold text-white leading-snug">
            {verdictSummary}
          </h2>

          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-200/90 leading-relaxed">
            <span className="font-semibold block text-cyan-300 mb-1">HireLens Core Diagnosis:</span>
            Your highest risk is not lack of general intellect—it is the vulnerability between your resume's ambitious technical claims and your ability to defend low-level trade-offs when an interviewer presses you.
          </div>
        </div>

      </div>

      {/* 6 Category Breakdown Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            Category-Wise Competency Breakdown
          </h2>
          <span className="text-xs text-slate-400">Weighted evaluation breakdown</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const isGood = cat.score >= 75;
            const isMid = cat.score >= 60 && cat.score < 75;
            return (
              <div
                key={cat.key}
                className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    {cat.label}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Weight {cat.weight}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold font-mono text-white">
                    {cat.score}
                    <span className="text-xs font-normal text-slate-400">/100</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      isGood
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                        : isMid
                        ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                        : 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                    }`}
                  >
                    {isGood ? 'Strong' : isMid ? 'Moderate' : 'Critical Weakness'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-700 ${
                      isGood
                        ? 'bg-emerald-500'
                        : isMid
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TOP 3 RISKS Section */}
      <div className="space-y-5">
        <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              TOP 3 RISKS IDENTIFIED
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              These are the 3 vulnerability areas most likely to cause rejection if not addressed before the interview.
            </p>
          </div>
          <span className="text-xs font-bold text-rose-400 bg-rose-950/80 px-3 py-1 rounded-full border border-rose-800/60">
            Action Required Prior to Round 1
          </span>
        </div>

        <div className="space-y-4">
          {topRisks.map((risk) => (
            <div
              key={risk.rank}
              className="glass-panel p-6 rounded-2xl border border-rose-900/40 shadow-lg shadow-rose-950/20 space-y-4 hover:border-rose-500/40 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-rose-950 border border-rose-700 text-rose-400 text-xs font-mono font-bold flex items-center justify-center">
                    #{risk.rank}
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {risk.area}
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800">
                  {risk.severity} SEVERITY
                </span>
              </div>

              {/* 3 Core Points: Why it is weak, Evidence, Recommended Action */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                
                {/* 1. Why it is weak */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Why It Is Weak
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {risk.whyItIsWeak}
                  </p>
                </div>

                {/* 2. Evidence from assessment */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Evidence from Assessment
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    "{risk.evidence}"
                  </p>
                </div>

                {/* 3. Recommended action */}
                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Recommended Action
                  </span>
                  <p className="text-xs text-cyan-200/90 leading-relaxed font-medium">
                    {risk.recommendedAction}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA to Interactive Mindmap */}
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/30 via-slate-900 to-cyan-950/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 mb-2">
            <Network className="w-4 h-4" />
            <span>Interactive Learning Mindmap</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">
            Visual Node Graph & Targeted Remediation Roadmap
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Explore your customized React Flow graph with color-coded risk levels. Click any node to reveal why you need it, exact subtopics, effort estimations, and curated resources.
          </p>
        </div>

        <Link
          to="/mindmap"
          className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all shrink-0"
        >
          <span>Launch Mindmap Graph</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
