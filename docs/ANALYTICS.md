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

Conservación comprobada/guardada: **dos meses para eventos y dos para usuarios**, sin reiniciar el plazo con nueva actividad. No equivale a eliminar informes agregados. Se conserva la ocultación de emails y se añade ocultación de diez claves: `email`, `correo`, `phone`, `telefono`, `name`, `nombre`, `message`, `mensaje`, `token`, `code`. Es una protección adicional: el cliente ya envía URLs canónicas sin query/hash y destinos enum, no direcciones/contactos ni campos.

Dimensiones creadas, todas de alcance **Evento**:

| Nombre en Analytics | Parámetro |
|---|---|
| Página del sitio | `page_id` |
| Sección del sitio | `section_id` |
| Destino de interacción | `destination_id` |
| Idioma del sitio | `site_language` |

Contrato de eventos y valores permitidos: [SEO-2026-11.md](SEO-2026-11.md). `contact_click` mide intención, `contact_copy` sólo copia completada; perfiles/proyectos/CTA/navegación son interacciones separadas. No existe formulario, CV descargable o enlace tel: y no se crean para esta medición. No se genera `generate_lead` por cada click.

El ID real se comprobó en el flujo y se guardó como variable pública de repositorio `PUBLIC_GA_MEASUREMENT_ID`, con lectura de vuelta correcta. `.env` local se mantiene ignorado; no contiene un API secret de GA. Build/check locales correctos, 566 comprobaciones de HTML sin fallos y 25 escenarios de QA con consentimiento activado, usando una etiqueta de prueba interceptada para las simulaciones. La política de privacidad añade el enlace oficial sobre uso de datos y describe la retención real. La recepción efectiva y publicación se registran al completar la comprobación del dominio.

## Accesos útiles

- [Analytics: propiedad de ramita.dev](https://analytics.google.com/analytics/web/#/a414397681p561938319/reports/intelligenthome)
- [Search Console: propiedad existente](https://search.google.com/search-console?resource_id=sc-domain%3Aramita.dev)
- [Privacidad pública](https://ramita.dev/privacidad/)

La búsqueda pública, investigación, baseline, límites de medición y publicación SEO anterior se conservan en [SEO-2026-11.md](SEO-2026-11.md). Las capturas de la cuenta autenticada se guardan privadamente en `release/ga4-2026-11-02/`, sin incluirlas en el repositorio público.
