import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MEDICINES } from '../../data/mockData';
import { Pill, Search, AlertTriangle } from 'lucide-react';

export default function Medicines() {
  const [search, setSearch] = useState('');
  const [selectedSymptom, setSelectedSymptom] = useState('');

  const symptoms = ['Fever', 'Headache', 'Nausea', 'Diarrhea', 'Joint Pain', 'Itching', 'Fatigue'];

  const filtered = MEDICINES.filter(m =>
    (m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.forSymptom.some(s => s.toLowerCase().includes(search.toLowerCase()))) &&
    (selectedSymptom === '' || m.forSymptom.includes(selectedSymptom))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="section-title flex items-center gap-2"><Pill className="w-7 h-7 text-pink-400" />Medicine Recommendation</h1>
        <p className="section-subtitle">AI-suggested OTC medicines based on your symptoms</p>
      </div>

      <div className="glass-card p-5 border border-amber-500/20 bg-amber-500/5">
        <p className="text-amber-400 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <strong>Disclaimer:</strong> These are over-the-counter (OTC) suggestions only. Always consult a certified doctor before taking any medication.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input className="input-field pl-12" placeholder="Search medicine or symptom..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field w-auto" value={selectedSymptom} onChange={e => setSelectedSymptom(e.target.value)}>
          <option value="">All Symptoms</option>
          {symptoms.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid gap-4">
        {filtered.map((m, i) => (
          <motion.div key={m.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-pink-500/20 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">💊</div>
                <div>
                  <h3 className="font-display font-semibold text-white text-lg">{m.name}</h3>
                  <span className="badge-info mt-1">{m.type}</span>
                  <p className="text-sm text-gray-400 mt-2"><span className="text-gray-300">Dosage:</span> {m.dosage}</p>
                  <p className="text-sm text-gray-400 mt-1"><span className="text-gray-300">Precautions:</span> {m.precautions}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-400">₹{m.price}</p>
                <p className="text-xs text-gray-400">approx.</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs text-gray-400">For:</span>
              {m.forSymptom.map(s => (
                <span key={s} className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 rounded-full text-xs text-pink-300">{s}</span>
              ))}
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="glass-card p-12 text-center text-gray-400">No medicines found for your search.</div>
        )}
      </div>
    </div>
  );
}
