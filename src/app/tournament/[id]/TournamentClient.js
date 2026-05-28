'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Users, Trophy, Clock, ChevronLeft,
  Flame, Timer, CheckCircle2, ArrowRight, Zap,
} from 'lucide-react';
import Link from 'next/link';
import RaceCard from '@/frontend/components/tournament/RaceCard';
import PickSelector, { strategies } from '@/frontend/components/tournament/PickSelector';
import TicketSummary from '@/frontend/components/tournament/TicketSummary';
import TicketConfirmation from '@/frontend/components/tournament/TicketConfirmation';
import { useAuth } from '@/frontend/contexts/AuthContext';
import { fetchJson, fetchAuthJson } from '@/frontend/lib/api/client';

const STRATEGY_MAP = { full: 'full_point', dual: 'dual_point', smart: 'smart_pick' };
const STRATEGY_REVERSE = { full_point: 'full', dual_point: 'dual', smart_pick: 'smart' };

function normalizeHorse(h) {
  return {
    ...h,
    silkColors: { primary: h.silkPrimary || '#7c3aed', secondary: h.silkSecondary || '#ffffff' },
    weight: 54 + (h.postPosition % 8),
  };
}

function normalizeRace(race) {
  return {
    ...race,
    number: race.raceNumber,
    class: race.raceClass || '',
    postTime: race.scheduledTime || '',
    surface: race.surface || 'Dirt',
    distance: race.distance || 1200,
    tournamentRace: true,
    horses: (race.horses || []).map(normalizeHorse),
  };
}

function normalizeTournament(t) {
  return {
    ...t,
    playersJoined: t._count?.tickets || 0,
    totalPlayers: Math.max(2000, (t._count?.tickets || 0) + 500),
    racesCompleted: t.currentRace || 0,
    races: (t.races || []).map(normalizeRace),
  };
}

