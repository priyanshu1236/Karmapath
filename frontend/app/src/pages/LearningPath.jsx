import { useNavigate } from 'react-router-dom';
import React from 'react';

export default function LearningPath() {
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  const resultStr = localStorage.getItem('assessment_result');
  const result = resultStr ? JSON.parse(resultStr) : null;

  const hasAssessment = result !== null && result.role_capability_profile;
  const recommendations = result?.recommendations || [];

  // STATE A: Assessment Skipped
  if (!hasAssessment) {
    return (
      <div className="flex flex-col w-full p-8 gap-7 max-w-[1440px] mx-auto min-h-[calc(100vh-64px)]">
        <div className="bg-surface-container-lowest p-12 border border-outline-variant rounded-2xl flex flex-col items-center justify-center text-center gap-6 shadow-sm my-auto">
          <div className="w-20 h-20 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-[40px]">route</span>
          </div>
          <div className="max-w-md mx-auto">
            <h2 className="font-display-md text-[24px] text-primary mb-3">Your Learning Path</h2>
            <p className="font-body-md text-[15px] text-on-surface-variant mb-8">
              No learning path items are available yet.<br/>Complete an assessment to generate your personalized path.
            </p>
            <button 
              onClick={() => navigate('/employee/initial-assessment-choice')}
              className="px-8 py-3 bg-primary text-on-primary rounded-lg font-body font-semibold hover:bg-primary-container transition-colors shadow-sm inline-flex items-center gap-2"
            >
              Take Initial Assessment
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STATE B: Assessment Complete, NO Recommendations
  if (recommendations.length === 0) {
    return (
      <div className="flex flex-col w-full p-8 gap-7 max-w-[1440px] mx-auto min-h-[calc(100vh-64px)]">
        <div className="bg-surface-container-lowest p-12 border border-outline-variant rounded-2xl flex flex-col items-center justify-center text-center gap-6 shadow-sm my-auto">
          <div className="w-20 h-20 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-[40px]">check_circle</span>
          </div>
          <div className="max-w-md mx-auto">
            <h2 className="font-display-md text-[24px] text-primary mb-3">You're All Caught Up</h2>
            <p className="font-body-md text-[15px] text-on-surface-variant mb-8">
              There are currently no outstanding skill gaps requiring new courses. Great job!
            </p>
            <button 
              onClick={() => navigate('/employee/dashboard')}
              className="px-8 py-3 bg-surface border border-outline text-on-surface rounded-lg font-body font-semibold hover:bg-surface-container-low transition-colors inline-flex items-center gap-2"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STATE C: Build learning path sequence
  const gaps = result.development_gaps || [];
  const gapMap = {};
  const capabilityMap = {};
  gaps.forEach(g => {
    gapMap[g.competency] = g.gap;
    capabilityMap[g.competency] = g.capability;
  });

  // Grouping
  const groups = {};
  recommendations.forEach(course => {
    const comp = course.matched_competency;
    if (!groups[comp]) {
      groups[comp] = {
        competency: comp,
        gap: gapMap[comp] || 0,
        capability: capabilityMap[comp] || 0,
        courses: []
      };
    }
    groups[comp].courses.push(course);
  });

  // Sort groups by gap size descending
  const sortedGroups = Object.values(groups).sort((a, b) => b.gap - a.gap);

  // Flatten into a step-by-step array (we can treat each course as a step)
  const steps = [];
  let stepIndex = 1;
  sortedGroups.forEach(group => {
    // Sort courses in the group by score descending
    group.courses.sort((a, b) => b.score - a.score);
    group.courses.forEach(course => {
      steps.push({
        stepNumber: stepIndex++,
        competency: group.competency,
        gap: group.gap,
        capability: group.capability,
        course: course
      });
    });
  });

  const totalSteps = steps.length * 2; // Course + Quiz for each

  return (
    <div className="flex flex-col w-full bg-surface">
      {/* HEADER SECTION */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/60 pt-10 pb-10 px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display-lg text-[32px] md:text-[38px] text-primary leading-tight mb-2 tracking-tight">
            Your Learning Path
          </h1>
          <p className="font-body-md text-[15px] text-on-surface-variant max-w-2xl leading-relaxed">
            A personalized roadmap generated from your competency assessment to efficiently close your skill gaps.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="font-label-md text-[11px] font-bold tracking-widest uppercase text-secondary">Based on:</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-surface-variant text-on-surface-variant font-label-md text-[11px] uppercase tracking-widest font-bold">
              {result.interest_assessment ? 'Role Competency Assessment + Area of Interest Assessment' : 'Role Competency Assessment'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-6 lg:px-12 py-10 flex flex-col relative">
        
        {/* TIMELINE SECTION */}
        <div className="w-full relative pb-10">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[21px] md:left-[27px] top-6 bottom-6 w-0.5 bg-outline-variant/50"></div>

          <div className="flex flex-col relative">
            {steps.map((item, idx) => {
              const c = item.course;
              const isFirst = idx === 0;
              const stepStr = String(item.stepNumber).padStart(2, '0');
              
              return (
                <React.Fragment key={idx}>
                  {/* COURSE STEP */}
                  <div className="relative flex items-start group mb-6">
                    {/* Timeline Dot */}
                    <div className="absolute left-[22px] md:left-[28px] -translate-x-1/2 mt-5">
                      <div className={`w-[14px] h-[14px] rounded-full border-2 border-surface flex items-center justify-center z-10 transition-colors ${c.status === 'in_progress' ? 'bg-teal-brand ring-4 ring-teal-brand/10' : c.status === 'completed' ? 'bg-primary' : 'bg-outline-variant'}`}>
                        {(c.status === 'in_progress' || c.status === 'completed') && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                      </div>
                    </div>

                    {/* Compact Course Card */}
                    <div className="pl-[56px] md:pl-[68px] w-full">
                      <div className={`bg-surface-container-lowest border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-sm group-hover:shadow-md ${c.status === 'in_progress' ? 'border-teal-brand/30 shadow-[0_4px_16px_-4px_rgba(23,107,103,0.1)]' : 'border-outline-variant hover:border-outline'}`}>
                        
                        <div className="flex flex-col gap-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-label-md text-[11px] font-bold tracking-widest uppercase text-secondary">
                              Step {stepStr}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                            <span className="font-label-md text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                              Course
                            </span>
                            {c.status === 'in_progress' ? (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-teal-brand/10 text-teal-brand font-label-md text-[10px] uppercase tracking-widest font-bold">
                                In Progress
                              </span>
                            ) : c.status === 'completed' ? (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-md text-[10px] uppercase tracking-widest font-bold">
                                Completed
                              </span>
                            ) : (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-surface-container border border-outline-variant text-on-surface-variant font-label-md text-[10px] uppercase tracking-widest font-bold">
                                Upcoming
                              </span>
                            )}
                          </div>

                          <h3 className="font-display text-[18px] text-primary leading-tight font-medium line-clamp-2">
                            {c.title || c.course_title}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant font-label-md text-[10px] uppercase tracking-widest font-bold">
                              {item.competency}
                            </span>
                            <span className="font-mono-data text-[11px] text-on-surface-variant font-medium">
                              Gap: {item.gap} pts
                            </span>
                            {(c.duration || c.estimated_duration) && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-outline-variant/60"></span>
                                <span className="font-body-md text-[12px] text-on-surface-variant flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                                  {c.duration || c.estimated_duration}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex-shrink-0 mt-2 md:mt-0">
                          <button className={`w-full md:w-auto px-5 py-2 rounded-lg font-body font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-colors ${c.status === 'completed' ? 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant' : (c.status === 'in_progress' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-surface border border-outline text-on-surface hover:bg-surface-variant')}`}>
                            {c.status === 'completed' ? 'Completed' : (c.status === 'in_progress' ? 'Continue Course' : 'Start Course')}
                            {c.status !== 'completed' && <span className="material-symbols-outlined text-[16px]">arrow_forward</span>}
                          </button>
                        </div>
                        
                      </div>
                    </div>
                  </div>

                  {/* COURSE QUIZ STEP */}
                  <div className="relative flex items-start group mb-10">
                    {/* Timeline Dot for Quiz (Smaller) */}
                    <div className="absolute left-[22px] md:left-[28px] -translate-x-1/2 mt-5">
                      <div className="w-[10px] h-[10px] rounded-full border-2 border-surface bg-outline-variant/60 flex items-center justify-center z-10"></div>
                    </div>

                    {/* Compact Quiz Card */}
                    <div className="pl-[56px] md:pl-[68px] w-full">
                      <div className="bg-surface-container-low/50 border border-outline-variant/50 border-dashed rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-secondary">quiz</span>
                            <span className="font-label-md text-[11px] font-bold tracking-widest uppercase text-secondary">
                              Course Quiz
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-md text-[9px] uppercase tracking-widest font-bold">
                              Not Started
                            </span>
                          </div>
                          <p className="font-body-md text-[13px] text-on-surface-variant">
                            Assessment after completing this course
                          </p>
                        </div>

                        <button 
                          onClick={() => navigate('/employee/assessments')}
                          className="w-full sm:w-auto px-4 py-1.5 bg-surface-container border border-outline-variant text-on-surface-variant rounded-md font-body font-semibold text-[12px] hover:text-primary hover:border-outline transition-colors"
                        >
                          Take Quiz
                        </button>
                        
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          
          <div className="absolute left-[22px] md:left-[28px] -translate-x-1/2 bottom-0">
             <div className="w-[12px] h-[12px] rounded-full bg-surface border-[3px] border-outline-variant flex items-center justify-center z-10"></div>
          </div>
          <div className="pl-[56px] md:pl-[68px] mt-6 w-full">
             <p className="font-label-md text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">End of current path</p>
          </div>
        </div>

      </div>
    </div>
  );
}
