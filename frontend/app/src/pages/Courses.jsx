import { useNavigate } from 'react-router-dom';
import React from 'react';

export default function Courses() {
  const navigate = useNavigate();

  const resultStr = localStorage.getItem('assessment_result');
  const result = resultStr ? JSON.parse(resultStr) : null;
  const allRecs = result?.recommendations || [];
  const gaps = result?.development_gaps || [];
  
  const gapMap = {};
  const sourceMap = {};
  gaps.forEach(g => {
    gapMap[g.competency] = g.gap;
    sourceMap[g.competency] = g.source;
  });

  const aoiCourses = [];
  const gapCourses = [];
  const generalCourses = [];
  const inProgressCourses = [];

  allRecs.forEach(course => {
    // clone course to avoid mutating local storage state directly in our grouping
    const c = { ...course };
    const comp = c.matched_competency;
    const isAoi = sourceMap[comp] === 'area_of_interest';
    const gap = gapMap[comp] || 0;
    
    c.gap = gap;
    
    if (c.status === 'in_progress') {
      inProgressCourses.push(c);
    }

    if (isAoi) {
      aoiCourses.push(c);
    } else if (gap > 0) {
      gapCourses.push(c);
    } else {
      generalCourses.push(c);
    }
  });

  // If no general courses exist, promote the top scoring gap courses to "Recommended for You"
  if (generalCourses.length === 0 && gapCourses.length > 0) {
    gapCourses.sort((a, b) => b.score - a.score);
    const promoteCount = Math.min(2, gapCourses.length);
    generalCourses.push(...gapCourses.slice(0, promoteCount));
    gapCourses.splice(0, promoteCount);
  }

  const renderCourseCard = (c, context) => {
    return (
      <div key={c.course_title || c.title} className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-outline-variant transition-all flex flex-col h-full gap-4">
        
        {/* Header / Meta */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex flex-wrap gap-2">
            {context === 'gap' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-terracotta/10 text-terracotta font-label-md text-[10px] uppercase tracking-widest font-bold">
                Recommended • {c.gap} pt gap
              </span>
            )}
            {context === 'aoi' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-md text-[10px] uppercase tracking-widest font-bold">
                Area of Interest
              </span>
            )}
            {context === 'general' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-teal-brand/10 text-teal-brand font-label-md text-[10px] uppercase tracking-widest font-bold">
                Top Match
              </span>
            )}
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant font-label-md text-[10px] uppercase tracking-widest font-bold">
              {c.matched_competency}
            </span>
          </div>
          {c.score && (
            <div className="flex items-center gap-1 shrink-0 bg-surface-container-low px-2 py-1 rounded border border-outline-variant/50">
              <span className="material-symbols-outlined text-[14px] text-teal-brand">bolt</span>
              <span className="font-mono-data text-[11px] font-bold text-primary">{Math.round(c.score)}%</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col gap-2 flex-1">
          <h3 className="font-display-md text-[18px] text-primary leading-tight line-clamp-2">
            {c.title || c.course_title}
          </h3>
          <p className="font-body-md text-[13px] text-on-surface-variant line-clamp-2">
            {c.reason || c.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {(c.duration || c.estimated_duration) && (
              <span className="font-body-md text-[12px] text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                {c.duration || c.estimated_duration}
              </span>
            )}
            {c.difficulty && (
              <span className="font-body-md text-[12px] text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">school</span>
                {c.difficulty}
              </span>
            )}
            {(c.module_count || c.question_count) && (
              <span className="font-body-md text-[12px] text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">format_list_bulleted</span>
                {c.module_count || c.question_count} items
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-2 pt-4 border-t border-outline-variant/40 flex flex-col sm:flex-row gap-3">
          <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-body font-semibold text-[13px] hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            View Course
          </button>
          <button className="flex-1 px-4 py-2 bg-surface border border-outline text-on-surface rounded-lg font-body font-semibold text-[13px] hover:bg-surface-variant transition-colors flex items-center justify-center gap-2">
            First Test Yourself
          </button>
        </div>
      </div>
    );
  };

  const renderInProgressCard = (c) => {
    return (
      <div key={c.course_title || c.title} className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 shadow-sm hover:border-teal-brand/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h4 className="font-display-md text-[16px] text-primary">{c.title || c.course_title}</h4>
          <div className="flex items-center gap-3">
            <span className="font-label-md text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
              {c.matched_competency}
            </span>
            <span className="font-label-md text-[10px] uppercase tracking-widest font-bold text-teal-brand">
              In Progress
            </span>
          </div>
        </div>
        <button className="px-5 py-2 bg-surface-container border border-outline text-on-surface rounded-lg font-body font-semibold text-[13px] hover:bg-surface-variant transition-colors whitespace-nowrap">
          Continue
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full bg-surface min-h-[calc(100vh-64px)]">
      {/* HEADER SECTION */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/60 pt-10 pb-10 px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display-lg text-[32px] md:text-[38px] text-primary leading-tight mb-2 tracking-tight">
            Courses
          </h1>
          <p className="font-body-md text-[15px] text-on-surface-variant max-w-2xl leading-relaxed">
            Explore learning resources recommended for your competency profile and interests.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-6 lg:px-12 py-10 flex flex-col gap-12">
        
        {/* RECOMMENDED FOR YOU */}
        {generalCourses.length > 0 && (
          <section className="flex flex-col gap-5">
            <div>
              <h2 className="font-display-md text-[22px] text-primary">Recommended for You</h2>
              <p className="font-body-md text-[14px] text-on-surface-variant mt-1">Learning resources selected based on your latest competency assessment.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generalCourses.map(c => renderCourseCard(c, 'general'))}
            </div>
          </section>
        )}

        {/* RECOMMENDED FOR SKILL GAPS */}
        {gapCourses.length > 0 && (
          <section className="flex flex-col gap-5">
            <div>
              <h2 className="font-display-md text-[22px] text-primary">Recommended for Your Skill Gaps</h2>
              <p className="font-body-md text-[14px] text-on-surface-variant mt-1">Resources that can help strengthen competencies below the required benchmark.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gapCourses.map(c => renderCourseCard(c, 'gap'))}
            </div>
          </section>
        )}

        {/* BASED ON YOUR AREA OF INTEREST */}
        {aoiCourses.length > 0 && (
          <section className="flex flex-col gap-5">
            <div>
              <h2 className="font-display-md text-[22px] text-primary">Based on Your Area of Interest</h2>
              <p className="font-body-md text-[14px] text-on-surface-variant mt-1">Explore resources related to the interests you selected during your assessment.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aoiCourses.map(c => renderCourseCard(c, 'aoi'))}
            </div>
          </section>
        )}

        {/* CONTINUE LEARNING */}
        {inProgressCourses.length > 0 && (
          <section className="flex flex-col gap-5 pt-4 border-t border-outline-variant/40">
            <div>
              <h2 className="font-display-md text-[22px] text-primary">Continue Learning</h2>
              <p className="font-body-md text-[14px] text-on-surface-variant mt-1">Pick up where you left off.</p>
            </div>
            <div className="flex flex-col gap-4">
              {inProgressCourses.map(renderInProgressCard)}
            </div>
          </section>
        )}

        {allRecs.length === 0 && (
          <div className="p-12 text-center bg-surface-container-lowest border border-outline-variant/50 rounded-xl">
            <h3 className="font-display-md text-[20px] text-primary mb-2">No Courses Available</h3>
            <p className="text-on-surface-variant font-medium">Please complete your competency assessment to receive personalized course recommendations.</p>
          </div>
        )}

      </div>
    </div>
  );
}
