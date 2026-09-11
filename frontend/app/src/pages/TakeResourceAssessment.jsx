import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CourseCard from '../components/CourseCard';

export default function TakeResourceAssessment() {
  const navigate = useNavigate();
  const { resourceId } = useParams();
  
  const [resource, setResource] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null); // Result screen state
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!userStr || !user) {
      navigate('/');
      return;
    }

    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchResourceQuiz = async () => {
      try {
        const res = await fetch(`/api/resources/${resourceId}/quiz`);
        const data = await res.json();
        
        if (!res.ok || !data.success) {
          setError(data.detail || 'Failed to load resource assessment.');
        } else {
          setResource(data.resource);
          setQuestions(data.questions);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchResourceQuiz();
  }, [userStr, navigate, resourceId]);

  const handleOptionSelect = (qId, optionKey) => {
    setAnswers(prev => ({ ...prev, [qId]: optionKey }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1);
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Find existing capability to pass for evidence averaging
      let existingCapability = null;
      const existingResultStr = localStorage.getItem('assessment_result');
      let existingResult = null;
      
      if (existingResultStr) {
        existingResult = JSON.parse(existingResultStr);
        const gaps = existingResult.development_gaps || [];
        const compGap = gaps.find(g => g.competency === resource?.competency);
        if (compGap) {
          existingCapability = compGap.capability;
        }
      }

      const payload = {
        employee_id: user.employee_id,
        answers: answers,
        existing_capability: existingCapability
      };
      
      const res = await fetch(`/api/resources/${resourceId}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const evalData = await res.json();
      
      if (!res.ok) {
        setError(evalData.detail || 'Evaluation failed.');
        setSubmitting(false);
        return;
      }
      
      // Update existing gaps in localStorage if gap_update was applied
      if (evalData.gap_update?.applied && existingResult) {
        const gu = evalData.gap_update;
        const newGaps = existingResult.development_gaps.map(g => {
          if (g.competency === gu.competency) {
            return {
              ...g,
              capability: gu.new_capability,
              gap: gu.new_gap,
              status: gu.new_status
            };
          }
          return g;
        });
        
        existingResult.development_gaps = newGaps;
        
        // Also update role_capability_profile
        const newProfile = existingResult.role_capability_profile.map(p => {
          if (p.competency === gu.competency) {
            return {
              ...p,
              capability: gu.new_capability
            };
          }
          return p;
        });
        existingResult.role_capability_profile = newProfile;
        
        // Recalculate highest priority gap (the one with the largest gap > 0)
        let highestPriorityGap = { competency: 'None', gap: 0 };
        newGaps.forEach(g => {
          if (g.gap > highestPriorityGap.gap) {
            highestPriorityGap = { competency: g.competency, gap: g.gap };
          }
        });
        existingResult.highest_priority_gap = highestPriorityGap;
        
        // Fetch refreshed recommendations
        try {
          const recRes = await fetch('/api/recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              role: user.role,
              development_gaps: newGaps,
              top_k: 5
            })
          });
          if (recRes.ok) {
            const recData = await recRes.json();
            existingResult.recommendations = recData.recommendations;
            evalData.recommendations = recData.recommendations;
          }
        } catch (err) {
          console.error("Failed to refresh recommendations", err);
        }
        
        localStorage.setItem('assessment_result', JSON.stringify(existingResult));
      }
      
      // Show result screen
      setResult(evalData);
      
    } catch (err) {
      console.error(err);
      setError('Failed to submit assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // RENDERING STATES
  // -------------------------------------------------------------
  if (loading) {
    return <div className="p-12 text-center text-primary font-body">Loading your assessment...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col w-full min-h-[calc(100vh-64px)] justify-center items-center bg-surface p-6">
        <div className="max-w-md w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[32px]">error</span>
          </div>
          <h2 className="font-display text-[24px] text-primary mb-4">Assessment Unavailable</h2>
          <p className="font-body text-[15px] text-on-surface-variant mb-8">{error}</p>
          <button 
            onClick={() => navigate('/employee/dashboard')}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-body font-semibold hover:bg-primary-container transition-colors shadow-sm"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Result UI
  if (result) {
    return (
      <div className="flex flex-col w-full min-h-[calc(100vh-64px)] justify-center items-center bg-surface p-6 py-12">
        <div className="max-w-3xl w-full flex flex-col gap-6">
          
          {/* SECTION A — QUIZ RESULT */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-teal-brand/10 text-teal-brand flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px]">task_alt</span>
            </div>
            <h2 className="font-display text-[26px] text-primary mb-2">Assessment Complete</h2>
            <p className="font-body text-[16px] text-on-surface-variant mb-6 font-semibold">{resource.title}</p>
            
            <div className="bg-surface-container-low rounded-xl p-6 inline-block min-w-[200px]">
              <div className="text-5xl font-display text-primary mb-2">{result.percentage}%</div>
              <div className="text-sm font-body-md text-on-surface-variant">
                {result.correct} / {result.total} Correct
              </div>
            </div>
          </div>

          {/* SECTION B — COMPETENCY EVALUATION */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-8">
            <h3 className="font-display-md text-[20px] text-primary mb-6 flex items-center gap-2 border-b border-outline-variant/50 pb-3">
              <span className="material-symbols-outlined text-teal-brand">analytics</span>
              Competency Evaluation
            </h3>
            
            {result.gap_update?.applied ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col bg-surface-container-low p-4 rounded-xl border border-outline-variant/50">
                  <span className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider mb-1">Competency</span>
                  <span className="text-sm font-bold text-primary">{result.gap_update.competency}</span>
                </div>
                <div className="flex flex-col bg-surface-container-low p-4 rounded-xl border border-outline-variant/50">
                  <span className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider mb-1">Capability</span>
                  <span className="text-lg font-display text-primary">{result.gap_update.new_capability}<span className="text-xs text-on-surface-variant font-body">/100</span></span>
                </div>
                <div className="flex flex-col bg-surface-container-low p-4 rounded-xl border border-outline-variant/50">
                  <span className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider mb-1">Remaining Gap</span>
                  <span className="text-lg font-display text-terracotta">{result.gap_update.new_gap}</span>
                </div>
                <div className="flex flex-col bg-surface-container-low p-4 rounded-xl border border-outline-variant/50">
                  <span className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider mb-1">Status</span>
                  <span className="text-xs font-bold text-teal-brand uppercase bg-teal-brand/10 w-fit px-2 py-1 rounded mt-1">{result.gap_update.new_status}</span>
                </div>
              </div>
            ) : (
              <div className="bg-surface-variant/30 p-5 rounded-xl border border-outline-variant/50 text-on-surface-variant text-sm font-medium">
                This resource is not mapped to a specific capability framework competency. Your score was recorded as a resource-specific result without adjusting your role gaps.
              </div>
            )}
          </div>

          {/* SECTION C — RECOMMENDED COURSES */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-8">
            <h3 className="font-display-md text-[20px] text-primary mb-6 flex items-center gap-2 border-b border-outline-variant/50 pb-3">
              <span className="material-symbols-outlined text-teal-brand">school</span>
              Recommended Courses
            </h3>
            
            {result.recommendations && result.recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.recommendations.slice(0, 2).map((rec, idx) => (
                  <CourseCard key={idx} course={rec} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-on-surface-variant bg-surface-container-low rounded-xl border border-outline-variant/50">
                <p className="text-sm">No competency-based recommendations available for this resource.</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-end mt-4">
            <button 
              onClick={() => navigate('/employee/assessments')}
              className="px-6 py-3 bg-surface-container border border-outline-variant text-on-surface rounded-lg font-body font-semibold hover:bg-surface-variant transition-colors"
            >
              Back to Assessment Panel
            </button>
            <button 
              onClick={() => navigate('/employee/dashboard')}
              className="px-6 py-3 bg-primary text-on-primary rounded-lg font-body font-semibold hover:bg-primary-container transition-colors shadow-sm"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz UI
  const q = questions[currentIdx];
  const progressPercent = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col w-full max-w-[800px] mx-auto p-6 mt-8">
      {/* Header and Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="font-display text-[24px] text-primary">
              Learning Resource Assessment
            </h2>
            <p className="font-body text-[14px] text-secondary mt-1">
              {resource.title}
            </p>
          </div>
          <span className="font-mono-data text-[14px] text-secondary font-bold mb-1">
            Question {currentIdx + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-8 shadow-sm mb-6">
        <div className="mb-6 flex gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container font-label-md text-[11px] uppercase tracking-wider font-bold">
            {q.category || 'Resource'}
          </span>
          {resource.competency && resource.competency !== 'RESOURCE' && (
            <span className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant font-label-md text-[11px] uppercase tracking-wider font-bold">
              {resource.competency}
            </span>
          )}
        </div>
        
        <h3 className="font-body text-[20px] text-primary leading-relaxed mb-8 font-medium">
          {q.question_text || q.question}
        </h3>
        
        <div className="flex flex-col gap-3">
          {q.options && Object.entries(q.options).map(([key, text]) => {
            const isSelected = answers[q.id] === key;
            return (
              <button
                key={key}
                onClick={() => handleOptionSelect(q.id, key)}
                className={`text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${
                  isSelected 
                    ? 'bg-primary-container/20 border-primary shadow-sm' 
                    : 'bg-surface border-outline-variant hover:border-outline hover:bg-surface-container-low'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 ${
                  isSelected ? 'border-primary' : 'border-outline'
                }`}>
                  {isSelected && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                </div>
                <div className="flex-1">
                  <span className={`font-body text-[16px] ${isSelected ? 'text-primary font-medium' : 'text-on-surface'}`}>
                    {text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="px-6 py-2.5 border border-outline rounded-lg text-secondary font-body font-semibold hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Previous
        </button>
        
        {currentIdx === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting || Object.keys(answers).length < questions.length}
            className="px-8 py-2.5 bg-primary text-on-primary rounded-lg font-body font-semibold hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? 'Evaluating...' : 'Submit Assessment'}
            {!submitting && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-8 py-2.5 bg-primary text-on-primary rounded-lg font-body font-semibold hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2"
          >
            Next
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        )}
      </div>
    </div>
  );
}
