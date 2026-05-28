"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trophy,
  BarChart3,
  HelpCircle,
  User,
  Crown,
  Star,
  Flame,
  Target,
  TrendingUp,
  Shield,
} from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { fetchJson, fetchAuthJson } from "@/frontend/lib/api/client";
import { logoAsset, staticFile } from "@/frontend/lib/config/paths";
import HallOfFamePodium from "@/frontend/components/hall-of-fame/HallOfFamePodium";
import HallOfFameAchievementGrid from "@/frontend/components/hall-of-fame/HallOfFameAchievementGrid";

const FALLBACK_PODIUM = [
  { rank: 1, name: "María López", points: 7650, color: "#fbbf24" },
  { rank: 2, name: "Alex Martin", points: 4250, color: "#a1a1aa" },
  { rank: 3, name: "David Ruiz", points: 2150, color: "#ea580c" },
];

const rankColors = { 1: "#fbbf24", 2: "#a1a1aa", 3: "#ea580c" };

const HOF_ACHIEVEMENTS = [
  { id: 1, category: "mythic", name: "Torneo Perfecto", nameEn: "Perfect Tournament", desc: "Anotar puntos en cada carrera", descEn: "Score points in every race", icon: Star, unlocked: true, holder: null },
  { id: 2, category: "fullPoint", name: "8 Full Points Consecutivos", nameEn: "8 Consecutive Full Points", desc: "8 Full Points seguidos", descEn: "8 Full Points in a row", icon: Target, unlocked: true, holder: null },
  { id: 3, category: "dominance", name: "Rey Absoluto", nameEn: "Supreme Dominator", desc: "Liderar un torneo completo", descEn: "Lead an entire tournament", icon: Crown, unlocked: true, holder: "Storm_Rider" },
  { id: 4, category: "comebacks", name: "Remontada Historica", nameEn: "Historic Comeback", desc: "De ultimo a Top 3", descEn: "From last to Top 3", icon: TrendingUp, unlocked: true, holder: "Phantom_Ace" },
  { id: 5, category: "smartPoint", name: "Smart Point Supremo", nameEn: "Supreme Smart Point", desc: "5 Smart 30 consecutivos", descEn: "5 consecutive Smart 30", icon: Flame, unlocked: true, holder: "Shadow_King" },
  { id: 6, category: "dualPoint", name: "6 Dual Points Consecutivos", nameEn: "6 Consecutive Dual Points", desc: "6 Dual Points seguidos", descEn: "6 Dual Points in a row", icon: Shield, unlocked: false, holder: null },
  { id: 7, category: "mythic", name: "Ticket Inmortal", nameEn: "Immortal Ticket", desc: "Ticket con mas puntos en la historia", descEn: "Ticket with most points in history", icon: Trophy, unlocked: false, holder: null },
];

const LEGENDARY_HORSES = [
  { name: "Thunder Strike", track: "Gulfstream" },
  { name: "Midnight Run", track: "Santa Anita" },
  { name: "Golden Hoof", track: "Churchill" },
  { name: "Storm Chaser", track: "Belmont" },
];

function mapPodiumPlayer(entry) {
  return {
    rank: entry.rank,
    name: entry.username,
    points: entry.totalPoints ?? 0,
    color: entry.avatarColor || rankColors[entry.rank] || "#7c3aed",
  };
}

