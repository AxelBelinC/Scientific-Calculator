# CalcSci Design System

A complete design system for **Calculadora Científica** — a dark-themed, precision-focused scientific calculator with integrated function grapher, built for Windows (.NET WinForms). This design system captures the visual language, component library, and interaction patterns of the product.

---

## Sources

| Resource | Location |
|---|---|
| **Primary codebase** | `Scientific-Calculator/` (local mount) |
| **GitHub repository** | https://github.com/AxelBelinC/Scientific-Calculator |
| **Theme definitions** | `Scientific-Calculator/Theme/ColorPalette.cs`, `FontSets.cs` |
| **UI components** | `Scientific-Calculator/UI/CalcButton.cs`, `HistoryPanel.cs` |
| **Grapher** | `Scientific-Calculator/Grapher/FormGrapher.cs`, `GraphRenderer.cs` |
| **Engine** | `Scientific-Calculator/Engine/CalculatorEngine.cs` |

> Explore the GitHub repository for full implementation context: https://github.com/AxelBelinC/Scientific-Calculator

---

## Product Overview

**Calculadora Científica** is a full-featured scientific calculator desktop application. It consists of two surfaces:

1. **Calculator** — A 730×650px window with a 400px-wide calculator panel and a collapsible history panel. Supports arithmetic, scientific functions (trig, log, exponents, roots, combinatorics), memory operations, and parenthetical expressions. Spanish-language UI.
2. **Graficadora** (Function Grapher) — An 800×600px window for plotting up to 6 simultaneous functions f(x), with pan/zoom, root detection, and auto-range. Each function is assigned a distinct color from the graph palette.

---

## Products / Surfaces

| Surface | Description |
|---|---|
| `ui_kits/calculator/` | Full interactive recreation of the calculator + grapher |

---

## Content Fundamentals

**Language:** Spanish throughout — all labels, error messages, section titles, and tooltips are in Spanish.

**Tone:** Technical, precise, neutral. No personality, no marketing copy — purely functional labels.

**Casing:** Title case for panel labels ("Historial"), all-caps for mode toggles ("DEG", "RAD"), mathematical symbol notation for functions (sin, cos, tan, sin⁻¹, √, ∛, etc.).

**Numbers / errors:** Results use G15 format (up to 15 significant digits, no trailing zeros). Error states use plain Spanish phrases: "Entrada inválida", "Infinito", "-Infinito".

**Emoji:** Never used — not in labels, not in error states, not in history. Unicode math symbols are used instead (×, ÷, −, ⌫, √, ∛, π, ⁻¹, ², ³, ⁿ).

**Examples of real copy:**
- `Historial` — history panel title
- `Calculadora Científica` — window title
- `Graficadora` — grapher window title
- `f(x) =` — function input label
- `+ Agregar` — add function button
- `Raíces` — find roots button
- `Auto-rango` — auto-range button
- `Expresión inválida` — validation error
- `No hay funciones.` — empty state
- `No se encontraron raíces en el rango visible.` — root-finding empty result
- `Entrada inválida` — calculation error

---

## Visual Foundations

### Colors

**Dark theme only.** No light mode. All surfaces are near-black, with color used exclusively for button role differentiation and the active equals button.

| Role | Base | Hover | Notes |
|---|---|---|---|
| App background | `#1c1c1c` | — | Form background |
| Display | `#141414` | — | Slightly darker than bg |
| History bg | `#181818` | — | |
| History item | `#242424` | — | Individual rows |
| Default button | `#323232` | `#444444` | Digit + misc keys |
| Operator | `#2d3749` | `#3c4b64` | +, −, ×, ÷, % |
| Scientific fn | `#263241` | `#344458` | sin, cos, log, √, etc. |
| **Equals** | `#0067c0` | `#0078d7` | The only bright accent |
| Memory | `#32263c` | `#443452` | MC, MR, M+, M−, MS |
| Utility | `#3e2828` | `#553737` | C, CE, ⌫ |
| Toggle | same as Sci | — | DEG/RAD, Hist, Graf |

**Text:** Primary `#ffffff`, secondary/muted `#a0a0a0`, accent `#00a0ff` (same hue as graph-1), error `#ff5050`.

**Graph palette (6 functions, assigned in order):** `#00a0ff` → `#ff5050` → `#50c850` → `#ffaa00` → `#b450ff` → `#00dcc8`.

### Typography

**Original:** Segoe UI (Windows system font). **Substituted** with Outfit (display) + DM Sans (UI) from Google Fonts — request original `.ttf` files for pixel-perfect match.

| Role | Family | Size | Weight |
|---|---|---|---|
| Display result | Outfit / Segoe UI Light | 36px | 300 |
| Expression | DM Sans / Segoe UI | 12px | 400 |
| Button (main) | DM Sans / Segoe UI | 14px | 400 |
| Button (sci/mem) | DM Sans / Segoe UI | 10px | 400 |
| Button (small) | DM Sans / Segoe UI | 9px | 700 |
| History expression | DM Sans / Segoe UI | 10px | 400 |
| History result | DM Sans / Segoe UI | 13px | 400 |
| History title | DM Sans / Segoe UI Semibold | 11px | 700 |

### Spacing & Layout

- **Button gap:** 1px margin on all sides — creates a tight hairline grid
- **Display padding-right:** 10px
- **History item:** 52px tall, 6px horizontal padding, 4px gap between items
- **History title bar:** 36px tall, 12px left padding

### Borders & Radius

