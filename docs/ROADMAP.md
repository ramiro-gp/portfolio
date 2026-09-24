# ROADMAP.md — ramita.dev V2

## Reglas activas

Los hitos son secuenciales. No avanzar sin cerrar el anterior ni exceder el alcance autorizado.
V2-H0, V2-H1, V2-H2 y V2-H3 están cerrados. Ningún cierre histórico V1 cierra un hito V2.
V2-H1 consolida posicionamiento, oferta, proceso conceptual y límites comerciales sin aprobar copy final, arquitectura de contenido ni UX.
V2-H2 aprueba jerarquía conceptual, requisitos de contenido, selección y tratamiento de evidencia sin fijar layout, navegación, wireframes ni copy final.
V2-H3 aprueba single-page, cinco secciones, Hero comercial, navegación, contacto, wireframes y comportamiento responsive/keyboard/touch. Copy y sistema visual siguen pendientes; V2-H4 no se inicia con este cierre.
Los hitos documentales requieren auditoría de consistencia, no builds o QA visual.
Restaurar LingoHive requiere decisión de alcance independiente; no es parte de V2-H2 ni bloqueo automático de release.

## V2-H0 — Product reset

Objetivo y entregables: Reconciliar objetivo comercial, autoridad, decisiones confirmadas y antecedentes.

Cierre: Documentación activa coherente, evidencia preservada y auditoría completa de alcance y referencias.

Estado: CLOSED — 2026-09-20

## V2-H1 — Positioning & offer

Objetivo y entregables: Revisar la formulación conceptual y el proceso comercial a partir de las decisiones ya confirmadas; delimitar compromisos pendientes sin inventar precios ni plazos.

Cierre: Posicionamiento, oferta y límites aprobados. Registrar confirmaciones en V2-H0 no cierra este hito.

Estado: CLOSED — 2026-09-20

## V2-H2 — Content architecture & evidence

Objetivo y entregables: Definir recorrido, contenido necesario, selección y tratamiento de casos reutilizando auditorías; identificar assets y faltantes.

Cierre: Arquitectura de contenido y evidencia suficiente aprobadas, con permisos y pendientes explícitos.

Estado: CLOSED — 2026-09-20

## V2-H3 — Commercial UX

Objetivo y entregables: Definir wireframes desktop/mobile, Hero nuevo, navegación, acceso a contacto y estados keyboard/touch.

Cierre: Servicio, evidencia y contacto comprensibles sin depender de styling o motion; UX aprobado.

Estado: CLOSED — 2026-09-20

## V2-H4 — Content & visual system

Objetivo y entregables: Aprobar copy fuente, traducciones y composición estática; revalidar dirección, tipografía, paleta, dark/light, accents y personalización.

Cierre: Contenido y sistema visual aprobados con decisiones explícitas sobre cada elemento REVISIT.

Estado: CLOSED — 2026-09-21

Resultado H4: copy fuente ES y traducciones EN/PT/FR/JA aprobados; composición estática y sistema visual aprobados, incluidos Instrument Sans como base latina, Noto Sans JP para glifos JA, diez accents exactos, light/verde `#176844` default global, dark/naranja default del theme dark y Aspecto discreto. Hero de seis estados con fallback estable sin animación. Tratamiento real desktop + mobile de Residencias aprobado, `SCREENSHOT_SELECTION = DEFERRED_TO_IMPLEMENTATION` en H6. Contrato de apertura/cierre de Menú/Aspecto documentado para H5. No se implementó motion, interacción funcional ni producción. H1/H2/H3 permanecen cerrados; H5 NOT STARTED.

