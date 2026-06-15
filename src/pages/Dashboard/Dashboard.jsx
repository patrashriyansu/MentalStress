import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  Smile, Wind, Moon, BookOpen, Flame, TrendingUp, Heart, Zap,
  ArrowRight, Sparkles, Calendar, ChevronRight, PenLine,
} from 'lucide-react';
import {
  useAuthStore,
  useMoodStore,
  useStressStore,
  useSleepStore,
  useMeditationStore,
  useJournalStore,
} from '../../store';

/* ─── Constants ─── */
const QUOTES = [
  { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: 'Dan Millman' },
  { text: 'Even the darkest night will end and the sun will rise.', author: 'Victor Hugo' },
  { text: 'Self-care is not a luxury. It is a necessity.', author: 'Audre Lorde' },
  { text: 'You are enough. You have always been enough.', author: 'Unknown' },
  { text: 'Be gentle with yourself. You are a child of the universe.', author: 'Max Ehrmann' },
];

const DONUT_COLORS = ['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b'];

/* ─── Helpers ─── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getFormattedDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

/* ─── Wellness Ring ─── */
function WellnessRing({ score }) {
  const radius = 52;
  const stroke = 8;
  const normalised = clamp(score, 0, 100);
  const circ = 2 * Math.PI * radius;
  const offset = circ - (normalised / 100) * circ;

  const label =
    normalised >= 75 ? 'Great' :
    normalised >= 50 ? 'Good' :
    normalised >= 25 ? 'Fair' : 'Low';

  return (
    <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle
          cx="65" cy="65" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx="65" cy="65" r={radius}
          fill="none"
          stroke="white"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '65px 65px' }}
        />
        <circle cx="65" cy="65" r={radius - 14} fill="rgba(255,255,255,0.08)" />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ fontSize: 28, fontWeight: 900, color: 'white', lineHeight: 1, fontFamily: 'Poppins, sans-serif' }}
        >
          {Math.round(normalised)}
        </motion.span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 700, marginTop: 2 }}>{label}</span>
      </div>
    </div>
  );
}

/* ─── Quote Rotator ─── */
function QuoteRotator() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % QUOTES.length);
        setVisible(true);
      }, 400);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const q = QUOTES[idx];

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
          style={{ marginTop: 14 }}
        >
          <p style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.88)',
            fontStyle: 'italic',
            lineHeight: 1.6,
            maxWidth: 480,
          }}>
            "{q.text}"
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4, fontWeight: 600 }}>
            — {q.author}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Stat Card ─── */
function StatCard({ icon, iconBg, value, subtitle, delay }) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay || 0, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{ minWidth: 150, flex: '1 1 150px' }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 12,
        background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
      }}>
        {icon}
      </div>
      <div style={{
        fontSize: 20, fontWeight: 800, color: 'var(--text-900)',
        fontFamily: 'Poppins, sans-serif', lineHeight: 1.2,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-500)', marginTop: 4, fontWeight: 500 }}>
        {subtitle}
      </div>
    </motion.div>
  );
}

/* ─── Quick Action Button ─── */
function QuickAction({ icon, label, sub, gradient, onClick, delay }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay || 0, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        minWidth: 180,
        background: hovered ? gradient : 'var(--surface-1)',
        border: hovered ? '1.5px solid transparent' : '1.5px solid var(--border-card)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px 20px',
        cursor: 'pointer',
        textAlign: 'left',
        boxShadow: hovered ? '0 8px 32px rgba(108,99,255,0.22)' : 'var(--shadow-card)',
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 14,
        background: hovered ? 'rgba(255,255,255,0.22)' : 'var(--purple-50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.25s',
      }}>
        {React.cloneElement(icon, { size: 22, color: hovered ? 'white' : '#8b5cf6' })}
      </div>
      <div>
        <div style={{
          fontSize: 15, fontWeight: 700, fontFamily: 'Poppins, sans-serif',
          color: hovered ? 'white' : 'var(--text-900)',
          transition: 'color 0.25s',
        }}>
          {label}
        </div>
        <div style={{
          fontSize: 12, marginTop: 3,
          color: hovered ? 'rgba(255,255,255,0.75)' : 'var(--text-500)',
          transition: 'color 0.25s',
        }}>
          {sub}
        </div>
      </div>
      <ArrowRight
        size={16}
        style={{
          position: 'absolute', right: 18, bottom: 20,
          color: hovered ? 'rgba(255,255,255,0.7)' : 'var(--text-400)',
          transition: 'all 0.25s',
          transform: hovered ? 'translateX(2px)' : 'translateX(0)',
        }}
      />
    </motion.button>
  );
}

/* ─── Custom Tooltip ─── */
function CustomMoodTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: 'var(--surface-1)',
      border: '1px solid var(--border-card)',
      borderRadius: 12,
      padding: '8px 14px',
      boxShadow: 'var(--shadow-md)',
      fontSize: 13,
    }}>
      <p style={{ color: 'var(--text-500)', marginBottom: 2 }}>{label}</p>
      <p style={{ fontWeight: 700, color: '#8b5cf6' }}>Score: {payload[0].value}</p>
    </div>
  );
}