- **All calculator buttons:** zero border radius — perfectly square/rectangular
- **Hover state:** 1px solid `rgba(255,255,255,0.31)` border appears on buttons
- No shadows on buttons. No glow effects.
- **History items:** no border, no radius — pure flat rectangles
- **Input fields (grapher):** 1px `BorderStyle.FixedSingle`, `#2d2d2d` background

### Animation & Interaction

- **No transitions or animations.** Color changes are instant (no CSS transition).
- **Hover:** background lightens to the `-hover` variant + 1px border appears
- **Press:** background darkens to `--color-btn-press` (#262626) — same for all roles
- **No scale or transform on press.** Pure color change only.

### Backgrounds & Imagery

- **Solid fills only.** No gradients, no textures, no background images.
- **Graph canvas background:** same `#1c1c1c` as app — the graph is drawn on the same dark surface with a faint grid of lighter lines.
- **Graph grid lines:** light grey at low opacity; axes slightly brighter.

### Corner Radii

- Buttons: **0px** — completely sharp corners
- Chips (function tags in grapher): **~2px** subtle rounding
- Window: OS-managed (WinForms default)

### What Cards Look Like

History items have: `background: #242424`, no border, no shadow, no radius. A two-line layout: expression in `#a0a0a0` (dim, small), result in `#ffffff` (bright, larger), right-aligned. 4px gap between items.

---

## Iconography

**No icon library is used.** The app relies entirely on:
- **Unicode math symbols** inline in button labels: `⌫` (backspace), `√` (sqrt), `∛` (cbrt), `π` (pi), `÷` (divide), `×` (multiply), `−` (minus), `⁻¹`, `²`, `³`, `ⁿ`
- **ASCII operators** for others: `+`, `-`, `*`, `/`, `%`, `^`, `=`
- **Abbreviated text labels** for scientific functions: `sin`, `cos`, `tan`, `log`, `ln`, `nCr`, `nPr`
- **Short Spanish labels** for utility: `C`, `CE`, `MC`, `MR`, `M+`, `M−`, `MS`
- **No SVG icons, no icon font, no emoji.** Never use emoji as icons in this system.

The graph function chips use a small 10×10px colored dot (matching the function's graph color) as the only visual decoration.

---

## Components

**Namespace:** `window.ScientificCalculatorDesignSystem_00fb6d`

| Component | File | Description |
|---|---|---|
| `CalcButton` | `components/core/CalcButton.jsx` | Single key with 7 role variants (default, operator, scientific, equals, memory, utility, toggle) |
| `Display` | `components/core/Display.jsx` | Result + expression display area (36px Outfit Light result, 12px DM Sans expression) |
| `HistoryPanel` | `components/core/HistoryPanel.jsx` | Collapsible history sidebar with scrollable entry list |
| `HistoryItem` | `components/core/HistoryItem.jsx` | Single history row (expression + result) |
| `GraphView` | `components/core/GraphView.jsx` | Canvas function plotter with pan/zoom |
| `FunctionChip` | `components/core/FunctionChip.jsx` | Function tag chip with colored dot and remove button |

## Design Tokens

**114 tokens** across 3 files, all under `:root`:

| File | Tokens |
|---|---|
| `tokens/colors.css` | `--color-bg`, `--color-display-bg`, `--color-btn-*`, `--color-text-*`, `--color-graph-*`, semantic aliases |
| `tokens/typography.css` | `--font-display`, `--font-ui`, `--text-*` sizes, `--weight-*`, `--leading-*`, legacy aliases |
| `tokens/spacing.css` | `--space-*` scale, layout constants (`--calc-width`, `--calc-display-h`), `--radius-*` |

## File Index

```
styles.css                         ← Root entry point (@import only)
tokens/
  colors.css                       ← Color custom properties + graph palette
  typography.css                   ← Font families, sizes, weights + aliases
  spacing.css                      ← Spacing scale, layout constants, radii
assets/
  logo.svg                         ← Logomark (56×64)
  logo-wordmark.svg                ← Logomark + "CalcSci" wordmark (200×56)
  favicon.svg                      ← 32×32 favicon
  logo-mark.svg                    ← Alternate mark
  grapher-icon.svg                 ← Grapher surface icon
components/core/
  CalcButton.jsx + .d.ts + .prompt.md
  Display.jsx + .d.ts + .prompt.md
  HistoryPanel.jsx + .d.ts + .prompt.md
  HistoryItem.jsx + .d.ts + .prompt.md
  GraphView.jsx + .d.ts + .prompt.md
  FunctionChip.jsx + .d.ts + .prompt.md
  core.card.html                   ← @dsCard specimen for all core components
guidelines/
  colors-surfaces.card.html        ← Surface hierarchy swatches
  colors-buttons.card.html         ← Button role color map (rest + hover)
  colors-text.card.html            ← Text & accent colors
  colors-plot.card.html            ← Graph function palette (6 colors)
  type-display.card.html           ← Display result typography specimen
  type-scale.card.html             ← Full UI type scale
  spacing.card.html                ← Spacing token scale
  interactions.card.html           ← Button state specimens (rest/hover/press)
  brand-logo.card.html             ← Logo placements
  brand-motifs.card.html           ← Corner radius, grid, flat-fill motifs
ui_kits/calculator/
  index.html                       ← Full interactive calculator + grapher UI kit
  engine.js                        ← Calculator engine (ported from C# CalculatorEngine.cs)
  CalcPanel.jsx                    ← Main calculator panel (400px)
  CalcHistoryPanel.jsx             ← History sidebar panel
  GrapherPanel.jsx                 ← Function grapher overlay (800×590)
readme.md                          ← This file
SKILL.md                           ← Agent skill definition
```
