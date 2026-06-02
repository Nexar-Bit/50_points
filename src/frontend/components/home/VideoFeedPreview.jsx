"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Play } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";

const SEGMENTS = [
  { id: "hot", labelEs: "Jugadores Hot", labelEn: "Hot Players" },
  { id: "live", labelEs: "Carreras en Vivo", labelEn: "Live Races" },
  { id: "trending", labelEs: "Tendencias", labelEn: "Trending" },
];

const PLACEHOLDER_CLIPS = [
  { id: 1, title: "Remontada +12", track: "Gulfstream" },
  { id: 2, title: "Full Point ganador", track: "Santa Anita" },
  { id: 3, title: "Nuevo lider HOT", track: "Churchill Downs" },
];

export default function VideoFeedPreview() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [expanded, setExpanded] = useState(false);
  const [closedSegments, setClosedSegments] = useState([]);

  const activeSegment = SEGMENTS.find((s) => !closedSegments.includes(s.id)) || SEGMENTS[0];
  const label = isEn
    ? activeSegment.labelEn
    : activeSegment.labelEs;

  return (
    <section className="mt-12 sm:mt-16">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left hover:bg-white/[0.05] transition-colors"
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-purple-light">
            Feed
          </p>
          <p className="text-sm font-bold text-white">
            {isEn ? "Highlights & moments" : "Momentos y highlights"}
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-zinc-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-zinc-400" />
        )}
      </button>

      {expanded ? (
        <div className="mt-3 rounded-2xl border border-white/10 bg-black/40 p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {SEGMENTS.map((seg) => {
              const closed = closedSegments.includes(seg.id);
              const segLabel = isEn ? seg.labelEn : seg.labelEs;
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() =>
                    setClosedSegments((prev) =>
                      closed ? prev.filter((id) => id !== seg.id) : [...prev, seg.id]
                    )
                  }
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    closed
                      ? "border-white/10 text-zinc-600 line-through"
                      : "border-purple/40 text-purple-light bg-purple/10"
                  }`}
                >
                  {segLabel} {closed ? "×" : ""}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-zinc-500 mb-3">{label}</p>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
            {PLACEHOLDER_CLIPS.map((clip) => (
              <div
                key={clip.id}
                className="snap-start shrink-0 w-36 sm:w-44 aspect-[9/16] rounded-xl border border-white/10 bg-gradient-to-b from-purple/20 to-brand-dark flex flex-col items-center justify-center p-3 text-center"
              >
                <Play className="w-8 h-8 text-white/50 mb-2" />
                <p className="text-xs font-bold text-white">{clip.title}</p>
                <p className="text-[10px] text-zinc-500 mt-1">{clip.track}</p>
              </div>
            ))}
          </div>
          <Link
            href="/leaderboard"
            className="inline-block mt-3 text-xs text-purple-light hover:underline"
          >
            {isEn ? "See full feed soon" : "Ver feed completo pronto"}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
