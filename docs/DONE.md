# DONE.md — Definition of Done V2

`ramita.dev` sólo puede declararse terminado cuando todos los puntos aplicables estén cumplidos.

## Reglas de cierre

### Aprobación

- Toda condición subjetiva marcada como “aprobado/a” requiere aprobación explícita del usuario.
- El agente no puede autoaprobar diseño, copy ni dirección visual.

### N/A

- Un criterio sólo puede marcarse N/A cuando la feature correspondiente está deliberadamente fuera del alcance V2.
- REVISIT no equivale a eliminado y no permite marcar N/A automáticamente; antes del release debe resolverse explícitamente cada feature pendiente.
- Cada N/A debe registrar brevemente el motivo en el QA/release report final.

### Fases

- Son criterios pre-release todos los de este documento salvo los que requieren explícitamente producción o el entorno público.
- V2-H8 puede comenzar cuando V2-H0–V2-H7 estén cerrados y todos los criterios pre-release aplicables estén satisfechos.
- Los criterios de `Performance en producción`, `Producción` y la evidencia que dependa del entorno público se completan durante V2-H8.
- `STATUS: DONE` sólo puede declararse cuando también estén satisfechos los criterios y la evidencia de producción.

## Producto

- [ ] Hero aprobado.
- [ ] Arquitectura de contenido y presentación profesional aprobadas, sin imponer las secciones V1.
- [ ] Projects contiene únicamente trabajos reales y auditados.
- [ ] Contacto usa datos reales y el email es el canal comercial principal.
- [ ] Se entiende qué servicios se ofrecen y para qué necesidades.
- [ ] CTA/contacto funcionan y permiten iniciar una conversación.
- [ ] No hay claims no verificables ni tiempos de entrega inventados.
- [ ] No se publican precios ni se crean paquetes.
- [ ] Los proyectos respaldan capacidades reales y respetan atribuciones y permisos.
- [ ] No parece una falsa agencia ni implica un equipo inexistente.
- [ ] No existe contenido de CV/recruiter que contradiga el objetivo comercial.
- [ ] GitHub actúa como respaldo; no hay canales ni servicios fuera del alcance aprobado.
- [ ] No existe contenido público inventado.
- [ ] No existe ninguna sección no aprobada.
- [ ] No quedan `TODO_*` renderizados ni datos ficticios.

## Diseño

- [ ] Dirección visual V2 aprobada y consistente; Quiet Interactive se evalúa como REVISIT, no como requisito irrevocable.
- [ ] Cada viewport tiene un foco claro.
- [ ] No existe ruido visual innecesario.
- [ ] El sitio funciona visualmente sin motion.
- [ ] No se apoya en patrones AI-genéricos.
- [ ] Quiet Interactive, Instrument Sans, paleta, dark/light, accents y selector tienen decisión explícita de revalidación o exclusión.
- [ ] Themes, tipografía, paleta y accents incluidos en el alcance final están aprobados y contrastados.

## Interacción

- [ ] Header completo.
- [ ] Los controles aprobados cumplen su comportamiento V2, incluida persistencia si corresponde.
- [ ] Si se revalida el selector de accent, se verifican apertura/cierre, selección, foco y persistencia según la especificación ratificada; las reglas V1 no se heredan automáticamente.
- [ ] Interacciones pointer tienen alternativa touch/keyboard.
- [ ] Reduced motion funciona.

## i18n

- [ ] ES completo.
- [ ] EN completo.
- [ ] PT completo.
- [ ] ES, EN, PT, FR y JA tienen paridad funcional: mismas secciones, controles e información pública equivalente.
- [ ] No existen keys ni rutas faltantes.
- [ ] El copy final de los cinco idiomas (ES/EN/PT/FR/JA) fue revisado y aprobado por el usuario.
- [ ] No hay mezcla accidental de idiomas.
- [x] Metadata localizada.
- [x] hreflang/canonical correctos.

## Responsive

QA visual y funcional aprobado en:
- [ ] 320–359
- [ ] 360–479
- [ ] 480–767
- [ ] 768–1023
- [ ] 1024–1279
- [ ] 1280–1535
- [ ] 1536+

- [ ] Sin overflow horizontal accidental.
- [ ] Sin contenido crítico dependiente de hover.
- [ ] Mobile se siente diseñado, no comprimido.

## Accesibilidad

