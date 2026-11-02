# GA4 y Search Console — ramita.dev

## Continuación autorizada — 2026-11-02

Ramiro pide completar GA4 y SEO sin contratar servicios. Se utiliza **Google Analytics estándar**, sin Analytics 360, publicidad, APIs pagas, BigQuery ni suscripciones. La propiedad existente de Residencias Grupo Casa pertenece a otro proyecto y se conserva intacta.

La sesión de `ramirogperucho@gmail.com` funciona en el navegador integrado. Se revisó el selector completo: sólo existía la cuenta/propiedad de Residencias; no aparecía ramita.dev. Se preparó una cuenta separada y la interfaz avanzó desde el acuerdo de condiciones a la creación del flujo. El agente no pulsó el botón de aceptación de condiciones. No se creó otra cuenta de Google ni se introdujeron contraseñas o nuevos permisos OAuth.

## Identificadores y configuración comprobada

| Recurso | Valor |
|---|---|
| Cuenta Analytics | ramita.dev — `414397681` |
| Propiedad GA4 | ramita.dev — Web — `561938319` |
| Flujo web | ramita.dev — Web — `16256938473` |
| URL del flujo | `https://ramita.dev` |
| ID público | `G-SM3PHE0FHT` |
| Zona de informes | Argentina, GMT−03 Buenos Aires |
| Moneda de informes | ARS; sin eventos de ingresos inventados |

La medición mejorada está **desactivada**. Los pageviews se envían explícitamente una vez por documento; no se instalan snippets adicionales, GTM ni etiquetas conectadas. Se conservaron apagadas las opciones adicionales de compartir datos al preparar la cuenta (productos/servicios, contribuciones/modelos, asistencia técnica y recomendaciones). El cliente también desactiva señales y personalización publicitaria y mantiene denegados almacenamiento/datos/personalización de anuncios.

La continuación conserva atribución orgánica con una lista explícita de orígenes públicos de Google/Bing/DuckDuckGo/Yahoo. `search-referrer.ts` devuelve un origen fijo sin ruta, query ni fragmento; los orígenes desconocidos/privados e internos se descartan. Esto sustituye la supresión absoluta de referrer de la primera entrega y evita perder toda atribución de búsquedas. No se transmite el texto buscado ni se reconstruyen campañas arbitrarias. Quince casos de lista permitida y un caso de navegador con un referrer que contiene marcadores sensibles verifican que éstos no lleguen a la configuración.

Conservación comprobada/guardada: **dos meses para eventos y dos para usuarios**, sin reiniciar el plazo con nueva actividad. No equivale a eliminar informes agregados. Se conserva la ocultación de emails y se añade ocultación de diez claves: `email`, `correo`, `phone`, `telefono`, `name`, `nombre`, `message`, `mensaje`, `token`, `code`. Es una protección adicional: el cliente ya envía URLs canónicas sin query/hash y destinos enum, no direcciones/contactos ni campos.

Dimensiones creadas, todas de alcance **Evento**:

| Nombre en Analytics | Parámetro |
|---|---|
| Página del sitio | `page_id` |
| Sección del sitio | `section_id` |
| Destino de interacción | `destination_id` |
| Idioma del sitio | `site_language` |

Contrato de eventos y valores permitidos: [SEO-2026-11.md](SEO-2026-11.md). `contact_click` mide intención, `contact_copy` sólo copia completada; perfiles/proyectos/CTA/navegación son interacciones separadas. No existe formulario, CV descargable o enlace tel: y no se crean para esta medición. No se genera `generate_lead` por cada click.

El ID real se comprobó en el flujo y se guardó como variable pública de repositorio `PUBLIC_GA_MEASUREMENT_ID`, con lectura de vuelta correcta. `.env` local se mantiene ignorado; no contiene un API secret de GA. Build/check locales correctos, 566 comprobaciones de HTML sin fallos y 25 escenarios de QA con consentimiento activado, usando una etiqueta de prueba interceptada para las simulaciones. La política de privacidad añade el enlace oficial sobre uso de datos y describe la retención real.

## Publicación y transporte real

