"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Star,
  Flame,
  Zap,
  Skull,
  Eye,
  ArrowLeft,
  Lock,
  Target,
  TrendingUp,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { fetchJson } from "@/frontend/lib/api/client";
import HallOfFamePodium from "@/frontend/components/hall-of-fame/HallOfFamePodium";

const categoryIcons = {
  fullPoint: Target,
  dualPoint: Shield,
  smartPoint: Zap,
  dominance: Crown,
  comebacks: TrendingUp,
  mythic: Star,
};

const categoryColors = {
  fullPoint: "#7c3aed",
  dualPoint: "#06b6d4",
  smartPoint: "#f59e0b",
  dominance: "#ef4444",
  comebacks: "#10b981",
  mythic: "#fbbf24",
};

const statusConfig = {
  impossible: { icon: Lock, color: "#dc2626", bg: "from-red-900/20 to-red-950/10" },
  legendary: { icon: Crown, color: "#fbbf24", bg: "from-yellow-900/20 to-yellow-950/10" },
  hot: { icon: Flame, color: "#f97316", bg: "from-orange-900/20 to-orange-950/10" },
  dormant: { icon: Skull, color: "#6b7280", bg: "from-gray-900/20 to-gray-950/10" },
  viral: { icon: Eye, color: "#a855f7", bg: "from-purple-900/20 to-purple-950/10" },
};

const mockRecords = [
  { id: 1, category: "mythic", name: "Torneo Perfecto", nameEn: "Perfect Tournament", desc: "Anotar puntos en cada carrera", descEn: "Score points in every race", status: "impossible", holder: null, date: null },
  { id: 2, category: "fullPoint", name: "8 Full Points Consecutivos", nameEn: "8 Consecutive Full Points", desc: "8 Full Points seguidos", descEn: "8 Full Points in a row", status: "impossible", holder: null, date: null },
  { id: 3, category: "dominance", name: "Rey Absoluto", nameEn: "Supreme Dominator", desc: "Liderar un torneo completo", descEn: "Lead an entire tournament", status: "legendary", holder: "Storm_Rider", date: "2026-05-20" },
  { id: 4, category: "fullPoint", name: "7 Full Points Consecutivos", nameEn: "7 Consecutive Full Points", desc: "7 Full Points seguidos", descEn: "7 Full Points in a row", status: "legendary", holder: "Night_Fury", date: "2026-05-18" },
  { id: 5, category: "comebacks", name: "Remontada Historica", nameEn: "Historic Comeback", desc: "De ultimo a Top 3", descEn: "From last to Top 3", status: "hot", holder: "Phantom_Ace", date: "2026-05-22" },
  { id: 6, category: "smartPoint", name: "Smart Point Supremo", nameEn: "Supreme Smart Point", desc: "5 Smart 30 consecutivos", descEn: "5 consecutive Smart 30", status: "hot", holder: "Shadow_King", date: "2026-05-19" },
  { id: 7, category: "dualPoint", name: "6 Dual Points Consecutivos", nameEn: "6 Consecutive Dual Points", desc: "6 Dual Points seguidos", descEn: "6 Dual Points in a row", status: "legendary", holder: "Iron_Horse", date: "2026-05-15" },
  { id: 8, category: "dominance", name: "Dominio Triple", nameEn: "Triple Dominance", desc: "Dominar 3 hipodromos", descEn: "Dominate 3 racetracks", status: "impossible", holder: null, date: null },
  { id: 9, category: "mythic", name: "Ticket Inmortal", nameEn: "Immortal Ticket", desc: "Ticket con mas puntos en la historia", descEn: "Ticket with most points in history", status: "legendary", holder: "Storm_Rider", date: "2026-05-21" },
  { id: 10, category: "fullPoint", name: "Full Point 100x1", nameEn: "Full Point 100x1", desc: "Acertar caballo 100-to-1", descEn: "Correctly pick 100-to-1 horse", status: "impossible", holder: null, date: null },
  { id: 11, category: "comebacks", name: "Ultimo Aliento", nameEn: "Last Breath", desc: "Ganar en la carrera final", descEn: "Win in the final race", status: "viral", holder: "Dark_Runner", date: "2026-05-23" },
  { id: 12, category: "smartPoint", name: "Smart Point Legendario", nameEn: "Legendary Smart Point", desc: "8 Smart Points consecutivos", descEn: "8 consecutive Smart Points", status: "dormant", holder: "Ace_Rider", date: "2025-12-01" },
  { id: 13, category: "dominance", name: "3K Full Point", nameEn: "3K Full Point", desc: "Primer jugador en 3K usando Full", descEn: "First player to 3K using Full", status: "hot", holder: "Night_Fury", date: "2026-05-24" },
  { id: 14, category: "dualPoint", name: "Dual Perfecto", nameEn: "Perfect Dual", desc: "Dual Point en todas las carreras validas", descEn: "Dual Point in all valid races", status: "impossible", holder: null, date: null },
  { id: 15, category: "mythic", name: "Leyenda Absoluta", nameEn: "Absolute Legend", desc: "Titulo mas alto del sistema", descEn: "Highest title in the system", status: "impossible", holder: null, date: null },
  { id: 16, category: "comebacks", name: "De Ultimo a #1", nameEn: "From Last to #1", desc: "Pasar de ultimo lugar a primero", descEn: "Go from last place to first", status: "legendary", holder: "Phantom_Ace", date: "2026-05-17" },
  { id: 17, category: "fullPoint", name: "5K Full Point", nameEn: "5K Full Point", desc: "Primer jugador en 5K usando Full", descEn: "First player to 5K using Full", status: "impossible", holder: null, date: null },
  { id: 18, category: "smartPoint", name: "Rey del Smart 30", nameEn: "King of Smart 30", desc: "7 Smart 30 consecutivos", descEn: "7 consecutive Smart 30", status: "dormant", holder: null, date: null },
];

