# DESIGN.md — ramita.dev V2

## Responsabilidad y estado activo

Fuente de verdad para experiencia visual e interactiva aprobada. V2-H3 aprueba el UX comercial documentado abajo; V2-H4 aprueba el copy de cinco idiomas y el sistema visual estático. La selección exacta de capturas y la implementación funcional siguen en hitos posteriores.
El diseño debe ayudar a entender servicios, generar confianza, demostrar capacidad y contactar. La identidad sigue siendo personal.

### Novena pasada H5 — primera de dos pasadas finales (2026-09-24)

Alcance exclusivo: más aire de escenas selectivas en mobile (Hero usa mínimo flexible equivalente a viewport menos el header; Ramiro y Contacto pueden alcanzar 100svh y crecer; Servicios y Proyectos permanecen naturales incluso en tablet compact); compartir exactamente el eje X del primer y último tramo vertical compact; corregir sólo la transición desktop Servicios→Proyectos→Ramiro para entrar y bajar por el corredor izquierdo de Proyectos, cruzar a la derecha en el espacio superior libre de Ramiro y descender fuera de su contenido. Se conserva el recorrido compact aprobado, el fondo especial/accent de Ramiro, Contacto y todos los controles/copy existentes. La rotación del Hero y los cambios de menú quedan expresamente diferidos a la segunda pasada; H5 permanece abierto.

### Corrección puntual posterior H5 — Servicios→Proyectos desktop (2026-09-24)

Prevalece sólo en ese subtramo sobre el recorrido de la novena pasada: después de Rediseños, la línea gira a la derecha hasta el gutter calculado desde el primer párrafo de «Según el alcance…», baja por fuera y a la izquierda del bloque con aire, gira a la izquierda después de su borde inferior y continúa hacia abajo por el corredor izquierdo de Proyectos. Se eliminan los cruces al gutter derecho y el horizontal ancho por encima de Proyectos. No cambian los tramos anteriores de Servicios, el path dentro de Proyectos, Ramiro, Contacto ni el builder mobile/tablet; milestones, proporción de progreso, scroll inverso y reduced motion se conservan. H5 sigue IN PROGRESS; H6 no inicia.

## Principios vigentes

- Minimalismo, espacio negativo útil, ausencia de ruido y rechazo a patrones AI-genéricos.
- Un foco claro, orientativamente no más de 3–4 focos por viewport; no obliga a secciones de una pantalla completa.
- Composición sólida sin animaciones; motion sólo para revelar, orientar, dar feedback o aportar carácter sin competir con contenido.
- Scroll nativo, sin scroll hijacking ni scroll snap impuesto.
- Mobile deliberado, targets cómodos, safe areas y viewport dinámico; no un desktop comprimido.
- Nada esencial sólo en hover; alternativas touch/keyboard y foco visible.
- Con `prefers-reduced-motion: reduce`, eliminar seguimientos del cursor y parallax relevante, reducir desplazamientos y mantener información y jerarquía.
- Assets reales, autoría y claims según PROJECTS.md; tecnologías como evidencia secundaria.
- Contacto por email sin presión ni múltiples CTAs compitiendo. Si se ofrece copia de email, comunicar éxito/error accesible y mantener el email utilizable si falla.
- No agregar foto, efectos, cards, badges, métricas o recursos 3D por costumbre.

## V2-H4 — sistema visual APPROVED — 2026-09-21

### Actualización puntual para V2-H5

El pedido posterior aprobado para H5 sustituye únicamente el menú compacto no modal por un menú fullscreen editorial con navegación numerada y focus trap, las tres filas de Servicios por tres paneles editoriales grandes con sticky reversible cuando sea cómodo, y el rótulo de sección «Caso real» por «Proyectos». También aprueba numeración discreta en las cinco secciones, rotación visual del Hero, reveals one-shot, cursor limitado a pointer fine y una línea ortogonal suavizada sólo después de estabilizar el layout. El contenido, los diez accents y el resto de la composición H4 siguen vigentes. En mobile, viewport bajo y reduced motion, Servicios puede volver a flujo normal. Las reglas H3 de «header único sticky», ausencia de cards, menú no modal y cursor fuera de alcance quedan sustituidas sólo en estos puntos; no son restricciones sobre H5.

### Refinamiento visual/interactivo posterior de H5 — 2026-09-22

Esta aprobación acotada de Ramiro sustituye en la implementación H5, sin reabrir H0–H4, el submenú Aspecto por grupos siempre visibles **MODO** y **COLOR PRINCIPAL** dentro del fullscreen; elegir opciones mantiene abierto el menú. Su apertura circular se conserva y el cierre contrae la misma superficie hacia el trigger, sin retirar el overlay antes del final. Cada link principal incorpora un underline reversible de izquierda a derecha en hover/foco. El destino 04 se rotula **Ramiro Garcia** en los cinco idiomas, con el proceso como contenido interno.

El Hero mantiene secuencia, fallback y ancho reservado, con reveal visual por caracteres sin aspecto de escritura o scramble. El indicador secundario «SCROLL» acompaña el inicio visual del recorrido. La línea continua tiene nodos sólidos al inicio/final, segmentos ortogonales y curvas suaves: baja por la derecha de Hero/Servicios, gira a la izquierda antes de Proyectos, vuelve a la derecha antes de Ramiro y termina hacia la mitad de Contacto. En reduced motion aparece completa. Los refinamientos posteriores fijan la dirección del reveal, la escala y el progreso vigente.

En Light, Ramiro funciona como escena oscura de pausa editorial y Proyectos/Contacto siguen claros; en Dark no se inventa una inversión clara adicional. Se eliminan divisores horizontales globales entre escenas, conservando los de función interna. Hero, Proyectos, Ramiro y Contacto pueden aproximarse a una escena de viewport en desktop sin altura rígida ni recorte; mobile mantiene altura natural. Servicios sticky y screenshots reales provisionales permanecen sin rediseño. La composición implementada aún requiere QA y aprobación visual; H5 no está cerrado.

Segunda pasada H5 aprobada por Ramiro (2026-09-22): la línea sube moderadamente a unos 12–14 px desktop y 6–7 px mobile, conserva **el mismo accent elegido** en todo el recorrido y separa sólo las combinaciones de bajo contraste mediante un under-stroke neutro y subordinado; los nodos sólidos crecen y emiten un pulso radial relleno, lento y prescindible con reduced motion. La geometría evita el texto introductorio y complementario de Servicios, no las superficies de los paneles. El texto general aumenta levemente sin cambiar jerarquía. Contacto añade un enlace localizado «IR ARRIBA» / «BACK TO TOP» y equivalentes, con flecha hacia arriba en el lenguaje del indicador SCROLL, subordinado al email. El foco de destino se indica sin encerrar una sección completa. El menú, Hero, estructura y accents restantes no se reabren; H5 continúa abierto.

