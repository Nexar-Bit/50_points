"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, User, Trophy, Calendar, MapPin } from "lucide-react";
import { logoAsset } from "@/frontend/lib/config/paths";
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

const TABS = [
  { id: "personal", icon: User },
  { id: "race", icon: HorseHeadIcon },
  { id: "tournament", icon: Trophy },
];

const DEMO_PERSONAL_DONUT = [
  { label: "Pura Sangre", pts: 15, value: 30, color: "#a855f7" },
  { label: "Black Beauty", pts: 10, value: 20, color: "#06b6d4" },
  { label: "Thunder Bolt", pts: 10, value: 20, color: "#f59e0b" },
  { label: "Speed King", pts: 8, value: 16, color: "#ef4444" },
  { label: "Golden Arrow", pts: 5, value: 10, color: "#eab308" },
  { label: "Otros", pts: 2, value: 4, color: "#64748b" },
];

const DEMO_GENERAL_DONUT = [
  { label: "Pura Sangre", value: 28, color: "#a855f7" },
  { label: "Black Beauty", value: 22, color: "#06b6d4" },
  { label: "Thunder Bolt", value: 18, color: "#f59e0b" },
  { label: "Speed King", value: 15, color: "#ef4444" },
  { label: "Golden Arrow", value: 10, color: "#eab308" },
  { label: "Otros", value: 7, color: "#64748b" },
];

const HORSE_COLORS = {
  "Pura Sangre": "#a855f7",
  "Black Beauty": "#06b6d4",
  "Thunder Bolt": "#f59e0b",
  "Speed King": "#ef4444",
  "Golden Arrow": "#eab308",
};

const DEMO_PERSONAL_TABLE = [
  { pos: "1°", horse: "Pura Sangre", pts: "18.5", highlight: false, color: HORSE_COLORS["Pura Sangre"] },
  { pos: "2°", horse: "Speed King", pts: "12.0", highlight: true, color: HORSE_COLORS["Speed King"] },
  { pos: "3°", horse: "Thunder Bolt", pts: "8.5", highlight: false, color: HORSE_COLORS["Thunder Bolt"] },
  { pos: "4°", horse: "Black Beauty", pts: "5.0", highlight: false, color: HORSE_COLORS["Black Beauty"] },
  { pos: "5°", horse: "Golden Arrow", pts: "2.0", highlight: false, color: HORSE_COLORS["Golden Arrow"] },
];

const DEMO_GENERAL_TABLE = [
  { pos: "1°", horse: "Pura Sangre", pts: "15.2", color: HORSE_COLORS["Pura Sangre"] },
  { pos: "2°", horse: "Speed King", pts: "11.8", color: HORSE_COLORS["Speed King"] },
  { pos: "3°", horse: "Thunder Bolt", pts: "9.1", color: HORSE_COLORS["Thunder Bolt"] },
  { pos: "4°", horse: "Black Beauty", pts: "7.5", color: HORSE_COLORS["Black Beauty"] },
  { pos: "5°", horse: "Golden Arrow", pts: "4.2", color: HORSE_COLORS["Golden Arrow"] },
];

const DEMO_BEST_OPTIONS = [
  { name: "Pura Sangre", pct: "32%" },
  { name: "Thunder Bolt", pct: "24%" },
  { name: "Speed King", pct: "18%" },
];

const DEMO_DIST_SEGMENTS = [
  { label: "Favoritos", value: 42, color: "#a855f7" },
  { label: "Segundos", value: 28, color: "#06b6d4" },
  { label: "Terceros", value: 18, color: "#f59e0b" },
  { label: "Largos", value: 12, color: "#64748b" },
];

