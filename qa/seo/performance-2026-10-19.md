# Performance pública — 2026-10-19 (Argentina)

## Producción después del despliegue — 2026-10-20

Medición del dominio real después de publicar los cinco HTML SEO y `.htaccess`, con la misma versión Lighthouse 13.5.0, Chrome headless y presets de la medición inicial. Una ejecución por perfil; no son datos de campo ni una atribución causal de mejoras pequeñas.

| Producción actualizada | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 100 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 1484 ms | 375 ms |
| CLS | 0 | 0 |
| TBT | 34 ms | 0 ms |
| SCROLL: nombre accesible incluye texto visible | PASS | PASS |

Evidencia: `lighthouse-mobile-production-closure-2026-10-20.json` (03:29:53 UTC) y `lighthouse-desktop-production-closure-2026-10-20.json` (03:30:50 UTC), ambos para `https://ramita.dev/`, sin runtimeError ni runWarnings. La CLI volvió a terminar con EPERM durante la limpieza del perfil temporal **después** de guardar los reportes completos; no se afirma exit code cero. No se modificó el diseño para obtener estas puntuaciones. Baseline público: Performance 99/100, LCP 1577/371 ms, CLS 0/0, TBT 17/0 ms. La variación de TBT mobile sigue siendo pequeña y saludable; no justifica optimizaciones adicionales.

`browser-production-closure-2026-10-20.json`: 24/24 PASS sobre la versión publicada, con `QA_EXPECT_SEO_PATCH=1`; incluye los cinco idiomas, Chrome/Edge, 320/390/1440, sin JS, reduced motion, teclado, menú, preferencias, navegación y contactos. Sin errores de consola, página o red. Capturas nuevas en `screenshots-production-closure-2026-10-20/`; revisados Hero mobile y Contacto desktop, además de 404 real en navegador, sin cambio visual inesperado. Guardian: Keep composición/oferta/CTA/motion; Remove ninguno; Change sólo semántica y recuperación 404 ya aprobada; Risk cobertura automatizada y límites manuales históricos; Verdict APPROVE para esta misión técnica. V2-H8 permanece IN PROGRESS / NOT DONE.

Las secciones siguientes conservan la medición y los hallazgos iniciales del 19 de octubre, anteriores a esta publicación.

Mediciones nuevas de `https://ramita.dev/`, con Lighthouse **13.5.0** ya disponible en el caché local y Chrome headless **155.0.0.0**. No se instalaron dependencias ni se modificó producción.

| Laboratorio | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 99 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 1577 ms | 371 ms |
| CLS | 0 | 0 |
| TBT | 17 ms | 0 ms |
| FCP | 1127 ms | 291 ms |
| Speed Index | 2580 ms | 492 ms |
| Transferencia inicial observada | 151700 bytes | 111077 bytes |

Los dos casos superan los umbrales de laboratorio definidos en `docs/DONE.md`. Son una ejecución por perfil y no constituyen estadísticas de usuarios reales, INP, garantía de CWV de campo ni un cierre de H8. El menor peso desktop depende también de las imágenes lazy todavía fuera del viewport: no es el peso completo de todos los assets del sitio. No se hicieron cambios públicos durante las mediciones; no existe comparación pública antes/después de esta misión.

## Evidencia y alcance

- `lighthouse-mobile-initial-2026-10-19.json`: `fetchTime` 2026-10-20T01:59:59.380Z, configuración mobile predeterminada (throttling simulado).
- `lighthouse-desktop-initial-2026-10-19.json`: `fetchTime` 2026-10-20T02:00:36.361Z, preset desktop (throttling simulado).
- Ambos JSON completos tienen las cuatro categorías, métricas y auditorías, sin `runtimeError` ni `runWarnings`.
- Ambos procesos CLI terminaron con código 1 **después de guardar el resultado**, al borrar su perfil temporal en Windows (`chrome-launcher.destroyTmp`, `EPERM`). La medición está disponible y válida en los JSON; no se presenta el comando completo como una ejecución sin errores. No se borraron perfiles ajenos ni se modificó el caché de herramientas.
- `pagespeed-mobile-initial-2026-10-19.json` y `pagespeed-desktop-initial-2026-10-19.json`: respuestas reales de la API oficial de PageSpeed, **HTTP 429 / RESOURCE_EXHAUSTED**, cuota del consumidor de la API. No permiten determinar si el dominio tiene datos CrUX suficientes. No se consultaron credenciales ni se creó una integración permanente.
- La evidencia histórica `qa/h6-lighthouse-baseline/` corresponde a septiembre y a un alias Vercel distinto. Se conserva y no se usa como un antes comparable del dominio actual.

## Hallazgos concretos