Tercera pasada H5 aprobada por Ramiro (2026-09-22), que sustituye los valores y comportamientos incompatibles de las dos pasadas anteriores: línea de presencia mayor (objetivo 16–18 px desktop, 8–9 px mobile), nodos sólidos proporcionalmente grandes, pulso radial relleno cada ~3,5 s y **ningún** halo/under-stroke en Ramiro. El path, sus nodos y GitHub en Ramiro conservan exactamente el accent elegido, incluso con menor contraste en alguna combinación. El trazo progresa por longitud acumulada real ante el scroll y revierte al subir; su cabeza puede salir del viewport. El cursor fine pointer adquiere tres tamaños distinguibles. El H1 gana protagonismo; los headings de sección y el copy crecen de forma contenida. Las letras de la palabra visual entran de abajo hacia arriba en ~400 ms por palabra. El clarifier aprobado permanece intacto. SCROLL es un enlace editorial operable en desktop/mobile/touch/teclado y lleva a Servicios con scroll nativo suave; IR ARRIBA es un control que vuelve a `scrollY=0` sin hash. Ambos saltan inmediatamente con reduced motion y dejan foco útil. Servicios, menú y la composición de Contacto no se rediseñan. H5 permanece abierto.

Cuarta pasada H5 aprobada por Ramiro (2026-09-22), prevalente sobre el mapeo global de progreso y tamaños de cursor anteriores: el cursor fine pointer usa aproximadamente 14/18/30 px (pressed/normal/hover). La línea interpola longitud real del path entre milestones obtenidos de Hero, Servicios, stack, texto posterior, Proyectos, Ramiro y Contacto; puede quedar fuera de vista por arriba, pero no debe adelantarse a una zona futura de Servicios ni perseguir una Y fija del viewport. Desktop prolonga la vertical del Hero hasta las proximidades de Servicios, entra hacia el centro aproximadamente a mitad del stack, desciende detrás de las gigantocards, sale aún detrás de la última y bordea el texto inferior por la izquierda con aire antes de girar hacia Proyectos. Mobile/tablet usa un builder compacto propio: conserva el corredor derecho junto al copy, entra y sale por detrás de las cards y recupera ese corredor antes del texto inferior. La legibilidad prevalece sobre continuidad visible. El recorrido desde Proyectos mantiene su composición anterior. Contacto deja sólo un espacio inferior compositivo/safe-area, sin forzar una escena vacía de viewport. Menú, Hero, typography, theme/accent y contenido permanecen sin rediseño; **H5 sigue abierto**.

Quinta pasada H5 aprobada por Ramiro (2026-09-23), prevalente sólo en los puntos incompatibles: el cursor mantiene 18/30 px en normal/hover y reduce pressed a 12 px. Contacto recupera en desktop una escena de `min-height:100svh`, capaz de crecer con traducciones o texto ampliado; su contenido se distribuye con márgenes flexibles, no con gran padding inferior. Mobile conserva altura natural. El nodo final se ancla al control localizado «IR ARRIBA» con separación vertical suficiente para nodo y pulso, sin tocarlo; el texto de orientación compacto reserva margen frente al trazo. El botón mantiene scroll nativo a 0 sin hash. No se rediseñan los otros tramos ni se cierra H5.

Ramiro aprueba la dirección de claridad editorial y la composición estática vigente de Hero, Servicios, caso, About y Contacto, incluyendo header persistente y tratamiento mobile. Quiet Interactive queda revalidado como interacción sobria al servicio del contenido, no como obligación de efectos. Instrument Sans es la base latina; Noto Sans JP cubre glifos japoneses. El sistema visual queda **APPROVED**; motion, estados funcionales y producción pertenecen a H5/H6.

Sexta pasada H5 (2026-09-23), acotada a Contacto y chrome del navegador: en desktop la línea entra por el margen interno derecho de Contacto, hace una última curva ortogonal redondeada y sale del rail hasta un nodo próximo a IR ARRIBA; la rama mobile no cambia y su recorrido queda pendiente de QA real en dispositivo. El índice 05 comparte baseline editorial con 02–04. La scrollbar conserva scroll nativo, con thumb en el accent activo, track en el canvas del theme y flechas ocultas donde CSS lo permita. Contacto sigue sin formulario. No se modifican composición, copy descriptivo ni interacciones restantes; H5 continúa abierto.

Séptima pasada H5 (2026-09-24), prevalente sólo para la geometría posterior a Proyectos y el recorrido compacto: desktop conserva intacto el trayecto Hero–Servicios–Proyectos, baja por el gutter derecho exterior al contenido de Ramiro y, al entrar en Contacto, gira brevemente a la izquierda para descender con línea y nodo centrados sobre IR ARRIBA. Compact (<1024 px) conserva exactamente inicio y final aprobados y alterna sus corredores propios: derecha por introducción de Servicios → izquierda por Servicios → derecha antes de Proyectos → izquierda antes de Ramiro → derecha antes de Contacto. Los giros usan espacios reales entre copy, paneles y secciones; gutters y offsets se derivan del layout, sin coordenadas ligadas a una resolución. Un único accent, sin halo ni segunda traza. La ruta continúa siendo ortogonal, reversible y ligada al scroll nativo; la composición y el resto de componentes no se reabren. H5 sigue abierto.

Octava pasada H5 (2026-09-24), limitada al path, hit target del trigger y escena Ramiro dark: en compact los dos corredores se derivan del gutter del rail y conservan aire tanto hacia el borde físico como hacia el contenido; el extremo/nodo y el recorrido alternado aprobado se mantienen. El progreso deja de comprimir horizontales en los gaps: el intervalo de scroll combina milestones de escenas con predominio de la longitud acumulada real del SVG, de modo que tramos físicos largos requieren scroll perceptible y la cabeza puede quedar fuera de vista. En desktop sólo cambia Servicios: a la altura de Landing Pages el path cruza el stack hasta reaparecer por su lado izquierdo, baja junto a las cards y, debajo de Rediseños, se aproxima al bloque posterior sin cruzarlo, lo bordea verticalmente y retoma la ruta previa a Proyectos; ese tramo entre Servicios y Proyectos distribuye el progreso en 85% por longitud real y 15% por estructura, sin retimar la ruta posterior. El trigger gana una superficie mayor sin desplazar su glifo. Ramiro conserva en Dark un fondo oscuro propio, diferenciado del canvas con un token semántico; accent, textos, GitHub y línea no cambian. La medición de cierre confirmó inicio CSS en el siguiente frame (~21 ms desde Escape), sin delay declarativo; los 430 ms retienen modal/inert durante la duración del cierre y no son latencia inicial. No se cambia ese flujo. Sin rediseños adicionales; H5 sigue IN PROGRESS y H6 no se inicia.

