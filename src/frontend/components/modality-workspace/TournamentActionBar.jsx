"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy } from "lucide-react";
import TrackTicketsPanel from "@/frontend/components/modalities/TrackTicketsPanel";
import { buildTournamentEntryHref } from "@/frontend/lib/gameModalities";
import { getTrackTicketProgress } from "@/frontend/lib/profileHubInsights";

const STATE_TITLE_KEYS = {
  none: "profile.hub.tournamentActionGo",
  partial: "profile.hub.tournamentActionPending",
  complete: "profile.hub.tournamentActionDone",
};

const LEGEND_KEYS = {
  none: "profile.hub.legendAvailable",
  partial: "profile.hub.legendPending",
  complete: "profile.hub.legendDone",
};

/**
 * Dynamic tournament header (purple / yellow / green) — shared by profile and all modality workspaces.
 */
export default function TournamentActionBar({
  t,
  modalityId,
  tracks = [],
  activeTrackSlug = null,
  activeTicketNum = 1,
  usageVersion = 0,
  onTicketSelect,
  showLegend = true,
  className = "",
}) {
  const [usageTick, setUsageTick] = useState(usageVersion);

  useEffect(() => {
    setUsageTick(usageVersion);
  }, [usageVersion]);

  useEffect(() => {
    const refresh = () => setUsageTick((v) => v + 1);
    window.addEventListener("50points-tickets-updated", refresh);
    return () => window.removeEventListener("50points-tickets-updated", refresh);
  }, []);

  const track =
    tracks.find((row) => row.slug === activeTrackSlug) ?? tracks[0] ?? null;
  const { state } = getTrackTicketProgress(track?.slug);
  void usageTick;

  const titleKey = STATE_TITLE_KEYS[state] || STATE_TITLE_KEYS.none;
  const tournamentHref =
    track?.tournamentSlug &&
    buildTournamentEntryHref({
      tournamentSlug: track.tournamentSlug,
      modalityId,
      trackSlug: track.slug,
    });

  if (!track) {
    return (
      <section className={`tournament-action-bar tournament-action-bar--empty${className ? ` ${className}` : ""}`}>
        <p>{t("profile.hub.noTracks")}</p>
      </section>
    );
  }

  return (
    <section
      className={`tournament-action-bar tournament-action-bar--${state}${className ? ` ${className}` : ""}`}
      data-modality={modalityId}
    >
      {tournamentHref && state === "none" ? (
        <Link href={tournamentHref} className="tournament-action-bar__header tournament-action-bar__header--link">
          <Trophy className="tournament-action-bar__trophy" strokeWidth={2.25} aria-hidden />
          <span>{t(titleKey)}</span>
        </Link>
      ) : (
        <div className="tournament-action-bar__header">
          <Trophy className="tournament-action-bar__trophy" strokeWidth={2.25} aria-hidden />
          <span>{t(titleKey)}</span>
        </div>
      )}

      <div className="tournament-action-bar__track">
        <div className="tournament-action-bar__track-main">
          <p className="tournament-action-bar__track-name">
            {track.name}
            {track.live ? (
              <span className="tournament-action-bar__live">{t("gameModalities.live")}</span>
            ) : null}
          </p>
          {tournamentHref && state !== "none" ? (
            <Link href={tournamentHref} className="tournament-action-bar__enter">
              {t("profile.hub.continueTournament")}
            </Link>
          ) : null}
        </div>
      </div>

      <TrackTicketsPanel
        inline
        modalityId={modalityId}
        trackSlug={track.slug}
        tournamentSlug={track.tournamentSlug}
        usageVersion={usageTick}
        activeNum={activeTicketNum ?? 1}
        onActiveNumChange={onTicketSelect}
      />

      {showLegend ? (
        <ul className="tournament-action-bar__legend" aria-label={t("profile.hub.legendAria")}>
          {(["none", "partial", "complete"]).map((legendState) => (
            <li
              key={legendState}
              className={`tournament-action-bar__legend-item tournament-action-bar__legend-item--${legendState}${
                state === legendState ? " tournament-action-bar__legend-item--active" : ""
              }`}
            >
              <span className="tournament-action-bar__legend-dot" aria-hidden />
              <span>{t(LEGEND_KEYS[legendState])}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
