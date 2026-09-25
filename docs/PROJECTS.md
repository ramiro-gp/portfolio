# PROJECTS.md — ramita.dev V2

## Purpose

Centralizar información verificada sobre proyectos que pueden servir como evidencia comercial en `ramita.dev`.

Este documento es la fuente de verdad para:
- hechos comprobados;
- autoría;
- permisos;
- valor de cada proyecto;
- riesgos;
- estado de publicación;
- posibles claims.

No define todavía el diseño final de los case studies. CONTENT.md referencia la expresión pública aprobada, sin duplicar este registro factual.

## Vigencia de la evidencia

Las auditorías técnicas describen la versión observada entonces; V2-H0 no repite builds, verificaciones públicas ni auditorías de los proyectos.
Los permisos confirmados se conservan. Antes de publicar se verifica el estado y la vigencia de assets/claims.
Las etiquetas V1 siguientes son resultados históricos, no decisiones de inclusión en V2.

# Project A — Residencias Grupo Casa

## Candidate status

Estado V2: **SELECTED — H6 CASE 1**.

V2-H2 seleccionó Residencias Grupo Casa como único caso público inicial; la decisión posterior de H6 añade LingoHive como segundo caso. Residencias se presenta como case study resumido dentro del recorrido comercial principal, sin página dedicada. Puede publicarse mientras siga en desarrollo si ese estado se declara claramente. El deployment público navegable está confirmado y puede enlazarse con una acción secundaria «Ver sitio».

Evaluación histórica V1 preservada: **STRONG V1 CANDIDATE**. La designación histórica `PRIMARY V1 PROJECT` no llegó a confirmarse durante V1.

## Client

Propietarios de **Residencias Grupo Casa**.

## Product

Sitio institucional de Residencias Grupo Casa.

Arquitectura solicitada por el cliente:

**Grupo Casa → Casa San Juan / Casa Boedo**

Estados confirmados:
- Casa San Juan: operativa.
- Casa Boedo: `Próximamente`.

Dominio registrado:

`https://residenciasgrupocasa.com.ar`

Estado actual:
- proyecto todavía en desarrollo;
- deployment público navegable confirmado: <https://residenciasgrupocasa.com.ar/>;
- en la auditoría el working tree tenía cambios sin commit por el desarrollo en curso;
- URL pública autorizada para enlazar desde ramita.dev: <https://residenciasgrupocasa.com.ar/>.

Par visual final aprobado por Ramiro en H6.B: captura de la página Casa San Juan en desktop, 1440 × 900, y de la Home en mobile, sección «Nuestras residencias», 390 × 844. Los derivados públicos `public/images/residencias-desktop.webp` y `public/images/residencias-mobile.webp` pesan 110.488 y 40.126 B respectivamente. Ambas son capturas reales del deployment vigente, complementarias y sin residentes identificables. El desktop muestra la sede y su espacio exterior; el mobile muestra la presentación de Casa San Juan dentro del conjunto. No atribuir a la captura desktop una presentación de Casa Boedo. Originales aprobados y comparación con los PNG anteriores: `qa/h6-residencias-candidates.md`.

## Ramiro's role

Ramiro realizó y dirigió:
- idea y planificación;
- desarrollo integral;
- implementación frontend;
- UX/UI implementation;
- arquitectura técnica;
- responsive;
- SEO;
- JSON-LD;
- formularios;
- deployment/hosting;
- optimizaciones de performance.

Utilizó Codex/IA como herramienta de trabajo bajo su dirección.

No participó un diseñador externo.

Descripción de rol registrada históricamente (no copy final V2):
`Development, UX/UI implementation, technical architecture, SEO & deployment`.

## Design

Ramiro definió el diseño visual.

La identidad de cada residencia se inspiró en colores e identidades preexistentes de cada sede.

El único requerimiento estructural original confirmado por el cliente fue:

`Grupo Casa → Casa San Juan / Casa Boedo`

## Content

Parte del contenido:
- fue tomado/adaptado desde Instagram;
- parte fue redactado por Ramiro.

No atribuir a Ramiro autoría total del contenido editorial.

## Verified stack

- Astro
- Tailwind CSS
- TypeScript
- pnpm
- Sharp / astro:assets
- Web3Forms
- hCaptcha
- Google Maps
- JSON-LD
- JavaScript nativo

No existe:
- backend propio;
- base de datos;
- framework cliente hidratado;
- analytics en la versión auditada.

## Verified architecture

