# ARCHITECTURE.md — ramita.dev V2

Fuente de verdad para arquitectura técnica, i18n, compatibilidad, SEO técnico y deployment.
V2-H0 conserva requisitos útiles y separa decisiones dependientes de UI pendiente. No instala ni actualiza dependencias.

Fecha del baseline previo: 2026-09-11.

## Estado final V2-H5 — 2026-09-24

H5 está **CLOSED**; la salida sigue siendo Astro estático portable (`dist/`), sin adapter/backend ni proveedor de hosting elegido. Menú fullscreen con navegación numerada y modal progresivo, Hero rotativo sólo visual, Servicios sticky con fallback, línea desktop/mobile reversible calculada desde anclas, cursor sólo en fine pointer, Contacto con copia y retorno al inicio, reduced motion y memoria theme/accent están implementados. Con JavaScript, la navegación interna del menú, marca, CTA del Hero y SCROLL usa scroll nativo suave (auto con reduced motion), enfoca el destino y deja la URL sin fragmento; si ya existía uno, lo elimina con `history.replaceState` sin salto. Sin JavaScript, los anchors conservan navegación por fragmentos. El cambio de idioma conserva un fragmento equivalente cuando la URL de entrada lo contiene. Esta regla final sustituye las referencias históricas a `history.pushState` y fragmentos en la navegación JS de las pasadas anteriores.

Build y typecheck finales limpios; QA vigente de cinco rutas, interacciones, responsive, Chrome/Edge y path desktop registrado en `qa/`. Ramiro aprobó QA visual/funcional humano en desktop, mobile real y deployment Vercel; esto no constituye elección de proveedor. Lector de pantalla exhaustivo, Safari/iOS y matriz completa de versiones no se declaran probados y permanecen como QA adicional pre-release. Para H6: analizar el Lighthouse real aportado (CSS render-blocking ~7,4 KiB, PNG mobile de Residencias con ~125 KiB de ahorro potencial, forced reflow), optimizar assets/captions/alt y WOFF2 JA, y resolver integración/hosting final sin asumir Vercel.

## V2-H5 — segunda pasada final: Menú y Hero (2026-09-24)

El cierre usa un radio calculado hasta la esquina de viewport más distante respecto del trigger (limitado al radio actual si la apertura aún estaba en curso) y una animación inversa lineal de 420 ms. Esto elimina sólo el radio invisible; la apertura, el overlay, el focus trap, inert y el scroll lock permanecen sin cambios y activos hasta finalizar. La navegación de sección actualiza el fragmento mediante history.pushState para evitar el salto nativo y llama a scrollIntoView en el mismo evento, con smooth salvo prefers-reduced-motion, que usa auto; al terminar el cierre repite la alineación con el layout restaurado y entrega el foco. Los glifos del Hero amplían el clip horizontal con padding/márgenes iguales y opuestos en current/characters, preservando sus avances y sin alterar font, timing o reserva visual; el límite de ancho compacto compensa esa máscara. QA específico: qa/h5-menu-hero-final-pass-checks.cjs. H5 continúa IN PROGRESS; H6 no inicia.

## V2-H5 — novena pasada: layout mobile y transición desktop (2026-09-24)

Primera de dos pasadas finales. En compact el builder usa un único eje X compartido (width − 34 px) para el primer segmento del Hero, el corredor de Contacto y el nodo final; el último tramo vertical termina directamente sobre ese eje. Hero usa min-height calc(100svh − header), Ramiro y Contacto min-height 100svh, todos flexibles y capaces de crecer. Servicios y Proyectos conservan altura natural también en tablet compacto. Desktop modifica sólo la salida de Servicios hacia Proyectos y la transición Proyectos→Ramiro: después del texto de capacidades cruza el hueco libre a un corredor derecho, gira a la izquierda sobre el borde superior vacío de Proyectos y desciende por su gutter izquierdo; al terminar el contenido de Proyectos gira a la derecha dentro de la banda superior vacía de Ramiro y desciende por fuera del contenido. El progreso 85/15 por longitud/estructura cubre los intervalos Services→Projects y Projects→About; Contacto y su ancla no cambian. Geometry, longitudes y milestones se reconstruyen tras resize, orientación, carga de fuentes y alturas observadas; el frame de scroll continúa interpolando sólo la tabla precalculada. Menú y palabra rotativa siguen diferidos a la segunda pasada. No se cierra H5 ni se inicia H6.