- **Light predeterminado global**, con verde profundo (`#176844`) como accent default y azul alternativo. Dark disponible con naranja (`#FF9B58`) como accent default de ese theme.
- Personalización de accents y los diez valores actuales **APPROVED**. Dark: naranja `#FF9B58`, celeste `#78CFFC`, fucsia `#F58ACD`, verde lima `#C4E773`, blanco `#F1F0EC`. Light: verde profundo `#176844`, azul `#1C57BE`, rojo `#B23B35`, violeta `#6D42AA`, negro `#202421`.
- **Aspecto** aprobado como control discreto: acceso separado de la navegación comercial en desktop y dentro del menú mobile. Idioma/theme/accent siguen secundarios frente a oferta, navegación, CTA, caso y contacto. No heredar el gran agrupador Preferencias de V1.
- Memoria conceptual independiente por theme. Aplicar theme/accent inmediatamente sin cerrar el panel permite probar varias combinaciones seguidas. El contrato de cierre se fija abajo; interacción, teclado y persistencia técnica se implementan en H5.
- Influencia japonesa exclusivamente compositiva: espacio negativo deliberado, asimetría controlada, ritmo vertical preciso, reglas finas y pocas piezas relacionadas. Sin escrituras japonesas decorativas, banderas, círculos rojos decorativos, templos, bambú, sakura ni iconografía cultural literal. El contenido real de la versión JA y su etiqueta de idioma son una necesidad lingüística, no decoración.
- Servicios y proceso conservan la composición editorial aprobada, sin cards, iconos, pills, ilustraciones, números gigantes o timeline; información y arquitectura conservadas.
- Email protagonista; WhatsApp alternativa secundaria. Cada dato tiene un control de icono para copiar, discreto y con nombre accesible. GitHub sólo en Ramiro. Datos canónicos en CONTENT.md.
- Residencias usa capturas reales desktop + mobile como evidencia complementaria, con tamaño suficiente, sin mockups y con captions factuales. Tratamiento aprobado; `SCREENSHOT_SELECTION = DEFERRED_TO_IMPLEMENTATION`. El par actual no está congelado y probablemente se reemplazará en H6 por capturas de la misma versión vigente, sin residentes identificables ni cambios de claims.

Iteración comparativa: prototypes/v2-h4/v2/. La anterior se conserva intacta. Copy ES/EN/PT/FR/JA y sistema visual aprobados; par exacto de capturas y comportamiento técnico pendientes de H6/H5. Estas decisiones actualizan sólo los puntos indicados de H3, sin reabrir H1/H2/H3. Los wireframes H3 se conservan como evidencia previa: sus tres columnas y ausencia de WhatsApp no gobiernan H4. Los valores del archivo V1 siguen siendo antecedentes.

Iteración 3 posterior: el Hero muestra estáticamente la estructura «presentar tu [palabra]», con «proyecto» como estado y fallback; la secuencia aprobada empieza por «servicio». La palabra se distingue mediante accent, peso y una regla inferior fina, sin pill, caja ni badge. El texto completo sigue comprensible sin animación; movimiento y sincronización accesible pertenecen a H5. El menú incorpora cinco idiomas; Instrument Sans no cubre japonés y JA usa Noto Sans JP sólo donde hacen falta glifos japoneses. Servicios conserva sus tres ofertas y el pasaje de capacidades condicionadas al alcance. El contacto sitúa iconos de copia junto a email y teléfono. La nota sobre idioma hablado sólo corresponde a versiones no españolas, al final de About. Composición estática aprobada.

Cobertura JA comprobada sobre `prototypes/v2-h4/assets/InstrumentSans.ttf`: las tablas `cmap` no incluyen los caracteres de muestra 日、本、語、あ、ポ. Noto Sans JP queda fijada como fallback JA, autoalojada y con licencia OFL; Instrument Sans permanece primero para latín. La revisión H4 usa una copia local genérica de peso 400 sólo en especímenes. Para producción H6 deberá preparar WOFF2 con cobertura del corpus JA aprobado y pesos 400/600, con `font-display: swap`, sin cargar JA en ES/EN/PT/FR. Alternativas de sistema: `Hiragino Kaku Gothic ProN`, `Yu Gothic`, `Meiryo`, `sans-serif`. Mantener `line-height` JA suficiente (Hero ≥1.2, párrafos ≥1.6), `line-break: strict` y protección contra overflow, sin cortes forzados. Revisar navegación, Hero, botones, captions, disclosure, zoom y ritmo vertical a 320 px y desktop tras la aprobación final de traducciones.

### Contrato de Menú/Aspecto para H5

El panel de preferencias permanece abierto al elegir Light/Dark o cualquiera de los accents: la selección se aplica inmediatamente y se pueden probar combinaciones consecutivas. Se cierra al navegar a una sección, al cambiar de idioma y ejecutar esa navegación, al pulsar Escape, al tocar/hacer click fuera o al accionar de nuevo el trigger Menú/Aspecto. El cierre por navegación mantiene el destino y foco previstos; Escape devuelve foco al trigger y el click fuera no roba foco del destino. Mover el foco con Tab por sí solo no cierra el panel. Esta regla posterior sustituye el cierre automático por salida de foco descrito en H3. H4 registra el contrato sin implementarlo.

## INVALIDATE — UX y Hero anteriores

No gobiernan V2: estructura obligatoria Hero/About/Projects/Contact, UX Skeleton H2, Concept A, nombre como H1/protagonista obligatorio, ausencia obligatoria de CTA y H3 como dirección activa.
Hero, jerarquía, navegación y orden quedan sustituidos por el UX aprobado en V2-H3. Las alturas dependen del contenido, sin secciones obligatorias de un viewport.
Los prototipos de `prototypes/h3/` son históricos, no especificación ni producto final; no se modifican en V2-H0.

## Revisión de futuras pantallas

Evaluar comprensión de oferta, confianza, facilidad de contacto, foco, ruido, función de cada interacción, solidez sin motion, legibilidad mobile e integridad del contenido.
Comparar con PRODUCT.md, POSITIONING.md, OFFER.md y la skill. La aprobación visual sigue requiriendo a Ramiro.

