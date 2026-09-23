# DECISIONS.md

## 2026-09-23 — V2-H5: cierre visual de Contacto y control de versiones

Ramiro recupera Contacto como escena flexible de al menos un viewport en desktop, sin restaurar padding inferior excesivo; mobile conserva altura natural. El final de la línea se mide desde «IR ARRIBA» y queda próximo pero separado del botón, con pulso intacto y Back to top sin hash. Pressed del cursor baja a 12 px; normal/hover siguen en 18/30 px. Autoriza inicializar Git en `C:\Codigo\portfolio`, registrar el estado actual en `main` y subirlo al remoto de código fuente `https://github.com/ramiro-gp/portfolio.git`, sin deployment ni cierre de H5. El remoto se comprobó vacío antes del primer commit; QA generado y prototipos se conservan, mientras dependencias, build, caches, logs, temporales y env locales se ignoran. **H5 IN PROGRESS**.

## 2026-09-22 — V2-H5: cuarta pasada de recorrido y QA visual

Ramiro sustituye el mapeo global scroll→longitud por milestones estructurales de layout y permite rutas SVG distintas para desktop y mobile/tablet. La línea no necesita visibilidad constante: puede quedar atrás o desaparecer detrás de las gigantocards, pero no anticipar contenido ni cruzar los textos de Servicios. Desktop retrasa la primera curva, entra al centro del stack, sale hacia la izquierda del copy inferior y conserva el recorrido posterior; compact usa una ruta propia más simple. El cursor baja a 14/18/30 px (pressed/normal/hover) y Contacto reduce el espacio inferior sobrante. Sin rediseñar componentes, cambiar stack ni abrir H6. **H5 IN PROGRESS**.

## 2026-09-22 — V2-H5: tercera pasada de QA visual

Ramiro aprueba reforzar línea (17/8,5 px) y nodos (radio 20/12,5 px), pulso radial relleno cada 3,5 s, eliminación total del under-stroke, y GitHub en Ramiro con el accent elegido. El progreso del trazo deja de perseguir una Y del viewport y pasa a recorrer longitud física de path por scroll nativo reversible. SCROLL navega suavemente a Servicios y el control IR ARRIBA vuelve a scroll 0 sin hash; reduced motion salta. El cursor fine pointer pasa a 16/36/50 px (pressed/normal/hover). Hero, headings y copy aumentan de escala; cada carácter del estado visual entra desde abajo durante un reveal total cercano a 400 ms, sin cambiar el clarifier. No se abre H6 ni se cierra H5.

## 2026-09-22 — V2-H5: segunda pasada de refinamiento y bugs

Ramiro solicita más presencia para línea/nodos y un pulso radial discreto, mismo accent de punta a punta con separación neutra contextual, recorrido fuera de los textos auxiliares de Servicios, leve aumento tipográfico y enlace localizado «Ir arriba» en Contacto. Se corrigen la superficie full-bleed de Ramiro que podía desbordar con scrollbar clásico y el contorno excesivo de la sección enfocada tras navegar por idioma/fragmento, preservando foco visible. No se cambia stack, menú, Hero conceptual, secciones, screenshots ni diez accents. **H5 IN PROGRESS**; QA y aprobación pendientes.

## 2026-09-22 — V2-H5: refinamiento visual posterior aprobado

Ramiro aprueba sobre la aplicación Astro actual, sin nueva fase ni cierre de H5, una línea más presente con giros ortogonales suavizados, nodos sólidos y progreso ligado a la altura visible; Hero con reveal breve por caracteres e indicador SCROLL secundario; cierre reverso del fullscreen; MODO y COLOR PRINCIPAL visibles sin submenú Aspecto; underline independiente por link; rótulo 04 «Ramiro Garcia» en cinco idiomas; retirada de divisores globales; y Ramiro como escena oscura sólo dentro del Light default. Path y cursor usan contraste contextual. Servicios sticky, Proyectos claro, capturas reales provisionales, oferta y diez accents se mantienen. QA y aprobación visual siguen pendientes; **H5 IN PROGRESS**.

