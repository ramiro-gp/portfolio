# V2-H4 — Iteración de alcance y contenido 3

Estado: V2-H4 CLOSED — 2026-09-21. Prototipo aislado, sin JavaScript cliente, motion, framework, instalación de dependencias ni producción. V2-H5 permanece NOT STARTED.

## Comparar

- `index.html` y `light.html`: Home actual de revisión, **light predeterminado** / verde profundo `#176844`.
- `dark.html`: misma iteración actual en dark / naranja.
- `language-review/en.html`, `pt.html`, `fr.html`, `ja.html`: pruebas estáticas de los puntos sensibles del layout, sin construir cuatro Homes completas. `ja-specimen.html` se conserva como exploración previa.
- `iteration2-dark.html` y `iteration2-light.html`: iteración 2 preservada con placeholders.
- `evidence-dark.html` y `evidence-light.html`: revisión anterior aislada con el par de capturas reales recomendado.
- `ES-COPY-APPROVED.md`: copy fuente español aprobado, sin cambios de redacción en este cierre. Versiones EN/PT/FR/JA aprobadas en `docs/locales/`.
- `accents.html`: espécimen estático de los diez accents aprobados, sin interacción.
- `../index.html`: primera iteración conservada sin cambios.

Abrir localmente o mediante el servidor local: `/v2/` (light), `/v2/dark.html` y `/v2/language-review/ja.html` (análogas EN/PT/FR). `build-iteration3.cjs` genera la iteración actual desde las variantes con capturas reales; `build-language-review.cjs` genera las pruebas localizadas; `build-prototype.cjs` sólo regenera la iteración 2 archivada y el espécimen histórico. Ningún script se envía al navegador. Se reutiliza la fuente local y el CSS previo; `iteration3.css` limita los cambios de esta revisión.

## Iteración 3 — decisiones representadas

- Hero estático «presentar tu proyecto» sin punto final: «proyecto» es fallback completo para sin JS, movimiento reducido y lectores de pantalla. La secuencia aprobada empieza por «servicio», pero no hay rotación H4.
- Clarifier ES aprobado: «Soy Ramiro Garcia. Trabajo con vos desde la definición hasta la publicación de tu web.» Servicios mantiene tres ofertas y agrega un único pasaje condicionado de Perfil de Empresa de Google y preparación para buscadores/asistentes de IA, sin promesas de visibilidad.
- Email principal y teléfono WhatsApp secundario tienen iconos de copia adyacentes con nombres accesibles, cursor pointer y target de 44×44 px. No implementan feedback ni microinteracción: eso sigue en H5.
- Cinco idiomas visibles en navegación. Instrument Sans no cubre japonés; las pruebas de idiomas usan Noto Sans JP local para glifos JA y conservan Instrument Sans para latín. Las traducciones completas aprobadas se registran en `docs/locales/`; las rutas productivas aún no están implementadas.
- El tratamiento desktop + mobile real de Residencias está aprobado. `SCREENSHOT_SELECTION = DEFERRED_TO_IMPLEMENTATION`: el par actual sigue siendo provisional y probablemente se reemplace en H6. El caso conserva «En desarrollo» y «Ver sitio» hacia el deployment público confirmado. No se alteró producción ni se avanzó a H5.

QA de iteración 3: light y dark revisados sin JavaScript ni motion a 1440×900, 1280×800, 1024×768, 390×844 y 320×740; imágenes cargadas, sin overflow horizontal y sin animaciones. Menú con cinco idiomas y nombres accesibles de ambos iconos comprobados a 320/390 px; reflow al 200% sin overflow a 320/390/1280 px. La muestra JA se inspeccionó visualmente en desktop y mobile. Capturas de revisión en `qa/iteration3-*.png`.

QA de idiomas H4: `qa-languages.cjs` comprueba EN/PT/FR/JA a 1440, 390 y 320 px, también con texto al 200%, menú mobile abierto, JavaScript deshabilitado y reduced motion. Sin overflow horizontal, recortes ni animaciones; captions, controles de 44 px, cursor pointer y disclosure no-ES presentes. Capturas en `qa/locale-*.png` y resultados en `qa/language-results.json`. La fuente JA de revisión carga localmente sólo en JA; su TTF genérico de 5,3 MB no es el payload de producción. El WOFF2 autoalojado optimizado con pesos 400/600 se preparará en H6.

Guardian de cierre H4 — Keep: oferta legible, caso real, email dominante y composición sin motion. Remove: no se añadieron cajas, badges ni motivos japoneses decorativos. Change: patch lingüístico EN/PT/FR/JA y contrato documental de Aspecto. Risk: integración técnica/QA posterior y asset JA de producción por optimizar. Verdict: **APPROVE** para sistema visual estático y contenido H4 aprobados por Ramiro.

## Archivo de la iteración 2 — decisiones y exploración históricas

En esa iteración se probó dark como default con naranja y light con verde profundo (`#176844`) y azul alternativo. **La decisión posterior fija light como default y sustituye ese punto**. Valores históricos de accents usados como candidatos, no como paleta exacta final.