function TournamentSkeleton() {
  return (
    <div className="min-h-screen bg-brand-dark animate-pulse">
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-8">
          <div className="h-4 w-32 bg-white/5 rounded mb-6" />
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex-1">
              <div className="h-6 w-20 bg-white/5 rounded-full mb-3" />
              <div className="h-3 w-16 bg-white/5 rounded mb-2" />
              <div className="h-10 w-3/4 bg-white/5 rounded mb-2" />
              <div className="h-6 w-48 bg-white/5 rounded mb-3" />
              <div className="h-4 w-64 bg-white/5 rounded mb-5" />
              <div className="flex gap-3">
                <div className="h-12 w-52 bg-white/5 rounded-xl" />
                <div className="h-12 w-40 bg-white/5 rounded-xl" />
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 lg:min-w-[280px]">
              <div className="h-4 w-24 bg-white/5 rounded mx-auto mb-2" />
              <div className="h-8 w-16 bg-white/5 rounded mx-auto mb-4" />
              <div className="h-1.5 bg-white/5 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="space-y-3 mt-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-white/[0.03] border border-white/10 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TournamentClient() {
  const params = useParams();
  const { token, isAuthenticated } = useAuth();

  const [tournamentRaw, setTournamentRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittedTickets, setSubmittedTickets] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [expandedRace, setExpandedRace] = useState(null);
  const [activeStrategy, setActiveStrategy] = useState('full');
  const [picks, setPicks] = useState({});
  const [confirmedStrategies, setConfirmedStrategies] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedRace, setConfirmedRace] = useState(null);
  const [activeTicketNumber, setActiveTicketNumber] = useState(1);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const slug = params.id;
    if (!slug) return;

    setLoading(true);
    fetchJson(`/tournaments/${slug}`)
      .then((data) => {
        setTournamentRaw(data.tournament);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    if (!token || !tournamentRaw) return;

    fetchAuthJson(`/tickets?tournamentId=${tournamentRaw.id}`)
      .then((data) => {
        if (!data?.tickets) return;
        const ticketMap = {};
        const stratMap = {};
        for (const t of data.tickets) {
          const key = `${t.raceId}-${t.ticketNumber}`;
          ticketMap[key] = t;
          if (t.ticketNumber === activeTicketNumber) {
            stratMap[t.raceId] = STRATEGY_REVERSE[t.strategy] || 'full';
          }
        }
        setSubmittedTickets(ticketMap);
        setConfirmedStrategies((prev) => ({ ...prev, ...stratMap }));
      })
      .catch(() => {});
  }, [token, tournamentRaw, activeTicketNumber]);

  const tournament = useMemo(() => {
    if (!tournamentRaw) return null;
    return normalizeTournament(tournamentRaw);
  }, [tournamentRaw]);

  const nextRace = useMemo(() => {
    if (!tournament) return null;
    return tournament.races.find((r) => r.status === 'upcoming' || r.status === 'live' || r.status === 'open') || tournament.races[tournament.races.length - 1];
  }, [tournament]);

  useEffect(() => {
    const targetTime = new Date();
    targetTime.setHours(targetTime.getHours() + 1, 23, 0, 0);

    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, targetTime - now);
      setCountdown({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentRacePicks = expandedRace ? (picks[expandedRace] || []) : [];
  const currentRace = tournament?.races.find((r) => r.id === expandedRace);
  const strategy = strategies.find((s) => s.id === activeStrategy);
  const totalPointsRemaining = 50 - (strategy?.allocation?.slice(0, currentRacePicks.length).reduce((s, v) => s + v, 0) || 0);
  const isPicksComplete = currentRacePicks.length === (strategy?.maxPicks || 1);

  const handlePickHorse = useCallback((horseId) => {
    if (!expandedRace) return;
    setPicks((prev) => {
      const racePicks = prev[expandedRace] || [];
      if (racePicks.includes(horseId)) {
        return { ...prev, [expandedRace]: racePicks.filter((id) => id !== horseId) };
      }
      const maxPicks = strategies.find((s) => s.id === activeStrategy)?.maxPicks || 1;
      if (racePicks.length >= maxPicks) return prev;
      return { ...prev, [expandedRace]: [...racePicks, horseId] };
    });
  }, [expandedRace, activeStrategy]);

  const handleStrategyChange = useCallback((strategyId) => {
    setActiveStrategy(strategyId);
    if (expandedRace) {
      setPicks((prev) => ({ ...prev, [expandedRace]: [] }));
    }
  }, [expandedRace]);

  const handleConfirm = useCallback(async () => {
    if (!expandedRace || submitting) return;

    const racePicks = picks[expandedRace] || [];
    if (racePicks.length === 0) return;

    if (!isAuthenticated) {
      alert('Inicia sesion o juega como invitado para enviar tu ticket');
      return;
    }

    setSubmitting(true);
    try {
      const apiStrategy = STRATEGY_MAP[activeStrategy];
      const data = await fetchAuthJson('/tickets', {
        method: 'POST',
        body: JSON.stringify({
          raceId: expandedRace,
          strategy: apiStrategy,
          picks: racePicks,
          ticketNumber: activeTicketNumber,
        }),
      });

      setConfirmedRace(expandedRace);
      setConfirmedStrategies((prev) => ({ ...prev, [expandedRace]: activeStrategy }));
      setSubmittedTickets((prev) => ({
        ...prev,
        [`${expandedRace}-${activeTicketNumber}`]: data.ticket,
      }));
      setShowConfirmation(true);
    } catch (err) {
      alert('Error de conexion');
    } finally {
      setSubmitting(false);
    }
  }, [expandedRace, activeStrategy, picks, isAuthenticated, submitting, activeTicketNumber]);

  const handleCloseConfirmation = useCallback(() => {
    setShowConfirmation(false);
    setConfirmedRace(null);
    setExpandedRace(null);
  }, []);

  const ticketKey = useCallback(
    (raceId) => `${raceId}-${activeTicketNumber}`,
    [activeTicketNumber]
  );

  const isRaceConfirmed = useCallback(
    (raceId) => !!submittedTickets[ticketKey(raceId)],
    [submittedTickets, ticketKey]
  );

  const toggleRace = useCallback(
    (raceId) => {
      if (isRaceConfirmed(raceId)) return;
      setExpandedRace((prev) => (prev === raceId ? null : raceId));
    },
    [isRaceConfirmed]
  );

  if (loading) return <TournamentSkeleton />;

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏇</div>
          <p className="text-white/40">Torneo no encontrado</p>
          <Link href="/tournaments" className="text-purple-light text-sm mt-2 inline-block hover:underline">
            Volver a Torneos
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = {
    live: { label: 'EN VIVO', color: 'bg-red-500', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]', textColor: 'text-red-400' },
    upcoming: { label: 'PROXIMO', color: 'bg-purple', glow: 'shadow-[0_0_20px_rgba(124,58,237,0.3)]', textColor: 'text-purple-light' },
    open: { label: 'ABIERTO', color: 'bg-green-500', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]', textColor: 'text-green-400' },
    completed: { label: 'COMPLETADO', color: 'bg-white/20', glow: '', textColor: 'text-white/50' },
  };
  const status = statusConfig[tournament.status] || statusConfig.upcoming;

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/live-feed.jpg" alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-brand-dark/90 to-brand-dark" />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple/5 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-8">
          <Link href="/tournaments" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-6 transition-colors">
            <ChevronLeft size={16} />
            <span>Volver a Torneos</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white ${status.color} ${status.glow}`}>
                  {tournament.status === 'live' && (
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse-live" />
                  )}
                  {status.label}
                </span>
              </div>

              <p className="text-[11px] text-purple-light uppercase tracking-[0.2em] font-bold mb-2">TORNEO</p>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-1 leading-tight">
                {tournament.name}
              </h1>

              <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-light to-cyan bg-clip-text text-transparent mb-2">
                POINT RUSH
              </p>

              <p className="text-sm sm:text-base font-bold text-white/60 uppercase tracking-widest mb-3">
                {tournament.track}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-cyan" />
                  <span>{tournament.track}, {tournament.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-purple-light" />
                  <span>{new Date(tournament.date).toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              <p className="text-white/30 text-sm mt-3 max-w-2xl">
                {tournament.description}
              </p>

              <div className="flex flex-wrap gap-3 mt-5">
                <button
                  onClick={() => {
                    if (nextRace) {
                      toggleRace(nextRace.id);
                      const el = document.getElementById(`race-${nextRace.id}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple to-purple-light hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-shadow"
                >
                  HACER MI TICKET AHORA
                  <ArrowRight size={16} />
                </button>
                <Link
                  href="/leaderboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-colors"
                >
                  <Trophy size={16} className="text-gold" />
                  VER RANKING
                </Link>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-5 lg:min-w-[280px]"
            >
              <div className="text-center mb-4">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Jugadores Activos</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-light to-cyan bg-clip-text text-transparent">
                  {tournament.playersJoined.toLocaleString()}
                </p>
                <p className="text-xs text-white/30 mt-1">de {tournament.totalPlayers.toLocaleString()} cupos</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40 flex items-center gap-1.5"><Users size={12} />Participacion</span>
                  <span className="text-white font-medium">{Math.round((tournament.playersJoined / tournament.totalPlayers) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple to-cyan rounded-full"
                    style={{ width: `${(tournament.playersJoined / tournament.totalPlayers) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-32 lg:pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-3 gap-3 mb-6">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center backdrop-blur-lg">
                <div className="flex items-center justify-center gap-1.5 text-green-400 mb-1">
                  <CheckCircle2 size={14} />
                  <span className="text-lg font-bold">{Object.keys(confirmedStrategies).length}</span>
                </div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Confirmadas</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center backdrop-blur-lg">
                <div className="flex items-center justify-center gap-1.5 text-cyan mb-1">
                  <Trophy size={14} />
                  <span className="text-lg font-bold">{tournament.races.length}</span>
                </div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">En Torneo</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center backdrop-blur-lg">
                <div className="flex items-center justify-center gap-1.5 text-purple-light mb-1">
                  <Timer size={14} />
                  <span className="text-lg font-bold">{tournament.races.length - Object.keys(confirmedStrategies).length}</span>
                </div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Pendientes</p>
              </motion.div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap size={18} className="text-purple-light" />
                Programa de Carreras
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">Ticket</span>
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      setActiveTicketNumber(n);
                      setExpandedRace(null);
                      setPicks({});
                    }}
                    className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all ${
                      activeTicketNumber === n
                        ? 'bg-purple text-white border-purple-light'
                        : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {tournament.races.map((race, idx) => (
                <motion.div key={race.id} id={`race-${race.id}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }}>
                  <RaceCard
                    race={race}
                    activeStrategy={activeStrategy}
                    selectedHorses={picks[race.id] || []}
                    confirmedStrategy={isRaceConfirmed(race.id) ? confirmedStrategies[race.id] : null}
                    onPickHorse={expandedRace === race.id ? handlePickHorse : () => {}}
                    onStrategyChange={expandedRace === race.id ? handleStrategyChange : undefined}
                    isExpanded={expandedRace === race.id}
                    onToggleExpand={() => toggleRace(race.id)}
                    tournamentRace={true}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {nextRace && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={14} className="text-cyan" />
                  <span className="text-xs text-white/40 uppercase tracking-wider font-medium">Proxima Carrera En</span>
                </div>
                <div className="flex items-center justify-center gap-3 mb-4">
                  {[
                    { value: countdown.hours, label: 'HRS' },
                    { value: countdown.minutes, label: 'MIN' },
                    { value: countdown.seconds, label: 'SEC' },
                  ].map((unit) => (
                    <div key={unit.label} className="text-center">
                      <div className="bg-white/[0.05] border border-white/10 rounded-lg w-16 h-16 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white font-mono">{String(unit.value).padStart(2, '0')}</span>
                      </div>
                      <span className="text-[9px] text-white/30 uppercase tracking-widest mt-1 block">{unit.label}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
                  <p className="text-xs text-white/50">
                    <span className="text-white font-semibold">CARRERA {nextRace.number}</span>
                    <span className="mx-1.5 text-white/20">|</span>
                    {nextRace.distance}m {nextRace.surface}
                  </p>
                  <p className="text-[10px] text-white/30 mt-0.5">{nextRace.class} - Post time {nextRace.postTime}</p>
                </div>
                <button
                  onClick={() => {
                    toggleRace(nextRace.id);
                    const el = document.getElementById(`race-${nextRace.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="mt-3 w-full py-2.5 rounded-lg text-center text-xs font-bold text-white bg-gradient-to-r from-purple to-purple-light block hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-shadow"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    Ver Carrera Completa
                    <ArrowRight size={12} />
                  </div>
                </button>
              </motion.div>
            )}

            {expandedRace && currentRace && (
              <TicketSummary raceNumber={currentRace.number} activeStrategy={activeStrategy} selectedHorses={currentRacePicks} horses={currentRace.horses} totalPoints={totalPointsRemaining} onConfirm={handleConfirm} isComplete={isPicksComplete} />
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-5">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Info del Torneo</h3>
              <div className="space-y-3">
                <InfoRow label="Pista" value={tournament.track} />
                <InfoRow label="Ubicacion" value={tournament.location} />
                <InfoRow label="Fecha" value={new Date(tournament.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })} />
                <InfoRow label="Carreras" value={`${tournament.racesCompleted} / ${tournament.totalRaces}`} />
                <InfoRow label="Entrada" value="Gratis" />
                <InfoRow label="Tipo" value="Competencia de Puntos" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-5">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Como Funciona</h3>
              <div className="space-y-2.5 text-xs text-white/50">
                <div className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple/20 text-purple-light flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
                  <p>Distribuye <span className="text-gold font-semibold">50 puntos</span> apostando al <span className="text-green-400 font-semibold">GANADOR</span> de cada carrera</p>
                </div>
                <div className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple/20 text-purple-light flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
                  <p>Full Point: 50 pts en 1 caballo. Dual: 25+25 en 2. Smart: 30+15+5 en 3</p>
                </div>
                <div className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple/20 text-purple-light flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</span>
                  <p>Todas las apuestas son al ganador. Si tu caballo gana, sumas sus puntos</p>
                </div>
                <div className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple/20 text-purple-light flex items-center justify-center text-[10px] font-bold flex-shrink-0">4</span>
                  <p>El mayor puntaje total en todas las carreras gana!</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {confirmedRace && (
        <TicketConfirmation
          isOpen={showConfirmation}
          onClose={handleCloseConfirmation}
          raceName={currentRace?.name}
          raceNumber={currentRace?.number}
          activeStrategy={activeStrategy}
          selectedHorses={picks[confirmedRace] || []}
          horses={tournament.races.find((r) => r.id === confirmedRace)?.horses || []}
          tournamentSlug={tournament.slug}
        />
      )}
    </div>
  );
}

function InfoRow({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/30">{label}</span>
      <span className={`text-xs font-medium ${highlight ? 'text-gold font-bold' : 'text-white/70'}`}>{value}</span>
    </div>
  );
}
