'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Flame, Crown, Shield } from 'lucide-react';

const mockMessages = [
  { id: 1, user: 'TurfMaster_BR', avatar: '🏇', message: 'Full Point en la carrera 5, vamos a ver!', time: '14:32', isAdmin: false, isHot: true },
  { id: 2, user: 'Jinete_Oscuro', avatar: '🎯', message: 'Smart Pick es la estrategia segura hoy', time: '14:33', isAdmin: false },
  { id: 3, user: 'ADMIN', avatar: '👑', message: 'Carrera 4 comienza en 5 minutos! Confirmen sus picks!', time: '14:34', isAdmin: true },
  { id: 4, user: 'Golden_Track', avatar: '🌟', message: 'Thunder Strike tiene las mejores odds', time: '14:35', isHot: false },
  { id: 5, user: 'FullPoint_King', avatar: '⚡', message: 'Subí 12 posiciones con un Full Point! 🔥', time: '14:36', isHot: true },
  { id: 6, user: 'DualForce_99', avatar: '💎', message: 'Alguien más usando Dual en la 6?', time: '14:37' },
  { id: 7, user: 'ADMIN', avatar: '👑', message: 'Resultado Carrera 3: Thunder Strike ganó pagando 4.20!', time: '14:38', isAdmin: true },
  { id: 8, user: 'SmartPick_Pro', avatar: '🧠', message: 'Mi ticket 2 está en el top 15, vamos!', time: '14:39' },
];

function ChatMessage({ msg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`px-3 py-2 rounded-lg ${
        msg.isAdmin
          ? 'bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20'
          : 'hover:bg-white/[0.02]'
      }`}
    >
      <div className="flex items-start gap-2">
        <span className="text-sm flex-shrink-0">{msg.avatar}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold ${msg.isAdmin ? 'text-gold' : 'text-white/70'}`}>
              {msg.user}
            </span>
            {msg.isAdmin && <Crown size={10} className="text-gold" />}
            {msg.isHot && <Flame size={10} className="text-orange-400" />}
            <span className="text-white/20 text-[10px] ml-auto">{msg.time}</span>
          </div>
          <p className={`text-xs mt-0.5 ${msg.isAdmin ? 'text-gold/80 font-medium' : 'text-white/60'}`}>
            {msg.message}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function TournamentChat() {
  const [message, setMessage] = useState('');

  return (
    <div className="flex flex-col">
      <div className="space-y-1 mb-3 max-h-[400px] overflow-y-auto">
        {mockMessages.map(msg => (
          <ChatMessage key={msg.id} msg={msg} />
        ))}
      </div>

      <div className="flex items-center gap-2 p-2 rounded-xl border border-white/10 bg-white/[0.03]">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-transparent text-white text-sm placeholder:text-white/20 outline-none px-2"
        />
        <button className="p-2 rounded-lg bg-purple/20 hover:bg-purple/30 transition-colors">
          <Send size={14} className="text-purple-light" />
        </button>
      </div>

      <p className="text-white/15 text-[10px] text-center mt-2">
        Chat del torneo - Respeta a los demas jugadores
      </p>
    </div>
  );
}