- sitio estático;
- múltiples páginas;
- Home institucional;
- micrositio/contexto Casa San Juan;
- micrositio/contexto Casa Boedo;
- configuración y contenido tipado;
- themes por sede;
- imágenes responsive;
- layouts compartidos;
- formulario externo;
- SEO estructurado.

## Technical evidence

Auditoría realizada:
- `astro check`: 0 errores, 0 warnings, 0 hints;
- build exitoso;
- smoke test local correcto;
- responsive auditado;
- menú mobile operable;
- galería accesible;
- formularios con estados accesibles;
- `prefers-reduced-motion` contemplado.

En la auditoría existían vulnerabilidades de dependencias pendientes de tratamiento futuro.

No afirmar que siguen vigentes sin una auditoría actualizada.

## Commercial value as evidence

Este proyecto puede demostrar que Ramiro puede:
- recibir un requerimiento de negocio;
- definir una solución;
- crear arquitectura web;
- diseñar;
- desarrollar;
- resolver responsive;
- implementar SEO técnico;
- trabajar con structured data;
- integrar formularios;
- trabajar con mapas y canales de contacto;
- optimizar imágenes;
- preparar hosting/deployment;
- manejar estados distintos de una marca con varias sedes.

Es especialmente útil como evidencia de un proyecto web integral.
No hay métricas comerciales ni resultados verificables registrados que puedan afirmarse.

## Portfolio asset permissions

Confirmado:
- se puede mencionar Residencias Grupo Casa;
- se puede mencionar Casa San Juan;
- se puede mencionar Casa Boedo;
- se pueden mostrar screenshots;
- se pueden usar logos;
- se pueden usar fotografías.

Preferencia:

**evitar fotografías de residentes identificables salvo necesidad concreta y decisión explícita posterior.**

Priorizar:
- UI;
- Home;
- responsive;
- Casa San Juan;
- Casa Boedo;
- formularios;
- arquitectura visual;
- screenshots de desktop/mobile.

## Claims allowed

Permitido, si sigue siendo factual en la versión publicada:
- desarrollo integral;
- UX/UI implementation;
- arquitectura técnica;
- responsive;
- SEO técnico;
- JSON-LD;
- formularios;
- deployment/hosting;
- performance.

No afirmar:
- métricas comerciales;
- mejoras de conversión;
- tráfico;
- resultados SEO;
- impacto comercial;

sin evidencia verificable.

## V2 public evidence model

### Required

- nombre y tipo de proyecto: sitio institucional;
- contexto real y estructura solicitada: Grupo Casa → Casa San Juan / Casa Boedo;
- necesidad original sin ampliar motivaciones no documentadas;
- responsabilidad de Ramiro en planificación, diseño visual, arquitectura, desarrollo, responsive e integraciones relevantes;
- solución general con contextos diferenciados para ambas residencias;
- selección concisa de capacidades demostradas, priorizando resolución integral, UX/UI, responsive, SEO técnico, formularios y preparación para publicación;
- screenshots reales desktop y mobile;
- estado público `en desarrollo`;
- acción secundaria opcional «Ver sitio» hacia <https://residenciasgrupocasa.com.ar/>; no sustituye screenshots curadas ni el estado `en desarrollo`.

### Useful

- arquitectura multipágina, themes por sede e imágenes responsive;
- JSON-LD, mapas, Web3Forms, hCaptcha y optimización de imágenes cuando expliquen una decisión;
- stack reducido y contextualizado;
- atribución parcial del contenido sólo si se habla de autoría editorial;
- link público navegable, con texto factual «Ver sitio»;
- resultados técnicos únicamente tras una auditoría actualizada.

### Omit

- resultados comerciales, tráfico, conversiones o impacto SEO;
- autoría editorial total de Ramiro;
- residentes identificables;
- stack exhaustivo sin contexto;
- vulnerabilidades históricas, working tree y detalles internos del repositorio;
- auditorías históricas presentadas como estado actual;
- fecha final de publicación no confirmada.

## Open items

- fecha final de publicación;
- estado final del repositorio;
- métricas futuras si alguna vez existen;
- verificación actual de cualquier claim técnico que vaya a publicarse;
- cambios de contenido o estado comercial mientras continúa el desarrollo.

# Project B — LingoHive

## Candidate status

Estado V2: **SELECTED — H6 CASE 2; INTEGRATED IN H6.E (2026-09-25)**.

LingoHive está integrado como segundo caso de Proyectos, después de Residencias Grupo Casa. La demo histórica sanitizada está publicada en <https://lingo-hive.vercel.app/>. La atribución visible es «Diseño e identidad visual: Juan Galache de Toro / Desarrollo web: Ramiro Garcia».

