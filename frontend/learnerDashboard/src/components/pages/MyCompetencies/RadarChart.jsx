import React from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

function RadarChart() {
    const data = {
        labels: ['Statistical', 'Technical', 'Digital Gov', 'Behavioral'],
        datasets: [
            {
                label: 'Competency Score',
                data: [85, 92, 68, 75],
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgba(99, 102, 241, 0.8)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(129, 140, 248, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(129, 140, 248, 1)',
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        scales: {
            r: {
                angleLines: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                pointLabels: {
                    color: '#94a3b8',
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif",
                        weight: '600'
                    }
                },
                ticks: {
                    display: false,
                    min: 0,
                    max: 100,
                    stepSize: 20
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(16, 16, 24, 0.9)',
                titleColor: '#fff',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        return `Score: ${context.raw}/100`;
                    }
                }
            }
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="sticky top-28 bg-[#101018]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent"></div>

            <h3 className="text-xl font-bold text-white mb-6 relative z-10 w-full text-left">Skill Matrix</h3>

            <div className="relative w-full aspect-square mb-8 z-10 max-w-sm mx-auto flex items-center justify-center">
                <Radar data={data} options={options} />
            </div>

            <div className="space-y-4 relative z-10 w-full">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-surface-400 uppercase tracking-widest mb-1">Strongest Area</p>
                    <p className="text-lg font-bold text-white">Technical Competencies</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-surface-400 uppercase tracking-widest mb-1">Priority Growth</p>
                    <p className="text-lg font-bold text-amber-400">Digital Governance</p>
                </div>
            </div>
        </div>
    );
}

export default RadarChart;
