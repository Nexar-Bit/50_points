"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { fetchAuthJson } from "@/frontend/lib/api/client";
import { fetchTournamentDetail } from "@/frontend/lib/api/tournaments";
import { normalizeTournament } from "@/frontend/lib/tournamentNormalize";
import RaceCard from "@/frontend/components/tournament/RaceCard";
import PickSelector, { strategies } from "@/frontend/components/tournament/PickSelector";
import TicketConfirmation from "@/frontend/components/tournament/TicketConfirmation";
import TicketWorkflowContext from "@/frontend/components/onboarding/TicketWorkflowContext";
import {
  BrowserTabs,
  BrowserTabBar,
  BrowserTab,
  BrowserTabPanel,
} from "@/frontend/components/ui/BrowserTabBar";
import { markTrackTicketUsed } from "@/frontend/lib/trackTicketUsage";
import {
  getRacePickSummary,
  STRATEGY_MAP,
  STRATEGY_REVERSE,
} from "@/frontend/lib/ticketRaceSummary";

export default function EmbeddedTicketRaces({
  tournamentSlug,
  ticketNum,
  trackSlug,
  trackName = "",
  onUsageChange,
}) {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const { token, ensureGuestSession, loading: authLoading } = useAuth();
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

  useEffect(() => {
    if (authLoading || token || !tournamentSlug) return;
    ensureGuestSession().catch(() => {});
  }, [authLoading, token, tournamentSlug, ensureGuestSession]);

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
    if (!tournamentRaw) return;
    let cancelled = false;

    async function loadSubmittedTickets() {
      try {
        if (!token) {
          await ensureGuestSession();
        }
      } catch {
        return;
      }
      if (cancelled) return;
      try {
        const data = await fetchAuthJson(`/tickets?tournamentId=${tournamentRaw.id}`);
        if (!data?.tickets) return;
        const ticketMap = {};
        for (const ticket of data.tickets) {
          if (ticket.ticketNumber === ticketNum) {
            ticketMap[`${ticket.raceId}-${ticket.ticketNumber}`] = ticket;
          }
        }
        if (!cancelled) setSubmittedTickets(ticketMap);
      } catch {
        /* guest session may still be starting */
      }
    }

    loadSubmittedTickets();
    return () => {
      cancelled = true;
    };
  }, [token, tournamentRaw, ticketNum, ensureGuestSession]);

  const tournament = useMemo(
    () => (tournamentRaw ? normalizeTournament(tournamentRaw) : null),
    [tournamentRaw],
  );

  const submittedForRace = useCallback(
    (raceId) => submittedTickets[`${raceId}-${ticketNum}`],
    [submittedTickets, ticketNum],
  );

  const selectRace = useCallback(
    (raceId) => {
      setExpandedRace(raceId);
      const sub = submittedTickets[`${raceId}-${ticketNum}`];
      if (sub) {
        setActiveStrategy(STRATEGY_REVERSE[sub.strategy] || "full");
        setPicks((prev) => ({ ...prev, [raceId]: sub.picks || [] }));
      } else {
        setActiveStrategy("full");
        setPicks((prev) => ({ ...prev, [raceId]: prev[raceId] || [] }));
      }
    },
    [submittedTickets, ticketNum],
  );

  useEffect(() => {
    const firstRace = tournament?.races?.[0];
    if (!firstRace) return;
    setExpandedRace(firstRace.id);
    setActiveStrategy("full");
    setPicks({});
  }, [tournamentRaw?.id, ticketNum, tournament?.races?.length]);

  const confirmedStrategyForRace = useCallback(
    (raceId) => {
      const sub = submittedForRace(raceId);
      return sub ? STRATEGY_REVERSE[sub.strategy] || "full" : null;
    },
    [submittedForRace],
  );

  const handlePickHorse = useCallback(
    (horseId) => {
      if (!expandedRace || submittedForRace(expandedRace)) return;
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
    [expandedRace, activeStrategy, submittedForRace],
  );

  const handleStrategyChange = useCallback(
    (strategyId) => {
      if (expandedRace && submittedForRace(expandedRace)) return;
      setActiveStrategy(strategyId);
      if (expandedRace) {
        setPicks((prev) => ({ ...prev, [expandedRace]: [] }));
      }
    },
    [expandedRace, submittedForRace],
  );

  const handleConfirm = useCallback(async () => {
    if (!expandedRace || submitting || submittedForRace(expandedRace)) return;
    const racePicks = picks[expandedRace] || [];
    if (racePicks.length === 0) return;

    setSubmitting(true);
    try {
      if (!token) {
        await ensureGuestSession();
      }

      const currentRace = tournament?.races.find((r) => r.id === expandedRace);
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

      const nextSubmitted = {
        ...submittedTickets,
        [`${expandedRace}-${ticketNum}`]: data.ticket,
      };
      const allRacesConfirmed = (tournament?.races || []).every((race) =>
        Boolean(nextSubmitted[`${race.id}-${ticketNum}`]),
      );
      if (allRacesConfirmed) {
        markTrackTicketUsed(trackSlug, ticketNum, tournament?.slug);
      }
      onUsageChange?.();
      setShowConfirmation(true);

      const nextOpen = tournament?.races.find(
        (race) => !nextSubmitted[`${race.id}-${ticketNum}`],
      );
      if (nextOpen) {
        setTimeout(() => selectRace(nextOpen.id), 400);
      }
    } catch (err) {
      const detail = err?.data?.detail;
      const msg =
        typeof detail === "string"
          ? detail
          : err?.message || t("gameModalities.submitError");
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  }, [
    expandedRace,
    submitting,
    picks,
    token,
    ensureGuestSession,
    activeStrategy,
    ticketNum,
    tournamentRaw,
    tournament,
    trackSlug,
    onUsageChange,
    submittedTickets,
    submittedForRace,
    selectRace,
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
  const expandedDone = expandedRace ? Boolean(submittedForRace(expandedRace)) : false;
  const displayTrack = trackName || tournament.track || tournament.name || "Track";

  return (
    <BrowserTabs className="browser-tabs--races ticket-workflow-segment comenzar-inline-races">
      <TicketWorkflowContext
        trackName={displayTrack}
        ticketNum={ticketNum}
        raceNumber={expandedRaceData?.raceNumber ?? expandedRaceData?.number}
        isEn={isEn}
      />

      <BrowserTabBar
        className="browser-tabs__bar--races ticket-race-overview"
        role="tablist"
        aria-label={t("gameModalities.raceLabel")}
      >
        {tournament.races.map((race) => {
          const raceNum = race.raceNumber ?? race.number;
          const isActive = expandedRace === race.id;
          const submitted = submittedForRace(race.id);
          const summary = getRacePickSummary(
            race,
            submitted,
            picks[race.id],
            isActive ? activeStrategy : confirmedStrategyForRace(race.id) || "full",
          );

          let statusLabel = t("gameModalities.raceOverviewNoPick");
          if (summary.ready) statusLabel = t("gameModalities.raceOverviewReady");
          else if (summary.draft) statusLabel = t("gameModalities.raceOverviewDraft");
          else if (isActive) statusLabel = t("gameModalities.raceOverviewEdit");

          return (
            <BrowserTab
              key={race.id}
              id={`race-tab-${race.id}`}
              aria-controls={`race-zone-${race.id}`}
              active={isActive}
              className={`ticket-race-overview__card${
                isActive ? " ticket-race-overview__card--active" : ""
              }${summary.ready ? " ticket-race-overview__card--ready" : ""}`}
              onClick={() => selectRace(race.id)}
            >
              <span className="ticket-race-overview__num">
                {t("gameModalities.raceLabel")} {raceNum}
              </span>
              <span className="ticket-race-overview__strategy">
                {summary.strategy || "—"}
              </span>
              <span className="ticket-race-overview__picks">
                {summary.posts.length
                  ? summary.posts.map((post, index) => (
                      <span key={`${race.id}-pick-${index}`} className="ticket-race-overview__pick">
                        {post}
                      </span>
                    ))
                  : t("gameModalities.raceOverviewNoPick")}
              </span>
              <span
                className={`ticket-race-overview__status${
                  summary.ready ? " ticket-race-overview__status--ready" : ""
                }`}
              >
                {statusLabel}
              </span>
            </BrowserTab>
          );
        })}
      </BrowserTabBar>

      {expandedRace && expandedRaceData ? (
        <BrowserTabPanel
          className="comenzar-inline-races__zone"
          id={`race-zone-${expandedRace}`}
          role="tabpanel"
          aria-labelledby={`race-tab-${expandedRace}`}
        >
          <header className="comenzar-inline-races__zone-head">
            <span className="comenzar-inline-races__zone-badge">
              {t("gameModalities.raceLabel")} {expandedRaceData.raceNumber ?? expandedRaceData.number}
            </span>
            <span className="comenzar-inline-races__zone-meta">
              {expandedRaceData.name} · {expandedRaceData.distance}m · {expandedRaceData.surface}
            </span>
            <span
              className={`comenzar-inline-races__zone-status${
                expandedDone ? " comenzar-inline-races__zone-status--done" : ""
              }`}
            >
              {expandedDone ? t("gameModalities.raceConfirmed") : t("gameModalities.racePending")}
            </span>
          </header>

          <div className="comenzar-inline-races__zone-body">
            <RaceCard
              race={expandedRaceData}
              activeStrategy={activeStrategy}
              selectedHorses={currentRacePicks}
              confirmedStrategy={confirmedStrategyForRace(expandedRaceData.id)}
              onPickHorse={handlePickHorse}
              onStrategyChange={handleStrategyChange}
              isExpanded
              onToggleExpand={() => selectRace(expandedRaceData.id)}
              tournamentRace
            />
            {!expandedDone ? (
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
        </BrowserTabPanel>
      ) : null}

      {showConfirmation && confirmedRace && expandedRaceData ? (
        <TicketConfirmation
          isOpen={showConfirmation}
          onClose={() => {
            setShowConfirmation(false);
            setConfirmedRace(null);
          }}
          raceName={expandedRaceData.name}
          raceNumber={expandedRaceData.raceNumber ?? expandedRaceData.number}
          activeStrategy={activeStrategy}
          selectedHorses={picks[confirmedRace] || []}
          horses={expandedRaceData.horses || []}
          tournamentSlug={tournament.slug}
        />
      ) : null}
    </BrowserTabs>
  );
}
