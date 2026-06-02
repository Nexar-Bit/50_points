"use client";

import { useState } from "react";
import AnimateInView from "@/frontend/components/ui/AnimateInView";
import AppPageHeader from "@/frontend/components/layout/AppPageHeader";
import LiveTournamentCard from "@/frontend/components/home/LiveTournamentCard";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useLiveTournamentsPoll } from "@/frontend/lib/hooks/useLiveTournamentsPoll";

function LiveTournamentCardSkeleton() {
  return (
    <div
      className="live-tournament-card live-tournament-card--upcoming animate-pulse pointer-events-none"
      aria-hidden
    >
      <div className="live-tournament-card__shell">
        <div className="h-32 bg-white/5" />
        <div className="p-5 space-y-3">
          <div className="h-5 w-2/3 bg-white/5 rounded" />
          <div className="h-3 w-1/2 bg-white/5 rounded" />
          <div className="h-2 w-full bg-white/5 rounded-full" />
          <div className="h-10 w-full bg-white/5 rounded-xl mt-4" />
        </div>
      </div>
    </div>
  );
}

export default function TournamentsPage() {
  const { t } = useLanguage();
  const [liveTournaments, setLiveTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useLiveTournamentsPoll({
    forHome: true,
    onData: (mapped) => setLiveTournaments(mapped),
    onLoadingChange: setLoading,
  });

  return (
    <>
      <AnimateInView>
        <AppPageHeader
          title={t("tournamentsSection.title")}
          subtitle={`${t("tournamentsSection.descriptionLead")} ${t("tournamentsSection.descriptionHighlight")}.`}
          filters={
            <span className="mis-stats-filter">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" />
              {t("tournamentsSection.liveLabel")}
            </span>
          }
        />
      </AnimateInView>

      <div className="live-tournaments-section__grid">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <LiveTournamentCardSkeleton key={i} />
          ))
        ) : liveTournaments.length === 0 ? (
          <p className="text-zinc-500 text-sm col-span-full py-8">{t("tournamentsSection.empty")}</p>
        ) : (
          liveTournaments.map((tournament, i) => (
            <AnimateInView key={tournament.id || tournament.slug} delay={i * 0.15}>
              <LiveTournamentCard
                tournament={tournament}
                t={t}
                featured={i === 0}
                href={`/tournament/${tournament.slug}`}
              />
            </AnimateInView>
          ))
        )}
      </div>
    </>
  );
}