## 2026-09-22 — V2-H5: ratificación técnica y estado de QA

La implementación H5 usa Astro 7.3 estático, TypeScript strict, pnpm y CSS/scripts propios, sin Tailwind, framework cliente, librería de motion ni smooth scroll. `localStorage` guarda el theme y el último accent válido de cada theme con fallback light/verde; dark nuevo usa naranja. Se prepara JSON-LD `Person` sólo con nombre, URL y GitHub confirmados. El hosting sigue sin elegirse. H5.A–G están implementados, pero H5 continúa **IN PROGRESS** hasta completar la matriz manual de browsers/dispositivos, lector de pantalla y aprobación visual/funcional; las capturas finales, WOFF2 JA y SEO/deployment final siguen en H6–H8.

## 2026-09-21 — V2-H5: alcance de interacción aprobado posteriormente

Ramiro aprueba implementar en H5, y no sólo especificar, la base estática y las interacciones del plan H5.A–H: menú fullscreen modal al mejorarse con JS, navegación y secciones numeradas, Servicios con tres paneles sticky cuando sea cómodo, rótulo «Proyectos», Hero rotativo accesible, reveals one-shot, microinteracciones, cursor fine-pointer y línea continua como fase tardía. Esta aprobación sustituye sólo los contratos H3/H4 incompatibles indicados en DESIGN y ARCHITECTURE; H0–H4 permanecen cerrados. H6 conserva assets definitivos, WOFF2 JA, integración SEO y hosting por confirmar. Sin framework cliente ni librería de motion.

Registro de decisiones, no sustituto de las fuentes de verdad activas.

## 2026-09-21 — V2-H4 cerrado: idiomas y sistema visual (superseding)

Ramiro aprueba ES/EN/PT/FR/JA tras los ajustes lingüísticos indicados en `docs/locales/`, incluida la estructura natural EN «Website design and development for your [word]», la flexión seu/sua en PT y la estructura JA «［語］を紹介するウェブサイトのデザイン・開発». El copy ES aprobado no se modifica. Metadata textual prevista aprobada por consistencia; captions y alt sujetos a la selección exacta de screenshots siguen diferidos a H6.

Ramiro aprueba el sistema visual estático vigente, los diez accents exactos documentados en DESIGN.md, light con verde `#176844` como default global, dark con naranja como default de ese theme y Aspecto como control discreto. Quiet Interactive queda revalidado como interacción sobria; Instrument Sans y fallback Noto Sans JP mantienen sus roles. Esta aprobación sustituye los estados anteriores «candidatos», «composición pendiente» y «traducciones por revisar» en los documentos activos.

Contrato H5 para Menú/Aspecto: Light/Dark y accents se aplican inmediatamente sin cerrar el panel, permitiendo combinaciones consecutivas. Cerrar al navegar a sección, cambiar idioma y navegar, Escape, click/tap fuera o nuevo accionamiento del trigger. Tab/salida de foco solos no cierran. No se implementa en H4. Tras auditoría de consistencia, V2-H4 queda **CLOSED**; V2-H5 permanece **NOT STARTED**. El par final de capturas de Residencias, sus captions/alt y el asset WOFF2 JA optimizado pertenecen a H6.

## 2026-09-21 — V2-H4: fuente ES aprobada, traducciones y evidencia

Ramiro aprueba el copy fuente ES vigente de Header, Hero, Servicios, Residencias, Ramiro/proceso, Contacto, Footer, etiquetas y estados. `prototypes/v2-h4/v2/ES-COPY-APPROVED.md` lo transcribe sin reformulación; `docs/locales/` contiene EN/PT/FR/JA completos para revisión, incluidas etiquetas accesibles, feedback futuro, metadata y disclosure no-ES. No publicar traducciones hasta aprobación. El Hero mantiene fallback sin punto, clarifier exacto y secuencia fija; la animación permanece en H5.

