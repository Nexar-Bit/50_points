"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Info } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import {
  getModality,
  trackSlug,
  modalityPath,
} from "@/frontend/lib/gameModalities";
import { useLiveTournamentsPoll } from "@/frontend/lib/hooks/useLiveTournamentsPoll";
import { mapTournamentForHomeCard } from "@/frontend/lib/api/mappers";
import ModalityFlowNav from "@/frontend/components/modalities/ModalityFlowNav";
import ModalityPageShell from "@/frontend/components/modalities/ModalityPageShell";

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

  const tracks = useMemo(() => {
    const map = new Map();
    for (const tourn of tournaments) {
      const track = tourn.track || tourn.trackName || tourn.name?.split("—")[0]?.trim() || "Track";
      if (!map.has(track)) {
        map.set(track, {
          name: track,
          slug: trackSlug(track),
          location: tourn.location || "",
          imageUrl: tourn.imageUrl,
          count: 0,
          live: tourn.status === "live" || tourn.status === "LIVE",
        });
      }
      const entry = map.get(track);
      entry.count += 1;
      if (tourn.status === "live") entry.live = true;
    }
    return [...map.values()].sort((a, b) => (b.live ? 1 : 0) - (a.live ? 1 : 0));
  }, [tournaments]);

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
                  <Info className="modality-track-row__info-icon" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        )}
    </ModalityPageShell>
  );
}
