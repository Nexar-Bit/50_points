"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Ticket, X } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useAuth } from "@/frontend/contexts/AuthContext";

const DISMISS_KEY = "50points_free_play_notice_dismissed";

/** gameMode 1 = guest/free launch tier; 2 = registered; 3+ = paid tiers (not launched). */
function noticeVariant(user) {
  if (!user) return null;
  if (user.gameMode === 1 || user.isGuest) return "free";
  if (user.gameMode === 2) return "registered";
  return "paidLocked";
}

export default function FreePlayNotice() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
    setHydrated(true);
  }, []);

  const dismiss = useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const variant = noticeVariant(user);
  if (!hydrated || !isAuthenticated || !user || !variant || dismissed) return null;

  const isFree = variant === "free";
  const title = isFree ? t("freePlay.titleFree") : t("freePlay.titleRegistered");
  const body = isFree ? t("freePlay.bodyFree") : t("freePlay.bodyRegistered");

  return (
    <div
      className={`free-play-notice${isFree ? " free-play-notice--free" : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className="free-play-notice__icon-wrap" aria-hidden>
        <Ticket className="free-play-notice__icon" />
        <span className="free-play-notice__ticket-count">3</span>
      </div>
      <div className="free-play-notice__text">
        <p className="free-play-notice__title">{title}</p>
        <p className="free-play-notice__body">{body}</p>
        {!isFree ? (
          <Link href="/tournaments" className="free-play-notice__cta">
            {t("freePlay.ctaPlay")}
          </Link>
        ) : null}
      </div>
      <button
        type="button"
        className="free-play-notice__dismiss"
        onClick={dismiss}
        aria-label={t("freePlay.dismiss")}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
