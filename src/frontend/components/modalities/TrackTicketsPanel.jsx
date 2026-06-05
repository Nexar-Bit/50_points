"use client";

import { Gift } from "lucide-react";
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
  onOpenGallery,
}) {
  const { t } = useLanguage();
  const mod = getModality(modalityId);
  const returnPath = buildModalityReturnPath(modalityId, trackSlug);

  return (
    <div
      className="track-tickets-panel"
      style={{ "--modality-accent": mod.accent }}
      key={usageVersion}
    >
      <div className="track-tickets-panel__banner">
        <Gift className="track-tickets-panel__banner-icon" aria-hidden />
        <p className="track-tickets-panel__banner-title">
          {t("gameModalities.freeTicketsBanner")}
        </p>
      </div>

      <ul className="track-tickets-panel__list" aria-label={t("gameModalities.yourTickets")}>
        {TICKET_NUMS.map((num) => {
          const used = isTrackTicketUsed(trackSlug, num);
          const playHref = buildTournamentEntryHref({
            tournamentSlug,
            modalityId,
            ticketNum: num,
            trackSlug,
            returnPath,
            playFirst: true,
          });

          return (
            <li key={num}>
              <FreeTicketCard
                num={num}
                used={used}
                playHref={playHref}
                onViewTicket={() => onOpenGallery?.(num - 1)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
