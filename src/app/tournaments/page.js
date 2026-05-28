"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import AnimateInView from "@/frontend/components/ui/AnimateInView";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { fetchTournamentsList } from "@/frontend/lib/api/tournaments";

function TournamentCardSkeleton() {
  return (
    <div className="block glass-card rounded-2xl overflow-hidden gradient-border animate-pulse">
      <div className="relative h-36 bg-white/5" />
      <div className="px-5 sm:px-6 pt-4 pb-5">
        <div className="mb-4">
          <div className="h-5 w-3/4 bg-white/5 rounded mb-2" />
          <div className="h-3 w-1/2 bg-white/5 rounded" />
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="h-3 w-24 bg-white/5 rounded" />
            <div className="h-3 w-16 bg-white/5 rounded" />
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full" />
        </div>
        <div className="h-3 w-full bg-white/5 rounded mb-1" />
        <div className="h-3 w-2/3 bg-white/5 rounded mb-4" />
        <div className="flex items-center gap-4 mb-5">
          <div className="h-3 w-20 bg-white/5 rounded" />
          <div className="h-3 w-16 bg-white/5 rounded" />
        </div>
        <div className="w-full h-10 bg-white/5 rounded-xl" />
      </div>
    </div>
  );
}

export default function TournamentsPage() {
  const { t } = useLanguage();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchTournamentsList({ refresh: true });
        if (!cancelled) setTournaments(data.tournaments || []);
      } catch {
        if (!cancelled) setTournaments([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero-lobby.jpg"
            alt=""
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-brand-dark/90 to-brand-dark" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
          <AnimateInView>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan animate-pulse-live" />
              <span className="text-xs font-semibold text-cyan uppercase tracking-widest">
                {t("tournamentsPage.liveLabel")}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">
              {t("tournamentsPage.title")}
            </h1>
            <p className="text-zinc-500 text-sm sm:text-base max-w-lg">
              {t("tournamentsPage.description")}
            </p>
          </AnimateInView>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-32 lg:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <TournamentCardSkeleton key={i} />
              ))
            : tournaments.map((tournament, i) => (
                <AnimateInView key={tournament.id} delay={i * 0.1}>
                  <Link
                    href={`/tournament/${tournament.slug}`}
                    className="block glass-card rounded-2xl overflow-hidden group hover:glow-purple transition-all duration-500 gradient-border"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={tournament.imageUrl || "/images/news-favoritos.jpg"}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-brand-card/60 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm ${
                            tournament.status === "live"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {tournament.status === "live" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-live" />
                          )}
                          {tournament.status === "live" ? t("tournamentsPage.live") : t("tournamentsPage.upcoming")}
                        </span>
                      </div>
                    </div>
                    <div className="px-5 sm:px-6 pt-4 pb-5">
                      <div className="mb-4">
                        <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-light transition-colors">
                          {tournament.name}
                        </h2>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500">
                          <img src="/images/icons/icon-location.png" alt="" className="w-3.5 h-3.5 object-contain" />
                          <span>{tournament.track}, {tournament.location}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-zinc-400">
                            {t("tournamentsPage.race")} {tournament.currentRace} {t("tournamentsPage.of")} {tournament.totalRaces}
                          </span>
                          <span className="text-zinc-500">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {new Date(tournament.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple to-cyan rounded-full transition-all duration-500"
                            style={{
                              width: `${(tournament.currentRace / tournament.totalRaces) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <p className="text-xs text-zinc-600 mb-4 line-clamp-2">{tournament.description}</p>

                      <div className="flex items-center gap-4 text-xs text-zinc-500 mb-5">
                        <div className="flex items-center gap-1.5">
                          <img src="/images/icons/icon-players.png" alt="" className="w-4 h-4 object-contain" />
                          <span>{tournament.players.toLocaleString()} {t("tournamentsPage.players")}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span>{tournament.totalRaces} {t("tournamentsPage.races")}</span>
                        </div>
                      </div>

                      <div className="w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple to-purple-light rounded-xl btn-glow opacity-90 group-hover:opacity-100 transition-opacity text-center flex items-center justify-center gap-1">
                        {t("tournamentsPage.enterTournament")}
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </AnimateInView>
              ))}
        </div>
      </div>
    </div>
  );
}
