import { useEffect } from 'react';

export default function Courses() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const bars = document.querySelectorAll('[data-target-width]');
      bars.forEach(bar => {
        bar.style.width = bar.getAttribute('data-target-width');
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col w-full max-w-[1360px] mx-auto px-lg py-xl">
      <div className="flex flex-col gap-sm mb-xl">
        <h2 className="font-display text-display text-primary tracking-tight">Recommended Interventions</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">Targeted learning paths curated based on your current skill profile, role requirements, and upcoming departmental assignments.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Main Recommendation */}
        <div className="lg:col-span-8 flex flex-col gap-lg">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-lg relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#176B67]/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>
            <div className="flex flex-col md:flex-row gap-lg mb-lg">
              <div className="w-full md:w-1/3 rounded-lg overflow-hidden shrink-0 shadow-sm relative border border-outline-variant/40">
                <div className="absolute top-sm left-sm bg-[#176B67] text-white px-sm py-xs rounded font-label-md text-[11px] uppercase tracking-wider z-10 flex items-center gap-xs shadow-sm">
                  <span className="material-symbols-outlined text-[15px]">stars</span> Top Match
                </div>
                <div className="w-full aspect-video md:aspect-square bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCfk3fiHRN82ln73lusDj7pKs5ZgmI4dnWqtzmzfzeRNyX4S7b-DinwYY0OqKjtA75e2XD5mm4269OpSiLqhKMx8L6FJqDzH-meFTX3p306oCYUsO5C5LniEyeb7ie00x3_tUnSEmMjZEEQDo52aa5apDGXWCLjSWuzMusrXQGjYj7fowiTu0ycMokEmZPeH8HMFU3eOkNMLmjoDoSSgEASQA33_COac64rcKerW-n1ZeMWhxVdEJ7ceA')" }}></div>
              </div>
              <div className="flex flex-col flex-1 gap-sm justify-center">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-label-md text-[11px] font-bold text-[#176B67] tracking-widest uppercase mb-xs block">iGOT Karmayogi</span>
                    <h3 className="font-headline-lg text-headline-lg text-primary leading-tight">GIS Fundamentals</h3>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-display text-display text-[#176B67] leading-none">94%</span>
                    <span className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-wider mt-1">Overall Match</span>
                  </div>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mt-sm line-clamp-3">
                  This comprehensive course introduces geographic concepts and the tools used to analyze spatial data. It directly addresses your identified gap in spatial analysis required for upcoming district-level demographic surveys.
                </p>
                <div className="flex gap-sm mt-auto pt-md">
                  <span className="bg-surface-container text-on-surface px-sm py-xs rounded font-label-md text-mono-data border border-outline-variant/40">Duration: 12 hrs</span>
                  <span className="bg-surface-container text-on-surface px-sm py-xs rounded font-label-md text-mono-data border border-outline-variant/40">Level: Intermediate</span>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-lg p-md mb-lg border border-[#e8dfd0]">
              <h4 className="font-headline-md text-headline-md text-primary mb-md">Why was this recommended?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-sm gap-x-lg">
                <div className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-[#176B67] mt-xs text-[20px] shrink-0">check_circle</span>
                  <p className="font-body-md text-body-md text-on-surface">Directly covers your <strong>Spatial Analysis</strong> skill gap identified in last assessment.</p>
                </div>
                <div className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-[#176B67] mt-xs text-[20px] shrink-0">check_circle</span>
                  <p className="font-body-md text-body-md text-on-surface">Highly relevant to your upcoming assignment: <strong>District Resource Mapping Project</strong>.</p>
                </div>
                <div className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-[#176B67] mt-xs text-[20px] shrink-0">check_circle</span>
                  <p className="font-body-md text-body-md text-on-surface">Matches your current proficiency level (Level 2 out of 5).</p>
                </div>
                <div className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-[#176B67] mt-xs text-[20px] shrink-0">check_circle</span>
                  <p className="font-body-md text-body-md text-on-surface">All prerequisite competencies (Basic Statistics, Data Handling) are met.</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-headline-md text-headline-md text-primary mb-md">Recommendation Breakdown</h4>
              <div className="space-y-md">
                <div className="flex flex-col gap-xs group/bar">
                  <div className="flex justify-between items-end">
                    <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold">Skill Match</span>
                    <span className="font-mono-data text-mono-data text-on-surface-variant transition-colors group-hover/bar:text-[#176B67]">98%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" data-target-width="98%" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-xs group/bar">
                  <div className="flex justify-between items-end">
                    <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold">Role Relevance</span>
                    <span className="font-mono-data text-mono-data text-on-surface-variant transition-colors group-hover/bar:text-[#176B67]">90%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out delay-100" data-target-width="90%" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-xs group/bar">
                  <div className="flex justify-between items-end">
                    <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold">Task Relevance</span>
                    <span className="font-mono-data text-mono-data text-on-surface-variant transition-colors group-hover/bar:text-[#176B67]">85%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full transition-all duration-1000 ease-out delay-200" data-target-width="85%" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-xs group/bar">
                  <div className="flex justify-between items-end">
                    <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold">Difficulty Fit</span>
                    <span className="font-mono-data text-mono-data text-on-surface-variant transition-colors group-hover/bar:text-[#176B67]">100%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-[#176B67] rounded-full transition-all duration-1000 ease-out delay-300" data-target-width="100%" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-xs group/bar">
                  <div className="flex justify-between items-end">
                    <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold">Prerequisite Fit</span>
                    <span className="font-mono-data text-mono-data text-on-surface-variant transition-colors group-hover/bar:text-[#176B67]">100%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-[#176B67] rounded-full transition-all duration-1000 ease-out delay-400" data-target-width="100%" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-lg pt-md border-t border-outline-variant/40 flex justify-end gap-md">
              <button className="px-lg py-sm rounded border border-outline text-on-surface font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container transition-colors">View Syllabus</button>
              <button className="px-lg py-sm rounded bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-[#2d3531] transition-colors shadow-sm flex items-center gap-sm">
                Enroll Now <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
        {/* Sidebar Recommendations */}
        <div className="lg:col-span-4 flex flex-col gap-md">
          <h3 className="font-headline-md text-headline-md text-primary mb-sm flex items-center gap-sm">
            <span className="material-symbols-outlined text-[#176B67]">explore</span> Secondary Options
          </h3>
          {/* Secondary Course 1 */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-md hover:shadow-md hover:border-outline transition-all group cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-[#176B67]/0 group-hover:bg-[#176B67]/5 transition-colors duration-300"></div>
            <div className="flex justify-between items-start mb-sm relative z-10">
              <div>
                <span className="font-label-md text-[11px] text-secondary tracking-widest uppercase block mb-xs">Coursera</span>
                <h4 className="font-title-lg text-title-lg font-bold text-on-surface leading-tight">Python for Data Analysis</h4>
              </div>
              <div className="bg-surface-container px-sm py-xs rounded flex flex-col items-center border border-outline-variant/40">
                <span className="font-mono-data text-mono-data text-on-surface font-bold">82%</span>
                <span className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wider">Match</span>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-md relative z-10">
              Focuses on pandas, NumPy, and basic data visualization. Good alternative if you prefer programmatic analysis over specialized GIS tools.
            </p>
            <div className="flex gap-xs flex-wrap relative z-10">
              <span className="bg-surface-container text-on-surface-variant px-sm py-xs rounded font-label-md text-[10px] uppercase tracking-wider border border-outline-variant/30">Data Analytics Gap</span>
              <span className="bg-surface-container text-on-surface-variant px-sm py-xs rounded font-label-md text-[10px] uppercase tracking-wider border border-outline-variant/30">30 hrs</span>
            </div>
          </div>
          {/* Secondary Course 2 */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-md hover:shadow-md hover:border-outline transition-all group cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-[#176B67]/0 group-hover:bg-[#176B67]/5 transition-colors duration-300"></div>
            <div className="flex justify-between items-start mb-sm relative z-10">
              <div>
                <span className="font-label-md text-[11px] text-secondary tracking-widest uppercase block mb-xs">Internal Workshop</span>
                <h4 className="font-title-lg text-title-lg font-bold text-on-surface leading-tight">Advanced Sampling Methods</h4>
              </div>
              <div className="bg-surface-container px-sm py-xs rounded flex flex-col items-center border border-outline-variant/40">
                <span className="font-mono-data text-mono-data text-on-surface font-bold">78%</span>
                <span className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wider">Match</span>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-md relative z-10">
              In-person workshop focusing on stratifed sampling techniques for large-scale demographic surveys.
            </p>
            <div className="flex gap-xs flex-wrap relative z-10">
              <span className="bg-surface-container text-on-surface-variant px-sm py-xs rounded font-label-md text-[10px] uppercase tracking-wider border border-outline-variant/30">Methodology Gap</span>
              <span className="bg-surface-container text-on-surface-variant px-sm py-xs rounded font-label-md text-[10px] uppercase tracking-wider border border-outline-variant/30">Next Month</span>
            </div>
          </div>
          <div className="mt-md p-md bg-[#1f2421] text-[#fff8f0] rounded-xl shadow-sm border border-[#2e3632]">
            <div className="flex items-center gap-xs mb-sm">
              <span className="material-symbols-outlined text-[#176B67] text-[20px]">lightbulb</span>
              <h4 className="font-title-lg text-[16px] font-bold text-[#fff8f0]">Learning Tip</h4>
            </div>
            <p className="font-body-md text-[14px] text-[#dfd9d1] leading-relaxed">Completing courses directly linked to identified skill gaps increases your mobility score for upcoming project allocations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
