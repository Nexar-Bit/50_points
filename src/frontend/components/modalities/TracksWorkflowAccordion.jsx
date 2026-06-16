"use client";

import { ChevronRight } from "lucide-react";
import { staticFile } from "@/frontend/lib/config/paths";
import TrackTicketsPanel from "@/frontend/components/modalities/TrackTicketsPanel";
import EmbeddedTicketRaces from "@/frontend/components/onboarding/EmbeddedTicketRaces";
import { useTracksWorkflowState } from "@/frontend/lib/hooks/useTracksWorkflowState";
import {
  BrowserTabs,
  BrowserTabBar,
  BrowserTab,
  BrowserTabPanel,
} from "@/frontend/components/ui/BrowserTabBar";

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

  const expandedTrack = tracks.find((track) => track.slug === expandedSlug) ?? null;
  const showRaces =
    expandedTrack &&
    racesOpen &&
    activeTicketNum &&
    expandedTrack.tournamentSlug;

  return (
    <div className="tracks-accordion-shell">
      <div className="live-tournaments-section__grid tracks-accordion-grid">
        {tracks.map((track) => {
          const isOpen = expandedSlug === track.slug;

          return (
            <div
              id={`track-${track.slug}`}
              key={track.slug}
              className={`tracks-accordion-card${isOpen ? " tracks-accordion-card--open" : ""}`}
            >
              <button
                type="button"
                className={`live-tournament-card live-tournament-card--cover${
                  track.live
                    ? " live-tournament-card--active"
                    : " live-tournament-card--upcoming"
                } tracks-accordion-card__trigger`}
                onClick={() => toggleTrack(track.slug)}
                aria-expanded={isOpen}
                aria-controls={isOpen ? `track-panel-${track.slug}` : undefined}
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

                  {!isOpen ? (
                    <div className="live-tournament-card__body live-tournament-card__body--cover">
                      <span className="live-tournament-card__cta">
                        {t("tournamentsSection.enterTournament") || "ENTRAR AL TORNEO"}
                        <ChevronRight className="live-tournament-card__cta-icon" aria-hidden />
                      </span>
                    </div>
                  ) : null}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {expandedTrack?.tournamentSlug ? (
        <BrowserTabs className="browser-tabs--tracks">
          <BrowserTabBar
            className="browser-tabs__bar--tracks"
            role="tablist"
            aria-label={t("tournamentsSection.title")}
          >
            {tracks.map((track) => {
              const isActive = expandedSlug === track.slug;
              return (
                <BrowserTab
                  key={track.slug}
                  active={isActive}
                  className="browser-tabs__tab--track"
                  onClick={() => toggleTrack(track.slug)}
                  aria-controls={`track-panel-${track.slug}`}
                >
                  <img
                    src={track.imageUrl || staticFile("/images/live-feed.jpg")}
                    alt=""
                    className="browser-tabs__favicon"
                  />
                  <span className="browser-tabs__label">{track.name}</span>
                </BrowserTab>
              );
            })}
          </BrowserTabBar>

          <BrowserTabPanel
            id={`track-panel-${expandedTrack.slug}`}
            className="track-inline-expand track-inline-expand--full track-inline-expand--tab-panel"
          >
            <BrowserTabs className="browser-tabs--tickets-stack">
              <TrackTicketsPanel
                inline
                modalityId={modalityId}
                trackSlug={expandedTrack.slug}
                tournamentSlug={expandedTrack.tournamentSlug}
                usageVersion={usageVersion}
                activeNum={activeTicketNum ?? 0}
                onActiveNumChange={handleTicketSelect}
                onOpenRaces={openRaces}
              />
              <BrowserTabPanel
                id={`track-ticket-panel-${expandedTrack.slug}-${activeTicketNum}`}
                className="browser-tabs__panel--ticket-content"
              >
                {showRaces ? (
                  <EmbeddedTicketRaces
                    tournamentSlug={expandedTrack.tournamentSlug}
                    ticketNum={activeTicketNum}
                    trackSlug={expandedTrack.slug}
                    trackName={expandedTrack.name}
                    onUsageChange={bumpUsage}
                  />
                ) : null}
              </BrowserTabPanel>
            </BrowserTabs>
          </BrowserTabPanel>
        </BrowserTabs>
      ) : null}
    </div>
  );
}
