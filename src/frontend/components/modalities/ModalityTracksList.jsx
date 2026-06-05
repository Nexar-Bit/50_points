"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import {
  getModality,
  trackSlug,
  modalityPath,
  buildModalityReturnPath,
  buildTournamentEntryHref,
} from "@/frontend/lib/gameModalities";
import { useLiveTournamentsPoll } from "@/frontend/lib/hooks/useLiveTournamentsPoll";
import ModalityFlowNav from "@/frontend/components/modalities/ModalityFlowNav";
import ModalitySimpleTabs from "@/frontend/components/modalities/ModalitySimpleTabs";
import ModalityPageShell from "@/frontend/components/modalities/ModalityPageShell";
import TrackTicketsPanel from "@/frontend/components/modalities/TrackTicketsPanel";
import FreeTicketsOverviewBar from "@/frontend/components/modalities/FreeTicketsOverviewBar";
import TicketFamilyGallery from "@/frontend/components/modalities/TicketFamilyGallery";
import { logoFile } from "@/frontend/lib/config/paths";
import { getTournamentImageUrl } from "@/frontend/lib/tournamentImages";
import GuestAvTracksPage from "@/frontend/components/modalities/GuestAvTracksPage";

function buildTracks(tournaments) {
  const map = new Map();
  for (const tourn of tournaments) {
    const track =
      tourn.track || tourn.trackName || tourn.name?.split("—")[0]?.trim() || "Track";
    const slug = trackSlug(track);
    if (!map.has(slug)) {
      map.set(slug, {
        name: track,
        slug,
        location: tourn.location || "",
        imageUrl:
          tourn.imageUrl ||
          getTournamentImageUrl({ track, slug: tourn.slug, imageUrl: tourn.imageUrl }) ||
          undefined,
        count: 0,
        live: false,
        tournamentSlug: null,
      });
    }
    const entry = map.get(slug);
    entry.count += 1;
    const isLive = tourn.status === "live" || tourn.status === "LIVE";
    if (isLive) entry.live = true;
    if (isLive || !entry.tournamentSlug) {
      entry.tournamentSlug = tourn.slug;
    }
  }
  return [...map.values()].sort((a, b) => (b.live ? 1 : 0) - (a.live ? 1 : 0));
}

function FreeTracksList({ modalityId, mod, tracks, loading, t }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const expandFromUrl = searchParams.get("track");
  const [expandedSlug, setExpandedSlug] = useState(null);
  const [usageVersion, setUsageVersion] = useState(0);
  const [tabActive, setTabActive] = useState("tracks");
  const [gallery, setGallery] = useState(null);

  useEffect(() => {
    if (expandFromUrl) setExpandedSlug(expandFromUrl);
  }, [expandFromUrl]);

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

  useEffect(() => {
    const syncTab = () => {
      const onTickets = window.location.hash === "#tickets";
      setTabActive(onTickets ? "tickets" : "tracks");
      if (onTickets) {
        document.getElementById("tickets")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    syncTab();
    window.addEventListener("hashchange", syncTab);
    return () => window.removeEventListener("hashchange", syncTab);
  }, []);

  const featuredTrack = tracks.find((t) => t.live) || tracks[0];

  const goTournament = useCallback(
    (track) => {
      if (!track?.tournamentSlug) return;
      router.push(
        buildTournamentEntryHref({
          tournamentSlug: track.tournamentSlug,
          modalityId,
          trackSlug: track.slug,
          returnPath: buildModalityReturnPath(modalityId, track.slug),
        }),
      );
    },
    [router, modalityId],
  );

  const goFirstRace = useCallback(
    (track, ticketNum) => {
      if (!track?.tournamentSlug) return;
      setExpandedSlug(track.slug);
      router.push(
        buildTournamentEntryHref({
          tournamentSlug: track.tournamentSlug,
          modalityId,
          ticketNum,
          trackSlug: track.slug,
          returnPath: buildModalityReturnPath(modalityId, track.slug),
          playFirst: true,
        }),
      );
    },
    [router, modalityId],
  );

  const openGallery = useCallback((track, ticketIndex = 0) => {
    setExpandedSlug(track.slug);
    setGallery({ track, ticketIndex });
  }, []);

  const toggleTrack = (slug) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  };

  return (
    <ModalityPageShell modalityId={modalityId} className="modality-page--free-tracks">
      <div className="free-tracks-sticky-head">
        <header className="free-tracks-hero">
          <div className="free-tracks-hero__badge" aria-hidden>
            <span className="free-tracks-hero__badge-num">3</span>
          </div>
          <div className="free-tracks-hero__copy">
            <p className="free-tracks-hero__title">{t("freePlay.titleFree")}</p>
            <p className="free-tracks-hero__body">{t("freePlay.bodyFree")}</p>
          </div>
        </header>

        {!loading && tracks.length > 0 ? (
          <FreeTicketsOverviewBar
            tracks={tracks}
            usageVersion={usageVersion}
            activeTrackSlug={expandedSlug}
            onLogoClick={goTournament}
            onTicketSlotClick={goFirstRace}
            onOpenGallery={openGallery}
          />
        ) : null}
      </div>

      <div className="free-tracks-brand-row">
        <img src={logoFile()} alt="50 POINTS" className="free-tracks-brand-row__logo" />
        <div className="free-tracks-brand-row__copy">
          <p className="free-tracks-brand-row__eyebrow">{t("hero.tournament")}</p>
          <p className="free-tracks-brand-row__track">
            {featuredTrack?.name || t(`gameModalities.${modalityId}.title`)}
          </p>
        </div>
      </div>

      <ModalitySimpleTabs modalityId={modalityId} active={tabActive} />

      <header className="modality-page__head modality-page__head--compact">
        <p
          className="modality-page__eyebrow modality-page__eyebrow--accent"
          style={{ color: mod.accent }}
        >
          {t(`gameModalities.${modalityId}.title`)}
        </p>
        <h1 className="modality-page__title">{t("gameModalities.tracksTitle")}</h1>
        <p className="modality-page__subtitle">{t("gameModalities.tracksSubtitle")}</p>
      </header>

      {loading ? (
        <p className="text-zinc-500 text-sm">{t("gameModalities.loading")}</p>
      ) : tracks.length === 0 ? (
        <p className="text-zinc-500 text-sm">{t("tournamentsSection.empty")}</p>
      ) : (
        <ul className="modality-tracks-accordion">
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
                  className="modality-track-row modality-track-row--button"
                  onClick={() => toggleTrack(track.slug)}
                  aria-expanded={isOpen}
                >
                  <span
                    role="button"
                    tabIndex={0}
                    className="modality-track-row__thumb modality-track-row__thumb--link"
                    style={
                      track.imageUrl
                        ? { backgroundImage: `url(${track.imageUrl})` }
                        : undefined
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      goTournament(track);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        goTournament(track);
                      }
                    }}
                    aria-label={`${track.name} — ${t("gameModalities.enterTournament")}`}
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
                        <span className="modality-track-row__live">{t("gameModalities.live")}</span>
                      ) : null}
                    </span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="modality-track-row__chevron" aria-hidden />
                  ) : (
                    <ChevronDown className="modality-track-row__chevron" aria-hidden />
                  )}
                </button>
                {isOpen && track.tournamentSlug ? (
                  <TrackTicketsPanel
                    modalityId={modalityId}
                    trackSlug={track.slug}
                    tournamentSlug={track.tournamentSlug}
                    usageVersion={usageVersion}
                    onOpenGallery={(ticketIndex) => openGallery(track, ticketIndex)}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
      <TicketFamilyGallery
        open={!!gallery}
        track={gallery?.track}
        modalityId={modalityId}
        initialTicketIndex={gallery?.ticketIndex ?? 0}
        onClose={() => setGallery(null)}
      />
    </ModalityPageShell>
  );
}

