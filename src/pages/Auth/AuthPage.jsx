import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Heart, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store';
import toast from 'react-hot-toast';
import { sendEmailNotification } from '../../services/emailService';


const ROLES = [
  { id: 'patient', label: 'Patient',  icon: '🧑‍💼' },
  { id: 'doctor',  label: 'Doctor',   icon: '👨‍⚕️' },
  { id: 'admin',   label: 'Admin',    icon: '🛡️'  },
];

// Google SVG
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// Facebook SVG
const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default function AuthPage() {
  const [mode, setMode]       = useState('login');
  const [role, setRole]       = useState('patient');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm]       = useState({ name: '', email: '', phone: '', password: '', specialty: 'General Physician', hospital: 'MediVision Clinic', experience: '5', fee: '500' });
  const [recoveryUser, setRecoveryUser] = useState(null);
  const [recoveryPhone, setRecoveryPhone] = useState('');

  // Social Login Simulator States
  const [socialModal, setSocialModal] = useState(null); // 'google' | 'facebook' | null
  const [customSocialName, setCustomSocialName] = useState('');
  const [customSocialEmail, setCustomSocialEmail] = useState('');
  const [showCustomSocialInput, setShowCustomSocialInput] = useState(false);

  const { login, registerUser, getUserByEmail } = useAuthStore();
  const navigate = useNavigate();

  const handleSocialSelect = (name, email) => {
    if (!email.trim() || !name.trim()) {
      toast.error('Please fill in both name and email address');
      return;
    }
    const emailNormalized = email.toLowerCase().trim();
    const existing = getUserByEmail(emailNormalized);

    if (existing) {
      login(existing);
      toast.success(`Welcome back, ${existing.name}! (Logged in via ${socialModal === 'google' ? 'Google' : 'Facebook'})`);
      setSocialModal(null);
      setShowCustomSocialInput(false);
      setCustomSocialName('');
      setCustomSocialEmail('');
      navigate(existing.role === 'admin' ? '/admin' : existing.role === 'doctor' ? '/doctor-dashboard' : '/dashboard');
    } else {
      const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: emailNormalized,
        phone: '',
        password: 'social-auth-generated-pass',
        role: role, // Use selected role
        createdAt: new Date().toISOString(),
        ...(role === 'doctor' ? {
          specialty: 'General Physician',
          hospital: 'MediVision Clinic',
          experience: 5,
          fee: 500,
          nextAvailable: 'Today 3:00 PM',
          rating: 4.8
        } : {})
      };
      registerUser(newUser);
      login(newUser);
      toast.success(`Successfully registered and logged in as ${name}!`);
      setSocialModal(null);
      setShowCustomSocialInput(false);
      setCustomSocialName('');
      setCustomSocialEmail('');
      navigate(role === 'admin' ? '/admin' : role === 'doctor' ? '/doctor-dashboard' : '/dashboard');
    }
  };

  const setField = k => e => { setForm(f => ({ ...f, [k]: e.target.value })); setError(''); };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    if (mode === 'register') {
      // Check if email already exists
      const existing = getUserByEmail(form.email.toLowerCase().trim());
      if (existing) {
        setError('An account with this email already exists. Please sign in.');
        setLoading(false);
        return;
      }
      if (!form.name.trim()) { setError('Please enter your full name.'); setLoading(false); return; }
      if (form.password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }

      const newUser = {
        id: Date.now(),
        name: form.name.trim(),
        email: form.email.toLowerCase().trim(),
        phone: form.phone.trim(),
        password: form.password,
        role,
        createdAt: new Date().toISOString(),
        ...(role === 'doctor' ? {
          specialty: form.specialty || 'General Physician',
          hospital: form.hospital || 'MediVision Clinic',
          experience: parseInt(form.experience) || 5,
          fee: parseInt(form.fee) || 500,
          nextAvailable: 'Today 3:00 PM',
          rating: 4.8
        } : {})
      };
      registerUser(newUser);
      login(newUser);
      setLoading(false);
      navigate(role === 'admin' ? '/admin' : role === 'doctor' ? '/doctor-dashboard' : '/dashboard');

    } else if (mode === 'forgot') {
      const userFound = getUserByEmail(form.email.toLowerCase().trim());
      if (!userFound) {
        setError('No account found with this email. Please verify and try again.');
        setLoading(false);
        return;
      }

      try {
        await sendEmailNotification(
          'Password Recovery 🔑',
          `Hello ${userFound.name},\n\nWe received a request to retrieve your password.\n\nYour account password is: ${userFound.password}\n\nIf you did not request this, please secure your account.`,
          userFound
        );
        setSuccess(`Password details have been sent to ${userFound.email}! Check your inbox (or spam folder) for the verification link/message.`);
        setRecoveryUser(userFound);
        setRecoveryPhone(userFound.phone || '');
      } catch (err) {
        console.error(err);
        setError('Failed to send recovery email. Please try again.');
      }
      setLoading(false);

    } else {
      // Login — validate against stored users
      const user = getUserByEmail(form.email.toLowerCase().trim());
      if (!user) {
        setError('No account found with this email. Please register first.');
        setLoading(false);
        return;
      }
      if (user.password !== form.password) {
        setError('Incorrect password. Please try again.');
        setLoading(false);
        return;
      }
      login(user);
      setLoading(false);
      navigate(user.role === 'admin' ? '/admin' : user.role === 'doctor' ? '/doctor-dashboard' : '/dashboard');
    }
  };

  // Each geometric shape for left panel
  const shapes = [
    { size: 420, top: '-10%', left: '-18%', opacity: 0.55, rotate: 30 },
    { size: 320, top: '30%', left: '-8%', opacity: 0.35, rotate: -15 },
    { size: 260, top: '60%', left: '18%', opacity: 0.4, rotate: 50 },
    { size: 200, top: '-5%', left: '45%', opacity: 0.25, rotate: 10 },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f0f4f8', fontFamily: "'Inter', sans-serif", alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

      {/* Outer Card */}
      <div style={{ display: 'flex', width: '100%', maxWidth: 920, minHeight: 560, borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.15)', background: 'white' }}>

        {/* ══ LEFT PANEL — Colorful with geometry ══ */}
        <div style={{ width: '38%', position: 'relative', overflow: 'hidden', background: 'linear-gradient(145deg, #2563eb 0%, #1d4ed8 40%, #0891b2 80%, #06b6d4 100%)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 32px', flexShrink: 0 }} className="hidden md:flex">

          {/* Geometric shapes */}
          {shapes.map((s, i) => (
            <div key={i} style={{
              position: 'absolute', width: s.size, height: s.size,
              top: s.top, left: s.left,
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              background: 'rgba(255,255,255,' + s.opacity + ')',
              transform: `rotate(${s.rotate}deg)`,
              pointerEvents: 'none',
            }} />
          ))}

          {/* Logo */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ width: 40, height: 40, borderRadius: 14, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
              <Heart style={{ width: 20, height: 20, color: 'white' }} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: 'white', letterSpacing: '-0.03em', fontFamily: "'Poppins', sans-serif" }}>MediVision AI</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Smart Healthcare</div>
            </div>
          </div>

          {/* Mode tabs — Login / Sign Up */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[{ id: 'login', label: 'LOGIN' }, { id: 'register', label: 'SIGN UP' }].map(m => (
              <button key={m.id} onClick={() => setMode(m.id)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 140, padding: '14px 20px', borderRadius: 14, border: 'none',
                cursor: 'pointer', fontSize: 13, fontWeight: 800, letterSpacing: '0.06em',
                transition: 'all 0.25s',
                background: mode === m.id ? 'white' : 'transparent',
                color: mode === m.id ? '#2563eb' : 'rgba(255,255,255,0.75)',
                boxShadow: mode === m.id ? '0 8px 24px rgba(0,0,0,0.15)' : 'none',
              }}>
                {m.label}
              </button>
            ))}
          </div>

          {/* Bottom tagline */}
          <div style={{ position: 'absolute', bottom: 32, left: 32, right: 32, zIndex: 2 }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 600, lineHeight: 1.6 }}>
              Secure · HIPAA Compliant<br />256-bit Encryption
            </p>
          </div>
        </div>

        {/* ══ RIGHT PANEL — Clean White Form ══ */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 40px', background: 'white' }}>

          {/* MediVision Logo (right panel) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: 'linear-gradient(135deg, #2563eb, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(37,99,235,0.3)', marginBottom: 10 }}>
              <Heart style={{ width: 26, height: 26, color: 'white' }} />
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: '#2563eb', letterSpacing: '0.05em', fontFamily: "'Poppins', sans-serif", margin: 0, textTransform: 'uppercase' }}>
              {mode === 'login' ? 'Login' : mode === 'forgot' ? 'Forgot Password' : 'Register'}
            </h2>
          </div>

          {/* Mobile mode toggle */}
          {mode !== 'forgot' && !success && (
            <div className="flex md:hidden" style={{ gap: 8, marginBottom: 24, justifyContent: 'center' }}>
              {[{ id: 'login', label: 'Login' }, { id: 'register', label: 'Sign Up' }].map(m => (
                <button key={m.id} onClick={() => setMode(m.id)} style={{
                  padding: '8px 20px', borderRadius: 10, border: '1.5px solid',
                  borderColor: mode === m.id ? '#2563eb' : '#e2e8f0',
                  background: mode === m.id ? '#2563eb' : 'white',
                  color: mode === m.id ? 'white' : '#64748b',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                }}>{m.label}</button>
              ))}
            </div>
          )}

          {/* Role Selector */}
          {mode !== 'forgot' && !success && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {ROLES.map(r => (
                <button key={r.id} onClick={() => setRole(r.id)} style={{
                  flex: 1, padding: '8px 4px', borderRadius: 10,
                  border: '1.5px solid', borderColor: role === r.id ? '#2563eb' : '#e8edf8',
                  background: role === r.id ? '#eff6ff' : 'white',
                  color: role === r.id ? '#2563eb' : '#94a3b8',
                  fontWeight: 700, fontSize: 11, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  transition: 'all 0.2s',
                }}>
                  <span style={{ fontSize: 16 }}>{r.icon}</span>
                  {r.label}
                </button>
              ))}
            </div>
          )}

          {/* Error / Success messages */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 14, color: '#dc2626', fontSize: 12, fontWeight: 600 }}>
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Registration Helper Tip */}
          {mode === 'register' && !success && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(37, 99, 235, 0.08)', borderRadius: 10, border: '1px solid rgba(37, 99, 235, 0.15)', fontSize: 11, color: '#2563eb', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, lineHeight: 1.4 }}>
              <span>💡</span>
              <span><strong>Note:</strong> Register with a real email and phone to receive actual verification and booking messages on your device.</span>
            </div>
          )}

          {success ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 14, padding: 18, color: '#065f46', fontSize: 13, lineHeight: 1.5 }}>
                ✅ <strong>Success!</strong> {success}
              </div>

              {recoveryUser && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', padding: 24, borderRadius: 20, border: '2px solid #6c63ff', width: '100%', textAlign: 'center', boxShadow: '0 10px 25px -5px rgba(108,99,255,0.15)' }}>
                  <p style={{ fontSize: 13, fontWeight: 900, color: '#6c63ff', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>📲 SMS & WhatsApp Recovery Dispatcher</p>
                  <p style={{ fontSize: 11.5, color: '#64748b', margin: '2px 0 8px', lineHeight: 1.4 }}>Click below to open your messaging app and send the password details directly to your device.</p>
                  
                  <div style={{ marginBottom: 6, textAlign: 'left' }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Recipient Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={recoveryPhone}
                      onChange={(e) => setRecoveryPhone(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: 12, fontSize: 13.5, background: 'white', color: '#1e293b', fontWeight: 600, outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 4 }}>
                    <button onClick={() => {
                      const msg = `MediVision AI: Hello ${recoveryUser.name}, your account password is: ${recoveryUser.password}`;
                      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                      const link = `sms:${recoveryPhone}${isIOS ? '&' : '?'}body=${encodeURIComponent(msg)}`;
                      window.open(link, '_blank');
                    }} className="btn btn-secondary" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center', cursor: 'pointer', padding: '10px 14px', borderRadius: 12, background: 'white', border: '1.5px solid #e2e8f0', color: '#334155', fontWeight: 700 }}>
                      📱 Send SMS
                    </button>
                    <button onClick={() => {
                      let cleanPhone = recoveryPhone.replace(/\D/g, '');
                      if (cleanPhone.length === 10) {
                        cleanPhone = '91' + cleanPhone;
                      }
                      const msg = `MediVision AI: Hello ${recoveryUser.name}, your account password is: ${recoveryUser.password}`;
                      const link = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
                      window.open(link, '_blank');
                    }} className="btn btn-secondary" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center', cursor: 'pointer', padding: '10px 14px', borderRadius: 12, background: 'white', border: '1.5px solid #e2e8f0', color: '#334155', fontWeight: 700 }}>
                      💬 WhatsApp
                    </button>
                  </div>
                </div>
              )}

              <button onClick={() => { setMode('login'); setSuccess(''); setRecoveryUser(null); }} className="btn btn-primary" style={{ width: '100%' }}>
                Back to Login Screen
              </button>
            </motion.div>
          ) : (
            <>
              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

                <AnimatePresence>
                  {mode === 'register' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                      <InputField icon={<User style={{ width: 16, height: 16, color: '#94a3b8' }} />} placeholder="Full Name" value={form.name} onChange={setField('name')} type="text" required />
                    </motion.div>
                  )}
                </AnimatePresence>

                <InputField icon={<Mail style={{ width: 16, height: 16, color: '#94a3b8' }} />} placeholder="Email" value={form.email} onChange={setField('email')} type="email" required />

                <AnimatePresence>
                  {mode === 'register' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                      <InputField icon={<Phone style={{ width: 16, height: 16, color: '#94a3b8' }} />} placeholder="Phone (optional)" value={form.phone} onChange={setField('phone')} type="tel" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {mode === 'register' && role === 'doctor' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block' }}>Specialty</label>
                        <select className="input-field" value={form.specialty} onChange={setField('specialty')} style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #e8edf8', borderRadius: 10 }}>
                          <option value="General Physician">General Physician</option>
                          <option value="Cardiologist">Cardiologist</option>
                          <option value="Neurologist">Neurologist</option>
                          <option value="Dermatologist">Dermatologist</option>
                          <option value="Orthopedic">Orthopedic</option>
                          <option value="Diabetologist">Diabetologist</option>
                          <option value="Psychiatrist">Psychiatrist</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block' }}>Hospital / Clinic</label>
                        <input className="input-field" placeholder="Hospital/Clinic Name" value={form.hospital} onChange={setField('hospital')} required style={{ padding: '8px 12px', border: '1.5px solid #e8edf8', borderRadius: 10 }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block' }}>Experience (Years)</label>
                          <input className="input-field" type="number" min="0" value={form.experience} onChange={setField('experience')} required style={{ padding: '8px 12px', border: '1.5px solid #e8edf8', borderRadius: 10 }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block' }}>Consultation Fee (₹)</label>
                          <input className="input-field" type="number" min="0" value={form.fee} onChange={setField('fee')} required style={{ padding: '8px 12px', border: '1.5px solid #e8edf8', borderRadius: 10 }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {mode !== 'forgot' && (
                  <InputField
                    icon={<Lock style={{ width: 16, height: 16, color: '#94a3b8' }} />}
                    placeholder="Password"
                    value={form.password}
                    onChange={setField('password')}
                    type={showPass ? 'text' : 'password'}
                    required
                    suffix={
                      <button type="button" onClick={() => setShowPass(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex' }}>
                        {showPass ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                      </button>
                    }
                  />
                )}

                {mode === 'login' && (
                  <div style={{ textAlign: 'right', marginBottom: 20 }}>
                    <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccess(''); setRecoveryUser(null); }} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Submit */}
                <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 14, border: 'none',
                    background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                    color: 'white', fontWeight: 800, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 8px 24px rgba(37,99,235,0.3)', marginBottom: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    opacity: loading ? 0.7 : 1,
                    letterSpacing: '0.04em',
                  }}>
                  {loading ? (
                    <>
                      <svg className="animate-spin" style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                        <path fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {mode === 'login' ? 'Signing In...' : mode === 'forgot' ? 'Retrieving Password...' : 'Creating Account...'}
                    </>
                  ) : (
                    <>{mode === 'login' ? 'LOGIN' : mode === 'forgot' ? 'RETRIEVE PASSWORD' : 'CREATE ACCOUNT'} <ArrowRight style={{ width: 16, height: 16 }} /></>
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              {mode !== 'forgot' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ flex: 1, height: 1, background: '#e8edf8' }} />
                  <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' }}>Or Login with</span>
                  <div style={{ flex: 1, height: 1, background: '#e8edf8' }} />
                </div>
              )}

              {/* Social buttons */}
              {mode !== 'forgot' && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" onClick={() => setSocialModal('google')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', borderRadius: 12, border: '1.5px solid #e8edf8', background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#374151', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#d1d5db'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e8edf8'}>
                    <GoogleIcon /> Google
                  </button>
                  <button type="button" onClick={() => setSocialModal('facebook')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', borderRadius: 12, border: '1.5px solid #e8edf8', background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#374151', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#d1d5db'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e8edf8'}>
                    <FacebookIcon /> Facebook
                  </button>
                </div>
              )}

              {/* Mode switch */}
              {mode !== 'forgot' ? (
                <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button type="button" onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); }}
                    style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}>
                    {mode === 'login' ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              ) : (
                <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                  Remember your password?{' '}
                  <button type="button" onClick={() => { setMode('login'); setError(''); }}
                    style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}>
                    Sign In
                  </button>
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Social Auth Simulator Modal */}
      <AnimatePresence>
        {socialModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }}
              style={{ width: '100%', maxWidth: 420, background: 'white', borderRadius: 24, padding: 32, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative', border: '1px solid #e2e8f0', fontFamily: 'inherit' }}>
              
              {/* Close */}
              <button onClick={() => { setSocialModal(null); setShowCustomSocialInput(false); }}
                style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: '#f1f5f9', cursor: 'pointer', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#64748b', fontWeight: 'bold' }}>✕</button>

              {/* Header */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                {socialModal === 'google' ? (
                  <>
                    <div style={{ marginBottom: 12 }}><GoogleIcon /></div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1e293b', fontFamily: "'Poppins', sans-serif", margin: 0 }}>Sign in with Google</h3>
                    <p style={{ fontSize: 12, color: '#64748b', marginTop: 4, margin: 0 }}>to continue to MindSpace</p>
                  </>
                ) : (
                  <>
                    <div style={{ marginBottom: 12 }}><FacebookIcon /></div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1e293b', fontFamily: "'Poppins', sans-serif", margin: 0 }}>Log in with Facebook</h3>
                    <p style={{ fontSize: 12, color: '#64748b', marginTop: 4, margin: 0 }}>to continue to MindSpace</p>
                  </>
                )}
              </div>

              {/* Form Content */}
              {!showCustomSocialInput ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, marginTop: 0 }}>Choose an account</p>
                  
                  {/* Account Options */}
                  <button onClick={() => handleSocialSelect('Rahul Kumar', 'rahulkumar@gmail.com')}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px', borderRadius: 14, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6c63ff'; e.currentTarget.style.background = '#f5f3ff'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#8b5cf6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14 }}>RK</div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', margin: 0 }}>Rahul Kumar</p>
                      <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>rahulkumar@gmail.com</p>
                    </div>
                  </button>

                  <button onClick={() => handleSocialSelect('Priya Nair', 'priyanair@gmail.com')}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px', borderRadius: 14, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6c63ff'; e.currentTarget.style.background = '#f5f3ff'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ec4899', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14 }}>PN</div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', margin: 0 }}>Priya Nair</p>
                      <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>priyanair@gmail.com</p>
                    </div>
                  </button>

                  {/* Add Account Option */}
                  <button onClick={() => setShowCustomSocialInput(true)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '12px', borderRadius: 14, border: '1.5px dashed #cbd5e1', background: '#f8fafc', cursor: 'pointer', transition: 'all 0.2s', fontSize: 12, fontWeight: 700, color: '#64748b' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#475569'; e.currentTarget.style.color = '#334155'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#64748b'; }}>
                    ➕ Use another account
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <button onClick={() => setShowCustomSocialInput(false)}
                    style={{ border: 'none', background: 'none', color: '#6c63ff', cursor: 'pointer', fontSize: 12, fontWeight: 700, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
                    ← Back to accounts list
                  </button>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>Full Name</label>
                    <input className="input-field" placeholder="Enter your name" style={{ borderBottom: '2px solid #e2e8f0', width: '100%' }} value={customSocialName} onChange={e => setCustomSocialName(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>Email Address</label>
                    <input className="input-field" type="email" placeholder="Enter your email" style={{ borderBottom: '2px solid #e2e8f0', width: '100%' }} value={customSocialEmail} onChange={e => setCustomSocialEmail(e.target.value)} />
                  </div>
                  <button onClick={() => handleSocialSelect(customSocialName, customSocialEmail)}
                    style={{ width: '100%', padding: 12, borderRadius: 12, border: 'none', background: socialModal === 'google' ? '#4285F4' : '#1877F2', color: 'white', fontWeight: 800, fontSize: 13, cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
                    onMouseLeave={e => e.currentTarget.style.opacity = 1}>
                    Continue Sign-In
                  </button>
                </div>
              )}

              {/* Secure Footer */}
              <div style={{ marginTop: 24, textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                <p style={{ fontSize: 10, color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, margin: 0 }}>
                  🔒 Simulated secure authorization
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Reusable underline-style input field component
function InputField({ icon, placeholder, value, onChange, type = 'text', required, suffix }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative', marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: `2px solid ${focused ? '#2563eb' : '#e2e8f0'}`, paddingBottom: 8, transition: 'border-color 0.2s', gap: 10 }}>
        {icon}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#1e293b', background: 'transparent', fontFamily: 'inherit', fontWeight: 500 }}
        />
        {suffix}
      </div>
    </div>
  );
}
