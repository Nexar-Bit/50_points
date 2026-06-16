import { strategies } from "@/frontend/components/tournament/PickSelector";

const STRATEGY_MAP = { full: "full_point", dual: "dual_point", smart: "smart_pick" };
const STRATEGY_REVERSE = { full_point: "full", dual_point: "dual", smart_pick: "smart" };

const STRATEGY_LABEL = {
  full_point: "FULL POINT",
  dual_point: "DUAL POINT",
  smart_pick: "SMART POINT",
};

export function horsePostPosition(race, horseId) {
  const horse = race?.horses?.find(
    (h) => h.id === horseId || String(h.id) === String(horseId),
  );
  return horse?.postPosition ?? horse?.number ?? "?";
}

/** @returns {{ strategy: string|null, posts: (number|string)[], ready: boolean, draft: boolean }} */
export function getRacePickSummary(race, submittedTicket, localPicks, localStrategy) {
  if (submittedTicket) {
    const picks = Array.isArray(submittedTicket.picks) ? submittedTicket.picks : [];
    return {
      strategy: STRATEGY_LABEL[submittedTicket.strategy] || submittedTicket.strategy,
      posts: picks.map((id) => horsePostPosition(race, id)),
      ready: true,
      draft: false,
    };
  }

  if (localPicks?.length) {
    const strat = strategies.find((s) => s.id === localStrategy);
    return {
      strategy: strat?.name || null,
      posts: localPicks.map((id) => horsePostPosition(race, id)),
      ready: false,
      draft: true,
    };
  }

  return { strategy: null, posts: [], ready: false, draft: false };
}

export { STRATEGY_MAP, STRATEGY_REVERSE, STRATEGY_LABEL };
