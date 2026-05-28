import { staticFile } from '@/frontend/lib/config/paths';

const STRATEGY_LABELS = {
  full_point: 'Full Point',
  dual_point: 'Dual Point',
  smart_pick: 'Smart Pick',
};

const STRATEGY_SHORT = {
  full_point: 'full',
  dual_point: 'dual',
  smart_pick: 'smart',
};

function formatRaceTime(scheduledTime, date) {
  if (scheduledTime) return scheduledTime;
  if (date) {
    try {
      return new Date(date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch {
      return 'TBD';
    }
  }
  return 'TBD';
}

/** Map API tournament list item → LiveTournamentCard props */
export function mapTournamentForHomeCard(t) {
  const isLive = t.status === 'live';
  const openRace = (t.races || []).find(
    (r) => r.status === 'open' || r.status === 'live' || r.status === 'upcoming'
  );

  return {
    id: t.slug,
    slug: t.slug,
    trackName: t.track,
    location: t.location,
    status: isLive ? 'LIVE' : 'UPCOMING',
    currentRace: t.currentRace || 1,
    totalRaces: t.totalRaces,
    players: t.players ?? 0,
    nextRace: openRace?.scheduledTime || formatRaceTime(null, t.date),
    startTime: formatRaceTime(openRace?.scheduledTime, t.date),
    imageUrl: t.imageUrl ? staticFile(t.imageUrl.startsWith('/') ? t.imageUrl : `/${t.imageUrl}`) : undefined,
  };
}

/** Map global leaderboard entry → home top players row */
export function mapLegendForHome(player) {
  const streak = player.bestStreak ?? 0;
  return {
    rank: player.rank,
    username: player.username,
    avatar: player.username?.slice(0, 2).toUpperCase() || '??',
    avatarColor: player.avatarColor || '#7c3aed',
    totalPoints: player.totalPoints ?? 0,
    winRate: player.winRate != null ? `${Math.round(player.winRate)}%` : '—',
    streak,
    streakType: streak > 0 ? 'win' : 'loss',
    change: 'up',
  };
}

function dominantStrategy(entry) {
  const scores = [
    { key: 'full', pts: entry.fullPoints || 0 },
    { key: 'dual', pts: entry.dualPoints || 0 },
    { key: 'smart', pts: entry.smartPoints || 0 },
  ];
  scores.sort((a, b) => b.pts - a.pts);
  return scores[0].key;
}

/** Map tournament leaderboard API → TournamentRanking mock shape */
export function mapTournamentLeaderboard(leaderboard, currentUserId) {
  const players = leaderboard.map((e) => {
    const strategy = dominantStrategy(e);
    return {
      id: String(e.userId),
      position: e.rank,
      name: e.username,
      avatar: e.username?.charAt(0).toUpperCase() || '?',
      score: e.totalPoints,
      strategy,
      strategyLabel: { full: 'Full Point', dual: 'Dual Point', smart: 'Smart Pick' }[strategy] || strategy,
      posChange: 0,
      isHot: e.rank <= 3 || (e.winStreak || 0) >= 3,
      ticketsUsed: e.ticketNumber,
      bestTicket: e.ticketNumber,
      racesConfirmed: e.racesPlayed,
      mode: e.gameMode === 2 ? 'premium' : 'free',
    };
  });

  const byStrategy = (s) =>
    players.filter((p) => p.strategy === s).slice(0, 3).map((p, i) => ({ ...p, recordPosition: i + 1 }));

  const userTickets = [1, 2, 3].map((ticketNum) => {
    const entry = leaderboard.find(
      (e) => e.userId === currentUserId && e.ticketNumber === ticketNum
    );
    if (!entry) {
      return {
        ticketNum,
        position: '—',
        score: 0,
        strategy: 'full',
        strategyLabel: 'Full Point',
        posChange: 0,
        racesConfirmed: 0,
        totalRaces: 0,
        isHot: false,
        nearTop10: false,
      };
    }
    const strategy = dominantStrategy(entry);
    return {
      ticketNum,
      position: entry.rank,
      score: entry.totalPoints,
      strategy,
      strategyLabel: { full: 'Full Point', dual: 'Dual Point', smart: 'Smart Pick' }[strategy] || strategy,
      posChange: 0,
      racesConfirmed: entry.racesPlayed,
      totalRaces: entry.racesPlayed,
      isHot: entry.winStreak >= 3,
      nearTop10: entry.rank <= 15 && entry.rank > 10,
    };
  });

  return {
    players,
    allTimeRecords: players.slice(0, 3).map((p, i) => ({ ...p, recordPosition: i + 1 })),
    dualPointRecords: byStrategy('dual'),
    smartPickRecords: byStrategy('smart'),
    fullPointRecords: byStrategy('full'),
    userTickets,
    hotPlayer: players[0] || null,
    totalParticipants: players.length,
  };
}

export function mapTicketForProfile(ticket, tournament) {
  const picks = Array.isArray(ticket.picks) ? ticket.picks : [];
  const horseNames = picks
    .map((id) => ticket.horses?.find((h) => h.id === id)?.name)
    .filter(Boolean);

  return {
    id: ticket.id,
    race: ticket.raceName || `Race ${ticket.raceNumber}`,
    track: tournament?.track || tournament?.name || '—',
    strategy: STRATEGY_LABELS[ticket.strategy] || ticket.strategy,
    horses: horseNames.length ? horseNames : picks.map(String),
    pointsEarned: ticket.pointsEarned,
    date: ticket.createdAt
      ? new Date(ticket.createdAt).toLocaleDateString()
      : '—',
    strategyKey: STRATEGY_SHORT[ticket.strategy] || 'full',
    isScored: ticket.isScored,
  };
}

export function buildStrategyBreakdown(tickets) {
  const keys = ['full', 'dual', 'smart'];
  const apiKeys = ['full_point', 'dual_point', 'smart_pick'];
  const labels = { full: 'Full Point', dual: 'Dual Point', smart: 'Smart Pick' };
  const colors = { full: '#7c3aed', dual: '#06b6d4', smart: '#f59e0b' };
  const out = {};

  keys.forEach((k, i) => {
    const strat = apiKeys[i];
    const subset = tickets.filter((t) => t.strategy === strat);
    const wins = subset.filter((t) => t.pointsEarned > 0).length;
    const totalPoints = subset.reduce((s, t) => s + (t.pointsEarned || 0), 0);
    out[k] = {
      count: subset.length,
      wins,
      winRate: subset.length ? Math.round((wins / subset.length) * 100) : 0,
      totalPoints,
      color: colors[k],
      label: labels[k],
      best: subset.reduce((m, t) => Math.max(m, t.pointsEarned || 0), 0),
    };
  });

  return out;
}
