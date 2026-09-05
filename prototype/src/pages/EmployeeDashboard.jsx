export default function EmployeeDashboard() {
  return (
    <div className="flex flex-col w-full p-8 gap-7 max-w-[1440px] mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between bg-surface-container-low border border-[#ded5c6] p-7 rounded-xl shadow-sm relative overflow-hidden">
        <div className="flex flex-col gap-1.5 max-w-2xl relative z-10">
          <span className="font-label-md text-xs uppercase tracking-widest text-teal-brand font-bold flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-teal-brand"></span> Officer Intelligence Portal
          </span>
          <h1 className="font-display-lg text-[32px] md:text-[38px] leading-tight text-primary font-normal">Good morning, Rahul Sharma</h1>
          <p className="font-body-md text-[15px] text-on-surface-variant leading-relaxed">Here is your current capability and recommended development path.</p>
        </div>
        <div className="flex flex-col gap-1 mt-3 md:mt-0 text-left md:text-right bg-surface/70 md:bg-transparent p-4 md:p-0 rounded-lg border md:border-none border-[#e4dcce] relative z-10">
          <span className="font-label-md text-[11px] text-teal-brand uppercase tracking-widest font-bold">Employee Profile</span>
          <p className="font-body-md text-[13.5px] font-semibold text-primary">Statistical Officer | Agricultural Statistics</p>
          <p className="font-body-md text-[13px] text-on-surface-variant">Assignment: Crop estimation and survey analysis.</p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-teal-brand/5 pointer-events-none"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-surface-container-lowest p-5 border border-[#ded5c6] rounded-xl flex flex-col justify-between h-[140px] relative overflow-hidden group hover:border-teal-brand/40 transition-all shadow-sm">
          <div className="flex items-center justify-between z-10 relative">
            <span className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold">Overall Competency</span>
            <span className="material-symbols-outlined text-teal-brand text-[22px]">verified</span>
          </div>
          <div className="flex items-baseline gap-2 z-10 relative">
            <span className="font-display-lg text-[36px] font-normal leading-none text-primary">64%</span>
          </div>
          <div className="flex items-center gap-1 text-[12px] text-teal-brand font-medium z-10 relative">
            <span>On standard track</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-brand/30 group-hover:bg-teal-brand transition-colors"></div>
        </div>
        <div className="bg-terracotta-container/80 p-5 border border-terracotta/30 rounded-xl flex flex-col justify-between h-[140px] relative overflow-hidden group hover:border-terracotta transition-all shadow-sm">
          <div className="flex items-center justify-between z-10 relative">
            <span className="font-label-md text-[11px] text-terracotta-dark uppercase tracking-widest font-bold">Highest Priority Gap</span>
            <span className="material-symbols-outlined text-terracotta text-[22px]">warning</span>
          </div>
          <div className="flex flex-col z-10 relative">
            <span className="font-display-lg text-[30px] font-normal leading-tight text-terracotta-dark">GIS</span>
            <span className="font-body-md text-[12.5px] font-medium text-terracotta-dark/90">46 pts gap to requirement</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-terracotta"></div>
        </div>
        <div className="bg-surface-container-lowest p-5 border border-[#ded5c6] rounded-xl flex flex-col justify-between h-[140px] relative overflow-hidden group hover:border-saffron/50 transition-all shadow-sm">
          <div className="flex items-center justify-between z-10 relative">
            <span className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold">Learning Progress</span>
            <span className="material-symbols-outlined text-saffron text-[22px]">trending_up</span>
          </div>
          <div className="flex flex-col z-10 relative">
            <span className="font-display-lg text-[30px] font-normal leading-tight text-primary">3 Active</span>
            <span className="font-body-md text-[12px] text-on-surface-variant">Interventions currently underway</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-saffron/30 group-hover:bg-saffron transition-colors"></div>
        </div>
        <div className="bg-surface-container-lowest p-5 border border-[#ded5c6] rounded-xl flex flex-col justify-between h-[140px] relative overflow-hidden group hover:border-plum/40 transition-all shadow-sm">
          <div className="flex items-center justify-between z-10 relative">
            <span className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold">Competency Confidence</span>
            <span className="material-symbols-outlined text-plum text-[22px]">psychology</span>
          </div>
          <div className="flex items-baseline gap-2 z-10 relative">
            <span className="font-display-lg text-[34px] font-normal leading-none text-primary">78%</span>
            <span className="font-label-md text-[11px] font-bold text-teal-brand uppercase tracking-widest">(High)</span>
          </div>
          <div className="flex items-center gap-1 text-[12px] text-on-surface-variant z-10 relative">
            <span>Evaluated from 4 assessments</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-plum/30 group-hover:bg-plum transition-colors"></div>
        </div>
      </div>
      <div className="bg-surface-container-lowest p-7 border border-[#ded5c6] rounded-xl flex flex-col gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#ece4d6]">
          <div>
            <h2 className="font-display-md text-[26px] font-normal text-primary">Your Competency Profile</h2>
            <p className="font-body-md text-[13px] text-on-surface-variant mt-0.5">Live benchmark of your verified proficiencies against department requirements</p>
          </div>
          <button className="px-5 py-2.5 bg-primary text-surface-bright font-label-md text-[13px] rounded-lg shadow-sm hover:bg-[#2b3530] transition-colors flex items-center justify-center gap-2 self-start sm:self-auto font-medium">
            <span className="material-symbols-outlined text-[18px]">explore</span>
            Explore Learning Paths
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-md text-on-surface border-collapse">
            <thead>
              <tr className="border-b-2 border-primary bg-surface-container-low/40">
                <th className="py-3 px-4 font-label-md text-[11.5px] text-on-surface-variant uppercase tracking-widest font-semibold">Skill Area</th>
                <th className="py-3 px-4 font-label-md text-[11.5px] text-on-surface-variant uppercase tracking-widest font-semibold w-5/12">Capability vs Required (80)</th>
                <th className="py-3 px-4 font-label-md text-[11.5px] text-on-surface-variant uppercase tracking-widest font-semibold text-center">Gap</th>
                <th className="py-3 px-4 font-label-md text-[11.5px] text-on-surface-variant uppercase tracking-widest font-semibold text-center">Confidence</th>
                <th className="py-3 px-4 font-label-md text-[11.5px] text-on-surface-variant uppercase tracking-widest font-semibold text-right">Priority Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ece4d6]">
              <tr className="hover:bg-surface-container-low/60 transition-colors group">
                <td className="py-4 px-4 font-display-md text-[19px] text-primary group-hover:text-terracotta transition-colors font-normal">GIS</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3 w-full">
                    <span className="font-mono-data text-[13px] text-on-surface-variant w-7 text-right font-medium">34</span>
                    <div className="flex-1 h-2.5 bg-[#ede4d7] rounded-full overflow-hidden flex">
                      <div className="bg-terracotta h-full rounded-l-full" style={{ width: '34%' }}></div>
                      <div className="bg-terracotta-container h-full" style={{ width: '46%' }}></div>
                    </div>
                    <span className="font-mono-data text-[11px] text-on-surface-variant/70">80</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center font-mono-data text-[13.5px] text-terracotta font-bold">46 pts</td>
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center justify-center bg-surface-container-high px-2.5 py-1 rounded text-label-md text-[12px] text-on-surface font-medium">63%</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-terracotta-container text-terracotta-dark border border-terracotta/30 font-label-md text-[11px] uppercase tracking-wider font-bold whitespace-nowrap">
                    High Priority
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low/60 transition-colors group">
                <td className="py-4 px-4 font-display-md text-[19px] text-primary group-hover:text-saffron-dark transition-colors font-normal">Python</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3 w-full">
                    <span className="font-mono-data text-[13px] text-on-surface-variant w-7 text-right font-medium">58</span>
                    <div className="flex-1 h-2.5 bg-[#ede4d7] rounded-full overflow-hidden flex">
                      <div className="bg-saffron h-full rounded-l-full" style={{ width: '58%' }}></div>
                      <div className="bg-saffron-container h-full" style={{ width: '22%' }}></div>
                    </div>
                    <span className="font-mono-data text-[11px] text-on-surface-variant/70">80</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center font-mono-data text-[13.5px] text-saffron-dark font-bold">22 pts</td>
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center justify-center bg-surface-container-high px-2.5 py-1 rounded text-label-md text-[12px] text-on-surface font-medium">91%</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-saffron-container text-saffron-dark border border-saffron/40 font-label-md text-[11px] uppercase tracking-wider font-bold whitespace-nowrap">
                    Priority
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low/60 transition-colors group">
                <td className="py-4 px-4 font-display-md text-[19px] text-primary group-hover:text-teal-brand transition-colors font-normal">Sampling</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3 w-full">
                    <span className="font-mono-data text-[13px] text-on-surface-variant w-7 text-right font-medium">85</span>
                    <div className="flex-1 h-2.5 bg-[#ede4d7] rounded-full overflow-hidden flex">
                      <div className="bg-teal-brand h-full rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="font-mono-data text-[11px] text-on-surface-variant/70">80</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center font-mono-data text-[13.5px] text-teal-brand font-bold">0 pts</td>
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center justify-center bg-surface-container-high px-2.5 py-1 rounded text-label-md text-[12px] text-on-surface font-medium">95%</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal-brand-container text-teal-brand-dark border border-teal-brand/30 font-label-md text-[11px] uppercase tracking-wider font-bold whitespace-nowrap">
                    Competent
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low/60 transition-colors group">
                <td className="py-4 px-4 font-display-md text-[19px] text-primary group-hover:text-plum transition-colors font-normal">Data Visualization</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3 w-full">
                    <span className="font-mono-data text-[13px] text-on-surface-variant w-7 text-right font-medium">71</span>
                    <div className="flex-1 h-2.5 bg-[#ede4d7] rounded-full overflow-hidden flex">
                      <div className="bg-plum h-full rounded-l-full" style={{ width: '71%' }}></div>
                      <div className="bg-plum-container h-full" style={{ width: '9%' }}></div>
                    </div>
                    <span className="font-mono-data text-[11px] text-on-surface-variant/70">80</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center font-mono-data text-[13.5px] text-plum font-bold">9 pts</td>
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center justify-center bg-surface-container-high px-2.5 py-1 rounded text-label-md text-[12px] text-on-surface font-medium">88%</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-plum-container text-plum-dark border border-plum/30 font-label-md text-[11px] uppercase tracking-wider font-bold whitespace-nowrap">
                    Developing
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
