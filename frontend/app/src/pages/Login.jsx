import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [showRegistration, setShowRegistration] = useState(false);
  const [selectedRole, setSelectedRole] = useState("College / University Faculty");

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
          
          {!showRegistration ? (
            <>
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
                
                {/* 1. EXISTING EMPLOYEE LOGIN */}
                <button 
                  onClick={() => {
                    const user = {
                      employee_id: "EMP001",
                      name: "Rahul Sharma",
                      role: "Statistical Officer",
                      domain: "Agricultural Statistics",
                      department: "Statistics Department",
                      is_first_login: false
                    };
                    localStorage.setItem('user', JSON.stringify(user));
                    navigate('/employee/dashboard');
                  }} 
                  className="flex items-center p-3.5 border border-outline-variant/70 rounded-xl bg-surface-container-low hover:bg-surface-container hover:border-outline transition-all duration-150 text-left group focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center mr-3.5 flex-shrink-0 font-body font-bold text-xs tracking-wider border border-outline-variant/40">
                    <span>RS</span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-body font-bold text-[15px] text-on-surface group-hover:text-primary transition-colors truncate">Rahul Sharma</p>
                    <p className="font-body text-xs text-secondary truncate mt-0.5">Existing Employee</p>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" style={{ fontSize: '20px' }}>arrow_forward</span>
                </button>
                
                {/* 2. FIRST-TIME USER */}
                <button 
                  onClick={() => setShowRegistration(true)} 
                  className="flex items-center p-3.5 border border-outline-variant/70 rounded-xl bg-surface-container-low hover:bg-surface-container hover:border-outline transition-all duration-150 text-left group focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center mr-3.5 flex-shrink-0 font-body font-bold text-xs tracking-wider border border-outline-variant/40">
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-body font-bold text-[15px] text-on-surface group-hover:text-primary transition-colors truncate">First-Time User</p>
                    <p className="font-body text-xs text-secondary truncate mt-0.5">Register & Assessment</p>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" style={{ fontSize: '20px' }}>arrow_forward</span>
                </button>

                {/* 3. ADMIN LOGIN */}
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
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setShowRegistration(false)} className="p-1 rounded hover:bg-surface-container text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
                <p className="font-body font-semibold text-sm text-primary uppercase tracking-widest">First-Time User Registration</p>
              </div>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const user = {
                    name: formData.get('name'),
                    employee_id: formData.get('employee_id'),
                    role: formData.get('role'),
                    department: formData.get('department'),
                    domain: formData.get('domain'),
                    area_of_interest: formData.get('area_of_interest'),
                    is_first_login: true
                  };
                  
                  // Clear previous assessment results for a fresh start
                  localStorage.removeItem('assessment_result');
                  localStorage.removeItem('assessment_skipped');
                  
                  console.log("[LOGIN] user saved:", user);
                  console.log("[LOGIN] area_of_interest:", user.area_of_interest);
                  
                  localStorage.setItem('user', JSON.stringify(user));
                  navigate('/employee/initial-assessment-choice');
                }}
                className="flex flex-col gap-3.5"
              >
                <div>
                  <label className="block font-body text-xs text-secondary mb-1">Name</label>
                  <input name="name" type="text" placeholder={selectedRole === "College / University Faculty" ? "e.g. Dr. Priya Sharma" : "e.g. Rahul Sharma"} required className="w-full px-3.5 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm text-on-surface" />
                </div>
                <div>
                  <label className="block font-body text-xs text-secondary mb-1">{selectedRole === "College / University Faculty" ? "Faculty / Employee ID" : "Employee ID"}</label>
                  <input name="employee_id" type="text" placeholder={selectedRole === "College / University Faculty" ? "e.g. FAC-1024" : "e.g. EMP-1024"} required className="w-full px-3.5 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm text-on-surface" />
                </div>
                <div>
                  <label className="block font-body text-xs text-secondary mb-1">Role</label>
                  <select 
                    name="role" 
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    required 
                    className="w-full px-3.5 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm text-on-surface appearance-none"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", backgroundSize: "1em" }}
                  >
                    <option value="Statistical Officer">Statistical Officer</option>
                    <option value="College / University Faculty">College / University Faculty</option>
                  </select>
                </div>
                <div>
                  <label className="block font-body text-xs text-secondary mb-1">Department</label>
                  <input name="department" type="text" placeholder={selectedRole === "College / University Faculty" ? "e.g. Computer Science" : "e.g. Agriculture Statistics"} required className="w-full px-3.5 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm text-on-surface" />
                </div>
                <div>
                  <label className="block font-body text-xs text-secondary mb-1">Domain</label>
                  <input name="domain" type="text" placeholder={selectedRole === "College / University Faculty" ? "e.g. Higher Education" : "e.g. Agricultural Statistics"} required className="w-full px-3.5 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm text-on-surface" />
                </div>
                <div>
                  <label className="block font-body text-xs text-secondary mb-1">Area of Interest / Career Goal</label>
                  <input name="area_of_interest" type="text" list="interests" placeholder={selectedRole === "College / University Faculty" ? "e.g. Artificial Intelligence, Data Science" : "e.g. GIS, Python, Data Science"} className="w-full px-3.5 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm text-on-surface" />
                  <p className="font-body text-[11px] text-secondary/80 mt-1.5 ml-1">Tell us what you want to learn or explore — even if it is outside your current role.</p>
                  <datalist id="interests">
                    <option value="Artificial Intelligence" />
                    <option value="Machine Learning" />
                    <option value="Cybersecurity" />
                    <option value="Cloud Computing" />
                    <option value="Data Science" />
                    <option value="Software Development" />
                    <option value="GIS" />
                    <option value="Data Analytics" />
                    <option value="Research" />
                  </datalist>
                </div>
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 mt-2 bg-primary text-on-primary py-3 px-6 rounded-lg font-body font-semibold text-sm tracking-wider uppercase hover:bg-primary-container transition-all shadow-sm"
                >
                  Register & Continue
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </form>
            </div>
          )}
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
