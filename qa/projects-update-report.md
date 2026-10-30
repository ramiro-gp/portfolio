# Hero y Proyectos — 2026-10-30

**Evidencia histórica de primera pasada.** Ramiro rechazó posteriormente la interpretación visual 2D de Proyectos. El QA técnico de este documento sólo describe esa versión; la corrección 3D se valida por separado en `qa/projects-3d-checks.cjs` y `qa/projects-3d-results.json`. El Hero abreviado continúa vigente.

## Resultado

Implementación local completa del alcance autorizado; QA técnico PASS. Pendientes revisión visual final de Ramiro y publicación. V2-H8 continúa IN PROGRESS; no se declara release ni STATUS: DONE.

Hero ES: «Diseño y desarrollo de webs para tu [palabra]», con equivalencias EN/PT/FR/JA, las seis palabras previas y fallback accesible. Cuatro proyectos reales: Residencias, LingoHive, JL Aberturas y Vegan Records. La posible demo WooCommerce no se creó ni se muestra.

Proyectos: baraja desktop con inclinación leve, selección elevada/opaca por hover/foco y nombres en selectores visibles. En móvil, lista horizontal nativa con swipe y botones alternativos; tarjeta como enlace nativo al sitio/demo. Créditos de LingoHive y estados históricos conservados. Sin JS, enlaces y lista horizontal operables con teclado. Altura flexible, sin truncar textos ni créditos.

## Verificación

Historia comprobada: visitante lee oferta → encuentra evidencia compacta → selecciona un proyecto con mouse/teclado/touch → abre el enlace correcto al sitio/demo. Contenido servido como HTML estático por idioma; no hay API, base de datos, formulario o credenciales nuevos.

- `node node_modules/astro/bin/astro.mjs build`: PASS, cinco páginas comerciales localizadas, 404 y sitemap.
- `node node_modules/astro/bin/astro.mjs check`: 56 archivos, 0 errores, warnings o hints.
- `git diff --check`: PASS.
- `node qa/projects-update-checks.cjs`: PASS sobre el build, Chromium headless 151.0.7922.34. Servidor HTTP temporal del propio verificador, cerrado al finalizar.
- 30 escenarios: ES/EN/PT/FR/JA × 320×740, 390×844, 768×1024, 1024×768, 1440×900 y 1920×1080. Sin overflow de página, recorte interno, imágenes rotas o errores de página; cuatro enlaces y línea SVG con geometría finita/ancla final operativa.
- 15 escenarios de texto al 200 %: cinco idiomas × 320/390/1440 px. Sin overflow ni recorte interno.
- Hover selecciona y deja opacidad 1; foco en tarjetas y Enter en selectores actualizan la selección; crédito de Juan Galache de Toro visible en LingoHive; dark/naranja inspeccionado; resize conserva la selección; click real abre la URL esperada en otra pestaña (destino externo interceptado sólo durante este test).
- Touch emulado: swipe nativo mueve el contenedor y tap en selectores elige el proyecto. Se verifican en contextos separados: un swipe CDP puede mantener una inercia del compositor que consume el siguiente tap sin emitir click. Los intentos anteriores registraron ese comportamiento; no se presentan como un dispositivo físico probado.
- Reduced motion: Hero estable y selección sin transiciones; sin JS, fallback completo y enlaces alcanzables con foco tanto a 390 como a 1440 px.
- Capturas finales revisadas: Hero ES desktop/mobile; Proyectos ES y JA desktop/mobile; LingoHive con foco/crédito; dark/naranja. Archivos en `qa/projects-update/`.
- Ambos sitios nuevos respondieron HTTP 200 y se capturaron a 1440×900 desde sus URLs públicas. Los WebP nuevos pesan 36.920 B y 42.476 B.
- Subset japonés actualizado desde la misma fuente oficial fijada por hash en H6: 94.244 B, 404 codepoints de corpus y cero glifos japoneses faltantes. `qa/projects-update-font-results.json` y `qa/build-project-update-font.py`. No se modificaron dependencias de la web.

Altura medida en ES: 784 px a 390×844, 696 px a 1024×768, 828 px a 1440×900 y 1008 px a 1920×1080 (equivalentes al viewport menos header, con ~1 px de borde). A 320×740 crece a 756 px; algunas traducciones en 1024×768 también exceden levemente la altura disponible. Son fallbacks deliberados a favor del contenido, al igual que el crecimiento con texto ampliado.

Evidencia estructurada: `qa/projects-update-results.json`. No se repite Lighthouse público, QA físico, NVDA ni matriz completa de browsers para este cambio; no se atribuye aprobación humana del resultado o traducciones nuevas. No se publicó, no se creó ZIP de release y no hubo commits ni cambios de DNS/hosting. Los archivos previos no versionados `cambios.md` y `docs/prompts/` permanecieron intactos.

## Revisión Portfolio Design Guardian

### Keep

Oferta personal legible, cuatro trabajos verificables, contacto principal existente, estados y atribución de LingoHive. Una tarjeta seleccionada como foco; nombres de todos los proyectos accesibles.

### Remove

Casos largos repetidos y doble screenshot por proyecto en el recorrido principal. En desktop, descripción/crédito/enlace de tarjetas cubiertas se ocultan visualmente hasta su selección para reducir ruido; no se eliminan del HTML ni del fallback sin JS.

### Change

Hero abreviado, baraja con selección por hover/foco/controles, alternativa horizontal nativa y altura flexible. La línea reutiliza su builder midiendo el selector al final del nuevo layout.

### Risk

La lectura completa de una tarjeta superpuesta requiere seleccionarla; los nombres inferiores ofrecen acceso inequívoco. Pantallas pequeñas, bajas y texto ampliado pueden necesitar más de un viewport. Touch físico y lector de pantalla de esta actualización no ejecutados; emulación no los sustituye. La redacción compacta y traducciones nuevas quedan para revisión final de Ramiro.

### Verdict

APPROVE WITH CHANGES para entregar la implementación a revisión: QA técnico completo; aprobación visual final y publicación pendientes. No equivale a cierre de H8.
