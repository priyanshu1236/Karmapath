import React from 'react';
import CompetencyCard from './CompetencyCard';
import RadarChart from './RadarChart';

function MyCompetencies() {
  const competencies = [
    { name: "Statistical Competencies", level: "Advanced", score: 85, color: "from-blue-400 to-brand-500", shadow: "rgba(99,102,241,0.5)", bg: "bg-blue-500/10" },
    { name: "Technical Competencies", level: "Expert", score: 92, color: "from-success-400 to-teal-500", shadow: "rgba(16,185,129,0.5)", bg: "bg-success-500/10" },
    { name: "Digital Governance", level: "Intermediate", score: 68, color: "from-amber-400 to-orange-500", shadow: "rgba(245,158,11,0.5)", bg: "bg-amber-500/10" },
    { name: "Behavioral and Managerial Competencies", level: "Advanced", score: 75, color: "from-purple-400 to-pink-500", shadow: "rgba(236,72,153,0.5)", bg: "bg-purple-500/10" }
  ];



  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">My Competencies</h1>
        <p className="text-surface-400 text-lg max-w-2xl">Detailed breakdown of your skillset across various domains. Identify strengths and target areas for growth.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Skill Categories */}
        <div className="lg:col-span-2 space-y-10">
          {/* Core Competencies */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
                <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Core Competencies</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {competencies.map((skill, index) => (
                <CompetencyCard 
                  key={index}
                  name={skill.name}
                  level={skill.level}
                  score={skill.score}
                  color={skill.color}
                  shadow={skill.shadow}
                  bg={skill.bg}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skill Matrix / Summary */}
        <div className="lg:col-span-1">
          <RadarChart />
        </div>
      </div>
      
      {/* FOOTER PADDING */}
      <div className="h-10"></div>
    </div>
  );
}

export default MyCompetencies;
