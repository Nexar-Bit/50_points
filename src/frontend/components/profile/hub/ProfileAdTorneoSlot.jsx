"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ModalityTorneoBar from "@/frontend/components/modality-workspace/ModalityTorneoBar";
import { profileHubAsset } from "@/frontend/lib/config/profileHubAssets";
import { modalityWorkspaceAsset } from "@/frontend/lib/config/modalityWorkspaceAssets";

export default function ProfileAdTorneoSlot({
  t,
  modalityId,
  variant = "system",
  newsTitleKey,
  newsIconKey,
  children,
}) {
  const [expanded, setExpanded] = useState(false);
  const stadiumBg = profileHubAsset("adBannerStadium");
  const menuIcon = modalityWorkspaceAsset("menuLines");
  const newsIcon = profileHubAsset(newsIconKey);

  return (
    <section className={`profile-hub-ad profile-hub-ad--${variant}`}>
      <div className="profile-hub-ad__banner-wrap">
        {menuIcon ? (
          <img src={menuIcon} alt="" className="profile-hub-ad__menu profile-hub-ad__menu--left" />
        ) : null}
        <div
          className="profile-hub-ad__banner"
          style={stadiumBg ? { "--profile-ad-bg": `url(${stadiumBg})` } : undefined}
        >
          <ModalityTorneoBar t={t} modalityId={modalityId} className="profile-hub-ad__torneo" />
        </div>
        {menuIcon ? (
          <img src={menuIcon} alt="" className="profile-hub-ad__menu profile-hub-ad__menu--right" />
        ) : null}
      </div>

      <button
        type="button"
        className="profile-hub-ad__news-toggle"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        {newsIcon ? <img src={newsIcon} alt="" className="profile-hub-ad__news-icon" /> : null}
        <span>{t(newsTitleKey)}</span>
        <ChevronDown
          className={`profile-hub-ad__chevron${expanded ? " profile-hub-ad__chevron--open" : ""}`}
          strokeWidth={2.5}
          aria-hidden
        />
      </button>

      {expanded ? (
        <div className="profile-hub-ad__news-body">
          {children ?? <p className="profile-hub-ad__news-placeholder">{t("profile.hub.newsEmpty")}</p>}
        </div>
      ) : null}
    </section>
  );
}