1. La auditoría experimental `label-content-name-mismatch` detecta el enlace visible **SCROLL** con `aria-label="Servicios"`: el nombre accesible omite el rótulo visible. El score Accessibility 100 no prueba que no existan defectos. Corrección local propuesta: incluir `SCROLL` y el destino localizado en su nombre, sin cambiar la apariencia ni navegación; validarla sobre build local. La producción continuará con el defecto hasta publicar una versión corregida.
2. JavaScript inicial transferido: aproximadamente 6,3 kB; CSS: 6,6 kB; Instrument Sans: 89 kB. La fuente ya es local WOFF2 y el CSS pequeño, con una hoja externa que bloquea renderizado. Lighthouse estima **0 ms de ahorro LCP** por eliminar ese bloqueo en estos dos casos. No se justifica reemplazar la estrategia completa únicamente por esta advertencia.
3. `forced-reflow-insight`: ~30 ms en la inicialización del script público, más ~1–2 ms en otra ubicación; TBT 17/0 ms. Optimización opcional; no justifica eliminar la línea, Hero o animaciones aprobadas.
4. Los recursos observados tienen TTL de caché de siete días. Lighthouse estima 14 KiB mobile / 10 KiB desktop de ahorro potencial en visitas repetidas. Se puede estudiar caché `immutable` más larga **sólo para nombres con hash**; las fuentes e imágenes sin hash requieren una estrategia de invalidación. Cambiar headers del hosting necesita revisar la configuración real y autorización para publicación.

## Smoke público de navegación y renderizado

`browser-production-2026-10-19.json`: **24/24 casos PASS**, del 2026-10-20T02:02:06Z al 02:04:06Z (2026-10-19 23:02–23:04 Argentina). Chrome 155.0.8059.84 y Edge 155.0.4283.62, headless; no reemplaza dispositivos físicos ni lector de pantalla.

- Chrome: cinco idiomas × 320/390/1440 px; cinco idiomas sin JavaScript a 390 px; ES con reduced motion a 390/1440 px. Edge: ES a 390/1440 px.
- Sin overflow horizontal ni errores de consola, página o recursos. Las cinco páginas conservan un H1 estable, tres paneles de servicio, dos casos, cinco secciones, seis enlaces alternativos, imágenes con alt y destinos internos existentes.
- Comparados los estados JS y sin JS a 390 px en cada idioma: son iguales title, description, canonical, H1 accesible, párrafo del Hero, secciones, headings, contacto, alternates e idiomas. Oferta, evidencia y contacto están en el HTML utilizable sin ejecutar JS; no hace falta migrar ni añadir prerendering.
- Con JS: menú, Tab dentro del modal, Escape con devolución de foco, retirada de inert al navegar, theme/accent, persistencia tras reload, scroll a contacto y regreso arriba pasan. Navegación real ES → `/en/` comprobada. No se envió ningún mensaje ni se activaron los enlaces de contacto externos.
- Sin JS: `<details>` permite abrir menú/idiomas y el CTA enlaza a `#contacto`.
- Reduced motion: pulso desactivado, línea completa estática y palabra del Hero sin rotación durante la ventana observada. Con motion: `servicio` → `proyecto`, conservando el H1 accesible estable.
- Ocho capturas nuevas en `screenshots-production-2026-10-19/`. Revisión visual específica de Hero 390/1440, Contacto 390 y Proyectos 1440: oferta, CTA, email y evidencia legibles, sin recortes observados.
- Guardian: **Keep** composición, contenido y motion aprobado; **Remove** ninguno; **Change** nombre accesible de SCROLL; **Risk** cobertura manual, lector de pantalla y combinaciones de contraste históricamente exceptuadas no revalidadas aquí; **Verdict APPROVE WITH CHANGES**, sólo para esta revisión técnica, sin sustituir aprobación humana ni cerrar H8.

Reproducir con `node qa/seo/production-smoke.cjs` y un `QA_LABEL` nuevo. El runner se niega a reutilizar un JSON o carpeta de capturas existentes; no sobreescribe evidencia. Usa el Playwright existente y admite `QA_BASE` local; canonical/alternates conservan el dominio público por diseño. El modo público predeterminado comprueba la base funcional sin exigir cambios todavía no publicados. Para verificar los cambios de esta misión, establecer `QA_EXPECT_SEO_PATCH=1`.

## Validación del build local corregido

`browser-local-final-2026-10-19.json`: **24/24 PASS** contra `http://127.0.0.1:4322`, incluyendo la matriz anterior, sin JS y reduced motion. El nombre accesible computado del enlace incluye ahora el texto visible: `SCROLL: Servicios`, `SCROLL: Services`, `SCROLL: Serviços` y `SCROLL: サービス`, según idioma. JSON-LD comprobado: un `Person` en cada idioma, `WebSite` adicional sólo en la raíz ES y sin introducir una empresa ficticia. No se observó cambio visual en las capturas.

