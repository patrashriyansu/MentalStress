import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Mic, MicOff, Paperclip, X, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../store';

const INITIAL = (name) => [
  { id: 1, from: 'bot', text: `Hello ${name}! 👋 I'm your AI Health Assistant. How can I help you today?`, time: 'Now' },
];

const SUGGESTIONS = ['Check my symptoms', 'Find a specialist', 'Understand my report', 'Medication advice', 'Emergency help', 'Nearest hospital'];

const BOT_REPLIES = [
  "I understand your concern. Could you tell me how long you've been experiencing this?",
  "Based on what you've shared, I recommend consulting a specialist. Would you like me to find one nearby?",
  "That's important information. Your symptoms could indicate a few conditions — let me analyse them for you.",
  "I've noted your symptoms. For a more accurate assessment, I recommend using our Symptom Checker tool. Would you like to proceed?",
  "Please don't worry — many conditions with these symptoms are very treatable. Here's what I suggest...",
];

export default function Chatbot() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState(INITIAL(user?.name?.split(' ')[0] || 'there'));
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [typing, setTyping] = useState(false);
  const [replyIdx, setReplyIdx] = useState(0);
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const send = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: msg, time }]);
    setInput('');
    setTyping(true);
    await new Promise(r => setTimeout(r, 1200));
    setTyping(false);
    setMessages(prev => [...prev, {
      id: Date.now() + 1, from: 'bot',
      text: BOT_REPLIES[replyIdx % BOT_REPLIES.length], time
    }]);
    setReplyIdx(i => i + 1);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="card p-4 mb-4 flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-slate-800">AI Health Assistant</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-600 font-semibold">Online · Powered by MediVision AI</span>
          </div>
        </div>
        <button onClick={() => setMessages(INITIAL(user?.name?.split(' ')[0] || 'there'))}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="card flex-1 overflow-y-auto p-5 space-y-4 mb-4">
        {messages.map(m => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${m.from === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm ${m.from === 'bot' ? 'bg-blue-100 text-blue-600' : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold'}`}>
              {m.from === 'bot' ? '🤖' : (user?.name?.[0] || 'U').toUpperCase()}
            </div>
            <div className={`max-w-[75%] ${m.from === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.from === 'bot' ? 'chat-bubble-bot' : 'chat-bubble-user'}`}>
                {m.text}
              </div>
              <span className="text-xs text-slate-400 px-1">{m.time}</span>
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-sm">🤖</div>
            <div className="chat-bubble-bot px-4 py-3 rounded-2xl flex items-center gap-1">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-2 h-2 bg-blue-400 rounded-full"
                  animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 flex-wrap mb-3">
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => send(s)}
            className="px-3 py-1.5 bg-white border border-blue-200 text-blue-600 text-xs font-semibold rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all">
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="card p-3 flex items-center gap-2">
        <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <Paperclip className="w-4 h-4" />
        </button>
        <input className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400"
          placeholder="Type your health question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()} />
        <button onClick={() => setListening(!listening)}
          className={`p-2 rounded-xl transition-all ${listening ? 'bg-red-100 text-red-500' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'}`}>
          {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
        <button onClick={() => send()} disabled={!input.trim()}
          className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
