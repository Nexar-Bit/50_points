"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, RotateCcw, Play, Volume2, VolumeX } from "lucide-react";
import ModalityPageShell from "@/frontend/components/modalities/ModalityPageShell";
import AppPageHeader from "@/frontend/components/layout/AppPageHeader";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import {
  readPersistedModality,
  isValidModalityId,
} from "@/frontend/lib/gameModalities";

const STORAGE_KEY = "50pts-feed-hidden-sections";

const MOCK_SECTIONS = [
  {
    id: "hot-players",
    labelKey: "feed.sectionHotPlayers",
    videos: [
      { id: "v1", title: "FullPoint_King sube 12 posiciones", url: "", thumbnail: "" },
      { id: "v2", title: "Golden_Track gana con Smart Pick", url: "", thumbnail: "" },
    ],
  },
  {
    id: "live-races",
    labelKey: "feed.sectionLiveRaces",
    videos: [
      { id: "v3", title: "Carrera 5 — Gulfstream Park EN VIVO", url: "", thumbnail: "" },
      { id: "v4", title: "Carrera 3 — Churchill Downs", url: "", thumbnail: "" },
    ],
  },
  {
    id: "trending",
    labelKey: "feed.sectionTrending",
    videos: [
      { id: "v5", title: "Top 10 jugadas de la semana", url: "", thumbnail: "" },
      { id: "v6", title: "Estrategia Dual Point explicada", url: "", thumbnail: "" },
    ],
  },
  {
    id: "ads",
    labelKey: "feed.sectionFeatured",
    videos: [
      { id: "v7", title: "Registro gratuito — 50 Points", url: "", thumbnail: "" },
    ],
  },
];

function useHiddenSections() {
  const [hidden, setHidden] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const hide = useCallback((id) => {
    setHidden((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const restore = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHidden([]);
  }, []);

  return { hidden, hide, restore };
}

function VideoPlaceholder({ video, active }) {
  const ref = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (active) {
      el.play?.().catch(() => {});
    } else {
      el.pause?.();
    }
  }, [active]);

  if (!video.url) {
    return (
      <div className="feed-video-placeholder" aria-label={video.title}>
        <span className="feed-video-placeholder__icon">
          <Play size={32} strokeWidth={1.5} />
        </span>
        <p className="feed-video-placeholder__title">{video.title}</p>
      </div>
    );
  }

  return (
    <div className="feed-video-wrap">
      <video
        ref={ref}
        src={video.url}
        loop
        playsInline
        muted={muted}
        className="feed-video"
        poster={video.thumbnail || undefined}
      />
      <button
        type="button"
        className="feed-video__mute-btn"
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Activar sonido" : "Silenciar"}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
      <p className="feed-video__caption">{video.title}</p>
    </div>
  );
}

function FeedItem({ video, sectionId }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting && entry.intersectionRatio >= 0.6),
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="feed-item">
      <VideoPlaceholder video={video} active={active} />
    </div>
  );
}

function FeedSection({ section, t, onHide }) {
  const label = t(section.labelKey) || section.id;
  return (
    <section className="feed-section">
      <div className="feed-section__head">
        <h2 className="feed-section__title">{label}</h2>
        <button
          type="button"
          className="feed-section__close"
          onClick={() => onHide(section.id)}
          aria-label={`Ocultar sección ${label}`}
        >
          <X size={14} />
          <span className="sr-only">Cerrar</span>
        </button>
      </div>
      <div className="feed-section__items">
        {section.videos.map((v) => (
          <FeedItem key={v.id} video={v} sectionId={section.id} />
        ))}
      </div>
    </section>
  );
}

export default function FeedPageClient() {
  const { t } = useLanguage();
  const { hidden, hide, restore } = useHiddenSections();
  const modalityId = isValidModalityId(null) ? null : readPersistedModality() || "free";

  const visible = MOCK_SECTIONS.filter((s) => !hidden.includes(s.id));

  return (
    <ModalityPageShell modalityId={modalityId} className="feed-page">
      <AppPageHeader
        title={t("feed.title") || "FEED"}
        subtitle={t("feed.subtitle") || "Jugadores, tendencias y carreras en vivo"}
        filters={
          hidden.length > 0 ? (
            <button
              type="button"
              className="feed-restore-btn"
              onClick={restore}
            >
              <RotateCcw size={12} />
              {t("feed.restoreSections") || "Restaurar secciones"}
            </button>
          ) : null
        }
      />

      <div className="feed-page__content">
        {visible.length === 0 ? (
          <div className="feed-empty">
            <p>{t("feed.allHidden") || "Todas las secciones están ocultas."}</p>
            <button type="button" className="feed-restore-btn" onClick={restore}>
              <RotateCcw size={14} />
              {t("feed.restoreSections") || "Restaurar secciones"}
            </button>
          </div>
        ) : (
          visible.map((section) => (
            <FeedSection
              key={section.id}
              section={section}
              t={t}
              onHide={hide}
            />
          ))
        )}
      </div>
    </ModalityPageShell>
  );
}
