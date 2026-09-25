# V2-H6.A/D — deployment baseline and Lighthouse findings

Date: 2026-09-25 UTC. URL: https://portfolio-rrrramita.vercel.app/ .
Deployed revision: `cbbe9f28c42f7cf8d37942d55a762505f85de34d` (H5 close). The GitHub deployment URL for that revision requires Vercel login; Ramiro provided the accessible alias above. This baseline predates all H6 code changes.

Method: Lighthouse CLI 13.5.0, Headless Chrome 153, default simulated mobile throttling and desktop preset, three runs each. Raw LHR JSON reports, one mobile DevTools trace, and a machine summary are in `qa/h6-lighthouse-baseline/`. Vercel load/interaction diagnostics are in `qa/h6-ja-public-baseline.json` and `qa/h6-public-runtime-baseline.json`. Browser interaction diagnostics are not throttled Lighthouse runs.

| Route / mode | Performance | Accessibility | Best Practices | SEO | Median LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| ES mobile | 99–100 | 100 | 96 | 100 | 1.62 s | 0 | 10–26 ms |
| ES desktop | 100 | 100 | 96 | 100 | 0.374 s | 0 | 0 ms |

Observed mobile network resources in the first Lighthouse run: HTML 5.2 KB transferred, Instrument Sans TTF 115 KB, CSS 7.2 KB, JS 6.5 KB, and the lazy Residencias mobile PNG 183 KB. The PNG image insight estimates about 125 KiB avoidable. The JA route additionally transfers about 3.1 MB for the provisional Noto Sans JP TTF. An unconfigured `/favicon.ico` returns 404; favicon work belongs to H6.F.

The render-blocking insight names the single own CSS file (about 7.2 KB transferred), while unused CSS and unused JS audits pass. With current LCP/CLS and a small stylesheet, H6.D leaves CSS loading unchanged. No critical CSS pipeline, artificial split, loader, or extra JS is justified.

Lighthouse identifies the forced reflow source in the built script `BaseLayout...js` at columns 460 and 8580/8596. These map to `syncHeaderHeight()` in `src/scripts/site.ts` (removes `--header-height` immediately before `getBoundingClientRect()`) and `evaluateSticky()` (reads header geometry). Across the six runs the first is present in four with about 29–35 ms, the second about 1.2–1.4 ms. The remaining runs report no forced-reflow item. It is an initialization/resize/font-load path, not the line's scroll-progress function.

In a separate public deployment interaction profile, 40 scroll steps accumulated 1.69 ms layout on mobile and 1.96 ms on desktop. Forty desktop pointer moves accumulated 2.52 ms. The SVG `getTotalLength()` reads coincide with geometry rebuilds during content loading/resize, while the scroll listener itself interpolates stored milestones. This does not indicate sustained layout thrashing or visible jank. H6.D therefore keeps the approved line, menu, sticky layout, and cursor unchanged; recheck after all H6 assets and content are integrated.

The localhost font QA in `qa/h6-font-results.json` verifies only the new asset integration. It is not substituted for these deployment measurements; a deployed after-comparison is still required.

An unthrottled, same-browser visual/network comparison between the H5 deployment and the H6 local build is recorded in `qa/h6-font-public-compare.json` with eight viewport screenshots in `qa/h6-fonts/`. It was repeated after H6.B regenerated the JA subset. At 390 and 1440 px, ES and JA hero line breaks and measured heading heights are unchanged; all four before/after pairs have no horizontal overflow. The Instrument font resource falls from 114,564 to 88,676 encoded bytes (23%); the JA resource falls from 3,114,396 to 86,576 encoded bytes (97%). The JA comparison screenshots were visually reviewed. This confirms asset transfer and rendering, not a new Lighthouse score for the unpublished build.

The text-enlargement check in `qa/h6-font-zoom-results.json` covers all five routes at 390 and 1440 px with root text set to 200%. All ten combinations have zero horizontal overflow, no broken image, and the expected local font loaded; the JA mobile viewport image is in `qa/h6-fonts/ja-mobile-200.png`. This is a CSS text-size approximation, not a substitute for manual browser zoom or device QA in H7.
