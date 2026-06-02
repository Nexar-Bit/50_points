"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, ArrowLeft, Trophy } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { fetchAuthJson, fetchJson } from "@/frontend/lib/api/client";

export default function StatisticsPage() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [personal, setPersonal] = useState(null);
  const [tournamentStats, setTournamentStats] = useState(null);
  const [trackStats, setTrackStats] = useState(null);
  const [globalStats, setGlobalStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const tournamentsRes = await fetchJson("/tournaments");
        const list = tournamentsRes.tournaments || tournamentsRes || [];
        const live = list.find((x) => x.status === "live") || list[0];

        const tasks = [];
        if (isAuthenticated) {
          tasks.push(
            fetchAuthJson("/statistics/personal").then((data) => {
              if (!cancelled) setPersonal(data);
            })
          );
        }
        if (live?.id) {
          tasks.push(
            fetchJson(`/statistics/tournament/${live.id}`).then((data) => {
              if (!cancelled) setTournamentStats(data);
            })
          );
          if (live.track) {
            tasks.push(
              fetchJson(`/statistics/track/${encodeURIComponent(live.track)}`).then((data) => {
                if (!cancelled) setTrackStats(data);
              })
            );
          }
        }
        tasks.push(
          fetchJson("/statistics/global").then((data) => {
            if (!cancelled) setGlobalStats(data);
          })
        );
        await Promise.all(tasks);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load statistics");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-purple-light mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("leaderboard.backToHome")}
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-purple/20 border border-purple/30">
            <BarChart3 className="w-7 h-7 text-purple-light" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t("nav.statistics")}</h1>
            <p className="text-sm text-zinc-500 mt-1">
              {t("howItWorksSection.descriptionLead")}
            </p>
          </div>
        </div>

        {loading && (
          <p className="text-zinc-500 text-sm py-12 text-center">Cargando...</p>
        )}
        {error && (
          <p className="text-red-400 text-sm py-8">{error}</p>
        )}

        {!loading && !error && (
          <div className="space-y-8">
            {tournamentStats && (
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-lg font-bold">
                    Nivel 1 — {tournamentStats.tournamentName}
                  </h2>
                </div>
                <p className="text-xs text-zinc-500 mb-4">{tournamentStats.track}</p>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-500 mb-2">Caballos mas jugados</p>
                    <ul className="space-y-1">
                      {(tournamentStats.topHorses || []).slice(0, 5).map((h) => (
                        <li key={h.horseId} className="flex justify-between">
                          <span>{h.name}</span>
                          <span className="text-purple-light">{h.plays}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-zinc-500 mb-2">Uso de estrategias</p>
                    <ul className="space-y-1">
                      {(tournamentStats.strategyUsage || []).map((s) => (
                        <li key={s.strategyKey} className="flex justify-between">
                          <span>{s.strategy}</span>
                          <span className="text-cyan">{s.percent}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {trackStats && (
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-lg font-bold mb-4">Nivel 2 — {trackStats.track}</h2>
                <p className="text-xs text-zinc-500 mb-3">
                  {trackStats.tournamentCount} torneos · {trackStats.participation} jugadores
                </p>
                {trackStats.topPlayer ? (
                  <p className="text-sm mb-3">
                    Lider historico:{" "}
                    <span className="text-purple-light font-bold">{trackStats.topPlayer.username}</span>{" "}
                    ({trackStats.topPlayer.totalPoints} pts)
                  </p>
                ) : null}
                <ul className="space-y-1 text-sm">
                  {(trackStats.topHorses || []).slice(0, 5).map((h) => (
                    <li key={h.horseId} className="flex justify-between">
                      <span>{h.name}</span>
                      <span className="text-cyan">{h.plays}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {globalStats && (
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-lg font-bold mb-4">Nivel 3 — Global MY 50 POINTS</h2>
                <p className="text-sm text-zinc-400 mb-3">
                  Hipodromo mas popular:{" "}
                  <span className="text-white">{globalStats.mostPopularTrack || "—"}</span>
                </p>
                <ul className="space-y-1 text-sm mb-4">
                  {(globalStats.strategyUsage || []).map((s) => (
                    <li key={s.strategyKey} className="flex justify-between">
                      <span>{s.strategy}</span>
                      <span>{s.percent}%</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-zinc-500">Top jugadores</p>
                <ul className="space-y-1 text-sm mt-1">
                  {(globalStats.topPlayers || []).slice(0, 5).map((p) => (
                    <li key={p.username} className="flex justify-between">
                      <span>{p.username}</span>
                      <span className="text-purple-light">{p.totalPoints}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {isAuthenticated && personal ? (
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-lg font-bold mb-4">Nivel 4 — Personal</h2>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-500">Puntos totales</p>
                    <p className="text-xl font-bold text-purple-light">{personal.totalPoints}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Win rate</p>
                    <p className="text-xl font-bold">{personal.winRate}%</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Hipodromo favorito</p>
                    <p>{personal.favoriteTrack || "—"}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Estrategia favorita</p>
                    <p>{personal.favoriteStrategy || "—"}</p>
                  </div>
                </div>
              </section>
            ) : (
              <p className="text-zinc-500 text-sm text-center py-6">
                Inicia sesion para ver estadisticas personales (Nivel 4).
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
