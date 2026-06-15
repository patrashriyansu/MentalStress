import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Search, Trash2, Save, RefreshCw, Feather, Sparkles, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useJournalStore } from '../../store';

/* ─── Writing Prompts ─── */
const PROMPTS = [
  'What made you smile today?',
  'Describe a moment of peace you experienced recently...',
  'What are three things you are grateful for right now?',
  'How did you take care of yourself today?',
  'What emotion is most present for you right now, and why?',
  'Write about someone who made a positive impact on your life lately.',
  'What challenge did you face today, and what did you learn from it?',
  'Describe your ideal calm morning in detail...',
  'What would you tell your past self from one year ago?',
  'What small win can you celebrate about yourself today?',
];

/* ─── Mood Options ─── */
const MOODS = [
  { label: 'Happy',    emoji: '😊', color: '#f59e0b', bg: '#fef3c7', border: '#f59e0b' },
  { label: 'Calm',     emoji: '😌', color: '#10b981', bg: '#d1fae5', border: '#10b981' },
  { label: 'Anxious',  emoji: '😰', color: '#ef4444', bg: '#fee2e2', border: '#ef4444' },
  { label: 'Sad',      emoji: '😔', color: '#6366f1', bg: '#eef2ff', border: '#6366f1' },
  { label: 'Grateful', emoji: '🙏', color: '#8b5cf6', bg: '#f5f3ff', border: '#8b5cf6' },
];

/* ─── Helpers ─── */
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getExcerpt = (text = '', len = 80) =>
  text.length > len ? text.slice(0, len).trimEnd() + '\u2026' : text;

const getMoodForLabel = (label) => MOODS.find((m) => m.label === label);

