import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSleepStore } from '../../store';
import { Moon, Star, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import toast from 'react-hot-toast';

const TIPS = [
  { emoji: '📵', title: 'No screens 1h before bed', desc: 'Blue light suppresses melatonin production.' },
  { emoji: '🌡️', title: 'Keep room cool', desc: '65–68°F (18–20°C) is optimal for deep sleep.' },
  { emoji: '☕', title: 'No caffeine after 2pm', desc: 'Caffeine has a 5-6 hour half-life in your body.' },
];

function StarRating({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} onClick={() => onChange(n)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, transition: 'transform 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          <Star style={{ width: 28, height: 28, color: n <= value ? '#f59e0b' : '#e5e7eb', fill: n <= value ? '#f59e0b' : 'none', transition: 'all 0.2s' }} />
        </button>
      ))}
    </div>
  );
}

function calcDuration(bedtime, wakeTime) {
  if (!bedtime || !wakeTime) return 0;
  const [bh, bm] = bedtime.split(':').map(Number);
  const [wh, wm] = wakeTime.split(':').map(Number);
  let mins = (wh * 60 + wm) - (bh * 60 + bm);
  if (mins < 0) mins += 24 * 60;
  return Math.round(mins / 60 * 10) / 10;
}

function calcScore(duration, quality) {
  const durScore  = Math.min(duration / 8, 1) * 50;
  const qualScore = (quality / 5) * 50;
  return Math.round(durScore + qualScore);
}

function getScoreLabel(score) {
  if (score >= 85) return { label: 'Excellent', color: '#10b981' };
  if (score >= 70) return { label: 'Good',      color: '#6c63ff' };
  if (score >= 50) return { label: 'Fair',       color: '#f59e0b' };
  return { label: 'Poor', color: '#ef4444' };
}

function getBarColor(hours) {
  if (hours >= 7) return '#10b981';
  if (hours >= 5) return '#f59e0b';
  return '#ef4444';
}

