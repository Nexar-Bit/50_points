"use client";

import { LanguageProvider } from "@/frontend/lib/i18n/LanguageContext";
import { AuthProvider } from "@/frontend/contexts/AuthContext";
import { AchievementCardsProvider } from "@/frontend/contexts/AchievementCardsContext";
import { RankingUpdatesProvider } from "@/frontend/contexts/RankingUpdatesContext";

export default function Providers({ children }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AchievementCardsProvider>
          <RankingUpdatesProvider>{children}</RankingUpdatesProvider>
        </AchievementCardsProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