## V2-H5 — corrección puntual posterior: Servicios→Proyectos desktop (2026-09-24)

Sólo se sustituye el subtramo al final del stack de Servicios: el path usa el borde inferior real del último panel de servicio, el borde izquierdo real del primer párrafo de capacidades (36 px de despeje exterior al stroke) y el inicio de Proyectos. Sale hacia la derecha desde el corredor izquierdo de Proyectos, baja en un gutter derivado del DOM a la izquierda del copy, gira a la izquierda una vez superado el bloque y continúa hacia abajo por ese mismo corredor hasta Proyectos. No vuelve al gutter derecho ni crea un horizontal ancho sobre Proyectos. Se mantienen segmentos ortogonales suavizados, sistema y nombres de milestones, retimación 85/15, scroll nativo reversible, reduced motion, grosor, nodos y color actuales. El builder compact (menor a 1024 px), el resto de Servicios y los recorridos desde/dentro de Proyectos no cambian.

## Stack V2-H5 ratificado

V2-H5 ratifica Astro 7.3 con salida estática, TypeScript strict, pnpm, CSS propio y scripts cliente pequeños. No se incorpora Tailwind, framework cliente, librería de motion, scroll suave global ni adapter de servidor. Los controles puntuales SCROLL e IR ARRIBA usan `window.scrollTo` nativo con `behavior: smooth` salvo reduced motion. Versiones exactas se fijan en el lockfile de implementación. El hosting concreto continúa pendiente; la salida `dist/` no debe depender de un proveedor.

Versiones históricamente registradas antes de H5; Tailwind quedó descartado para la implementación actual:

- Astro 7.3
- TypeScript strict
- Tailwind CSS 4.3
- pnpm
- HTML semántico
- CSS/TypeScript cliente sólo donde aporte valor

No incorporar React/Vue/Svelte por defecto.

## Filosofía de frontend

Entregar el máximo de HTML/CSS estático posible con el stack que se ratifique.

JavaScript cliente reservado para:
- theme/accent incluidos en H4 e implementados en H5;
- idioma/navegación cuando corresponda;
- interacciones/motion necesarias;
- accesibilidad de controles;
- persistencia local de preferencias.

## Motion

Prioridad:

1. CSS moderno;
2. Web Animations API / APIs nativas;
3. librería pequeña si resuelve una necesidad concreta;
4. GSAP u otra solución pesada sólo con justificación y aprobación.

No elegir librería de motion hasta prototipar los comportamientos principales.

## Tokens, theme y accent — alcance H4 y técnica H5

Decisión explícita posterior de Ramiro, 2026-09-21: **light predeterminado global** con verde profundo (`#176844`) y azul alternativo; dark disponible con naranja (`#FF9B58`) como accent predeterminado. Los diez accents y Aspecto discreto están aprobados en DESIGN.md. H5 implementa memoria independiente por theme en `localStorage`, con valores validados y lectura/escritura protegida; si no hay preferencia válida, usa light/verde, y al entrar por primera vez en dark usa naranja. El script temprano evita destellos cuando hay preferencias válidas. Esta ratificación técnica no altera el alcance H4.

Los diez valores exactos figuran como especificación activa aprobada en DESIGN.md; el archivo V1 permanece como antecedente.