## V2-H3 — Commercial UX aprobado — 2026-09-20

Ramiro aprobó el conjunto al solicitar implementar el plan. Alcance documental: sin código, Astro, dependencias, UI implementada ni avance a H4. Las etiquetas y placeholders siguientes expresan función; no son copy final.

### Page model y principios

Single-page comercial por idioma; caso resumido dentro de Home, sin páginas secundarias nuevas. La cantidad real de contenido permite comprender oferta, evidencia y contacto sin fragmentar el recorrido. Futuros casos pueden ampliar evidencia, sin rutas ni espacios reservados ahora.

La oferta lidera y la identidad explica quién responde por la entrega. Información esencial siempre visible, sin acordeones, tabs ni hover obligatorio. Acción comercial principal: iniciar conversación por email, con WhatsApp secundario incorporado en H4. Cada tramo responde una pregunta del cliente; funciona sin styling ni motion. Desktop y mobile mantienen significado y orden general con composición propia.

### Arquitectura de secciones

Cinco secciones: reducir más debilitaría los destinos de navegación sin reducir contenido. Capacidades se integran con Servicios; proceso con Ramiro. Header/footer son auxiliares. Las transiciones surgen de continuidad y proximidad, sin microcopy puente obligatorio.

| Sección | Purpose | Content | Action | Transition | Exclude |
|---|---|---|---|---|---|
| Hero | Identificar oferta, utilidad y prestador | Propuesta, aclaración, Ramiro responsable | Único CTA hacia Contacto | Servicios concreta el encaje | Stack, métricas, visual de caso, título profesional protagonista |
| Servicios | Reconocer necesidad y alcance | Oferta única, tres aplicaciones, capacidades, diseño externo | Sin CTA propio | Caso demuestra aplicación real | Paquetes, precios, productos rígidos, inventario técnico |
| Caso real | Evidencia comprensible | Residencias: contexto, requerimiento, rol, solución, visuales, capacidades, estado | Sin CTA ni link no confirmado | Ramiro explica quién y cómo | Carrusel, resultados inventados, LingoHive, botón deshabilitado |
| Ramiro y forma de trabajo | Confianza profesional | Perfil, trato directo, proceso, freelance | Link discreto a GitHub | Contacto como siguiente paso | CV, biografía larga, proceso autónomo, tech wall |
| Contacto | Iniciar conversación | Invitación, email, WhatsApp secundario, copia, orientación opcional | Email con mailto; WhatsApp alternativo | Footer mínimo | Formulario, calendario, cuestionario obligatorio |

### Hero y estrategia de CTA

Jerarquía: H1 `[VALUE PROPOSITION]` nombra diseño y desarrollo de sitios web y conecta con la necesidad mediante la estructura rotativa y fallback estable de H4; `[SERVICE CLARIFIER]` explica utilidad, prestación personal de Ramiro y posible continuidad posterior acordada; `[PRIMARY CTA → CONTACTO]` cierra el bloque.

Un bloque principal de lectura, sin columna decorativa, foto, caso adelantado ni recurso interactivo. Nombre dentro de la aclaración del prestador, sin competir como segundo titular; identidad `ramita.dev` en header. Tipos de sitio se desarrollan en Servicios; `Full Stack Developer` queda en Ramiro.

Desktop 1440×900: objetivo de mostrar header, propuesta, aclaración y CTA antes del pliegue, pudiendo comenzar Servicios en esa vista. Mobile 390×844: columna única con propuesta, prestación personal y CTA antes del primer scroll a tamaño habitual. Traducciones, zoom o texto ampliado pueden aumentar altura; nunca recortar ni reducir legibilidad para encajar. Sin flechas de scroll ni CTA secundario.

Dos momentos comerciales: invitación del Hero hacia Contacto y email accionable al cierre. Contacto en header es navegación, no otro botón destacado. Sin CTA intermedio en servicios, caso o perfil. En Contacto, el email visible es el enlace principal; no duplicarlo con otro botón mailto. WhatsApp es alternativa secundaria; copia es utilidad y GitHub es respaldo.

### Header y navegación

Header persistente, sin ocultación por dirección de scroll, único sticky. Utilidad: orientación y acceso a contacto durante el caso. Destinos y foco siempre visibles debajo del header.

Desktop/notebook con espacio suficiente:

```text
ramita.dev     Servicios   Caso real   Ramiro   Contacto     ES  EN  PT  FR  JA
```

Identidad al inicio del idioma actual; cuatro destinos internos. Idiomas como enlaces explícitos con nombres accesibles e idioma activo identificado, sin banderas. Sin Preferencias en el alcance base, scrollspy ni indicador de progreso.

Mobile/tablet estrecha: identidad y trigger textual Menú. Despliega debajo de la fila del header un panel no modal con Servicios, Caso real, Ramiro, Contacto y luego grupo Idioma: Español, English, Português, Français, 日本語. Sin pantalla completa ni bloqueo del scroll.

- Trigger comunica estado expandido y relación con el panel. Al abrir, foco permanece en trigger; Tab continúa por enlaces.
- Escape cierra y devuelve foco al trigger. Elegir sección cierra y lleva foco al destino; Tab continúa desde allí.
- El contrato posterior H4 sustituye el cierre por salida de foco: Tab por sí solo no cierra. Toque/click fuera cierra sin robar foco del destino.
- Contenido cerrado no es enfocable. Panel demasiado alto sigue accesible por scroll vertical.
- Cambio de idioma accede a la versión equivalente y conserva fragmento cuando exista, conforme a ARCHITECTURE; la identidad y navegación mantienen idioma actual.
- Sin JavaScript, contenido, email, navegación e idiomas siguen disponibles; la mejora del menú no oculta sus únicos accesos.

Theme/accent confirmados en H4: Aspecto es una utilidad secundaria dentro del menú mobile y un acceso discreto separado de la navegación comercial en desktop. Tratamiento visual aprobado y comportamiento funcional en H5 según el contrato anterior.

### Servicios y capacidades integradas

Introducción de oferta única y tres ítems de lectura, sin cards ni comparación. Cada ítem contiene nombre, necesidad y resultado funcional: institucional presenta actividad/información/contacto; landing organiza propuesta concreta con acción principal; rediseño mejora web existente previa evaluación de intervención o reconstrucción. Sin promesas comerciales ni listas de entregables propias.

