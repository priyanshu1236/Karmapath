import React, { useState, useEffect } from 'react';

export default function TrainingEffectiveness() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedRole, setSelectedRole] = useState('All Roles');

  const fetchDashboardData = async (role) => {
    setLoading(true);
    setError(null);
    try {
      const url = role !== 'All Roles' 
        ? `http://localhost:8000/api/admin/resource-dashboard?role=${encodeURIComponent(role)}`
        : `http://localhost:8000/api/admin/resource-dashboard`;
        
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch training data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedRole);
  }, [selectedRole]);

  if (loading && !data) {
    return (
      <div className="flex w-full h-full items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-teal-brand/30 border-t-teal-brand rounded-full animate-spin"></div>
          <p className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant font-bold">Loading Analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full h-full items-center justify-center pt-20">
        <div className="bg-terracotta/10 p-6 rounded-xl border border-terracotta/20 text-center max-w-md">
          <span className="material-symbols-outlined text-[32px] text-terracotta mb-2">error</span>
          <h3 className="font-headline-md text-lg text-primary mb-2">Failed to load data</h3>
          <p className="font-body-md text-sm text-on-surface-variant mb-4">{error}</p>
          <button onClick={() => fetchDashboardData(selectedRole)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">Retry</button>
        </div>
      </div>
    );
  }

  const { kpis, resource_performance, competency_performance, needs_attention } = data;
  
  // Exclude resources with zero attempts for visualizations that require it
  const activeResources = resource_performance.filter(r => r.total_attempts > 0);
  
  // Calculate participation rate across the displayed resources
  let totalEligible = 0;
  let totalAttempted = 0;
  resource_performance.forEach(r => {
    totalEligible += r.eligible_employees;
    totalAttempted += r.attempted_count;
  });
  const overallParticipation = totalEligible > 0 ? ((totalAttempted / totalEligible) * 100).toFixed(1) : 0;
  
  // Sort resources by average score for "Most Effective"
  const topResources = [...activeResources].sort((a, b) => b.average_score - a.average_score).slice(0, 5);

  const getStatusDisplay = (score) => {
    if (score >= 80) return { label: 'Effective', color: 'bg-teal-brand/10 text-teal-brand' };
    if (score >= 60) return { label: 'Moderate', color: 'bg-saffron/15 text-[#9c5e00]' };
    return { label: 'Needs Review', color: 'bg-terracotta/10 text-terracotta' };
  };

  return (
    <div className="flex flex-col w-full pb-16 bg-background">
      {/* HEADER */}
      <div className="px-6 lg:px-8 py-8 border-b border-outline-variant/30 bg-surface">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div>
            <h2 className="font-headline-lg text-[32px] md:text-[38px] leading-tight text-primary tracking-tight">Training Effectiveness</h2>
            <p className="font-body-md text-on-surface-variant mt-2 max-w-2xl text-base">
              Measure employee participation and assessment performance across training resources.
            </p>
          </div>
          
          <div className="flex flex-col gap-2 min-w-[200px]">
            <label className="font-label-md text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">Filter by Role</label>
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-2.5 font-body-sm text-sm text-primary focus:outline-none focus:ring-2 focus:ring-teal-brand/50 transition-all"
            >
              <option value="All Roles">All Roles</option>
              <option value="College / University Faculty">Faculty</option>
              <option value="Statistical Officer">Statistical Officer</option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-8 py-8 space-y-8">
        
        {/* SUMMARY METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 flex flex-col">
            <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-2">Employees Trained</p>
            <p className="font-display-md text-4xl text-primary">{kpis.employees_assessed}</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 flex flex-col">
            <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-2">Resources Evaluated</p>
            <p className="font-display-md text-4xl text-primary">{activeResources.length}</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 flex flex-col">
            <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-2">Average Training Score</p>
            <p className="font-display-md text-4xl text-teal-brand">{kpis.average_score > 0 ? `${kpis.average_score}%` : '—'}</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 flex flex-col">
            <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-2">Participation Rate</p>
            <p className="font-display-md text-4xl text-primary">{overallParticipation > 0 ? `${overallParticipation}%` : '—'}</p>
          </div>
        </div>
        
        {resource_performance.length === 0 ? (
          <div className="p-16 text-center bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
             <span className="material-symbols-outlined text-[48px] text-outline mb-4">analytics</span>
             <p className="font-body-lg text-lg text-primary font-bold mb-2">No training assessment results yet</p>
             <p className="font-body-md text-on-surface-variant">There is no data available for the selected filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* TRAINING PERFORMANCE BY RESOURCE */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 flex flex-col">
                <h3 className="font-headline-md text-lg text-primary font-bold mb-1">Training Performance by Resource</h3>
                <p className="font-body-sm text-xs text-on-surface-variant mb-6">Average score for each uploaded resource.</p>
                
                {activeResources.length > 0 ? (
                  <div className="flex flex-col gap-5">
                    {activeResources.map((res, idx) => (
                      <div key={idx} className="flex flex-col gap-1">
                        <div className="flex justify-between items-end">
                           <span className="font-body-sm text-[13px] font-medium text-primary truncate max-w-[80%]" title={res.title}>{res.title}</span>
                           <span className="font-mono-data text-[13px] font-bold text-primary">{res.average_score}%</span>
                        </div>
                        <div className="w-full relative h-3 bg-surface-container rounded-sm overflow-hidden flex items-center">
                          <div 
                            className={`h-full ${res.average_score < 60 ? 'bg-terracotta' : 'bg-teal-brand'}`} 
                            style={{ width: `${res.average_score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center py-10">
                    <p className="text-sm text-on-surface-variant italic">No assessment data available.</p>
                  </div>
                )}
              </div>
              
              {/* TRAINING PERFORMANCE BY COMPETENCY */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 flex flex-col">
                <h3 className="font-headline-md text-lg text-primary font-bold mb-1">Training Performance by Competency</h3>
                <p className="font-body-sm text-xs text-on-surface-variant mb-6">Average score grouped by competency area.</p>
                
                {competency_performance.filter(c => c.total_attempts > 0).length > 0 ? (
                  <div className="flex flex-col gap-5">
                    {competency_performance.filter(c => c.total_attempts > 0).map((comp, idx) => (
                      <div key={idx} className="flex flex-col gap-1">
                        <div className="flex justify-between items-end">
                           <span className="font-body-sm text-[13px] font-medium text-primary truncate max-w-[80%]" title={comp.competency}>{comp.competency}</span>
                           <span className="font-mono-data text-[13px] font-bold text-primary">{comp.average_score}%</span>
                        </div>
                        <div className="w-full relative h-3 bg-surface-container rounded-sm overflow-hidden flex items-center">
                          <div 
                            className={`h-full ${comp.average_score < 60 ? 'bg-terracotta' : 'bg-[#6b7b99]'}`} 
                            style={{ width: `${comp.average_score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center py-10">
                    <p className="text-sm text-on-surface-variant italic">No competency data available.</p>
                  </div>
                )}
              </div>
            </div>

            {/* EMPLOYEE PARTICIPATION */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 flex flex-col">
               <h3 className="font-headline-md text-lg text-primary font-bold mb-1">Employee Participation</h3>
               <p className="font-body-sm text-xs text-on-surface-variant mb-6">Analyze resource engagement and completion rates.</p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {resource_performance.map((res, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-lg border border-outline-variant/30 shadow-sm flex flex-col">
                       <p className="font-body-sm text-sm font-bold text-primary truncate mb-3" title={res.title}>{res.title}</p>
                       
                       <div className="flex justify-between items-center mb-1 text-[11px] uppercase tracking-wider font-label-md text-on-surface-variant">
                          <span>Participation</span>
                          <span className="font-bold text-primary">{res.participation_rate}%</span>
                       </div>
                       <div className="w-full h-2 bg-surface-container rounded-sm overflow-hidden mb-2">
                          <div className="h-full bg-teal-brand" style={{ width: `${res.participation_rate}%` }}></div>
                       </div>
                       <p className="text-[12px] text-on-surface-variant font-medium mb-4">{res.attempted_count} / {res.eligible_employees} employees</p>
                       
                       <div className="flex justify-between items-center border-t border-outline-variant/20 pt-3">
                          <span className="text-[12px] font-medium text-on-surface-variant">Completed Assessments</span>
                          <span className="font-mono-data text-[13px] font-bold text-primary">{res.completed_count}</span>
                       </div>
                    </div>
                 ))}
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               
               {/* MOST EFFECTIVE TRAINING */}
               <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 flex flex-col">
                  <h3 className="font-headline-md text-lg text-primary font-bold mb-4">Most Effective Training</h3>
                  
                  {topResources.length > 0 ? (
                     <div className="flex flex-col gap-4">
                        {topResources.map((res, idx) => (
                           <div key={idx} className="flex items-center gap-4 bg-surface-container-low/50 p-4 rounded-lg border border-outline-variant/20">
                              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-on-surface-variant shrink-0">
                                 0{idx + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <p className="font-body-sm text-sm font-bold text-primary truncate" title={res.title}>{res.title}</p>
                                 <p className="text-[11px] text-on-surface-variant mt-0.5">{res.average_score}% average · {res.completed_count} completed assessments</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <p className="text-sm text-on-surface-variant italic">No data to determine effectiveness.</p>
                  )}
               </div>

               {/* TRAINING REQUIRING REVIEW */}
               <div className="bg-terracotta/5 rounded-xl border border-terracotta/20 p-6 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                     <span className="material-symbols-outlined text-terracotta text-[20px]">warning</span>
                     <h3 className="font-headline-md text-lg text-terracotta font-bold">Training Requiring Review</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant mb-4">Resources with average scores below 60%. Consider reviewing the content or providing additional support.</p>
                  
                  {needs_attention.length > 0 ? (
                     <div className="flex flex-col gap-4">
                        {needs_attention.map((res, idx) => (
                           <div key={idx} className="bg-white p-4 rounded-lg border border-terracotta/30 shadow-sm">
                              <p className="font-body-md text-sm font-bold text-primary truncate mb-2" title={res.title}>{res.title}</p>
                              <p className="font-mono-data text-terracotta font-bold text-[13px] mb-1">Average score: {res.average_score}%</p>
                              <div className="flex justify-between items-center text-[12px] text-on-surface-variant">
                                 <span>{res.completed_count} completed assessments</span>
                                 <span>Participation: {res.participation_rate}%</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="flex-1 flex items-center justify-center">
                        <p className="text-sm text-on-surface-variant">No resources currently require review.</p>
                     </div>
                  )}
               </div>
            </div>

            {/* RESOURCE EFFECTIVENESS TABLE */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden">
               <div className="p-5 border-b border-outline-variant/30 flex justify-between items-center">
                  <h3 className="font-headline-md text-lg text-primary font-bold">Resource Effectiveness</h3>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-label-md">Status: 80%+ Effective | 60-79% Moderate | &lt;60% Needs Review</p>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                     <thead className="bg-surface-container-low border-b border-outline-variant/30">
                        <tr>
                           <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant">Training Resource</th>
                           <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant text-right">Employees</th>
                           <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant text-right">Participation</th>
                           <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant text-right">Completed</th>
                           <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant text-right">Avg. Score</th>
                           <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-outline-variant/20">
                        {resource_performance.map((res, idx) => {
                           const status = getStatusDisplay(res.average_score);
                           return (
                              <tr key={idx} className="hover:bg-surface-container-lowest/60">
                                 <td className="py-3 px-4 font-body-sm text-[13px] font-bold text-primary max-w-[200px] truncate" title={res.title}>{res.title}</td>
                                 <td className="py-3 px-4 font-mono-data text-[13px] text-primary text-right">{res.eligible_employees}</td>
                                 <td className="py-3 px-4 font-mono-data text-[13px] text-primary text-right">{res.participation_rate}%</td>
                                 <td className="py-3 px-4 font-mono-data text-[13px] text-primary text-right">{res.completed_count}</td>
                                 <td className="py-3 px-4 font-mono-data text-[13px] font-bold text-primary text-right">{res.total_attempts > 0 ? `${res.average_score}%` : '—'}</td>
                                 <td className="py-3 px-4">
                                    {res.total_attempts > 0 ? (
                                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${status.color}`}>
                                          {status.label}
                                       </span>
                                    ) : (
                                       <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-surface-container-high text-on-surface-variant">
                                          No Data
                                       </span>
                                    )}
                                 </td>
                              </tr>
                           )
                        })}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* CAPABILITY IMPROVEMENT - INFORMATIONAL STATE */}
            <div className="bg-[#f8f9fa] rounded-xl border border-dashed border-outline-variant/60 p-6 flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">insights</span>
               </div>
               <div>
                  <h3 className="font-headline-md text-[15px] text-primary font-bold mb-1">Capability Improvement</h3>
                  <p className="text-[13px] text-on-surface-variant leading-relaxed">
                     Capability improvement tracking will appear after pre- and post-training reassessments are available. Current scores reflect post-training evaluations without a direct pre-training baseline.
                  </p>
               </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
}
