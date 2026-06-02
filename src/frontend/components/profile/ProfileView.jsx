"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Flame,
  Target,
  TrendingUp,
  Calendar,
  MapPin,
  Edit3,
  ArrowLeft,
  Lock,
  Award,
  Zap,
  Star,
  Shield,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { fetchAuthJson, fetchJson } from "@/frontend/lib/api/client";
import { useAchievementCards } from "@/frontend/contexts/AchievementCardsContext";
import AchievementGallery from "@/frontend/components/profile/AchievementGallery";
import TournamentRankingTabs from "@/frontend/components/profile/TournamentRankingTabs";
import PlayerTicketsPanel from "@/frontend/components/profile/PlayerTicketsPanel";

const performanceData = [
  { day: "Mon", points: 320 },
  { day: "Tue", points: 180 },
  { day: "Wed", points: 540 },
  { day: "Thu", points: 410 },
  { day: "Fri", points: 290 },
  { day: "Sat", points: 650 },
  { day: "Sun", points: 480 },
];

const achievements = [
  { id: 1, name: "Primera Victoria", nameEn: "First Win", description: "Gana tu primera seleccion", descEn: "Win your first selection", icon: Star, unlocked: true, color: "#f59e0b", group: "Iniciacion", groupEn: "Beginner" },
  { id: 2, name: "Racha de 5", nameEn: "5 Streak", description: "5 carreras ganadoras seguidas", descEn: "5 winning races in a row", icon: Flame, unlocked: true, color: "#a855f7", group: "Racha", groupEn: "Streak" },
  { id: 3, name: "Top 10 Diario", nameEn: "Daily Top 10", description: "Alcanza el top 10 diario", descEn: "Reach daily top 10", icon: TrendingUp, unlocked: true, color: "#06b6d4", group: "Ranking", groupEn: "Ranking" },
  { id: 4, name: "Full Point Maestro", nameEn: "Full Point Master", description: "3 Full Points consecutivos", descEn: "3 consecutive Full Points", icon: Zap, unlocked: true, color: "#7c3aed", group: "Full Point", groupEn: "Full Point" },
  { id: 5, name: "Smart Pick Pro", nameEn: "Smart Pick Pro", description: "5 Smart Picks consecutivos", descEn: "5 consecutive Smart Picks", icon: Target, unlocked: true, color: "#f59e0b", group: "Smart Pick", groupEn: "Smart Pick" },
  { id: 6, name: "Comeback Kid", nameEn: "Comeback Kid", description: "Sube +20 posiciones en un torneo", descEn: "Climb +20 positions in a tournament", icon: TrendingUp, unlocked: true, color: "#10b981", group: "Comeback", groupEn: "Comeback" },
  { id: 7, name: "Campeon de Torneo", nameEn: "Tournament Champion", description: "Gana un torneo completo", descEn: "Win a full tournament", icon: Crown, unlocked: false, color: "#f59e0b", group: "Dominancia", groupEn: "Dominance" },
  { id: 8, name: "Club 1000 Puntos", nameEn: "1000 Points Club", description: "1000+ puntos en un solo dia", descEn: "1000+ points in a single day", icon: Zap, unlocked: false, color: "#a855f7", group: "Puntos", groupEn: "Points" },
  { id: 9, name: "Seleccion Perfecta", nameEn: "Perfect Selection", description: "Todos clasifican en Smart Pick", descEn: "All place in Smart Pick", icon: Shield, unlocked: false, color: "#06b6d4", group: "Smart Pick", groupEn: "Smart Pick" },
  { id: 10, name: "Rey de Gulfstream", nameEn: "Gulfstream King", description: "Record historico en Gulfstream Park", descEn: "All-time record at Gulfstream Park", icon: Crown, unlocked: false, color: "#f59e0b", group: "Hipodromo", groupEn: "Racetrack" },
  { id: 11, name: "Full Point 50x", nameEn: "Full Point 50x", description: "Full Point con dividendo 50+", descEn: "Full Point with 50+ dividend", icon: Star, unlocked: false, color: "#ef4444", group: "Legendario", groupEn: "Legendary" },
  { id: 12, name: "VIP Hall", nameEn: "VIP Hall", description: "Entra al VIP All-Time", descEn: "Enter VIP All-Time", icon: Award, unlocked: false, color: "#d97706", group: "Mitico", groupEn: "Mythic" },
];

