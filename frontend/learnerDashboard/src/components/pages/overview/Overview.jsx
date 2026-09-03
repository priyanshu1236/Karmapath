import React from 'react';
import Card from './Card';
import AIAssessmentLab from './AIAssessmentLab';

function Overview() {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Skill Intelligence Overview</h1>
          <p className="text-surface-400 text-lg max-w-2xl">Track your competency gaps and recommended capacity-building pathways with AI-driven insights.</p>
        </div>
        <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl border border-white/10 shadow-sm font-semibold transition-all group">
          <svg className="w-5 h-5 text-surface-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Export Report
        </button>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1 */}
        <Card
          title="Role Readiness"
          value="78%"
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>}
          blurColorClass="bg-blue-500/10 group-hover:bg-blue-500/20"
          iconBgClass="bg-gradient-to-br from-blue-500 to-brand-600"
          iconShadowClass="shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          badgeText="12%"
          badgeIcon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>}
          badgeColorClass="text-success-400 bg-success-500/10 border-success-500/20"
        >
          <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-400 to-brand-500 h-2.5 rounded-full w-[78%] relative shadow-[0_0_10px_rgba(99,102,241,0.5)]">
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[shimmer_1s_linear_infinite]"></div>
            </div>
          </div>
        </Card>

        {/* Card 2 */}
        <Card
          title="Critical Skill Gaps"
          value="2"
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>}
          blurColorClass="bg-alert-500/10 group-hover:bg-alert-500/20"
          iconBgClass="bg-gradient-to-br from-alert-500 to-orange-500"
          iconShadowClass="shadow-[0_0_20px_rgba(244,63,94,0.3)]"
          badgeText="1 Gap"
          badgeIcon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>}
          badgeColorClass="text-alert-400 bg-alert-500/10 border-alert-500/20"
        >
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#15151e] bg-alert-500/20 flex items-center justify-center text-xs font-bold text-alert-400" title="Data Analysis">DA</div>
            <div className="w-10 h-10 rounded-full border-2 border-[#15151e] bg-orange-500/20 flex items-center justify-center text-xs font-bold text-orange-400" title="Python">PY</div>
          </div>
        </Card>

        {/* Card 3 (New KPI) */}
        <Card
          title="Courses Completed"
          value="4"
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>}
          blurColorClass="bg-success-500/10 group-hover:bg-success-500/20"
          iconBgClass="bg-gradient-to-br from-success-500 to-teal-500"
          iconShadowClass="shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          badgeText="This Month"
          badgeColorClass="text-surface-400 bg-white/5 border-white/10"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-surface-400">
            <svg className="w-5 h-5 text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <span>On track with goals</span>
          </div>
        </Card>
      </div>

      {/* AI ASSESSMENT LAB AREA */}
      <AIAssessmentLab />

      {/* FOOTER PADDING */}
      <div className="h-10"></div>
    </div>
  );
}

export default Overview;
