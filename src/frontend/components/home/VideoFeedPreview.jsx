"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Play, Pause } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { getFeedVideos } from "@/frontend/lib/config/feedVideos";

const SEGMENTS = [
  { id: "hot", labelEs: "Jugadores Hot", labelEn: "Hot Players" },
  { id: "live", labelEs: "Carreras en Vivo", labelEn: "Live Races" },
  { id: "trending", labelEs: "Tendencias", labelEn: "Trending" },
];

function FeedVideoCard({ clip, isEn, isPlaying, onTogglePlay }) {
  const videoRef = useRef(null);
  const [failed, setFailed] = useState(false);

  const handleToggle = () => {
    if (failed) return;
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      onTogglePlay(clip.id, video);
    } else {
      video.pause();
      onTogglePlay(null, null);
    }
  };

  return (
    <article className="feed-video-card">
      <button
        type="button"
        className="feed-video-card__frame"
        onClick={handleToggle}
        aria-label={isEn ? `Play ${clip.titleEn}` : `Reproducir ${clip.titleEs}`}
      >
        {failed ? (
          <span className="feed-video-card__fallback" aria-hidden>
            <Play className="w-8 h-8 text-white/70" strokeWidth={1.75} />
          </span>
        ) : (
          <video
            ref={videoRef}
            className="feed-video-card__video"
            src={clip.src}
            poster={clip.poster}
            muted
            playsInline
            loop
            preload="metadata"
            onError={() => setFailed(true)}
          />
        )}
        <span className="feed-video-card__shade" aria-hidden />
        <span className="feed-video-card__play" aria-hidden>
          {isPlaying && !failed ? (
            <Pause className="w-7 h-7 text-white" strokeWidth={2} />
          ) : (
            <Play className="w-7 h-7 text-white" strokeWidth={2} />
          )}
        </span>
      </button>
      <p className="feed-video-card__title">{isEn ? clip.titleEn : clip.titleEs}</p>
      <p className="feed-video-card__track">{clip.track}</p>
    </article>
  );
}

export default function VideoFeedPreview() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [expanded, setExpanded] = useState(false);
  const [activeSegment, setActiveSegment] = useState("live");
  const [playingId, setPlayingId] = useState(null);
  const activeVideoRef = useRef(null);

  const allClips = useMemo(() => getFeedVideos(), []);

  const visibleClips = useMemo(
    () => allClips.filter((clip) => clip.segment === activeSegment),
    [allClips, activeSegment],
  );

  const handleTogglePlay = useCallback((id, videoEl) => {
    if (activeVideoRef.current && activeVideoRef.current !== videoEl) {
      activeVideoRef.current.pause();
      activeVideoRef.current.currentTime = 0;
    }
    if (id && videoEl) {
      videoEl.play().catch(() => {});
      activeVideoRef.current = videoEl;
      setPlayingId(id);
    } else {
      activeVideoRef.current = null;
      setPlayingId(null);
    }
  }, []);

  return (
    <section className="mt-12 sm:mt-16 feed-preview">
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
        <div className="mt-3 rounded-2xl border border-white/10 bg-black/40 p-4 feed-preview__panel">
          <div className="feed-preview__tabs" role="tablist">
            {SEGMENTS.map((seg) => {
              const segLabel = isEn ? seg.labelEn : seg.labelEs;
              const count = allClips.filter((c) => c.segment === seg.id).length;
              const isActive = activeSegment === seg.id;
              return (
                <button
                  key={seg.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveSegment(seg.id)}
                  className={`feed-preview__tab${isActive ? " feed-preview__tab--active" : ""}`}
                >
                  {segLabel} ({count})
                </button>
              );
            })}
          </div>

          {visibleClips.length === 0 ? (
            <p className="text-sm text-zinc-500 py-6 text-center">
              {isEn ? "No clips in this category." : "No hay clips en esta categoria."}
            </p>
          ) : (
            <div className="feed-preview__grid">
              {visibleClips.map((clip) => (
                <FeedVideoCard
                  key={clip.id}
                  clip={clip}
                  isEn={isEn}
                  isPlaying={playingId === clip.id}
                  onTogglePlay={handleTogglePlay}
                />
              ))}
            </div>
          )}
          <p className="mt-3 text-[11px] text-zinc-600">
            {isEn
              ? `${visibleClips.length} clips · ${allClips.length} total in feed`
              : `${visibleClips.length} clips · ${allClips.length} en el feed`}
          </p>
        </div>
      ) : null}
    </section>
  );
}