Primera activación publicada desde `54b45ba7d220502c15b4e20948e69a7bbe3ce622`, [CI 41503993972](https://github.com/ramiro-gp/portfolio/actions/runs/41503993972) correcto. Comprobación real: 638 checks SEO públicos sin fallos; aviso e ID reales presentes. 25 escenarios sobre producción y fixture local, sin errores. El aviso se muestra únicamente sin elección vigente, conserva rechazo/aceptación y permite cambiar Cookies en el footer. No se cambia el diseño comercial.

Prueba de integración real en navegador aislado, sin perfil/cuenta del propietario: etiqueta oficial, consentimiento, URL de prueba con marcadores ficticios de privacidad y clicks cuyo destino externo se evita. Once eventos llegan al endpoint de colección de la propiedad con **HTTP204**: un pageview, tres contactos (email/WhatsApp de Contacto y email del menú), copia completada, GitHub, CTA y cuatro visitas de proyectos. Todos tienen página, sección, destino e idioma esperados. No aparecen los marcadores privados ni URLs con query/hash, ni eventos automáticos duplicados de click/scroll/formulario/descarga, ni `generate_lead`. Rechazo persistido sin etiqueta; revocación sin nuevos envíos y cookies eliminadas. Reporte seguro sin client/session IDs ni cookies: `qa/seo/ga4-reception-batch-wait-2026-11-02.json`.

El primer intento sólo esperó tres segundos y comprobó el pageview antes del lote; la versión final espera el lote de forma acotada y pasa. No fue un defecto del sitio. El HTTP204 acredita transporte aceptado, **no por sí solo un informe procesado**. Se configura `debug_mode` únicamente en esa sesión de prueba, no para los visitantes. Se realizó además una visita consentida desde el navegador integrado y un click interno de CTA, sin enviar mensajes. **Tiempo real confirmó dentro de GA4 un usuario, `page_view`, `cta_click`, `first_visit` y `session_start`**. Esto acredita recepción en la propiedad correcta; los datos iniciales incluyen QA y no son oportunidades comerciales reales. La captura autenticada se conserva privadamente, sin identificadores de cliente en el repositorio.

Siete HTML con consentimiento/política activos válidos en W3C, sin mensajes. La versión con referrer saneado pasa 15 casos de seguridad y otros 25 escenarios locales, incluida configuración del origen Google sin sus términos de búsqueda. No se instalan dependencias.

La prueba manual de salida inmediata a WhatsApp no apareció en el primer informe consultado, mientras que una copia completada posterior sí apareció como `contact_copy`. Para reducir la pérdida al abandonar el documento se añade el [callback oficial del tag](https://developers.google.com/tag-platform/gtagjs/reference/parameters), con timeout y temporizador independientes de 250 ms como máximo antes de continuar una salida HTTP normal consentida. Rechazo, clicks modificados/nueva pestaña y mailto mantienen comportamiento nativo. El tag bloqueado nunca impide salir y la continuación tiene guardia contra doble navegación. Cuatro escenarios aislados con destino simulado pasan; no se envían mensajes ni se altera el enlace de WhatsApp. **Tras publicar, el navegador integrado carga el JS nuevo, sale correctamente al destino de WhatsApp y GA4 muestra `contact_click` una vez en Tiempo real**, separado de copia y CTA. No se pulsa enviar ni iniciar conversación en WhatsApp. Captura privada: `release/ga4-2026-11-02/realtime-contact-received.jpg`.

Último código: `612a0c94175f423368595e3a3bb8d47cb1e40272`, [CI 41508839209](https://github.com/ramiro-gp/portfolio/actions/runs/41508839209) correcto, compilado `02ce1a36b31fe48e3e292a70f0f87f8611ffe213`. Los 638 checks públicos vuelven a pasar y los 31 archivos servidos se contrastan con este build, incluidos el nuevo JS y las reglas de URL. El último check local tiene 0 errores, 0 warnings y un hint en un JS minificado de respaldo ignorado dentro de `release/`; CI limpio no incluye ese respaldo. Los 25 escenarios completos sobre producción corresponden al build inmediatamente anterior al callback; los cuatro escenarios de navegación y la salida real/recepción de contacto verifican la corrección final.

Última medición pública mobile con aviso activo (Lighthouse 13.5.0, una ejecución, simulación): 100/100/100/100, LCP 1.458 ms, TBT 23 ms y CLS 0. Es laboratorio, sin nuevos datos de CWV de campo. El JSON está completo, sin `runtimeError` o avisos; la CLI terminó con EPERM al limpiar el perfil temporal después de guardarlo, por lo que no se declara exit code cero. Evidencia: `qa/seo/lighthouse-mobile-ga4-2026-11-02.json`.

## Informes preparados

- Resumen panorámico: plantilla de comportamiento de usuarios, sin crear ingresos o ventas ficticias.
- [Exploración «ramita.dev — Contactos e interacciones»](https://analytics.google.com/analytics/web/#/analysis/a414397681p561938319/edit/JyPwOq79SdyOzWi35ax91Q): tabla por nombre de evento, destino, sección, página e idioma; métricas Número de eventos y Total de usuarios. Segunda pestaña **Intención de contacto**, filtro exacto `event_name = contact_click`. Copias/redes/proyectos/CTA se consultan por separado del contacto y no se suman como leads.
- Vinculación GA4↔Search Console creada y comprobada para `ramita.dev` (Dominio) y el flujo `16256938473`; no se vincula Residencias ni productos publicitarios. La interfaz confirma **Vinculación creada correctamente** y muestra el único vínculo en tabla.

Las dimensiones nuevas y los informes históricos requieren procesamiento. [Google indica](https://support.google.com/analytics/answer/10201247) un inicio de recogida de 10–15 minutos y 24–48 horas para otros informes; [una propiedad nueva puede tardar hasta 30 minutos](https://support.google.com/analytics/answer/9744165). No se interpreta una tabla inicial vacía como ausencia de visitas reales ni se presentan los eventos de QA como leads. Tiempo real ya confirma recepción; DebugView no mostró la sesión headless durante la primera consulta y no se lo presenta como validado.

## Search Console comprobado el 02/11/2026

La propiedad existente `sc-domain:ramita.dev` muestra **Propietario verificado**. Sin cambios DNS ni nuevas verificaciones. Las cinco URLs comerciales figuran indexadas, con rastreo/indexación permitidos, obtención correcta y canonical elegida por Google igual a la propia. Últimos rastreos del índice: raíz 30/10 06:48:01, EN 30/10 05:05:26, PT 29/10 18:30:06, FR 26/10 01:10:51 y JA 01/11 16:45:55 (horarios tal como aparecen en la interfaz).

Prueba en directo de la home el 02/11 a las 15:46:26: **La URL está disponible para Google**, herramienta de inspección para smartphones, rastreo permitido, obtención correcta e indexación permitida. Resuelve la incertidumbre sobre el acceso real al HTML de la home; no se equipara a una prueba de todos los rastreadores ni a una nueva indexación de los textos recién publicados. No se modificó el CDN para aceptar UA simulados.

Sitemap existente: `https://ramita.dev/sitemap.xml`, Correcto, última lectura 30/10 con cinco URLs. Se envía **una actualización única** del mismo sitemap por la nueva ruta de privacidad; Google confirma envío correcto el 02/11 y conserva una sola fila. El archivo público contiene seis URLs, pero la tabla aún refleja cinco descubiertas y la lectura anterior: la incorporación de la sexta requiere nuevo procesamiento y no se declara completada.

Exclusiones: cinco variantes alternativas con canonical adecuada y dos páginas con redirección, no siete fallos de las URLs comerciales. Acciones manuales y seguridad: **ningún problema detectado**. Robots: todos los archivos válidos. 47 solicitudes de rastreo en 90 días. IA generativa permanece en Incluir. No se cambia política de bots o privacidad de la cuenta.

Baseline actual de rendimiento, Web, selector de tres meses y gráfico disponible 19–31/10/2026: **6 impresiones, 0 clics, CTR 0 %, posición media 4,5**. Tabla de consultas: «ramita», 1 impresión/0 clics; no representa la totalidad de las consultas por restricciones de datos ni volumen de búsqueda. Muestra demasiado pequeña para evaluar captación no de marca, atribuir efectos al despliegue o prometer posiciones. Se conserva el baseline histórico de octubre y la separación entre CWV de campo sin datos y laboratorio.

## Accesos útiles

- [Analytics: propiedad de ramita.dev](https://analytics.google.com/analytics/web/#/a414397681p561938319/reports/intelligenthome)
- [Search Console: propiedad existente](https://search.google.com/search-console?resource_id=sc-domain%3Aramita.dev)
- [Privacidad pública](https://ramita.dev/privacidad/)

La búsqueda pública, investigación, baseline, límites de medición y publicación SEO anterior se conservan en [SEO-2026-11.md](SEO-2026-11.md). Las capturas de la cuenta autenticada se guardan privadamente en `release/ga4-2026-11-02/`, sin incluirlas en el repositorio público.
