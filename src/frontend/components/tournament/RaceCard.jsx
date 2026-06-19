'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, ChevronDown, Check, Lock } from 'lucide-react';
import { strategies } from './PickSelector';

function JockeySilk({ primary, secondary, size = 24 }) {
  return (
    <div
      className="rounded-sm flex-shrink-0 overflow-hidden flex"
      style={{ width: size, height: size }}
    >
      <div style={{ backgroundColor: primary, width: '50%', height: '100%' }} />
      <div style={{ backgroundColor: secondary, width: '50%', height: '100%' }} />
    </div>
  );
}

const postPositionColors = [
  { bg: '#E31937', text: '#FFFFFF' },  // 1 - Red
  { bg: '#FFFFFF', text: '#000000' },  // 2 - White
  { bg: '#003DA5', text: '#FFFFFF' },  // 3 - Royal Blue
  { bg: '#FFD100', text: '#000000' },  // 4 - Yellow
  { bg: '#00843D', text: '#FFFFFF' },  // 5 - Green
  { bg: '#000000', text: '#FFD100' },  // 6 - Black w/ yellow
  { bg: '#FF6900', text: '#FFFFFF' },  // 7 - Orange
  { bg: '#E5007D', text: '#FFFFFF' },  // 8 - Pink
  { bg: '#00B5E2', text: '#FFFFFF' },  // 9 - Turquoise
  { bg: '#6F2DA8', text: '#FFFFFF' },  // 10 - Purple
  { bg: '#A7A8AA', text: '#000000' },  // 11 - Grey
  { bg: '#78BE20', text: '#000000' },  // 12 - Lime
];

function PostBadge({ number }) {
  const colorSet = postPositionColors[(number - 1) % postPositionColors.length];
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{ backgroundColor: colorSet.bg, color: colorSet.text, border: number === 2 ? '1px solid rgba(255,255,255,0.2)' : 'none' }}
    >
      {number}
    </div>
  );
}