Auditoría de cierre H4 (2026-09-21): Ramiro resolvió explícitamente los dos bloqueos anteriores — traducciones y sistema visual. ES/EN/PT/FR/JA **APPROVED**; metadata textual prevista consistente; captions/alt dependientes del par definitivo diferidos a H6. Pruebas estáticas localizadas de Hero, header, títulos, CTA, Contacto, captions y disclosure a 1440/390/320 px y texto 200%; sin overflow ni recorte. Noto Sans JP local carga sólo en JA; el asset optimizado final no se exige para H4. Guardian: Keep oferta legible y evidencia real; Remove ninguno; Change sólo patch lingüístico/documental; Risk integración técnica/QA posterior; Verdict **APPROVE** para H4. **Blockers H4: ninguno.** **H5:** rotación/motion, copia funcional y feedback, interacción/persistencia y ratificación técnica. **H6:** selección/captions/alt de screenshots finales, WOFF2 JA optimizado, rutas y metadata implementadas. H4 cerrado; H5 permanece NOT STARTED.

## V2-H5 — Interaction & technical readiness

Objetivo y entregables (alcance aprobado posteriormente por Ramiro): ratificar stack y arquitectura, construir la base estática y las interacciones H5.A–G, y verificar H5.H. Incluye menú fullscreen accesible, Hero rotativo, tres paneles sticky, microinteracciones, cursor apropiado y línea continua sólo tras estabilizar el layout. El hosting concreto no se presume: se ratifica salida estática portable y queda su elección para implementación/publicación posterior.

Cierre: especificación e interacciones aprobadas, con evidencia de build/typecheck, QA responsive, browsers, touch, teclado, sin JS y reduced motion. El cierre H5 no satisface por sí solo DONE.md ni equivale a release.

Estado: IN PROGRESS — alcance H5 ampliado por pedido explícito posterior al cierre H4; H0–H4 permanecen CLOSED.

Auditoría de implementación H5 (2026-09-22): H5.A–G implementados en Astro 7.3 estático con cinco rutas, menú fullscreen mejorado desde HTML utilizable sin JS, Hero accesible con rotación sólo visual, Servicios sticky condicionales, feedback de copia, preferencias por theme, reveals, cursor condicional y línea SVG calculada desde el layout. `pnpm build` genera cinco rutas; `pnpm check` no informa errores, warnings ni hints. QA automatizado: 17 escenarios de capturas (cinco idiomas a 1440/390/320 px, más sin JS y reduced motion) sin overflow, overflow a 200 % ni errores de página; 43 checks de interacción y siete anchos responsive, con smoke en Chrome 153.0.8010.53 y Edge 153.0.4234.48. Una medición local de carga/CLS en ES y JA a 390/1440 px (`qa/h5-performance-results.json`) detectó desplazamiento evitable por fuente en ES desktop; el preload de Instrument Sans lo llevó a CLS 0 en esa medición. JA desktop quedó en 0,0146, con WOFF2 optimizado pendiente de H6. Estas cifras localhost sin throttling no sustituyen Lighthouse ni mediciones públicas. Evidencia local: `qa/h5-results.json`, `qa/h5-interactions-results.json`, `qa/h5-performance-results.json` y `qa/screenshots/`. Guardian: Keep oferta legible, evidencia real y email dominante; Remove smooth scroll no aprobado; Change foco/trap del menú y tolerancia a texto ampliado; Risk matriz completa de browsers/dispositivos y aprobación visual humana; Verdict **APPROVE WITH CHANGES** para el estado técnico actual, no cierre de hito.

Pendiente antes de declarar H5 CLOSED: revisión manual con lector de pantalla, touch en dispositivos reales y versiones actuales/anteriores de Firefox, Safari desktop/iOS, Chrome Android, Chrome y Edge según ARCHITECTURE.md; revisión de carga/CLS en esos entornos y aprobación de las interacciones/composición implementadas. No se presume aprobación visual por capturas automáticas. H6 retiene capturas/alt/captions definitivos, WOFF2 JA optimizado y hosting/SEO final.

