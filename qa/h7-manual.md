# V2-H7 — pruebas externas reales

Estado obligatorio: **PASS informado por Ramiro el 2026-09-25** para las dos pruebas reales. Su mensaje no incluye hash/URL del build, fecha/hora de ejecución, navegador ni versiones de software/hardware; esos campos quedan sin verificar y no se inventan. No se comunicaron defectos P0/P1 en estas pruebas.

## Obligatoria: lector de pantalla real

NVDA en Windows es suficiente. Probar preferentemente la ruta ES y, al menos, cambiar a otro idioma. Usar lectura por headings, enlaces y controles, además de Tab/Shift+Tab:

1. El Hero se anuncia como una frase completa estable; la palabra rotativa visual no interrumpe la lectura.
2. Menú: trigger con nombre y estado; al abrir, foco contenido; se anuncian los cinco destinos, idiomas, MODO y COLOR PRINCIPAL; Escape cierra y devuelve foco; navegar entrega foco al destino.
3. Proyectos: dos casos en orden, estado histórico de LingoHive, captions/alt comprensibles y créditos de diseño/desarrollo diferenciados. La línea y los nodos decorativos no se anuncian.
4. Ramiro: enlace GitHub y proceso comprensibles.
5. Contacto: email y WhatsApp utilizables; botones de copia con nombre y mensaje de éxito o error; IR ARRIBA enfoca el inicio.

Registrar **PASS/FAIL** por punto, cualquier anuncio confuso y pasos de reproducción. Si se detecta un P0/P1, comunicarlo antes del cierre.

Resultado: **PASS — NVDA real en Windows, confirmado por Ramiro.** Versión de NVDA/Windows, navegador, URL y checklist desglosado: no informados.

## Obligatoria: touch en dispositivo físico

En un teléfono o tablet físico que pueda abrir el mismo build, registrar modelo, sistema, navegador, ancho aproximado y URL. Recorrer Inicio → Servicios → ambos proyectos → Ramiro → Contacto; comprobar scroll y sticky sin bloqueos, texto/capturas completos, línea sin tapar contenido, menú, idiomas, Light/Dark, dos accents, CTA, enlaces, email, WhatsApp, copia e IR ARRIBA. Comprobar que no aparece el cursor personalizado y que no se necesita hover para información o acciones.

Registrar **PASS/FAIL**, capturas sólo si hay un defecto, y reproducción exacta. Si se detecta un P0/P1, comunicarlo antes del cierre.

Resultado: **PASS — touch en dispositivo físico real, confirmado por Ramiro.** Modelo, sistema, navegador, ancho, URL y checklist desglosado: no informados.

## QA adicional, no bloqueante si no está disponible

Safari desktop; Safari en iPhone/iPad real; Firefox; otro Chrome Android; versiones anteriores de navegadores. Registrar cada prueba realmente hecha con versión y resultado. Las ausencias son limitaciones de cobertura, no fallos ni pruebas aprobadas.

Estado actual: **NO REALIZADO**.