Servicios: tres filas editoriales abiertas, título y descripción con proporciones asimétricas; margen silencioso a la izquierda y reglas finas. En mobile, descripción con sangría moderada respecto del título. Capacidades siguen integradas, sin cuarta oferta.

Proceso: las seis etapas conservadas en tres párrafos breves, con verbos destacados, interlineado y separación. Sin tabla de seis filas, cajas, timeline o iconos. Perfil y GitHub mantienen su papel.

Contacto: email grande intacto, enlace WhatsApp visible debajo (+54 9 11 5135-4489 / https://wa.me/5491151354489), copiar como utilidad de menor peso. No se enviaron mensajes ni se abrió una conversación externa durante QA.

Aspecto: acceso textual pequeño separado de navegación/idiomas en desktop; dentro del menú en mobile. Panel nativo de revisión con enlaces a páginas dark/light y muestras de accents. No es un configurador; los colores no se seleccionan ni guardan. H5 resolverá teclado, gestión de foco/cierre y persistencia independiente por theme; se conserva conceptualmente no cerrar al elegir accent.

## Límites

- El copy ES/EN/PT/FR/JA está aprobado. Estas páginas localizadas son pruebas parciales de resistencia, no las rutas productivas.
- `iteration2-dark.html` y `iteration2-light.html` conservan PLACEHOLDER (16:10 y 390:760). Las variantes actuales y `evidence-*` muestran capturas reales del build local de Residencias. Su tratamiento está aprobado, pero el par exacto y sus captions/alt finales quedan para H6.
- Menú/Aspecto usan details; no implementan cierre con Escape, click fuera o al seguir ancla. Para evaluar el destino con panel cerrado, cerrarlo manualmente. No representan el comportamiento final de H3/H5.
- Copiar sigue deshabilitado y señalado como muestra. Email y WhatsApp son enlaces reales.
- Aspecto y el sistema visual estático están aprobados. Las preferencias funcionales se implementan en H5, sin cerrar al elegir theme/accent y con cierre por navegación, Escape, click/tap fuera o nuevo accionamiento del trigger.

## QA histórica de iteración 2

Evidencia en qa/results.json y capturas de qa/. Ambos themes revisados en 1440×900, 1280×800, 1024×768, 768×1024, 390×844, 320×740 y 1536×960. Sin overflow normal, con texto expandido y tamaño raíz al 200%; Instrument Sans local cargada; cero animaciones. CTA a Contacto visible bajo header con paneles cerrados. JavaScript deshabilitado en las pruebas, reduced motion activado.

Espécimen: diez filas, sin overflow a 1440, 390 y 320 px. Contraste mínimo accent/fondo: dark 7,97:1; light 5,34:1. Sobre superficies: dark 6,92:1; light 5,04:1. CTA usa texto oscuro en dark y claro en light. Foco y selección cuentan además con contorno, subrayado o marca.

La verificación por hashes correspondió a la iteración 2 antes de los cambios posteriores. Sin reabrir H1/H2/H3; H5 continúa NOT STARTED.

## Guardian histórico de iteración 2

Keep: oferta dominante, Hero sin decoración, evidencia contextualizada, email grande y WhatsApp secundario.
Remove: no se incorporaron cards, iconos, motivos culturales, gradients, sombras, fake browser o números decorativos.
Change: jerarquía y espacio de Servicios; proceso en prosa breve; utilidad Aspecto secundaria.
Risk: caso aún sin imágenes reales; revisar que las sangrías mobile aporten ritmo sin estrechar la lectura; preferencias finales pendientes.
Verdict: APPROVE WITH CHANGES para revisión comparativa, no aprobación final de Ramiro. H4 IN PROGRESS.

## Evidencia Residencias — revisión histórica del par propuesto

Fuente inspeccionada en modo lectura: `C:\Codigo\residencias-grupo-casa`. El build local `dist` es del 2026-09-17 20:15, posterior a los archivos fuente relevantes inspeccionados. Se sirvió como archivo estático; no se ejecutó build, instalación ni edición del proyecto fuente. Se revisaron visualmente las cuatro capturas y no aparecen residentes identificables ni interfaz inventada.

Par recomendado: Home `/`, sección “Nuestras residencias”, viewport 1440×900 y 390×844. En desktop reúne marca, Casa San Juan y Casa Boedo indicada como próxima apertura; en mobile muestra la adaptación de la misma sección y Casa San Juan. Archivos `assets/residencias/recommended-home-residences-*.png`.

Par alternativo: `/casa-san-juan/`, Hero, mismos viewports. Muestra identidad y composición responsive de la sede operativa, aunque no representa por sí solo la arquitectura Grupo Casa → ambas sedes y la imagen mobile queda parcialmente visible. Archivos `assets/residencias/alternative-san-juan-hero-*.png`.

La selección exacta de screenshots se difiere a H6; el tratamiento y el copy ES/EN/PT/FR/JA están aprobados. H4 CLOSED; H5 NOT STARTED.
