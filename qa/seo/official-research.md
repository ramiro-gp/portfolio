# Fuentes oficiales y decisiones SEO — 2026-10-19

Investigación pública, sin acceso a métricas privadas ni cambios en cuentas. Aplicación al sitio comercial independiente con Astro 7.3 SSG, cinco idiomas y cinco rutas. El prompt describía React/Vite/Tailwind como hipótesis: `package.json` y la arquitectura actual confirman Astro, TypeScript y CSS propio.

## Búsqueda mediante IA y medición

| Tema | Evidencia oficial vigente | Aplicación al proyecto |
| --- | --- | --- |
| Google AI Overviews / AI Mode | La [guía oficial actualizada](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) mantiene las bases SEO: contenido útil, rastreable e indexado, snippets y estructura clara. Google ignora `llms.txt`; mantenerlo no ayuda ni perjudica el posicionamiento. | Conservar HTML comercial estático, enlaces reales, traducciones completas y evidencia factual. No agregar archivos, FAQ ni schemas sólo para IA. |
| Google: informe generativo | El [Generative AI performance report](https://support.google.com/webmasters/answer/16984139) se extendió mundialmente el 2026-08-31. Muestra impresiones por página, país, fecha y dispositivo; puede no aparecer por insuficiencia de impresiones. Sus datos también forman parte del rendimiento Web. | Cuando exista acceso autorizado, comprobar el informe. Ausencia del informe no prueba ausencia absoluta de citas. No inventar datos. |
| Google: control generativo | [Settings > Search generative AI](https://support.google.com/webmasters/answer/16908024), disponible mundialmente desde el 2026-08-31: inclusión predeterminada, exclusión o herencia del padre. No controla entrenamiento. | Inspeccionar la preferencia real de `ramita.dev` al acceder a Search Console; no presumir el estado de la cuenta. |
| Bing / Copilot | [AI Performance](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/) muestra citas totales, páginas citadas, consultas de grounding muestreadas y tendencias. Las citas no equivalen a ranking ni clics. | Consultar con propiedad verificada y datos disponibles. Separar citas, impresiones, clics y contactos. |
| Bing: novedades 2026 | [Intents, Topics, Citation Share y Compare](https://blogs.bing.com/search/2026/6/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare/) están en preview desde junio. [Topics Portfolio](https://blogs.bing.com/webmaster/2026/10/introducing-topics-portfolio-beta-in-ai-performance/) es beta desde el 2026-10-13, depende de datos suficientes y ofrece agregados aproximados. | Revisar sólo si aparece para esta propiedad. No presentar estos agregados como mediciones exactas ni disponibilidad garantizada. |

La [página anterior de Google AI features](https://developers.google.com/search/docs/appearance/ai-features), fechada 2025-12-10, aún sólo describe el total Web. Para reportes y controles de octubre de 2026, prevalecen las páginas específicas actuales enlazadas arriba.

## Rastreadores y entrenamiento

`public/robots.txt` observado contiene `User-agent: *`, `Allow: /` y sitemap. Permite rastreo general; no diferencia usos de búsqueda y entrenamiento. No se cambió su política en esta investigación.

| Agente / control | Uso documentado | Implicación |
| --- | --- | --- |
| `OAI-SearchBot` | Búsqueda de ChatGPT. | Permitir su rastreo favorece elegibilidad, sin garantizar aparición. |
| `GPTBot` | Contenido potencialmente destinado al entrenamiento de modelos fundacionales. | Preferencia independiente; confirmar con el propietario antes de decidir una nueva política. |
| `ChatGPT-User` | Accesos iniciados por usuarios, sin rastreo automático; robots puede no aplicarse. | No sirve para controlar inclusión en ChatGPT Search. |
| `PerplexityBot` | Descubre y enlaza sitios en búsqueda; su documentación excluye entrenamiento fundacional. | Puede acceder bajo la regla general actual. |
| `Perplexity-User` | Acceso solicitado por usuario, generalmente ignora robots. | No confundir con crawler automático. |
| `Googlebot` | Google Search, incluido contenido de búsqueda con IA. | No bloquearlo como medida contra entrenamiento. |
| `Google-Extended` | Token de preferencias para determinados usos de Gemini; no posee un user agent HTTP separado y no determina ranking/inclusión en Search. | Evaluar por separado de Googlebot y del control generativo de Search Console. |

Fuentes: [official OpenAI documentation](https://developers.openai.com/api/docs/bots), [Perplexity Crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers), [Google common crawlers](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers). Un request con user agent simulado sólo comprueba la respuesta a ese encabezado. Para atribuir tráfico real hacen falta logs y verificación de identidad/IP oficial. Robots es una preferencia de rastreo, no un control de acceso a información privada.

## Configuración de herramientas

1. **Search Console:** comprobar primero propiedades y permisos de la cuenta del propietario. Si no existe, [agregar propiedad de dominio](https://support.google.com/webmasters/answer/34592?hl=en) `ramita.dev`; la [verificación DNS oficial](https://support.google.com/webmasters/answer/9008080?hl=en) entrega el valor TXT/CNAME exacto. Mostrar el registro antes de pedir autorización DNS; conservarlo tras verificar. Enviar el sitemap válido, inspeccionar las cinco URLs y revisar canonical seleccionado, indexación, errores, CWV y rendimiento. Verificación, envío de sitemap e indexación son estados distintos.
2. **Bing:** [importar desde Search Console](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b) puede verificar la propiedad e importar sitemap, pero exige conceder acceso a Bing sobre la cuenta Google; no aprobar OAuth en nombre del propietario. Alternativa: verificación manual oficial. Auditar sitemap, URL Inspection, errores y Search/AI Performance una vez verificado.
3. **API Search Console:** [OAuth es obligatorio para datos privados](https://developers.google.com/webmaster-tools/v1/how-tos/authorizing). Si se justifican reportes recurrentes, comenzar con `webmasters.readonly` fuera del frontend. Para cinco páginas con cambios poco frecuentes, la UI y exportaciones evitan OAuth permanente, secretos y dependencias innecesarios.
4. **IndexNow:** el [protocolo oficial](https://www.indexnow.org/documentation) notifica URLs nuevas, modificadas o eliminadas con una clave pública de propiedad. No garantiza indexación. Recomendación contextual: diferir automatización hasta comprobar una frecuencia de publicación que la justifique; sitemap y herramientas de inspección bastan como primer paso para este portfolio pequeño.
5. **Google Indexing API:** [sólo JobPosting o BroadcastEvent dentro de VideoObject](https://developers.google.com/search/apis/indexing-api/v3/quickstart); no corresponde al portfolio.

## Semántica, idiomas y presencia local

- Cinco URLs con contenido completo, canonical propio y alternates recíprocos son compatibles con las [recomendaciones de idiomas](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) y [hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions). Las anotaciones HTML actuales bastan; Google no obtiene beneficio adicional de duplicarlas en HTML, headers y sitemap. `ja` es japonés. No crear regiones ficticias ni redirecciones automáticas por navegador.
- `Person` factual existente describe al prestador. `WebSite`/`WebPage`/`Service` pueden aportar semántica si reflejan texto visible, pero no son por sí mismos promesa de rich results. Mantener el marcado mínimo y [coherente con lo visible](https://developers.google.com/search/docs/appearance/structured-data/sd-policies). La home comercial no necesita forzarse a [ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page), cuyo foco debe ser el perfil. BreadcrumbList no aporta a cinco versiones de una single-page sin jerarquía de páginas; Organization/LocalBusiness no se justifican con datos actuales.
- [Google Business Profile exige contacto presencial](https://support.google.com/business/answer/13763036?hl=en). Un servicio exclusivamente online no es elegible. Los documentos no establecen atención presencial, por lo que no corresponde crear un perfil ni inventar oficina/dirección. Confirmar esa actividad real sólo si se desea evaluar una futura ficha.

## Muestreo comercial argentino

Consultas públicas ejecutadas el 2026-10-19, con el buscador de la herramienta y sin ubicación/dispositivo controlados. Son observaciones cualitativas de intención, no una medición de Google Argentina ni de demanda, ranking o dificultad. No se obtuvieron volúmenes. Las páginas competidoras se usan como fuentes primarias de su propia oferta, nunca como evidencia de eficacia de sus promesas.

| Consulta muestreada | Ejemplo observado | Lectura comercial aplicable |
| --- | --- | --- |
| `diseño desarrollo web Argentina sitios institucionales freelance` | [Liao](https://liao.com.ar/), [Landlyo](https://www.landlyo.com/) | Servicios y contacto directo: intención de contratar. La oferta aprobada de ramita ya cubre institucionales, landings y trato independiente. |
| `landing pages para negocios Argentina desarrollo` | [Bianchi: landing pages](https://bdw.com.ar/servicios/landing-pages), [Manivela](https://manivela.com.ar/web) | Necesidad de una campaña, propuesta y acción de contacto; mantener ese encaje explícito. |
| `"desarrollador web freelance" "Argentina" sitios` | [Santiago Locaso](https://sltweb.com.ar/), [Liao: presentación](https://liao.com.ar/about) | Trato personal y evidencia de trabajos; respaldar con los dos casos reales y sus responsabilidades, sin CV como propuesta. |
| `"diseño web" "Argentina" "institucionales"` | [Amalia: sitio institucional](https://amaliacasacreativa.com.ar/servicios/desarrollo-web/sitio-institucional/) | Presentación de actividad, confianza y consulta; caso Residencias aporta evidencia contextual real. |
| `"cuánto cuesta" "página web" "Argentina"` | [FrandoWeb](https://frandoweb.com.ar/cuanto-cuesta-hacer-una-pagina-web), [RosDigital](https://rosdigital.net/precios/) | Investigación previa a contratar; no inventar precios/plazos. La orientación de contacto ya puede ayudar a precisar alcance. |

También se probaron `rediseño de páginas web Argentina freelance` y `"rediseño web" "Argentina" servicio`; la muestra combinada no entregó evidencia suficientemente específica para priorizar una nueva página dedicada.

Recomendaciones de contenido **para aprobación, sin aplicación automática**: evaluar una mención factual de atención a clientes de Argentina/remota si Ramiro la confirma; mantener las tres aplicaciones de servicio y su relación con necesidades concretas; enriquecer casos sólo con evidencia nueva comprobable. No hay datos actuales que justifiquen páginas separadas de cada servicio, ciudades, blog o FAQ. Una futura página de servicio requiere demanda/consultas reales, contenido propio suficiente, traducciones y mantenimiento adicional. Visibilidad externa legítima: enlazar el sitio en perfiles propios y solicitar atribución contextual en casos publicados sólo con permiso del cliente; sin enlaces comprados ni reseñas inventadas.

No se agrega GA4 ni otro identificador: primero Search Console/Bing y luego decisión explícita de medición de conversiones y privacidad. No se emitió una conclusión jurídica sobre cookies o normativa argentina.
