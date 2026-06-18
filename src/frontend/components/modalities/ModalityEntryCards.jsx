"use client";

import Link from "next/link";
import {
  HUB_DISPLAY_ORDER,
  markCoverPassed,
  persistModality,
} from "@/frontend/lib/gameModalities";

function onModalityNav(modalityId) {
  persistModality(modalityId);
  markCoverPassed();
}

export default function ModalityEntryCards({ t, className = "" }) {
  return (
    <div className={`modality-entry-cards${className ? ` ${className}` : ""}`}>
      {HUB_DISPLAY_ORDER.map((modeId, index) => {
        const isGuest = modeId === "guest";
        const modalityNum = t(`gameModalities.${modeId}.hubModalityNum`) || `MODALIDAD ${index + 1}`;

        return (
          <div
            key={modeId}
            className={`modality-entry-card-wrap modality-entry-card-wrap--${modeId}`}
          >
            <div className={`modality-entry-card modality-entry-card--${modeId}`}>
              <h3 className="modality-entry-card__title">
                {t(`gameModalities.${modeId}.hubTournament`)}
              </h3>
              <p className="modality-entry-card__mode">{modalityNum}</p>
              {isGuest ? (
                <Link
                  href="/modalidades/guest"
                  className={`modality-entry-card__btn modality-entry-card__btn--${modeId}`}
                  onClick={() => onModalityNav(modeId)}
                >
                  {t("gameModalities.hubGuestCta")}
                </Link>
              ) : (
                <Link
                  href={`/login?modality=${modeId}`}
                  className={`modality-entry-card__btn modality-entry-card__btn--${modeId}`}
                  onClick={() => onModalityNav(modeId)}
                >
                  {t("gameModalities.hubLoginCta")}
                </Link>
              )}
            </div>
            {!isGuest ? (
              <Link
                href={`/register?modality=${modeId}`}
                className={`modality-entry-card__register modality-entry-card__register--${modeId}`}
                onClick={() => onModalityNav(modeId)}
              >
                {t("gameModalities.hubRegisterCta")}
              </Link>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
