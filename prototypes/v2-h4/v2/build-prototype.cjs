// Generates review-only static HTML. No script is shipped in the pages.
const fs = require('node:fs');
const path = require('node:path');
const base = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const palettes = {
 dark: [['Naranja','#FF9B58'],['Celeste','#78CFFC'],['Fucsia','#F58ACD'],['Verde lima','#C4E773'],['Blanco','#F1F0EC']],
 light: [['Verde oscuro','#176844'],['Azul','#1C57BE'],['Rojo','#B23B35'],['Violeta','#6D42AA'],['Negro','#202421']]
};
function appearance(theme){
 return `<details class="appearance"><summary>Aspecto</summary><div class="appearance-panel"><p class="utility-label">Theme</p><div class="theme-links"><a href="iteration2-dark.html" ${theme==='dark'?'aria-current="page"':''}>Dark</a><a href="iteration2-light.html" ${theme==='light'?'aria-current="page"':''}>Light</a></div><p class="utility-label">Accent · muestra estática</p><div class="accent-options">${palettes[theme].map(([name,color],i)=>`<span class="accent-option ${!i?'selected':''}" style="--swatch:${color}" role="img" aria-label="${name}${!i?', seleccionado':''}"><span aria-hidden="true">${!i?'✓':''}</span></span>`).join('')}</div><a class="specimen-link" href="accents.html#${theme}">Comparar candidatos</a></div></details>`;
}
for(const theme of ['dark','light']){
 let html=base.replace('<html lang="es">',`<html lang="es" data-theme="${theme}">`)
 .replace('V2-H4 · Prototipo DRAFT',`V2-H4 · Iteración 2 · ${theme} · DRAFT`)
 .replace('<link rel="stylesheet" href="styles.css">','<link rel="stylesheet" href="../styles.css">\n  <link rel="stylesheet" href="iteration.css">');
 html=html.replace('</span>\n      </nav>','</span>\n      </nav>\n      <div class="desktop-appearance">'+appearance(theme)+'</div>');
 html=html.replace('</div>\n        </nav>', '</div>\n          '+appearance(theme)+'\n        </nav>');
 html=html.replace(/<div class="process">[\s\S]*?<\/div>\n      <div class="profile-links">/,`<div class="process"><h3>Cómo trabajo</h3><div class="process-prose">
        <p><strong>Entender</strong> qué necesitás y en qué contexto. <strong>Definir</strong> juntos la estructura y el alcance.</p>
        <p><strong>Diseñar</strong> la interfaz y <strong>desarrollar</strong> una web funcional a partir de ella.</p>
        <p><strong>Revisar</strong> responsive, accesibilidad y performance. <strong>Publicar y comprobar</strong> la entrega en su entorno público.</p>
      </div><p class="process-note">Si el diseño es externo, reviso el material y los faltantes acordados.</p></div>
      <div class="profile-links">`);
 html=html.replace('<div class="copy-row">','<p class="whatsapp"><a href="https://wa.me/5491151354489">Escribime por WhatsApp</a><span>+54 9 11 5135-4489</span></p>\n      <div class="copy-row">');
 html=html.replace(/<aside class="review-note"[\s\S]*?<\/aside>/,`<aside class="review-note" aria-label="Nota de prototipo">V2-H4 · Iteración 2 · Copy DRAFT · Capturas pendientes · <a href="${theme==='dark'?'iteration2-light.html':'iteration2-dark.html'}">Ver ${theme==='dark'?'light':'dark'}</a> · <a href="accents.html">Accents candidatos</a> · <a href="../index.html">Comparar iteración 1</a></aside>`);
 fs.writeFileSync(path.join(__dirname,theme==='dark'?'iteration2-dark.html':'iteration2-light.html'),html);
}
let specimen=`<!doctype html><html lang="es" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>V2-H4 — Diez accents aprobados</title><link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="iteration.css"></head><body><main><div class="rail specimen-intro"><a href="iteration2-dark.html">Home dark</a> · <a href="iteration2-light.html">Home light</a><h1>Accents aprobados</h1><p>Diez valores aprobados para light y dark. Espécimen estático, no configurador. Cada fila muestra enlace, CTA, foco y selección.</p></div>`;
for(const theme of ['dark','light']){
 specimen+=`<section class="palette-section" data-theme="${theme}" id="${theme}"><div class="rail"><h2>${theme==='dark'?'Dark':'Light'}</h2><p class="palette-description">Default: ${palettes[theme][0][0].toLowerCase()}. Comparación de cinco accents aprobados.</p><div class="palette-rows">`;
 for(const [name,color] of palettes[theme])specimen+=`<article class="palette-row" style="--accent:${color}"><h3>${name}<small>${color}</small></h3><div class="palette-examples"><a href="${theme==='dark'?'iteration2-dark.html':'iteration2-light.html'}#contacto">Enlace de contacto</a><a class="cta" href="${theme==='dark'?'iteration2-dark.html':'iteration2-light.html'}#contacto">Hablemos</a><a class="focus-example" href="${theme==='dark'?'iteration2-dark.html':'iteration2-light.html'}#contacto">Foco visible</a><span class="selected-example"><span aria-hidden="true">✓</span> Seleccionado</span></div></article>`;
 specimen+='</div></div></section>';
}
specimen+='</main></body></html>';fs.writeFileSync(path.join(__dirname,'accents.html'),specimen);