Se aprueba el tratamiento de Residencias como evidencia real desktop + mobile, sin mockups, con tamaño suficiente y captions factuales. `SCREENSHOT_SELECTION = DEFERRED_TO_IMPLEMENTATION`: las capturas exactas y captions/alt dependientes de ellas pueden cambiar en H6 sin reabrir H4 si representan la misma versión vigente, no muestran residentes identificables ni modifican claims o arquitectura. El par actual no es definitivo. Estado «En desarrollo» y «Ver sitio» al deployment confirmado permanecen.

Noto Sans JP es el fallback fijado para glifos japoneses, manteniendo Instrument Sans para latín. Se usa una copia local genérica OFL sólo para revisión H4; WOFF2 autoalojado optimizado y pesos necesarios se preparan en H6 sobre el corpus JA aprobado. Rutas y códigos: `/` es, `/en/` en, `/pt/` pt, `/fr/` fr, `/ja/` ja; etiquetas completas cuando haya espacio. H4 continúa IN PROGRESS por revisión de traducciones y aprobación visual final; H5 NOT STARTED.

## 2026-09-21 — V2-H4: patch menor de deployment y copy (superseding)

Residencias Grupo Casa continúa **en desarrollo**, pero su deployment público navegable queda confirmado en <https://residenciasgrupocasa.com.ar/>. Sustituye las reglas activas que omitían el enlace: el caso puede incluir la acción secundaria «Ver sitio», sin sustituir screenshots curadas ni convertir el par actual en selección definitiva.

El Hero elimina el punto final del headline y fija el fallback «Diseño y desarrollo de sitios web para presentar tu proyecto». El clarifier de muestra pasa a «Soy Ramiro Garcia. Trabajo con vos desde la definición hasta la publicación de tu web.» La secuencia de palabras no cambia; la continuidad posterior se comunica fuera del Hero.

Japonés queda fijado como `ja`, `/ja/` y `lang`/`hreflang` `ja`; no `jp`. Francés usa `/fr/`. Cuando haya espacio, la UI muestra `日本語`. Los icon buttons de copia deben tener cursor pointer, foco visible, target cómodo y nombres accesibles; feedback funcional sigue en H5. H4 IN PROGRESS; H5 NOT STARTED; sin producción.

## 2026-09-21 — V2-H4: decisiones posteriores de alcance y contenido (superseding)

Ramiro fija **light como theme default** con accent verde profundo `#176844`; dark queda disponible con naranja como accent default y azul sigue como alternativa light. Sustituye el default dark registrado en la iteración 2 sin reabrir H1/H2/H3. Personalización de accents conservada; técnica final en H5.

El Hero sustituye la dirección de headline estático por «Diseño y desarrollo de sitios web para presentar tu [palabra variable]», con secuencia fija servicio → proyecto → marca → producto → portfolio → campaña; sin «tienda». H4 define estado estático y fallback «proyecto», no movimiento. La puesta online no cierra necesariamente el vínculo: estabilización de la entrega y mantenimiento/evolución posterior son alcances distintos, ambos acordados por proyecto. Clarifier exacto sigue DRAFT.

SEO técnico continúa. Se agregan como capacidades complementarias condicionadas al alcance Perfil de Empresa de Google para negocios locales y preparación técnica para buscadores/asistentes de IA, sin garantías de rankings, reseñas, recomendaciones, citas, tráfico o resultados comerciales. Servicios sigue con tres tipos principales.

