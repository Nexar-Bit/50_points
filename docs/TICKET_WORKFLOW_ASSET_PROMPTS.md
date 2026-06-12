# Ticket workflow UI assets — AI image prompts

Generate each image separately. Save into `public/Img/ticket-workflow/` using the **exact filenames** below.

**Global style:** Premium 2026 dark-mode gaming UI — neon purple **#8B2CFF**, midnight blue/black, gold (#FBBF24), emerald (#22C55E), glassmorphism, cinematic lighting, subtle grain. **Responsive:** square section assets at 1024×1024+; hero/backgrounds at 16:9 or wider, 4K.

Recommended: **4K**, **high detail**, **no watermarks**. Text in prompts is only where the mockup requires legible UI labels.

---

## Landing & banner

### `landing-hero-bg.png`
> Wide cinematic dark hero background for horse-racing tournament app, blurred grandstand lights at dusk, deep navy-to-black gradient, soft purple and gold light leaks at edges, minimal noise texture, no text, no logos, 16:9 and crop-safe for mobile portrait, 4K.

### `workflow-banner-icon.png`
> Small hexagonal badge icon with bold number "3" inside, emerald green metallic shield, tiny ticket stub silhouette, premium mobile game UI, isolated on transparent background, 512×512, 4K detail.

### `workflow-banner-bg.png` (optional texture)
> Wide horizontal UI banner texture for horse-racing tournament app, **vibrant emerald green** gradient bar (#14532d → #22c55e → #34d399), subtle glass shine across top edge, soft bokeh light particles, very light diagonal energy streaks, premium esports HUD feel, **no text, no logos, no icons**, seamless left-to-right, 16:4 aspect ratio (e.g. 1920×480), PNG, 4K. Used as optional overlay on the “3 free tickets” benefit bar — CSS provides the base green if this file is missing.

### `comenzar-step-illustration.png`
> Vertical infographic strip showing 4 minimal icons in a column: game mode card, racetrack thumbnail, three tickets, checkered flag — connected by thin purple neon line, dark background, flat-modern style, no long text, 9:16, 4K. **Equal-height rows** (4 × 25% slices) for side-by-side alignment with step text.

---

## Onboarding journey — full card backgrounds (sections 1–4)

**Required:** each file is the **full-bleed background** of a journey card on `/comenzar` (`object-fit: cover`, 24px rounded corners). Text (title + description) is overlaid in CSS — **do not bake text into the image**.

Register in `ticketWorkflowAssets.js` as `comenzarStep1Mode` … `comenzarStep4Finish`.

**Shared style (apply to all four prompts):**
- Premium 2026 dark-mode gaming UI, cinematic luxury esports aesthetic
- Accent neon purple **#8B2CFF**, deep black / midnight blue
- **Portrait 3:4** (e.g. **1200×1600** or **1536×2048**), 4K, PNG
- Subject fills the **entire frame**; richer detail in **upper two-thirds** (bottom gets dark scrim overlay)
- Soft vignette at edges; safe for 24px corner crop
- **No text, no numbers, no logos, no watermarks**
- Inspired by Vercel, Linear, Riot Games launcher art, F1 digital experiences

### Section 1 — Choose Mode → `comenzar-step-1-mode.png`

> Full-bleed **journey card background**, Step 1 Choose Mode. Cinematic **neon-purple game controller** energy beam splitting a dark glass arena, futuristic gaming command center atmosphere, volumetric purple (#8B2CFF) light, deep midnight black base, luxury esports launcher wallpaper. Entire frame filled edge-to-edge, upper area most detailed, darker lower third for text overlay. Portrait 3:4 PNG, no text, 4K.

### Section 2 — Select Racetrack → `comenzar-step-2-track.png`

> Full-bleed **journey card background**, Step 2 Select Racetrack. **Aerial racetrack at dusk** — oval dirt track, green infield, grandstand lights, purple-orange twilight sky, glowing **map pin** marker at track center. Cinematic horse-racing broadcast mood, shallow haze, luxury sports aesthetic. Fills entire portrait frame. Portrait 3:4 PNG, no text, 4K.

### Section 3 — Pick Ticket → `comenzar-step-3-tickets.png`

> Full-bleed **journey card background**, Step 3 Pick Ticket. Three **premium holographic tickets** (purple, gold, blue) fanned across frame with star emblems, neon purple underglow, dark glass surface reflections, battle-pass / lottery premium UI wallpaper. Full frame coverage, upper detail stronger. Portrait 3:4 PNG, no readable text, 4K.

### Section 4 — Enter Races → `comenzar-step-4-finish.png`

> Full-bleed **journey card background**, Step 4 Enter Races. Dynamic **checkered flag** and finish-line stadium lights, concentric **purple neon rings** on track, victory confetti particles, cinematic spotlight from above, championship moment energy. Dark midnight base, purple accent #8B2CFF. Full portrait frame. Portrait 3:4 PNG, no text, 4K.

**Generation tip:** Generate all four in one session: *“Same art direction and portrait 3:4 framing — only the hero subject changes per step.”*

---

## Onboarding feature cards — full backgrounds (benefits 1–3)

Full-bleed backgrounds for the **three horizontal feature cards** below the journey row on `/comenzar`. Text is overlaid in CSS — **no text in images**.

**Shared style:** Ultra-premium esports racing platform, Formula E cinematic atmosphere, deep black / midnight blue, purple neon (#8B2CFF), volumetric fog, glassmorphism-friendly, floating particles, soft reflections, 4K. **Landscape 4:3** (e.g. **1600×1200**), PNG.

### Benefit 1 — Independent tickets → `onboard-benefit-tickets.png`

> Full-bleed feature card background. **Large glowing 3D holographic racing tickets** fanned in center — purple, gold, electric blue — with star emblems, holographic foil sheen, neon purple underglow, floating light particles, subtle energy trails. Luxury battle-pass aesthetic, dark midnight studio backdrop, volumetric purple fog. Landscape 4:3 PNG, no text, 4K, Dribbble showcase quality.

### Benefit 2 — Free to play → `onboard-benefit-shield.png`

> Full-bleed feature card background. **Chrome shield emblem** with radiant **purple energy core** at center, polished metal reflections, soft volumetric fog, floating particles, trust and security mood, premium SaaS + esports fusion. Dark black-blue gradient base, neon purple rim light (#8B2CFF). Landscape 4:3 PNG, no text, 4K.

### Benefit 3 — Racing strategies → `onboard-benefit-strategy-hud.png`

> Full-bleed feature card background. **Futuristic racing strategy HUD** — translucent glass panels, teal and purple data arcs, triple strategy nodes (full / dual / smart motif), Formula E inspired interface glow, depth and realism, cinematic cockpit lighting. Dark interface on midnight background, floating particles. Landscape 4:3 PNG, no text, 4K.

**Master prompt (whole benefits row reference mockup):**

> Ultra-premium esports racing platform landing page section, dark futuristic interface, cinematic Formula E inspired atmosphere, luxury gaming UI, deep black and midnight blue background, purple neon lighting, volumetric fog, premium glassmorphism cards, three feature cards in horizontal layout, large glowing 3D icons, holographic racing tickets, chrome shield with purple core, futuristic racing strategy HUD, soft reflections, floating particles, subtle energy trails, ultra-clean typography area at bottom third left empty for overlay text, world-class SaaS and gaming design, Apple-level polish, Linear and Riot Games aesthetics, elegant spacing, 4K UI mockup, award-winning product design, highly detailed.

---

## Hipódromos workflow page — `/modalidades/guest` & `/modalidades/free`

Full-screen responsive ticket workflow: info banner → ticket sidebar → glass main panel (tabs + track accordion + ticket dock). **All PNG.** Text comes from i18n — **no text in backgrounds** unless noted.

**Art direction:** Ultra-premium 2026 esports racing platform, Formula E × Linear × Riot Games, deep black `#05050D` / midnight blue, neon purple `#8B2CFF`, emerald `#22C55E`, gold `#FBBF24`, glassmorphism, volumetric fog, soft reflections, floating particles, 4K, Dribbble-quality.

### Master reference mockup (generate first — style guide)

> Full-screen desktop UI mockup, hipódromos racetrack selection page for premium horse-racing tournament app. Dark futuristic interface, cinematic atmosphere. Layout: top green glass info banner with shield badge "3"; left sidebar gold-tinted glass panel "MIS TICKETS" with three track logo tiles and ticket dot rows; right large glass main panel with purple pill tabs (MODALIDADES | HIPÓDROMOS | TICKETS), bold white heading HIPÓDROMOS DISPONIBLES, three stacked glass track accordion cards with race thumbnails, location pin, pulsing green EN VIVO pill, purple chevron. Deep black-midnight background with purple volumetric fog and subtle energy trails. Premium glassmorphism, elegant spacing, Apple-level polish, responsive web app, 16:9, 4K, highly detailed, award-winning product design. Leave typography areas clean enough for real i18n overlay.

---

### Page atmosphere

#### `tracks-workflow-bg.png` → `tracksWorkflowBg`

> Wide cinematic **full-page background** for racetrack selection screen. Blurred aerial horse-racing oval track at twilight, grandstand bokeh lights, deep navy-to-black gradient, soft purple (#8B2CFF) and emerald light leaks, volumetric fog at bottom, minimal grain. **No UI, no text, no logos.** Safe for heavy CSS dark scrim overlay. **16:9** (3840×2160 or 2560×1440), PNG, 4K.

#### `tracks-workflow-sidebar-bg.png` → `tracksWorkflowSidebarBg`

> Subtle **glass panel texture** for left ticket sidebar — dark charcoal glass with faint gold (#FBBF24) warm gradient upper-left, soft noise, inner highlight edge, empty center for logos overlay. **Portrait-friendly** tile or **4:3** (1200×900), PNG, seamless feel, no text.

#### `tracks-workflow-main-panel-bg.png` → `tracksWorkflowMainPanelBg`

> Subtle **glass panel texture** for main content card — midnight blue glass, faint purple neon rim glow bottom-right, frosted surface, luxury SaaS dashboard plate. **Landscape 16:9** (1920×1080), PNG, low-contrast (CSS adds blur), no text, no icons.

---

### Banner & chrome (existing keys — modern refresh)

#### `workflow-banner-icon.png` → `workflowBannerIcon`

> Hexagonal **emerald shield badge** with embossed number **3**, tiny holographic ticket stub, metallic green (#22C55E) with soft glow, premium mobile/esports UI icon. Isolated **transparent PNG**, 512×512, 4K detail.

**Generation order:** (1) master mockup → (2) `tracks-workflow-bg.png` → (3) sidebar + main panel textures → (4) banner icon + track thumb + live pill + chevron. Reuse the same purple/emerald/gold palette in one session.

---

## Track overview bar (MIS TICKETS DISPONIBLES)

### `overview-bar-ticket-icon.png` → `overviewBarTicketIcon`

> Small **gold ticket icon** for the MIS TICKETS DISPONIBLES header — stylized perforated ticket stub with subtle V-notch, metallic gold (#FBBF24) outline on dark transparent background, premium esports HUD icon, no text, 256×256 PNG transparent, 4K detail.

### `overview-track-tile-bg.png`
> **Dark glass** rounded square tile plate for racetrack logo overlay — frosted charcoal with soft white inner highlight, subtle gold rim, modern 2026 app icon holder, 256×256 PNG (also works on white monogram fallback).

### `overview-slot-used.png`
> Tiny rounded square UI chip, emerald green fill, white checkmark center, soft glow, 64×64 PNG transparent.

### `overview-slot-open.png`
> Tiny rounded square UI chip, dark gray glass, thin white border, empty center, 64×64 PNG transparent.

### `overview-slot-active.png`
> Tiny rounded square UI chip, purple neon border and fill, subtle outer glow, empty center, selected state, 64×64 PNG transparent.

---

## Hipódromos accordion (workflow track rows)

### `track-row-thumb-default.png`
> Landscape racetrack thumbnail **16:9**, horses mid-race on dirt track, cinematic motion blur, purple twilight sky reflection, dark vignette, premium sports broadcast still, **no text**, 800×450 PNG, 4K detail.

### `track-live-pill.png`
> Horizontal **EN VIVO live pill** UI chip — neon green dot + capsule, emerald glass fill (#22C55E), soft outer glow, Spanish live broadcast aesthetic. **Transparent PNG** 320×80 (text optional — i18n may overlay).

### `accordion-chevron-glow.png`
> Minimal **chevron down** with purple neon bloom (#8B2CFF), glass esports UI accent, 128×128 transparent PNG. CSS rotates 180° when expanded.

---

## Ticket cards (landscape)

### `ticket-stub-landscape-base.png`
> Horizontal event ticket stub, landscape 3:1 ratio, perforated left edge, vertical barcode strip on right, center area empty for logo overlay, dark purple and gold accent stripes, modern gaming ticket, transparent PNG, 1200×400.

### `ticket-stub-n1-active.png`
> Landscape ticket variant 1 — cool blue accent border, gold "50" medallion zone on left third, subtle holographic sheen, available state, 1200×400, PNG.

### `ticket-stub-n2-active.png`
> Landscape ticket variant 2 — purple neon glow border, selected/active state, same layout as n1, 1200×400, PNG.

### `ticket-stub-n3-active.png`
> Landscape ticket variant 3 — soft lavender accent, available state, same layout, 1200×400, PNG.

### `ticket-stub-used.png`
> Landscape ticket used state — desaturated gray-gold, small green check badge top-right, "USADO" feel without readable text required, 1200×400, PNG.

### `ticket-barcode-strip.png`
> Vertical barcode texture strip for ticket right edge, monochrome, tileable height, transparent PNG 80×400.

### `btn-ver-ticket-purple.png`
> Rounded rectangle CTA button texture, purple gradient, subtle glow, no text (CSS adds label), 600×120 PNG.

---

## Three horizontal ticket tabs

### `tab-ticket-1.png`
> Portrait-mini ticket tab icon, number "1" in circle, dashed gray border, inactive, 200×280 transparent PNG.

### `tab-ticket-2-active.png`
> Portrait-mini ticket tab, number "2", solid teal-green border, active glow, 200×280 transparent PNG.

### `tab-ticket-3.png`
> Portrait-mini ticket tab, number "3", orange accent border, inactive, 200×280 transparent PNG.

### `tab-ticket-used-overlay.png`
> Small green check + dim overlay for used tab state, 200×280 transparent PNG.

---

## Tournament races accordion

### `races-panel-header-bg.png`
> Wide panel header texture, dark glass, purple neon bottom border, checkered flag motif abstract (no text), 1200×200, PNG.

### `race-row-collapsed.png`
> Single race list row UI slice — dark row, yellow "CARRERA" accent area left, chevron right, 1200×80 PNG for reference/mock.

### `race-row-expanded.png`
> Expanded race row with white horse table area below dark header, clean data grid feel, 1200×600 PNG reference.

### `demo-badge-ficticia.png`
> Small outlined badge graphic for demo template indicator, monospace aesthetic, transparent PNG 400×120 (optional "PLANTILLA" hint shapes only).

---

## Strategy pick buttons (under each horse)

**Full plasma-style prompts and hero/splash assets:** see `docs/POINT_MODALITY_ASSET_PROMPTS.md`.

### `strategy-full-point-btn.png`
> [50 Points master style] Horizontal game button texture, purple plasma gradient with lightning, trophy icon silhouette left, empty label area center-right (no baked text), 2400×400 transparent PNG.

### `strategy-dual-point-btn.png`
> [50 Points master style] Horizontal game button texture, cyan plasma gradient with lightning, balance-scale icon silhouette left, empty label area (no baked text), 2400×400 transparent PNG.

### `strategy-smart-point-btn.png`
> [50 Points master style] Horizontal game button texture, gold-orange plasma gradient with lightning, target icon silhouette left, empty label area (no baked text), 2400×400 transparent PNG.

---

## Modality hub (related)

### `modality-card-free.png`
> Tall vertical card texture, emerald green neon border, dark glass interior, trophy motif watermark, 400×700, PNG.

### `modality-card-paid.png`
> Tall vertical card texture, gold/amber neon border, crown motif watermark, 400×700, PNG.

### `modality-card-guest.png`
> Tall vertical card texture, cyan accent, play-without-signup motif, 400×700, PNG.

### `modality-card-special.png`
> Tall vertical card texture, purple-magenta premium border, star burst, 400×700, PNG.

---

## Navigation tabs

### `nav-tab-modalidades.png`
> Pill tab inactive state, dark gray glass, 400×80 PNG.

### `nav-tab-hipodromos.png`
> Pill tab inactive state variant, 400×80 PNG.

### `nav-tab-tickets-active.png`
> Pill tab active state, purple fill, ticket icon slot, soft glow, 400×80 PNG.

---

## Responsive / decorative

### `purple-connector-glow.png`
> Curved neon purple line with bloom, connects ticket to races panel in mockups, transparent PNG 800×400.

### `mobile-safe-area-fade.png`
> Top and bottom vignette gradient for mobile safe areas, transparent PNG 390×200.

### `noise-overlay-tile.png`
> Seamless fine film grain overlay, 512×512 PNG alpha 8%.

---

## Usage in codebase

All filenames are registered in `src/frontend/lib/config/ticketWorkflowAssets.js`. Components load them via `ticketWorkflowAsset(key)` — no path edits needed when filenames match.

| Component | Asset keys |
|-----------|------------|
| `TracksWorkflowList.jsx` | `tracksWorkflowBg`, `tracksWorkflowMainPanelBg`, `workflowBannerIcon`, `trackRowThumbDefault`, `trackLivePill`, `accordionChevronGlow` |
| `FreeTicketsOverviewBar.jsx` | `tracksWorkflowSidebarBg`, `overviewTrackTileBg`, `overviewSlotUsed` / `Open` / `Active` |
| `FreeTicketCard.jsx` | `ticketStubN1Active` … `ticketStubUsed`, `ticketBarcodeStrip` |
| `ComenzarPageClient.jsx` | `landingHeroBg`, `comenzarStep1Mode` … `comenzarStep4Finish`, `onboardBenefitTickets` / `Shield` / `StrategyHud` |
| `ModalityHub.jsx` | `modalityCardFree`, `Paid`, `Guest`, `Special` |

After adding PNGs to `public/Img/ticket-workflow/`:

```bash
npm run verify:ticket-workflow-assets
```

Use **PNG** for all assets in this set (icons, photos, gradients, and UI chips). Prefer transparency where noted in each prompt.

---

## Prompt tips for consistency

1. Run all ticket stubs in one session with “same layout, recolor accent only.”
2. Keep `#7C3AED` purple and `#22C55E` green consistent across active/selected states.
3. Export @2x for retina; CSS scales down on mobile.
4. Avoid embedded English/Spanish text in bitmaps when labels come from i18n (`translations.js`).
