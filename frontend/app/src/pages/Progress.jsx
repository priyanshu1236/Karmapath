import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Progress() {
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: "Guest" };

  const resultStr = localStorage.getItem('assessment_result');
  const result = resultStr ? JSON.parse(resultStr) : null;

  const hasAssessment = result !== null && result.role_capability_profile;

  if (!hasAssessment) {
    return (
      <div className="flex flex-col w-full p-8 gap-7 max-w-[1440px] mx-auto min-h-[calc(100vh-64px)]">
        <div className="bg-surface-container-lowest p-12 border border-outline-variant rounded-2xl flex flex-col items-center justify-center text-center gap-6 shadow-sm my-auto">
          <div className="w-20 h-20 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-[40px]">trending_up</span>
          </div>
          <div className="max-w-md mx-auto">
            <h2 className="font-display-md text-[24px] text-primary mb-3">No Progress Data</h2>
            <p className="font-body-md text-[15px] text-on-surface-variant mb-8">
              Complete your initial competency assessment to unlock progress tracking and visual insights.
            </p>
            <button 
              onClick={() => navigate('/employee/initial-assessment-choice')}
              className="px-8 py-3 bg-primary text-on-primary rounded-lg font-body font-semibold hover:bg-primary-container transition-colors shadow-sm inline-flex items-center gap-2"
            >
              Take Assessment
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- DATA EXTRACTION ---
  const capabilityProfile = result.role_capability_profile || [];
  const interestAssessment = result.interest_assessment || null;
  const recommendations = result.recommendations || [];

  // Overall Assessment Score Logic
  let standardTotal = 0;
  let standardCorrect = 0;
  let hasValidCounts = true;
  
  capabilityProfile.forEach(comp => {
    if (comp.question_count !== undefined) {
      standardTotal += comp.question_count;
      standardCorrect += Math.round((comp.capability / 100) * comp.question_count);
    } else {
      hasValidCounts = false;
    }
  });

  let overallTotal = 0;
  let overallCorrect = 0;
  
  if (hasValidCounts && standardTotal > 0) {
    overallTotal += standardTotal;
    overallCorrect += standardCorrect;
    
    if (interestAssessment && interestAssessment.question_count !== undefined) {
      overallTotal += interestAssessment.question_count;
      overallCorrect += (interestAssessment.correct_count !== undefined ? interestAssessment.correct_count : Math.round((interestAssessment.capability / 100) * interestAssessment.question_count));
    }
  }
  
  const overallPercentage = overallTotal > 0 ? Math.round((overallCorrect / overallTotal) * 100) : 
    (capabilityProfile.length > 0 ? Math.round(capabilityProfile.reduce((acc, comp) => acc + comp.capability, 0) / capabilityProfile.length) : 0);

  // Learning Progress
  const inProgress = recommendations.filter(r => r.status === 'in_progress').length;
  const completed = recommendations.filter(r => r.status === 'completed').length;
  
  // Assessment History
  const history = [
    {
      type: interestAssessment ? 'Initial Capability + Area of Interest Assessment' : 'Initial Capability Assessment',
      date: result.date || new Date().toLocaleDateString(),
      score: overallTotal > 0 ? `${overallCorrect} / ${overallTotal}` : '-',
      percentage: `${overallPercentage}%`,
      status: 'Completed'
    }
  ];

  // Learning Activity
  const activities = recommendations
    .filter(r => r.status === 'in_progress' || r.status === 'completed')
    .map(r => ({
      title: r.title || r.course_title,
      type: 'Course',
      status: r.status === 'completed' ? 'Completed' : 'In Progress',
      competency: r.matched_competency
    }));

  return (
    <div className="flex flex-col w-full bg-surface min-h-[calc(100vh-64px)]">
      {/* 1. HEADER */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/60 pt-8 pb-10 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display-lg text-[32px] md:text-[38px] text-primary leading-tight mb-2 tracking-tight">
            My Progress
          </h1>
          <p className="font-body-md text-[15px] text-on-surface-variant max-w-2xl leading-relaxed">
            Track your learning activity, assessment performance, and competency growth over time.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-6 lg:px-12 py-8 flex flex-col gap-10">
        
        {/* 2. TOP PROGRESS SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 shadow-sm flex flex-col gap-2 relative overflow-hidden group hover:border-teal-brand/30 transition-colors">
            <div className="flex items-center justify-between z-10">
              <span className="font-label-md text-[11px] uppercase tracking-widest font-semibold text-on-surface-variant">Overall Capability</span>
              <span className="material-symbols-outlined text-[20px] text-teal-brand">insights</span>
            </div>
            <div className="z-10 mt-2">
              <span className="font-display text-[32px] text-primary leading-none">{overallPercentage}%</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-brand/20">
              <div className="h-full bg-teal-brand" style={{ width: `${overallPercentage}%` }}></div>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 shadow-sm flex flex-col gap-2 hover:border-outline transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-[11px] uppercase tracking-widest font-semibold text-on-surface-variant">Assessment Score</span>
              <span className="material-symbols-outlined text-[20px] text-primary">assignment_turned_in</span>
            </div>
            <div className="mt-2 flex flex-col gap-1">
              <span className="font-display text-[26px] text-primary leading-none">
                {overallTotal > 0 ? `${overallCorrect} / ${overallTotal}` : `${overallPercentage}%`}
              </span>
              <span className="font-body-md text-[12px] text-on-surface-variant">
                {overallTotal > 0 ? 'Correct' : 'Overall Score'}
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 shadow-sm flex flex-col gap-2 hover:border-outline transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-[11px] uppercase tracking-widest font-semibold text-on-surface-variant">Learning Progress</span>
              <span className="material-symbols-outlined text-[20px] text-secondary">local_library</span>
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="font-display text-[24px] text-primary leading-none">{completed}</span>
                <span className="font-body-md text-[11px] text-on-surface-variant uppercase tracking-widest">Completed</span>
              </div>
              <div className="w-px h-8 bg-outline-variant/50"></div>
              <div className="flex flex-col gap-0.5">
                <span className="font-display text-[24px] text-primary leading-none">{inProgress}</span>
                <span className="font-body-md text-[11px] text-on-surface-variant uppercase tracking-widest">In Progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. MAIN GRAPH (Capability Distribution) */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/40 pb-4">
            <div>
              <h3 className="font-display-md text-[20px] text-primary">Capability Distribution</h3>
              <p className="font-body-md text-[13px] text-on-surface-variant mt-1">Current capability levels across assessed competencies</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal-brand"></div>
                <span className="font-label-md text-[11px] uppercase tracking-widest font-semibold text-on-surface-variant">Capability</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-px border-t border-dashed border-terracotta"></div>
                <span className="font-label-md text-[11px] uppercase tracking-widest font-semibold text-on-surface-variant">Benchmark (80%)</span>
              </div>
            </div>
          </div>
          
          <div className="relative h-64 mt-4 mb-6">
            {/* Y-Axis lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[100, 80, 60, 40, 20, 0].map(val => (
                <div key={val} className="relative w-full border-t border-outline-variant/20 h-0 flex items-center">
                  <span className="absolute -left-6 md:-left-8 text-[10px] text-on-surface-variant font-mono-data bg-surface-container-lowest py-1">{val}</span>
                </div>
              ))}
            </div>

            {/* Benchmark Line (80%) */}
            <div className="absolute left-0 right-0 border-t border-dashed border-terracotta/70 pointer-events-none z-10" style={{ top: '20%' }}></div>

            {/* Vertical Bars */}
            <div className="absolute inset-0 flex justify-around items-end pl-2">
              {capabilityProfile.slice(0, 8).map((comp, idx) => (
                <div key={idx} className="relative group w-8 sm:w-12 h-full flex flex-col justify-end items-center">
                  <div 
                    className="w-full bg-teal-brand/80 rounded-t-sm transition-all duration-500 ease-out hover:bg-teal-brand relative z-20"
                    style={{ height: `${Math.max(5, comp.capability)}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-highest text-on-surface text-[11px] py-1 px-2 rounded shadow-md whitespace-nowrap pointer-events-none z-30">
                      <span className="font-bold">{comp.capability}%</span> - {comp.competency}
                    </div>
                  </div>
                  {/* X-Axis Labels (Abbreviated/Rotated) */}
                  <div className="absolute -bottom-8 w-24 text-center">
                    <span className="text-[9px] text-on-surface-variant font-medium leading-tight block truncate" title={comp.competency}>
                      {comp.competency.split(' ')[0]} {comp.competency.split(' ')[1] || ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. COMPETENCY PROGRESS (Horizontal Bars) */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 shadow-sm flex flex-col gap-6">
          <div className="border-b border-outline-variant/40 pb-4">
            <h3 className="font-display-md text-[20px] text-primary">Competency Capability</h3>
            <p className="font-body-md text-[13px] text-on-surface-variant mt-1">Detailed view of your current standing vs requirement</p>
          </div>
          
          <div className="flex flex-col gap-5">
            {capabilityProfile.map((comp, idx) => {
              const req = comp.required || 80;
              const gap = req - comp.capability;
              const isMet = comp.capability >= req;

              return (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 group">
                  <div className="w-full sm:w-[280px] shrink-0">
                    <h4 className="font-body-md text-[14px] text-primary truncate" title={comp.competency}>{comp.competency}</h4>
                  </div>
                  
                  <div className="flex-1 flex items-center gap-4">
                    <span className="w-8 text-right font-mono-data text-[13px] font-bold text-primary">{comp.capability}%</span>
                    
                    <div className="flex-1 relative h-3 bg-surface-container-high rounded-full overflow-hidden flex">
                      <div className={`h-full ${isMet ? 'bg-teal-brand' : 'bg-saffron'} z-10 rounded-full`} style={{ width: `${comp.capability}%` }}></div>
                      {gap > 0 && (
                        <div className="h-full bg-terracotta/30 z-0" style={{ width: `${gap}%` }}></div>
                      )}
                      {/* Benchmark marker inside the bar area if possible, handled by absolute position below */}
                    </div>
                    
                    <span className="w-8 font-mono-data text-[12px] text-on-surface-variant">{req}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 5. ASSESSMENT HISTORY */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 shadow-sm flex flex-col gap-5">
            <div className="border-b border-outline-variant/40 pb-4">
              <h3 className="font-display-md text-[20px] text-primary">Assessment History</h3>
            </div>
            
            <div className="flex flex-col gap-4">
              {history.map((record, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-outline-variant/40 bg-surface flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-teal-brand/10 text-teal-brand flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[16px]">assignment_turned_in</span>
                      </div>
                      <h4 className="font-body-md text-[14px] font-semibold text-primary">{record.type}</h4>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-md text-[10px] uppercase tracking-widest font-bold">
                      {record.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-10">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-label-md text-[10px] uppercase tracking-widest text-on-surface-variant">Date</span>
                      <span className="font-mono-data text-[13px] text-primary font-medium">{record.date}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-label-md text-[10px] uppercase tracking-widest text-on-surface-variant">Score</span>
                      <span className="font-mono-data text-[13px] text-primary font-medium">{record.score}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-label-md text-[10px] uppercase tracking-widest text-on-surface-variant">Percentage</span>
                      <span className="font-mono-data text-[13px] text-primary font-bold">{record.percentage}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. LEARNING ACTIVITY */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 shadow-sm flex flex-col gap-5">
            <div className="border-b border-outline-variant/40 pb-4 flex justify-between items-center">
              <h3 className="font-display-md text-[20px] text-primary">Learning Activity</h3>
              <button 
                onClick={() => navigate('/employee/courses')}
                className="text-teal-brand hover:text-teal-brand-dark font-label-md text-[11px] uppercase tracking-widest font-bold flex items-center gap-1 transition-colors"
              >
                Browse Courses <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </button>
            </div>

            {activities.length === 0 ? (
              <div className="py-8 text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant/50">local_library</span>
                <p className="font-body-md text-[14px] text-on-surface-variant">No recent learning activity found.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {activities.map((act, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-lg border border-outline-variant/40 hover:bg-surface-container-low transition-colors">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${act.status === 'Completed' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                      <span className="material-symbols-outlined text-[18px]">
                        {act.type === 'Course' ? 'menu_book' : 'quiz'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-body-md text-[13px] font-semibold text-primary truncate" title={act.title}>{act.title}</h4>
                      <p className="font-label-md text-[10px] uppercase tracking-widest text-on-surface-variant truncate mt-0.5">{act.competency}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded font-label-md text-[9px] uppercase tracking-widest font-bold ${act.status === 'Completed' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                        {act.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
