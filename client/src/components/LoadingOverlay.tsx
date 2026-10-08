import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Cpu } from 'lucide-react';

interface LoadingOverlayProps {
  title: string;
  steps: string[];
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ title, steps }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (steps.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 900);
    return () => clearInterval(interval);
  }, [steps]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070b12]/80 backdrop-blur-md px-4">
      <div className="w-full max-w-md p-6 rounded-2xl glass-panel border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 relative">
          <Cpu className="w-7 h-7 animate-pulse text-cyan-400" />
          <Loader2 className="w-12 h-12 absolute text-cyan-500/20 animate-spin" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-xs text-slate-400 mb-6">
          HireLens AI is performing deep analysis against industry benchmarks...
        </p>

        <div className="space-y-3 text-left">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step}
                className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs transition-all ${
                  isCurrent
                    ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
                    : isCompleted
                    ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                    : 'bg-slate-900/20 border-transparent text-slate-600'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span className={isCurrent ? 'font-medium' : ''}>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
