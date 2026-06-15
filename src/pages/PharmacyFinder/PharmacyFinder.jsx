import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PHARMACIES } from '../../data/mockData';
import { ShoppingBag, Star, Navigation, Phone, Clock, Package } from 'lucide-react';

export default function PharmacyFinder() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = PHARMACIES.filter(p => filter === 'all' || (filter === '24x7' && p.open24) || (filter === 'delivery' && p.delivery));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="section-title flex items-center gap-2"><ShoppingBag className="w-7 h-7 text-purple-400" />Nearby Pharmacy Finder</h1>
        <p className="section-subtitle">Find pharmacies near you with stock availability</p>
      </div>

      {/* Simple Map */}
      <div className="relative w-full h-56 bg-dark-700 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="absolute w-full h-px bg-purple-400" style={{ top: `${i * 14.3}%` }} />
              <div className="absolute h-full w-px bg-purple-400" style={{ left: `${i * 14.3}%` }} />
            </React.Fragment>
          ))}
        </div>
        {filtered.map((p, i) => {
          const positions = [{ left: '30%', top: '40%' }, { left: '55%', top: '60%' }, { left: '70%', top: '35%' }, { left: '40%', top: '65%' }];
          const pos = positions[i % positions.length];
          return (
            <motion.div key={p.id} className="absolute cursor-pointer" style={{ left: pos.left, top: pos.top }} whileHover={{ scale: 1.3 }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} onClick={() => setSelected(p.id)}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 ${selected === p.id ? 'bg-purple-500 border-white' : 'bg-purple-600/80 border-purple-300'}`}>
                <span className="text-sm">💊</span>
              </div>
            </motion.div>
          );
        })}
        <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-50" />
          </motion.div>
        </div>
        <div className="absolute top-3 right-3 glass px-2 py-1 text-xs text-gray-400">📍 Delhi, India</div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[['all', 'All Pharmacies'], ['24x7', '🌙 Open 24x7'], ['delivery', '🚚 Home Delivery']].map(([f, l]) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm transition-all ${filter === f ? 'bg-purple-600 text-white' : 'glass text-gray-400 hover:text-white'}`}>{l}</button>
        ))}
      </div>

      {/* Pharmacy Cards */}
      <div className="grid gap-4">
        {filtered.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`glass-card p-5 cursor-pointer transition-all ${selected === p.id ? 'border-purple-500/40' : 'hover:border-white/20'}`}
            onClick={() => setSelected(p.id === selected ? null : p.id)}
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center text-2xl">💊</div>
                <div>
                  <h3 className="font-display font-semibold text-white">{p.name}</h3>
                  <p className="text-sm text-gray-400">{p.distance} km away</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {p.open24 && <span className="badge-info">🌙 24x7</span>}
                    {p.delivery && <span className="badge-success">🚚 Delivery</span>}
                    <span className="badge-warning">📦 Stock: {p.stock}%</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary text-xs py-2 px-3 flex items-center gap-1"><Phone className="w-3 h-3" /> Call</button>
                <button className="btn-primary text-xs py-2 px-3 flex items-center gap-1"><Navigation className="w-3 h-3" /> Navigate</button>
              </div>
            </div>
            {selected === p.id && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-gray-300 mb-2">💊 Available Medicines:</p>
                <div className="flex flex-wrap gap-2">
                  {['Paracetamol', 'Cetirizine', 'Antacid', 'ORS', 'Vitamin C', 'Ibuprofen'].map(m => (
                    <span key={m} className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-300">{m} ✓</span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
