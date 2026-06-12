"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/frontend/contexts/AuthContext";
import AppSplashScreen from "@/frontend/components/layout/AppSplashScreen";
import {
  clearCoverPassed,
  hasCoverPassed,
} from "@/frontend/lib/gameModalities";

/** Match CSS loader animation (--splash-loader-duration: 2.4s). */
const MIN_SPLASH_MS = 2400;
const EXIT_MS = 520;

/**
 * Full-screen TORNEO splash on cold load, then cover (/) before /inicio.
 */
export default function AppBootGate({ children }) {
  const { loading } = useAuth();
  const pathname = usePathname() || "";
  const router = useRouter();
  const mountAt = useRef(performance.now());
  const [showSplash, setShowSplash] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    clearCoverPassed();
  }, []);

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
    if (loading || showSplash) return undefined;
    if (pathname === "/inicio" && !hasCoverPassed()) {
      router.replace("/");
    }
    return undefined;
  }, [loading, showSplash, pathname, router]);

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
