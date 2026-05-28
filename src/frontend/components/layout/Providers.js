"use client";

import { LanguageProvider } from "@/frontend/lib/i18n/LanguageContext";
import { AuthProvider } from "@/frontend/contexts/AuthContext";

export default function Providers({ children }) {
  return (
    <LanguageProvider>
      <AuthProvider>{children}</AuthProvider>
    </LanguageProvider>
  );
}
