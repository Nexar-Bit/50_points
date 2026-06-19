"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { defaultModalityForUser, applyModalityToDocument, clearModalityFromDocument, persistModality } from "@/frontend/lib/gameModalities";
import { useLiveTournamentsPoll } from "@/frontend/lib/hooks/useLiveTournamentsPoll";
import { buildTracksFromTournaments } from "@/frontend/components/modalities/ModalityTracksList";
import ModalityNavRail from "@/frontend/components/modality-workspace/ModalityNavRail";
import FreeTicketsOverviewBar from "@/frontend/components/modality-workspace/FreeTicketsOverviewBar";
import TournamentActionBar from "@/frontend/components/modality-workspace/TournamentActionBar";
import ProfileHubHeader from "@/frontend/components/profile/hub/ProfileHubHeader";
import ProfileAdTorneoSlot from "@/frontend/components/profile/hub/ProfileAdTorneoSlot";
import ProfileTicketHistoryPanel from "@/frontend/components/profile/hub/ProfileTicketHistoryPanel";
import ProfileHubFooter from "@/frontend/components/profile/hub/ProfileHubFooter";

export default function ProfileHubChrome({ profile, userProfile }) {
  const { language, t } = useLanguage();
  const isEn = language === "en";
  const { user: authUser } = useAuth();
  const defaultModality = defaultModalityForUser(authUser) || "guest";
  const [selectedModalityId, setSelectedModalityId] = useState(defaultModality);
  const playerNumber = authUser?.gameMode ?? (authUser?.isGuest ? 1 : 2);

  useEffect(() => {
    setSelectedModalityId(defaultModality);
  }, [defaultModality]);

  const modalityId = selectedModalityId;

  const [tournaments, setTournaments] = useState([]);
  const [tracksLoading, setTracksLoading] = useState(true);
  const [activeTrackSlug, setActiveTrackSlug] = useState(null);
  const [activeTicketNum, setActiveTicketNum] = useState(1);
  const [usageVersion, setUsageVersion] = useState(0);

  useLiveTournamentsPoll({
    forHome: true,
    onData: (mapped) => setTournaments(mapped),
    onLoadingChange: setTracksLoading,
  });

  const tracks = useMemo(() => buildTracksFromTournaments(tournaments), [tournaments]);

  useEffect(() => {
    applyModalityToDocument(modalityId);
    return () => clearModalityFromDocument();
  }, [modalityId]);

  useEffect(() => {
    if (activeTrackSlug || tracks.length === 0) return;
    const preferred = tracks.find((track) => track.live && track.tournamentSlug) ?? tracks[0];
    if (preferred?.slug) setActiveTrackSlug(preferred.slug);
  }, [activeTrackSlug, tracks]);

  useEffect(() => {
    const refresh = () => setUsageVersion((v) => v + 1);
    window.addEventListener("50points-tickets-updated", refresh);
    return () => window.removeEventListener("50points-tickets-updated", refresh);
  }, []);

  const handleSelectTrack = useCallback((track) => {
    if (track?.slug) setActiveTrackSlug(track.slug);
  }, []);

  const handleSelectTicket = useCallback((track, num) => {
    if (track?.slug) setActiveTrackSlug(track.slug);
    if (num) setActiveTicketNum(num);
  }, []);

  const handleTicketSelect = useCallback((num) => {
    setActiveTicketNum(num);
  }, []);

  const handleProfileModalityChange = useCallback((modeId) => {
    setSelectedModalityId(modeId);
    persistModality(modeId);
    setActiveTrackSlug(null);
    setActiveTicketNum(1);
  }, []);

  return (
    <div className="profile-hub-page" data-modality={modalityId}>
      <ModalityNavRail
        activeModalityId={modalityId}
        stayOnPage
        onModalityChange={handleProfileModalityChange}
      />

      <ProfileHubHeader
        t={t}
        isEn={isEn}
        username={userProfile.username}
        playerNumber={playerNumber}
        modalityId={modalityId}
        profile={profile}
        userProfile={userProfile}
      />

      <div className="profile-hub-page__ads">
        <ProfileAdTorneoSlot
          t={t}
          modalityId={modalityId}
          variant="system"
          newsTitleKey="profile.hub.newsProfile"
          newsIconKey="iconNewsProfile"
        >
          <p>{t("profile.hub.newsProfileBody")}</p>
        </ProfileAdTorneoSlot>

        <ProfileAdTorneoSlot
          t={t}
          modalityId={modalityId}
          variant="advertiser"
          newsTitleKey="profile.hub.newsTournament"
          newsIconKey="iconNewsTournament"
        >
          <p>{t("profile.hub.newsTournamentBody")}</p>
        </ProfileAdTorneoSlot>
      </div>

      <FreeTicketsOverviewBar
        modalityId={modalityId}
        tracks={tracks}
        loading={tracksLoading}
        activeTrackSlug={activeTrackSlug}
        activeTicketNum={activeTicketNum}
        usageVersion={usageVersion}
        onSelectTrack={handleSelectTrack}
        onSelectTicket={handleSelectTicket}
      />

      <TournamentActionBar
        t={t}
        modalityId={modalityId}
        tracks={tracks}
        activeTrackSlug={activeTrackSlug}
        activeTicketNum={activeTicketNum}
        usageVersion={usageVersion}
        onTicketSelect={handleTicketSelect}
      />

      <ProfileTicketHistoryPanel
        t={t}
        profile={profile}
        isRegistered={!authUser?.isGuest}
        liveTracks={tracks}
      />

      <ProfileHubFooter t={t} userProfile={userProfile} isRegistered={!authUser?.isGuest} />
    </div>
  );
}
