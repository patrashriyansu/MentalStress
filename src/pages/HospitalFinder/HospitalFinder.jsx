import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HOSPITALS } from '../../data/mockData';
import { Search, MapPin, Phone, Star, Navigation, Ambulance, Shield, Clock, Loader } from 'lucide-react';

const FILTERS = ['All', '24x7 Emergency', 'ICU Available', 'Ambulance'];

function SVGMap({ hospitals, selected, onSelect, locationName }) {
  const pins = [
    { x: '28%', y: '42%' }, { x: '58%', y: '32%' }, { x: '72%', y: '58%' },
    { x: '38%', y: '66%' }, { x: '62%', y: '22%' },
  ];
  return (
    <div style={{ position: 'relative', width: '100%', height: 260, overflow: 'hidden', borderRadius: 16, background: 'linear-gradient(135deg, #e8f5e9, #e3f2fd, #f3e5f5)' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }}>
        {[...Array(10)].map((_, i) => (
          <React.Fragment key={i}>
            <line x1="0" y1={`${i * 11.1}%`} x2="100%" y2={`${i * 11.1}%`} stroke="#6c63ff" strokeWidth="1" />
            <line x1={`${i * 11.1}%`} y1="0" x2={`${i * 11.1}%`} y2="100%" stroke="#6c63ff" strokeWidth="1" />
          </React.Fragment>
        ))}
      </svg>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.2 }}>
        <path d="M 0,52% L 100%,52%" stroke="#94a3b8" strokeWidth="2.5" fill="none" />
        <path d="M 50%,0 L 50%,100%" stroke="#94a3b8" strokeWidth="2.5" fill="none" />
        <path d="M 15%,25% Q 50%,45% 85%,22%" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
        <path d="M 0,75% Q 40%,65% 100%,80%" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
      </svg>

      {hospitals.slice(0, 5).map((h, i) => (
        <motion.div key={h.id} style={{ position: 'absolute', left: pins[i]?.x, top: pins[i]?.y, transform: 'translate(-50%,-100%)', zIndex: 10, cursor: 'pointer' }}
          whileHover={{ scale: 1.2 }} initial={{ scale: 0, y: -10 }} animate={{ scale: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          onClick={() => onSelect(h.id === selected ? null : h.id)}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${selected === h.id ? '#6c63ff' : 'white'}`, background: selected === h.id ? 'linear-gradient(135deg, #6c63ff, #8b5cf6)' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              🏥
            </div>
            <div style={{ width: 6, height: 6, marginTop: 2, borderRadius: '50%', background: selected === h.id ? '#6c63ff' : '#ef4444' }} />
            {selected === h.id && (
              <div style={{ position: 'absolute', top: -32, left: '50%', transform: 'translateX(-50%)', background: 'white', borderRadius: 8, padding: '4px 10px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontSize: 11, fontWeight: 700, color: '#6c63ff', whiteSpace: 'nowrap' }}>
                {h.name}
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {/* User location dot */}
      <div style={{ position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%,-50%)', zIndex: 20 }}>
        <div style={{ position: 'relative', width: 24, height: 24 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(108,99,255,0.3)', animation: 'ping 1.5s infinite' }} />
          <div style={{ width: 24, height: 24, borderRadius: '50%', border: '3px solid white', background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, boxShadow: '0 2px 8px rgba(108,99,255,0.4)' }}>📍</div>
        </div>
      </div>

      {/* Location label */}
      <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderRadius: 10, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <MapPin style={{ width: 12, height: 12, color: '#6c63ff' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>{locationName || 'Locating...'}</span>
      </div>
    </div>
  );
}

export default function HospitalFinder() {
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('All');
  const [selected, setSelected] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError]   = useState('');

  // Get real geolocation on mount
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported');
      setLocationName('Location unavailable');
      return;
    }
    setLocLoading(true);
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setLocLoading(false);
        // Reverse geocode using a free API
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.county || 'Your Location';
          const state = data.address?.state || '';
          setLocationName(`${city}${state ? ', ' + state : ''}`);
        } catch {
          setLocationName(`${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E`);
        }
      },
      (err) => {
        setLocLoading(false);
        setLocError('Location permission denied');
        setLocationName('New Delhi, India');
      },
      { timeout: 10000 }
    );
  };

  const filtered = HOSPITALS.filter(h => {
    const ms = h.name.toLowerCase().includes(search.toLowerCase()) || h.address.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'All' ||
      (filter === '24x7 Emergency' && h.emergency) ||
      (filter === 'ICU Available' && h.icu) ||
      (filter === 'Ambulance' && h.ambulance);
    return ms && mf;
  });

  const selectedHospital = HOSPITALS.find(h => h.id === selected);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">Nearby Hospitals 🏥</h1>
        <p className="section-subtitle">
          {locLoading
            ? '📍 Detecting your location...'
            : locError
              ? `⚠️ ${locError} — showing sample hospitals`
              : `📍 Showing hospitals near ${locationName}`
          }
        </p>
      </div>

      {/* Location Bar */}
      <div className="card" style={{ padding: '12px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200 }}>
          {locLoading
            ? <Loader style={{ width: 16, height: 16, color: '#6c63ff', animation: 'spin 1s linear infinite' }} />
            : <MapPin style={{ width: 16, height: 16, color: '#6c63ff' }} />
          }
          <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{locationName || 'Getting location...'}</span>
        </div>
        <button onClick={getLocation} className="btn btn-secondary" style={{ fontSize: 12, padding: '7px 14px' }}>
          <Navigation style={{ width: 13, height: 13 }} /> Use My Location
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <div className="search-bar" style={{ maxWidth: 'none', flex: 1 }}>
            <Search style={{ width: 14, height: 14, color: 'var(--text-400)' }} />
            <input placeholder="Search hospitals..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '6px 14px', borderRadius: 20, border: '1.5px solid', borderColor: filter === f ? '#6c63ff' : '#e5e7eb', background: filter === f ? 'var(--purple-50)' : 'white', color: filter === f ? '#6c63ff' : '#6b7280', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Hospital List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((h, i) => (
            <motion.div key={h.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="card card-lift" onClick={() => setSelected(h.id === selected ? null : h.id)}
              style={{ padding: '16px 20px', cursor: 'pointer', borderColor: selected === h.id ? '#6c63ff30' : 'var(--border-card)', background: selected === h.id ? 'var(--purple-50)' : 'var(--surface-1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--text-900)', fontSize: 14 }}>{h.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-500)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin style={{ width: 11, height: 11 }} /> {h.address}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#fef3c7', padding: '3px 8px', borderRadius: 8 }}>
                  <Star style={{ width: 11, height: 11, fill: '#f59e0b', color: '#f59e0b' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#92400e' }}>{h.rating}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {h.emergency && <span className="badge badge-red">🚨 Emergency</span>}
                {h.icu && <span className="badge badge-blue">🏥 ICU</span>}
                {h.ambulance && <span className="badge badge-green">🚑 Ambulance</span>}
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-400)' }}>{h.distance} km</span>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state card" style={{ padding: 40 }}>
              <p style={{ fontSize: 32 }}>🏥</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#334155', marginTop: 12 }}>No hospitals found</p>
              <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>Try adjusting your filters or search.</p>
            </div>
          )}
        </div>

        {/* Map + Details */}
        <div>
          <SVGMap hospitals={filtered} selected={selected} onSelect={setSelected} locationName={locationName} />

          {selectedHospital && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 20, marginTop: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-900)', marginBottom: 12 }}>{selectedHospital.name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                {[
                  { label: 'Distance', value: `${selectedHospital.distance} km` },
                  { label: 'Rating', value: `⭐ ${selectedHospital.rating}` },
                  { label: 'Available Beds', value: selectedHospital.beds || 'N/A' },
                  { label: 'Status', value: selectedHospital.open ? '🟢 Open' : '🔴 Closed' },
                ].map(d => (
                  <div key={d.label} style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border-card)' }}>
                    <p style={{ fontSize: 10, color: 'var(--text-400)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{d.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-900)' }}>{d.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => window.open(`tel:108`)} className="btn btn-primary" style={{ flex: 1, fontSize: 12 }}>
                  <Phone style={{ width: 13, height: 13 }} /> Call Now
                </button>
                <button onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(selectedHospital.name)}`,'_blank')} className="btn btn-secondary" style={{ flex: 1, fontSize: 12 }}>
                  <Navigation style={{ width: 13, height: 13 }} /> Directions
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Specialties list */}
      {filtered.length > 0 && (
        <div className="card" style={{ padding: 20, marginTop: 20 }}>
          <p className="section-title" style={{ fontSize: 14, marginBottom: 14 }}>🩺 Hospital Specialties</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[...new Set(filtered.flatMap(h => h.specialties || []))].map(s => (
              <span key={s} className="badge badge-purple">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