Contrato funcional H5 actualizado: MODO y COLOR PRINCIPAL están siempre visibles dentro del menú fullscreen, sin subpanel Aspecto. Elegir Light/Dark o un accent aplica inmediatamente el cambio y mantiene abierto el menú para probar combinaciones. Cerrar al navegar a una sección, al cambiar de idioma y navegar, con Escape, con click/tap fuera o al volver a accionar el trigger. Tab o una mera salida de foco no cierran por sí solos. El cierre animado conserva overlay, foco contenido, fondo inerte y scroll lock hasta finalizar; Escape devuelve foco al trigger y un click/tap fuera no lo roba. Reduced motion usa cierre casi instantáneo.

## i18n

Idiomas:
- ES
- EN
- PT
- FR
- JA

Rutas: ES en `/`, EN en `/en/`, PT en `/pt/`, FR en `/fr/` y JA en `/ja/`. El código de idioma japonés, la ruta y `lang`/`hreflang` son `ja`; no usar `jp`. Cada ruta publicada sirve contenido completo,
localizable e indexable en su idioma; no se depende de un intercambio de copy
exclusivamente por JavaScript. La URL tiene prioridad: `/` siempre muestra ES,
sin redirección por idioma del navegador ni por preferencia guardada.

El selector de idioma enlaza a la ruta equivalente y conserva el fragmento de
sección cuando exista. La identidad y los enlaces internos mantienen el idioma
de la ruta activa. La elección persiste mediante URL, historial y marcadores;
no hace falta `localStorage` de idioma. Metadata localizada, canonical propio y
`hreflang` enlazan las cinco versiones. El copy de las cinco lenguas está aprobado en H4; la integración y QA de rutas son posteriores. La nota de comunicación aparece únicamente en EN/PT/FR/JA, localizada y discreta en About; no se renderiza en ES. Los cinco idiomas mantienen la misma oferta, límites, caso, contacto, metadata y estados.

La fuente local Instrument Sans carece de glifos japoneses según su `cmap` (muestras 日、本、語、あ、ポ). La solución tipográfica H4 fija Noto Sans JP como fallback sólo para caracteres japoneses, con Instrument Sans primero para latín. H6.C sustituye los TTF públicos por WOFF2 autoalojados: Instrument Sans variable 400–700, precargada según la evidencia de CLS H5; Noto Sans JP variable 400–600, sin preload y con subset del corpus JA público actual. Ambas usan `font-display: swap`; Noto sólo se descarga en JA. La fuente Noto oficial, versión 2.004 y licencia OFL, quedó fijada por hash en `qa/h6-build-fonts.py`; el subset se regeneró al aprobar el contenido japonés de LingoHive en H6.E. La verificación local inicial de H6.C está en `qa/h6-font-results.json` y no sustituye las mediciones del deployment real.

## Accesibilidad

Objetivo mínimo:
- WCAG 2.2 AA en decisiones relevantes;
- navegación por teclado;
- focus visible;
- contraste suficiente;
- landmarks semánticos;
- labels accesibles;
- `aria-expanded`/`aria-controls` cuando corresponda;
- reduced motion;
- targets táctiles adecuados.

Mantener skip link a `main`, landmarks, jerarquía de títulos coherente y semántica acorde al contenido aprobado, sin fijar cuatro secciones ni el nombre como H1.
Los controles deben comunicar su estado; el idioma activo debe identificarse en los enlaces.
El email visible debe seguir utilizable. V2-H4 sitúa un control de icono con nombre «Copiar email» junto al email y otro «Copiar teléfono» junto al número enlazado a WhatsApp. H5 resolverá la copia y su feedback accesible sin mover foco; si falla, quedan disponibles selección manual y enlaces.
Ninguna información crítica depende de hover. La gestión UX de foco y paneles aprobada en V2-H3 está en DESIGN.md; la propuesta V1 queda archivada al final.

## Contratos UX aprobados en V2-H3