const METRIC_DEMO = {
  personal: {
    pointsPlayed: 12450,
    pointsPlayedDelta: "+27.5%",
    pointsWon: 15870,
    pointsWonDelta: "+35.2%",
    profitability: "+27.5%",
    bestPosition: "3°",
    bestPositionSub: "de 1,248 jugadores",
    linePurple: [30, 42, 38, 50, 55, 52, 62],
    donutPct: 38,
  },
  race: {
    racesPlayed: 24,
    racesPlayedDelta: "+3",
    accuracy: "68%",
    accuracyDelta: "+12%",
    avgPoints: 1984,
    avgPointsDelta: "+21.3%",
    bestRace: "Carrera 8",
    bestRacePts: "2,450 pts",
    bestRaceTrack: "Gulfstream Park",
    lineGreen: [18, 22, 28, 32, 36, 40, 44],
    donutPct: 68,
  },
  tournament: {
    position: "8°",
    positionSub: "de 1,248 jugadores",
    totalPoints: 15870,
    totalPointsDelta: "+27.5%",
    distributed: "2,457,750",
    distributedDelta: "+18.6%",
    leader: "Pedro17",
    leaderPts: "28,450 pts",
    lineOrange: [40, 38, 42, 45, 48, 50, 52],
    donutPct: 42,
  },
};

function formatNum(n) {
  if (n == null) return "—";
  return Number(n).toLocaleString("es-ES");
}

