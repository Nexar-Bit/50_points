"use client";

import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { isModalityWelcomeAccepted } from "@/frontend/lib/modalityWelcomeStorage";
import FreeTicketsOverviewBar from "@/frontend/components/modality-workspace/FreeTicketsOverviewBar";
import ModalityNavRail from "@/frontend/components/modality-workspace/ModalityNavRail";
import ModalityLiveHeader from "@/frontend/components/modality-workspace/ModalityLiveHeader";
import ModalityTorneoBar, { ModalityColorStripes } from "@/frontend/components/modality-workspace/ModalityTorneoBar";
import ModalityWelcomeSummaryPanel from "@/frontend/components/modality-welcome/ModalityWelcomeSummaryPanel";
import OnboardingSequenceGate from "@/frontend/components/onboarding/OnboardingSequenceGate";

/**
 * Workspace after modality accept: TORNEO header → 4 stripes → nav → info panel → tickets → live.
 */
export default function ModalityWorkspaceChrome({
  modalityId,
  liveStep = "tracks",
  tracks = [],
  tracksLoading = false,
  workflow = null,
  children,
}) {
  const { t } = useLanguage();
  const [workspaceReady, setWorkspaceReady] = useState(false);
  const showTicketsBar = modalityId === "free" || modalityId === "guest";

  useEffect(() => {
    setWorkspaceReady(isModalityWelcomeAccepted(modalityId));
  }, [modalityId]);

  const handleWorkspaceUnlocked = useCallback(() => {
    setWorkspaceReady(true);
  }, []);

  return (
    <>
      <OnboardingSequenceGate
        modalityId={modalityId}
        onWorkspaceUnlocked={handleWorkspaceUnlocked}
      />

      {workspaceReady ? (
        <header className="mw-workspace-top">
          <ModalityTorneoBar t={t} />
          <ModalityColorStripes contracted className="mw-color-stripes--workspace" />
        </header>
      ) : null}

      <div className="mw-workspace-nav-block">
        <ModalityNavRail activeModalityId={modalityId} />
        {workspaceReady ? (
          <ModalityWelcomeSummaryPanel modalityId={modalityId} defaultExpanded />
        ) : null}
      </div>

      {workspaceReady && showTicketsBar ? (
        <FreeTicketsOverviewBar
          modalityId={modalityId}
          tracks={tracks}
          loading={tracksLoading}
          activeTrackSlug={workflow?.expandedSlug ?? null}
          activeTicketNum={workflow?.activeTicketNum ?? null}
          usageVersion={workflow?.usageVersion ?? 0}
          onSelectTrack={workflow?.selectTrack}
          onSelectTicket={workflow?.selectTrackTicket}
        />
      ) : null}

      {workspaceReady ? (
        <ModalityLiveHeader modalityId={modalityId} activeStep={liveStep} />
      ) : null}

      {children}
    </>
  );
}
