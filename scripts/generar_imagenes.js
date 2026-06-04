/*
  LivingSoiLL — Generador del manifiesto de imágenes (data/imagenes.json)
  =======================================================================
  Recorre las carpetas fotos/EXPSNN y fotos_soluciones/EXPSNN y escribe un
  índice { "1": {muestreo:[...], sol:[...]}, ... } que el visor usa para
  mostrar las imágenes SIN llamar a la API de GitHub (que tiene límite de
  peticiones). Ejecuta esto cada vez que añadas o quites imágenes del repo.

  Uso:  node scripts/generar_imagenes.js
*/
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const rx = /\.(jpe?g|png|webp|gif)$/i;
function listDir(d) {
  try { return fs.readdirSync(d).filter(f => rx.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })); }
  catch (e) { return []; }
}
const out = {};
for (let i = 1; i <= 16; i++) {
  const code = 'EXPS' + String(i).padStart(2, '0');
  out[String(i)] = {
    muestreo: listDir(path.join(root, 'fotos', code)),
    sol: listDir(path.join(root, 'fotos_soluciones', code)),
  };
}
fs.mkdirSync(path.join(root, 'data'), { recursive: true });
fs.writeFileSync(path.join(root, 'data', 'imagenes.json'), JSON.stringify(out));
console.log('data/imagenes.json actualizado.');
for (const k of Object.keys(out)) console.log('EXPS' + String(k).padStart(2, '0'), 'muestreo=' + out[k].muestreo.length, 'sol=' + out[k].sol.length);
