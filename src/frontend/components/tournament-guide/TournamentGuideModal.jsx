"use client";

import { useCallback, useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { dismissTournamentGuide } from "@/frontend/lib/tournamentGuideStorage";
import TournamentGuideSteps, {
  TournamentGuideHeroArt,
  TournamentGuidePath,
} from "@/frontend/components/tournament-guide/TournamentGuideSteps";
import TournamentGuideQuickSummary from "@/frontend/components/tournament-guide/TournamentGuideQuickSummary";

export default function TournamentGuideModal({ open, onClose }) {
  const { t } = useLanguage();
  const [dontShow, setDontShow] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose({ dontShowAgain: dontShow });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, dontShow]);

  const handleClose = useCallback(
    (begin = false) => {
      if (dontShow) dismissTournamentGuide();
      onClose({ dontShowAgain: dontShow, begin });
    },
    [dontShow, onClose],
  );

  if (!open) return null;

  return (
    <div className="tg-modal" role="dialog" aria-modal="true" aria-labelledby="tg-modal-title">
      <button
        type="button"
        className="tg-modal__backdrop"
        aria-label={t("tournamentGuide.closeCta")}
        onClick={() => handleClose(false)}
      />
      <div className="tg-modal__panel">
        <header className="tg-modal__header">
          <TournamentGuideHeroArt className="tg-modal__hero-art" />
          <div className="tg-modal__header-copy">
            <p className="tg-modal__eyebrow">{t("tournamentGuide.modalEyebrow")}</p>
            <h2 id="tg-modal-title" className="tg-modal__title">
              {t("tournamentGuide.modalTitle")}
            </h2>
            <TournamentGuidePath t={t} className="tg-modal__path" />
            <p className="tg-modal__lead">{t("tournamentGuide.modalLead")}</p>
          </div>
        </header>

        <div className="tg-modal__body">
          <TournamentGuideSteps t={t} compact />
          <TournamentGuideQuickSummary t={t} />
        </div>

        <footer className="tg-modal__footer">
          <label className="tg-modal__dismiss">
            <input
              type="checkbox"
              checked={dontShow}
              onChange={(event) => setDontShow(event.target.checked)}
            />
            <span className="tg-modal__dismiss-copy">
              <strong>{t("tournamentGuide.dontShowAgain")}</strong>
              <span>{t("tournamentGuide.dontShowHint")}</span>
            </span>
          </label>

          <div className="tg-modal__actions">
            <button
              type="button"
              className="tg-modal__btn tg-modal__btn--primary"
              onClick={() => handleClose(true)}
            >
              <Play className="tg-modal__btn-icon" strokeWidth={2.5} aria-hidden />
              <span className="tg-modal__btn-text">{t("tournamentGuide.beginCta")}</span>
            </button>
            <button
              type="button"
              className="tg-modal__btn tg-modal__btn--secondary"
              onClick={() => handleClose(false)}
            >
              <X className="tg-modal__btn-icon" strokeWidth={2.5} aria-hidden />
              <span className="tg-modal__btn-text">{t("tournamentGuide.closeCta")}</span>
            </button>
          </div>

          <p className="tg-modal__menu-hint">{t("tournamentGuide.menuHint")}</p>
        </footer>
      </div>
    </div>
  );
}
