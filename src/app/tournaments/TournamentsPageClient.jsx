"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AnimateInView from "@/frontend/components/ui/AnimateInView";
import AppPageHeader from "@/frontend/components/layout/AppPageHeader";
import ModalityScope from "@/frontend/components/modalities/ModalityScope";
import ModalityFlowNav from "@/frontend/components/modalities/ModalityFlowNav";
import TracksWorkflowAccordion from "@/frontend/components/modalities/TracksWorkflowAccordion";
import { buildTracksFromTournaments } from "@/frontend/components/modalities/ModalityTracksList";
import { useTracksWorkflowState } from "@/frontend/lib/hooks/useTracksWorkflowState";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useLiveTournamentsPoll } from "@/frontend/lib/hooks/useLiveTournamentsPoll";
import { isValidModalityId, readPersistedModality } from "@/frontend/lib/gameModalities";

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
  const expandFromUrl = searchParams.get("track");
  const ticketFromUrl = Number.parseInt(searchParams.get("ticket") || "", 10);
  const modalityId = isValidModalityId(fromQuery)
    ? fromQuery
    : readPersistedModality() || "guest";
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const workflow = useTracksWorkflowState(expandFromUrl, ticketFromUrl);
  const tracks = useMemo(() => buildTracksFromTournaments(tournaments), [tournaments]);

  useLiveTournamentsPoll({
    forHome: true,
    onData: (mapped) => setTournaments(mapped),
    onLoadingChange: setLoading,
  });

  return (
    <ModalityScope modalityId={modalityId}>
      <ModalityFlowNav modalityId={modalityId} currentStep="tracks" />
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

      {loading ? (
        <div className="live-tournaments-section__grid tracks-accordion-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <LiveTournamentCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <TracksWorkflowAccordion
          tracks={tracks}
          modalityId={modalityId}
          loading={false}
          t={t}
          workflow={workflow}
        />
      )}
    </ModalityScope>
  );
}
