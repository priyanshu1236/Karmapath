export default function AdminDashboard() {
  return (
    <div className="flex flex-col w-full">
      <div className="px-8 py-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-surface-container-highest/60 bg-surface-container-low/40">
        <div>
          <p className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant mb-1 font-semibold">Admin Overview</p>
          <h2 className="font-headline-lg text-[38px] leading-tight text-on-surface tracking-tight">Workforce Intelligence</h2>
          <p className="font-body-md text-on-surface-variant mt-1 max-w-2xl">Aggregate skill gap analysis and training demand across all statistical officers.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-lowest text-on-surface px-4 py-2.5 rounded-lg border border-outline-variant/60 font-label-md text-xs uppercase tracking-wider hover:bg-surface-container-low transition-colors flex items-center gap-2 shadow-sm font-semibold">
            <span className="material-symbols-outlined text-[18px]">download</span> Export Report
          </button>
          <button className="bg-brand-graphite text-white px-4 py-2.5 rounded-lg font-label-md text-xs uppercase tracking-wider hover:bg-brand-graphite/90 transition-colors flex items-center gap-2 shadow font-semibold">
            <span className="material-symbols-outlined text-[18px]">refresh</span> Refresh Data
          </button>
        </div>
      </div>
      <div className="px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col border border-outline-variant/40 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 w-24 h-24 bg-brand-sand-container/50 rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-brand-graphite">
                <span className="material-symbols-outlined text-[18px]">group</span>
              </div>
              <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Total Officers</p>
            </div>
            <p className="font-body-lg text-4xl font-bold text-on-surface relative z-10 tracking-tight">1,240</p>
            <div className="mt-4 pt-2 flex items-center gap-1.5 text-brand-teal relative z-10 font-semibold text-xs">
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              <span className="font-body-md text-xs">Active this quarter</span>
            </div>
          </div>
          <div className="bg-[#fbf3e4] p-6 rounded-xl shadow-sm flex flex-col border border-[#edd7c2] relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 w-24 h-24 bg-[#C86B45]/10 rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-[#C86B45]/15 flex items-center justify-center text-[#C86B45]">
                <span className="material-symbols-outlined text-[18px]">warning</span>
              </div>
              <p className="font-label-md text-xs text-[#C86B45] uppercase tracking-wider font-bold">High-Priority Gaps</p>
            </div>
            <p className="font-body-lg text-4xl font-bold text-[#C86B45] relative z-10 tracking-tight">8</p>
            <div className="mt-4 pt-2 flex items-center gap-1.5 text-[#C86B45] relative z-10 font-semibold text-xs">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span className="font-body-md text-xs">+2 from last month</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col border border-outline-variant/40 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 w-24 h-24 bg-brand-sand-container/50 rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-brand-teal">
                <span className="material-symbols-outlined text-[18px]">psychology</span>
              </div>
              <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Training Demand</p>
            </div>
            <p className="font-body-lg text-2xl font-bold text-on-surface relative z-10">High <span className="text-sm font-normal text-on-surface-variant">(3 Focus Areas)</span></p>
            <div className="mt-4 pt-2 flex gap-1.5 relative z-10">
              <span className="px-2.5 py-0.5 bg-surface-container-high text-on-surface font-label-md text-[11px] rounded uppercase font-semibold">GIS</span>
              <span className="px-2.5 py-0.5 bg-surface-container-high text-on-surface font-label-md text-[11px] rounded uppercase font-semibold">AI/ML</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col border border-outline-variant/40 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 w-24 h-24 bg-brand-sand-container/50 rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-brand-graphite">
                <span className="material-symbols-outlined text-[18px]">analytics</span>
              </div>
              <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Avg. Competency</p>
            </div>
            <div className="flex items-baseline gap-2 relative z-10">
              <p className="font-body-lg text-4xl font-bold text-on-surface tracking-tight">61%</p>
              <p className="font-body-md text-xs text-on-surface-variant">Institutional</p>
            </div>
            <div className="mt-auto pt-3 w-full relative z-10">
              <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                <div className="bg-brand-graphite h-2 rounded-full transition-all duration-700" style={{ width: '61%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/40 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-headline-lg text-[22px] text-on-surface">Top Workforce Skill Gaps</h3>
                <p className="font-body-md text-xs text-on-surface-variant mt-0.5">Number of officers requiring training per domain</p>
              </div>
              <button className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low p-1.5 rounded-lg transition-colors">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-24 font-label-md text-xs font-bold text-on-surface-variant tracking-wider">AI/ML</div>
                <div className="flex-1">
                  <div className="h-9 bg-surface-container-low rounded-lg flex items-center relative overflow-hidden group cursor-pointer border border-outline-variant/20">
                    <div className="absolute inset-y-0 left-0 bg-brand-graphite group-hover:bg-brand-graphite/90 transition-colors duration-300 rounded-l-lg" style={{ width: '100%' }}></div>
                    <span className="relative z-10 ml-3 font-mono-data text-xs text-white font-semibold">162 officers</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 font-label-md text-xs font-bold text-on-surface-variant tracking-wider">GIS</div>
                <div className="flex-1">
                  <div className="h-9 bg-surface-container-low rounded-lg flex items-center relative overflow-hidden group cursor-pointer border border-outline-variant/20">
                    <div className="absolute inset-y-0 left-0 bg-brand-teal group-hover:bg-brand-teal/90 transition-colors duration-300 rounded-l-lg" style={{ width: '76%' }}></div>
                    <span className="relative z-10 ml-3 font-mono-data text-xs text-white font-semibold">124 officers</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 font-label-md text-xs font-bold text-on-surface-variant tracking-wider">PYTHON</div>
                <div className="flex-1">
                  <div className="h-9 bg-surface-container-low rounded-lg flex items-center relative overflow-hidden group cursor-pointer border border-outline-variant/20">
                    <div className="absolute inset-y-0 left-0 bg-secondary group-hover:bg-secondary/90 transition-colors duration-300 rounded-l-lg" style={{ width: '53%' }}></div>
                    <span className="relative z-10 ml-3 font-mono-data text-xs text-white font-semibold">87 officers</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 font-label-md text-xs font-bold text-on-surface-variant tracking-wider">SAMPLING</div>
                <div className="flex-1">
                  <div className="h-9 bg-surface-container-low rounded-lg flex items-center relative overflow-hidden group cursor-pointer border border-outline-variant/20">
                    <div className="absolute inset-y-0 left-0 bg-[#8c918c] group-hover:bg-[#7e837e] transition-colors duration-300 rounded-l-lg" style={{ width: '34%' }}></div>
                    <span className="relative z-10 ml-3 font-mono-data text-xs text-white font-semibold">55 officers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#1f2421] text-white rounded-xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-between border border-brand-graphite">
            <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-white/5 pointer-events-none"></div>
            <div className="relative z-10">
              <span className="inline-block px-2 py-0.5 rounded bg-brand-teal/30 text-[#d1e7e4] text-[11px] font-label-md uppercase tracking-wider mb-3">Priority Action</span>
              <h3 className="font-headline-lg text-[24px] mb-3 leading-snug">Quarterly Directive</h3>
              <p className="font-body-md text-sm text-white/85 leading-relaxed">Based on the current gap analysis, focus departmental resources on AI/ML and GIS capacity building for Q3.</p>
            </div>
            <div className="mt-6 pt-4 relative z-10 border-t border-white/10">
              <button className="bg-[#fbf3e4] text-brand-graphite px-4 py-2.5 rounded-lg font-label-md text-xs uppercase tracking-wider hover:bg-white transition-colors font-bold shadow-sm">
                Draft Strategy Memo
              </button>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/40 overflow-hidden">
          <div className="p-6 border-b border-surface-container-high bg-brand-sand-container/30">
            <h3 className="font-headline-lg text-[22px] text-on-surface">Training Demand & Recommended Action</h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">System-generated interventions based on gap severity.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f5eddf]/60 border-b border-surface-container-high">
                  <th className="py-3 px-6 font-label-md text-xs text-on-surface-variant uppercase tracking-wider w-1/4 font-bold">Skill Domain</th>
                  <th className="py-3 px-6 font-label-md text-xs text-on-surface-variant uppercase tracking-wider w-1/4 font-bold">Severity</th>
                  <th className="py-3 px-6 font-label-md text-xs text-on-surface-variant uppercase tracking-wider w-1/2 font-bold">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high/60 bg-surface-container-lowest text-on-surface font-body-md text-sm">
                <tr className="hover:bg-[#fbf3e4]/20 transition-colors">
                  <td className="py-4 px-6 font-bold text-on-surface text-[15px]">GIS</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#fceddf] border border-[#C86B45]/40 font-label-md text-xs text-[#C86B45] uppercase font-bold tracking-wider">
                      High
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-brand-teal text-[20px]">group_add</span>
                      <span className="font-medium text-on-surface">Create Targeted Capacity Building Cohort</span>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-[#fbf3e4]/20 transition-colors bg-[#f5eddf]/15">
                  <td className="py-4 px-6 font-bold text-on-surface text-[15px]">AI/ML</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#fde8e7] border border-error/40 font-label-md text-xs text-error uppercase font-bold tracking-wider">
                      Critical
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-brand-teal text-[20px]">school</span>
                      <span className="font-medium text-on-surface">Mandatory External Certification Program</span>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-[#fbf3e4]/20 transition-colors">
                  <td className="py-4 px-6 font-bold text-on-surface text-[15px]">Python</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#fbf3dc] border border-[#D99A2B]/40 font-label-md text-xs text-[#D99A2B] uppercase font-bold tracking-wider">
                      Medium
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-[20px]">route</span>
                      <span className="font-medium text-on-surface">iGOT Path Assignment</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3.5 bg-[#fbf3e4]/30 border-t border-surface-container-high flex justify-center">
            <button className="font-label-md text-xs text-brand-graphite font-bold uppercase tracking-wider hover:text-brand-teal flex items-center gap-1.5 transition-colors">
              View Full Intervention Matrix <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
