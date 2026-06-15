import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* ─── Auth Store (Real local user database) ─── */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: [],

      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (data) => set((state) => ({
        user: { ...state.user, ...data },
        users: state.users.map(u => u.id === state.user?.id ? { ...u, ...data } : u),
      })),
      registerUser: (userData) => set((state) => ({ users: [...state.users, userData] })),
      getUserByEmail: (email) => get().users.find(u => u.email?.toLowerCase() === email?.toLowerCase()) || null,
      getDoctors: () => get().users.filter(u => u.role === 'doctor'),
      getPatients: () => get().users.filter(u => u.role === 'patient'),
    }),
    { name: 'mindspace-auth' }
  )
);

/* ─── Mood Store ─── */
export const useMoodStore = create(
  persist(
    (set, get) => ({
      entries: [], // { id, date, emoji, label, score, notes, createdAt }
      todayMood: null,

      logMood: (entry) => {
        const today = new Date().toDateString();
        const newEntry = { id: Date.now(), date: today, createdAt: new Date().toISOString(), ...entry };
        set((state) => ({
          entries: [newEntry, ...state.entries.filter(e => e.date !== today)],
          todayMood: newEntry,
        }));
      },

      deleteEntry: (id) => set((state) => ({
        entries: state.entries.filter(e => e.id !== id),
        todayMood: state.todayMood?.id === id ? null : state.todayMood,
      })),

      getThisWeek: () => {
        const now = new Date();
        const week = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now); d.setDate(now.getDate() - i);
          const dateStr = d.toDateString();
          const entry = get().entries.find(e => e.date === dateStr);
          week.push({ date: dateStr, day: d.toLocaleDateString('en', { weekday: 'short' }), score: entry?.score || 0, emoji: entry?.emoji || null });
        }
        return week;
      },
    }),
    { name: 'mindspace-mood' }
  )
);

/* ─── Journal Store ─── */
export const useJournalStore = create(
  persist(
    (set) => ({
      entries: [], // { id, title, content, mood, tags, date, createdAt }

      addEntry: (entry) => set((state) => ({
        entries: [{ id: Date.now(), createdAt: new Date().toISOString(), date: new Date().toDateString(), ...entry }, ...state.entries],
      })),

      updateEntry: (id, updates) => set((state) => ({
        entries: state.entries.map(e => e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e),
      })),

      deleteEntry: (id) => set((state) => ({ entries: state.entries.filter(e => e.id !== id) })),
    }),
    { name: 'mindspace-journal' }
  )
);

/* ─── Sleep Store ─── */
export const useSleepStore = create(
  persist(
    (set, get) => ({
      entries: [], // { id, date, bedtime, wakeTime, duration, quality, notes }

      logSleep: (entry) => {
        const today = new Date().toDateString();
        set((state) => ({
          entries: [
            { id: Date.now(), date: today, createdAt: new Date().toISOString(), ...entry },
            ...state.entries.filter(e => e.date !== today),
          ],
        }));
      },

      deleteEntry: (id) => set((state) => ({ entries: state.entries.filter(e => e.id !== id) })),

      getThisWeek: () => {
        const now = new Date();
        return Array.from({ length: 7 }, (_, i) => {
          const d = new Date(now); d.setDate(now.getDate() - (6 - i));
          const dateStr = d.toDateString();
          const entry = get().entries.find(e => e.date === dateStr);
          return { day: d.toLocaleDateString('en', { weekday: 'short' }), hours: entry?.duration || 0, quality: entry?.quality || 0 };
        });
      },

      getAvgSleep: () => {
        const week = get().entries.slice(0, 7);
        if (!week.length) return 0;
        return (week.reduce((s, e) => s + (e.duration || 0), 0) / week.length).toFixed(1);
      },
    }),
    { name: 'mindspace-sleep' }
  )
);

/* ─── Meditation Store ─── */
export const useMeditationStore = create(
  persist(
    (set, get) => ({
      sessions: [], // { id, type, duration, completedAt }
      streak: 0,
      totalMinutes: 0,

      logSession: (session) => {
        const today = new Date().toDateString();
        const alreadyToday = get().sessions.some(s => new Date(s.completedAt).toDateString() === today);
        set((state) => ({
          sessions: [{ id: Date.now(), completedAt: new Date().toISOString(), ...session }, ...state.sessions],
          totalMinutes: state.totalMinutes + (session.duration || 0),
          streak: alreadyToday ? state.streak : state.streak + 1,
        }));
      },

      getTodayMinutes: () => {
        const today = new Date().toDateString();
        return get().sessions
          .filter(s => new Date(s.completedAt).toDateString() === today)
          .reduce((sum, s) => sum + (s.duration || 0), 0);
      },
    }),
    { name: 'mindspace-meditation' }
  )
);

/* ─── Stress Store ─── */
export const useStressStore = create(
  persist(
    (set, get) => ({
      entries: [], // { id, date, level, triggers, notes }

      logStress: (entry) => {
        const today = new Date().toDateString();
        set((state) => ({
          entries: [
            { id: Date.now(), date: today, createdAt: new Date().toISOString(), ...entry },
            ...state.entries.filter(e => e.date !== today),
          ],
        }));
      },

      getThisWeek: () => {
        const now = new Date();
        return Array.from({ length: 7 }, (_, i) => {
          const d = new Date(now); d.setDate(now.getDate() - (6 - i));
          const dateStr = d.toDateString();
          const entry = get().entries.find(e => e.date === dateStr);
          return { day: d.toLocaleDateString('en', { weekday: 'short' }), level: entry?.level || 0 };
        });
      },

      getTodayLevel: () => {
        const today = new Date().toDateString();
        return get().entries.find(e => e.date === today)?.level || null;
      },
    }),
    { name: 'mindspace-stress' }
  )
);

/* ─── Community Store ─── */
export const useCommunityStore = create(
  persist(
    (set) => ({
      posts: [],

      addPost: (post) => set((state) => ({
        posts: [{ id: Date.now(), likes: 0, likedByMe: false, comments: 0, createdAt: new Date().toISOString(), ...post }, ...state.posts],
      })),

      toggleLike: (id) => set((state) => ({
        posts: state.posts.map(p => p.id === id ? { ...p, likedByMe: !p.likedByMe, likes: p.likedByMe ? p.likes - 1 : p.likes + 1 } : p),
      })),

      deletePost: (id) => set((state) => ({ posts: state.posts.filter(p => p.id !== id) })),
    }),
    { name: 'mindspace-community' }
  )
);

/* ─── UI Store ─── */
export const useUIStore = create((set) => ({
  sidebarOpen: true,
  theme: 'light',
  currentLang: 'en',
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleTheme: () => set((s) => {
    const next = s.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    return { theme: next };
  }),
  setLanguage: (lang) => set({ currentLang: lang }),
}));

/* ─── Health Store (legacy compatibility) ─── */
export const useHealthStore = create(
  persist(
    (set) => ({
      notifications: [],
      appointments: [],
      addNotification: (n) => set((s) => ({ notifications: [{ id: Date.now(), ...n, read: false }, ...s.notifications] })),
      markAllRead: () => set((s) => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) })),
      addAppointment: (a) => set((s) => ({ appointments: [...s.appointments, a] })),
      cancelAppointment: (id) => set((s) => ({ appointments: s.appointments.filter(a => a.id !== id) })),
    }),
    { name: 'mindspace-health' }
  )
);
