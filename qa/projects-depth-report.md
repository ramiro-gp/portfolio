# Proyectos — carrusel de profundidad, 2026-10-30

Tercera revisión autorizada por Ramiro después de observar la referencia pública Depth Carousel Pro. Confirmación explícita: tarjetas verticales con capturas mobile reales; texto a la izquierda sin captura duplicada en PC, carrusel arriba/texto debajo en móvil; flechas, swipe/arrastre y click, sin autoplay.

## Implementación

Cada selección mueve el proyecto a una posición frontal común y redistribuye los demás a su derecha y detrás, con distancia Z y perspectiva. Ya no se mantiene una pila fija ni se selecciona al pasar el pointer. Flechas, controles de posición, click y teclado (izquierda/derecha, Home/End) seleccionan. Pointer Events reconocen gestos horizontales mayores de 40 px; el scroll vertical y el zoom nativo se mantienen. El foco de pointer no selecciona una tarjeta distinta antes de determinar si el gesto era un arrastre. La acción externa sigue en el panel textual, con los estados y créditos previos.

Las cuatro tarjetas usan exclusivamente `*-mobile.webp`, con dimensiones explícitas y `object-fit:contain`. Las capturas nuevas de JL Aberturas y Vegan Records muestran sus layouts mobile reales; sólo se eliminó la franja de scrollbar del navegador al preparar los WebP (360 × 812; 20.142/23.526 B). Se conservan los assets mobile aprobados de Residencias y LingoHive. No hay imagen duplicada en el panel informativo. Implementación propia Astro/CSS/TS, sin dependencia, compra, código del componente Framer, autoplay o listener de rueda.

## Validación de esta pasada

- Build estático completo y Astro check sin errores, warnings o hints (57 archivos). `git diff --check` correcto.
- Revisión en navegador de ES a 320×740, 390×844, 768×1024, 1024×768 y 1440×900; EN/PT/FR/JA a 390×844 y 1440×900: 13 escenarios. Capturas mobile cargadas, panel activo único y sin desborde más allá del viewport. A 320 px se observó `scrollWidth=320` con scrollbar nativa ocupando 10 px; ningún elemento de Proyectos sale del viewport de 320 px. Se usa el ancho de viewport como criterio, igual que en el QA previo del sitio.
- La posición de la tarjeta frontal relativa al escenario se conserva al pasar de JL Aberturas a Vegan Records: diferencia horizontal 0 px y vertical <0,001 px en la medición estable. El contador y el texto cambian de forma coherente.
- Arrastre real con mouse en el navegador: Vegan Records → LingoHive. Click en flecha: Residencias → JL Aberturas. Teclado: derecha desde el último vuelve al primero, izquierda vuelve al último, Home/End seleccionan los extremos. Crédito de Juan Galache de Toro visible en el panel de LingoHive.
- Inspección visual desktop/mobile y de las capturas fuente; métricas y capturas finales en `qa/projects-depth/` y `qa/projects-depth-results.json`.
- Fuente JA regenerada desde la misma fuente oficial fijada por hash: 94.772 B, 406 codepoints de corpus, sin glifos japoneses faltantes. No se modificaron dependencias.

Límites: la emulación visual del viewport no equivale a un dispositivo táctil físico. El gesto táctil comparte Pointer Events con el arrastre comprobado, pero no se declara una prueba física de swipe. Reduced motion y fallback sin JS se revisaron en fuente/HTML/CSS; no se ejecutó una nueva emulación del ajuste del sistema, lector de pantalla, zoom de texto al 200 % ni matriz completa de browsers en esta pasada. Las suites anteriores son históricas y no certifican este carrusel. Las imágenes muestran evidencia de interfaz, no métricas comerciales.

La altura sigue siendo flexible: algunos tamaños, traducciones y el texto histórico/atribución de LingoHive requieren más de un viewport. No se comprimen textos ni créditos para imponer una altura fija. La línea se mide desde toda la escena. No hubo publicación, commit o creación de demo WooCommerce.

## Portfolio Design Guardian

Keep: evidencia real, datos de contacto, estados/créditos y servicio personal. Remove: capturas desktop dentro de marcos verticales, screenshot duplicado y selección por hover de una pila fija. Change: posición frontal común, cola de profundidad y presentación móvil específica. Risk: capturas reducidas requieren abrir el sitio para inspeccionar detalles; pantallas pequeñas y textos largos pueden crecer en altura; QA físico y aprobación visual final pendientes. Verdict: **APPROVE WITH CHANGES** para entregar a revisión del usuario; no equivale a aprobación humana del resultado ni cierre de H8.