Contacto conserva email principal y WhatsApp secundario, con icono de copia junto a cada dato y nombres accesibles «Copiar email»/«Copiar teléfono»; sustituye el botón textual independiente. Idiomas pasan a ES/EN/PT/FR/JA con paridad; español es fuente. Sólo fuera de ES aparece una nota discreta sobre español hablado y uso de IA/traducción con contexto de proyecto. Instrument Sans no cubre japonés: fallback JA a probar sin reemplazar la familia latina global. Fuentes activas: PRODUCT, POSITIONING, OFFER, CONTENT, DESIGN, ARCHITECTURE; hitos en ROADMAP y criterio de release en DONE. PROJECTS no cambia. H4 IN PROGRESS; H5 NOT STARTED; sin producción.

## 2026-09-21 — V2-H4: iteración visual 2 y contacto secundario

Decisiones explícitas de Ramiro: dark predeterminado/naranja, light predeterminado con verde profundo (`#176844`) y azul alternativo; personalización de accents restaurada. Reemplazan light only y verde fijo único de la primera prueba. Cinco candidatos por theme procedentes de V1; valores exactos pendientes. Memoria conceptual independiente y selección de accent sin cierre automático deseado; técnica e interacción finales en H5.

Claridad editorial recibe influencia japonesa exclusivamente compositiva: espacio deliberado, asimetría controlada, ritmo y reglas finas. Sin motivos culturales literales. Hero, header y mobile aprobados como bases; Servicios/About requieren exploración, no aprobación final. Residencias conserva placeholders y copy sigue DRAFT.

WhatsApp confirmado: +54 9 11 5135-4489, https://wa.me/5491151354489. Email principal; WhatsApp alternativa secundaria; copiar email utilidad; GitHub sólo en Ramiro. Sustituye la exclusividad comercial del email registrada en H1–H3 sin reabrir esos hitos. Fuentes activas actualizadas: PRODUCT, OFFER, CONTENT, DESIGN y alcance de ARCHITECTURE.

Iteración 2 aislada, conservando la anterior. H4 IN PROGRESS, sin producción ni avance a H5. No se aprueban preferencias finales, screenshots, copy ni composición definitiva de Servicios/About.

## 2026-09-20 — V2-H3: Commercial UX aprobado

Ramiro aprobó el conjunto al pedir implementar el plan, después de confirmar CTA inicial hacia Contacto y header persistente. Alcance de implementación: documentación del UX, sin código ni avance a H4.

- Single-page comercial por idioma con Hero → Servicios → Caso real → Ramiro y forma de trabajo → Contacto. La cantidad real de contenido no justifica páginas secundarias. Header/footer auxiliares; sin espacios reservados a futuros casos.
- Hero centrado en oferta, utilidad y prestación personal; único CTA a Contacto. Email visible como acción mailto al cierre, copia auxiliar incluida para webmail/sin cliente configurado. Sin CTA intermedio; GitHub aparece una sola vez en Ramiro.
- Header persistente como único sticky para orientación y contacto durante el caso. Desktop con cuatro destinos e idiomas explícitos; mobile con menú no modal, navegación seguida de idiomas y estados de teclado/touch/foco definidos. Sin Preferencias heredadas; theme/accent siguen REVISIT.
- Servicios como oferta única con tres aplicaciones, capacidades según alcance y diseño externo complementario, sin cards ni botones individuales. Perfil y proceso permanecen integrados.
- Residencias con cuatro unidades y dos figuras desktop/mobile; mobile muestra primero su figura. Estado junto al nombre; ausencia de deployment se trata omitiendo enlace, sin botón deshabilitado. Sin página dedicada, galería, lightbox o LingoHive.
- Wireframes 1440×900 y 390×844 definen segmentos continuos, sin alturas obligatorias. Responsive por espacio disponible, scroll nativo, accesibilidad y mejora progresiva explícitos.
- Footer limitado a ramita.dev y Ramiro Garcia. No se aprueban copy, screenshots exactos, tipografía, color, motion ni sistema visual.
- Se corrige el pendiente obsoleto de idioma fuente en POSITIONING: español ya aprobado por H2.

