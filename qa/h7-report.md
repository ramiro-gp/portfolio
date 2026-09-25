# V2-H7 — QA integral pre-release

**Fecha:** 2026-09-25

**Estado:** **V2-H7 — CLOSED**. H8 permanece **NOT STARTED**.

**Base:** `main`/`origin/main` estaban sincronizados en `09c2db753b6cddc05277b9f5b50a9bf72f5e701c` antes de los cambios H7. La suite completa probó el working tree que se registra en el commit de cierre. `cambios.md` permanece sin seguimiento y fuera de Git.

## Resultado técnico

`pnpm build`: **PASS**, cinco rutas localizadas y sitemap. `pnpm check`: **PASS**, 44 archivos, 0 errores, 0 warnings y 0 hints. No se agregaron dependencias. La primera invocación en sandbox recibió `EPERM` al leer una dependencia instalada; build, check y preview se repitieron con acceso concedido y pasaron. No hay script de lint/format configurado.

| Área | Cobertura | Resultado |
|---|---:|---|
| Responsive | 5 idiomas × 8 tamaños (320×640 a 1600×900) = 40 | PASS; 0 px de overflow horizontal. Secciones, casos, imágenes, menú, controles, línea y footer presentes. |
| Reflow/zoom | 5 idiomas × 320/390 px con texto al 200 % = 10 | PASS; sin overflow horizontal. |
| Sin JS / reduced motion | 5 idiomas × 390/1440 px en ambos estados = 20 | PASS; contenido, anchors y contacto disponibles sin JS; Hero estable, reveals visibles y menú sin demora con reduced motion. |
| Teclado | 5 idiomas × 390/1440 px = 10 | PASS; menú, Tab/Shift+Tab, Escape, foco, navegación, theme/accent, CTA, copia e IR ARRIBA. |
| Touch simulado | 5 idiomas × 390/768 px = 10 | PASS; sirve como QA automatizado, no sustituye touch físico. |
| Appearance | ES/JA × 390/1440 px × 5 accents Light + 5 Dark = 40 | PASS; tokens y colores seleccionados comprobados. Contrastes residuales de GitHub se registran como P2 aceptado, ver H7-P2-01. |
| Excepción Light + negro | Mobile 390×844 y desktop 1440×900; entrada/salida, hover/foco, accents, Dark, reduced motion y geometría | PASS en `sceneAccent` (4 escenarios, con checks combinados). GitHub y línea blancos dentro de Ramiro; la línea vuelve a negro fuera; geometría y grosor constantes. |
| SEO, enlaces y assets | 5 rutas; 14 assets | PASS; metadata localizada, canonical, hreflang, JSON-LD, OG/Twitter, sitemap, robots, iconos e imágenes sociales comprobados. |
| Smoke Chrome/Edge | 5 rutas × 390/1440 px × 2 navegadores = 20 | PASS; menú, navegación, foco, consola y red local. Chrome 153.0.8010.53; Edge 153.0.4234.48. |

La regresión completa (`qa/h7-checks.cjs`) terminó con **0 fallos**: responsive 40, zoom 10, variantes 20, teclado 10, touch simulado 10, appearance 40, escena Ramiro 4, SEO 5, enlaces 5, assets 14 y smoke Chrome/Edge 20. `qa/h7-results.json` contiene los datos; la repetición focalizada está en `qa/h7-scene-results.json`; `qa/h7/` conserva 41 capturas. CLS máximo local observado: **0,01083**. No hubo errores JS, requests locales fallidas ni warnings de consola en el barrido Chrome/Edge. HEAD a Residencias, LingoHive, GitHub y WhatsApp devolvió 200 el 2026-09-25; no comprueba el flujo posterior de esos servicios ni el deployment de producción.

## Cambio visual aplicado

El script existente de progreso de la línea marca en `<html>` si la sección Ramiro intersecta el viewport. Sólo cuando se combinan `data-theme="light"`, `data-accent="light-black"` y ese estado de escena, CSS pinta `data-line-path` y el enlace GitHub de `.profile-links` en `#F1F0EC`; el outline de foco del mismo enlace también es blanco. Al salir de Ramiro, la línea vuelve a `#202421`. La transición de `stroke` dura 180 ms y se elimina con reduced motion. No cambia el path SVG, stroke-width, nodos ni geometría. Los demás accents y Dark conservan el color seleccionado.

La suite mide **15,62:1** para GitHub blanco sobre Ramiro en negro Light. Hover conserva texto blanco y underline; el foco de teclado conserva texto y outline blancos. La regresión observa el color intermedio de la transición tanto al entrar como al salir. En reduced motion el cambio es inmediato.

## Inventario P0/P1/P2/P3

- **P0: 0.**
- **P1: 0.**
- **P2: 1 — H7-P2-01, excepción visual aprobada:** GitHub conserva el accent elegido en la escena oscura para Light verde **2,63:1**, azul **2,68:1**, rojo **3,03:1** y violeta **2,55:1** (mínimo AA para texto normal: 4,5:1). Se mantiene por la instrucción explícita de no cambiar ningún otro accent y por el comportamiento visual aprobado; es un enlace secundario y no bloquea las tareas principales. Los cuatro ratios se midieron a 390/1440 px en ES/JA y se incluyen en `knownExceptions` de `qa/h7-results.json`. Esta excepción queda visible para la revisión de DONE en H8.
- **P3: 1 — 404 del preview:** una ruta inexistente responde HTTP 404 con la página genérica en inglés de Astro. Verificar el 404 del hosting elegido en H8.

El defecto anterior de visibilidad temporal del menú con reduced motion fue corregido y su regresión pasa. No quedan hallazgos P0/P1.

## Pruebas externas y cobertura adicional

Ramiro informó **PASS** para una prueba real con NVDA en Windows y **PASS** para touch en un dispositivo físico. La respuesta no incluyó hash/URL probados, fecha/hora exacta, modelo, navegador ni versiones; estos límites de registro constan en `qa/h7-manual.md`. No se reportaron defectos P0/P1 en esas pruebas.

Safari desktop, iPhone/iPad, Firefox, Chrome Android adicional y versiones anteriores no se probaron; se documentan como QA adicional no bloqueante, no como aprobaciones. Chrome y Edge sí pasaron smoke. La matriz real de navegadores/dispositivos y la cobertura de producción siguen siendo evidencia complementaria.

## Cierre y pendiente de H8

Se cumplen los criterios de H7: build/check limpios, QA automatizado/manual ejecutable aprobado, touch físico real PASS informado, NVDA real PASS informado y cero P0/P1. Por tanto, **V2-H7 — CLOSED**. El cierre no declara el sitio terminado ni satisface `docs/DONE.md`.

H8 permanece **NOT STARTED**. Pendiente: comprobar DNS y HTTPS de `ramita.dev`; URLs internas/externas en el deployment; smoke test sobre producción; respuesta 404 del hosting; Lighthouse/PageSpeed de producción y sus umbrales (SEO ≥95, CLS ≤0,1, LCP ≤2,5 s, TBT ≤200 ms cuando falte field data y Core Web Vitals verdes si hay datos suficientes); registrar cualquier excepción persistente para la revisión de DONE.

**Guardian:** Keep: oferta, casos y contacto como están aprobados. Remove: nada por preferencia. Change: sólo la excepción Light + negro indicada por Ramiro. Risk: ratios P2 documentados, pruebas opcionales ausentes y QA público de H8 pendiente. Verdict: **APPROVE; V2-H7 CLOSED**.
