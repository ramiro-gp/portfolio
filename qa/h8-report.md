# V2-H8 — publicación y validación de producción

**Estado:** IN PROGRESS. Este informe distingue el preflight local de las comprobaciones pendientes sobre `https://ramita.dev` después de la carga H8.

## Detención del paquete previo — 2026-09-26

Ramiro detuvo la preparación/publicación antes de cargar el paquete actual a Hostinger. El ZIP creado desde `0af5489a63559b18651a7d10360a54a7a9165506` no es definitivo y queda invalidado: contenía la lógica H7 que cambiaba globalmente el stroke completo cuando `.about` intersectaba el viewport. No se carga a Hostinger. H7 aprobó la intención espacial, pero su regresión anterior no llegó a comprobarla. La corrección y el nuevo paquete quedan condicionados al commit, push, deployment verificado en Vercel y regeneración de ZIP/manifiesto documentados abajo.

## Estado inicial

- `main` y `origin/main`: `d11b26272eb5148b241f564df622648e1b9c482f` al iniciar H8. `cambios.md` permanece sin seguimiento y fuera del release.
- Hosting final: Hostinger; carga manual de `dist/` confirmada por Ramiro. El alias de Vercel queda para QA. Astro conserva salida estática y canonical `https://ramita.dev`.
- Línea base pública anterior a H8 (2026-09-25 ART): `https://ramita.dev/` y `https://www.ramita.dev/` responden **200**; por tanto `www` todavía no redirige. `http://ramita.dev/` responde **301** a HTTPS. Una ruta inexistente responde **404** con página genérica en inglés de Hostinger. Los encabezados públicos identifican Hostinger/hPanel. La página del dominio raíz no contiene la corrección Light + negro de H7 que sí aparece en el alias de QA.
- DNS observado: nameservers `aster.dns-parking.com` y `helios.dns-parking.com`; A raíz `77.37.42.101` y `89.116.213.230`; CNAME `www.ramita.dev.cdn.hstgr.net`. MX de Hostinger y TXT SPF presentes. No se planifica modificación DNS.

## Preflight local

- `pnpm install --frozen-lockfile`: PASS con lockfile sin cambios. Hubo sólo un aviso al consultar metadata de actualización de pnpm por red restringida.
- `pnpm build`: PASS tras repetir con acceso de lectura a `node_modules` por un `EPERM` inicial del sandbox. Generó cinco rutas de idioma, `404.html` y `sitemap.xml`.
- `pnpm check`: PASS, 46 archivos, 0 errores, 0 warnings, 0 hints. No existe script de lint/format configurado.
- `dist/`: 25 archivos; presentes los 22 paths esperados de páginas, sitemap, robots, iconos, imágenes sociales, fuentes y WebP. Sin source maps, rutas de QA/docs/src, `.env`, endpoints imprevistos ni coincidencias con patrones de secretos o URLs del alias de QA en archivos de texto.
- QA 404: **6 casos PASS, 0 fallos** en Chrome 153.0.8010.53 y Edge 153.0.4234.48 a 390/1440 px, más Chrome sin JS a 320 px y reduced motion a 390 px. En Astro preview, ruta inexistente da HTTP 404 con la página propia, cinco enlaces de inicio, `noindex`, sin overflow ni errores; foco inicial de teclado y navegación EN comprobados. Datos: `qa/h8-preflight-results.json`. Capturas desktop/mobile revisadas: `qa/h8-preflight/404-1440.png` y `qa/h8-preflight/404-390.png`.
- Guardian 404: **Keep** foco único en 404 y recuperación por idioma; **Remove** ningún recurso adicional; **Change** sólo página mínima y reglas de hosting; **Risk** comportamiento efectivo de Hostinger pendiente; **Verdict APPROVE** para el preflight, sin cierre de H8.

## Corrección, deployment y paquete vigente — 2026-09-26

