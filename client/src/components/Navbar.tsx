import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Sparkles, Compass, CheckCircle2, ChevronRight } from 'lucide-react';

const STEPS = [
  { path: '/setup', label: '1. Setup' },
  { path: '/reality-check', label: '2. Reality Check' },
  { path: '/assessment', label: '3. Assessment' },
  { path: '/interview', label: '4. Defense' },
  { path: '/results', label: '5. Dashboard' },
  { path: '/mindmap', label: '6. Mindmap' },
];

export const Navbar: React.FC = () => {
  const location = useLocation();

  const currentStepIndex = STEPS.findIndex(s => s.path === location.pathname);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080c14]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:shadow-cyan-500/30 transition-all">
            <div className="w-full h-full bg-[#080c14] rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white font-sans">
                Hire<span className="text-cyan-400">Lens</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                AI MVP
              </span>
            </div>
          </div>
        </Link>

        {/* USP Micro-Tagline */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="italic">"Before the interviewer finds your weakness, HireLens finds it."</span>
        </div>

        {/* Dynamic Workflow Progress / Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {currentStepIndex !== -1 ? (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              {STEPS.map((step, idx) => {
                const isActive = location.pathname === step.path;
                const isPassed = currentStepIndex > idx;
                return (
                  <React.Fragment key={step.path}>
                    <Link
                      to={step.path}
                      className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                          : isPassed
                          ? 'text-slate-300 hover:text-white'
                          : 'text-slate-500 hover:text-slate-400'
                      }`}
                    >
                      {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      {step.label}
                    </Link>
                    {idx < STEPS.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-slate-600" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          ) : (
            <Link
              to="/setup"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20 hover:brightness-110 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Start Readiness Audit</span>
            </Link>
          )}

          {currentStepIndex !== -1 && (
            <Link
              to="/mindmap"
              className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg bg-indigo-950/20 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mindmap</span>
            </Link>
          )}
        </nav>

      </div>
    </header>
  );
};
