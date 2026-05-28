"use client";

import { useCallback, useEffect, useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Crown,
  Trophy,
  Calendar,
  Target,
  Flame,
  BarChart3,
  Award,
} from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { fetchAuthJson } from "@/frontend/lib/api/client";
import { logoFile, staticFile } from "@/frontend/lib/config/paths";
import { avatarForPlayer } from "@/frontend/lib/data/hallOfFameData";
import {
  buildHallOfFameEntry,
  HOF_ENTRY_STORAGE_KEY,
} from "@/frontend/lib/data/hallOfFameEntry";

const STEP_COUNT = 6;

function Frame({ children, step, className = "" }) {
  return (
    <div className={`hof-entry-card ${className}`.trim()} data-step={step}>
      <div className="hof-entry-card__glow" aria-hidden />
      <div className="hof-entry-card__inner">{children}</div>
    </div>
  );
}

export default function HallOfFameEntryModals() {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [entry, setEntry] = useState(() => buildHallOfFameEntry({ isEn }));

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(HOF_ENTRY_STORAGE_KEY) === "1") return;
    const timer = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setEntry(buildHallOfFameEntry({ isEn }));
      return;
    }
    fetchAuthJson("/profile")
      .then((profile) => setEntry(buildHallOfFameEntry({ user, profile, isEn })))
      .catch(() => setEntry(buildHallOfFameEntry({ user, isEn })));
  }, [isAuthenticated, user, isEn]);

  const close = useCallback(() => {
    setOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(HOF_ENTRY_STORAGE_KEY, "1");
    }
  }, []);

  const next = () => {
    if (step >= STEP_COUNT - 1) close();
    else setStep((s) => s + 1);
  };

  const prev = () => setStep((s) => Math.max(0, s - 1));

  if (!open) return null;

  const avatar = avatarForPlayer(entry.username, entry.avatarColor);

  return (
    <div className="hof-entry-overlay" role="dialog" aria-modal="true" aria-labelledby="hof-entry-title">
      <button type="button" className="hof-entry-overlay__backdrop" onClick={close} aria-label={t("common.close")} />
      <div className="hof-entry-overlay__panel">
        <button type="button" className="hof-entry-overlay__close" onClick={close} aria-label={t("common.close")}>
          <X className="w-5 h-5" />
        </button>

        <div className="hof-entry-overlay__progress">
          {Array.from({ length: STEP_COUNT }).map((_, i) => (
            <span key={i} className={`hof-entry-overlay__dot${i === step ? " hof-entry-overlay__dot--active" : ""}${i < step ? " hof-entry-overlay__dot--done" : ""}`} />
          ))}
        </div>

        <div className="hof-entry-overlay__slide">
          {step === 0 && (
            <Frame step={0} className="hof-entry-card--official">
              <Crown className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
              <h2 id="hof-entry-title" className="hof-entry-card__title hof-entry-card__title--silver">
                {t("hallOfFame.entry.hofTitle")}
              </h2>
              <p className="hof-entry-card__eyebrow">{t("hallOfFame.entry.officialConfirmed")}</p>
              <div className="hof-entry-official__profile">
                <img src={avatar} alt="" className="hof-entry-official__avatar" />
                <p className="hof-entry-official__name">{entry.username}</p>
              </div>
              <img src={logoFile()} alt="" className="hof-entry-official__logo" />
              <p className="hof-entry-card__body">{t("hallOfFame.entry.archivedMessage")}</p>
              <div className="hof-entry-official__feat-box">
                <p className="hof-entry-official__feat-label">{t("hallOfFame.entry.playForEntry")}</p>
                <div className="hof-entry-official__feat-row">
                  <Trophy className="w-5 h-5 text-zinc-300 shrink-0" />
                  <span>{entry.feat.name.toUpperCase()}</span>
                </div>
              </div>
              <p className="hof-entry-official__first">
                {t("hallOfFame.entry.firstToAchieve")} <strong>{entry.username}</strong>
              </p>
              <p className="hof-entry-official__date">
                <Calendar className="w-3.5 h-3.5 inline mr-1" />
                {entry.feat.date}
              </p>
              <p className="hof-entry-official__legend">{t("hallOfFame.entry.newLegend")}</p>
            </Frame>
          )}

          {step === 1 && (
            <Frame step={1} className="hof-entry-card--congrats">
              <h2 className="hof-entry-card__title">{t("hallOfFame.entry.hofTitle")}</h2>
              <p className="hof-entry-card__eyebrow hof-entry-card__eyebrow--gold">
                {t("hallOfFame.entry.firstForever")}
              </p>
              <div className="hof-entry-congrats__layout">
                <div className="hof-entry-congrats__left">
                  <img src={avatar} alt="" className="hof-entry-congrats__avatar" />
                  <p className="hof-entry-congrats__name">{entry.username}</p>
                  <p className="hof-entry-congrats__title">{entry.title}</p>
                  <div className="hof-entry-congrats__badge">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="hof-entry-congrats__badge-feat">{entry.feat.name}</p>
                      <p className="hof-entry-congrats__badge-date">{entry.feat.date}</p>
                    </div>
                  </div>
                </div>
                <div className="hof-entry-congrats__right">
                  <p className="hof-entry-congrats__greet">
                    {isEn ? "CONGRATULATIONS" : "FELICIDADES"} {entry.username}
                  </p>
                  <p className="hof-entry-card__body">{t("hallOfFame.entry.congratsBody")}</p>
                  <div className="hof-entry-congrats__divider" aria-hidden />
                  <p className="hof-entry-card__body">{t("hallOfFame.entry.congratsClosing")}</p>
                  <img src={logoFile()} alt="" className="hof-entry-congrats__logo" />
                </div>
              </div>
            </Frame>
          )}

          {step === 2 && (
            <Frame step={2} className="hof-entry-card--ticket">
              <p className="hof-entry-ticket__header">
                <span className="hof-entry-ticket__num">2</span>
                {entry.ticket.label}
              </p>
              <div className="hof-entry-ticket__split">
                <div className="hof-entry-ticket__paper">
                  <p className="hof-entry-ticket__brand">MY 50 POINTS</p>
                  <p className="hof-entry-ticket__play-type">{entry.ticket.play}</p>
                  <p className="hof-entry-ticket__line">
                    {entry.ticket.track} · {entry.ticket.date}
                  </p>
                  <p className="hof-entry-ticket__line">{entry.ticket.race}</p>
                  <p className="hof-entry-ticket__line">
                    {isEn ? "HORSE #" : "CABALLO #"} {entry.ticket.horseNumber} · {entry.ticket.horse}
                  </p>
                  <p className="hof-entry-ticket__line">
                    {isEn ? "PLAY:" : "JUGADA:"} {entry.ticket.play}
                  </p>
                  <p className="hof-entry-ticket__line">
                    {isEn ? "VALUE:" : "VALOR:"} {entry.ticket.points} PTS
                  </p>
                  <p className="hof-entry-ticket__ticket-no">TICKET Nº {entry.ticket.ticketNo}</p>
                  <p className="hof-entry-ticket__tagline">{entry.ticket.tagline}</p>
                </div>
                <div className="hof-entry-ticket__art">
                  <img src={staticFile("/images/icons/icon-horse.png")} alt="" className="hof-entry-ticket__horse" />
                  <p className="hof-entry-ticket__verse">
                    {t("hallOfFame.entry.ticketVerse1")}
                    <br />
                    {t("hallOfFame.entry.ticketVerse2")}
                    <br />
                    <span>{t("hallOfFame.entry.ticketVerse3")}</span>
                  </p>
                  <img src={logoFile()} alt="" className="hof-entry-ticket__logo-sm" />
                </div>
              </div>
            </Frame>
          )}

          {step === 3 && (
            <Frame step={3} className="hof-entry-card--feat">
              <p className="hof-entry-feat__label">{t("hallOfFame.entry.featReason")}</p>
              <Trophy className="w-12 h-12 text-amber-400 mx-auto my-3" />
              <h3 className="hof-entry-feat__name">{entry.feat.name}</h3>
              <p className="hof-entry-card__body text-center">{entry.feat.desc}</p>
              <div className="hof-entry-feat__meta">
                <span><Calendar className="w-3.5 h-3.5" /> {entry.feat.date}</span>
                <span><Target className="w-3.5 h-3.5" /> {entry.ticket.track}</span>
                <span><Award className="w-3.5 h-3.5" /> {entry.ticket.play}</span>
              </div>
              <blockquote className="hof-entry-feat__quote">{entry.featQuote}</blockquote>
            </Frame>
          )}

          {step === 4 && (
            <Frame step={4} className="hof-entry-card--profile">
              <div className="hof-entry-profile-grid">
                <div className="hof-entry-profile-col">
                  <p className="hof-entry-profile-col__title">{t("hallOfFame.entry.playerProfile")}</p>
                  <img src={avatar} alt="" className="hof-entry-profile-col__avatar" />
                  <p className="hof-entry-profile-col__name">{entry.username}</p>
                  <p className="hof-entry-profile-col__role">{entry.title}</p>
                  <p className="hof-entry-profile-col__since">
                    {t("hallOfFame.entry.memberSince")} {entry.memberSince}
                  </p>
                  <p className="hof-entry-profile-col__quote">&ldquo;{entry.quote}&rdquo;</p>
                  <div className="hof-entry-profile-stats">
                    <div><Trophy className="w-3.5 h-3.5" /><span>{entry.stats.tournamentsWon}</span></div>
                    <div><Target className="w-3.5 h-3.5" /><span>{entry.stats.winningPlays}</span></div>
                    <div><Award className="w-3.5 h-3.5" /><span>{entry.stats.accumulatedPts.toLocaleString()}</span></div>
                    <div><Flame className="w-3.5 h-3.5" /><span>{entry.stats.maxStreak}</span></div>
                  </div>
                </div>
                <div className="hof-entry-profile-col">
                  <p className="hof-entry-profile-col__title">{t("hallOfFame.entry.historicStats")}</p>
                  <ul className="hof-entry-historic-list">
                    <li><BarChart3 className="w-3.5 h-3.5" /> {t("hallOfFame.entry.bestPosition")}: {entry.stats.bestPosition}</li>
                    <li><Target className="w-3.5 h-3.5" /> {t("hallOfFame.entry.accuracy")}: {entry.stats.accuracy}</li>
                    <li><Award className="w-3.5 h-3.5" /> {t("hallOfFame.entry.favoritePlay")}: {entry.stats.favoritePlay}</li>
                    <li><img src={staticFile("/images/icons/icon-horse.png")} alt="" className="w-3.5 h-3.5 object-contain" /> {t("hallOfFame.entry.starHorse")}: {entry.stats.starHorse}</li>
                    <li><Trophy className="w-3.5 h-3.5" /> {t("hallOfFame.entry.favoriteTrack")}: {entry.stats.favoriteTrack}</li>
                  </ul>
                </div>
              </div>
            </Frame>
          )}

          {step === 5 && (
            <Frame step={5} className="hof-entry-card--thanks">
              <p className="hof-entry-thanks__ribbon">04</p>
              <Crown className="w-10 h-10 text-amber-400 mx-auto" />
              <h2 className="hof-entry-thanks__title">{t("hallOfFame.entry.thanksTitle")}</h2>
              <p className="hof-entry-thanks__sub">{t("hallOfFame.entry.thanksSub")}</p>
              <p className="hof-entry-card__body">{t("hallOfFame.entry.thanksBody1")}</p>
              <p className="hof-entry-card__body">{t("hallOfFame.entry.thanksBody2")}</p>
              <p className="hof-entry-card__body hof-entry-thanks__closing">{t("hallOfFame.entry.thanksClosing")}</p>
              <img src={logoFile()} alt="" className="hof-entry-thanks__logo" />
              <p className="hof-entry-thanks__footer">{t("hallOfFame.entry.firstForever")}</p>
            </Frame>
          )}
        </div>

        <div className="hof-entry-overlay__nav">
          <button type="button" className="hof-entry-nav-btn" onClick={prev} disabled={step === 0}>
            <ChevronLeft className="w-4 h-4" />
            {t("hallOfFame.entry.back")}
          </button>
          <button type="button" className="hof-entry-nav-btn hof-entry-nav-btn--primary" onClick={next}>
            {step >= STEP_COUNT - 1 ? t("hallOfFame.entry.enter") : t("hallOfFame.entry.next")}
            {step < STEP_COUNT - 1 ? <ChevronRight className="w-4 h-4" /> : null}
          </button>
        </div>
      </div>
    </div>
  );
}
