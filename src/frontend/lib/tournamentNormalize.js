const RACES_PER_TOURNAMENT = 7;

function normalizeHorse(h) {
  return {
    ...h,
    silkColors: { primary: h.silkPrimary || "#7c3aed", secondary: h.silkSecondary || "#ffffff" },
    weight: 54 + (h.postPosition % 8),
  };
}

export function normalizeRace(race) {
  return {
    ...race,
    number: race.raceNumber,
    class: race.raceClass || "",
    postTime: race.scheduledTime || "",
    surface: race.surface || "Dirt",
    distance: race.distance || 1200,
    tournamentRace: true,
    horses: (race.horses || []).map(normalizeHorse),
  };
}

export function normalizeTournament(t) {
  const races = (t.races || [])
    .slice()
    .sort((a, b) => (a.raceNumber || 0) - (b.raceNumber || 0))
    .slice(0, RACES_PER_TOURNAMENT);
  return {
    ...t,
    totalRaces: RACES_PER_TOURNAMENT,
    races: races.map(normalizeRace),
  };
}

export { RACES_PER_TOURNAMENT };
