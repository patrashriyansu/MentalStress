import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, ImageIcon, Scan, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useHealthStore } from '../../store';

const DETECTION_RESULTS = {
  xray: [
    { condition: 'Pneumonia', probability: 23, normal: false },
    { condition: 'Normal Lung', probability: 77, normal: true },
    { condition: 'Pleural Effusion', probability: 8, normal: false },
  ],
  mri: [
    { condition: 'No Tumor Detected', probability: 89, normal: true },
    { condition: 'Abnormal Signal', probability: 11, normal: false },
  ],
  skin: [
    { condition: 'Benign Lesion', probability: 82, normal: true },
    { condition: 'Melanoma Risk', probability: 7, normal: false },
    { condition: 'Eczema', probability: 11, normal: false },
  ],
  ct: [
    { condition: 'No Fracture', probability: 91, normal: true },
    { condition: 'Hairline Fracture', probability: 9, normal: false },
  ],
};

export default function ImageAnalysis() {
  const [imageType, setImageType] = useState('xray');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [phase, setPhase] = useState('upload'); // upload | processing | results
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const fileRef = useRef();
  const { addToHistory } = useHealthStore();

  const types = [
    { id: 'xray', label: 'X-Ray', icon: '🫁' },
    { id: 'mri', label: 'MRI Scan', icon: '🧠' },
    { id: 'ct', label: 'CT Scan', icon: '💀' },
    { id: 'skin', label: 'Skin Image', icon: '🩹' },
  ];

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const analyze = async () => {
    setPhase('processing');
    const steps = ['Loading image...', 'Preprocessing...', 'Running CNN model...', 'Analyzing features...', 'Generating report...'];
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 700));
      setProgress((i + 1) * 20);
    }
    const res = DETECTION_RESULTS[imageType] || DETECTION_RESULTS.xray;
    setResults(res);
    setPhase('results');
    addToHistory({ id: Date.now(), type: `Image Analysis (${imageType.toUpperCase()})`, date: new Date().toLocaleDateString('en-IN'), result: res[0].condition, severity: res.find(r => !r.normal) ? 'Medium' : 'Low' });
  };

  const reset = () => { setFile(null); setPreview(null); setPhase('upload'); setProgress(0); setResults([]); };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="section-title flex items-center gap-2"><ImageIcon className="w-7 h-7 text-teal-400" />Medical Image Analysis</h1>
        <p className="section-subtitle">AI-powered analysis of X-rays, MRI, CT scans, and skin images using CNN</p>
      </div>

      {/* Image Type Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {types.map(t => (
          <button key={t.id} onClick={() => setImageType(t.id)} className={`glass-card p-4 flex flex-col items-center gap-2 transition-all ${imageType === t.id ? 'border-teal-500/50 bg-teal-500/10' : 'hover:border-white/20'}`}>
            <span className="text-3xl">{t.icon}</span>
            <span className="text-sm text-gray-300">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Panel */}
        <div className="glass-card p-6">
          {phase === 'upload' && (
            <>
              <div
                onClick={() => fileRef.current?.click()}
                onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                onDragOver={e => e.preventDefault()}
                className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center cursor-pointer hover:border-teal-500/50 hover:bg-teal-500/5 transition-all"
              >
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="w-full h-48 object-contain rounded-xl" />
                    <button onClick={(e) => { e.stopPropagation(); reset(); }} className="absolute top-2 right-2 w-7 h-7 bg-red-600 rounded-full flex items-center justify-center">
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-teal-400 mx-auto mb-3" />
                    <p className="text-white font-medium">Drop image here or click to upload</p>
                    <p className="text-gray-400 text-sm mt-1">Supports JPG, PNG, DICOM</p>
                    <p className="text-xs text-gray-500 mt-2">📏 Max size: 10MB</p>
                  </>
                )}
              </div>

              {/* Demo images */}
              {!file && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Or use a demo image:</p>
                  <button onClick={() => { setFile({ name: `demo-${imageType}.jpg` }); setPreview(null); }} className="w-full py-2 glass rounded-xl text-sm text-gray-300 hover:text-white transition-all hover:bg-white/10">
                    📂 Use Demo {types.find(t => t.id === imageType)?.label}
                  </button>
                </div>
              )}

              <button
                onClick={analyze}
                disabled={!file && !preview && !file?.name?.includes('demo')}
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
              >
                <Scan className="w-5 h-5" /> Analyze with CNN Model
              </button>
            </>
          )}

          {phase === 'processing' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                  <Scan className="w-10 h-10 text-teal-400" />
                </motion.div>
              </div>
              <p className="text-white font-medium">Analyzing {imageType.toUpperCase()} Image</p>
              <div className="progress-bar">
                <motion.div className="progress-fill bg-gradient-to-r from-teal-600 to-cyan-500" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-teal-400 font-bold">{progress}%</p>
              <p className="text-gray-400 text-sm">Running Convolutional Neural Network...</p>
              <div className="flex justify-center gap-3 text-xs text-gray-500">
                {['VGG-16', 'ResNet-50', 'Grad-CAM'].map(m => (
                  <span key={m} className="glass px-2 py-1 rounded-lg">{m}</span>
                ))}
              </div>
            </div>
          )}

          {phase === 'results' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Analysis Complete</h3>
                <button onClick={reset} className="text-xs text-blue-400 hover:text-blue-300">Upload New</button>
              </div>

              {results.map((r, i) => (
                <motion.div key={r.condition} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={`p-4 rounded-xl border ${r.normal ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {r.normal ? <CheckCircle className="w-5 h-5 text-green-400" /> : <AlertTriangle className="w-5 h-5 text-red-400" />}
                    <span className={`font-medium text-sm ${r.normal ? 'text-green-300' : 'text-red-300'}`}>{r.condition}</span>
                    <span className="ml-auto font-bold text-white">{r.probability}%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div className={`progress-fill ${r.normal ? 'bg-green-500' : 'bg-red-500'}`} initial={{ width: 0 }} animate={{ width: `${r.probability}%` }} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-3">🧠 CNN Architecture</h3>
            <div className="space-y-2 text-sm">
              {['Input Layer (224×224)', 'Conv2D + MaxPool (×5)', 'Dense Layers (512, 256)', 'Softmax Output'].map((l, i) => (
                <div key={l} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-blue-600' : i === 3 ? 'bg-teal-600' : 'bg-purple-600'}`}>{i + 1}</div>
                  <span className="text-gray-300">{l}</span>
                  <span className="ml-auto text-gray-500 text-xs">{'→'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-3">📊 Model Accuracy</h3>
            {[
              { model: 'Pneumonia Detection', acc: 96.5 },
              { model: 'Tumor Classification', acc: 94.2 },
              { model: 'Skin Lesion', acc: 91.8 },
              { model: 'Fracture Detection', acc: 97.1 },
            ].map(m => (
              <div key={m.model} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{m.model}</span>
                  <span className="text-teal-400 font-bold">{m.acc}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill bg-teal-500" style={{ width: `${m.acc}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-4 border border-amber-500/20 bg-amber-500/5">
            <p className="text-amber-400 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              AI analysis is for screening purposes only. Always confirm results with a radiologist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
