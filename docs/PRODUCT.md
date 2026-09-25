# PRODUCT.md — ramita.dev V2

## Producto activo

**V2 Commercial Personal Website**: sitio comercial personal de Ramiro Garcia para vender servicios de diseño y desarrollo web, con portfolio/casos como evidencia.

Dominio: `ramita.dev`. Ramiro es quien presta el servicio; identidad personal y primera persona singular.

## Objetivo y prioridades

Generar consultas de potenciales clientes que necesiten una web y cuyo proyecto encaje con la oferta.

1. Vender servicios web.
2. Generar confianza.
3. Demostrar capacidad con trabajos reales.
4. Presentar al profesional.

El visitante no necesita conocer tecnologías. La comunicación prioriza lo que Ramiro puede resolver; no promete resultados comerciales ni adopta tono de falsa agencia. No convertir el sitio en una landing agresiva llena de CTAs.

## Responsabilidades documentales

| Documento | Propósito y fuente de verdad |
|---|---|
| AGENTS.md | Autoridad, reglas y flujo de trabajo de agentes. |
| PRODUCT.md | Definición, objetivo, prioridades, alcance y arquitectura de información aprobada. |
| POSITIONING.md | Audiencia, mercado, propuesta de valor, diferenciación y tono. |
| OFFER.md | Oferta, capacidades integradas, complementos, exclusiones y compromisos. |
| PROJECTS.md | Hechos, autoría, permisos, auditorías, estados y límites de claims de proyectos. |
| CONTENT.md | Identidad/contacto canónicos, expresión pública aprobada, traducciones y assets seleccionados. |
| DESIGN.md | Jerarquía, layouts, controles, responsive, tokens y motion aprobados; antecedentes separados. |
| ARCHITECTURE.md | Stack, rutas, i18n técnico, persistencia, SEO técnico, hosting y compatibilidad. |
| ROADMAP.md | Hitos, entregables, estados y condiciones de cierre. |
| DONE.md | Criterios de aceptación comercial, funcional, visual, accesible y técnica del release. |
| DECISIONS.md | Historial y motivo de decisiones con referencia a la especificación vigente. |

## Alcance confirmado

- Oferta y límites en OFFER.md; mercado, audiencia y posicionamiento en POSITIONING.md.
- Denominación conceptual principal: diseño y desarrollo de sitios web. La oferta conecta definición, diseño e implementación con un único interlocutor responsable de la entrega acordada; cada encargo define su alcance.
- El proceso conceptual aprobado es entender, definir, diseñar, desarrollar, revisar, publicar y comprobar. V2-H2 lo integra brevemente con la presentación profesional; no es copy público final ni exige un bloque visual propio. No implica que el servicio termine necesariamente al publicar; una continuidad posterior puede acordarse.
- Email como contacto principal y WhatsApp como alternativa secundaria. Un icono de copia junto a cada dato permite copiar email o teléfono, con nombre accesible; no hay botón textual independiente. GitHub queda en Ramiro. Datos canónicos en CONTENT.md.
- Proyectos reales como evidencia: Residencias Grupo Casa es el caso actualmente implementado; H6 incorporará LingoHive cuando su demo externa esté sanitizada y desplegada. No mostrar placeholder antes de contar con evidencia real.
- Presentación profesional breve subordinada a confianza y venta; no CV.
- ES / EN / PT / FR / JA con paridad de contenido y traducciones revisadas; español es la fuente. La versión no española incluye una aclaración discreta sobre la comunicación de Ramiro. No afirmar fluidez oral.
- Sin LinkedIn, CV descargable, empleo actual ni sonido.
- Foto personal no requerida de partida; no incorporar una por defecto.

## Arquitectura de contenido aprobada en V2-H2

El recorrido conceptual mínimo es:

1. oferta y orientación inicial;
2. encaje y alcance del servicio;
3. evidencia real;
4. Ramiro y forma de trabajo;
5. inicio de contacto.

Este orden responde primero qué puede resolver Ramiro, después permite reconocer si el encargo encaja, aporta evidencia, explica quién realizará el trabajo y termina facilitando el contacto. H2 aprobó el recorrido conceptual; H3 concreta su UX abajo, sin imponer cantidad de pantallas.

