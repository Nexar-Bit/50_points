"use client";

import { useCallback, useEffect, useState } from "react";
import { isModalityWelcomeAccepted } from "@/frontend/lib/modalityWelcomeStorage";
import FreeTicketsOverviewBar from "@/frontend/components/modality-workspace/FreeTicketsOverviewBar";
import ModalityMediaStrip from "@/frontend/components/modality-workspace/ModalityMediaStrip";
import ModalityNavRail from "@/frontend/components/modality-workspace/ModalityNavRail";
import ModalityLiveHeader from "@/frontend/components/modality-workspace/ModalityLiveHeader";
import OnboardingSequenceGate from "@/frontend/components/onboarding/OnboardingSequenceGate";

/**
 * Top workspace chrome: media bars contract to 4-color strip after modality accept.
 */
export default function ModalityWorkspaceChrome({
  modalityId,
  liveStep = "tracks",
  tracks = [],
  tracksLoading = false,
  workflow = null,
  children,
}) {
  const [mediaContracted, setMediaContracted] = useState(false);
  const showTicketsBar = modalityId === "free" || modalityId === "guest";

  useEffect(() => {
    setMediaContracted(isModalityWelcomeAccepted(modalityId));
  }, [modalityId]);

  const handleWorkspaceUnlocked = useCallback(() => {
    setMediaContracted(true);
  }, []);

  return (
    <>
      <OnboardingSequenceGate
        modalityId={modalityId}
        onWorkspaceUnlocked={handleWorkspaceUnlocked}
      />
      <ModalityMediaStrip modalityId={modalityId} contracted={mediaContracted} />
      <ModalityNavRail activeModalityId={modalityId} />
      {showTicketsBar ? (
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
      <ModalityLiveHeader modalityId={modalityId} activeStep={liveStep} />
      {children}
    </>
  );
}
