"use client";

import { useSearchParams } from "next/navigation";
import ModalityPageShell from "@/frontend/components/modalities/ModalityPageShell";
import ModalityWorkspaceChrome from "@/frontend/components/modality-workspace/ModalityWorkspaceChrome";
import TracksWorkflowAccordion from "@/frontend/components/modalities/TracksWorkflowAccordion";
import { useTracksWorkflowState } from "@/frontend/lib/hooks/useTracksWorkflowState";
import { ticketWorkflowAsset } from "@/frontend/lib/config/ticketWorkflowAssets";

export default function TracksWorkflowList({ modalityId, tracks, loading, t, embedded = false }) {
  const searchParams = useSearchParams();
  const expandFromUrl = searchParams.get("track");
  const ticketFromUrl = Number.parseInt(searchParams.get("ticket") || "", 10);
  const workflow = useTracksWorkflowState(expandFromUrl, ticketFromUrl);
  const noise = ticketWorkflowAsset("noiseOverlayTile");
  const pageBg = ticketWorkflowAsset("tracksWorkflowBg");
  const mainPanelBg = ticketWorkflowAsset("tracksWorkflowMainPanelBg");

  const surfaceClass = `tracks-workflow-surface${
    embedded ? " tracks-workflow-surface--embedded" : ""
  }`;
  const shellClass = `modality-page--workflow-tracks${
    embedded ? " modality-page--workflow-embedded" : ""
  }`;

  return (
    <ModalityPageShell modalityId={modalityId} className={shellClass}>
      <div className={surfaceClass} data-modality={modalityId}>
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

        <div className="tracks-workflow__inner tracks-workflow__inner--workspace">
          <ModalityWorkspaceChrome
            modalityId={modalityId}
            tracks={tracks}
            tracksLoading={loading}
            workflow={workflow}
          >
            <div className="tracks-workflow__grid tracks-workflow__grid--stacked">
              <div className="tracks-workflow__main tracks-workflow__main--full">
                <div
                  className="tracks-workflow__panel tracks-workflow__panel--live"
                  style={
                    mainPanelBg ? { "--workflow-panel-bg": `url(${mainPanelBg})` } : undefined
                  }
                >
                  <TracksWorkflowAccordion
                    tracks={tracks}
                    modalityId={modalityId}
                    loading={loading}
                    t={t}
                    workflow={workflow}
                  />
                </div>
              </div>
            </div>
          </ModalityWorkspaceChrome>
        </div>
      </div>
    </ModalityPageShell>
  );
}
