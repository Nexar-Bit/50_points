"use client";

import Link from "next/link";
import { Trophy, Crown, Star, User, Lock, ChevronRight, MoreVertical, ArrowRight } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { modeBgFile } from "@/frontend/lib/config/paths";
import {
  HUB_DISPLAY_ORDER,
  getModality,
  modalityPath,
} from "@/frontend/lib/gameModalities";
import ModalityPageShell from "@/frontend/components/modalities/ModalityPageShell";
import ModalityHubShowcase from "@/frontend/components/modalities/ModalityHubShowcase";

const ICONS = {
  trophy: Trophy,
  ticket: Crown,
  star: Star,
  user: User,
};

export default function ModalityHub() {
  const { t } = useLanguage();
  const order = HUB_DISPLAY_ORDER;
  const howLines = t("gameModalities.howBullets");
  const howPreview = Array.isArray(howLines) ? howLines[0] : "";

  return (
    <ModalityPageShell className="modality-page--hub">
      <div className="modality-hub-surface">
        <img
          className="modality-hub-surface__bg"
          src={modeBgFile()}
          alt=""
          aria-hidden
          decoding="async"
          fetchPriority="high"
        />
        <div className="modality-hub-surface__veil" aria-hidden />

        <div className="modality-hub-layout">
          <aside className="modality-hub-sidebar">
            <header className="modality-hub-sidebar__head">
              <h1 className="modality-hub-sidebar__title">{t("gameModalities.hubTitle")}</h1>
              <p className="modality-hub-sidebar__arena">{t("gameModalities.hubArena")}</p>
            </header>

            <ul className="modality-hub-list">
              {order.map((id, index) => {
                const mod = getModality(id);
                const Icon = ICONS[mod.icon] || Trophy;
                const locked = !mod.available;
                const isActive = id === "free" && !locked;

                return (
                  <li key={id}>
                    <Link
                      href={locked ? "#" : modalityPath(id, "tracks")}
                      className={`modality-hub-card modality-hub-card--${id}${
                        locked ? " modality-hub-card--locked" : ""
                      }${isActive ? " modality-hub-card--active" : ""}`}
                      aria-disabled={locked}
                      aria-current={isActive ? "page" : undefined}
                      onClick={locked ? (e) => e.preventDefault() : undefined}
                    >
                      <span className="modality-hub-card__icon-wrap">
                        <Icon className="modality-hub-card__icon" aria-hidden strokeWidth={1.75} />
                      </span>
                      <span className="modality-hub-card__body">
                        <span className="modality-hub-card__title">
                          {t("gameModalities.modalityLabel")} {index + 1}
                        </span>
                        <span className="modality-hub-card__desc">
                          {t(`gameModalities.${id}.title`)}
                        </span>
                      </span>
                      {locked ? (
                        <Lock className="modality-hub-card__trail" aria-hidden strokeWidth={2} />
                      ) : isActive ? (
                        <ChevronRight className="modality-hub-card__trail" aria-hidden strokeWidth={2} />
                      ) : id === "guest" ? (
                        <MoreVertical className="modality-hub-card__trail" aria-hidden strokeWidth={2} />
                      ) : (
                        <span className="modality-hub-card__trail modality-hub-card__trail--spacer" aria-hidden />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="modality-hub-sidebar__how">
              <h2>{t("gameModalities.howTitle")}</h2>
              <p>{howPreview}</p>
              <Link href="/how-to-play" className="modality-hub-sidebar__learn">
                {t("gameModalities.learnMore")}
                <ArrowRight className="w-3.5 h-3.5" aria-hidden />
              </Link>
            </div>
          </aside>

          <ModalityHubShowcase order={order} />
        </div>
      </div>
    </ModalityPageShell>
  );
}
