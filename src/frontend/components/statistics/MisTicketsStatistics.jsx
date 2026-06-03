"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, User, Trophy, Calendar, MapPin } from "lucide-react";
import AppPageHeader from "@/frontend/components/layout/AppPageHeader";
import { HorseHeadIcon } from "@/frontend/components/statistics/MisTicketsStatsIcons";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { fetchAuthJson, fetchJson } from "@/frontend/lib/api/client";
import {
  MiniLineChart,
  MiniDonutChart,
  DonutDistribution,
  MiniDistributionDonut,
  EvolutionLineChart,
} from "@/frontend/components/statistics/statsCharts";
import {
  POINTS_PER_RACE_BET,
  buildDonutFromApi,
  formatNum,
  formatTournamentDate,
  personalMetricsView,
  raceMetricsView,
  raceOutcomeView,
  tournamentMetricsView,
  tournamentPerfView,
} from "@/frontend/lib/statistics/misTicketsMappers";

const TABS = [
  { id: "personal", icon: User },
  { id: "race", icon: HorseHeadIcon },
  { id: "tournament", icon: Trophy },
];

const DEFAULT_TOURNAMENT_RACES = 7;

function buildRaceSlots(races, totalRaces) {
  const maxFromList =
    races.length > 0 ? Math.max(...races.map((r) => r.raceNumber)) : 0;
  const count = Math.max(
    totalRaces ?? DEFAULT_TOURNAMENT_RACES,
    maxFromList,
    DEFAULT_TOURNAMENT_RACES,
  );
  return Array.from({ length: count }, (_, i) => {
    const raceNumber = i + 1;
    const fromApi = races.find((r) => r.raceNumber === raceNumber);
    return fromApi ?? { id: null, raceNumber };
  });
}

function DonutLegendList({ segments, variant = "personal" }) {
  if (!segments.length) return null;
  return (
    <ul className="mis-stats-legend">
      {segments.map((s) => (
        <li key={s.label}>
          {s.num != null ? (
            <span className="mis-stats-legend__badge" style={{ backgroundColor: s.color }}>
              {s.num}
            </span>
          ) : (
            <span
              className="mis-stats-legend__badge mis-stats-legend__badge--plain"
              style={{ backgroundColor: s.color }}
              aria-hidden
            />
          )}
          <span className="mis-stats-legend__name">{s.label}</span>
          <span
            className={`mis-stats-legend__value${variant === "personal" ? " mis-stats-legend__value--green" : ""}`}
          >
            {variant === "personal" ? `${s.pts ?? s.value} pts` : `${s.value}%`}
          </span>
        </li>
      ))}
    </ul>
  );
}

function MetricCard({ label, value, delta, deltaGreen, footer, theme }) {
  return (
    <div className={`mis-stats-metric mis-stats-metric--${theme}`}>
      <p className="mis-stats-metric__label">{label}</p>
      <div className="mis-stats-metric__row">
        <p className="mis-stats-metric__value">{value}</p>
        {delta ? (
          <span className={`mis-stats-metric__delta${deltaGreen ? " mis-stats-metric__delta--up" : ""}`}>
            {delta}
          </span>
        ) : null}
      </div>
      {footer ? <div className="mis-stats-metric__footer">{footer}</div> : null}
    </div>
  );
}

function PersonalMetrics({ t, data }) {
  if (!data) {
    return <p className="mis-stats-empty">{t("misTicketsStats.noData")}</p>;
  }
  return (
    <div className="mis-stats-metrics">
      <MetricCard
        theme="purple"
        label={t("misTicketsStats.pointsPlayed")}
        value={data.pointsPlayed}
        footer={<MiniLineChart color="#a855f7" points={data.linePurple} />}
      />
      <MetricCard
        theme="purple"
        label={t("misTicketsStats.pointsWon")}
        value={data.pointsWon}
        footer={<MiniLineChart color="#a855f7" points={data.linePurple} />}
      />
      <MetricCard
        theme="purple"
        label={t("misTicketsStats.profitability")}
        value={data.profitability}
        footer={
          <>
            <p className="mis-stats-metric__sub">{t("misTicketsStats.onInvested")}</p>
            <MiniDonutChart color="#a855f7" percent={data.donutPct} />
          </>
        }
      />
      <MetricCard
        theme="purple"
        label={t("misTicketsStats.bestPosition")}
        value={
          <span className="mis-stats-metric__trophy-row">
            <span>🏆</span>
            {data.bestPosition}
          </span>
        }
        footer={<p className="mis-stats-metric__sub">{data.bestPositionSub}</p>}
      />
    </div>
  );
}

