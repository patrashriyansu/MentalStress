import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, FileText, Users, Clock, CheckCircle } from 'lucide-react';
import { DOCTORS } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

const mockPatients = [
  { id: 1, name: 'Riya Sharma', age: 28, condition: 'Viral Fever', time: '9:00 AM', status: 'waiting' },
  { id: 2, name: 'Arjun Mehta', age: 45, condition: 'Hypertension', time: '10:00 AM', status: 'in-progress' },
  { id: 3, name: 'Kavita Rao', age: 35, condition: 'Diabetes Review', time: '11:00 AM', status: 'completed' },
  { id: 4, name: 'Ramesh Patel', age: 60, condition: 'Chest Pain', time: '12:00 PM', status: 'waiting' },
];

export default function DoctorDashboard() {
  const [tab, setTab] = useState('appointments');
  const navigate = useNavigate();

  const stats = [
    { label: 'Today\'s Patients', value: 12, icon: '👥', color: 'bg-blue-500/20' },
    { label: 'Completed', value: 7, icon: '✅', color: 'bg-green-500/20' },
    { label: 'Pending', value: 5, icon: '⏳', color: 'bg-amber-500/20' },
    { label: 'This Month', value: '₹48,200', icon: '💰', color: 'bg-purple-500/20' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="section-title flex items-center gap-2"><Activity className="w-7 h-7 text-teal-400" />Doctor Dashboard</h1>
        <p className="section-subtitle">Manage appointments, patients, and prescriptions</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
            <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center text-2xl mb-3`}>{s.icon}</div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-gray-400">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit">
        {['appointments', 'patients', 'prescriptions'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${tab === t ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white'}`}>{t}</button>
        ))}
      </div>

      {tab === 'appointments' && (
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-400" />Today's Schedule</h3>
          <div className="space-y-3">
            {mockPatients.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/8 transition-all">
                <div className="w-11 h-11 bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl flex items-center justify-center text-lg">🧑</div>
                <div className="flex-1">
                  <p className="font-medium text-white">{p.name} <span className="text-gray-400 text-sm font-normal">({p.age}y)</span></p>
                  <p className="text-sm text-gray-400">{p.condition}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" /> {p.time}
                </div>
                <span className={p.status === 'completed' ? 'badge-success' : p.status === 'in-progress' ? 'badge-info' : 'badge-warning'}>
                  {p.status}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => navigate('/video-consult')} className="text-xs px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-xl hover:bg-blue-600/40 transition-all">📹 Consult</button>
                  <button onClick={() => navigate('/prescription')} className="text-xs px-3 py-1.5 bg-teal-600/20 text-teal-400 rounded-xl hover:bg-teal-600/40 transition-all">📋 Rx</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {tab === 'patients' && (
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-purple-400" />Patient Records</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockPatients.map(p => (
              <div key={p.id} className="glass p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-600/30 rounded-xl flex items-center justify-center">🧑</div>
                  <div>
                    <p className="font-medium text-white text-sm">{p.name}</p>
                    <p className="text-xs text-gray-400">Age {p.age} · {p.condition}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="glass p-2 rounded-lg"><p className="text-gray-400">Last Visit</p><p className="text-white">Today</p></div>
                  <div className="glass p-2 rounded-lg"><p className="text-gray-400">Prescriptions</p><p className="text-white">3</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'prescriptions' && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-400" />Recent Prescriptions</h3>
            <button onClick={() => navigate('/prescription')} className="btn-primary text-sm py-2">+ New Prescription</button>
          </div>
          <p className="text-gray-400 text-sm">Navigate to the Prescriptions page to create and manage digital prescriptions.</p>
          <button onClick={() => navigate('/prescription')} className="btn-secondary mt-4 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Open Prescriptions
          </button>
        </div>
      )}
    </div>
  );
}
