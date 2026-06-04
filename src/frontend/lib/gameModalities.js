/**
 * Four platform modalities — each has a unique ambient color so players
 * always know where they are. Flow: Modalidades → Hipódromos → Tickets → Torneo.
 */

export const MODALITY_IDS = ["guest", "free", "paid", "special"];

export const MODALITIES = {
  guest: {
    id: "guest",
    accent: "#7c3aed",
    bgBase: "#f3f0fa",
    bgGradient:
      "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(124, 58, 237, 0.14) 0%, transparent 55%), linear-gradient(180deg, #faf9fc 0%, #f0ebf8 50%, #ebe6f5 100%)",
    border: "rgba(124, 58, 237, 0.65)",
    glow: "rgba(124, 58, 237, 0.18)",
    hubInverted: true,
    gameMode: 1,
    available: true,
    icon: "user",
  },
  free: {
    id: "free",
    accent: "#a855f7",
    bgBase: "#100818",
    bgGradient:
      "radial-gradient(ellipse 120% 80% at 15% 0%, rgba(124, 58, 237, 0.45) 0%, transparent 55%), radial-gradient(ellipse 90% 60% at 85% 100%, rgba(168, 85, 247, 0.22) 0%, transparent 50%), #0b0612",
    border: "rgba(168, 85, 247, 0.45)",
    glow: "rgba(168, 85, 247, 0.28)",
    gameMode: 2,
    available: true,
    icon: "trophy",
  },
  paid: {
    id: "paid",
    accent: "#22d3ee",
    bgBase: "#061218",
    bgGradient:
      "radial-gradient(ellipse 120% 80% at 12% 0%, rgba(6, 182, 212, 0.4) 0%, transparent 55%), radial-gradient(ellipse 90% 60% at 88% 100%, rgba(34, 211, 238, 0.18) 0%, transparent 50%), #050d12",
    border: "rgba(34, 211, 238, 0.4)",
    glow: "rgba(34, 211, 238, 0.25)",
    gameMode: 3,
    available: false,
    icon: "ticket",
  },
  special: {
    id: "special",
    accent: "#fbbf24",
    bgBase: "#121008",
    bgGradient:
      "radial-gradient(ellipse 120% 80% at 10% 0%, rgba(245, 158, 11, 0.38) 0%, transparent 55%), radial-gradient(ellipse 90% 60% at 90% 100%, rgba(251, 191, 36, 0.2) 0%, transparent 50%), #0f0c06",
    border: "rgba(251, 191, 36, 0.42)",
    glow: "rgba(251, 191, 36, 0.22)",
    gameMode: 4,
    available: false,
    icon: "star",
  },
};

const STORAGE_KEY = "50points_active_modality";

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

/** Hub screen visual order (matches design spec: 1 free, 2 paid, 3 special, 4 guest). */
export const HUB_DISPLAY_ORDER = ["free", "paid", "special", "guest"];

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
  if (!modalityId || !href.startsWith("/")) return href;
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}modality=${modalityId}`;
}