Actualización H5 posterior: un solo menú fullscreen para desktop/mobile sustituye el menú compacto no modal, con navegación editorial 01–05, contacto y utilidades separados, foco contenido, fondo inerte y scroll bloqueado cuando JS lo mejora. Sin JS debe quedar navegación HTML utilizable. Servicios admite tres paneles sticky reversibles con degradación a flujo normal. El destino `#caso` pasa a `#proyectos` en las cinco rutas. El refinamiento posterior de H5 sustituye el subpanel Aspecto por controles visibles, añade cierre inverso, revela el Hero por caracteres y calcula una línea ortogonal de grosor perceptible desde anclas reales del layout: progreso reversible asociado a la posición vertical, mismo accent con separación neutra contextual sobre Ramiro y nodos extremos sólidos. Los párrafos siguientes conservan evidencia histórica H3 donde contradigan estas actualizaciones puntuales.

Segunda pasada H5: el tramo sobre Ramiro **no cambia de accent**; una traza neutra recortada a esa escena puede separarlo del fondo sin sustituir el color principal. Los pulsos de nodo son círculos rellenos animados sólo con transform/opacity en CSS, ausentes con reduced motion. La escena About ocupa el ancho real de su contenedor, sin `100vw` que desborde en navegadores con scrollbar clásico. Un fragmento enfoca la sección para preservar la secuencia de teclado, pero el indicador visual se limita al índice y no rodea el viewport. «Ir arriba» es un enlace nativo a `#inicio`, disponible también sin JS; no se agrega smooth scroll ni dependencia. Geometría y contraste se validan en varios tamaños/themes; H5 no queda cerrado por estas correcciones.

Tercera pasada H5, prevalente sobre las frases incompatibles anteriores: el SVG sólo pinta un path con el accent activo, sin segunda traza; GitHub usa ese mismo accent en la escena Ramiro. `stroke-dashoffset` interpola la longitud acumulada del path entre hitos derivados de las posiciones reales del nodo inicial/final y el rango desplazable del documento. La tasa de longitud por píxel de scroll permanece constante en vertical, horizontal y curvas; no se fija la punta a una altura del viewport. Los nodos pulsan mediante transform/opacity CSS cada 3,5 s y cesan en reduced motion. SCROLL conserva `href="#servicios"` como fallback sin JS; con JS evita mutar la URL y hace scroll nativo suave al destino. IR ARRIBA es un botón disponible tras inicializar JS que llama `window.scrollTo({top:0})`, sin hash. Ambos usan movimiento inmediato en reduced motion y enfocan el destino al terminar, sin scroll personalizado. El resto de navegación por fragmentos permanece según el contrato previo.

Cuarta pasada H5: el intervalo global inicio→fin queda sustituido por milestones estructurales `(scrollY, longitud acumulada del SVG)`, interpolados por tramos y recalculados sólo cuando cambia la geometría. Las longitudes se miden con `getTotalLength()` sobre prefijos del path; scroll usa anclas reales del Hero, la introducción y el stack de Servicios, su texto posterior, Proyectos, Ramiro y Contacto. Builders separados desktop y compacto (mobile/tablet) reconstruyen path, longitud, nodos y milestones tras resize, fuentes e imágenes, y sincronizan el progreso en el mismo dibujo antes de volver a mostrar el SVG. Un único `requestAnimationFrame` de scroll lee la tabla ya calculada; no calcula geometría por frame ni modifica el scroll nativo. El texto de Servicios tiene prioridad: la ruta puede ocultarse detrás de las cards o quedar fuera de vista. En reduced motion el path completo queda estático. El cursor fine pointer pasa a 14/18/30 px. Contacto reduce espacio final sin perder safe area. Este párrafo sustituye el criterio de tasa global constante anterior; **H5 continúa IN PROGRESS**.

Quinta pasada H5: el último punto geométrico ya no depende de un porcentaje de altura de Contacto; se mide desde el botón `[data-back-to-top]` en cada recálculo y el milestone final usa la nueva longitud del path, acotada al scroll máximo real. Contacto vuelve a `min-height:100svh` en desktop con altura flexible y queda natural en mobile, manteniendo un padding inferior breve y safe area. Cursor fine pointer: 12/18/30 px pressed/normal/hover. La inicialización Git de la carpeta local y `origin` de código fuente no deciden proveedor de hosting ni autorizan deployment; H5 permanece abierto.