export default function SleepTracker() {
  const { logSleep, entries, getThisWeek, getAvgSleep } = useSleepStore();
  const [bedtime, setBedtime]   = useState('22:30');
  const [wakeTime, setWakeTime] = useState('06:30');
  const [quality, setQuality]   = useState(4);
  const [notes, setNotes]       = useState('');

  const weekData   = getThisWeek();
  const avgSleep   = getAvgSleep();
  const lastEntry  = entries[0];
  const duration   = calcDuration(bedtime, wakeTime);
  const score      = lastEntry ? calcScore(lastEntry.duration, lastEntry.quality) : 0;
  const scoreLabel = getScoreLabel(score);

  const handleSave = () => {
    if (!bedtime || !wakeTime) { toast.error('Please enter bedtime and wake time'); return; }
    logSleep({ bedtime, wakeTime, duration, quality, notes });
    toast.success('Sleep logged! 🌙 Sweet dreams!');
    setNotes('');
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Sleep Tracker 🌙</h1>
        <p className="section-subtitle">Track your sleep quality and build healthier bedtime habits.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '42% 58%', gap: 20, marginBottom: 24 }}>
        {/* Log Sleep */}
        <div className="card" style={{ padding: 24 }}>
          <h3 className="section-title" style={{ fontSize: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Moon style={{ width: 20, height: 20, color: '#6c63ff' }} /> Log Your Sleep
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 6 }}>🌙 Bedtime</label>
              <input type="time" value={bedtime} onChange={e => setBedtime(e.target.value)} className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 6 }}>☀️ Wake Time</label>
              <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} className="input-field" />
            </div>

            {/* Duration preview */}
            {duration > 0 && (
              <div style={{ padding: '10px 14px', borderRadius: 10, background: duration >= 7 ? '#d1fae5' : duration >= 5 ? '#fef3c7' : '#fee2e2', border: `1px solid ${duration >= 7 ? '#10b981' : duration >= 5 ? '#f59e0b' : '#ef4444'}30`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock style={{ width: 14, height: 14, color: duration >= 7 ? '#10b981' : '#f59e0b' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-900)' }}>{duration} hours of sleep</span>
              </div>
            )}

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 8 }}>Sleep Quality</label>
              <StarRating value={quality} onChange={setQuality} />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 6 }}>Notes (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="How did you sleep?" className="input-field" rows={2} style={{ resize: 'none' }} />
            </div>

            <button onClick={handleSave} className="btn btn-primary">
              <Moon style={{ width: 15, height: 15 }} /> Save Sleep Log
            </button>
          </div>
        </div>

        {/* Sleep Score */}
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81, #4c1d95)', borderRadius: 24, padding: 28, color: 'white', display: 'flex', flexDirection: 'column' }}>
          {/* Decorative stars */}
          {['12%,18%', '78%,12%', '35%,8%', '88%,35%', '22%,72%', '65%,78%', '90%,65%'].map((pos, i) => (
            <div key={i} style={{ position: 'absolute', left: pos.split(',')[0], top: pos.split(',')[1], width: i % 2 === 0 ? 3 : 4, height: i % 2 === 0 ? 3 : 4, borderRadius: '50%', background: 'rgba(255,255,255,0.6)', pointerEvents: 'none' }} />
          ))}

          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, fontFamily: "'Poppins',sans-serif" }}>
            Sleep Score {lastEntry ? '' : '(No data yet)'}
          </h3>

          {lastEntry ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', border: `6px solid ${scoreLabel.color}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }}>
                  <span style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Poppins',sans-serif", color: scoreLabel.color }}>{score}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>/ 100</span>
                </div>
                <div>
                  <p style={{ fontSize: 20, fontWeight: 800, color: scoreLabel.color, fontFamily: "'Poppins',sans-serif", marginBottom: 4 }}>{scoreLabel.label}</p>
                  <p style={{ fontSize: 12, opacity: 0.7 }}>Based on duration & quality</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Bedtime',    value: lastEntry.bedtime },
                  { label: 'Wake Time',  value: lastEntry.wakeTime },
                  { label: 'Duration',   value: `${lastEntry.duration}h` },
                  { label: 'Quality',    value: '⭐'.repeat(lastEntry.quality) },
                ].map(d => (
                  <div key={d.label} style={{ padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.1)' }}>
                    <p style={{ fontSize: 10, opacity: 0.6, fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{d.label}</p>
                    <p style={{ fontSize: 14, fontWeight: 700 }}>{d.value}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
              <p style={{ fontSize: 48, marginBottom: 12 }}>🌙</p>
              <p style={{ fontSize: 15, fontWeight: 700 }}>No sleep logged yet</p>
              <p style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>Log your sleep on the left to see your score</p>
            </div>
          )}

          <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', marginTop: 'auto' }}>
            <p style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>7-Day Average</p>
            <p style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Poppins',sans-serif", color: '#a78bfa' }}>
              {avgSleep > 0 ? `${avgSleep}h` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 className="section-title" style={{ fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp style={{ width: 18, height: 18, color: '#6c63ff' }} /> This Week's Sleep
        </h3>
        {weekData.some(d => d.hours > 0) ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekData}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 12]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} formatter={(v) => [`${v}h`, 'Sleep']} />
              <ReferenceLine y={8} stroke="#6c63ff" strokeDasharray="4 4" label={{ value: 'Goal', position: 'right', fontSize: 10, fill: '#6c63ff' }} />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                {weekData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.hours)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state" style={{ padding: '30px 0' }}>
            <p style={{ fontSize: 40 }}>💤</p>
            <p style={{ fontSize: 14, color: 'var(--text-400)', marginTop: 10 }}>No sleep data yet — start logging!</p>
          </div>
        )}
      </div>

      {/* Sleep Tips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {TIPS.map((tip, i) => (
          <motion.div key={tip.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="card card-lift" style={{ padding: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{tip.emoji}</div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-900)', marginBottom: 6 }}>{tip.title}</p>
            <p style={{ fontSize: 12, color: 'var(--text-500)', lineHeight: 1.6 }}>{tip.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
