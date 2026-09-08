import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full h-full min-h-[calc(100vh-64px)] justify-center relative bg-surface">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <pattern height="10" id="grid" patternUnits="userSpaceOnUse" width="10">
              <path className="text-secondary/30" d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
            </pattern>
          </defs>
          <rect fill="url(#grid)" height="100" width="100"></rect>
        </svg>
      </div>
      <div className="relative z-10 w-full max-w-[480px] mx-auto px-6">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary-container text-surface flex items-center justify-center mb-6 shadow-md border border-outline-variant/60 ring-4 ring-surface-container-high/60">
            <span className="material-symbols-outlined text-white" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>account_balance</span>
          </div>
          <h1 className="font-display text-[38px] leading-[46px] text-primary text-center mb-2 tracking-tight">
            Employee Sign In
          </h1>
          <p className="font-body text-[15px] leading-relaxed text-on-surface-variant text-center max-w-sm">
            Access the Skill Intelligence and Learning Platform for India's Official Statistical System.
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_24px_-4px_rgba(31,36,33,0.08)] border border-outline-variant/80 p-7 sm:p-8 flex flex-col gap-6 mb-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
          <button className="w-full flex items-center justify-center gap-2.5 bg-primary text-on-primary py-3.5 px-6 rounded-lg font-body font-semibold text-sm tracking-wider uppercase hover:bg-primary-container transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>lock</span>
            Login via Parichay SSO
          </button>
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-outline-variant/60"></div>
            <span className="flex-shrink-0 mx-4 font-body font-semibold text-xs tracking-widest text-secondary uppercase bg-surface-container-lowest px-2">Demo Access</span>
            <div className="flex-grow border-t border-outline-variant/60"></div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-body font-semibold text-xs text-secondary uppercase tracking-widest mb-0.5">Select Persona</p>
            <button onClick={() => navigate('/employee/dashboard')} className="flex items-center p-3.5 border border-outline-variant/70 rounded-xl bg-surface-container-low hover:bg-surface-container hover:border-outline transition-all duration-150 text-left group focus:outline-none focus:ring-2 focus:ring-primary">
              <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center mr-3.5 flex-shrink-0 font-body font-bold text-xs tracking-wider border border-outline-variant/40">
                <span>RS</span>
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-body font-bold text-[15px] text-on-surface group-hover:text-primary transition-colors truncate">Rahul Sharma</p>
                <p className="font-body text-xs text-secondary truncate mt-0.5">Statistical Officer, Agriculture</p>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" style={{ fontSize: '20px' }}>arrow_forward</span>
            </button>
            <button onClick={() => navigate('/admin/dashboard')} className="flex items-center p-3.5 border border-outline-variant/70 rounded-xl bg-surface-container-low hover:bg-surface-container hover:border-outline transition-all duration-150 text-left group focus:outline-none focus:ring-2 focus:ring-primary">
              <div className="w-10 h-10 rounded-lg bg-tertiary-container text-tertiary-fixed flex items-center justify-center mr-3.5 flex-shrink-0 font-body font-bold text-xs tracking-wider border border-outline-variant/40">
                <span>AD</span>
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-body font-bold text-[15px] text-on-surface group-hover:text-primary transition-colors truncate">Administrator</p>
                <p className="font-body text-xs text-secondary truncate mt-0.5">Workforce Intelligence</p>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" style={{ fontSize: '20px' }}>arrow_forward</span>
            </button>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3.5 bg-surface-container rounded-xl border border-outline-variant/60">
          <span className="material-symbols-outlined text-secondary flex-shrink-0 mt-0.5" style={{ fontSize: '18px' }}>info</span>
          <p className="font-body text-xs leading-relaxed text-secondary">
            Prototype environment — government identity integration is simulated.
          </p>
        </div>
      </div>
    </div>
  );
}
