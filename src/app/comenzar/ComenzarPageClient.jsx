"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Layers } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useAuth } from "@/frontend/contexts/AuthContext";
import AnimateInView from "@/frontend/components/ui/AnimateInView";
import {
  comenzarStepVisualAsset,
  onboardBenefitAsset,
  ticketWorkflowAsset,
} from "@/frontend/lib/config/ticketWorkflowAssets";

const BENEFIT_FALLBACK_ICONS = [Layers, Shield, Sparkles];

export default function ComenzarPageClient() {
  const { t } = useLanguage();
  const { isAuthenticated, playAsGuest } = useAuth();

  const steps = t("ticketWorkflow.landingSteps");
  const stepList = Array.isArray(steps) ? steps : [];
  const stepTitles = t("ticketWorkflow.landingStepTitles");
  const titleList = Array.isArray(stepTitles) ? stepTitles : [];
  const benefitTitles = t("ticketWorkflow.landingBenefitTitles");
  const benefitTitleList = Array.isArray(benefitTitles) ? benefitTitles : [];
  const benefitBodies = [
    t("ticketWorkflow.landingFactTickets"),
    t("ticketWorkflow.landingFactFree"),
    t("ticketWorkflow.landingFactModes"),
  ];

  const heroBg = ticketWorkflowAsset("landingHeroBg");
  const noise = ticketWorkflowAsset("noiseOverlayTile");

  return (
    <div className="ticket-landing-surface">
      <div className="ticket-landing__bg-layer" aria-hidden>
        {heroBg ? <img src={heroBg} alt="" className="ticket-landing__hero-bg" /> : null}
        <div className="ticket-landing__shade" />
        {noise ? (
          <div
            className="ticket-landing__noise"
            style={{ backgroundImage: `url(${noise})` }}
          />
        ) : null}
      </div>

      <div className="ticket-landing">
        <AnimateInView>
          <header className="ticket-landing__hero">
            <p className="ticket-landing__eyebrow">{t("ticketWorkflow.landingEyebrow")}</p>
            <h1 className="ticket-landing__title">{t("ticketWorkflow.landingTitle")}</h1>
            <p className="ticket-landing__lead">{t("ticketWorkflow.landingLead")}</p>
          </header>
        </AnimateInView>

        <AnimateInView delay={0.08}>
          <section
            className="onboard-journey"
            aria-label={t("ticketWorkflow.landingJourneyAria")}
          >
            <div className="onboard-journey__connector" aria-hidden>
              <span className="onboard-journey__line" />
            </div>
            <ol className="onboard-journey__cards">
              {stepList.map((step, index) => {
                const stepNum = index + 1;
                const title = titleList[index] || `Step ${stepNum}`;
                const cardBg = comenzarStepVisualAsset(stepNum);
                return (
                  <li key={step} className="onboard-journey-card">
                    <article
                      className={`onboard-journey-card__panel${
                        cardBg ? " onboard-journey-card__panel--has-bg" : ""
                      }`}
                    >
                      {cardBg ? (
                        <img src={cardBg} alt="" className="onboard-journey-card__bg" />
                      ) : null}
                      <div className="onboard-journey-card__scrim" aria-hidden />
                      <div className="onboard-journey-card__glass" aria-hidden />
                      <span className="onboard-journey-card__step">{stepNum}</span>
                      <div className="onboard-journey-card__content">
                        <h2 className="onboard-journey-card__title">{title}</h2>
                        <p className="onboard-journey-card__desc">{step}</p>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ol>
          </section>
        </AnimateInView>

        <AnimateInView delay={0.12}>
          <section className="onboard-features" aria-label={t("ticketWorkflow.landingBenefitsAria")}>
            <div className="onboard-features__fog" aria-hidden />
            <div className="onboard-bento">
              {benefitBodies.map((body, index) => {
                const FallbackIcon = BENEFIT_FALLBACK_ICONS[index] || Sparkles;
                const title = benefitTitleList[index] || "";
                const cardBg = onboardBenefitAsset(index);
                return (
                  <article
                    key={body}
                    className={`onboard-bento__card onboard-bento__card--${index + 1}${
                      cardBg ? " onboard-bento__card--has-bg" : ""
                    }`}
                  >
                    {cardBg ? (
                      <img src={cardBg} alt="" className="onboard-bento__bg" />
                    ) : null}
                    <div className="onboard-bento__scrim" aria-hidden />
                    <div className="onboard-bento__glass" aria-hidden />
                    <div className="onboard-bento__particles" aria-hidden />
                    <div className="onboard-bento__icon-stage">
                      {!cardBg ? (
                        <FallbackIcon
                          className="onboard-bento__icon-fallback"
                          strokeWidth={1.35}
                          aria-hidden
                        />
                      ) : null}
                    </div>
                    <div className="onboard-bento__body">
                      {title ? <h3 className="onboard-bento__title">{title}</h3> : null}
                      <p className="onboard-bento__text">{body}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </AnimateInView>

        <AnimateInView delay={0.16}>
          <section className="onboard-cta-block" aria-label={t("ticketWorkflow.landingCtaAria")}>
            <div className="onboard-cta-block__glow" aria-hidden />
            <div className="onboard-cta">
              <Link href="/modalidades" className="onboard-cta__btn onboard-cta__btn--primary">
                <span className="onboard-cta__btn-shine" aria-hidden />
                {t("ticketWorkflow.landingCtaModes")}
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              {!isAuthenticated ? (
                <button
                  type="button"
                  className="onboard-cta__btn onboard-cta__btn--guest"
                  onClick={() =>
                    playAsGuest().then(() => window.location.assign("/modalidades/guest"))
                  }
                >
                  {t("ticketWorkflow.landingCtaGuest")}
                </button>
              ) : (
                <Link href="/modalidades/free" className="onboard-cta__btn onboard-cta__btn--guest">
                  {t("ticketWorkflow.landingCtaPlay")}
                </Link>
              )}
              <Link href="/how-to-play" className="onboard-cta__btn onboard-cta__btn--ghost">
                {t("gameModalities.learnMore")}
              </Link>
            </div>
          </section>
        </AnimateInView>
      </div>
    </div>
  );
}
