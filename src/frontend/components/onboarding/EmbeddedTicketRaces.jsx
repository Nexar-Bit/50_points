"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { fetchAuthJson } from "@/frontend/lib/api/client";
import { fetchTournamentDetail } from "@/frontend/lib/api/tournaments";
import { normalizeTournament } from "@/frontend/lib/tournamentNormalize";
import RaceCard from "@/frontend/components/tournament/RaceCard";
import { strategies } from "@/frontend/components/tournament/PickSelector";
import TicketStrategyReview from "@/frontend/components/onboarding/TicketStrategyReview";
import TicketReceipt from "@/frontend/components/onboarding/TicketReceipt";
import {
  buildTicketReceiptCode,
  persistTicketReceiptCode,
  readTicketReceiptCode,
} from "@/frontend/lib/ticketReceiptCode";
import {
  getUsedTicketMeta,
  isTrackTicketUsed,
  markTrackTicketUsed,
  unmarkTrackTicketUsed,
} from "@/frontend/lib/trackTicketUsage";
import { STRATEGY_MAP, STRATEGY_REVERSE } from "@/frontend/lib/ticketRaceSummary";

export default function EmbeddedTicketRaces({
  tournamentSlug,
  ticketNum,
  trackSlug,
  trackName = "",
  onUsageChange,
}) {
  const { t, language } = useLanguage();
  const { token, ensureGuestSession, loading: authLoading } = useAuth();
  const [tournamentRaw, setTournamentRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittedTickets, setSubmittedTickets] = useState({});
  const [expandedRace, setExpandedRace] = useState(null);
  const [activeStrategy, setActiveStrategy] = useState("full");
  const [picks, setPicks] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [ticketFinalized, setTicketFinalized] = useState(false);
  const [receiptCode, setReceiptCode] = useState("");
  const [receiptIssuedAt, setReceiptIssuedAt] = useState(() => new Date());
  const [clearing, setClearing] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [ticketUsed, setTicketUsed] = useState(() => isTrackTicketUsed(trackSlug, ticketNum));

  useEffect(() => {
    const syncUsed = () => setTicketUsed(isTrackTicketUsed(trackSlug, ticketNum));
    syncUsed();
    window.addEventListener("50points-tickets-updated", syncUsed);
    return () => window.removeEventListener("50points-tickets-updated", syncUsed);
  }, [trackSlug, ticketNum]);

  useEffect(() => {
    if (authLoading || token || !tournamentSlug) return;
    ensureGuestSession().catch(() => {});
  }, [authLoading, token, tournamentSlug, ensureGuestSession]);

  useEffect(() => {
    const used = ticketUsed;
    setTicketFinalized(used);
    if (used && tournamentSlug) {
      const saved = readTicketReceiptCode(trackSlug, ticketNum, tournamentSlug);
      if (saved) setReceiptCode(saved);
      setShowReceipt(true);
      setShowSummary(false);
    } else if (!used) {
      setShowReceipt(false);
    }
  }, [trackSlug, ticketNum, tournamentSlug, ticketUsed]);

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

  const allRacesSubmitted = useMemo(
    () =>
      Boolean(
        tournament?.races?.length &&
          tournament.races.every((race) => submittedForRace(race.id)),
      ),
    [tournament, submittedForRace],
  );

  const selectRace = useCallback(
    (raceId) => {
      setShowSummary(false);
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
    if (ticketUsed || !tournament?.races?.length || showSummary || ticketFinalized) return;
    const firstOpen = tournament.races.find(
      (race) => !submittedTickets[`${race.id}-${ticketNum}`],
    );
    if (!firstOpen) return;
    selectRace(firstOpen.id);
  }, [
    tournamentRaw?.id,
    ticketNum,
    tournament?.races,
    submittedTickets,
    selectRace,
    showSummary,
    ticketFinalized,
    ticketUsed,
  ]);

  useEffect(() => {
    if (ticketUsed || !allRacesSubmitted) return;
    setShowSummary(true);
    setShowReceipt(false);
  }, [allRacesSubmitted, ticketUsed]);

  useEffect(() => {
    if (!showReceipt || ticketUsed) return;
    if (ticketFinalized && allRacesSubmitted) {
      setShowSummary(false);
    }
  }, [ticketFinalized, allRacesSubmitted, showReceipt, ticketUsed]);

  const confirmedStrategyForRace = useCallback(
    (raceId) => {
      const sub = submittedForRace(raceId);
      return sub ? STRATEGY_REVERSE[sub.strategy] || "full" : null;
    },
    [submittedForRace],
  );

  const handlePickHorse = useCallback(
    (horseId) => {
      if (!expandedRace || submittedForRace(expandedRace) || showSummary) return;
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
    [expandedRace, activeStrategy, submittedForRace, showSummary],
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

  const goToNextRace = useCallback(() => {
    if (!tournament?.races?.length || !expandedRace) return;
    const idx = tournament.races.findIndex((race) => race.id === expandedRace);
    const nextRace = idx >= 0 ? tournament.races[idx + 1] : null;
    if (nextRace) selectRace(nextRace.id);
  }, [tournament, expandedRace, selectRace]);

  const handleConfirm = useCallback(async () => {
    if (!expandedRace || submitting || submittedForRace(expandedRace) || showSummary) return;
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

      const nextSubmitted = {
        ...submittedTickets,
        [`${expandedRace}-${ticketNum}`]: {
          ...data.ticket,
          raceId: expandedRace,
          ticketNumber: ticketNum,
        },
      };
      setSubmittedTickets(nextSubmitted);

      const allDone = (tournament?.races || []).every((race) =>
        Boolean(nextSubmitted[`${race.id}-${ticketNum}`]),
      );

      if (allDone) {
        setShowSummary(true);
      } else {
        const nextOpen = tournament?.races.find(
          (race) => !nextSubmitted[`${race.id}-${ticketNum}`],
        );
        if (nextOpen) {
          setTimeout(() => selectRace(nextOpen.id), 300);
        }
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
    submittedTickets,
    submittedForRace,
    selectRace,
    showSummary,
    t,
  ]);

  const handleEditRace = useCallback(
    async (raceId) => {
      if (!tournamentRaw?.id) return;
      try {
        if (!token) {
          await ensureGuestSession();
        }
        await fetchAuthJson(
          `/tickets?tournamentId=${tournamentRaw.id}&ticketNumber=${ticketNum}&raceId=${raceId}`,
          { method: "DELETE" },
        );
        setSubmittedTickets((prev) => {
          const next = { ...prev };
          delete next[`${raceId}-${ticketNum}`];
          return next;
        });
        setTicketFinalized(false);
        setShowSummary(false);
        selectRace(raceId);
      } catch (err) {
        alert(err?.message || t("gameModalities.submitError"));
      }
    },
    [
      tournamentRaw?.id,
      ticketNum,
      token,
      ensureGuestSession,
      selectRace,
      t,
    ],
  );

  const handleClearTicket = useCallback(async () => {
    if (!tournamentRaw?.id || clearing) return;
    setClearing(true);
    try {
      if (!token) {
        await ensureGuestSession();
      }
      await fetchAuthJson(
        `/tickets?tournamentId=${tournamentRaw.id}&ticketNumber=${ticketNum}`,
        { method: "DELETE" },
      );
      setSubmittedTickets({});
      setPicks({});
      setShowSummary(false);
      setShowReceipt(false);
      setTicketFinalized(false);
      setTicketUsed(false);
      unmarkTrackTicketUsed(trackSlug, ticketNum);
      onUsageChange?.();
      const firstRace = tournament?.races?.[0];
      if (firstRace) selectRace(firstRace.id);
    } catch (err) {
      alert(err?.message || t("gameModalities.ticketReviewClearError"));
    } finally {
      setClearing(false);
    }
  }, [
    tournamentRaw?.id,
    ticketNum,
    clearing,
    token,
    ensureGuestSession,
    tournament,
    selectRace,
    trackSlug,
    onUsageChange,
    t,
  ]);

  const handleFinalizeTicket = useCallback(async () => {
    if (!allRacesSubmitted || finalizing || ticketFinalized) return;
    setFinalizing(true);
    try {
      const raceIds = (tournament?.races || []).map((race) => race.id);
      const code =
        readTicketReceiptCode(trackSlug, ticketNum, tournament?.slug || tournamentSlug) ||
        buildTicketReceiptCode({
          tournamentId: tournamentRaw?.id,
          ticketNum,
          trackSlug,
          raceIds,
        });
      const issuedAt = new Date();
      persistTicketReceiptCode(trackSlug, ticketNum, tournament?.slug || tournamentSlug, code);
      markTrackTicketUsed(
        trackSlug,
        ticketNum,
        tournament?.slug,
        tournament?.name || trackName,
      );
      setTicketUsed(true);
      setReceiptCode(code);
      setReceiptIssuedAt(issuedAt);
      setTicketFinalized(true);
      setShowSummary(false);
      setShowReceipt(true);
      onUsageChange?.();
    } finally {
      setFinalizing(false);
    }
  }, [
    allRacesSubmitted,
    finalizing,
    ticketFinalized,
    trackSlug,
    ticketNum,
    tournament?.slug,
    tournament?.races,
    tournamentSlug,
    tournamentRaw?.id,
    trackSlug,
    onUsageChange,
    trackName,
    tournament?.name,
  ]);

  const usedMeta = getUsedTicketMeta(trackSlug, ticketNum);
  const tournamentDisplayName =
    tournament?.name ||
    usedMeta?.tournamentName ||
    trackName ||
    tournament?.track ||
    "";

  const renderReceipt = (readOnly = false) => {
    const code =
      receiptCode ||
      readTicketReceiptCode(trackSlug, ticketNum, tournament?.slug || tournamentSlug) ||
      buildTicketReceiptCode({
        tournamentId: tournamentRaw?.id,
        ticketNum,
        trackSlug,
        raceIds: tournament.races.map((race) => race.id),
      });

    return (
      <TicketReceipt
        trackName={trackName || tournament.track || tournament.name}
        trackLocation={tournament.location}
        tournamentName={tournamentDisplayName}
        ticketNum={ticketNum}
        tournament={tournament}
        submittedTickets={submittedTickets}
        receiptCode={code}
        issuedAt={receiptIssuedAt}
        isEn={language === "en"}
        readOnly={readOnly}
        onEdit={
          readOnly
            ? undefined
            : () => {
                setShowReceipt(false);
                setShowSummary(true);
              }
        }
        t={t}
      />
    );
  };

  if (loading) {
    return <p className="comenzar-inline-races__status">{t("gameModalities.loading")}</p>;
  }

  if (error) {
    return <p className="comenzar-inline-races__status">{error}</p>;
  }

  if (!tournament?.races?.length) {
    return <p className="comenzar-inline-races__status">{t("tournamentsSection.empty")}</p>;
  }

  if (ticketUsed) {
    return renderReceipt(true);
  }

  if (showReceipt && (ticketFinalized || receiptCode)) {
    return renderReceipt(false);
  }

  if (showSummary && allRacesSubmitted && !ticketFinalized) {
    return (
      <TicketStrategyReview
        trackName={trackName || tournament.track || tournament.name}
        ticketNum={ticketNum}
        tournament={tournament}
        submittedTickets={submittedTickets}
        onEditRace={handleEditRace}
        onClear={handleClearTicket}
        onBack={() => setShowSummary(false)}
        onConfirmTicket={handleFinalizeTicket}
        clearing={clearing}
        confirming={finalizing}
        readOnly={false}
        t={t}
      />
    );
  }

  const expandedRaceData = tournament.races.find((r) => r.id === expandedRace);
  const currentRacePicks = expandedRace ? picks[expandedRace] || [] : [];
  const strategy = strategies.find((s) => s.id === activeStrategy);
  const isPicksComplete = currentRacePicks.length === (strategy?.maxPicks || 1);
  const expandedDone = expandedRace ? Boolean(submittedForRace(expandedRace)) : false;
  const expandedRaceIndex = expandedRace
    ? tournament.races.findIndex((race) => race.id === expandedRace)
    : -1;
  const hasNextRace =
    expandedRaceIndex >= 0 && expandedRaceIndex < tournament.races.length - 1;
  const confirmedCount = tournament.races.filter((race) =>
    Boolean(submittedForRace(race.id)),
  ).length;
  const currentRaceNum =
    expandedRaceData?.raceNumber ?? expandedRaceData?.number ?? expandedRaceIndex + 1;

  if (!expandedRace || !expandedRaceData) {
    return <p className="comenzar-inline-races__status">{t("gameModalities.loading")}</p>;
  }

  return (
    <div className="comenzar-inline-races comenzar-inline-races--linear">
      <div className="comenzar-inline-races__zone" id={`race-zone-${expandedRace}`}>
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
          <div className="comenzar-inline-races__pick-bar">
            <p className="comenzar-inline-races__progress">
              {t("gameModalities.raceLabel")} {currentRaceNum} / {tournament.races.length}
              <span className="comenzar-inline-races__progress-done">
                {" · "}
                {confirmedCount}/{tournament.races.length} {t("gameModalities.raceProgressDone")}
              </span>
            </p>
            <div className="comenzar-inline-races__pick-actions">
              {!expandedDone ? (
                <button
                  type="button"
                  className="comenzar-inline-races__confirm"
                  disabled={!isPicksComplete || submitting}
                  onClick={handleConfirm}
                >
                  {submitting ? "..." : t("gameModalities.confirmRacePick")}
                </button>
              ) : null}
              <button
                type="button"
                className="comenzar-inline-races__next"
                disabled={!hasNextRace}
                onClick={goToNextRace}
              >
                {t("gameModalities.nextRace")}
              </button>
              {allRacesSubmitted ? (
                <button
                  type="button"
                  className="comenzar-inline-races__summary"
                  onClick={() => setShowSummary(true)}
                >
                  {t("gameModalities.ticketReviewOpen")}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