- [ ] Navegación completa por teclado.
- [ ] Focus visible.
- [x] Contraste auditado frente al objetivo WCAG 2.2 AA definido en `docs/ARCHITECTURE.md`, con la excepción H7-P2-01 aceptada expresamente por Ramiro para este release.
- [ ] Semántica correcta.
- [ ] Labels/ARIA correctos donde correspondan.
- [ ] Ningún contenido o acción crítica está disponible exclusivamente por hover.
- [ ] `prefers-reduced-motion` es funcional.
- [ ] Targets táctiles razonables.
- [ ] Lighthouse Accessibility alcanza al menos 95 en producción.
- [ ] No existe ningún problema manual bloqueante de teclado, focus, navegación o comprensión.

Excepción H7-P2-01: el enlace GitHub dentro de la escena Ramiro en Light conserva ratios por debajo de AA con accent verde (2,63:1), azul (2,68:1), rojo (3,03:1) y violeta (2,55:1). Light + negro alcanza 15,62:1 tras la corrección H7. La aceptación no afirma conformidad AA de esas cuatro combinaciones; se preservan sin cambio visual en H8. Evidencia: `qa/h7-report.md` y `qa/h7-results.json`.

## Calidad técnica

- [ ] Build limpio.
- [ ] Typecheck limpio.
- [ ] Lint/format según configuración.
- [ ] Sin errores de consola relevantes.
- [ ] Sin dependencias innecesarias.
- [ ] Sin JS cliente innecesario.
- [ ] Imágenes optimizadas.
- [ ] Fuentes optimizadas.
- [ ] Sin CLS material evitable.

## SEO / sharing

- [x] title/description reales.
- [x] canonical.
- [x] hreflang.
- [x] sitemap.
- [x] robots.
- [x] favicon/icons.
- [x] Open Graph.
- [x] social preview revisada.

H6.F: favicon/icons y preview social están implementados, pasaron QA técnico y Ramiro aprobó visualmente los renders el 2026-09-25. La comprobación pública de indexabilidad, assets y metadata corresponde a H8.

## Performance en producción

- [ ] Lighthouse/PageSpeed Performance alcanza al menos 90.
- [ ] Lighthouse/PageSpeed Accessibility alcanza al menos 95.
- [ ] Lighthouse/PageSpeed Best Practices alcanza al menos 95.
- [ ] Lighthouse/PageSpeed SEO alcanza al menos 95.
- [ ] CLS es menor o igual a 0.1.
- [ ] LCP es menor o igual a 2.5 s.
- [ ] TBT es menor o igual a 200 ms cuando se usa medición de laboratorio y no existe field data suficiente.
- [ ] Si PageSpeed dispone de Core Web Vitals de campo suficientes, están en verde.

Los resultados pueden fluctuar. Si una medición queda por debajo de un umbral, debe repetirse para descartar ruido.

Cualquier excepción persistente debe documentarse y ser aceptada explícitamente por el usuario antes de `STATUS: DONE`.

## Producción

- [ ] `ramita.dev` resuelve correctamente.
- [ ] HTTPS correcto.
- [ ] URLs internas correctas.
- [ ] Links externos correctos.
- [ ] 404/errores relevantes controlados.
- [ ] Smoke test en deployment real.
- [ ] Lighthouse/PageSpeed ejecutado sobre producción.
- [ ] Findings críticos corregidos o excepciones persistentes explícitamente aceptadas por el usuario.

## Evidencia de cierre

El QA/release report final incluye:

- [ ] resultados de build, typecheck y lint;
- [ ] QA responsive;
- [ ] QA keyboard, touch y reduced motion;
- [ ] QA de la matriz de browsers definida en `docs/ARCHITECTURE.md`, con versiones probadas registradas;
- [ ] Lighthouse/PageSpeed de producción;
- [ ] lista explícita de excepciones aceptadas, si hubiera.

Para el cierre específico de V2-H7, Ramiro confirmó el 2026-09-25 que una prueba real con lector de pantalla (NVDA es suficiente) y touch en al menos un dispositivo físico son obligatorios. Safari desktop, iPhone/iPad, Firefox, Chrome Android adicional y versiones anteriores se documentan como cobertura adicional no bloqueante si no están disponibles; su ausencia no se presenta como aprobación. Cualquier P0/P1 hallado en una prueba externa efectivamente realizada bloquea el cierre. Las mediciones y comprobaciones del dominio público siguen en H8.

## Alcance del cierre documental

Cerrar V2-H0 sólo acredita consistencia documental y preservación de evidencia. No marca satisfechos los checks de producto, UI o producción ni cierra V2-H1.
La evidencia de auditoría documental se registra en ROADMAP.md; la de release se aporta durante V2-H7/V2-H8.

## Declaración final

Sólo si todo lo anterior está satisfecho:

**STATUS: DONE**

En cualquier otro caso:

**STATUS: NOT DONE**

acompañado de la lista concreta de pendientes.
