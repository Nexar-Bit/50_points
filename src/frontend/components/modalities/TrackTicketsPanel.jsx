"use client";

import { Check, Gift } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import {
  buildModalityReturnPath,
  buildTournamentEntryHref,
  getModality,
} from "@/frontend/lib/gameModalities";
import { isTrackTicketUsed } from "@/frontend/lib/trackTicketUsage";
import FreeTicketCard from "@/frontend/components/modalities/FreeTicketCard";

const TICKET_NUMS = [1, 2, 3];

export default function TrackTicketsPanel({
  modalityId,
  trackSlug,
  tournamentSlug,
  usageVersion = 0,
  activeNum = 1,
  onActiveNumChange,
  onPlayTicket,
}) {
  const { t } = useLanguage();
  const mod = getModality(modalityId);
  const returnPath = buildModalityReturnPath(modalityId, trackSlug);

  const activeUsed = isTrackTicketUsed(trackSlug, activeNum);
  const viewHref = buildTournamentEntryHref({
    tournamentSlug,
    modalityId,
    ticketNum: activeNum,
    trackSlug,
    returnPath,
    playFirst: false,
  });
  const playHref = buildTournamentEntryHref({
    tournamentSlug,
    modalityId,
    ticketNum: activeNum,
    trackSlug,
    returnPath,
    playFirst: true,
  });

  return (
    <div
      className="track-tickets-panel"
      style={{ "--modality-accent": mod.accent }}
      key={`${usageVersion}-${trackSlug}`}
    >
      <div className="track-tickets-panel__banner">
        <Gift className="track-tickets-panel__banner-icon" aria-hidden />
        <p className="track-tickets-panel__banner-title">
          {t("gameModalities.freeTicketsBanner")}
        </p>
        <p className="track-tickets-panel__banner-sub">{t("gameModalities.freeTicketsBannerSub")}</p>
      </div>

      <div className="track-tickets-tabs" role="tablist" aria-label={t("gameModalities.yourTickets")}>
        {TICKET_NUMS.map((num) => {
          const used = isTrackTicketUsed(trackSlug, num);
          const isActive = activeNum === num;
          return (
            <button
              key={num}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`track-ticket-panel-${trackSlug}-${num}`}
              id={`track-ticket-tab-${trackSlug}-${num}`}
              className={`track-tickets-tab track-tickets-tab--n${num}${
                used ? " track-tickets-tab--used" : " track-tickets-tab--open"
              }${isActive ? " track-tickets-tab--active" : ""}`}
              onClick={() => onActiveNumChange?.(num)}
            >
              <span className="track-tickets-tab__num">{num}</span>
              <span className="track-tickets-tab__label">
                {t("gameModalities.ticketLabel")} {num}
              </span>
              <span className="track-tickets-tab__status">
                {used ? (
                  <>
                    <Check className="track-tickets-tab__status-icon" strokeWidth={3} aria-hidden />
                    {t("gameModalities.ticketUsed")}
                  </>
                ) : (
                  t("gameModalities.ticketReady")
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id={`track-ticket-panel-${trackSlug}-${activeNum}`}
        role="tabpanel"
        aria-labelledby={`track-ticket-tab-${trackSlug}-${activeNum}`}
        className="track-tickets-panel__active"
      >
        <FreeTicketCard
          num={activeNum}
          used={activeUsed}
          playHref={playHref}
          staticStub
          onViewTicket={() => onPlayTicket?.(activeNum, false)}
          onPlay={() => onPlayTicket?.(activeNum, true)}
        />
      </div>
    </div>
  );
}
