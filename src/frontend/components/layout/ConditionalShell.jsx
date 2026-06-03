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

function isChromelessPath(pathname) {
  return isHomePath(pathname);
}

export default function ConditionalShell({ children }) {
  const pathname = usePathname() || "";
  const { isAuthenticated, loading } = useAuth();
  const onHome = isHomePath(pathname);
  const hideChrome = isChromelessPath(pathname);

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
        <main className={hideChrome ? "min-h-screen" : "app-main app-main--with-menu min-h-screen"}>
          {hideChrome ? children : <AppSurface>{children}</AppSurface>}
        </main>
      </>
    );
  }

  return (
    <>
      {!hideChrome ? <Header /> : null}
      <main
        className={
          hideChrome ? "min-h-screen" : "app-main min-h-screen pt-16 pb-16 md:pb-0"
        }
      >
        {hideChrome ? children : <AppSurface>{children}</AppSurface>}
      </main>
      {!hideChrome ? <Footer /> : null}
    </>
  );
}
