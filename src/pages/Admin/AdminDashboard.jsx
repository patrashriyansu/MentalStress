import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Shield, Users, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Riya Sharma', role: 'patient', email: 'riya@test.com', status: 'active', joined: '1 Jun 2026' },
  { id: 2, name: 'Dr. Amit Kumar', role: 'doctor', email: 'amit@test.com', status: 'pending', joined: '5 Jun 2026' },
  { id: 3, name: 'Pooja Singh', role: 'patient', email: 'pooja@test.com', status: 'active', joined: '7 Jun 2026' },
  { id: 4, name: 'Dr. Priya Nair', role: 'doctor', email: 'priya@test.com', status: 'active', joined: '2 Jun 2026' },
  { id: 5, name: 'Admin User', role: 'admin', email: 'admin@medivision.ai', status: 'active', joined: '1 Jan 2026' },
];

const regData = [
  { day: 'Mon', users: 45 }, { day: 'Tue', users: 67 }, { day: 'Wed', users: 89 },
  { day: 'Thu', users: 72 }, { day: 'Fri', users: 95 }, { day: 'Sat', users: 110 }, { day: 'Sun', users: 78 },
];

const apptData = [
  { month: 'Jan', appts: 320 }, { month: 'Feb', appts: 450 }, { month: 'Mar', appts: 380 },
  { month: 'Apr', appts: 520 }, { month: 'May', appts: 610 }, { month: 'Jun', appts: 490 },
];

const tt = { contentStyle: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' } };

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');

  const stats = [
    { label: 'Total Users', value: '2,847', icon: '👥', color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Active Doctors', value: '134', icon: '👨‍⚕️', color: '#8b5cf6', bg: '#f5f3ff' },
    { label: "Today's Appointments", value: '89', icon: '📅', color: '#10b981', bg: '#f0fdf4' },
    { label: 'Emergencies (24h)', value: '7', icon: '🚨', color: '#ef4444', bg: '#fff1f2' },
  ];

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title flex items-center gap-2"><Shield className="w-6 h-6 text-blue-600" />Admin Dashboard</h1>
        <p className="section-subtitle">Manage users, doctors, and platform analytics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card p-5" style={{ background: s.bg }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{s.icon}</span>
              <TrendingUp className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-black text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {['overview', 'users', 'doctors'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
            style={{ background: tab === t ? '#fff' : 'transparent', color: tab === t ? '#1d4ed8' : '#64748b', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card p-5">
            <h3 className="font-bold text-slate-700 text-sm mb-4">Daily Registrations</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={regData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...tt} />
                <Bar dataKey="users" fill="#3b82f6" radius={[6, 6, 0, 0]} name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-5">
            <h3 className="font-bold text-slate-700 text-sm mb-4">Monthly Appointments</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={apptData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...tt} />
                <Line type="monotone" dataKey="appts" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} name="Appointments" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-5 lg:col-span-2">
            <h3 className="font-bold text-slate-700 text-sm mb-3">System Health</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { k: 'API Response', v: '124ms', ok: true },
                { k: 'Server Uptime', v: '99.9%', ok: true },
                { k: 'DB Connections', v: '47/100', ok: true },
                { k: 'Error Rate', v: '0.02%', ok: true },
              ].map(m => (
                <div key={m.k} className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <p className="text-xs text-slate-500">{m.k}</p>
                  <p className="font-black text-emerald-600 text-lg">{m.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(tab === 'users' || tab === 'doctors') && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <h3 className="font-bold text-slate-700 text-sm">User Management</h3>
            <input className="input-field w-60 text-sm py-2" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="pb-3 pr-6 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.filter(u => tab === 'users' ? true : u.role === 'doctor').map(u => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-6 font-semibold text-slate-700">{u.name}</td>
                    <td className="py-3 pr-6 text-slate-400 text-xs">{u.email}</td>
                    <td className="py-3 pr-6">
                      <span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'doctor' ? 'badge-info' : 'badge-success'}`}>{u.role}</span>
                    </td>
                    <td className="py-3 pr-6">
                      <span className={u.status === 'active' ? 'badge badge-success' : 'badge badge-warning'}>{u.status}</span>
                    </td>
                    <td className="py-3 pr-6 text-slate-400 text-xs">{u.joined}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        {u.status === 'pending' && (
                          <button onClick={() => setUsers(us => us.map(x => x.id === u.id ? { ...x, status: 'active' } : x))}
                            className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-200 transition-colors">Approve</button>
                        )}
                        <button onClick={() => setUsers(us => us.filter(x => x.id !== u.id))}
                          className="text-xs px-2.5 py-1 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-colors">Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
