"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { strategies } from "@/frontend/components/tournament/PickSelector";

const STRATEGY_SHORT = {
  full_point: "Full",
  dual_point: "Dual",
  smart_point: "Smart",
  full: "Full",
  dual: "Dual",
  smart: "Smart",
};

function strategyLabel(ticket) {
  if (!ticket?.strategy) return "—";
  return STRATEGY_SHORT[ticket.strategy] || ticket.strategy;
}

export default function TournamentTicketSheet({
  races,
  activeTicketNumber,
  onSelectTicket,
  submittedTickets,
  labels = {},
}) {
  const {
    ticketLabel = "Ticket",
    raceLabel = "Carrera",
    totalLabel = "Puntos totales",
    pendingLabel = "Pendiente",
    independentHint = "Cada ticket es un torneo completo e independiente (7 carreras).",
  } = labels;

  const orderedRaces = [...(races || [])].sort((a, b) => (b.raceNumber || 0) - (a.raceNumber || 0));

  const ticketTotals = [1, 2, 3].map((num) => {
    let points = 0;
    let confirmed = 0;
    for (const race of races || []) {
      const sub = submittedTickets[`${race.id}-${num}`];
      if (sub) {
        confirmed += 1;
        if (sub.isScored && sub.pointsEarned) points += sub.pointsEarned;
      }
    }
    return { num, points, confirmed };
  });

  const activeTotal = ticketTotals.find((t) => t.num === activeTicketNumber)?.points ?? 0;
  const activeConfirmed = ticketTotals.find((t) => t.num === activeTicketNumber)?.confirmed ?? 0;

  return (
    <div className="tournament-ticket-sheet">
      <p className="tournament-ticket-sheet__hint">{independentHint}</p>

      <div className="tournament-ticket-sheet__tabs" role="tablist" aria-label={ticketLabel}>
        {ticketTotals.map(({ num, points, confirmed }) => (
          <button
            key={num}
            type="button"
            role="tab"
            aria-selected={activeTicketNumber === num}
            className={`tournament-ticket-sheet__tab${activeTicketNumber === num ? " tournament-ticket-sheet__tab--active" : ""}`}
            onClick={() => onSelectTicket(num)}
          >
            <span className="tournament-ticket-sheet__tab-title">
              {ticketLabel} {num}
            </span>
            <span className="tournament-ticket-sheet__tab-meta">
              {confirmed}/7 · {points.toLocaleString()} pts
            </span>
          </button>
        ))}
      </div>

      <div className="tournament-ticket-sheet__total">
        <span>{totalLabel}</span>
        <strong>{activeTotal.toLocaleString()} pts</strong>
        <span className="tournament-ticket-sheet__total-sub">
          {activeConfirmed}/7 {raceLabel.toLowerCase()}s
        </span>
      </div>

      <ol className="tournament-ticket-sheet__races">
        {orderedRaces.map((race) => {
          const sub = submittedTickets[`${race.id}-${activeTicketNumber}`];
          const done = Boolean(sub);
          return (
            <li
              key={race.id}
              className={`tournament-ticket-sheet__race${done ? " tournament-ticket-sheet__race--done" : ""}`}
            >
              {done ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden />
              ) : (
                <Circle className="w-4 h-4 text-white/25 shrink-0" aria-hidden />
              )}
              <span className="tournament-ticket-sheet__race-name">
                {raceLabel} {race.raceNumber ?? race.number}
              </span>
              <span className="tournament-ticket-sheet__race-mode">
                {done ? strategyLabel(sub) : pendingLabel}
              </span>
              {done && sub.isScored ? (
                <span className="tournament-ticket-sheet__race-pts">+{sub.pointsEarned || 0}</span>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="tournament-ticket-sheet__modes" aria-hidden>
        {strategies.map((s) => (
          <span key={s.id} className="tournament-ticket-sheet__mode-chip">
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}