/* ─── Custom Donut Label ─── */
function CustomDonutLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.06) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

/* ══════════════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
══════════════════════════════════════════════════ */
export default function Dashboard() {
  const navigate = useNavigate();

  const user            = useAuthStore(s => s.user);
  const todayMood       = useMoodStore(s => s.todayMood);
  const getWeek         = useMoodStore(s => s.getThisWeek);
  const getTodayLevel   = useStressStore(s => s.getTodayLevel);
  const getAvgSleep     = useSleepStore(s => s.getAvgSleep);
  const getTodayMinutes = useMeditationStore(s => s.getTodayMinutes);
  const streak          = useMeditationStore(s => s.streak);
  const journalEntries  = useJournalStore(s => s.entries);

  const moodScore      = todayMood?.score ?? 0;
  const stressLevel    = getTodayLevel() ?? 5;
  const sleepHours     = parseFloat(getAvgSleep()) || 0;
  const meditationMins = getTodayMinutes();

  const sleepScore    = clamp((sleepHours / 10) * 100, 0, 100);
  const wellnessRaw   = moodScore * 0.3 + sleepScore * 0.3 + (10 - stressLevel) * 10 * 0.4;
  const wellnessScore = clamp(wellnessRaw, 0, 100);

  const weekData = getWeek();

  const donutData = [
    { name: 'Mood',       value: moodScore > 0 ? moodScore : 25 },
    { name: 'Sleep',      value: sleepHours > 0 ? sleepHours * 10 : 20 },
    { name: 'Meditation', value: meditationMins > 0 ? meditationMins : 15 },
    { name: 'Stress',     value: (10 - stressLevel) * 10 > 0 ? (10 - stressLevel) * 10 : 40 },
  ];

  const recentJournals = journalEntries.slice(0, 2);
  const greeting       = getGreeting();
  const displayName    = user?.name?.split(' ')[0] || 'Friend';
  const dateStr        = getFormattedDate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
    >

      {/* ═══ HERO CARD ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: 'var(--grad-hero)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 40px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(108,99,255,0.35)',
          minHeight: 200,
        }}
      >
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 260, height: 260, borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, right: 120,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 20, right: 280,
          width: 100, height: 100, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />

        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
        }}>
          {/* Left */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 'var(--radius-full)', padding: '4px 12px', marginBottom: 16,
            }}>
              <Calendar size={12} color="rgba(255,255,255,0.85)" />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                {dateStr}
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 30, fontWeight: 900, color: 'white',
                lineHeight: 1.2, letterSpacing: '-0.02em',
              }}
            >
              {greeting}, {displayName}! 👋
            </motion.h1>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 'var(--radius-full)', padding: '4px 12px', marginTop: 10,
            }}>
              <Sparkles size={12} color="white" />
              <span style={{ fontSize: 12, color: 'white', fontWeight: 700 }}>
                Wellness Score Today
              </span>
            </div>

            <QuoteRotator />
          </div>

          {/* Right: Ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <WellnessRing score={wellnessScore} />
            <span style={{
              fontSize: 11, color: 'rgba(255,255,255,0.65)',
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              Overall Score
            </span>
          </div>
        </div>
      </motion.div>

      {/* ═══ STATS ROW ═══ */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', overflowX: 'auto', paddingBottom: 4 }}>
        <StatCard
          delay={0.10}
          icon={<Smile size={20} color="#8b5cf6" />}
          iconBg="var(--purple-100)"
          value={todayMood ? `${todayMood.emoji} ${todayMood.label}` : '— Not logged'}
          subtitle="Today's Mood"
        />
        <StatCard
          delay={0.15}
          icon={<Wind size={20} color="#ef4444" />}
          iconBg="var(--red-100)"
          value={getTodayLevel() !== null ? `${getTodayLevel()} / 10` : '— Not logged'}
          subtitle="Stress Level"
        />
        <StatCard
          delay={0.20}
          icon={<Moon size={20} color="#3b82f6" />}
          iconBg="var(--blue-100)"
          value={sleepHours > 0 ? `${sleepHours} hrs` : '— Not logged'}
          subtitle="Avg Sleep"
        />
        <StatCard
          delay={0.25}
          icon={<Heart size={20} color="#10b981" />}
          iconBg="var(--green-100)"
          value={meditationMins > 0 ? `${meditationMins} min` : '0 min'}
          subtitle="Meditation Today"
        />
        <StatCard
          delay={0.30}
          icon={<Flame size={20} color="#f59e0b" />}
          iconBg="var(--amber-100)"
          value={streak > 0 ? `🔥 ${streak}` : '0'}
          subtitle="Day Streak"
        />
      </div>

      {/* ═══ CHARTS ROW ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Area Chart — Mood This Week */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ padding: 24 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div className="section-title">Mood This Week</div>
              <div className="section-subtitle">Your daily mood scores over 7 days</div>
            </div>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'var(--purple-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TrendingUp size={18} color="#8b5cf6" />
            </div>
          </div>

          {weekData.every(d => d.score === 0) ? (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <Smile size={36} color="var(--text-400)" style={{ marginBottom: 10 }} />
              <p style={{ fontSize: 13, color: 'var(--text-500)' }}>No mood data yet this week</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weekData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: 'var(--text-400)', fontFamily: 'Inter, sans-serif' }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: 'var(--text-400)' }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip content={<CustomMoodTooltip />} />
                <Area
                  type="monotone" dataKey="score"
                  stroke="#8b5cf6" strokeWidth={2.5}
                  fill="url(#moodGrad)"
                  dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 6, fill: '#6c63ff', stroke: 'white', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Donut Chart — Wellness Breakdown */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ padding: 24 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div className="section-title">Wellness Breakdown</div>
              <div className="section-subtitle">Today's wellness pillars at a glance</div>
            </div>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--purple-100), var(--green-100))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={18} color="#8b5cf6" />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ResponsiveContainer width={170} height={170}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%" cy="50%"
                  innerRadius={45} outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={<CustomDonutLabel />}
                >
                  {donutData.map((entry, i) => (
                    <Cell key={entry.name} fill={DONUT_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${Math.round(value)}`, name]}
                  contentStyle={{
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border-card)',
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {donutData.map((d, i) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: 3,
                    background: DONUT_COLORS[i], flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 12, color: 'var(--text-600)', fontWeight: 500 }}>{d.name}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: 'var(--text-900)' }}>
                    {Math.round(d.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ QUICK ACTIONS ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div style={{ marginBottom: 14 }}>
          <div className="section-title">Quick Actions</div>
          <div className="section-subtitle">Jump right into your wellness routine</div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <QuickAction
            delay={0.52}
            icon={<Smile />}
            label="Log Today's Mood"
            sub="Track how you feel right now"
            gradient="linear-gradient(135deg, #6c63ff, #8b5cf6)"
            onClick={() => navigate('/mood')}
          />
          <QuickAction
            delay={0.56}
            icon={<Wind />}
            label="Start Meditation"
            sub="Breathe, relax, and recharge"
            gradient="linear-gradient(135deg, #10b981, #059669)"
            onClick={() => navigate('/meditation')}
          />
          <QuickAction
            delay={0.60}
            icon={<PenLine />}
            label="Write in Journal"
            sub="Reflect on your thoughts"
            gradient="linear-gradient(135deg, #3b82f6, #6366f1)"
            onClick={() => navigate('/journal')}
          />
        </div>
      </motion.div>

      {/* ═══ RECENT JOURNAL PREVIEW ═══ */}
      {recentJournals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
          }}>
            <div>
              <div className="section-title">Recent Journal</div>
              <div className="section-subtitle">Your latest reflections</div>
            </div>
            <button
              className="btn btn-secondary"
              style={{ fontSize: 13, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 4 }}
              onClick={() => navigate('/journal')}
            >
              View All <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentJournals.map((entry, i) => (
              <motion.div
                key={entry.id}
                className="card card-lift"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.68 + i * 0.06, duration: 0.4 }}
                style={{
                  padding: '18px 22px', cursor: 'pointer',
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                }}
                onClick={() => navigate('/journal')}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: 'var(--purple-100)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 2,
                }}>
                  <BookOpen size={18} color="#8b5cf6" />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <h3 style={{
                      fontSize: 14, fontWeight: 700, color: 'var(--text-900)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {entry.title || 'Untitled Entry'}
                    </h3>
                    <span style={{ fontSize: 11, color: 'var(--text-400)', flexShrink: 0 }}>
                      {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p style={{
                    fontSize: 13, color: 'var(--text-500)', marginTop: 5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.55,
                  }}>
                    {entry.content || 'No content'}
                  </p>
                  {entry.mood && (
                    <div style={{ marginTop: 8 }}>
                      <span className="badge badge-purple">{entry.mood}</span>
                    </div>
                  )}
                </div>

                <ChevronRight size={16} color="var(--text-400)" style={{ flexShrink: 0, marginTop: 4 }} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ═══ EMPTY JOURNAL STATE ═══ */}
      {recentJournals.length === 0 && (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
        >
          <div className="empty-state">
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: 'var(--purple-50)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              <BookOpen size={28} color="var(--purple-500)" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-900)', marginBottom: 6 }}>
              Your journal is empty
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-500)', maxWidth: 320, lineHeight: 1.6, marginBottom: 20 }}>
              Writing about your day helps process emotions and gain clarity. Start your first entry today!
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/journal')}>
              <PenLine size={15} /> Write First Entry
            </button>
          </div>
        </motion.div>
      )}

      <div style={{ height: 8 }} />
    </motion.div>
  );
}