La composición inicial de tres columnas abiertas recibió una segunda exploración editorial en H4: tipografía, alineación, espacio y reglas finas. La composición estática resultante quedó aprobada. Ítems no seleccionables, sin botones individuales. Después, párrafo breve de capacidades integradas y mención siempre visible de implementación de diseño externo como complemento, no cuarta oferta equivalente.

Capacidades: adaptación celular/desktop; formularios e integraciones cuando correspondan; SEO técnico y cuidado de performance; preparación/publicación según alcance acordado. Un único pasaje secundario puede mencionar Perfil de Empresa de Google para negocios locales y preparación técnica para buscadores/asistentes de IA, sin promesas de visibilidad y sin convertirlos en nuevas ofertas o piezas visuales. Condición de alcance próxima al contenido, sin inclusión automática. Planificación, UX/UI y diseño se entienden en la oferta y proceso, sin inventario repetido.

### Residencias — caso resumido

Cuatro unidades dentro de una sección:

1. Identificación y necesidad: nombre, tipo institucional, estado `en desarrollo`, contexto y requerimiento Grupo Casa → Casa San Juan / Casa Boedo.
2. Responsabilidad y solución: planificación, diseño visual, arquitectura y desarrollo de Ramiro; contextos diferenciados por residencia.
3. Evidencia: dos figuras reales principales, desktop/mobile, con captions factuales sobre qué demuestran.
4. Capacidades: síntesis de resolución integral, UX/UI, responsive, formularios, SEO técnico y preparación para publicación, según evidencia vigente en PROJECTS.

No ampliar el requerimiento con motivaciones comerciales supuestas ni presentar auditorías históricas como actuales. Estado junto al nombre, antes de imágenes. Puede acompañarse de una acción secundaria discreta «Ver sitio» hacia el deployment público confirmado; no sustituye las figuras ni se presenta como CTA principal. No confundir ese estado con el estado factual de Casa Boedo.

Desktop: contexto/requerimiento y responsabilidad/solución en dos columnas; debajo figura desktop de mayor superficie y mobile adyacente sin superposición, cada una con caption; capacidades cierran. Espacio suficiente para observar decisiones, sin pretender leer una página completa reducida. Encuadres exactos diferidos a H6; no agregar imágenes para completar una grilla.

Mobile: nombre/tipo/estado → necesidad → responsabilidad/solución → figura mobile/caption → figura desktop/caption → capacidades. La mobile permite inspeccionar interfaz; desktop explica estructura general sin depender de textos internos legibles. Sin swipe obligatorio, carrusel, lightbox ni contenido revelado al tocar. Zoom nativo disponible.

### Ramiro y proceso integrado

Dos partes próximas: quién realiza el trabajo (independiente, trato directo, frontend, full stack cuando corresponde, UX/UI y producto) y cómo trabaja. Perfil/proceso pueden ser dos columnas desktop; mobile coloca perfil seguido del proceso compacto, en exploración editorial H4.

Proceso: entender → definir → diseñar → desarrollar → revisar → publicar y comprobar. Etapas breves, sin cards, iconos ni cronograma; H4 puede agruparlas en prosa editorial sin eliminar información. Revisión incluye responsive, accesibilidad y performance. Para diseño externo, diseñar pasa a revisión del material y faltantes acordados. Sin prometer reuniones, fechas o revisiones ilimitadas.

Disponibilidad freelance textual, sin widget online. Título profesional secundario. Único enlace a GitHub como cierre del respaldo; sin foto por defecto.

### Contacto y footer

Jerarquía: `[CONTACT INVITATION]` → `ramirogperucho@gmail.com` visible, seleccionable y con mailto + icono «Copiar email» adyacente → `+54 9 11 5135-4489` enlazado a WhatsApp + icono «Copiar teléfono» adyacente → orientación opcional breve. El email mantiene mayor tamaño y peso. No hay botones textuales independientes de copia ni cuerpo prellenado obligatorio. Sugerir necesidad, objetivo, web existente, referencias y plazo deseado sin convertirlos en requisitos.

Copia incluida para visitantes con webmail o sin cliente configurado. Cada icono requiere target cómodo, nombre accesible y feedback de éxito/error sin mover foco; si falla, mantener selección manual y enlaces. Microinteracción y estados funcionales se resuelven en H5. Activar mailto o WhatsApp no prueba envío. GitHub permanece en Ramiro, sin duplicarse.

Footer: una línea con `ramita.dev` y Ramiro Garcia. Sin nueva navegación, slogan, redes duplicadas, contador, CTA ni volver arriba (identidad del header ya lo permite).

### Wireframe desktop — 1440×900

Segmentos de scroll orientativos, no alturas CSS ni una sección por viewport. Header persiste en todos. El caso puede exceder una vista; Contacto puede comenzar en la misma vista que el final de Ramiro.

Estos wireframes registran la aprobación H3 y conservan sus etiquetas originales como evidencia. Para H4 iteración 3 gobiernan las sustituciones explícitas anteriores: cinco idiomas, estructura variable del Hero, capacidades complementarias y dos iconos de copia adyacentes. No interpretar las etiquetas antiguas como copy o controles finales.

```text
SEGMENTO A — primera vista aproximada
┌─────────────────────────────────────────────────────────────────┐
│ ramita.dev  Servicios  Caso real  Ramiro  Contacto   ES EN PT    │
├─────────────────────────────────────────────────────────────────┤
│ HERO                                                            │
│ [VALUE PROPOSITION — H1]                                         │
│ [SERVICE CLARIFIER + RAMIRO COMO PRESTADOR]                       │
│ [PRIMARY CTA → CONTACTO]                                         │
│                                                                 │
│ SERVICIOS — puede comenzar antes del primer pliegue              │
│ [OFERTA ÚNICA / ENCAJE]                                          │
└──────────────── primer pliegue orientativo ──────────────────────┘

SEGMENTO B — servicios y entrada al caso
  [Institucional]          [Landing]             [Rediseño]
  [necesidad/resultado]    [necesidad/resultado]  [evaluación]
  [CAPACIDADES INTEGRADAS SEGÚN ALCANCE]
  [IMPLEMENTACIÓN DE DISEÑO EXTERNO]

  CASO REAL
  Residencias Grupo Casa · institucional · en desarrollo
  [CONTEXTO + REQUERIMIENTO]       [RESPONSABILIDAD + SOLUCIÓN]

SEGMENTO C — evidencia; puede exceder una vista
  [FIGURA DESKTOP — MAYOR ANCHO]   [FIGURA MOBILE]
  [CAPTION]                       [CAPTION]
  [CAPACIDADES DEMOSTRADAS]

SEGMENTO D — confianza y siguiente paso
  RAMIRO Y FORMA DE TRABAJO
  [PERFIL BREVE]                  [PROCESO BREVE]
  [FREELANCE / LINK GITHUB]

  CONTACTO
  [CONTACT INVITATION]
  ramirogperucho@gmail.com  [COPIAR EMAIL]
  [ORIENTACIÓN OPCIONAL]

  ramita.dev · Ramiro Garcia
```

