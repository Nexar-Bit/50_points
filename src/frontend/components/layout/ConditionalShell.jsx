"use client";

import { usePathname } from "next/navigation";
import Header from "@/frontend/components/layout/Header";
import Footer from "@/frontend/components/layout/Footer";
import FloatingMenuBar from "@/frontend/components/layout/FloatingMenuBar";
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

  if (isAuthenticated) {
    return (
      <>
        {!hideChrome ? <FloatingMenuBar /> : null}
        <main className={hideChrome ? "min-h-screen" : "app-main app-main--with-menu min-h-screen"}>
          {children}
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
        {children}
      </main>
      {!hideChrome ? <Footer /> : null}
    </>
  );
}
