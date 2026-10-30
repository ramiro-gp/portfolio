# Proyectos — corrección 3D, 2026-10-30

**Segunda pasada histórica, sustituida por el carrusel de profundidad confirmado después.** Sus pruebas no certifican la tercera revisión; no se presenta la pila fija ni el uso de capturas desktop en tarjetas verticales como resultado aprobado.

Esta pasada responde a la corrección explícita de Ramiro después de rechazar la interpretación 2D. No modifica el Hero ni crea la posible demo WooCommerce.

## Resultado implementado

Desktop: panel izquierdo con captura completa, estado, título, contexto, atribución y botón externo. Pila derecha de cuatro tarjetas con screenshot y nombre, perspectiva CSS y `rotateY(-42deg)`, centros verticales coincidentes y superposición de izquierda a derecha. La selección aumenta opacidad/profundidad conservando la inclinación. Hover, foco o click seleccionan y actualizan el panel; sólo el botón del panel abre el sitio/demo. Controles con nombres completos al pie facilitan seleccionar las tarjetas parcialmente cubiertas.

Orden: Residencias Grupo Casa → JL Aberturas → Vegan Records → LingoHive. Se conservan estado de Residencias, naturaleza histórica y crédito externo de LingoHive, hechos y capturas reales de los proyectos nuevos. Los paneles inactivos reservan altura pero permanecen invisibles y fuera de la navegación accesible, evitando saltos al seleccionar.

Móvil, tablet compacta y viewport bajo conservan tarjetas completas horizontales con swipe/enlace y selectores. Sin JS se usa esa lista también en desktop. Reduced motion conserva el 3D estático sin transiciones. La salida de la línea se mide desde toda la composición, cubriendo ambas columnas.

## Evidencia y límites

- Build estático correcto: cinco páginas comerciales, 404 y sitemap.
- Astro check: 57 archivos; 0 errores, warnings o hints.
- `git diff --check`: PASS.
- `node qa/projects-3d-checks.cjs`: matriz de cinco idiomas × 320/390/768/1024/1440/1920 px; 30 casos. Comprobaciones de texto al 200 % en cinco idiomas × 320/390/1440 px (15 casos).
- En desktop, se comprueban matriz CSS 3D real, panel a la izquierda de la pila, centros verticales de tarjetas con diferencia menor a 2 px, selección coherente y altura estable al seleccionar. Sin overflow de página, imágenes rotas ni errores de página; línea SVG con geometría finita.
- Hover, foco/Enter y click de tarjeta; sincronización de panel y `aria-pressed`; crédito de Juan Galache de Toro visible. Click real sobre el botón del panel abre la URL prevista, interceptada sólo durante el test para no depender de la red externa.
- Dark/naranja, resize desktop→móvil, selección táctil emulada con reduced motion, fallback sin JS y foco en enlaces a 390/1440 px.
- ES: altura de sección 784 px a 390×844, 696 px a 1024×768, 828 px a 1440×900 y 1008 px a 1920×1080. A 320×740 crece a 756 px para conservar el contenido. Texto ampliado y traducciones pueden necesitar altura adicional.
- Revisión visual de ES desktop/mobile, JA desktop/mobile, estado LingoHive con créditos y dark. Capturas finales en `qa/projects-3d/`; resultados en `qa/projects-3d-results.json`. Chromium headless 151.0.7922.34.

El swipe nativo ya probado en la primera pasada no se cambió; esta pasada comprueba el control táctil y el fallback móvil con el nuevo orden. No se atribuye prueba nueva en dispositivo físico, NVDA, Safari o matriz completa de browsers. Tampoco hay publicación ni medición pública de performance. La evidencia de primera pasada se conserva identificada como histórica; no valida el diseño nuevo.

## Portfolio Design Guardian

### Keep

Hero aprobado por instrucción, evidencia real y estados/créditos. Alternativa móvil nativa y enlaces sin JS. Foco de lectura en el panel seleccionado.

### Remove

Abanico 2D y distintas alturas; texto largo dentro de tarjetas desktop; navegación externa al seleccionar una tarjeta desktop.

### Change

Composición de dos columnas, giro Y real, screenshot/nombre en pila y detalle en panel izquierdo. Interacción de selección por hover/foco/click y salida externa separada en el panel. Altura estable y línea calculada desde toda la escena.

### Risk

La superposición cubre parcialmente tarjetas no seleccionadas; los selectores inferiores muestran todos los nombres. La altura puede crecer en pantallas bajas o con texto ampliado. La aprobación visual final corresponde a Ramiro, no al agente.

### Verdict

APPROVE WITH CHANGES para entregar a revisión del usuario: implementación y QA técnico completos; revisión visual final/publicación pendientes. H8 continúa IN PROGRESS; no se declara sitio terminado.