### Wireframe mobile — 390×844

Menú inicialmente cerrado. Separación entre secciones mayor que entre elementos relacionados; captura/caption próximos. Email puede partir visualmente conservando dirección completa al copiar. Segmentos B–E no equivalen a una pantalla cada uno.

```text
SEGMENTO A — primera vista aproximada
┌───────────────────────────────────┐
│ ramita.dev                 [Menú] │
├───────────────────────────────────┤
│ [VALUE PROPOSITION — H1]          │
│                                   │
│ [SERVICE CLARIFIER]               │
│ [RAMIRO COMO PRESTADOR]           │
│                                   │
│ [PRIMARY CTA → CONTACTO]          │
│                                   │
│ [INICIO DE SERVICIOS SI CABE]     │
└──── primer pliegue orientativo ───┘

SEGMENTO B — servicios
  [OFERTA ÚNICA]
  [Institucional: necesidad]
  [Landing: necesidad]
  [Rediseño: evaluación]
  [CAPACIDADES SEGÚN ALCANCE]
  [DISEÑO EXTERNO]

SEGMENTO C — caso en scroll continuo
  Residencias Grupo Casa
  Institucional · en desarrollo
  [CONTEXTO + REQUERIMIENTO]
  [RESPONSABILIDAD + SOLUCIÓN]

  [FIGURA MOBILE]
  [CAPTION]

  [FIGURA DESKTOP]
  [CAPTION]
  [CAPACIDADES DEMOSTRADAS]

SEGMENTO D — persona y proceso
  [RAMIRO / PERFIL BREVE]
  [PROCESO EN SECUENCIA VERTICAL]
  [FREELANCE] [GITHUB]

SEGMENTO E — cierre
  [CONTACT INVITATION]
  ramirogperucho@gmail.com
  [COPIAR EMAIL]
  [FEEDBACK CUANDO CORRESPONDA]
  [ORIENTACIÓN OPCIONAL]

  ramita.dev · Ramiro Garcia
```

### Responsive y scroll

| Rango conceptual | Comportamiento |
|---|---|
| Wide desktop | Ancho de lectura contenido; espacio lateral sin escalar indefinidamente texto/imágenes; servicios en exploración editorial H4 y figuras adyacentes |
| Notebook | Reducir espacios antes que legibilidad; apilar textos/figuras si el paralelo deja de funcionar |
| Tablet | Menú compacto cuando enlaces/idiomas no quepan; servicios, caso y perfil apilados |
| Mobile | Columna única, figura mobile primero, email/copia apilados, targets amplios, header compacto |

Breakpoints según espacio real del contenido, cinco idiomas (incluido JA) y texto ampliado; sin valores CSS definitivos ni conversión automática de rangos de QA. Respetar safe areas y viewport dinámico.

Scroll nativo sin hijacking ni snap obligatorio. Header como único sticky, sin caso fijado, columnas sticky, CTA flotante o progreso decorativo. No se define animación de desplazamiento; un tratamiento futuro respeta reduced motion. Contenido visible sin esperar eventos de scroll.

### Interacciones y accesibilidad

REQUIRED: identidad/inicio, navegación a cuatro secciones, CTA a Contacto, email y teléfono enlazados con iconos de copia accesibles y feedback en la implementación final, menú accesible, cinco idiomas equivalentes con fragmento cuando exista, visuales legibles sin interacción y zoom nativo. OPTIONAL: ninguna en el alcance base.

DEFER: implementación de theme/accent a H5; link del caso hasta deployment verificado. Fuera de la propuesta: galería, lightbox, carrusel, scrollspy, progreso decorativo, cursor personalizado, parallax, reveals obligatorios y agrupador Preferencias heredado.

- Landmarks header/nav/main/footer; H1 de oferta, H2 de secciones siguientes, H3 sólo en subdivisiones reales; skip link a main.
- Orden de foco coherente, foco visible sin ocultación por header, continuación desde destino al navegar; controles ocultos no enfocables.
- Menú con nombre accesible y estado expandido/relación con panel, sin roles de menú de aplicación.
- Idiomas por nombres accesibles, sin banderas, actual comunicado.
- Objetivo de targets táctiles de al menos 44×44 píxeles CSS.
- Copia anunciada sin mover foco ni depender sólo de color; mailto y selección manual siempre útiles.
- Alternativas textuales de figuras describen evidencia; hechos esenciales fuera de screenshots.
- Sin pérdida por zoom, texto ampliado o anchos estrechos; reduced motion conserva información y acciones.
- Sin JavaScript: contenido, email, navegación e idiomas disponibles mediante mejora progresiva.

ARCHITECTURE conserva matriz de browsers y rangos de QA. No se diseñan CSS ni motion final en este hito.

### Comprobación comercial y auditoría guardian

Evaluación conceptual, no prueba con usuarios reales:

- Negocio sin web: oferta y prestador en Hero → encaje institucional → Residencias como evidencia → CTA/header hacia email. Comprende encaje, evidencia y siguiente paso.
- Profesional con web vieja: rediseño con evaluación previa → caso como evidencia de estructura/responsive, sin atribuirle rediseño → contacto con web existente opcional. Sin promesa de reutilización, rankings o conservación automática.
- Cliente con diseño externo: complemento visible → frontend y proceso adaptado → evidencia de implementación en Residencias → email/referencias opcionales. Límite: no hay caso específico de colaboración con diseñador externo en V1; no añadir LingoHive para compensar.

Keep: oferta, evidencia real, trato directo, contacto y navegación útil. Remove: bento, card wall, fake terminal, HUD, glassmorphism gratuito, stats, tech badges, skill bars, navegador falso, CTA repetitivo, scroll gimmicks y decoración sin función. Change: reemplazar listas técnicas extensas por contexto y recortar microcopy redundante. Risk: caso demasiado largo, capturas ilegibles, header dominante o proceso autónomo. Verdict: APPROVE para UX documental aprobado por Ramiro; no es aprobación visual ni QA de una UI implementada.

### Handoff y validación posterior