export default function RaceCard({
  race,
  activeStrategy,
  selectedHorses,
  confirmedStrategy,
  onPickHorse,
  onStrategyChange,
  isExpanded = true,
  onToggleExpand,
  showHeader = true,
  tournamentRace = true,
}) {
  const strategy = strategies.find((s) => s.id === activeStrategy);
  const maxPicks = strategy?.maxPicks || 1;
  const allocation = strategy?.allocation || [50];

  const getHorsePoints = (horseId) => {
    const idx = selectedHorses.indexOf(horseId);
    if (idx === -1) return 0;
    return allocation[idx] || 0;
  };

  const isSelected = (horseId) => selectedHorses.includes(horseId);
  const canPick = selectedHorses.length < maxPicks;

  const surfaceColors = {
    Dirt: 'text-amber-400 bg-amber-400/10',
    Turf: 'text-green-400 bg-green-400/10',
    Synthetic: 'text-cyan-400 bg-cyan-400/10',
  };

  const statusColors = {
    completed: 'bg-white/10 text-white/50',
    live: 'bg-red-500/20 text-red-400',
    upcoming: 'bg-purple/20 text-purple-light',
  };

  const isCompleted = race.status === 'completed';
  const isNonTournament = !tournamentRace;

  const strategyStripConfig = confirmedStrategy ? ({
    full:  { borderColor: 'border-l-purple',      bgTint: 'bg-purple/[0.07]',      numGradient: 'from-purple to-purple-light' },
    dual:  { borderColor: 'border-l-cyan',         bgTint: 'bg-cyan/[0.07]',         numGradient: 'from-cyan to-cyan' },
    smart: { borderColor: 'border-l-yellow-400',   bgTint: 'bg-yellow-400/[0.07]',   numGradient: 'from-gold to-gold' },
  })[confirmedStrategy] : null;

  // A confirmed (already-picked) race row should feel "settled": slight opacity, no hover noise
  const isConfirmed = Boolean(confirmedStrategy);
  const picksLocked = !onPickHorse;

  return (
    <div className={`rounded-xl overflow-hidden backdrop-blur-lg transition-opacity duration-300 ${
      isNonTournament
        ? 'border border-white/[0.04] bg-white/[0.008] opacity-[0.35]'
        : strategyStripConfig
          ? `border border-l-[3px] ${strategyStripConfig.borderColor} border-white/10 ${strategyStripConfig.bgTint} opacity-75`
          : 'border border-white/10 bg-white/[0.03]'
    }`}>
      {/* Race header */}
      {showHeader && (
        <button
          onClick={isNonTournament ? undefined : onToggleExpand}
          className={`w-full flex items-center justify-between p-4 md:p-5 transition-colors ${isNonTournament ? 'cursor-default' : 'hover:bg-white/[0.02]'}`}
        >
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
              isNonTournament
                ? 'bg-white/[0.06] text-white/20'
                : strategyStripConfig
                  ? `bg-gradient-to-br ${strategyStripConfig.numGradient} text-white`
                  : 'bg-gradient-to-br from-cyan to-purple text-white'
            }`}>
              {isNonTournament
                ? <Lock size={16} />
                : isConfirmed
                  ? <Check size={16} />
                  : `C${race.number}`}
            </div>
            <div className="text-left min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-semibold text-sm md:text-base truncate ${isNonTournament ? 'text-white/25' : 'text-white'}`}>
                  {race.name !== `Race ${race.number}` ? race.name : `CARRERA ${race.number}`}
                </span>
                {isNonTournament ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white/[0.06] text-white/20">
                    BLOQUEADA
                  </span>
                ) : strategyStripConfig ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-green-500/20 text-green-400 flex items-center gap-1">
                    <Check size={10} />
                    LISTO
                  </span>
                ) : (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusColors[race.status]}`}>
                    {race.status === 'live' && (
                      <span className="inline-block w-1.5 h-1.5 bg-red-400 rounded-full mr-1 animate-pulse-live" />
                    )}
                    {race.status === 'live' ? 'EN VIVO' : race.status === 'upcoming' ? 'PROXIMO' : 'COMPLETADO'}
                  </span>
                )}
              </div>
              <div className={`flex items-center gap-3 mt-0.5 text-xs ${isNonTournament ? 'text-white/15' : 'text-white/40'}`}>
                <span>{race.distance} furlones</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${isNonTournament ? 'text-white/15 bg-white/[0.03]' : surfaceColors[race.surface]}`}>
                  Pista
                </span>
                <span className="hidden sm:inline">{race.class}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {confirmedStrategy && (() => {
              const cs = strategies.find((s) => s.id === confirmedStrategy);
              return cs ? (
                <div className={`race-strategy-strip__confirmed race-strategy-strip__confirmed--${confirmedStrategy}`}>
                  <span className="race-strategy-strip__name">{cs.name}</span>
                </div>
              ) : null;
            })()}
            <div className={`hidden md:flex items-center gap-1 text-xs ${isNonTournament ? 'text-white/15' : 'text-white/40'}`}>
              <span>{race.horses.length} participantes</span>
            </div>
            <div className={`hidden sm:flex items-center gap-1 text-xs ${isNonTournament ? 'text-white/15' : 'text-white/40'}`}>
              <Clock size={12} />
              <span>{race.postTime}</span>
            </div>
            {!isNonTournament && (
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={18} className="text-white/30" />
              </motion.div>
            )}
          </div>
        </button>
      )}

      {/* Expandable race content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {/* Inline strategy selector */}
            {onStrategyChange && (
              <div className="race-strategy-strip">
                <div className="race-strategy-strip__head">
                  <span className="race-strategy-strip__label">Estrategia</span>
                  <div className="race-strategy-strip__head-line" aria-hidden />
                  <span className="race-strategy-strip__meta">{race.horses.length} participantes</span>
                </div>
                <div className="race-strategy-strip__bars">
                  {strategies.map((s) => {
                    const isActive = activeStrategy === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => onStrategyChange(s.id)}
                        className={`race-strategy-strip__bar race-strategy-strip__bar--${s.id}${
                          isActive ? " race-strategy-strip__bar--active" : ""
                        }`}
                      >
                        <span className="race-strategy-strip__name">{s.name}</span>
                        <div className="race-strategy-strip__points">
                          {s.allocation.map((pts, idx) => {
                            const isBlocked = isActive && idx < selectedHorses.length;
                            return (
                              <div
                                key={idx}
                                className={`race-strategy-strip__point-wrap${
                                  isBlocked ? " race-strategy-strip__point-wrap--blocked" : ""
                                }`}
                              >
                                <span
                                  className={`race-strategy-strip__point${
                                    isBlocked ? " race-strategy-strip__point--blocked" : ""
                                  }`}
                                >
                                  {pts}
                                  {isBlocked ? (
                                    <span className="race-strategy-strip__point-block" aria-hidden />
                                  ) : null}
                                </span>
                                <span className="race-strategy-strip__point-label">PUNTOS</span>
                              </div>
                            );
                          })}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Race meta bar */}
            <div className="flex items-center gap-4 px-4 md:px-5 py-2 border-t border-b border-white/5 bg-white/[0.01] text-xs text-white/40 flex-wrap">
              <div className="flex items-center gap-1">
                <MapPin size={11} />
                <span>{race.distance} furlones - Pista</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={11} />
                <span>{race.postTime}</span>
              </div>
              <span className="text-white/20">{race.class}</span>
            </div>

            {/* Desktop table header */}
            <div className="hidden md:grid grid-cols-[40px_32px_1fr_1fr_1fr_60px_70px_100px] gap-3 px-5 py-2 text-[10px] text-white/30 uppercase tracking-wider font-medium border-b border-white/5">
              <span>#</span>
              <span>Seda</span>
              <span>Caballo</span>
              <span>Jinete</span>
              <span>Entrenador</span>
              <span className="text-right">Peso</span>
              <span className="text-right">Cuota</span>
              <span className="text-center">Elegir</span>
            </div>

            {/* Horse list */}
            <div className="divide-y divide-white/5">
              {race.horses.map((horse, idx) => {
                const selected = isSelected(horse.id);
                const points = getHorsePoints(horse.id);
                const selectionIdx = selectedHorses.indexOf(horse.id);

                return (
                  <motion.div
                    key={horse.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`
                      transition-all duration-200
                      ${selected
                        ? 'bg-purple/10 border-l-2 border-l-purple'
                        : 'hover:bg-white/[0.02] border-l-2 border-l-transparent'
                      }
                    `}
                  >
                    {/* Desktop row */}
                    <div className="hidden md:grid grid-cols-[40px_32px_1fr_1fr_1fr_60px_70px_100px] gap-3 items-center px-5 py-3">
                      <PostBadge number={horse.postPosition} />
                      <JockeySilk primary={horse.silkColors.primary} secondary={horse.silkColors.secondary} />
                      <span className="text-white font-semibold text-sm truncate">{horse.name}</span>
                      <span className="text-white/50 text-xs truncate">{horse.jockey}</span>
                      <span className="text-white/40 text-xs truncate">{horse.trainer}</span>
                      <span className="text-white/50 text-xs text-right">{horse.weight}kg</span>
                      <span className="text-gold font-bold text-sm text-right">{horse.odds.toFixed(2)}</span>
                      <div className="flex items-center justify-center gap-2">
                        {selected && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`
                              text-[10px] font-bold px-1.5 py-0.5 rounded
                              ${strategy?.tagColors?.[selectionIdx] || 'bg-purple'} text-white
                            `}
                          >
                            {points}pts
                          </motion.span>
                        )}
                        <motion.button
                          whileHover={picksLocked ? undefined : { scale: 1.05 }}
                          whileTap={picksLocked ? undefined : { scale: 0.95 }}
                          onClick={() => onPickHorse?.(horse.id)}
                          disabled={picksLocked || (!canPick && !selected)}
                          className={`
                            px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 min-w-[60px]
                            ${selected
                              ? 'bg-gradient-to-r from-purple to-purple-light text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                              : canPick
                                ? 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10 hover:border-purple/50'
                                : 'bg-white/[0.02] text-white/20 border border-white/5 cursor-not-allowed'
                            }
                          `}
                        >
                          {selected ? (
                            <span className="flex items-center gap-1 justify-center">
                              <Check size={12} />
                              Elegido
                            </span>
                          ) : (
                            'Elegir'
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Mobile card */}
                    <div className="md:hidden p-3">
                      <div className="flex items-center gap-3">
                        <PostBadge number={horse.postPosition} />
                        <JockeySilk primary={horse.silkColors.primary} secondary={horse.silkColors.secondary} size={20} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold text-sm truncate">{horse.name}</span>
                            <span className="text-gold font-bold text-xs">{horse.odds.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-white/40 mt-0.5">
                            <span className="truncate">{horse.jockey}</span>
                            <span className="text-white/20">|</span>
                            <span className="truncate">{horse.trainer}</span>
                            <span className="text-white/20">|</span>
                            <span>{horse.weight}kg</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {selected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={`
                                text-[10px] font-bold px-1.5 py-0.5 rounded
                                ${strategy?.tagColors?.[selectionIdx] || 'bg-purple'} text-white
                              `}
                            >
                              {points}pts
                            </motion.span>
                          )}
                          <motion.button
                            whileTap={picksLocked ? undefined : { scale: 0.9 }}
                            onClick={() => onPickHorse?.(horse.id)}
                            disabled={picksLocked || (!canPick && !selected)}
                            className={`
                              w-9 h-9 rounded-lg flex items-center justify-center transition-all
                              ${selected
                                ? 'bg-gradient-to-r from-purple to-purple-light text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]'
                                : canPick
                                  ? 'bg-white/5 text-white/50 border border-white/10'
                                  : 'bg-white/[0.02] text-white/15 border border-white/5 cursor-not-allowed'
                              }
                            `}
                          >
                            {selected ? <Check size={14} /> : '+'}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
