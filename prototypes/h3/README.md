# H3 — Static visual prototype

Review artifact for the **Quiet Interactive** visual system. Open `dark-v2.html`
for the latest dark composition on desktop and mobile. `index.html` preserves
the first dark version for comparison; `light.html` and `swatches.html` remain
the earlier, unchanged views. These files are prototypes, not the production portfolio. No Astro,
client framework, animation, persistence, or project asset has been added.

## What is being tested

- A typographic Hero led by **Ramiro Garcia**, with one deliberate line break.
- Instrument Sans as a single type family. The prototype requests it from Google
  Fonts for visual review and falls back to Arial if offline. Self-hosted,
  optimized font files belong to the later foundation implementation.
- Approved warm charcoal/paper neutrals, orange/blue defaults, and accent use
  limited to actionable or selected details. Their values are recorded in
  `docs/DESIGN.md`.
- A compact opaque header, a short About continuation, one editorial project
  slot, and a simple Contact close. `TODO_*` labels are internal placeholders.
- Mobile composition, focus states, divider and functional-border contrast.

The preference panels and swatches are visual specimens. Their final keyboard,
outside-click, Escape, persistence, and theme/accent behavior belongs to H6;
motion belongs to H4. The placeholder project is **not** an inclusion decision.

## Review before H3 can close

Check the new dark composition on desktop, notebook, and mobile with motion
absent. Inspect at
320, 375, 768, 1024, 1280, and 1536 CSS px, plus 200% zoom and short viewport
heights. Confirm the name does not clip, the Hero remains the first clear idea,
the controls remain legible, and the name, role, and statement read as one
composition. The approved palette and accents do not close H3: Ramiro must
explicitly approve the revised static Hero before the milestone is marked closed.

## Design rules carried forward

- Type: the revised dark Hero H1 uses `clamp(3.5rem, 9.7vw, 9.5rem)` on desktop
  and `clamp(3.5rem, 13.2vw, 6rem)` on mobile. H2 uses
  `clamp(2.25rem, 4.5vw, 4rem)`; project titles use
  `clamp(2.5rem, 5vw, 4.5rem)`; body 17–19 px; metadata/controls at least 14 px.
- Layout: width ceiling near 1600 px, fluid gutters 20–72 px, readable text
  around 55–65 characters, asymmetrical project visual/context at wide sizes.
- Spacing: 8 / 16 / 24 / 40 / 64 / 96 / 144 px vocabulary; more space between
  sections than within a section. Do not fill unused space decoratively.
- Surfaces: background by theme; opaque surface only for header, panels, or
  image support. Dividers are subtle; boundaries needed to identify controls
  use the stronger functional border.
- Imagery: real screenshots, approximately 16:10 when appropriate; preserve
  readable UI and each project's own identity. Mobile screenshots are secondary
  only when they explain responsive work. No fabricated browser chrome.
- States: underline links in every accent, 2 px visible focus ring, non-color
  selected mark, tinted selection with readable text, and no hover-only content.
- Contact: visible mailto email first; copy action and GitHub secondary; no
  invented availability indicator or extra social link.
