"use client";

import Header from "@/frontend/components/layout/Header";
import Footer from "@/frontend/components/layout/Footer";
import FloatingMenuBar from "@/frontend/components/layout/FloatingMenuBar";
import { useAuth } from "@/frontend/contexts/AuthContext";

export default function ConditionalShell({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <main className="min-h-screen">{children}</main>;
  }

  if (isAuthenticated) {
    return (
      <>
        <FloatingMenuBar />
        <main className="min-h-screen">{children}</main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-16 pb-16 md:pb-0">{children}</main>
      <Footer />
    </>
  );
}
