"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { useModality } from "@/frontend/contexts/ModalityContext";
import { getModality } from "@/frontend/lib/gameModalities";
import { useLiveTournamentsPoll } from "@/frontend/lib/hooks/useLiveTournamentsPoll";
import { buildTracksFromTournaments } from "@/frontend/components/modalities/ModalityTracksList";
import ModalityPageShell from "@/frontend/components/modalities/ModalityPageShell";
import ModalityHubBoard from "@/frontend/components/modalities/ModalityHubBoard";
import TracksWorkflowAccordion from "@/frontend/components/modalities/TracksWorkflowAccordion";
import { ticketWorkflowAsset } from "@/frontend/lib/config/ticketWorkflowAssets";

function resolveDefaultModality(activeModalityId, user) {
  if (activeModalityId === "guest" || activeModalityId === "free") {
    return activeModalityId;
  }
  return user?.isGuest ? "guest" : "free";
}

export default function ComenzarWorkflowPanel() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { activeModalityId, setActiveModality } = useModality();
  const [selectedModalityId, setSelectedModalityId] = useState(() =>
    resolveDefaultModality(activeModalityId, user),
  );
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  const mod = getModality(selectedModalityId);
  const tracks = useMemo(() => buildTracksFromTournaments(tournaments), [tournaments]);

  useEffect(() => {
    setSelectedModalityId(resolveDefaultModality(activeModalityId, user));
  }, [activeModalityId, user]);

  useLiveTournamentsPoll({
    forHome: true,
    onData: (mapped) => setTournaments(mapped),
    onLoadingChange: setLoading,
  });

  const handleModeSelect = useCallback(
    (modeId) => {
      setSelectedModalityId(modeId);
      setActiveModality(modeId);
    },
    [setActiveModality],
  );

  const noise = ticketWorkflowAsset("noiseOverlayTile");
  const pageBg = ticketWorkflowAsset("tracksWorkflowBg");
  const mainPanelBg = ticketWorkflowAsset("tracksWorkflowMainPanelBg");

  const workflowAvailable = selectedModalityId === "guest" || selectedModalityId === "free";

  return (
    <ModalityPageShell modalityId={selectedModalityId} className="modality-page--workflow-embedded">
      <div className="tracks-workflow-surface tracks-workflow-surface--embedded comenzar-workflow-panel">
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

        <div className="tracks-workflow__inner comenzar-workflow-panel__inner">
          <ModalityHubBoard
            layout="flat"
            selectable
            showHow={false}
            titleAs="h2"
            activeModeId={selectedModalityId}
            onModeSelect={handleModeSelect}
            className="modality-hub-board--comenzar-access"
          />

          {!workflowAvailable ? (
            <p className="tracks-workflow__status">{t("gameModalities.comingSoon")}</p>
          ) : (
            <>
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

              <div className="tracks-workflow__grid tracks-workflow__grid--stacked">
                <div className="tracks-workflow__main tracks-workflow__main--full">
                  <div
                    className="tracks-workflow__panel"
                    style={
                      mainPanelBg ? { "--workflow-panel-bg": `url(${mainPanelBg})` } : undefined
                    }
                  >
                    <header className="tracks-workflow__head">
                      <p className="tracks-workflow__eyebrow" style={{ color: mod.accent }}>
                        {t(`gameModalities.${selectedModalityId}.title`)}
                      </p>
                      <h3 className="tracks-workflow__title">{t("gameModalities.tracksTitle")}</h3>
                      <p className="tracks-workflow__subtitle">{t("gameModalities.tracksSubtitle")}</p>
                    </header>

                    <TracksWorkflowAccordion
                      tracks={tracks}
                      modalityId={selectedModalityId}
                      loading={loading}
                      t={t}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ModalityPageShell>
  );
}
