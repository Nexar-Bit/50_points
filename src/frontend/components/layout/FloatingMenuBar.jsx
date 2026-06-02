"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { FLOATING_MENU_ICONS } from "@/frontend/components/layout/FloatingMenuIcons";
import FloatingMenuTabElectrons from "@/frontend/components/layout/FloatingMenuTabElectrons";

const MENU_ITEMS = [
  { id: "tickets", href: "/profile", labelKey: "floatingMenu.tickets", match: (p) => p === "/profile" || p.startsWith("/profile/") },
  { id: "tournaments", href: "/tournaments", labelKey: "floatingMenu.tournaments", match: (p) => p.startsWith("/tournament") || p === "/tournaments" },
  { id: "ranking", href: "/leaderboard", labelKey: "floatingMenu.ranking", match: (p) => p === "/leaderboard" },
  { id: "racecourses", href: "/tournaments", labelKey: "floatingMenu.racecourses", match: () => false },
  { id: "statistics", href: "/statistics", labelKey: "floatingMenu.statistics", match: (p) => p === "/statistics" },
  { id: "top10", href: "/legends", labelKey: "floatingMenu.top10", match: (p) => p === "/legends" },
  { id: "groups", href: "/groups", labelKey: "floatingMenu.groups", match: (p) => p.startsWith("/groups") },
  { id: "achievements", href: "/profile", labelKey: "floatingMenu.achievements", match: () => false },
  { id: "hallOfFame", href: "/hall-of-fame", labelKey: "floatingMenu.hallOfFame", match: (p) => p === "/hall-of-fame" },
  { id: "profile", href: "/profile", labelKey: "floatingMenu.profile", match: () => false },
  { id: "help", href: "/how-to-play", labelKey: "floatingMenu.help", match: (p) => p === "/how-to-play" },
];

const PANEL_ANIM_MS = 320;

export default function FloatingMenuBar() {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { t } = useLanguage();
  const { logout } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [peek, setPeek] = useState(false);
  const [panelPhase, setPanelPhase] = useState("closed");
  const wasOpenRef = useRef(false);

  const showPanel = expanded || peek;
  const panelActive =
    showPanel || panelPhase === "entering" || panelPhase === "open" || panelPhase === "leaving";

  useEffect(() => {
    setExpanded(false);
    setPeek(false);
  }, [pathname]);

  useEffect(() => {
    if (showPanel) {
      wasOpenRef.current = true;
      setPanelPhase("entering");
      const enterDone = window.setTimeout(() => setPanelPhase("open"), PANEL_ANIM_MS);
      return () => window.clearTimeout(enterDone);
    }

    if (!wasOpenRef.current) return undefined;

    setPanelPhase("leaving");
    const leaveDone = window.setTimeout(() => {
      setPanelPhase("closed");
      wasOpenRef.current = false;
    }, PANEL_ANIM_MS);
    return () => window.clearTimeout(leaveDone);
  }, [showPanel]);

  const handleTabClick = useCallback(() => {
    setExpanded((v) => !v);
    setPeek(false);
  }, []);

  const handleClose = useCallback(() => {
    setExpanded(false);
    setPeek(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    handleClose();
    router.push("/");
  }, [logout, handleClose, router]);

  const isActive = (item) => item.match(pathname);
  const panelVisible = showPanel || panelPhase === "leaving";
  const panelAnimClass =
    panelPhase === "entering"
      ? " floating-menu__panel--enter"
      : panelPhase === "leaving"
        ? " floating-menu__panel--leave"
        : panelPhase === "open"
          ? " floating-menu__panel--visible"
          : "";

  const renderNavItem = (item, index, isButton = false, onButtonClick) => {
    const Icon = FLOATING_MENU_ICONS[item.id];
    const active = item.match ? isActive(item) : false;
    const className = `floating-menu__link${active ? " floating-menu__link--active" : ""}`;
    const style = { "--fm-item-index": index };
    const iconEl = Icon ? <Icon className="floating-menu__icon" /> : null;

    const inner = (
      <>
        <span className="floating-menu__icon-wrap">{iconEl}</span>
        <span className="floating-menu__label">{t(item.labelKey)}</span>
      </>
    );

    return (
      <li
        key={item.id}
        className="floating-menu__item"
        style={style}
      >
        {isButton ? (
          <button
            type="button"
            className={`${className} floating-menu__link--logout`}
            onClick={onButtonClick}
            title={expanded ? undefined : t(item.labelKey)}
          >
            {inner}
          </button>
        ) : (
          <Link
            href={item.href}
            className={className}
            title={expanded ? undefined : t(item.labelKey)}
            onClick={handleClose}
          >
            {inner}
          </Link>
        )}
      </li>
    );
  };

  return (
    <div
      className={`floating-menu${panelActive ? " floating-menu--open" : ""}${expanded ? " floating-menu--expanded" : ""}${peek && !expanded && panelActive ? " floating-menu--peek" : ""}${panelPhase === "entering" ? " floating-menu--anim-in" : ""}${panelPhase === "leaving" ? " floating-menu--anim-out" : ""}`}
      onMouseEnter={() => {
        if (!expanded) setPeek(true);
      }}
      onMouseLeave={() => {
        if (!expanded) setPeek(false);
      }}
    >
      <div className="floating-menu__rail">
        <FloatingMenuTabElectrons>
          <button
            type="button"
            className="floating-menu__tab"
            onClick={handleTabClick}
            aria-expanded={expanded}
            aria-label={t("floatingMenu.open")}
          >
            <span className="floating-menu__letters">
              {t("floatingMenu.tab")
                .split("")
                .map((char, index) => (
                  <span key={`${char}-${index}`} className="floating-menu__letter">
                    {char}
                  </span>
                ))}
            </span>
          </button>
        </FloatingMenuTabElectrons>
      </div>

      <div
        className={`floating-menu__panel${panelVisible ? " floating-menu__panel--mounted" : ""}${panelAnimClass}`}
        role="navigation"
        aria-label={t("floatingMenu.aria")}
        aria-hidden={!panelVisible}
      >
        <div className="floating-menu__panel-head">
          {expanded ? (
            <button
              type="button"
              className="floating-menu__close"
              onClick={handleClose}
              aria-label={t("floatingMenu.close")}
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="floating-menu__peek-spacer" aria-hidden />
          )}
        </div>

        <ul className={`floating-menu__list${panelVisible ? " floating-menu__list--visible" : ""}`}>
          {MENU_ITEMS.map((item, index) => renderNavItem(item, index))}
          {renderNavItem(
            { id: "logout", labelKey: "floatingMenu.logout" },
            MENU_ITEMS.length,
            true,
            handleLogout,
          )}
        </ul>
      </div>
    </div>
  );
}