Refinamiento H5 posterior (2026-09-22): sobre la aplicación Astro, sin cambiar stack ni H6, se implementaron línea ortogonal de 10/5 px con nodos sólidos, contraste contextual y progreso por altura visible reversible; Hero por caracteres e indicador SCROLL; cierre circular reverso, controles MODO/COLOR PRINCIPAL visibles y underline por item; sección Ramiro oscura en Light, rótulo localizado «Ramiro Garcia», escenas desktop sin divisores globales y cursor con contraste actualizado incluso al scroll. QA posterior: build de cinco rutas, typecheck 0/0/0, 42 checks de interacción existentes adaptados al menú sin subpanel, 15 combinaciones idioma/ancho con 14 checks específicos de refinamiento, las seis palabras a 320 px y texto 100/200 % sin salto de H1/CTA, 17 escenarios visuales sin overflow/errores, cuatro estados de theme/accent, y CLS local 0 en ES 390/1440 y JA 390, 0,0145 en JA 1440. Evidencia en `qa/h5-*-results.json`, `qa/screenshots/` y `qa/refinement/`. Guardian: Keep oferta, caso real y email dominantes; Remove submenú Aspecto y bordes globales redundantes; Change línea, escena, Hero, cierre y cursor según aprobación explícita; Risk validación humana/cross-browser y peso de la fuente JA provisional; Verdict **APPROVE WITH CHANGES** para continuar QA, no cierre. **H5 sigue IN PROGRESS.**

Segunda pasada H5 (2026-09-22): línea ajustada a 13/6,5 px con nodos de 16/10 px y pulso radial relleno CSS; mismo accent en todo el recorrido y under-stroke neutro sólo sobre Ramiro en Light; geometría desplazada al margen real de Servicios; leve incremento tipográfico; «Ir arriba» localizado; correcciones de overflow y foco por fragmento/modalidad. Verificación sobre build fresco: cinco rutas estáticas, typecheck 0/0/0, 42 checks de interacción, 15 de refinamiento, 17 escenarios generales y un check específico nuevo con 25 combinaciones idioma/ancho en reposo/menú/texto 200 %, tres geometrías 1366/1920/2560 sin cruce de los textos de Servicios, diez transiciones de idioma mouse/teclado, cuatro estados de theme/accent y reduced motion. Evidencia: `qa/h5-second-pass-results.json`, `qa/second-pass/`, `qa/h5-interactions-results.json`, `qa/h5-refinement-checks-results.json`, `qa/h5-results.json`. Guardian: Keep oferta/email/escenas y menú; Remove cambio de accent por sección; Change grosor, separación contextual, foco y retorno al inicio; Risk continúa siendo QA humano/cross-browser/dispositivos reales y fuente JA provisional; Verdict **APPROVE WITH CHANGES** para el alcance técnico de esta pasada. **H5 sigue IN PROGRESS y no abre H6.**

Tercera pasada H5 (2026-09-22), prevalente sobre los valores y contratos sustituidos arriba: path de 17/8,5 px, nodos de radio 20/12,5 px, pulso relleno cada 3,5 s, eliminación del halo, GitHub con accent activo en Ramiro y cursor fine pointer de 16/36/50 px. La línea interpola longitud acumulada de SVG sobre el intervalo desplazable determinado por sus anclas: la cabeza puede salir del viewport y el scroll inverso retrae el mismo trayecto. SCROLL enlaza a Servicios y usa scroll nativo suave con JS; IR ARRIBA es botón sin hash que desplaza a 0; ambos saltan en reduced motion y enfocan el destino. Hero aumenta de escala, conserva el clarifier y revela caracteres desde abajo en ~400 ms por palabra; headings y copy suben moderadamente. El nodo mobile comienza debajo de SCROLL para no tapar el clarifier. Build: cinco rutas; `astro check`: 0 errores, 0 warnings, 0 hints. QA: 20 combinaciones idioma/ancho + 200 % para Hero, 3 geometrías 1366/1920/2560 con consumo proporcional de scroll horizontal y reversión, controles smooth/reduced/touch sin hash, 25 combinaciones anteriores de overflow, 10 transiciones de foco mouse/teclado, 4 states de color sin halo y GitHub correcto, 42 checks de interacción, 16 de refinamiento y 17 escenarios generales. CLS local sin throttling: 0 en ES/JA a 390/1440 px (`qa/h5-performance-results.json`); no sustituye mediciones públicas. Evidencia nueva: `qa/h5-third-pass-results.json`, `qa/third-pass/`, más archivos de QA H5 actualizados. Guardian: Keep oferta legible, evidencia y email protagonistas; Remove halo y accent alternativo; Change escala y recorrido según aprobación; Risk Light+accent negro tiene contraste bajo sobre Ramiro por preferencia explícita y persisten QA humano/cross-browser/dispositivos reales y fuente JA provisional; Verdict **APPROVE WITH CHANGES** para continuar evaluación, no para cierre. **H5 sigue IN PROGRESS; H6 no se inicia.**

