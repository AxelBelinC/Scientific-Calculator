---
name: calcSci-design
description: Use this skill to generate well-branded interfaces and assets for Calculadora Científica (CalcSci) — a dark-themed scientific calculator with integrated function grapher. Contains design guidelines, color tokens, typography, UI components, and a full interactive UI kit.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc.), copy assets out and create static HTML files for the user to view. If working on production code, read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key design principles:
- **Dark only** — always use `#1c1c1c` background, never light mode
- **Zero border radius on buttons** — perfectly sharp corners
- **Flat, instant interactions** — no CSS transitions on button states
- **Spanish copy** — all labels in Spanish (e.g. Historial, Graficadora, Entrada inválida)
- **7 button roles** — default, operator, scientific, equals (blue #0067c0), memory, utility, toggle
- **Unicode math symbols** — √ ∛ π × ÷ − ⌫ ⁻¹ ² ³ — never emoji
- **Outfit Light 300 for result display**, DM Sans 400 for all UI text
