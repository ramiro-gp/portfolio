# SEO de ramita.dev — auditoría 2026-10-19 y publicación 2026-10-20

Fecha local: Argentina. Los JSON conservan timestamps UTC. La auditoría del 19 se autorizó mediante `docs/prompts/Prompt_SEO.md`. La misión de cierre posterior autoriza publicación selectiva en Hostinger, backups, `.htaccess`, QA y commit SEO sin trabajo ajeno. El propietario completó las verificaciones DNS; el agente no cambió DNS.

**Estado actual: cambios SEO publicados y validación técnica de producción aprobada. Google y Bing conservan sus propiedades y sitemaps. V2-H8 permanece IN PROGRESS; STATUS: NOT DONE.**

## Publicación y validación de cierre — 2026-10-20

La misión final del propietario sustituye la restricción anterior de no publicar. No cambia diseño, copy, arquitectura, dependencias, analytics ni política de bots. Se partió de `main`, `74d14b2`, con los mismos siete archivos modificados por la auditoría; `cambios.md` y `docs/prompts/` preexistentes se preservaron y se excluyen del commit SEO.

### Método, artefacto y respaldo

Se comprobó la sesión autorizada de hPanel, hosting **Premium Web Hosting**, cuenta `u571172642`, sitio `ramita.dev`, raíz pública **`public_html`**. El administrador de archivos mostraba desactivado «Hide dotfiles»; no había `.htaccess` ni en la raíz pública ni en su copia. Por eso se creó un archivo nuevo mínimo, sin sustituir reglas existentes. HTTPS de Hostinger se conserva.

Antes de editar se copió todo `public_html` al directorio hermano privado **`ramita-seo-backup-20261020T0300Z/public_html`**, fuera de la raíz pública. Se verificó el inventario copiado y se guardó una copia local adicional de los cinco HTML en `release/seo-backup-20261020/`; sus hashes coinciden con el release anterior. [Backup](../qa/seo/hostinger-backup-2026-10-20.jpg), [manifiesto local](../qa/seo/backup-html-manifest-2026-10-20.json).

Se ejecutó un build nuevo y se compararon los **25 miembros** del ZIP original con `dist/`: todos coinciden. Se conserva SHA-256 **`56ca51db106fb7096fc7b43e561dbd01de37802356658bcbd63e06cd1436e600`**. No había un ZIP obsoleto ni cambios posteriores de aplicación. [Validación del paquete](../qa/seo/package-closure-2026-10-19.json).

El selector de carga del navegador falló antes de transferir el ZIP al staging privado. El despliegue efectivo fue **selectivo mediante el editor de hPanel**, pegando cada HTML generado, comprobando igualdad exacta por selección/copia antes de guardar, y verificando sus bytes públicos después. Se guardaron `index.html`, `en/index.html`, `pt/index.html`, `fr/index.html`, `ja/index.html` y el `.htaccess` nuevo, aproximadamente **00:24–00:26 del 20 de octubre, Argentina (03:24–03:26 UTC)**. No se sustituyó `public_html`, no se publicaron fuentes/documentación ni se tocaron archivos de otros sitios. Se solicitó una purga de caché desde el panel del dominio; la comprobación posterior confirmó el contenido esperado.

Se creó como recibo reproducible `release/ramita-seo-deployed-delta-2026-10-20.zip`, con esos **seis archivos exactos** y SHA-256 **`fedd05bcc5893b3e7ec32c3e6d9e41adeb83951ec6fd8db6830171406fefd1b0`**. Este ZIP de recibo no se subió: registra los archivos aplicados individualmente. [Manifiesto del delta](../qa/seo/deployed-delta-manifest-2026-10-20.json), [registro de publicación](../qa/seo/hostinger-deployment-2026-10-20.json).

