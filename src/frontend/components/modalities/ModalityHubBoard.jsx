"use client";

import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { getModality, modalityPath, MODALITY_IDS } from "@/frontend/lib/gameModalities";
import {
  MODALITY_CARD_ASSET_KEY,
  ticketWorkflowAsset,
} from "@/frontend/lib/config/ticketWorkflowAssets";

const HUB_GROUPS = [
  { key: "free", labelKey: "hubCategoryFree", modes: ["guest", "free"] },
  { key: "paid", labelKey: "hubCategoryPaid", modes: ["paid", "special"] },
];

/** CSS gradients mirrored from globals.css — used as a base layer under the PNG overlay. */
const CARD_GRADIENTS = {
  guest:   "linear-gradient(165deg, #60a5fa 0%, #2563eb 48%, #1d4ed8 100%)",
  free:    "linear-gradient(165deg, #e879f9 0%, #c026d3 50%, #a21caf 100%)",
  paid:    "linear-gradient(165deg, #fde047 0%, #facc15 52%, #eab308 100%)",
  special: "linear-gradient(165deg, #52525b 0%, #3f3f46 42%, #27272a 100%)",
};

function ModalityHubModeCard({ modeId, t, selectable, activeModeId, onModeSelect }) {
  const mod = getModality(modeId);
  const locked = !mod.available;
  const cardBgKey = MODALITY_CARD_ASSET_KEY[modeId];
  const cardBg = cardBgKey ? ticketWorkflowAsset(cardBgKey) : "";
  const isSelected = activeModeId === modeId;
  const className = `modality-hub-mode-card modality-hub-mode-card--${modeId}${
    locked ? " modality-hub-mode-card--locked" : ""
  }${isSelected ? " modality-hub-mode-card--selected" : ""}`;

  // Stack the PNG on top of the gradient so transparent areas show the gradient
  const cardStyle = cardBg
    ? {
        backgroundImage: `url(${cardBg}), ${CARD_GRADIENTS[modeId] || "none"}`,
        backgroundSize: "cover, cover",
        backgroundPosition: "center top, center top",
        backgroundRepeat: "no-repeat, no-repeat",
      }
    : undefined;

  const content = (
    <>
      <h3 className="modality-hub-mode-card__tournament">
        {t(`gameModalities.${modeId}.hubTournament`)}
      </h3>
      <p className="modality-hub-mode-card__play">{t(`gameModalities.${modeId}.hubPlayLine`)}</p>
      <p className="modality-hub-mode-card__detail">{t(`gameModalities.${modeId}.hubDetail`)}</p>
      {t(`gameModalities.${modeId}.hubAudience`) ? (
        <p className="modality-hub-mode-card__audience">
          {t(`gameModalities.${modeId}.hubAudience`)}
        </p>
      ) : null}
      {locked ? <Lock className="modality-hub-mode-card__lock" aria-hidden strokeWidth={2} /> : null}
    </>
  );

  if (locked) {
    return (
      <div className={className} style={cardStyle} aria-disabled="true">
        {content}
      </div>
    );
  }

  if (selectable) {
    return (
      <button
        type="button"
        className={className}
        style={cardStyle}
        aria-pressed={isSelected}
        onClick={() => onModeSelect?.(modeId)}
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={modalityPath(modeId, "tracks")} className={className} style={cardStyle}>
      {content}
    </Link>
  );
}

export default function ModalityHubBoard({
  showHow = true,
  className = "",
  titleAs = "h1",
  layout = "flat",
  selectable = false,
  activeModeId = null,
  onModeSelect,
}) {
  const { t } = useLanguage();
  const howAudiences = t("gameModalities.hubHowAudiences");
  const audienceList = Array.isArray(howAudiences) ? howAudiences : [];
  const TitleTag = titleAs;

  const modeCards = (modes) =>
    modes.map((modeId) => (
      <ModalityHubModeCard
        key={modeId}
        modeId={modeId}
        t={t}
        selectable={selectable}
        activeModeId={activeModeId}
        onModeSelect={onModeSelect}
      />
    ));

  return (
    <div className={`modality-hub-board${className ? ` ${className}` : ""}`}>
      <TitleTag className="modality-hub-board__title">{t("gameModalities.hubTitle")}</TitleTag>

      {layout === "flat" ? (
        <div className="modality-hub-board__flat-cards">{modeCards(MODALITY_IDS)}</div>
      ) : (
        <div className="modality-hub-groups">
          {HUB_GROUPS.map((group) => (
            <section
              key={group.key}
              id={`hub-${group.key}`}
              className="modality-hub-group"
              aria-labelledby={`hub-${group.key}`}
            >
              <h3 id={`hub-${group.key}`} className="modality-hub-group__legend">
                {t(`gameModalities.${group.labelKey}`)}
              </h3>
              <div className="modality-hub-group__cards">{modeCards(group.modes)}</div>
            </section>
          ))}
        </div>
      )}

      {showHow ? (
        <section className="modality-hub-how" aria-labelledby="modality-hub-how-title">
          <h3 id="modality-hub-how-title" className="modality-hub-how__title">
            {t("gameModalities.howTitle")}
          </h3>
          <p className="modality-hub-how__lead">{t("gameModalities.hubHowLead")}</p>
          <ul className="modality-hub-how__audiences">
            {audienceList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="modality-hub-how__text">{t("gameModalities.hubHowGoal")}</p>
          <p className="modality-hub-how__text">{t("gameModalities.hubHowTickets")}</p>
          <p className="modality-hub-how__text">{t("gameModalities.hubHowRegistered")}</p>
          <Link href="/how-to-play" className="modality-hub-how__learn">
            {t("gameModalities.learnMore")}
            <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </Link>
        </section>
      ) : null}
    </div>
  );
}
