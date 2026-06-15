import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SYMPTOMS, DISEASES } from '../../data/mockData';
import { Search, X, ChevronRight, AlertTriangle, CheckCircle, Activity, Stethoscope } from 'lucide-react';
import { useHealthStore } from '../../store';
import { useNavigate } from 'react-router-dom';

export default function SymptomChecker() {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const { addToHistory } = useHealthStore();
  const navigate = useNavigate();

  const filteredSymptoms = SYMPTOMS.filter(s => s.toLowerCase().includes(search.toLowerCase()));

  const toggle = (s) => setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const analyze = async () => {
    if (!selected.length) return;
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    const matched = DISEASES.filter(d => d.symptoms?.some(s => selected.includes(s)));
    const top = matched.length ? matched : DISEASES.slice(0, 3);
    setResults(top.slice(0, 4).map((d, i) => ({
      ...d,
      confidence: Math.round(90 - i * 12 + Math.random() * 5),
    })));
    addToHistory({ id: Date.now(), type: 'Symptom Check', date: new Date().toLocaleDateString('en-IN'), result: top[0]?.name || 'Unknown', severity: top[0]?.severity || 'Medium', icon: '🔍' });
    setAnalyzing(false);
  };

  const severityColor = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444', Critical: '#7c3aed' };
  const severityBg = { Low: '#f0fdf4', Medium: '#fffbeb', High: '#fff1f2', Critical: '#f5f3ff' };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="section-title flex items-center gap-2"><Stethoscope className="w-6 h-6 text-blue-600" />Symptom Checker</h1>
        <p className="section-subtitle">Select your symptoms and get an AI-powered health assessment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: Symptom selector */}
        <div className="lg:col-span-3 space-y-4">
          {/* Selected chips */}
          {selected.length > 0 && (
            <div className="card p-4">
              <p className="text-xs font-semibold text-slate-500 mb-2">Selected Symptoms ({selected.length})</p>
              <div className="flex flex-wrap gap-2">
                {selected.map(s => (
                  <motion.span key={s} initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-xl">
                    {s}
                    <button onClick={() => toggle(s)} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                  </motion.span>
                ))}
                <button onClick={() => setSelected([])} className="text-xs text-slate-400 hover:text-red-500 transition-colors px-2">Clear all</button>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="card p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className="input-field pl-9" placeholder="Search symptoms..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto">
              {filteredSymptoms.map(s => (
                <button key={s} onClick={() => toggle(s)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all border ${selected.includes(s) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'}`}>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${selected.includes(s) ? 'bg-white' : 'bg-slate-300'}`} />
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button onClick={analyze} disabled={!selected.length || analyzing}
            className="w-full btn-primary py-3.5 text-sm justify-center">
            {analyzing ? (
              <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" className="opacity-25"/><path fill="white" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Analysing with AI...</>
            ) : (
              <><Activity className="w-4 h-4" /> Analyse Symptoms ({selected.length} selected)</>
            )}
          </button>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-3">
          {!results ? (
            <div className="card p-8 text-center h-full flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">🩺</div>
              <p className="font-semibold text-slate-600 text-sm">Select symptoms and click Analyse</p>
              <p className="text-xs text-slate-400">AI will predict possible conditions with confidence scores</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-slate-700 text-sm">Analysis Complete</h3>
                </div>
                <p className="text-xs text-slate-400">Based on {selected.length} symptom(s)</p>
              </div>
              {results.map((r, i) => (
                <motion.div key={r.name} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{r.name}</p>
                      <p className="text-xs text-slate-400">{r.specialty}</p>
                    </div>
                    <span className="text-sm font-black" style={{ color: severityColor[r.severity] }}>{r.confidence}%</span>
                  </div>
                  <div className="progress-bar mb-2">
                    <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${r.confidence}%` }}
                      style={{ background: severityColor[r.severity] }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="badge" style={{ background: severityBg[r.severity], color: severityColor[r.severity] }}>
                      {r.severity} Risk
                    </span>
                    <button onClick={() => navigate('/doctors')} className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
                      Find doctor <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
              <div className="card p-3 border-l-4 border-amber-400 bg-amber-50">
                <p className="text-xs text-amber-700 font-semibold flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  This is an AI assessment. Please consult a certified doctor for diagnosis.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
