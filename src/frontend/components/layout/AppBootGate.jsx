"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/frontend/contexts/AuthContext";
import AppSplashScreen from "@/frontend/components/layout/AppSplashScreen";
import {
  clearCoverPassed,
  hasCoverPassed,
  persistModality,
  isValidModalityId,
} from "@/frontend/lib/gameModalities";

/** Match CSS loader animation (--splash-loader-duration: 2.4s). */
const MIN_SPLASH_MS = 2400;
const EXIT_MS = 520;

/**
 * Pages that bypass the cover-page gate.
 * Auth routes and the cover itself are always accessible directly.
 */
const BYPASS_PATHS = ["/", "/login", "/register"];
function shouldBypassCover(pathname) {
  return (
    BYPASS_PATHS.includes(pathname) ||
    pathname.startsWith("/api/")
  );
}

/**
 * Full-screen TORNEO splash on cold load → always lands on cover (/) first.
 * After the user interacts with the cover, navigation is unrestricted.
 */
export default function AppBootGate({ children }) {
  const { loading } = useAuth();
  const pathname = usePathname() || "";
  const router = useRouter();
  const mountAt = useRef(performance.now());
  const [showSplash, setShowSplash] = useState(true);
  const [exiting, setExiting] = useState(false);

  // Always reset cover-passed on fresh page load so splash always shows.
  // If a ?modality=X param is in the URL, persist it so the blue card is
  // highlighted when the user arrives at /inicio after the cover.
  useEffect(() => {
    clearCoverPassed();
    const params = new URLSearchParams(window.location.search);
    const m = params.get("modality");
    if (m && isValidModalityId(m)) {
      persistModality(m);
    }
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

  // After splash: if the user hasn't passed the cover yet, redirect to portada (/)
  useEffect(() => {
    if (loading || showSplash) return undefined;
    if (!hasCoverPassed() && !shouldBypassCover(pathname)) {
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
