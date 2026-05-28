"use client";

import { Info } from "lucide-react";
import { staticFile } from "@/frontend/lib/config/paths";
import SectionHeader from "@/frontend/components/home/SectionHeader";

const TICKET_IMAGES = {
  full: "/Img/FULL POINT.png",
  dual: "/Img/DUAL POINT.png",
  smart: "/Img/SMART POINT.png",
};

function PlayPoints({ children, theme }) {
  return (
    <span className={`tournament-play-card__points tournament-play-card__points--${theme}`}>
      {children}
    </span>
  );
}

function TournamentPlayCard({ theme, imageSrc, name, risk, riskVariant, children }) {
  return (
    <article className={`tournament-play-card tournament-play-card--${theme}`}>
      <div className="tournament-play-card__shell">
        <div className="tournament-play-card__gloss" aria-hidden />
        <div className="tournament-play-card__inner">
          <div className="tournament-play-card__media">
            <img src={imageSrc} alt="" className="tournament-play-card__ticket" />
          </div>
          <div className="tournament-play-card__divider" aria-hidden />
          <div className="tournament-play-card__body">
            <div className="tournament-play-card__head">
              <h4 className="tournament-play-card__name">{name}</h4>
              <span
                className={`tournament-play-card__risk tournament-play-card__risk--${riskVariant}`}
              >
                {risk}
              </span>
            </div>
            <div className="tournament-play-card__copy">{children}</div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function TournamentPlaysSection({ t }) {
  return (
    <section className="tournament-plays">
      <SectionHeader
        className="home-section-header--nested"
        label={t("tournamentPlays.label")}
        title={t("tournamentPlays.title")}
        descriptionLead={t("tournamentPlays.descriptionLead")}
        descriptionHighlight={t("tournamentPlays.descriptionHighlight")}
      />

      <div className="tournament-plays__list">
        <TournamentPlayCard
          theme="purple"
          imageSrc={staticFile(TICKET_IMAGES.full)}
          name={t("strategies.fullPoint")}
          risk={t("strategies.highRisk")}
          riskVariant="high"
        >
          <p className="tournament-play-card__line">
            <PlayPoints theme="purple">{t("tournamentPlays.fullPoints")}</PlayPoints>
          </p>
          <p className="tournament-play-card__line tournament-play-card__line--rest">
            {t("tournamentPlays.fullSuffix")}
          </p>
        </TournamentPlayCard>

        <TournamentPlayCard
          theme="cyan"
          imageSrc={staticFile(TICKET_IMAGES.dual)}
          name={t("strategies.dualPoint")}
          risk={t("strategies.medRisk")}
          riskVariant="medium"
        >
          <p className="tournament-play-card__line">
            <PlayPoints theme="cyan">{t("tournamentPlays.dualPoints")}</PlayPoints>
          </p>
          <p className="tournament-play-card__line tournament-play-card__line--rest">
            {t("tournamentPlays.dualSuffix")}
          </p>
        </TournamentPlayCard>

        <TournamentPlayCard
          theme="gold"
          imageSrc={staticFile(TICKET_IMAGES.smart)}
          name={t("strategies.smartPoint")}
          risk={t("strategies.lowRisk")}
          riskVariant="low"
        >
          <p className="tournament-play-card__line tournament-play-card__line--smart">
            <PlayPoints theme="gold">{t("tournamentPlays.smartPoints30")}</PlayPoints>
            {t("tournamentPlays.smartRest30")}
          </p>
          <p className="tournament-play-card__line tournament-play-card__line--smart">
            <PlayPoints theme="gold">{t("tournamentPlays.smartPoints15")}</PlayPoints>
            {t("tournamentPlays.smartRest15")}
          </p>
          <p className="tournament-play-card__line tournament-play-card__line--smart">
            <PlayPoints theme="gold">{t("tournamentPlays.smartPoints5")}</PlayPoints>
            {t("tournamentPlays.smartRest5")}
          </p>
        </TournamentPlayCard>
      </div>

      <p className="tournament-plays__reminder">
        <span className="tournament-plays__reminder-icon" aria-hidden>
          <Info className="w-3.5 h-3.5" strokeWidth={2.5} />
        </span>
        <span>
          {t("tournamentPlays.reminderLead")}{" "}
          <span className="tournament-plays__reminder-highlight">
            {t("tournamentPlays.reminderPoints")}
          </span>{" "}
          {t("tournamentPlays.reminderEnd")}
        </span>
      </p>
    </section>
  );
}
