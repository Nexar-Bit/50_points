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

export function getUsedTicketMeta(trackSlug, ticketNum) {
  const entry = readAll()[trackSlug];
  if (!entry) return null;
  return entry.tickets?.[String(ticketNum)] || null;
}

export function isTrackTicketUsed(trackSlug, ticketNum) {
  return getUsedTicketsForTrack(trackSlug).includes(Number(ticketNum));
}

export function markTrackTicketUsed(
  trackSlug,
  ticketNum,
  tournamentSlug,
  tournamentName = "",
) {
  if (!trackSlug || !ticketNum) return;
  const all = readAll();
  const prev = all[trackSlug] || { used: [], tournamentSlug: null, tickets: {} };
  const used = new Set(prev.used || []);
  used.add(Number(ticketNum));
  const tickets = { ...(prev.tickets || {}) };
  tickets[String(ticketNum)] = {
    tournamentSlug: tournamentSlug || prev.tournamentSlug || tickets[String(ticketNum)]?.tournamentSlug,
    tournamentName:
      tournamentName ||
      tickets[String(ticketNum)]?.tournamentName ||
      prev.tournamentName ||
      "",
  };
  all[trackSlug] = {
    used: [...used].sort((a, b) => a - b),
    tournamentSlug: tournamentSlug || prev.tournamentSlug,
    tickets,
  };
  writeAll(all);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("50points-tickets-updated"));
  }
}

export function unmarkTrackTicketUsed(trackSlug, ticketNum) {
  if (!trackSlug || !ticketNum) return;
  const all = readAll();
  const prev = all[trackSlug];
  if (!prev) return;
  const used = (prev.used || []).filter((n) => n !== Number(ticketNum));
  const tickets = { ...(prev.tickets || {}) };
  delete tickets[String(ticketNum)];
  if (used.length === 0) {
    delete all[trackSlug];
  } else {
    all[trackSlug] = { ...prev, used, tickets };
  }
  writeAll(all);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("50points-tickets-updated"));
  }
}
