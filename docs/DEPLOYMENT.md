# Hostinger — ramita.dev

## Activación GA4 del 2026-11-02

Se publica GA4 estándar gratuito con el ID real `G-SM3PHE0FHT`, tras comprobar la cuenta autorizada y crear una propiedad separada de Residencias. Variable pública de repositorio configurada y comprobada; sin secrets de Analytics, nuevas dependencias o suscripciones. Aviso compacto, aceptación/rechazo, preferencias en footer, política actualizada y atribución desde orígenes públicos de buscadores sin búsquedas/query/hash. Los clics de contacto miden intención; no se convierten todos los eventos en leads.

Último código publicado: `1677d6b597bb95304b4839b952fc889d1fc47a99`, [CI 41507466764](https://github.com/ramiro-gp/portfolio/actions/runs/41507466764) correcto; salida compilada `1763fd8717feb77b308ab69d09b942a376582677`. Verificación real: 638 checks públicos sin fallos, 31 archivos públicos contrastados con el build, doce alias 301 y tres 404 correctos, cinco destinos externos accesibles. 25 escenarios finales en producción/fixture, sin errores. Siete documentos W3C válidos; 15 casos de referrer y 566 checks de HTML generado correctos. Transporte real de once eventos HTTP204 y **recepción de visita/CTA comprobada dentro de Tiempo real de GA4**; los eventos de QA no son leads.

Search Console existente reutilizado, propietario verificado, cinco URLs comerciales indexadas con canonical propia y prueba en directo de home correcta. Sitemap actualizado enviado una vez y vínculo GA4↔Search Console confirmado. Sin tocar DNS, correo o protección CDN. La nueva lectura del sitemap e informes históricos requieren procesamiento de Google; no se declara indexada la utilidad Privacidad. Configuración, baseline, informes y limitaciones en [ANALYTICS.md](ANALYTICS.md). Backup previo en `release/seo-backup-before-ga4-2026-11-02/`; comparativa posterior en `release/seo-public-ga4-final-2026-11-02/`. Se conserva el estado de H8.

Corrección final de salida HTTP: `612a0c94175f423368595e3a3bb8d47cb1e40272`, [CI 41508839209](https://github.com/ramiro-gp/portfolio/actions/runs/41508839209) correcto, compilado `02ce1a36b31fe48e3e292a70f0f87f8611ffe213`. Callback oficial y límite de 250 ms permiten procesar el clic antes de dejar la página; cuatro pruebas simuladas cubren rechazo, callback, tag bloqueado y click modificado. Después del despliegue, 638 comprobaciones públicas correctas, 31 archivos contrastados con este build y salida real hacia WhatsApp correcta con **`contact_click` recibido en Tiempo real**. Sin enviar mensajes. Reportes `public-ga4-navigation-2026-11-02.json` y `release-verify-ga4-navigation-2026-11-02.json` dentro de `qa/seo/`. Los datos de QA no son leads.

## Publicación SEO del 2026-11-02

Cambios autorizados publicados desde `984da790cb502572dacc16236c87eb6abca25074`, [CI 41499497113](https://github.com/ramiro-gp/portfolio/actions/runs/41499497113) correcto, salida compilada `1d19433a382ffecaeff5c54ad8c3f9d590fec209`. Sigue el mismo sitio/cuenta/raíz y la integración automática existente. CI añade el checker del HTML inicial antes de actualizar la rama pública. Se publican consolidación 301 de alias index.html, schema/OG/sitemap, resúmenes factuales y privacidad; GA permanece desactivado sin ID real y no hay nuevo aviso visible de cookies. No se cambian DNS, correo, dependencias ni protecciones CDN.

Backup previo real en `release/seo-backup-2026-11-02/`, incluido `.htaccess` leído de Hostinger, con manifiesto de archivos públicos. Confirmación efectiva: 632 checks HTTP SEO sin fallos, 30 archivos comparados con el build, doce redirects de alias y tres 404 correctos, QA pública desktop/mobile/sin JS/reduced motion y W3C válido. Seis PNG públicos idénticos en RGBA aunque recodificados y SVG igual salvo saltos de línea. Lighthouse final mobile 98/100/100/100 y desktop 100/100/100/100; laboratorio, no CWV de campo. La observación de 403 a UA que imitan Google/Bing no prueba acceso/bloqueo de rastreadores reales; Search Console y activación/recepción de GA requieren acceso a la cuenta. Informe, evidencia, límites y rollback en `docs/SEO-2026-11.md`. No se declara H8 cerrado.

## Publicación del 2026-10-30

Ramiro autoriza publicar el último commit y automatizar futuras publicaciones. Sitio confirmado por API y hPanel: `ramita.dev`, cuenta `u571172642`, plan Premium Web Hosting, raíz `/home/u571172642/domains/ramita.dev/public_html`.

Build estático de `b268ba5` publicado con `hosting_deploy` desde `dist/`; respuesta `status: deployed`. Se incluyó el `.htaccess` leído del servidor para conservar www → HTTPS sin www y el 404 propio. La API lo devuelve después con las mismas directivas (normalización LF/CRLF). Se purgó caché desde hPanel, con confirmación de éxito.

Backup local previo de los 25 archivos públicos y del `.htaccess` leído del servidor: `release/hostinger-backup-20261030/`, con manifiesto SHA-256. No contiene secretos. Rollback: desplegar sólo los archivos de esa copia, excluyendo `manifest.json`; comprobar www/404 y purgar caché.

Los 29 archivos del build responden HTTP 200. Los cinco HTML, CSS, JS, fuentes, screenshots WebP y demás archivos no PNG coinciden byte a byte. Seis PNG tienen codificación diferente en CDN, también observada en publicaciones anteriores; esta comprobación no certifica igualdad RGBA. Evidencia: `qa/hostinger-release-2026-10-30.json`.

## Automatización

El plan Premium tiene integración Git para archivos HTML/PHP; no compila el proyecto Astro como el hosting Node.js de Business/Cloud. No conectar `main` directamente a la raíz pública: contiene código fuente, documentación y QA.

`.github/workflows/hostinger-static.yml` compila cada push a `main` con Node 24.12.0 y pnpm 11.7.0, lockfile congelado, Astro check y build. Sólo después de validar publica `dist/` y las reglas de `hosting/hostinger.htaccess` en `codex/hostinger-static`. Usa el token temporal de GitHub Actions con permiso `contents: write`, sin credenciales persistentes de hosting. No fuerza pushes. La rama de salida no activa este workflow.

Hostinger está conectado a `ramiro-gp/portfolio`, rama `codex/hostinger-static`, raíz `public_html`. Ramiro autorizó agregar `portfolio` a la app existente y completó la reautenticación de GitHub; el agente guardó ese permiso sin quitar ni alterar el acceso existente a VeganMusicStore. GitHub confirmó el cambio. No se otorgó acceso a todos los repositorios.

Primera ejecución CI [41113180912](https://github.com/ramiro-gp/portfolio/actions/runs/41113180912): PASS en 29 segundos para `d38f5c7`, rama compilada `ddf4297`. Hostinger confirmó «¡Deploy completado!» al conectar esa rama. Se actualizan los comentarios del archivo de reglas para reflejar que ahora se copia al build; no cambia su comportamiento. El push de esta documentación permite verificar también una actualización posterior de la rama compilada.

**Automatización verificada de extremo a extremo:** el push `26717cc` ejecutó [CI 41113540684](https://github.com/ramiro-gp/portfolio/actions/runs/41113540684), PASS en 28 segundos; generó `7ff61d3b` en la rama estática. Sin redeploy manual, Hostinger mostró ese commit como último despliegue completado (2026-10-30 16:14, duración 3 segundos), raíz `public_html`, implementación automática activada. Evidencia visual: `qa/hostinger-auto-deploy-2026-10-30.png`. Las futuras publicaciones requieren un push a `main`; si check/build falla no se actualiza la rama publicada. Un build sin cambios de archivos públicos no genera un deploy redundante. No quedan pasos manuales de activación pendientes.

Verificación pública adicional: www redirige al dominio raíz preservando `/en/` y query; una URL inexistente devuelve HTTP404 y los bytes del documento propio. Evidencia: `qa/hostinger-redirects-2026-10-30.json`. Revisión visual desktop pública y navegación del carrusel a JL Aberturas correctas. La matriz responsive y reduced motion completa sigue siendo la QA local del cambio, no una nueva certificación pública exhaustiva.

El manifiesto no secreto `.hostinger/site.json` identifica el destino para futuras publicaciones. No se modificó DNS, correo, analytics, dependencias del sitio ni plan. Esta publicación no cierra H8 ni declara DONE.
