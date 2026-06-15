import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useHealthStore } from '../../store';

function RingChart({ score }) {
  const r = 72; const c = 2 * Math.PI * r;
  const fill = c - (score / 100) * c;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Attention';
  return (
    <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
      <svg width={180} height={180} viewBox="0 0 180 180" className="-rotate-90">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#f1f5f9" strokeWidth="14" />
        <circle cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="14"
          strokeDasharray={c} strokeDashoffset={fill} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 2s ease-out', filter: `drop-shadow(0 0 10px ${color}50)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black text-slate-800">{score}</span>
        <span className="text-xs text-slate-400 mt-0.5">/ 100</span>
        <span className="text-xs font-bold mt-1" style={{ color }}>{label}</span>
      </div>
    </div>
  );
}

export default function HealthScore() {
  const { healthScore, vitals, setHealthScore } = useHealthStore();
  const [calculating, setCalculating] = useState(false);

  const breakdown = [
    { label: 'Vitals & Heart Rate', score: vitals.heartRate < 85 ? 20 : 15, max: 20, icon: '❤️', color: '#ef4444' },
    { label: 'Sleep Quality', score: 16, max: 20, icon: '😴', color: '#8b5cf6' },
    { label: 'Physical Activity', score: 12, max: 20, icon: '🏃', color: '#3b82f6' },
    { label: 'Medical History', score: 18, max: 20, icon: '📋', color: '#10b981' },
    { label: 'Nutrition & Diet', score: 14, max: 20, icon: '🥗', color: '#f59e0b' },
  ];

  const recalc = async () => {
    setCalculating(true);
    await new Promise(r => setTimeout(r, 2000));
    setHealthScore(Math.round(65 + Math.random() * 30));
    setCalculating(false);
  };

  const tips = [
    { text: 'Walk 8,000 steps daily to improve your activity score', impact: '+3 pts', type: 'tip' },
    { text: 'Maintain 7–8 hours of sleep for better recovery', impact: '+4 pts', type: 'tip' },
    { text: 'Blood pressure is well controlled — keep it up!', impact: '✓', type: 'good' },
    { text: 'Reduce salt intake for better heart health', impact: '+2 pts', type: 'warn' },
    { text: 'SpO₂ levels are excellent — great lung function', impact: '✓', type: 'good' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="section-title flex items-center gap-2"><Star className="w-6 h-6 text-amber-500" />AI Health Score</h1>
        <p className="section-subtitle">Your overall health rating based on vitals, lifestyle & medical history</p>
      </div>

      {/* Main Card */}
      <div className="card p-6 flex flex-col lg:flex-row items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <RingChart score={healthScore} />
          <button onClick={recalc} disabled={calculating} className="btn-primary text-sm flex items-center gap-2">
            {calculating ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" className="opacity-25"/><path fill="white" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Calculating...</> : <><RefreshCw className="w-4 h-4" />Recalculate</>}
          </button>
        </div>

        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-slate-600">Score improved <span className="text-emerald-600 font-bold">+5 points</span> since last week</span>
          </div>
          <div className="space-y-4">
            {breakdown.map(b => (
              <div key={b.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-600 flex items-center gap-1.5">{b.icon} {b.label}</span>
                  <span className="font-black text-slate-800">{b.score}<span className="text-slate-400 font-normal">/{b.max}</span></span>
                </div>
                <div className="progress-bar">
                  <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${(b.score/b.max)*100}%` }}
                    transition={{ duration: 1.5 }} style={{ background: b.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card p-5">
        <h3 className="font-bold text-slate-700 mb-4">💡 AI Personalized Recommendations</h3>
        <div className="space-y-2.5">
          {tips.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm ${t.type === 'good' ? 'bg-emerald-50 border-emerald-200' : t.type === 'warn' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
              {t.type === 'good' ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />}
              <span className="flex-1 text-slate-600">{t.text}</span>
              <span className={`text-xs font-bold flex-shrink-0 ${t.type === 'good' ? 'text-emerald-600' : t.type === 'warn' ? 'text-amber-600' : 'text-blue-600'}`}>{t.impact}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
