import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DOCTORS } from '../../data/mockData';
import { Star, MapPin, Search, Filter, Heart, Clock, ChevronRight, Verified } from 'lucide-react';

const SPECS = ['All Doctors','Cardiologist','Neurologist','Dermatologist','Orthopedic','Diabetologist','Psychiatrist'];
const AVAIL = ['All','Available Today','Available Tomorrow','This Week'];
const LOCS  = ['All Locations','Delhi','Mumbai','Bangalore'];

const avatarColors = [
  ['#dbeafe','#2563eb'],['#d1fae5','#059669'],['#ede9fe','#7c3aed'],
  ['#fef3c7','#d97706'],['#fee2e2','#dc2626'],['#cffafe','#0e7490'],
  ['#f0fdf4','#16a34a'],['#fdf4ff','#9333ea'],
];

export default function DoctorFinder() {
  const [search, setSearch] = useState('');
  const [spec, setSpec] = useState('All Doctors');
  const [avail, setAvail] = useState('All');
  const [loc, setLoc] = useState('All Locations');
  const [liked, setLiked] = useState([]);
  const [view, setView] = useState('grid');
  const navigate = useNavigate();

  const filtered = DOCTORS.filter(d => {
    const ms = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
    const msp = spec === 'All Doctors' || d.specialty.toLowerCase().includes(spec.toLowerCase().replace('ist',''));
    return ms && msp;
  });

  return (
    <div className="space-y-5" style={{ fontFamily:"'Inter',sans-serif" }}>
      {/* Header */}
      <div>
        <h1 className="section-title">Find Doctors</h1>
        <p className="section-subtitle">Connect with India's best specialists near you</p>
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
            style={{ background: spec===s ? 'linear-gradient(135deg,#2563eb,#06b6d4)' : 'white', color: spec===s ? 'white' : '#64748b', border: spec===s ? 'none' : '1.5px solid #e8edf8', boxShadow: spec===s ? '0 4px 12px rgba(37,99,235,0.3)' : 'none' }}>
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
                    <Verified className="w-3.5 h-3.5 flex-shrink-0" style={{ color:'#2563eb' }} />
                  </div>
                  <p className="text-xs font-semibold" style={{ color:'#2563eb' }}>{d.specialty}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color:'#94a3b8' }}>{d.hospital}</p>
                </div>
              </div>

              {/* Rating row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-slate-700">{d.rating}</span>
                  <span className="text-xs" style={{ color:'#94a3b8' }}>({d.experience*38} reviews)</span>
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
    </div>
  );
}
