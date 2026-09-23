// Review-only static HTML; no JavaScript is shipped in the Home variants.
const fs = require('node:fs');
const path = require('node:path');
const dir = __dirname;

for (const [current, archive] of [['index.html', 'iteration2-dark.html'], ['light.html', 'iteration2-light.html']]) {
  const destination = path.join(dir, archive);
  if (!fs.existsSync(destination)) fs.copyFileSync(path.join(dir, current), destination);
}

function change(html, before, after) {
  if (!html.includes(before)) throw new Error(`Missing expected markup: ${before.slice(0, 70)}`);
  return html.replace(before, after);
}

const copyIcon = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="8" y="8" width="11" height="11" rx="1"></rect><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"></path></svg>';
const contact = `<div class="contact-data-row email-row">
        <a class="email" href="mailto:ramirogperucho@gmail.com">ramirogperucho<wbr>@gmail.com</a>
        <button class="copy-icon" type="button" aria-label="Copiar email" title="Copiar email">${copyIcon}</button>
      </div>
      <p class="channel-label">WhatsApp</p>
      <div class="contact-data-row phone-row">
        <a class="phone" href="https://wa.me/5491151354489">+54 9 11 5135-4489</a>
        <button class="copy-icon" type="button" aria-label="Copiar teléfono" title="Copiar teléfono">${copyIcon}</button>
      </div>
      <p class="contact-copy">`;

for (const [source, target, theme] of [['evidence-light.html', 'index.html', 'light'], ['evidence-dark.html', 'dark.html', 'dark']]) {
  let html = fs.readFileSync(path.join(dir, source), 'utf8');
  html = change(html, '<link rel="stylesheet" href="evidence.css">', '<link rel="stylesheet" href="evidence.css">\n  <link rel="stylesheet" href="iteration3.css">');
  html = change(html, '<span lang="pt" aria-disabled="true">PT</span>', '<span lang="pt" aria-disabled="true">PT</span><span lang="fr" aria-disabled="true">FR</span><span lang="ja" aria-disabled="true">日本語</span>');
  html = change(html, '<span lang="pt" aria-disabled="true">Português</span>', '<span lang="pt" aria-disabled="true">Português</span><span lang="fr" aria-disabled="true">Français</span><span lang="ja" aria-disabled="true">日本語</span>');
  html = change(html, '<h1 id="hero-title">Diseño y desarrollo de sitios web para presentar lo que hacés.</h1>', '<h1 id="hero-title">Diseño y desarrollo de sitios web para presentar tu <span class="rotating-word">proyecto</span></h1>');
  html = change(html, 'Soy Ramiro Garcia. Trabajo con vos desde la definición de tu web hasta su publicación, con un alcance acordado para tu proyecto.', 'Soy Ramiro Garcia. Trabajo con vos desde la definición hasta la publicación de tu web.');
  html = change(html, 'Según el alcance, puedo integrar adaptación a celulares, formularios y otras herramientas, SEO técnico, cuidado de la velocidad de carga y publicación.</p>', 'Según el alcance, puedo integrar adaptación a celulares, formularios y otras herramientas, SEO técnico, cuidado de la velocidad de carga y publicación.</p><p>Para negocios locales, puedo trabajar en el Perfil de Empresa de Google. También puedo preparar la estructura y el contenido para buscadores y asistentes de IA, sin prometer visibilidad.</p>');
  html = change(html, '<p class="case-status">Sitio institucional · En desarrollo</p>', '<p class="case-status">Sitio institucional · En desarrollo · <a class="case-link" href="https://residenciasgrupocasa.com.ar/" target="_blank" rel="noopener noreferrer">Ver sitio</a></p>');
  const oldContact = /<a class="email"[\s\S]*?<p class="contact-copy">/;
  if (!oldContact.test(html)) throw new Error(`Missing contact block in ${source}`);
  html = html.replace(oldContact, contact);
  html = html.replaceAll('href="evidence-dark.html"', 'href="dark.html"').replaceAll('href="evidence-light.html"', 'href="index.html"');
  html = html.replace(/<aside class="review-note"[\s\S]*?<\/aside>/, `<aside class="review-note" aria-label="Nota de prototipo">V2-H4 · Iteración 3 · Copy ES APPROVED · Controles de copia estáticos · <a href="${theme === 'light' ? 'dark.html' : 'index.html'}">Ver ${theme === 'light' ? 'dark' : 'light'}</a> · <a href="language-review/en.html">Pruebas de idiomas</a> · <a href="iteration2-${theme}.html">Comparar iteración 2</a></aside>`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>ramita.dev — V2-H4 · Iteración 3 · ${theme} · ES APPROVED</title>`);
  fs.writeFileSync(path.join(dir, target), html);
  if (theme === 'light') fs.writeFileSync(path.join(dir, 'light.html'), html);
}
