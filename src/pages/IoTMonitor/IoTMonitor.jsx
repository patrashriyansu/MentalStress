import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Wifi, WifiOff, AlertTriangle, Settings, Activity } from 'lucide-react';
import { useHealthStore } from '../../store';

function Waveform({ data, color }) {
  const pts = data.map((v, i) => `${i * (300 / (data.length - 1))},${30 - v * 22}`).join(' ');
  return (
    <svg viewBox="0 0 300 60" className="w-full h-12">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GaugeRing({ value, max, color, size = 100 }) {
  const r = size * 0.4; const c = 2 * Math.PI * r;
  const fill = c - (value / max) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={size*0.09} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.09}
        strokeDasharray={c} strokeDashoffset={fill} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s', filter: `drop-shadow(0 0 6px ${color}40)` }} />
    </svg>
  );
}

function gen(n = 40) { return Array.from({ length: n }, (_, i) => Math.sin((i/n)*Math.PI*4) * 0.7 + (Math.random()-0.5)*0.3); }

export default function IoTMonitor() {
  const { vitals, setVitals, iotConnected, toggleIoT } = useHealthStore();
  const [waves, setWaves] = useState({ hr: gen(), spo2: gen(), temp: gen() });
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!iotConnected) return;
    const t = setInterval(() => {
      const hr = Math.round(68 + Math.random() * 16);
      const sp = Math.round(96 + Math.random() * 3);
      const temp = +(98 + Math.random() * 1.5).toFixed(1);
      setVitals({ ...vitals, heartRate: hr, spO2: sp, temperature: temp });
      setWaves(w => ({
        hr: [...w.hr.slice(1), (Math.random()-0.5)*0.9],
        spo2: [...w.spo2.slice(1), (Math.random()-0.5)*0.25 + 0.4],
        temp: [...w.temp.slice(1), (Math.random()-0.5)*0.1 + 0.4],
      }));
      if (hr > 100) setAlerts(a => [{ id: Date.now(), msg: `⚠️ High heart rate: ${hr} bpm` }, ...a.slice(0,3)]);
    }, 1500);
    return () => clearInterval(t);
  }, [iotConnected]);

  const gauges = [
    { label: 'Heart Rate', value: vitals.heartRate, max: 200, unit: 'bpm', color: '#ef4444' },
    { label: 'SpO2', value: vitals.spO2 || 98, max: 100, unit: '%', color: '#3b82f6' },
    { label: 'Temperature', value: vitals.temperature || 98.6, max: 105, unit: '°F', color: '#f59e0b' },
    { label: 'Blood Sugar', value: vitals.bloodSugar || 95, max: 300, unit: 'mg/dL', color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title flex items-center gap-2"><Cpu className="w-6 h-6 text-blue-600" />IoT Health Monitor</h1>
          <p className="section-subtitle">Real-time sensor data from connected wearable devices</p>
        </div>
        <button onClick={toggleIoT}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${iotConnected ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'btn-primary'}`}>
          {iotConnected ? <><Wifi className="w-4 h-4" />Connected</> : <><WifiOff className="w-4 h-4" />Connect Device</>}
        </button>
      </div>

      {/* Device Card */}
      <div className={`card p-4 flex items-center gap-4 ${iotConnected ? 'border-emerald-200 bg-emerald-50/50' : ''}`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${iotConnected ? 'bg-emerald-100' : 'bg-slate-100'}`}>⌚</div>
        <div className="flex-1">
          <p className="font-bold text-slate-700">Raspberry Pi Health Band v2</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`w-2 h-2 rounded-full ${iotConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300'}`} />
            <span className={`text-xs font-semibold ${iotConnected ? 'text-emerald-600' : 'text-slate-400'}`}>
              {iotConnected ? 'Streaming live · 1.5s interval' : 'Not connected'}
            </span>
          </div>
        </div>
        {iotConnected && <div className="flex gap-3 text-xs text-slate-400 flex-wrap">
          <span>📶 Signal: Strong</span><span>🔋 87%</span><span>📡 BLE 5.0</span>
        </div>}
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {gauges.map(g => (
          <div key={g.label} className="card p-4 flex flex-col items-center">
            <div className="relative">
              <GaugeRing value={g.value} max={g.max} color={g.color} />
              <div className="absolute inset-0 flex flex-col items-center justify-center rotate-90">
                <span className="text-xl font-black text-slate-800">{g.value}</span>
                <span className="text-xs text-slate-400">{g.unit}</span>
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-2">{g.label}</p>
          </div>
        ))}
      </div>

      {/* Waveforms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { key: 'hr', label: 'ECG / Heart Rate', color: '#ef4444', icon: '❤️' },
          { key: 'spo2', label: 'SpO₂ Signal', color: '#3b82f6', icon: '💧' },
          { key: 'temp', label: 'Temperature', color: '#f59e0b', icon: '🌡️' },
        ].map(w => (
          <div key={w.key} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">{w.icon} {w.label}</span>
              {iotConnected && <span className="text-xs font-bold text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />LIVE</span>}
            </div>
            <div className="bg-slate-50 rounded-xl p-2">
              <Waveform data={waves[w.key]} color={w.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="card p-4">
          <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2 text-sm"><AlertTriangle className="w-4 h-4 text-red-500" />Alerts</h3>
          <div className="space-y-2">
            {alerts.map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{a.msg}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
