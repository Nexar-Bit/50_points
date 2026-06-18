"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { HUB_DISPLAY_ORDER } from "@/frontend/lib/gameModalities";

export default function ModalityWelcomeCards({ t, activeModalityId }) {
  return (
    <div className="mw-cards" role="list" aria-label={t("gameModalities.hubTitle")}>
      {HUB_DISPLAY_ORDER.map((modeId) => {
        const isActive = modeId === activeModalityId;
        const isGuest = modeId === "guest";
        const registered = !isGuest;

        return (
          <article
            key={modeId}
            role="listitem"
            className={`mw-card mw-card--${modeId}${isActive ? " mw-card--active" : ""}`}
            aria-current={isActive ? "true" : undefined}
          >
            <p className="mw-card__eyebrow">{t(`modalityWelcome.cardEyebrow.${modeId}`)}</p>
            <div className="mw-card__icon" aria-hidden>
              <span className={`mw-card__icon-glyph mw-card__icon-glyph--${modeId}`} />
            </div>
            <h4 className="mw-card__title">{t(`gameModalities.${modeId}.hubTournament`)}</h4>
            <p className="mw-card__play">{t(`gameModalities.${modeId}.hubPlayLine`)}</p>
            {t(`gameModalities.${modeId}.hubDetail`) ? (
              <p className="mw-card__detail">{t(`gameModalities.${modeId}.hubDetail`)}</p>
            ) : null}
            <footer className="mw-card__footer">
              {registered ? (
                <>
                  <Check className="mw-card__footer-icon mw-card__footer-icon--ok" strokeWidth={2.5} aria-hidden />
                  <span>{t("modalityWelcome.registeredUsers")}</span>
                </>
              ) : (
                <>
                  <X className="mw-card__footer-icon mw-card__footer-icon--no" strokeWidth={2.5} aria-hidden />
                  <span>{t("modalityWelcome.guestUsers")}</span>
                </>
              )}
            </footer>
          </article>
        );
      })}
    </div>
  );
}

export function ModalityWelcomePathStrip({ t }) {
  return (
    <div className="mw-path-strip">
      <div className="mw-path-strip__copy">
        <p className="mw-path-strip__eyebrow">{t("ticketWorkflow.landingEyebrow")}</p>
        <h3 className="mw-path-strip__title">{t("ticketWorkflow.landingTitle")}</h3>
        <p className="mw-path-strip__flow">{t("ticketWorkflow.landingLeadFlow")}</p>
      </div>
      <Link href="/guia-torneo" className="mw-path-strip__link">
        {t("modalityWelcome.viewFullGuide")}
      </Link>
    </div>
  );
}
