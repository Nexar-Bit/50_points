/**
 * Four platform modalities — each has a unique ambient color so players
 * always know where they are. Flow: Modalidades → Hipódromos → Tickets → Torneo.
 */

export const MODALITY_IDS = ["guest", "free", "paid", "special"];

export const MODALITIES = {
  /** Sin registro — blue identity */
  guest: {
    id: "guest",
    accent: "#3b82f6",
    bgBase: "#060d1a",
    bgGradient:
      "radial-gradient(ellipse 120% 80% at 15% 0%, rgba(37, 99, 235, 0.42) 0%, transparent 55%), radial-gradient(ellipse 90% 60% at 85% 100%, rgba(59, 130, 246, 0.18) 0%, transparent 50%), linear-gradient(180deg, #0a1628 0%, #060d1a 50%, #040a14 100%)",
    border: "rgba(96, 165, 250, 0.45)",
    glow: "rgba(59, 130, 246, 0.28)",
    hubInverted: false,
    gameMode: 1,
    available: true,
    icon: "user",
    badgeLabel: "INVITADO",
  },
  /** Registered, plays free — magenta identity */
  free: {
    id: "free",
    accent: "#d946ef",
    bgBase: "#14061a",
    bgGradient:
      "radial-gradient(ellipse 120% 80% at 12% 0%, rgba(192, 38, 211, 0.42) 0%, transparent 55%), radial-gradient(ellipse 90% 60% at 88% 100%, rgba(217, 70, 239, 0.22) 0%, transparent 50%), linear-gradient(180deg, #1a0820 0%, #14061a 50%, #0c0410 100%)",
    border: "rgba(232, 121, 249, 0.45)",
    glow: "rgba(217, 70, 239, 0.28)",
    gameMode: 2,
    available: true,
    icon: "trophy",
    badgeLabel: "REGISTRADO",
  },
  /** Registered, pays to play — yellow identity */
  paid: {
    id: "paid",
    accent: "#facc15",
    bgBase: "#141008",
    bgGradient:
      "radial-gradient(ellipse 120% 80% at 15% 0%, rgba(234, 179, 8, 0.38) 0%, transparent 55%), radial-gradient(ellipse 90% 60% at 85% 100%, rgba(250, 204, 21, 0.2) 0%, transparent 50%), linear-gradient(180deg, #1a1406 0%, #141008 50%, #0c0a04 100%)",
    border: "rgba(250, 204, 21, 0.48)",
    glow: "rgba(250, 204, 21, 0.3)",
    gameMode: 3,
    available: false,
    icon: "ticket",
    badgeLabel: "PAGO",
  },
  special: {
    id: "special",
    accent: "#d4d4d8",
    bgBase: "#18181b",
    bgGradient:
      "radial-gradient(ellipse 120% 80% at 10% 0%, rgba(228, 228, 231, 0.12) 0%, transparent 55%), radial-gradient(ellipse 90% 60% at 90% 100%, rgba(161, 161, 170, 0.1) 0%, transparent 50%), linear-gradient(180deg, #27272a 0%, #18181b 50%, #09090b 100%)",
    border: "rgba(228, 228, 231, 0.35)",
    glow: "rgba(212, 212, 216, 0.18)",
    gameMode: 4,
    available: false,
    icon: "star",
    badgeLabel: "ESPECIAL",
  },
};

const GAME_MODE_TO_MODALITY = {
  1: "guest",
  2: "free",
  3: "paid",
  4: "special",
};

export function gameModeToModalityId(gameMode, isGuest = false) {
  if (isGuest) return "guest";
  const mode = Number(gameMode);
  return GAME_MODE_TO_MODALITY[mode] || "free";
}

export function modalityIdToGameMode(modalityId) {
  return getModality(modalityId).gameMode;
}

/** Default modality from account (guest → guest, registered → free). */
export function defaultModalityForUser(user) {
  if (!user) return null;
  if (user.isGuest) return "guest";
  return gameModeToModalityId(user.gameMode, false);
}

/**
 * Resolve active modality: route override > ?modality > path > persisted > user.
 */
export function resolveActiveModality({
  override = null,
  pathname = "",
  searchModality = null,
  user = null,
  persisted = null,
} = {}) {
  if (isValidModalityId(override)) return override;
  if (isValidModalityId(searchModality)) return searchModality;
  const pathMatch = pathname.match(/\/modalidades\/([^/]+)/);
  if (pathMatch && isValidModalityId(pathMatch[1])) return pathMatch[1];
  if (isValidModalityId(persisted)) return persisted;
  const fromUser = defaultModalityForUser(user);
  if (fromUser) return fromUser;
  return "free";
}

