import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Trash2, Clock, Pill, Calendar } from 'lucide-react';
import { useHealthStore } from '../../store';

export default function Notifications() {
  const { notifications, addNotification, markAllRead } = useHealthStore();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', time: '', type: 'medicine' });

  const save = () => {
    addNotification({ title: form.title, message: form.message, type: form.type });
    setForm({ title: '', message: '', time: '', type: 'medicine' });
    setAdding(false);
  };

  const notifTypes = [
    { id: 'medicine', label: 'Medicine Reminder', icon: '💊' },
    { id: 'appointment', label: 'Appointment', icon: '📅' },
    { id: 'emergency', label: 'Emergency Alert', icon: '🚨' },
    { id: 'report', label: 'Report Ready', icon: '📋' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="section-title flex items-center gap-2"><Bell className="w-7 h-7 text-yellow-400" />Notifications</h1>
          <p className="section-subtitle">Medicine reminders, appointment alerts, and health updates</p>
        </div>
        <div className="flex gap-2">
          <button onClick={markAllRead} className="btn-secondary text-sm py-2">Mark all read</button>
          <button onClick={() => setAdding(true)} className="btn-primary text-sm py-2 flex items-center gap-1"><Plus className="w-4 h-4" /> Add Reminder</button>
        </div>
      </div>

      {adding && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <h3 className="font-semibold text-white mb-3">Add New Reminder</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input className="input-field" placeholder="Title (e.g., Take Paracetamol)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <select className="input-field" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {notifTypes.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
            </select>
          </div>
          <input className="input-field mb-3" placeholder="Message" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
          <input type="time" className="input-field mb-3" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
          <div className="flex gap-2">
            <button onClick={() => setAdding(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={save} className="btn-primary flex-1">Add Reminder</button>
          </div>
        </motion.div>
      )}

      {/* Notification List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="glass-card p-12 text-center"><p className="text-gray-400">No notifications yet</p></div>
        ) : (
          notifications.map((n, i) => (
            <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`glass-card p-4 flex items-start gap-4 ${!n.read ? 'border-blue-500/30 bg-blue-500/5' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl ${!n.read ? 'bg-blue-500/20' : 'bg-white/5'}`}>
                {n.type === 'medicine' ? '💊' : n.type === 'appointment' ? '📅' : n.type === 'emergency' ? '🚨' : '🔔'}
              </div>
              <div className="flex-1">
                <p className="font-medium text-white text-sm">{n.title}</p>
                <p className="text-sm text-gray-400">{n.message}</p>
              </div>
              {!n.read && <span className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-1.5" />}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
