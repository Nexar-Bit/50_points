"use client";

import Link from "next/link";
import {
  Shield,
  MapPin,
  Calendar,
  ChevronRight,
  Trophy,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { avBgFile, logoFile } from "@/frontend/lib/config/paths";
import { modalityPath } from "@/frontend/lib/gameModalities";
import ModalityPageShell from "@/frontend/components/modalities/ModalityPageShell";

const FEATURES = [
  { id: "top", icon: Trophy, titleKey: "guestTracks.featureTopTracks", descKey: "guestTracks.featureTopTracksDesc" },
  { id: "live", icon: Zap, titleKey: "guestTracks.featureLive", descKey: "guestTracks.featureLiveDesc" },
  { id: "secure", icon: ShieldCheck, titleKey: "guestTracks.featureSecure", descKey: "guestTracks.featureSecureDesc" },
];

export default function GuestAvTracksPage({ modalityId, tracks, loading }) {
  const { t } = useLanguage();

  return (
    <ModalityPageShell modalityId={modalityId} className="modality-page--guest-av">
      <div className="av-tracks-surface">
        <img
          className="av-tracks-surface__bg"
          src={avBgFile()}
          alt=""
          aria-hidden
          decoding="async"
          fetchPriority="high"
        />
        <div className="av-tracks-surface__veil" aria-hidden />

        <div className="av-tracks-layout">
          <header className="av-tracks-header">
            <Link href="/" className="av-tracks-brand">
              <img src={logoFile()} alt="" className="av-tracks-brand__mark" />
              <span className="av-tracks-brand__name">{t("guestTracks.brand")}</span>
            </Link>
          </header>

          <section className="av-tracks-hero">
            <span className="av-tracks-hero__badge">
              <Shield className="av-tracks-hero__badge-icon" aria-hidden strokeWidth={2} />
              {t("gameModalities.guest.title")}
            </span>
            <h1 className="av-tracks-hero__title">
              <span className="av-tracks-hero__title-line">{t("guestTracks.heroAvailable")}</span>
              <span className="av-tracks-hero__title-accent">{t("guestTracks.heroRacetracks")}</span>
            </h1>
            <p className="av-tracks-hero__subtitle">{t("gameModalities.tracksSubtitle")}</p>
          </section>

          <div className="av-tracks-main">
            {loading ? (
              <p className="av-tracks-status">{t("gameModalities.loading")}</p>
            ) : tracks.length === 0 ? (
              <p className="av-tracks-status">{t("tournamentsSection.empty")}</p>
            ) : (
              <ul className="av-tracks-list">
                {tracks.map((track) => (
                  <li key={track.slug}>
                    <Link
                      href={modalityPath(modalityId, "tickets", { trackSlug: track.slug })}
                      className="av-tracks-card"
                    >
                      <span
                        className="av-tracks-card__thumb"
                        style={
                          track.imageUrl
                            ? { backgroundImage: `url(${track.imageUrl})` }
                            : undefined
                        }
                      />
                      <span className="av-tracks-card__body">
                        <span className="av-tracks-card__name">{track.name}</span>
                        <span className="av-tracks-card__meta">
                          {track.location ? (
                            <span className="av-tracks-card__meta-item">
                              <MapPin className="av-tracks-card__meta-icon" aria-hidden />
                              {track.location}
                            </span>
                          ) : null}
                          <span className="av-tracks-card__meta-item">
                            <Calendar className="av-tracks-card__meta-icon" aria-hidden />
                            {track.count === 1
                              ? t("gameModalities.oneTournamentAtTrack")
                              : `${track.count} ${t("gameModalities.tournamentsAtTrack")}`}
                          </span>
                          {track.live ? (
                            <span className="av-tracks-card__live-text">{t("gameModalities.live")}</span>
                          ) : null}
                        </span>
                      </span>
                      {track.live ? (
                        <span className="av-tracks-card__live-pill">
                          <span className="av-tracks-card__live-dot" aria-hidden />
                          {t("gameModalities.live")}
                        </span>
                      ) : null}
                      <ChevronRight className="av-tracks-card__chevron" aria-hidden strokeWidth={2} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <footer className="av-tracks-features">
            {FEATURES.map(({ id, icon: Icon, titleKey, descKey }) => (
              <div key={id} className="av-tracks-feature">
                <span className="av-tracks-feature__icon-wrap">
                  <Icon className="av-tracks-feature__icon" aria-hidden strokeWidth={1.75} />
                </span>
                <div className="av-tracks-feature__copy">
                  <p className="av-tracks-feature__title">{t(titleKey)}</p>
                  <p className="av-tracks-feature__desc">{t(descKey)}</p>
                </div>
              </div>
            ))}
          </footer>
        </div>
      </div>
    </ModalityPageShell>
  );
}
