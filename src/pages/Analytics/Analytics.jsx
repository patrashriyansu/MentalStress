import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart2, TrendingUp, TrendingDown, Calendar, Download } from 'lucide-react';

const bpData = [
  { month: 'Jan', systolic: 125, diastolic: 82 }, { month: 'Feb', systolic: 120, diastolic: 80 },
  { month: 'Mar', systolic: 118, diastolic: 78 }, { month: 'Apr', systolic: 122, diastolic: 81 },
  { month: 'May', systolic: 119, diastolic: 79 }, { month: 'Jun', systolic: 117, diastolic: 77 },
];

const sugarData = [
  { day: 'Mon', fasting: 95, postMeal: 142 }, { day: 'Tue', fasting: 98, postMeal: 138 },
  { day: 'Wed', fasting: 92, postMeal: 145 }, { day: 'Thu', fasting: 96, postMeal: 140 },
  { day: 'Fri', fasting: 94, postMeal: 136 }, { day: 'Sat', fasting: 99, postMeal: 148 },
  { day: 'Sun', fasting: 91, postMeal: 133 },
];

const sleepData = [
  { day: 'Mon', hours: 7.2 }, { day: 'Tue', hours: 6.8 }, { day: 'Wed', hours: 7.5 },
  { day: 'Thu', hours: 6.5 }, { day: 'Fri', hours: 8.0 }, { day: 'Sat', hours: 7.8 }, { day: 'Sun', hours: 7.0 },
];

const calorieData = [
  { day: 'Mon', consumed: 2100, burned: 450 }, { day: 'Tue', consumed: 1950, burned: 520 },
  { day: 'Wed', consumed: 2200, burned: 380 }, { day: 'Thu', consumed: 1800, burned: 610 },
  { day: 'Fri', consumed: 2050, burned: 490 }, { day: 'Sat', consumed: 2300, burned: 350 },
  { day: 'Sun', consumed: 1900, burned: 420 },
];

const tooltipStyle = {
  contentStyle: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', color: '#334155', fontSize: '12px' },
  labelStyle: { fontWeight: 700, color: '#1e293b' },
};

const tabs = ['Blood Pressure', 'Blood Sugar', 'Sleep', 'Calories'];

export default function Analytics() {
  const [tab, setTab] = useState('Blood Pressure');
  const [period, setPeriod] = useState('This Month');

  const summaryStats = [
    { label: 'Avg Heart Rate', value: '72 bpm', trend: -2, color: '#ef4444', icon: '❤️' },
    { label: 'Avg Blood Pressure', value: '120/79', trend: -3, color: '#3b82f6', icon: '🩸' },
    { label: 'Avg Blood Sugar', value: '95 mg/dL', trend: +1, color: '#f59e0b', icon: '🍬' },
    { label: 'Avg Sleep', value: '7h 16m', trend: +12, color: '#8b5cf6', icon: '😴' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title flex items-center gap-2"><BarChart2 className="w-6 h-6 text-blue-600" />Health Analytics</h1>
          <p className="section-subtitle">Track your health trends over time</p>
        </div>
        <div className="flex gap-2">
          <select value={period} onChange={e => setPeriod(e.target.value)}
            className="input-field w-auto px-3 py-2 text-sm cursor-pointer">
            {['This Week', 'This Month', 'Last 3 Months', 'This Year'].map(p => <option key={p}>{p}</option>)}
          </select>
          <button className="btn-secondary text-sm flex items-center gap-2 py-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{s.icon}</span>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${s.trend < 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {s.trend < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                {Math.abs(s.trend)}%
              </div>
            </div>
            <p className="text-xl font-black text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="card p-5">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-5 w-fit">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{ background: tab === t ? '#fff' : 'transparent', color: tab === t ? '#1d4ed8' : '#64748b', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'Blood Pressure' && (
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-4">Blood Pressure Trend (mmHg)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={bpData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} domain={[60, 140]} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
                <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} name="Systolic" />
                <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} name="Diastolic" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === 'Blood Sugar' && (
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-4">Blood Sugar Levels (mg/dL)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={sugarData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
                <Bar dataKey="fasting" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Fasting" />
                <Bar dataKey="postMeal" fill="#fbbf24" radius={[4, 4, 0, 0]} name="Post-Meal" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === 'Sleep' && (
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-4">Sleep Duration (hours)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={sleepData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} domain={[5, 9]} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#sleepGrad)" dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }} name="Sleep Hours" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === 'Calories' && (
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-4">Calorie Balance (kcal)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={calorieData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
                <Bar dataKey="consumed" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Consumed" />
                <Bar dataKey="burned" fill="#10b981" radius={[4, 4, 0, 0]} name="Burned" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