function RaceMetrics({ t, data }) {
  if (!data) {
    return <p className="mis-stats-empty">{t("misTicketsStats.noData")}</p>;
  }
  return (
    <div className="mis-stats-metrics mis-stats-metrics--race-summary">
      <MetricCard
        theme="green"
        label={t("misTicketsStats.racesPlayed")}
        value={data.racesPlayed}
        footer={<MiniLineChart color="#22c55e" points={data.lineGreen} />}
      />
      <MetricCard
        theme="green"
        label={t("misTicketsStats.accuracy")}
        value={data.accuracy}
        footer={<MiniDonutChart color="#22c55e" percent={data.donutPct} />}
      />
      <MetricCard
        theme="green"
        label={t("misTicketsStats.avgPerRace")}
        value={data.avgPoints}
        footer={<MiniLineChart color="#22c55e" points={data.lineGreen} />}
      />
      <MetricCard
        theme="green"
        label={t("misTicketsStats.bestRace")}
        value={data.bestRace}
        footer={
          <>
            <p className="mis-stats-metric__value-sm text-emerald-400">{data.bestRacePts}</p>
            <p className="mis-stats-metric__sub">{data.bestRaceTrack}</p>
          </>
        }
      />
    </div>
  );
}

function TournamentMetrics({ t, data }) {
  if (!data) {
    return <p className="mis-stats-empty">{t("misTicketsStats.noData")}</p>;
  }
  return (
    <div className="mis-stats-metrics">
      <MetricCard
        theme="orange"
        label={t("misTicketsStats.currentPosition")}
        value={data.position}
        footer={
          <>
            <p className="mis-stats-metric__sub">{data.positionSub}</p>
            <MiniLineChart color="#f59e0b" points={data.lineOrange} />
          </>
        }
      />
      <MetricCard
        theme="orange"
        label={t("misTicketsStats.totalPoints")}
        value={data.totalPoints}
        footer={<MiniDonutChart color="#f59e0b" percent={data.donutPct} />}
      />
      <MetricCard
        theme="orange"
        label={t("misTicketsStats.pointsDistributed")}
        value={data.distributed}
        footer={<MiniLineChart color="#f59e0b" points={data.lineOrange} />}
      />
      <MetricCard
        theme="orange"
        label={t("misTicketsStats.tournamentLeader")}
        value={data.leader}
        footer={<p className="mis-stats-metric__value-sm text-amber-400">{data.leaderPts}</p>}
      />
    </div>
  );
}

