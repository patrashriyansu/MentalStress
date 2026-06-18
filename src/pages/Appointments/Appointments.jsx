import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DOCTORS } from '../../data/mockData';
import { Calendar, Clock, ChevronLeft, ChevronRight, Check, Video, MapPin, CreditCard, Shield, Plus, AlertCircle, Phone, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHealthStore } from '../../store';
import toast from 'react-hot-toast';

const TIMES = ['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function CalendarPicker({ selected, onSelect }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1);

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => { if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); }}
          className="btn btn-icon w-8 h-8"><ChevronLeft className="w-4 h-4"/></button>
        <p className="text-sm font-bold text-slate-700">{MONTHS[month]} {year}</p>
        <button onClick={() => { if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); }}
          className="btn btn-icon w-8 h-8"><ChevronRight className="w-4 h-4"/></button>
      </div>
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d=>(
          <div key={d} className="text-center text-xs font-bold py-1" style={{color:'#94a3b8'}}>{d}</div>
        ))}
      </div>
      {/* Cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d,i) => {
          if(!d) return <div key={i}/>;
          const date = new Date(year,month,d);
          const isPast = date < new Date(today.getFullYear(),today.getMonth(),today.getDate());
          const sel = selected && selected.getDate()===d && selected.getMonth()===month && selected.getFullYear()===year;
          const isToday = d===today.getDate() && month===today.getMonth() && year===today.getFullYear();
          return (
            <button key={i} disabled={isPast} onClick={() => onSelect(date)}
              className="h-9 w-full rounded-xl text-xs font-semibold transition-all"
              style={{
                background: sel ? 'linear-gradient(135deg,#6c63ff,#8b5cf6)' : isToday ? '#f5f3ff' : 'transparent',
                color: sel ? 'white' : isPast ? '#e2e8f0' : isToday ? '#6c63ff' : '#374151',
                cursor: isPast ? 'not-allowed' : 'pointer',
                fontWeight: isToday || sel ? 700 : 500,
              }}>
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Appointments() {
  const [bookingMode, setBookingMode] = useState(false); // false = dashboard, true = booking wizard
  const [step, setStep] = useState(1); // 1=doctor, 2=datetime, 3=confirm
  const [selDoc, setSelDoc] = useState(null);
  const [selDate, setSelDate] = useState(null);
  const [selTime, setSelTime] = useState(null);
  const [apptType, setApptType] = useState('clinic');
  const [booked, setBooked] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { appointments, addAppointment, cancelAppointment, addNotification } = useHealthStore();

  useEffect(() => {
    if (location.state?.doctor) {
      setSelDoc(location.state.doctor);
      setStep(2);
      setBookingMode(true);
    }
  }, [location.state]);

  const confirmBook = async () => {
    const newAppt = {
      id: Date.now(),
      doctorName: selDoc.name,
      doctor: selDoc.name,
      specialty: selDoc.specialty,
      hospitalName: selDoc.hospital,
      date: selDate?.toDateString() || '',
      time: selTime || '',
      type: apptType,
      fee: selDoc.fee,
      createdAt: new Date().toISOString()
    };
    
    addAppointment(newAppt);
    addNotification({ title: 'Appointment Confirmed!', message: `${selDoc.name} on ${selDate?.toDateString()} at ${selTime}`, type: 'appointment' });
    setBooked(true);
  };

  const handleCancel = (id, docName) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      cancelAppointment(id);
      addNotification({ title: 'Appointment Cancelled', message: `Consultation with ${docName} was cancelled.`, type: 'appointment' });
      toast.success("Appointment cancelled successfully.");
    }
  };

  // Successful booking result screen
  if (booked) return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:200 }}
        className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
        style={{ background:'linear-gradient(135deg,#d1fae5,#a7f3d0)' }}>
        ✅
      </motion.div>
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-800" style={{ fontFamily:"'Poppins',sans-serif" }}>Appointment Confirmed!</h2>
        <p className="text-slate-500 mt-2">Your appointment with <span className="font-bold text-blue-600">{selDoc?.name}</span> is booked</p>
        <p className="text-sm mt-1 font-semibold text-slate-600">{selDate?.toDateString()} • {selTime}</p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => { setBooked(false); setStep(1); setSelDoc(null); setSelDate(null); setSelTime(null); setBookingMode(false); }}
          className="btn btn-secondary">Go to Appointments</button>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Back to Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-5" style={{ fontFamily:"'Inter',sans-serif" }}>
      
      {/* Dynamic Header */}
      {!bookingMode ? (
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="section-title flex items-center gap-2"><Calendar className="w-6 h-6 text-purple-500" />Appointments Dashboard</h1>
            <p className="section-subtitle">Manage your booked specialist consultations</p>
          </div>
          <button onClick={() => { setStep(1); setSelDoc(null); setSelDate(null); setSelTime(null); setBookingMode(true); }}
            className="btn btn-primary flex items-center gap-2" style={{ padding: '10px 18px' }}>
            <Plus className="w-4 h-4" /> Book New Appointment
          </button>
        </div>
      ) : (
        <div>
          <h1 className="section-title flex items-center gap-2"><Calendar className="w-6 h-6 text-blue-500" />Book Consultation Slot</h1>
          <p className="section-subtitle">Schedule a consultation with top specialists</p>
        </div>
      )}

      {/* ─── DASHBOARD MODE: SHOW BOOKED APPOINTMENTS ─── */}
      {!bookingMode && (
        <div style={{ marginTop: 24 }}>
          {appointments.length === 0 ? (
            <div className="card text-center" style={{ padding: '64px 24px', borderRadius: 24 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>📅</div>
              <h3 className="text-lg font-bold text-slate-800" style={{ fontFamily: "'Poppins', sans-serif" }}>No Scheduled Appointments</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto mt-2 mb-6">
                You haven't booked any medical consultations yet. Click the button below to schedule a session with our specialists.
              </p>
              <button onClick={() => { setStep(1); setSelDoc(null); setSelDate(null); setSelTime(null); setBookingMode(true); }}
                className="btn btn-primary" style={{ display: 'inline-flex', alignSelf: 'center' }}>
                Book Appointment Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((appt) => (
                <motion.div key={appt.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="card p-5 relative flex flex-col justify-between gap-4" style={{ borderRadius: 20 }}>
                  
                  {/* Cancel Button */}
                  <button onClick={() => handleCancel(appt.id, appt.doctorName)}
                    className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex gap-3 items-start">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      🩺
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base leading-tight">{appt.doctorName}</h4>
                      <p className="text-xs font-semibold text-purple-600 mt-1">{appt.specialty}</p>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {appt.hospitalName}
                      </p>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-card)', paddingTop: 12 }} className="flex justify-between items-center text-xs flex-wrap gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-400 font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-purple-500" /> {appt.date}
                      </span>
                      <span className="text-slate-600 font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-purple-500" /> {appt.time}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`badge ${appt.type === 'video' ? 'badge-blue' : 'badge-green'}`}>
                        {appt.type === 'video' ? '📹 Video Consult' : '🏥 Clinic Visit'}
                      </span>
                      <span className="font-bold text-slate-800">Fee: ₹{appt.fee}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── WIZARD MODE: BOOKING WORKFLOW ─── */}
      {bookingMode && (
        <>
          {/* Step indicator */}
          <div className="card p-4 flex items-center gap-0" style={{ borderRadius: 16 }}>
            {['Select Doctor','Choose Date & Time','Confirm Booking'].map((s,i) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: step>i+1 ? 'linear-gradient(135deg,#10b981,#059669)' : step===i+1 ? 'linear-gradient(135deg,#6c63ff,#8b5cf6)' : '#e8edf8', color: step>=i+1 ? 'white' : '#94a3b8' }}>
                    {step>i+1 ? <Check className="w-4 h-4"/> : i+1}
                  </div>
                  <span className="text-xs font-semibold hidden sm:block" style={{ color: step===i+1 ? '#6c63ff' : step>i+1 ? '#059669' : '#94a3b8' }}>{s}</span>
                </div>
                {i<2 && <div className="w-8 h-0.5 flex-shrink-0 mx-1" style={{ background: step>i+1 ? '#10b981' : '#e8edf8' }}/>}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Doctor Selection */}
          {step===1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DOCTORS.map((d,i) => (
                <motion.div key={d.id} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
                  onClick={() => { setSelDoc(d); setStep(2); }}
                  className={`card p-4 cursor-pointer transition-all ${selDoc?.id===d.id ? 'ring-2 ring-purple-500' : ''}`}
                  style={{ borderRadius:16 }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background:'#f5f3ff' }}>
                      {i%2===0?'👩‍⚕️':'👨‍⚕️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{d.name}</p>
                      <p className="text-xs font-semibold text-purple-600">{d.specialty}</p>
                      <p className="text-xs truncate" style={{ color:'#94a3b8' }}>{d.hospital}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      ⭐ <span className="font-bold text-slate-700">{d.rating || '4.7'}</span>
                      <span style={{ color:'#94a3b8' }}>• {d.experience || '8'}y exp</span>
                    </div>
                    <span className="font-bold text-purple-600">₹{d.fee}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step===2 && selDoc && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Selected Doctor details */}
              <div className="lg:col-span-2 space-y-4">
                <div className="card p-4" style={{ borderRadius:20 }}>
                  <p className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color:'#94a3b8' }}>Consulting</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background:'#f5f3ff' }}>
                      {DOCTORS.indexOf(selDoc)%2===0?'👩‍⚕️':'👨‍⚕️'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{selDoc.name}</p>
                      <p className="text-sm font-semibold text-purple-600">{selDoc.specialty}</p>
                      <p className="text-xs" style={{ color:'#94a3b8' }}>{selDoc.hospital}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ background:'#f8faff' }}>
                    <span className="text-sm text-slate-600">Consultation Fee</span>
                    <span className="text-lg font-black text-purple-600">₹{selDoc.fee}</span>
                  </div>
                </div>

                {/* Appointment Type */}
                <div className="card p-4" style={{ borderRadius:20 }}>
                  <p className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color:'#94a3b8' }}>Appointment Type</p>
                  {[
                    { id:'clinic', icon:'🏥', label:'Clinic Visit', sub:'In-person consultation' },
                    { id:'video', icon:'📹', label:'Video Consultation', sub:'Online consultation' },
                  ].map(t => (
                    <button key={t.id} onClick={() => setApptType(t.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl mb-2 border-2 transition-all"
                      style={{ borderColor: apptType===t.id ? '#6c63ff' : 'transparent', background: apptType===t.id ? '#f5f3ff' : '#f8faff' }}>
                      <span className="text-xl">{t.icon}</span>
                      <div className="text-left">
                        <p className="text-sm font-semibold" style={{ color: apptType===t.id ? '#6c63ff' : '#374151' }}>{t.label}</p>
                        <p className="text-xs" style={{ color:'#94a3b8' }}>{t.sub}</p>
                      </div>
                      {apptType===t.id && <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center" style={{ background:'#6c63ff' }}><Check className="w-3 h-3 text-white"/></div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar + Times */}
              <div className="lg:col-span-3 space-y-4">
                <div className="card p-5" style={{ borderRadius:20 }}>
                  <CalendarPicker selected={selDate} onSelect={setSelDate} />
                </div>

                {selDate && (
                  <div className="card p-5" style={{ borderRadius:20 }}>
                    <p className="text-sm font-bold text-slate-700 mb-3">Available Time Slots</p>
                    <div className="grid grid-cols-3 gap-2">
                      {TIMES.map(t => (
                        <button key={t} onClick={() => setSelTime(t)}
                          className="py-2.5 rounded-xl text-xs font-semibold transition-all border"
                          style={{ background: selTime===t ? 'linear-gradient(135deg,#6c63ff,#8b5cf6)' : 'white', color: selTime===t ? 'white' : '#374151', borderColor: selTime===t ? 'transparent' : '#e8edf8', boxShadow: selTime===t ? '0 4px 12px rgba(108,99,255,0.2)' : 'none' }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => { if(location.state?.doctor) setBookingMode(false); else setStep(1); }} className="btn btn-secondary flex-1">← Cancel</button>
                  <button onClick={() => setStep(3)} disabled={!selDate||!selTime} className="btn btn-primary flex-1">
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step===3 && selDoc && selDate && selTime && (
            <div className="max-w-lg mx-auto space-y-4">
              <div className="card p-6" style={{ borderRadius:24 }}>
                <h3 className="text-lg font-black text-slate-800 mb-5" style={{ fontFamily:"'Poppins',sans-serif" }}>Confirm Booking Details</h3>
                {[
                  { label:'Doctor', value:selDoc.name },
                  { label:'Speciality', value:selDoc.specialty },
                  { label:'Hospital', value:selDoc.hospital },
                  { label:'Date', value:selDate.toDateString() },
                  { label:'Time', value:selTime },
                  { label:'Type', value:apptType==='clinic' ? '🏥 Clinic Visit' : '📹 Video Consultation' },
                  { label:'Fee', value:`₹${selDoc.fee}` },
                ].map(r => (
                  <div key={r.label} className="flex justify-between items-center py-2.5 border-b" style={{ borderColor:'rgba(108,99,255,0.06)' }}>
                    <span className="text-sm font-medium" style={{ color:'#64748b' }}>{r.label}</span>
                    <span className="text-sm font-bold text-slate-800">{r.value}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 mt-4 p-3 rounded-xl" style={{ background:'#f0fdf4' }}>
                  <Shield className="w-4 h-4" style={{ color:'#10b981' }} />
                  <span className="text-xs font-semibold" style={{ color:'#059669' }}>100% Secure & Confidential</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn btn-secondary flex-1">← Edit</button>
                <button onClick={confirmBook} className="btn btn-primary flex-1">
                  <CreditCard className="w-4 h-4" /> Confirm & Book
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
