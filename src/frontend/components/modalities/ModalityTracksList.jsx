"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { getModality, trackSlug } from "@/frontend/lib/gameModalities";
import { useLiveTournamentsPoll } from "@/frontend/lib/hooks/useLiveTournamentsPoll";
import ModalityPageShell from "@/frontend/components/modalities/ModalityPageShell";
import TracksWorkflowList from "@/frontend/components/modalities/TracksWorkflowList";
import { getTournamentImageUrl } from "@/frontend/lib/tournamentImages";

export function buildTracksFromTournaments(tournaments) {
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
        eventDate: tourn.date || null,
        startTime: tourn.startTime || tourn.nextRace || null,
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
      entry.location = tourn.location || entry.location;
      entry.eventDate = tourn.date || entry.eventDate;
      entry.startTime = tourn.startTime || tourn.nextRace || entry.startTime;
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "es"));
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

  const tracks = useMemo(() => buildTracksFromTournaments(tournaments), [tournaments]);

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
    <TracksWorkflowList
      modalityId={modalityId}
      tracks={tracks}
      loading={loading}
      t={t}
    />
  );
}
