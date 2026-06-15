"use client";

import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import { ticketWorkflowAsset } from "@/frontend/lib/config/ticketWorkflowAssets";
import { modalityPath } from "@/frontend/lib/gameModalities";

/**
 * Racetrack list — each row is a direct link to the tournament page.
 * Inline ticket/race expansion removed per client request.
 */
export default function TracksWorkflowAccordion({
  tracks,
  modalityId,
  loading,
  t,
}) {
  const thumbFallback = ticketWorkflowAsset("trackRowThumbDefault");
  const livePillBg = ticketWorkflowAsset("trackLivePill");

  if (loading) {
    return <p className="tracks-workflow__status">{t("gameModalities.loading")}</p>;
  }

  if (tracks.length === 0) {
    return <p className="tracks-workflow__status">{t("tournamentsSection.empty")}</p>;
  }

  return (
    <ul className="modality-tracks-accordion tracks-workflow__accordion track-workflow-accordion">
      {tracks.map((track) => {
        const href = track.tournamentSlug
          ? `/tournament/${track.tournamentSlug}`
          : modalityPath(modalityId, "tickets", { trackSlug: track.slug });

        return (
          <li
            id={`track-${track.slug}`}
            key={track.slug}
            className="modality-tracks-accordion__item track-workflow-accordion__item"
          >
            <Link
              href={href}
              className="modality-track-row modality-track-row--link tracks-workflow__track-row"
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
              <ChevronRight className="modality-track-row__chevron" aria-hidden />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
