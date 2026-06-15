import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Heart, Activity, Moon, Stethoscope, Calendar,
  UserCheck, AlertTriangle, ArrowRight, Star,
  MapPin, Send, X, Bot, ChevronRight, TrendingUp,
  Droplets, Zap, Clock, Video
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { useAuthStore, useHealthStore } from '../../store';

/* ── Weekly health data ── */
const weekData = [
  { day: 'Mon', bp: 118, hr: 72, spo2: 97 },
  { day: 'Tue', bp: 122, hr: 76, spo2: 98 },
  { day: 'Wed', bp: 115, hr: 71, spo2: 96 },
  { day: 'Thu', bp: 120, hr: 74, spo2: 98 },
  { day: 'Fri', bp: 117, hr: 78, spo2: 97 },
  { day: 'Sat', bp: 119, hr: 73, spo2: 98 },
  { day: 'Sun', bp: 121, hr: 75, spo2: 99 },
];

const monthData = [
  { day: 'W1', bp: 119, hr: 74, spo2: 97 },
  { day: 'W2', bp: 121, hr: 76, spo2: 98 },
  { day: 'W3', bp: 116, hr: 72, spo2: 97 },
  { day: 'W4', bp: 118, hr: 73, spo2: 98 },
];

/* ── Quick Actions ── */
const QUICK_ACTIONS = [
  {
    icon: UserCheck,
    label: 'Find Doctors',
    sub: 'Browse specialists near you',
    to: '/doctors',
    color: '#2563eb',
    bg: '#eff6ff',
    darkBg: 'rgba(37,99,235,0.1)',
  },
  {
    icon: Calendar,
    label: 'Book Appointment',
    sub: 'Schedule your next visit',
    to: '/appointments',
    color: '#10b981',
    bg: '#f0fdf4',
    darkBg: 'rgba(16,185,129,0.1)',
  },
  {
    icon: Stethoscope,
    label: 'AI Symptom Checker',
    sub: 'Describe how you feel',
    to: '/symptom-checker',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    darkBg: 'rgba(139,92,246,0.1)',
  },
  {
    icon: AlertTriangle,
    label: 'Emergency SOS',
    sub: 'One-tap emergency help',
    to: '/emergency',
    color: '#ef4444',
    bg: '#fff1f2',
    darkBg: 'rgba(239,68,68,0.1)',
  },
];

/* ── Hospitals ── */
const HOSPITALS = [
  {
    name: 'Apollo Hospital',
    dist: '2.3 km',
    rating: 4.8,
    emergency: true,
    icu: true,
    specialty: 'Multi-Specialty',
    color: '#3b82f6',
    emoji: '🏥',
    beds: 850,
  },
  {
    name: 'Max Super Speciality',
    dist: '3.1 km',
    rating: 4.6,
    emergency: true,
    icu: true,
    specialty: 'Cardiology',
    color: '#10b981',
    emoji: '🏥',
    beds: 600,
  },
  {
    name: 'Fortis Healthcare',
    dist: '4.7 km',
    rating: 4.7,
    emergency: true,
    icu: true,
    specialty: 'Oncology',
    color: '#8b5cf6',
    emoji: '🏥',
    beds: 730,
  },
  {
    name: 'AIIMS New Delhi',
    dist: '5.2 km',
    rating: 4.9,
    emergency: true,
    icu: true,
    specialty: 'Research Hospital',
    color: '#f59e0b',
    emoji: '🏥',
    beds: 2500,
  },
  {
    name: 'Medanta Medicity',
    dist: '7.8 km',
    rating: 4.7,
    emergency: true,
    icu: true,
    specialty: 'Neurology',
    color: '#06b6d4',
    emoji: '🏥',
    beds: 1250,
  },
];

/* ── Doctors ── */
const DOCTORS = [
  {
    name: 'Dr. Anjali Sharma',
    specialty: 'Cardiologist',
    exp: '12 yrs',
    rating: 4.9,
    reviews: 312,
    available: true,
    emoji: '👩‍⚕️',
    color: '#ef4444',
    fee: '₹800',
    to: '/appointments',
  },
  {
    name: 'Dr. Rohan Mehta',
    specialty: 'Neurologist',
    exp: '8 yrs',
    rating: 4.8,
    reviews: 218,
    available: true,
    emoji: '👨‍⚕️',
    color: '#8b5cf6',
    fee: '₹1000',
    to: '/appointments',
  },
  {
    name: 'Dr. Priya Nair',
    specialty: 'Dermatologist',
    exp: '10 yrs',
    rating: 4.7,
    reviews: 190,
    available: false,
    emoji: '👩‍⚕️',
    color: '#10b981',
    fee: '₹700',
    to: '/appointments',
  },
  {
    name: 'Dr. Vikram Singh',
    specialty: 'Orthopedic',
    exp: '15 yrs',
    rating: 4.9,
    reviews: 405,
    available: true,
    emoji: '👨‍⚕️',
    color: '#f59e0b',
    fee: '₹1200',
    to: '/appointments',
  },
  {
    name: 'Dr. Meera Iyer',
    specialty: 'Pediatrician',
    exp: '9 yrs',
    rating: 4.8,
    reviews: 267,
    available: true,
    emoji: '👩‍⚕️',
    color: '#06b6d4',
    fee: '₹600',
    to: '/appointments',
  },
];

