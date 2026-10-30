# Proyectos — cuarta revisión, 2026-10-30

Alcance solicitado: tarjetas desktop apaisadas en PC, más separación y márgenes simétricos en móvil, quitar títulos dentro de las tarjetas y líneas públicas de créditos, y hover 3D leve según posición del cursor.

## Resultado

Desde 1280 px de ancho útil, `picture` selecciona capturas desktop y CSS usa aspect ratio 1440:900 con tarjetas más anchas. Esto incluye monitores Full HD y superiores y permite ventanas/escalado de escritorio. Bajo ese ancho se conservan las capturas mobile completas en tarjetas verticales. Se retiró el span de título; el botón conserva su nombre accesible y el título del panel sigue visible. Se eliminaron las líneas de créditos del panel y fallback por instrucción explícita; los hechos de colaboración se preservan en PROJECTS.md.

En mobile se aumentó la separación de la cola y se centra el conjunto de bordes proyectados dentro del escenario. Un ResizeObserver y rAF actualizan ancho/corrección después de resize, fuentes y transiciones. No se modifica el scroll global ni la posición frontal común del carrusel.

El tilt se aplica al botón interior y conserva el transform de colocación del carrusel. Límites ±2° X / ±2,5° Y; rAF agrupa actualizaciones de pointermove. Se borra al salir, perder foco, seleccionar, arrastrar o cambiar las condiciones de entrada. Está condicionado a mouse, fine pointer, hover y ausencia de reduced motion tanto en JS como CSS; no hay información exclusiva de hover.

## Validación

- Build estático correcto y Astro check: 57 archivos, 0 errores/warnings/hints. `git diff --check` limpio.
- Ocho tamaños en navegador: 320×740, 390×844, 430×932, 768×1024, 1280×800, 1440×900, 1920×1080 y 2560×1440. Medición en reposo tras los 500 ms de transición; sin desborde más allá del viewport.
- Diferencia entre márgenes visuales izquierdos/derechos: 0,0153 px a 320; 0,0063 px a 390; 0,0001 px a 430; 0,0084 px a 768. A 390, los cuatro proyectos conservan márgenes de aproximadamente 11,25 px dentro del escenario, más el gutter exterior del rail. La separación es mayor que en la tercera pasada.
- Fuentes responsive comprobadas: assets desktop desde 1280 y mobile debajo; todas las tarjetas apaisadas usan proporción 1440:900. Las imágenes fuera del viewport pueden permanecer pendientes de lazy loading; una URL vacía en el snapshot de un caso no se presenta como imagen rota o ya cargada.
- Cero spans de título en botones y cero elementos `.project-card-credit` en todos los tamaños. El panel de LingoHive conserva su naturaleza histórica y no añade claims de diseño integral por Ramiro.
- Pointer real de mouse: al mover hacia el cuarto superior izquierdo, tilt X ≈ +0,995° / Y ≈ −1,251°; hacia el cuarto inferior derecho, X ≈ −0,987° / Y ≈ +1,229°. Se comprobó cambio de dirección y borrado de todas las variables al navegar con End hasta LingoHive. No se presenta el movimiento con mouse como prueba física de touch.
- Inspección visual Full HD y mobile. Capturas en `qa/projects-refinement/`; resultados en `qa/projects-refinement-results.json`.

Reduced motion y exclusión touch revisados en fuente/condiciones CSS; sin emulación nueva del ajuste del sistema, test físico ni lector de pantalla en esta pasada. No se repite la matriz de idiomas completa: el cambio de layout no añade copy, y los nombres accesibles existentes permanecen. La tipografía, dependencias, Hero y hosting no cambiaron. No hubo publicación, commit o demo nueva.

## Portfolio Design Guardian

Keep: evidencia real, estado histórico de LingoHive, contacto y acciones accesibles. Remove: captions y líneas redundantes solicitadas, sin inventar autoría alternativa. Change: tamaño/formato desktop, separación/centrado móvil, tilt leve con fallback estático. Risk: el tilt es opcional y desactivado con reduced motion/touch; la aceptación visual final sigue siendo de Ramiro. Verdict: **APPROVE WITH CHANGES** para entregar a revisión; H8 permanece IN PROGRESS y no se declara sitio terminado.
