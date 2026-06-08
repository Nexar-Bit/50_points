"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Header from "@/frontend/components/layout/Header";
import Footer from "@/frontend/components/layout/Footer";
import FloatingMenuBar from "@/frontend/components/layout/FloatingMenuBar";
import AppSurface from "@/frontend/components/layout/AppSurface";
import LanguageToggle from "@/frontend/components/layout/LanguageToggle";
import { useAuth } from "@/frontend/contexts/AuthContext";

function isHomePath(pathname) {
  return pathname === "/" || pathname === "";
}

function isAuthPath(pathname) {
  return pathname === "/login" || pathname === "/register";
}

function isComenzarPath(pathname) {
  return pathname === "/comenzar";
}

function isWorkflowTracksPath(pathname) {
  return /^\/modalidades\/(guest|free)\/?$/.test(pathname);
}

function isHowToPlayPath(pathname) {
  return pathname === "/how-to-play";
}

function isChromelessPath(pathname) {
  return isHomePath(pathname);
}

function isImmersiveBgPath(pathname) {
  return (
    isComenzarPath(pathname) ||
    isHowToPlayPath(pathname) ||
    isWorkflowTracksPath(pathname) ||
    isAuthPath(pathname) ||
    pathname.includes("/hall-of-fame")
  );
}

export default function ConditionalShell({ children }) {
  const pathname = usePathname() || "";
  const { isAuthenticated, loading } = useAuth();
  const onHome = isHomePath(pathname);
  const onAuth = isAuthPath(pathname);
  const onComenzar = isComenzarPath(pathname);
  const onWorkflowTracks = isWorkflowTracksPath(pathname);
  const onHowToPlay = isHowToPlayPath(pathname);
  const hideChrome = isChromelessPath(pathname);
  const immersiveBg = isImmersiveBgPath(pathname);
  const skipSurface = hideChrome || onAuth || onComenzar || onHowToPlay;

  if (loading) {
    return <main className="min-h-screen">{children}</main>;
  }

  const showFloatingLanguageToggle = isAuthenticated && !hideChrome;

  if (isAuthenticated) {
    return (
      <>
        {!hideChrome ? (
          <Suspense fallback={null}>
            <FloatingMenuBar />
          </Suspense>
        ) : null}
        {showFloatingLanguageToggle ? <LanguageToggle className="app-lang-toggle" /> : null}
        <main
          className={
            hideChrome
              ? "min-h-screen"
              : onAuth
                ? "app-main app-main--auth min-h-screen"
                : onComenzar
                  ? "app-main app-main--with-menu app-main--immersive app-main--comenzar min-h-screen"
                  : onWorkflowTracks
                    ? "app-main app-main--with-menu app-main--immersive app-main--workflow-tracks min-h-screen"
                    : onHowToPlay
                      ? "app-main app-main--with-menu app-main--immersive app-main--how-to-play min-h-screen"
                      : "app-main app-main--with-menu app-main--immersive min-h-screen"
          }
        >
          {skipSurface ? children : <AppSurface>{children}</AppSurface>}
        </main>
      </>
    );
  }

  return (
    <>
      {!hideChrome ? <Header /> : null}
      <main
        className={
          hideChrome
            ? "min-h-screen"
            : onAuth
              ? "app-main app-main--auth min-h-screen"
              : onComenzar
                ? "app-main app-main--comenzar min-h-screen"
                : onWorkflowTracks
                  ? "app-main app-main--workflow-tracks min-h-screen"
                  : onHowToPlay
                    ? "app-main app-main--how-to-play min-h-screen"
                    : immersiveBg
                      ? "app-main min-h-screen"
                      : "app-main min-h-screen pt-16 pb-16 md:pb-0"
        }
      >
        {skipSurface ? children : <AppSurface>{children}</AppSurface>}
      </main>
      {!hideChrome ? <Footer /> : null}
    </>
  );
}
