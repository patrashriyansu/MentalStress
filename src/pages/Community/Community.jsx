import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCommunityStore, useAuthStore } from '../../store';
import { Heart, Send, MessageCircle, Trash2, Users, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const MOOD_TAGS = [
  { emoji: '😊', label: 'Happy',   color: '#10b981' },
  { emoji: '😔', label: 'Sad',     color: '#6b7280' },
  { emoji: '😰', label: 'Anxious', color: '#f59e0b' },
  { emoji: '😤', label: 'Stressed',color: '#ef4444' },
  { emoji: '😌', label: 'Calm',    color: '#6c63ff' },
];

const TOPICS = ['All', 'Anxiety', 'Depression', 'Self-care', 'Mindfulness', 'Sleep', 'Motivation', 'Gratitude'];

const SAMPLE_POSTS = [
  { id: -1, anonymous: true, content: "Today I tried meditation for the first time and it helped so much with my anxiety. Small steps count! 💜", mood: '😌', moodLabel: 'Calm', topic: 'Mindfulness', likes: 24, likedByMe: false, comments: 8, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: -2, anonymous: true, content: "Struggling with sleep lately. What helps you wind down at night?", mood: '😔', moodLabel: 'Sad', topic: 'Sleep', likes: 12, likedByMe: false, comments: 15, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: -3, anonymous: true, content: "Three things I'm grateful for today: sunshine, a warm cup of tea, and this community. Thank you all 🌸", mood: '😊', moodLabel: 'Happy', topic: 'Gratitude', likes: 41, likedByMe: false, comments: 6, createdAt: new Date(Date.now() - 86400000).toISOString() },
];

function timeAgo(iso) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function Community() {
  const { posts, addPost, toggleLike, deletePost } = useCommunityStore();
  const { user } = useAuthStore();
  const [text, setText] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [filterTopic, setFilterTopic] = useState('All');
  const [sampleLikes, setSampleLikes] = useState({ '-1': false, '-2': false, '-3': false });
  const [sampleLikeCounts, setSampleLikeCounts] = useState({ '-1': 24, '-2': 12, '-3': 41 });

  const allPosts = [...posts, ...SAMPLE_POSTS];
  const filteredPosts = filterTopic === 'All' ? allPosts : allPosts.filter(p => p.topic === filterTopic);

  const handlePost = () => {
    if (!text.trim()) return;
    addPost({
      content: text.trim(),
      mood: selectedMood?.emoji || '😊',
      moodLabel: selectedMood?.label || 'Happy',
      topic: selectedTopic === 'All' ? 'General' : selectedTopic,
      anonymous: true,
    });
    setText('');
    setSelectedMood(null);
    toast.success('Post shared with the community 💜');
  };

  const toggleSampleLike = (id) => {
    setSampleLikes(l => ({ ...l, [id]: !l[id] }));
    setSampleLikeCounts(c => ({ ...c, [id]: c[id] + (sampleLikes[id] ? -1 : 1) }));
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Community 💜</h1>
        <p className="section-subtitle">A safe, anonymous space to share, support, and connect.</p>
      </div>

      {/* Safe Space Banner */}
      <div style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: '1px solid #ddd6fe', borderRadius: 16, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Shield style={{ width: 20, height: 20, color: '#6c63ff', flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#4c1d95' }}>This is a safe, judgment-free zone</p>
          <p style={{ fontSize: 12, color: '#7c3aed', marginTop: 2 }}>All posts are anonymous. Be kind, supportive, and respectful.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 20, alignItems: 'start' }}>
        {/* Main Feed */}
        <div>
          {/* Composer */}
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-900)', marginBottom: 12 }}>Share with the community</p>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="What's on your mind? Share anonymously..."
              className="input-field"
              rows={3}
              style={{ resize: 'none', marginBottom: 12 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {MOOD_TAGS.map(m => (
                <button key={m.label} onClick={() => setSelectedMood(m === selectedMood ? null : m)}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 20, border: '1.5px solid', borderColor: selectedMood?.label === m.label ? m.color : '#e5e7eb', background: selectedMood?.label === m.label ? m.color + '18' : 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: selectedMood?.label === m.label ? m.color : '#6b7280' }}>
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <select value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)} className="input-field" style={{ flex: 1, maxWidth: 200 }}>
                {TOPICS.slice(1).map(t => <option key={t}>{t}</option>)}
              </select>
              <button onClick={handlePost} disabled={!text.trim()} className="btn btn-primary" style={{ gap: 6 }}>
                <Send style={{ width: 14, height: 14 }} /> Post
              </button>
            </div>
          </div>

          {/* Topic filter */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {TOPICS.map(t => (
              <button key={t} onClick={() => setFilterTopic(t)}
                style={{ padding: '5px 12px', borderRadius: 20, border: '1.5px solid', borderColor: filterTopic === t ? '#6c63ff' : '#e5e7eb', background: filterTopic === t ? 'var(--purple-50)' : 'white', color: filterTopic === t ? '#6c63ff' : '#6b7280', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                {t}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filteredPosts.map((post, i) => {
              const isSample = post.id < 0;
              const isLiked = isSample ? sampleLikes[post.id] : post.likedByMe;
              const likeCount = isSample ? sampleLikeCounts[post.id] : post.likes;
              return (
                <motion.div key={post.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--purple-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                      {post.mood}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#6c63ff' }}>Anonymous</span>
                        <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#d1d5db' }} />
                        <span style={{ fontSize: 11, color: 'var(--text-400)' }}>{timeAgo(post.createdAt)}</span>
                        {post.topic && (
                          <span style={{ padding: '2px 8px', borderRadius: 20, background: 'var(--purple-50)', color: '#6c63ff', fontSize: 10, fontWeight: 700 }}>{post.topic}</span>
                        )}
                      </div>
                      <p style={{ fontSize: 14, color: 'var(--text-700)', lineHeight: 1.6, marginBottom: 12 }}>{post.content}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <button onClick={() => isSample ? toggleSampleLike(post.id) : toggleLike(post.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: isLiked ? '#ef4444' : 'var(--text-400)', fontSize: 13, fontWeight: 600, padding: '4px 8px', borderRadius: 8, transition: 'all 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                          <Heart style={{ width: 14, height: 14, fill: isLiked ? '#ef4444' : 'none' }} />
                          {likeCount}
                        </button>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-400)', fontSize: 13 }}>
                          <MessageCircle style={{ width: 14, height: 14 }} /> {post.comments || 0}
                        </span>
                        {!isSample && (
                          <button onClick={() => deletePost(post.id)}
                            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', display: 'flex', padding: 4, borderRadius: 6 }}
                            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                            onMouseLeave={e => e.currentTarget.style.color = '#d1d5db'}>
                            <Trash2 style={{ width: 13, height: 13 }} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-900)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users style={{ width: 16, height: 16, color: '#6c63ff' }} /> Community Stats
            </p>
            {[
              { label: 'Total Posts', value: allPosts.length },
              { label: 'Members', value: '2,847' },
              { label: 'Active Today', value: '143' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-card)' }}>
                <span style={{ fontSize: 13, color: 'var(--text-500)' }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#6c63ff' }}>{s.value}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-900)', marginBottom: 10 }}>💜 Community Guidelines</p>
            {['Be kind and empathetic', 'No judgment or criticism', 'Support each other', 'Seek help when needed'].map(g => (
              <p key={g} style={{ fontSize: 12, color: 'var(--text-500)', marginBottom: 6, paddingLeft: 12, borderLeft: '2px solid #6c63ff20' }}>
                {g}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
