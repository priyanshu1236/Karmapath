import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TakeAssessment() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [assessmentId, setAssessmentId] = useState('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
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

    const fetchQuestions = async () => {
      try {
        let url = `/api/assessment/generate?role=${encodeURIComponent(user.role)}&domain=${encodeURIComponent(user.domain)}&employee_id=${encodeURIComponent(user.employee_id)}`;
        if (user.area_of_interest) {
          url += `&area_of_interest=${encodeURIComponent(user.area_of_interest)}`;
        }
        console.log("[ASSESSMENT] user:", user);
        console.log("[ASSESSMENT] area_of_interest:", user?.area_of_interest);
        console.log("[ASSESSMENT] generate URL:", url);
        
        const res = await fetch(url);
        const data = await res.json();
        
        console.log("[ASSESSMENT] API questions:", data.questions?.length, data.questions?.map(q => q.id));
        
        if (!data.supported) {
          setError(data.message || 'Assessment for this role is not configured yet.');
        } else {
          setQuestions(data.questions);
          setAssessmentId(data.assessment_id);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to connect to the assessment server.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [userStr, navigate]);

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
      const payload = {
        employee_id: user.employee_id,
        assessment_id: assessmentId,
        role: user.role,
        domain: user.domain,
        answers: answers
      };
      
      const res = await fetch('/api/assessment/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        setError(result.detail || 'Evaluation failed.');
        setSubmitting(false);
        return;
      }
      
      localStorage.setItem('assessment_result', JSON.stringify(result));
      
      const updatedUser = { ...user, is_first_login: false };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      navigate('/employee/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to submit assessment.');
      setSubmitting(false);
    }
  };

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

  const q = questions[currentIdx];
  const progressPercent = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col w-full max-w-[800px] mx-auto p-6 mt-8">
      {/* Header and Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="font-display text-[24px] text-primary">
              {q.id && q.id.startsWith('AI-GEN-') ? 'Section 2: Your Area of Interest' : 'Section 1: Initial Competency Assessment'}
            </h2>
            {q.id && q.id.startsWith('AI-GEN-') && user.area_of_interest && (
              <p className="font-body text-[14px] text-secondary mt-1">
                Personalized questions for: {user.area_of_interest}
              </p>
            )}
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
            {q.category}
          </span>
          <span className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant font-label-md text-[11px] uppercase tracking-wider font-bold">
            {q.competency}
          </span>
        </div>
        
        <h3 className="font-body text-[20px] text-primary leading-relaxed mb-8 font-medium">
          {q.question}
        </h3>
        
        <div className="flex flex-col gap-3">
          {Object.entries(q.options).map(([key, text]) => {
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
