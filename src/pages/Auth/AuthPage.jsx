import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, Mail, Lock, User, Phone,
  ArrowRight, Heart, Shield, Activity, Zap, Brain, Sparkles, Check
} from 'lucide-react';
import { useAuthStore } from '../../store';

const roles = [
  { id: 'patient', label: 'Patient Portal', icon: '🧑', desc: 'Check symptoms & track health' },
  { id: 'doctor',  label: 'Doctor Portal',  icon: '👨‍⚕️', desc: 'Consultations & schedules' },
  { id: 'admin',   label: 'Admin Portal',   icon: '🛡️', desc: 'Manage clinic & analytics' },
];

const floatingTelemetry = [
  { label: "SYS_HEALTH", val: "99.8%", status: "OPTIMAL", color: "text-emerald-400" },
  { label: "AI_ACCURACY", val: "96.5%", status: "INFERENCE", color: "text-cyan-400" },
  { label: "NODE_STABILITY", val: "100%", status: "ACTIVE", color: "text-blue-400" },
];

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('patient');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e?.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    // Fix: extract username from email prefix if name is empty, ensuring custom user IDs are used
    const displayName = form.name || (form.email ? form.email.split('@')[0] : (role === 'admin' ? 'Admin User' : role === 'doctor' ? 'Dr. Arjun Sharma' : 'Rahul Kumar'));

    login({
      id: Date.now(),
      name: displayName,
      email: form.email || 'demo@medivision.ai',
      role,
    });
    setLoading(false);
    navigate(role === 'admin' ? '/admin' : role === 'doctor' ? '/doctor-dashboard' : '/dashboard');
  };

  const demoLogin = async (r = 'patient') => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 800));
    const demoName = r === 'doctor' ? 'Dr. Arjun Sharma' : r === 'admin' ? 'Admin User' : 'Rahul Kumar';
    login({ 
      id: 1, 
      name: demoName, 
      email: `demo-${r}@medivision.ai`, 
      role: r 
    });
    setLoading(false);
    navigate(r === 'admin' ? '/admin' : r === 'doctor' ? '/doctor-dashboard' : '/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex bg-[#070b13] text-white overflow-hidden relative font-sans selection:bg-blue-600 selection:text-white">
      
      {/* ── Ambient Radial Glows (Background) ── */}
      <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full opacity-30 blur-[150px] bg-gradient-to-br from-blue-700 to-transparent pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] rounded-full opacity-25 blur-[150px] bg-gradient-to-tr from-cyan-500 to-transparent pointer-events-none" />
      <div className="absolute top-[30%] left-[40%] w-[35%] h-[35%] rounded-full opacity-10 blur-[120px] bg-purple-600 pointer-events-none" />

      {/* ── Grid Overlay ── */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* ══ LEFT SIDEBAR — 3D Cyber-Healthcare Visuals ══ */}
      <div className="hidden lg:flex w-[52%] flex-col relative justify-between p-12 border-r border-white/[0.04] bg-white/[0.01] backdrop-blur-[2px] z-10">
        
        {/* Top bar Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-500 shadow-[0_4px_20px_rgba(37,99,235,0.4)]">
            <Heart className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="leading-none">
            <div className="text-xl font-extrabold tracking-tight">
              MediVision<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> AI</span>
            </div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 block">Futuristic Healthcare</span>
          </div>
        </div>

        {/* Dynamic Telemetry Display & 3D Illustration */}
        <div className="my-auto max-w-lg mx-auto w-full text-center relative">
          
          {/* Animated Tech Ring Container */}
          <div className="relative w-[340px] h-[340px] mx-auto flex items-center justify-center mb-8">
            {/* Spinning Neon Outers */}
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/20 animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-6 rounded-full border border-blue-500/10 animate-[spin_30s_linear_infinite_reverse]" />
            
            {/* Pulsing Backlit Glow */}
            <div className="absolute inset-16 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
            
            {/* 3D Medical Illustration Image */}
            <motion.div 
              animate={{ y: [0, -12, 0] }} 
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="relative z-10 w-[240px] h-[240px] rounded-full overflow-hidden border border-white/[0.08] bg-slate-900/60 p-4 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
            >
              <img 
                src="/doctor-login.png" 
                alt="MediVision Tech" 
                className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(6,182,212,0.3)]"
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
              />
              <div className="hidden w-full h-full items-center justify-center text-7xl select-none">👨‍⚕️</div>
            </motion.div>
          </div>

          <motion.h2 
            initial={{ opacity:0, y:15 }} 
            animate={{ opacity:1, y:0 }} 
            transition={{ delay:0.2 }}
            className="text-4xl font-extrabold tracking-tight mb-4 leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Smart Diagnostics<br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Accelerated by Intelligence
            </span>
          </motion.h2>
          
          <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto mb-8 font-medium">
            Connect medical sensors, perform automated diagnostic screenings, and track vitals through our state-of-the-art secure neural framework.
          </p>

          {/* Telemetry statistics grid */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl border border-white/[0.04] bg-white/[0.02] backdrop-blur-sm max-w-md mx-auto">
            {floatingTelemetry.map((t, idx) => (
              <div key={idx} className="text-center relative">
                {idx > 0 && <div className="absolute left-0 top-1/4 h-1/2 w-[1px] bg-white/[0.08]" />}
                <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">{t.label}</p>
                <p className={`text-xl font-extrabold mt-1 ${t.color}`}>{t.val}</p>
                <p className="text-[8px] font-bold text-slate-400/80 mt-0.5 tracking-widest">{t.status}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-t border-white/[0.04] pt-6">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Secure End-to-End HIPAA Cryptography</span>
          </div>
          <span>v2.1.0</span>
        </div>

      </div>

      {/* ══ RIGHT SIDEBAR — Glassmorphic Onboarding Form ══ */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 md:px-12 lg:px-16 py-12 relative z-10">
        
        {/* Mobile Header Logo */}
        <div className="absolute top-8 left-8 flex lg:hidden items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-500">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="text-md font-extrabold tracking-tight">MediVision <span className="text-cyan-400">AI</span></span>
        </div>

        <motion.div 
          initial={{ opacity:0, y:20 }} 
          animate={{ opacity:1, y:0 }} 
          transition={{ duration:0.6, ease:[0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px] bg-white/[0.02] border border-white/[0.06] shadow-[0_24px_80px_rgba(0,0,0,0.6)] rounded-[32px] p-8 md:p-10 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="mb-8">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
              {mode === 'login' ? 'Security Gateway' : 'Ecosystem Entry'}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {mode === 'login' ? 'Portal Access' : 'Create Profile'}
            </h1>
            <p className="text-slate-400 text-xs mt-1.5 font-medium">
              Select your system node role below to connect.
            </p>
          </div>

          {/* Sliding Role Selector */}
          <div className="relative flex gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.04] mb-6">
            {roles.map(r => (
              <button 
                key={r.id} 
                type="button" 
                onClick={() => setRole(r.id)}
                className="flex-1 py-3 rounded-xl text-xs font-bold transition-all duration-300 relative z-10 flex flex-col items-center gap-0.5 cursor-pointer"
                style={{ color: role === r.id ? 'white' : '#94a3b8' }}
              >
                <span className="text-sm">{r.icon}</span>
                <span>{r.label.split(' ')[0]}</span>
              </button>
            ))}
            
            {/* Sliding Pill Background */}
            <div 
              className="absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 shadow-[0_4px_16px_rgba(37,99,235,0.4)] transition-all duration-300 pointer-events-none"
              style={{
                left: role === 'patient' ? '4px' : role === 'doctor' ? 'calc(33.33% + 2px)' : 'calc(66.66% + 1px)',
                width: 'calc(33.33% - 5px)'
              }}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <AnimatePresence mode="popLayout">
              {mode === 'register' && (
                <motion.div 
                  initial={{ opacity:0, y:-10 }}
                  animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-10 }}
                  className="relative"
                >
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    className="w-full bg-white/[0.02] border border-white/[0.08] focus:border-blue-500/50 focus:bg-white/[0.04] rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-500" 
                    placeholder="Full Name" 
                    value={form.name} 
                    onChange={set('name')} 
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                required
                type="email" 
                className="w-full bg-white/[0.02] border border-white/[0.08] focus:border-blue-500/50 focus:bg-white/[0.04] rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-500" 
                placeholder="Secure Email" 
                value={form.email} 
                onChange={set('email')} 
              />
            </div>

            <AnimatePresence mode="popLayout">
              {mode === 'register' && (
                <motion.div 
                  initial={{ opacity:0, y:-10 }}
                  animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-10 }}
                  className="relative"
                >
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="tel" 
                    className="w-full bg-white/[0.02] border border-white/[0.08] focus:border-blue-500/50 focus:bg-white/[0.04] rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-500" 
                    placeholder="Mobile Identifier (optional)" 
                    value={form.phone} 
                    onChange={set('phone')} 
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                required
                type={showPass ? 'text' : 'password'} 
                className="w-full bg-white/[0.02] border border-white/[0.08] focus:border-blue-500/50 focus:bg-white/[0.04] rounded-2xl pl-11 pr-12 py-3.5 text-sm outline-none transition-all focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-500" 
                placeholder="Access Keyphrase" 
                value={form.password} 
                onChange={set('password')} 
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
              </button>
            </div>

            {mode === 'login' && (
              <div className="flex justify-between items-center text-xs font-semibold pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 select-none">
                  <input type="checkbox" className="w-4 h-4 rounded-lg bg-white/5 border-white/10 accent-blue-600 cursor-pointer" />
                  <span>Persistent Session</span>
                </label>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Recover Keys</a>
              </div>
            )}

            {/* Action Submit Button */}
            <motion.button 
              type="submit" 
              disabled={loading} 
              whileTap={{ scale:0.98 }}
              className="w-full py-3.5 mt-2 rounded-2xl font-bold text-sm tracking-wide bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_8px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_30px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 text-white cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-20"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span>Syncing Nodes...</span>
                </div>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Establish Access' : 'Register Profile'}</span> 
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Mode Switcher */}
          <p className="text-center text-xs text-slate-400 mt-6 font-semibold">
            {mode === 'login' ? "New node to the network? " : 'Authorized keys exist? '}
            <button 
              type="button" 
              onClick={() => setMode(m => m === 'login' ? 'register' : 'login')}
              className="text-cyan-400 hover:text-cyan-300 font-extrabold hover:underline cursor-pointer"
            >
              {mode === 'login' ? 'Register Account' : 'Gateway Login'}
            </button>
          </p>

          {/* Developer/Quick Demo Access Console */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[8px] font-bold tracking-widest text-slate-500 uppercase bg-[#070b13] border border-white/[0.06] rounded-full">
              Bypass Demo Console
            </span>
            
            <div className="grid grid-cols-3 gap-2 mt-2">
              {roles.map(r => (
                <button 
                  key={r.id} 
                  type="button" 
                  onClick={() => demoLogin(r.id)}
                  className="text-[10px] py-3 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-blue-600/10 hover:border-blue-500/30 transition-all font-bold flex flex-col items-center gap-1 cursor-pointer"
                >
                  <span className="text-sm">{r.icon}</span>
                  <span className="text-slate-300">{r.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
