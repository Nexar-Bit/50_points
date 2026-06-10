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

  const handleToggle = () => {
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
    <article className="feed-video-card snap-start shrink-0 w-36 sm:w-44">
      <button
        type="button"
        className="feed-video-card__frame"
        onClick={handleToggle}
        aria-label={isEn ? `Play ${clip.titleEn}` : `Reproducir ${clip.titleEs}`}
      >
        <video
          ref={videoRef}
          className="feed-video-card__video"
          src={clip.src}
          muted
          playsInline
          loop
          preload="metadata"
        />
        <span className="feed-video-card__shade" aria-hidden />
        <span className="feed-video-card__play" aria-hidden>
          {isPlaying ? (
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
  const [closedSegments, setClosedSegments] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  const activeVideoRef = useRef(null);

  const allClips = useMemo(() => getFeedVideos(), []);

  const activeSegment = SEGMENTS.find((s) => !closedSegments.includes(s.id)) || SEGMENTS[0];
  const label = isEn ? activeSegment.labelEn : activeSegment.labelEs;

  const visibleClips = useMemo(() => {
    const openSegmentIds = SEGMENTS.map((s) => s.id).filter((id) => !closedSegments.includes(id));
    const segments = openSegmentIds.length ? openSegmentIds : [SEGMENTS[0].id];
    return allClips.filter((clip) => segments.includes(clip.segment));
  }, [allClips, closedSegments]);

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
        <div className="mt-3 rounded-2xl border border-white/10 bg-black/40 p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {SEGMENTS.map((seg) => {
              const closed = closedSegments.includes(seg.id);
              const segLabel = isEn ? seg.labelEn : seg.labelEs;
              const count = allClips.filter((c) => c.segment === seg.id).length;
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() =>
                    setClosedSegments((prev) =>
                      closed ? prev.filter((id) => id !== seg.id) : [...prev, seg.id],
                    )
                  }
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    closed
                      ? "border-white/10 text-zinc-600 line-through"
                      : "border-purple/40 text-purple-light bg-purple/10"
                  }`}
                >
                  {segLabel} ({count}) {closed ? "×" : ""}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-zinc-500 mb-3">{label}</p>
          {visibleClips.length === 0 ? (
            <p className="text-sm text-zinc-500 py-6 text-center">
              {isEn ? "Enable a category to see clips." : "Activa una categoria para ver clips."}
            </p>
          ) : (
            <div className="feed-preview__rail">
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
              ? `${allClips.length} clips from the community feed`
              : `${allClips.length} clips del feed de la comunidad`}
          </p>
        </div>
      ) : null}
    </section>
  );
}
