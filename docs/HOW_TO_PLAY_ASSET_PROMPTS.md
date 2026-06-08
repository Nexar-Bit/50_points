# How to Play page — AI image prompts

Generate each image separately. Save into `public/Img/how-to-play/` using the **exact filenames** below.

**Global style:** Ultra-premium 2026 esports racing tutorial UI — dark futuristic interface, Formula E × Linear × Riot Games aesthetic, deep black `#030305` / midnight blue, neon purple `#8B2CFF`, emerald `#22C55E`, gold `#FBBF24`, glassmorphism, volumetric fog, floating particles, 4K, Dribbble-quality. **All PNG.**

Text labels come from i18n — **do not bake long text into backgrounds** (short decorative numbers OK on step badges only if needed).

---

## Master reference mockup (generate first)

> Full-screen **How to Play** tutorial page for premium horse-racing tournament app. Dark cinematic **hero header** with stadium at night, purple light, horse silhouettes left/right, diamond-flanked "GETTING STARTED" eyebrow, bold HOW TO PLAY title. **Vertical purple timeline** with numbered circles 1–5 on the left. Five **horizontal glass step cards** — text + icon on left, cinematic graphic thumbnail on right: (1) stadium, (2) three circular strategy badges FULL/DUAL/SMART, (3) horse pick cards row, (4) golden × formula glow, (5) leaderboard podium. Below: **2×2 FAQ accordion** cards with purple ? badge and chevron. Bottom: **horizontal CTA bar** — trophy-controller art left, copy center, purple CREATE FREE ACCOUNT button right. Background `#05000a`, accent `#bc13fe`, 16:9 desktop, 4K.

**Generation order:** master mockup → hero bg → steps 1–5 → FAQ + CTA textures → CTA icon.

---

## Page atmosphere

### `how-to-play-hero-bg.png` → `heroBg`

> Wide cinematic **full-page hero background** for game tutorial / how-to-play screen. Abstract horse-racing stadium at twilight, soft grandstand bokeh, deep navy-to-black gradient, purple (#8B2CFF) and teal light leaks, volumetric fog, minimal grain. **No UI, no text, no logos.** Safe for heavy CSS dark scrim. **16:9** (3840×2160), PNG, 4K.

### `how-to-play-step-connector.png` → `stepConnector` (optional)

> Vertical **neon purple timeline connector** — thin glowing line with soft bloom nodes, transparent PNG 120×800, tileable height, esports UI accent.

---

## Five step cards — full-card backgrounds

Each file is the **full-bleed background** of a horizontal step card (`object-fit: cover`, 16px rounded corners). CSS applies a **sharp center + blurred edges** effect and a left text scrim — **no readable paragraph text in images**.

Register in `howToPlayAssets.js` as `step1Join` … `step5Rank`.

**Shared style:**
- **Wide landscape 2:1** or **16:9** (e.g. **1920×960** or **1600×900**), PNG, 4K
- Hero subject biased to the **right half** (left gets dark scrim overlay for text)
- Soft vignette at card edges; safe for 16px corner crop
- **No watermarks**

### Step 1 — Join a Tournament → `how-to-play-step-1-join.png`

> Full-bleed step card background. Cinematic wide shot of **futuristic horse racing track at night** — ornate stone gates with glowing purple orbs on pillars, jockeys racing away on wet track reflecting neon purple, massive glowing purple ring arch over stadium floodlights, dramatic purple-orange twilight sky. Subject on **right two-thirds** of frame. Cyberpunk magenta palette, 8K detail, wide 2:1 PNG, no text.

### Step 2 — Choose Your Strategy → `how-to-play-step-2-strategy.png`

> Full-bleed step card background. **Three strategy orbs** floating in glass arena — red high-risk flame orb, amber balanced orb, green safe orb — connected by subtle data arcs, futuristic command center, purple (#8B2CFF) ambient glow. Strategy tutorial mood. Landscape 16:10 PNG, no text, 4K.

### Step 3 — Pick Your Horses → `how-to-play-step-3-pick.png`

> Full-bleed step card background. **Premium race card HUD** — translucent glass panels showing horse silhouettes, jockey colors, live odds ticker glow (abstract, no readable numbers), teal and purple interface lighting, cockpit-style racing UI. Landscape 16:10 PNG, no text, 4K.

### Step 4 — Earn Points → `how-to-play-step-4-points.png`

> Full-bleed step card background. **Golden points multiplier energy** — radiant formula particles, glowing × symbol motif, gold (#FBBF24) and purple fusion, victory spark trails, abstract score explosion on dark glass. Landscape 16:10 PNG, no text, 4K.

### Step 5 — Climb the Rankings → `how-to-play-step-5-rank.png`

> Full-bleed step card background. **Leaderboard podium ascent** — neon trophy, ascending purple rank bars, hall-of-fame spotlights, championship confetti particles, emerald victory accents on midnight base. Landscape 16:10 PNG, no text, 4K.

**Tip:** Generate all five in one session: *"Same art direction and 16:10 framing — only the hero subject changes per step."*

---

## FAQ & CTA panels

### `how-to-play-faq-panel-bg.png` → `faqPanelBg`

> Subtle **glass panel texture** for FAQ section — dark charcoal frosted surface, faint purple mesh gradient, low contrast, empty for Q&A cards overlay. **Landscape 16:9** (1920×1080), PNG, no text.

### `how-to-play-cta-bg.png` → `ctaBg`

> Subtle **CTA card texture** — purple neon rim glow, dark glass center, radial energy burst, premium conversion panel plate. **Landscape 3:1** (1800×600), PNG, low-contrast, no text.

### `how-to-play-cta-icon.png` → `ctaIcon`

> **3D glowing trophy-controller hybrid icon** — purple neon esports emblem, chrome and glass, "ready to play" energy, isolated **transparent PNG** 512×512, 4K.

---

## Reused from ticket workflow (optional)

Step 2 strategy mini-cards can use existing ticket-workflow button textures (already wired in code):

| Key | File |
|-----|------|
| `strategyFullPointBtn` | `strategy-full-point-btn.png` |
| `strategyDualPointBtn` | `strategy-dual-point-btn.png` |
| `strategySmartPointBtn` | `strategy-smart-point-btn.png` |

Film grain overlay reuses `noise-overlay-tile.png` from `public/Img/ticket-workflow/`.

---

## Usage in codebase

| Component | Asset keys |
|-----------|------------|
| `HowToPlayPageClient.jsx` | `heroBg`, `step1Join` … `step5Rank`, `faqPanelBg`, `ctaBg`, `ctaIcon` |
| Strategy cards (step 2) | `ticketWorkflowAsset("strategyFullPointBtn")` etc. |

After adding PNGs:

```bash
npm run verify:how-to-play-assets
```

---

## Prompt tips

1. Keep purple `#8B2CFF`, emerald `#22C55E`, and gold `#FBBF24` consistent across all steps.
2. Export @2x for retina; CSS scales on mobile.
3. Avoid embedded English/Spanish copy — labels come from `translations.js` (`howToPlay.*`).
