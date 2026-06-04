"use client";

import Link from "next/link";
import { Flag, Ticket, Star } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { HUB_DISPLAY_ORDER, getModality, modalityPath } from "@/frontend/lib/gameModalities";

const HUB_TABS = [
  { id: "all", href: "/modalidades", labelKey: "hubTabAll" },
  { id: "tracks", href: "/modalidades/free", labelKey: "hubTabTracks" },
  { id: "tickets", href: "/modalidades/free", labelKey: "hubTabTickets" },
  { id: "tournaments", href: "/tournaments?modality=free", labelKey: "hubTabTournaments" },
];

export default function ModalityHubShowcase({ order = HUB_DISPLAY_ORDER }) {
  const { t } = useLanguage();

  return (
    <section className="modality-hub-showcase" aria-label={t("gameModalities.showcaseAria")}>
      <div className="modality-hub-showcase__hero">
        <div className="modality-hub-showcase__hero-copy">
          <p className="modality-hub-showcase__eyebrow">{t("gameModalities.showcaseEyebrow")}</p>
          <div className="modality-hub-showcase__brand">
            <span className="modality-hub-showcase__brand-num">50</span>
            <span className="modality-hub-showcase__brand-pts">{t("common.pts")}</span>
          </div>
          <h2 className="modality-hub-showcase__title">{t("gameModalities.showcaseTitle")}</h2>
          <p className="modality-hub-showcase__desc">{t("gameModalities.showcaseDesc")}</p>
        </div>
      </div>

      <div className="modality-hub-showcase__controls">
      <nav className="modality-hub-tabs" aria-label={t("gameModalities.hubTabsAria")}>
        {HUB_TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`modality-hub-tabs__item${
              tab.id === "all" ? " modality-hub-tabs__item--active" : ""
            }`}
            aria-current={tab.id === "all" ? "page" : undefined}
          >
            {t(`gameModalities.${tab.labelKey}`)}
          </Link>
        ))}
      </nav>

      <ul className="modality-hub-filters">
        {order.map((id) => {
          const mod = getModality(id);
          const locked = !mod.available;
          const isActiveFilter = id === "free" && !locked;
          return (
            <li key={id}>
              {locked ? (
                <span
                  className={`modality-hub-filters__btn modality-hub-filters__btn--${id} modality-hub-filters__btn--locked`}
                >
                  {t(`gameModalities.${id}.title`)}
                </span>
              ) : (
                <Link
                  href={modalityPath(id, "tracks")}
                  className={`modality-hub-filters__btn modality-hub-filters__btn--${id}${
                    isActiveFilter ? " modality-hub-filters__btn--active" : ""
                  }`}
                  style={{ "--filter-accent": mod.accent }}
                >
                  {t(`gameModalities.${id}.title`)}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <div className="modality-hub-showcase__stats">
        <div className="modality-hub-stat modality-hub-stat--purple">
          <Flag className="modality-hub-stat__icon" aria-hidden strokeWidth={1.75} />
          <div>
            <span className="modality-hub-stat__val">4 {t("gameModalities.showcaseModes")}</span>
            <span className="modality-hub-stat__label">{t("gameModalities.statAvailable")}</span>
          </div>
        </div>
        <div className="modality-hub-stat modality-hub-stat--cyan">
          <Ticket className="modality-hub-stat__icon" aria-hidden strokeWidth={1.75} />
          <div>
            <span className="modality-hub-stat__val">
              3 {t("gameModalities.showcaseTickets")}
            </span>
            <span className="modality-hub-stat__label">{t("gameModalities.statPerMode")}</span>
          </div>
        </div>
        <div className="modality-hub-stat modality-hub-stat--gold">
          <Star className="modality-hub-stat__icon" aria-hidden strokeWidth={1.75} />
          <div>
            <span className="modality-hub-stat__val">
              50 {t("gameModalities.showcasePerRace")}
            </span>
            <span className="modality-hub-stat__label">{t("gameModalities.statMaxPts")}</span>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
