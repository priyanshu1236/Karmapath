import React from 'react';

function AIAssessmentLab() {
  return (
    <div className="relative group rounded-[2rem] overflow-hidden mt-8">
      {/* Animated Gradient Border effect using before pseudo-element */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500 opacity-30 blur-2xl group-hover:opacity-60 transition-opacity duration-700"></div>
      
      <div className="relative bg-[#101018]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden">
        <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-brand-500/20 flex items-center justify-center border border-brand-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <svg className="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
             </div>
            <h2 className="font-extrabold text-2xl text-white tracking-wide">
              AI Assessment Lab 
              <span className="inline-flex items-center text-brand-300 font-bold ml-4 text-xs px-3 py-1.5 bg-brand-500/10 rounded-xl border border-brand-500/20 uppercase tracking-widest align-middle">
                 <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2 animate-pulse"></span>
                 Powered by RAG
              </span>
            </h2>
          </div>
          <button className="text-surface-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
          </button>
        </div>

        <div className="p-10 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Upload Area */}
          <div className="relative border-2 border-dashed border-brand-500/30 hover:border-brand-400/60 rounded-[2rem] bg-brand-500/5 hover:bg-brand-500/10 p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group/upload min-h-[320px]">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover/upload:opacity-100 transition-opacity rounded-[2rem]"></div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 mb-8 rounded-full bg-brand-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)] flex items-center justify-center group-hover/upload:scale-110 group-hover/upload:-translate-y-2 transition-all duration-500 border border-brand-500/30">
                  <svg className="w-10 h-10 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                </div>
                <h3 className="font-extrabold text-2xl text-white mb-3">Upload MoSPI Manuals</h3>
                <p className="text-base text-surface-400 mb-8 max-w-sm leading-relaxed">Drag and drop PDF or DOCX files here. Our AI will analyze them instantly.</p>
                <button className="bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-bold py-3.5 px-10 rounded-xl shadow-lg transition-all duration-300 backdrop-blur-md">
                    Browse Files
                </button>
            </div>
          </div>

          {/* Info Area */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 font-bold text-xs uppercase tracking-widest w-fit mb-6 border border-purple-500/20">
               <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Intelligent Generation
            </div>
            <h3 className="text-3xl lg:text-4xl font-extrabold text-white mb-6 leading-tight">Turn static SOPs into <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">dynamic assessments</span></h3>
            <p className="text-lg text-surface-400 mb-10 leading-relaxed">
              Our AI engine analyzes uploaded government manuals, extracts key methodologies, and generates a structured Quiz. Your score automatically feeds back into your capability profile.
            </p>
            
            <div className="flex gap-4">
                <button className="bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white font-bold py-4 px-8 rounded-xl shadow-[0_0_25px_rgba(99,102,241,0.5)] transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 text-lg">
                  Start Evaluation Quiz
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssessmentLab;
