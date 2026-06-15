import React from 'react';
import { motion } from 'framer-motion';
import { History, Download, Filter } from 'lucide-react';
import { useHealthStore } from '../../store';

const sampleHistory = [
  { id: 1, type: 'Symptom Check', date: '10 Jun 2026', result: 'Dengue Fever', severity: 'High', icon: '🔍' },
  { id: 2, type: 'Image Analysis (XRAY)', date: '8 Jun 2026', result: 'Normal Lung', severity: 'Low', icon: '🫁' },
  { id: 3, type: 'Doctor Visit', date: '5 Jun 2026', result: 'Hypertension - Controlled', severity: 'Medium', icon: '👨‍⚕️' },
  { id: 4, type: 'Symptom Check', date: '1 Jun 2026', result: 'Common Cold', severity: 'Low', icon: '🔍' },
  { id: 5, type: 'Blood Test', date: '20 May 2026', result: 'CBC - Normal', severity: 'Low', icon: '🧪' },
];

const severityColors = { Low: 'badge-success', Medium: 'badge-warning', High: 'badge-danger', Critical: 'bg-purple-500/20 text-purple-400 border border-purple-500/30 badge' };

export default function MedicalHistory() {
  const { medicalHistory } = useHealthStore();
  const combined = [...sampleHistory, ...medicalHistory].sort((a, b) => b.id - a.id);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="section-title flex items-center gap-2"><History className="w-7 h-7 text-violet-400" />Medical History</h1>
          <p className="section-subtitle">Timeline of all your diagnoses, tests, and visits</p>
        </div>
        <button className="btn-secondary flex items-center gap-2 text-sm py-2">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500 via-blue-500 to-transparent" />
        <div className="space-y-4">
          {combined.map((h, i) => (
            <motion.div key={h.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-4">
              <div className="relative z-10 w-12 h-12 bg-dark-800 border-2 border-violet-500/50 rounded-xl flex items-center justify-center text-xl flex-shrink-0 mt-1">
                {h.icon}
              </div>
              <div className="flex-1 glass-card p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-xs text-gray-400">{h.date}</p>
                    <h3 className="font-medium text-white mt-0.5">{h.type}</h3>
                    <p className="text-sm text-gray-300 mt-1">Result: <span className="text-white font-medium">{h.result}</span></p>
                  </div>
                  <span className={severityColors[h.severity] || 'badge-info'}>{h.severity}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