Sexta pasada H5: el builder desktop hace la última curva dentro del rail de Contacto y extiende un segmento horizontal hasta un nodo fuera del rail, medido desde la posición real de IR ARRIBA. La tabla de milestones y longitud SVG se recalculan como antes; el builder compacto permanece intacto para QA posterior en dispositivo real. La scrollbar sigue siendo nativa: pseudo-elementos WebKit en Chromium/Safari y scrollbar-color/scrollbar-width en Firefox, con degradación limpia si un navegador limita el control de flechas. Los títulos de pestaña se leen de la tabla central de cinco idiomas; no cambia otra metadata, no se agrega formulario y no se decide proveedor de hosting. H5 sigue abierto.

Séptima pasada H5 (2026-09-24), prevalente para el path desde Proyectos: desktop desciende por el lado derecho fuera del contenido de Ramiro, entra a Contacto con una curva breve a la izquierda y termina centrado sobre [data-back-to-top]; compact (<1024 px) conserva el inicio/nodo aprobados y alterna gutters reales en los cuatro espacios intro/cards/secciones. Las coordenadas verticales de anclas dentro de [data-reveal] cancelan la traslación visual transitoria: getBoundingClientRect incluye ese transform, que no cambia el tamaño observado por ResizeObserver, y podía dejar el path varios píxeles fuera del gap una vez asentado el reveal. El SVG, longitud y milestones continúan reconstruyéndose tras cambios de layout, resize, fuentes e imágenes; el ciclo nativo de scroll sólo interpola la tabla calculada. Accent único, sin halo/under-stroke. H5 permanece IN PROGRESS.

Octava pasada H5 (2026-09-24): compact deriva los dos corredores laterales del gutter CSS efectivo y del ancho del stroke, reservando aire mínimo a viewport y copy; el extremo sigue en la coordenada relativa previamente aprobada. Para compact, los milestones mantienen nombres y distancias estructurales medidas sobre prefijos del path, pero su coordenada de scroll se obtiene con 85% de proporción por distancia física SVG y 15% de anclaje estructural normalizado. Así los horizontales largos no quedan comprimidos entre referencias casi coincidentes; una única rutina de progreso sigue interpolando la tabla en requestAnimationFrame, y el scroll inverso es exacto. En desktop, sólo el tramo Servicios desde services-entry hasta Proyectos combina 85% de progresión por longitud SVG y 15% de anclaje estructural; la ruta posterior a Proyectos conserva el ritmo previo. Servicios usa los headings de la segunda card, última card/stack, capabilities y heading de Proyectos como anclas; la nueva curva atraviesa el stack detrás de sus superficies, baja por su gutter izquierdo, bordea capabilities desde un corredor DOM-derived y vuelve a la aproximación aprobada antes de Proyectos. El trigger mantiene su glifo en posición, con hit target de 48 px de alto y padding efectivo a la derecha. La escena Ramiro usa un token de fondo semántico distinto también en Dark. El cierre medido no tiene latencia JS/CSS inicial: el animation-delay es cero y animationstart ocurre ~21 ms después de Escape; los 430 ms corresponden al retiro de inert/scroll lock/focus trap al finalizar la animación. Por ello no se modifica esa secuencia. H5 permanece abierto.

