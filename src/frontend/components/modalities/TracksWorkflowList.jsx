"use client";

import { useSearchParams } from "next/navigation";
import ModalityPageShell from "@/frontend/components/modalities/ModalityPageShell";
import ModalitySimpleTabs from "@/frontend/components/modalities/ModalitySimpleTabs";
import TracksWorkflowAccordion from "@/frontend/components/modalities/TracksWorkflowAccordion";
import TracksWorkflowTicketsBridge from "@/frontend/components/modalities/TracksWorkflowTicketsBridge";
import { useTracksWorkflowState } from "@/frontend/lib/hooks/useTracksWorkflowState";
import { ticketWorkflowAsset } from "@/frontend/lib/config/ticketWorkflowAssets";

export default function TracksWorkflowList({ modalityId, mod, tracks, loading, t, embedded = false }) {
  const searchParams = useSearchParams();
  const expandFromUrl = searchParams.get("track");
  const ticketFromUrl = Number.parseInt(searchParams.get("ticket") || "", 10);

  const noise = ticketWorkflowAsset("noiseOverlayTile");
  const pageBg = ticketWorkflowAsset("tracksWorkflowBg");
  const mainPanelBg = ticketWorkflowAsset("tracksWorkflowMainPanelBg");
  const bannerBg = ticketWorkflowAsset("workflowBannerBg");
  const workflow = useTracksWorkflowState(expandFromUrl, ticketFromUrl);

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

        <div className="tracks-workflow__inner">
          <header
            className="tracks-workflow-banner"
            style={bannerBg ? { "--workflow-banner-bg": `url(${bannerBg})` } : undefined}
          >
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

          <TracksWorkflowTicketsBridge
            tracks={tracks}
            workflow={workflow}
            loading={loading}
          />

          <div className="tracks-workflow__grid tracks-workflow__grid--stacked">
            <div className="tracks-workflow__main tracks-workflow__main--full">
              <div
                className="tracks-workflow__panel"
                style={
                  mainPanelBg ? { "--workflow-panel-bg": `url(${mainPanelBg})` } : undefined
                }
              >
                <ModalitySimpleTabs modalityId={modalityId} active="tracks" />

                <header className="tracks-workflow__head">
                  <p className="tracks-workflow__eyebrow" style={{ color: mod.accent }}>
                    {t(`gameModalities.${modalityId}.title`)}
                  </p>
                  <h1 className="tracks-workflow__title">{t("gameModalities.tracksTitle")}</h1>
                  <p className="tracks-workflow__subtitle">{t("gameModalities.tracksSubtitle")}</p>
                </header>

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
        </div>
      </div>
    </ModalityPageShell>
  );
}
