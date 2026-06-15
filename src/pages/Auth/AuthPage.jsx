import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Heart, Shield, Activity, Zap, Brain, Stethoscope, Wifi } from 'lucide-react';
import { useAuthStore } from '../../store';

const ROLES = [
  { id: 'patient', label: 'Patient',  emoji: '🧑',  color: '#3b82f6', desc: 'Track & manage your health' },
  { id: 'doctor',  label: 'Doctor',   emoji: '👨‍⚕️', color: '#06b6d4', desc: 'Manage patients & schedules' },
  { id: 'admin',   label: 'Admin',    emoji: '🛡️',  color: '#8b5cf6', desc: 'Full platform control' },
];

const FEATURES = [
  { icon: Brain,       label: 'AI Diagnostics',      desc: 'Neural-powered disease prediction',  color: '#3b82f6' },
  { icon: Activity,    label: 'Live Vitals',          desc: 'Real-time IoT health monitoring',    color: '#06b6d4' },
  { icon: Shield,      label: 'HIPAA Secure',         desc: 'Military-grade data encryption',     color: '#10b981' },
  { icon: Stethoscope, label: '500+ Specialists',     desc: 'Instant expert consultations',       color: '#f59e0b' },
];

const STATS = [
  { value: '2M+',  label: 'Active Patients' },
  { value: '98.6%',label: 'AI Accuracy' },
  { value: '< 8s', label: 'Emergency ETA' },
];

