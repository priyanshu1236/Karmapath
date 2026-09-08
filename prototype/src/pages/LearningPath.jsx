export default function LearningPath() {
  return (
    <div className="flex flex-col w-full relative">
      <div className="px-10 py-8 bg-[#fbf3e4] border-b border-[#eae2d4]">
        <div className="flex items-start justify-between max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <h2 className="font-headline-lg font-normal text-headline-lg text-[#1f2421] mb-2 tracking-tight">Your Optimal Learning Path</h2>
            <p className="font-body-md text-body-md text-secondary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#176B67]">route</span>
              Optimized to address GIS Competency Gap
            </p>
            <div className="mt-4 bg-[#f5eddf] border border-[#e2dfd9] p-4 rounded-lg flex items-start gap-3 shadow-xs">
              <span className="material-symbols-outlined text-[#176B67] text-[22px] shrink-0 mt-0.5">info</span>
              <p className="font-body-md text-[14px] leading-relaxed text-[#1f1b13]">This path is optimized to reduce your highest-priority competency gap while considering prerequisites, role relevance, and learning effort.</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-4">
            <div className="bg-white px-5 py-3 rounded-lg flex flex-col items-end border border-[#e2dfd9] shadow-sm">
              <span className="font-label-md text-[11px] uppercase tracking-wider text-secondary font-semibold mb-1">Current vs Target</span>
              <div className="flex items-center gap-2">
                <span className="font-headline-lg text-[28px] text-[#1f2421]">34</span>
                <span className="material-symbols-outlined text-[#176B67] text-[20px]">arrow_forward</span>
                <span className="font-headline-lg text-[28px] text-[#176B67]">80</span>
                <span className="font-label-md text-[13px] text-secondary font-medium ml-1">pts</span>
              </div>
            </div>
            <button className="bg-[#1f2421] text-[#fff8f0] px-6 py-2.5 rounded-lg font-label-md text-[13px] uppercase tracking-wider hover:bg-[#333a35] transition-all flex items-center gap-2 shadow-sm font-semibold">
              Start Next Step
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
            </button>
          </div>
        </div>
      </div>
      <div className="px-10 py-12">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#dfd9d1] transform -translate-x-1/2 -z-10"></div>
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex items-center justify-between group relative">
              <div className="w-5/12 text-right pr-10">
                <div className="bg-white p-5 rounded-xl border border-[#e2dfd9] shadow-sm transition-all group-hover:shadow-md group-hover:-translate-x-1">
                  <div className="flex items-center justify-end gap-2 mb-2">
                    <span className="bg-[#e2dfd9] text-[#1f2421] px-2 py-0.5 rounded font-label-md text-[11px] font-semibold tracking-wide">iGOT</span>
                    <span className="font-label-md text-[12px] uppercase text-secondary font-semibold tracking-wider">Step 01</span>
                  </div>
                  <h3 className="font-title-lg text-[18px] text-[#1f2421] font-bold mb-1.5 leading-snug">GIS Fundamentals</h3>
                  <p className="font-body-md text-[13px] leading-relaxed text-secondary mb-3">Establish core foundational knowledge of Geographic Information Systems concepts and terminology.</p>
                  <div className="flex items-center justify-end gap-1.5 font-label-md text-[12px] text-[#176B67] font-semibold">
                    <span className="material-symbols-outlined text-[16px]">schedule</span> 2h 10m
                  </div>
                </div>
              </div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#176B67] flex items-center justify-center shadow-md z-10 ring-4 ring-[#fff8f0]">
                <div className="w-3 h-3 rounded-full bg-[#fff8f0]"></div>
              </div>
              <div className="w-5/12 pl-10">
                <img className="w-full h-32 object-cover rounded-lg border border-[#e2dfd9] shadow-sm opacity-90 group-hover:opacity-100 transition-opacity" alt="GIS concept" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD8w4LKGuB4OnzJm2hWBEUeOQ7Iw0x3OaYQp1FS8nSRow4Wnc0M5WxXJtozciaufbNuC_PJaG2laIeeq4JegGzV0TgyefclSate_WUVc9BEpJei3JZeT5DUKekr3UAKyg-SLDkIvCsXdKNgwvJeCk2nk-nZ9ai4_Le5YIkmhxPyERhjrzYl4XKzICrW4QJ6W_qfB6_CZVNiyDTooO85y7MZ-nm1eMiXRK68twcE7oOsDvIqfJm7UM3zA"/>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex items-center justify-between group relative flex-row-reverse">
              <div className="w-5/12 text-left pl-10">
                <div className="bg-white p-5 rounded-xl border border-[#e2dfd9] shadow-sm transition-all group-hover:shadow-md group-hover:translate-x-1">
                  <div className="flex items-center justify-start gap-2 mb-2">
                    <span className="font-label-md text-[12px] uppercase text-secondary font-semibold tracking-wider">Step 02</span>
                    <span className="bg-[#e2dfd9] text-[#1f2421] px-2 py-0.5 rounded font-label-md text-[11px] font-semibold tracking-wide">iGOT</span>
                  </div>
                  <h3 className="font-title-lg text-[18px] text-[#1f2421] font-bold mb-1.5 leading-snug">GIS for Statistical Applications</h3>
                  <p className="font-body-md text-[13px] leading-relaxed text-secondary mb-3">Domain-focused training on applying GIS tools specifically for statistical analysis and census data.</p>
                  <div className="flex items-center justify-start gap-1.5 font-label-md text-[12px] text-secondary font-medium">
                    <span className="material-symbols-outlined text-[16px]">schedule</span> 3h 20m
                  </div>
                </div>
              </div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#f5eddf] flex items-center justify-center border-2 border-[#1f2421] z-10 ring-4 ring-[#fff8f0]">
                <span className="material-symbols-outlined text-[16px] text-[#1f2421]">lock</span>
              </div>
              <div className="w-5/12 pr-10 text-right">
                <img className="w-full h-32 object-cover rounded-lg border border-[#e2dfd9] shadow-sm opacity-70 grayscale group-hover:grayscale-0 transition-all ml-auto" alt="GIS applications" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApS2IH6QBpnQ4M8KeoxNLGL4VrYgdhG5CRw3W5Mwa4O1ubNu649r29RMXNq6b-ALewJjVcWM1P-wPzeCi4H56GjhXs-q6OO6LlWuOcJ1rFTi2pCKmTBMke2oyhW_ECUVQh5e8aDvDEm2CJh6FXJylE0qp5bvigbL_JiAmxNsVJ816FoHqQtHk5j6JLObMvqQXMmASka_h7JgYrbMvXXFhgAajmCjI4V9XnqbMC1M4l51uCHsQ_9A-x8w"/>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex items-center justify-between group relative">
              <div className="w-5/12 text-right pr-10">
                <div className="bg-white p-5 rounded-xl border border-[#e2dfd9] shadow-sm transition-all group-hover:shadow-md group-hover:-translate-x-1">
                  <div className="flex items-center justify-end gap-2 mb-2">
                    <span className="bg-[#176B67] text-white px-2 py-0.5 rounded font-label-md text-[11px] font-semibold flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">person_check</span> Instructor-led</span>
                    <span className="font-label-md text-[12px] uppercase text-secondary font-semibold tracking-wider">Step 03</span>
                  </div>
                  <h3 className="font-title-lg text-[18px] text-[#1f2421] font-bold mb-1.5 leading-snug">Spatial Data Analysis Workshop</h3>
                  <p className="font-body-md text-[13px] leading-relaxed text-secondary mb-3">An intensive deep dive conducted by NSSTA experts focusing on advanced spatial algorithms.</p>
                  <div className="flex items-center justify-end gap-2 font-label-md text-[12px] text-secondary">
                    <span className="bg-[#efe7d9] text-[#1f2421] px-2.5 py-1 rounded text-[11px] font-bold tracking-wider">NSSTA</span>
                  </div>
                </div>
              </div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#f5eddf] flex items-center justify-center border-2 border-[#1f2421] z-10 ring-4 ring-[#fff8f0]">
                <span className="material-symbols-outlined text-[16px] text-[#1f2421]">lock</span>
              </div>
              <div className="w-5/12 pl-10">
                <img className="w-full h-32 object-cover rounded-lg border border-[#e2dfd9] shadow-sm opacity-70 grayscale group-hover:grayscale-0 transition-all" alt="Workshop" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxmE3EcmElqMZwKWNFE_zzTLJkuUOxh-QN-9Evw9KQXr63tyvMJn2aSRnB33KSNiiX3_QiCK3y3HPeTkET8Przl8dgIxghmhCy4mZuW2A6oP6Rp0N9c2zcUk96MZ9Y3El-pB4AcqbnJAGew8mz8nNaR1sH9x7Mu-OSa3c5Nol4Oj4y9CCg5mwO-mrL8b20xzwUkrjmBh8TMn4a9S1vVaJb0iOsc782sufDi7D_VM4iKZgp_gIiZ-4NhA"/>
              </div>
            </div>
            {/* Step 4 */}
            <div className="flex items-center justify-between group relative flex-row-reverse">
              <div className="w-5/12 text-left pl-10">
                <div className="bg-[#fbf3e4] p-5 rounded-xl border-2 border-[#1f2421] shadow-md transition-all group-hover:translate-x-1">
                  <div className="flex items-center justify-start gap-2 mb-2">
                    <span className="font-label-md text-[11px] uppercase text-[#176B67] font-bold tracking-wider">Milestone</span>
                  </div>
                  <h3 className="font-headline-lg text-[22px] text-[#1f2421] mb-1.5 flex items-center gap-2">
                    Applied GIS Assessment
                    <span className="material-symbols-outlined text-[#176B67] text-[20px]">verified</span>
                  </h3>
                  <p className="font-body-md text-[13px] leading-relaxed text-secondary">Final validation of skills acquired throughout the learning path. Passing required to close the competency gap.</p>
                  <div className="mt-4 pt-2.5 border-t border-[#e2dfd9]">
                    <span className="font-label-md text-[12px] font-semibold text-[#1f2421]">Target Score: 80%</span>
                  </div>
                </div>
              </div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1f2421] flex items-center justify-center shadow-lg z-10 ring-4 ring-[#fff8f0]">
                <span className="material-symbols-outlined text-[20px] text-[#fff8f0]">military_tech</span>
              </div>
              <div className="w-5/12 pr-10 text-right">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
