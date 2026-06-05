"use client";

import { Suspense } from "react";
import { LanguageProvider } from "@/frontend/lib/i18n/LanguageContext";
import { AuthProvider } from "@/frontend/contexts/AuthContext";
import { AchievementCardsProvider } from "@/frontend/contexts/AchievementCardsContext";
import { RankingUpdatesProvider } from "@/frontend/contexts/RankingUpdatesContext";
import AppBootGate from "@/frontend/components/layout/AppBootGate";
import { ModalityProvider } from "@/frontend/contexts/ModalityContext";

export default function Providers({ children }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Suspense fallback={null}>
          <ModalityProvider>
            <AppBootGate>
            <AchievementCardsProvider>
              <RankingUpdatesProvider>{children}</RankingUpdatesProvider>
            </AchievementCardsProvider>
            </AppBootGate>
          </ModalityProvider>
        </Suspense>
      </AuthProvider>
    </LanguageProvider>
  );
}
