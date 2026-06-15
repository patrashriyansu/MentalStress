import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, FileText, Users, Clock, User, Phone, Mail, Stethoscope } from 'lucide-react';
import { useAuthStore } from '../../store';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  waiting:     { bg: '#fef9c3', text: '#a16207', label: 'Waiting' },
  'in-progress':{ bg: '#dbeafe', text: '#1d4ed8', label: 'In Progress' },
  completed:   { bg: '#dcfce7', text: '#15803d', label: 'Completed' },
};

export default function DoctorDashboard() {
  const { user, getPatients } = useAuthStore();
  const navigate  = useNavigate();
  const [tab, setTab] = useState('overview');

  // Get all registered patients
  const patients = getPatients();

  // Doctor info
  const doctorName = user?.name || 'Doctor';
  const initials   = doctorName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const stats = [
    { label: 'Total Patients',  value: patients.length, icon: '👥', color: '#eff6ff', iconColor: '#2563eb' },
    { label: 'Today\'s Slots',  value: 8, icon: '📅', color: '#f0fdf4', iconColor: '#16a34a' },
    { label: 'Completed Today', value: 3, icon: '✅', color: '#ecfdf5', iconColor: '#059669' },
    { label: 'Pending Consults',value: 5, icon: '⏳', color: '#fffbeb', iconColor: '#d97706' },
  ];

  const tabs = [
    { id: 'overview',     label: 'Overview',     icon: Activity },
    { id: 'patients',     label: 'My Patients',  icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'prescriptions',label: 'Prescriptions',icon: FileText },
  ];

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }} className="space-y-6">

      {/* ── Header ── */}
      <div className="card p-6" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 60%, #06b6d4 100%)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: 'white', backdropFilter: 'blur(10px)', flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Doctor Portal</p>
            <h1 style={{ color: 'white', fontSize: 22, fontWeight: 900, margin: '2px 0 4px', fontFamily: "'Poppins', sans-serif" }}>
              Welcome, {doctorName}
            </h1>
            <div style={{ display: 'flex', gap: 16 }}>
              {user?.email && <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}><Mail style={{ width: 12, height: 12 }} />{user.email}</span>}
              {user?.phone && <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}><Phone style={{ width: 12, height: 12 }} />{user.phone}</span>}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '8px 16px', backdropFilter: 'blur(10px)' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Status</p>
              <p style={{ color: 'white', fontSize: 14, fontWeight: 800 }}>🟢 Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card" style={{ padding: '18px 20px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 10 }}>
              {s.icon}
            </div>
            <p style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: '0 0 2px', fontFamily: "'Poppins', sans-serif" }}>{s.value}</p>
            <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Tab Nav ── */}
      <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 4, borderRadius: 14, width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 18px', borderRadius: 10, border: 'none',
              background: tab === t.id ? 'white' : 'transparent',
              color: tab === t.id ? '#2563eb' : '#64748b',
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
              boxShadow: tab === t.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s',
            }}>
            <t.icon style={{ width: 14, height: 14 }} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}

      {tab === 'overview' && (
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Stethoscope style={{ width: 18, height: 18, color: '#2563eb' }} />
            Quick Actions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Write Prescription', icon: '📋', action: () => navigate('/prescription'), color: '#eff6ff' },
              { label: 'Video Consultation', icon: '📹', action: () => navigate('/video-consult'), color: '#f0fdf4' },
              { label: 'View Analytics',     icon: '📊', action: () => navigate('/analytics'),    color: '#faf5ff' },
            ].map(a => (
              <button key={a.label} onClick={a.action}
                style={{ padding: '16px', borderRadius: 14, border: '1.5px solid #e8edf8', background: a.color, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{a.icon}</div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{a.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'patients' && (
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users style={{ width: 18, height: 18, color: '#7c3aed' }} />
            Registered Patients ({patients.length})
          </h3>
          {patients.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#334155', marginBottom: 6 }}>No patients yet</p>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Patients will appear here once they register on the platform.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {patients.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ padding: '16px', borderRadius: 14, border: '1.5px solid #e8edf8', background: '#f8faff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #2563eb, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 14 }}>
                      {p.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 13 }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: '#64748b' }}>Patient</p>
                    </div>
                  </div>
                  {p.email && <p style={{ fontSize: 11, color: '#64748b', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Mail style={{ width: 11, height: 11 }} />{p.email}</p>}
                  {p.phone && <p style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}><Phone style={{ width: 11, height: 11 }} />{p.phone}</p>}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'appointments' && (
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar style={{ width: 18, height: 18, color: '#2563eb' }} />
            Today's Schedule
          </h3>
          {patients.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#334155', marginBottom: 6 }}>No appointments today</p>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Appointments will appear once patients book consultations.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {patients.slice(0, 5).map((p, i) => {
                const times = ['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '4:30 PM'];
                const statuses = ['waiting', 'in-progress', 'completed', 'waiting', 'waiting'];
                const status = statuses[i] || 'waiting';
                const sc = STATUS_COLORS[status];
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, border: '1.5px solid #e8edf8', background: 'white' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #2563eb20, #06b6d420)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontWeight: 900, flexShrink: 0 }}>
                      {p.name?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 13 }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: '#64748b' }}>Consultation</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: 12 }}><Clock style={{ width: 13, height: 13 }} />{times[i]}</div>
                    <span style={{ padding: '4px 10px', borderRadius: 8, background: sc.bg, color: sc.text, fontSize: 11, fontWeight: 700 }}>{sc.label}</span>
                    <button onClick={() => navigate('/video-consult')} style={{ padding: '6px 12px', borderRadius: 8, background: '#eff6ff', color: '#2563eb', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>📹 Consult</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'prescriptions' && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText style={{ width: 18, height: 18, color: '#7c3aed' }} />
              Prescriptions
            </h3>
            <button onClick={() => navigate('/prescription')} className="btn btn-primary" style={{ fontSize: 12, padding: '8px 16px', borderRadius: 10 }}>
              + New Prescription
            </button>
          </div>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>Create and manage digital prescriptions for your patients.</p>
          <button onClick={() => navigate('/prescription')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, border: '1.5px solid #e8edf8', background: '#f8faff', cursor: 'pointer', fontWeight: 700, color: '#2563eb', fontSize: 13 }}>
            <FileText style={{ width: 16, height: 16 }} /> Open Prescriptions Manager
          </button>
        </div>
      )}

    </div>
  );
}