- Single-page por idioma con Hero, Servicios, Caso real, Ramiro y forma de trabajo, Contacto. Sin nuevas páginas secundarias ni rutas de caso; las rutas i18n anteriores permanecen intactas.
- Header persistente como único sticky. Identidad al inicio del idioma activo, cuatro destinos internos y CTA del Hero hacia Contacto. Los saltos dejan título/foco visibles bajo el header y el recorrido de teclado continúa desde el destino.
- Menú compacto no modal según DESIGN: foco en trigger al abrir, Escape cierra y devuelve foco, elección de sección cierra y enfoca destino, cambio de idioma cierra al navegar; click/tap fuera cierra sin robar foco. Tab o salida de foco no cierran por sí solos. Selección de theme/accent mantiene abierto el panel según el contrato H4. Panel cerrado sin elementos enfocables; altura insuficiente permite scroll vertical sin bloquear el de la página.
- Idiomas mediante enlaces equivalentes, activo identificado y conservación del fragmento cuando exista, sin redefinir rutas o persistencia.
- Contacto con email visible, mailto sin cuerpo obligatorio, WhatsApp secundario incorporado por H4 según CONTENT.md, selección manual y controles de icono adyacentes para copiar ambos datos, con feedback accesible a definir en H5. GitHub sólo en Ramiro.
- Mejora progresiva: sin JavaScript siguen disponibles contenido, email, navegación e idiomas; el menú no debe ocultar sus únicos accesos.
- Hero: sin JavaScript o con `prefers-reduced-motion: reduce`, mostrar la frase completa estable con «proyecto». Para lectores de pantalla, anunciar la frase completa estable y no cada cambio visual de palabra. La secuencia visual determinista y sus tiempos/transiciones se especifican en H5.
- Sin carrusel/lightbox, scroll hijacking, snap obligatorio ni interacción esencial sobre screenshots. Zoom nativo disponible; contenido no espera eventos de scroll.

Estos son contratos de experiencia; H5 implementa los mecanismos indicados en su actualización puntual. Theme/accent, paleta y tratamiento visual están aprobados en H4. Browser support, rangos responsive, SEO y performance conservan sus requisitos.

## Responsive

Diseñar y validar al menos en rangos representativos:

- 320–359
- 360–479
- 480–767
- 768–1023
- 1024–1279
- 1280–1535
- 1536+

No convertir estos rangos automáticamente en breakpoints de Tailwind. Son targets de QA.

## Browser support

Desktop:

- Chrome: versión estable actual y anterior.
- Microsoft Edge: versión estable actual y anterior.
- Firefox: versión estable actual y anterior.
- Safari: versión mayor actual y anterior.

Mobile/tablet:

- Safari en iOS/iPadOS: versión mayor actual y anterior.
- Chrome Android: versión estable actual y anterior.

Fuera de alcance:

- Internet Explorer.
- navegadores legacy.
- webviews antiguos sin soporte moderno razonable.

Las mejoras no esenciales basadas en APIs modernas deben usar progressive enhancement o feature detection cuando sea necesario.

La falta de soporte para una mejora visual no esencial no debe romper el contenido, la navegación ni la interacción básica.

## Performance

Principios:
- evitar JS innecesario;
- optimizar imágenes;
- fuentes con estrategia explícita;
- evitar layout shifts;
- animar preferentemente `transform`/`opacity`;
- no usar canvas/WebGL si un recurso más simple logra el mismo resultado.

## SEO

Requerido:
- metadata por idioma;
- canonical correcto;
- hreflang;
- Open Graph;
- sitemap;
- robots;
- favicon/app icons;
- JSON-LD `Person` con nombre, URL y GitHub confirmados, preparado en H5 sin inventar estructura empresarial.

No inventar perfiles sociales.

Integración H6.F completa: `favicon.svg` autónomo con contornos de Instrument Sans; `favicon.ico` raster 16/32/64; `apple-touch-icon.png` 180; cinco PNG Open Graph localizados de 1200 × 630. Ramiro aprobó visualmente los iconos e imágenes sociales el 2026-09-25. No se introduce manifest ni instalación PWA. El head conserva las cinco metadata textuales y canonical/hreflang actuales, añade las URLs absolutas de imagen y sus propiedades Open Graph/Twitter. `src/pages/sitemap.xml.ts` genera en build estática las cinco rutas canónicas desde el mapa de locales y `Astro.site`; `public/robots.txt` permite rastreo y señala ese sitemap. Header/Footer colorean únicamente el punto de `ramita.dev` con `var(--accent)`; CSS resuelve el cambio inmediatamente al elegir otro accent en Light o Dark, sin JS nuevo. Hosting, DNS, HTTPS y comprobación pública permanecen en H8.

