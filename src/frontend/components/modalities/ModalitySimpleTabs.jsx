"use client";

import Link from "next/link";
import { Ticket } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { getModality } from "@/frontend/lib/gameModalities";

/**
 * Modalidades | Hipódromos | Tickets — free modality top navigation.
 */
export default function ModalitySimpleTabs({ modalityId, active = "tracks" }) {
  const { t } = useLanguage();
  const mod = getModality(modalityId);
  const base = `/modalidades/${modalityId}`;

  const tabs = [
    { id: "hub", href: "/modalidades", labelKey: "tabModalities", icon: null },
    { id: "tracks", href: base, labelKey: "tabTracks", icon: null },
    { id: "tickets", href: `${base}#tickets`, labelKey: "hubTabTickets", icon: Ticket },
  ];

  return (
    <nav
      className="modality-simple-tabs"
      aria-label={t("gameModalities.simpleTabsAria")}
      style={{ "--modality-accent": mod.accent }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`modality-simple-tabs__tab${isActive ? " modality-simple-tabs__tab--active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {Icon ? <Icon className="modality-simple-tabs__icon" aria-hidden strokeWidth={2} /> : null}
            {t(`gameModalities.${tab.labelKey}`)}
          </Link>
        );
      })}
    </nav>
  );
}