La validación oficial **W3C Nu 26.10.18** del HTML generado detectó inicialmente tres errores repetidos en los cinco idiomas: `aria-label` en contenedores `div` genéricos de menú, idiomas y aspecto. Se preservan las respuestas en `nu-*-local-before-aria-2026-10-19.json`. El root corrigió los tres contenedores con `role="group"` y reconstruyó el sitio. Revalidación de los **cinco idiomas y 404**: HTTP 200, `messages: []` en los seis resultados `nu-*-local-final-2026-10-19.json` (**cero errores y warnings**). Se envió únicamente el markup público generado, sin credenciales ni tokens.

Ejemplo reproducible de Nu (cambiar archivo y nombre de salida para cada ruta/corrida):

```powershell
curl.exe --silent --show-error --max-time 60 -H 'Content-Type: text/html; charset=utf-8' --data-binary '@dist/index.html' --output qa/seo/nu-es-local-final-2026-10-19.json --write-out '%{http_code}' 'https://validator.w3.org/nu/?out=json'
```

El smoke local completo se inició antes del último rebuild ARIA. La validación Nu final se hizo sobre los archivos del rebuild nuevo. La pasada adicional `browser-local-aria-final-2026-10-19.json` terminó **6/6 PASS** sobre ese mismo build: cinco idiomas mobile + ES desktop, nombres accesibles, tres roles group, JSON-LD, menú/foco, navegación y persistencia. Ocho capturas nuevas en `screenshots-local-aria-final-2026-10-19/`; revisados Hero y Contacto a 390/1440: apariencia y legibilidad conservadas. Estas validaciones locales no modifican el estado del dominio público.

Modo futuro de regresión local (usar siempre un label nuevo):

```powershell
$env:QA_BASE='http://127.0.0.1:4322'
$env:QA_LABEL='local-seo-nueva-corrida'
$env:QA_EXPECT_SEO_PATCH='1'
node qa/seo/production-smoke.cjs
```

Se puede agregar `QA_SCOPE=semantics` para repetir únicamente los seis casos afectados por la corrección ARIA. El comando `node --check qa/seo/production-smoke.cjs` pasó después de introducir los modos y la protección de archivos; un intento deliberado con un label existente fue rechazado antes de iniciar el navegador.

## Lighthouse local después de las correcciones

Misma herramienta y Chrome que la medición pública; build estático servido en `http://127.0.0.1:4322/`, preset mobile/desktop. Son validaciones posteriores locales, **no una comparación antes/después del hosting público**. Caché, compresión, latencia y entrega difieren.

| Laboratorio local | Mobile | Desktop |
| --- | ---: | ---: |
| Performance / Accessibility / Best Practices / SEO | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| LCP | 1654 ms | 364 ms |
| CLS | 0 | 0 |
| TBT | 10 ms | 0 ms |
| Auditoría SCROLL `label-content-name-mismatch` | PASS | PASS |

Evidencia: `lighthouse-mobile-local-final-2026-10-19.json` (fetchTime 2026-10-20T02:09:01.010Z) y `lighthouse-desktop-local-final-2026-10-19.json` (02:09:18.053Z), JSON completos sin runtimeError ni runWarnings. Los CLI presentan la misma limitación de limpieza temporal EPERM posterior al guardado ya descrita arriba. Reproducción: mismos comandos Lighthouse anteriores, sustituyendo URL por `http://127.0.0.1:4322/` y usando nombres de salida nuevos.

## Reproducción

Usar el Lighthouse ya instalado, o una instalación autorizada equivalente, y conservar la versión y configuración. Ejecutar mobile y desktop por separado con el equipo sin otras tareas pesadas:

```powershell
$env:CHROME_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'
node C:/Users/ramiro/AppData/Local/npm-cache/_npx/1722e863ebfd623b/node_modules/lighthouse/cli/index.js https://ramita.dev/ --chrome-flags='--headless=new --disable-gpu' --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=qa/seo/lighthouse-mobile-initial-2026-10-19.json --quiet
node C:/Users/ramiro/AppData/Local/npm-cache/_npx/1722e863ebfd623b/node_modules/lighthouse/cli/index.js https://ramita.dev/ --preset=desktop --chrome-flags='--headless=new --disable-gpu' --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=qa/seo/lighthouse-desktop-initial-2026-10-19.json --quiet
```

Para una corrida futura, cambiar los nombres de salida; preservar los originales. Si una medición incumple umbrales, repetir para distinguir ruido de un defecto persistente. Después de una publicación autorizada, repetir contra el dominio; una mejora local no es una mejora ya observada en producción.
