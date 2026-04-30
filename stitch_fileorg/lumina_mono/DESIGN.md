# Design System Specification: The Digital Atelier

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Atelier."** 

This system moves away from the "template" look of generic SaaS by treating the interface as a precision-engineered workspace. It draws inspiration from the high-density utility of Raycast and the atmospheric clarity of Linear. We break the traditional grid through **Intentional Asymmetry**—placing high-action utilities in compact, focused containers while allowing data and content to breathe in expansive, airy layouts. The goal is a "Calm Authority": a UI that feels reliable because it is quiet, and premium because every pixel serves a purpose.

---

## 2. Colors & Surface Logic
The palette is rooted in a sophisticated range of cool grays and off-whites, punctuated by a singular, authoritative Indigo (`primary`).

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to section off major layout areas. Boundaries must be defined through tonal shifts. 
- Use `surface` (#f7f9fb) for the main application background.
- Use `surface-container-low` (#f0f4f7) to define sidebars or utility panels.
- The shift in background color is the only "divider" permitted for structural layout.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials. 
1. **Base:** `surface` (#f7f9fb)
2. **Structural Sections:** `surface-container-low` (#f0f4f7)
3. **Interactive Cards:** `surface-container-lowest` (#ffffff) — This creates a "lifted" effect naturally when placed on the darker base.
4. **Higher Modals/Popovers:** `surface-bright` (#f7f9fb) with Glassmorphism.

### The "Glass & Gradient" Rule
To escape the "flat" look, use `backdrop-blur` (12px-20px) on floating elements like Command Bars or Dropdowns. 
- **Signature Texture:** Main CTAs should not be flat. Apply a subtle linear gradient from `primary` (#4d44e3) to `primary_dim` (#4034d7) at a 145-degree angle. This provides a "soul" to the primary action that flat hex codes cannot achieve.

---

## 3. Typography: The Editorial Scale
We utilize **Inter** not just for legibility, but as a brand signifier. The hierarchy is designed to feel like a high-end technical journal.

- **Display & Headlines:** Use `display-md` (2.75rem) or `headline-lg` (2rem) with tighter tracking (-0.02em) for a bold, confident entry point.
- **The Body:** `body-md` (0.875rem) is our workhorse. Ensure a generous line height (1.5-1.6) to maintain the "Calm" feel.
- **Precision Labels:** `label-sm` (0.6875rem) should be used for metadata, tags, and micro-copy. Use uppercase with +0.05em letter spacing to provide a technical, "pro-tool" aesthetic.

---

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering** rather than heavy shadows.

- **The Layering Principle:** Place a `surface-container-lowest` (#ffffff) card on top of a `surface-container-low` (#f0f4f7) background. The contrast is enough to define the object without a single line of CSS border.
- **Ambient Shadows:** When an element must float (e.g., a command bar), use an extra-diffused shadow. 
  - *Values:* `0 12px 32px rgba(42, 52, 57, 0.06)`. 
  - The shadow color is a tinted version of `on-surface`, never pure black.
- **The "Ghost Border":** If a border is required for accessibility on white-on-white elements, use the `outline_variant` token at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
- **Primary:** Gradient (`primary` to `primary_dim`), `on_primary` text, `DEFAULT` (8px) radius.
- **Secondary:** `surface_container_high` background with `on_surface` text. No border.
- **Tertiary:** Ghost style. No background; `primary` text. Background appears only on hover as `surface_container_low`.

### The Command Bar (Signature Component)
Inspired by Raycast. A centered, floating input using `surface_container_lowest` at 80% opacity with a 20px `backdrop-blur`. Use a `xl` (24px) border radius to make it feel distinct from standard square cards.

### Input Fields
- **Default:** `surface_container_lowest` background. 
- **Focus:** No heavy glow. Instead, use a 2px "Ghost Border" of `primary` at 40% opacity and a subtle `surface_tint` shadow.
- **Validation:** Use `error` (#9e3f4e) for text, but `error_container` (#ff8b9a) at 20% opacity for the field background to avoid "visual shouting."

### Cards & Lists
- **Strict Rule:** No dividers. Separate list items with `md` (12px) of vertical space. 
- Use `surface-container-highest` for a hover state background on list items to indicate interactivity.

---

## 6. Do's and Don'ts

### Do
- **Use White Space as a Tool:** If a section feels cluttered, increase the padding—don't add a border.
- **Embrace Asymmetry:** Align primary navigation to the left, but keep secondary utilities floating or right-aligned to create a dynamic visual path.
- **Subtle Motion:** All transitions (hover, focus, entry) should use a `cubic-bezier(0.16, 1, 0.3, 1)` easing for a "snappy yet smooth" high-end feel.

### Don't
- **Don't use 100% Black:** Even for typography, the darkest we go is `on_surface` (#2a3439). 
- **Don't use high-contrast borders:** Avoid any `1px solid` CSS that isn't a "Ghost Border" (low opacity).
- **Don't use default shadows:** Never use the browser's default `0 2px 4px` drop shadow. It breaks the premium "Digital Atelier" atmosphere.