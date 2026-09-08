import { Outlet, Link, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="bg-background font-body-md text-on-surface antialiased selection:bg-teal-brand/20">
      <aside className="fixed left-0 top-0 h-full w-72 bg-primary text-[#e2e8e5] z-50 flex flex-col border-r border-[#303834]">
        <div className="p-6 pb-5 flex items-center gap-3 border-b border-[#2d3632]">
          <div className="w-10 h-10 bg-teal-brand text-white flex items-center justify-center rounded-lg shadow-inner">
            <span className="material-symbols-outlined text-[24px]">analytics</span>
          </div>
          <div>
            <h1 className="font-headline-md text-[17px] font-bold leading-snug text-white tracking-normal font-sans">Official Statistics</h1>
            <p className="font-label-md text-[11px] uppercase tracking-widest text-[#a8b4ae]">Admin Portal</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
          <section>
            <p className="px-3 mb-2 font-label-md text-[11px] uppercase tracking-widest text-[#8d9a93] font-semibold">Admin Operations</p>
            <nav className="space-y-1">
              <Link to="/admin/dashboard" className={`flex items-center px-3.5 py-2.5 rounded-lg transition-all group ${path.includes('/dashboard') ? 'bg-[#2d3833] text-white font-medium border-l-4 border-teal-brand' : 'text-[#b6c2bc] hover:text-white hover:bg-[#28322e]'}`}>
                <span className={`material-symbols-outlined mr-3 text-[20px] ${path.includes('/dashboard') ? 'text-[#55c0bb]' : 'text-[#84948d] group-hover:text-teal-brand'}`}>corporate_fare</span>
                <span className="font-body-md text-[14px]">Workforce Intel</span>
              </Link>
              <Link to="/admin/skill-heatmap" className={`flex items-center px-3.5 py-2.5 rounded-lg transition-all group ${path.includes('/skill-heatmap') ? 'bg-[#2d3833] text-white font-medium border-l-4 border-teal-brand' : 'text-[#b6c2bc] hover:text-white hover:bg-[#28322e]'}`}>
                <span className={`material-symbols-outlined mr-3 text-[20px] ${path.includes('/skill-heatmap') ? 'text-[#55c0bb]' : 'text-[#84948d] group-hover:text-teal-brand'}`}>grid_view</span>
                <span className="font-body-md text-[14px]">Skill Heatmap</span>
              </Link>
              <Link to="/admin/departments" className={`flex items-center px-3.5 py-2.5 rounded-lg transition-all group ${path.includes('/departments') ? 'bg-[#2d3833] text-white font-medium border-l-4 border-teal-brand' : 'text-[#b6c2bc] hover:text-white hover:bg-[#28322e]'}`}>
                <span className={`material-symbols-outlined mr-3 text-[20px] ${path.includes('/departments') ? 'text-[#55c0bb]' : 'text-[#84948d] group-hover:text-teal-brand'}`}>account_tree</span>
                <span className="font-body-md text-[14px]">Departments</span>
              </Link>
              <Link to="/admin/districts" className={`flex items-center px-3.5 py-2.5 rounded-lg transition-all group ${path.includes('/districts') ? 'bg-[#2d3833] text-white font-medium border-l-4 border-teal-brand' : 'text-[#b6c2bc] hover:text-white hover:bg-[#28322e]'}`}>
                <span className={`material-symbols-outlined mr-3 text-[20px] ${path.includes('/districts') ? 'text-[#55c0bb]' : 'text-[#84948d] group-hover:text-teal-brand'}`}>map</span>
                <span className="font-body-md text-[14px]">Districts</span>
              </Link>
              <Link to="/admin/training-effectiveness" className={`flex items-center px-3.5 py-2.5 rounded-lg transition-all group ${path.includes('/training-effectiveness') ? 'bg-[#2d3833] text-white font-medium border-l-4 border-teal-brand' : 'text-[#b6c2bc] hover:text-white hover:bg-[#28322e]'}`}>
                <span className={`material-symbols-outlined mr-3 text-[20px] ${path.includes('/training-effectiveness') ? 'text-[#55c0bb]' : 'text-[#84948d] group-hover:text-teal-brand'}`}>query_stats</span>
                <span className="font-body-md text-[14px]">Effectiveness</span>
              </Link>
            </nav>
          </section>
        </div>
        <div className="p-4 border-t border-[#2d3632]">
          <Link to="/" className="flex w-full items-center px-3.5 py-2.5 rounded-lg text-[#b6c2bc] hover:bg-terracotta/20 hover:text-terracotta transition-all font-body-md text-[14px]">
            <span className="material-symbols-outlined mr-3 text-[20px]">logout</span>Logout
          </Link>
        </div>
      </aside>

      <div className="pl-72">
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface/90 backdrop-blur-md border-b border-[#e6dcce] z-40 flex items-center px-8 justify-between">
          <div className="flex items-center bg-surface-container-low px-3.5 py-1.5 rounded-lg border border-[#ded5c6] w-96 shadow-inner">
            <span className="material-symbols-outlined text-secondary mr-2 text-[20px]">search</span>
            <input className="bg-transparent border-none outline-none text-body-md text-on-surface w-full placeholder:text-secondary/70 focus:ring-0" placeholder="Search departments, skills..." type="text" />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-r border-[#e0d6c7] pr-6">
              <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary font-label-md text-xs tracking-wider uppercase">
                <span className="material-symbols-outlined text-[18px]">language</span> EN/HI
              </button>
              <button className="relative text-on-surface-variant hover:text-primary flex items-center justify-center p-1 rounded-md transition-colors">
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-terracotta rounded-full ring-2 ring-surface"></span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[14px] font-bold text-on-surface leading-tight">Admin User</p>
                <p className="text-[12px] text-on-surface-variant font-medium">Director General</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              </div>
            </div>
          </div>
        </header>
        <main className="relative pt-16 min-h-screen bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