Cuarta pasada H5 (2026-09-22), prevalente sobre el mapeo global y cursor anterior: builders desktop/compacto calculan rutas desde anclas DOM y milestones `(scroll, longitud SVG)`; el scroll nativo sólo interpola la tabla precalculada. Primera curva cerca de Servicios; giro interior a mitad del stack, recorrido detrás de las cards y salida a la izquierda del texto inferior, sin modificar la composición desde Proyectos. Mobile/tablet recorre el margen derecho, entra/sale detrás del stack y reserva ancho al copy. Cursor 14/18/30 px; Contacto pierde el `min-height:100svh` y deja sólo 36–56 px de respiro inferior con safe area. Build: cinco rutas; `astro check`: 29 archivos, 0/0/0. QA específico `qa/h5-fourth-pass-results.json`: 45 combinaciones idioma/ancho (360, 390, 430, 768, 900, 1024, 1366, 1920 y 2560), sin overflow ni cruce del copy de Servicios; milestones estrictamente crecientes; cabeza sin anticiparse debajo del viewport en Servicios en tres desktop; scroll down/up, curva y resize a mitad de stack; reduced motion con path estático y pulso ausente; capturas en `qa/fourth-pass/` revisadas desktop/mobile. Checks existentes actualizados/pasados: 42 de interacción, 17 escenarios generales, 19 de refinamiento, 25 casos de overflow y 20 combinaciones Hero de tercera pasada. Guardian: Keep oferta/evidencia/email y cards; Remove mapeo global y espacio final vacío; Change ruta/milestones/cursor según pedido; Risk aprobación humana, touch/lector de pantalla y matriz completa de browsers todavía pendientes; Verdict **APPROVE WITH CHANGES** para esta evaluación técnica/visual, no para cierre. **H5 sigue IN PROGRESS; H6 no se inicia.**

Quinta pasada H5 (2026-09-23), prevalente sólo para Contacto y pressed del cursor: desktop recupera `min-height:100svh` flexible y distribución vertical intencional, mobile queda natural; padding inferior permanece 36–56 px/safe area. El nodo final y último milestone se calculan desde la posición real de «IR ARRIBA» (56 px antes del botón en desktop, 36 px en compacto), con pulso separado. Cursor 12/18/30 px. QA focalizado en `qa/h5-fifth-pass-results.json` y `qa/fifth-pass/`: 20 combinaciones idioma/ancho, nodo/control sin solapamiento, back to top a `scrollY=0` sin hash, reduced motion, touch, texto JA al 200 % y ausencia de overflow; revisión visual desktop/mobile. Se inicia versionado Git del código en `main` con `origin` indicado por Ramiro, conservando prototipos y QA y excluyendo sólo salidas locales/recreables y secretos. El remoto estaba vacío al comprobar todos sus refs. Guardian: Keep email protagonista y recorrido previo; Remove pressed sobredimensionado y espacio final artificial; Change escena/contacto final y ancla de nodo; Risk revisión humana/cross-browser/dispositivos reales todavía pendiente; Verdict **APPROVE WITH CHANGES** para esta pasada, no cierre. **H5 sigue IN PROGRESS; H6 no se inicia.**

