export default function MyCompetencies() {
  return (
    <div className="flex flex-col w-full">
      <div className="px-10 py-10 space-y-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-2 border-primary-container pb-5 relative">
          <div className="space-y-2">
            <span className="font-label-md text-[11px] text-secondary font-semibold uppercase tracking-widest bg-[#eae2d4] px-2.5 py-1 rounded">C-094</span>
            <h1 className="font-display-lg text-[40px] md:text-[46px] text-primary tracking-tight leading-none uppercase">GIS Competency Detail</h1>
            <p className="font-body-md text-on-surface-variant max-w-2xl text-[15px] pt-1">Detailed diagnostic breakdown of Geographic Information Systems capability against Official Statistics requirements.</p>
          </div>
          <div className="flex items-center gap-2 bg-[#f5eddf] border border-[#eae2d4] px-3.5 py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-deep-teal text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>policy</span>
            <span className="font-label-md text-[12px] font-bold text-primary tracking-wider uppercase">Official Priority Skill</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#f5eddf] border border-[#eae2d4] rounded-lg p-6 flex flex-col justify-between h-full hover:bg-[#eae2d4] transition-colors duration-200">
            <span className="font-label-md text-[12px] text-secondary uppercase tracking-wider font-semibold">Current Level</span>
            <div className="flex items-baseline gap-1 mt-3">
              <span className="font-title-lg text-[48px] font-extrabold text-primary leading-none">34</span>
              <span className="font-body-md text-secondary text-[16px]">/100</span>
            </div>
          </div>
          <div className="bg-[#f5eddf] border border-[#eae2d4] rounded-lg p-6 flex flex-col justify-between h-full hover:bg-[#eae2d4] transition-colors duration-200">
            <span className="font-label-md text-[12px] text-secondary uppercase tracking-wider font-semibold">Target Required</span>
            <div className="flex items-baseline gap-1 mt-3">
              <span className="font-title-lg text-[48px] font-extrabold text-primary leading-none">80</span>
              <span className="font-body-md text-secondary text-[16px]">/100</span>
            </div>
          </div>
          <div className="bg-[#fdf0ea] border border-[#f4c8b6] rounded-lg p-6 flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute right-[-10px] bottom-[-10px] opacity-10 pointer-events-none">
              <svg className="text-[#C86B45]" fill="currentColor" height="110" viewBox="0 0 24 24" width="110"><path d="M12 2L1 21h22M12 6l7.5 13h-15M11 10v4h2v-4M11 16v2h2v-2"></path></svg>
            </div>
            <span className="font-label-md text-[12px] text-[#C86B45] uppercase tracking-wider font-bold z-10">Identified Gap</span>
            <div className="flex items-baseline gap-1.5 mt-3 z-10">
              <span className="font-title-lg text-[48px] font-extrabold text-[#C86B45] leading-none">-46</span>
              <span className="font-body-md text-[#C86B45] text-[18px] font-semibold">pts</span>
            </div>
          </div>
          <div className="bg-primary-container text-[#fff8f0] rounded-lg p-6 flex flex-col justify-between h-full shadow-sm">
            <span className="font-label-md text-[12px] text-[#b6cbc8] uppercase tracking-wider font-semibold">Data Confidence</span>
            <div className="flex items-baseline gap-1 mt-3">
              <span className="font-title-lg text-[48px] font-extrabold text-[#fff8f0] leading-none">63</span>
              <span className="font-body-md text-[#b6cbc8] text-[18px]">%</span>
            </div>
            <div className="w-full bg-[#353d38] h-1.5 mt-4 rounded-full overflow-hidden">
              <div className="bg-deep-teal h-full rounded-full" style={{ width: '63%' }}></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          <div className="lg:col-span-2 space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#eae2d4] flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">priority_high</span>
                </div>
                <h2 className="font-headline-lg text-[26px] md:text-[28px] text-primary">Why is GIS a priority?</h2>
              </div>
              <div className="bg-[#f5eddf] border border-[#eae2d4] rounded-lg p-6 flex flex-col md:flex-row gap-6">
                <div className="md:w-5/12 flex-shrink-0">
                  <div className="bg-cover bg-center w-full h-52 rounded-lg border border-[#eae2d4] filter grayscale contrast-125" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB_UTrQOViX55vOrIMvfdLNQg-our-l_RiideXKwqzhYdSTEqgvKxHLQxZHTk5wn6IFtaWytuNsaZ3e8CH12MpxNRI3U2mQ1gQzCQzhIlg0DJcAjMQgdhYsLSHPtROqpYeRjboHDzbh1wGL_9f2-BDTdYLqDa_TBTLvYda6s3e2rZhJJqa32Dlfy5G12KU19134snsVSHs7idvm7AAiWhol6hZPseq1B7SOkopi0UZ1ujiJ8s32tJUVwA')" }}></div>
                </div>
                <div className="md:w-7/12 space-y-4">
                  <p className="font-body-md text-[14px] text-on-surface-variant leading-relaxed">Geographic Information Systems (GIS) competency is critical for modernizing data collection and analysis within Official Statistics. The identified gap directly impacts the execution of key institutional functions.</p>
                  <div className="space-y-2 pt-2 border-t border-[#eae2d4]">
                    <h3 className="font-label-md text-[12px] text-primary uppercase font-bold tracking-wider">Directly Affected Tasks:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[#C86B45] text-[18px] mt-0.5">warning</span>
                        <span className="font-body-md text-[14px] text-on-surface">Spatial crop estimation and yield modeling</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[#C86B45] text-[18px] mt-0.5">warning</span>
                        <span className="font-body-md text-[14px] text-on-surface">Geographic visualization of demographic data</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[#C86B45] text-[18px] mt-0.5">warning</span>
                        <span className="font-body-md text-[14px] text-on-surface">Regional disparity analysis and boundary definition</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#eae2d4] flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">troubleshoot</span>
                </div>
                <h2 className="font-headline-lg text-[26px] md:text-[28px] text-primary">Gap Type Analysis</h2>
              </div>
              <div className="relative p-6 bg-[#fff8f0] border border-[#eae2d4] border-l-4 border-l-[#C86B45] rounded-lg flex flex-col md:flex-row gap-6 items-center shadow-sm">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-[11px] font-bold text-[#C86B45] bg-[#fdf0ea] border border-[#f4c8b6] px-2.5 py-0.5 rounded tracking-wide">CRITICAL FINDING</span>
                  </div>
                  <h3 className="font-title-lg text-[18px] font-bold text-on-surface">Context Gap Identified</h3>
                  <p className="font-body-md text-[14px] text-on-surface-variant leading-relaxed">
                    Analysis indicates theoretical knowledge exists, but practical application is lacking in specific institutional contexts. Current evidence suggests limited demonstrated ability to apply GIS specifically to Official Statistical frameworks, particularly concerning the rigors of Crop Estimation methodologies.
                  </p>
                </div>
                <div className="w-32 h-32 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle className="text-[#eae2d4]" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                    <circle className="text-[#C86B45]" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="135.6" strokeLinecap="round" strokeWidth="8"></circle>
                    <text className="font-title-lg text-[18px] fill-[#C86B45] font-extrabold" dominantBaseline="middle" textAnchor="middle" transform="rotate(90 50 50)" x="50" y="50">46%</text>
                  </svg>
                </div>
              </div>
            </section>
          </div>
          <div className="space-y-8">
            <section className="bg-[#f5eddf] border border-[#eae2d4] rounded-lg p-6 space-y-4">
              <div className="border-b border-[#eae2d4] pb-3">
                <h2 className="font-headline-lg text-[22px] text-primary leading-tight">Evidence Inventory</h2>
                <p className="font-label-md text-[11px] text-secondary uppercase tracking-widest mt-1">The "Why" behind the score</p>
              </div>
              <ul className="space-y-2.5 mt-4">
                <li className="flex items-center justify-between p-3 bg-[#fff8f0] border border-[#eae2d4] rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#176B67] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <span className="font-body-md text-[14px] text-on-surface font-medium">Profile History</span>
                  </div>
                  <span className="font-label-md text-[11px] text-[#176B67] bg-[#e7f3f2] font-bold px-2 py-0.5 rounded">Verified</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-[#fff8f0] border border-[#eae2d4] rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#176B67] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <span className="font-body-md text-[14px] text-on-surface font-medium">Prev. Training (NSSTA '23)</span>
                  </div>
                  <span className="font-label-md text-[11px] text-[#176B67] bg-[#e7f3f2] font-bold px-2 py-0.5 rounded">Verified</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-[#fff8f0] border border-[#eae2d4] rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#176B67] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <span className="font-body-md text-[14px] text-on-surface font-medium">Diagnostic (Jan 2024)</span>
                  </div>
                  <span className="font-label-md text-[11px] text-[#176B67] bg-[#e7f3f2] font-bold px-2 py-0.5 rounded">Verified</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-[#fff8f0] border border-[#eae2d4] border-l-4 border-l-secondary rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-[20px]">person</span>
                    <span className="font-body-md text-[14px] text-on-surface font-medium">Self-attestation</span>
                  </div>
                  <span className="font-label-md text-[11px] text-secondary bg-[#eae2d4] font-bold px-2 py-0.5 rounded">Self</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-[#fff8f0] border border-[#f4c8b6] border-l-4 border-l-[#C86B45] rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#C86B45] text-[20px]">cancel</span>
                    <span className="font-body-md text-[14px] text-on-surface font-medium">Practical App Task</span>
                  </div>
                  <span className="font-label-md text-[11px] text-[#C86B45] bg-[#fdf0ea] font-bold px-2 py-0.5 rounded">Missing</span>
                </li>
              </ul>
            </section>
            <section className="bg-primary-container text-[#fff8f0] rounded-lg p-6 space-y-4 shadow-sm border border-[#333834]">
              <div className="flex items-center justify-between border-b border-[#353d38] pb-3">
                <h2 className="font-headline-lg text-[22px] text-[#fff8f0] leading-tight">Confidence Analysis</h2>
                <span className="font-title-lg text-[20px] font-bold text-[#176B67] bg-[#e7f3f2] px-2 py-0.5 rounded">63%</span>
              </div>
              <div className="space-y-4">
                <p className="font-body-md text-[14px] text-[#e2dfd9] leading-relaxed">
                  The current confidence score of 63% reflects a reliance on theoretical assessments and historical training data.
                </p>
                <div className="bg-[#2a302c] p-4 rounded-lg border-l-4 border-deep-teal space-y-1.5">
                  <p className="font-label-md text-[11px] text-[#176B67] uppercase tracking-wider font-bold">Requirement to increase confidence:</p>
                  <p className="font-body-md text-[13px] text-[#e2dfd9] leading-relaxed">
                    Objective, practical evidence of GIS application in an official project setting (e.g., Spatial Crop Estimation project logs or peer-reviewed geographic visualizations) is required to elevate this metric above the 80% threshold.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
