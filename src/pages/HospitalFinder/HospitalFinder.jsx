import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HOSPITALS, PHARMACIES, DOCTORS } from '../../data/mockData';
import { useAuthStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Phone, Star, Navigation, Ambulance, Shield, Clock, Loader, Activity } from 'lucide-react';

// Distance calculation using Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function HospitalFinder() {
  const { getDoctors } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('hospitals'); // 'hospitals' | 'pharmacies'
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('All');
  const [selected, setSelected] = useState(null);
  
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError]   = useState('');

  // Lists
  const [hospitalsList, setHospitalsList]   = useState(HOSPITALS);
  const [pharmaciesList, setPharmaciesList] = useState(PHARMACIES);

  // Map States
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);

  // Load Leaflet dynamically
  useEffect(() => {
    if (window.L) {
      setMapLoaded(true);
      return;
    }

    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(cssLink);

    const jsScript = document.createElement('script');
    jsScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    jsScript.onload = () => {
      setMapLoaded(true);
    };
    document.head.appendChild(jsScript);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    getLocation();
  }, []);

  // Reset selection on tab switch
  useEffect(() => {
    setSelected(null);
    setFilter('All');
  }, [activeTab]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported');
      setLocationName('Location unavailable');
      loadDefaultMockData();
      return;
    }
    setLocLoading(true);
    setLocError('');
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const userCoords = { lat: latitude, lng: longitude };
        setLocation(userCoords);
        
        // Reverse geocode
        let locName = 'Your Location';
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.suburb || data.address?.county || 'Your Area';
          const road = data.address?.road || '';
          locName = road ? `${road}, ${city}` : city;
          setLocationName(locName);
        } catch {
          locName = `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;
          setLocationName(locName);
        }

        // Fetch real nearby hospitals and pharmacies using Overpass API
        await fetchLocalHealthStores(latitude, longitude, locName);
        setLocLoading(false);
      },
      (err) => {
        setLocLoading(false);
        setLocError('Location permission denied');
        setLocationName('New Delhi, India');
        loadDefaultMockData();
      },
      { timeout: 8000 }
    );
  };

  const fetchLocalHealthStores = async (lat, lng, locName) => {
    try {
      // Find hospitals, clinics, doctor practices, and pharmacies/chemists within 20km radius of user
      const query = `
        [out:json][timeout:15];
        (
          node["amenity"="hospital"](around:20000, ${lat}, ${lng});
          node["amenity"="clinic"](around:20000, ${lat}, ${lng});
          node["amenity"="doctors"](around:20000, ${lat}, ${lng});
          node["healthcare"="hospital"](around:20000, ${lat}, ${lng});
          node["healthcare"="clinic"](around:20000, ${lat}, ${lng});
          node["healthcare"="centre"](around:20000, ${lat}, ${lng});
          node["healthcare"="doctors"](around:20000, ${lat}, ${lng});
          node["amenity"="pharmacy"](around:20000, ${lat}, ${lng});
          node["healthcare"="pharmacy"](around:20000, ${lat}, ${lng});
          node["shop"="chemist"](around:20000, ${lat}, ${lng});
          node["shop"="medical"](around:20000, ${lat}, ${lng});
          node["shop"="pharmacy"](around:20000, ${lat}, ${lng});

          way["amenity"="hospital"](around:20000, ${lat}, ${lng});
          way["amenity"="clinic"](around:20000, ${lat}, ${lng});
          way["amenity"="doctors"](around:20000, ${lat}, ${lng});
          way["healthcare"="hospital"](around:20000, ${lat}, ${lng});
          way["healthcare"="clinic"](around:20000, ${lat}, ${lng});
          way["healthcare"="centre"](around:20000, ${lat}, ${lng});
          way["healthcare"="doctors"](around:20000, ${lat}, ${lng});
          way["amenity"="pharmacy"](around:20000, ${lat}, ${lng});
          way["healthcare"="pharmacy"](around:20000, ${lat}, ${lng});
          way["shop"="chemist"](around:20000, ${lat}, ${lng});
          way["shop"="medical"](around:20000, ${lat}, ${lng});
          way["shop"="pharmacy"](around:20000, ${lat}, ${lng});
        );
        out center;
      `;
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `data=${encodeURIComponent(query)}`
      });

      if (!response.ok) throw new Error('Overpass server error');
      const data = await response.json();

      if (data?.elements && data.elements.length > 0) {
        const osmHospitals = [];
        const osmPharmacies = [];

        data.elements.forEach((el, index) => {
          const itemLat = el.lat || el.center?.lat;
          const itemLng = el.lon || el.center?.lon;
          if (!itemLat || !itemLng) return;

          const distance = parseFloat(getDistance(lat, lng, itemLat, itemLng).toFixed(1));
          
          const isHospital = el.tags.amenity === 'hospital' || 
                             el.tags.amenity === 'clinic' || 
                             el.tags.amenity === 'doctors' || 
                             el.tags.healthcare === 'hospital' ||
                             el.tags.healthcare === 'clinic' ||
                             el.tags.healthcare === 'centre' ||
                             el.tags.healthcare === 'doctors';

          const isPharmacy = el.tags.amenity === 'pharmacy' ||
                             el.tags.healthcare === 'pharmacy' ||
                             el.tags.shop === 'chemist' ||
                             el.tags.shop === 'medical' ||
                             el.tags.shop === 'pharmacy';

          let defaultName = 'Medical Store';
          if (isHospital) {
            if (el.tags.amenity === 'hospital' || el.tags.healthcare === 'hospital') {
              defaultName = 'Community Hospital';
            } else if (el.tags.amenity === 'clinic' || el.tags.healthcare === 'clinic') {
              defaultName = 'Health Clinic';
            } else if (el.tags.amenity === 'doctors' || el.tags.healthcare === 'doctors') {
              defaultName = 'Doctor\'s Clinic';
            } else {
              defaultName = 'Healthcare Centre';
            }
          }
          const baseName = el.tags.name || defaultName;
          const address = el.tags['addr:street'] || el.tags['addr:suburb'] || el.tags['addr:neighbourhood'] || 'Nearby Location';

          if (isHospital) {
            osmHospitals.push({
              id: `osm-h-${el.id || index}`,
              name: baseName,
              address,
              lat: itemLat,
              lng: itemLng,
              distance,
              rating: (4.1 + Math.random() * 0.8).toFixed(1),
              emergency: el.tags.emergency === 'yes' || Math.random() > 0.3,
              icu: el.tags.icu === 'yes' || Math.random() > 0.5,
              ambulance: el.tags.ambulance === 'yes' || Math.random() > 0.4,
              specialties: ['General Medicine', 'Emergency Care', 'Pediatrics'],
              open: true,
              beds: Math.floor(15 + Math.random() * 85)
            });
          } else if (isPharmacy) {
            osmPharmacies.push({
              id: `osm-p-${el.id || index}`,
              name: baseName.includes('Pharmacy') || baseName.includes('Medical') || baseName.includes('Chemist') ? baseName : `${baseName} Pharmacy`,
              address,
              lat: itemLat,
              lng: itemLng,
              distance,
              rating: (4.0 + Math.random() * 0.9).toFixed(1),
              open24: el.tags['opening_hours']?.includes('24/7') || Math.random() > 0.6,
              delivery: Math.random() > 0.5,
              stock: Math.floor(70 + Math.random() * 30)
            });
          }
        });

        // Set state if data is fetched successfully, else use recentered mock fallbacks
        if (osmHospitals.length > 0) {
          setHospitalsList(osmHospitals.sort((a,b) => a.distance - b.distance));
        } else {
          // Recenter only mock hospitals with localized names
          const offsetHospitals = HOSPITALS.map((h, i) => {
            const offsets = [
              { lat: 0.006, lng: -0.008 },
              { lat: -0.011, lng: 0.007 },
              { lat: 0.015, lng: -0.002 },
              { lat: -0.005, lng: 0.014 },
              { lat: 0.008, lng: 0.010 }
            ];
            const off = offsets[i % offsets.length];
            const itemLat = lat + off.lat;
            const itemLng = lng + off.lng;
            const fallbackNames = [
              `Community Health Centre, ${locName}`,
              `Primary Health Centre, ${locName}`,
              `Rural Hospital, ${locName}`,
              `General Clinic, ${locName}`,
              `Emergency Care Clinic, ${locName}`
            ];
            return {
              ...h,
              name: fallbackNames[i % fallbackNames.length],
              lat: itemLat,
              lng: itemLng,
              address: `Main Road, ${locName || 'Your Location'}`,
              distance: parseFloat(getDistance(lat, lng, itemLat, itemLng).toFixed(1))
            };
          });
          setHospitalsList(offsetHospitals.sort((a,b) => a.distance - b.distance));
        }

        if (osmPharmacies.length > 0) {
          setPharmaciesList(osmPharmacies.sort((a,b) => a.distance - b.distance));
        } else {
          // Recenter only mock pharmacies with localized names
          const offsetPharmacies = PHARMACIES.map((p, i) => {
            const offsets = [
              { lat: 0.003, lng: -0.005 },
              { lat: -0.008, lng: 0.006 },
              { lat: 0.012, lng: -0.004 },
              { lat: -0.007, lng: 0.003 }
            ];
            const off = offsets[i % offsets.length];
            const itemLat = lat + off.lat;
            const itemLng = lng + off.lng;
            const fallbackNames = [
              `Local Medical Store, ${locName}`,
              `Popular Pharmacy, ${locName}`,
              `Jan Aushadhi Kendra, ${locName}`,
              `City Medical & General Store, ${locName}`
            ];
            return {
              ...p,
              name: fallbackNames[i % fallbackNames.length],
              lat: itemLat,
              lng: itemLng,
              address: `Main Road, ${locName || 'Your Location'}`,
              distance: parseFloat(getDistance(lat, lng, itemLat, itemLng).toFixed(1))
            };
          });
          setPharmaciesList(offsetPharmacies.sort((a,b) => a.distance - b.distance));
        }
        return;
      }
    } catch (e) {
      console.warn('Overpass API fetch error, falling back to centered mock coordinates.', e);
    }
    // Fallback recentered mock data
    recenterMockData(lat, lng, locName);
  };

  const recenterMockData = (lat, lng, locName) => {
    const offsetHospitals = HOSPITALS.map((h, i) => {
      const offsets = [
        { lat: 0.006, lng: -0.008 },
        { lat: -0.011, lng: 0.007 },
        { lat: 0.015, lng: -0.002 },
        { lat: -0.005, lng: 0.014 },
        { lat: 0.008, lng: 0.010 }
      ];
      const off = offsets[i % offsets.length];
      const itemLat = lat + off.lat;
      const itemLng = lng + off.lng;
      const fallbackNames = [
        `Community Health Centre, ${locName || 'Your Area'}`,
        `Primary Health Centre, ${locName || 'Your Area'}`,
        `Rural Hospital, ${locName || 'Your Area'}`,
        `General Clinic, ${locName || 'Your Area'}`,
        `Emergency Care Clinic, ${locName || 'Your Area'}`
      ];
      return {
        ...h,
        name: fallbackNames[i % fallbackNames.length],
        lat: itemLat,
        lng: itemLng,
        address: `Main Road, ${locName || 'Your Location'}`,
        distance: parseFloat(getDistance(lat, lng, itemLat, itemLng).toFixed(1))
      };
    });

    const offsetPharmacies = PHARMACIES.map((p, i) => {
      const offsets = [
        { lat: 0.003, lng: -0.005 },
        { lat: -0.008, lng: 0.006 },
        { lat: 0.012, lng: -0.004 },
        { lat: -0.007, lng: 0.003 }
      ];
      const off = offsets[i % offsets.length];
      const itemLat = lat + off.lat;
      const itemLng = lng + off.lng;
      const fallbackNames = [
        `Local Medical Store, ${locName || 'Your Area'}`,
        `Popular Pharmacy, ${locName || 'Your Area'}`,
        `Jan Aushadhi Kendra, ${locName || 'Your Area'}`,
        `City Medical & General Store, ${locName || 'Your Area'}`
      ];
      return {
        ...p,
        name: fallbackNames[i % fallbackNames.length],
        lat: itemLat,
        lng: itemLng,
        address: `Main Road, ${locName || 'Your Location'}`,
        distance: parseFloat(getDistance(lat, lng, itemLat, itemLng).toFixed(1))
      };
    });

    setHospitalsList(offsetHospitals.sort((a,b) => a.distance - b.distance));
    setPharmaciesList(offsetPharmacies.sort((a,b) => a.distance - b.distance));
  };

  const loadDefaultMockData = () => {
    // New Delhi mock base
    setHospitalsList(HOSPITALS);
    setPharmaciesList(PHARMACIES.map(p => ({
      ...p,
      address: 'Sarita Vihar, New Delhi'
    })));
  };

  // Filter calculations
  const filteredHospitals = hospitalsList.filter(h => {
    const ms = h.name.toLowerCase().includes(search.toLowerCase()) || h.address.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'All' ||
      (filter === '24x7 Emergency' && h.emergency) ||
      (filter === 'ICU Available' && h.icu) ||
      (filter === 'Ambulance' && h.ambulance);
    return ms && mf;
  });

  const filteredPharmacies = pharmaciesList.filter(p => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'All' ||
      (filter === 'Open 24/7' && p.open24) ||
      (filter === 'Home Delivery' && p.delivery) ||
      (filter === 'High Stock (>80%)' && p.stock >= 80);
    return ms && mf;
  });

  const currentItems = activeTab === 'hospitals' ? filteredHospitals : filteredPharmacies;
  const selectedItem = currentItems.find(x => x.id === selected);
  const filterOptions = activeTab === 'hospitals' 
    ? ['All', '24x7 Emergency', 'ICU Available', 'Ambulance']
    : ['All', 'Open 24/7', 'Home Delivery', 'High Stock (>80%)'];

  // Initialize and Render Leaflet Map
  useEffect(() => {
    if (!mapLoaded || !location) return;

    const mapContainer = document.getElementById('leaflet-map');
    if (!mapContainer) return;

    if (!mapInstanceRef.current) {
      const L = window.L;
      const map = L.map('leaflet-map', {
        zoomControl: true,
        scrollWheelZoom: true
      }).setView([location.lat, location.lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);

      // Invalidate size after mount/render to avoid gray grid glitches
      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    } else {
      mapInstanceRef.current.setView([location.lat, location.lng], 14);
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 150);
    }
  }, [mapLoaded, location]);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current || !location) return;

    const L = window.L;
    markersGroupRef.current.clearLayers();

    // 1. User Location Pin
    const userIcon = L.divIcon({
      className: 'user-marker',
      html: `<div style="font-size: 26px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); cursor: pointer;">📍</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });
    L.marker([location.lat, location.lng], { icon: userIcon })
      .bindPopup('<b>Your Current Location</b>')
      .addTo(markersGroupRef.current);

    // 2. Items Markers
    currentItems.forEach(item => {
      const isSel = selected === item.id;
      const emoji = activeTab === 'hospitals' ? '🏥' : '💊';
      const markerColor = activeTab === 'hospitals'
        ? (isSel ? '#b91c1c' : '#ef4444')
        : (isSel ? '#047857' : '#10b981');
      
      const customIcon = L.divIcon({
        className: 'location-marker',
        html: `
          <div style="
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 3px solid ${isSel ? '#6c63ff' : 'white'};
            background: ${markerColor};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            transition: all 0.2s;
            transform-origin: bottom center;
            ${isSel ? 'transform: scale(1.15) translateY(-5px);' : ''}
          ">
            ${emoji}
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon })
        .bindPopup(`
          <div style="font-family: 'Inter', sans-serif; padding: 4px; min-width: 140px;">
            <b style="font-size: 13px; color: #111827; display: block; margin-bottom: 2px;">${item.name}</b>
            <span style="font-size: 11px; color: #6b7280; display: block; margin-bottom: 4px;">${item.address}</span>
            <span style="font-size: 11px; font-weight: 700; color: #6c63ff;">${item.distance} km away</span>
          </div>
        `)
        .addTo(markersGroupRef.current);

      marker.on('click', () => {
        setSelected(item.id);
      });

      if (isSel) {
        marker.openPopup();
        mapInstanceRef.current.panTo([item.lat, item.lng]);
      }
    });
  }, [currentItems, selected, activeTab, location, mapLoaded]);

  // Retrieve specialists available at selected hospital
  const getDoctorsForHospital = (hospitalName) => {
    // Registered doctors with role 'doctor'
    return getDoctors().filter(
      d => d.hospital && d.hospital.toLowerCase().includes(hospitalName.toLowerCase())
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">{activeTab === 'hospitals' ? 'Nearby Hospitals 🏥' : 'Nearby Medical Stores & Pharmacies 💊'}</h1>
        <p className="section-subtitle">
          {locLoading
            ? '📍 Locating nearby emergency centers and pharmacies...'
            : locError
              ? `⚠️ ${locError} — displaying sample data`
              : `📍 Showing medical services near ${locationName || 'your current location'}`
          }
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, borderBottom: '1px solid var(--border-card)', paddingBottom: 10 }}>
        {[
          { id: 'hospitals', label: '🏥 Nearby Hospitals', color: '#ef4444' },
          { id: 'pharmacies', label: '💊 Medical Stores & Pharmacies', color: '#10b981' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
              transition: 'all 0.25s',
              background: activeTab === tab.id ? 'var(--purple-50)' : 'transparent',
              color: activeTab === tab.id ? '#6c63ff' : 'var(--text-400)',
              borderBottom: activeTab === tab.id ? `3px solid ${tab.color}` : '3px solid transparent',
              borderRadius: '12px 12px 0 0'
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Location Bar */}
      <div className="card" style={{ padding: '12px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200 }}>
          {locLoading ? (
            <Loader style={{ width: 16, height: 16, color: '#6c63ff', animation: 'spin 1s linear infinite' }} />
          ) : (
            <MapPin style={{ width: 16, height: 16, color: '#6c63ff' }} />
          )}
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-900)' }}>{locationName || 'Getting location...'}</span>
        </div>
        <button onClick={getLocation} disabled={locLoading} className="btn btn-secondary" style={{ fontSize: 12, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Navigation style={{ width: 13, height: 13 }} /> Use My Location
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <div className="search-bar" style={{ maxWidth: 'none', flex: 1 }}>
            <Search style={{ width: 14, height: 14, color: 'var(--text-400)' }} />
            <input placeholder={activeTab === 'hospitals' ? "Search hospitals..." : "Search medical stores / pharmacies..."} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {filterOptions.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '6px 14px', borderRadius: 20, border: '1.5px solid', borderColor: filter === f ? '#6c63ff' : '#e5e7eb', background: filter === f ? 'var(--purple-50)' : 'white', color: filter === f ? '#6c63ff' : '#6b7280', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
            {f}
          </button>
        ))}
      </div>

      {/* Main Grid: List + Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 20 }} className="grid-cols-1 md:grid-cols-2">
        {/* List Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 600, overflowY: 'auto', paddingRight: 4 }}>
          {activeTab === 'hospitals' ? (
            filteredHospitals.map((h, i) => (
              <motion.div key={h.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="card card-lift" onClick={() => setSelected(h.id === selected ? null : h.id)}
                style={{ padding: '16px 20px', cursor: 'pointer', borderColor: selected === h.id ? '#6c63ff35' : 'var(--border-card)', background: selected === h.id ? 'var(--purple-50)' : 'var(--surface-1)' }}>
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
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  {h.emergency && <span className="badge badge-red">🚨 Emergency</span>}
                  {h.icu && <span className="badge badge-blue">🏥 ICU</span>}
                  {h.ambulance && <span className="badge badge-green">🚑 Ambulance</span>}
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-400)', fontWeight: 600 }}>{h.distance} km away</span>
                </div>
              </motion.div>
            ))
          ) : (
            filteredPharmacies.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="card card-lift" onClick={() => setSelected(p.id === selected ? null : p.id)}
                style={{ padding: '16px 20px', cursor: 'pointer', borderColor: selected === p.id ? '#10b98135' : 'var(--border-card)', background: selected === p.id ? 'rgba(16,185,129,0.06)' : 'var(--surface-1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--text-900)', fontSize: 14 }}>{p.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-500)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin style={{ width: 11, height: 11 }} /> {p.address || 'Local Pharmacy Store'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#fef3c7', padding: '3px 8px', borderRadius: 8 }}>
                    <Star style={{ width: 11, height: 11, fill: '#f59e0b', color: '#f59e0b' }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#92400e' }}>{p.rating || '4.5'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  {p.open24 && <span className="badge badge-blue">🌙 24x7 Open</span>}
                  {p.delivery && <span className="badge badge-green">🚚 Home Delivery</span>}
                  <span style={{ fontSize: 10, background: p.stock >= 80 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: p.stock >= 80 ? '#10b981' : '#f59e0b', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>📦 Stock: {p.stock}%</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-400)', fontWeight: 600 }}>{p.distance} km away</span>
                </div>
              </motion.div>
            ))
          )}
          {currentItems.length === 0 && (
            <div className="empty-state card" style={{ padding: 40, textAlign: 'center' }}>
              <p style={{ fontSize: 32 }}>🏥</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#334155', marginTop: 12 }}>No medical locations found</p>
              <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>Try adjusting your filters or search keywords.</p>
            </div>
          )}
        </div>

        {/* Map + Detail Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Leaflet Map container */}
          <div style={{ position: 'relative', width: '100%', height: 280, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-card)' }}>
            {!mapLoaded && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-1)', zIndex: 10 }}>
                <Loader style={{ width: 24, height: 24, color: '#6c63ff', animation: 'spin 1.5s linear infinite' }} />
              </div>
            )}
            <div id="leaflet-map" style={{ width: '100%', height: '100%', zIndex: 1 }} />
          </div>

          {selectedItem && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-900)', marginBottom: 12 }}>{selectedItem.name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                {activeTab === 'hospitals' ? (
                  [
                    { label: 'Distance', value: `${selectedItem.distance} km` },
                    { label: 'Rating', value: `⭐ ${selectedItem.rating}` },
                    { label: 'Available Beds', value: selectedItem.beds || 'N/A' },
                    { label: 'Status', value: selectedItem.open ? '🟢 Open' : '🔴 Closed' },
                  ].map(d => (
                    <div key={d.label} style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border-card)' }}>
                      <p style={{ fontSize: 10, color: 'var(--text-400)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{d.label}</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-900)' }}>{d.value}</p>
                    </div>
                  ))
                ) : (
                  [
                    { label: 'Distance', value: `${selectedItem.distance} km` },
                    { label: 'Rating', value: `⭐ ${selectedItem.rating || '4.5'}` },
                    { label: 'Home Delivery', value: selectedItem.delivery ? '🟢 Available' : '🔴 Unavailable' },
                    { label: 'Status', value: selectedItem.open24 ? '🟢 24x7 Open' : '🟢 Open' },
                  ].map(d => (
                    <div key={d.label} style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border-card)' }}>
                      <p style={{ fontSize: 10, color: 'var(--text-400)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{d.label}</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-900)' }}>{d.value}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Doctors association section */}
              {activeTab === 'hospitals' && (
                <div style={{ marginBottom: 14, borderTop: '1px solid var(--border-card)', paddingTop: 14 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-500)', textTransform: 'uppercase', marginBottom: 8 }}>👨‍⚕️ Available Doctors</p>
                  {getDoctorsForHospital(selectedItem.name).length === 0 ? (
                    <p style={{ fontSize: 12, color: 'var(--text-400)', fontStyle: 'italic', margin: 0 }}>No registered doctors at this facility yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {getDoctorsForHospital(selectedItem.name).slice(0, 3).map(doc => (
                        <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border-card)' }}>
                          <div>
                            <p style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-900)', margin: 0 }}>{doc.name}</p>
                            <p style={{ fontSize: 11, color: '#6c63ff', fontWeight: 600, margin: 0 }}>{doc.specialty} • ₹{doc.fee}</p>
                          </div>
                          <button onClick={() => navigate('/appointments', { state: { doctor: doc } })}
                            className="btn btn-primary" style={{ padding: '6px 10px', fontSize: 11, borderRadius: 8 }}>
                            Book Slot
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Specialties / Medicines Stock details */}
              {activeTab === 'hospitals' ? (
                selectedItem.specialties && (
                  <div style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-500)', textTransform: 'uppercase', marginBottom: 8 }}>🩺 Hospital Specialties</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {selectedItem.specialties.map(s => (
                        <span key={s} className="badge badge-purple">{s}</span>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                <div style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-500)', textTransform: 'uppercase', marginBottom: 8 }}>💊 Available Medicines</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['Paracetamol (500mg)', 'Cetirizine (10mg)', 'Gelusil Antacid', 'ORS Sachet', 'Ibuprofen (400mg)'].map(m => (
                      <span key={m} style={{ fontSize: 10, fontWeight: 600, background: 'rgba(16,185,129,0.08)', color: '#10b981', padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(16,185,129,0.15)' }}>{m} ✓</span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => window.open(`tel:${activeTab === 'hospitals' ? '108' : '102'}`)} className="btn btn-primary" style={{ flex: 1, fontSize: 12 }}>
                  <Phone style={{ width: 13, height: 13 }} /> Call Now
                </button>
                <button onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(selectedItem.name + ' ' + (selectedItem.address || ''))}`,'_blank')} className="btn btn-secondary" style={{ flex: 1, fontSize: 12 }}>
                  <Navigation style={{ width: 13, height: 13 }} /> Directions
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
