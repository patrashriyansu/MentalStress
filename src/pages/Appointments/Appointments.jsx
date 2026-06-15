import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DOCTORS } from '../../data/mockData';
import { Calendar, Clock, ChevronLeft, ChevronRight, Check, Video, MapPin, CreditCard, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHealthStore } from '../../store';

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
                background: sel ? 'linear-gradient(135deg,#2563eb,#06b6d4)' : isToday ? '#eff6ff' : 'transparent',
                color: sel ? 'white' : isPast ? '#e2e8f0' : isToday ? '#2563eb' : '#374151',
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
  const [step, setStep] = useState(1); // 1=doctor, 2=datetime, 3=confirm
  const [selDoc, setSelDoc] = useState(null);
  const [selDate, setSelDate] = useState(null);
  const [selTime, setSelTime] = useState(null);
  const [apptType, setApptType] = useState('clinic');
  const [booked, setBooked] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { addNotification } = useHealthStore();

  React.useEffect(() => {
    if(location.state?.doctor) { setSelDoc(location.state.doctor); setStep(2); }
  }, []);

  const confirmBook = async () => {
    setBooked(true);
    addNotification({ title:'Appointment Confirmed!', message:`${selDoc.name} on ${selDate?.toDateString()} at ${selTime}`, type:'appointment' });
  };

  if(booked) return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-6">
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
        <button onClick={() => { setBooked(false); setStep(1); setSelDoc(null); setSelDate(null); setSelTime(null); }}
          className="btn btn-secondary">Book Another</button>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Back to Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-5" style={{ fontFamily:"'Inter',sans-serif" }}>
      <div>
        <h1 className="section-title flex items-center gap-2"><Calendar className="w-6 h-6" style={{ color:'#2563eb' }}/>Book Appointment</h1>
        <p className="section-subtitle">Schedule a consultation with top doctors</p>
      </div>

      {/* Step indicator */}
      <div className="card p-4 flex items-center gap-0">
        {['Select Doctor','Choose Date & Time','Confirm Booking'].map((s,i) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: step>i+1 ? 'linear-gradient(135deg,#10b981,#059669)' : step===i+1 ? 'linear-gradient(135deg,#2563eb,#06b6d4)' : '#e8edf8', color: step>=i+1 ? 'white' : '#94a3b8' }}>
                {step>i+1 ? <Check className="w-4 h-4"/> : i+1}
              </div>
              <span className="text-xs font-semibold hidden sm:block" style={{ color: step===i+1 ? '#2563eb' : step>i+1 ? '#059669' : '#94a3b8' }}>{s}</span>
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
              className={`card p-4 cursor-pointer transition-all ${selDoc?.id===d.id ? 'ring-2 ring-blue-500' : ''}`}
              style={{ borderRadius:16 }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background:'#dbeafe' }}>
                  {i%2===0?'👩‍⚕️':'👨‍⚕️'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{d.name}</p>
                  <p className="text-xs font-semibold" style={{ color:'#2563eb' }}>{d.specialty}</p>
                  <p className="text-xs truncate" style={{ color:'#94a3b8' }}>{d.hospital}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  ⭐ <span className="font-bold text-slate-700">{d.rating}</span>
                  <span style={{ color:'#94a3b8' }}>• {d.experience}y</span>
                </div>
                <span className="font-bold" style={{ color:'#2563eb' }}>₹{d.fee}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step===2 && selDoc && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Selected Doctor */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-4" style={{ borderRadius:20 }}>
              <p className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color:'#94a3b8' }}>Consulting</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background:'#dbeafe' }}>
                  {DOCTORS.indexOf(selDoc)%2===0?'👩‍⚕️':'👨‍⚕️'}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{selDoc.name}</p>
                  <p className="text-sm font-semibold" style={{ color:'#2563eb' }}>{selDoc.specialty}</p>
                  <p className="text-xs" style={{ color:'#94a3b8' }}>{selDoc.hospital}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background:'#f8faff' }}>
                <span className="text-sm text-slate-600">Consultation Fee</span>
                <span className="text-lg font-black" style={{ color:'#2563eb' }}>₹{selDoc.fee}</span>
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
                  style={{ borderColor: apptType===t.id ? '#2563eb' : 'transparent', background: apptType===t.id ? '#eff6ff' : '#f8faff' }}>
                  <span className="text-xl">{t.icon}</span>
                  <div className="text-left">
                    <p className="text-sm font-semibold" style={{ color: apptType===t.id ? '#2563eb' : '#374151' }}>{t.label}</p>
                    <p className="text-xs" style={{ color:'#94a3b8' }}>{t.sub}</p>
                  </div>
                  {apptType===t.id && <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center" style={{ background:'#2563eb' }}><Check className="w-3 h-3 text-white"/></div>}
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
                      style={{ background: selTime===t ? 'linear-gradient(135deg,#2563eb,#06b6d4)' : 'white', color: selTime===t ? 'white' : '#374151', borderColor: selTime===t ? 'transparent' : '#e8edf8', boxShadow: selTime===t ? '0 4px 12px rgba(37,99,235,0.3)' : 'none' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn btn-secondary flex-1">← Back</button>
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
            <h3 className="text-lg font-black text-slate-800 mb-5" style={{ fontFamily:"'Poppins',sans-serif" }}>Confirm Booking</h3>
            {[
              { label:'Doctor', value:selDoc.name },
              { label:'Speciality', value:selDoc.specialty },
              { label:'Hospital', value:selDoc.hospital },
              { label:'Date', value:selDate.toDateString() },
              { label:'Time', value:selTime },
              { label:'Type', value:apptType==='clinic' ? '🏥 Clinic Visit' : '📹 Video Consultation' },
              { label:'Fee', value:`₹${selDoc.fee}` },
            ].map(r => (
              <div key={r.label} className="flex justify-between items-center py-2.5 border-b" style={{ borderColor:'rgba(37,99,235,0.06)' }}>
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
              <CreditCard className="w-4 h-4" /> Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
