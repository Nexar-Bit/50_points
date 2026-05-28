'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Target, Layers, Zap } from 'lucide-react';

const strategies = [
  {
    id: 'full',
    name: 'FULL POINT',
    description: '50 puntos en 1 caballo',
    maxPicks: 1,
    allocation: [50],
    icon: Target,
    gradient: 'from-purple to-purple-light',
    borderColor: 'border-purple',
    glowColor: 'shadow-[0_0_30px_rgba(124,58,237,0.5)]',
    bgActive: 'bg-purple/20',
    tagColors: ['bg-purple'],
  },
  {
    id: 'dual',
    name: 'DUAL POINT',
    description: '25 puntos en 2 caballos',
    maxPicks: 2,
    allocation: [25, 25],
    icon: Layers,
    gradient: 'from-purple to-cyan',
    borderColor: 'border-purple',
    glowColor: 'shadow-[0_0_30px_rgba(124,58,237,0.3),0_0_30px_rgba(6,182,212,0.3)]',
    bgActive: 'bg-gradient-to-r from-purple/20 to-cyan/20',
    tagColors: ['bg-purple', 'bg-cyan'],
  },
  {
    id: 'smart',
    name: 'SMART PICK',
    description: '30 / 15 / 5 en 3 caballos',
    maxPicks: 3,
    allocation: [30, 15, 5],
    icon: Zap,
    gradient: 'from-purple via-cyan to-gold',
    borderColor: 'border-cyan',
    glowColor: 'shadow-[0_0_20px_rgba(124,58,237,0.3),0_0_20px_rgba(6,182,212,0.3),0_0_20px_rgba(245,158,11,0.3)]',
    bgActive: 'bg-gradient-to-r from-purple/15 via-cyan/15 to-gold/15',
    tagColors: ['bg-purple', 'bg-cyan', 'bg-gold'],
  },
];

export { strategies };

export default function PickSelector({ activeStrategy, onStrategyChange, picksCount, totalPoints }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">
          Estrategia de Seleccion
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">Puntos restantes:</span>
          <motion.span
            key={totalPoints}
            initial={{ scale: 1.3, color: '#a855f7' }}
            animate={{ scale: 1, color: totalPoints === 0 ? '#22c55e' : '#f59e0b' }}
            className="text-sm font-bold"
          >
            {totalPoints}
          </motion.span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {strategies.map((strategy) => {
          const isActive = activeStrategy === strategy.id;
          const Icon = strategy.icon;

          return (
            <motion.button
              key={strategy.id}
              onClick={() => onStrategyChange(strategy.id)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative rounded-xl border p-4 text-left transition-all duration-300 overflow-hidden
                ${isActive
                  ? `${strategy.bgActive} ${strategy.borderColor} ${strategy.glowColor} border-opacity-60`
                  : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                }
              `}
            >
              {/* Active indicator bar */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${strategy.gradient}`}
                  />
                )}
              </AnimatePresence>

              <div className="flex items-start gap-3">
                <div className={`
                  p-2 rounded-lg
                  ${isActive
                    ? `bg-gradient-to-br ${strategy.gradient} text-white`
                    : 'bg-white/5 text-white/40'
                  }
                `}>
                  <Icon size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold tracking-wider ${isActive ? 'text-white' : 'text-white/60'}`}>
                      {strategy.name}
                    </span>
                    {isActive && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-1.5 h-1.5 rounded-full bg-green-400"
                      />
                    )}
                  </div>
                  <p className={`text-xs ${isActive ? 'text-white/70' : 'text-white/30'}`}>
                    {strategy.description}
                  </p>

                  {/* Point allocation tags */}
                  <div className="flex gap-1 mt-2">
                    {strategy.allocation.map((pts, idx) => (
                      <span
                        key={idx}
                        className={`
                          text-[10px] font-bold px-1.5 py-0.5 rounded
                          ${isActive
                            ? `${strategy.tagColors[idx]} text-white`
                            : 'bg-white/5 text-white/30'
                          }
                        `}
                      >
                        {pts}pts
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
