import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/admin/resource-dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
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
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-teal-brand/30 border-t-teal-brand rounded-full animate-spin"></div>
          <p className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant font-bold">Loading Intelligence...</p>
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
          <button onClick={fetchDashboardData} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">Retry</button>
        </div>
      </div>
    );
  }

  const { kpis, resource_performance, competency_performance, needs_attention, recent_activity } = data;

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-outline-variant/30 bg-surface">
        <div>
          <p className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant mb-1 font-semibold">Admin Overview</p>
          <h2 className="font-headline-lg text-[32px] md:text-[38px] leading-tight text-primary tracking-tight">Resource Intelligence</h2>
          <p className="font-body-md text-on-surface-variant mt-1 max-w-2xl">Monitor learning resource performance and employee assessment outcomes.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchDashboardData}
            className="bg-primary text-white px-4 py-2.5 rounded-lg font-label-md text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors flex items-center gap-2 shadow font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span> Refresh Data
          </button>
        </div>
      </div>

      <div className="px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. TOP SUMMARY KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 flex flex-col">
            <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-2">Uploaded Resources</p>
            <p className="font-display-md text-4xl text-primary">{kpis.uploaded_resources}</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 flex flex-col">
            <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-2">Total Resource Assessments</p>
            <p className="font-display-md text-4xl text-primary">{kpis.total_assessments}</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 flex flex-col">
            <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-2">Employees Assessed</p>
            <p className="font-display-md text-4xl text-primary">{kpis.employees_assessed}</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 flex flex-col">
            <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-2">Average Score</p>
            <p className="font-display-md text-4xl text-teal-brand">{kpis.average_score > 0 ? `${kpis.average_score}%` : '—'}</p>
          </div>
        </div>

        {kpis.total_assessments === 0 && kpis.uploaded_resources === 0 ? (
          <div className="p-12 text-center bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
            <span className="material-symbols-outlined text-[48px] text-outline mb-4">folder_off</span>
            <p className="font-body-lg text-lg text-primary font-bold mb-2">No resource activity yet</p>
            <p className="font-body-md text-on-surface-variant">Upload learning resources to generate quizzes and monitor employee assessments.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* 3. RESOURCE PERFORMANCE CHART */}
              <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 flex flex-col">
                <h3 className="font-headline-md text-lg text-primary font-bold mb-1">Average Score by Resource</h3>
                <p className="font-body-sm text-xs text-on-surface-variant mb-6">Performance across all employee attempts per resource.</p>
                
                {resource_performance.filter(r => r.total_attempts > 0).length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {resource_performance.filter(r => r.total_attempts > 0).map((res, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-1/3 truncate font-body-sm text-[13px] font-medium text-primary" title={res.title}>{res.title}</div>
                        <div className="flex-1 relative h-6 bg-surface-container rounded-sm overflow-hidden flex items-center">
                          <div 
                            className={`h-full ${res.average_score < 60 ? 'bg-terracotta' : 'bg-teal-brand'}`} 
                            style={{ width: `${res.average_score}%` }}
                          ></div>
                        </div>
                        <div className="w-12 text-right font-mono-data text-[14px] font-bold text-primary">{res.average_score}%</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center py-10">
                    <p className="text-sm text-on-surface-variant italic">No employee assessment attempts yet.</p>
                  </div>
                )}
              </div>

              {/* 6. NEEDS ATTENTION */}
              <div className="bg-terracotta/5 rounded-xl border border-terracotta/20 p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-terracotta text-[20px]">warning</span>
                  <h3 className="font-headline-md text-lg text-terracotta font-bold">Resources Needing Attention</h3>
                </div>
                
                {needs_attention.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {needs_attention.map((res, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-lg border border-terracotta/30 shadow-sm">
                        <p className="font-body-md text-sm font-bold text-primary truncate mb-1" title={res.title}>{res.title}</p>
                        <div className="flex items-center justify-between text-xs text-on-surface-variant">
                          <span className="font-mono-data text-terracotta font-bold">Avg score: {res.average_score}%</span>
                          <span>{res.total_attempts} attempts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center py-6 text-center">
                    <p className="text-sm text-on-surface-variant">All current resources are performing above the attention threshold.</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. RESOURCE PERFORMANCE TABLE */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden">
              <div className="p-5 border-b border-outline-variant/30">
                <h3 className="font-headline-md text-lg text-primary font-bold">Resource Performance</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead className="bg-surface-container-low border-b border-outline-variant/30">
                    <tr>
                      <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant">Resource</th>
                      <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant">Role</th>
                      <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant">Competency</th>
                      <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant text-right">Questions</th>
                      <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant text-right">Employees</th>
                      <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant text-right">Attempted</th>
                      <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant text-right">Completed</th>
                      <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant text-right">Not Attempted</th>
                      <th className="py-3 px-4 font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant text-right">Avg Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {resource_performance.length > 0 ? resource_performance.map((res, idx) => (
                      <tr key={idx} className="hover:bg-surface-container-lowest/60">
                        <td className="py-3 px-4 font-body-sm text-[13px] font-bold text-primary truncate max-w-[180px]" title={res.title}>{res.title}</td>
                        <td className="py-3 px-4 font-body-sm text-[12px] text-on-surface-variant truncate max-w-[120px]" title={res.role}>{res.role}</td>
                        <td className="py-3 px-4 font-body-sm text-[12px] text-on-surface-variant truncate max-w-[130px]" title={res.competency}>{res.competency}</td>
                        <td className="py-3 px-4 font-mono-data text-[13px] text-primary text-right">{res.question_count}</td>
                        <td className="py-3 px-4 font-mono-data text-[13px] text-primary text-right">{res.eligible_employees}</td>
                        <td className="py-3 px-4 font-mono-data text-[13px] text-primary text-right">{res.attempted_count}</td>
                        <td className="py-3 px-4 font-mono-data text-[13px] text-primary text-right">{res.completed_count}</td>
                        <td className="py-3 px-4 font-mono-data text-[13px] text-on-surface-variant text-right">{res.not_attempted}</td>
                        <td className="py-3 px-4 font-mono-data text-[13px] text-primary font-bold text-right">{res.total_attempts > 0 ? `${res.average_score}%` : '—'}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="9" className="py-8 text-center text-sm text-on-surface-variant italic">No uploaded resources found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* 4. COMPETENCY ANALYSIS */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden">
                <div className="p-5 border-b border-outline-variant/30">
                  <h3 className="font-headline-md text-lg text-primary font-bold mb-1">Performance by Competency</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">Aggregate results based on resource competency.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low border-b border-outline-variant/30">
                      <tr>
                        <th className="py-2.5 px-4 font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant">Competency</th>
                        <th className="py-2.5 px-4 font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant text-right">Resources</th>
                        <th className="py-2.5 px-4 font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant text-right">Attempts</th>
                        <th className="py-2.5 px-4 font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant text-right">Avg Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {competency_performance.length > 0 ? competency_performance.map((comp, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-4 font-body-sm text-[12px] font-semibold text-primary truncate max-w-[150px]" title={comp.competency}>{comp.competency}</td>
                          <td className="py-2.5 px-4 font-mono-data text-[12px] text-right">{comp.resources}</td>
                          <td className="py-2.5 px-4 font-mono-data text-[12px] text-right">{comp.total_attempts}</td>
                          <td className="py-2.5 px-4 font-mono-data text-[12px] text-right font-bold">{comp.total_attempts > 0 ? `${comp.average_score}%` : '—'}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4" className="py-6 text-center text-xs text-on-surface-variant italic">No data available.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. RECENT ASSESSMENT ACTIVITY */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden">
                <div className="p-5 border-b border-outline-variant/30">
                  <h3 className="font-headline-md text-lg text-primary font-bold mb-1">Recent Assessment Activity</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">Latest employee attempts on resource quizzes.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low border-b border-outline-variant/30">
                      <tr>
                        <th className="py-2.5 px-4 font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant">Employee</th>
                        <th className="py-2.5 px-4 font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant">Resource</th>
                        <th className="py-2.5 px-4 font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant text-right">Score</th>
                        <th className="py-2.5 px-4 font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {recent_activity.length > 0 ? recent_activity.map((act, idx) => {
                        const dateObj = new Date(act.date);
                        const displayDate = isNaN(dateObj) ? act.date : dateObj.toLocaleDateString();
                        return (
                          <tr key={idx}>
                            <td className="py-2.5 px-4 font-body-sm text-[12px] font-medium text-primary">{act.employee_id}</td>
                            <td className="py-2.5 px-4 font-body-sm text-[12px] text-on-surface-variant truncate max-w-[150px]" title={act.resource_title}>{act.resource_title}</td>
                            <td className="py-2.5 px-4 font-mono-data text-[12px] font-bold text-right ${act.score < 60 ? 'text-terracotta' : 'text-teal-brand'}">{act.score}%</td>
                            <td className="py-2.5 px-4 font-mono-data text-[11px] text-on-surface-variant text-right">{displayDate}</td>
                          </tr>
                        );
                      }) : (
                        <tr>
                          <td colSpan="4" className="py-6 text-center text-xs text-on-surface-variant italic">No recent activity.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </>
        )}
        
      </div>
    </div>
  );
}
