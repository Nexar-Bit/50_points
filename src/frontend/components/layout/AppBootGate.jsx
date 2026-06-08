"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/frontend/contexts/AuthContext";
import AppSplashScreen from "@/frontend/components/layout/AppSplashScreen";

/** Hide splash as soon as auth bootstrap completes (no artificial delay). */
const MIN_SPLASH_MS = 0;
const EXIT_MS = 320;

/**
 * Full-screen TORNEO splash on cold load while auth/bootstrap finishes.
 */
export default function AppBootGate({ children }) {
  const { loading } = useAuth();
  const mountAt = useRef(performance.now());
  const [showSplash, setShowSplash] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (loading) return undefined;

    const waitMs = Math.max(0, MIN_SPLASH_MS - (performance.now() - mountAt.current));
    const hideTimer = window.setTimeout(() => {
      setExiting(true);
      window.setTimeout(() => setShowSplash(false), EXIT_MS);
    }, waitMs);

    return () => window.clearTimeout(hideTimer);
  }, [loading]);

  useEffect(() => {
    if (!showSplash) {
      document.body.style.overflow = "";
      return undefined;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showSplash]);

  return (
    <>
      {showSplash ? <AppSplashScreen exiting={exiting} /> : null}
      <div
        className={showSplash && !exiting ? "app-boot-gate__content--hidden" : "app-boot-gate__content"}
        aria-hidden={showSplash && !exiting}
      >
        {children}
      </div>
    </>
  );
}
