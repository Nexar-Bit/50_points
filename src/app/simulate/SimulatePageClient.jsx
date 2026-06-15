"use client";

import { useEffect, useState } from "react";
import { Play, CheckCircle2, AlertCircle, ChevronDown, Trophy } from "lucide-react";
import AppPageHeader from "@/frontend/components/layout/AppPageHeader";
import { fetchAuthJson, fetchJson } from "@/frontend/lib/api/client";
import { useAuth } from "@/frontend/contexts/AuthContext";

const RACE_COUNT = 7;
const EMPTY_RACE = { winnerHorseId: "", dividend: "" };

function emptyRaces() {
  return Array.from({ length: RACE_COUNT }, (_, i) => ({
    raceNumber: i + 1,
    ...EMPTY_RACE,
  }));
}

function RaceResultRow({ race, horses, onChange }) {
  return (
    <div className="sim-race-row">
      <span className="sim-race-row__label">Carrera {race.raceNumber}</span>

      <select
        className="sim-race-row__select"
        value={race.winnerHorseId}
        onChange={(e) => onChange("winnerHorseId", e.target.value)}
      >
        <option value="">— Caballo ganador —</option>
        {(horses || []).map((h) => (
          <option key={h.id} value={h.id}>
            #{h.postPosition} {h.name}
          </option>
        ))}
      </select>

      <label className="sim-race-row__dividend-label" htmlFor={`div-${race.raceNumber}`}>
        Dividendo
      </label>
      <input
        id={`div-${race.raceNumber}`}
        type="number"
        min="1"
        step="0.01"
        value={race.dividend}
        onChange={(e) => onChange("dividend", e.target.value)}
        className="sim-race-row__input"
        placeholder="p.ej. 4.20"
      />
    </div>
  );
}

