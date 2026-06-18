import { staticFile } from "@/frontend/lib/config/paths";

const BASE = "/images/tournament-guide";

export const TOURNAMENT_GUIDE_ASSET_KEYS = {
  heroHorses: "hero-horses-racing.svg",
  heroTrophy: "hero-trophy-wreath.svg",
  step1: "step-1-modality.svg",
  step2: "step-2-hipodromo.svg",
  step3: "step-3-ticket.svg",
  step4: "step-4-strategies.svg",
  step5: "step-5-confirm.svg",
  step6: "step-6-tournament.svg",
  step7: "step-7-ranking.svg",
  summaryModality: "summary-modality.svg",
  summaryTrack: "summary-track.svg",
  summaryTicket: "summary-ticket.svg",
  summaryStrategy: "summary-strategy.svg",
  summaryConfirm: "summary-confirm.svg",
  summaryTournament: "summary-tournament.svg",
  summaryRanking: "summary-ranking.svg",
};

export const TOURNAMENT_GUIDE_STEP_KEYS = [
  "step1",
  "step2",
  "step3",
  "step4",
  "step5",
  "step6",
  "step7",
];

/** @param {keyof typeof TOURNAMENT_GUIDE_ASSET_KEYS} key */
export function tournamentGuideAsset(key) {
  const file = TOURNAMENT_GUIDE_ASSET_KEYS[key];
  if (!file) return "";
  return staticFile(`${BASE}/${file}`);
}

export function tournamentGuideStepAsset(stepNum) {
  const key = TOURNAMENT_GUIDE_STEP_KEYS[stepNum - 1];
  return key ? tournamentGuideAsset(key) : "";
}

export const TOURNAMENT_GUIDE_SUMMARY_KEYS = [
  "summaryModality",
  "summaryTrack",
  "summaryTicket",
  "summaryStrategy",
  "summaryConfirm",
  "summaryTournament",
  "summaryRanking",
];