export default function ModalityTracksList({ modalityId }) {
  const { t } = useLanguage();
  const mod = getModality(modalityId);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useLiveTournamentsPoll({
    forHome: true,
    onData: (mapped) => setTournaments(mapped),
    onLoadingChange: setLoading,
  });

  const tracks = useMemo(() => buildTracks(tournaments), [tournaments]);

  if (!mod.available) {
    return (
      <ModalityPageShell modalityId={modalityId}>
        <p className="modality-empty-msg">{t("gameModalities.comingSoon")}</p>
        <Link href="/modalidades" className="modality-back-link">
          ← {t("gameModalities.stepHub")}
        </Link>
      </ModalityPageShell>
    );
  }

  if (modalityId === "free") {
    return (
      <FreeTracksList
        modalityId={modalityId}
        mod={mod}
        tracks={tracks}
        loading={loading}
        t={t}
      />
    );
  }

  if (modalityId === "guest") {
    return (
      <GuestAvTracksPage modalityId={modalityId} tracks={tracks} loading={loading} />
    );
  }

  return (
    <ModalityPageShell modalityId={modalityId}>
      <ModalityFlowNav modalityId={modalityId} currentStep="tracks" />

      <header className="modality-page__head">
        <p
          className="modality-page__eyebrow modality-page__eyebrow--accent"
          style={{ color: mod.accent }}
        >
          {t(`gameModalities.${modalityId}.title`)}
        </p>
        <h1 className="modality-page__title">{t("gameModalities.tracksTitle")}</h1>
        <p className="modality-page__subtitle">{t("gameModalities.tracksSubtitle")}</p>
      </header>

      {loading ? (
        <p className="text-zinc-500 text-sm">{t("gameModalities.loading")}</p>
      ) : tracks.length === 0 ? (
        <p className="text-zinc-500 text-sm">{t("tournamentsSection.empty")}</p>
      ) : (
        <ul className="modality-tracks-list">
          {tracks.map((track) => (
            <li key={track.slug}>
              <Link
                href={modalityPath(modalityId, "tickets", { trackSlug: track.slug })}
                className={`modality-track-row modality-track-row--${modalityId}`}
              >
                <span
                  className="modality-track-row__thumb"
                  style={
                    track.imageUrl
                      ? { backgroundImage: `url(${track.imageUrl})` }
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
                    {track.count} {t("gameModalities.tournamentsAtTrack")}
                    {track.live ? (
                      <span className="modality-track-row__live">{t("gameModalities.live")}</span>
                    ) : null}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </ModalityPageShell>
  );
}
