import React, { useState } from 'react';
import Sidebar from './components/pages/overview/Sidebar';
import Overview from './components/pages/overview/Overview';
import MyCompetencies from './components/pages/MyCompetencies/MyCompetencies';
import Theme from './components/Theme';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  return (
    <div className="fixed inset-0 flex bg-[#0a0a0f] text-surface-300 font-sans overflow-hidden selection:bg-brand-500/30">
      {/* Abstract Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* SIDEBAR */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* MAIN WRAPPER */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">

        {/* TOP HEADER */}
        <header className="h-20 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 lg:px-12 z-20 sticky top-0">
          <div className="flex items-center gap-2 text-xs font-bold text-success-400 bg-success-500/10 px-4 py-2 rounded-full border border-success-500/20">
            <span className="relative flex h-2.5 w-2.5 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success-500"></span>
            </span>
            Authenticated via iGOT
          </div>

          <div className="flex items-center gap-6">
            <Theme />
            <button className="text-surface-400 hover:text-white transition-colors relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-alert-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
            </button>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-surface-200 group-hover:text-brand-400 transition-colors">Aarav Patel</p>
                <p className="text-[11px] text-surface-500 font-medium">Junior Statistical Officer</p>
              </div>
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 border border-white/10 shadow-lg flex items-center justify-center text-white font-bold group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-all">
                AP
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE DASHBOARD AREA */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-12 relative z-10">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'competencies' && <MyCompetencies />}
        </main>
      </div>

      {/* Global styles for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          100% {
            background-position: 2rem 2rem;
          }
        }
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}} />
    </div>
  );
}

export default App;