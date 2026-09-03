import React from 'react';

function Card({
  title,
  value,
  icon,
  blurColorClass,
  iconBgClass,
  iconShadowClass,
  badgeText,
  badgeIcon,
  badgeColorClass,
  children
}) {
  return (
    <div className="group bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/5 p-7 hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
      <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full blur-2xl transition-colors ${blurColorClass}`}></div>
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className={`w-14 h-14 rounded-2xl text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${iconBgClass} ${iconShadowClass}`}>
          {icon}
        </div>
        <span className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border ${badgeColorClass}`}>
          {badgeIcon && badgeIcon}
          {badgeText}
        </span>
      </div>
      <div className="relative z-10">
        <p className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-4xl font-extrabold text-white">{value}</p>
      </div>
      {children && (
        <div className="mt-6 relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}

export default Card;
