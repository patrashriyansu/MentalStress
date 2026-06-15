import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store';

import Layout from './components/Layout/Layout';
import AuthPage from './pages/Auth/AuthPage';
import Dashboard from './pages/Dashboard/Dashboard';
import SymptomChecker from './pages/SymptomChecker/SymptomChecker';
import DiseasePredict from './pages/DiseasePredict/DiseasePredict';
import ImageAnalysis from './pages/ImageAnalysis/ImageAnalysis';
import Chatbot from './pages/Chatbot/Chatbot';
import HospitalFinder from './pages/HospitalFinder/HospitalFinder';
import PharmacyFinder from './pages/PharmacyFinder/PharmacyFinder';
import DoctorRecommend from './pages/Doctors/DoctorRecommend';
import Appointments from './pages/Appointments/Appointments';
import VideoConsult from './pages/VideoConsult/VideoConsult';
import EmergencySOS from './pages/EmergencySOS/EmergencySOS';
import AmbulanceTrack from './pages/Ambulance/AmbulanceTrack';
import Medicines from './pages/Medicines/Medicines';
import Prescription from './pages/Prescription/Prescription';
import Analytics from './pages/Analytics/Analytics';
import IoTMonitor from './pages/IoTMonitor/IoTMonitor';
import MedicalHistory from './pages/History/MedicalHistory';
import HealthScore from './pages/HealthScore/HealthScore';
import Notifications from './pages/Notifications/Notifications';
import AdminDashboard from './pages/Admin/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard/DoctorDashboard';

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
          style: { background: '#0d1529', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
        }}
      />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="health-score" element={<HealthScore />} />
          <Route path="symptom-checker" element={<SymptomChecker />} />
          <Route path="disease-predict" element={<DiseasePredict />} />
          <Route path="image-analysis" element={<ImageAnalysis />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="hospital-finder" element={<HospitalFinder />} />
          <Route path="pharmacy-finder" element={<PharmacyFinder />} />
          <Route path="doctors" element={<DoctorRecommend />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="video-consult" element={<VideoConsult />} />
          <Route path="emergency" element={<EmergencySOS />} />
          <Route path="ambulance" element={<AmbulanceTrack />} />
          <Route path="medicines" element={<Medicines />} />
          <Route path="prescription" element={<Prescription />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="iot-monitor" element={<IoTMonitor />} />
          <Route path="history" element={<MedicalHistory />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="doctor-dashboard" element={<DoctorDashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
}