El Hero deberá comunicar como contenido primario la oferta de diseño y desarrollo de sitios web, el resultado general para el cliente, que el servicio lo presta Ramiro y una acción para iniciar una conversación. V2-H4 adopta la estructura conceptual «Diseño y desarrollo de sitios web para presentar tu [palabra variable]», con secuencia y fallback en CONTENT.md; el movimiento se define en H5. La colaboración puede llegar a la puesta online y continuar luego por acuerdo, sin promesa automática de mantenimiento. No deben dominar el Hero el stack, el proceso completo, métricas, detalles de casos ni el título `Full Stack Developer` aislado de la oferta.

La oferta se explica como un único servicio aplicado principalmente a sitios institucionales, landing pages y rediseños. El proceso aprobado aparece de forma breve e integrada con la presentación profesional; no constituye por sí mismo un bloque obligatorio.

Residencias Grupo Casa es el caso ya implementado. Se presenta como resumen dentro del recorrido comercial principal y puede publicarse mientras continúe en desarrollo si ese estado se declara claramente. Su deployment público está confirmado en <https://residenciasgrupocasa.com.ar/> y admite la acción secundaria «Ver sitio». H6 incorporará LingoHive después de preparar externamente una demo sanitizada y desplegada, confirmar permisos y aprobar contenido y capturas reales. La sección Proyectos final debe incluir ambos casos antes de cerrar H6; no reservar un placeholder público durante la preparación.

El footer seguirá siendo soporte mínimo, sin añadir categorías o navegación no aprobadas.

## Arquitectura UX aprobada en V2-H3

Single-page comercial por idioma, sin páginas secundarias nuevas. Orden: Hero → Servicios → Proyectos → Ramiro y forma de trabajo → Contacto. Header y footer son estructura auxiliar. Capacidades integradas pertenecen a Servicios; el proceso permanece dentro de Ramiro. Proyectos incluye Residencias y, al completar H6, LingoHive sin espacios reservados durante su preparación.

El Hero prioriza oferta, utilidad y prestación personal, con un único CTA hacia Contacto. El header persistente permite acceder a Servicios, Proyectos, Ramiro y Contacto; la identidad vuelve al inicio del idioma actual. El email visible en Contacto es la acción `mailto:`, con WhatsApp secundario y un control de copia discreto junto a cada dato. GitHub aparece una sola vez como respaldo en Ramiro.

Residencias se explica mediante cuatro unidades: identificación/necesidad, responsabilidad/solución, dos figuras reales desktop/mobile y capacidades demostradas. El estado `en desarrollo` sigue visible junto al nombre; puede acompañarse de una acción secundaria «Ver sitio» hacia el deployment público confirmado. No hay página de caso, carrusel ni lightbox.

La longitud responde al contenido, con scroll nativo y header como único sticky. DESIGN.md gobierna wireframes, navegación, responsive, estados de foco/touch y accesibilidad aprobados. Esta aprobación no fija copy, screenshots exactos ni sistema visual y no inicia V2-H4.

## Diseño a revalidar

V2-H4, 2026-09-21: **Sistema visual APPROVED**. Claridad editorial evoluciona Quiet Interactive con inspiración japonesa exclusivamente compositiva. **Light es el theme predeterminado global**, con accent verde profundo (`#176844`) y azul alternativo; dark sigue disponible con naranja como accent predeterminado. Los diez accents actuales y Aspecto discreto están aprobados; valores en DESIGN.md. Instrument Sans sigue como base latina y Noto Sans JP cubre japonés. Copy ES/EN/PT/FR/JA y composición estática aprobados. H4 CLOSED; comportamiento funcional de preferencias en H5.

## Fuera de alcance inicial

- Blog, CMS, login, dashboard y newsletter.
- Testimonios, sección independiente de tecnologías y timeline profesional.
- Precios públicos, paquetes y tiempos de entrega inventados.
- Formulario y calendario propios: posibilidades futuras, no incorporarlos ahora. WhatsApp secundario está confirmado en H4.
- Analytics sin decisión explícita.
- Servicios no confirmados en OFFER.md.

## Antecedentes V1 invalidados

El objetivo rector recruiter/CV, las cuatro áreas obligatorias Hero/About/Projects/Contact, el UX Skeleton H2, Concept A, el nombre como protagonista obligatorio, la ausencia obligatoria de CTA y H3 como dirección activa quedan **INVALIDATE**.
Su historia se conserva en DECISIONS.md, DESIGN.md y ROADMAP.md. Ningún cierre V1 cierra un hito V2.
