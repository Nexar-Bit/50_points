"use client";

import { Lock } from "lucide-react";

const UNLOCKED_STYLES = [
  { border: "#fbbf24", glow: "rgba(251, 191, 36, 0.35)" },
  { border: "#06b6d4", glow: "rgba(6, 182, 212, 0.35)" },
  { border: "#f97316", glow: "rgba(249, 115, 22, 0.35)" },
  { border: "#ef4444", glow: "rgba(239, 68, 68, 0.35)" },
  { border: "#a855f7", glow: "rgba(168, 85, 247, 0.35)" },
];

export default function HallOfFameAchievementGrid({ achievements, isEn, lockedLabel }) {
  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);
  const lockedSlots = Math.max(24, locked.length);

  return (
    <section className="hof-achievements">
      <div className="hof-achievements__unlocked">
        {unlocked.map((item, index) => {
          const style = UNLOCKED_STYLES[index % UNLOCKED_STYLES.length];
          const Icon = item.icon;
          return (
            <article
              key={item.id}
              className="hof-achievements__card hof-achievements__card--unlocked"
              style={{
                borderColor: style.border,
                boxShadow: `0 0 24px ${style.glow}, inset 0 0 20px ${style.glow}`,
              }}
            >
              <div className="hof-achievements__icon-wrap" style={{ color: style.border }}>
                <Icon className="w-7 h-7" strokeWidth={1.75} />
              </div>
              <h3 className="hof-achievements__card-title">{isEn ? item.nameEn : item.name}</h3>
              <p className="hof-achievements__card-desc">{isEn ? item.descEn : item.desc}</p>
              {item.holder && (
                <p className="hof-achievements__card-meta">{item.holder}</p>
              )}
            </article>
          );
        })}
      </div>

      <div className="hof-achievements__locked-grid">
        {Array.from({ length: lockedSlots }).map((_, i) => {
          const item = locked[i];
          return (
            <div key={item?.id ?? `locked-${i}`} className="hof-achievements__card hof-achievements__card--locked">
              <Lock className="w-5 h-5 text-zinc-600" aria-hidden />
              <span className="sr-only">{lockedLabel}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
