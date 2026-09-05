export default function AiAssessment() {
  return (
    <div className="flex flex-col w-full p-8 max-w-7xl mx-auto gap-8">
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display-md text-headline-lg md:text-[34px] text-on-surface tracking-tight">AI-Generated Quiz Review</h2>
        <p className="font-body-lg text-body-md md:text-body-lg text-on-surface-variant">Review and approve questions generated from the GIS manual for the upcoming assessment.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 flex flex-col gap-6">
          <div className="bg-surface-container rounded-xl p-8 flex flex-col gap-6 border border-outline-variant/40 shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[20px]">quiz</span></div>
                <h3 className="font-headline-lg text-[22px] text-on-surface">Question 1 of 5</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-graphite text-white px-3 py-1 rounded-full font-label-md text-[12px] tracking-wide">Apply</span>
                <span className="bg-surface-container-highest text-on-surface font-medium px-3 py-1 rounded-full font-label-md text-[12px]">Sampling Design</span>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <p className="font-body-lg text-[16px] leading-relaxed text-on-surface font-medium">Which sampling approach is most appropriate for crop estimation in a district with highly diverse agricultural zones?</p>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/70 hover:bg-surface-container-high/60 transition-colors cursor-pointer group">
                  <input className="w-4 h-4 text-brand-teal bg-surface border-outline focus:ring-brand-teal focus:ring-2" name="q1" type="radio" value="Simple Random"/>
                  <span className="font-body-md text-on-surface group-hover:text-primary transition-colors text-[15px]">A) Simple Random</span>
                </label>
                <label className="flex items-center gap-4 p-4 rounded-lg bg-brand-teal-light/70 border-2 border-brand-teal relative cursor-pointer group shadow-sm">
                  <div className="absolute inset-y-0 left-0 w-1.5 bg-brand-teal rounded-l-lg"></div>
                  <input defaultChecked className="w-4 h-4 text-brand-teal bg-white border-brand-teal focus:ring-brand-teal focus:ring-2" name="q1" type="radio" value="Stratified"/>
                  <span className="font-body-md text-on-surface font-bold text-[15px]">B) Stratified</span>
                  <span className="ml-auto material-symbols-outlined text-brand-teal text-[22px]">check_circle</span>
                </label>
                <label className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/70 hover:bg-surface-container-high/60 transition-colors cursor-pointer group">
                  <input className="w-4 h-4 text-brand-teal bg-surface border-outline focus:ring-brand-teal focus:ring-2" name="q1" type="radio" value="Systematic"/>
                  <span className="font-body-md text-on-surface group-hover:text-primary transition-colors text-[15px]">C) Systematic</span>
                </label>
                <label className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/70 hover:bg-surface-container-high/60 transition-colors cursor-pointer group">
                  <input className="w-4 h-4 text-brand-teal bg-surface border-outline focus:ring-brand-teal focus:ring-2" name="q1" type="radio" value="Cluster"/>
                  <span className="font-body-md text-on-surface group-hover:text-primary transition-colors text-[15px]">D) Cluster</span>
                </label>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-lg flex items-start gap-3.5 border border-outline-variant/50">
              <span className="material-symbols-outlined text-brand-teal mt-0.5 text-[20px]">info</span>
              <div className="flex flex-col gap-1">
                <span className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold">Concept Alignment</span>
                <p className="font-body-md text-on-surface text-[14px]">Tests understanding of Stratified Sampling application in varied terrains.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button className="px-5 py-2.5 rounded-lg border border-outline/50 bg-surface-container-lowest text-on-surface font-label-md text-[13px] font-semibold hover:bg-surface-container-high transition-colors shadow-sm">Regenerate</button>
              <button className="px-5 py-2.5 rounded-lg bg-graphite text-white font-label-md text-[13px] font-semibold hover:bg-primary transition-colors shadow-sm">Approve Question</button>
            </div>
          </div>
        </div>
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container rounded-xl p-6 flex flex-col gap-6 border border-outline-variant/40 shadow-sm">
            <h3 className="font-headline-lg text-[20px] text-on-surface border-b border-outline-variant/60 pb-3">Quality Control</h3>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center font-body-md text-[14px]">
                  <span className="text-on-surface-variant font-medium">Source Grounding</span>
                  <span className="font-label-md text-brand-teal font-bold">96%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2">
                  <div className="bg-brand-teal h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center font-body-md text-[14px]">
                  <span className="text-on-surface-variant font-medium">Answer Confidence</span>
                  <span className="font-label-md text-brand-teal font-bold">94%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2">
                  <div className="bg-brand-teal h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/60">
              <div className="flex flex-col gap-1">
                <span className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Ambiguity</span>
                <span className="font-body-md text-on-surface flex items-center gap-1.5 font-medium text-[14px]"><span className="w-2 h-2 rounded-full bg-brand-teal"></span> Low</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Human Review</span>
                <span className="font-body-md text-on-surface flex items-center gap-1.5 font-medium text-[14px]"><span className="w-2 h-2 rounded-full bg-brand-teal"></span> Not Required</span>
              </div>
            </div>
            <div className="bg-surface-container-highest/90 p-4 rounded-lg flex items-start gap-3 mt-1 border border-outline-variant/40">
              <span className="material-symbols-outlined text-brand-teal mt-0.5 text-[20px]">menu_book</span>
              <div className="flex flex-col gap-1">
                <span className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold">Source Material</span>
                <p className="font-body-md text-on-surface text-[14px] font-medium">GIS Manual, Page 17</p>
                <button className="text-brand-teal text-label-md font-semibold self-start mt-1 hover:underline flex items-center gap-1 text-[13px]">View Excerpt <span className="material-symbols-outlined text-[15px]">open_in_new</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
