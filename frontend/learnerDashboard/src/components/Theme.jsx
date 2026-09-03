import React, { useState, useEffect } from 'react';

function Theme() {
  const [theme, setTheme] = useState('govtech');

  const themes = [
    { id: 'govtech', name: 'GovTech Trust (Indigo)' },
    { id: 'mospi', name: 'MoSPI Analyst (Teal)' },
    { id: 'bharat', name: 'Bharat Digital (Blue)' },
  ];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="relative group/theme z-50">
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-800 border border-white/10 text-surface-300 hover:text-white hover:bg-surface-700 transition-colors text-sm font-medium shadow-sm">
        <svg className="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
        Theme
      </button>
      
      <div className="absolute right-0 top-full mt-2 w-48 bg-surface-900 border border-white/10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover/theme:opacity-100 group-hover/theme:visible transition-all duration-200 overflow-hidden transform origin-top-right scale-95 group-hover/theme:scale-100 backdrop-blur-xl">
        <div className="p-2 space-y-1">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                theme === t.id 
                  ? 'bg-brand-500/20 text-brand-400' 
                  : 'text-surface-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Theme;