Evaluación histórica V1 preservada: **CANDIDATE WITH RESTORATION**

Restoration scope auditado:

**MEDIUM**

Recomendación:

**RESTORE THEN REASSESS**

La inclusión definitiva en V1 quedó pendiente históricamente y V2-H2 la difirió. La integración actual corresponde a V2-H6 y no reescribe esa historia.

## Client

Trabajo freelance para un cliente que contactó a Ramiro para crear la web de su academia de inglés.

## Product

Landing comercial para **LingoHive**, servicio/academia de clases conversacionales de inglés.

La demo pública de H6.E conserva una muestra representativa del diseño y contenido del sitio original. LingoHive ya no está en actividad; precios y testimonios son históricos. No hay oferta vigente ni reserva.

Assets reales identificados en la auditoría: marca, UI, testimonios y logos. Disponibilidad no equivale a autorización automática de reutilización.

El sitio incluía, en la versión auditada:
- Hero;
- beneficios;
- áreas de enfoque;
- pricing;
- testimonios;
- contacto;
- Calendly;
- WhatsApp;
- redes.

Dominio histórico:

`https://lingohive.fun`

Estado observado durante auditoría:

**Account Suspended**

Esto no demuestra un fallo del código.

## Repository

`https://github.com/ramiro-gp/LingoHive`

Hechos de la auditoría histórica V1:
- repo público;
- branch principal `main`;
- dos commits visibles;
- instala;
- compila;
- ejecuta localmente.

No puede demostrarse documentalmente que `main` sea la última versión histórica.

Ramiro no cree que exista una versión posterior conservada.

## Ramiro's role

Ramiro:
- desarrolló el sitio web.

## Designer

Diseñador principal:

**Juan Galache de Toro**

Responsabilidades confirmadas:
- logo;
- paleta;
- diseño general;
- dirección visual principal.

No presentar LingoHive como diseño íntegramente realizado por Ramiro.

## Verified stack

- Astro 5.18.2, salida estática, npm y Node 24 en la demo pública descrita en el handoff.
- React 19 en islas; Tailwind CSS 4; GSAP 3; Three.js 0.178; Swiper 12.1.2.
- Poppins v24 autoalojada. No hay formularios, backend, uploads, analytics, endpoint de optimización ni funciones de servidor.

Síntesis visible aprobada para ramita.dev: **Astro 5 · Tailwind CSS 4**. Se omite el resto del stack para mantener el tratamiento editorial y no convertirlo en badges.

## Technical evidence

La versión auditada:
- instala;
- compila;
- ejecuta;
- no tenía errores visibles de runtime durante preview.

La auditoría detectó:
- vulnerabilidades de dependencias;
- ausencia de reduced motion;
- problemas de accesibilidad;
- problemas mobile;
- WebGL costoso;
- exceso de JavaScript para una landing;
- metadata/OG mejorable;
- deuda técnica.

No afirmar que esos problemas siguen presentes después de cualquier restauración futura sin auditar nuevamente.

## Commercial value as evidence

LingoHive puede demostrar:
- implementación de una dirección visual externa;
- frontend expresivo;
- motion;
- React islands;
- GSAP;
- Three.js;
- interacción;
- pricing;
- testimonios;
- landing comercial;
- capacidad de traducir un diseño de marca a código.

Complementa a Residencias Grupo Casa:
- LingoHive: expresión visual e interacción.
- Residencias Grupo Casa: arquitectura, producto, responsive, SEO y resolución integral.

## Permissions

Confirmado por Ramiro:
- puede declarar públicamente que desarrolló LingoHive;
- puede mostrar screenshots;
- puede volver a desplegar el proyecto.

Persisten consideraciones específicas sobre:
- testimonios;
- fotografías;
- logos de terceros;
- perfiles personales;
- contenido comercial desactualizado.

No reutilizarlos automáticamente sólo porque existan en el repo.

## Restoration

La preparación externa de H6.E está completa. La demo histórica sanitizada no es la versión original sin cambios; el handoff distingue el commit que respalda las capturas del commit final del proyecto.

Antes de publicar un deployment restaurado:
- revisar dependencias;
- revisar vulnerabilidades;
- reduced motion;
- accesibilidad;
- responsive;
- performance;
- contenido comercial;
- permisos de assets;
- metadata;
- deployment.

Demo pública: <https://lingo-hive.vercel.app/>. URL, contenido histórico, atribuciones y capturas aprobadas constan en `C:\Codigo\LingoHive\handoff\README.md`.

