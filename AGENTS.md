# AGENTS.md — ramita.dev

Este archivo es el punto de entrada obligatorio para cualquier agente que trabaje en el proyecto.

## 1. Objetivo

Construir `ramita.dev`, sitio comercial personal de **Ramiro Garcia**, para vender servicios de diseño y desarrollo web. Los proyectos/casos son evidencia de capacidad; la presentación profesional apoya la confianza.

Prioridad: vender, generar confianza, demostrar y presentar al profesional. Ramiro presta el servicio de forma independiente; no representar una agencia o equipo ficticio.

Mantener minimalismo, claridad, ausencia de ruido e interacción con propósito. **Quiet Interactive, Instrument Sans, paleta, accents, dark/light y selector de accent: REVISIT**, antecedentes a revalidar, no decisiones irrevocables de V2. El Hero y la navegación están abiertos; no continuar el UX ni H3 históricos.

Antes de modificar código, leer los documentos relevantes de `/docs`.

## 2. Orden de autoridad

1. Pedido explícito más reciente del usuario.
2. `AGENTS.md`.
3. `docs/PRODUCT.md`.
4. `docs/POSITIONING.md`.
5. `docs/OFFER.md`.
6. `docs/PROJECTS.md`.
7. `docs/CONTENT.md`.
8. `docs/DESIGN.md`.
9. `docs/ARCHITECTURE.md`.
10. `docs/ROADMAP.md`.
11. `docs/DONE.md`.
12. `docs/DECISIONS.md`.

Cada documento gobierna su responsabilidad declarada. DECISIONS registra historia y referencias; no sustituye la especificación activa. Los antecedentes V1 no gobiernan V2 ni cierran hitos nuevos.

Si dos documentos se contradicen, **no improvisar**. Señalar la contradicción y pedir resolución.

## 3. Reglas innegociables

- No inventar experiencia profesional, clientes, proyectos, métricas, premios, ubicaciones, testimonios ni tecnologías utilizadas.
- No agregar secciones, features, dependencias o contenido “porque suele haberlo en una web comercial”.
- No reemplazar datos faltantes con copy que parezca real.
- Si hace falta contenido temporal, usar un marcador inequívoco como `TODO_CONTENT` o `TODO_ASSET`.
- No implementar un cambio material de producto/diseño sin que esté respaldado por estos documentos o por una instrucción explícita del usuario.
- No declarar un hito terminado hasta cumplir sus criterios de aceptación.
- No declarar el sitio terminado hasta cumplir `docs/DONE.md`.
- No actualizar dependencias por iniciativa propia.
- No usar React u otro framework cliente salvo necesidad demostrable.
- No introducir una librería de animación sólo porque facilite un efecto.
- Respetar `prefers-reduced-motion`.
- Toda interacción dependiente de hover/pointer debe tener alternativa táctil/teclado.
- Mobile no es una versión reducida de desktop: debe diseñarse deliberadamente.

## 4. Regla de consulta

DETENERSE Y PREGUNTAR antes de implementar cuando falte una decisión que afecte cualquiera de estos puntos:

- contenido público real;
- identidad visual;
- comportamiento interactivo;
- navegación;
- arquitectura;
- dependencia nueva;
- privacidad/analytics;
- formulario o backend;
- SEO/canonical/dominio;
- publicación de un proyecto;
- cambio en el alcance de una sección.

No preguntar por detalles puramente mecánicos que puedan resolverse sin alterar producto o diseño.

## 5. Flujo de trabajo

Para cada hito:

1. Leer `docs/ROADMAP.md`.
2. Leer documentación relacionada.
3. Identificar dudas bloqueantes.
4. Resolver dudas antes de producir una implementación material.
5. Implementar sólo el alcance del hito.
6. Ejecutar validaciones aplicables al alcance. En hitos exclusivamente documentales, auditar consistencia y preservación de evidencia; no ejecutar builds ni QA visual.
7. Si hay cambios de UI, revisar visualmente desktop y mobile.
8. Si hay cambios de UI, revisar accesibilidad y `prefers-reduced-motion`.
9. Comparar los cambios con los documentos activos pertinentes.
10. Reportar:
   - qué cambió;
   - qué se validó;
   - qué queda pendiente;
   - si el hito puede considerarse cerrado.

## 6. Filosofía

> La interacción debe descubrir contenido, dar feedback o generar carácter. Si solamente decora, se elimina.

> Motion enhances the composition. It never rescues it.

> Si una pantalla necesita más de 3–4 focos visuales para entenderse, hay que simplificarla.

## 7. Skill de diseño

Cuando se diseñe, implemente o revise UI, consultar:

`skills/portfolio-design-guardian/SKILL.md`

## 8. Documentación viva

Cuando una decisión quede confirmada:

- actualizar el documento correspondiente;
- agregar una entrada breve en `docs/DECISIONS.md` si cambia o fija una decisión relevante;
- no reescribir documentos completos innecesariamente.
