"use client";

import { useCallback, useEffect, useState } from "react";
import { shouldShowTournamentGuide } from "@/frontend/lib/tournamentGuideStorage";
import {
  isModalityWelcomeAccepted,
  shouldShowModalityWelcome,
} from "@/frontend/lib/modalityWelcomeStorage";
import TournamentGuideModal from "@/frontend/components/tournament-guide/TournamentGuideModal";
import ModalityWelcomeModal from "@/frontend/components/modality-welcome/ModalityWelcomeModal";

/**
 * On modality entry: 1) Tournament guide (optional dismiss forever),
 * then 2) Modality welcome (accept per modality). Main page stays visible underneath.
 */
export default function OnboardingSequenceGate({
  modalityId,
  enabled = true,
  onWorkspaceUnlocked,
}) {
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    if (!enabled || !modalityId) {
      setPhase("done");
      if (isModalityWelcomeAccepted(modalityId)) {
        onWorkspaceUnlocked?.();
      }
      return;
    }
    if (shouldShowTournamentGuide()) {
      setPhase("guide");
    } else if (shouldShowModalityWelcome(modalityId)) {
      setPhase("modality");
    } else {
      setPhase("done");
      onWorkspaceUnlocked?.();
    }
  }, [enabled, modalityId, onWorkspaceUnlocked]);

  const handleGuideClose = useCallback(() => {
    if (modalityId && shouldShowModalityWelcome(modalityId)) {
      setPhase("modality");
    } else {
      setPhase("done");
      onWorkspaceUnlocked?.();
    }
  }, [modalityId, onWorkspaceUnlocked]);

  const handleModalityAccept = useCallback(() => {
    setPhase("done");
    onWorkspaceUnlocked?.();
  }, [onWorkspaceUnlocked]);

  if (phase === "idle" || phase === "done") return null;

  if (phase === "guide") {
    return <TournamentGuideModal open onClose={handleGuideClose} />;
  }

  return (
    <ModalityWelcomeModal
      open
      modalityId={modalityId}
      onAccept={handleModalityAccept}
    />
  );
}