El `.htaccess` efectivo contiene únicamente `ErrorDocument 404 /404.html` y la regla 301 condicionada a `www.ramita.dev`, con destino HTTPS y `%{REQUEST_URI}`, sin sustituir query strings. [Contenido aplicado](../qa/seo/htaccess-production-2026-10-20.txt), [captura](../qa/seo/hostinger-htaccess-applied-2026-10-20.jpg). Compatibilidad contrastada con la documentación de [Hostinger sobre páginas de error](https://www.hostinger.com/support/1583295-how-to-customize-your-website-s-error-pages-in-hostinger/) y de Apache sobre [ErrorDocument](https://httpd.apache.org/docs/2.4/mod/core.html#errordocument) y [RewriteRule](https://httpd.apache.org/docs/current/en/rewrite/flags.html), y confirmada por respuestas reales del hosting.

### Validación real de producción

- Astro build y Astro check: **52 archivos, cero errores, warnings e hints**. HTML generado: **420 checks / cero fallos**. HTTP local: **466 / cero fallos**. Smoke local: **24/24 PASS** sobre el build nuevo. Los intentos iniciales restringidos por EACCES/ECONNREFUSED se conservan separados y se repitieron con un preview accesible; no fueron defectos del sitio.
- Checker público: **472 checks / cero fallos**, frente a 468 / dos fallos del mismo www en la auditoría. Permanecen cinco observaciones conocidas de aliases `index.html` con canonical correcta, sin bloqueo crítico. [Resultado](../qa/seo/public-closure-first-2026-10-20.json).
- Comparación pública de los 25 archivos: **19 coincidencias binarias**, incluidos los cinco HTML nuevos, CSS/JS, fuentes, 404, sitemap y robots. Los seis PNG conservan las diferencias de codificación previas: **seis de seis idénticos en RGBA, dimensiones, formato y perfil ICC**, comprobados de nuevo, sin cambio visual. [Hashes, redirects y bots](../qa/seo/deployment-http-2026-10-20.json), [comparación de PNG](../qa/seo/png-production-closure-2026-10-20.json).
- `https://www.ramita.dev/` y los cuatro idiomas devuelven **301** con `Location` al dominio raíz y la misma ruta. Query `?seo-closure=1&keep=a%2Bb` preservada exactamente. Las ocho pruebas de redirección terminan en canonical HTTPS con HTTP200, sin bucles. HTTP-www conserva la secuencia del hosting de dos 301; no se añadió una regla global de HTTPS.
- Tres URL inexistentes de raíz/EN/JA devuelven **HTTP404 sin redirección** y exactamente los bytes de `dist/404.html`. Los cinco enlaces de recuperación apuntan a páginas funcionales; se probó además la navegación real a EN. [Captura pública](../qa/seo/custom404-production-2026-10-20.jpg).
- TLS válido y verificado; sin errores de infraestructura. [HTTP/TLS](../qa/seo/infrastructure-closure-2026-10-20.json).
- **21 consultas** de Googlebot, Bingbot y OAI-SearchBot: cinco páginas, robots y sitemap, todas HTTP200, bytes esperados y sin `X-Robots-Tag` bloqueante. El contenido comercial continúa en el HTML inicial. No se cambió robots ni la política de entrenamiento, ni se añadieron llms.txt, IndexNow o servicios pagos.
- Metadata localizada, canonical/hreflang, OG/Twitter, Person en cinco rutas y WebSite sólo en raíz se validaron en producción. La identidad binaria del HTML enlaza este despliegue con el markup previamente validado oficialmente, además de los checks actuales.
- Smoke público con `QA_EXPECT_SEO_PATCH=1`: **24/24 PASS**, sin errores de consola, página o red; cinco idiomas, 320/390/1440, Chrome/Edge, JS/sin JS, reduced motion, menú/foco/inert, navegación, animaciones, preferencias y contacto. [Resultado](../qa/seo/browser-production-closure-2026-10-20.json). Capturas de Hero mobile, Contacto desktop y 404 revisadas sin regresión visual; no sustituye QA manual de toda la matriz de H8.

| Lighthouse público final | Mobile | Desktop |
| --- | ---: | ---: |
| Performance / Accessibility / Best Practices / SEO | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| LCP | 1,484 s | 0,375 s |
| CLS | 0 | 0 |
| TBT | 34 ms | 0 ms |

Misma versión y presets que el baseline público, una medición por perfil: no se atribuye causalidad a fluctuaciones pequeñas. JSON completos sin runtimeError ni warnings; la CLI terminó con EPERM al limpiar su perfil temporal después de guardarlos. [Detalles y límites](../qa/seo/performance-2026-10-19.md). No hay una nueva medición CrUX/INP de campo.

### Google, Bing y seguimiento posterior

Search Console conserva **propietario verificado**, sitemap **Correcto / cinco páginas** y las **cinco URLs indexadas**, con canonical elegida por Google igual a cada URL inspeccionada, rastreo permitido y obtención correcta. Acciones manuales y seguridad: **ningún problema detectado**. Rendimiento sigue procesando datos y pide volver mañana; no se inventan métricas. IA generativa sigue en **Incluir**, sin modificarla. No se reenviaron sitemaps ni se solicitaron indexaciones a Google. [Revalidación de Google](../qa/seo/search-console-closure-2026-10-20.json), [sitemap](../qa/seo/google-sitemap-closure-2026-10-20.jpg).

Bing conserva **administrador verificado por DNS**, sitemap **Success / cinco URLs / cero errores y advertencias**, y su tester oficial vuelve a devolver **Bingbot Allowed**, con robots sin errores. La home conserva el intento histórico del **25 de septiembre**, no un rastreo nuevo confirmado; Live URL volvió a fallar con error genérico en un solo intento de esta misión. No se cambió robots por ese reporte. Los cuatro idiomas siguen **Discovered but not crawled**, descubiertos el 28 de septiembre.

Después de comprobar acceso público y estado actual, se enviaron **EN/PT/FR/JA una sola vez cada una**, en un único lote, bajo la autorización de la misión. El historial previo contenía sólo la home. El contador oficial pasó **1 → 5 solicitudes** y la cuota **99 → 95**; la lista mostró después un error temporal, persistente tras una recarga. Es evidencia de cuatro solicitudes registradas y cuota consumida, no de rastreo ni indexación. No se repitió el lote ni la home. [Evidencia de contadores](../qa/seo/bing-submissions-closure-2026-10-20.jpg).

Search Performance de Bing sigue preparando datos y pide **48 horas**. AI Performance BETA muestra **0 citas / 0 páginas citadas** y tablas «No data available» para **19 de julio–18 de octubre de 2026**, con aviso de actividad muestreada; no prueba ausencia absoluta de citas. [Revalidación de Bing](../qa/seo/bing-webmaster-closure-2026-10-20.json), [robots](../qa/seo/bing-robots-closure-2026-10-20.jpg), [IA](../qa/seo/bing-ai-closure-2026-10-20.jpg).

**Seguimiento operativo, sin bloquear el cierre:** el **21/10/2026**, revisar las métricas disponibles en Google Search Console; el **22/10/2026**, revisar rastreo e indexación en Bing, sin solicitudes duplicadas; aproximadamente a los 30 días, el **19/11/2026**, analizar impresiones, clics, consultas y oportunidades reales de posicionamiento. No hace falta ejecutar estas comprobaciones durante el cierre del repositorio. Esperar métricas/rastreo no es un defecto de la implementación. No se prometen rankings, tráfico ni apariciones en asistentes.

**IMPLEMENTACIÓN SEO FINALIZADA — COMPLETADO.** Los doce criterios técnicos de la misión tienen evidencia de publicación y comprobación; las cuentas conservan su configuración. **BLOQUEOS REALES: ninguno para esta misión.** Permanecen como límites de seguimiento los reportes externos en preparación, el error de Live URL/listado de Bing y las cinco observaciones de aliases con canonical correcta. No hay una regresión crítica detectada. Esto no cierra el sitio ni sustituye la matriz manual pendiente: **V2-H8 IN PROGRESS / NOT DONE**. La implementación está registrada en `6ccb5af`; el cierre documental y la sincronización autorizada de `main` con `origin/main` se verifican por separado, conservando `cambios.md` y `docs/prompts/` excluidos e intactos. El resultado y el último commit sincronizado se entregan en el cierre del chat; esta sincronización no modifica producción.

### Rollback disponible

No fue necesario ejecutarlo. Para revertir, restaurar **sólo los cinco HTML afectados** desde la copia privada o desde `release/seo-backup-20261020/`, que coincide con el release anterior. Mover el `.htaccess` nuevo fuera de `public_html` a la carpeta privada (antes no existía), conservándolo como evidencia; no borrar ni sustituir otros directorios. Purgar caché del dominio y repetir HTTPS, cinco rutas y smoke. Registrar hora y causa si se usa. El rollback revierte también www/404 al comportamiento anterior conocido.

Las secciones siguientes conservan la auditoría y los estados anteriores del **19 de octubre**. Las referencias históricas a cambios locales, publicación pendiente o solicitud de aprobación quedan sustituidas por este registro de publicación; los resultados externos de rastreo se distinguen del despliegue.

## Estado inicial comprobado

- Rama `main`, base `74d14b2`. Preexistían `cambios.md` y `docs/prompts/` sin seguimiento; se conservaron.
- Stack real: Astro 7.3 estático, TypeScript strict, CSS propio y scripts pequeños. No es una SPA React/Tailwind; no necesita una migración ni prerender añadido.
- Cinco páginas HTML completas: `/`, `/en/`, `/pt/`, `/fr/`, `/ja/`. Español en raíz; sin redirección automática por idioma ni dependencia de localStorage para el idioma.
- Oferta comercial, tres servicios, dos proyectos reales, presentación y contacto están en el HTML inicial. Cada versión tiene un H1 estable, cuatro H2 y seis H3. JavaScript mejora navegación y animación; no genera el contenido comercial.
- Titles/descriptions localizados y distintos, canonical propio, seis alternates recíprocos incluyendo `x-default`, OG/Twitter con imagen localizada, favicon e iconos presentes. H1 comunica diseño y desarrollo web. No se encontró contenido temporal público ni bloqueo de indexación en las cinco páginas.
- `robots.txt` y `sitemap.xml` responden HTTP 200 y MIME correcto. El sitemap contiene las cinco canonical. `Person` coincide con Ramiro Garcia, su dominio y GitHub públicos. No hace falta duplicar hreflang en el sitemap.
- DNS A/AAAA resuelve; NS `aster.dns-parking.com` y `helios.dns-parking.com`, CNAME `www` de Hostinger. Las direcciones CDN pueden variar. TLS 1.3 validado, certificado Let's Encrypt para raíz y `www`, vigente hasta 2026-12-24. Headers confirman Hostinger/hPanel/hcdn, compresión Brotli en HTML/XML y caché de siete días en los assets muestreados.
- HTTP→HTTPS y `/en`→`/en/` usan 301 y conservan query. **HTTPS `www` devuelve 200**, aunque canonical apunta a raíz. Las cinco variantes `index.html` también dan 200 con canonical correcto.
- Una URL inexistente devuelve **404 real**, sin soft 404; se sirve la plantilla genérica de Hostinger. `/404.html` propio existe, pero aún falta asociarlo al manejo de errores del servidor.
- Sin GA4, Vercel Analytics, trackers, cookies de seguimiento ni eventos de conversión detectados en fuente/solicitudes del smoke. Las preferencias visuales usan almacenamiento local. No se incorporó analítica.

Evidencia: [infraestructura](../qa/seo/infrastructure-2026-10-19.json), [HTML inicial público](../qa/seo/public-2026-10-19-reviewed.json), [baseline generado](../qa/seo/generated-2026-10-19-baseline.json), [smoke público](../qa/seo/browser-production-2026-10-19.json).

## Problemas, acciones y validación

No se demostró un P0 de rastreo/indexación. Los dos fallos del checker público corresponden a un mismo problema `www`, no a dos defectos distintos.

| Prioridad | Problema y evidencia | Acción / archivos | Riesgo y validación |
| --- | --- | --- | --- |
| P1 | `https://www.ramita.dev/en/?seo-audit=1` devuelve 200 y conserva host duplicado. | Regla 301 ya preparada en `hosting/hostinger.htaccess`; pendiente fusionar en servidor tras aprobación. | Conservar HTTPS, ruta/query y reglas existentes; probar raíz, idioma, query y ausencia de bucles después de aplicar. Las cinco inspecciones de Google confirman canonical propia elegida; el 301 de www sigue pendiente. |
| P2 | `SCROLL` visible tenía nombre accesible que sólo decía el destino. | `src/components/Hero.astro`: `SCROLL: <Servicios localizado>`. | Sin cambio visual ni de scroll; comprobar nombre accesible calculado en cinco idiomas, teclado, touch simulado y reduced motion. |
| P2 | W3C Nu encontró tres `div` nombrados con ARIA sin rol compatible, en los cinco idiomas. | `src/components/SiteHeader.astro`: `role="group"` en panel, idiomas y aspecto. | Sin CSS/JS nuevo; validar HTML y apertura/cierre, foco, inert, preferencias y navegación con/sin JS. |
| P2 | Nombre del sitio expresado visualmente y en OG, sin `WebSite`. | `src/layouts/BaseLayout.astro`: marcado mínimo `WebSite`, nombre `ramita.dev`, URL raíz, sólo en la home. Se conserva `Person`. | Datos públicos existentes; no cambia identidad. JSON parseado, Schema.org sin errores/advertencias; no garantiza un nombre concreto en Google. |
| P2 | Verificador H8 apuntaba a manifiesto invalidado inexistente. | `qa/h8-production-checks.cjs`: default al paquete vigente `1deb12b…`, SHA configurable/validado y soporte de varios bloques JSON-LD. | Check de payload exacto sigue separado del SEO. El script completo H8 no se presentó como ejecutado: se comprobó el manifiesto y se compararon sus 25 archivos por separado. |
| P2 | 404 pública no ofrece la recuperación localizada aprobada. | `ErrorDocument 404 /404.html` ya propuesto en hosting. | El HTTP404 actual ya comunica ausencia a buscadores. Comprobar status404 y cinco enlaces de recuperación después de fusionar. |
| P2 | No había auditoría SEO actual reutilizable independiente del ZIP H8. | `qa/seo-checks.cjs`, `qa/seo-infrastructure.mjs`, `qa/seo/production-smoke.cjs`. | Sin nuevas dependencias; outputs separados, fallos de transporte identificados como no disponibles, no como defectos del sitio. |
| P3 | Aliases `/index.html` con 200 y canonical correcto; caché/reflow puntual. | Observaciones, sin nuevas reglas ni refactor. | No se demostró un bloqueo ni un beneficio que justifique más complejidad en esta misión. |

`WebSite` tiene un uso documentado para [indicar el nombre del sitio a Google](https://developers.google.com/search/docs/appearance/site-names). Esta función no se valida con Rich Results Test; Google remite al validador de Schema.org. Se validó el fragmento exacto `Person` + `WebSite`: dos elementos, cero errores y cero advertencias. No se añadieron Organization, LocalBusiness, Review, Rating, BreadcrumbList ni Service sin necesidad demostrada. La home comercial no se convirtió en un ProfilePage.

## Search Console

Estado inicial: la sesión de Google se abrió con intervención del propietario y mostró la bienvenida sin propiedades disponibles. Se preparó la propiedad de dominio **ramita.dev** y Google entregó el TXT oficial. La primera verificación no encontró el registro. Se conserva la [captura histórica sin token](../qa/seo/google-verification-pending-2026-10-19.jpg); no describe el estado actual.

**Continuación comprobada — 2026-10-19: propiedad verificada por DNS, con permiso de propietario verificado.** El propietario ya había completado la verificación cuando el agente retomó la sesión; el agente no modificó DNS. La consulta pública confirma únicamente la presencia del TXT de Google, sin guardar su valor. Conservar ese registro después de verificar. Evidencia de la interfaz: [Search Console](../qa/seo/search-console-2026-10-19.json); comprobación pública: [sitemap, robots y presencia TXT](../qa/seo/sitemap-fetch-2026-10-19.json). No se guardaron tokens, cookies ni credenciales.

Se envió `https://ramita.dev/sitemap.xml` una sola vez. La lista mostró inicialmente «No se ha podido obtener»; después, el detalle confirmó **«El sitemap se ha procesado correctamente»**, última lectura **19/10/26**, **cinco páginas descubiertas** y cero vídeos. Fue una transición del panel, sin corrección del código ni reenvío. El sitemap procesado prueba lectura y descubrimiento; la indexación se comprobó por separado.

La inspección del índice confirmó **«La URL está en Google; La página está indexada»** para `/`, `/en/`, `/pt/`, `/fr/` y `/ja/`. En las cinco: rastreo permitido, obtención correcta, indexación permitida, canonical declarada propia y canonical elegida por Google igual a la URL inspeccionada. Las fechas de último rastreo mostradas van del 27 de septiembre al 15 de octubre de 2026; no son un rastreo producido por esta sesión. No se solicitaron indexaciones a Google porque las cinco páginas ya estaban indexadas.

Rendimiento, con rango de tres meses, e indexación de páginas agregada mostraron **datos en procesamiento**; no hay métricas disponibles de consultas, impresiones, clics, CTR, posición o exclusiones. Core Web Vitals indicó **datos de uso insuficientes en los últimos 90 días**, tanto mobile como desktop; no equivale a aprobar ni reprobar CWV. Acciones manuales y problemas de seguridad mostraron **ningún problema detectado**. Estadísticas de rastreo todavía no tienen datos.

El informe de robots del panel nuevo mostró «No hay ningún archivo robots.txt», pero la comprobación pública independiente devolvió HTTP 200, `text/plain`, `Allow: /` y la directiva del sitemap con los tres user agents muestreados. Se registra la diferencia de disponibilidad del informe; no se interpreta como ausencia real del archivo ni se modifica robots.

En Configuración, **Search generative AI = Incluir**, observado sin modificarlo. Es una preferencia de inclusión; no demuestra citas, impresiones generativas ni resultados comerciales. No se añadieron OAuth permanente, Indexing API, automatizaciones ni dependencias al frontend. Queda consultar los informes cuando terminen de procesar datos; para futuros reportes, empezar por exportaciones y justificar cualquier integración API recurrente con permisos mínimos y secretos fuera del repositorio.

## Bing Webmaster Tools

Estado inicial: servicio temporalmente indisponible; después se inició sesión con Google y se registró `https://ramita.dev/`, ambas acciones autorizadas por el propietario. La [captura de Verification pending](../qa/seo/bing-pending-2026-10-19.jpg) se conserva como historia; no describe el estado actual.

**Continuación comprobada — 2026-10-19: administrador verificado, método DNS.** User management muestra «You are a verified administrator», «Verified by: DNS» y rol Administrator. El propietario ya había completado el registro DNS; el agente no añadió registros ni tokens al código. No se importó desde Search Console ni se concedieron permisos OAuth adicionales.

Se envió `https://ramita.dev/sitemap.xml` una sola vez: pasó de **Processing** a **Success**, con **cinco URLs descubiertas, cero errores y cero advertencias**. La interfaz de Bing muestra fecha de envío/lectura `10/20/2026`; se conserva literalmente en el JSON y no se confunde con la fecha local de observación en Argentina. Evidencia: [Bing Webmaster](../qa/seo/bing-webmaster-2026-10-19.json), [sitemap correcto](../qa/seo/bing-sitemap-success-2026-10-19.jpg).

Las cinco inspecciones se comprobaron por separado del sitemap:

| URL | Estado mostrado en Bing Index | Alcance de la evidencia |
| --- | --- | --- |
| `/` | Indexed but blocked by robots.txt | Registro histórico: último intento 25 de septiembre de 2026, fetch fallido y canonical no disponible. No demuestra el estado actual de robots. |
| `/en/`, `/pt/`, `/fr/`, `/ja/` | Discovered but not crawled | Descubiertas el 28 de septiembre de 2026; no se presentan como indexadas. |

El **tester oficial actual de Bing** lee `Allow: /`, informa cero errores/advertencias y devuelve **Allowed** para la home con Bingbot. [Captura](../qa/seo/bing-robots-allowed-2026-10-19.jpg). Las consultas públicas con user agents normal/Googlebot/Bingbot también respondieron 200. No se cambió robots para resolver un bloqueo que no aparece en sus reglas actuales. La prueba Live URL de Bing devolvió un error genérico en dos intentos; no se afirma que esa prueba haya pasado ni que su error demuestre un bloqueo HTTP actual.

Ramiro autorizó expresamente enviar **sólo la home** a la cola de indexación; Bing confirmó **Indexing requested.** La confirmación previa mostraba 100 solicitudes disponibles ese día. [Evidencia de aceptación](../qa/seo/bing-home-indexing-requested-2026-10-19.jpg). No se enviaron solicitudes adicionales para los cuatro idiomas. La aceptación no equivale a un nuevo rastreo completado ni garantiza indexación; el sitemap ya informa esas cinco rutas.

**Search Performance:** «Please check back in 48 hours while we prepare the data for your site»; sin métricas disponibles. **AI Performance BETA:** disponible, rango mostrado 19 de julio–18 de octubre de 2026, contadores visibles de citas/páginas citadas en cero y tablas «No data available» con cero filas. Es una propiedad nueva con informes en preparación y actividad muestreada: esos ceros no prueban ausencia absoluta de citas en Bing/Copilot u otros sistemas. Se registró el panel, sin inventar consultas, países, clics, CTR ni posición. [AI Performance](../qa/seo/bing-ai-performance-2026-10-19.jpg).

IndexNow se evaluó y se difiere: cinco rutas con publicaciones ocasionales no justifican por ahora una automatización, clave e infraestructura adicionales. No garantiza indexación.

## Buscadores con IA, contenido y medición

- El HTML estático comercial, la autoría personal, servicios claros, evidencia real y contacto ya son comprensibles sin animaciones. No se agregó contenido artificial.
- `robots.txt` permite rastreo general. Se verificó para las cinco rutas y recursos críticos de Googlebot, Bingbot y OAI-SearchBot. Esto verifica directivas y acceso HTTP; no demuestra visitas de bots reales, lo que requeriría logs e identidad/IP comprobada.
- **OAI-SearchBot** corresponde a búsqueda; **GPTBot** a posible entrenamiento; **ChatGPT-User** a accesos iniciados por usuarios. Se investigó también PerplexityBot/Perplexity-User y Google-Extended. No son controles equivalentes. La regla general actual ya permite entrenamiento; no se amplió ni se decidió una política nueva sin consultar.
- No se añadió `llms.txt`: no hay beneficio concreto demostrado para este sitio; la guía actual de Google indica que lo ignora. No se lo presenta como requisito SEO.
- Se priorizan métricas oficiales de Search Console y Bing. Google y Search Performance de Bing aún preparan datos; AI Performance de Bing muestra ceros y tablas sin datos en el rango consultado. No se interpretan como mediciones concluyentes de visibilidad ni como ausencia absoluta de citas. No hay cifras disponibles de tráfico, consultas, CTR o posición.
- El muestreo cualitativo argentino confirma intención comercial en institucionales, landing pages y servicio freelance. No aporta volúmenes, dificultad ni una medición de ranking. La oferta existente encaja; no se justifican blog, FAQ, páginas de ciudades ni páginas de servicio adicionales con la evidencia actual.
- Una mención pública de Argentina/remoto o una ampliación de casos/copy requiere aprobación. No se inventaron ubicación, precios, plazos, garantías, clientes ni testimonios.
- No se creó Google Business Profile: falta evidencia de atención presencial elegible. No se instaló GA4; Search Console/Bing tienen prioridad antes de decidir conversión, identificadores y privacidad.

Fuentes y alcance detallados, incluidos los informes de IA vigentes en octubre de 2026: [investigación oficial](../qa/seo/official-research.md). Fuentes clave: [OpenAI](https://developers.openai.com/api/docs/bots), [Google](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [Bing AI Performance](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/).

## Performance y validación

| Laboratorio sobre producción, antes de cambios locales | Mobile | Desktop |
| --- | ---: | ---: |
| Lighthouse Performance | 99 | 100 |
| Accessibility / Best Practices / SEO | 100 / 100 / 100 | 100 / 100 / 100 |
| LCP | 1,577 s | 0,371 s |
| CLS | 0 | 0 |
| TBT | 17 ms | 0 ms |

Una pasada por perfil con Lighthouse 13.5.0; ambos informes válidos sin runtimeError/warnings. La CLI encontró un error de limpieza temporal Windows **después** de guardar los reportes; se documenta, no se presenta su exit code como limpio. PageSpeed API devolvió **429 por cuota**. No se obtuvieron CrUX/INP de campo. No hay comparación pública antes/después: los cambios siguen locales. Las mediciones históricas de otro deployment/fecha no se mezclan para atribuir mejoras.

Evidencia/órdenes y límites: [performance](../qa/seo/performance-2026-10-19.md).

Validaciones realizadas:

- Build Astro: seis páginas (cinco idiomas + 404), sitemap y assets. Check de tipos: cero errores, warnings e hints. No existe lint/format configurado. Corepack intentó descargar pnpm y falló por red; se ejecutó la CLI Astro **ya instalada**, sin instalar/actualizar dependencias ni lockfile.
- HTML generado final: auditoría estructural local. HTTP local: contenido, metadatos, schema, assets, sitemap, robots y 404 propios comprobados; redirecciones de hosting se evalúan únicamente en público.
- W3C Nu oficial v26.10.18: cinco idiomas y 404, **cero errores y advertencias** después de corregir los tres grupos ARIA. Respuestas anteriores preservadas con nombre `before-aria`.
- Smoke público: **24/24 escenarios**, Chrome 155.0.8059.84 y Edge 155.0.4283.62; cinco idiomas a 320/390/1440 px, cinco casos sin JS, reduced motion mobile/desktop, teclado, menú/foco/inert, navegación, contacto, persistencia y rotación visual con H1 estable. Sin overflow ni errores de consola/página/recursos. JS y sin JS exponen el mismo contenido comercial, metadata, contacto y enlaces de idiomas.
- Correcciones locales: nombre accesible calculado `SCROLL`, `WebSite` sólo en raíz y grupos ARIA comprobados en navegador, junto con regresión de los comportamientos afectados.
- Checker final: [HTML generado](../qa/seo/generated-2026-10-19-reviewed.json) **420 checks, 0 fallos**; [HTTP local](../qa/seo/local-2026-10-19-reviewed.json) **466 checks, 0 fallos**, cinco observaciones de aliases; [producción](../qa/seo/public-2026-10-19-reviewed.json) **468 checks, 2 fallos** del mismo redirect www, siete observaciones y ninguna consulta no disponible. No confundir observaciones con bloqueos.
- [Smoke local](../qa/seo/browser-local-final-2026-10-19.json): **24/24 PASS**. [Regresión sobre el último build](../qa/seo/browser-local-aria-final-2026-10-19.json): **6/6 PASS**, cinco idiomas y desktop ES. Capturas finales desktop/mobile revisadas sin cambios de composición.
- Lighthouse **local posterior**: mobile/desktop 100/100/100/100; LCP 1,654/0,364 s, CLS0, TBT10/0 ms; el audit de SCROLL pasa. Se informa por separado del dominio público: cambia el entorno, por lo que no demuestra una mejora de producción.
- Guardian: **Keep** oferta, CTA, evidencia real, contacto y composición; **Remove** nada; **Change** semántica/etiquetas sin rediseño; **Risk** pruebas automáticas no reemplazan aprobación humana ni lector de pantalla; **Verdict APPROVE** para este ajuste mecánico, sujeto a las limitaciones externas documentadas. No reabre ni cierra H8.

Cobertura adicional: no se volvió a ejecutar aquí NVDA, touch físico, Safari/iOS ni Firefox. Se preserva la evidencia histórica correspondiente sin presentarla como nueva. Los enlaces de contacto se verificaron sin enviar correos o WhatsApp; no se contactó a terceros.

## Estado al terminar la auditoría del 19 — anterior a publicación

| Elemento | Estado inicial | Acción | Estado final |
| --- | --- | --- | --- |
| Google Search Console | Sin sesión disponible; después bienvenida sin propiedad | Propietario completó DNS; agente comprobó acceso e inspeccionó las cinco URLs | Propietario verificado; cinco páginas indexadas con canonical propia elegida por Google; agregados en procesamiento |
| Sitemap | Existente | HTTP/XML/cinco canonical comprobados; envío único a Google y Bing | Correcto/Success en ambos; cinco URLs descubiertas en cada servicio |
| Robots.txt | Rastreo general permitido | HTTP y tester oficial de Bing | Correcto; Bingbot Allowed; política de entrenamiento sin cambios |
| Canonical | Propio por idioma | Inspección de las cinco URLs en Google | Google elige cada canonical propia; falta 301 de www |
| Metadatos | Localizados y completos | Auditoría HTML inicial/DOM/assets | Correctos; se conserva copy aprobado |
| Datos estructurados | Person factual | WebSite mínimo de home y validación | Person público; Person+WebSite validados localmente |
| JavaScript SEO | SSG completo | Comparación con/sin JS | Contenido comercial accesible sin JS |
| SEO multilingüe | Cinco rutas reales | lang, alternates, canonical y enlaces | Correcto; sin nueva arquitectura |
| Bing Webmaster Tools | Sin sesión; luego cuenta sin sitios | Registro, comprobación DNS y envío de sitemap | Administrador verificado; sitemap Success/cinco URLs; home enviada a cola con autorización; rastreo pendiente |
| Búsqueda con IA | Base SEO accesible, sin métricas privadas | Bots, preferencia Google y AI Performance de Bing revisados | Google Incluir sin cambios; Bing BETA muestra ceros/tablas sin datos, sin conclusión global sobre citas |
| Core Web Vitals | Sin medición fresca | Lighthouse mobile/desktop y consulta de Search Console | Laboratorio saludable; Google informa uso insuficiente en los últimos 90 días para mobile/desktop |
| Analítica | Sin trackers detectados | Evaluación | Sin nuevas cookies ni herramientas |
| Producción | Sitio accesible; config incompleta | HTTP/TLS/SEO/smoke/performance | www y 404 pendientes; cambios locales sin publicar |

## Pendientes registrados el 19 — sustituidos por el cierre del 20

1. Conservar el TXT de Google ya verificado. Search Console ya procesó el sitemap y confirmó las cinco páginas indexadas; queda revisar rendimiento, exclusiones e informes generativos cuando haya datos, sin interpretar «en procesamiento» como cero resultados.
2. Bing está verificado y su sitemap procesado. Conservar la verificación DNS y comprobar después del procesamiento el nuevo rastreo de la home y los cuatro idiomas, más Search/AI Performance. El registro histórico de robots y el error de Live URL no se declaran resueltos por una simple solicitud. No quedan registros DNS por agregar en esta misión.
3. Aprobar publicación de los ajustes locales y la **fusión**, no sustitución, de las dos directivas de `hosting/hostinger.htaccess` con la configuración real del servidor. Obtener copia recuperable de archivos y `.htaccess` antes de cambiar producción. No cambiar DNS de correo.
4. Después de publicar: purgar caché si corresponde, repetir HTTP/TLS, redirects con ruta/query, 404 real, cinco rutas, schema/metadatos/assets y smoke; repetir Lighthouse de producción con condiciones comparables.
5. Resolver explícitamente una nueva política de entrenamiento sólo si el propietario desea cambiar la actual. Sin automatizaciones ni analytics por defecto.

La comparación de los 25 miembros del paquete H8 `1deb12b…` con producción coincide en **19/25**; las diferencias son Apple Touch Icon y cinco PNG sociales. Se comprobó en memoria que los seis PNG públicos son **idénticos píxel por píxel**, también tras orientación EXIF; dimensiones, perfiles ICC y MIME correctos. Cambian metadatos/codificación PNG; no se atribuye la recodificación a un componente no comprobado. Los HTML/CSS/JS coinciden con ese paquete previo a los ajustes de esta auditoría. Evidencia: [hashes](../qa/seo/release-comparison-2026-10-19.json), [comparación visual exacta](../qa/seo/social-comparison-2026-10-19.json).

Paquete local nuevo preparado, **sin publicar ni commit**: `release/ramita-seo-2026-10-19-worktree.zip`, 25 archivos, 788.779 B, SHA-256 `56ca51db106fb7096fc7b43e561dbd01de37802356658bcbd63e06cd1436e600`. Su manifiesto `.sha256` verifica cada miembro contra `dist/`; el contenido está en raíz, sin documentos, fuentes de aplicación, credenciales ni `.htaccess`. Identifica el working tree revisado sobre `74d14b2`, no un nuevo commit. Las reglas de hosting se fusionan por separado sólo tras aprobación. Los paquetes H8 históricos se preservan.

Archivos de aplicación modificados: `src/components/Hero.astro`, `src/components/SiteHeader.astro`, `src/layouts/BaseLayout.astro`. Herramientas: `qa/h8-production-checks.cjs`, `qa/seo-checks.cjs`, `qa/seo-infrastructure.mjs`, `qa/seo/production-smoke.cjs`. Documentación: este informe, actualizaciones puntuales de `ARCHITECTURE.md`, `ROADMAP.md` y `DECISIONS.md`, investigación y notas de medición bajo `qa/seo/`. La evidencia original de QA no se reescribió.

## Procedimiento reutilizable

1. Registrar autoridad, rama/cambios, contenido factual, dominio, hosting y alcance. No asumir stack ni sesiones.
2. Solicitar HTML inicial de cada URL; comparar con DOM y sin JS. Registrar servicios, evidencia y contactos reales.
3. Comprobar DNS/TLS/HTTP/404/redirects, robots, sitemap, canonical, locales, metadata, enlaces y assets. Diferenciar bloqueo real de error de consulta.
4. Medir Lighthouse mobile/desktop antes de editar. Separar laboratorio de CrUX/INP y no inventar comparaciones.
5. Priorizar defectos comprobados; mantener diseño/copy salvo aprobación. Validar HTML y schema con herramientas adecuadas.
6. Verificar cuentas, propiedad, permisos y métodos oficiales. Obtener aprobación para DNS/publicación/OAuth adicional. Nunca guardar secretos en evidencia.
7. Repetir build, tipos, checker y smoke con/sin JS/reduced motion. Usar outputs nuevos y conservar baseline.
8. Publicar sólo con autorización, validar de nuevo sobre producción y después medir indexación, impresiones, clics y contactos como estados separados.

Comandos del proyecto, ejecutados desde su raíz (elegir nombres de evidencia nuevos):

```powershell
node node_modules/astro/bin/astro.mjs build
node node_modules/astro/bin/astro.mjs check
node qa/seo-checks.cjs --dist dist --out qa/seo/generated-NEW.json
node qa/seo-checks.cjs --base http://127.0.0.1:4322 --out qa/seo/local-NEW.json
node qa/seo-checks.cjs --base https://ramita.dev --out qa/seo/public-NEW.json
node qa/seo-infrastructure.mjs qa/seo/infrastructure-NEW.json
```

Un preview debe estar en ejecución antes del comando HTTP local. Un resultado técnico indexable no demuestra indexación, ranking, tráfico ni citas en sistemas de IA.