Fuentes activas: PRODUCT para arquitectura, CONTENT para distribución pública, DESIGN para UX/wireframes/handoff y ARCHITECTURE para contratos compatibles con i18n y requisitos técnicos conservados. Auditoría y cierre en ROADMAP. Los antecedentes V1 y hechos de PROJECTS permanecen intactos.

## 2026-09-20 — V2-H2: Content architecture & evidence cerrado

Decisiones confirmadas:

- Recorrido conceptual mínimo: oferta y orientación inicial → encaje y alcance → evidencia real → Ramiro y forma de trabajo → contacto. No fija secciones visuales, layout, navegación ni header; esos puntos pertenecen a V2-H3.
- El Hero debe priorizar la oferta, el resultado general para el cliente, a Ramiro como prestador y una acción de contacto. Tipos de sitio, acompañamiento hasta publicación, nombre y título son secundarios; stack, métricas, proceso completo y detalles de casos quedan fuera.
- La oferta se presenta como un único servicio aplicado a institucionales, landing pages y rediseños. Responsive, formularios, SEO técnico, performance y publicación son capacidades integradas según alcance, no servicios aislados ni inclusiones automáticas.
- El proceso entender → definir → diseñar → desarrollar → revisar → publicar y comprobar se incorpora brevemente dentro de la presentación profesional, sin bloque autónomo obligatorio ni promesas de reuniones, revisiones, plazos o soporte.
- Residencias Grupo Casa es el único caso de V1. Se muestra como resumen dentro del recorrido principal, puede publicarse como trabajo en desarrollo si se declara su estado y no tendrá enlace hasta confirmar y comprobar el deployment.
- LingoHive queda diferido como candidato futuro, con modelo y precondiciones documentados, sin teaser, placeholder ni espacio público reservado. No bloquea el lanzamiento.
- El idioma fuente del copy será español; ES, EN y PT deben mantener información, atribuciones, límites y estados equivalentes.
- Email es la acción comercial principal. La información sugerida para el primer mensaje es opcional y no se incorpora formulario, WhatsApp ni calendario.
- Se aprueba una política explícita contra contenido de relleno, evidencia artificial, claims sin vigencia y CV/tech wall.

Fuentes activas: PRODUCT para arquitectura conceptual; CONTENT para requisitos y expresión pública; PROJECTS para selección, hechos, atribución, permisos y precondiciones. V2-H3 recibe esta jerarquía sin decisiones visuales heredadas.

## 2026-09-20 — V2-H1: Positioning & offer cerrado

Decisiones confirmadas:

- Denominación conceptual de la oferta: **diseño y desarrollo de sitios web**, desde la definición del proyecto hasta su publicación y con alcance acordado en cada caso. No es copy final ni Hero.
- Propuesta de valor: un servicio que conecta definición, diseño e implementación con un único interlocutor responsable de la entrega acordada.
- Diferenciadores: continuidad entre diseño e implementación; trato directo con quien realiza el trabajo; criterio visual y técnico aplicado conjuntamente; e implementación de dirección visual externa. Se presentan como capacidades, no como superioridad frente a otros profesionales.
- Proceso conceptual: entender → definir → diseñar → desarrollar → revisar → publicar y comprobar. En diseño externo, diseño puede ser revisión del material y resolución de faltantes acordados. No fija secciones, reuniones, revisiones ilimitadas ni documentos comerciales.
- Rediseños: evaluación previa para decidir entre intervenir sobre el sitio existente o reconstruirlo. Sin promesas previas de reutilización de código, migración sin problemas, rankings, mejoras cuantificadas ni fechas.
- Estabilización post-launch: instancia acotada para problemas atribuibles a la entrega respecto del alcance acordado; excluye automáticamente nuevas funcionalidades, ampliaciones, cambios futuros de contenido, mantenimiento recurrente, soporte indefinido y problemas de terceros o modificaciones posteriores. Cobertura y duración se acuerdan por proyecto.
- SEO técnico integrado cuando corresponda: estructura semántica, metadata, indexabilidad técnica, datos estructurados y performance según alcance. Una buena base técnica no garantiza indexación ni resultados concretos. Excluye estrategia de contenidos, keyword research, marketing y SEO recurrente; no promete rankings, tráfico, rich results ni ventas.
- Email sigue como único canal comercial inicial; GitHub es respaldo profesional.