Sexta pasada H5 (2026-09-23), acotada a cierre de línea desktop, scrollbar, índice 05 y títulos de pestaña: la curva final ahora sale del rail de Contacto hacia el nodo calculado desde IR ARRIBA; mobile conserva la ruta anterior y espera QA en dispositivo real. Scrollbar nativa con thumb del accent, track del canvas del theme y flechas ocultas en Chromium; Firefox usa propiedades estándar, sin binario local para prueba real. El índice comparte baseline con 02–04 y los títulos localizados se centralizan; Contacto sigue sin formulario. Build de cinco rutas y typecheck 0/0/0; QA específico en qa/h5-sixth-pass-results.json y qa/sixth-pass/: 15 combinaciones idioma/desktop, cuatro estados de scrollbar, reversión en tres tamaños, Back to top, mobile sin overflow; también pasaron checks existentes de cuarta pasada (45), quinta (20) e interacciones (42). Revisión visual de Contacto a 1366, 1920 y 2560. Guardian: Keep email protagonista y relación con IR ARRIBA; Remove cierre vertical sin giro; Change sólo curva, índice y browser chrome pedidos; Risk QA Firefox real, touch mobile de la línea, lector de pantalla y aprobación humana pendientes; Verdict **APPROVE WITH CHANGES** para esta pasada técnica, no para cierre. **H5 sigue IN PROGRESS; H6 no se inicia.**

Séptima pasada H5 (2026-09-24), exclusivamente de geometría de la línea: desktop recupera el gutter derecho exterior a Ramiro y centra el último tramo/nodo sobre IR ARRIBA; compact conserva ambos extremos y zigzaguea por los cuatro gaps reales, alternando derecha/izquierda/derecha/izquierda/derecha. El cálculo de anclas compensa transforms transitorios de reveals para que milestones y giros correspondan al layout estable. corepack pnpm build genera las cinco rutas; corepack pnpm check informa 0 errores/warnings/hints. QA específico qa/h5-seventh-pass-results.json: 50 combinaciones (cinco idiomas × diez viewports 360, 390, 430, 768, 900, 1023, 1024, 1366, 1920 y 2560), sin overflow ni cruces de copy, tarjetas, figuras o controles; orden y longitud de giros, milestones crecientes, reversión, resize mobile→desktop→tablet y reduced motion estático; ocho capturas desktop/compactas en qa/seventh-pass/ revisadas. No se modificaron Hero, menú, Servicios desktop, cards, Contacto u otros componentes. Persisten la matriz manual cross-browser/dispositivos reales, lector de pantalla y aprobaciones finales de H5; no se avanza a H6. **H5 sigue IN PROGRESS.**

## V2-H6 — Implementation

Objetivo y entregables: completar integración productiva del alcance aprobado tras la base H5: selección final de screenshots con captions/alt, WOFF2 japonés optimizado, assets/metadata finales, ajustes SEO y hosting cuando sea confirmado. No reabrir diseño o copy H4 salvo aprobación específica.

Cierre: Implementación completa con contenido real, validaciones técnicas y revisiones visuales/accesibles aplicables.

Estado: NOT STARTED

## V2-H7 — QA & pre-release

Objetivo y entregables: Validar comprensión comercial, contacto, enlaces, idiomas, responsive, browsers, teclado, touch, reduced motion y calidad técnica.

Cierre: Criterios pre-release de DONE.md satisfechos con evidencia y excepciones persistentes explícitamente aceptadas.

Estado: NOT STARTED

## V2-H8 — Release

Objetivo y entregables: Publicar y comprobar dominio/HTTPS, contacto, SEO y assets; repetir validaciones dependientes del entorno público.

Cierre: Todos los criterios de DONE.md, incluidos producción y performance, satisfechos antes de STATUS: DONE.

Estado: NOT STARTED

## Auditoría V2-H0

Resultado: **PASS — 2026-09-20**. Bloqueos de V2-H0: **None**.

- Lectura integral de AGENTS, los diez documentos de docs y la skill; autoridad y referencias verificadas.
- Decisiones comerciales confirmadas incorporadas; sin copy final, navegación, Hero ni selección de proyectos nuevos.
- Hechos consolidados desde CONTENT a PROJECTS, preservando autoría, permisos, estados, incertidumbre histórica de LingoHive y límites de claims.
- Comparación con el estado anterior: i18n, responsive, browser support y performance de ARCHITECTURE intactos; secciones técnicas de QA y umbrales de DONE preservados íntegramente.
- Paleta y antecedentes visuales conservados; reglas V1 históricas separadas de la especificación activa y REVISIT sin aprobación automática.
- Búsqueda de referencias V1, H0–H11, Concept A y aprobaciones antiguas: contextualizadas como antecedentes o decisiones invalidadas.
- Inventario y hashes comparados: sólo cambiaron los once documentos autorizados y la skill; los siete archivos de prototipos permanecen idénticos. Sin archivos nuevos o eliminados.
- No se ejecutaron builds ni QA visual, ni se inicializó Astro o instalaron dependencias: alcance exclusivamente documental.

