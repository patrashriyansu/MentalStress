import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStressStore } from '../../store';
import { Activity, TrendingDown, CheckSquare, Square } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';

const TRIGGERS = ['Work/Deadlines', 'Relationships', 'Health', 'Finance', 'Family', 'Sleep', 'News/Media', 'Other'];
const TIPS = [
  { emoji: '🧘', title: '5-min Deep Breathing', desc: 'Slow, deep breaths activate your parasympathetic nervous system.' },
  { emoji: '🚶', title: '10-min Walk Outside', desc: 'Fresh air and movement reduce cortisol levels naturally.' },
  { emoji: '📵', title: '30-min Digital Detox', desc: 'Disconnect from screens to let your mind reset and recharge.' },
];

const LEVEL_CONFIG = [
  { max: 3,  label: 'Low',      color: '#10b981', bg: '#d1fae5' },
  { max: 6,  label: 'Moderate', color: '#f59e0b', bg: '#fef3c7' },
  { max: 10, label: 'High',     color: '#ef4444', bg: '#fee2e2' },
];

function getLevelConfig(level) {
  return LEVEL_CONFIG.find(c => level <= c.max) || LEVEL_CONFIG[2];
}

export default function StressAnalysis() {
  const { logStress, getThisWeek, getTodayLevel, entries } = useStressStore();
  const [level, setLevel]   = useState(5);
  const [triggers, setTriggers] = useState([]);
  const [notes, setNotes]   = useState('');
  const weekData = getThisWeek();
  const todayLevel = getTodayLevel();
  const avgLevel = weekData.filter(d => d.level > 0).length
    ? (weekData.filter(d => d.level > 0).reduce((s, d) => s + d.level, 0) / weekData.filter(d => d.level > 0).length).toFixed(1)
    : 'N/A';

  const toggleTrigger = (t) => setTriggers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleSave = () => {
    logStress({ level, triggers, notes });
    toast.success('Stress level logged! 💪');
    setNotes('');
    setTriggers([]);
  };

  const cfg = getLevelConfig(level);
  const todayCfg = todayLevel ? getLevelConfig(todayLevel) : null;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Stress Analysis 📊</h1>
        <p className="section-subtitle">Track your stress levels and discover patterns over time.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '45% 55%', gap: 20, marginBottom: 24 }}>
        {/* Log Stress */}
        <div className="card" style={{ padding: 24 }}>
          <h3 className="section-title" style={{ fontSize: 16, marginBottom: 20 }}>How stressed are you today?</h3>

          {/* Stress Level Slider */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-500)' }}>Stress Level</span>
              <span style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Poppins',sans-serif", color: cfg.color }}>{level}</span>
            </div>
            <input type="range" min={1} max={10} value={level} onChange={e => setLevel(Number(e.target.value))}
              style={{ width: '100%', accentColor: cfg.color, height: 6, cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>1 Low</span>
              <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>5 Moderate</span>
              <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700 }}>10 High</span>
            </div>
            <div style={{ marginTop: 12, padding: '8px 14px', borderRadius: 10, background: cfg.bg, border: `1.5px solid ${cfg.color}30`, textAlign: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{cfg.label} Stress</span>
            </div>
          </div>

          {/* Triggers */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-500)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Stress Triggers</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {TRIGGERS.map(t => (
                <button key={t} onClick={() => toggleTrigger(t)}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 10px', borderRadius: 10, border: '1.5px solid', borderColor: triggers.includes(t) ? '#6c63ff' : '#e5e7eb', background: triggers.includes(t) ? 'var(--purple-50)' : 'white', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: triggers.includes(t) ? '#6c63ff' : 'var(--text-500)', transition: 'all 0.2s' }}>
                  {triggers.includes(t)
                    ? <CheckSquare style={{ width: 14, height: 14, color: '#6c63ff' }} />
                    : <Square style={{ width: 14, height: 14, color: '#d1d5db' }} />
                  }
                  {t}
                </button>
              ))}
            </div>
          </div>

          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any additional notes..." className="input-field" rows={3} style={{ marginBottom: 16, resize: 'none' }} />
          <button onClick={handleSave} className="btn btn-primary" style={{ width: '100%' }}>Save Stress Log</button>
        </div>

        {/* Today's Gauge */}
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 className="section-title" style={{ fontSize: 16, marginBottom: 20, textAlign: 'center' }}>Today's Stress</h3>
          {todayLevel !== null ? (
            <>
              <div style={{ width: 140, height: 140, borderRadius: '50%', border: `8px solid ${todayCfg.color}30`, background: todayCfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginBottom: 16, boxShadow: `0 0 30px ${todayCfg.color}20` }}>
                <span style={{ fontSize: 40, fontWeight: 900, fontFamily: "'Poppins',sans-serif", color: todayCfg.color }}>{todayLevel}</span>
                <span style={{ fontSize: 11, color: todayCfg.color, fontWeight: 700 }}>out of 10</span>
              </div>
              <span style={{ padding: '6px 20px', borderRadius: 20, background: todayCfg.bg, color: todayCfg.color, fontWeight: 800, fontSize: 14 }}>{todayCfg.label} Stress</span>
            </>
          ) : (
            <div className="empty-state">
              <p style={{ fontSize: 48 }}>📊</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-700)', marginTop: 12 }}>Not logged yet</p>
              <p style={{ fontSize: 13, color: 'var(--text-400)', marginTop: 6 }}>Log your stress level on the left</p>
            </div>
          )}
          <div style={{ marginTop: 24, padding: '12px 20px', borderRadius: 12, background: 'var(--surface-2)', width: '100%', textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: 'var(--text-400)', marginBottom: 4, fontWeight: 600 }}>7-Day Average</p>
            <p style={{ fontSize: 24, fontWeight: 900, color: '#6c63ff', fontFamily: "'Poppins',sans-serif" }}>{avgLevel}</p>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 className="section-title" style={{ fontSize: 15, marginBottom: 16 }}>📈 Stress This Week</h3>
        {weekData.some(d => d.level > 0) ? (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} formatter={(v) => [`${v}/10`, 'Stress']} />
              <Area type="monotone" dataKey="level" stroke="#ef4444" strokeWidth={2} fill="url(#stressGrad)" dot={{ fill: '#ef4444', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state" style={{ padding: '30px 0' }}>
            <p style={{ fontSize: 40 }}>📊</p>
            <p style={{ fontSize: 14, color: 'var(--text-400)', marginTop: 10 }}>No stress data yet — start logging!</p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {TIPS.map((tip, i) => (
          <motion.div key={tip.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="card card-lift" style={{ padding: 20, cursor: 'default' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{tip.emoji}</div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-900)', marginBottom: 6 }}>{tip.title}</p>
            <p style={{ fontSize: 12, color: 'var(--text-500)', lineHeight: 1.6 }}>{tip.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
