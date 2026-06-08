"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import ModalityPageShell from "@/frontend/components/modalities/ModalityPageShell";
import ModalitySimpleTabs from "@/frontend/components/modalities/ModalitySimpleTabs";
import FreeTicketsOverviewBar from "@/frontend/components/modalities/FreeTicketsOverviewBar";
import TrackTicketsPanel from "@/frontend/components/modalities/TrackTicketsPanel";
import {
  buildModalityReturnPath,
  buildTournamentEntryHref,
} from "@/frontend/lib/gameModalities";
import { ticketWorkflowAsset } from "@/frontend/lib/config/ticketWorkflowAssets";

/**
 * Canonical ticket workflow (mockup):
 * banner → overview logos + 3 dots → tabs → hipódromos accordion → ticket tabs → play.
 * No gallery modal, no extra navigation on tab/dot clicks.
 */
export default function TracksWorkflowList({ modalityId, mod, tracks, loading, t }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const expandFromUrl = searchParams.get("track");
  const ticketFromUrl = Number.parseInt(searchParams.get("ticket") || "", 10);

  const [expandedSlug, setExpandedSlug] = useState(null);
  const [activeTicketNum, setActiveTicketNum] = useState(1);
  const [usageVersion, setUsageVersion] = useState(0);
  const [tabActive, setTabActive] = useState("tracks");

  const expandedTrack = tracks.find((tr) => tr.slug === expandedSlug) || null;

  useEffect(() => {
    if (expandFromUrl) {
      setExpandedSlug(expandFromUrl);
      setTabActive("tickets");
    }
    if (ticketFromUrl >= 1 && ticketFromUrl <= 3) {
      setActiveTicketNum(ticketFromUrl);
    }
  }, [expandFromUrl, ticketFromUrl]);

  const refreshUsage = useCallback(() => {
    setUsageVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    const onRefresh = () => refreshUsage();
    window.addEventListener("focus", onRefresh);
    window.addEventListener("50points-tickets-updated", onRefresh);
    return () => {
      window.removeEventListener("focus", onRefresh);
      window.removeEventListener("50points-tickets-updated", onRefresh);
    };
  }, [refreshUsage]);

  const scrollToDock = useCallback(() => {
    requestAnimationFrame(() => {
      document.getElementById("track-tickets-dock")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const selectTrack = useCallback(
    (track) => {
      setExpandedSlug(track.slug);
      setTabActive("tickets");
      scrollToDock();
    },
    [scrollToDock],
  );

  const selectTrackTicket = useCallback(
    (track, ticketNum) => {
      setExpandedSlug(track.slug);
      setActiveTicketNum(ticketNum);
      setTabActive("tickets");
      scrollToDock();
    },
    [scrollToDock],
  );

  const focusTickets = useCallback(() => {
    setTabActive("tickets");
    setExpandedSlug((prev) => prev || tracks[0]?.slug || null);
    scrollToDock();
  }, [tracks, scrollToDock]);

  const handlePlayTicket = useCallback(
    (ticketNum, playFirst = true) => {
      if (!expandedTrack?.tournamentSlug) return;
      const returnPath = buildModalityReturnPath(modalityId, expandedTrack.slug);
      router.push(
        buildTournamentEntryHref({
          tournamentSlug: expandedTrack.tournamentSlug,
          modalityId,
          ticketNum,
          trackSlug: expandedTrack.slug,
          returnPath,
          playFirst,
        }),
      );
    },
    [router, modalityId, expandedTrack],
  );

  const toggleTrack = (slug) => {
    setExpandedSlug((prev) => {
      const next = prev === slug ? null : slug;
      setTabActive(next ? "tickets" : "tracks");
      return next;
    });
  };

  const noise = ticketWorkflowAsset("noiseOverlayTile");
  const pageBg = ticketWorkflowAsset("tracksWorkflowBg");
  const mainPanelBg = ticketWorkflowAsset("tracksWorkflowMainPanelBg");
  const thumbFallback = ticketWorkflowAsset("trackRowThumbDefault");
  const livePillBg = ticketWorkflowAsset("trackLivePill");
  const chevronGlow = ticketWorkflowAsset("accordionChevronGlow");

  return (
    <ModalityPageShell modalityId={modalityId} className="modality-page--workflow-tracks">
      <div className="tracks-workflow-surface">
        <div className="tracks-workflow-surface__ambient" aria-hidden>
          {pageBg ? (
            <img src={pageBg} alt="" className="tracks-workflow-surface__hero-bg" />
          ) : null}
          <div className="tracks-workflow-surface__fog" />
          <div className="tracks-workflow-surface__glow" />
          <div className="tracks-workflow-surface__trails" />
          {noise ? (
            <div
              className="tracks-workflow-surface__noise"
              style={{ backgroundImage: `url(${noise})` }}
            />
          ) : null}
        </div>

        <div className="tracks-workflow__inner">
          <header className="tracks-workflow-banner">
            <div className="tracks-workflow-banner__badge" aria-hidden>
              <img
                src={ticketWorkflowAsset("workflowBannerIcon")}
                alt=""
                className="tracks-workflow-banner__badge-img"
              />
              <span className="tracks-workflow-banner__badge-num">3</span>
            </div>
            <div className="tracks-workflow-banner__copy">
              <p className="tracks-workflow-banner__title">{t("ticketWorkflow.bannerTitle")}</p>
              <p className="tracks-workflow-banner__body">{t("ticketWorkflow.bannerBody")}</p>
            </div>
          </header>

          <div className="tracks-workflow__grid">
            {!loading && tracks.length > 0 ? (
              <aside className="tracks-workflow__aside">
                <FreeTicketsOverviewBar
                  tracks={tracks}
                  usageVersion={usageVersion}
                  activeTrackSlug={expandedSlug}
                  activeTicketNum={activeTicketNum}
                  onLogoClick={selectTrack}
                  onTicketSlotClick={selectTrackTicket}
                />
              </aside>
            ) : null}

            <div className="tracks-workflow__main">
              <div
                className="tracks-workflow__panel"
                style={
                  mainPanelBg ? { "--workflow-panel-bg": `url(${mainPanelBg})` } : undefined
                }
              >
                <ModalitySimpleTabs
                  modalityId={modalityId}
                  active={tabActive}
                  onTicketsClick={focusTickets}
                />

                <header className="tracks-workflow__head">
                  <p
                    className="tracks-workflow__eyebrow"
                    style={{ color: mod.accent }}
                  >
                    {t(`gameModalities.${modalityId}.title`)}
                  </p>
                  <h1 className="tracks-workflow__title">{t("gameModalities.tracksTitle")}</h1>
                  <p className="tracks-workflow__subtitle">{t("gameModalities.tracksSubtitle")}</p>
                </header>

              {loading ? (
                <p className="tracks-workflow__status">{t("gameModalities.loading")}</p>
              ) : tracks.length === 0 ? (
                <p className="tracks-workflow__status">{t("tournamentsSection.empty")}</p>
              ) : (
                <ul className="modality-tracks-accordion tracks-workflow__accordion">
                  {tracks.map((track) => {
                    const isOpen = expandedSlug === track.slug;
                    return (
                      <li
                        id={`track-${track.slug}`}
                        key={track.slug}
                        className={`modality-tracks-accordion__item${isOpen ? " modality-tracks-accordion__item--open" : ""}`}
                      >
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
                                ? {
                                    backgroundImage: `url(${track.imageUrl || thumbFallback})`,
                                  }
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
                                    livePillBg
                                      ? { backgroundImage: `url(${livePillBg})` }
                                      : undefined
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
                                className={`tracks-workflow__chevron-img${isOpen ? " tracks-workflow__chevron-img--up" : ""}`}
                              />
                            ) : isOpen ? (
                              <ChevronUp className="modality-track-row__chevron" />
                            ) : (
                              <ChevronDown className="modality-track-row__chevron" />
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

                {expandedTrack?.tournamentSlug ? (
                  <div id="track-tickets-dock" className="track-tickets-dock tracks-workflow__dock">
                    <TrackTicketsPanel
                      modalityId={modalityId}
                      trackSlug={expandedTrack.slug}
                      tournamentSlug={expandedTrack.tournamentSlug}
                      usageVersion={usageVersion}
                      activeNum={activeTicketNum}
                      onActiveNumChange={setActiveTicketNum}
                      onPlayTicket={handlePlayTicket}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalityPageShell>
  );
}
