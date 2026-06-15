"use client";

import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import TrackTicketsPanel from "@/frontend/components/modalities/TrackTicketsPanel";
import EmbeddedTicketRaces from "@/frontend/components/onboarding/EmbeddedTicketRaces";
import { useTracksWorkflowState } from "@/frontend/lib/hooks/useTracksWorkflowState";
import { ticketWorkflowAsset } from "@/frontend/lib/config/ticketWorkflowAssets";

/**
 * Track list — click a track to expand tickets + races inline on the same page.
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

  const thumbFallback = ticketWorkflowAsset("trackRowThumbDefault");
  const livePillBg = ticketWorkflowAsset("trackLivePill");
  const chevronGlow = ticketWorkflowAsset("accordionChevronGlow");

  if (loading) {
    return <p className="tracks-workflow__status">{t("gameModalities.loading")}</p>;
  }

  if (tracks.length === 0) {
    return <p className="tracks-workflow__status">{t("tournamentsSection.empty")}</p>;
  }

  return (
    <ul className="modality-tracks-accordion tracks-workflow__accordion track-workflow-accordion">
      {tracks.map((track) => {
        const isOpen = expandedSlug === track.slug;
        const showRaces =
          isOpen && racesOpen && activeTicketNum && track.tournamentSlug;

        return (
          <li
            id={`track-${track.slug}`}
            key={track.slug}
            className={`modality-tracks-accordion__item track-workflow-accordion__item${
              isOpen ? " modality-tracks-accordion__item--open" : ""
            }`}
          >
            {/* Track row — click to expand inline */}
            <button
              type="button"
              className="modality-track-row modality-track-row--button tracks-workflow__track-row"
              onClick={() => toggleTrack(track.slug)}
              aria-expanded={isOpen}
            >
              <span
                className="modality-track-row__thumb tracks-workflow__thumb"
                style={
                  track.imageUrl || thumbFallback
                    ? { backgroundImage: `url(${track.imageUrl || thumbFallback})` }
                    : undefined
                }
              />
              <span className="modality-track-row__info">
                <span className="modality-track-row__name">{track.name}</span>
                {track.location ? (
                  <span className="modality-track-row__loc">
                    <MapPin className="w-3 h-3 inline mr-1 opacity-60" aria-hidden />
                    {track.location}
                  </span>
                ) : null}
                <span className="modality-track-row__meta">
                  {track.count === 1
                    ? t("gameModalities.oneTournamentAtTrack")
                    : `${track.count} ${t("gameModalities.tournamentsAtTrack")}`}
                  {track.live ? (
                    <span
                      className="tracks-workflow__live-pill"
                      style={
                        livePillBg ? { backgroundImage: `url(${livePillBg})` } : undefined
                      }
                    >
                      <span className="tracks-workflow__live-dot" aria-hidden />
                      {t("gameModalities.live")}
                    </span>
                  ) : null}
                </span>
              </span>
              <span className="tracks-workflow__chevron-wrap" aria-hidden>
                {chevronGlow ? (
                  <img
                    src={chevronGlow}
                    alt=""
                    className={`tracks-workflow__chevron-img${
                      isOpen ? " tracks-workflow__chevron-img--up" : ""
                    }`}
                  />
                ) : isOpen ? (
                  <ChevronUp className="modality-track-row__chevron" />
                ) : (
                  <ChevronDown className="modality-track-row__chevron" />
                )}
              </span>
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
          </li>
        );
      })}
    </ul>
  );
}
