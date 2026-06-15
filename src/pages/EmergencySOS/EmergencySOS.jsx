import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Phone, MapPin, Clock, Shield, Siren, CheckCircle } from 'lucide-react';
import { useHealthStore } from '../../store';

const CONTACTS = [
  { name: 'Ambulance', number: '102', color: '#ef4444', bg: '#fff1f2', icon: '🚑' },
  { name: 'Police', number: '100', color: '#3b82f6', bg: '#eff6ff', icon: '👮' },
  { name: 'Fire Brigade', number: '101', color: '#f59e0b', bg: '#fffbeb', icon: '🚒' },
  { name: 'Women Helpline', number: '1091', color: '#8b5cf6', bg: '#f5f3ff', icon: '👩‍⚕️' },
];

export default function EmergencySOS() {
  const [countdown, setCountdown] = useState(null);
  const [triggered, setTriggered] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const { addNotification } = useHealthStore();
  let timer = null;

  const startSOS = () => {
    setCountdown(5);
    setAlerts([]);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setTriggered(true);
      setCountdown(null);
      const newAlerts = [
        '🚑 Ambulance dispatched to your location',
        '🏥 Apollo Hospital notified (1.2 km)',
        '📱 Emergency contact SMS sent',
        '📍 Location shared with responders',
      ];
      newAlerts.forEach((a, i) => setTimeout(() => setAlerts(prev => [...prev, a]), i * 700));
      addNotification({ title: '🚨 Emergency SOS Triggered', message: 'Help is on the way!', type: 'emergency' });
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const cancel = () => { setCountdown(null); setTriggered(false); setAlerts([]); };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="section-title flex items-center gap-2 text-red-600"><AlertTriangle className="w-6 h-6" />Emergency SOS</h1>
        <p className="section-subtitle">Get immediate help — alerts sent to ambulance, hospital & family</p>
      </div>

      {/* SOS Button */}
      <div className="card p-8 text-center">
        {!triggered ? (
          <>
            <motion.button
              onClick={countdown === null ? startSOS : cancel}
              whileTap={{ scale: 0.95 }}
              className={`w-44 h-44 rounded-full mx-auto flex flex-col items-center justify-center text-white font-black text-xl shadow-2xl mb-4 transition-all ${countdown !== null ? 'bg-amber-500 shadow-amber-300' : 'bg-red-600 shadow-red-300 sos-btn'}`}>
              {countdown !== null ? (
                <>
                  <span className="text-6xl font-black">{countdown}</span>
                  <span className="text-sm font-semibold mt-1">Cancel?</span>
                </>
              ) : (
                <>
                  <Siren className="w-12 h-12 mb-2" />
                  <span>SOS</span>
                  <span className="text-sm font-medium mt-1">Hold to activate</span>
                </>
              )}
            </motion.button>
            {countdown !== null ? (
              <p className="text-amber-600 font-semibold text-sm">Sending SOS in {countdown} seconds... <button onClick={cancel} className="text-slate-500 underline ml-2">Cancel</button></p>
            ) : (
              <p className="text-slate-400 text-sm">Press the button to activate emergency alert</p>
            )}
          </>
        ) : (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-black text-slate-800">Help is on the way!</h3>
            <p className="text-slate-400 text-sm">Emergency services have been notified</p>
            <div className="space-y-2 text-left">
              {alerts.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-semibold">
                  {a}
                </motion.div>
              ))}
            </div>
            <button onClick={cancel} className="btn-secondary mx-auto">Dismiss</button>
          </motion.div>
        )}
      </div>

      {/* Emergency Contacts */}
      <div>
        <h2 className="font-bold text-slate-700 mb-3">Emergency Helplines</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {CONTACTS.map((c, i) => (
            <motion.a key={c.name} href={`tel:${c.number}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="card p-4 text-center hover:shadow-md transition-all" style={{ background: c.bg }}>
              <div className="text-3xl mb-2">{c.icon}</div>
              <p className="font-bold text-slate-700 text-sm">{c.name}</p>
              <p className="text-2xl font-black mt-1" style={{ color: c.color }}>{c.number}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Phone className="w-3.5 h-3.5" style={{ color: c.color }} />
                <span className="text-xs font-semibold" style={{ color: c.color }}>Tap to Call</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Location info */}
      <div className="card p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <MapPin className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-700 text-sm">Your Location</p>
          <p className="text-xs text-slate-400">Connaught Place, New Delhi, India — GPS Active</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-600 font-semibold">Location sharing enabled</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Nearest Hospital</p>
          <p className="text-sm font-bold text-blue-600">Apollo (1.2 km)</p>
        </div>
      </div>
    </div>
  );
}
