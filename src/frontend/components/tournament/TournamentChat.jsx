"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Flame, Crown, Star, Zap, Gem } from "lucide-react";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";

const TIER_ICONS = {
  star: Star,
  bolt: Zap,
  gem: Gem,
};

const mockMessages = [
  {
    id: 1,
    user: "TurfMaster_BR",
    message: "Full Point en la carrera 5, vamos a ver!",
    time: "14:32",
    isHot: true,
    tier: "star",
  },
  {
    id: 2,
    user: "Jinete_Oscuro",
    message: "Smart Pick es la estrategia segura hoy",
    time: "14:33",
  },
  {
    id: 3,
    user: "ADMIN",
    message: "Carrera 4 comienza en 5 minutos! Confirmen sus picks!",
    time: "14:34",
    isAdmin: true,
  },
  {
    id: 4,
    user: "Golden_Track",
    message: "Thunder Strike tiene las mejores odds",
    time: "14:35",
    tier: "gem",
  },
  {
    id: 5,
    user: "FullPoint_King",
    message: "Subí 12 posiciones con un Full Point!",
    time: "14:36",
    isHot: true,
    tier: "bolt",
  },
  {
    id: 6,
    user: "DualForce_99",
    message: "Alguien más usando Dual en la 6?",
    time: "14:37",
  },
  {
    id: 7,
    user: "ADMIN",
    message: "Resultado Carrera 3: Thunder Strike ganó pagando 4.20!",
    time: "14:38",
    isAdmin: true,
  },
  {
    id: 8,
    user: "SmartPick_Pro",
    message: "Mi ticket 2 está en el top 15, vamos!",
    time: "14:39",
  },
];

function avatarHue(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i += 1) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

function avatarInitials(username) {
  if (username === "ADMIN") return "AD";
  const parts = username.split(/[_\s-]+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return `${first}${second}`.toUpperCase();
}

function ChatMessage({ msg }) {
  const TierIcon = msg.tier ? TIER_ICONS[msg.tier] : null;
  const hue = avatarHue(msg.user);

  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={[
        "tournament-chat__message",
        msg.isAdmin ? "tournament-chat__message--admin" : "",
        msg.isHot && !msg.isAdmin ? "tournament-chat__message--hot" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="tournament-chat__avatar"
        style={{ "--chat-avatar-hue": hue }}
        aria-hidden
      >
        <span>{avatarInitials(msg.user)}</span>
      </div>

      <div className="tournament-chat__body">
        <header className="tournament-chat__meta">
          <div className="tournament-chat__identity">
            <span
              className={[
                "tournament-chat__username",
                msg.isAdmin ? "tournament-chat__username--admin" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {msg.user}
            </span>
            {msg.isAdmin ? (
              <Crown className="tournament-chat__badge tournament-chat__badge--admin" aria-hidden />
            ) : null}
            {TierIcon ? (
              <TierIcon
                className={`tournament-chat__badge tournament-chat__badge--${msg.tier}`}
                aria-hidden
              />
            ) : null}
            {msg.isHot && !msg.isAdmin ? (
              <Flame className="tournament-chat__badge tournament-chat__badge--hot" aria-hidden />
            ) : null}
          </div>
          <time className="tournament-chat__time" dateTime={msg.time}>
            {msg.time}
          </time>
        </header>
        <p className="tournament-chat__text">{msg.message}</p>
      </div>
    </motion.article>
  );
}

export default function TournamentChat({ variant = "embedded" }) {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");

  return (
    <div
      className={[
        "tournament-chat",
        variant === "leaderboard" ? "tournament-chat--leaderboard" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="tournament-chat__feed" role="log" aria-live="polite">
        {mockMessages.map((msg) => (
          <ChatMessage key={msg.id} msg={msg} />
        ))}
      </div>

      <form
        className="tournament-chat__composer"
        onSubmit={(event) => {
          event.preventDefault();
          setMessage("");
        }}
      >
        <label className="sr-only" htmlFor="tournament-chat-input">
          {t("chatPage.inputPlaceholder")}
        </label>
        <input
          id="tournament-chat-input"
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={t("chatPage.inputPlaceholder")}
          className="tournament-chat__input"
          autoComplete="off"
        />
        <button type="submit" className="tournament-chat__send" aria-label={t("chatPage.send")}>
          <Send aria-hidden />
        </button>
      </form>

      <p className="tournament-chat__disclaimer">{t("chatPage.disclaimer")}</p>
    </div>
  );
}
