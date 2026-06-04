"use client";

import { useEffect } from "react";
import { getModality, persistModality, isValidModalityId } from "@/frontend/lib/gameModalities";

/**
 * Applies modality ambient background to the app shell via html[data-modality].
 */
export default function ModalityScope({ modalityId, children, className = "" }) {
  const id = isValidModalityId(modalityId) ? modalityId : "free";
  const mod = getModality(id);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-modality", id);
    root.style.setProperty("--modality-accent", mod.accent);
    root.style.setProperty("--modality-border", mod.border);
    root.style.setProperty("--modality-glow", mod.glow);
    root.style.setProperty("--modality-bg", mod.bgGradient);
    persistModality(id);

    return () => {
      root.removeAttribute("data-modality");
      root.style.removeProperty("--modality-accent");
      root.style.removeProperty("--modality-border");
      root.style.removeProperty("--modality-glow");
      root.style.removeProperty("--modality-bg");
    };
  }, [id, mod.accent, mod.border, mod.glow, mod.bgGradient]);

  return (
    <div className={`modality-scope modality-scope--${id}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
