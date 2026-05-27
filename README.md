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
- Filtros por provincia, finca y búsqueda libre (nombre, municipio, EXPS).
- Capas conmutables: TEST / CONTROL / Vértices / Numeración de vértices.
- Botón **Ver todas las fincas** para encuadrar el mapa.
- Botón **Descargar vértices CSV** para exportar todas las coordenadas.

## Notas técnicas

- Datos: 16 fincas · 42 zonas · 427 vértices, embebidos en el `<script>` final del HTML.
- Leaflet 1.9.4 se carga por CDN (`unpkg.com`), así que se necesita conexión a Internet la primera vez.
- Si quieres usarlo totalmente offline, descarga manualmente `leaflet.js` y `leaflet.css` desde unpkg y reemplaza los enlaces del `<head>` por rutas locales.