function RankingTable({ entries }) {
  if (!entries?.length) return <p className="sim-empty">Sin datos de ranking.</p>;
  return (
    <table className="sim-ranking-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Jugador</th>
          <th>Ticket</th>
          <th>Puntos</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((row) => (
          <tr key={`${row.userId}-${row.ticketId}`} className={row.rank <= 3 ? "sim-ranking-table__top" : ""}>
            <td>{row.rank}</td>
            <td>{row.username}</td>
            <td>#{row.ticketNumber}</td>
            <td className="sim-ranking-table__pts">{row.points.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function SimulatePageClient() {
  const { isAuthenticated } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [raceResults, setRaceResults] = useState(emptyRaces());
  const [horses, setHorses] = useState({});
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [simStatus, setSimStatus] = useState(null); // "ok" | "error" | null
  const [simMessage, setSimMessage] = useState("");
  const [loadingTournaments, setLoadingTournaments] = useState(true);

  useEffect(() => {
    fetchJson("/tournaments?limit=20")
      .then((data) => setTournaments(data.tournaments || []))
      .catch(() => {})
      .finally(() => setLoadingTournaments(false));
  }, []);

  const loadHorses = async (tournament) => {
    if (!tournament?.races?.length) return;
    const map = {};
    await Promise.all(
      tournament.races.map(async (race) => {
        try {
          const data = await fetchJson(`/races/${race.id}/horses`);
          map[race.raceNumber] = data.horses || [];
        } catch {
          map[race.raceNumber] = [];
        }
      })
    );
    setHorses(map);
  };

  const handleTournamentChange = async (e) => {
    const id = e.target.value;
    const t = tournaments.find((x) => String(x.id) === id);
    setSelectedTournament(t || null);
    setRaceResults(emptyRaces());
    setRanking([]);
    setSimStatus(null);
    if (t) await loadHorses(t);
  };

  const updateRace = (raceNumber, field, value) => {
    setRaceResults((prev) =>
      prev.map((r) => (r.raceNumber === raceNumber ? { ...r, [field]: value } : r))
    );
  };

  const loadRanking = async (tournamentId) => {
    try {
      const data = await fetchJson(`/leaderboard?tournamentId=${tournamentId}&limit=20`);
      setRanking(data.entries || data.leaderboard || []);
    } catch {
      setRanking([]);
    }
  };

  const handleSimulate = async () => {
    if (!selectedTournament) return;
    const filled = raceResults.filter((r) => r.winnerHorseId && r.dividend);
    if (!filled.length) {
      setSimMessage("Ingresa al menos un resultado de carrera.");
      setSimStatus("error");
      return;
    }
    setLoading(true);
    setSimStatus(null);
    try {
      const results = await Promise.allSettled(
        filled.map((r) =>
          fetchAuthJson(`/admin/races/${r.raceNumber}/result`, {
            method: "POST",
            body: JSON.stringify({
              tournamentId: selectedTournament.id,
              winnerHorseId: r.winnerHorseId,
              officialDividend: parseFloat(r.dividend),
            }),
          })
        )
      );
      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length > 0) {
        setSimMessage(`${filled.length - failed.length}/${filled.length} carreras procesadas. ${failed.length} errores.`);
        setSimStatus("error");
      } else {
        setSimMessage(`${filled.length} carrera${filled.length > 1 ? "s" : ""} procesada${filled.length > 1 ? "s" : ""} correctamente.`);
        setSimStatus("ok");
      }
      await loadRanking(selectedTournament.id);
    } catch (err) {
      setSimMessage(err.message || "Error al procesar.");
      setSimStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="sim-page">
        <AppPageHeader title="SIMULATE" subtitle="Solo para administradores" />
        <p className="sim-empty">Inicia sesión como administrador para usar esta página.</p>
      </div>
    );
  }

  return (
    <div className="sim-page">
      <AppPageHeader
        title="SIMULATE"
        subtitle="Ingresa resultados de carrera y ejecuta el motor de puntuación"
      />

      {/* Tournament selector */}
      <section className="sim-section">
        <h2 className="sim-section__title">1. Selecciona un torneo</h2>
        {loadingTournaments ? (
          <p className="sim-empty">Cargando torneos…</p>
        ) : (
          <div className="sim-select-wrap">
            <select
              className="sim-select"
              value={selectedTournament?.id ?? ""}
              onChange={handleTournamentChange}
            >
              <option value="">— Elige un torneo —</option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.status})
                </option>
              ))}
            </select>
            <ChevronDown className="sim-select-wrap__icon" size={16} aria-hidden />
          </div>
        )}
      </section>

      {/* Race results */}
      {selectedTournament ? (
        <>
          <section className="sim-section">
            <h2 className="sim-section__title">2. Ingresa resultados por carrera</h2>
            <p className="sim-section__hint">
              Solo ganador cuenta. El dividendo multiplica los puntos asignados.
            </p>
            <div className="sim-races">
              {raceResults.map((race) => (
                <RaceResultRow
                  key={race.raceNumber}
                  race={race}
                  horses={horses[race.raceNumber]}
                  onChange={(field, value) => updateRace(race.raceNumber, field, value)}
                />
              ))}
            </div>
          </section>

          <section className="sim-section">
            <button
              type="button"
              onClick={handleSimulate}
              disabled={loading}
              className="sim-run-btn"
            >
              {loading ? (
                <span>Procesando…</span>
              ) : (
                <>
                  <Play size={16} />
                  Ejecutar motor de puntuación
                </>
              )}
            </button>

            {simStatus ? (
              <div className={`sim-status sim-status--${simStatus}`}>
                {simStatus === "ok" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                {simMessage}
              </div>
            ) : null}
          </section>

          <section className="sim-section">
            <h2 className="sim-section__title">
              <Trophy size={16} />
              3. Ranking actualizado
            </h2>
            <RankingTable entries={ranking} />
            {ranking.length === 0 && simStatus === "ok" ? (
              <button
                type="button"
                className="sim-load-ranking-btn"
                onClick={() => loadRanking(selectedTournament.id)}
              >
                Cargar ranking
              </button>
            ) : null}
          </section>
        </>
      ) : null}
    </div>
  );
}
