import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: "Guest", role: "Unknown", domain: "Unknown" };
  
  const resultStr = localStorage.getItem('assessment_result');
  const result = resultStr ? JSON.parse(resultStr) : null;
  
  const hasAssessment = result !== null && result.role_capability_profile;

  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const employeeId = user.employee_id || 'EMP001';
        const res = await fetch(`http://localhost:8000/api/resources/available?employee_id=${employeeId}`);
        const data = await res.json();
        if (data.success) {
          // Keep the existing logic that selects the latest attempt
          // Filter resources that have history, then sort by timestamp descending
          const withHistory = (data.resources || []).filter(r => r.history);
          withHistory.sort((a, b) => new Date(b.history.timestamp) - new Date(a.history.timestamp));
          setResources(withHistory);
        }
      } catch (err) {
        console.error("Failed to fetch resources", err);
      }
    };
    fetchResources();
  }, [user.employee_id]);

  // Render State 1: Assessment Not Completed
  const needsInitialAssessment = user.is_first_login === true && !hasAssessment;
  if (needsInitialAssessment) {
    return (
      <div className="flex flex-col w-full p-8 gap-7 max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between bg-surface-container-low border border-[#ded5c6] p-7 rounded-xl shadow-sm relative overflow-hidden">
          <div className="flex flex-col gap-1.5 max-w-2xl relative z-10">
            <h1 className="font-display-lg text-[32px] md:text-[38px] leading-tight text-primary font-normal">Good morning, {user.name || 'Employee'}</h1>
            <p className="font-body-md text-[15px] font-semibold text-primary mt-1">{user.role || 'Unknown Role'} &middot; {user.domain || 'Unknown Domain'}</p>
          </div>
          <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-teal-brand/5 pointer-events-none"></div>
        </div>

        <div className="bg-surface-container-lowest p-12 border border-outline-variant rounded-xl flex flex-col items-center justify-center text-center gap-6 shadow-sm min-h-[400px]">
          <div className="w-20 h-20 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-[40px]">assignment</span>
          </div>
          <div className="max-w-md mx-auto">
            <h2 className="font-display-md text-[24px] text-primary mb-2">Initial Assessment</h2>
            <p className="font-body-md text-[16px] text-on-surface-variant font-medium mb-4">Not completed</p>
            <p className="font-body-md text-[15px] text-on-surface-variant mb-8">
              Complete your initial competency assessment to generate your capability profile.
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

  // --- Assessment Completed State ---
  
  // Data extraction safely handling missing objects
  const safeResult = result || {};
  const assessment = safeResult.assessment || {};
  const questionCount = assessment.question_count || 12;
  
  const capabilityProfile = safeResult.role_capability_profile || [];
  const developmentGaps = safeResult.development_gaps || [];
  const highestPriorityGap = safeResult.highest_priority_gap || { competency: 'None', gap: 0 };
  const interestAssessment = safeResult.interest_assessment || null;
  
  // Find strongest area from capability profile
  let strongestArea = { competency: 'None', capability: 0 };
  capabilityProfile.forEach(comp => {
    if (comp.capability > strongestArea.capability) {
      strongestArea = comp;
    }
  });

  // Calculate areas for development (gap > 0)
  const areasForDevelopment = developmentGaps.filter(g => g.gap > 0 && g.source !== 'area_of_interest').length;

  // Derive Overall Assessment Result dynamically
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
  
  const overallPercentage = overallTotal > 0 ? Math.round((overallCorrect / overallTotal) * 100) : 0;
  
  // Safe fallback if raw counts are missing
  const fallbackPercentage = capabilityProfile.length > 0 
    ? Math.round(capabilityProfile.reduce((acc, comp) => acc + comp.capability, 0) / capabilityProfile.length) 
    : 0;

  return (
    <div className="flex flex-col w-full p-8 gap-7 max-w-[1440px] mx-auto">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between bg-surface-container-low border border-[#ded5c6] p-7 rounded-xl shadow-sm relative overflow-hidden">
        <div className="flex flex-col gap-1.5 max-w-2xl relative z-10">
          <h1 className="font-display-lg text-[32px] md:text-[38px] leading-tight text-primary font-normal">Good morning, {user.name || 'Employee'}</h1>
          <p className="font-body-md text-[15px] font-semibold text-primary mt-1">{safeResult.role || user.role} &middot; {safeResult.domain || user.domain}</p>
        </div>
        <div className="flex flex-col gap-1 mt-3 md:mt-0 text-left md:text-right bg-surface/70 md:bg-transparent p-4 md:p-0 rounded-lg border md:border-none border-[#e4dcce] relative z-10">
          <span className="font-label-md text-[11px] text-teal-brand uppercase tracking-widest font-bold">Initial Competency Assessment</span>
          <p className="font-body-md text-[13.5px] font-semibold text-primary">Completed</p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-teal-brand/5 pointer-events-none"></div>
      </div>
      
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-surface-container-lowest p-5 border border-[#ded5c6] rounded-xl flex flex-col justify-between h-[140px] relative overflow-hidden group shadow-sm">
          <div className="flex items-center justify-between z-10 relative">
            <span className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold">Overall Assessment</span>
            <span className="material-symbols-outlined text-primary text-[22px]">assignment_turned_in</span>
          </div>
          <div className="flex flex-col z-10 relative">
            {overallTotal > 0 ? (
              <span className="font-display-lg text-[26px] font-normal leading-tight text-primary truncate">
                {overallCorrect} / {overallTotal} Correct
              </span>
            ) : (
              <span className="font-display-lg text-[26px] font-normal leading-tight text-primary">
                Score: {fallbackPercentage}%
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-1 text-[12px] text-on-surface-variant font-medium z-10 relative">
            {overallTotal > 0 ? <span>Score: {overallPercentage}%</span> : <span>Assessment Completed</span>}
            <span className="text-teal-brand bg-teal-brand/10 px-1.5 rounded text-[11px] font-bold">Completed</span>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest p-5 border border-[#ded5c6] rounded-xl flex flex-col justify-between h-[140px] relative overflow-hidden group shadow-sm">
          <div className="flex items-center justify-between z-10 relative">
            <span className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold">Strongest Area</span>
            <span className="material-symbols-outlined text-teal-brand text-[22px]">star</span>
          </div>
          <div className="flex flex-col z-10 relative">
            <span className="font-display-lg text-[26px] font-normal leading-tight text-primary truncate">{strongestArea.competency}</span>
          </div>
          <div className="flex items-center gap-1 text-[12px] text-teal-brand font-medium z-10 relative">
            <span>Highest capability</span>
          </div>
        </div>

        {highestPriorityGap.gap > 0 ? (
          <div className="bg-terracotta-container/80 p-5 border border-terracotta/30 rounded-xl flex flex-col justify-between h-[140px] relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between z-10 relative">
              <span className="font-label-md text-[11px] text-terracotta-dark uppercase tracking-widest font-bold">Highest Priority Gap</span>
              <span className="material-symbols-outlined text-terracotta text-[22px]">warning</span>
            </div>
            <div className="flex flex-col z-10 relative">
              <span className="font-display-lg text-[26px] font-normal leading-tight text-terracotta-dark truncate">{highestPriorityGap.competency}</span>
            </div>
            <div className="flex items-center gap-1 text-[12px] font-medium text-terracotta-dark/90 z-10 relative">
              <span>{highestPriorityGap.gap} pts gap</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-terracotta"></div>
          </div>
        ) : (
          <div className="bg-surface-container-lowest p-5 border border-[#ded5c6] rounded-xl flex flex-col justify-between h-[140px] relative overflow-hidden group shadow-sm">
            <div className="flex items-center justify-between z-10 relative">
              <span className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold">Highest Priority Gap</span>
              <span className="material-symbols-outlined text-teal-brand text-[22px]">check_circle</span>
            </div>
            <div className="flex flex-col z-10 relative">
              <span className="font-display-lg text-[26px] font-normal leading-tight text-primary">No Major Gaps</span>
            </div>
            <div className="flex items-center gap-1 text-[12px] text-teal-brand font-medium z-10 relative">
              <span>Requirements met</span>
            </div>
          </div>
        )}

        <div className="bg-surface-container-lowest p-5 border border-[#ded5c6] rounded-xl flex flex-col justify-between h-[140px] relative overflow-hidden group shadow-sm">
          <div className="flex items-center justify-between z-10 relative">
            <span className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold">Areas for Development</span>
            <span className="material-symbols-outlined text-saffron-dark text-[22px]">trending_up</span>
          </div>
          <div className="flex flex-col z-10 relative">
            <span className="font-display-lg text-[36px] font-normal leading-none text-primary">{areasForDevelopment}</span>
          </div>
          <div className="flex items-center gap-1 text-[12px] text-on-surface-variant font-medium z-10 relative">
            <span>Competencies with gaps</span>
          </div>
        </div>
      </div>
      
      {/* LATEST LEARNING ASSESSMENT */}
      <div className="flex flex-col gap-4 mt-2 mb-4">
        <div className="flex items-center justify-between border-b border-[#ece4d6] pb-2">
          <h2 className="font-display-md text-[22px] font-normal text-primary">Latest Learning Assessment</h2>
          <button onClick={() => navigate('/employee/assessments')} className="text-sm font-bold text-teal-brand hover:text-teal-brand-dark flex items-center gap-1 transition-colors">
            Assessment Panel <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {resources.length > 0 ? (
          <div className="bg-surface-container-lowest border border-[#ded5c6] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-brand/10 text-teal-brand flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">task_alt</span>
              </div>
              <div>
                <h3 className="font-display text-[18px] text-primary leading-tight mb-1">{resources[0].title}</h3>
                <div className="flex flex-col gap-1 text-xs text-on-surface-variant font-medium">
                  {resources[0].history.correct !== undefined && resources[0].history.total !== undefined ? (
                    <span className="flex items-center gap-1 text-[14px] text-primary font-bold">
                      {resources[0].history.correct} / {resources[0].history.total} Correct
                    </span>
                  ) : null}
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">score</span>
                      Score: {resources[0].history.percentage}%
                    </span>
                    {resources[0].competency && resources[0].competency !== 'RESOURCE' && (
                      <span className="flex items-center gap-1 text-teal-brand bg-teal-brand/10 px-1.5 rounded">
                        <span className="material-symbols-outlined text-[14px]">upgrade</span>
                        Competency Updated
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/employee/resource-assessment/${resources[0].resource_id}`)}
              className="px-4 py-2 bg-surface-container border border-outline-variant text-on-surface rounded-lg font-bold text-sm hover:bg-surface-variant transition-colors whitespace-nowrap"
            >
              Review Results
            </button>
          </div>
        ) : (
          <div className="bg-surface-container-lowest border border-[#ded5c6] rounded-xl p-6 text-center shadow-sm">
            <p className="text-sm text-on-surface-variant font-medium mb-3">You haven't completed any resource-specific assessments yet.</p>
            <button 
              onClick={() => navigate('/employee/assessments')}
              className="px-4 py-2 bg-primary text-on-primary rounded-lg font-bold text-sm hover:bg-primary-container transition-colors inline-flex items-center gap-2"
            >
              Explore Assessments
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        )}
      </div>

      {/* AREA OF INTEREST SECTION */}
      {interestAssessment && (
        <div className="bg-surface-container-lowest p-7 border border-[#ded5c6] rounded-xl flex flex-col gap-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#ece4d6]">
            <div>
              <h2 className="font-display-md text-[26px] font-normal text-primary">Area of Interest Profile</h2>
              <p className="font-body-md text-[13px] text-on-surface-variant mt-0.5">Assessed capability in your chosen area: <span className="font-semibold text-primary">{interestAssessment.area_of_interest}</span></p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-label-md uppercase tracking-wider text-on-surface-variant">Overall Status</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full border font-label-md text-[11px] uppercase tracking-wider font-bold whitespace-nowrap
                ${interestAssessment.status === 'HIGH PRIORITY' ? 'bg-terracotta-container text-terracotta-dark border-terracotta/30' : 
                  interestAssessment.status === 'PRIORITY' ? 'bg-saffron-container text-saffron-dark border-saffron/40' : 
                  interestAssessment.status === 'DEVELOPING' ? 'bg-secondary-container text-on-secondary-container border-secondary/30' : 
                  'bg-teal-brand-container text-teal-brand-dark border-teal-brand/30'}
              `}>
                {interestAssessment.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-md text-on-surface border-collapse">
              <thead>
                <tr className="border-b-2 border-primary bg-surface-container-low/40">
                  <th className="py-3 px-4 font-label-md text-[11.5px] text-on-surface-variant uppercase tracking-widest font-semibold">Interest / Competency</th>
                  <th className="py-3 px-4 font-label-md text-[11.5px] text-on-surface-variant uppercase tracking-widest font-semibold w-5/12">Capability vs Required</th>
                  <th className="py-3 px-4 font-label-md text-[11.5px] text-on-surface-variant uppercase tracking-widest font-semibold text-center">Gap</th>
                  <th className="py-3 px-4 font-label-md text-[11.5px] text-on-surface-variant uppercase tracking-widest font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ece4d6]">
                {(interestAssessment.competencies || []).map((compItem) => {
                  const { competency, capability, required, gap, status } = compItem;
                  
                  let statusColor = "bg-teal-brand-container text-teal-brand-dark border-teal-brand/30";
                  let statusText = "Competent";
                  let barColor = "bg-teal-brand";
                  let gapColor = "text-teal-brand";
                  
                  if (status === 'HIGH PRIORITY') {
                    statusColor = "bg-terracotta-container text-terracotta-dark border-terracotta/30";
                    statusText = "High Priority";
                    barColor = "bg-terracotta";
                    gapColor = "text-terracotta";
                  } else if (status === 'PRIORITY') {
                    statusColor = "bg-saffron-container text-saffron-dark border-saffron/40";
                    statusText = "Priority";
                    barColor = "bg-saffron";
                    gapColor = "text-saffron-dark";
                  } else if (status === 'DEVELOPING') {
                    statusColor = "bg-secondary-container text-on-secondary-container border-secondary/30";
                    statusText = "Developing";
                    barColor = "bg-secondary";
                    gapColor = "text-secondary";
                  }
                  
                  return (
                    <tr key={competency} className="hover:bg-surface-container-low/60 transition-colors group">
                      <td className={`py-4 px-4 font-display-md text-[19px] text-primary transition-colors font-normal`}>
                        {competency}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3 w-full">
                          <span className="font-mono-data text-[13px] text-on-surface-variant w-7 text-right font-medium">{capability}%</span>
                          <div className="flex-1 h-2.5 bg-[#ede4d7] rounded-full overflow-hidden flex">
                            <div className={`${barColor} h-full ${gap > 0 ? 'rounded-l-full' : 'rounded-full'}`} style={{ width: `${Math.min(100, capability)}%` }}></div>
                            {gap > 0 && <div className={`${barColor}-container h-full opacity-30`} style={{ width: `${Math.min(100, gap)}%` }}></div>}
                          </div>
                          <span className="font-mono-data text-[11px] text-on-surface-variant/70">{required}%</span>
                        </div>
                      </td>
                      <td className={`py-4 px-4 text-center font-mono-data text-[13.5px] ${gapColor} font-bold`}>{gap > 0 ? `${gap} pts` : '-'}</td>
                      <td className="py-4 px-4 text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full ${statusColor} border font-label-md text-[11px] uppercase tracking-wider font-bold whitespace-nowrap`}>
                          {statusText}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* MAIN SECTION - COMPETENCY PROFILE */}
      <div className="bg-surface-container-lowest p-7 border border-[#ded5c6] rounded-xl flex flex-col gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#ece4d6]">
          <div>
            <h2 className="font-display-md text-[26px] font-normal text-primary">Your Role Capability Profile</h2>
            <p className="font-body-md text-[13px] text-on-surface-variant mt-0.5">Current assessed capability against the role benchmark</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-md text-on-surface border-collapse">
            <thead>
              <tr className="border-b-2 border-primary bg-surface-container-low/40">
                <th className="py-3 px-4 font-label-md text-[11.5px] text-on-surface-variant uppercase tracking-widest font-semibold">Competency</th>
                <th className="py-3 px-4 font-label-md text-[11.5px] text-on-surface-variant uppercase tracking-widest font-semibold w-5/12">Capability vs Required</th>
                <th className="py-3 px-4 font-label-md text-[11.5px] text-on-surface-variant uppercase tracking-widest font-semibold text-center">Gap</th>
                <th className="py-3 px-4 font-label-md text-[11.5px] text-on-surface-variant uppercase tracking-widest font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ece4d6]">
              {developmentGaps.filter(g => g.source !== 'area_of_interest').map((gapItem) => {
                const { competency, capability, required, gap, status } = gapItem;
                
                let statusColor = "bg-teal-brand-container text-teal-brand-dark border-teal-brand/30";
                let statusText = "Competent";
                let barColor = "bg-teal-brand";
                let gapColor = "text-teal-brand";
                
                if (status === 'HIGH PRIORITY') {
                  statusColor = "bg-terracotta-container text-terracotta-dark border-terracotta/30";
                  statusText = "High Priority";
                  barColor = "bg-terracotta";
                  gapColor = "text-terracotta";
                } else if (status === 'PRIORITY') {
                  statusColor = "bg-saffron-container text-saffron-dark border-saffron/40";
                  statusText = "Priority";
                  barColor = "bg-saffron";
                  gapColor = "text-saffron-dark";
                } else if (status === 'DEVELOPING') {
                  statusColor = "bg-secondary-container text-on-secondary-container border-secondary/30";
                  statusText = "Developing";
                  barColor = "bg-secondary";
                  gapColor = "text-secondary";
                }
                
                return (
                  <tr key={competency} className="hover:bg-surface-container-low/60 transition-colors group">
                    <td className={`py-4 px-4 font-display-md text-[19px] text-primary transition-colors font-normal`}>
                      {competency}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3 w-full">
                        <span className="font-mono-data text-[13px] text-on-surface-variant w-7 text-right font-medium">
                          {capability}
                        </span>

                        <div className="flex-1 h-2.5 bg-[#ede4d7] rounded-full overflow-hidden flex">
                          <div
                            className={`${barColor} h-full ${gap > 0 ? 'rounded-l-full' : 'rounded-full'}`}
                            style={{ width: `${Math.min(100, capability)}%` }}
                          ></div>

                          {gap > 0 && (
                            <div
                              className={`${barColor}-container h-full opacity-30`}
                              style={{ width: `${Math.min(100, gap)}%` }}
                            ></div>
                          )}
                        </div>

                        <span className="font-mono-data text-[11px] text-on-surface-variant/70">
                          {required}
                        </span>
                      </div>
                    </td>

                    <td className={`py-4 px-4 text-center font-mono-data text-[13.5px] ${gapColor} font-bold`}>
                      {gap} pts
                    </td>

                    <td className="py-4 px-4 text-right">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full ${statusColor} border font-label-md text-[11px] uppercase tracking-wider font-bold whitespace-nowrap`}
                      >
                        {statusText}
                      </span>
                    </td>
                  </tr>
                );
              })}
              
              {developmentGaps.filter(g => g.source !== 'area_of_interest').length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-on-surface-variant font-body-md">
                    No capability data available for this assessment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* RECOMMENDED FOR YOU SECTION */}
      <div className="bg-surface-container-lowest p-7 border border-[#ded5c6] rounded-xl flex flex-col gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#ece4d6]">
          <div>
            <h2 className="font-display-md text-[26px] font-normal text-primary">Recommended for You</h2>
            <p className="font-body-md text-[13px] text-on-surface-variant mt-0.5">Courses suggested by AI to address your identified development gaps</p>
          </div>
        </div>

        {(!safeResult.recommendations || safeResult.recommendations.length === 0) ? (
          <div className="py-10 text-center flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-[40px] text-on-surface-variant/50">school</span>
            <p className="font-display-md text-[18px] text-primary">No recommendations available yet.</p>
            <p className="font-body-md text-[14px] text-on-surface-variant max-w-md mx-auto">
              Your assessment is complete, but there are currently no suitable courses for your identified development gaps.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {safeResult.recommendations.map((course, idx) => (
              <CourseCard key={idx} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
