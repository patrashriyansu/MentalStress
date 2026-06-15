import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ambulance, Navigation, MapPin, Clock, Phone } from 'lucide-react';

function AmbulanceMap({ eta }) {
  const progress = Math.max(0, 100 - (eta / 8) * 100);

  return (
    <div className="relative w-full h-72 bg-dark-700 rounded-2xl overflow-hidden border border-white/10">
      <div className="absolute inset-0 opacity-10">
        {[...Array(8)].map((_, i) => (
          <React.Fragment key={i}>
            <div className="absolute w-full h-px bg-emerald-400" style={{ top: `${i * 14.3}%` }} />
            <div className="absolute h-full w-px bg-emerald-400" style={{ left: `${i * 14.3}%` }} />
          </React.Fragment>
        ))}
      </div>

      {/* Route Line */}
      <svg className="absolute inset-0 w-full h-full">
        <path d="M 80,220 Q 200,150 300,100" stroke="#10b981" strokeWidth="3" fill="none" strokeDasharray="8,4" strokeLinecap="round" />
      </svg>

      {/* Patient Location */}
      <div className="absolute" style={{ left: '75%', top: '25%' }}>
        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-8 h-8 bg-blue-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
          <span className="text-xs">📍</span>
        </motion.div>
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-blue-300 whitespace-nowrap">You</span>
      </div>

      {/* Ambulance - animated along path */}
      <motion.div
        className="absolute flex flex-col items-center"
        animate={{ left: ['20%', '75%'], top: ['75%', '25%'] }}
        transition={{ duration: eta, ease: 'linear' }}
      >
        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-xl border-2 border-red-300">
          <span className="text-xl">🚑</span>
        </div>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-800 border border-white/20 rounded-lg px-2 py-1 text-xs text-white whitespace-nowrap">
          AMB-447
        </div>
      </motion.div>

      {/* ETA Badge */}
      <div className="absolute top-3 left-3 glass px-3 py-2 flex items-center gap-2">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-sm font-bold text-white">ETA: {eta} min</span>
      </div>
    </div>
  );
}

export default function AmbulanceTrack() {
  const [eta, setEta] = useState(8);
  const [status, setStatus] = useState('dispatched');
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    if (!tracking) return;
    const t = setInterval(() => {
      setEta(e => {
        if (e <= 1) { setStatus('arrived'); clearInterval(t); return 0; }
        return e - 1;
      });
    }, 3000);
    return () => clearInterval(t);
  }, [tracking]);

  const statusMap = {
    idle: { label: 'No Active Request', color: 'text-gray-400', bg: 'bg-gray-500/20' },
    dispatched: { label: 'Ambulance Dispatched', color: 'text-blue-400', bg: 'bg-blue-500/20' },
    enroute: { label: 'En Route to You', color: 'text-amber-400', bg: 'bg-amber-500/20' },
    arrived: { label: 'Arrived!', color: 'text-green-400', bg: 'bg-green-500/20' },
  };

  const current = statusMap[status];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="section-title flex items-center gap-2"><Ambulance className="w-7 h-7 text-red-400" />Ambulance Tracking</h1>
        <p className="section-subtitle">Real-time ambulance location and ETA</p>
      </div>

      {/* Status Card */}
      <div className={`glass-card p-5 flex items-center gap-4 ${status !== 'idle' ? 'border-red-500/30' : ''}`}>
        <div className={`w-14 h-14 ${current.bg} rounded-xl flex items-center justify-center text-3xl`}>🚑</div>
        <div className="flex-1">
          <p className={`font-display font-bold text-lg ${current.color}`}>{current.label}</p>
          {status !== 'idle' && <p className="text-sm text-gray-400">Ambulance #AMB-447 · Driver: Ramesh Kumar · 📞 +91 98XXXXXXXX</p>}
        </div>
        {!tracking ? (
          <button onClick={() => { setTracking(true); setStatus('enroute'); }} className="btn-danger flex items-center gap-2">
            <Navigation className="w-4 h-4" /> Start Tracking
          </button>
        ) : status !== 'arrived' ? (
          <div className="flex items-center gap-2 text-red-400">
            <Clock className="w-5 h-5" />
            <span className="text-xl font-bold">{eta} min</span>
          </div>
        ) : (
          <span className="badge-success text-sm">✓ Arrived</span>
        )}
      </div>

      {tracking && <AmbulanceMap eta={eta} />}

      {/* Driver Info */}
      {tracking && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <h3 className="font-semibold text-white mb-4">Driver & Vehicle Info</h3>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-600/20 rounded-xl flex items-center justify-center text-3xl">👨‍✈️</div>
            <div className="flex-1">
              <p className="font-medium text-white">Ramesh Kumar</p>
              <p className="text-sm text-gray-400">License: KA-01-1234 · 8 yrs experience</p>
              <div className="flex gap-2 mt-2">
                <span className="badge-success">✓ Certified EMT</span>
                <span className="badge-info">🚑 Advanced Life Support</span>
              </div>
            </div>
            <a href="tel:+919800000000" className="btn-success text-sm py-2 flex items-center gap-1">
              <Phone className="w-4 h-4" /> Call
            </a>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Vehicle', value: 'AMB-447' },
              { label: 'Speed', value: '45 km/h' },
              { label: 'Distance', value: `${Math.max(0, (eta * 0.5)).toFixed(1)} km` },
            ].map(s => (
              <div key={s.label} className="glass p-3 rounded-xl text-center">
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
