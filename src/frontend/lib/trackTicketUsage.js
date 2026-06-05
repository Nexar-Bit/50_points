const STORAGE_KEY = "50points_free_track_tickets_v1";

function readAll() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota */
  }
}

/** @returns {number[]} Used ticket numbers (1–3) for this track. */
export function getUsedTicketsForTrack(trackSlug) {
  const entry = readAll()[trackSlug];
  return Array.isArray(entry?.used) ? entry.used : [];
}

export function isTrackTicketUsed(trackSlug, ticketNum) {
  return getUsedTicketsForTrack(trackSlug).includes(Number(ticketNum));
}

export function markTrackTicketUsed(trackSlug, ticketNum, tournamentSlug) {
  if (!trackSlug || !ticketNum) return;
  const all = readAll();
  const prev = all[trackSlug] || { used: [], tournamentSlug: null };
  const used = new Set(prev.used || []);
  used.add(Number(ticketNum));
  all[trackSlug] = {
    used: [...used].sort((a, b) => a - b),
    tournamentSlug: tournamentSlug || prev.tournamentSlug,
  };
  writeAll(all);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("50points-tickets-updated"));
  }
}
