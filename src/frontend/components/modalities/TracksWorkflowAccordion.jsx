"use client";

import { ChevronRight, ChevronUp } from "lucide-react";
import { staticFile } from "@/frontend/lib/config/paths";
import TrackTicketsPanel from "@/frontend/components/modalities/TrackTicketsPanel";
import EmbeddedTicketRaces from "@/frontend/components/onboarding/EmbeddedTicketRaces";
import { useTracksWorkflowState } from "@/frontend/lib/hooks/useTracksWorkflowState";

/**
 * Track cards — same big-card design as /tournaments page.
 * Clicking a card expands tickets + races inline on the same page (no navigation).
 */
export default function TracksWorkflowAccordion({
  tracks,
  modalityId,
  loading,
  t,
  initialTrackSlug = null,
  initialTicketNum = null,
  workflow: workflowProp = null,
}) {
  const internalWorkflow = useTracksWorkflowState(initialTrackSlug, initialTicketNum);
  const workflow = workflowProp ?? internalWorkflow;

  const {
    expandedSlug,
    activeTicketNum,
    racesOpen,
    usageVersion,
    toggleTrack,
    handleTicketSelect,
    openRaces,
    bumpUsage,
  } = workflow;

  if (loading) {
    return <p className="tracks-workflow__status">{t("gameModalities.loading")}</p>;
  }

  if (tracks.length === 0) {
    return <p className="tracks-workflow__status">{t("tournamentsSection.empty")}</p>;
  }

  return (
    <div className="tracks-accordion-grid">
      {tracks.map((track) => {
        const isOpen = expandedSlug === track.slug;
        const showRaces = isOpen && racesOpen && activeTicketNum && track.tournamentSlug;

        return (
          <div
            id={`track-${track.slug}`}
            key={track.slug}
            className={`tracks-accordion-card${isOpen ? " tracks-accordion-card--open" : ""}`}
          >
            {/* Big photo card — same style as /tournaments */}
            <button
              type="button"
              className={`live-tournament-card live-tournament-card--cover${
                track.live
                  ? " live-tournament-card--active"
                  : " live-tournament-card--upcoming"
              } tracks-accordion-card__trigger`}
              onClick={() => toggleTrack(track.slug)}
              aria-expanded={isOpen}
            >
              <div className="live-tournament-card__shell">
                <div className="live-tournament-card__gloss" aria-hidden />
                <div className="live-tournament-card__gloss-edge" aria-hidden />

                <div className="live-tournament-card__media">
                  <img
                    src={track.imageUrl || staticFile("/images/live-feed.jpg")}
                    alt=""
                    className="live-tournament-card__image"
                  />
                  <div className="live-tournament-card__media-shade" aria-hidden />
                  <div className="live-tournament-card__media-gloss" aria-hidden />
                  <div className="live-tournament-card__badges">
                    <span className="live-tournament-card__track-pill">{track.name}</span>
                  </div>
                </div>

                <div className="live-tournament-card__body live-tournament-card__body--cover">
                  <span className="live-tournament-card__cta">
                    {isOpen
                      ? t("gameModalities.tracksSubtitle") || "Ver carreras"
                      : t("tournamentsSection.enterTournament") || "ENTRAR AL TORNEO"}
                    {isOpen
                      ? <ChevronUp className="live-tournament-card__cta-icon" aria-hidden />
                      : <ChevronRight className="live-tournament-card__cta-icon" aria-hidden />}
                  </span>
                </div>
              </div>
            </button>

            {/* Inline expansion — tickets + races on the same page */}
            {isOpen && track.tournamentSlug ? (
              <div className="track-inline-expand">
                <TrackTicketsPanel
                  inline
                  modalityId={modalityId}
                  trackSlug={track.slug}
                  tournamentSlug={track.tournamentSlug}
                  usageVersion={usageVersion}
                  activeNum={activeTicketNum ?? 0}
                  onActiveNumChange={handleTicketSelect}
                  onOpenRaces={openRaces}
                />
                {showRaces ? (
                  <EmbeddedTicketRaces
                    tournamentSlug={track.tournamentSlug}
                    ticketNum={activeTicketNum}
                    trackSlug={track.slug}
                    onUsageChange={bumpUsage}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
