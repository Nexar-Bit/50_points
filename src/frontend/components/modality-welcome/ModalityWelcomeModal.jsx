"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { acceptModalityWelcome } from "@/frontend/lib/modalityWelcomeStorage";
import ModalityWelcomeCards, {
  ModalityWelcomeHubStripes,
  ModalityWelcomePathStrip,
} from "@/frontend/components/modality-welcome/ModalityWelcomeCards";
import ModalityWelcomeDetail from "@/frontend/components/modality-welcome/ModalityWelcomeDetail";

const COLLAPSE_MS = 420;

export default function ModalityWelcomeModal({ open, modalityId, onAccept }) {
  const { t } = useLanguage();
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) setClosing(false);
  }, [open, modalityId]);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open || closing) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") handleAccept();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closing, handleAccept]);

  const finishAccept = useCallback(() => {
    acceptModalityWelcome(modalityId);
    onAccept();
  }, [modalityId, onAccept]);

  const handleAccept = useCallback(() => {
    if (closing || !modalityId) return;
    setClosing(true);
    window.setTimeout(finishAccept, COLLAPSE_MS);
  }, [closing, modalityId, finishAccept]);

  if (!open || !modalityId) return null;

  return (
    <div
      className={`mw-modal mw-modal--${modalityId}${closing ? " mw-modal--closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mw-modal-title"
    >
      <button
        type="button"
        className="mw-modal__backdrop"
        aria-label={t("modalityWelcome.acceptCta")}
        onClick={handleAccept}
        disabled={closing}
      />
      <div className="mw-modal__panel">
        <ModalityWelcomePathStrip t={t} />

        <header className="mw-modal__head">
          <h2 id="mw-modal-title" className="mw-modal__title">
            {t("gameModalities.hubTitle")}
          </h2>
          <ModalityWelcomeHubStripes />
          <p className="mw-modal__current-label">
            <span className="mw-modal__current-icon" aria-hidden>
              ▶
            </span>
            {t("modalityWelcome.currentModality")}
          </p>
          <p className="mw-modal__lead">{t("ticketWorkflow.landingLead")}</p>
        </header>

        <div className="mw-modal__body">
          <ModalityWelcomeCards t={t} activeModalityId={modalityId} />
          <ModalityWelcomeDetail t={t} modalityId={modalityId} />
        </div>

        <footer className="mw-modal__footer">
          <button
            type="button"
            className={`mw-modal__accept mw-modal__accept--${modalityId}`}
            onClick={handleAccept}
            disabled={closing}
          >
            <CheckCircle2 className="mw-modal__accept-icon" strokeWidth={2.25} aria-hidden />
            <span>{t("modalityWelcome.acceptCta")}</span>
          </button>
          <p className="mw-modal__hint">
            {t("modalityWelcome.menuHint")}{" "}
            <Link href="/guia-torneo" className="mw-modal__hint-link">
              {t("floatingMenu.tournamentGuide")}
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
