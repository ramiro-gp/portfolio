# Hostinger — ramita.dev

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

Verificación pública adicional: www redirige al dominio raíz preservando `/en/` y query; una URL inexistente devuelve HTTP404 y los bytes del documento propio. Evidencia: `qa/hostinger-redirects-2026-10-30.json`. Revisión visual desktop pública y navegación del carrusel a JL Aberturas correctas. La matriz responsive y reduced motion completa sigue siendo la QA local del cambio, no una nueva certificación pública exhaustiva.

El manifiesto no secreto `.hostinger/site.json` identifica el destino para futuras publicaciones. No se modificó DNS, correo, analytics, dependencias del sitio ni plan. Esta publicación no cierra H8 ni declara DONE.
