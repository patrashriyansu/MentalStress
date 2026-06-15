import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HOSPITALS } from '../../data/mockData';
import { Search, MapPin, Phone, Star, Navigation, Filter, Ambulance, Shield, Clock } from 'lucide-react';

const FILTERS = ['All','24x7 Emergency','ICU Available','Government','Private'];

function SVGMap({ hospitals, selected, onSelect }) {
  const pins = [
    { x:'28%', y:'42%' }, { x:'58%', y:'32%' }, { x:'72%', y:'58%' },
    { x:'38%', y:'66%' }, { x:'62%', y:'22%' },
  ];
  return (
    <div className="relative w-full h-72 overflow-hidden" style={{ borderRadius:20, background:'linear-gradient(135deg,#e8f5e9 0%,#e3f2fd 50%,#f3e5f5 100%)' }}>
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity:0.15 }}>
        {[...Array(10)].map((_,i)=>(
          <React.Fragment key={i}>
            <line x1="0" y1={`${i*11.1}%`} x2="100%" y2={`${i*11.1}%`} stroke="#2563eb" strokeWidth="1"/>
            <line x1={`${i*11.1}%`} y1="0" x2={`${i*11.1}%`} y2="100%" stroke="#2563eb" strokeWidth="1"/>
          </React.Fragment>
        ))}
      </svg>
      {/* Roads */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity:0.25 }}>
        <path d="M 0,52% L 100%,52%" stroke="#94a3b8" strokeWidth="2.5" fill="none"/>
        <path d="M 50%,0 L 50%,100%" stroke="#94a3b8" strokeWidth="2.5" fill="none"/>
        <path d="M 15%,25% Q 50%,45% 85%,22%" stroke="#94a3b8" strokeWidth="1.5" fill="none"/>
        <path d="M 0,75% Q 40%,65% 100%,80%" stroke="#94a3b8" strokeWidth="1.5" fill="none"/>
      </svg>
      {/* Hospital pins */}
      {hospitals.slice(0,5).map((h,i) => (
        <motion.div key={h.id} className="absolute cursor-pointer" style={{ left:pins[i]?.x, top:pins[i]?.y, transform:'translate(-50%,-100%)', zIndex:10 }}
          whileHover={{ scale:1.2 }} initial={{ scale:0, y:-10 }} animate={{ scale:1, y:0 }} transition={{ delay:i*0.1 }}
          onClick={() => onSelect(h.id===selected ? null : h.id)}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full shadow-lg border-3 flex items-center justify-center text-lg transition-all ${selected===h.id ? 'border-blue-600 scale-110' : 'border-white'}`}
              style={{ background: selected===h.id ? 'linear-gradient(135deg,#2563eb,#06b6d4)' : '#ef4444', borderWidth:3 }}>
              🏥
            </div>
            <div className="w-2 h-2 mt-0.5 rounded-full" style={{ background: selected===h.id ? '#2563eb' : '#ef4444' }}/>
            {selected===h.id && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-lg px-2 py-1 shadow-lg text-xs font-bold text-blue-700 whitespace-nowrap">
                {h.name}
              </div>
            )}
          </div>
        </motion.div>
      ))}
      {/* User */}
      <div className="absolute" style={{ left:'50%', top:'52%', transform:'translate(-50%,-50%)', zIndex:20 }}>
        <div className="relative w-6 h-6">
          <div className="absolute inset-0 rounded-full animate-ping" style={{ background:'rgba(37,99,235,0.3)' }}/>
          <div className="relative w-6 h-6 rounded-full border-3 border-white shadow-lg flex items-center justify-center text-xs" style={{ background:'linear-gradient(135deg,#2563eb,#06b6d4)', borderWidth:3 }}>📍</div>
        </div>
      </div>
      {/* Legend */}
      <div className="absolute top-3 left-3 glass-panel px-3 py-2 flex items-center gap-2" style={{ borderRadius:12 }}>
        <MapPin className="w-3.5 h-3.5" style={{ color:'#2563eb' }}/>
        <span className="text-xs font-semibold text-slate-600">New Delhi, India</span>
      </div>
      <div className="absolute bottom-3 right-3 glass-panel px-3 py-2" style={{ borderRadius:12 }}>
        <p className="text-xs font-bold" style={{ color:'#2563eb' }}>{hospitals.length} hospitals nearby</p>
      </div>
    </div>
  );
}

export default function HospitalFinder() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = HOSPITALS.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'All' || (filter==='24x7 Emergency' && h.emergency) || (filter==='ICU Available' && h.icu))
  );

  return (
    <div className="space-y-5" style={{ fontFamily:"'Inter',sans-serif" }}>
      <div>
        <h1 className="section-title flex items-center gap-2">
          <Building2 className="w-6 h-6" style={{ color:'#2563eb' }}/> Hospital Locator
        </h1>
        <p className="section-subtitle">Find the best hospitals and emergency services near you</p>
      </div>

      {/* Map */}
      <SVGMap hospitals={HOSPITALS} selected={selected} onSelect={setSelected} />

      {/* Search + Filters */}
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#94a3b8' }}/>
          <input className="input-field pl-10" placeholder="Search hospitals..." value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3.5 py-2 rounded-full text-xs font-semibold transition-all"
              style={{ background: filter===f ? 'linear-gradient(135deg,#2563eb,#06b6d4)' : 'white', color: filter===f ? 'white' : '#64748b', border: filter===f ? 'none' : '1.5px solid #e8edf8', boxShadow: filter===f ? '0 4px 12px rgba(37,99,235,0.3)' : 'none' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((h,i) => (
          <motion.div key={h.id} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
            onClick={() => setSelected(h.id===selected ? null : h.id)}
            className={`card p-5 cursor-pointer transition-all ${selected===h.id ? 'ring-2 shadow-lg' : ''}`}
            style={{ borderRadius:20, ringColor:'#2563eb', boxShadow: selected===h.id ? '0 8px 32px rgba(37,99,235,0.15)' : undefined }}>
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background:'linear-gradient(135deg,#dbeafe,#e0f2fe)' }}>🏥</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-slate-800">{h.name}</h3>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400"/>
                    <span className="text-xs font-bold text-slate-700">{h.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color:'#94a3b8' }}>
                  <MapPin className="w-3 h-3"/> {h.address} · <span className="font-semibold" style={{ color:'#2563eb' }}>{h.distance} km away</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {h.emergency && <span className="badge badge-red text-xs">🚨 24/7 Emergency</span>}
                  {h.icu && <span className="badge badge-blue text-xs">🏥 ICU Available</span>}
                  {h.ambulance && <span className="badge badge-cyan text-xs">🚑 Ambulance</span>}
                  <span className="badge badge-green text-xs">✅ Open Now</span>
                </div>

                <div className="text-xs mb-3" style={{ color:'#64748b' }}>
                  <span className="font-semibold text-slate-600">Beds available: </span>{h.beds}
                </div>

                <div className="flex gap-2">
                  <button className="btn btn-primary text-xs py-2 px-3 flex items-center gap-1" style={{ borderRadius:10 }}>
                    <Navigation className="w-3.5 h-3.5"/> Navigate
                  </button>
                  <button className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1" style={{ borderRadius:10 }}>
                    <Phone className="w-3.5 h-3.5"/> Call
                  </button>
                  <button className="btn btn-secondary text-xs py-2 px-3" style={{ borderRadius:10 }}>Book OPD</button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Emergency Bar */}
      <div className="card p-5 flex items-center gap-4" style={{ borderRadius:20, background:'linear-gradient(135deg,#fff1f2,#fee2e2)', border:'1px solid #fecaca' }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background:'#ef4444' }}>🚑</div>
        <div className="flex-1">
          <p className="font-bold text-slate-800">Need Emergency Ambulance?</p>
          <p className="text-sm" style={{ color:'#64748b' }}>Connect immediately with the nearest ambulance service</p>
        </div>
        <a href="tel:102" className="btn btn-danger flex items-center gap-2 flex-shrink-0" style={{ borderRadius:12 }}>
          <Phone className="w-4 h-4"/> Call 102
        </a>
      </div>
    </div>
  );
}
