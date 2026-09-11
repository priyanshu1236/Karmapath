import { useNavigate } from 'react-router-dom';

export default function MyCompetencies() {
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const resultStr = localStorage.getItem('assessment_result');
  const result = resultStr ? JSON.parse(resultStr) : null;
  
  const hasAssessment = result !== null && result.role_capability_profile;

  if (!hasAssessment) {
    return (
      <div className="flex flex-col w-full p-8 gap-7 max-w-[1440px] mx-auto min-h-[calc(100vh-64px)]">
        <div className="bg-surface-container-lowest p-12 border border-outline-variant rounded-2xl flex flex-col items-center justify-center text-center gap-6 shadow-sm my-auto">
          <div className="w-20 h-20 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-[40px]">assignment</span>
          </div>
          <div className="max-w-md mx-auto">
            <h2 className="font-display-md text-[24px] text-primary mb-3">No Assessment Found</h2>
            <p className="font-body-md text-[15px] text-on-surface-variant mb-8">
              No competency assessment has been completed yet.<br/>Complete an assessment to generate your personalized profile.
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

  const developmentGaps = result.development_gaps || [];
  const interestAssessment = result.interest_assessment || null;
  
  const roleCompetencies = developmentGaps.filter(g => g.source !== 'area_of_interest');
  const areaOfInterestCompetencies = interestAssessment ? (interestAssessment.competencies || []) : [];

  const renderCompetencyCard = (compItem) => {
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
      <div key={competency} className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-5">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-display-md text-[18px] text-primary leading-tight">{competency}</h3>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full ${statusColor} border font-label-md text-[10px] uppercase tracking-wider font-bold whitespace-nowrap`}>
            {statusText}
          </span>
        </div>
        
        <div className="flex flex-col gap-4 bg-surface-container-low/30 p-4 rounded-lg border border-outline-variant/30">
          <div className="flex items-center justify-between text-sm">
            <span className="font-body-md text-on-surface-variant">Capability</span>
            <span className="font-mono-data font-bold text-primary text-[15px]">{capability}</span>
          </div>
          
          <div className="w-full h-3 bg-[#ede4d7] rounded-full overflow-hidden flex">
            <div className={`${barColor} h-full ${gap > 0 ? 'rounded-l-full' : 'rounded-full'}`} style={{ width: `${Math.min(100, capability)}%` }}></div>
            {gap > 0 && <div className={`${barColor}-container h-full opacity-30`} style={{ width: `${Math.min(100, gap)}%` }}></div>}
          </div>
          
          <div className="flex items-center justify-between text-sm border-t border-outline-variant/30 pt-3">
            <span className="font-body-md text-on-surface-variant">Required</span>
            <span className="font-mono-data font-bold text-on-surface-variant">{required}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center px-1">
          <span className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold">Identified Gap</span>
          <span className={`font-mono-data text-[15px] font-bold ${gapColor}`}>
            {gap > 0 ? `${gap} pts` : 'No Gap'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full bg-surface min-h-[calc(100vh-64px)]">
      {/* HEADER SECTION */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/60 pt-10 pb-12 px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-[24px] text-teal-brand">verified</span>
            <span className="font-label-md text-[12px] uppercase tracking-widest text-secondary font-bold">Capability Diagnostic</span>
          </div>
          <h1 className="font-display-lg text-[36px] md:text-[42px] text-primary leading-tight mb-3 tracking-tight">
            My Competencies
          </h1>
          <p className="font-body-md text-[16px] text-on-surface-variant max-w-2xl leading-relaxed">
            Track your current capabilities and identify where development is needed against your role benchmark.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-8 lg:px-12 py-10 flex flex-col gap-12">
        
        {/* ROLE COMPETENCIES SECTION */}
        <div className="flex flex-col gap-6">
          <div className="border-b border-outline-variant/50 pb-3">
            <h2 className="font-display-md text-[24px] text-primary">Role Competencies</h2>
            <p className="font-body-md text-[14px] text-on-surface-variant mt-1">Core capabilities required for your role</p>
          </div>
          
          {roleCompetencies.length === 0 ? (
            <div className="p-8 text-center bg-surface-container-lowest border border-outline-variant/50 rounded-xl">
              <p className="text-on-surface-variant font-medium">No role competencies assessed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {roleCompetencies.map(renderCompetencyCard)}
            </div>
          )}
        </div>

        {/* AREA OF INTEREST SECTION */}
        {interestAssessment && (
          <div className="flex flex-col gap-6 mt-4">
            <div className="border-b border-outline-variant/50 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h2 className="font-display-md text-[24px] text-primary">Area of Interest Profile</h2>
                  <p className="font-body-md text-[14px] text-on-surface-variant mt-1">
                    Specialized capabilities in: <span className="font-semibold text-primary">{interestAssessment.area_of_interest}</span>
                  </p>
                </div>
                <span className="text-[12px] font-label-md uppercase tracking-wider text-on-surface-variant font-bold px-3 py-1 bg-surface-container-low rounded-md border border-outline-variant">
                  Optional Track
                </span>
              </div>
            </div>

            {areaOfInterestCompetencies.length === 0 ? (
              <div className="p-8 text-center bg-surface-container-lowest border border-outline-variant/50 rounded-xl">
                <p className="text-on-surface-variant font-medium">No capability data for your area of interest.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {areaOfInterestCompetencies.map(renderCompetencyCard)}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