Pendientes de hitos futuros, no bloqueos de V2-H0: selección/tratamiento de evidencia (V2-H2), UX (V2-H3), copy y revalidación visual (V2-H4), ratificación técnica (V2-H5).
V2-H1 queda cerrado; V2-H2–V2-H8 permanecen NOT STARTED. Este cierre no declara terminado el sitio.

## Auditoría V2-H1

Resultado: **PASS — 2026-09-20**. Bloqueos de V2-H1: **None**.

- Posicionamiento y denominación conceptual de la oferta aprobados y separados de copy público final.
- Oferta jerarquizada como diseño y desarrollo de sitios web, con tipos principales, capacidades integradas y diseño externo como capacidad complementaria.
- Proceso conceptual, evaluación de rediseños, límites de estabilización y delimitación de SEO técnico incorporados sin precios, plazos, garantías ni servicios no confirmados.
- Email y GitHub conservados como los únicos canales públicos aprobados; no se agregaron WhatsApp, formulario ni calendario.
- Claims comerciales y límites de proyectos permanecen gobernados por PROJECTS.md; no se modificó evidencia ni se aprobó selección de casos.
- Auditoría documental de POSITIONING, OFFER, PRODUCT, DECISIONS y ROADMAP completada; no hubo builds, QA visual, código ni avances a V2-H2.

## Auditoría V2-H2

Resultado: **PASS — 2026-09-20**. Bloqueos de V2-H2: **None**.

- Lectura integral de AGENTS, los diez documentos de docs y la skill completada antes de definir el alcance.
- PRODUCT registra el recorrido conceptual oferta → encaje → evidencia → Ramiro y forma de trabajo → contacto, sin convertirlo en secciones, layout o navegación.
- CONTENT registra necesidades del cliente, requisitos del Hero, modelo unificado de servicios, proceso integrado, perfil, contacto, idioma fuente español, exclusiones y paridad ES/EN/PT; el copy final continúa pendiente para V2-H4.
- Residencias Grupo Casa queda seleccionado como único caso público inicial, resumido dentro del recorrido principal y con estado `en desarrollo`; no se permite link hasta confirmar y comprobar el deployment.
- LingoHive queda diferido sin placeholder público, con atribución, límites y precondiciones explícitas; su restauración no bloquea el lanzamiento.
- Inventario auditado: el repositorio de ramita.dev no contiene assets visuales seleccionados; screenshots, derivados y assets de marca quedan identificados como pendientes, no como evidencia disponible.
- Búsqueda de estados y decisiones obsoletas completada; las referencias restantes a selecciones pendientes pertenecen únicamente a auditorías o registros V1 históricos.
- Sólo se modificaron PRODUCT, CONTENT, PROJECTS, DECISIONS y ROADMAP. No hubo código, Astro, dependencias, UI, wireframes, builds ni QA visual.

V2-H3 permanece NOT STARTED. Este cierre entrega requisitos y evidencia a Commercial UX, pero no lo inicia ni declara terminado el sitio.

## Auditoría V2-H3

Resultado: **PASS — 2026-09-20**. Bloqueos de V2-H3: **None**.

