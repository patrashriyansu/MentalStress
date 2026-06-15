import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeditationStore } from '../../store';
import { Wind, Play, Pause, Square as Stop, Flame, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SESSIONS = [
  { id: 1, emoji: '🧘', title: 'Body Scan', duration: 10, desc: 'Release tension from head to toe for deep relaxation.', color: '#6c63ff' },
  { id: 2, emoji: '🌬️', title: 'Box Breathing', duration: 5, desc: 'Inhale · Hold · Exhale · Hold — 4 counts each to calm anxiety fast.', color: '#10b981' },
  { id: 3, emoji: '🌙', title: 'Sleep Wind Down', duration: 15, desc: 'Gentle guided relaxation to prepare your mind for restful sleep.', color: '#3b82f6' },
  { id: 4, emoji: '🎯', title: 'Focus Flow', duration: 8, desc: 'Sharpen your concentration and enter a state of calm focus.', color: '#f59e0b' },
];

const BREATH_PHASES = [
  { label: 'Breathe In',  duration: 4000, scale: 1.4, color: '#6c63ff' },
  { label: 'Hold',        duration: 4000, scale: 1.4, color: '#8b5cf6' },
  { label: 'Breathe Out', duration: 6000, scale: 1.0, color: '#10b981' },
  { label: 'Rest',        duration: 2000, scale: 1.0, color: '#06b6d4' },
];

function BreathingExercise() {
  const [active, setActive]   = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycles, setCycles]   = useState(0);
  const timerRef = useRef(null);

  const phase = BREATH_PHASES[phaseIdx];

  useEffect(() => {
    if (!active) return;
    timerRef.current = setTimeout(() => {
      const next = (phaseIdx + 1) % BREATH_PHASES.length;
      if (next === 0) setCycles(c => c + 1);
      setPhaseIdx(next);
    }, phase.duration);
    return () => clearTimeout(timerRef.current);
  }, [active, phaseIdx]);

  const toggle = () => { setActive(v => !v); if (!active) { setPhaseIdx(0); } };
  const reset  = () => { setActive(false); setPhaseIdx(0); setCycles(0); };

  return (
    <div style={{ background: 'var(--grad-hero)', borderRadius: 24, padding: '40px 32px', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, fontFamily: "'Poppins',sans-serif" }}>Breathing Exercise</h2>
      <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 32 }}>4-4-6-2 pattern · Reduces anxiety and stress</p>

      {/* Breathing Circle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{ position: 'relative', width: 180, height: 180 }}>
          {/* Outer pulse ring */}
          <motion.div
            animate={active ? { scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] } : { scale: 1, opacity: 0.2 }}
            transition={{ duration: (phase.duration || 4000) / 1000, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }}
          />
          {/* Main circle */}
          <motion.div
            animate={{ scale: active ? phase.scale : 1 }}
            transition={{ duration: (phase.duration || 4000) / 1000, ease: 'easeInOut' }}
            style={{ width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}
          >
            <span style={{ fontSize: 36 }}>🌬️</span>
            <AnimatePresence mode="wait">
              <motion.p key={phaseIdx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                style={{ fontSize: 14, fontWeight: 700, marginTop: 8, color: 'white' }}>
                {active ? phase.label : 'Ready'}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 20 }}>
        Cycles completed: <span style={{ fontWeight: 800, opacity: 1 }}>{cycles}</span>
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        <button onClick={toggle}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 14, border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}>
          {active ? <Pause style={{ width: 18, height: 18 }} /> : <Play style={{ width: 18, height: 18 }} />}
          {active ? 'Pause' : 'Start'}
        </button>
        <button onClick={reset}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.3)', background: 'transparent', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <Stop style={{ width: 16, height: 16 }} /> Reset
        </button>
      </div>
    </div>
  );
}