- Corrección espacial de la línea: `progress()` ya no usa `data-ramiro-scene` para cambiar globalmente `[data-line-path]`. El path base queda en negro y el mismo path, progreso, nodos y timings se pinta de blanco sólo dentro de un `clipPath` basado en la caja real de `.about`; sus límites se recalculan en los rebuilds de layout/resize. H7 documentó una implementación global incorrecta y verificó color computado, no superposición espacial. La regresión vigente en `qa/h8-line-clipping-results.json` pasó otra vez después del nuevo copy: **31 estados**, cinco idiomas, 390/1440 px, ambos sentidos de scroll, resize, diez pares theme/accent, reduced motion y seis capturas; cero overflow, errores de consola, requests fallidos o fallos. Path y comandos conservan su estructura; diferencia máxima de coordenadas de referencia <0,01 CSS px. El pulso de 3,5 s, delay final de 0,8 s y fade de 0,18 s están sincronizados entre ambas representaciones.
- Copy final de Servicios: Ramiro actualizó el segundo y tercer párrafo para evitar reiterar «puedo». ES exacto y versiones naturales EN/PT/FR/JA están en `src/content/locales.ts`, `prototypes/v2-h4/v2/ES-COPY-APPROVED.md` y `docs/locales/`. No cambiaron los demás textos, layout, estilos, motion ni código de geometría.
- Commits de código: `d7850120a72af9f447cdb3fcf28c7bbf26b53cc3` (`Fix black accent path clipping in Ramiro scene`), `78e770dc5d63296dd8b50db9fb4b1bf8a01d0666` (`Align inverse Ramiro node pulse timing`) y `e3eb2a2b4caff95ba2a3a295ab8570d43aeb030f` (`Update Services copy before H8 release`). Push normal exitoso a `origin/main`; `e3eb2a2` es el commit fuente del paquete vigente.
- `pnpm build`: PASS, seis páginas estáticas con `404.html` y `sitemap.xml`. `pnpm check`: PASS, 49 archivos, 0 errores, 0 warnings, 0 hints. El preflight local 404 conserva **6 casos PASS** en `qa/h8-preflight-results.json`.
- QA de copy, directamente sobre Vercel: **15/15 PASS**, cinco idiomas × 320/390/1440 px; texto exacto comprobado, tres párrafos, sin overflow, sin cruces de la línea con el texto, sin errores de consola ni requests fallidos. Diez capturas (cinco idiomas × 390/1440) están en `qa/h8-services-copy/` y el resultado en `qa/h8-services-copy-results.json`.
- Deployment vigente verificado en [portfolio-rrrramita.vercel.app](https://portfolio-rrrramita.vercel.app/) con el commit `e3eb2a2`; QA Playwright remoto PASS. El alias es de QA: el dominio final `ramita.dev` no se actualizó.
- ZIP anteriores invalidados y retenidos como `.zip.invalidated` / `.sha256.invalidated`: el de `0af5489a63559b18651a7d10360a54a7a9165506` (SHA `9457fd6e65879db2fff210c1f8a8115d18641fef4e58601f40d1426d5fad5e9c`), el intermedio `d7850120a72af9f447cdb3fcf28c7bbf26b53cc3` (SHA `1f849cb445a23493fa1bcf81c6329bb867ccad32c15e07528fd00b5626589134`) y el anterior `78e770dc5d63296dd8b50db9fb4b1bf8a01d0666` (SHA `fbd4b0cc5c658649a2cd7c23f96df5b59496b7c908e8723322ee65c025c6cdfc`).
- Paquete vigente, generado desde la build fresca de `e3eb2a2`: `release/ramita-h8-e3eb2a2b4caff95ba2a3a295ab8570d43aeb030f.zip`, 25 archivos y 788.724 bytes, con `dist/` en la raíz y el 404 aprobado incluido. SHA-256 del ZIP: `5e42e9ca1e71f9a20f7acf613b49b89e592e6afa19b34c4293a3229f960ea693`.
- Manifiesto vigente: `release/ramita-h8-e3eb2a2b4caff95ba2a3a295ab8570d43aeb030f.sha256`. Verificación: 25 miembros, hash de cada archivo y del ZIP coincidente, `404.html` presente, cero fallos. `release/` queda fuera de Git.
- `hosting/README.md` indica copia previa, extracción en la raíz pública, fusión del `.htaccess`, purga de caché si hace falta, comparación y rollback. `qa/h8-production-checks.cjs` sigue preparado para comprobar respuestas, 25 hashes publicados, metadata, links y smoke en el dominio final.

## Línea base automatizada antes de la carga

- El verificador de producción se ejecutó sobre el sitio antiguo para probar el propio procedimiento. Los 22 smoke de Chrome/Edge, cinco idiomas y tamaños 390/1440 px, más Chrome sin JS y reduced motion, pasaron. No sustituye la repetición posterior a la carga. Resultado: `qa/h8-baseline-results.json`; capturas: `qa/h8-baseline/es-390.png` y `qa/h8-baseline/es-1440.png`.
- Detectó los dos problemas de servidor ya identificados (`www` sin 301 y 404 genérico) y 14 discrepancias del manifiesto: JS/CSS, `404.html`, Apple Touch Icon, cinco HTML localizados y cinco imágenes sociales. Son consecuencia esperada de que aún está publicada la build anterior; 11 de 25 hashes ya coinciden. No se observaron fallos de navegador en esta línea base.

## Pendiente después de la carga de Ramiro

- H8 permanece abierto. El paquete nuevo está preparado y verificado; Ramiro indicó que todavía no se publique en Hostinger y no se cargó allí.
- Registrar fecha/hora de publicación, copia previa, configuración efectiva, hashes y respuesta de la CDN. Verificar 301 `www` → raíz, 404 propio con estado 404, HTTPS/cadena, rutas, metadata, assets, enlaces y smoke Chrome/Edge sobre el dominio.
- Ejecutar Lighthouse/PageSpeed sobre producción y separar laboratorio de field data. Aplicar umbrales de `docs/DONE.md`; registrar corridas y excepciones persistentes.
- Auditar todas las casillas de `docs/DONE.md` con evidencia H7/H8. No cerrar V2-H8 ni declarar `ramita.dev V2 — DONE` mientras falte cualquiera de estas validaciones.
