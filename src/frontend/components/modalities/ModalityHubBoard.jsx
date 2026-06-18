"use client";

import ModalityEntryCards from "@/frontend/components/modalities/ModalityEntryCards";
import ModalityImportantNotice from "@/frontend/components/modalities/ModalityImportantNotice";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";

export default function ModalityHubBoard({
  showHow = true,
  className = "",
  titleAs = "h1",
  layout = "flat",
}) {
  const { t } = useLanguage();
  const TitleTag = titleAs;

  return (
    <div className={`modality-hub-board${className ? ` ${className}` : ""}`}>
      <TitleTag className="modality-hub-board__title">{t("gameModalities.hubTitle")}</TitleTag>

      <ModalityEntryCards t={t} />

      {showHow ? <ModalityImportantNotice t={t} /> : null}
    </div>
  );
}