const FALLBACK_PODIUM = [
  { rank: 1, name: "María López", points: 7650, color: "#fbbf24" },
  { rank: 2, name: "Alex Martin", points: 4250, color: "#a1a1aa" },
  { rank: 3, name: "David Ruiz", points: 2150, color: "#ea580c" },
];

const rankColors = { 1: "#fbbf24", 2: "#a1a1aa", 3: "#ea580c" };

function mapPodiumPlayer(entry) {
  return {
    rank: entry.rank,
    name: entry.username,
    points: entry.totalPoints ?? 0,
    color: entry.avatarColor || rankColors[entry.rank] || "#7c3aed",
  };
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function HallOfFamePublicView() {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const [podiumPlayers, setPodiumPlayers] = useState(FALLBACK_PODIUM);

  useEffect(() => {
    fetchJson("/leaderboard?limit=3")
      .then((data) => {
        const legends = data?.legends || [];
        if (legends.length >= 3) {
          setPodiumPlayers(legends.slice(0, 3).map(mapPodiumPlayer));
        } else if (legends.length > 0) {
          const mapped = legends.map(mapPodiumPlayer);
          const filled = [...mapped];
          for (let r = mapped.length + 1; r <= 3; r++) {
            const fb = FALLBACK_PODIUM.find((p) => p.rank === r);
            if (fb) filled.push(fb);
          }
          setPodiumPlayers(filled);
        }
      })
      .catch(() => {});
  }, []);

  const categories = [
    { key: "all", label: t("hallOfFame.allTime") },
    { key: "fullPoint", label: t("hallOfFame.fullPoint") },
    { key: "dualPoint", label: t("hallOfFame.dualPoint") },
    { key: "smartPoint", label: t("hallOfFame.smartPoint") },
    { key: "dominance", label: t("hallOfFame.dominance") },
    { key: "comebacks", label: t("hallOfFame.comebacks") },
    { key: "mythic", label: t("hallOfFame.mythic") },
  ];

  return (
    <div className="relative -mt-16 min-h-screen bg-[#050508] text-white">
      <HallOfFamePodium
        players={podiumPlayers}
        title={t("hallOfFame.congratulationsTitle")}
        subtitle={t("hallOfFame.congratulationsSubtitle")}
        pointsWord={t("hallOfFame.pointsUnit")}
        locale={language}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20">
          <Link
            href="/"
            className="pointer-events-auto inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-gold-light transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("hallOfFame.backToHome")}
          </Link>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-16 mt-4 sm:mt-6">
        <p className="text-center text-xs text-zinc-600 uppercase tracking-widest mb-8">{t("hallOfFame.title")}</p>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className="px-4 py-2 rounded-lg text-xs font-semibold border border-white/10 text-zinc-400 hover:text-white hover:border-purple/30 hover:bg-purple/5 transition-all"
            >
              {cat.label}
            </button>
          ))}
        </div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockRecords.map((record) => {
            const CatIcon = categoryIcons[record.category] || Star;
            const catColor = categoryColors[record.category] || "#7c3aed";
            const status = statusConfig[record.status] || statusConfig.dormant;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={record.id}
                variants={fadeUp}
                className={`rounded-xl p-5 bg-gradient-to-br ${status.bg} border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group relative overflow-hidden`}
              >
                <div className="absolute -bottom-4 -right-4 opacity-[0.04] pointer-events-none">
                  <img src="/images/icons/icon-horse.png" alt="" className="w-28 h-28 object-contain" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${catColor}20` }}>
                        <CatIcon className="w-4 h-4" style={{ color: catColor }} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{isEn ? record.nameEn : record.name}</h3>
                        <p className="text-[11px] text-zinc-600">{isEn ? record.descEn : record.desc}</p>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${status.color}15`, color: status.color }}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {t(`hallOfFame.${record.status}`)}
                    </div>
                  </div>

                  {record.holder ? (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.05]">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple/30 to-purple/10 flex items-center justify-center text-[10px] font-bold text-purple-light">
                        {record.holder.substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{record.holder}</p>
                        <p className="text-[10px] text-zinc-600">{record.date}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.05]">
                      <Lock className="w-4 h-4 text-zinc-700" />
                      <p className="text-xs text-zinc-600 italic">{t("hallOfFame.noOneYet")}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
