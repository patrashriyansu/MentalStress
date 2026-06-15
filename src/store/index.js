import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* ─────────────────────────────────────────────────
   Auth Store  — with real local user database
   Users are stored by role; login validates creds
───────────────────────────────────────────────── */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: [],   // all registered users

      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (data) => set((state) => ({
        user: { ...state.user, ...data },
        users: state.users.map(u => u.id === state.user?.id ? { ...u, ...data } : u),
      })),

      // Register new user — called from AuthPage registration
      registerUser: (userData) => set((state) => ({
        users: [...state.users, userData],
      })),

      // Look up a user by email (case-insensitive)
      getUserByEmail: (email) => {
        const users = get().users;
        return users.find(u => u.email?.toLowerCase() === email?.toLowerCase()) || null;
      },

      // Get all doctors (users with role === 'doctor')
      getDoctors: () => get().users.filter(u => u.role === 'doctor'),

      // Get all patients
      getPatients: () => get().users.filter(u => u.role === 'patient'),
    }),
    { name: 'medivision-auth' }
  )
);

/* ─────────────────────────────────────────────────
   Health Store
───────────────────────────────────────────────── */
export const useHealthStore = create(
  persist(
    (set) => ({
      healthScore: 78,
      vitals: {
        heartRate: 72,
        spO2: 98,
        temperature: 98.6,
        bloodPressure: '120/80',
        bloodSugar: 95,
      },
      appointments: [],
      medicalHistory: [],
      prescriptions: [],
      notifications: [],
      iotConnected: false,

      setVitals: (vitals) => set({ vitals }),
      setHealthScore: (score) => set({ healthScore: score }),
      addAppointment: (appt) => set((s) => ({ appointments: [...s.appointments, appt] })),
      cancelAppointment: (id) => set((s) => ({
        appointments: s.appointments.filter(a => a.id !== id),
      })),
      addToHistory: (record) => set((s) => ({ medicalHistory: [record, ...s.medicalHistory] })),
      addPrescription: (rx) => set((s) => ({ prescriptions: [rx, ...s.prescriptions] })),
      addNotification: (notif) => set((s) => ({
        notifications: [{ id: Date.now(), ...notif, read: false }, ...s.notifications],
      })),
      markAllRead: () => set((s) => ({
        notifications: s.notifications.map(n => ({ ...n, read: true })),
      })),
      toggleIoT: () => set((s) => ({ iotConnected: !s.iotConnected })),
    }),
    { name: 'medivision-health' }
  )
);

/* ─────────────────────────────────────────────────
   UI Store
───────────────────────────────────────────────── */
export const useUIStore = create((set) => ({
  sidebarOpen: true,
  currentLang: 'en',
  theme: 'light',
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setLanguage: (lang) => set({ currentLang: lang }),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
}));
