# V2-H8 — publicación y validación de producción

**Estado:** IN PROGRESS. Este informe distingue el preflight local de las comprobaciones pendientes sobre `https://ramita.dev` después de la carga H8.

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

## Pendiente después de la carga de Ramiro

- Recibir listado de raíz pública y `.htaccess` vigente; fusionar reglas sin sobrescribir configuración de HTTPS u otros archivos. Preparar paquete y manifiesto asociados al SHA de producción.
- Registrar fecha/hora de publicación, copia previa, configuración efectiva, hashes y respuesta de la CDN. Verificar 301 `www` → raíz, 404 propio con estado 404, HTTPS/cadena, rutas, metadata, assets, enlaces y smoke Chrome/Edge sobre el dominio.
- Ejecutar Lighthouse/PageSpeed sobre producción y separar laboratorio de field data. Aplicar umbrales de `docs/DONE.md`; registrar corridas y excepciones persistentes.
- Auditar todas las casillas de `docs/DONE.md` con evidencia H7/H8. No cerrar V2-H8 ni declarar `ramita.dev V2 — DONE` mientras falte cualquiera de estas validaciones.
