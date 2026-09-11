import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AiAssessment() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: "Guest", role: "Unknown", domain: "Unknown", employee_id: "" };

  const resultStr = localStorage.getItem('assessment_result');
  const result = resultStr ? JSON.parse(resultStr) : null;
  const initialCompleted = !!result;

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const url = user.employee_id ? `/api/resources/available?employee_id=${encodeURIComponent(user.employee_id)}` : '/api/resources/available';
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setResources(data.resources || []);
        }
      } catch (err) {
        console.error("Failed to fetch available resources", err);
      } finally {
        setResourcesLoading(false);
      }
    };
    fetchResources();
  }, [user.employee_id]);

  return (
    <div className="flex flex-col w-full p-8 max-w-7xl mx-auto gap-8">
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display-md text-headline-lg md:text-[34px] text-on-surface tracking-tight">Assessment Panel</h2>
        <p className="font-body-lg text-body-md md:text-body-lg text-on-surface-variant">Complete your initial assessment and explore learning resource assessments.</p>
      </div>

      {/* INITIAL COMPETENCY ASSESSMENT */}
      <div className="bg-surface-container-lowest p-7 border border-[#ded5c6] rounded-xl flex flex-col gap-5 shadow-sm">
        <div className="flex items-center gap-3 border-b border-[#ece4d6] pb-3">
          <span className="material-symbols-outlined text-primary text-[24px]">assignment_turned_in</span>
          <h3 className="font-display-md text-[20px] font-normal text-primary">Initial Competency Assessment</h3>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-body-md text-[14px] text-on-surface-variant">Base assessment for your role and domain</span>
            {initialCompleted ? (
              <span className="mt-2 text-[12px] font-bold text-teal-brand uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span> Completed
              </span>
            ) : (
              <span className="mt-2 text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">
                Not Completed
              </span>
            )}
          </div>
          <button 
            onClick={() => navigate('/employee/take-assessment')}
            className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${
              initialCompleted 
                ? "bg-surface-container text-on-surface border border-outline-variant hover:bg-surface-variant" 
                : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            {initialCompleted ? 'View Assessment' : 'Start Assessment'}
            {!initialCompleted && <span className="material-symbols-outlined text-[16px]">arrow_forward</span>}
          </button>
        </div>
      </div>

      {/* AREA OF INTEREST ASSESSMENT */}
      {result?.interest_assessment && (
        <div className="bg-surface-container-lowest p-7 border border-[#ded5c6] rounded-xl flex flex-col gap-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#ece4d6] pb-3">
            <span className="material-symbols-outlined text-primary text-[24px]">psychology</span>
            <h3 className="font-display-md text-[20px] font-normal text-primary">Area of Interest Assessment</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-body-md text-[14px] text-on-surface-variant">Targeted capability assessment for {result.interest_assessment.area_of_interest}</span>
              <span className="mt-2 text-[12px] font-bold text-teal-brand uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span> Completed
              </span>
            </div>
            <button 
              onClick={() => navigate('/employee/take-assessment')}
              className="px-5 py-2.5 bg-surface-container text-on-surface border border-outline-variant rounded-lg font-bold text-sm hover:bg-surface-variant transition-colors"
            >
              Retake Assessment
            </button>
          </div>
        </div>
      )}

      {/* LEARNING RESOURCE ASSESSMENTS */}
      <div className="bg-surface-container-lowest p-7 border border-[#ded5c6] rounded-xl flex flex-col gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#ece4d6]">
          <div>
            <h2 className="font-display-md text-[22px] font-normal text-primary">Learning Resource Assessments</h2>
            <p className="font-body-md text-[13px] text-on-surface-variant mt-0.5">Assessments generated from learning materials to improve your capability evidence</p>
          </div>
        </div>
        
        {resourcesLoading ? (
          <div className="py-8 text-center text-on-surface-variant text-sm font-medium">Loading resources...</div>
        ) : resources.length === 0 ? (
          <div className="text-center py-10 text-on-surface-variant border-2 border-dashed border-outline-variant/30 rounded-xl">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">menu_book</span>
            <p>No learning resource assessments are available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {resources.map((res) => (
              <div key={res.resource_id} className="bg-surface-container-low border border-outline-variant/50 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-brand/10 text-teal-brand flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">menu_book</span>
                    </div>
                    <span className="px-2 py-0.5 bg-surface-variant text-on-surface-variant rounded text-xs font-bold uppercase tracking-wider">
                      {res.question_count} Questions
                    </span>
                  </div>
                  <h3 className="font-display text-[18px] text-primary mb-1 line-clamp-2">{res.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-3 text-xs text-on-surface-variant">
                    {res.role && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">badge</span>
                        {res.role}
                      </span>
                    )}
                    {res.competency && res.competency !== 'RESOURCE' && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">category</span>
                        {res.competency}
                      </span>
                    )}
                  </div>
                  {res.history && (
                    <div className="mt-3 flex items-center gap-1.5 text-teal-brand font-medium text-xs bg-teal-brand/10 w-fit px-2 py-1 rounded">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Completed: {res.history.percentage}%
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/employee/resource-assessment/${res.resource_id}`)}
                  className="mt-6 w-full py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  {res.history ? 'Retake Assessment' : 'Start Assessment'}
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