function buildDonutFromApi(horses, totalPoints = 50) {
  const top = (horses || []).slice(0, 6);
  if (!top.length) return null;
  const sum = top.reduce((s, h) => s + h.plays, 0) || 1;
  const colors = ["#a855f7", "#06b6d4", "#f59e0b", "#ef4444", "#eab308", "#64748b"];
  return top.map((h, i) => ({
    label: h.name,
    value: Math.round((h.plays / sum) * 100),
    color: colors[i % colors.length],
    pts: Math.round((h.plays / sum) * totalPoints),
  }));
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

function PersonalMetrics({ t }) {
  const d = METRIC_DEMO.personal;
  return (
    <div className="mis-stats-metrics">
      <MetricCard theme="purple" label={t("misTicketsStats.pointsPlayed")} value={formatNum(d.pointsPlayed)} delta={d.pointsPlayedDelta} deltaGreen footer={<MiniLineChart color="#a855f7" points={d.linePurple} />} />
      <MetricCard theme="purple" label={t("misTicketsStats.pointsWon")} value={formatNum(d.pointsWon)} delta={d.pointsWonDelta} deltaGreen footer={<MiniLineChart color="#a855f7" points={d.linePurple} />} />
      <MetricCard theme="purple" label={t("misTicketsStats.profitability")} value={d.profitability} footer={<><p className="mis-stats-metric__sub">{t("misTicketsStats.onInvested")}</p><MiniDonutChart color="#a855f7" percent={d.donutPct} /></>} />
      <MetricCard theme="purple" label={t("misTicketsStats.bestPosition")} value={<span className="mis-stats-metric__trophy-row"><span>🏆</span>{d.bestPosition}</span>} footer={<p className="mis-stats-metric__sub">{d.bestPositionSub}</p>} />
    </div>
  );
}

function RaceMetrics({ t }) {
  const d = METRIC_DEMO.race;
  return (
    <div className="mis-stats-metrics mis-stats-metrics--race-summary">
      <MetricCard theme="green" label={t("misTicketsStats.racesPlayed")} value={d.racesPlayed} delta={d.racesPlayedDelta} deltaGreen footer={<MiniLineChart color="#22c55e" points={d.lineGreen} />} />
      <MetricCard theme="green" label={t("misTicketsStats.accuracy")} value={d.accuracy} delta={d.accuracyDelta} deltaGreen footer={<MiniDonutChart color="#22c55e" percent={d.donutPct} />} />
      <MetricCard theme="green" label={t("misTicketsStats.avgPerRace")} value={formatNum(d.avgPoints)} delta={d.avgPointsDelta} deltaGreen footer={<MiniLineChart color="#22c55e" points={d.lineGreen} />} />
      <MetricCard theme="green" label={t("misTicketsStats.bestRace")} value={d.bestRace} footer={<><p className="mis-stats-metric__value-sm text-emerald-400">{d.bestRacePts}</p><p className="mis-stats-metric__sub">{d.bestRaceTrack}</p></>} />
    </div>
  );
}

function TournamentMetrics({ t }) {
  const d = METRIC_DEMO.tournament;
  return (
    <div className="mis-stats-metrics">
      <MetricCard theme="orange" label={t("misTicketsStats.currentPosition")} value={d.position} footer={<><p className="mis-stats-metric__sub">{d.positionSub}</p><MiniLineChart color="#f59e0b" points={d.lineOrange} /></>} />
      <MetricCard theme="orange" label={t("misTicketsStats.totalPoints")} value={formatNum(d.totalPoints)} delta={d.totalPointsDelta} footer={<MiniDonutChart color="#f59e0b" percent={d.donutPct} />} />
      <MetricCard theme="orange" label={t("misTicketsStats.pointsDistributed")} value={formatNum(d.distributed)} delta={d.distributedDelta} deltaGreen footer={<MiniLineChart color="#f59e0b" points={d.lineOrange} />} />
      <MetricCard theme="orange" label={t("misTicketsStats.tournamentLeader")} value={d.leader} footer={<p className="mis-stats-metric__value-sm text-amber-400">{d.leaderPts}</p>} />
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
    if (!selectedTournament?.slug) return;
    fetchJson(`/tournaments/${encodeURIComponent(selectedTournament.slug)}`)
      .then((data) => {
        const list = data.tournament?.races || data.races || [];
        setRaces(list);
        const r2 = list.find((r) => r.raceNumber === 2) || list[0];
        if (r2) setSelectedRaceId(r2.id);
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
      }
    } catch {
      /* demo data */
    }
  }, [selectedRaceId, isAuthenticated]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const personalDonut = useMemo(
    () => buildDonutFromApi(raceStats?.personal?.topHorses) || DEMO_PERSONAL_DONUT,
    [raceStats]
  );
  const generalDonut = useMemo(
    () => buildDonutFromApi(raceStats?.topHorses)?.map((s) => ({ ...s, pts: undefined })) || DEMO_GENERAL_DONUT,
    [raceStats]
  );

  const selectedRace = races.find((r) => r.id === selectedRaceId);
  const raceNum = selectedRace?.raceNumber ?? 2;
  const totalRaces = races.length || 8;
  const raceLabels = useMemo(() => {
    const list = races.length
      ? races
      : Array.from({ length: 8 }, (_, i) => ({ raceNumber: i + 1 }));
    return list.map((r) => `${t("misTicketsStats.race")} ${r.raceNumber}`);
  }, [races, t]);
  const evolutionValues = Array.from({ length: totalRaces }, (_, i) => 20 + i * 8 + (i === 1 ? 12 : 0));

  return (
    <div className="mis-stats-page">
      <div className="mis-stats-container">
        <header className="mis-stats-header">
          <div className="mis-stats-header__brand">
            <Image
              src={logoAsset()}
              alt="50 POINTS"
              width={44}
              height={44}
              className="mis-stats-header__logo"
              priority
            />
            <h1 className="mis-stats-header__title">{t("misTicketsStats.pageTitle")}</h1>
          </div>
          <div className="mis-stats-filters">
            <div className="mis-stats-filter">
              <Trophy className="w-4 h-4 opacity-50" />
              <select
                value={selectedTournament?.id ?? ""}
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
              <ChevronDown className="w-4 h-4 opacity-50" />
            </div>
            <div className="mis-stats-filter">
              <Calendar className="w-4 h-4 opacity-50" />
              <span>18/05/2024</span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </div>
            <div className="mis-stats-filter">
              <MapPin className="w-4 h-4 opacity-50" />
              <span>{selectedTournament?.track || "Gulfstream Park"}</span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </div>
          </div>
        </header>

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

        {activeTab === "personal" && <PersonalMetrics t={t} />}
        {activeTab === "tournament" && <TournamentMetrics t={t} />}

        {activeTab === "race" && (
          <>
            <RaceMetrics t={t} />

            <div className="mis-stats-deep">
              <section className="mis-stats-section">
                <h2 className="mis-stats-section__title">
                  <span className="mis-stats-section__num">1</span>
                  {t("misTicketsStats.selectRace")}
                </h2>
                <div className="mis-stats-race-pills">
                  {(races.length ? races : Array.from({ length: 8 }, (_, i) => ({ id: i + 1, raceNumber: i + 1 }))).map(
                    (race) => (
                      <button
                        key={race.id}
                        type="button"
                        className={`mis-stats-race-pill${selectedRaceId === race.id || (!races.length && race.raceNumber === 2) ? " mis-stats-race-pill--active" : ""}`}
                        onClick={() => race.id && setSelectedRaceId(race.id)}
                      >
                        {t("misTicketsStats.race")} {race.raceNumber}
                      </button>
                    )
                  )}
                </div>
              </section>

              <section className="mis-stats-section">
                <div className="mis-stats-donut-grid">
                  <div className="mis-stats-panel">
                    <h3 className="mis-stats-panel__title">{t("misTicketsStats.donutPersonal")}</h3>
                    <div className="mis-stats-panel__body">
                      <ul className="mis-stats-legend">
                        {personalDonut.map((s) => (
                          <li key={s.label}>
                            <span className="mis-stats-legend__swatch" style={{ background: s.color }} />
                            <span className="mis-stats-legend__name">{s.label}</span>
                            <span className="mis-stats-legend__pts">{s.pts ?? s.value} pts</span>
                          </li>
                        ))}
                      </ul>
                      <DonutDistribution segments={personalDonut} centerLabel="50" centerSub={t("misTicketsStats.points")} />
                    </div>
                  </div>
                  <div className="mis-stats-panel">
                    <h3 className="mis-stats-panel__title">{t("misTicketsStats.donutGeneral")}</h3>
                    <div className="mis-stats-panel__body">
                      <ul className="mis-stats-legend">
                        {generalDonut.map((s) => (
                          <li key={s.label}>
                            <span className="mis-stats-legend__swatch" style={{ background: s.color }} />
                            <span className="mis-stats-legend__name">{s.label}</span>
                            <span className="mis-stats-legend__pts">{s.value}%</span>
                          </li>
                        ))}
                      </ul>
                      <DonutDistribution segments={generalDonut} centerLabel="100%" centerSub={t("misTicketsStats.ofTotal")} />
                    </div>
                  </div>
                </div>
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
                    <p className="mis-stats-result__big">+18.5 {t("misTicketsStats.pointsWonLabel")}</p>
                    <p className="mis-stats-result__meta">{t("misTicketsStats.positionGot")}: 2°</p>
                    <p className="mis-stats-result__meta">{t("misTicketsStats.winnerHorse")}: Pura Sangre (2)</p>
                    <table className="mis-stats-table">
                      <thead>
                        <tr>
                          <th>POS</th>
                          <th>{t("misTicketsStats.horse")}</th>
                          <th>{t("misTicketsStats.pointsLabel")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {DEMO_PERSONAL_TABLE.map((row) => (
                          <tr key={row.pos} className={row.highlight ? "mis-stats-table__row--highlight" : ""}>
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
                  </div>
                  <div className="mis-stats-panel mis-stats-panel--result">
                    <p className="mis-stats-result__eyebrow">
                      <span className="mis-stats-result__icon">👥</span>
                      {t("misTicketsStats.generalResult")}
                    </p>
                    <p className="mis-stats-result__big">+12.3 {t("misTicketsStats.avgPointsLabel")}</p>
                    <p className="mis-stats-result__meta">{t("misTicketsStats.avgPosition")}: 2.8°</p>
                    <p className="mis-stats-result__meta">{t("misTicketsStats.topWinner")}: Pura Sangre (2)</p>
                    <table className="mis-stats-table">
                      <thead>
                        <tr>
                          <th>POS</th>
                          <th>{t("misTicketsStats.horse")}</th>
                          <th>{t("misTicketsStats.avg")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {DEMO_GENERAL_TABLE.map((row) => (
                          <tr key={row.pos}>
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
                  </div>
                </div>
              </section>

              <section className="mis-stats-section mis-stats-section--last">
                <h2 className="mis-stats-section__title">
                  <span className="mis-stats-section__num">4</span>
                  {t("misTicketsStats.tournamentPerf")} ({raceNum} {t("misTicketsStats.of")} {totalRaces})
                </h2>
                <div className="mis-stats-perf-grid">
                  <div className="mis-stats-panel">
                    <h4 className="mis-stats-panel__subtitle mis-stats-panel__subtitle--purple">
                      {t("misTicketsStats.yourPerf")}
                    </h4>
                    <div className="mis-stats-mini-metrics">
                      <div><span>{t("misTicketsStats.totalPoints")}</span><strong>{personalStats?.totalPoints ?? "68.5"}</strong></div>
                      <div><span>{t("misTicketsStats.generalPos")}</span><strong>4°</strong></div>
                      <div><span>{t("misTicketsStats.avgPoints")}</span><strong>34.3</strong></div>
                      <div><span>{t("misTicketsStats.hitRate")}</span><strong>63%</strong></div>
                    </div>
                    <p className="mis-stats-chart-label">{t("misTicketsStats.pointsEvolution")}</p>
                    <EvolutionLineChart color="#a855f7" labels={raceLabels} values={evolutionValues} />
                    <div className="mis-stats-bottom-widgets">
                      <div className="mis-stats-widget-col">
                        <p className="mis-stats-widget-title">{t("misTicketsStats.bestOptions")}</p>
                        <ul className="mis-stats-widget-list">
                          {DEMO_BEST_OPTIONS.map((o) => (
                            <li key={o.name}><span>{o.name}</span><span>{o.pct}</span></li>
                          ))}
                        </ul>
                      </div>
                      <div className="mis-stats-widget-col mis-stats-widget-col--chart">
                        <p className="mis-stats-widget-title">{t("misTicketsStats.pointsDistribution")}</p>
                        <MiniDistributionDonut segments={DEMO_DIST_SEGMENTS} />
                      </div>
                    </div>
                  </div>
                  <div className="mis-stats-panel">
                    <h4 className="mis-stats-panel__subtitle mis-stats-panel__subtitle--cyan">
                      {t("misTicketsStats.generalPerf")}
                    </h4>
                    <div className="mis-stats-mini-metrics">
                      <div><span>{t("misTicketsStats.totalPointsProm")}</span><strong>46.2</strong></div>
                      <div><span>{t("misTicketsStats.avgPos")}</span><strong>6.3°</strong></div>
                      <div><span>{t("misTicketsStats.avgPoints")}</span><strong>23.1</strong></div>
                      <div><span>{t("misTicketsStats.accuracyProm")}</span><strong>48%</strong></div>
                    </div>
                    <p className="mis-stats-chart-label">{t("misTicketsStats.avgEvolution")}</p>
                    <EvolutionLineChart color="#06b6d4" labels={raceLabels} values={evolutionValues.map((v) => v * 0.68)} dashed />
                    <div className="mis-stats-bottom-widgets">
                      <div className="mis-stats-widget-col">
                        <p className="mis-stats-widget-title">{t("misTicketsStats.topOptions")}</p>
                        <ul className="mis-stats-widget-list">
                          {DEMO_BEST_OPTIONS.map((o) => (
                            <li key={o.name}><span>{o.name}</span><span>{o.pct}</span></li>
                          ))}
                        </ul>
                      </div>
                      <div className="mis-stats-widget-col mis-stats-widget-col--chart">
                        <p className="mis-stats-widget-title">{t("misTicketsStats.generalDistribution")}</p>
                        <MiniDistributionDonut segments={DEMO_DIST_SEGMENTS} />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
