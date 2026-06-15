"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Circle } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { fetchAuthJson } from "@/frontend/lib/api/client";
import { fetchTournamentDetail } from "@/frontend/lib/api/tournaments";
import { normalizeTournament } from "@/frontend/lib/tournamentNormalize";
import RaceCard from "@/frontend/components/tournament/RaceCard";
import PickSelector, { strategies } from "@/frontend/components/tournament/PickSelector";
import TicketConfirmation from "@/frontend/components/tournament/TicketConfirmation";
import { markTrackTicketUsed } from "@/frontend/lib/trackTicketUsage";
import { ticketWorkflowAsset } from "@/frontend/lib/config/ticketWorkflowAssets";

const STRATEGY_MAP = { full: "full_point", dual: "dual_point", smart: "smart_pick" };
const STRATEGY_REVERSE = { full_point: "full", dual_point: "dual", smart_pick: "smart" };

export default function EmbeddedTicketRaces({
  tournamentSlug,
  ticketNum,
  trackSlug,
  onUsageChange,
}) {
  const { t } = useLanguage();
  const { token, isAuthenticated } = useAuth();
  const [tournamentRaw, setTournamentRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittedTickets, setSubmittedTickets] = useState({});
  const [expandedRace, setExpandedRace] = useState(null);
  const [activeStrategy, setActiveStrategy] = useState("full");
  const [picks, setPicks] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedRace, setConfirmedRace] = useState(null);

  const raceRowBg = ticketWorkflowAsset("raceRowCollapsed");
  const raceRowExpandedBg = ticketWorkflowAsset("raceRowExpanded");

  useEffect(() => {
    if (!tournamentSlug) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchTournamentDetail(tournamentSlug, { refresh: true })
      .then((data) => {
        if (cancelled) return;
        setTournamentRaw(data.tournament);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tournamentSlug]);

  useEffect(() => {
    if (!token || !tournamentRaw) return;
    fetchAuthJson(`/tickets?tournamentId=${tournamentRaw.id}`)
      .then((data) => {
        if (!data?.tickets) return;
        const ticketMap = {};
        for (const ticket of data.tickets) {
          ticketMap[`${ticket.raceId}-${ticket.ticketNumber}`] = ticket;
        }
        setSubmittedTickets(ticketMap);
      })
      .catch(() => {});
  }, [token, tournamentRaw, ticketNum]);

  const tournament = useMemo(
    () => (tournamentRaw ? normalizeTournament(tournamentRaw) : null),
    [tournamentRaw],
  );

  const submittedForRace = useCallback(
    (raceId) => submittedTickets[`${raceId}-${ticketNum}`],
    [submittedTickets, ticketNum],
  );

  const confirmedStrategyForRace = useCallback(
    (raceId) => {
      const sub = submittedForRace(raceId);
      return sub ? STRATEGY_REVERSE[sub.strategy] || "full" : null;
    },
    [submittedForRace],
  );

  const toggleRace = (raceId) => {
    setExpandedRace((prev) => (prev === raceId ? null : raceId));
    setActiveStrategy("full");
    setPicks((prev) => ({ ...prev, [raceId]: prev[raceId] || [] }));
  };

  const handlePickHorse = useCallback(
    (horseId) => {
      if (!expandedRace) return;
      setPicks((prev) => {
        const racePicks = prev[expandedRace] || [];
        if (racePicks.includes(horseId)) {
          return { ...prev, [expandedRace]: racePicks.filter((id) => id !== horseId) };
        }
        const maxPicks = strategies.find((s) => s.id === activeStrategy)?.maxPicks || 1;
        if (racePicks.length >= maxPicks) return prev;
        return { ...prev, [expandedRace]: [...racePicks, horseId] };
      });
    },
    [expandedRace, activeStrategy],
  );

  const handleStrategyChange = useCallback(
    (strategyId) => {
      setActiveStrategy(strategyId);
      if (expandedRace) {
        setPicks((prev) => ({ ...prev, [expandedRace]: [] }));
      }
    },
    [expandedRace],
  );

  const handleConfirm = useCallback(async () => {
    if (!expandedRace || submitting) return;
    const racePicks = picks[expandedRace] || [];
    if (racePicks.length === 0) return;

    if (!isAuthenticated) {
      alert(t("gameModalities.loginToSubmit"));
      return;
    }

    const currentRace = tournament?.races.find((r) => r.id === expandedRace);
    setSubmitting(true);
    try {
      const data = await fetchAuthJson("/tickets", {
        method: "POST",
        body: JSON.stringify({
          raceId: expandedRace,
          tournamentId: tournamentRaw?.id,
          raceNumber: currentRace?.raceNumber ?? currentRace?.number,
          strategy: STRATEGY_MAP[activeStrategy],
          picks: racePicks,
          ticketNumber: ticketNum,
        }),
      });

      setConfirmedRace(expandedRace);
      setSubmittedTickets((prev) => ({
        ...prev,
        [`${expandedRace}-${ticketNum}`]: {
          ...data.ticket,
          raceId: expandedRace,
          ticketNumber: ticketNum,
        },
      }));
      markTrackTicketUsed(trackSlug, ticketNum);
      onUsageChange?.();
      setShowConfirmation(true);
    } catch (err) {
      const msg = err?.data?.detail || err?.message || t("gameModalities.submitError");
      alert(typeof msg === "string" ? msg : t("gameModalities.submitError"));
    } finally {
      setSubmitting(false);
    }
  }, [
    expandedRace,
    submitting,
    picks,
    isAuthenticated,
    activeStrategy,
    ticketNum,
    tournamentRaw,
    tournament,
    trackSlug,
    onUsageChange,
    t,
  ]);

  if (loading) {
    return <p className="comenzar-inline-races__status">{t("gameModalities.loading")}</p>;
  }

  if (error) {
    return <p className="comenzar-inline-races__status">{error}</p>;
  }

  if (!tournament?.races?.length) {
    return <p className="comenzar-inline-races__status">{t("tournamentsSection.empty")}</p>;
  }

  const expandedRaceData = tournament.races.find((r) => r.id === expandedRace);
  const currentRacePicks = expandedRace ? picks[expandedRace] || [] : [];
  const strategy = strategies.find((s) => s.id === activeStrategy);
  const isPicksComplete = currentRacePicks.length === (strategy?.maxPicks || 1);

  return (
    <div className="comenzar-inline-races">
      <ol className="comenzar-inline-races__list">
        {tournament.races.map((race) => {
          const sub = submittedForRace(race.id);
          const done = Boolean(sub);
          const isOpen = expandedRace === race.id;
          return (
            <li key={race.id} className={`comenzar-inline-races__item${isOpen ? " comenzar-inline-races__item--open" : ""}`}>
              <button
                type="button"
                className="comenzar-inline-races__row"
                style={
                  raceRowBg && !isOpen
                    ? { backgroundImage: `url(${raceRowBg})` }
                    : raceRowExpandedBg && isOpen
                      ? { backgroundImage: `url(${raceRowExpandedBg})` }
                      : undefined
                }
                onClick={() => toggleRace(race.id)}
                aria-expanded={isOpen}
              >
                {done ? (
                  <Check className="comenzar-inline-races__icon comenzar-inline-races__icon--done" aria-hidden />
                ) : (
                  <Circle className="comenzar-inline-races__icon" aria-hidden />
                )}
                <span className="comenzar-inline-races__name">
                  {t("gameModalities.raceLabel")} {race.raceNumber ?? race.number}
                </span>
                <span className="comenzar-inline-races__meta">
                  {race.distance}m · {race.surface}
                </span>
                <span className="comenzar-inline-races__status-pill">
                  {done ? t("gameModalities.raceConfirmed") : t("gameModalities.racePending")}
                </span>
              </button>

              {isOpen ? (
                <div className="comenzar-inline-races__expand">
                  <RaceCard
                    race={race}
                    activeStrategy={activeStrategy}
                    selectedHorses={currentRacePicks}
                    confirmedStrategy={confirmedStrategyForRace(race.id)}
                    onPickHorse={handlePickHorse}
                    onStrategyChange={handleStrategyChange}
                    isExpanded
                    onToggleExpand={() => toggleRace(race.id)}
                    tournamentRace
                  />
                  {!done ? (
                    <div className="comenzar-inline-races__pick-bar">
                      <PickSelector
                        activeStrategy={activeStrategy}
                        onStrategyChange={handleStrategyChange}
                        picksCount={currentRacePicks.length}
                        totalPoints={
                          50 -
                          (strategy?.allocation
                            ?.slice(0, currentRacePicks.length)
                            .reduce((sum, value) => sum + value, 0) || 0)
                        }
                      />
                      <button
                        type="button"
                        className="comenzar-inline-races__confirm"
                        disabled={!isPicksComplete || submitting}
                        onClick={handleConfirm}
                      >
                        {submitting ? "..." : t("gameModalities.confirmRacePick")}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      {showConfirmation && confirmedRace && expandedRaceData ? (
        <TicketConfirmation
          isOpen={showConfirmation}
          onClose={() => {
            setShowConfirmation(false);
            setConfirmedRace(null);
            setExpandedRace(null);
          }}
          raceName={expandedRaceData.name}
          raceNumber={expandedRaceData.raceNumber ?? expandedRaceData.number}
          activeStrategy={activeStrategy}
          selectedHorses={picks[confirmedRace] || []}
          horses={expandedRaceData.horses || []}
          tournamentSlug={tournament.slug}
        />
      ) : null}
    </div>
  );
}
