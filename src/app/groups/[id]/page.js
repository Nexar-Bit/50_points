"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Lock, Send } from "lucide-react";
import { fetchAuthJson } from "@/frontend/lib/api/client";
import { useAuth } from "@/frontend/contexts/AuthContext";

const HOLO_CLASSES = {
  purple: "hologram-banner",
  aqua: "hologram-banner hologram-banner--aqua",
  yellow: "hologram-banner hologram-banner--yellow",
  multicolor: "hologram-banner hologram-banner--multicolor",
};

function formatCooldown(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function GroupDetailPage() {
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const groupId = params.id;

  const [group, setGroup] = useState(null);
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState("🔥");
  const [previews, setPreviews] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState("purple");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    if (!groupId || !isAuthenticated) return;
    fetchAuthJson(`/groups/${groupId}`)
      .then((data) => setGroup(data.group))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [groupId, isAuthenticated]);

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [load]);

  const handlePreview = async () => {
    const data = await fetchAuthJson(`/groups/${groupId}/hologram/preview`, {
      method: "POST",
      body: JSON.stringify({ message, emoji }),
    });
    setPreviews(data.versions || []);
  };

  const handleSend = async () => {
    await fetchAuthJson(`/groups/${groupId}/hologram`, {
      method: "POST",
      body: JSON.stringify({ message, emoji, colorVersion: selectedVersion }),
    });
    setMessage("");
    setPreviews([]);
    load();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-dark text-white p-8 text-center text-zinc-500">
        Inicia sesion para ver este grupo.
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen bg-brand-dark text-zinc-500 p-8">Cargando...</div>;
  }

  if (!group) {
    return <div className="min-h-screen bg-brand-dark text-red-400 p-8">{error || "Grupo no encontrado"}</div>;
  }

  const holoClass = HOLO_CLASSES[group.activeHologram?.colorVersion] || HOLO_CLASSES.purple;
  const canPublish = group.canPublishHologram;
  const status = group.hologramStatus || {};

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <div className="app-page py-8">
        <Link href="/groups" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-purple-light mb-4">
          <ArrowLeft className="w-4 h-4" />
          Grupos
        </Link>

        <h1 className="text-2xl font-bold mb-1">{group.name}</h1>
        <p className="text-xs text-zinc-500 mb-6">{group.memberCount} miembros</p>

        {group.activeHologram ? (
          <div className={`${holoClass} mb-6`}>
            <p className="text-xs text-zinc-400 mb-1">
              {group.activeHologram.emoji} {group.activeHologram.author}
            </p>
            <p className="text-sm font-semibold">{group.activeHologram.message}</p>
          </div>
        ) : null}

        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4 mb-6">
          <h2 className="text-sm font-bold mb-3">Administracion</h2>
          <ul className="space-y-2 text-sm">
            {group.adminSlots?.map((slot, i) => (
              <li key={i} className="flex items-center gap-2">
                {slot.filled ? (
                  <>
                    <span>{slot.role === "founder" ? "👑" : "🛡️"}</span>
                    <span>{slot.username}</span>
                  </>
                ) : (
                  <>
                    <span>🛡️</span>
                    <span className="text-zinc-500">Disponible</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <h2 className="text-sm font-bold mb-2 flex items-center gap-2">
            Holograma grupal
            {!canPublish ? <Lock className="w-4 h-4 text-zinc-500" /> : null}
          </h2>

          {!canPublish ? (
            <p className="text-xs text-zinc-500">
              Solo administradores pueden publicar hologramas. Solicita permisos al fundador o crea tu propio grupo.
            </p>
          ) : (
            <>
              {status.available ? (
                <p className="text-xs text-green-400 mb-2">Holograma disponible</p>
              ) : (
                <p className="text-xs text-amber-400 mb-2">
                  Cooldown: {formatCooldown(status.secondsRemaining || 0)}
                </p>
              )}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={160}
                rows={3}
                className="w-full mb-2 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm"
                placeholder="Mensaje corto..."
              />
              <div className="flex gap-1 mb-2">
                {["🔥", "👑", "🏆", "⚡", "⭐", "💎", "📢", "🚀"].map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    className={`px-2 py-1 rounded ${emoji === e ? "bg-purple/30" : "bg-white/5"}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="flex-1 py-2 rounded-lg border border-white/10 text-xs font-bold"
                >
                  Vista previa (4 versiones)
                </button>
                <button
                  type="button"
                  disabled={!status.available || !message.trim()}
                  onClick={handleSend}
                  className="flex-1 py-2 rounded-lg bg-purple text-xs font-bold disabled:opacity-40 flex items-center justify-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar
                </button>
              </div>
              {previews.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {previews.map((v) => (
                    <button
                      key={v.version}
                      type="button"
                      onClick={() => setSelectedVersion(v.version)}
                      className={`text-left p-2 rounded-lg border text-xs ${
                        selectedVersion === v.version
                          ? "border-purple ring-1 ring-purple"
                          : "border-white/10"
                      } ${HOLO_CLASSES[v.version] || HOLO_CLASSES.purple}`}
                    >
                      {v.preview}
                    </button>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
