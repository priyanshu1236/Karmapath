import { useNavigate, Navigate } from 'react-router-dom';

export default function InitialAssessmentChoice() {
  const navigate = useNavigate();
  
  // Read user from local storage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  // Enforce explicit state rule: returning users bypass this screen
  if (user && user.is_first_login === false) {
    return <Navigate to="/employee/dashboard" replace />;
  }
  
  const handleSkip = () => {
    localStorage.setItem('assessment_skipped', 'true');
    if (user) {
      localStorage.setItem('user', JSON.stringify({ ...user, is_first_login: false }));
    }
    navigate('/employee/dashboard');
  };
  
  const handleTake = () => {
    navigate('/employee/take-assessment');
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-64px)] justify-center items-center bg-surface p-6">
      <div className="max-w-2xl w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-8 sm:p-12 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[40px]">assignment_turned_in</span>
        </div>
        
        <h1 className="font-display text-[32px] text-primary mb-4">
          Welcome, {user?.name || 'Employee'}
        </h1>
        
        <p className="font-body text-[16px] text-on-surface-variant mb-8 max-w-lg mx-auto">
          To build your personalized competency profile and learning path for the <strong>{user?.role || 'Statistical Officer'}</strong> role, please take your initial assessment.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={handleSkip}
            className="w-full sm:w-auto px-6 py-3 border border-outline rounded-lg text-secondary font-body font-semibold hover:bg-surface-container transition-colors"
          >
            Skip for Now
          </button>
          
          <button 
            onClick={handleTake}
            className="w-full sm:w-auto px-8 py-3 bg-primary text-on-primary rounded-lg font-body font-semibold hover:bg-primary-container transition-colors shadow-sm"
          >
            Take Initial Assessment
          </button>
        </div>
        
        <p className="font-body text-[12px] text-secondary mt-8">
          The assessment takes approximately 10-15 minutes and consists of 12 questions based on your domain.
        </p>
      </div>
    </div>
  );
}