/* ─── Welcome State ─── */
function WelcomeState({ prompt, onRefresh }) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '48px 32px',
        textAlign: 'center',
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'var(--grad-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 28,
          boxShadow: '0 8px 32px rgba(108,99,255,0.30)',
        }}
      >
        <Feather size={36} color="#fff" />
      </motion.div>

      <h2 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-900)', marginBottom: 8 }}>
        Your Safe Space to Write
      </h2>
      <p style={{ fontSize: 15, color: 'var(--text-500)', marginBottom: 40, maxWidth: 360, lineHeight: 1.7 }}>
        Journaling helps you understand your emotions, reduce stress, and grow.
        Select an entry or create a new one to get started.
      </p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        style={{
          background: 'linear-gradient(135deg, #f5f3ff 0%, #eef2ff 100%)',
          border: '1.5px solid var(--purple-200)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 28px',
          maxWidth: 420,
          width: '100%',
          boxShadow: '0 4px 20px rgba(108,99,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Sparkles size={16} color="var(--purple-500)" />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--purple-500)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Today's Prompt
          </span>
          <button
            onClick={onRefresh}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 6,
              color: 'var(--purple-400)',
              display: 'flex',
              alignItems: 'center',
            }}
            title="New prompt"
          >
            <RefreshCw size={14} />
          </button>
        </div>
        <p style={{ fontSize: 17, fontWeight: 500, color: 'var(--text-700)', lineHeight: 1.6, margin: 0 }}>
          "{prompt}"
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─── Entry List Item ─── */
function EntryCard({ entry, isSelected, onClick }) {
  const mood = getMoodForLabel(entry.mood);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      whileHover={{ x: 3 }}
      transition={{ duration: 0.22 }}
      onClick={onClick}
      style={{
        padding: '14px 16px',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        background: isSelected
          ? 'linear-gradient(135deg, #f5f3ff 0%, #eef2ff 100%)'
          : 'var(--surface-1)',
        border: isSelected
          ? '1.5px solid var(--purple-300)'
          : '1px solid var(--border-card)',
        marginBottom: 8,
        boxShadow: isSelected
          ? '0 4px 16px rgba(108,99,255,0.12)'
          : 'var(--shadow-card)',
        transition: 'background 0.2s, border 0.2s, box-shadow 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: isSelected ? 'var(--purple-600)' : 'var(--text-900)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {entry.title || 'Untitled Entry'}
            </span>
          </div>
          <p
            style={{
              fontSize: 12,
              color: 'var(--text-500)',
              margin: '0 0 8px',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {getExcerpt(entry.content)}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {mood && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: 11,
                  fontWeight: 600,
                  color: mood.color,
                  background: mood.bg,
                  border: `1px solid ${mood.border}30`,
                  borderRadius: 20,
                  padding: '2px 8px',
                }}
              >
                <span>{mood.emoji}</span>
                {mood.label}
              </span>
            )}
            <span style={{ fontSize: 11, color: 'var(--text-400)', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Clock size={10} />
              {formatDate(entry.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Auto-save Badge ─── */
function SaveIndicator({ status }) {
  if (status === 'idle') return null;
  return (
    <motion.span
      key={status}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        fontSize: 12,
        color: status === 'saved' ? 'var(--green-500)' : 'var(--text-400)',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontWeight: 500,
      }}
    >
      {status === 'saving' ? (
        <>
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            style={{ display: 'flex' }}
          >
            <RefreshCw size={12} />
          </motion.span>
          Saving...
        </>
      ) : (
        <>\u2713 Saved</>
      )}
    </motion.span>
  );
}

/* ─── Main Component ─── */
export default function Journal() {
  const { entries, addEntry, updateEntry, deleteEntry } = useJournalStore();

  const [search, setSearch]         = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [isNew, setIsNew]           = useState(false);
  const [title, setTitle]           = useState('');
  const [content, setContent]       = useState('');
  const [mood, setMood]             = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [promptIdx, setPromptIdx]   = useState(() => Math.floor(Math.random() * PROMPTS.length));

  const saveTimerRef = useRef(null);
  const isEditing    = isNew || selectedId !== null;

  /* Filter entries */
  const filtered = entries.filter((e) => {
    const q = search.toLowerCase();
    return (
      (e.title   || '').toLowerCase().includes(q) ||
      (e.content || '').toLowerCase().includes(q) ||
      (e.mood    || '').toLowerCase().includes(q)
    );
  });

  /* Load selected entry */
  useEffect(() => {
    if (selectedId) {
      const entry = entries.find((e) => e.id === selectedId);
      if (entry) {
        setTitle(entry.title   || '');
        setContent(entry.content || '');
        setMood(entry.mood     || null);
        setSaveStatus('idle');
      }
    }
  }, [selectedId]);

  /* Auto-save trigger */
  const triggerAutoSave = useCallback(() => {
    setSaveStatus('saving');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1200);
  }, []);

  const handleTitleChange = (val) => {
    setTitle(val);
    if (selectedId) triggerAutoSave();
  };

  const handleContentChange = (val) => {
    setContent(val);
    if (selectedId) triggerAutoSave();
  };

  const handleMoodChange = (label) => {
    setMood((prev) => (prev === label ? null : label));
    if (selectedId) triggerAutoSave();
  };

  /* New entry */
  const handleNewEntry = () => {
    setSelectedId(null);
    setIsNew(true);
    setTitle('');
    setContent('');
    setMood(null);
    setSaveStatus('idle');
  };

  /* Select existing */
  const handleSelect = (id) => {
    setIsNew(false);
    setSelectedId(id);
  };

  /* Save */
  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      toast.error('Please add a title or some content first.');
      return;
    }
    const payload = { title: title.trim(), content: content.trim(), mood };

    if (isNew) {
      addEntry(payload);
      toast.success('Entry saved \u2728');
      setIsNew(false);
      setTimeout(() => {
        const latest = useJournalStore.getState().entries[0];
        if (latest) setSelectedId(latest.id);
      }, 50);
    } else if (selectedId) {
      updateEntry(selectedId, payload);
      toast.success('Entry updated \u2728');
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  /* Delete */
  const handleDelete = () => {
    if (!selectedId) return;
    deleteEntry(selectedId);
    setSelectedId(null);
    setIsNew(false);
    setSaveStatus('idle');
    toast.success('Entry deleted.');
  };

  /* Rotate prompt */
  const rotatePrompt = () => setPromptIdx((i) => (i + 1) % PROMPTS.length);

  const wordCount = content.trim() ? content.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - 70px)',
        background: 'var(--bg-app)',
        overflow: 'hidden',
      }}
    >
      {/* ══ LEFT PANEL (35%) ══ */}
      <div
        style={{
          width: '35%',
          minWidth: 280,
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--surface-1)',
          borderRight: '1px solid var(--border-card)',
          boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Panel header */}
        <div style={{ padding: '22px 18px 14px', borderBottom: '1px solid var(--border-card)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'var(--grad-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(108,99,255,0.25)',
                  flexShrink: 0,
                }}
              >
                <BookOpen size={18} color="#fff" />
              </div>
              <div>
                <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-900)', margin: 0 }}>My Journal</h1>
                <p style={{ fontSize: 11, color: 'var(--text-400)', margin: 0 }}>
                  {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleNewEntry}
              className="btn btn-primary"
              style={{ padding: '7px 13px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5, borderRadius: 10 }}
            >
              <Plus size={15} />
              New
            </motion.button>
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: 11,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-400)',
                pointerEvents: 'none',
              }}
            />
            <input
              className="input-field"
              type="text"
              placeholder="Search entries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 32, fontSize: 13, height: 38, width: '100%', background: 'var(--surface-2)' }}
            />
          </div>
        </div>

        {/* Entry list */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 14px',
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--purple-200) transparent',
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="empty-state"
                style={{ marginTop: 48, padding: '32px 16px' }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>📔</div>
                <p style={{ fontWeight: 600, color: 'var(--text-700)', marginBottom: 4, fontSize: 15 }}>
                  {search ? 'No entries found' : 'Start your wellness journey...'}
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-400)' }}>
                  {search
                    ? 'Try a different keyword.'
                    : 'Tap "New" to write your first entry.'}
                </p>
              </motion.div>
            ) : (
              filtered.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  isSelected={entry.id === selectedId}
                  onClick={() => handleSelect(entry.id)}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ══ RIGHT PANEL (65%) ══ */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'var(--surface-2)',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <WelcomeState
              key="welcome"
              prompt={PROMPTS[promptIdx]}
              onRefresh={rotatePrompt}
            />
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
            >
              {/* Editor top bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '18px 28px 14px',
                  borderBottom: '1px solid var(--border-card)',
                  background: 'var(--surface-1)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  flexShrink: 0,
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <Feather size={17} color="var(--purple-500)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-700)', whiteSpace: 'nowrap' }}>
                    {isNew ? 'New Entry' : 'Edit Entry'}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-400)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    &nbsp;&middot;&nbsp;{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <AnimatePresence>
                    <SaveIndicator key={saveStatus} status={saveStatus} />
                  </AnimatePresence>

                  {!isNew && (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDelete}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '7px 13px',
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'var(--red-500)',
                        background: '#fee2e2',
                        border: 'none',
                        borderRadius: 10,
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={14} />
                      Delete
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="btn btn-primary"
                    style={{ padding: '7px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, borderRadius: 10 }}
                  >
                    <Save size={14} />
                    {isNew ? 'Save Entry' : 'Update'}
                  </motion.button>
                </div>
              </div>

              {/* Editor body */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '28px 36px 48px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'var(--purple-200) transparent',
                }}
              >
                {/* Prompt banner */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: 'linear-gradient(135deg, #f5f3ff, #eef2ff)',
                    border: '1px solid var(--purple-200)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '11px 15px',
                    marginBottom: 28,
                  }}
                >
                  <Sparkles size={14} color="var(--purple-500)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--text-600)', lineHeight: 1.5, flex: 1, fontStyle: 'italic' }}>
                    "{PROMPTS[promptIdx]}"
                  </span>
                  <button
                    onClick={rotatePrompt}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 4,
                      borderRadius: 6,
                      color: 'var(--purple-400)',
                      display: 'flex',
                      alignItems: 'center',
                      flexShrink: 0,
                    }}
                    title="New prompt"
                  >
                    <RefreshCw size={13} />
                  </button>
                </motion.div>

                {/* Title */}
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Give your entry a title..."
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: 28,
                    fontWeight: 700,
                    color: 'var(--text-900)',
                    lineHeight: 1.3,
                    marginBottom: 22,
                    padding: 0,
                    fontFamily: 'inherit',
                    caretColor: 'var(--purple-500)',
                    boxSizing: 'border-box',
                  }}
                />

                {/* Mood selector */}
                <div style={{ marginBottom: 24 }}>
                  <p className="label" style={{ marginBottom: 10, display: 'block', fontSize: 12, color: 'var(--text-500)' }}>
                    How are you feeling?
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {MOODS.map((m) => {
                      const active = mood === m.label;
                      return (
                        <motion.button
                          key={m.label}
                          whileHover={{ scale: 1.07, y: -2 }}
                          whileTap={{ scale: 0.93 }}
                          onClick={() => handleMoodChange(m.label)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '7px 14px',
                            borderRadius: 20,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: `2px solid ${active ? m.border : 'transparent'}`,
                            background: active ? m.bg : 'var(--surface-1)',
                            color: active ? m.color : 'var(--text-500)',
                            boxShadow: active ? `0 4px 12px ${m.color}28` : 'var(--shadow-card)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <span style={{ fontSize: 16 }}>{m.emoji}</span>
                          {m.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'var(--border-card)', marginBottom: 24 }} />

                {/* Textarea */}
                <textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Begin writing... let your thoughts flow freely. This is your private space."
                  style={{
                    width: '100%',
                    minHeight: 400,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: 16,
                    color: 'var(--text-700)',
                    lineHeight: 1.9,
                    resize: 'none',
                    fontFamily: 'inherit',
                    caretColor: 'var(--purple-500)',
                    padding: 0,
                    boxSizing: 'border-box',
                  }}
                />

                {/* Word count */}
                <AnimatePresence>
                  {wordCount > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ fontSize: 11, color: 'var(--text-400)', marginTop: 12, textAlign: 'right' }}
                    >
                      {wordCount} {wordCount === 1 ? 'word' : 'words'}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
