"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Flame,
  Medal,
  Crown,
  MessageCircle,
  Activity,
} from "lucide-react";
import GlobalLeaderboardChat from "@/frontend/components/leaderboard/GlobalLeaderboardChat";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AppPageHeader from "@/frontend/components/layout/AppPageHeader";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { useRankingUpdates } from "@/frontend/contexts/RankingUpdatesContext";
import { fetchJson } from "@/frontend/lib/api/client";
import { getModality, getModalityBadgeClasses, gameModeToModalityId } from "@/frontend/lib/gameModalities";
import {
  leaderboardAsset,
  leaderboardPodiumAsset,
} from "@/frontend/lib/config/leaderboardAssets";

function getModeFilterMeta(gameMode) {
  const mod = getModality(gameModeToModalityId(gameMode));
  const badge = getModalityBadgeClasses(gameMode);
  return { label: badge.label, className: badge.className, available: mod.available };
}

const LEADERBOARD_POLL_MS = 12000;

const ROWS_PER_PAGE = 10;

function ModeBadge({ gameMode, isGuest = false }) {
  const { className, label } = getModalityBadgeClasses(gameMode, isGuest);
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide border ${className}`}
    >
      {label}
    </span>
  );
}

function getRankColor(rank) {
  if (rank === 1) return { bg: "from-yellow-500/20 to-yellow-600/5", border: "border-yellow-500/30", glow: "shadow-[0_0_30px_rgba(245,158,11,0.3)]", text: "text-yellow-400" };
  if (rank === 2) return { bg: "from-slate-400/20 to-slate-500/5", border: "border-slate-400/30", glow: "shadow-[0_0_30px_rgba(148,163,184,0.3)]", text: "text-slate-300" };
  if (rank === 3) return { bg: "from-amber-700/20 to-amber-800/5", border: "border-amber-700/30", glow: "shadow-[0_0_30px_rgba(217,119,6,0.25)]", text: "text-amber-600" };
  return { bg: "", border: "border-white/5", glow: "", text: "text-zinc-400" };
}

function RankBadge({ rank }) {
  if (rank === 1) return <span className="text-lg">&#x1F947;</span>;
  if (rank === 2) return <span className="text-lg">&#x1F948;</span>;
  if (rank === 3) return <span className="text-lg">&#x1F949;</span>;
  return <span className="text-sm text-zinc-500 font-mono w-6 text-center">#{rank}</span>;
}

function SkeletonRow({ index }) {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-4 px-4 sm:px-6 py-4 items-center border-b border-white/[0.03] ${
        index % 2 === 0 ? "bg-white/[0.01]" : "bg-transparent"
      }`}
    >
      <div className="col-span-1">
        <div className="w-6 h-5 rounded bg-white/5 animate-pulse" />
      </div>
      <div className="col-span-1 sm:col-span-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse flex-shrink-0" />
        <div className="w-24 h-4 rounded bg-white/5 animate-pulse" />
      </div>
      <div className="col-span-1 sm:col-span-2 flex justify-end">
        <div className="w-16 h-4 rounded bg-white/5 animate-pulse" />
      </div>
      <div className="col-span-1 sm:col-span-2 flex justify-end">
        <div className="w-10 h-4 rounded bg-white/5 animate-pulse" />
      </div>
      <div className="hidden sm:flex col-span-2 justify-end">
        <div className="w-8 h-4 rounded bg-white/5 animate-pulse" />
      </div>
      <div className="hidden sm:flex col-span-1 justify-end">
        <div className="w-6 h-4 rounded bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}

