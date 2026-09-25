# H6.B — Residencias screenshots/assets: COMPLETE

Ramiro approved this exact pair for H6.B. Captured from the live `https://residenciasgrupocasa.com.ar/` site on 2026-09-25 UTC. These are real browser screenshots, not reconstructed images. No identifiable resident appears in either view.

| View | Source view | Approved original | Public WebP (quality 84) |
| --- | --- | ---: | ---: |
| Desktop, 1440 × 900 | Casa San Juan page hero, including its exterior photograph | `h6-candidates/sanjuan-desktop-0.png` — 884,310 B | `public/images/residencias-desktop.webp` — 110,488 B |
| Mobile, 390 × 844 | Home page «Nuestras residencias», focused on Casa San Juan; the transient invitation was closed before capture | `h6-candidates/recommended-mobile-home-clean.png` — 182,832 B | `public/images/residencias-mobile.webp` — 40,126 B |

The views complement each other: the desktop image shows the Casa San Juan presentation, while the mobile image shows how the parent site introduces its residences. Both show the site's actual responsive UI. The public WebPs total 150,614 B versus 671,231 B for the two prior public PNGs, a 520,617 B / 77.56% reduction. Browser QA confirmed HTTP response bodies of 110,488 and 40,126 B on the local preview; this remains to be compared on the next deployment.

The previous PNGs were removed. Both `<img>` elements keep explicit intrinsic width and height and `loading="lazy"`; neither needs `picture`, `srcset`, or AVIF at this stage. Captions and alt in ES/EN/PT/FR/JA now describe the desktop Casa San Juan page, its introduction and exterior photo. The mobile wording describes the Home «Nuestras residencias» view with Casa San Juan, the exterior photo and compact navigation. Non-ES text quotes the Spanish section title actually visible inside the screenshot.

Validation: `pnpm build` generated five static routes; `pnpm check` returned 0 errors, 0 warnings, 0 hints. `qa/h6b-checks.cjs` ran ten browser checks (five routes × 390/1440 px), including mobile touch emulation and JA reduced motion. All images decoded at their declared dimensions, captions/alt matched their images, no route overflowed horizontally, and cumulative layout shift remained 0 while the lazy images loaded. Full section and figure screenshots in `qa/h6b/` were reviewed at desktop/mobile. Responsive legibility is adequate: the desktop case heading, exterior image and caption read clearly; mobile Casa San Juan card and captions remain readable. This focused QA does not replace H7's real-device/browser matrix.
