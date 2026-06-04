"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { FLOATING_MENU_ICONS } from "@/frontend/components/layout/FloatingMenuIcons";
import FloatingMenuTabElectrons from "@/frontend/components/layout/FloatingMenuTabElectrons";

/** Platform menu order (player-mode spec): profile → tickets → … → help; logout last. */
const MENU_ITEMS = [
  { id: "profile", href: "/profile", labelKey: "floatingMenu.profile" },
  { id: "tickets", href: "/statistics", labelKey: "floatingMenu.tickets" },
  { id: "tournaments", href: "/tournaments", labelKey: "floatingMenu.tournaments" },
  { id: "gameModes", href: "/modalidades", labelKey: "floatingMenu.gameModes" },
  { id: "ranking", href: "/leaderboard", labelKey: "floatingMenu.ranking" },
  { id: "chat", href: "/chat", labelKey: "floatingMenu.chat" },
  { id: "achievements", href: "/profile?section=achievements", labelKey: "floatingMenu.achievements" },
  { id: "hallOfFame", href: "/hall-of-fame", labelKey: "floatingMenu.hallOfFame" },
  { id: "feed", href: "/#feed", labelKey: "floatingMenu.feed" },
  { id: "statistics", href: "/statistics/explorer", labelKey: "floatingMenu.statistics" },
  { id: "privacy", href: "/profile?section=privacy", labelKey: "floatingMenu.privacy" },
  { id: "settings", href: "/profile?section=settings", labelKey: "floatingMenu.settings" },
  { id: "help", href: "/how-to-play?section=faq", labelKey: "floatingMenu.help" },
];

const PANEL_ANIM_MS = 320;

function isProfilePath(pathname) {
  return pathname === "/profile" || pathname.startsWith("/profile/");
}

export default function FloatingMenuBar() {
  const pathname = usePathname() || "";
  const searchParams = useSearchParams();
  const section = searchParams.get("section");
  const router = useRouter();
  const { t } = useLanguage();
  const { logout } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [peek, setPeek] = useState(false);
  const [panelPhase, setPanelPhase] = useState("closed");
  const [canHoverPeek, setCanHoverPeek] = useState(false);
  const [isOverlayLayout, setIsOverlayLayout] = useState(false);
  const wasOpenRef = useRef(false);

  const showPanel = expanded || (peek && canHoverPeek);
  const panelActive =
    showPanel || panelPhase === "entering" || panelPhase === "open" || panelPhase === "leaving";

  useEffect(() => {
    const mqHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mqOverlay = window.matchMedia("(max-width: 900px)");

    const sync = () => {
      setCanHoverPeek(mqHover.matches);
      setIsOverlayLayout(mqOverlay.matches);
    };

    sync();
    mqHover.addEventListener("change", sync);
    mqOverlay.addEventListener("change", sync);
    return () => {
      mqHover.removeEventListener("change", sync);
      mqOverlay.removeEventListener("change", sync);
    };
  }, []);

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

  useEffect(() => {
    if (!expanded || !isOverlayLayout) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [expanded, isOverlayLayout]);

  const handleClose = useCallback(() => {
    setExpanded(false);
    setPeek(false);
  }, []);

  useEffect(() => {
    if (!expanded) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded, handleClose]);

  const handleTabClick = useCallback(() => {
    setExpanded((value) => !value);
    setPeek(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    handleClose();
    router.push("/");
  }, [logout, handleClose, router]);

  const viewTab = searchParams.get("tab");
  const howSection = searchParams.get("section");

  const isActive = (item) => {
    switch (item.id) {
      case "profile":
        return isProfilePath(pathname) && !section;
      case "tickets":
        return pathname === "/statistics";
      case "tournaments":
        return pathname === "/tournaments" || pathname.startsWith("/tournament/");
      case "gameModes":
        return pathname === "/modalidades" || pathname.startsWith("/modalidades/");
      case "ranking":
        return pathname === "/leaderboard" && viewTab !== "chat";
      case "chat":
        return pathname === "/chat" || (pathname === "/leaderboard" && viewTab === "chat");
      case "achievements":
        return isProfilePath(pathname) && section === "achievements";
      case "hallOfFame":
        return pathname === "/hall-of-fame";
      case "feed":
        return false;
      case "statistics":
        return pathname.startsWith("/statistics/explorer");
      case "privacy":
        return isProfilePath(pathname) && section === "privacy";
      case "settings":
        return isProfilePath(pathname) && section === "settings";
      case "help":
        return pathname === "/how-to-play" && howSection === "faq";
      default:
        return false;
    }
  };

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
    const active = isActive(item);
    const className = `floating-menu__link${active ? " floating-menu__link--active" : ""}`;
    const style = { "--fm-item-index": index };
    const iconEl = Icon ? <Icon className="floating-menu__icon" /> : null;
    const showTooltip = !expanded && !peek;

    const inner = (
      <>
        <span className="floating-menu__icon-wrap">{iconEl}</span>
        <span className="floating-menu__label">{t(item.labelKey)}</span>
      </>
    );

    return (
      <li key={item.id} className="floating-menu__item" style={style}>
        {isButton ? (
          <button
            type="button"
            className={`${className} floating-menu__link--logout`}
            onClick={onButtonClick}
            title={showTooltip ? t(item.labelKey) : undefined}
          >
            {inner}
          </button>
        ) : (
          <Link
            href={item.href}
            className={className}
            title={showTooltip ? t(item.labelKey) : undefined}
            onClick={handleClose}
          >
            {inner}
          </Link>
        )}
      </li>
    );
  };

  return (
    <>
      {expanded ? (
        <button
          type="button"
          className="floating-menu__backdrop"
          aria-label={t("floatingMenu.close")}
          onClick={handleClose}
        />
      ) : null}

      <div
        className={`floating-menu${panelActive ? " floating-menu--open" : ""}${expanded ? " floating-menu--expanded" : ""}${peek && !expanded && panelActive ? " floating-menu--peek" : ""}${isOverlayLayout ? " floating-menu--overlay" : ""}${panelPhase === "entering" ? " floating-menu--anim-in" : ""}${panelPhase === "leaving" ? " floating-menu--anim-out" : ""}`}
        onMouseEnter={() => {
          if (canHoverPeek && !expanded) setPeek(true);
        }}
        onMouseLeave={() => {
          if (canHoverPeek && !expanded) setPeek(false);
        }}
      >
        <div className="floating-menu__rail">
          <FloatingMenuTabElectrons>
            <button
              type="button"
              className="floating-menu__tab"
              onClick={handleTabClick}
              aria-expanded={expanded}
              aria-controls="floating-menu-panel"
              aria-label={expanded ? t("floatingMenu.close") : t("floatingMenu.open")}
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
          id="floating-menu-panel"
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
    </>
  );
}