function SkeletonPodiumCard({ isFirst }) {
  return (
    <div
      className={`relative rounded-2xl border border-white/5 p-6 text-center bg-white/[0.02] backdrop-blur-xl ${
        isFirst ? "sm:py-10" : ""
      }`}
    >
      <div className="text-5xl font-black mb-3 opacity-10 text-zinc-500 animate-pulse">-</div>
      <div className="flex justify-center mb-3">
        <div className="w-16 h-16 rounded-full bg-white/5 animate-pulse" />
      </div>
      <div className="w-24 h-5 rounded bg-white/5 animate-pulse mx-auto mb-2" />
      <div className="w-20 h-7 rounded bg-white/5 animate-pulse mx-auto mb-2" />
      <div className="w-16 h-3 rounded bg-white/5 animate-pulse mx-auto mb-3" />
      <div className="w-14 h-5 rounded-full bg-white/5 animate-pulse mx-auto" />
    </div>
  );
}

export default function LeaderboardPageClient() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { checkGlobalRank } = useRankingUpdates();
  const searchParams = useSearchParams();

  const timeFilters = [
    { key: "daily", label: t("leaderboard.daily") },
    { key: "weekly", label: t("leaderboard.weekly") },
    { key: "monthly", label: t("leaderboard.monthly") },
    { key: "allTime", label: t("leaderboard.allTime") },
  ];

  const [activeFilter, setActiveFilter] = useState("allTime");
  const [activeViewTab, setActiveViewTab] = useState("ranking");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "chat" || tab === "live" || tab === "ranking") {
      setActiveViewTab(tab);
    }
  }, [searchParams]);

  const viewTabs = [
    { key: "ranking", label: t("leaderboard.rankingTab"), icon: Trophy },
    { key: "live", label: t("leaderboard.live"), icon: Activity },
    { key: "chat", label: t("leaderboard.chatTab"), icon: MessageCircle },
  ];

  const heroBg = leaderboardAsset("heroBg");
  const tableHeaderBg = leaderboardAsset("tableHeaderBg");
  const emptyArt = leaderboardAsset("emptyState");
  const [tournamentFilter, setTournamentFilter] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // Mode filter checkboxes: modes 1 and 2 active by default
  const [selectedModes, setSelectedModes] = useState([1, 2]);

  const [players, setPlayers] = useState([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tournaments, setTournaments] = useState([]);
  const [tournamentName, setTournamentName] = useState("");

  // Fetch available tournaments for dropdown
  useEffect(() => {
    async function fetchTournaments() {
      try {
        const data = await fetchJson("/tournaments");
        const list = Array.isArray(data) ? data : data.tournaments || [];
        setTournaments(list);
      } catch (err) {
        console.error("Failed to fetch tournaments:", err);
      }
    }
    fetchTournaments();
  }, []);

  // Fetch leaderboard data based on selected tournament and modes
  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const modesQuery = selectedModes.length > 0 ? `modes=${selectedModes.join(",")}` : "";
      let data;
      if (tournamentFilter === "all") {
        data = await fetchJson(
          `/leaderboard?limit=100${modesQuery ? `&${modesQuery}` : ""}`
        );
      } else {
        data = await fetchJson(
          `/tournaments/${tournamentFilter}/leaderboard${modesQuery ? `?${modesQuery}` : ""}`
        );
      }

      let mapped = [];

      if (tournamentFilter === "all") {
        // Global leaderboard
        const legends = data.legends || [];
        mapped = legends.map((entry) => ({
          rank: entry.rank,
          userId: entry.userId,
          username: entry.username || "Unknown",
          initials: (entry.username || "??").slice(0, 2).toUpperCase(),
          color: entry.avatarColor || "#7c3aed",
          gameMode: entry.gameMode || 2,
          points: entry.totalPoints || 0,
          winRate: entry.winRate || 0,
          streak: entry.bestStreak || 0,
          totalRaces: entry.totalRaces || 0,
          tournamentsPlayed: entry.tournamentsPlayed || 0,
          titles: entry.titles || 0,
          trend: "up",
          change: 0,
        }));
        setTotalPlayers(data.total || mapped.length);
        setTournamentName("");
      } else {
        // Tournament-specific leaderboard
        const entries = data.leaderboard || data.ticketEntries || [];
        mapped = entries.map((entry) => ({
          rank: entry.rank,
          userId: entry.userId,
          username: entry.username || "Unknown",
          ticketNumber: entry.ticketNumber,
          displayName: entry.ticketNumber
            ? `${entry.username || "Unknown"} · T${entry.ticketNumber}`
            : entry.username || "Unknown",
          initials: (entry.username || "??").slice(0, 2).toUpperCase(),
          color: entry.avatarColor || "#7c3aed",
          gameMode: entry.gameMode || 2,
          points: entry.totalPoints || 0,
          winRate: 0,
          streak: entry.bestStreak || 0,
          racesPlayed: entry.racesPlayed || 0,
          winStreak: entry.winStreak || 0,
          trend: entry.rankChange > 0 ? "up" : entry.rankChange < 0 ? "down" : "up",
          change: entry.rankChange || 0,
        }));
        setTotalPlayers(mapped.length);
        setTournamentName(data.tournamentName || "");
      }

      setPlayers(mapped);

      if (isAuthenticated && user?.id && tournamentFilter === "all") {
        const me = mapped.find((p) => p.userId === user.id);
        if (me?.rank) {
          const racesWithGain = mapped.filter(
            (p) => p.userId === user.id && p.change > 0
          ).length;
          checkGlobalRank(me.rank, {
            racesWithGain: racesWithGain || (me.change > 0 ? 1 : 2),
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      setPlayers([]);
      setTotalPlayers(0);
    } finally {
      setLoading(false);
    }
  }, [tournamentFilter, selectedModes, isAuthenticated, user?.id, checkGlobalRank]);

  useEffect(() => {
    setCurrentPage(1);
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    const id = setInterval(() => {
      if (tournamentFilter === "all") fetchLeaderboard();
    }, LEADERBOARD_POLL_MS);
    return () => clearInterval(id);
  }, [fetchLeaderboard, tournamentFilter]);

  const top3 = players.slice(0, 3);
  const totalPages = Math.max(1, Math.ceil(players.length / ROWS_PER_PAGE));
  const paginatedPlayers = players.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  // Build tournament dropdown label
  const getSelectedTournamentLabel = () => {
    if (tournamentFilter === "all") return t("leaderboard.allTournaments");
    const found = tournaments.find((t) => t.slug === tournamentFilter);
    return found ? found.name : tournamentName || tournamentFilter;
  };

  return (
    <div className="leaderboard-page">
        <section
          className="leaderboard-page__hero"
          style={heroBg ? { backgroundImage: `url(${heroBg})` } : undefined}
        >
          <div className="leaderboard-page__hero-inner">
            <AppPageHeader title={t("leaderboard.title")} subtitle={t("leaderboard.subtitle")} />
            <div className="leaderboard-page__stats">
              <span className="leaderboard-page__stat">
                <Trophy className="w-3.5 h-3.5 text-yellow-400" aria-hidden />
                <strong>{loading ? "—" : totalPlayers.toLocaleString()}</strong> {t("leaderboard.players")}
              </span>
              <span className="leaderboard-page__stat">
                <Medal className="w-3.5 h-3.5 text-purple-400" aria-hidden />
                {getSelectedTournamentLabel()}
              </span>
            </div>
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="leaderboard-page__toolbar"
        >
          <div className="leaderboard-page__time-filters">
            {timeFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => { setActiveFilter(filter.key); setCurrentPage(1); }}
                className={`leaderboard-page__time-btn ${
                  activeFilter === filter.key ? "leaderboard-page__time-btn--active" : ""
                }`}
              >
                {activeFilter === filter.key && (
                  <motion.div
                    layoutId="activeTimeFilter"
                    className="leaderboard-page__time-btn-pill"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{filter.label}</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="leaderboard-page__tournament-btn"
            >
              {getSelectedTournamentLabel()}
              <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#1a1a2e] border border-white/10 shadow-xl shadow-black/40 overflow-hidden z-50 max-h-72 overflow-y-auto"
                >
                  <button
                    onClick={() => { setTournamentFilter("all"); setShowDropdown(false); }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      tournamentFilter === "all"
                        ? "bg-purple/20 text-purple-light"
                        : "text-zinc-300 hover:bg-white/5"
                    }`}
                  >
                    {t("leaderboard.allTournaments")}
                  </button>
                  {tournaments.map((tournament) => (
                    <button
                      key={tournament.slug}
                      onClick={() => { setTournamentFilter(tournament.slug); setShowDropdown(false); }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                        tournamentFilter === tournament.slug
                          ? "bg-purple/20 text-purple-light"
                          : "text-zinc-300 hover:bg-white/5"
                      }`}
                    >
                      {tournament.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="leaderboard-page__modes"
        >
          <span className="leaderboard-page__modes-label">{t("leaderboard.modeLabel")}</span>
          {[1, 2, 3, 4].map((mode) => {
            const cfg = getModeFilterMeta(mode);
            const isChecked = selectedModes.includes(mode);
            const isAvailable = cfg.available;
            return (
              <label
                key={mode}
                className={`leaderboard-page__mode-chip ${
                  !isAvailable ? "leaderboard-page__mode-chip--disabled" : ""
                } ${isChecked && isAvailable ? `leaderboard-page__mode-chip--active border ${cfg.className}` : ""}`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={!isAvailable}
                  onChange={() => {
                    if (!isAvailable) return;
                    setSelectedModes((prev) =>
                      prev.includes(mode)
                        ? prev.filter((m) => m !== mode)
                        : [...prev, mode]
                    );
                    setCurrentPage(1);
                  }}
                  className="sr-only"
                />
                <span
                  className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center flex-shrink-0 ${
                    isChecked && isAvailable ? "border-current bg-current/20" : "border-white/20"
                  }`}
                >
                  {isChecked && isAvailable && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className={`text-xs font-bold tracking-wide ${isAvailable ? "" : "text-zinc-600"}`}>
                  {cfg.label}
                </span>
                {!isAvailable && (
                  <span className="text-[10px] text-zinc-600 font-medium">{t("leaderboard.comingSoon")}</span>
                )}
              </label>
            );
          })}
        </motion.div>

        <div className="leaderboard-page__view-tabs">
          {viewTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveViewTab(tab.key)}
              className={`leaderboard-page__view-tab ${
                activeViewTab === tab.key ? "leaderboard-page__view-tab--active" : ""
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeViewTab === "chat" ? (
          <div className="leaderboard-chat-panel">
            <GlobalLeaderboardChat variant="leaderboard" />
          </div>
        ) : null}

        {activeViewTab === "live" ? (
          <div className="glass-card rounded-2xl overflow-hidden mb-12">
            {loading ? (
              <p className="p-8 text-center text-zinc-500 text-sm">Cargando...</p>
            ) : (
              players
                .filter((p) => p.change !== 0 || p.streak > 2)
                .slice(0, 20)
                .map((player) => (
                  <div
                    key={`${player.userId}-${player.ticketNumber || 0}-${player.rank}`}
                    className="px-4 py-3 flex items-center justify-between border-b border-white/5 last:border-0"
                  >
                    <span className="font-semibold text-sm">{player.displayName || player.username}</span>
                    <span className={`text-xs font-bold ${player.change > 0 ? "text-green-400" : "text-red-400"}`}>
                      {player.change > 0 ? `+${player.change}` : player.change}
                    </span>
                  </div>
                ))
            )}
          </div>
        ) : null}

        {activeViewTab === "ranking" ? (
        <>
        <div className="leaderboard-page__podium">
          {loading ? (
            <>
              <div className="order-2 sm:order-1 sm:mt-8">
                <SkeletonPodiumCard isFirst={false} />
              </div>
              <div className="order-1 sm:order-2">
                <SkeletonPodiumCard isFirst={true} />
              </div>
              <div className="order-3 sm:mt-8">
                <SkeletonPodiumCard isFirst={false} />
              </div>
            </>
          ) : top3.length >= 3 ? (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="order-2 sm:order-1 sm:mt-8"
              >
                <PodiumCard player={top3[1]} position={2} t={t} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="order-1 sm:order-2"
              >
                <PodiumCard player={top3[0]} position={1} t={t} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="order-3 sm:mt-8"
              >
                <PodiumCard player={top3[2]} position={3} t={t} />
              </motion.div>
            </>
          ) : top3.length > 0 ? (
            // Fewer than 3 players: show what we have centered
            top3.map((player, i) => (
              <motion.div
                key={player.userId || player.rank}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 * (i + 1) }}
                className={i === 0 ? "sm:col-start-2" : ""}
              >
                <PodiumCard player={player} position={player.rank} t={t} />
              </motion.div>
            ))
          ) : (
            <div className="leaderboard-page__empty sm:col-span-3">
              {emptyArt ? (
                <img src={emptyArt} alt="" className="leaderboard-page__empty-art" />
              ) : null}
              {t("leaderboard.empty")}
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="leaderboard-page__table"
        >
          <div
            className="leaderboard-page__table-head"
            style={tableHeaderBg ? { backgroundImage: `url(${tableHeaderBg})` } : undefined}
          >
            <div className="col-span-1">{t("leaderboard.rank")}</div>
            <div className="col-span-4">{t("leaderboard.player")}</div>
            <div className="col-span-2 text-right">{t("leaderboard.points")}</div>
            <div className="col-span-2 text-right">{t("leaderboard.winRate")}</div>
            <div className="col-span-2 text-right">{t("leaderboard.streak")}</div>
            <div className="col-span-1 text-right">{t("leaderboard.trend")}</div>
          </div>

          {loading ? (
            Array.from({ length: ROWS_PER_PAGE }).map((_, i) => (
              <SkeletonRow key={i} index={i} />
            ))
          ) : paginatedPlayers.length === 0 ? (
            <div className="leaderboard-page__empty">{t("leaderboard.noPlayers")}</div>
          ) : (
            paginatedPlayers.map((player, index) => (
              <Link
                key={player.userId || player.rank}
                href={player.userId ? `/profile/${player.userId}` : "#"}
                className={`leaderboard-page__row group ${
                  index % 2 === 0 ? "leaderboard-page__row--alt" : ""
                }`}
              >
                <div className="col-span-1 flex items-center gap-2 sm:gap-0">
                  <span className={player.rank <= 3 ? "leaderboard-page__row-rank--top" : ""}>
                    <RankBadge rank={player.rank} />
                  </span>
                </div>

                <div className="col-span-1 sm:col-span-4 flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ring-2 ring-white/10 group-hover:ring-purple/30 transition-all"
                    style={{ backgroundColor: player.color + "25", color: player.color }}
                  >
                    {player.initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-sm text-zinc-200 group-hover:text-white transition-colors truncate">
                      {player.displayName || player.username}
                    </span>
                    <ModeBadge gameMode={player.gameMode} />
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2 text-right">
                  <span className="text-sm sm:text-base leaderboard-page__points">
                    {player.points.toLocaleString()}
                  </span>
                  <span className="text-xs text-zinc-600 ml-1 hidden sm:inline">{t("common.pts")}</span>
                </div>

                <div className="col-span-1 sm:col-span-2 text-right">
                  <span className="text-sm text-zinc-300">{player.winRate}%</span>
                </div>

                <div className="hidden sm:flex col-span-2 justify-end items-center gap-1">
                  {player.streak > 0 ? (
                    <>
                      <StreakIcon />
                      <span className="text-sm font-medium text-orange-400">{player.streak}</span>
                    </>
                  ) : (
                    <span className="text-sm text-zinc-600">-</span>
                  )}
                </div>

                <div className="hidden sm:flex col-span-1 justify-end items-center gap-1">
                  {player.trend === "up" ? (
                    <div className="flex items-center gap-0.5 text-emerald-400">
                      <TrendingUp className="w-4 h-4" />
                      {player.change > 0 && <span className="text-xs">+{player.change}</span>}
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 text-red-400">
                      <TrendingDown className="w-4 h-4" />
                      {player.change > 0 && <span className="text-xs">-{player.change}</span>}
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}

          <div className="leaderboard-page__footer">
            <p className="text-xs text-zinc-500">
              {loading ? (
                <span className="inline-block w-32 h-3 rounded bg-white/5 animate-pulse" />
              ) : players.length > 0 ? (
                <>
                  {t("leaderboard.showing")} {(currentPage - 1) * ROWS_PER_PAGE + 1}-{Math.min(currentPage * ROWS_PER_PAGE, players.length)} {t("leaderboard.of")} {totalPlayers} {t("leaderboard.players")}
                </>
              ) : (
                <>
                  {t("leaderboard.showing")} 0 {t("leaderboard.of")} 0 {t("leaderboard.players")}
                </>
              )}
            </p>
            <div className="leaderboard-page__pagination">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="leaderboard-page__page-btn"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`leaderboard-page__page-btn ${
                    currentPage === page ? "leaderboard-page__page-btn--active" : ""
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="leaderboard-page__page-btn"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
        </>
        ) : null}
    </div>
  );
}

function StreakIcon() {
  const src = leaderboardAsset("streakFlame");
  if (src) {
    return <img src={src} alt="" className="w-5 h-5 object-contain" />;
  }
  return <Flame className="w-4 h-4 text-orange-400" aria-hidden />;
}

function PodiumCard({ player, position, t }) {
  const colors = getRankColor(position);
  const podiumBg = leaderboardPodiumAsset(position);
  const crownSrc = leaderboardAsset("crownGlow");
  const isFirst = position === 1;

  return (
    <div className={`leaderboard-podium-card leaderboard-podium-card--${position}`}>
      {podiumBg ? (
        <div
          className="leaderboard-podium-card__bg"
          style={{ backgroundImage: `url(${podiumBg})` }}
          aria-hidden
        />
      ) : null}
      <div className="leaderboard-podium-card__scrim" aria-hidden />

      {isFirst && (
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-2 left-1/2 -translate-x-1/2 z-10"
        >
          {crownSrc ? (
            <img src={crownSrc} alt="" className="leaderboard-podium-card__crown" />
          ) : (
            <Crown className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
          )}
        </motion.div>
      )}

      <div className="leaderboard-podium-card__content">
        <div className={`leaderboard-podium-card__rank ${colors.text}`}>{position}</div>

        <div
          className="leaderboard-podium-card__avatar"
          style={{ backgroundColor: player.color + "30", color: player.color }}
        >
          {player.initials}
        </div>

        <h3 className="font-bold text-lg text-white mb-1">{player.displayName || player.username}</h3>
        <div className="flex justify-center mb-2">
          <ModeBadge gameMode={player.gameMode} />
        </div>

        <p className="text-2xl font-black leaderboard-page__points mb-2">
          {player.points.toLocaleString()}
        </p>
        <p className="text-xs text-zinc-500 mb-3">{t("leaderboard.totalPoints")}</p>

        <div className="flex items-center justify-center gap-1">
          {player.trend === "up" ? (
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium px-2 py-1 rounded-full bg-emerald-400/10">
              <TrendingUp className="w-3 h-3" />
              {t("leaderboard.rising")}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-400 text-xs font-medium px-2 py-1 rounded-full bg-red-400/10">
              <TrendingDown className="w-3 h-3" />
              {t("leaderboard.falling")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
