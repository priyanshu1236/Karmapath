export default function CourseCard({ course }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-md transition-all h-full">
      <div className="flex flex-col gap-3 flex-grow">
        <div className="flex justify-between items-start gap-2">
          <span className="font-label-md text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
            COURSE
          </span>
          {course.source === 'area_of_interest' ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded border bg-secondary-container text-on-secondary-container border-secondary/30 font-label-md text-[9px] uppercase tracking-widest font-bold">
              INTEREST
            </span>
          ) : course.gap > 0 ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded border bg-surface-container-high text-on-surface-variant border-outline-variant font-label-md text-[9px] uppercase tracking-widest font-bold">
              ROLE GAP
            </span>
          ) : null}
        </div>

        <h3 className="font-display text-[20px] font-medium text-primary leading-tight">
          {course.title || course.course_title}
        </h3>
        
        {course.provider && (
          <div className="flex items-center gap-2 font-body text-[13px] text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">school</span>
            <span>{course.provider} {course.duration ? `• ${course.duration}` : ''}</span>
          </div>
        )}

        <div className="mt-2 flex flex-col gap-1">
          <span className="font-body-md text-[13px] text-primary font-medium">Targets: {course.matched_competency}</span>
          {course.gap > 0 && (
             <span className="font-body-md text-[12px] text-terracotta font-medium">Addresses gap of {course.gap} pts</span>
          )}
        </div>
        
        {course.reason && (
          <div className="mt-2 py-2 px-3 bg-surface-container-low rounded-lg border border-[#ece4d6]">
            <p className="font-body-md text-[13px] text-on-surface-variant italic leading-relaxed">
              "{course.reason}"
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 flex flex-col xl:flex-row items-stretch gap-3 border-t border-[#ece4d6]">
        <button className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg font-body font-semibold text-[13px] hover:bg-primary-container transition-colors shadow-sm text-center flex items-center justify-center gap-2">
          View Course
        </button>
        <button 
          onClick={() => {
             const el = document.createElement('div');
             el.className = 'fixed bottom-6 right-6 bg-surface-container-high text-on-surface px-6 py-3 rounded-xl shadow-lg text-[14px] font-medium z-50 transition-opacity duration-300 border border-outline-variant flex items-center gap-2';
             el.innerHTML = '<span class="material-symbols-outlined text-primary">info</span> Self-test coming soon.';
             document.body.appendChild(el);
             setTimeout(() => {
               el.style.opacity = '0';
               setTimeout(() => el.remove(), 300);
             }, 2500);
          }}
          className="flex-1 py-2.5 bg-surface border border-outline text-on-surface rounded-lg font-body font-semibold text-[13px] hover:bg-surface-container-low transition-colors text-center flex items-center justify-center gap-2"
        >
          First Test Yourself
        </button>
      </div>
    </div>
  );
}
