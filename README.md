# Living Soill — Fincas Experimentales

Visor interactivo (Leaflet + datos embebidos) de las 16 fincas experimentales del proyecto Living Soill, con sus zonas TEST/CONTROL y vértices.

## Estructura

```
C:\LIVINGSOILL\
├── index.html      # App completa (HTML + CSS + JS + datos embebidos)
├── start.bat       # Lanzador para Windows (doble clic)
├── start.ps1       # Lanzador equivalente para PowerShell
└── README.md
```

> El HTML original (`living_soill_fincas_experimentales_interactivo (1).html` en `Downloads`) se ha copiado tal cual a `index.html`. Lleva el CSS, el JavaScript, el logo y los datos geográficos en línea, así que no necesita ninguna otra dependencia local.

## Cómo abrirlo

**No abras `index.html` haciendo doble clic.** Al cargarse con `file://`, muchos navegadores bloquean Leaflet (tiles de OpenStreetMap), las fuentes y la geolocalización por CORS, y la página se ve rota.

Usa el lanzador:

1. Doble clic en **`start.bat`** (o ejecuta `.\start.ps1` desde PowerShell).
2. Se abrirá automáticamente <http://localhost:8765/index.html> en tu navegador por defecto.
3. Para detener el servidor: vuelve a la ventana de consola y pulsa `Ctrl+C`.

El lanzador usa, en este orden:

- `py -3 -m http.server` (Python launcher, ya disponible en este equipo)
- `python -m http.server`
- `npx http-server` (si solo tienes Node.js)

## Funcionalidad

- Mapa Leaflet centrado sobre España con las 16 fincas.
- **Buscador** libre (nombre, municipio, código EXPS) y **filtro por provincia** en la barra lateral.
- Capas conmutables: TEST / CONTROL / Vértices / Muestreo / Sensores / **Erosión**.
- **Capa de erosión (RUSLE)**: colorea cada finca por su nivel de pérdida de suelo (baja / moderada / alta / muy alta) con su leyenda; permite comparar todas las fincas de un vistazo.
- **Resumen del proyecto** en la barra lateral (nº de fincas, fincas actuadas, sensores IoT y erosión media), calculado en vivo a partir de los datos.
- Botón **Ver todas** para encuadrar el mapa y reiniciar filtros, y botón **Descargar CSV** para exportar las coordenadas de todos los vértices.
- Ficha de cada finca con **Analítica de suelo** (pH, carbonatos, conductividad, nitrógeno, densidad aparente, fragmentos gruesos, textura) y **erosión RUSLE** (t/ha·año) con su clasificación de severidad.
- Ficha de cada finca con **Soluciones aplicadas** (compost de alpeorujo/estiércol, biochar, cubiertas vegetales, hidroinfiltradores…), **inversión (fase 1)** y **Sensores IoT** (zona test/control, altitud y periodo de lecturas).
- Galerías de **fotos de muestreo** (una por punto, campaña 2025) y de **aplicación de soluciones**, con visor a pantalla completa (flechas, teclado y contador).
- **Enlaces compartibles**: el visor refleja la finca abierta en la URL (p. ej. `…/index.html#EXPS05`); abrir ese enlace selecciona y centra directamente esa finca.
- Botón **Resumen por finca (CSV)** que exporta una tabla con provincia, municipio, estado de actuación, nº de sensores y erosión (RUSLE) por finca.
- **Accesibilidad**: navegación por teclado del listado y galerías, `Esc` para cerrar la ficha, textos alternativos en las fotos y foco visible.
- Los **sensores de suelo** se dibujan en el mapa (icono de antena, verde=test / rojo=control) y aparecen al acercar el zoom a una parcela (ocultos en la vista general para no tapar la selección de fincas).
- Al seleccionar una finca, la ficha se reparte en **tres paneles** sobre el mapa: **izquierda** (información de la parcela: zonas, problemas encontrados, analítica de suelo + erosión y soluciones aplicadas), **inferior** (datos de los sensores: tabla de sensores, valores actuales y gráficas de muestras) y **derecha** (galerías de fotos). En móvil los tres se combinan en una sola ficha a pantalla completa. El control de capas y la leyenda se sitúan arriba a la derecha para dejar sitio a los paneles.
- Las **muestras de cada sensor** (gráficas de humedad y temperatura de suelo a 20 cm y temperatura del aire, comparando test vs control) se pintan en el panel inferior. Los datos son un snapshot semanal (cada 6 h) guardado en [`data/iot_muestras.json`](data/iot_muestras.json), extraído de la API del IoT (`/se/v2/iot/sensors/{id}/window`). Se usa un snapshot porque esa API no admite CORS y requiere sesión, por lo que el visor no puede consultarla en vivo; para actualizar las muestras hay que regenerar ese JSON.

## Datos de soluciones aplicadas e IoT

- **Soluciones aplicadas** (objeto `SOLUCIONES` en el HTML): extraídas de los `Registro actuaciones.xlsx` de cada finca en Drive.
  - Con datos propios: EXPS01 (CAAND), EXPS02 (NUTESCA), EXPS09 (IFAPA), EXPS14 (NUTESCA).
  - EXPS04/06/08 (UJA) comparten un registro común (`EXP3456`); EXPS03 (JAENCOOP) solo contiene una copia de ese registro común.
  - Sin registro en Drive: EXPS05 (Villacarrillo), EXPS13 (Antequera), EXPS15 (Olvera).
  - **Sin actuación**: EXPS07 Adamuz, EXPS10 La Rinconada, EXPS11 Utrera, EXPS12 Hinojos, EXPS16 Villatorres.
- **Sensores IoT** (objeto `IOT` en el HTML): 30 sensores `z6-*` (15 fincas × test+control) de `livinglabandalucia.ujaen.es/iot` (API `/se/v2/iot/sensors`). EXPS16 (Villatorres) no tiene sensores.
- **Muestras de los sensores** ([`data/iot_muestras.json`](data/iot_muestras.json)): snapshot semanal (cada 6 h) de humedad y temperatura de suelo (20/50 cm), temperatura del aire, VPD, presión y precipitación, por sensor. Se pinta como mini-gráficas en la ficha de cada finca.

## Actualizar las muestras (snapshot periódico)

Las muestras **no son en tiempo real**: son un snapshot que hay que regenerar de vez en cuando (p. ej. semanalmente). No se puede automatizar del todo porque la API del IoT requiere sesión iniciada y no admite acceso externo (CORS), así que el paso de descarga es manual desde el navegador:

1. Inicia sesión en <https://livinglabandalucia.ujaen.es> y abre `/iot/listado`.
2. Abre la consola del navegador (**F12 → Console**), pega el contenido de [`scripts/generar_muestras.js`](scripts/generar_muestras.js) y pulsa Enter. Se descargará `iot_muestras.json`.
3. Ejecuta [`scripts/actualizar_muestras.ps1`](scripts/actualizar_muestras.ps1) (lo copia a `data/` y hace commit + push).

> Consejo: puedes guardar `scripts/generar_muestras.js` como **marcador/bookmarklet** para regenerarlo con un clic mientras tengas la sesión abierta.

## Notas técnicas

- Datos: 16 fincas · 42 zonas · 427 vértices, embebidos en el `<script>` final del HTML.
- Leaflet 1.9.4 se carga por CDN (`unpkg.com`), así que se necesita conexión a Internet la primera vez.
- Si quieres usarlo totalmente offline, descarga manualmente `leaflet.js` y `leaflet.css` desde unpkg y reemplaza los enlaces del `<head>` por rutas locales.