/* ── AI chat suggestions ── */
const AI_SUGGESTIONS = [
  'What is my heart rate trend?',
  'Book appointment with cardiologist',
  'Check my symptoms',
  'Find nearby pharmacy',
];

/* ── Custom Chart Tooltip ── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'white',
      border: '1px solid rgba(37,99,235,0.12)',
      borderRadius: 12,
      padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(15,23,42,0.10)',
      fontFamily: "'Inter', sans-serif",
    }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: 99, background: p.color }} />
          <span style={{ fontSize: 12, color: '#334155', fontWeight: 600 }}>{p.name}:</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ── Health Score Ring (pure SVG, no lib) ── */
function HealthRing({ score = 92 }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * score) / 100;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 148, height: 148 }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)',
        filter: 'blur(8px)',
        animation: 'glow-pulse 3s ease-in-out infinite',
      }} />
      <svg width="148" height="148" viewBox="0 0 148 148" style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx="74" cy="74" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
        {/* Fill */}
        <circle
          cx="74" cy="74" r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1)' }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{
          fontSize: 32, fontWeight: 900, color: 'white',
          fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.04em', lineHeight: 1,
        }}>{score}</span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: 600, marginTop: 2, letterSpacing: '0.04em' }}>
          HEALTH SCORE
        </span>
      </div>
    </div>
  );
}

