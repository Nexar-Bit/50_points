"use client";

import { useCallback, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Info } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { acceptModalityWelcome } from "@/frontend/lib/modalityWelcomeStorage";
import ModalityWelcomeCards, {
  ModalityWelcomePathStrip,
} from "@/frontend/components/modality-welcome/ModalityWelcomeCards";

export default function ModalityWelcomeModal({ open, modalityId, onAccept }) {
  const { t } = useLanguage();

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
      if (event.key === "Escape") onAccept();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onAccept]);

  const handleAccept = useCallback(() => {
    acceptModalityWelcome(modalityId);
    onAccept();
  }, [modalityId, onAccept]);

  if (!open || !modalityId) return null;

  const detailBullets = t(`modalityWelcome.detailBullets.${modalityId}`);
  const bulletList = Array.isArray(detailBullets) ? detailBullets : [];
  const importantText = t(`modalityWelcome.importantText.${modalityId}`);
  const exampleTitle = t(`modalityWelcome.detailExampleTitle.${modalityId}`);
  const exampleFields = t(`modalityWelcome.detailExampleFields.${modalityId}`);
  const exampleList = Array.isArray(exampleFields) ? exampleFields : [];
  const asideText = t(`modalityWelcome.detailAside.${modalityId}`);

  return (
    <div
      className="mw-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mw-modal-title"
    >
      <button
        type="button"
        className="mw-modal__backdrop"
        aria-label={t("modalityWelcome.acceptCta")}
        onClick={handleAccept}
      />
      <div className="mw-modal__panel">
        <ModalityWelcomePathStrip t={t} />

        <header className="mw-modal__head">
          <div className="mw-modal__stripes" aria-hidden>
            <span className="mw-modal__stripe mw-modal__stripe--paid" />
            <span className="mw-modal__stripe mw-modal__stripe--free" />
            <span className="mw-modal__stripe mw-modal__stripe--special" />
            <span className="mw-modal__stripe mw-modal__stripe--guest" />
          </div>
          <h2 id="mw-modal-title" className="mw-modal__title">
            {t("gameModalities.hubTitle")}
          </h2>
          <p className="mw-modal__current-label">
            <span className="mw-modal__current-icon" aria-hidden>▶</span>
            {t("modalityWelcome.currentModality")}
          </p>
          <p className="mw-modal__lead">{t("ticketWorkflow.landingLead")}</p>
        </header>

        <div className="mw-modal__body">
          <ModalityWelcomeCards t={t} activeModalityId={modalityId} />

          <section
            className={`mw-detail mw-detail--${modalityId}`}
            aria-labelledby="mw-detail-title"
          >
            <h3 id="mw-detail-title" className="mw-detail__title">
              {t(`modalityWelcome.detailTitle.${modalityId}`)}
            </h3>
            <div className="mw-detail__grid">
              <div className="mw-detail__main">
                <p className="mw-detail__highlight">{t(`modalityWelcome.detailHighlight.${modalityId}`)}</p>
                <p className="mw-detail__text">{t(`modalityWelcome.detailBody.${modalityId}`)}</p>
                {bulletList.length > 0 ? (
                  <ul className="mw-detail__list">
                    {bulletList.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
              {exampleList.length > 0 ? (
                <aside className="mw-detail__example">
                  {exampleTitle ? (
                    <p className="mw-detail__example-title">{exampleTitle}</p>
                  ) : null}
                  <dl className="mw-detail__example-list">
                    {exampleList.map((field) => (
                      <div key={field.label} className="mw-detail__example-row">
                        <dt>{field.label}</dt>
                        <dd>{field.value}</dd>
                      </div>
                    ))}
                  </dl>
                </aside>
              ) : asideText ? (
                <aside className="mw-detail__aside">
                  <p className="mw-detail__aside-text">{asideText}</p>
                </aside>
              ) : null}
            </div>
          </section>

          {importantText ? (
            <div className="mw-important">
              <Info className="mw-important__icon" strokeWidth={2} aria-hidden />
              <p className="mw-important__text">
                <strong>{t("modalityWelcome.importantLabel")}</strong> {importantText}
              </p>
            </div>
          ) : null}
        </div>

        <footer className="mw-modal__footer">
          <button type="button" className="mw-modal__accept" onClick={handleAccept}>
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
