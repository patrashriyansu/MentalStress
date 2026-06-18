import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { Star, MapPin, Search, Filter, Heart, Clock, ChevronRight, Verified } from 'lucide-react';
import toast from 'react-hot-toast';

const SPECS = ['All Doctors','Cardiologist','Neurologist','Dermatologist','Orthopedic','Diabetologist','Psychiatrist','General Physician'];
const AVAIL = ['All','Available Today','Available Tomorrow','This Week'];
const LOCS  = ['All Locations','Delhi','Mumbai','Bangalore'];

const avatarColors = [
  ['#dbeafe','#2563eb'],['#d1fae5','#059669'],['#ede9fe','#7c3aed'],
  ['#fef3c7','#d97706'],['#fee2e2','#dc2626'],['#cffafe','#0e7490'],
  ['#f0fdf4','#16a34a'],['#fdf4ff','#9333ea'],
];

export default function DoctorFinder() {
  const { user, getDoctors, registerUser, updateUser } = useAuthStore();
  const [search, setSearch] = useState('');
  const [spec, setSpec] = useState('All Doctors');
  const [avail, setAvail] = useState('All');
  const [loc, setLoc] = useState('All Locations');
  const [liked, setLiked] = useState([]);
  const navigate = useNavigate();

  // Management Modal states
  const [showManageModal, setShowManageModal] = useState(false);
  const [manageTab, setManageTab] = useState('edit'); // 'edit' | 'add'

  // Edit My Profile form states
  const [specialty, setSpecialty] = useState(user?.specialty || 'General Physician');
  const [hospital, setHospital] = useState(user?.hospital || 'MediVision Clinic');
  const [experience, setExperience] = useState(user?.experience || 5);
  const [fee, setFee] = useState(user?.fee || 500);
  const [nextAvailable, setNextAvailable] = useState(user?.nextAvailable || 'Today 3:00 PM');

  // Add Doctor form states
  const [addForm, setAddForm] = useState({
    name: '',
    specialty: 'General Physician',
    hospital: 'MediVision Clinic',
    experience: 5,
    fee: 500,
    nextAvailable: 'Today 3:00 PM',
    email: '',
    phone: '',
  });

  // Source doctors from registered users in the store
  const DOCTORS = getDoctors().map((d, i) => ({
    id: d.id,
    name: d.name,
    specialty: d.specialty || 'General Physician',
    hospital: d.hospital || 'MediVision Clinic',
    rating: d.rating || 4.7,
    experience: d.experience || 5,
    fee: d.fee || 500,
    available: true,
    image: null,
    nextAvailable: d.nextAvailable || 'Today',
    email: d.email,
    phone: d.phone,
  }));

  const filtered = DOCTORS.filter(d => {
    const ms = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
    const msp = spec === 'All Doctors' || d.specialty.toLowerCase().includes(spec.toLowerCase().replace('ist',''));
    return ms && msp;
  });

  return (
    <div className="space-y-5" style={{ fontFamily:"'Inter',sans-serif" }}>
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="section-title">Find Doctors</h1>
          <p className="section-subtitle">Connect with India's best specialists near you</p>
        </div>
        {user?.role === 'doctor' && (
          <button onClick={() => {
            // Seed edit form values from user store values on open
            setSpecialty(user?.specialty || 'General Physician');
            setHospital(user?.hospital || 'MediVision Clinic');
            setExperience(user?.experience || 5);
            setFee(user?.fee || 500);
            setNextAvailable(user?.nextAvailable || 'Today 3:00 PM');
            setShowManageModal(true);
          }} className="btn btn-primary" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 6 }}>
            🩺 Manage Specialist Listing
          </button>
        )}
      </div>

      {/* Search bar */}
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#94a3b8' }} />
          <input className="input-field pl-10" placeholder="Search doctors, specialities..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select value={spec} onChange={e => setSpec(e.target.value)}
          className="input-field" style={{ width:'auto', paddingLeft:12, paddingRight:12, cursor:'pointer' }}>
          {SPECS.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={loc} onChange={e => setLoc(e.target.value)}
          className="input-field" style={{ width:'auto', paddingLeft:12, paddingRight:12, cursor:'pointer' }}>
          {LOCS.map(l => <option key={l}>{l}</option>)}
        </select>
        <select value={avail} onChange={e => setAvail(e.target.value)}
          className="input-field" style={{ width:'auto', paddingLeft:12, paddingRight:12, cursor:'pointer' }}>
          {AVAIL.map(a => <option key={a}>{a}</option>)}
        </select>
        <button className="btn btn-primary flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Specialty chips */}
      <div className="flex gap-2 flex-wrap">
        {SPECS.map(s => (
          <button key={s} onClick={() => setSpec(s)}
            className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
            style={{ background: spec===s ? 'linear-gradient(135deg,#6c63ff,#8b5cf6)' : 'white', color: spec===s ? '#6c63ff' : '#64748b', border: spec===s ? 'none' : '1.5px solid #e8edf8', boxShadow: spec===s ? '0 4px 12px rgba(108,99,255,0.15)' : 'none' }}>
            {s}
          </button>
        ))}
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color:'#64748b' }}>Showing <span className="font-bold text-slate-700">{filtered.length}</span> doctors</p>
        <p className="text-xs" style={{ color:'#94a3b8' }}>Sorted by: Relevance</p>
      </div>

      {/* Doctor Grid */}
      {filtered.length === 0 ? (
        <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>👨‍⚕️</div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#334155', marginBottom: 8 }}>No Doctors Found</h3>
          <p style={{ fontSize: 14, color: '#94a3b8', maxWidth: 360, margin: '0 auto' }}>
            {DOCTORS.length === 0
              ? 'No doctors have joined the platform yet. Doctors can register using the Sign Up page with the "Doctor" role.'
              : 'No doctors match your current search filters. Try adjusting your search.'}
          </p>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((d, i) => {
          const [bgA, textA] = avatarColors[i % avatarColors.length];
          const isAvailToday = i % 3 !== 2;
          const isLiked = liked.includes(d.id);
          return (
            <motion.div key={d.id} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
              className="card doctor-card p-5 relative flex flex-col gap-3" style={{ borderRadius:20 }}>

              {/* Wishlist */}
              <button onClick={() => setLiked(l => isLiked ? l.filter(x=>x!==d.id) : [...l,d.id])}
                className="absolute top-4 right-4 p-1.5 rounded-xl transition-all hover:bg-red-50"
                style={{ background: isLiked ? '#fee2e2' : 'transparent' }}>
                <Heart className="w-4 h-4" style={{ color: isLiked ? '#ef4444' : '#cbd5e1', fill: isLiked ? '#ef4444' : 'none' }} />
              </button>

              {/* Avatar */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-md"
                  style={{ background:bgA }}>
                  {i%2===0 ? '👩‍⚕️' : '👨‍⚕️'}
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-slate-800 truncate">{d.name}</p>
                    <Verified className="w-3.5 h-3.5 flex-shrink-0" style={{ color:'#6c63ff' }} />
                  </div>
                  <p className="text-xs font-semibold" style={{ color:'#6c63ff' }}>{d.specialty}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color:'#94a3b8' }}>{d.hospital}</p>
                </div>
              </div>

              {/* Rating row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-slate-700">{d.rating}</span>
                  <span className="text-xs" style={{ color:'#94a3b8' }}>({(d.experience || 5)*38} reviews)</span>
                </div>
                <span className="text-xs font-bold" style={{ color:'#64748b' }}>{d.experience} yrs exp</span>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`badge text-xs flex items-center gap-1 ${isAvailToday ? 'badge-green' : 'badge-yellow'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isAvailToday ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {isAvailToday ? 'Available Today' : 'Available Tomorrow'}
                </span>
                <span className="badge badge-blue text-xs">₹{d.fee} fee</span>
              </div>

              {/* Next slot */}
              <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl" style={{ background:'#f8faff' }}>
                <Clock className="w-3.5 h-3.5" style={{ color:'#8b5cf6' }} />
                <span style={{ color:'#64748b' }}>Next: </span>
                <span className="font-semibold" style={{ color:'#1e293b' }}>{d.nextAvailable}</span>
              </div>

              {/* CTA */}
              <button onClick={() => navigate('/appointments', { state:{ doctor:d } })}
                className="btn btn-primary w-full text-xs py-2.5 justify-center" style={{ borderRadius:12 }}>
                Book Appointment
              </button>
            </motion.div>
          );
        })}
      </div>
      )}

      {/* Doctor Management Modal */}
      <AnimatePresence>
        {showManageModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', padding: 16 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="card" style={{ width: '100%', maxWidth: 480, padding: 28, borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border-card)', background: 'var(--surface-1)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-900)', margin: 0 }}>🩺 Manage Registry</h3>
                <button onClick={() => setShowManageModal(false)}
                  style={{ border: 'none', background: 'var(--surface-2)', cursor: 'pointer', width: 28, height: 28, borderRadius: '50%', color: 'var(--text-400)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              </div>
              
              {/* Modal Tabs */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 20, borderBottom: '1px solid var(--border-card)', paddingBottom: 10 }}>
                <button onClick={() => setManageTab('edit')}
                  style={{ flex: 1, padding: '8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: manageTab === 'edit' ? '#6c63ff' : 'var(--text-400)', borderBottom: manageTab === 'edit' ? '3px solid #6c63ff' : '3px solid transparent', transition: 'all 0.2s' }}>
                  Update My Profile
                </button>
                <button onClick={() => setManageTab('add')}
                  style={{ flex: 1, padding: '8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: manageTab === 'add' ? '#6c63ff' : 'var(--text-400)', borderBottom: manageTab === 'add' ? '3px solid #6c63ff' : '3px solid transparent', transition: 'all 0.2s' }}>
                  Add Another Doctor
                </button>
              </div>
              
              {manageTab === 'edit' ? (
                // Edit Profile Form
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 4 }}>My Specialty</label>
                    <select className="input-field" value={specialty} onChange={e => setSpecialty(e.target.value)}>
                      {SPECS.filter(s => s !== 'All Doctors').map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 4 }}>Practice Hospital / Clinic</label>
                    <input className="input-field" placeholder="e.g. Apollo Hospital" value={hospital} onChange={e => setHospital(e.target.value)} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 4 }}>Experience (Years)</label>
                      <input className="input-field" type="number" min="0" value={experience} onChange={e => setExperience(parseInt(e.target.value) || 0)} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 4 }}>Consultation Fee (₹)</label>
                      <input className="input-field" type="number" min="0" value={fee} onChange={e => setFee(parseInt(e.target.value) || 0)} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 4 }}>Next Availability Slot</label>
                    <input className="input-field" placeholder="e.g. Today 4:00 PM, Tomorrow 10:00 AM" value={nextAvailable} onChange={e => setNextAvailable(e.target.value)} />
                  </div>
                  
                  <button onClick={() => {
                    updateUser({ specialty, hospital, experience, fee, nextAvailable });
                    toast.success('My specialist listing details updated successfully!');
                    setShowManageModal(false);
                  }} className="btn btn-primary" style={{ marginTop: 10, padding: 12, justifyContent: 'center', display: 'flex' }}>
                    Save Profile Details
                  </button>
                </div>
              ) : (
                // Add Doctor Form
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 360, overflowY: 'auto', paddingRight: 4 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 4 }}>Doctor's Name</label>
                    <input className="input-field" placeholder="Dr. First Last" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 4 }}>Specialty</label>
                    <select className="input-field" value={addForm.specialty} onChange={e => setAddForm(f => ({ ...f, specialty: e.target.value }))}>
                      {SPECS.filter(s => s !== 'All Doctors').map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 4 }}>Hospital / Clinic</label>
                    <input className="input-field" placeholder="e.g. AIIMS Delhi" value={addForm.hospital} onChange={e => setAddForm(f => ({ ...f, hospital: e.target.value }))} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 4 }}>Experience (Years)</label>
                      <input className="input-field" type="number" min="0" value={addForm.experience} onChange={e => setAddForm(f => ({ ...f, experience: parseInt(e.target.value) || 0 }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 4 }}>Consultation Fee (₹)</label>
                      <input className="input-field" type="number" min="0" value={addForm.fee} onChange={e => setAddForm(f => ({ ...f, fee: parseInt(e.target.value) || 0 }))} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 4 }}>Next Availability Slot</label>
                    <input className="input-field" placeholder="e.g. Today 5:00 PM" value={addForm.nextAvailable} onChange={e => setAddForm(f => ({ ...f, nextAvailable: e.target.value }))} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 4 }}>Email (Optional)</label>
                      <input className="input-field" type="email" placeholder="email@domain.com" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-500)', display: 'block', marginBottom: 4 }}>Phone (Optional)</label>
                      <input className="input-field" placeholder="Phone" value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                  </div>
                  
                  <button onClick={() => {
                    if (!addForm.name.trim()) {
                      toast.error("Please enter doctor's name");
                      return;
                    }
                    const newDoc = {
                      id: Date.now(),
                      name: addForm.name.trim(),
                      email: addForm.email.toLowerCase().trim() || `doc-${Date.now()}@medi.com`,
                      phone: addForm.phone.trim(),
                      password: 'doctor-temp-pass',
                      role: 'doctor',
                      specialty: addForm.specialty,
                      hospital: addForm.hospital,
                      experience: addForm.experience,
                      fee: addForm.fee,
                      nextAvailable: addForm.nextAvailable,
                      rating: 4.8,
                      createdAt: new Date().toISOString()
                    };
                    registerUser(newDoc);
                    toast.success(`Registered new doctor: ${addForm.name}!`);
                    setAddForm({ name: '', specialty: 'General Physician', hospital: 'MediVision Clinic', experience: 5, fee: 500, nextAvailable: 'Today 3:00 PM', email: '', phone: '' });
                    setShowManageModal(false);
                  }} className="btn btn-primary" style={{ marginTop: 10, padding: 12, justifyContent: 'center', display: 'flex' }}>
                    Add Doctor Profile
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