/* ── Fade-in stagger wrapper ── */
const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════ */
export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { notifications } = useHealthStore();
  const navigate = useNavigate();
  const fname = user?.name?.split(' ')[0] || 'Rahul';

  const [period, setPeriod] = useState('Week');
  const [orbOpen, setOrbOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMsgs, setChatMsgs] = useState([
    { from: 'bot', text: `Hello ${fname}! I'm your AI health assistant. How can I help you today? 💙` },
  ]);
  const chatEndRef = useRef(null);

  const chartData = period === 'Month' ? monthData : weekData;

  /* Auto-scroll chat */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMsgs, orbOpen]);

  /* Get time of day */
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const sendChat = (text) => {
    const msg = text || chatInput.trim();
    if (!msg) return;
    setChatInput('');
    setChatMsgs(prev => [...prev, { from: 'user', text: msg }]);
    setTimeout(() => {
      setChatMsgs(prev => [...prev, {
        from: 'bot',
        text: `I understand you're asking about "${msg}". Based on your health data, everything looks normal. Would you like me to schedule an appointment?`,
      }]);
    }, 900);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 1400, margin: '0 auto' }}>

      {/* ════════════════════════════════════
          SECTION 1 — HERO CARD
          ════════════════════════════════════ */}
      <FadeUp delay={0}>
        <div className="hero-card" style={{ padding: '36px 40px', marginBottom: 28 }}>

          {/* Decorative blobs */}
          <div style={{
            position: 'absolute', top: -60, right: -60, width: 280, height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)',
            filter: 'blur(40px)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -80, left: 100, width: 320, height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
            filter: 'blur(50px)', pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>

            {/* ── Left: Greeting ── */}
            <div style={{ flex: '1 1 260px', minWidth: 220 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 100, padding: '5px 14px', marginBottom: 16,
              }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  AI Health Report
                </span>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 6px #22d3ee' }} />
              </div>

              <h1 style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                fontWeight: 900,
                color: 'white',
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                marginBottom: 10,
              }}>
                {greeting}, {fname}! 👋
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, maxWidth: 320 }}>
                Your health is looking great today. All vital signs are within normal range. Keep it up!
              </p>

              <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/health-score')}
                  style={{
                    background: 'white', color: '#1d4ed8',
                    border: 'none', borderRadius: 12,
                    padding: '10px 20px', fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)'; }}
                >
                  View Full Report <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => navigate('/iot-monitor')}
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: 12,
                    padding: '10px 20px', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                >
                  <Activity size={14} /> Live Monitor
                </button>
              </div>
            </div>

            {/* ── Center: Health Ring ── */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
              <HealthRing score={92} />
              <div style={{
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 10, padding: '5px 14px',
                fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 600,
              }}>
                ✨ Excellent
              </div>
            </div>

            {/* ── Right: Vital Pills ── */}
            <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 12, minWidth: 220 }}>
              {[
                { icon: Heart, label: 'Heart Rate', value: '78', unit: 'bpm', color: '#f87171', trend: '+2%', ok: true },
                { icon: Activity, label: 'Oxygen Level', value: '98', unit: '%', color: '#34d399', trend: 'Normal', ok: true },
                { icon: Moon, label: 'Sleep', value: '7h 45m', unit: '', color: '#a78bfa', trend: 'Good', ok: true },
                { icon: Droplets, label: 'Water', value: '1.8', unit: 'L', color: '#60a5fa', trend: '72%', ok: true },
              ].map((v, i) => (
                <motion.div
                  key={v.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="stat-pill"
                  style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
                  onClick={() => navigate('/iot-monitor')}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                    background: `${v.color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <v.icon style={{ width: 18, height: 18, color: v.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                      {v.label}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: 'white', fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.02em' }}>
                        {v.value}
                      </span>
                      {v.unit && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{v.unit}</span>}
                    </div>
                  </div>
                  <div style={{
                    padding: '3px 10px', borderRadius: 100,
                    background: 'rgba(34,211,238,0.15)',
                    fontSize: 10, color: '#67e8f9', fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {v.trend}
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </FadeUp>

      {/* ════════════════════════════════════
          SECTION 2 — ANALYTICS + ACTIONS
          ════════════════════════════════════ */}
      <FadeUp delay={0.1}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 28 }} className="section-grid-analytics">

          {/* ── Left: Area Chart ── */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-900)', fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.02em', marginBottom: 4 }}>
                  Weekly Health Trends
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text-400)' }}>
                  Blood pressure, heart rate & oxygen levels
                </p>
              </div>
              {/* Period switcher */}
              <div style={{
                display: 'flex', gap: 4,
                background: 'var(--surface-2)',
                borderRadius: 12, padding: 4,
                border: '1px solid var(--border)',
              }}>
                {['Week', 'Month'].map(p => (
                  <button key={p} onClick={() => setPeriod(p)}
                    style={{
                      padding: '6px 16px', borderRadius: 8, border: 'none',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif",
                      background: period === p ? 'linear-gradient(135deg, #2563eb, #0ea5e9)' : 'transparent',
                      color: period === p ? 'white' : 'var(--text-400)',
                      boxShadow: period === p ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
                      transition: 'all 0.2s',
                    }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
              {[
                { key: 'bp', label: 'Blood Pressure', color: '#2563eb' },
                { key: 'hr', label: 'Heart Rate', color: '#ef4444' },
                { key: 'spo2', label: 'SpO₂', color: '#06b6d4' },
              ].map(l => (
                <div key={l.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 24, height: 3, borderRadius: 99, background: l.color }} />
                  <span style={{ fontSize: 12, color: 'var(--text-400)', fontWeight: 500 }}>{l.label}</span>
                </div>
              ))}
            </div>

            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gBP" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gHR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gSPO" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: 'var(--text-300)', fontSize: 11, fontFamily: 'Inter' }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'var(--text-300)', fontSize: 11, fontFamily: 'Inter' }}
                    axisLine={false} tickLine={false}
                    domain={[60, 135]}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="bp" stroke="#2563eb" strokeWidth={2.5}
                    fill="url(#gBP)" name="Blood Pressure" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="hr" stroke="#ef4444" strokeWidth={2}
                    fill="url(#gHR)" name="Heart Rate" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="spo2" stroke="#06b6d4" strokeWidth={2}
                    fill="url(#gSPO)" name="SpO₂" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Right: Quick Actions ── */}
          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-900)', fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.02em', marginBottom: 4 }}>
                Quick Actions
              </h2>
              <p style={{ fontSize: 12, color: 'var(--text-400)' }}>
                Get things done fast
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {QUICK_ACTIONS.map((action, i) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => navigate(action.to)}
                  className="quick-btn"
                  style={{ borderLeft: `3px solid ${action.color}` }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: action.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <action.icon style={{ width: 18, height: 18, color: action.color }} />
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-900)', marginBottom: 2, letterSpacing: '-0.01em' }}>
                      {action.label}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-400)' }}>
                      {action.sub}
                    </p>
                  </div>
                  <ArrowRight style={{ width: 16, height: 16, color: 'var(--text-300)', flexShrink: 0 }} />
                </motion.button>
              ))}
            </div>

            {/* Next appointment mini */}
            <div style={{
              marginTop: 16, padding: '14px 16px',
              background: 'linear-gradient(135deg, #eff6ff, #e0f2fe)',
              borderRadius: 16, border: '1px solid rgba(37,99,235,0.1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Clock style={{ width: 16, height: 16, color: '#2563eb', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#1d4ed8', letterSpacing: '-0.01em' }}>
                    Next: Dr. Anjali Sharma
                  </p>
                  <p style={{ fontSize: 10, color: '#60a5fa', marginTop: 1 }}>
                    24 May 2026 · 10:30 AM
                  </p>
                </div>
                <button
                  onClick={() => navigate('/video-consult')}
                  style={{
                    background: '#2563eb', color: 'white', border: 'none',
                    borderRadius: 8, padding: '5px 10px', fontSize: 10,
                    fontWeight: 700, cursor: 'pointer', display: 'flex',
                    alignItems: 'center', gap: 4, fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <Video size={10} /> Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ════════════════════════════════════
          SECTION 3 — NEARBY HOSPITALS
          ════════════════════════════════════ */}
      <FadeUp delay={0.18}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-900)', fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.02em' }}>
                Nearby Hospitals
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-400)', marginTop: 2 }}>
                Based on your location
              </p>
            </div>
            <button
              onClick={() => navigate('/hospital-finder')}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 13, fontWeight: 600, color: '#2563eb',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              View all <ChevronRight size={14} />
            </button>
          </div>

          {/* Horizontal scroll container */}
          <div style={{
            display: 'flex', gap: 16,
            overflowX: 'auto', paddingBottom: 8,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
            className="hide-scrollbar"
          >
            {HOSPITALS.map((h, i) => (
              <motion.div
                key={h.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="hospital-card"
                onClick={() => navigate('/hospital-finder')}
              >
                {/* Image area */}
                <div style={{
                  width: '100%', height: 100,
                  background: `linear-gradient(135deg, ${h.color}18, ${h.color}08)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <span style={{ fontSize: 44 }}>{h.emoji}</span>
                  {/* Color accent bar */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${h.color}, ${h.color}80)`,
                  }} />
                </div>

                {/* Content */}
                <div style={{ padding: '14px 16px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-900)', letterSpacing: '-0.01em', flex: 1, paddingRight: 4 }}>
                      {h.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                      <Star style={{ width: 11, height: 11, fill: '#f59e0b', color: '#f59e0b' }} />
                      <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-700)' }}>{h.rating}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: 11, color: 'var(--text-400)', marginBottom: 10 }}>
                    {h.specialty}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                    <MapPin style={{ width: 11, height: 11, color: 'var(--text-300)', flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: 'var(--text-400)' }}>{h.dist} away</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {h.emergency && (
                      <span style={{
                        fontSize: 9, fontWeight: 700,
                        background: '#fee2e2', color: '#b91c1c',
                        borderRadius: 100, padding: '2px 8px',
                        letterSpacing: '0.02em',
                      }}>🚨 24/7 ER</span>
                    )}
                    {h.icu && (
                      <span style={{
                        fontSize: 9, fontWeight: 700,
                        background: '#d1fae5', color: '#065f46',
                        borderRadius: 100, padding: '2px 8px',
                      }}>✅ ICU</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ════════════════════════════════════
          SECTION 4 — DOCTOR RECOMMENDATIONS
          ════════════════════════════════════ */}
      <FadeUp delay={0.24}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-900)', fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.02em' }}>
                Top Doctors for You
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-400)', marginTop: 2 }}>
                AI-matched specialists based on your health profile
              </p>
            </div>
            <button
              onClick={() => navigate('/doctors')}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 13, fontWeight: 600, color: '#2563eb',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              View all <ChevronRight size={14} />
            </button>
          </div>

          <div style={{
            display: 'flex', gap: 16,
            overflowX: 'auto', paddingBottom: 8,
            scrollbarWidth: 'none',
          }}>
            {DOCTORS.map((doc, i) => (
              <motion.div
                key={doc.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="doctor-card"
                onClick={() => navigate(doc.to)}
              >
                {/* Avatar */}
                <div style={{
                  width: 52, height: 52, borderRadius: 16, marginBottom: 12,
                  background: `linear-gradient(135deg, ${doc.color}20, ${doc.color}10)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26,
                  border: `2px solid ${doc.color}20`,
                }}>
                  {doc.emoji}
                </div>

                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-900)', letterSpacing: '-0.01em', marginBottom: 2, whiteSpace: 'nowrap' }}>
                  {doc.name}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-400)', marginBottom: 10 }}>
                  {doc.specialty} · {doc.exp}
                </p>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
                  <div style={{ display: 'flex', gap: 1 }}>
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} style={{
                        width: 10, height: 10,
                        fill: s < Math.floor(doc.rating) ? '#f59e0b' : '#e2e8f0',
                        color: s < Math.floor(doc.rating) ? '#f59e0b' : '#e2e8f0',
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-700)' }}>{doc.rating}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-300)' }}>({doc.reviews})</span>
                </div>

                {/* Availability + Fee */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: doc.available ? '#10b981' : '#f59e0b',
                    boxShadow: doc.available ? '0 0 6px rgba(16,185,129,0.5)' : '0 0 6px rgba(245,158,11,0.5)',
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 11, color: doc.available ? '#059669' : '#d97706', fontWeight: 600 }}>
                    {doc.available ? 'Available Today' : 'Tomorrow'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-900)' }}>{doc.fee}</span>
                  <button
                    onClick={e => { e.stopPropagation(); navigate(doc.to); }}
                    style={{
                      background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                      color: 'white', border: 'none', borderRadius: 10,
                      padding: '7px 14px', fontSize: 11, fontWeight: 700,
                      cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                      boxShadow: '0 4px 10px rgba(37,99,235,0.25)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
                  >
                    Book
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ════════════════════════════════════
          FLOATING AI ORB
          ════════════════════════════════════ */}
      <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>

        {/* Chat Popup */}
        <AnimatePresence>
          {orbOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="orb-chat"
              style={{ boxShadow: '0 20px 60px rgba(15,23,42,0.18)' }}
            >
              {/* Chat header */}
              <div style={{
                padding: '14px 16px',
                background: 'linear-gradient(135deg, #1d4ed8, #0284c7)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 12,
                  background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>🤖</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>AI Health Assistant</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>● Online · Always available</p>
                </div>
                <button onClick={() => setOrbOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, width: 28, height: 28, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={13} />
                </button>
              </div>

              {/* Messages */}
              <div style={{ height: 220, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {chatMsgs.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div className={m.from === 'bot' ? 'chat-bubble-bot' : 'chat-bubble-user'}
                      style={{ padding: '8px 12px', maxWidth: '85%', fontSize: 12, lineHeight: 1.5 }}>
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Quick suggestions */}
              <div style={{ padding: '8px 14px', display: 'flex', gap: 6, flexWrap: 'wrap', borderTop: '1px solid var(--border)' }}>
                {AI_SUGGESTIONS.slice(0, 2).map(s => (
                  <button key={s} onClick={() => sendChat(s)} style={{
                    fontSize: 10, padding: '4px 10px', borderRadius: 100,
                    border: '1px solid var(--border)', background: 'var(--surface-2)',
                    color: 'var(--text-500)', cursor: 'pointer', fontWeight: 500,
                    fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap',
                    transition: 'all 0.15s',
                  }}>
                    {s}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div style={{ padding: '10px 12px', display: 'flex', gap: 8, borderTop: '1px solid var(--border)' }}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChat()}
                  placeholder="Ask me anything..."
                  style={{
                    flex: 1, border: '1.5px solid var(--border)',
                    borderRadius: 12, padding: '8px 12px', fontSize: 12,
                    background: 'var(--surface-2)', color: 'var(--text-700)',
                    outline: 'none', fontFamily: "'Inter', sans-serif",
                  }}
                  aria-label="Chat input"
                />
                <button
                  onClick={() => sendChat()}
                  style={{
                    width: 36, height: 36, borderRadius: 10, border: 'none',
                    background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 4px 10px rgba(37,99,235,0.3)',
                    flexShrink: 0,
                  }}
                  aria-label="Send message"
                >
                  <Send size={14} color="white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orb Button */}
        <motion.button
          className="ai-orb"
          onClick={() => setOrbOpen(v => !v)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Open AI assistant"
          title="AI Health Assistant"
        >
          <AnimatePresence mode="wait">
            {orbOpen
              ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={22} color="white" />
                </motion.div>
              : <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Bot size={22} color="white" />
                </motion.div>
            }
          </AnimatePresence>
          {/* Unread badge */}
          {!orbOpen && (
            <span style={{
              position: 'absolute', top: -3, right: -3,
              width: 14, height: 14, borderRadius: '50%',
              background: '#22d3ee', border: '2px solid white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'white' }} />
            </span>
          )}
        </motion.button>
      </div>

      {/* ── Global style: hide scrollbars on horizontal sections ── */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        @media (max-width: 900px) {
          .section-grid-analytics { grid-template-columns: 1fr !important; }
        }
      `}</style>

    </div>
  );
}
