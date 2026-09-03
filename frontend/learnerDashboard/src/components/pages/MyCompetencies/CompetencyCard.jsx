import React from 'react';

function CompetencyCard({ name, level, score, color, shadow, bg }) {
  return (
    <div className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity duration-500 ${bg}`}></div>
      <div className="relative z-10 flex justify-between items-end mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">{level}</p>
        </div>
        <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r text-white">
          {score}<span className="text-sm font-medium text-surface-500">/100</span>
        </div>
      </div>
      <div className="relative z-10 w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full bg-gradient-to-r ${color} relative`}
          style={{ width: `${score}%`, boxShadow: `0 0 10px ${shadow}` }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[shimmer_1s_linear_infinite]"></div>
        </div>
      </div>
    </div>
  );
}

export default CompetencyCard;
