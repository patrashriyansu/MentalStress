import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (data) => set((state) => ({ user: { ...state.user, ...data } })),
    }),
    { name: 'medivision-auth' }
  )
);

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

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  currentLang: 'en',
  theme: 'light',
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setLanguage: (lang) => set({ currentLang: lang }),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
}));
