import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import toast from 'react-hot-toast';
import { Trash2, Calendar, TrendingUp, Smile } from 'lucide-react';
import { useMoodStore } from '../../store';

const MOODS = [
  { emoji: '😊', label: 'Happy',    score: 9  },
  { emoji: '😌', label: 'Calm',     score: 8  },
  { emoji: '😍', label: 'Grateful', score: 10 },
  { emoji: '🤔', label: 'Thinking', score: 6  },
  { emoji: '😴', label: 'Tired',    score: 4  },
  { emoji: '😢', label: 'Sad',      score: 2  },
  { emoji: '😰', label: 'Anxious',  score: 3  },
  { emoji: '😠', label: 'Stressed', score: 2  },
  { emoji: '🥳', label: 'Excited',  score: 9  },
];

const SCORE_COLOR = (score) => {
  if (score >= 8) return 'var(--green-500)';
  if (score >= 5) return 'var(--purple-500)';
  if (score >= 3) return 'var(--amber-500)';
  return 'var(--red-500)';
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getLast7DaysData(entries) {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const label = DAY_LABELS[d.getDay()];
    const dateStr = d.toISOString().split('T')[0];
    const dayEntries = entries.filter(e => e.date && e.date.startsWith(dateStr));
    const avg = dayEntries.length
      ? Math.round(dayEntries.reduce((s, e) => s + e.score, 0) / dayEntries.length)
      : 0;
    return { day: label, score: avg, date: dateStr };
  });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-md)',
        padding: '8px 14px',
        boxShadow: 'var(--shadow-card)',
        fontSize: 13,
        color: 'var(--text-900)',
      }}>
        <div style={{ fontWeight: 600 }}>{label}</div>
        <div style={{ color: 'var(--purple-500)', marginTop: 2 }}>
          Score: <strong>{payload[0].value || '—'}</strong>
        </div>
      </div>
    );
  }
  return null;
};

