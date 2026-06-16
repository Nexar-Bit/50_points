"use client";

import { Check, Gift } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import {
  buildModalityReturnPath,
  buildTournamentEntryHref,
  getModality,
} from "@/frontend/lib/gameModalities";
import { isTrackTicketUsed } from "@/frontend/lib/trackTicketUsage";

const TICKET_NUMS = [1, 2, 3];

export default function TrackTicketsPanel({
  modalityId,
  trackSlug,
  tournamentSlug,
  usageVersion = 0,
  activeNum = 1,
  onActiveNumChange,
  onPlayTicket,
  inline = false,
  onOpenRaces,
}) {
  const { t } = useLanguage();
  const mod = getModality(modalityId);
  const returnPath = buildModalityReturnPath(modalityId, trackSlug);

  const displayNum = activeNum > 0 ? activeNum : 1;
  const activeUsed = isTrackTicketUsed(trackSlug, displayNum);
  const viewHref = buildTournamentEntryHref({
    tournamentSlug,
    modalityId,
    ticketNum: displayNum,
    trackSlug,
    returnPath,
    playFirst: false,
  });
  const playHref = buildTournamentEntryHref({
    tournamentSlug,
    modalityId,
    ticketNum: displayNum,
    trackSlug,
    returnPath,
    playFirst: true,
  });

  const openRaces = () => {
    if (inline) {
      onOpenRaces?.();
      return;
    }
    onPlayTicket?.(displayNum, false);
  };

  const playFirstRace = () => {
    if (inline) {
      onOpenRaces?.();
      return;
    }
    onPlayTicket?.(displayNum, true);
  };

  return (
    <div
      className={`track-tickets-panel${inline ? " track-tickets-panel--inline" : ""}`}
      style={{ "--modality-accent": mod.accent }}
      key={`${usageVersion}-${trackSlug}`}
    >
      {!inline ? (
        <div className="track-tickets-panel__banner">
          <Gift className="track-tickets-panel__banner-icon" aria-hidden />
          <p className="track-tickets-panel__banner-title">
            {t("gameModalities.freeTicketsBanner")}
          </p>
          <p className="track-tickets-panel__banner-sub">{t("gameModalities.freeTicketsBannerSub")}</p>
        </div>
      ) : null}

      <div className="track-tickets-tabs" role="tablist" aria-label={t("gameModalities.yourTickets")}>
        {TICKET_NUMS.map((num) => {
          const used = isTrackTicketUsed(trackSlug, num);
          const isActive = activeNum > 0 && activeNum === num;
          return (
            <button
              key={num}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`track-ticket-panel-${trackSlug}-${num}`}
              id={`track-ticket-tab-${trackSlug}-${num}`}
              className={`track-tickets-tab track-tickets-tab--n${num}${
                used ? " track-tickets-tab--used" : ""
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
                ) : isActive ? (
                  t("gameModalities.ticketReady")
                ) : (
                  t("gameModalities.ticketAvailable")
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* FreeTicketCard removed — ticket tabs above are sufficient */}
    </div>
  );
}
