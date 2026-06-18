"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { modalityWorkspaceAsset } from "@/frontend/lib/config/modalityWorkspaceAssets";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";

export default function ModalityLiveHeader({ modalityId, activeStep = "tracks" }) {
  const { t } = useLanguage();
  const logo = modalityWorkspaceAsset("logoStrip");
  const liveIcon = modalityWorkspaceAsset("liveRadar");

  const crumbs = [
    { id: "hub", href: "/modalidades", label: t("gameModalities.stepHub"), active: activeStep === "hub" },
    {
      id: "tracks",
      href: `/modalidades/${modalityId}`,
      label: t("gameModalities.stepTracks"),
      active: activeStep === "tracks",
    },
    {
      id: "tournament",
      href: `/modalidades/${modalityId}#tracks-workflow-tabs`,
      label: t("modalityWorkspace.crumbTournament"),
      active: activeStep === "tournament",
    },
  ];

  return (
    <header className="mw-live-header">
      <div className="mw-live-header__title-row">
        {logo ? <img src={logo} alt="" className="mw-live-header__logo" /> : null}
        <h2 className="mw-live-header__title">{t("tournamentsSection.title")}</h2>
        {liveIcon ? (
          <img src={liveIcon} alt="" className="mw-live-header__live" aria-hidden />
        ) : null}
      </div>
      <nav className="mw-live-header__crumbs" aria-label={t("modalityWorkspace.breadcrumbAria")}>
        {crumbs.map((crumb, index) => (
          <span key={crumb.id} className="mw-live-header__crumb-wrap">
            {index > 0 ? (
              <ChevronRight className="mw-live-header__sep" aria-hidden strokeWidth={2} />
            ) : null}
            <Link
              href={crumb.href}
              className={`mw-live-header__crumb${
                crumb.active ? " mw-live-header__crumb--active" : ""
              }`}
              aria-current={crumb.active ? "page" : undefined}
            >
              {crumb.label}
            </Link>
          </span>
        ))}
      </nav>
    </header>
  );
}