export default function HallOfFameLoggedInView() {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const { user } = useAuth();
  const [podiumPlayers, setPodiumPlayers] = useState(FALLBACK_PODIUM);
  const [profile, setProfile] = useState(null);

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

    fetchAuthJson("/profile")
      .then((data) => setProfile(data))
      .catch(() => {});
  }, []);

  const username = user?.username || "Player";
  const totalPoints = profile?.user?.stats?.totalPoints ?? 2580;
  const globalRank = profile?.user?.globalRank ?? 12;
  const wins = profile?.user?.stats?.titles ?? profile?.user?.stats?.totalRaces ?? 0;
  const entryFeat = HOF_ACHIEVEMENTS.find((a) => a.unlocked && a.holder) || HOF_ACHIEVEMENTS[2];

  const navLinks = [
    { href: "/tournaments", label: t("nav.tournaments"), icon: Trophy },
    { href: "/leaderboard", label: t("nav.ranking"), icon: BarChart3 },
    { href: "/hall-of-fame", label: t("nav.hallOfFame"), icon: Crown, active: true },
    { href: "/how-to-play", label: t("nav.howToPlay"), icon: HelpCircle },
    { href: "/profile", label: t("nav.profile"), icon: User },
  ];

  return (
    <div className="hof-app">
      <aside className="hof-app__sidebar">
        <Link href="/" className="hof-app__logo">
          <Image src={logoAsset()} alt="50points" width={200} height={44} className="h-9 w-auto object-contain" />
        </Link>

        <nav className="hof-app__nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hof-app__nav-link${link.active ? " hof-app__nav-link--active" : ""}`}
            >
              <link.icon className="w-4 h-4 shrink-0" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hof-app__profile-card">
          <div
            className="hof-app__profile-avatar"
            style={{ backgroundColor: user?.avatarColor || "#7c3aed" }}
          >
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="hof-app__profile-meta">
            <p className="hof-app__profile-name">{username}</p>
            <p className="hof-app__profile-level">
              {t("hallOfFame.level")} 50 · {t("hallOfFame.legend")}
            </p>
            <p className="hof-app__profile-points">
              {totalPoints.toLocaleString(isEn ? "en-US" : "es-ES")} PTS
            </p>
          </div>
        </div>
      </aside>

      <main className="hof-app__main">
        <header className="hof-app__page-header">
          <h1 className="hof-app__page-title">{t("hallOfFame.pageTitle")}</h1>
          <img
            src={staticFile("/images/icons/icon-horse.png")}
            alt=""
            className="hof-app__page-art"
            aria-hidden
          />
        </header>

        <section className="hof-highlights">
          <article className="hof-highlights__item">
            <p className="hof-highlights__label">{t("hallOfFame.highlights.latestEntry")}</p>
            <p className="hof-highlights__value">NIGHTBOLT</p>
            <p className="hof-highlights__meta">
              {t("hallOfFame.highlights.enteredOn")} 10 {isEn ? "May" : "May"} 2024
            </p>
          </article>
          <article className="hof-highlights__item">
            <p className="hof-highlights__label">{t("hallOfFame.highlights.newRecord")}</p>
            <p className="hof-highlights__value">{username.toUpperCase()}</p>
            <p className="hof-highlights__meta">
              {t("hallOfFame.highlights.surpassedOn")} 2,500 {t("hallOfFame.highlights.points")}{" "}
              {t("hallOfFame.highlights.onDate")} 28 {isEn ? "Apr" : "Abr"} 2024
            </p>
          </article>
          <article className="hof-highlights__item">
            <p className="hof-highlights__label">{t("hallOfFame.highlights.featUnlocked")}</p>
            <p className="hof-highlights__value hof-highlights__value--sm">
              {isEn ? "First player to win 3 tournaments" : "Primer jugador en ganar 3 torneos"}
            </p>
            <p className="hof-highlights__meta">
              {t("hallOfFame.highlights.onDate")} 28 {isEn ? "Apr" : "Abr"} 2024
            </p>
          </article>
        </section>

        <section className="hof-feat-reveal" aria-label={t("hallOfFame.featReveal")}>
          <div className="hof-feat-reveal__intro">
            <h2 className="hof-feat-reveal__title">{t("hallOfFame.featReveal")}</h2>
            <p className="hof-feat-reveal__subtitle">{t("hallOfFame.featRevealSub")}</p>
            <p className="hof-feat-reveal__feat">
              {isEn ? entryFeat.nameEn : entryFeat.name}
            </p>
          </div>
          <HallOfFamePodium
            embedded
            players={podiumPlayers}
            title={t("hallOfFame.congratulationsTitle")}
            subtitle={t("hallOfFame.congratulationsSubtitle")}
            pointsWord={t("hallOfFame.pointsUnit")}
            locale={language}
          />
        </section>

        <HallOfFameAchievementGrid
          achievements={HOF_ACHIEVEMENTS}
          isEn={isEn}
          lockedLabel={t("hallOfFame.locked")}
        />
      </main>

      <aside className="hof-app__aside">
        <section className="hof-season-panel">
          <h2 className="hof-season-panel__title">{t("hallOfFame.seasonTitle")}</h2>
          <dl className="hof-season-panel__stats">
            <div>
              <dt>{t("hallOfFame.seasonPoints")}</dt>
              <dd>{totalPoints.toLocaleString(isEn ? "en-US" : "es-ES")}</dd>
            </div>
            <div>
              <dt>{t("hallOfFame.seasonRank")}</dt>
              <dd>#{globalRank}</dd>
            </div>
            <div>
              <dt>{t("hallOfFame.seasonWins")}</dt>
              <dd>{wins}</dd>
            </div>
          </dl>
        </section>

        <section className="hof-legend-horses">
          <h2 className="hof-legend-horses__title">{t("hallOfFame.legendaryHorses")}</h2>
          <ul className="hof-legend-horses__list">
            {LEGENDARY_HORSES.map((horse) => (
              <li key={horse.name} className="hof-legend-horses__item">
                <span className="hof-legend-horses__name">{horse.name}</span>
                <span className="hof-legend-horses__track">{horse.track}</span>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
}
