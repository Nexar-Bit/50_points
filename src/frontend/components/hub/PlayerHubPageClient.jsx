"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Newspaper, Trophy, Activity, MessageCircle, Ticket, Flag } from "lucide-react";
import AnimateInView from "@/frontend/components/ui/AnimateInView";
import TicketWorkflowJourney from "@/frontend/components/onboarding/TicketWorkflowJourney";
import ModalityHubBoard from "@/frontend/components/modalities/ModalityHubBoard";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { withModalityQuery } from "@/frontend/lib/gameModalities";
import { useModality } from "@/frontend/contexts/ModalityContext";
import VideoFeedPreview from "@/frontend/components/home/VideoFeedPreview";
import { fetchJson } from "@/frontend/lib/api/client";
import { mapLegendForHome } from "@/frontend/lib/api/mappers";
import { ticketWorkflowAsset } from "@/frontend/lib/config/ticketWorkflowAssets";

function HubCard({ href, title, description, icon: Icon }) {
  return (
    <Link href={href} className="player-hub-card">
      <span className="player-hub-card__icon-wrap">
        <Icon className="player-hub-card__icon" aria-hidden strokeWidth={1.75} />
      </span>
      <span className="player-hub-card__body">
        <span className="player-hub-card__title">{title}</span>
        <span className="player-hub-card__desc">{description}</span>
      </span>
      <ChevronRight className="player-hub-card__chevron" aria-hidden />
    </Link>
  );
}

export default function PlayerHubPageClient() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { activeModalityId, setActiveModality } = useModality();
  const [topPlayers, setTopPlayers] = useState([]);

  const q = (href) => withModalityQuery(href, activeModalityId);

  const heroBg = ticketWorkflowAsset("landingHeroBg");
  const noise = ticketWorkflowAsset("noiseOverlayTile");

  useEffect(() => {
    let cancelled = false;
    fetchJson("/leaderboard?limit=5", { cache: "no-store", timeoutMs: 15000 })
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data?.players) ? data.players : [];
        setTopPlayers(list.map(mapLegendForHome).slice(0, 5));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash?.replace("#", "");
    if (!hash) return;
    const target = document.getElementById(hash);
    if (!target) return;
    const timer = window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="player-hub-page">
      <div
        className="ticket-landing-surface player-hub-page__onboard"
        data-modality={activeModalityId}
      >
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

        <div className="ticket-landing ticket-landing--player-hub">
          <TicketWorkflowJourney />

          <AnimateInView delay={0.1}>
            <ModalityHubBoard
              layout="flat"
              selectable
              showHow={false}
              titleAs="h2"
              activeModeId={activeModalityId}
              onModeSelect={setActiveModality}
              className="modality-hub-board--player-hub"
            />
          </AnimateInView>
        </div>
      </div>

      <div className="player-hub-page__dashboard">
        <p className="player-hub-page__welcome">
          {user?.username
            ? t("playerHub.welcomeUser").replace("{name}", user.username)
            : t("playerHub.welcome")}
        </p>
        <p className="player-hub-page__subtitle">{t("playerHub.subtitle")}</p>

        <div className="player-hub-page__grid">
          <HubCard
            href={q("/chat")}
            title={t("playerHub.cardNews")}
            description={t("playerHub.cardNewsDesc")}
            icon={Newspaper}
          />
          <HubCard
            href={q("/leaderboard")}
            title={t("playerHub.cardRanking")}
            description={t("playerHub.cardRankingDesc")}
            icon={Trophy}
          />
          <HubCard
            href={q("/statistics/explorer")}
            title={t("playerHub.cardActivity")}
            description={t("playerHub.cardActivityDesc")}
            icon={Activity}
          />
          <HubCard
            href={q("/chat")}
            title={t("playerHub.cardMessages")}
            description={t("playerHub.cardMessagesDesc")}
            icon={MessageCircle}
          />
          <HubCard
            href={q("/statistics")}
            title={t("playerHub.cardTickets")}
            description={t("playerHub.cardTicketsDesc")}
            icon={Ticket}
          />
          <HubCard
            href={q("/tournaments")}
            title={t("playerHub.cardTournaments")}
            description={t("playerHub.cardTournamentsDesc")}
            icon={Flag}
          />
        </div>

        <section className="player-hub-section">
          <div className="player-hub-section__head">
            <h2 className="player-hub-section__title">{t("playerHub.liveRanking")}</h2>
            <Link href={q("/leaderboard")} className="player-hub-section__link">
              {t("playerHub.seeAll")}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <ul className="player-hub-ranking">
            {topPlayers.length === 0 ? (
              <li className="player-hub-ranking__empty">{t("leaderboard.empty")}</li>
            ) : (
              topPlayers.map((p) => (
                <li key={p.rank} className="player-hub-ranking__row">
                  <span className="player-hub-ranking__rank">{p.rank}</span>
                  <span className="player-hub-ranking__name">{p.username}</span>
                  <span className="player-hub-ranking__pts">{p.totalPoints?.toLocaleString()} pts</span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section id="feed" className="player-hub-section player-hub-section--feed">
          <h2 className="player-hub-section__title">{t("floatingMenu.feed")}</h2>
          <p className="player-hub-section__desc">{t("playerHub.feedDesc")}</p>
          <VideoFeedPreview />
        </section>
      </div>
    </div>
  );
}
