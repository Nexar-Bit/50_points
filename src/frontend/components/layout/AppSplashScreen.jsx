"use client";

import { useLayoutEffect, useRef } from "react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { logoFile } from "@/frontend/lib/config/paths";

export default function AppSplashScreen({ exiting = false }) {
  const { t } = useLanguage();
  const stackRef = useRef(null);
  const headRef = useRef(null);
  const sloganRef = useRef(null);
  const bandRef = useRef(null);

  useLayoutEffect(() => {
    const stack = stackRef.current;
    const head = headRef.current;
    const slogan = sloganRef.current;
    const band = bandRef.current;
    if (!stack || !head || !slogan || !band) return;

    const syncWidths = () => {
      const compact = window.matchMedia("(max-width: 520px)").matches;
      if (compact) {
        stack.style.removeProperty("--splash-stack-px");
        band.style.removeProperty("width");
        return;
      }

      const headWidth = Math.ceil(head.getBoundingClientRect().width);
      const sloganWidth = Math.ceil(slogan.scrollWidth);
      const stackWidth = Math.max(headWidth, sloganWidth, 1);
      const spreadSlogan = headWidth >= sloganWidth - 1;

      stack.style.setProperty("--splash-stack-px", `${stackWidth}px`);
      band.style.width = spreadSlogan ? `${stackWidth}px` : `${sloganWidth}px`;
      band.classList.toggle("app-splash__band--spread", spreadSlogan);
    };

    syncWidths();

    const observer = new ResizeObserver(syncWidths);
    observer.observe(head);
    observer.observe(slogan);

    if (document.fonts?.ready) {
      document.fonts.ready.then(syncWidths).catch(() => {});
    }

    window.addEventListener("resize", syncWidths);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncWidths);
    };
  }, [t]);

  return (
    <div
      className={`app-splash${exiting ? " app-splash--exit" : ""}`}
      role="status"
      aria-live="polite"
      aria-busy={!exiting}
      aria-label={t("splash.loading")}
    >
      <div className="app-splash__center">
        <div ref={stackRef} className="app-splash__stack">
          <div ref={headRef} className="app-splash__head">
            <h1 className="app-splash__title">{t("hero.tournament")}</h1>

            <div className="app-splash__logo-wrap">
              <img
                src={logoFile()}
                alt="50points"
                className="app-splash__logo"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>

          <div ref={bandRef} className="app-splash__band">
            <p ref={sloganRef} className="app-splash__slogan">
              <span className="app-splash__slogan-part app-splash__slogan-part--purple app-splash__slogan-part--1">
                {t("hero.sloganPoints")}.
              </span>
              <span className="app-splash__slogan-part app-splash__slogan-part--gold app-splash__slogan-part--2">
                {t("hero.sloganStrategy")}.
              </span>
              <span className="app-splash__slogan-part app-splash__slogan-part--cyan app-splash__slogan-part--3">
                {t("hero.sloganGame")}.
              </span>
            </p>

            <div className="app-splash__loader" aria-hidden>
              <div className="app-splash__loader-track">
                <div
                  className={`app-splash__loader-fill${exiting ? " app-splash__loader-fill--complete" : ""}`}
                >
                  <span className="app-splash__loader-glow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