/** Tailwind badge classes for leaderboard / ranking rows */
export function getModalityBadgeClasses(gameMode, isGuest = false) {
  const mod = getModality(gameModeToModalityId(gameMode, isGuest));
  const id = mod.id;
  const map = {
    guest: "bg-blue-600/20 text-blue-300 border-blue-500/40",
    free: "bg-fuchsia-600/20 text-fuchsia-300 border-fuchsia-500/40",
    paid: "bg-yellow-600/20 text-yellow-300 border-yellow-500/40",
    special: "bg-zinc-600/25 text-zinc-300 border-zinc-400/40",
  };
  return {
    className: map[id] || map.free,
    label: mod.badgeLabel || id.toUpperCase(),
  };
}

export function applyModalityToDocument(modalityId) {
  if (typeof document === "undefined") return;
  const id = isValidModalityId(modalityId) ? modalityId : "free";
  const mod = getModality(id);
  const root = document.documentElement;
  root.setAttribute("data-modality", id);
  root.style.setProperty("--modality-accent", mod.accent);
  root.style.setProperty("--modality-border", mod.border);
  root.style.setProperty("--modality-glow", mod.glow);
  root.style.setProperty("--modality-bg", mod.bgGradient);
}

export function clearModalityFromDocument() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.removeAttribute("data-modality");
  root.style.removeProperty("--modality-accent");
  root.style.removeProperty("--modality-border");
  root.style.removeProperty("--modality-glow");
  root.style.removeProperty("--modality-bg");
}

const STORAGE_KEY = "50points_active_modality";
const COVER_PASSED_KEY = "50points_cover_passed";

export function isValidModalityId(id) {
  return MODALITY_IDS.includes(id);
}

export function getModality(id) {
  return MODALITIES[isValidModalityId(id) ? id : "free"];
}

export function persistModality(id) {
  if (typeof window === "undefined" || !isValidModalityId(id)) return;
  sessionStorage.setItem(STORAGE_KEY, id);
}

export function clearPersistedModality() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

/** Cover screen (homepage hero) was completed this load before entering /inicio. */
export function markCoverPassed() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(COVER_PASSED_KEY, "1");
}

export function hasCoverPassed() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(COVER_PASSED_KEY) === "1";
}

export function clearCoverPassed() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(COVER_PASSED_KEY);
}

export function readPersistedModality() {
  if (typeof window === "undefined") return null;
  const id = sessionStorage.getItem(STORAGE_KEY);
  return isValidModalityId(id) ? id : null;
}

/** Guest modality first for guests; otherwise free → guest → paid → special. */
export function hubModalityOrder(isGuest) {
  if (isGuest) return ["guest", "free", "paid", "special"];
  return ["free", "guest", "paid", "special"];
}

/** Hub sidebar order: paid (purple) → free (cyan) → special (gold) → guest (white). */
export const HUB_DISPLAY_ORDER = ["paid", "free", "special", "guest"];

export function trackSlug(trackName) {
  return encodeURIComponent(
    String(trackName || "track")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-"),
  );
}

export function trackFromSlug(slug, tracks) {
  const decoded = decodeURIComponent(slug || "").replace(/-/g, " ");
  return tracks.find(
    (t) => trackSlug(t) === slug || t.toLowerCase() === decoded.toLowerCase(),
  );
}

export function modalityPath(modalityId, segment, params = {}) {
  const base = `/modalidades/${modalityId}`;
  if (segment === "hub") return "/modalidades";
  if (segment === "tracks") return base;
  if (segment === "tickets" && params.trackSlug) return `${base}/${params.trackSlug}`;
  return base;
}

export function withModalityQuery(href, modalityId) {
  if (!href || typeof href !== "string") return href || "/";
  if (!modalityId || !href.startsWith("/")) return href;
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}modality=${modalityId}`;
}

/** Direct tournament entry from hipódromo ticket (free flow). */
export function buildTournamentEntryHref({
  tournamentSlug,
  modalityId,
  ticketNum,
  trackSlug,
  returnPath,
  playFirst = false,
}) {
  const params = new URLSearchParams();
  if (modalityId) params.set("modality", modalityId);
  if (ticketNum != null) params.set("ticket", String(ticketNum));
  if (trackSlug) params.set("track", trackSlug);
  if (returnPath) params.set("return", returnPath);
  if (playFirst) params.set("play", "1");
  const qs = params.toString();
  return `/tournament/${tournamentSlug}${qs ? `?${qs}` : ""}`;
}

export function buildModalityReturnPath(modalityId, trackSlug) {
  const base = `/modalidades/${modalityId}`;
  return trackSlug ? `${base}?track=${encodeURIComponent(trackSlug)}` : base;
}