- Ramiro aprobó el conjunto UX mediante el pedido de implementar el plan; CTA hacia Contacto y header persistente ya habían sido confirmados. Se implementó exclusivamente su registro documental.
- PRODUCT registra single-page por idioma y cinco secciones; CONTENT distribuye contenido sin aprobar copy ni assets. DESIGN contiene especificación, wireframes 1440×900/390×844, menú no modal, CTA, copia, responsive, foco, touch y handoff.
- Se recorrieron conceptualmente ambos wireframes y los tres perfiles: negocio sin web, profesional con web vieja y cliente con diseño externo. Todos encuentran encaje, evidencia pertinente y contacto; se conserva el límite de no tener un caso específico de diseño externo. No es una prueba con usuarios reales.
- Caso y servicios contrastados con OFFER/PROJECTS: sin claims nuevos, autoría inventada, enlace no confirmado ni LingoHive público. Dos figuras pendientes de selección; estado en desarrollo visible.
- ARCHITECTURE incorpora contratos UX y mejora progresiva sin alterar rutas/i18n, matriz de browsers, rangos responsive, SEO ni performance. PROJECTS, OFFER, DONE, AGENTS, skill y prototipos permanecen intactos.
- Auditoría guardian: APPROVE para el UX documental aprobado. Sin bento, card wall, HUD, terminal/navegador falso, stats, badges, skill bars, CTA repetitivo, scroll gimmicks ni decoración funcionalmente injustificada. Riesgos de longitud del caso, capturas, header y proceso documentados para revisión posterior.
- Corregido en POSITIONING el pendiente obsoleto de idioma fuente: español ya aprobado en H2. DECISIONS registra decisiones y motivos. Antecedentes V1 conservados íntegramente; las auditorías anteriores son registros del estado en su momento, no el estado activo.
- Inventario comparado: sólo cambiaron PRODUCT, CONTENT, DESIGN, ARCHITECTURE, POSITIONING, DECISIONS y ROADMAP; sin archivos nuevos o eliminados. No se ejecutaron builds ni QA visual, ni se escribió código o se instalaron dependencias.

V2-H3 queda CLOSED. V2-H4–V2-H8 permanecen NOT STARTED. Pendientes: copy/traducciones, screenshots exactos, sistema visual y revalidación de elementos REVISIT en H4; decisiones técnicas/interacción posterior en H5; implementación y QA en sus hitos. No declara terminado el sitio ni aprueba UI visual implementada.

# Roadmap V1 histórico — no ejecutar

El contenido siguiente conserva la planificación anterior. Sus estados son históricos y no describen el trabajo activo.
H0–H2 figuraban CLOSED; H3 permanecía IN PROGRESS. El cierre histórico H1 no prueba selección definitiva de proyectos: sus pendientes se trasladan a V2-H2.
Ninguna instrucción, secuencia o aprobación de este archivo histórico habilita avanzar en V2.

Los hitos son secuenciales salvo indicación contraria.

Codex no debe adelantarse a hitos futuros.

## V1 histórico — H0 — Governance

Objetivo:
establecer reglas, documentación y baseline.

Incluye:
- AGENTS;
- PRODUCT;
- DESIGN;
- CONTENT;
- ARCHITECTURE;
- ROADMAP;
- DONE;
- DECISIONS;
- design guardian skill.

Cierre:
documentación consistente y sin contradicciones bloqueantes.

Estado: CLOSED

---

## V1 histórico — H1 — Content & asset audit

Objetivo:
saber qué contenido real existe antes de diseñar alrededor de datos ficticios.

Tareas:
- localizar GitHub/proyectos relevantes;
- auditar proyecto web anterior;
- decidir si se redespliega;
- inventariar assets de Residencias Grupo Casa que puedan mostrarse;
- confirmar email y GitHub públicos;
- decidir si se usa foto personal;
- definir qué datos pueden publicarse.

No implementar la UI final.

Cierre:
lista confirmada de proyectos y contenido disponible.

Estado: CLOSED

---

## V1 histórico — H2 — UX skeleton

Objetivo:
definir estructura sin styling final.

Tareas:
- orden y tamaño conceptual de Hero/About/Projects/Contact;
- comportamiento del header;
- navegación;
- comportamiento de theme;
- comportamiento de accent;
- estrategia i18n/rutas;
- wireframes desktop/mobile;
- estados keyboard/touch.

Restricción técnica ya establecida:
- respetar la matriz de browser support definida en `docs/ARCHITECTURE.md` antes de tomar decisiones visuales, de motion o implementación.

