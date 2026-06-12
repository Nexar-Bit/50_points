# Point modality UI assets — AI image prompts

Generate each image separately. Save into `public/Img/point-modality/` using the **exact filenames** below.

**Global style (50 Points esports brand):** Solid pitch-black background (`#000000`), ultra high contrast, cinematic 8K digital art. Bold **italic condensed sans-serif** (Eurostile Extended feel). Electric **plasma + lightning** textures, horizontal lens flares, smoke particle dispersion, motion-blur streaks, neon bloom. Strict color system:

| Mode | Primary | Glow |
|------|---------|------|
| **Full Point** | `#7C3AED` / `#8B2CFF` | `#C084FC` |
| **Dual Point** | `#06B6D4` / `#22D3EE` | `#67E8F9` |
| **Smart Point** | `#F59E0B` / `#FBBF24` | `#FDE047` |

Recommended: **4K**, **PNG**, **no watermarks**. Strategy picker buttons also have legacy filenames in `public/Img/ticket-workflow/` — see [Strategy buttons (ticket workflow)](#strategy-buttons-ticket-workflow-legacy).

Register keys in `src/frontend/lib/config/pointModalityAssets.js`. Load via `pointModalityAsset(key)`.

Verify after generation:

```bash
npm run verify:point-modality-assets
```

---

## Master style prefix (paste before every prompt)

```
Premium esports horse-racing tournament UI art, "50 Points" brand aesthetic.
Solid pitch-black background (#000000), ultra high contrast, cinematic 8K digital art.
Typography: bold italic condensed sans-serif (Eurostile Extended style), sharp edges, slight outer glow.
Visual effects: electric purple/cyan/gold plasma energy, internal lightning bolt textures,
horizontal lens flares, smoke particle dispersion, motion blur streaks, neon bloom, volumetric light.
Color system strictly: Full Point = vibrant neon purple (#A855F7 / #8B2CFF),
Dual Point = electric cyan (#22D3EE / #06B6D4), Smart Point = golden yellow-orange (#FBBF24 / #F59E0B).
Futuristic gaming UI, cyberpunk horse-racing mood, aggressive tournament energy.
No watermarks, no extra logos, clean edges, PNG output.
```

**Session consistency line** (add when generating a set):

```
Same art direction as previous image: identical black background, identical font weight and italic angle,
identical lightning/plasma texture language, identical neon intensity — only change the hero subject and accent color.
```

---

## Master reference mockup (generate first)

### `point-master-reference-mockup.png` → `masterReference`

> [MASTER STYLE PREFIX] Full-screen reference board showing the complete 50 Points modality visual language on black: top row three horizontal plasma buttons FULL POINT (purple) / DUAL POINT (cyan) / SMART POINT (gold); center hero "50 + FULL POINT" wordmark with purple lightning; bottom strip cyberpunk horse race finish line with neon grandstand. Unified esports tournament branding sheet, 16:9, 3840×2160, PNG. **Reference only** — not used in production UI.

---

## Hero wordmarks & decision graphics

### `point-hero-full-point.png` → `heroFullPoint`

> [MASTER STYLE PREFIX] Centered hero logo on pure black. Large white italic bold "FULL POINT", smaller white italic "50 PUNTOS" below. Intense neon purple energy smoke and electric particles flanking left and right, sharp horizontal purple lens flares through text. Subtle metallic letterform texture, purple neon underglow. Logo-only, no buttons. 16:9, 3840×2160, PNG.

### `point-hero-50-full-point-decides.png` → `hero50FullPointDecides`

> [MASTER STYLE PREFIX] Tournament decision splash, black background. Large white italic "50" left, "+" separator, white italic "FULL POINT" right. Below: purple "50 PUNTOS", white "TÚ DECIDES", thin purple divider. Purple lightning bolts on far left and right, purple smoke at sides. Esports poster layout, centered. 16:9, 4K PNG.

### `point-hero-una-decision.png` → `heroUnaDecision`

> [MASTER STYLE PREFIX] Horizontal decision banner, black background. Centered large white italic "UNA DECISIÓN", thin purple rule below, small purple "50 PUNTOS" underneath. Vibrant purple nebula smoke on left and right edges only. Minimal, high contrast. 3:1 (1920×640), PNG.

---

## Three-mode selector bars

### `point-selector-bar-horizontal.png` → `selectorBarHorizontal`

> [MASTER STYLE PREFIX] Horizontal game mode selector on black. Three equal rounded rectangles in one row inside a single thin glowing white neon rounded border. Left: deep purple plasma + lightning, white italic "FULL POINT". Center: cyan plasma + lightning, white italic "DUAL POINT". Right: gold plasma + lightning, white italic "SMART POINT". Matching neon border glow per segment. Front view UI asset. 21:9 (2520×1080), PNG.

### `point-selector-bar-stacked.png` → `selectorBarStacked`

> [MASTER STYLE PREFIX] Vertical stack of three horizontal stripes on black forming one UI block. Top stripe solid deep purple, white italic "FULL POINT". Middle stripe solid teal-cyan, white italic "DUAL POINT". Bottom stripe golden yellow, white italic "SMART POINT". Entire block in thin glowing white neon rectangle border. Flat vector-clean esports UI. 4:3 (1600×1200), PNG.

### `point-selector-bar-scifi-frame.png` → `selectorBarSciFiFrame`

> [MASTER STYLE PREFIX] Futuristic sci-fi UI panel on black. Dark angular metallic frame with gold-orange glow highlights at top and bottom center, lens flare accents. Inside: three stacked horizontal bars — purple lightning "FULL POINT", cyan lightning "DUAL POINT", gold lightning "SMART POINT" — white italic text each. Slight 3D bevel on frame. 9:16 portrait (1080×1920), PNG.

### `point-selector-bar-chevron.png` → `selectorBarChevron`

> [MASTER STYLE PREFIX] Wide horizontal esports nav banner on black. Three chevron segments pointing right in one row, dark metallic frame with gold edge glows. Left chevron purple lightning "FULL POINT", center cyan speed lines "DUAL POINT", right gold sparks "SMART POINT". White italic text. 21:9, 4K PNG.

### `point-selector-bar-energy-aura.png` → `selectorBarEnergyAura`

> [MASTER STYLE PREFIX] Three horizontal text banners on black, vertically spaced. Large white italic text only — "FULL POINT", "DUAL POINT", "SMART POINT" — each surrounded by color-matched energy aura (purple smoke, cyan wisps, orange fire) with horizontal light streaks, no solid rectangle fill. Esports title card style. Combined 16:9 triptych, PNG.

---

## Single-mode plasma buttons (enhanced)

Use these for high-energy strategy pickers. Legacy simpler versions live in `ticket-workflow/` (see below).

### `point-btn-full-point.png` → `btnFullPoint`

> [MASTER STYLE PREFIX] Single horizontal game UI button on black. Rounded rectangle filled with vibrant purple electric plasma and lightning arcs. Bold white italic "FULL POINT" centered. Strong purple neon border glow. Isolated button, generous padding. 2400×480 (4× 600×120), PNG.

### `point-btn-dual-point.png` → `btnDualPoint`

> [MASTER STYLE PREFIX] Single horizontal game UI button on black. Rounded rectangle filled with bright cyan electric plasma and lightning. Bold white italic "DUAL POINT" centered. Cyan neon border glow, slight outer aura. 2400×480, PNG.

### `point-btn-smart-point.png` → `btnSmartPoint`

> [MASTER STYLE PREFIX] Single horizontal game UI button on black. Rounded rectangle filled with golden-yellow fiery plasma and electric sparks. Bold white italic "SMART POINT" centered. Gold-orange neon border glow. 2400×480, PNG.

---

## Tournament splashes & race cinematics

**No UI paragraph text** in race assets — labels come from i18n.

### `point-splash-50-metallic.png` → `splash50Metallic`

> [MASTER STYLE PREFIX] High-octane esports splash on black. Massive 3D metallic "50" with cracked purple stone texture and beveled edges, shattered rock debris, intense purple lightning surrounding the number. Right: bold white italic "FULL POINT" with purple underline. Purple bloom, motion blur streaks. 16:9, 4K PNG.

### `point-race-cyberpunk-finish.png` → `raceCyberpunkFinish`

> [MASTER STYLE PREFIX] Cinematic futuristic horse race at night on wet reflective track. Dark horses, jockeys in glowing cyan/purple/gold gear charging toward golden vertical finish line beam. Rows of purple and blue neon stadium LEDs, black sky, water splashes lit by neon, heavy background motion blur. Optional golden laurel with "1" near finish. **No text.** 16:9, 4K PNG.

### `point-race-ultimate-leaderboard.png` → `raceUltimateLeaderboard`

> [MASTER STYLE PREFIX] Wide cinematic horse race marketing graphic, black-purple atmosphere. Six horses galloping left to right, jockeys in metallic gold, cyan, purple silks. Glowing orange vertical neon finish line right. Speed motion blur, purple-orange light trails. Right: vertical leaderboard column, rows 1–6 as dark glass cards with colored number badges and decorative point values. Top-left gold wreath emblem area. **No readable small copy.** 16:9, 4K PNG.

### `point-race-circular-badge.png` → `raceCircularBadge`

> [MASTER STYLE PREFIX] Circular badge composition on black. Five jockeys on dark horses racing toward golden finish line inside circle. Neon purple/blue stadium lights, wet track reflections, splash particles. Golden vertical finish beam with laurel "1" icon. Circular vignette for app icon or profile badge. 1:1 (2048×2048), PNG. **No text.**

### `point-hud-tri-energy.png` → `hudTriEnergy`

> [MASTER STYLE PREFIX] Futuristic gaming splash on black. Center: bold metallic italic "MY 50 POINTS" inside concentric glowing cyan energy rings. Left: purple electric lightning + wireframe triangle, white italic "FULL POINT". Right: golden fire vortex + geometric shards, white italic "SMART POINT". Bottom: cyan vertical beams + interlocking rings, white italic "DUAL POINT". Sci-fi HUD particles, symmetrical layout. 16:9, 4K PNG.

---

## Strategy buttons (ticket workflow legacy)

These filenames are registered in `ticketWorkflowAssets.js` and used by `RaceCard` / How to Play. Generate with the **same master style** for visual consistency:

| Key | Filename | Folder |
|-----|----------|--------|
| `strategyFullPointBtn` | `strategy-full-point-btn.png` | `ticket-workflow/` |
| `strategyDualPointBtn` | `strategy-dual-point-btn.png` | `ticket-workflow/` |
| `strategySmartPointBtn` | `strategy-smart-point-btn.png` | `ticket-workflow/` |

**Prompts** (icon + texture, **no baked text** — labels from `translations.js`):

- **Full Point:** Horizontal game button texture, purple plasma gradient with lightning, trophy icon silhouette left, empty label area center-right, 2400×400 transparent PNG.
- **Dual Point:** Horizontal game button texture, cyan plasma gradient with lightning, balance-scale icon silhouette left, empty label area, 2400×400 transparent PNG.
- **Smart Point:** Horizontal game button texture, gold-orange plasma gradient with lightning, target icon silhouette left, empty label area, 2400×400 transparent PNG.

Load: `ticketWorkflowAsset("strategyFullPointBtn")` etc.

---

## Usage in codebase

| Component / page | Asset helper | Keys |
|------------------|--------------|------|
| Strategy pick (`RaceCard.jsx`) | `ticketWorkflowAsset` | `strategyFullPointBtn`, `strategyDualPointBtn`, `strategySmartPointBtn` |
| How to Play step 2 | `ticketWorkflowAsset` | same strategy keys |
| Hero / marketing (future) | `pointModalityAsset` | `heroFullPoint`, `hero50FullPointDecides`, `splash50Metallic` |
| Mode selector UI (future) | `pointModalityAsset` | `selectorBarHorizontal`, `btnFullPoint`, … |
| Race art backgrounds (future) | `pointModalityAsset` | `raceCyberpunkFinish`, `raceUltimateLeaderboard` |

```js
import { pointModalityAsset, strategyPointAsset } from "@/frontend/lib/config/pointModalityAssets";

pointModalityAsset("btnFullPoint");
strategyPointAsset("full"); // → ticket-workflow strategy PNG
```

---

## Generation order

1. `point-master-reference-mockup.png` — locks the whole look
2. `point-selector-bar-horizontal.png` — establishes lightning texture + typography
3. `point-btn-full-point.png`, `point-btn-dual-point.png`, `point-btn-smart-point.png` — recolor only
4. Hero wordmarks
5. Race cinematics (no text)
6. Ticket-workflow strategy textures (transparent, no text)

---

## Prompt tips

1. Generate all three mode buttons in **one session** with the consistency line.
2. For UI textures used under CSS text, **omit baked text**; for marketing heroes, **include text** as specified.
3. Export @2x; CSS scales on mobile.
4. Purple/cyan/gold hex values must match modality theming in `gameModalities.js` and `globals.css`.
