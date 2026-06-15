import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMoodStore, useSleepStore, useMeditationStore, useStressStore, useJournalStore } from '../../store';
import { FileText, Download, Award, TrendingUp, Calendar } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const BADGES = [
  { emoji: '🌱', name: 'First Step',      desc: 'Logged your first mood',        condition: (d) => d.moods > 0 },
  { emoji: '📔', name: 'Journaler',        desc: 'Wrote 3+ journal entries',      condition: (d) => d.journals >= 3 },
  { emoji: '🧘', name: 'Zen Master',       desc: 'Meditated 5+ sessions',         condition: (d) => d.meditations >= 5 },
  { emoji: '💤', name: 'Sleep Champion',   desc: 'Logged 7 nights of sleep',      condition: (d) => d.sleepLogs >= 7 },
  { emoji: '🔥', name: 'On Fire',          desc: 'Maintained a 7-day streak',     condition: (d) => d.streak >= 7 },
  { emoji: '💜', name: 'Community Hero',   desc: 'Shared with the community',     condition: (d) => d.moods >= 5 },
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Reports() {
  const { entries: moods, getThisWeek: getMoodWeek } = useMoodStore();
  const { entries: sleepLogs, getThisWeek: getSleepWeek } = useSleepStore();
  const { sessions: meditations } = useMeditationStore();
  const { entries: stressEntries, getThisWeek: getStressWeek } = useStressStore();
  const { entries: journals } = useJournalStore();

  const moodData    = getMoodWeek();
  const sleepData   = getSleepWeek();
  const stressData  = getStressWeek();

  const stats = {
    moods: moods.length,
    journals: journals.length,
    meditations: meditations.length,
    sleepLogs: sleepLogs.length,
    streak: Math.min(meditations.length, 30),
  };

  const avgMood   = moods.length ? (moods.reduce((s, e) => s + (e.score || 5), 0) / moods.length).toFixed(1) : 'N/A';
  const avgSleep  = sleepLogs.length ? (sleepLogs.reduce((s, e) => s + (e.duration || 0), 0) / sleepLogs.length).toFixed(1) : 'N/A';
  const avgStress = stressEntries.length ? (stressEntries.reduce((s, e) => s + (e.level || 0), 0) / stressEntries.length).toFixed(1) : 'N/A';
  const totalMedMin = meditations.reduce((s, m) => s + (m.duration || 0), 0);

  const earnedBadges = BADGES.filter(b => b.condition(stats));

  const handleExport = () => {
    const report = { generatedAt: new Date().toISOString(), summary: { avgMood, avgSleep, avgStress, totalMedMin }, moods, journals: journals.map(j => ({ ...j, content: j.content?.slice(0, 100) + '...' })) };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `mindspace-report-${new Date().toISOString().split('T')[0]}.json`; a.click();
  };

  const SUMMARY_STATS = [
    { label: 'Avg Mood Score',  value: avgMood,      icon: '😊', color: '#6c63ff', unit: '/10' },
    { label: 'Avg Sleep',       value: avgSleep,     icon: '💤', color: '#06b6d4', unit: 'hrs' },
    { label: 'Avg Stress',      value: avgStress,    icon: '😤', color: '#ef4444', unit: '/10' },
    { label: 'Meditation Time', value: totalMedMin,  icon: '🧘', color: '#10b981', unit: 'min' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">Wellness Reports 📊</h1>
          <p className="section-subtitle">Your personal mental health summary and progress.</p>
        </div>
        <button onClick={handleExport} className="btn btn-secondary">
          <Download style={{ width: 15, height: 15 }} /> Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {SUMMARY_STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="stat-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <p style={{ fontSize: 26, fontWeight: 900, color: s.color, fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>
              {s.value}<span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-400)', marginLeft: 2 }}>{s.unit}</span>
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-400)', marginTop: 6, fontWeight: 600 }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20 }}>
          <p className="section-title" style={{ fontSize: 14, marginBottom: 16 }}>📈 Mood This Week</p>
          {moodData.some(d => d.score > 0) ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={moodData}>
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Area type="monotone" dataKey="score" stroke="#6c63ff" strokeWidth={2.5} fill="url(#moodGrad)" dot={{ fill: '#6c63ff', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <p style={{ fontSize: 28 }}>😊</p>
              <p style={{ fontSize: 13, color: 'var(--text-400)', marginTop: 8 }}>No mood data yet</p>
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <p className="section-title" style={{ fontSize: 14, marginBottom: 16 }}>😤 Stress This Week</p>
          {stressData.some(d => d.level > 0) ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={stressData}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="level" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <p style={{ fontSize: 28 }}>📊</p>
              <p style={{ fontSize: 13, color: 'var(--text-400)', marginTop: 8 }}>No stress data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Sleep Chart */}
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <p className="section-title" style={{ fontSize: 14, marginBottom: 16 }}>💤 Sleep This Week</p>
        {sleepData.some(d => d.hours > 0) ? (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={sleepData}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 12]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="hours" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state" style={{ padding: '20px 0' }}>
            <p style={{ fontSize: 28 }}>💤</p>
            <p style={{ fontSize: 13, color: 'var(--text-400)', marginTop: 8 }}>No sleep data yet</p>
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <p className="section-title" style={{ fontSize: 14, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Award style={{ width: 18, height: 18, color: '#f59e0b' }} /> Achievement Badges
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {BADGES.map(badge => {
            const earned = badge.condition(stats);
            return (
              <div key={badge.name} style={{ padding: '16px 12px', borderRadius: 14, textAlign: 'center', border: '1.5px solid', borderColor: earned ? '#6c63ff30' : '#e5e7eb', background: earned ? 'var(--purple-50)' : 'var(--surface-2)', opacity: earned ? 1 : 0.4, transition: 'all 0.3s' }}>
                <div style={{ fontSize: 28, marginBottom: 6, filter: earned ? 'none' : 'grayscale(100%)' }}>{badge.emoji}</div>
                <p style={{ fontSize: 12, fontWeight: 700, color: earned ? '#6c63ff' : 'var(--text-400)', marginBottom: 4 }}>{badge.name}</p>
                <p style={{ fontSize: 10, color: 'var(--text-400)', lineHeight: 1.4 }}>{badge.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="card" style={{ padding: 24 }}>
        <p className="section-title" style={{ fontSize: 14, marginBottom: 20 }}>📋 Activity Summary</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { label: 'Mood entries', value: stats.moods, icon: '😊' },
            { label: 'Journal entries', value: stats.journals, icon: '📔' },
            { label: 'Meditation sessions', value: stats.meditations, icon: '🧘' },
            { label: 'Sleep logs', value: stats.sleepLogs, icon: '💤' },
          ].map(s => (
            <div key={s.label} style={{ padding: 16, borderRadius: 14, background: 'var(--surface-2)', textAlign: 'center' }}>
              <p style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</p>
              <p style={{ fontSize: 22, fontWeight: 900, color: '#6c63ff', fontFamily: "'Poppins',sans-serif" }}>{s.value}</p>
              <p style={{ fontSize: 11, color: 'var(--text-400)', marginTop: 4, fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