Fuentes activas: POSITIONING y OFFER; PRODUCT resume el alcance. V2-H1 queda cerrado tras auditoría documental de consistencia. V2-H2 no se inicia con esta decisión.

## 2026-09-20 — Product reset: V2 Commercial Personal Website activo

Decisión confirmada: **RESET PRODUCT LAYER AND REUSE EVIDENCE**.
V1 queda histórica. V2 es el sitio comercial personal de Ramiro para vender servicios web, con casos como evidencia y presentación profesional subordinada a confianza.
Prioridad: vender, generar confianza, demostrar y presentar al profesional.

- Mercado inicial sin nicho: pequeños negocios, profesionales, emprendimientos, empresas con necesidad institucional, landings y webs desactualizadas. Argentina/Latinoamérica como mercado natural; proyectos remotos internacionales aceptados.
- ES / EN / PT sin claims de fluidez oral.
- Oferta principal: diseño y desarrollo integral; institucionales, landings y rediseños con evaluación previa.
- Implementación de diseño externo como capacidad complementaria.
- Responsive, UX/UI, SEO técnico, performance, formularios, integraciones y deployment/hosting integrados cuando corresponda, no servicios aislados por defecto.
- Full stack según necesidad, sin vender cualquier sistema.
- Posible soporte acotado de estabilización; sin mantenimiento recurrente ni soporte indefinido.
- Lenguaje comercial de diseño y desarrollo web; título profesional real conservado sin imponerlo como protagonista del Hero.
- Email como canal comercial inicial; GitHub como respaldo. WhatsApp, formulario y calendario futuros, no incorporados.
- Sin precios públicos, paquetes, tiempos inventados ni copy final nuevo.

Fuentes activas: PRODUCT, POSITIONING y OFFER. PROJECTS concentra hechos, autoría, permisos y auditorías; CONTENT sólo su expresión pública aprobada y datos canónicos.
Autoridad completa en AGENTS. Roadmap activo V2-H0–V2-H8 en ROADMAP; sólo V2-H0 autorizado en este cambio.

### KEEP — evidencia y calidad

Identidad/contacto, hechos profesionales, evidencia de ambos proyectos, permisos y límites de atribución; accesibilidad, responsive, browser support, QA, performance e i18n.
Las auditorías describen sus versiones históricas; no se presentan como nuevas verificaciones.

### REVISIT — sin aprobación automática para V2

Quiet Interactive, Instrument Sans, paleta, accents, dark/light y selector de accent, con valores y comportamientos conservados en DESIGN/ARCHITECTURE.
Stack/versiones previas se ratificarán en V2-H5, sin actualización en este reset.

### INVALIDATE — decisiones que no gobiernan V2

Recruiter/CV como objetivo rector; estructura obligatoria Hero/About/Projects/Contact; Concept A; nombre de Ramiro como protagonista obligatorio; ausencia obligatoria de CTA; UX Skeleton H2 anterior; H3 como dirección activa.
No se aprueba todavía una estructura, Hero o navegación sustitutos. Ningún cierre V1 cierra hitos V2.

# Registro V1 histórico

Las entradas siguientes se conservan por trazabilidad. Sus aprobaciones y estados sólo describen V1.
Su tratamiento vigente (KEEP / REVISIT / INVALIDATE) está arriba y en los documentos activos.

## V1 histórico — 2026-09-11 — Producto

- Dominio: `ramita.dev`.
- Nombre visible: Ramiro Garcia.
- Título: Full Stack Developer.
- Público: empresas/reclutadores + clientes freelance.
- Secciones V1: Hero, About, Projects, Contact.
- Contacto: email + GitHub.
- No LinkedIn.
- No CV descargable.
- Portfolio sin foto obligatoria en V1.
- Sin sonido.

