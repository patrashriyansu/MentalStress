import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, Mail, Lock, User, Phone,
  ArrowRight, Heart, Shield, Activity, Zap, Brain
} from 'lucide-react';
import { useAuthStore } from '../../store';

const roles = [
  { id: 'patient', label: 'Patient', icon: '🧑' },
  { id: 'doctor',  label: 'Doctor',  icon: '👨‍⚕️' },
  { id: 'admin',   label: 'Admin',   icon: '🛡️' },
];

const floatingIcons = [
  { icon: Heart,    color: '#ef4444', bg: '#fee2e2', x: '10%',  y: '20%',  delay: 0 },
  { icon: Activity, color: '#2563eb', bg: '#dbeafe', x: '80%',  y: '15%',  delay: 0.5 },
  { icon: Shield,   color: '#10b981', bg: '#d1fae5', x: '85%',  y: '65%',  delay: 1 },
  { icon: Zap,      color: '#f59e0b', bg: '#fef3c7', x: '8%',   y: '70%',  delay: 1.5 },
  { icon: Brain,    color: '#8b5cf6', bg: '#ede9fe', x: '45%',  y: '5%',   delay: 0.8 },
];

const socialBtns = [
  {
    label: 'Google', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    )
  },
  {
    label: 'Apple', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    )
  },
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
    await new Promise(r => setTimeout(r, 1500));
    login({
      id: Date.now(),
      name: form.name || (role === 'admin' ? 'Admin User' : role === 'doctor' ? 'Dr. Arjun Sharma' : 'Rahul Kumar'),
      email: form.email || 'rahul@medivision.ai',
      role,
    });
    setLoading(false);
    navigate(role === 'admin' ? '/admin' : role === 'doctor' ? '/doctor-dashboard' : '/dashboard');
  };

  const demoLogin = async (r = 'patient') => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 800));
    login({ id: 1, name: r === 'doctor' ? 'Dr. Arjun Sharma' : r === 'admin' ? 'Admin User' : 'Rahul Kumar', email: 'demo@medivision.ai', role: r });
    setLoading(false);
    navigate(r === 'admin' ? '/admin' : r === 'doctor' ? '/doctor-dashboard' : '/dashboard');
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ══ LEFT PANEL — Illustration ══ */}
      <div className="hidden lg:flex w-[52%] flex-shrink-0 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #e8f4ff 0%, #dbeafe 35%, #e0f7ff 65%, #f0fdf4 100%)' }}>

        {/* Grid background */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2563eb" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Decorative orbs */}
        <div className="absolute top-16 left-12 w-48 h-48 rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />

        {/* Floating medical icons */}
        {floatingIcons.map((fi, i) => (
          <motion.div key={i}
            className="absolute w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ left: fi.x, top: fi.y, background: fi.bg }}
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 + i, delay: fi.delay, ease: 'easeInOut' }}>
            <fi.icon className="w-5 h-5" style={{ color: fi.color }} />
          </motion.div>
        ))}

        {/* Main content */}
        <div className="relative z-10 text-center px-12 max-w-lg">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)' }}>
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-black text-slate-800" style={{ fontFamily: "'Poppins', sans-serif" }}>MediVision</span>
              <span className="text-2xl font-black" style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: "'Poppins', sans-serif" }}> AI</span>
            </div>
          </div>

          {/* Doctor Illustration */}
          <motion.div animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="relative mx-auto mb-6" style={{ width: 280, height: 280 }}>
            <div className="absolute inset-0 rounded-full opacity-20 blur-2xl"
              style={{ background: 'radial-gradient(circle, #2563eb 30%, transparent 70%)' }} />
            <img src="/hero-doctor.png" alt="AI Doctor" className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
            <div className="relative z-10 w-full h-full items-center justify-center text-8xl" style={{ display:'none' }}>👨‍⚕️</div>
          </motion.div>

          <motion.h2 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
            className="text-3xl font-black text-slate-800 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Your Health,<br />
            <span style={{ background:'linear-gradient(135deg,#2563eb,#06b6d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Powered by AI
            </span>
          </motion.h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            The most advanced healthcare platform with AI symptom analysis, smart diagnostics, real-time monitoring, and instant emergency response.
          </p>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6">
            {[
              { v: '2M+', l: 'Patients' },
              { v: '98%', l: 'Accuracy' },
              { v: '500+', l: 'Hospitals' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <p className="text-xl font-black" style={{ color: '#2563eb', fontFamily:"'Poppins',sans-serif" }}>{s.v}</p>
                <p className="text-xs text-slate-400 font-medium">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Trusted by */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex -space-x-2">
              {['👩‍⚕️','👨‍⚕️','🧑‍⚕️','👩','👨'].map((e,i)=>(
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-sm shadow">{e}</div>
              ))}
            </div>
            <p className="text-xs text-slate-500 ml-1"><span className="font-bold text-slate-700">10M+ users</span> trust MediVision</p>
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL — Form ══ */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-14 py-10 bg-white">
        <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
          className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black text-slate-800" style={{ fontFamily:"'Poppins',sans-serif" }}>MediVision <span style={{ color:'#2563eb' }}>AI</span></span>
          </div>

          <p className="text-slate-400 text-sm mb-1 font-medium">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
          <h1 className="text-3xl font-black text-slate-900 mb-6" style={{ fontFamily:"'Poppins',sans-serif" }}>
            {mode === 'login' ? 'Hello Again! 👋' : 'Get Started 🚀'}
          </h1>

          {/* Role Selector */}
          <div className="flex gap-1.5 p-1 rounded-xl mb-6" style={{ background:'#f1f5fd' }}>
            {roles.map(r => (
              <button key={r.id} onClick={() => setRole(r.id)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5"
                style={{
                  background: role===r.id ? 'white' : 'transparent',
                  color: role===r.id ? '#2563eb' : '#64748b',
                  boxShadow: role===r.id ? '0 2px 8px rgba(37,99,235,0.1)' : 'none',
                }}>
                <span>{r.icon}</span> {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input className="input-field pl-11" placeholder="Full Name" value={form.name} onChange={set('name')} />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="email" className="input-field pl-11" placeholder="Enter your email" value={form.email} onChange={set('email')} />
            </div>

            {mode === 'register' && (
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input className="input-field pl-11" placeholder="Phone number" value={form.phone} onChange={set('phone')} />
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-slate-600">Password</label>
                {mode === 'login' && <a href="#" className="text-xs font-semibold" style={{ color:'#2563eb' }}>Forgot Password?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPass?'text':'password'} className="input-field pl-11 pr-11"
                  placeholder="Enter your password" value={form.password} onChange={set('password')} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-blue-600" />
                <span className="text-sm text-slate-500">Remember me</span>
              </label>
            )}

            <motion.button type="submit" disabled={loading} whileTap={{ scale:0.97 }}
              className="btn btn-primary w-full py-3.5 text-sm rounded-xl"
              style={{ background:'linear-gradient(135deg,#2563eb,#0ea5e9)', boxShadow:'0 4px 18px rgba(37,99,235,0.35)' }}>
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" className="opacity-30"/><path fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Please wait...</>
              ) : (
                <>{mode==='login' ? 'Login' : 'Create Account'} <ArrowRight className="w-4 h-4"/></>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400">Or continue with</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Social */}
          <div className="flex gap-3">
            {socialBtns.map(s => (
              <motion.button key={s.label} whileTap={{ scale:0.96 }} onClick={() => demoLogin('patient')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                style={{ borderColor:'#e8edf8' }}>
                {s.icon} {s.label}
              </motion.button>
            ))}
          </div>

          {/* Switch */}
          <p className="text-center text-sm text-slate-500 mt-6">
            {mode==='login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(m => m==='login'?'register':'login')}
              className="font-bold hover:underline" style={{ color:'#2563eb' }}>
              {mode==='login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {/* Quick Demo */}
          <div className="mt-5 p-3.5 rounded-2xl border" style={{ background:'#f8faff', borderColor:'#dbeafe' }}>
            <p className="text-xs font-bold text-center mb-2.5" style={{ color:'#2563eb' }}>⚡ Quick Demo Access</p>
            <div className="flex gap-2">
              {roles.map(r => (
                <button key={r.id} onClick={() => demoLogin(r.id)}
                  className="flex-1 text-xs py-2 rounded-xl font-semibold transition-all border"
                  style={{ background:'white', color:'#2563eb', borderColor:'#bfdbfe' }}
                  onMouseEnter={e => { e.target.style.background='#2563eb'; e.target.style.color='white'; }}
                  onMouseLeave={e => { e.target.style.background='white'; e.target.style.color='#2563eb'; }}>
                  {r.icon} {r.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
