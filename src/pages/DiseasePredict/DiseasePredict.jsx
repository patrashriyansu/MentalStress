import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DISEASES } from '../../data/mockData';
import { Brain, BarChart2, TrendingUp } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const MODEL_RESULTS = [
  { name: 'Random Forest', confidence: 91, accuracy: 94.2, speed: 'Fast', color: '#3b82f6' },
  { name: 'XGBoost', confidence: 88, accuracy: 96.1, speed: 'Medium', color: '#10b981' },
  { name: 'SVM', confidence: 85, accuracy: 91.8, speed: 'Fast', color: '#8b5cf6' },
  { name: 'Naive Bayes', confidence: 79, accuracy: 88.3, speed: 'Very Fast', color: '#f59e0b' },
];

const radarData = [
  { metric: 'Accuracy', RF: 94, XGB: 96, SVM: 92 },
  { metric: 'Speed', RF: 88, XGB: 72, SVM: 85 },
  { metric: 'Precision', RF: 91, XGB: 94, SVM: 89 },
  { metric: 'Recall', RF: 90, XGB: 93, SVM: 87 },
  { metric: 'F1-Score', RF: 90, XGB: 93, SVM: 88 },
];

export default function DiseasePredict() {
  const [selected, setSelected] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const analyze = async (d) => {
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 1500));
    setSelected(d);
    setAnalyzing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="section-title flex items-center gap-2"><Brain className="w-7 h-7 text-violet-400" />Disease Prediction Engine</h1>
        <p className="section-subtitle">Multi-model AI comparison — Random Forest, XGBoost, SVM, and more</p>
      </div>

      {/* Disease Selector */}
      <div className="glass-card p-5">
        <p className="text-sm text-gray-400 mb-3">Select a disease to see multi-model prediction analysis:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {DISEASES.map(d => (
            <button key={d.name} onClick={() => analyze(d)} className={`px-3 py-2 rounded-xl text-sm text-left transition-all ${selected?.name === d.name ? 'bg-violet-600 text-white' : 'glass text-gray-400 hover:text-white hover:bg-white/10'}`}>
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {analyzing && (
        <div className="glass-card p-8 text-center">
          <div className="flex justify-center gap-3 mb-4">
            {MODEL_RESULTS.map((m, i) => (
              <motion.div key={m.name} animate={{ scaleY: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                className="w-4 rounded-full" style={{ height: 40, background: m.color }} />
            ))}
          </div>
          <p className="text-white font-medium">Running {MODEL_RESULTS.length} models simultaneously...</p>
        </div>
      )}

      {selected && !analyzing && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Disease Info */}
          <div className="glass-card p-5 border border-violet-500/30">
            <h2 className="text-2xl font-display font-bold text-white">{selected.name}</h2>
            <p className="text-gray-400 text-sm mt-1">Specialty: {selected.specialty}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`badge ${selected.severity === 'High' || selected.severity === 'Critical' ? 'badge-danger' : selected.severity === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
                {selected.severity} Severity
              </span>
              {selected.symptoms.map(s => (
                <span key={s} className="px-2 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">{s}</span>
              ))}
            </div>
          </div>

          {/* Model Comparison */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-violet-400" />Model Comparison</h3>
            <div className="space-y-4">
              {MODEL_RESULTS.map((m, i) => (
                <motion.div key={m.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{m.name}</span>
                      <span className={`badge text-xs ${m.speed === 'Fast' || m.speed === 'Very Fast' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>{m.speed}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">Acc: <span className="text-white font-bold">{m.accuracy}%</span></span>
                      <span className="font-bold text-sm" style={{ color: m.color }}>{m.confidence}% confidence</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <motion.div className="progress-fill" style={{ width: `${m.confidence}%`, background: m.color }} initial={{ width: 0 }} animate={{ width: `${m.confidence}%` }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Radar Chart */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4">Model Performance Radar</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#ffffff15" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Radar name="Random Forest" dataKey="RF" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                <Radar name="XGBoost" dataKey="XGB" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                <Radar name="SVM" dataKey="SVM" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} />
                <Tooltip contentStyle={{ background: '#0d1529', border: '1px solid #ffffff20', borderRadius: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 justify-center text-xs text-gray-400 mt-2">
              <span className="flex items-center gap-1"><span className="w-3 h-1 bg-blue-500 rounded" />Random Forest</span>
              <span className="flex items-center gap-1"><span className="w-3 h-1 bg-emerald-500 rounded" />XGBoost</span>
              <span className="flex items-center gap-1"><span className="w-3 h-1 bg-purple-500 rounded" />SVM</span>
            </div>
          </div>

          {/* Consensus */}
          <div className="glass-card p-5 border border-blue-500/30">
            <h3 className="font-semibold text-white mb-3">🧠 AI Consensus</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="text-center">
                <p className="text-4xl font-black text-blue-400">{Math.round(MODEL_RESULTS.reduce((a, m) => a + m.confidence, 0) / MODEL_RESULTS.length)}%</p>
                <p className="text-xs text-gray-400">Average Confidence</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-300">All {MODEL_RESULTS.length} models agree: <span className="text-white font-bold">{selected.name}</span> is the most likely diagnosis based on provided symptoms.</p>
                <p className="text-xs text-amber-400 mt-2">⚕️ Confirm with a {selected.specialty} specialist for clinical diagnosis.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
