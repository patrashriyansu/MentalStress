import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store';

import Layout from './components/Layout/Layout';
import AuthPage from './pages/Auth/AuthPage';

// Mental Health Pages
import Dashboard from './pages/Dashboard/Dashboard';
import MoodTracker from './pages/MoodTracker/MoodTracker';
import StressAnalysis from './pages/StressAnalysis/StressAnalysis';
import Journal from './pages/Journal/Journal';
import Meditation from './pages/Meditation/Meditation';
import SleepTracker from './pages/SleepTracker/SleepTracker';
import Reports from './pages/Reports/Reports';
import Community from './pages/Community/Community';
import Settings from './pages/Settings/Settings';

// Medical / Healthcare Pages (kept)
import Appointments from './pages/Appointments/Appointments';
import DoctorRecommend from './pages/Doctors/DoctorRecommend';
import HospitalFinder from './pages/HospitalFinder/HospitalFinder';
import EmergencySOS from './pages/EmergencySOS/EmergencySOS';
import DoctorDashboard from './pages/DoctorDashboard/DoctorDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <HashRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'white',
            color: '#111827',
            border: '1px solid rgba(108,99,255,0.15)',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            fontFamily: "'Inter', sans-serif",
          },
        }}
      />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Mental Health */}
          <Route path="dashboard"    element={<Dashboard />} />
          <Route path="mood"         element={<MoodTracker />} />
          <Route path="stress"       element={<StressAnalysis />} />
          <Route path="journal"      element={<Journal />} />
          <Route path="meditation"   element={<Meditation />} />
          <Route path="sleep"        element={<SleepTracker />} />
          <Route path="reports"      element={<Reports />} />
          <Route path="community"    element={<Community />} />
          <Route path="settings"     element={<Settings />} />

          {/* Healthcare */}
          <Route path="appointments" element={<Appointments />} />
          <Route path="doctors"      element={<DoctorRecommend />} />
          <Route path="hospitals"    element={<HospitalFinder />} />
          <Route path="emergency"    element={<EmergencySOS />} />
          <Route path="doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="admin"        element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
