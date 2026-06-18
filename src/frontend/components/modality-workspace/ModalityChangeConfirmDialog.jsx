"use client";

import { HelpCircle } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";

export default function ModalityChangeConfirmDialog({
  open,
  targetModalityId,
  onAccept,
  onCancel,
}) {
  const { t } = useLanguage();

  if (!open || !targetModalityId) return null;

  return (
    <div
      className="mw-modality-change"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mw-modality-change-title"
    >
      <button
        type="button"
        className="mw-modality-change__backdrop"
        aria-label={t("modalityWorkspace.changeConfirmCancel")}
        onClick={onCancel}
      />
      <div className="mw-modality-change__panel">
        <div className="mw-modality-change__icon-wrap" aria-hidden>
          <HelpCircle className="mw-modality-change__icon" strokeWidth={2.25} />
        </div>
        <p id="mw-modality-change-title" className="mw-modality-change__message">
          {t("modalityWorkspace.changeConfirmMessage")}
        </p>
        <div className="mw-modality-change__actions">
          <button type="button" className="mw-modality-change__btn mw-modality-change__btn--accept" onClick={onAccept}>
            {t("modalityWorkspace.changeConfirmAccept")}
          </button>
          <button type="button" className="mw-modality-change__btn mw-modality-change__btn--cancel" onClick={onCancel}>
            {t("modalityWorkspace.changeConfirmCancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
