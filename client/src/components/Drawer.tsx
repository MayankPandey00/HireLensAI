import React from 'react';
import { X, ExternalLink, Clock, Target, BookOpen, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { MindmapNodeData } from '../types';

interface DrawerProps {
  nodeData: MindmapNodeData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({ nodeData, isOpen, onClose }) => {
  if (!isOpen || !nodeData) return null;

  const isWeak = nodeData.status === 'WEAK';
  const isModerate = nodeData.status === 'MODERATE';

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#0c1220] border-l border-slate-800 shadow-2xl flex flex-col transform transition-transform duration-300">
      
      {/* Drawer Header */}
      <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/50">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {nodeData.category}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${
                isWeak
                  ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                  : isModerate
                  ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
              }`}
            >
              {isWeak ? (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  Weak (Priority #{nodeData.severityRank || 1})
                </>
              ) : isModerate ? (
                <>
                  <Zap className="w-3 h-3" />
                  Moderate Proficiency
                </>
              ) : (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Strong Area
                </>
              )}
            </span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">{nodeData.label}</h3>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Why You Need It */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
            <Target className="w-4 h-4" />
            Why You Need This
          </h4>
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-sm text-slate-300 leading-relaxed">
            {nodeData.whyYouNeedIt}
          </div>
        </div>

        {/* Estimated Effort & Recommended Practice */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <span className="text-xs text-slate-400 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Estimated Effort
            </span>
            <span className="text-sm font-semibold font-mono text-white">
              {nodeData.estimatedEffort || '4-6 Hours'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <span className="text-xs text-slate-400 flex items-center gap-1 mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Impact Level
            </span>
            <span className="text-sm font-semibold text-white">
              {isWeak ? 'High Placement Impact' : 'Medium Impact'}
            </span>
          </div>
        </div>

        {/* Tactical Practice Recommendation */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            Practice Recommendation
          </h4>
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-sm text-amber-200/90 leading-relaxed">
            {nodeData.practiceRecommendation}
          </div>
        </div>

        {/* Topics to Learn */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Key Subtopics & Core Concepts
          </h4>
          <ul className="space-y-2">
            {nodeData.topicsToLearn?.map((topic, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800 text-xs text-slate-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Resources */}
        {nodeData.recommendedResources && nodeData.recommendedResources.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4 text-indigo-400" />
              Recommended Resources
            </h4>
            <div className="space-y-2">
              {nodeData.recommendedResources.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                      {res.type}
                    </span>
                    <span className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {res.title}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/40 text-center">
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
        >
          Close Drawer
        </button>
      </div>

    </div>
  );
};
