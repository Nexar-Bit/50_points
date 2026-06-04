"use client";

import { LanguageProvider } from "@/frontend/lib/i18n/LanguageContext";
import { AuthProvider } from "@/frontend/contexts/AuthContext";
import { AchievementCardsProvider } from "@/frontend/contexts/AchievementCardsContext";
import { RankingUpdatesProvider } from "@/frontend/contexts/RankingUpdatesContext";
import AppBootGate from "@/frontend/components/layout/AppBootGate";

export default function Providers({ children }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppBootGate>
          <AchievementCardsProvider>
            <RankingUpdatesProvider>{children}</RankingUpdatesProvider>
          </AchievementCardsProvider>
        </AppBootGate>
      </AuthProvider>
    </LanguageProvider>
  );
}
