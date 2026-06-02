"use client";

import FreePlayNotice from "@/frontend/components/layout/FreePlayNotice";
import { useAuth } from "@/frontend/contexts/AuthContext";

/**
 * Shared page shell matching the /statistics (MIS TICKETS) visual system.
 */
export default function AppSurface({ children, className = "" }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className={`app-surface${className ? ` ${className}` : ""}`}>
      <div className="app-surface__inner">
        {isAuthenticated ? (
          <div className="app-surface__chrome">
            <FreePlayNotice />
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