H4 recibe cerrados modelo single-page, cinco secciones/orden, jerarquía conceptual del Hero, acciones, navegación persistente/menú, servicios integrados, caso de cuatro unidades/dos figuras, perfil/proceso, contacto, ubicación de GitHub e intención responsive/accesible.

Tras las decisiones H4, el copy de cinco idiomas, composición estática, paleta exacta y tratamiento de imágenes están aprobados. Los encuadres exactos de Residencias se difieren a H6; motion e implementación técnica a hitos posteriores. No reabrir arquitectura/acciones por herencia V1.

Validación documental de H3: recorrer ambos wireframes, comprobar los tres perfiles y contrastar contenidos con OFFER/PROJECTS. Validación futura de implementación: teclado/touch, apertura/cierre del menú y sus rutas de foco, anclas no ocultas, idiomas/fragments, copia exitosa/fallida, mailto, reflow, zoom, sin JS y reduced motion, según rangos/browsers de ARCHITECTURE. Sin builds ni QA visual en este cierre documental.

# Archivo V1 — sin autoridad sobre V2

El texto siguiente conserva decisiones y formulaciones históricas. Toda referencia a “aprobado”, “debe”, “pendiente” o a hitos sin prefijo V2 describe únicamente V1.
Las obligaciones activas son las de las secciones V2 anteriores y los documentos superiores. No continuar estos hitos ni tomar el copy conceptual como aprobado.

## V1 histórico — Dirección

Nombre interno: **Quiet Interactive**.

La experiencia debe sentirse:

- minimalista;
- precisa;
- silenciosa;
- premium;
- fluida;
- interactiva;
- humana;
- deliberada.

No debe sentirse:

- como un dashboard;
- como una terminal/HUD;
- como una plantilla SaaS;
- como un clon de Awwwards;
- como un portfolio “obviamente hecho por IA”.

## V1 histórico — Principio de composición

**Una idea principal por viewport.**

Evitar mostrar simultáneamente demasiados mensajes, tarjetas, métricas, etiquetas o microdatos.

Objetivo orientativo: no más de 3–4 focos visuales claros en una pantalla.

## V1 histórico — Flujo UX aprobado en H2

Hero -> About -> Projects -> Contact mediante scroll nativo. Sin scroll snap ni
scroll hijacking. El Hero ocupa aproximadamente el primer viewport; About es
breve; cada proyecto ocupa un tramo editorial propio; Contact cierra el recorrido.
La continuidad se construye con jerarquía, alineación y espacio, sin depender de
motion. El header permite saltar directamente a las tres secciones posteriores.

## V1 histórico — Hero

- Aproximadamente 90–100svh.
- Header flotante pequeño.
- Tipografía como protagonista.
- Presentación clara de Ramiro.
- Un único recurso interactivo/gráfico principal como máximo.
- No avatar/foto obligatoria.
- No nube de tecnologías.
- No métricas.
- No carrusel.
- No múltiples CTAs compitiendo.

Jerarquía inicial: `Ramiro Garcia` como H1, `Full Stack Developer` asociado y
una línea breve sólo cuando se apruebe el copy (`TODO_CONTENT`). No hay CTA
principal: la navegación y el scroll dan acceso al resto. Al bajar, Hero sale
con el scroll natural y About toma el foco.

La composición debe funcionar incluso si todo el motion se desactiva.

## V1 histórico — About

Debe sentirse como una continuación/transición del Hero, no como una tarjeta separada.

Concepto de contenido previsto:

> Frontend at heart. Full stack when needed.

El copy final todavía no está aprobado.

Máximo unas pocas líneas de texto principal. Las tecnologías, si aparecen, deben integrarse con contexto, no como colección de badges.

Jerarquía H2: primero frontend como preferencia y capacidad full stack; luego,
en una línea de apoyo, interés en UX/UI y producto, IA como herramienta y
prioridad por interfaces limpias, responsive y funcionales. Sin tech wall,
estadísticas, timeline ni CV resumido. El copy público sigue pendiente.

## V1 histórico — Projects

Los proyectos son el principal espacio visual.

Reglas:

- priorizar calidad sobre cantidad;
- uno por viewport o una composición equivalente;
- screenshots/assets reales;
- evitar una grilla estándar de seis cards;
- permitir que cada proyecto tenga identidad visual propia sin romper el sistema;
- mostrar sólo información comprobada;
- no inventar resultados o impacto.

Recorrido editorial: un proyecto protagonista por tramo de scroll, con visual
real grande y contexto visible. La misma estructura sirve para 1, 2 o más
proyectos; nunca se rellena el espacio con candidatos ficticios ni se agrega un
carrusel. Cada entrada requiere nombre, tipo, rol real, resumen y visual real.
Tecnologías sólo si aclaran la contribución; link o case study sólo si existe y
está aprobado. Ningún contenido esencial queda oculto tras hover. La elección
de `PRIMARY V1 PROJECT` y la inclusión de LingoHive se resuelven más adelante.

Hover/pointer puede aportar profundidad, desplazamiento, reveal o scale muy sutil. En touch debe existir una experiencia equivalente y limpia.

## V1 histórico — Contact

Extremadamente simple.

Contenido previsto:
- frase principal;
- email;
- GitHub;
- disponibilidad freelance;
- acción secundaria “Copiar email”.

El email visible con `mailto:` es la acción principal. Copiar email comunica
éxito o error sin depender sólo de color; ante un fallo el email sigue visible
y utilizable. El copy de la frase principal sigue pendiente.

No formulario en V1 salvo decisión explícita.

## V1 histórico — Footer

No es una quinta sección. Es chrome/estructura auxiliar al final de Contact y debe mantener una presencia mínima.

Puede reutilizar únicamente información ya presente o derivada directamente del producto, por ejemplo copyright/`ramita.dev` y enlaces de contacto existentes.

No debe introducir una nueva categoría de contenido, navegación secundaria extensa, métricas, slogans adicionales ni información no aprobada.

## V1 histórico — Header

Flotante, compacto y de baja dominancia visual.

Debe dar acceso a:
- identidad/home;
- Work/Projects;
- About;
- Contact;
- idioma;
- theme;
- accent.

En desktop/notebook: identidad `ramita.dev`, enlaces directos a About, Projects
y Contact, y un trigger Preferencias que agrupa idioma, theme y accent. El header
permanece accesible durante el scroll y los saltos dejan visibles los títulos.

En mobile/tablet estrecha: identidad y trigger Menú. El panel presenta primero
la navegación y después idioma, theme y accent. Los paneles no son modales ni
dependen de hover.

## V1 histórico — Theme y accent