function FinishTable({ rows, t, avgHeader }) {
  if (!rows?.length) {
    return <p className="mis-stats-empty mis-stats-empty--inline">{t("misTicketsStats.noData")}</p>;
  }
  return (
    <table className="mis-stats-table">
      <thead>
        <tr>
          <th>POS</th>
          <th>{t("misTicketsStats.horse")}</th>
          <th>{avgHeader ? t("misTicketsStats.avg") : t("misTicketsStats.pointsLabel")}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={`${row.pos}-${row.horse}`} className={row.highlight ? "mis-stats-table__row--highlight" : ""}>
            <td>{row.pos}</td>
            <td>
              <span className="mis-stats-table__horse">
                <span className="mis-stats-table__dot" style={{ background: row.color }} />
                {row.horse}
              </span>
            </td>
            <td>{row.pts}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PerfPanel({
  title,
  titleClass,
  metrics,
  evolutionColor,
  evolutionValues,
  horseOptions,
  distribution,
  t,
  evolutionLabel,
  optionsTitle,
  distributionTitle,
}) {
  return (
    <div className="mis-stats-panel">
      <h4 className={`mis-stats-panel__subtitle ${titleClass}`}>{title}</h4>
      <div className="mis-stats-mini-metrics">
        {metrics.map(({ label, value }) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <p className="mis-stats-chart-label">{evolutionLabel}</p>
      {evolutionValues.length > 1 ? (
        <EvolutionLineChart color={evolutionColor} values={evolutionValues} />
      ) : (
        <p className="mis-stats-empty mis-stats-empty--inline">{t("misTicketsStats.noData")}</p>
      )}
      <div className="mis-stats-bottom-widgets">
        <div className="mis-stats-widget-col">
          <p className="mis-stats-widget-title">{optionsTitle}</p>
          {horseOptions.length ? (
            <ul className="mis-stats-widget-list">
              {horseOptions.map((o) => (
                <li key={o.name}>
                  <span>{o.name}</span>
                  <span>{o.pct}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mis-stats-empty mis-stats-empty--inline">{t("misTicketsStats.noData")}</p>
          )}
        </div>
        <div className="mis-stats-widget-col mis-stats-widget-col--chart">
          <p className="mis-stats-widget-title">{distributionTitle}</p>
          {distribution.length ? (
            <MiniDistributionDonut segments={distribution} />
          ) : (
            <p className="mis-stats-empty mis-stats-empty--inline">{t("misTicketsStats.noData")}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MisTicketsStatistics() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("race");
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [races, setRaces] = useState([]);
  const [selectedRaceId, setSelectedRaceId] = useState(null);
  const [raceStats, setRaceStats] = useState(null);
  const [personalStats, setPersonalStats] = useState(null);
  const [tournamentStats, setTournamentStats] = useState(null);

  useEffect(() => {
    fetchJson("/tournaments")
      .then((res) => {
        const list = res.tournaments || res || [];
        setTournaments(list);
        const live = list.find((x) => x.status === "live") || list[0];
        if (live) setSelectedTournament(live);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedTournament) return;
    const listRaces = selectedTournament.races || [];
    if (listRaces.length > 0) {
      setRaces(listRaces);
      const r2 = listRaces.find((r) => r.raceNumber === 2) || listRaces[0];
      if (r2?.id) setSelectedRaceId(r2.id);
    }
  }, [selectedTournament?.id]);

  useEffect(() => {
    if (!selectedTournament?.slug) return;
    fetchJson(`/tournaments/${encodeURIComponent(selectedTournament.slug)}`)
      .then((data) => {
        const tourn = data.tournament || data;
        const list = tourn?.races || data.races || [];
        setRaces(list);
        if (tourn?.totalRaces) {
          setSelectedTournament((prev) =>
            prev ? { ...prev, totalRaces: tourn.totalRaces, date: tourn.date ?? prev.date } : prev,
          );
        }
        const r2 = list.find((r) => r.raceNumber === 2) || list[0];
        if (r2?.id) setSelectedRaceId(r2.id);
      })
      .catch(() => setRaces([]));
  }, [selectedTournament?.slug]);

  const loadStats = useCallback(async () => {
    if (!selectedRaceId) return;
    try {
      const raceReq = isAuthenticated
        ? fetchAuthJson(`/statistics/race/${selectedRaceId}`)
        : fetchJson(`/statistics/race/${selectedRaceId}`);
      const race = await raceReq;
      setRaceStats(race);
      if (isAuthenticated) {
        const personal = await fetchAuthJson("/statistics/personal");
        setPersonalStats(personal);
      } else {
        setPersonalStats(null);
      }
    } catch {
      setRaceStats(null);
    }
  }, [selectedRaceId, isAuthenticated]);

  const loadTournamentStats = useCallback(async () => {
    if (!selectedTournament?.id) return;
    try {
      const req = isAuthenticated
        ? fetchAuthJson(`/statistics/tournament/${selectedTournament.id}`)
        : fetchJson(`/statistics/tournament/${selectedTournament.id}`);
      const data = await req;
      setTournamentStats(data);
    } catch {
      setTournamentStats(null);
    }
  }, [selectedTournament?.id, isAuthenticated]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadTournamentStats();
  }, [loadTournamentStats]);

  const personalDonut = useMemo(
    () => buildDonutFromApi(raceStats?.personal?.topHorses),
    [raceStats],
  );
  const generalDonut = useMemo(
    () => buildDonutFromApi(raceStats?.topHorses)?.map((s) => ({ ...s, pts: undefined })),
    [raceStats],
  );

  const personalMetrics = useMemo(
    () => personalMetricsView(personalStats, t),
    [personalStats, t],
  );
  const raceMetrics = useMemo(
    () => raceMetricsView(raceStats, personalStats),
    [raceStats, personalStats],
  );
  const tournamentMetrics = useMemo(
    () => tournamentMetricsView(tournamentStats, t),
    [tournamentStats, t],
  );
  const outcomes = useMemo(() => raceOutcomeView(raceStats), [raceStats]);

  const selectedRace = races.find((r) => r.id === selectedRaceId);
  const raceNum = selectedRace?.raceNumber ?? raceStats?.raceNumber ?? 2;
  const totalRaces = selectedTournament?.totalRaces ?? DEFAULT_TOURNAMENT_RACES;
  const raceSlots = useMemo(
    () => buildRaceSlots(races, selectedTournament?.totalRaces),
    [races, selectedTournament?.totalRaces],
  );

  const perf = useMemo(
    () => tournamentPerfView(tournamentStats, totalRaces),
    [tournamentStats, totalRaces],
  );

  const filterDate = formatTournamentDate(selectedTournament?.date);
  const filterTrack = selectedTournament?.track || raceStats?.track || "—";

  return (
    <>
      <AppPageHeader
        title={t("misTicketsStats.pageTitle")}
        filters={
          <>
            <div className="mis-stats-filter mis-stats-filter--tournament">
              <Trophy className="mis-stats-filter__icon" aria-hidden />
              <select
                className="mis-stats-filter__control"
                value={selectedTournament?.id ?? ""}
                title={selectedTournament?.name ?? ""}
                onChange={(e) => {
                  const tourn = tournaments.find((x) => String(x.id) === e.target.value);
                  setSelectedTournament(tourn || null);
                }}
              >
                {tournaments.map((tourn) => (
                  <option key={tourn.id} value={tourn.id}>
                    {tourn.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="mis-stats-filter__chevron" aria-hidden />
            </div>
            <div className="mis-stats-filter">
              <Calendar className="mis-stats-filter__icon" aria-hidden />
              <span className="mis-stats-filter__control">{filterDate}</span>
              <ChevronDown className="mis-stats-filter__chevron" aria-hidden />
            </div>
            <div className="mis-stats-filter">
              <MapPin className="mis-stats-filter__icon" aria-hidden />
              <span className="mis-stats-filter__control">{filterTrack}</span>
              <ChevronDown className="mis-stats-filter__chevron" aria-hidden />
            </div>
          </>
        }
      />

      <div className="mis-stats-tabs">
        {TABS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`mis-stats-tab mis-stats-tab--${id}${activeTab === id ? " mis-stats-tab--active" : ""}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon className="w-5 h-5 shrink-0" strokeWidth={2} />
            <span>{t(`misTicketsStats.tab${id.charAt(0).toUpperCase() + id.slice(1)}`)}</span>
          </button>
        ))}
      </div>

      {activeTab === "personal" && <PersonalMetrics t={t} data={personalMetrics} />}
      {activeTab === "tournament" && <TournamentMetrics t={t} data={tournamentMetrics} />}

      {activeTab === "race" && (
        <>
          <RaceMetrics t={t} data={raceMetrics} />

          <div className="mis-stats-deep">
            <section className="mis-stats-section">
              <h2 className="mis-stats-section__title">
                <span className="mis-stats-section__num">1</span>
                {t("misTicketsStats.selectRace")}
              </h2>
              <div className="mis-stats-race-pills" role="tablist" aria-label={t("misTicketsStats.selectRace")}>
                {raceSlots.map((race) => {
                  const isAvailable = Boolean(race.id);
                  const isActive = isAvailable
                    ? selectedRaceId === race.id
                    : selectedRace?.raceNumber === race.raceNumber;
                  return (
                    <button
                      key={race.id ?? `race-slot-${race.raceNumber}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      disabled={!isAvailable}
                      className={`mis-stats-race-pill${isActive ? " mis-stats-race-pill--active" : ""}${!isAvailable ? " mis-stats-race-pill--disabled" : ""}`}
                      onClick={() => isAvailable && setSelectedRaceId(race.id)}
                    >
                      {t("misTicketsStats.race")} {race.raceNumber}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="mis-stats-section mis-stats-section--donut">
              <div className="mis-stats-donut-grid">
                <article className="mis-stats-panel mis-stats-panel--donut">
                  <h3 className="mis-stats-panel__head">
                    <span className="mis-stats-panel__num">2</span>
                    <span className="mis-stats-panel__head-text">{t("misTicketsStats.donutPersonal")}</span>
                  </h3>
                  <p className="mis-stats-panel__desc">
                    {t("misTicketsStats.donutPersonalSub").replace("{race}", String(raceNum))}
                  </p>
                  <div className="mis-stats-panel__body">
                    {personalDonut.length ? (
                      <>
                        <DonutLegendList segments={personalDonut} variant="personal" />
                        <DonutDistribution
                          segments={personalDonut}
                          centerLine1={String(POINTS_PER_RACE_BET)}
                          centerLine2={t("misTicketsStats.points")}
                        />
                      </>
                    ) : (
                      <p className="mis-stats-empty">{t("misTicketsStats.noData")}</p>
                    )}
                  </div>
                </article>
                <article className="mis-stats-panel mis-stats-panel--donut">
                  <h3 className="mis-stats-panel__head">
                    <span className="mis-stats-panel__head-text">{t("misTicketsStats.donutGeneral")}</span>
                  </h3>
                  <p className="mis-stats-panel__desc">{t("misTicketsStats.donutGeneralSub")}</p>
                  <div className="mis-stats-panel__body">
                    {generalDonut.length ? (
                      <>
                        <DonutLegendList segments={generalDonut} variant="general" />
                        <DonutDistribution
                          segments={generalDonut}
                          centerLine1={t("misTicketsStats.percentTotal")}
                          centerLine2={t("misTicketsStats.ofTotal")}
                        />
                      </>
                    ) : (
                      <p className="mis-stats-empty">{t("misTicketsStats.noData")}</p>
                    )}
                  </div>
                </article>
              </div>
              <p className="mis-stats-footnote">{t("misTicketsStats.donutFootnote")}</p>
            </section>

            <section className="mis-stats-section">
              <h2 className="mis-stats-section__title">
                <span className="mis-stats-section__num">3</span>
                {t("misTicketsStats.raceResult")} {raceNum}
              </h2>
              <div className="mis-stats-result-grid">
                <div className="mis-stats-panel mis-stats-panel--result">
                  <p className="mis-stats-result__eyebrow">
                    <span className="mis-stats-result__icon">🏆</span>
                    {t("misTicketsStats.yourResult")}
                  </p>
                  {outcomes.personal ? (
                    <>
                      <p className="mis-stats-result__big">
                        +{outcomes.personal.big} {t("misTicketsStats.pointsWonLabel")}
                      </p>
                      <p className="mis-stats-result__meta">
                        {t("misTicketsStats.positionGot")}: {outcomes.personal.rank}
                      </p>
                      <p className="mis-stats-result__meta">
                        {t("misTicketsStats.winnerHorse")}: {outcomes.personal.winner}
                      </p>
                      <FinishTable rows={outcomes.personal.table} t={t} />
                    </>
                  ) : (
                    <p className="mis-stats-empty">{t("misTicketsStats.noData")}</p>
                  )}
                </div>
                <div className="mis-stats-panel mis-stats-panel--result">
                  <p className="mis-stats-result__eyebrow">
                    <span className="mis-stats-result__icon">👥</span>
                    {t("misTicketsStats.generalResult")}
                  </p>
                  {outcomes.general ? (
                    <>
                      <p className="mis-stats-result__big">
                        +{outcomes.general.big} {t("misTicketsStats.avgPointsLabel")}
                      </p>
                      <p className="mis-stats-result__meta">
                        {t("misTicketsStats.avgPosition")}: {outcomes.general.avgPosition}
                      </p>
                      <p className="mis-stats-result__meta">
                        {t("misTicketsStats.topWinner")}: {outcomes.general.winner}
                      </p>
                      <FinishTable rows={outcomes.general.table} t={t} avgHeader />
                    </>
                  ) : (
                    <p className="mis-stats-empty">{t("misTicketsStats.noData")}</p>
                  )}
                </div>
              </div>
            </section>

            <section className="mis-stats-section mis-stats-section--last">
              <h2 className="mis-stats-section__title">
                <span className="mis-stats-section__num">4</span>
                {t("misTicketsStats.tournamentPerf")} ({raceNum} {t("misTicketsStats.of")} {totalRaces})
              </h2>
              <div className="mis-stats-perf-grid">
                {perf.personal ? (
                  <PerfPanel
                    title={t("misTicketsStats.yourPerf")}
                    titleClass="mis-stats-panel__subtitle--purple"
                    metrics={[
                      { label: t("misTicketsStats.totalPoints"), value: perf.personal.totalPoints },
                      { label: t("misTicketsStats.generalPos"), value: perf.personal.rank },
                      { label: t("misTicketsStats.avgPoints"), value: perf.personal.avgPoints },
                      { label: t("misTicketsStats.hitRate"), value: perf.personal.hitRate },
                    ]}
                    evolutionColor="#a855f7"
                    evolutionValues={perf.personal.evolution}
                    horseOptions={perf.personal.horseOptions}
                    distribution={perf.personal.distribution}
                    t={t}
                    evolutionLabel={t("misTicketsStats.pointsEvolution")}
                    optionsTitle={t("misTicketsStats.bestOptions")}
                    distributionTitle={t("misTicketsStats.pointsDistribution")}
                  />
                ) : (
                  <div className="mis-stats-panel">
                    <p className="mis-stats-empty">{t("misTicketsStats.noData")}</p>
                  </div>
                )}
                {perf.general ? (
                  <div className="mis-stats-panel">
                    <h4 className="mis-stats-panel__subtitle mis-stats-panel__subtitle--cyan">
                      {t("misTicketsStats.generalPerf")}
                    </h4>
                    <div className="mis-stats-mini-metrics">
                      <div>
                        <span>{t("misTicketsStats.totalPointsProm")}</span>
                        <strong>{perf.general.totalPoints}</strong>
                      </div>
                      <div>
                        <span>{t("misTicketsStats.avgPos")}</span>
                        <strong>{perf.general.avgPos}</strong>
                      </div>
                      <div>
                        <span>{t("misTicketsStats.avgPoints")}</span>
                        <strong>{perf.general.avgPoints}</strong>
                      </div>
                      <div>
                        <span>{t("misTicketsStats.accuracyProm")}</span>
                        <strong>{perf.general.accuracy}</strong>
                      </div>
                    </div>
                    <p className="mis-stats-chart-label">{t("misTicketsStats.avgEvolution")}</p>
                    {perf.general.evolution.length > 1 ? (
                      <EvolutionLineChart color="#06b6d4" values={perf.general.evolution} />
                    ) : (
                      <p className="mis-stats-empty mis-stats-empty--inline">{t("misTicketsStats.noData")}</p>
                    )}
                    <div className="mis-stats-bottom-widgets">
                      <div className="mis-stats-widget-col">
                        <p className="mis-stats-widget-title">{t("misTicketsStats.topOptions")}</p>
                        {perf.general.horseOptions.length ? (
                          <ul className="mis-stats-widget-list">
                            {perf.general.horseOptions.map((o) => (
                              <li key={o.name}>
                                <span>{o.name}</span>
                                <span>{o.pct}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mis-stats-empty mis-stats-empty--inline">{t("misTicketsStats.noData")}</p>
                        )}
                      </div>
                      <div className="mis-stats-widget-col mis-stats-widget-col--chart">
                        <p className="mis-stats-widget-title">{t("misTicketsStats.generalDistribution")}</p>
                        {perf.general.distribution.length ? (
                          <MiniDistributionDonut segments={perf.general.distribution} />
                        ) : (
                          <p className="mis-stats-empty mis-stats-empty--inline">{t("misTicketsStats.noData")}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mis-stats-panel">
                    <p className="mis-stats-empty">{t("misTicketsStats.noData")}</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </>
  );
}
