/*
  LivingSoiLL — Generador del snapshot de muestras IoT
  =====================================================
  Genera el fichero data/iot_muestras.json que usa el visor para pintar las
  gráficas de cada sensor (humedad y temperatura de suelo, temperatura del aire).

  CÓMO USARLO (1 minuto):
    1. Inicia sesión en https://livinglabandalucia.ujaen.es
    2. Abre la página del IoT:  https://livinglabandalucia.ujaen.es/iot/listado
    3. Abre la consola del navegador (tecla F12 -> pestaña "Console").
    4. Pega TODO este archivo y pulsa Enter.
    5. Se descargará "iot_muestras.json" en tu carpeta de Descargas.
    6. Ejecuta scripts/actualizar_muestras.ps1 (o copia el fichero a data/ y
       haz commit/push) para publicarlo.

  Nota: se usa la sesión del navegador (cookies) porque la API del IoT no
  admite CORS ni acceso externo; por eso este paso es manual.
*/
(async () => {
  const today = new Date().toISOString().slice(0, 10);            // fecha de hoy YYYY-MM-DD
  const sens = await (await fetch('/se/v2/iot/sensors', { credentials: 'include' })).json();
  const items = sens.items || sens;
  const r = (v, n) => (v == null ? null : Number(v.toFixed(n)));
  const out = {};
  for (const s of items) {
    try {
      const j = await (await fetch(
        `/se/v2/iot/sensors/${encodeURIComponent(s.idapi)}/window?target_date=${today}`,
        { credentials: 'include' }
      )).json();
      const its = j.items || [];
      // Reducimos a una muestra cada 6 horas (00:00, 06:00, 12:00, 18:00)
      const pick = its.filter(it => { const hh = +it.t.slice(11, 13), mm = +it.t.slice(14, 16); return mm === 0 && hh % 6 === 0; });
      const last = its.length ? its[its.length - 1] : null;
      out[s.idapi] = {
        exps: s.finca_id, zona: s.tratado ? 'test' : 'control', range: [j.range_start, j.range_end],
        t: pick.map(p => p.t.slice(5, 16)),
        wc20: pick.map(p => r(p.wc20cm, 3)), wc50: pick.map(p => r(p.wc50cm, 3)),
        st20: pick.map(p => r(p.st20cm, 1)), st50: pick.map(p => r(p.st50cm, 1)),
        at: pick.map(p => r(p.at, 1)),
        last: last ? {
          t: last.t, wc20: r(last.wc20cm, 3), wc50: r(last.wc50cm, 3),
          st20: r(last.st20cm, 1), st50: r(last.st50cm, 1), at: r(last.at, 1),
          vpd: r(last.vpd, 2), ap: r(last.ap, 1), pc: r(last.pc, 2)
        } : null
      };
      console.log('ok', s.idapi);
    } catch (e) {
      out[s.idapi] = { error: String(e) };
      console.warn('error en', s.idapi, e);
    }
  }
  const blob = new Blob([JSON.stringify(out)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'iot_muestras.json';
  document.body.appendChild(a); a.click(); a.remove();
  console.log('Descargado iot_muestras.json con', Object.keys(out).length, 'sensores.');
})();
