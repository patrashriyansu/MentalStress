import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare,
  Send, Users, Settings, Maximize, MoreHorizontal, Share2
} from 'lucide-react';
import { useAuthStore } from '../../store';

const CHAT_INIT = [
  { from:'bot', name:'Dr. Arjun Sharma', text:'Hello! I can see you clearly. How are you feeling today?', time:'10:23' },
];

export default function VideoConsult() {
  const { user } = useAuthStore();
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [chat, setChat] = useState(false);
  const [msgs, setMsgs] = useState(CHAT_INIT);
  const [input, setInput] = useState('');
  const [callTime, setCallTime] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setConnected(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!connected) return;
    const t = setInterval(() => setCallTime(c => c+1), 1000);
    return () => clearInterval(t);
  }, [connected]);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const send = () => {
    if (!input.trim()) return;
    const time = new Date().toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'});
    setMsgs(m => [...m, { from:'user', name: user?.name||'You', text:input, time }]);
    setInput('');
    setTimeout(() => setMsgs(m => [...m, { from:'bot', name:'Dr. Arjun Sharma', text:"I understand. Let me note that in your records. Can you describe the severity on a scale of 1-10?", time }]), 1500);
  };

  const controls = [
    { icon: mic ? Mic : MicOff, label: mic ? 'Mute' : 'Unmute', action: () => setMic(!mic), active: mic, danger: !mic },
    { icon: cam ? Video : VideoOff, label: cam ? 'Stop Video' : 'Start Video', action: () => setCam(!cam), active: cam, danger: !cam },
    { icon: Share2, label: 'Share Screen', action: () => {}, active: false, danger: false },
    { icon: MessageSquare, label: 'Chat', action: () => setChat(!chat), active: chat, danger: false },
    { icon: Users, label: 'Participants', action: () => {}, active: false, danger: false },
  ];

  return (
    <div className="space-y-4" style={{ fontFamily:"'Inter',sans-serif" }}>
      <div>
        <h1 className="section-title flex items-center gap-2"><Video className="w-6 h-6" style={{ color:'#2563eb' }}/>Video Consultation</h1>
        <p className="section-subtitle">Secure, encrypted video consultation with your doctor</p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-14rem)]">
        {/* Main Video */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Doctor video */}
          <div className="flex-1 relative rounded-3xl overflow-hidden" style={{ background:'linear-gradient(135deg,#0f172a,#1e3a8a)' }}>
            {!connected ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <motion.div animate={{ scale:[1,1.1,1] }} transition={{ repeat:Infinity, duration:1.5 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center text-4xl" style={{ background:'rgba(37,99,235,0.3)' }}>
                  👨‍⚕️
                </motion.div>
                <p className="text-white font-semibold">Connecting to Dr. Arjun Sharma...</p>
                <div className="flex gap-1">
                  {[0,1,2].map(i=><motion.div key={i} className="w-2 h-2 bg-blue-400 rounded-full" animate={{ y:[0,-6,0] }} transition={{ repeat:Infinity, duration:0.8, delay:i*0.2 }}/>)}
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full flex items-center justify-center text-7xl shadow-2xl"
                  style={{ background:'linear-gradient(135deg,#1d4ed8,#0ea5e9)' }}>👨‍⚕️</div>
              </div>
            )}

            {/* Timer + Status */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              {connected && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background:'rgba(0,0,0,0.5)' }}>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"/>
                  <span className="text-white text-xs font-mono font-bold">{fmt(callTime)}</span>
                </div>
              )}
              <div className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background:connected?'rgba(16,185,129,0.8)':'rgba(239,68,68,0.8)', color:'white' }}>
                {connected?'🔒 Encrypted':'Connecting...'}
              </div>
            </div>

            {/* Doctor name overlay */}
            <div className="absolute bottom-4 left-4 px-3 py-2 rounded-xl" style={{ background:'rgba(0,0,0,0.5)' }}>
              <p className="text-white text-sm font-bold">Dr. Arjun Sharma</p>
              <p className="text-blue-300 text-xs">Cardiologist • Apollo Hospital</p>
            </div>

            <button className="absolute top-4 right-4 btn btn-icon" style={{ background:'rgba(0,0,0,0.5)', border:'none', color:'white' }}>
              <MoreHorizontal className="w-4 h-4"/>
            </button>
          </div>

          {/* Self preview */}
          <div className="flex gap-3 h-28">
            <div className="w-44 rounded-2xl overflow-hidden relative flex-shrink-0"
              style={{ background: cam ? 'linear-gradient(135deg,#1e293b,#334155)' : '#1e293b' }}>
              {cam ? (
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  {(user?.name?.[0]||'U')}
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <VideoOff className="w-6 h-6 text-slate-400"/>
                  <p className="text-xs text-slate-400">Camera Off</p>
                </div>
              )}
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg text-xs font-semibold text-white" style={{ background:'rgba(0,0,0,0.6)' }}>
                {user?.name?.split(' ')[0]||'You'} (Me)
              </div>
            </div>

            {/* Controls */}
            <div className="flex-1 card p-4 flex items-center justify-center gap-4">
              {controls.map(c => (
                <button key={c.label} onClick={c.action} className="flex flex-col items-center gap-1.5 group">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all"
                    style={{ background: c.danger ? '#fee2e2' : c.active ? 'linear-gradient(135deg,#eff6ff,#dbeafe)' : '#f1f5f9' }}>
                    <c.icon className="w-5 h-5" style={{ color: c.danger ? '#ef4444' : c.active ? '#2563eb' : '#64748b' }}/>
                  </div>
                  <span className="text-xs font-medium" style={{ color:'#94a3b8' }}>{c.label}</span>
                </button>
              ))}
              <div className="w-px h-10 bg-slate-200 mx-1"/>
              <button className="flex flex-col items-center gap-1.5">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#ef4444,#dc2626)' }}>
                  <PhoneOff className="w-5 h-5 text-white"/>
                </div>
                <span className="text-xs font-medium text-red-500">End Call</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <AnimatePresence>
          {chat && (
            <motion.div initial={{ opacity:0, x:20, width:0 }} animate={{ opacity:1, x:0, width:300 }} exit={{ opacity:0, x:20, width:0 }}
              className="card flex flex-col overflow-hidden" style={{ borderRadius:20, minWidth:280 }}>
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor:'rgba(37,99,235,0.08)' }}>
                <p className="text-sm font-bold text-slate-700">💬 Chat</p>
                <button onClick={() => setChat(false)} className="text-slate-400 hover:text-slate-600 text-xs">Close</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {msgs.map((m,i)=>(
                  <div key={i} className={`flex gap-2 ${m.from==='user'?'flex-row-reverse':''}`}>
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: m.from==='bot' ? '#dbeafe' : 'linear-gradient(135deg,#2563eb,#06b6d4)', color: m.from==='bot' ? '#1d4ed8' : 'white' }}>
                      {m.from==='bot'?'👨‍⚕️':(user?.name?.[0]||'U').toUpperCase()}
                    </div>
                    <div className={`max-w-[75%] ${m.from==='user'?'items-end':'items-start'} flex flex-col gap-1`}>
                      <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${m.from==='bot'?'chat-bot':'chat-user'}`}>
                        {m.text}
                      </div>
                      <span className="text-xs px-1" style={{ color:'#94a3b8' }}>{m.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t flex gap-2" style={{ borderColor:'rgba(37,99,235,0.08)' }}>
                <input className="input-field py-2 text-xs flex-1" style={{ borderRadius:12 }} placeholder="Type a message..."
                  value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}/>
                <button onClick={send} className="btn btn-primary w-9 h-9 p-0 flex-shrink-0" style={{ borderRadius:12, minWidth:36 }}>
                  <Send className="w-3.5 h-3.5"/>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Doctor info */}
      <div className="card p-4 flex items-center gap-4" style={{ borderRadius:20 }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background:'#dbeafe' }}>👨‍⚕️</div>
        <div className="flex-1">
          <p className="font-bold text-slate-800">Dr. Arjun Sharma</p>
          <p className="text-sm" style={{ color:'#94a3b8' }}>Cardiologist • Apollo Hospital • 15 years experience</p>
        </div>
        <div className="text-right">
          <p className="text-xs" style={{ color:'#94a3b8' }}>Consultation #1024</p>
          <p className="text-xs font-bold" style={{ color:'#2563eb' }}>10:23 AM • Today</p>
        </div>
      </div>
    </div>
  );
}
