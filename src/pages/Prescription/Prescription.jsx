import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Plus, Printer } from 'lucide-react';
import { useHealthStore, useAuthStore } from '../../store';
import { format } from 'date-fns';

function generatePrescriptionPDF(rx) {
  // Mock PDF generation - in production use jsPDF
  const content = `
MEDIVISION AI - DIGITAL PRESCRIPTION
=====================================
Date: ${rx.date}
Doctor: ${rx.doctorName}
Patient: ${rx.patientName}

MEDICATIONS:
${rx.medicines.map((m, i) => `${i + 1}. ${m.name} - ${m.dose} - ${m.freq} - ${m.duration}`).join('\n')}

INSTRUCTIONS: ${rx.instructions}
Digital Signature: [Verified ✓]
  `;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `prescription-${rx.id}.txt`;
  a.click();
}

export default function Prescription() {
  const { user } = useAuthStore();
  const { prescriptions, addPrescription } = useHealthStore();
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    patientName: 'Demo Patient',
    patientAge: 28,
    diagnosis: '',
    instructions: 'Take with food. Rest well. Avoid alcohol.',
    medicines: [{ name: '', dose: '', freq: '', duration: '' }],
  });

  const addMed = () => setForm(f => ({ ...f, medicines: [...f.medicines, { name: '', dose: '', freq: '', duration: '' }] }));
  const removeMed = (i) => setForm(f => ({ ...f, medicines: f.medicines.filter((_, j) => j !== i) }));
  const updateMed = (i, field, val) => setForm(f => ({ ...f, medicines: f.medicines.map((m, j) => j === i ? { ...m, [field]: val } : m) }));

  const save = () => {
    const rx = {
      id: Date.now(),
      date: format(new Date(), 'dd MMM yyyy'),
      doctorName: user?.name || 'Dr. Demo Doctor',
      patientName: form.patientName,
      diagnosis: form.diagnosis,
      medicines: form.medicines.filter(m => m.name),
      instructions: form.instructions,
    };
    addPrescription(rx);
    setCreating(false);
    setForm({ patientName: 'Demo Patient', patientAge: 28, diagnosis: '', instructions: 'Take with food.', medicines: [{ name: '', dose: '', freq: '', duration: '' }] });
  };

  const sampleRx = prescriptions.length === 0 ? [{
    id: 999,
    date: '10 Jun 2026',
    doctorName: 'Dr. Arjun Sharma',
    patientName: 'Demo Patient',
    diagnosis: 'Viral Fever + Mild Dehydration',
    medicines: [
      { name: 'Paracetamol 500mg', dose: '1 tab', freq: 'TDS', duration: '5 days' },
      { name: 'ORS Sachets', dose: '1 sachet in 1L water', freq: 'BD', duration: '3 days' },
      { name: 'Vitamin C 500mg', dose: '1 tab', freq: 'OD', duration: '7 days' },
    ],
    instructions: 'Rest for 3 days. Drink 3L water daily. Avoid oily food.',
  }] : prescriptions;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="section-title flex items-center gap-2"><FileText className="w-7 h-7 text-indigo-400" />Digital Prescriptions</h1>
          <p className="section-subtitle">View, create, and download digital prescriptions</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Prescription
        </button>
      </div>

      {/* Create Form */}
      {creating && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-display font-semibold text-white mb-4">Create New Prescription</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Patient Name</label>
              <input className="input-field" value={form.patientName} onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Diagnosis</label>
              <input className="input-field" placeholder="e.g., Viral fever" value={form.diagnosis} onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))} />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400">Medicines</label>
              <button onClick={addMed} className="text-xs text-blue-400 hover:text-blue-300">+ Add Medicine</button>
            </div>
            <div className="space-y-2">
              {form.medicines.map((m, i) => (
                <div key={i} className="grid grid-cols-4 gap-2">
                  <input className="input-field col-span-1" placeholder="Medicine" value={m.name} onChange={e => updateMed(i, 'name', e.target.value)} />
                  <input className="input-field" placeholder="Dose" value={m.dose} onChange={e => updateMed(i, 'dose', e.target.value)} />
                  <input className="input-field" placeholder="Freq (TDS/BD)" value={m.freq} onChange={e => updateMed(i, 'freq', e.target.value)} />
                  <input className="input-field" placeholder="Duration" value={m.duration} onChange={e => updateMed(i, 'duration', e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-1 block">Instructions</label>
            <textarea className="input-field resize-none" rows={2} value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setCreating(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={save} className="btn-primary flex-1">Save Prescription</button>
          </div>
        </motion.div>
      )}

      {/* Prescriptions */}
      <div className="space-y-4">
        {sampleRx.map((rx, i) => (
          <motion.div key={rx.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-2xl">📋</div>
                <div>
                  <h3 className="font-display font-semibold text-white">{rx.diagnosis || 'General Prescription'}</h3>
                  <p className="text-sm text-gray-400">{rx.doctorName} · {rx.date}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => generatePrescriptionPDF(rx)} className="btn-secondary text-xs py-2 flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button className="btn-secondary text-xs py-2 flex items-center gap-1">
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div><span className="text-gray-400">Patient:</span> <span className="text-white ml-1">{rx.patientName}</span></div>
                <div><span className="text-gray-400">Date:</span> <span className="text-white ml-1">{rx.date}</span></div>
              </div>

              {/* Medicine Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 border-b border-white/10">
                      <th className="pb-2 pr-4">#</th>
                      <th className="pb-2 pr-4">Medicine</th>
                      <th className="pb-2 pr-4">Dose</th>
                      <th className="pb-2 pr-4">Frequency</th>
                      <th className="pb-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rx.medicines.map((m, j) => (
                      <tr key={j} className="border-b border-white/5">
                        <td className="py-2 pr-4 text-gray-500">{j + 1}</td>
                        <td className="py-2 pr-4 text-white font-medium">{m.name}</td>
                        <td className="py-2 pr-4 text-gray-300">{m.dose}</td>
                        <td className="py-2 pr-4"><span className="badge-info">{m.freq}</span></td>
                        <td className="py-2 text-gray-300">{m.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {rx.instructions && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-xs text-blue-300"><span className="font-bold">Instructions:</span> {rx.instructions}</p>
                </div>
              )}

              <div className="mt-3 flex items-center gap-2">
                <span className="badge-success">✓ Digitally Verified</span>
                <span className="text-xs text-gray-500">QR: RX-{rx.id?.toString().slice(-6)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
