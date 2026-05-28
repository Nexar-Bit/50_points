'use client';

import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, TrendingUp, TrendingDown, Flame, Star, Zap } from 'lucide-react';

const strategyDot = {
  full: 'bg-purple',
  dual: 'bg-cyan',
  smart: 'bg-gold',
};

const strategyText = {
  full: 'text-purple-light',
  dual: 'text-cyan',
  smart: 'text-gold',
};

const positionBadge = {
  1: 'from-yellow-400 to-amber-600',
  2: 'from-gray-300 to-gray-500',
  3: 'from-amber-600 to-orange-800',
};

function RecordCard({ player, index }) {
  const icons = [Crown, Trophy, Medal];
  const Icon = icons[index] || Medal;
  const gradient = positionBadge[index + 1] || 'from-purple to-cyan';
  const sizes = ['scale-110', 'scale-100', 'scale-95'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative flex-1 ${sizes[index]}`}
    >
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
        <div className={`absolute inset-0 bg-gradient-to-b ${gradient} opacity-[0.08]`} />
        <div className="relative">
          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${gradient} mb-1.5`}>
            <Icon size={14} className="text-black" />
          </div>
          <div className="text-xl mb-0.5">{player.avatar}</div>
          <p className="text-white text-xs font-semibold truncate">{player.name}</p>
          <p className={`text-sm font-bold ${strategyText[player.strategy]} mt-0.5`}>
            {player.score.toLocaleString()}
          </p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className={`w-2 h-2 rounded-full ${strategyDot[player.strategy]}`} />
            <span className="text-white/40 text-[10px]">{player.strategyLabel}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RecordSection({ title, icon, records, accentColor = 'text-white' }) {
  if (!records || records.length === 0) return null;

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className={`text-sm font-bold ${accentColor} uppercase tracking-wider`}>{title}</h3>
      </div>
      <div className="flex gap-2 items-end">
        {records.map((player, i) => (
          <RecordCard key={player.id} player={player} index={i} />
        ))}
      </div>
    </div>
  );
}

function PlayerRow({ player, index }) {
  const isUp = player.posChange > 0;
  const isDown = player.posChange < 0;
  const isTop3 = player.position <= 3;
  const gradient = positionBadge[player.position];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
        isTop3 ? 'bg-white/[0.05] border border-white/10' : 'hover:bg-white/[0.03]'
      }`}
    >
      <div className="w-7 text-center">
        {gradient ? (
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br ${gradient} text-[11px] font-bold text-black`}>
            {player.position}
          </span>
        ) : (
          <span className="text-white/40 text-sm font-medium">{player.position}</span>
        )}
      </div>

      <div className="text-lg">{player.avatar}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-white text-sm font-medium truncate">{player.name}</span>
          {player.isHot && <Flame size={12} className="text-orange-400 animate-pulse flex-shrink-0" />}
          {player.mode === 'premium' && <Star size={11} className="text-gold flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`w-2 h-2 rounded-full ${strategyDot[player.strategy]}`} />
          <span className="text-white/30 text-[10px]">{player.strategyLabel}</span>
          <span className="text-white/20 text-[10px]">·</span>
          <span className="text-white/30 text-[10px]">Ticket {player.bestTicket}/{player.ticketsUsed}</span>
        </div>
      </div>

      <div className="text-right">
        <span className={`text-sm font-bold ${strategyText[player.strategy]}`}>
          {player.score.toLocaleString()}
        </span>
        {player.posChange !== 0 && (
          <div className={`flex items-center justify-end gap-0.5 mt-0.5 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            <span className="text-[10px] font-semibold">{isUp ? '+' : ''}{player.posChange}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function TournamentRanking({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-4">
      <RecordSection
        title="Record de All Time"
        icon={<Trophy size={16} className="text-gold" />}
        records={data.allTimeRecords}
        accentColor="text-gold"
      />

      <RecordSection
        title="Record de Full Point"
        icon={<Zap size={16} className="text-purple-light" />}
        records={data.fullPointRecords}
        accentColor="text-purple-light"
      />

      <RecordSection
        title="Record de Dual Point"
        icon={<span className="text-cyan text-sm">⚡</span>}
        records={data.dualPointRecords}
        accentColor="text-cyan"
      />

      <RecordSection
        title="Record de Smart Pick"
        icon={<span className="text-gold text-sm">🧠</span>}
        records={data.smartPickRecords}
        accentColor="text-gold"
      />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Clasificación General
          </h3>
          <span className="text-white/30 text-xs">{data.totalParticipants} jugadores</span>
        </div>

        <div className="space-y-0.5">
          {data.players.map((player, i) => (
            <PlayerRow key={player.id} player={player} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