## Portfolio treatment decidido para H6

Resumen dentro de Proyectos, después de Residencias, con enlace «Ver demo», capturas reales desktop/mobile, copy ES/EN/PT/FR/JA y créditos visibles. Estado explícito: demo histórica de un proyecto freelance anterior.

Las capturas públicas `public/images/lingohive-desktop.webp` (1440 × 900) y `public/images/lingohive-mobile.webp` (390 × 844) derivan del PNG aprobado en el handoff. El código y contenido que representan corresponde a `0609a18a39eef7a2a43a4b1e36615a68534462bc`; el commit final del repositorio del proyecto es `55563e241f38a18ede730f1851c45ba1ba510ebf`.

## Claims allowed

Permitido:
- desarrollo completo;
- implementación;
- participación en decisiones de diseño;
- traducción de una dirección visual a código;
- uso de las tecnologías verificadas en la versión auditada.

No afirmar:
- diseño integral realizado por Ramiro;
- métricas comerciales;
- impacto;
- estado comercial actual;
- vigencia de precios/testimonios;

sin nueva verificación.

## V2 future evidence model

### Required if published

- contexto como landing comercial para una academia/servicio de clases conversacionales de inglés;
- naturaleza histórica del proyecto y estado actual de la evidencia;
- responsabilidad de Ramiro en desarrollo web;
- atribución visible a Juan Galache de Toro como diseñador principal de logo, paleta y dirección visual;
- solución y capacidades demostradas: implementación de dirección externa, frontend expresivo, interacción y motion;
- visuales reales con permisos verificados;
- modalidad pública de demo restaurada y sanitizada, con sus limitaciones.

### Useful

- React, GSAP, Three.js y otras tecnologías como evidencia secundaria;
- explicación breve de cómo la dirección visual externa se tradujo a código;
- repositorio público sólo si su estado ofrece una señal profesional adecuada;
- complementariedad con Residencias: expresión visual frente a resolución integral.

### Omit

- atribución del diseño integral a Ramiro;
- precios, testimonios o información comercial histórica sin verificar;
- logos, fotografías, perfiles o contenido de terceros sin permiso específico;
- dominio suspendido como link público;
- afirmar que `main` es la última versión histórica;
- métricas comerciales o impacto;
- deuda técnica histórica como contenido público;
- claims técnicos basados sólo en la auditoría anterior.

### Preconditions for publication — H6.E verified

- URL pública y estado de demo histórica confirmados en el handoff;
- commit que representan las capturas y commit final registrados arriba;
- capturas desktop y mobile aprobadas por Ramiro e integradas como WebP;
- se informa que el proyecto no está en actividad y que precios/testimonios son históricos;
- copy y localización ES/EN/PT/FR/JA integrados;
- autoría de Juan Galache de Toro y Ramiro Garcia visible y localizada.

# Project comparison

## Residencias Grupo Casa

Mejor evidencia para:
- proyecto end-to-end;
- diseño y desarrollo;
- arquitectura;
- responsive;
- accesibilidad;
- SEO;
- structured data;
- formularios;
- deployment;
- trabajo institucional real.

## LingoHive

Mejor evidencia para:
- implementación visual;
- animación;
- frontend expresivo;
- interacción;
- React;
- GSAP;
- Three.js;
- trabajo con diseñador externo.

# V2 role of projects

Los proyectos no deben presentarse sólo como:

> “Mis trabajos”.

Deben responder:

> “¿Qué demuestra este proyecto sobre mi capacidad para resolver una web para un cliente?”

Cada case study debería poder explicar, de forma concisa:
1. cliente/contexto;
2. necesidad;
3. rol de Ramiro;
4. solución;
5. capacidades demostradas;
6. visual real;
7. resultado verificable sólo si existe;
8. link sólo si tiene sentido.

Profundidad aprobada para V1: resumen dentro del recorrido comercial principal. No crear páginas dedicadas, rutas o navegación de casos en V1. El modelo conserva los mismos campos para una ampliación futura.

# Portfolio integrity rules

- No inventar proyectos.
- No inventar resultados.
- No inventar métricas.
- No exagerar autoría.
- No ocultar colaboraciones relevantes.
- No publicar assets personales sin permiso.
- Pocos proyectos sólidos son preferibles a relleno.
- La tecnología es evidencia, no el protagonista.

# Open project decisions

Pendientes:
- verificación de claims técnicos actuales de Residencias antes de publicación final;
- assets de marca y metadata/SEO de ramita.dev en H6.F.
