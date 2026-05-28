"use client";

import { usePathname } from "next/navigation";
import Header from "@/frontend/components/layout/Header";
import Footer from "@/frontend/components/layout/Footer";
import AppSidebar from "@/frontend/components/layout/AppSidebar";
import { useAuth } from "@/frontend/contexts/AuthContext";

export default function ConditionalShell({ children }) {
  const pathname = usePathname() || "";
  const isHome = pathname === "/" || pathname === "";
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <main className="min-h-screen">{children}</main>;
  }

  if (isAuthenticated) {
    return (
      <div className="app-shell">
        <AppSidebar />
        <div className="app-shell__body">
          <main className="app-shell__main">{children}</main>
        </div>
      </div>
    );
  }

  if (isHome) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="pt-16 pb-16 md:pb-0">{children}</main>
      <Footer />
    </>
  );
}
