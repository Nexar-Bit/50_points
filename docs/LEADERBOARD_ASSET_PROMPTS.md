# Leaderboard page assets — AI image prompts

Generate each image separately. Save into `public/Img/leaderboard/` using the **exact filenames** below.

**Global style (50 Points esports brand):** Solid pitch-black background (`#000000`), ultra high contrast, cinematic 8K digital art. Neon purple `#8B2CFF`, electric cyan `#22D3EE`, gold `#FBBF24`, emerald victory accents. Electric plasma + lightning textures, horizontal lens flares, smoke particles, glassmorphism-friendly dark UI. Horse-racing tournament leaderboard mood. **4K PNG**, no watermarks.

Register keys in `src/frontend/lib/config/leaderboardAssets.js`. Load via `leaderboardAsset(key)`.

Verify after generation:

```bash
npm run verify:leaderboard-assets
```

---

## Master style prefix (paste before every prompt)

```
Premium esports horse-racing tournament leaderboard UI art, "50 Points" brand aesthetic.
Solid pitch-black background (#000000), ultra high contrast, cinematic 8K digital art.
Neon purple (#8B2CFF), electric cyan (#22D3EE), gold (#FBBF24), silver (#94A3B8), bronze (#D97706).
Electric plasma and lightning textures, horizontal lens flares, smoke particle dispersion,
glass dark UI panels, volumetric purple fog, championship podium energy.
Futuristic gaming UI, cyberpunk horse-racing mood. No watermarks, no extra logos, PNG output.
```

**Session consistency line:**

```
Same art direction as previous image: identical black background, identical neon intensity and plasma texture language — only change the hero subject and metal tier color (gold/silver/bronze/purple).
```

---

## Master reference mockup (generate first)

### `leaderboard-master-reference.png` (reference only — not in asset registry)

> [MASTER STYLE PREFIX] Full leaderboard page reference on black: wide hero with purple energy and trophy motif, center podium for ranks 1-2-3 (gold center taller), below a dark glass ranking table with purple header glow and neon row highlights. Esports CLASIFICACION page mockup, 16:9, 3840×2160, PNG. Reference sheet only.

---

## Page atmosphere

### `leaderboard-hero-bg.png` → `heroBg`

> [MASTER STYLE PREFIX] Wide cinematic **leaderboard hero background** for horse-racing tournament app. Abstract futuristic stadium at night, purple and gold light leaks, ascending rank bars and trophy silhouettes in bokeh, deep black-to-midnight gradient, volumetric purple fog at top third. **No UI, no text, no logos.** Safe for heavy CSS dark scrim overlay. 21:9 (3840×1646) or 16:9, PNG, 4K.

### `leaderboard-rank-flare.png` → `rankFlare`

> [MASTER STYLE PREFIX] Horizontal **purple neon lens flare streak** on transparent background, soft bloom, esports rank highlight accent, centered, PNG alpha, 1920×200, 4K.

---

## Podium cards (top 3)

Full-bleed backgrounds for podium cards — **no baked player names or points** (CSS overlays text).

### `leaderboard-podium-gold.png` → `podiumGold`

> [MASTER STYLE PREFIX] Full-bleed **1st place podium card background**. Radiant gold (#FBBF24) plasma energy burst from bottom, purple ambient fog at top, subtle checkered flag bokeh, championship spotlight from above, dark glass lower scrim for text. Portrait-friendly 3:4 (1200×1600), PNG, no text, 4K.

### `leaderboard-podium-silver.png` → `podiumSilver`

> [MASTER STYLE PREFIX] Full-bleed **2nd place podium card background**. Cool silver (#94A3B8) plasma and cyan edge glow, dark midnight base, subtle metallic streaks, same layout language as gold version but silver tier. 3:4 PNG, no text, 4K.

### `leaderboard-podium-bronze.png` → `podiumBronze`

> [MASTER STYLE PREFIX] Full-bleed **3rd place podium card background**. Warm bronze (#D97706) plasma energy, amber rim light, dark base, same framing as gold/silver variants. 3:4 PNG, no text, 4K.

### `leaderboard-crown-glow.png` → `crownGlow`

> [MASTER STYLE PREFIX] **Golden crown** with intense purple-gold neon glow and spark particles, isolated on **transparent** background, esports #1 rank icon, 512×512 PNG alpha, 4K.

---

## Rankings table

### `leaderboard-table-header-bg.png` → `tableHeaderBg`

> [MASTER STYLE PREFIX] Wide horizontal **dark glass table header texture**, subtle purple neon bottom border, abstract ascending bar chart motif (no readable text), seamless left-to-right, 16:2 (1920×240), PNG, 4K.

### `leaderboard-streak-flame.png` → `streakFlame`

> [MASTER STYLE PREFIX] **Orange-gold streak flame icon** with neon glow, isolated on transparent background, small UI icon for win streak column, 256×256 PNG alpha, 4K.

### `leaderboard-empty-state.png` → `emptyState`

> [MASTER STYLE PREFIX] **Empty leaderboard illustration** on black: faint purple trophy outline, dashed rank rows fading into fog, minimalist esports UI, hopeful tournament mood. **No text.** 4:3 (1600×1200), PNG, 4K.

---

## Strategy logos (home + leaderboard cross-use)

These live in `public/Img/point-modality/` — see `docs/POINT_MODALITY_ASSET_PROMPTS.md`:

| Key | Filename |
|-----|----------|
| `btnFullPoint` | `point-btn-full-point.png` |
| `btnDualPoint` | `point-btn-dual-point.png` |
| `btnSmartPoint` | `point-btn-smart-point.png` |

Used by `StrategyPointLogo.jsx` on the home tournament plays section.

---

## Hall of Fame cross-assets (optional fallbacks)

If podium PNGs are not ready, the page still works via CSS. Optional richer icons from `public/Img/hof/`:

- `crown-gold.png`, `trophy-gold.png`, `trophy-silver-2.png`, `trophy-bronze-3.png`
- `rank-banner-gold.png`, `rank-banner-silver.png`, `rank-banner-bronze.png`

---

## Usage in codebase

| Component | Helper | Keys |
|-----------|--------|------|
| `LeaderboardPageClient.jsx` | `leaderboardAsset`, `leaderboardPodiumAsset` | `heroBg`, `podiumGold`, `tableHeaderBg`, … |
| `StrategyPointLogo.jsx` | `pointBtnAsset` | `btnFullPoint`, `btnDualPoint`, `btnSmartPoint` |

```js
import { leaderboardAsset, leaderboardPodiumAsset } from "@/frontend/lib/config/leaderboardAssets";

leaderboardAsset("heroBg");
leaderboardPodiumAsset(1); // gold
```

---

## Generation order

1. `leaderboard-hero-bg.png`
2. `leaderboard-podium-gold.png` → silver → bronze (recolor session)
3. `leaderboard-table-header-bg.png`
4. `leaderboard-crown-glow.png`, `leaderboard-streak-flame.png`
5. `point-btn-*.png` in `point-modality/` for strategy logos
