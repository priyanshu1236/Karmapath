import React from 'react';

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-72 bg-white/[0.02] backdrop-blur-2xl border-r border-white/5 flex flex-col z-20 hidden md:flex transition-all duration-300 relative">
      <div className="h-20 flex items-center px-8 border-b border-white/5">
        <div className="w-10 h-10 bg-gradient-to-tr from-brand-500 to-violet-500 rounded-xl flex items-center justify-center mr-4 shadow-[0_0_20px_rgba(99,102,241,0.4)] ring-1 ring-white/20">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
        </div>
        <span className="font-extrabold text-xl tracking-tight text-white">
          MoSPI <span className="font-medium text-brand-400">SkillIntel</span>
        </span>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        <p className="px-4 text-[10px] font-bold text-surface-500 uppercase tracking-widest mb-4">Learning Space</p>

        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'overview' ? 'bg-brand-500/10 text-brand-300 border border-brand-500/20 hover:bg-brand-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'text-surface-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
        >
          <div className={`p-1.5 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-brand-500/20 text-brand-400' : 'text-surface-500 group-hover:text-white group-hover:bg-white/10'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          </div>
          Overview Dashboard
        </a>

        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); setActiveTab('competencies'); }}
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'competencies' ? 'bg-brand-500/10 text-brand-300 border border-brand-500/20 hover:bg-brand-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'text-surface-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
        >
           <div className={`p-1.5 rounded-lg transition-colors ${activeTab === 'competencies' ? 'bg-brand-500/20 text-brand-400' : 'text-surface-500 group-hover:text-white group-hover:bg-white/10'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           </div>
          My Competencies
        </a>

        <a href="#" className="group flex items-center gap-3 text-surface-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl font-medium transition-all">
          <div className="p-1.5 rounded-lg text-surface-500 group-hover:text-white group-hover:bg-white/10 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          iGOT Training Hub
        </a>
      </nav>
      

    </aside>
  );
}

export default Sidebar;
