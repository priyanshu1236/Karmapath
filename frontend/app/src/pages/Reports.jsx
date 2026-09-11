import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Reports() {
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: "Guest Employee", role: "Unknown Role" };

  const resultStr = localStorage.getItem('assessment_result');
  const result = resultStr ? JSON.parse(resultStr) : null;

  // --- FALLBACK LOGIC ---
  const isFaculty = (result?.role || user.role || "").toLowerCase().includes('faculty');
  const roleName = result?.role || user.role || (isFaculty ? 'College / University Faculty' : 'Statistical Officer');

  // Generate role-specific mock data if real data is missing
  const getMockData = (faculty) => {
    if (faculty) {
      return {
        role_capability_profile: [
          { competency: 'Subject Knowledge & Explanation', capability: 90, required: 80, gap: 0, status: 'COMPETENT' },
          { competency: 'Classroom Teaching & Student Engagement', capability: 65, required: 80, gap: 15, status: 'PRIORITY' },
          { competency: 'Lesson & Course Planning', capability: 85, required: 80, gap: 0, status: 'COMPETENT' },
          { competency: 'Exams, Evaluation & Feedback', capability: 80, required: 80, gap: 0, status: 'COMPETENT' },
          { competency: 'Digital Tools for Teaching', capability: 46, required: 80, gap: 34, status: 'HIGH PRIORITY' },
          { competency: 'Research & Academic Work', capability: 75, required: 80, gap: 5, status: 'DEVELOPING' }
        ],
        interest_assessment: {
          area_of_interest: 'Educational Psychology',
          capability: 30,
          status: 'HIGH PRIORITY',
          competencies: [
            { competency: 'Educational Psychology', capability: 30, required: 80, gap: 50, status: 'HIGH PRIORITY' }
          ]
        },
        recommendations: [
          { title: 'Integrating EdTech in the Classroom', matched_competency: 'Digital Tools for Teaching', gap: 34, status: 'upcoming', reason: 'Addresses the identified competency gap.' },
          { title: 'Advanced Student Engagement', matched_competency: 'Classroom Teaching & Student Engagement', gap: 15, status: 'in_progress', reason: 'Addresses the identified competency gap.' },
          { title: 'Foundations of Ed Psych', matched_competency: 'Educational Psychology', gap: 50, status: 'upcoming', reason: 'Addresses the identified competency gap.' }
        ],
        development_gaps: [
          { competency: 'Digital Tools for Teaching', gap: 34, source: 'role_benchmark' },
          { competency: 'Classroom Teaching & Student Engagement', gap: 15, source: 'role_benchmark' },
          { competency: 'Educational Psychology', gap: 50, source: 'area_of_interest' },
          { competency: 'Research & Academic Work', gap: 5, source: 'role_benchmark' }
        ],
        date: new Date().toLocaleDateString()
      };
    } else {
      return {
        role_capability_profile: [
          { competency: 'Agricultural Statistics', capability: 85, required: 80, gap: 0, status: 'COMPETENT' },
          { competency: 'Survey Design', capability: 90, required: 80, gap: 0, status: 'COMPETENT' },
          { competency: 'Sampling', capability: 75, required: 80, gap: 5, status: 'DEVELOPING' },
          { competency: 'Data Quality', capability: 80, required: 80, gap: 0, status: 'COMPETENT' },
          { competency: 'GIS', capability: 45, required: 80, gap: 35, status: 'HIGH PRIORITY' },
          { competency: 'Python / Data Analysis', capability: 50, required: 80, gap: 30, status: 'HIGH PRIORITY' }
        ],
        interest_assessment: {
          area_of_interest: 'Cloud Computing',
          capability: 0,
          status: 'HIGH PRIORITY',
          competencies: [
            { competency: 'Cloud Computing', capability: 0, required: 80, gap: 80, status: 'HIGH PRIORITY' }
          ]
        },
        recommendations: [
          { title: 'GIS Fundamentals', matched_competency: 'GIS', gap: 35, status: 'upcoming', reason: 'Addresses the identified competency gap.' },
          { title: 'Python for Data Science', matched_competency: 'Python / Data Analysis', gap: 30, status: 'upcoming', reason: 'Addresses the identified competency gap.' },
          { title: 'AWS Cloud Practitioner', matched_competency: 'Cloud Computing', gap: 80, status: 'in_progress', reason: 'Addresses the identified competency gap.' }
        ],
        development_gaps: [
          { competency: 'Cloud Computing', gap: 80, source: 'area_of_interest' },
          { competency: 'GIS', gap: 35, source: 'role_benchmark' },
          { competency: 'Python / Data Analysis', gap: 30, source: 'role_benchmark' },
          { competency: 'Sampling', gap: 5, source: 'role_benchmark' }
        ],
        date: new Date().toLocaleDateString()
      };
    }
  };

  const safeResult = (result && result.role_capability_profile) ? result : getMockData(isFaculty);

  const capabilityProfile = safeResult.role_capability_profile || [];
  const interestAssessment = safeResult.interest_assessment || null;
  const recommendations = safeResult.recommendations || [];
  const gaps = safeResult.development_gaps || [];

  // Metrics Extraction
  let standardTotal = 0;
  let standardCorrect = 0;
  
  capabilityProfile.forEach(comp => {
    const qCount = comp.question_count || 3;
    standardTotal += qCount;
    standardCorrect += Math.round((comp.capability / 100) * qCount);
  });

  let overallTotal = standardTotal;
  let overallCorrect = standardCorrect;
  
  if (interestAssessment) {
    const iqCount = interestAssessment.question_count || 4;
    overallTotal += iqCount;
    overallCorrect += (interestAssessment.correct_count !== undefined ? interestAssessment.correct_count : Math.round((interestAssessment.capability / 100) * iqCount));
  }
  
  const overallPercentage = overallTotal > 0 ? Math.round((overallCorrect / overallTotal) * 100) : 
    (capabilityProfile.length > 0 ? Math.round(capabilityProfile.reduce((acc, comp) => acc + comp.capability, 0) / capabilityProfile.length) : 0);

  const prioritySkills = gaps.filter(g => g.gap >= 10 && g.source !== 'area_of_interest').length;
  
  // Executive Summary / Conclusion text generation
  let summaryText = "";
  if (capabilityProfile.length > 0) {
    const sortedComps = [...capabilityProfile].sort((a, b) => b.capability - a.capability);
    const strongest = sortedComps[0].competency;
    const weakestRoleGaps = gaps.filter(g => g.source !== 'area_of_interest').sort((a, b) => b.gap - a.gap);
    
    if (weakestRoleGaps.length > 0) {
      const w1 = weakestRoleGaps[0].competency.toLowerCase();
      const w2 = weakestRoleGaps.length > 1 ? ` and ${weakestRoleGaps[1].competency.toLowerCase()}` : '';
      summaryText = `The assessment indicates strong capability in ${strongest.toLowerCase()}, while further development is recommended in ${w1}${w2}. The identified development priorities should be addressed through the recommended learning resources and subsequent reassessment.`;
    } else {
      summaryText = `The assessment indicates strong overall capability, particularly in ${strongest.toLowerCase()}. The candidate meets or exceeds the required benchmark for all role competencies.`;
    }
  }

  // Development Priorities
  const topPriorities = gaps.filter(g => g.source !== 'area_of_interest').sort((a, b) => b.gap - a.gap).slice(0, 3);

  const handleDownload = () => {
    const originalTitle = document.title;
    const cleanName = (user.name || 'Employee').replace(/\s+/g, '_');
    const cleanRole = (roleName).replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
    document.title = `${cleanName}_${cleanRole}_Competency_Report`;
    window.print();
    document.title = originalTitle;
  };

  return (
    <>
      <style>
        {`
          @media print {
            @page {
              size: A4 portrait;
              margin: 20mm;
            }
            body {
              background: white;
              color: black;
            }
            .print\\:hidden {
              display: none !important;
            }
          }
        `}
      </style>
      
      <div className="flex flex-col w-full bg-[#f8f9fa] min-h-screen font-body text-gray-900 print:bg-white pb-20">
        
        {/* DOWNLOAD BUTTON (Hidden in Print) */}
        <div className="max-w-4xl mx-auto w-full px-6 pt-10 pb-4 print:hidden flex justify-end">
          <button 
            onClick={handleDownload}
            className="px-6 py-2 bg-black text-white rounded-sm text-sm font-bold shadow-md hover:bg-gray-800 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">download</span> Download Official Report (PDF)
          </button>
        </div>

        {/* OFFICIAL REPORT DOCUMENT */}
        <div className="max-w-4xl mx-auto w-full bg-white sm:border border-gray-300 sm:shadow-lg p-10 md:p-16 print:border-none print:shadow-none print:p-0">
          
          {/* 1. REPORT HEADER */}
          <div className="border-b-2 border-black pb-8 mb-8">
            <h1 className="font-display text-[26px] md:text-[32px] font-bold text-black uppercase tracking-tight leading-tight">
              Employee Competency Assessment Report
            </h1>
            <h2 className="font-body text-[16px] md:text-[18px] text-gray-700 mt-1 mb-8">
              Personalized Competency and Development Report
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-[14px]">
              <div className="flex justify-between sm:justify-start sm:gap-4">
                <span className="font-bold w-32">Employee Name:</span>
                <span>{user.name || 'Priyanshu Verma'}</span>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-4">
                <span className="font-bold w-32">Employee ID:</span>
                <span>{user.employee_id || 'EMP-2026-090'}</span>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-4">
                <span className="font-bold w-32">Role:</span>
                <span>{roleName}</span>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-4">
                <span className="font-bold w-32">Department:</span>
                <span>{user.department || 'Training & Development'}</span>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-4">
                <span className="font-bold w-32">Assessment Date:</span>
                <span>{safeResult.date || new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-4">
                <span className="font-bold w-32">Report Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* 3. ASSESSMENT BASIS & 4. EXECUTIVE SUMMARY */}
          <div className="mb-10 page-break-inside-avoid">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div>
                <h3 className="font-bold text-[16px] uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">Assessment Basis</h3>
                <ul className="list-disc list-inside text-[14px] leading-relaxed">
                  <li>Initial Capability Estimate</li>
                  {interestAssessment && <li>Area of Interest Assessment</li>}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[16px] uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">Assessment Summary</h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-[14px]">
                  <div className="flex flex-col">
                    <span className="text-gray-600 text-[12px] uppercase tracking-wider">Overall Score</span>
                    <span className="font-bold">{overallCorrect} / {overallTotal} Correct</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600 text-[12px] uppercase tracking-wider">Overall Capability</span>
                    <span className="font-bold">{overallPercentage}%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600 text-[12px] uppercase tracking-wider">Required Benchmark</span>
                    <span className="font-bold">80%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600 text-[12px] uppercase tracking-wider">Priority Competencies</span>
                    <span className="font-bold">{prioritySkills}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 5. COMPETENCY ASSESSMENT */}
          <div className="mb-10 page-break-inside-avoid">
            <h3 className="font-bold text-[16px] uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">Competency Assessment</h3>
            
            <table className="w-full text-left text-[14px] border-collapse">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="py-2 font-bold">Competency</th>
                  <th className="py-2 text-right font-bold w-20">Capability</th>
                  <th className="py-2 text-right font-bold w-20">Required</th>
                  <th className="py-2 text-right font-bold w-20">Gap</th>
                  <th className="py-2 text-right font-bold w-32">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {capabilityProfile.map((comp, idx) => {
                  const req = comp.required || 80;
                  const gap = req - comp.capability;
                  const displayGap = gap > 0 ? `${gap} pts` : '0';
                  const displayStatus = (comp.status || (gap > 0 ? 'Priority' : 'Competent')).replace('_', ' ');

                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-3 pr-4">{comp.competency}</td>
                      <td className="py-3 text-right">{comp.capability}%</td>
                      <td className="py-3 text-right">{req}%</td>
                      <td className="py-3 text-right">{displayGap}</td>
                      <td className="py-3 text-right capitalize">{displayStatus.toLowerCase()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 6. OVERALL COMPETENCY VISUALIZATION */}
          <div className="mb-10 page-break-inside-avoid">
            <h3 className="font-bold text-[16px] uppercase tracking-wider border-b border-gray-300 pb-2 mb-6">Competency Capability vs Required Benchmark</h3>
            
            <div className="flex flex-col gap-5 px-2">
              {capabilityProfile.map((comp, idx) => {
                const req = comp.required || 80;
                
                return (
                  <div key={idx} className="flex items-center gap-4 text-[13px]">
                    <div className="w-64 truncate" title={comp.competency}>{comp.competency}</div>
                    <div className="flex-1 relative h-4 bg-gray-100 border border-gray-200">
                      <div className="h-full bg-gray-600" style={{ width: `${Math.min(100, comp.capability)}%` }}></div>
                      
                      {/* 80% Benchmark Marker */}
                      <div className="absolute top-0 bottom-0 border-l-2 border-black z-10" style={{ left: `${req}%` }}></div>
                    </div>
                    <div className="w-10 text-right">{comp.capability}%</div>
                  </div>
                );
              })}
              <div className="flex justify-between items-center text-[11px] text-gray-500 mt-2 pl-64 pr-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-600"></div> Current Capability
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-px h-3 border-l-2 border-black"></div> 80% Benchmark
                </div>
              </div>
            </div>
          </div>

          {/* 7. AREA OF INTEREST */}
          {interestAssessment && (
            <div className="mb-10 page-break-inside-avoid">
              <h3 className="font-bold text-[16px] uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">Area of Interest</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[14px]">
                <div className="flex gap-2">
                  <span className="font-bold w-32">Area of Interest:</span>
                  <span>{interestAssessment.area_of_interest}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold w-32">Capability:</span>
                  <span>{interestAssessment.capability}%</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold w-32">Required:</span>
                  <span>80%</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold w-32">Gap:</span>
                  <span>{80 - interestAssessment.capability > 0 ? `${80 - interestAssessment.capability} pts` : '0'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold w-32">Status:</span>
                  <span className="capitalize">{(interestAssessment.status || 'Unknown').replace('_', ' ').toLowerCase()}</span>
                </div>
              </div>
            </div>
          )}

          {/* 8. DEVELOPMENT PRIORITIES */}
          <div className="mb-10 page-break-inside-avoid">
            <h3 className="font-bold text-[16px] uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">Development Priorities</h3>
            
            {topPriorities.length > 0 ? (
              <div className="flex flex-col gap-4 text-[14px]">
                {topPriorities.map((g, idx) => (
                  <div key={idx}>
                    <p className="font-bold">{idx + 1}. {g.competency}</p>
                    <p className="text-gray-700 ml-4">Gap: {g.gap} pts — Capitalize: {g.gap >= 20 ? 'High Priority' : 'Priority'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-gray-700">No critical development priorities identified. All competencies meet or exceed the required benchmark.</p>
            )}
          </div>

          {/* 9. RECOMMENDED DEVELOPMENT */}
          <div className="mb-10 page-break-inside-avoid">
            <h3 className="font-bold text-[16px] uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">Recommended Development</h3>
            
            {recommendations.length > 0 ? (
              <div className="flex flex-col gap-5 text-[14px]">
                {recommendations.slice(0, 5).map((rec, idx) => (
                  <div key={idx} className="ml-2">
                    <p className="font-bold underline mb-1">{rec.title || rec.course_title}</p>
                    <p><span className="font-bold text-gray-700">Related competency:</span> {rec.matched_competency}</p>
                    <p><span className="font-bold text-gray-700">Reason:</span> {rec.reason || 'Addresses the identified competency gap.'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-gray-700">No specific learning recommendations generated.</p>
            )}
          </div>

          {/* 10. CONCLUSION */}
          <div className="mb-16 page-break-inside-avoid">
            <h3 className="font-bold text-[16px] uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">Assessment Conclusion</h3>
            <p className="text-[14px] leading-relaxed text-gray-800 text-justify">
              {summaryText}
            </p>
          </div>

          {/* 11. OFFICIAL REPORT FOOTER */}
          <div className="pt-8 border-t-2 border-black page-break-inside-avoid">
            <div className="flex justify-between items-end mb-16">
              <div>
                <p className="font-bold text-[12px] uppercase">Generated by the Employee Competency &amp; Learning Platform</p>
                <p className="text-[12px] text-gray-600 mt-1">Report generated on: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-[14px]">
              <div>
                <div className="border-b border-black h-8 mb-2"></div>
                <p className="font-bold text-gray-700">Employee Signature</p>
              </div>
              <div>
                <div className="border-b border-black h-8 mb-2"></div>
                <p className="font-bold text-gray-700">Authorized Reviewer</p>
              </div>
              <div>
                <div className="border-b border-black h-8 mb-2"></div>
                <p className="font-bold text-gray-700">Date</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
