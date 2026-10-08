import React from 'react';

interface ScoreGaugeProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 190,
  strokeWidth = 14,
  label = 'Overall Readiness',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = '#f59e0b'; // amber default
  let glowColor = 'rgba(245, 158, 11, 0.4)';
  let verdictText = 'Needs Targeted Practice';

  if (score >= 80) {
    colorClass = '#10b981'; // emerald
    glowColor = 'rgba(16, 185, 129, 0.4)';
    verdictText = 'Interview Ready';
  } else if (score < 60) {
    colorClass = '#f43f5e'; // rose
    glowColor = 'rgba(244, 63, 94, 0.4)';
    verdictText = 'Placement Risk';
  }

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorClass}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              filter: `drop-shadow(0 0 10px ${glowColor})`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline justify-center">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">
              {score}
            </span>
            <span className="text-lg font-bold text-slate-400">/100</span>
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 mt-1">
            {label}
          </span>
        </div>
      </div>

      <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800"
        style={{ color: colorClass }}>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorClass }}></span>
        {verdictText}
      </div>
    </div>
  );
};
