"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { getModality, trackSlug, modalityPath } from "@/frontend/lib/gameModalities";
import { useLiveTournamentsPoll } from "@/frontend/lib/hooks/useLiveTournamentsPoll";
import ModalityFlowNav from "@/frontend/components/modalities/ModalityFlowNav";
import ModalityPageShell from "@/frontend/components/modalities/ModalityPageShell";
import TracksWorkflowList from "@/frontend/components/modalities/TracksWorkflowList";
import { getTournamentImageUrl } from "@/frontend/lib/tournamentImages";

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

  if (modalityId === "free" || modalityId === "guest") {
    return (
      <TracksWorkflowList
        modalityId={modalityId}
        mod={mod}
        tracks={tracks}
        loading={loading}
        t={t}
      />
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
                    track.imageUrl ? { backgroundImage: `url(${track.imageUrl})` } : undefined
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