const maxPoints = Math.max(...performanceData.map((d) => d.points));

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProfileView({ userId: viewUserId }) {
  const { language, t } = useLanguage();
  const isEn = language === "en";
  const { user: authUser, isAuthenticated, loading: authLoading } = useAuth();
  const { tryAwardRecordTies } = useAchievementCards();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTournamentId, setActiveTournamentId] = useState(null);

  const resolvedId = viewUserId ? Number(viewUserId) : authUser?.id;
  const isOwnProfile = Boolean(authUser?.id && resolvedId === authUser.id);

  useEffect(() => {
    if (authLoading) return;
    if (!resolvedId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const load = isOwnProfile
      ? fetchAuthJson("/profile")
      : fetchJson(`/profile/public/${resolvedId}`);

    load
      .then((data) => {
        setProfile(data);
        if (isOwnProfile) {
          const pts = data?.user?.stats?.totalPoints;
          if (pts != null) tryAwardRecordTies(pts);
        }
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [resolvedId, isOwnProfile, authLoading, tryAwardRecordTies]);

  const userProfile = useMemo(() => {
    if (!profile?.user) return null;
    const u = profile.user;
    return {
      id: u.id,
      username: u.username,
      initials: u.username?.slice(0, 2).toUpperCase() || "??",
      color: u.avatarColor || "#7c3aed",
      memberSince: u.createdAt
        ? new Date(u.createdAt).toLocaleDateString(isEn ? "en-US" : "es-ES", {
            month: "long",
            year: "numeric",
          })
        : "—",
      location: u.isGuest
        ? isEn
          ? "Guest player"
          : "Jugador invitado"
        : isEn
          ? "Registered"
          : "Registrado",
      globalRank: u.globalRank ?? "—",
      totalPoints: u.stats?.totalPoints ?? 0,
      winRate: Math.round(u.stats?.winRate ?? 0),
      tournamentsPlayed: u.stats?.tournamentsPlayed ?? 0,
      currentStreak: u.stats?.bestStreak ?? 0,
    };
  }, [profile, isEn]);

  const allTickets = profile?.allTickets ?? [];
  const ticketsForPanel = useMemo(() => {
    if (!activeTournamentId) return allTickets;
    return allTickets.filter((tk) => tk.tournamentId === activeTournamentId);
  }, [allTickets, activeTournamentId]);

  const strategyBreakdown = useMemo(() => {
    const empty = {
      count: 0,
      wins: 0,
      winRate: 0,
      totalPoints: 0,
      color: "#7c3aed",
      label: "Full Point",
      best: 0,
    };
    const mapStat = (stat, label, color) => {
      const s = stat || {};
      const count = s.count ?? 0;
      const wins = s.wins ?? 0;
      return {
        count,
        wins,
        totalPoints: s.totalPoints ?? s.points ?? 0,
        best: s.best ?? 0,
        label,
        color,
        winRate: count ? Math.round((wins / count) * 100) : 0,
      };
    };
    const s = profile?.strategyStats;
    if (!s) {
      return {
        full: { ...empty, label: "Full Point" },
        dual: { ...empty, color: "#06b6d4", label: "Dual Point" },
        smart: { ...empty, color: "#f59e0b", label: "Smart Point" },
      };
    }
    return {
      full: mapStat(s.full_point, "Full Point", "#7c3aed"),
      dual: mapStat(s.dual_point, "Dual Point", "#06b6d4"),
      smart: mapStat(s.smart_pick, "Smart Point", "#f59e0b"),
    };
  }, [profile]);

  const circumference = 2 * Math.PI * 36;
  const winRateOffset =
    circumference - ((userProfile?.winRate ?? 0) / 100) * circumference;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-zinc-500">
        {t("profile.loading")}
      </div>
    );
  }

  if (!viewUserId && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-zinc-400">{t("profile.loginToView")}</p>
        <Link href="/login" className="text-purple-light hover:underline">
          {t("nav.login")}
        </Link>
      </div>
    );
  }

  if (!resolvedId || !userProfile) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-zinc-400">{t("profile.notFound")}</p>
        <Link href="/" className="text-purple-light hover:underline">
          {t("profile.backToHome")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-cyan/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 app-page py-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-purple-light transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("profile.backToHome")}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple to-purple-light p-[3px]">
              <div
                className="w-full h-full rounded-full flex items-center justify-center text-2xl font-bold"
                style={{
                  backgroundColor: userProfile.color + "20",
                  color: userProfile.color,
                }}
              >
                {userProfile.initials}
              </div>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mb-2">
              <h1 className="text-3xl font-bold">{userProfile.username}</h1>
              <span className="px-3 py-1 rounded-full bg-purple/15 border border-purple/20 text-purple-light text-xs font-semibold">
                #{userProfile.globalRank} {t("profile.global")}
              </span>
            </div>
            {!isOwnProfile ? (
              <p className="text-xs text-cyan/80 mb-2">{t("profile.viewingPublic")}</p>
            ) : null}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {t("profile.memberSince")} {userProfile.memberSince}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {userProfile.location}
              </span>
            </div>
          </div>

          {isOwnProfile ? (
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-sm text-zinc-300 hover:border-purple/30 hover:text-white transition-all bg-white/[0.02]"
            >
              <Edit3 className="w-4 h-4" />
              {t("profile.editProfile")}
            </button>
          ) : null}
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-purple-light" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                {t("profile.totalPoints")}
              </span>
            </div>
            <p className="text-3xl font-black text-gradient-purple">
              {userProfile.totalPoints.toLocaleString()}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-5 h-5 text-cyan" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                {t("profile.winRate")}
              </span>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="url(#winRateGradient)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={winRateOffset}
                  />
                  <defs>
                    <linearGradient id="winRateGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{userProfile.winRate}%</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                {t("profile.tournaments")}
              </span>
            </div>
            <p className="text-3xl font-black text-white">{userProfile.tournamentsPlayed}</p>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                {t("profile.streak")}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Flame className="w-7 h-7 text-orange-400" />
              <span className="text-3xl font-black text-orange-400">{userProfile.currentStreak}</span>
            </div>
          </motion.div>
        </motion.div>

        {isOwnProfile ? (
          <>
            <TournamentRankingTabs onActiveTournamentChange={setActiveTournamentId} />
            <PlayerTicketsPanel
              tickets={ticketsForPanel}
              tournamentId={activeTournamentId}
            />
          </>
        ) : null}

        <AchievementGallery
          userId={resolvedId}
          cardsFromApi={profile?.achievementCards}
          canOpenCards={isOwnProfile}
        />

        {isOwnProfile ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-card rounded-2xl p-6 mb-10"
            >
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-light" />
                {t("profile.performanceHistory")}
              </h2>
              <div className="flex items-end gap-3 sm:gap-4 h-48">
                {performanceData.map((d, i) => {
                  const heightPct = (d.points / maxPoints) * 100;
                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPct}%` }}
                        transition={{ duration: 0.8, delay: 0.1 * i, ease: "easeOut" }}
                        className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-purple to-purple-light relative group cursor-pointer"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[#1a1a2e] border border-white/10 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {d.points} {t("common.pts")}
                        </div>
                      </motion.div>
                      <span className="text-xs text-zinc-500">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="glass-card rounded-2xl p-6 mb-10"
            >
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan" />
                {t("profile.strategyBreakdown")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(strategyBreakdown).map(([key, strat]) => (
                  <div
                    key={key}
                    className="rounded-xl p-4 border border-white/5 bg-white/[0.02]"
                    style={{ borderLeftWidth: 3, borderLeftColor: strat.color }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-white">{strat.label}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: strat.color + "15", color: strat.color }}
                      >
                        {strat.winRate}% {t("profile.success")}
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-zinc-400">
                        <span>{t("profile.plays")}</span>
                        <span className="text-white font-medium">{strat.count}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>{t("profile.wins")}</span>
                        <span className="text-white font-medium">{strat.wins}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>{t("profile.totalPointsLabel")}</span>
                        <span className="font-bold" style={{ color: strat.color }}>
                          {(strat.totalPoints ?? 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>{t("profile.bestPlay")}</span>
                        <span className="text-emerald-400 font-medium">+{strat.best}</span>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${strat.winRate}%`, backgroundColor: strat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            {t("profile.achievements")}
          </h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500">
              {achievements.filter((a) => a.unlocked).length}/{achievements.length}{" "}
              {t("profile.unlocked")}
            </span>
            <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple to-cyan"
                style={{
                  width: `${(achievements.filter((a) => a.unlocked).length / achievements.length) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} isEn={isEn} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function AchievementBadge({ achievement, isEn }) {
  const Icon = achievement.icon;
  return (
    <motion.div
      whileHover={{
        scale: achievement.unlocked ? 1.04 : 1,
        y: achievement.unlocked ? -2 : 0,
      }}
      className={`relative p-5 rounded-xl text-center transition-all duration-300 ${
        achievement.unlocked
          ? "glass-card cursor-pointer"
          : "bg-white/[0.01] border border-white/[0.03] opacity-50"
      }`}
      style={
        achievement.unlocked ? { boxShadow: `0 0 20px ${achievement.color}15` } : {}
      }
    >
      {!achievement.unlocked && (
        <div className="absolute top-3 right-3">
          <Lock className="w-4 h-4 text-zinc-600" />
        </div>
      )}
      <div
        className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
          achievement.unlocked ? "" : "grayscale"
        }`}
        style={{
          backgroundColor: achievement.unlocked
            ? achievement.color + "20"
            : "rgba(255,255,255,0.03)",
        }}
      >
        <Icon
          className="w-6 h-6"
          style={{ color: achievement.unlocked ? achievement.color : "#3f3f46" }}
        />
      </div>
      <p
        className={`text-[10px] uppercase tracking-wider mb-1 font-medium ${
          achievement.unlocked ? "text-zinc-500" : "text-zinc-700"
        }`}
      >
        {isEn ? achievement.groupEn : achievement.group}
      </p>
      <h3
        className={`text-sm font-bold mb-1 ${
          achievement.unlocked ? "text-white" : "text-zinc-600"
        }`}
      >
        {isEn ? achievement.nameEn : achievement.name}
      </h3>
      <p className={`text-xs ${achievement.unlocked ? "text-zinc-500" : "text-zinc-700"}`}>
        {isEn ? achievement.descEn : achievement.description}
      </p>
    </motion.div>
  );
}
