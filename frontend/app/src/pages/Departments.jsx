import React, { useState, useEffect } from 'react';

export default function Departments() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/admin/department-dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch department data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex w-full h-full items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-teal-brand/30 border-t-teal-brand rounded-full animate-spin"></div>
          <p className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant font-bold">Loading Departments...</p>
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
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">Retry</button>
        </div>
      </div>
    );
  }

  const { kpis, departments } = data;
  
  // Find departments that need attention
  const attentionDepartments = departments.filter(d => d.status === 'Priority' || d.participation < 50);

  const getStatusDisplay = (status) => {
    if (status === 'On Track') return { label: 'On Track', color: 'bg-teal-brand/10 text-teal-brand' };
    if (status === 'Monitor') return { label: 'Monitor', color: 'bg-saffron/15 text-[#9c5e00]' };
    return { label: 'Priority', color: 'bg-terracotta/10 text-terracotta' };
  };

  return (
    <div className="flex flex-col w-full pb-16 bg-background">
      {/* HEADER */}
      <div className="px-6 lg:px-8 py-8 border-b border-outline-variant/30 bg-surface">
        <div className="flex flex-col gap-2">
          <h2 className="font-headline-lg text-[32px] md:text-[38px] leading-tight text-primary tracking-tight">Departments</h2>
          <p className="font-body-md text-on-surface-variant max-w-2xl text-base">
            Monitor workforce capability, assessment participation, and training needs across departments.
          </p>
        </div>
      </div>

      <div className="px-6 lg:px-8 py-8 space-y-10">
        
        {/* SUMMARY METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 flex flex-col">
            <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-2">Total Departments</p>
            <p className="font-display-md text-4xl text-primary">{kpis.total_departments}</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 flex flex-col">
            <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-2">Total Employees</p>
            <p className="font-display-md text-4xl text-primary">{kpis.total_employees}</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 flex flex-col">
            <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-2">Average Capability</p>
            <p className="font-display-md text-4xl text-on-surface-variant">
              {kpis.avg_capability !== null ? `${kpis.avg_capability}%` : '—'}
            </p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 flex flex-col">
            <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-2">Training Participation</p>
            <p className="font-display-md text-4xl text-teal-brand">{kpis.training_participation}%</p>
          </div>
        </div>

        {/* DEPARTMENT CAPABILITY CHART */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-8">
          <h3 className="font-headline-md text-xl text-primary font-bold mb-2">Department Capability</h3>
          <p className="font-body-sm text-sm text-on-surface-variant mb-8">
            Average training scores by department against the 80% organizational benchmark.
          </p>
          
          <div className="relative">
            {/* 80% Benchmark Line */}
            <div className="absolute top-0 bottom-0 left-[80%] border-l-2 border-dashed border-teal-brand/50 z-10 hidden sm:block">
               <div className="absolute -top-6 -left-4 text-[10px] font-bold text-teal-brand whitespace-nowrap bg-surface-container-lowest px-1">80% BENCHMARK</div>
            </div>
            
            <div className="flex flex-col gap-6">
              {departments.map((dept, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
                  <div className="w-full sm:w-[220px] shrink-0 font-body-sm font-bold text-primary truncate" title={dept.name}>
                    {dept.name}
                  </div>
                  
                  <div className="flex-1 w-full relative h-6 bg-surface-container rounded-sm overflow-hidden flex items-center">
                    <div 
                      className={`h-full ${dept.training_score < 60 ? 'bg-terracotta' : dept.training_score < 80 ? 'bg-[#9c5e00]' : 'bg-teal-brand'}`} 
                      style={{ width: `${dept.training_score}%` }}
                    ></div>
                    <span className="absolute left-3 text-xs font-bold text-white mix-blend-difference">{dept.training_score > 0 ? `${dept.training_score}%` : 'No Data'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DEPARTMENT OVERVIEW TABLE & TRAINING PARTICIPATION */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-outline-variant/30">
               <h3 className="font-headline-md text-lg text-primary font-bold">Department Overview</h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-surface-container-low border-b border-outline-variant/30">
                     <tr>
                        <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant">Department</th>
                        <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant text-right">Employees</th>
                        <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant text-right">Assessed</th>
                        <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant text-right">Participation</th>
                        <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant text-right">Avg. Capability</th>
                        <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant text-right">Training Score</th>
                        <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant">Priority</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                     {departments.map((dept, idx) => {
                        const status = getStatusDisplay(dept.status);
                        return (
                           <tr 
                             key={idx} 
                             onClick={() => setSelectedDept(dept)}
                             className={`hover:bg-surface-container-lowest/60 cursor-pointer transition-colors ${selectedDept?.name === dept.name ? 'bg-surface-container-low/50' : ''}`}
                           >
                              <td className="py-3 px-4 font-body-sm text-[13px] font-bold text-primary">{dept.name}</td>
                              <td className="py-3 px-4 font-mono-data text-[13px] text-primary text-right">{dept.employees}</td>
                              <td className="py-3 px-4 font-mono-data text-[13px] text-primary text-right">{dept.assessed}</td>
                              <td className="py-3 px-4 font-mono-data text-[13px] text-primary text-right">{dept.participation}%</td>
                              <td className="py-3 px-4 font-mono-data text-[13px] text-on-surface-variant text-right">{dept.avg_capability !== null ? `${dept.avg_capability}%` : '—'}</td>
                              <td className="py-3 px-4 font-mono-data text-[13px] font-bold text-primary text-right">{dept.training_score > 0 ? `${dept.training_score}%` : '—'}</td>
                              <td className="py-3 px-4">
                                 <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${status.color}`}>
                                    {status.label}
                                 </span>
                              </td>
                           </tr>
                        )
                     })}
                  </tbody>
               </table>
            </div>
            <div className="p-4 bg-surface-container-low/30 border-t border-outline-variant/30 text-xs text-on-surface-variant text-center italic">
               Click a department row to view detailed competency and training breakdown.
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 flex flex-col">
             <h3 className="font-headline-md text-lg text-primary font-bold mb-1">Training Participation by Department</h3>
             <p className="font-body-sm text-xs text-on-surface-variant mb-6">Assessed vs not assessed employees.</p>
             
             <div className="flex flex-col gap-6">
                {departments.map((dept, idx) => (
                   <div key={idx} className="flex flex-col gap-2">
                      <div className="flex justify-between items-end">
                         <span className="font-body-sm text-[13px] font-medium text-primary">{dept.name}</span>
                         <span className="font-mono-data text-[12px] text-on-surface-variant">{dept.assessed} / {dept.employees} assessed</span>
                      </div>
                      <div className="w-full relative h-3 bg-surface-container rounded-sm overflow-hidden flex items-center">
                         <div 
                            className="h-full bg-[#6b7b99]" 
                            style={{ width: `${dept.participation}%` }}
                         ></div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* DEPARTMENTS REQUIRING ATTENTION */}
          <div className="lg:col-span-1 bg-terracotta/5 rounded-xl border border-terracotta/20 p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
               <span className="material-symbols-outlined text-terracotta text-[20px]">warning</span>
               <h3 className="font-headline-md text-lg text-terracotta font-bold">Departments Requiring Attention</h3>
            </div>
            
            {attentionDepartments.length > 0 ? (
               <div className="flex flex-col gap-4">
                  {attentionDepartments.map((dept, idx) => (
                     <div key={idx} className="bg-white p-4 rounded-lg border border-terracotta/30 shadow-sm">
                        <p className="font-body-md text-sm font-bold text-primary mb-2">{dept.name}</p>
                        <div className="flex flex-col gap-1 text-[13px] text-on-surface-variant font-mono-data mb-3">
                           <span>Training score: <span className={`${dept.training_score < 60 ? 'text-terracotta font-bold' : ''}`}>{dept.training_score}%</span></span>
                           <span>Training participation: <span className={`${dept.participation < 50 ? 'text-terracotta font-bold' : ''}`}>{dept.participation}%</span></span>
                        </div>
                        <p className="text-[12px] font-bold text-terracotta uppercase tracking-wider">High development need</p>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="flex-1 flex items-center justify-center py-10">
                  <p className="text-sm text-on-surface-variant">No departments require immediate attention.</p>
               </div>
            )}
          </div>
          
          {/* SELECTED DEPARTMENT DETAIL */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm p-6 lg:p-8 min-h-[400px]">
            {!selectedDept ? (
               <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
                  <span className="material-symbols-outlined text-[48px] text-outline mb-4">account_tree</span>
                  <h3 className="font-headline-md text-lg text-primary font-bold mb-2">Select a Department</h3>
                  <p className="text-sm text-on-surface-variant max-w-sm">
                    Click on any department in the overview table above to view its capability strengths, gaps, and training performance.
                  </p>
               </div>
            ) : (
               <div className="flex flex-col h-full animate-in fade-in duration-300">
                  <div className="flex items-start justify-between border-b border-outline-variant/30 pb-6 mb-6">
                     <div>
                        <h3 className="font-display text-2xl text-primary font-bold mb-1">{selectedDept.name}</h3>
                        <p className="font-label-md text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">
                           Role Mapping: {selectedDept.role}
                        </p>
                     </div>
                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider ${getStatusDisplay(selectedDept.status).color}`}>
                        {getStatusDisplay(selectedDept.status).label}
                     </span>
                  </div>
                  
                  {/* Snapshot Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                     <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Employees</span>
                        <span className="font-mono-data text-xl text-primary">{selectedDept.employees}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Participation</span>
                        <span className="font-mono-data text-xl text-primary">{selectedDept.participation}%</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Avg Capability</span>
                        <span className="font-mono-data text-xl text-on-surface-variant">{selectedDept.avg_capability !== null ? `${selectedDept.avg_capability}%` : '—'}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Avg Training Score</span>
                        <span className="font-mono-data text-xl text-primary">{selectedDept.training_score}%</span>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                     {/* Strengths */}
                     <div className="flex flex-col gap-3">
                        <h4 className="font-headline-md text-[15px] font-bold text-primary flex items-center gap-2">
                           <span className="material-symbols-outlined text-[18px] text-teal-brand">trending_up</span>
                           Top Strengths
                        </h4>
                        {selectedDept.top_strengths.length > 0 ? (
                           <div className="flex flex-col gap-2">
                              {selectedDept.top_strengths.map((comp, i) => (
                                 <div key={i} className="flex justify-between items-center text-sm p-2 bg-teal-brand/5 rounded border border-teal-brand/10">
                                    <span className="font-medium text-primary truncate pr-4">{comp.competency}</span>
                                    <span className="font-mono-data font-bold text-teal-brand">{comp.average_score}%</span>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <p className="text-xs text-on-surface-variant italic">No competency data available.</p>
                        )}
                     </div>
                     
                     {/* Development Needs */}
                     <div className="flex flex-col gap-3">
                        <h4 className="font-headline-md text-[15px] font-bold text-primary flex items-center gap-2">
                           <span className="material-symbols-outlined text-[18px] text-terracotta">trending_down</span>
                           Top Development Needs
                        </h4>
                        {selectedDept.top_needs.length > 0 ? (
                           <div className="flex flex-col gap-2">
                              {selectedDept.top_needs.map((comp, i) => (
                                 <div key={i} className="flex justify-between items-center text-sm p-2 bg-terracotta/5 rounded border border-terracotta/10">
                                    <span className="font-medium text-primary truncate pr-4">{comp.competency}</span>
                                    <span className="font-mono-data font-bold text-terracotta">{comp.average_score}%</span>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <p className="text-xs text-on-surface-variant italic">No competency data available.</p>
                        )}
                     </div>
                  </div>
                  
                  {/* Training Performance by Department */}
                  <div className="mt-auto">
                     <h4 className="font-headline-md text-[15px] font-bold text-primary mb-4 border-b border-outline-variant/30 pb-2">
                        Training Performance
                     </h4>
                     {selectedDept.resource_performance.length > 0 ? (
                        <div className="flex flex-col gap-3">
                           {selectedDept.resource_performance.map((res, i) => (
                              <div key={i} className="flex justify-between items-center p-3 border border-outline-variant/40 rounded-lg hover:bg-surface-container-lowest transition-colors">
                                 <div className="flex flex-col min-w-0 pr-4">
                                    <span className="font-body-sm font-bold text-primary truncate text-sm">{res.title}</span>
                                    <span className="text-[11px] text-on-surface-variant mt-0.5">{res.attempted_count} employees · {res.completed_count} completed assessments</span>
                                 </div>
                                 <div className="flex flex-col items-end shrink-0">
                                    <span className="font-mono-data font-bold text-[15px] text-primary">{res.average_score}%</span>
                                 </div>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <p className="text-sm text-on-surface-variant italic">No training activity recorded for this department.</p>
                     )}
                  </div>
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
