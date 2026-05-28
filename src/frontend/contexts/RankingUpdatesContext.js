"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/frontend/contexts/AuthContext";
import {
  detectRankImprovement,
  getNextRankGoal,
  getWeeklyPositionChange,
} from "@/frontend/lib/rankingUpdates";
import CurrentPositionModal from "@/frontend/components/ranking/CurrentPositionModal";
import StreakRankingModal from "@/frontend/components/ranking/StreakRankingModal";

const RankingUpdatesContext = createContext(null);

export function RankingUpdatesProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;

  const [positionModal, setPositionModal] = useState(null);
  const [streakModal, setStreakModal] = useState(null);

  const checkGlobalRank = useCallback(
    (newRank, options = {}) => {
      if (!isAuthenticated || !userId || !newRank) return;
      const improvement = detectRankImprovement(userId, newRank);
      if (!improvement || improvement.positionsGained < 1) return;

      const weeklyChange = getWeeklyPositionChange(userId, newRank);
      const racesWithGain = options.racesWithGain ?? Math.min(improvement.positionsGained, 3);

      setPositionModal({
        rank: newRank,
        weeklyChange: weeklyChange > 0 ? weeklyChange : improvement.positionsGained,
        positionsGained: improvement.positionsGained,
        racesWithGain,
      });
    },
    [isAuthenticated, userId]
  );

  const dismissPosition = useCallback(() => {
    setPositionModal((prev) => {
      if (prev && prev.positionsGained >= 2) {
        setStreakModal({
          positionsGained: prev.positionsGained,
          racesWithGain: prev.racesWithGain,
          nextGoal: getNextRankGoal(prev.rank),
        });
      }
      return null;
    });
  }, []);

  const dismissStreak = useCallback(() => setStreakModal(null), []);

  const value = useMemo(
    () => ({ checkGlobalRank }),
    [checkGlobalRank]
  );

  return (
    <RankingUpdatesContext.Provider value={value}>
      {children}
      <CurrentPositionModal
        open={Boolean(positionModal)}
        rank={positionModal?.rank}
        weeklyChange={positionModal?.weeklyChange ?? 0}
        onClose={dismissPosition}
      />
      <StreakRankingModal
        open={Boolean(streakModal)}
        positionsGained={streakModal?.positionsGained}
        racesWithGain={streakModal?.racesWithGain}
        nextGoal={streakModal?.nextGoal}
        onClose={dismissStreak}
      />
    </RankingUpdatesContext.Provider>
  );
}

export function useRankingUpdates() {
  const ctx = useContext(RankingUpdatesContext);
  if (!ctx) {
    throw new Error("useRankingUpdates must be used within RankingUpdatesProvider");
  }
  return ctx;
}