// Animated floating particle component
function Particle({ x, y, size, delay, color }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color, filter: 'blur(1px)' }}
      animate={{ y: [0, -40, 0], opacity: [0.15, 0.5, 0.15], scale: [1, 1.3, 1] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

export default function AuthPage() {
  const [mode, setMode]         = useState('login');
  const [role, setRole]         = useState('patient');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [step, setStep]         = useState(0); // animated step counter for left panel
  const [form, setForm]         = useState({ name: '', email: '', phone: '', password: '' });
  const login    = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const setField = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  // Cycle through feature highlights on left panel
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % FEATURES.length), 2800);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async e => {
    e?.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));

    // Use full name if given, else extract from email, else role default
    const displayName =
      form.name.trim() ||
      (form.email ? form.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : null) ||
      (role === 'admin' ? 'Admin User' : role === 'doctor' ? 'Dr. Arjun Sharma' : 'New User');

    login({ id: Date.now(), name: displayName, email: form.email, role });
    setLoading(false);
    navigate(role === 'admin' ? '/admin' : role === 'doctor' ? '/doctor-dashboard' : '/dashboard');
  };

  const demoLogin = async (r = 'patient') => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 900));
    const names = { patient: 'Alex Johnson', doctor: 'Dr. Arjun Sharma', admin: 'Admin User' };
    login({ id: Date.now(), name: names[r], email: `${r}@demo.medivision.ai`, role: r });
    setLoading(false);
    navigate(r === 'admin' ? '/admin' : r === 'doctor' ? '/doctor-dashboard' : '/dashboard');
  };

  const activeRole = ROLES.find(r => r.id === role);

  // Particles config
  const particles = [
    { x: '8%',  y: '15%', size: 6,  delay: 0,   color: 'rgba(59,130,246,0.6)' },
    { x: '85%', y: '20%', size: 8,  delay: 1.2, color: 'rgba(6,182,212,0.6)' },
    { x: '12%', y: '60%', size: 5,  delay: 0.6, color: 'rgba(139,92,246,0.6)' },
    { x: '78%', y: '70%', size: 7,  delay: 1.8, color: 'rgba(59,130,246,0.6)' },
    { x: '45%', y: '8%',  size: 5,  delay: 0.3, color: 'rgba(16,185,129,0.6)' },
    { x: '90%', y: '45%', size: 4,  delay: 2.1, color: 'rgba(245,158,11,0.5)' },
    { x: '25%', y: '88%', size: 6,  delay: 1.4, color: 'rgba(6,182,212,0.5)' },
    { x: '65%', y: '85%', size: 4,  delay: 0.9, color: 'rgba(139,92,246,0.5)' },
  ];

  return (
    <div className="min-h-screen w-full flex overflow-hidden relative" style={{ background: '#060912', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Deep background glows ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute" style={{ top: '-15%', left: '-10%', width: '60%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute" style={{ bottom: '-15%', right: '-10%', width: '60%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute" style={{ top: '40%', left: '35%', width: '30%', height: '30%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        {/* Subtle grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />

        {/* Floating particles */}
        {particles.map((p, i) => <Particle key={i} {...p} />)}
      </div>

      {/* ══════════════════════════════════════════════════════
          LEFT PANEL — Hero / Showcase
      ══════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex w-[52%] flex-col justify-between p-14 relative z-10 border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', boxShadow: '0 8px 24px rgba(37,99,235,0.4)' }}>
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.03em' }}>
              MediVision<span style={{ background: 'linear-gradient(135deg, #60a5fa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> AI</span>
            </div>
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Smart Healthcare Platform</div>
          </div>
        </motion.div>

        {/* Center hero section */}
        <div className="flex-1 flex flex-col justify-center max-w-lg">

          {/* Headline */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-bold text-cyan-400 border" style={{ background: 'rgba(6,182,212,0.08)', borderColor: 'rgba(6,182,212,0.2)' }}>
              <Wifi className="w-3 h-3" />
              Now Live — v2.1 Neural Framework
            </div>

            <h1 className="text-5xl font-black text-white mb-5 leading-[1.1]" style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.03em' }}>
              Healthcare<br />
              <span style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #06b6d4 50%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Reimagined by AI
              </span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed font-medium mb-10">
              The world's most advanced AI-powered health ecosystem. Diagnose, monitor, consult and respond — all in one intelligent platform.
            </p>
          </motion.div>

          {/* Animated feature highlight card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
            <div className="rounded-3xl p-6 border relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
              {/* Glow accent */}
              <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${FEATURES[step].color}, transparent)` }} />

              <div className="flex items-start gap-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${FEATURES[step].color}18`, border: `1px solid ${FEATURES[step].color}30` }}
                  >
                    {React.createElement(FEATURES[step].icon, { className: 'w-6 h-6', style: { color: FEATURES[step].color } })}
                  </motion.div>
                </AnimatePresence>

                <div className="flex-1 min-w-0">
                  <AnimatePresence mode="wait">
                    <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.35 }}>
                      <p className="text-white font-bold text-lg mb-1">{FEATURES[step].label}</p>
                      <p className="text-slate-400 text-sm">{FEATURES[step].desc}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Step dots */}
                <div className="flex flex-col gap-1.5 pt-1">
                  {FEATURES.map((_, i) => (
                    <button key={i} onClick={() => setStep(i)} className="w-1.5 rounded-full transition-all duration-300"
                      style={{ height: i === step ? 20 : 6, background: i === step ? FEATURES[step].color : 'rgba(255,255,255,0.15)' }} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="grid grid-cols-3 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="text-center p-4 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
                <div className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{s.value}</div>
                <div className="text-xs text-slate-500 font-semibold">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>All systems operational</span>
          </div>
          <span>HIPAA · ISO 27001 · SOC 2</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          RIGHT PANEL — Auth Form
      ══════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 md:px-10 lg:px-16 py-12 relative z-10">

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', boxShadow: '0 6px 20px rgba(37,99,235,0.4)' }}>
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            MediVision<span style={{ color: '#06b6d4' }}> AI</span>
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px]"
        >
          {/* Card */}
          <div className="rounded-[28px] border p-8 md:p-10 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)', boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset' }}>

            {/* Top accent glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.6), transparent)' }} />

            {/* Mode toggle */}
            <div className="flex items-center gap-1 p-1 rounded-2xl mb-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {['login', 'register'].map(m => (
                <button key={m} type="button" onClick={() => setMode(m)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-300 cursor-pointer"
                  style={{
                    background: mode === m ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: mode === m ? 'white' : 'rgba(148,163,184,1)',
                    boxShadow: mode === m ? '0 2px 12px rgba(0,0,0,0.3)' : 'none',
                  }}>
                  {m === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            {/* Greeting */}
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.02em' }}>
                {mode === 'login' ? 'Welcome back 👋' : 'Create account 🚀'}
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                {mode === 'login' ? 'Sign in to your MediVision account' : 'Join 2M+ patients and doctors worldwide'}
              </p>
            </div>

            {/* Role Selector */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {ROLES.map(r => (
                <button key={r.id} type="button" onClick={() => setRole(r.id)}
                  className="flex flex-col items-center gap-1 py-3 px-2 rounded-2xl transition-all duration-300 border cursor-pointer"
                  style={{
                    background: role === r.id ? `${r.color}15` : 'rgba(255,255,255,0.02)',
                    borderColor: role === r.id ? `${r.color}50` : 'rgba(255,255,255,0.06)',
                    boxShadow: role === r.id ? `0 0 20px ${r.color}20` : 'none',
                  }}>
                  <span className="text-xl">{r.emoji}</span>
                  <span className="text-xs font-bold" style={{ color: role === r.id ? r.color : 'rgba(148,163,184,1)' }}>{r.label}</span>
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <AnimatePresence>
                {mode === 'register' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="relative overflow-hidden">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(100,116,139,1)' }} />
                    <input
                      type="text" placeholder="Full name"
                      value={form.name} onChange={setField('name')}
                      className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'inherit' }}
                      onFocus={e => { e.target.style.borderColor = activeRole.color + '60'; e.target.style.boxShadow = `0 0 0 3px ${activeRole.color}15`; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(100,116,139,1)' }} />
                <input
                  required type="email" placeholder="Email address"
                  value={form.email} onChange={setField('email')}
                  className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'inherit' }}
                  onFocus={e => { e.target.style.borderColor = activeRole.color + '60'; e.target.style.boxShadow = `0 0 0 3px ${activeRole.color}15`; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <AnimatePresence>
                {mode === 'register' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="relative overflow-hidden">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(100,116,139,1)' }} />
                    <input
                      type="tel" placeholder="Phone (optional)"
                      value={form.phone} onChange={setField('phone')}
                      className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'inherit' }}
                      onFocus={e => { e.target.style.borderColor = activeRole.color + '60'; e.target.style.boxShadow = `0 0 0 3px ${activeRole.color}15`; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(100,116,139,1)' }} />
                <input
                  required type={showPass ? 'text' : 'password'} placeholder="Password"
                  value={form.password} onChange={setField('password')}
                  className="w-full rounded-2xl pl-11 pr-12 py-3.5 text-sm text-white outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'inherit' }}
                  onFocus={e => { e.target.style.borderColor = activeRole.color + '60'; e.target.style.boxShadow = `0 0 0 3px ${activeRole.color}15`; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                  style={{ color: 'rgba(100,116,139,1)' }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {mode === 'login' && (
                <div className="flex justify-between items-center text-xs">
                  <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
                    <input type="checkbox" className="rounded accent-blue-500 cursor-pointer" />
                    Remember me
                  </label>
                  <button type="button" className="font-bold hover:text-white transition-colors" style={{ color: activeRole.color }}>Forgot password?</button>
                </div>
              )}

              {/* Submit */}
              <motion.button
                type="submit" disabled={loading}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                style={{
                  background: `linear-gradient(135deg, ${activeRole.color}, ${activeRole.id === 'patient' ? '#06b6d4' : activeRole.id === 'doctor' ? '#3b82f6' : '#7c3aed'})`,
                  boxShadow: `0 8px 30px ${activeRole.color}40`,
                  opacity: loading ? 0.7 : 1,
                }}>
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                      <path fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-xs text-slate-600 font-semibold">Quick Demo Access</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {/* Demo Login Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(r => (
                <button key={r.id} type="button" onClick={() => demoLogin(r.id)}
                  className="flex flex-col items-center gap-1 py-3 rounded-2xl text-xs font-bold border transition-all duration-200 cursor-pointer group"
                  style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)', color: 'rgba(148,163,184,1)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${r.color}12`; e.currentTarget.style.borderColor = `${r.color}40`; e.currentTarget.style.color = r.color; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(148,163,184,1)'; }}>
                  <span className="text-base">{r.emoji}</span>
                  {r.label}
                </button>
              ))}
            </div>

            {/* Bottom note */}
            <p className="text-center text-xs text-slate-600 mt-6">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button type="button" onClick={() => setMode(m => m === 'login' ? 'register' : 'login')}
                className="font-bold transition-colors cursor-pointer hover:text-white"
                style={{ color: activeRole.color }}>
                {mode === 'login' ? 'Register for free' : 'Sign in instead'}
              </button>
            </p>
          </div>

          {/* Tagline below card */}
          <p className="text-center text-xs text-slate-700 mt-5 font-medium">
            Protected by AES-256 · HIPAA Compliant · Zero-Knowledge Auth
          </p>
        </motion.div>
      </div>
    </div>
  );
}
