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

- Causa confirmada: `progress()` marcaba `data-ramiro-scene` al intersectar `.about` y una regla CSS convertía el stroke completo a `var(--inverse-text)`. El check H7 anterior comprobaba el color del stroke entero, pero no comprobaba el color por posición dentro de una captura.
- Lógica retirada: el selector que cambiaba globalmente `[data-line-path]` según `data-ramiro-scene`. Ese atributo queda para el enlace GitHub aprobado; no controla el color de la línea.
- Solución: el path base sigue usando el accent negro. Una segunda representación SVG usa el mismo `d`, dasharray, dashoffset, nodos y timings, y sólo se muestra en Light + `light-black`; un `clipPath` con `userSpaceOnUse` limita su blanco al rectángulo de `.about`. El rectángulo se vuelve a calcular junto con los rebuilds de layout/resize. Así el blanco queda recortado al área física de Ramiro y la capa base negra reaparece fuera de ella. No se alteraron geometría, grosor, tamaños de nodo, milestones ni ritmo del scroll.
- Commits de código: `d7850120a72af9f447cdb3fcf28c7bbf26b53cc3` (`Fix black accent path clipping in Ramiro scene`) y `78e770dc5d63296dd8b50db9fb4b1bf8a01d0666` (`Align inverse Ramiro node pulse timing`). Ambos fueron enviados mediante push normal a `origin/main`; el segundo es el commit fuente del paquete vigente.
- `pnpm build`: PASS para el commit fuente; seis páginas estáticas, incluyendo `404.html` y `sitemap.xml`. `pnpm check`: PASS, 48 archivos, 0 errores, 0 warnings, 0 hints. El preflight local 404 conserva **6 casos PASS** en `qa/h8-preflight-results.json`.
- QA focalizado directamente en el deployment Vercel: **31 estados PASS**, cinco idiomas × 390/1440 px, los tres estados visuales, scroll en ambos sentidos, resize 390→1440→390, los diez pares theme/accent, cambio desde los controles reales, reduced motion, sin overflow y 0 errores de consola/requests. Path y comandos coinciden con H7; diferencia máxima entre las coordenadas de referencia y el deployment <0,01 CSS px. Se verificaron además pulso de 3,5 s, delay final de 0,8 s y fade de 0,18 s idénticos para base e inversa. En reduced motion, pulso `none`, transiciones iguales de 0,01 ms y dashoffset sincronizado. Resultado: `qa/h8-line-clipping-results.json`.
- Las seis capturas remotas (tres estados × 390/1440) se revisaron visualmente: antes de Ramiro la línea queda negra; en la transición de entrada se ven simultáneamente negro sobre claro y blanco sólo sobre oscuro; en la salida vuelve a negro al cruzar a Contacto. Están en `qa/h8-line-clipping/`.
- Deployment vigente verificado con HTTP 200, HTML/CSS nuevos y regresión Playwright remota: [portfolio-rrrramita.vercel.app](https://portfolio-rrrramita.vercel.app/). La URL es el alias de QA; el dominio final `ramita.dev` no se ha actualizado desde esta tarea.
- ZIP anteriores invalidados: el de `0af5489a63559b18651a7d10360a54a7a9165506` (SHA `9457fd6e65879db2fff210c1f8a8115d18641fef4e58601f40d1426d5fad5e9c`) y el intermedio de `d7850120a72af9f447cdb3fcf28c7bbf26b53cc3` (SHA `1f849cb445a23493fa1bcf81c6329bb867ccad32c15e07528fd00b5626589134`) están retenidos con extensiones `.zip.invalidated` y `.sha256.invalidated`.
- Paquete vigente: `release/ramita-h8-78e770dc5d63296dd8b50db9fb4b1bf8a01d0666.zip`, 25 archivos y 788.617 bytes, con los archivos de `dist/` directamente en la raíz y el 404 aprobado incluido. SHA-256 del ZIP: `fbd4b0cc5c658649a2cd7c23f96df5b59496b7c908e8723322ee65c025c6cdfc`.
- Manifiesto vigente: `release/ramita-h8-78e770dc5d63296dd8b50db9fb4b1bf8a01d0666.sha256`. Verificación posterior: 25 miembros, SHA de cada miembro y del ZIP coincidentes, `404.html` presente, cero fallos. `release/` queda fuera de Git.
- `hosting/README.md` indica copia previa, extracción en la raíz pública, fusión del `.htaccess`, purga de caché si hace falta, comparación y rollback. `qa/h8-production-checks.cjs` sigue preparado para comprobar respuestas, 25 hashes publicados, metadata, links y smoke en el dominio final.

## Línea base automatizada antes de la carga

- El verificador de producción se ejecutó sobre el sitio antiguo para probar el propio procedimiento. Los 22 smoke de Chrome/Edge, cinco idiomas y tamaños 390/1440 px, más Chrome sin JS y reduced motion, pasaron. No sustituye la repetición posterior a la carga. Resultado: `qa/h8-baseline-results.json`; capturas: `qa/h8-baseline/es-390.png` y `qa/h8-baseline/es-1440.png`.
- Detectó los dos problemas de servidor ya identificados (`www` sin 301 y 404 genérico) y 14 discrepancias del manifiesto: JS/CSS, `404.html`, Apple Touch Icon, cinco HTML localizados y cinco imágenes sociales. Son consecuencia esperada de que aún está publicada la build anterior; 11 de 25 hashes ya coinciden. No se observaron fallos de navegador en esta línea base.

## Pendiente después de la carga de Ramiro

- H8 permanece abierto. El paquete nuevo está preparado y verificado; Ramiro detuvo explícitamente la carga manual a Hostinger y no se publicó allí.
- Registrar fecha/hora de publicación, copia previa, configuración efectiva, hashes y respuesta de la CDN. Verificar 301 `www` → raíz, 404 propio con estado 404, HTTPS/cadena, rutas, metadata, assets, enlaces y smoke Chrome/Edge sobre el dominio.
- Ejecutar Lighthouse/PageSpeed sobre producción y separar laboratorio de field data. Aplicar umbrales de `docs/DONE.md`; registrar corridas y excepciones persistentes.
- Auditar todas las casillas de `docs/DONE.md` con evidencia H7/H8. No cerrar V2-H8 ni declarar `ramita.dev V2 — DONE` mientras falte cualquiera de estas validaciones.
