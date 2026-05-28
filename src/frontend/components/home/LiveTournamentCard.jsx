"use client";

import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import { staticFile } from "@/frontend/lib/config/paths";

export default function LiveTournamentCard({
  tournament,
  t,
  featured = false,
  href = "/tournaments",
}) {
  const isLive =
    tournament.status === "LIVE" || tournament.status === "live";
  const progress =
    tournament.totalRaces > 0
      ? Math.min(100, (tournament.currentRace / tournament.totalRaces) * 100)
      : 0;

  const raceLine = `${t("tournamentsPage.race")} ${tournament.currentRace} ${t("tournamentsSection.raceOf")} ${tournament.totalRaces}`;

  const timeLine = isLive
    ? `${t("tournamentsSection.next")}: ${tournament.nextRace}`
    : `${t("tournamentsSection.starts")}: ${tournament.startTime}`;

  const cardClass = [
    "live-tournament-card",
    isLive ? "live-tournament-card--active" : "live-tournament-card--upcoming",
    featured ? "live-tournament-card--featured" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={href} className={cardClass}>
      <div className="live-tournament-card__shell">
        <div className="live-tournament-card__gloss" aria-hidden />
        <div className="live-tournament-card__gloss-edge" aria-hidden />

        <div className="live-tournament-card__media">
          <img
            src={tournament.imageUrl || staticFile("/images/live-feed.jpg")}
            alt=""
            className="live-tournament-card__image"
          />
          <div className="live-tournament-card__media-shade" aria-hidden />
          <div className="live-tournament-card__media-gloss" aria-hidden />
          <div className="live-tournament-card__badges">
            <span className="live-tournament-card__track-pill">
              {tournament.trackName}
            </span>
            {isLive ? (
              <span className="live-tournament-card__live-pill">
                <span
                  className="live-tournament-card__live-dot animate-pulse-live"
                  aria-hidden
                />
                {t("tournamentsSection.live")}
              </span>
            ) : (
              <span className="live-tournament-card__upcoming-pill">
                {t("tournamentsSection.upcoming")}
              </span>
            )}
          </div>
        </div>

        <div className="live-tournament-card__body">
          <p className="live-tournament-card__location">
            <MapPin className="live-tournament-card__pin" aria-hidden />
            <span>{tournament.location}</span>
          </p>

          <div className="live-tournament-card__progress-meta">
            <span>{raceLine}</span>
            <span className="live-tournament-card__time">{timeLine}</span>
          </div>

          <div className="live-tournament-card__progress-track" aria-hidden>
            <div
              className="live-tournament-card__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="live-tournament-card__players">
            <img
              src={staticFile("/images/icons/icon-players.png")}
              alt=""
              className="live-tournament-card__players-icon"
              aria-hidden
            />
            <span className="live-tournament-card__players-count">
              {tournament.players.toLocaleString()}
            </span>
            <span className="live-tournament-card__players-label">
              {t("tournamentsSection.players")}
            </span>
          </div>

          <span className="live-tournament-card__cta">
            {t("tournamentsSection.enterTournament")}
            <ChevronRight className="live-tournament-card__cta-icon" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
