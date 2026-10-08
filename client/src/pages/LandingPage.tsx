import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  FileSearch, 
  Target, 
  AlertTriangle, 
  Network, 
  CheckCircle2, 
  Zap,
  Building2,
  TrendingUp
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      
      {/* Background Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-cyan-600/20 via-indigo-600/20 to-purple-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute -top-10 left-10 w-72 h-72 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 text-center relative z-10">
        
        {/* Hackathon MVP Live Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs text-cyan-300 mb-8 backdrop-blur-md shadow-lg shadow-cyan-950/40">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span className="font-semibold tracking-wide">AI-Powered Placement Readiness Platform</span>
          <span className="w-1 h-1 rounded-full bg-cyan-400" />
          <span className="text-slate-400 font-mono text-[11px]">v1.0 Ready</span>
        </div>

        {/* Main Headline & USP */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.12]">
          Before the interviewer finds <br />
          <span className="gradient-text">your weakness,</span> HireLens finds it.
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-10">
          College students prepare using generic resources without knowing if their resume aligns with target roles or whether they can defend their technical claims. HireLens runs a complete 
          <span className="text-white font-medium"> Resume Reality Check</span>, benchmarks your technical skills, and maps your customized learning roadmap.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/setup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Start Placement Reality Check</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <span>Explore 5-Stage User Flow</span>
          </a>
        </div>

        {/* Target Company Hiring Bar Badges */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            Calibrated against real hiring bars of top recruiters
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-300">
            {['Google L3', 'Amazon SDE 1', 'Microsoft Software Engineer', 'Atlassian ASE', 'Uber', 'TCS Digital'].map((firm) => (
              <span
                key={firm}
                className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/90 hover:border-cyan-500/40 transition-colors"
              >
                {firm}
              </span>
            ))}
          </div>
        </div>

      </section>

      {/* Interactive Feature Value Matrix */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Why Generic Prep Leaves Students Vulnerable
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Interviewers don't test what you know—they aggressively drill the boundary between your resume claims and actual conceptual mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Resume Reality Check */}
          <div className="glass-card p-6 rounded-2xl relative group">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <FileSearch className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">1. Resume Reality Check</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Extracts high-risk claims (Redis caching, Docker, DB indexing) and verifies if you can defend them under interviewer scrutiny.
            </p>
            <div className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 p-2 rounded-lg border border-cyan-800/40">
              Claim vs Defense Analysis
            </div>
          </div>

          {/* Card 2: 360° Assessment */}
          <div className="glass-card p-6 rounded-2xl relative group">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">2. Multi-Domain Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Tests 5 Aptitude, 5 CS Fundamentals (OS, DBMS, Networks), 2 DSA coding patterns, and 3 STAR behavioral scenarios.
            </p>
            <div className="text-[11px] font-mono text-indigo-400 bg-indigo-950/40 p-2 rounded-lg border border-indigo-800/40">
              Aptitude + CS + DSA + STAR
            </div>
          </div>

          {/* Card 3: Top 3 Critical Risks */}
          <div className="glass-card p-6 rounded-2xl relative group">
            <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">3. Top 3 Risks</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Highlights your biggest failure vulnerabilities with precise assessment evidence and actionable fixes before your round.
            </p>
            <div className="text-[11px] font-mono text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-800/40">
              Evidence-based critique
            </div>
          </div>

          {/* Card 4: Interactive Mindmap */}
          <div className="glass-card p-6 rounded-2xl relative group">
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">4. Learning Mindmap</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Interactive React Flow visual graph color-coded by weak (red), moderate (yellow), and strong (green) topics with curated roadmaps.
            </p>
            <div className="text-[11px] font-mono text-purple-400 bg-purple-950/40 p-2 rounded-lg border border-purple-800/40">
              Visual React Flow graph
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>HireLens AI — Placement Readiness Platform</span>
          <span className="font-mono text-[11px] text-slate-400">
            USP: Before the interviewer finds your weakness, HireLens finds it.
          </span>
        </div>
      </footer>

    </div>
  );
};