function SessionTimer({ session, onClose, onComplete }) {
  const totalSecs = session.duration * 60;
  const [remaining, setRemaining] = useState(totalSecs);
  const [running, setRunning]     = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) { onComplete(); return; }
    timerRef.current = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [running, remaining]);

  const pct = ((totalSecs - remaining) / totalSecs) * 100;
  const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
  const secs = (remaining % 60).toString().padStart(2, '0');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="card" style={{ padding: 40, textAlign: 'center', maxWidth: 360, width: '90%' }}>
        <p style={{ fontSize: 40, marginBottom: 12 }}>{session.emoji}</p>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-900)', marginBottom: 4, fontFamily: "'Poppins',sans-serif" }}>{session.title}</h3>
        <p style={{ fontSize: 13, color: 'var(--text-500)', marginBottom: 28 }}>{session.desc}</p>

        {/* Timer ring */}
        <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 24px' }}>
          <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="70" cy="70" r="60" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle cx="70" cy="70" r="60" fill="none" stroke={session.color} strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - pct / 100)}`}
              strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Poppins',sans-serif", color: 'var(--text-900)' }}>{mins}:{secs}</span>
            <span style={{ fontSize: 10, color: 'var(--text-400)', fontWeight: 600 }}>remaining</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={() => setRunning(r => !r)} className="btn btn-primary" style={{ flex: 1 }}>
            {running ? <><Pause style={{ width: 15, height: 15 }} /> Pause</> : <><Play style={{ width: 15, height: 15 }} /> Resume</>}
          </button>
          <button onClick={onClose} className="btn btn-secondary">End</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Meditation() {
  const { logSession, sessions, totalMinutes, streak, getTodayMinutes } = useMeditationStore();
  const [activeSession, setActiveSession] = useState(null);

  const handleComplete = () => {
    logSession({ type: activeSession.title, duration: activeSession.duration });
    toast.success(`🧘 ${activeSession.title} completed! +${activeSession.duration} min`);
    setActiveSession(null);
  };

  const todayMin = getTodayMinutes();

  const STATS = [
    { icon: '🧘', label: 'Total Sessions',  value: sessions.length },
    { icon: '⏱️', label: 'Total Minutes',   value: totalMinutes },
    { icon: '🔥', label: 'Day Streak',       value: streak },
    { icon: '✨', label: 'Today',            value: `${todayMin}min` },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Meditation 🧘</h1>
        <p className="section-subtitle">Find your calm with guided breathing and meditation sessions.</p>
      </div>

      {/* Breathing Exercise */}
      <div style={{ marginBottom: 24 }}>
        <BreathingExercise />
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="stat-card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</p>
            <p style={{ fontSize: 24, fontWeight: 900, color: '#6c63ff', fontFamily: "'Poppins',sans-serif" }}>{s.value}</p>
            <p style={{ fontSize: 11, color: 'var(--text-400)', marginTop: 4, fontWeight: 600 }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Guided Sessions */}
      <h2 className="section-title" style={{ fontSize: 16, marginBottom: 16 }}>Guided Sessions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
        {SESSIONS.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card card-lift" style={{ padding: 24, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, border: `1.5px solid ${s.color}30` }}>
                {s.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-900)', fontFamily: "'Poppins',sans-serif" }}>{s.title}</p>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 8, background: s.color + '15', color: s.color, fontSize: 11, fontWeight: 700 }}>
                    <Clock style={{ width: 10, height: 10 }} /> {s.duration} min
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-500)', lineHeight: 1.5, marginBottom: 14 }}>{s.desc}</p>
                <button onClick={() => setActiveSession(s)} className="btn btn-primary" style={{ fontSize: 12, padding: '8px 16px', background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)`, boxShadow: `0 4px 12px ${s.color}30` }}>
                  <Play style={{ width: 13, height: 13 }} /> Start Session
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <div className="card" style={{ padding: 20 }}>
          <p className="section-title" style={{ fontSize: 14, marginBottom: 14 }}>
            <CheckCircle style={{ width: 16, height: 16, color: '#10b981', display: 'inline', marginRight: 6 }} />
            Recent Sessions
          </p>
          {sessions.slice(0, 5).map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-card)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-900)' }}>{s.type}</span>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 12, color: 'var(--text-400)' }}>{s.duration} min</span>
                <span style={{ fontSize: 12, color: 'var(--text-400)' }}>{new Date(s.completedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timer Modal */}
      <AnimatePresence>
        {activeSession && (
          <SessionTimer session={activeSession} onClose={() => setActiveSession(null)} onComplete={handleComplete} />
        )}
      </AnimatePresence>
    </div>
  );
}
