"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import AnimateInView from "@/frontend/components/ui/AnimateInView";
import AppPageHeader from "@/frontend/components/layout/AppPageHeader";
import LiveTournamentCard from "@/frontend/components/home/LiveTournamentCard";
import ModalityScope from "@/frontend/components/modalities/ModalityScope";
import ModalityFlowNav from "@/frontend/components/modalities/ModalityFlowNav";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useLiveTournamentsPoll } from "@/frontend/lib/hooks/useLiveTournamentsPoll";
import {
  isValidModalityId,
  readPersistedModality,
  withModalityQuery,
} from "@/frontend/lib/gameModalities";

function LiveTournamentCardSkeleton() {
  return (
    <div
      className="live-tournament-card live-tournament-card--upcoming live-tournament-card--cover animate-pulse pointer-events-none"
      aria-hidden
    >
      <div className="live-tournament-card__shell">
        <div className="h-40 bg-white/5" />
        <div className="p-4">
          <div className="h-10 w-full bg-white/5 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function TournamentsPageClient() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const fromQuery = searchParams.get("modality");
  const modalityId = isValidModalityId(fromQuery)
    ? fromQuery
    : readPersistedModality() || "free";
  const [liveTournaments, setLiveTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useLiveTournamentsPoll({
    forHome: true,
    onData: (mapped) => setLiveTournaments(mapped),
    onLoadingChange: setLoading,
  });

  return (
    <ModalityScope modalityId={modalityId}>
      {isValidModalityId(fromQuery) ? (
        <ModalityFlowNav modalityId={modalityId} currentStep="tracks" />
      ) : null}
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
                href={withModalityQuery(`/tournament/${tournament.slug}`, modalityId)}
              />
            </AnimateInView>
          ))
        )}
      </div>
    </ModalityScope>
  );
}