Cierre:
flujo aprobado sin depender de efectos visuales.

Estado: CLOSED

---

## V1 histórico — H3 — Visual system

Objetivo:
convertir Quiet Interactive en sistema reproducible.

Tareas:
- tipografías;
- spacing;
- escala;
- neutrales;
- accents light/dark;
- tokens;
- borders;
- focus;
- selección;
- superficies;
- reglas de imágenes;
- prototype estático del Hero.

Cierre:
Hero atractivo incluso sin animación.

Estado: IN PROGRESS — paleta, tipografía y accents aprobados; composición estática del Hero pendiente.

---

## V1 histórico — H4 — Motion prototype

Objetivo:
definir lenguaje de interacción antes de animar toda la web.

Crear máximo 2–3 prototipos de comportamiento:
- recurso interactivo principal del Hero;
- transición Hero -> About;
- comportamiento de project preview.

Comparar:
- costo de JS;
- accesibilidad;
- mobile;
- reduced motion;
- estabilidad;
- valor visual.

Cierre:
elegir sólo los comportamientos que aportan valor.

---

## V1 histórico — H5 — Foundation implementation

Objetivo:
bootstrap técnico definitivo.

Incluye:
- Astro;
- Tailwind;
- TypeScript strict;
- estructura de carpetas;
- tokens;
- theme;
- accent;
- i18n;
- layout base;
- persistencia;
- lint/format/typecheck;
- metadata base.

Sin pulido de secciones.

---

## V1 histórico — H6 — Hero + Header

Implementar y cerrar:
- header desktop/mobile;
- Hero;
- theme;
- accent selector;
- idioma;
- interacción principal;
- reduced motion;
- keyboard/touch.

Recordatorio accent:
elegir color NO cierra el panel.

---

## V1 histórico — H7 — About

Implementar:
- copy aprobado;
- transición;
- responsive;
- motion aprobado.

No agregar stack wall ni badges gratuitos.

---

## V1 histórico — H8 — Projects

Implementar sólo proyectos auditados.

Cada proyecto necesita:
- contenido real;
- asset real;
- rol/trabajo real;
- tecnologías sólo si están confirmadas;
- link sólo si existe y conviene publicar.

No compensar pocos proyectos con placeholders públicos.

---

## V1 histórico — H9 — Contact + Footer

Implementar:
- email;
- GitHub;
- copy aprobado;
- Copy email;
- footer mínimo como chrome/estructura auxiliar al final de Contact, no como quinta sección.

El footer sólo puede reutilizar información mínima ya presente o derivada directamente del producto. No puede introducir una nueva categoría de contenido, navegación secundaria extensa, métricas, slogans adicionales ni información no aprobada.

---

## V1 histórico — H10 — QA integral

Validar:
- 3 idiomas;
- dark/light;
- todos los accents;
- keyboard;
- touch;
- reduced motion;
- responsive;
- links;
- metadata;
- SEO;
- Open Graph y assets finales;
- performance;
- Lighthouse/PageSpeed en preview/staging;
- compatibilidad con la matriz de browsers definida en `docs/ARCHITECTURE.md`.

Corregir antes de release.

Toda validación que dependa del entorno público debe repetirse obligatoriamente en producción durante H11.

---

## V1 histórico — H11 — Release

Puede comenzar únicamente cuando:
- H0–H10 estén cerrados;
- todos los criterios pre-release aplicables de `docs/DONE.md` estén satisfechos.

Incluye:
- deploy production;
- dominio y HTTPS;
- canonical definitivo;
- sitemap definitivo;
- robots definitivo;
- verificación pública de Open Graph y assets finales;
- smoke test público;
- Lighthouse/PageSpeed sobre producción;
- repetición en producción de cualquier validación previa que dependiera del entorno público.

Sólo después de completar y documentar estas validaciones puede declararse `STATUS: DONE` según `docs/DONE.md`.

No declarar “terminado” si queda `TODO_*` visible, requisito crítico pendiente o excepción persistente sin aceptación explícita del usuario.
