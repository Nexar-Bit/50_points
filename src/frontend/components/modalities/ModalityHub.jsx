"use client";

import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { getModality, modalityPath } from "@/frontend/lib/gameModalities";
import ModalityPageShell from "@/frontend/components/modalities/ModalityPageShell";
import {
  MODALITY_CARD_ASSET_KEY,
  ticketWorkflowAsset,
} from "@/frontend/lib/config/ticketWorkflowAssets";

const HUB_GROUPS = [
  { key: "free", labelKey: "hubCategoryFree", modes: ["guest", "free"] },
  { key: "paid", labelKey: "hubCategoryPaid", modes: ["paid", "special"] },
];

function ModalityHubModeCard({ modeId, t }) {
  const mod = getModality(modeId);
  const locked = !mod.available;
  const cardBgKey = MODALITY_CARD_ASSET_KEY[modeId];
  const cardBg = cardBgKey ? ticketWorkflowAsset(cardBgKey) : "";
  const className = `modality-hub-mode-card modality-hub-mode-card--${modeId}${
    locked ? " modality-hub-mode-card--locked" : ""
  }`;
  const cardStyle = cardBg ? { backgroundImage: `url(${cardBg})` } : undefined;

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

  return (
    <Link href={modalityPath(modeId, "tracks")} className={className} style={cardStyle}>
      {content}
    </Link>
  );
}

export default function ModalityHub() {
  const { t } = useLanguage();
  const howAudiences = t("gameModalities.hubHowAudiences");
  const audienceList = Array.isArray(howAudiences) ? howAudiences : [];

  return (
    <ModalityPageShell className="modality-page--hub">
      <div className="modality-hub-surface">
        <div className="modality-hub-board">
          <h1 className="modality-hub-board__title">{t("gameModalities.hubTitle")}</h1>

          <div className="modality-hub-groups">
            {HUB_GROUPS.map((group) => (
              <section key={group.key} className="modality-hub-group" aria-labelledby={`hub-${group.key}`}>
                <h2 id={`hub-${group.key}`} className="modality-hub-group__legend">
                  {t(`gameModalities.${group.labelKey}`)}
                </h2>
                <div className="modality-hub-group__cards">
                  {group.modes.map((modeId) => (
                    <ModalityHubModeCard key={modeId} modeId={modeId} t={t} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="modality-hub-how" aria-labelledby="modality-hub-how-title">
            <h2 id="modality-hub-how-title" className="modality-hub-how__title">
              {t("gameModalities.howTitle")}
            </h2>
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
        </div>
      </div>
    </ModalityPageShell>
  );
}