export default function MoodTracker() {
  const { entries = [], logMood, deleteMood } = useMoodStore();
  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const weekData = getLast7DaysData(entries);
  const scoredEntries = entries.filter(e => e.score);
  const avgScore = scoredEntries.length
    ? (scoredEntries.reduce((s, e) => s + e.score, 0) / scoredEntries.length).toFixed(1)
    : null;

  const handleSave = async () => {
    if (!selectedMood) {
      toast.error('Please select a mood first!');
      return;
    }
    setSaving(true);
    try {
      await logMood({
        emoji: selectedMood.emoji,
        label: selectedMood.label,
        score: selectedMood.score,
        notes: notes.trim(),
        date: new Date().toISOString(),
      });
      toast.success(`Mood logged! Feeling ${selectedMood.label} 🎉`);
      setSelectedMood(null);
      setNotes('');
    } catch {
      toast.error('Failed to save mood. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    deleteMood(id);
    toast.success('Entry removed.');
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{ padding: '32px 28px', maxWidth: 1100, margin: '0 auto' }}
    >
      {/* PAGE HEADER */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title" style={{ marginBottom: 6 }}>Mood Tracker</h1>
        <p className="section-subtitle">
          Check in with yourself daily — understanding your emotional patterns is the first step to lasting wellbeing.
        </p>
      </div>

      {/* TOP ROW */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* LOG MOOD CARD */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{ flex: '1 1 340px', minWidth: 300 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'var(--purple-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Smile size={20} color="var(--purple-600)" />
            </div>
            <h2 className="section-title" style={{ margin: 0 }}>How are you feeling today?</h2>
          </div>

          {/* Selected mood display */}
          <AnimatePresence mode="wait">
            {selectedMood ? (
              <motion.div
                key={selectedMood.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                style={{
                  textAlign: 'center',
                  marginBottom: 20,
                  padding: '14px 0 8px',
                  background: 'var(--purple-50)',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid var(--purple-100)',
                }}
              >
                <div style={{ fontSize: 52, lineHeight: 1.2 }}>{selectedMood.emoji}</div>
                <div style={{
                  fontWeight: 700, fontSize: 17,
                  color: 'var(--purple-600)', marginTop: 4,
                }}>
                  {selectedMood.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-500)', marginTop: 2 }}>
                  Score: {selectedMood.score} / 10
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  textAlign: 'center',
                  padding: '14px 0 10px',
                  marginBottom: 20,
                  color: 'var(--text-400)',
                  fontSize: 14,
                  background: 'var(--surface-2)',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px dashed var(--border-card)',
                }}
              >
                Select a mood below 👇
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3x3 Mood Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
            marginBottom: 20,
          }}>
            {MOODS.map((mood) => {
              const isActive = selectedMood?.label === mood.label;
              return (
                <motion.button
                  key={mood.label}
                  className="mood-btn"
                  onClick={() => setSelectedMood(isActive ? null : mood)}
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.93 }}
                  style={{
                    outline: isActive
                      ? '2.5px solid var(--purple-500)'
                      : '2px solid transparent',
                    background: isActive ? 'var(--purple-50)' : undefined,
                    boxShadow: isActive
                      ? '0 0 0 3px var(--purple-100)'
                      : undefined,
                    transition: 'all 0.18s ease',
                  }}
                  aria-pressed={isActive}
                  aria-label={mood.label}
                >
                  <span style={{ fontSize: 26 }}>{mood.emoji}</span>
                  <span style={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--purple-600)' : 'var(--text-500)',
                    marginTop: 3,
                    lineHeight: 1.2,
                  }}>
                    {mood.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Notes */}
          <label className="label" style={{ display: 'block', marginBottom: 6 }}>
            Notes <span style={{ color: 'var(--text-400)', fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            className="input-field"
            placeholder="What's on your mind? Any context for this mood…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              resize: 'vertical',
              fontFamily: 'inherit',
              lineHeight: 1.6,
              marginBottom: 18,
              boxSizing: 'border-box',
            }}
          />

          {/* Save Button */}
          <motion.button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving || !selectedMood}
            whileHover={!saving && selectedMood ? { scale: 1.03 } : {}}
            whileTap={!saving && selectedMood ? { scale: 0.97 } : {}}
            style={{
              width: '100%',
              opacity: !selectedMood ? 0.55 : 1,
              cursor: !selectedMood ? 'not-allowed' : 'pointer',
              fontSize: 15,
              padding: '12px 0',
              transition: 'opacity 0.2s',
            }}
          >
            {saving ? 'Saving…' : '💾  Save Mood Entry'}
          </motion.button>
        </motion.div>

        {/* THIS WEEK'S MOOD */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          style={{ flex: '0 1 340px', minWidth: 280 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'var(--purple-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TrendingUp size={20} color="var(--purple-600)" />
            </div>
            <h2 className="section-title" style={{ margin: 0 }}>This Week's Mood</h2>
          </div>

          {/* Average Score */}
          {avgScore && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              margin: '12px 0 20px',
              padding: '12px 16px',
              background: 'var(--purple-50)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--purple-100)',
            }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-500)', fontWeight: 600, letterSpacing: '0.04em' }}>
                  AVERAGE SCORE
                </div>
                <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--purple-600)', lineHeight: 1.1 }}>
                  {avgScore}
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-400)' }}> / 10</span>
                </div>
              </div>
              <div style={{
                marginLeft: 'auto',
                fontSize: 36,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }}>
                {avgScore >= 8 ? '😊' : avgScore >= 5 ? '😌' : avgScore >= 3 ? '😰' : '😢'}
              </div>
            </div>
          )}

          {/* Bar Chart */}
          <div style={{ width: '100%', height: 190 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weekData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                barCategoryGap="30%"
              >
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: 'var(--text-500)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fontSize: 11, fill: 'var(--text-400)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--purple-50)' }} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {weekData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.score ? SCORE_COLOR(entry.score) : 'var(--border-card)'}
                      fillOpacity={entry.score ? 1 : 0.4}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14,
            justifyContent: 'center',
          }}>
            {[
              { color: 'var(--green-500)',  label: 'Great (8–10)' },
              { color: 'var(--purple-500)', label: 'Good (5–7)' },
              { color: 'var(--amber-500)',  label: 'Low (3–4)' },
              { color: 'var(--red-500)',    label: 'Rough (1–2)' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-500)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: color, display: 'inline-block' }} />
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* MOOD HISTORY */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        style={{ marginTop: 24 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'var(--purple-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Calendar size={20} color="var(--purple-600)" />
          </div>
          <div>
            <h2 className="section-title" style={{ margin: 0 }}>Mood History</h2>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-400)' }}>
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'} logged
            </p>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-900)', marginBottom: 6 }}>
              No mood entries yet
            </div>
            <div style={{ color: 'var(--text-400)', fontSize: 14 }}>
              Start by logging your first mood above. Your history will appear here!
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AnimatePresence>
              {[...entries].reverse().map((entry, idx) => (
                <motion.div
                  key={entry.id ?? idx}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40, scale: 0.95 }}
                  transition={{ duration: 0.28, delay: idx * 0.03 }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    padding: '14px 16px',
                    background: 'var(--surface-2)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-card)',
                    transition: 'box-shadow 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-card)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  {/* Emoji bubble */}
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'var(--surface-1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26, flexShrink: 0,
                    border: '2px solid var(--border-card)',
                  }}>
                    {entry.emoji}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-900)' }}>
                        {entry.label}
                      </span>
                      <span
                        className={
                          entry.score >= 8 ? 'badge badge-green'
                          : entry.score >= 5 ? 'badge badge-purple'
                          : entry.score >= 3 ? 'badge badge-amber'
                          : 'badge badge-red'
                        }
                        style={{ fontSize: 11 }}
                      >
                        Score: {entry.score}/10
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-400)', marginTop: 3 }}>
                      {formatDate(entry.date)}
                    </div>
                    {entry.notes && (
                      <div style={{
                        marginTop: 7,
                        fontSize: 13,
                        color: 'var(--text-500)',
                        lineHeight: 1.55,
                        padding: '7px 10px',
                        background: 'var(--surface-1)',
                        borderRadius: 'var(--radius-md)',
                        borderLeft: '3px solid var(--purple-200, #c4b5fd)',
                      }}>
                        {entry.notes}
                      </div>
                    )}
                  </div>

                  {/* Delete button */}
                  <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(entry.id)}
                    title="Delete entry"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-400)',
                      padding: 6,
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.15s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--red-500)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-400)'}
                  >
                    <Trash2 size={17} />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