## V1 histórico — 2026-09-11 — Dirección visual

- Dirección: Quiet Interactive.
- Minimalismo fuerte.
- Mucho espacio negativo.
- Una idea principal por viewport.
- Motion con propósito.
- Se descarta como dirección principal la estética Interface/OS/HUD.
- Se evitan patrones genéricos de portfolio IA.

## V1 histórico — 2026-09-11 — Theme

- Dark por defecto.
- Light opcional.
- Accents distintos según theme.
- Accent no modifica el background general.

## V1 histórico — 2026-09-11 — Selector de accent

- Seleccionar un color no cierra el panel.
- Se puede probar varios colores consecutivamente.
- Cierra al volver a pulsar Accent.
- Cierra al pulsar fuera.
- Cierra con Escape.

## V1 histórico — 2026-09-11 — Tecnología

Baseline inicial:
- Astro 7.3
- Tailwind CSS 4.3
- TypeScript strict
- pnpm

No agregar framework cliente por defecto.

## V1 histórico — 2026-09-11 — Governance y release

- H11 puede comenzar cuando H0–H10 estén cerrados y se cumplan los criterios pre-release aplicables de `docs/DONE.md`.
- Las validaciones dependientes del entorno público se repiten obligatoriamente en producción durante H11.
- `STATUS: DONE` sólo puede declararse después del deployment y las validaciones de producción.
- La matriz de browser support queda definida en `docs/ARCHITECTURE.md` antes de H3/H4.
- El cierre exige evidencia de QA y umbrales explícitos de accesibilidad y performance en producción.
- Toda excepción persistente requiere aceptación explícita del usuario.
- El footer es chrome/estructura auxiliar al final de Contact, no una quinta sección.

## V1 histórico — 2026-09-13 — H2 UX skeleton

- Flujo Hero -> About -> Projects -> Contact mediante scroll nativo, sin scroll snap ni scroll hijacking; Hero sin CTA principal.
- Projects usa tramos editoriales con un protagonista por vez y funciona con 1, 2 o más proyectos.
- Header desktop/notebook: identidad, navegación directa y Preferencias agrupadas; mobile/tablet estrecha: identidad y Menú.
- Contact incluye email visible con `mailto:`, GitHub, disponibilidad freelance y Copiar email como acción secundaria.
- Primera visita siempre en dark; la elección de theme persiste. Cada theme recuerda su último accent; defaults y valores visuales quedan para H3.
- ES en `/`, EN en `/en/`, PT en `/pt/`; la URL determina el idioma, sin redirección automática ni preferencia de idioma en `localStorage`.
- Los paneles son no modales, operables por teclado/touch y mantienen el selector de accent abierto al cambiar theme o elegir un color.
- El flujo UX fue aprobado para cerrar H2. Copy público, visual system, motion y selección definitiva de proyectos se resuelven en sus hitos posteriores.

## V1 histórico — 2026-09-13 — H3 elecciones de dirección

- Tipografía elegida para probar: Instrument Sans, sin familia secundaria.
- Hero estático: Concept A, con Ramiro Garcia como foco y sin recurso gráfico.
- Neutrales: dirección carbón/papel apenas cálida.
- Accents iniciales elegidos: naranja en dark y azul en light.
- Los valores cromáticos de H3 y el Hero estático aún requieren revisión visual y aprobación explícita antes del cierre del hito.

## V1 histórico — 2026-09-14 — H3 sistema visual aprobado parcialmente

- Ramiro aprobó la paleta neutral, Instrument Sans y el sistema completo de
  accents, incluidos los valores y defaults registrados en `docs/DESIGN.md`.
- El Hero estático requiere una última iteración de composición; H3 permanece
  abierto. No se agregan recursos gráficos ni motion.
