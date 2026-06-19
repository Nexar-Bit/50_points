"use client";

import { logoFile } from "@/frontend/lib/config/paths";

export default function ModalityTorneoBar({ t, modalityId = "free", className = "" }) {
  const logo = logoFile();

  return (
    <div
      className={`mw-torneo-banner mw-torneo-banner--${modalityId}${className ? ` ${className}` : ""}`}
    >
      <div className="mw-torneo-banner__inner">
        <div className="mw-torneo-banner__copy">
          <p className="mw-torneo-banner__title">{t("modalityWorkspace.torneoTitle")}</p>
          <p className="mw-torneo-banner__slogan">
            <span className="mw-torneo-banner__slogan-part mw-torneo-banner__slogan-part--strategy">
              {t("hero.sloganStrategy")}.
            </span>{" "}
            <span className="mw-torneo-banner__slogan-part mw-torneo-banner__slogan-part--points">
              {t("hero.sloganPoints")}.
            </span>{" "}
            <span className="mw-torneo-banner__slogan-part mw-torneo-banner__slogan-part--game">
              {t("hero.sloganGame")}.
            </span>
          </p>
        </div>

        <div className="mw-torneo-banner__emblem">
          <div className="mw-torneo-banner__ticket" aria-hidden>
            <span className="mw-torneo-banner__ticket-stripe mw-torneo-banner__ticket-stripe--paid" />
            <span className="mw-torneo-banner__ticket-stripe mw-torneo-banner__ticket-stripe--free" />
            <span className="mw-torneo-banner__ticket-stripe mw-torneo-banner__ticket-stripe--special" />
          </div>
          {logo ? <img src={logo} alt="" className="mw-torneo-banner__logo" /> : null}
        </div>

        <div className="mw-torneo-banner__flare" aria-hidden />
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
