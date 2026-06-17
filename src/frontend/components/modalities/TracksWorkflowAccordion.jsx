"use client";

import { useEffect } from "react";
import { staticFile } from "@/frontend/lib/config/paths";
import TrackTicketsPanel from "@/frontend/components/modalities/TrackTicketsPanel";
import EmbeddedTicketRaces from "@/frontend/components/onboarding/EmbeddedTicketRaces";
import { getUsedTicketMeta, isTrackTicketUsed } from "@/frontend/lib/trackTicketUsage";
import {
  BrowserTabs,
  BrowserTabBar,
  BrowserTab,
  BrowserTabPanel,
} from "@/frontend/components/ui/BrowserTabBar";
import { useTracksWorkflowState } from "@/frontend/lib/hooks/useTracksWorkflowState";

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
    selectTrackTab,
    handleTicketSelect,
    openRaces,
    bumpUsage,
  } = workflow;

  useEffect(() => {
    if (expandedSlug || tracks.length === 0) return;
    const first = tracks.find((track) => track.tournamentSlug) ?? tracks[0];
    if (first?.slug) selectTrackTab(first.slug);
  }, [expandedSlug, tracks, selectTrackTab]);

  if (loading) {
    return <p className="tracks-workflow__status">{t("gameModalities.loading")}</p>;
  }

  if (tracks.length === 0) {
    return <p className="tracks-workflow__status">{t("tournamentsSection.empty")}</p>;
  }

  const expandedTrack = tracks.find((track) => track.slug === expandedSlug) ?? null;
  const activeTicketUsed =
    expandedTrack &&
    activeTicketNum &&
    isTrackTicketUsed(expandedTrack.slug, activeTicketNum);
  const usedTicketMeta =
    activeTicketUsed && expandedTrack
      ? getUsedTicketMeta(expandedTrack.slug, activeTicketNum)
      : null;
  const effectiveTournamentSlug =
    activeTicketUsed && usedTicketMeta?.tournamentSlug
      ? usedTicketMeta.tournamentSlug
      : expandedTrack?.tournamentSlug;
  const showRaces =
    expandedTrack &&
    racesOpen &&
    activeTicketNum &&
    effectiveTournamentSlug;

  return (
    <div className="tracks-accordion-shell" id="tracks-workflow-tabs">
      <BrowserTabs className="browser-tabs--tracks browser-tabs--tracks-primary">
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
                id={`track-tab-${track.slug}`}
                active={isActive}
                className={`browser-tabs__tab--track browser-tabs__tab--track-rich${
                  track.live ? " browser-tabs__tab--track-live" : ""
                }`}
                onClick={() => selectTrackTab(track.slug)}
                aria-controls={`track-panel-${track.slug}`}
              >
                <span className="browser-tabs__tab-thumb-wrap">
                  <img
                    src={track.imageUrl || staticFile("/images/live-feed.jpg")}
                    alt=""
                    className="browser-tabs__tab-thumb"
                  />
                  <span className="browser-tabs__tab-thumb-shade" aria-hidden />
                  {track.live ? (
                    <span className="browser-tabs__tab-live-pill">
                      <span className="browser-tabs__tab-live-dot" aria-hidden />
                      {t("gameModalities.live")}
                    </span>
                  ) : null}
                </span>
                <span className="browser-tabs__tab-pill">{track.name}</span>
              </BrowserTab>
            );
          })}
        </BrowserTabBar>

        {expandedTrack?.tournamentSlug ? (
          <BrowserTabPanel
            id={`track-panel-${expandedTrack.slug}`}
            role="tabpanel"
            aria-labelledby={`track-tab-${expandedTrack.slug}`}
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
                    key={`${expandedTrack.slug}-${activeTicketNum}-${usageVersion}`}
                    tournamentSlug={effectiveTournamentSlug}
                    ticketNum={activeTicketNum}
                    trackSlug={expandedTrack.slug}
                    trackName={expandedTrack.name}
                    onUsageChange={bumpUsage}
                  />
                ) : null}
              </BrowserTabPanel>
            </BrowserTabs>
          </BrowserTabPanel>
        ) : null}
      </BrowserTabs>
    </div>
  );
}