## Analytics

Fuera de alcance hasta decisión explícita.

No agregar trackers por defecto.

## Deployment

Hosting definitivo: **Hostinger**, confirmado por Ramiro para V2-H8 el 2026-09-25. La publicación es manual: compilar localmente y subir el contenido de `dist/` a la raíz pública del sitio en hPanel. No se añade adapter, backend ni integración de build con Hostinger. El alias de Vercel conserva sólo su función de QA.

Dominio confirmado:
`ramita.dev`

Canonical: `https://ramita.dev`. Hostinger ya fuerza HTTP → HTTPS. H8 prepara una redirección permanente de `www.ramita.dev` al dominio raíz que conserve ruta y query, y un documento 404 estático con respuesta HTTP 404. Las reglas propuestas están en `hosting/hostinger.htaccess` fuera de `dist/`: antes de aplicarlas se deben fusionar con el `.htaccess` real del servidor, sin reemplazar sus reglas existentes. Los registros DNS de correo se preservan.

# Archivo técnico V1 — sin autoridad sobre V2

## REVISIT — tokens y preferencias históricos

El siguiente comportamiento se conserva como referencia, no como requisito activo. “H3” se refiere exclusivamente al hito histórico.

## V1 histórico — Design tokens

Theme y accent deben modelarse con CSS custom properties.

Ejemplo conceptual:

- `--color-bg`
- `--color-surface`
- `--color-text`
- `--color-muted`
- `--color-border`
- `--color-accent`
- `--color-accent-contrast`

No duplicar clases Tailwind para cada combinación theme/accent si puede resolverse mediante tokens.

## V1 histórico — Theme

Default inicial: dark.

En ausencia de preferencia guardada se usa dark, sin sustituirlo por
`prefers-color-scheme`. Una elección manual de dark/light se guarda localmente.

Persistencia:
- `localStorage`

## V1 histórico — Accent

Persistencia:
- `localStorage`

La preferencia se guarda por separado para dark y light. Cada theme recupera su
último accent elegido; si aún no existe, usa el default de ese theme, que se
definirá en H3. No se requiere un mapeo entre paletas.

Los accent disponibles dependen del theme actual.

Al cambiar theme con el selector abierto, éste permanece abierto, actualiza sus
opciones y marca el accent recordado o default del nuevo theme. El foco sigue
en el control de theme.


## INVALIDATE — esqueleto H2; REVISIT — paneles dependientes de UI

La cantidad de secciones y jerarquía del Hero siguientes están invalidadas. Los comportamientos de paneles son antecedentes a revalidar, no controles obligatorios.
Los principios de accesibilidad vigentes figuran arriba.

Esqueleto H2: skip link a `main`; `header`/`nav`, `main`, cuatro `section` y
`footer`; un H1 en Hero, H2 por sección restante y H3 por proyecto. Los paneles
Preferencias/Menú son no modales, no atrapan el foco y cierran al salir, al
pulsar fuera o con Escape. Escape cierra primero Accent y devuelve el foco a su
trigger; un segundo Escape cierra el panel padre y devuelve el foco a su
trigger. Al abrir Accent, el foco permanece en su trigger; Tab entra al grupo
de opciones etiquetadas y las flechas permiten elegirlas, aplicando el cambio
de inmediato sin cerrar el grupo. Los triggers comunican el estado expandido y
el idioma activo se identifica en los enlaces. Un click/tap fuera no roba el
foco de su destino. Copiar email comunica éxito o error mediante un estado
accesible, y el enlace `mailto:` sigue disponible si falla la copia. Ninguna
información crítica depende de hover.
