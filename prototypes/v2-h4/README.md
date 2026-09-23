# V2-H4 — Home estática · IN PROGRESS

Prototipo aislado autorizado por `respuesta.md`, 2026-09-21. No es producción ni aprobación final de H4. Todo el copy, incluidos captions y estados, es DRAFT; Hero A sólo está aprobado para el prototipo.

## Abrir

Abrir `index.html` en un navegador; `states.html` contiene el espécimen auxiliar. No requiere build, instalación, red ni JavaScript. Instrument Sans está incluida localmente junto con su licencia OFL, descargada del repositorio oficial google/fonts, carpeta ofl/instrumentsans. El TTF variable es material de revisión; no es una decisión sobre formato/peso de entrega en producción.

## Alcance representado

Claridad editorial, Instrument Sans única, light only, verde fijo y paleta aprobada para la prueba. Header persistente opaco de borde a borde; Hero A; tres servicios abiertos; capacidades integradas; caso; perfil/proceso; contacto y footer. Ancho máximo 1248 px. Sin motion, frameworks, dependencias de aplicación ni configurador.

La nota de revisión posterior al footer es chrome del prototipo, no una nueva sección pública. No se modificaron docs ni los prototipos V1.

## Imágenes

- Desktop: PLACEHOLDER, proporción 16:10.
- Mobile: PLACEHOLDER, proporción 390:760.

No se encontraron capturas en el repositorio de portfolio. No se fabricó ninguna interfaz. La composición final del caso y los captions requieren capturas reales seleccionadas; estos placeholders sólo prueban superficie y orden. Mobile se presenta primero en el DOM y en pantallas estrechas; desktop ocupa la mayor superficie a la izquierda en pantallas amplias.

## Controles y límites deliberados

- Anclas, mailto y GitHub son enlaces reales. No hay enlace de Residencias.
- Menú nativo `details/summary`, operable con teclado/touch y sin JS. Representa abierto/cerrado; no implementa cierre con Escape, click exterior, selección de enlace ni gestión final de foco de H3. Cerrarlo con Menú tras navegar. La altura es desplazable.
- ES activo; EN/PT son muestras no accionables, no rutas ni traducciones completas. Hay muestras de longitud en states.html.
- Copiar email deshabilitado y señalado como muestra estática. El email puede seleccionarse manualmente. Los mensajes de éxito/error del espécimen no son anuncios vivos ni resultados de una acción.
- Focus, idioma activo, límites de controles y feedback están representados. El objetivo no es completar accesibilidad funcional de producción en H4.

## QA — 2026-09-21

Chromium headless disponible en el entorno, sin instalar navegadores. `qa.cjs` usa Playwright ya incluido en el runtime; las rutas de esa utilidad son específicas de esta máquina y no pertenecen a la app. Evidencia en `qa/`.

- 1440×900, 1280×800, 1024×768, 768×1024, 390×844, 320×740 y 1536×960: sin overflow horizontal; fuente local cargada; cero animaciones.
- Texto expandido en títulos/CTA/navegación y tamaño raíz al 200%: sin overflow en los siete tamaños.
- CTA a Contacto: destino visible debajo del header con menú cerrado en los siete tamaños.
- Revisión visual de Home completa desktop/mobile y primeras vistas desktop, notebook, tablet, mobile; revisión de menú y Contacto mobile.
- Captura del menú y espécimen con JavaScript deshabilitado. Reduced motion no cambia contenido: no hay motion.
- Contrastes de la paleta: texto/fondo 14,29:1; secundario/fondo 6,33:1; acento/fondo 6,16:1; borde funcional/superficie 3,07:1. El divisor tenue no identifica controles por sí solo.
- No constituye QA de todos los browsers, lector de pantalla o traducciones finales. Expansión de texto es una prueba de resistencia, no aprobación EN/PT.

## Guardian

Keep: oferta protagonista, evidencia contextualizada, alineaciones, contacto directo.
Remove: no se incorporaron cards, badges, gradients, sombras decorativas, stock ni chrome falso.
Change: balance del Hero y tamaños relativos para soportar texto ampliado.
Risk: el principal momento visual permanece pendiente de screenshots reales; menú y copia son representaciones parciales.
Verdict: APPROVE WITH CHANGES para evaluación del prototipo; reporte global NEEDS REVIEW por imágenes y aprobación visual pendiente de Ramiro.

H4 sigue IN PROGRESS. No se inicia H5 ni se declara aprobado el copy o tratamiento final de imágenes.
