# Publicación manual V2-H8 en Hostinger

## Estado SEO publicado — 2026-10-20

La misión SEO final autorizó al agente a publicar en la sesión de hPanel. Raíz confirmada: `public_html`, hosting Premium Web Hosting. El ZIP SEO del 19 se revalidó contra el build nuevo; se aplicaron selectivamente sus cinco HTML mediante el editor (el selector de upload falló antes de transferir el ZIP). Cada contenido se comparó antes de guardar y por hash HTTP después. CSS/JS y otros assets permanecieron intactos.

No había `.htaccess`, comprobado con dotfiles visibles; se creó mínimo con las dos directivas de la plantilla, sin reemplazar configuración. Www 301 con rutas/query y 404 personalizado con HTTP404 están verificados. Backup completo recuperable fuera de la raíz pública: `ramita-seo-backup-20261020T0300Z/public_html`; copia local de los cinco HTML en `release/seo-backup-20261020/`, hashes verificados contra el release previo.

Para rollback, restaurar sólo esos cinco HTML y mover el `.htaccess` nuevo a la carpeta privada (antes no existía), purgar caché y repetir QA. No sustituir toda la raíz. Detalles, manifiestos y recibo del delta de seis archivos en `docs/SEO.md`. No se cambió DNS ni correo. El cierre SEO no cierra V2-H8.

El procedimiento siguiente conserva las instrucciones generales del release H8 y sus paquetes históricos.

El paquete `release/ramita-h8-<SHA>.zip` contiene **el contenido** de `dist/`, no la carpeta `dist/`. El manifiesto de igual nombre, terminado en `.sha256`, permite comparar archivos. El SHA indicado en ambos nombres identifica el commit de código destinado a producción.

1. En hPanel, entrar al sitio `ramita.dev` y confirmar cuál es su raíz pública (`public_html` en hosting web estándar). Antes de cargar, guardar una copia recuperable de los archivos actuales y del `.htaccess` efectivo **fuera** de la raíz pública. Compartir el listado de la raíz y el `.htaccess` existente, o confirmar su ausencia. No compartir credenciales.
2. Cargar el ZIP y extraerlo de modo que `index.html`, `404.html`, `en/`, `pt/`, `fr/`, `ja/`, `_astro/` y los demás assets queden directamente en la raíz pública. No publicar una carpeta `dist/` o `ramita-h8-<SHA>/` anidada. Si el panel permite un directorio privado de preparación, extraer allí y mover el contenido verificado a la raíz; de lo contrario, retirar el ZIP de la raíz pública en cuanto termine la extracción.
3. Fusionar `hosting/hostinger.htaccess` con el `.htaccess` **existente** en la raíz pública: conservar sus reglas de HTTPS y demás configuración, agregar `ErrorDocument 404 /404.html` y poner la regla `www` antes de reglas genéricas. Si no existía `.htaccess`, crear uno con esas directivas. No cargar el archivo de instrucciones `hosting/hostinger.htaccess` con ese nombre como asset público. Si el plan de Hostinger no admite `.htaccess`, configurar la página 404 y el redirect 301 equivalente desde hPanel usando el `404.html` generado.
4. Anotar fecha/hora de publicación y confirmar que el sitio abre. Comunicar la hora, el resultado de la carga y la configuración efectiva para ejecutar el QA de producción. Si la CDN mantiene HTML/CSS/JS antiguos, purgar su caché desde hPanel y volver a comprobar antes de diagnosticar una regresión.
5. Después de verificar la nueva versión, revisar la lista de archivos antiguos en la raíz pública. Retirar sólo artefactos identificados como pertenecientes a la versión anterior de ramita.dev y conservar cualquier archivo ajeno o sin identificar.

No se cambian registros DNS ni de correo. Si la publicación causa un fallo P0/P1, restaurar la copia y el `.htaccess` anteriores y registrar la hora y los síntomas.