El theme define fondo, superficies y contraste general.

El accent se usa con moderación en:
- palabra o detalle destacado;
- underline;
- hover;
- focus;
- cursor/indicador si existe;
- selección;
- algunos bordes;
- botones;
- recurso gráfico principal.

Nunca debe “pintar toda la web”.

Accent se expande dentro de Preferencias/Menú. Seleccionar un color lo aplica de
inmediato sin cerrar el selector. Cambiar theme con Accent abierto mantiene el
selector abierto y muestra las opciones del nuevo theme, con su elección
recordada o su default. Los valores visuales y defaults de los colores se
registran abajo.

### V1 histórico — Base visual aprobada en H3

- Familia tipográfica: **Instrument Sans** variable, sin familia secundaria. La
  escala final del Hero continúa en revisión compositiva; no se fija aquí.
- Neutrales carbón/papel apenas cálidos. Dark sigue siendo el theme inicial.
- Accents iniciales: naranja en dark y azul en light. Cada theme recuerda su
  elección por separado según el comportamiento aprobado en H2.

| Uso | Dark | Light |
|---|---|---|
| Background | `#171816` | `#F5F4F0` |
| Surface restringida a header/paneles/soporte de imagen | `#232522` | `#EDEEE9` |
| Texto principal | `#F1F0EC` | `#202421` |
| Texto secundario | `#AAAFA9` | `#555B55` |
| Divisor decorativo | `#3B3F3A` | `#C9CDC5` |
| Borde funcional | `#6B716A` | `#838981` |

| Accent dark | Valor | Accent light | Valor |
|---|---|---|---|
| Naranja (default) | `#FF9B58` | Azul (default) | `#1C57BE` |
| Celeste | `#78CFFC` | Verde oscuro | `#176844` |
| Fucsia | `#F58ACD` | Rojo | `#B23B35` |
| Verde lima | `#C4E773` | Violeta | `#6D42AA` |
| Blanco | `#F1F0EC` | Negro | `#202421` |

El accent aparece en underlines, foco, selección y estados de controles o
enlaces. No modifica el background general ni recolorea los assets de proyectos.
Los estados seleccionados también se distinguen por forma o marca. El sistema
de paleta, tipografía y accents está aprobado; la composición final del Hero
estático y el cierre de H3 siguen pendientes.

## V1 histórico — Wireframes conceptuales H2

Cada fila de sección representa una pantalla conceptual distinta; no se muestran
todas a la vez. Son estructura, no styling ni copy final.

```text
DESKTOP
Hero       [ramita.dev]   About  Projects  Contact   [Preferencias]
           Ramiro Garcia / Full Stack Developer / [TODO_CONTENT]
About      [perfil breve: frontend, full stack, UX/UI, producto, IA]
Projects   [VISUAL REAL GRANDE]   [nombre, tipo, rol, resumen, link si aplica]
Contact    [freelance]   email [Copiar email]   GitHub   [footer mínimo]

MOBILE
Hero       [ramita.dev] [Menú]
           Ramiro Garcia / Full Stack Developer / [TODO_CONTENT]
About      [perfil breve en lectura vertical]
Projects   [VISUAL REAL GRANDE]
           [nombre, tipo, rol, resumen, link si aplica]
Contact    [freelance] / email / [Copiar email] / GitHub / [footer mínimo]
```

## V1 histórico — Responsive UX aprobado en H2

- Mobile: lectura vertical, visual del proyecto antes del contexto, email fácil
  de tocar, Menú compacto y scroll touch nativo. Sin efectos esenciales de hover
  ni seguimiento de cursor.
- Tablet: navegación compacta cuando los enlaces no quepan cómodamente; visual
  dominante y contexto apilable para evitar columnas estrechas.
- Notebook: navegación directa y Preferencias agrupadas; visual y contexto
  próximos sin sacrificar legibilidad para sostener una composición amplia.
- Desktop amplio: más espacio negativo y visual protagonista, sin estirar el
  contenido indefinidamente.

Los rangos de QA de `ARCHITECTURE.md` no imponen breakpoints de diseño. En todos
los tamaños deben respetarse safe areas, viewport dinámico, foco y targets
táctiles cómodos. Con reduced motion, el orden y la jerarquía no cambian.

## V1 histórico — Motion

Motion debe cumplir al menos una función:

1. revelar;
2. orientar;
3. dar feedback;
4. transformar jerarquía/composición;
5. aportar carácter de manera contenida.

Eliminar motion puramente ornamental si compite con el contenido.

Evitar usar en todas las secciones el mismo patrón:
`opacity 0 -> 1 + translateY`.

Preferir:
- máscaras;
- transformaciones continuas;
- reordenamiento;
- interpolaciones suaves;
- scroll-linked motion moderado;
- microinteracciones específicas.

### V1 histórico — Reduced motion

Con `prefers-reduced-motion: reduce`:

- desactivar parallax relevante;
- eliminar seguimientos del cursor;
- reducir desplazamientos;
- mantener información y jerarquía intactas;
- evitar animaciones esenciales para entender contenido.

## V1 histórico — Pointer

Desktop puede tener interacciones ligadas al mouse/cursor.

No crear un custom cursor si no aporta valor real.

Nunca ocultar información sólo accesible vía hover.

## V1 histórico — Mobile

Diseño específico, no shrink de desktop.

- evitar efectos que dependan de mouse;
- targets táctiles cómodos;
- tipografía fuerte sin overflow;
- proyectos visualmente protagonistas;
- header adaptado;
- motion más simple;
- respetar safe areas y viewport dinámico.

## V1 histórico — Anti-patterns

No usar por defecto:

- bento grids;
- glassmorphism;
- blobs;
- gradients decorativos;
- glow/neón generalizado;
- cards para todo;
- pills para toda metadata;
- métricas tipo “50+ projects”;
- coordenadas;
- “STATUS: ONLINE”;
- HUD;
- terminal falsa;
- barras de progreso decorativas;
- testimonios inventados;
- texto minúsculo decorativo;
- frases genéricas de IA;
- múltiples objetos 3D;
- partículas de fondo;
- scroll hijacking.

Cualquiera puede usarse sólo si existe una justificación concreta aprobada.

## V1 histórico — Regla de revisión

Antes de cerrar una pantalla, preguntar:

- ¿Cuál es su foco principal?
- ¿Hay algo que pueda eliminarse sin perder significado?
- ¿La interacción tiene función?
- ¿Sigue funcionando sin motion?
- ¿Se entiende en móvil?
- ¿Parece una decisión propia o un patrón genérico?
