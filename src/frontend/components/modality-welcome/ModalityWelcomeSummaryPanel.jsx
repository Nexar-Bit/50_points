"use client";

import { useEffect, useState } from "react";
import { ChevronUp, Info } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import ModalityWelcomeDetail from "@/frontend/components/modality-welcome/ModalityWelcomeDetail";

/**
 * Workspace modality info — expanded detail first; colored strip collapses it.
 */
export default function ModalityWelcomeSummaryPanel({ modalityId, defaultExpanded = true }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(defaultExpanded);

  useEffect(() => {
    setExpanded(defaultExpanded);
  }, [modalityId, defaultExpanded]);

  if (!modalityId) return null;

  const highlight = t(`modalityWelcome.detailHighlight.${modalityId}`);

  return (
    <section
      className={`mw-welcome-summary mw-welcome-summary--${modalityId}${
        expanded ? " mw-welcome-summary--expanded" : ""
      }`}
      aria-label={t("modalityWelcome.summaryAria")}
    >
      {expanded ? (
        <div className="mw-welcome-summary__body">
          <ModalityWelcomeDetail t={t} modalityId={modalityId} />
        </div>
      ) : null}

      <button
        type="button"
        className="mw-welcome-summary__strip"
        aria-expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Info className="mw-welcome-summary__info" strokeWidth={2.25} aria-hidden />
        <span className="mw-welcome-summary__strip-text">
          {expanded ? t("modalityWelcome.collapseInfo") : highlight}
        </span>
        <ChevronUp
          className={`mw-welcome-summary__chevron${expanded ? "" : " mw-welcome-summary__chevron--collapsed"}`}
          strokeWidth={2.5}
          aria-hidden
        />
      </button>
    </section>
  );
}
