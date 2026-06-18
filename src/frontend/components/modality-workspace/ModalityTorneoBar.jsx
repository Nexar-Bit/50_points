"use client";

import { logoFile } from "@/frontend/lib/config/paths";
import { modalityWorkspaceAsset } from "@/frontend/lib/config/modalityWorkspaceAssets";

export default function ModalityTorneoBar({ t, className = "" }) {
  const logo = logoFile();
  const menu = modalityWorkspaceAsset("menuLines");

  return (
    <div className={`mw-torneo-bar${className ? ` ${className}` : ""}`}>
      {menu ? <img src={menu} alt="" className="mw-torneo-bar__menu" aria-hidden /> : null}
      <div className="mw-torneo-bar__copy">
        <p className="mw-torneo-bar__title">{t("modalityWorkspace.torneoTitle")}</p>
        <p className="mw-torneo-bar__slogan">
          <span className="text-purple-light">{t("hero.sloganPoints")}</span>
          <span className="mw-torneo-bar__dot mw-torneo-bar__dot--purple" aria-hidden />
          <span className="text-cyan-light">{t("hero.sloganGame")}</span>
          <span className="mw-torneo-bar__dot mw-torneo-bar__dot--cyan" aria-hidden />
          <span className="text-gold-light">{t("hero.sloganStrategy")}</span>
        </p>
      </div>
      <div className="mw-torneo-bar__brand">
        {logo ? <img src={logo} alt="" className="mw-torneo-bar__logo" /> : null}
        {menu ? <img src={menu} alt="" className="mw-torneo-bar__menu" aria-hidden /> : null}
      </div>
    </div>
  );
}

export function ModalityColorStripes({ className = "", contracted = false }) {
  return (
    <div
      className={`mw-color-stripes${contracted ? " mw-color-stripes--contracted" : ""}${
        className ? ` ${className}` : ""
      }`}
      aria-hidden
    >
      <span className="mw-color-stripes__line mw-color-stripes__line--paid" />
      <span className="mw-color-stripes__line mw-color-stripes__line--free" />
      <span className="mw-color-stripes__line mw-color-stripes__line--special" />
      <span className="mw-color-stripes__line mw-color-stripes__line--guest" />
    </div>
  );
}
