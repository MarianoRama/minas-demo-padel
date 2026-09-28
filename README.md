# Pádel Minas Club: demo de portafolio

Landing page **demo** para mostrar a dueños de clubes/canchas de pádel en
Minas, Uruguay lo que un freelancer puede ofrecer: sitio con identidad propia,
reserva de turnos funcional y un panel de administración para que el club
edite sus propios datos.

"Pádel Minas Club" es un **club ficticio**, creado solo para esta demo. No
representa a ningún negocio real.

## Identidad visual

- **Paleta**: azul cancha profundo (`cancha-*`), ladrillo/arcilla (`ladrillo-*`)
  y hueso/blanco cálido (`hueso-*`). Sin neón ni gradientes violeta.
- **Tipografías** (self-hosted vía `@fontsource`): "Big Shoulders Display"
  (títulos), "Inter" (texto), "Caveat" y "Permanent Marker" (detalles a mano:
  el aviso pegado en la portada, el pizarrón de precios, el ranking).
- Ilustraciones de cancha 100% SVG propias. Texturas de papel/tiza también en
  SVG inline, sin imágenes externas.

## Panel de administración (`#/admin`)

El dueño del club entra a `tusitio.com/#/admin`, ingresa el PIN de
demostración **1234** y puede editar, sin tocar código:

- **Canchas**: nombre, tipo, descripción, detalle, foto (se sube desde el
  celular y se redimensiona sola) y estado Activa/Pausada.
- **Precios**: cualquier plan (turno suelto, bonos, socio, lo que sea).
- **Horario del club**: apertura y cierre por día, y la duración del turno
  (60 o 90 minutos). La agenda pública usa exactamente estos datos.
- **Clases y torneos**: título, día, hora, profe, precio, cupos, foto y
  estado Activo/Pausado.
- **Ranking del torneo social**: parejas y puntos, se ordena solo.
- **Datos del negocio**: WhatsApp, dirección y el aviso que aparece pegado
  en la portada (ej. "Torneo social el sábado 12, anotate").
- **Agenda**: ver las reservas hechas en ese navegador por día (nombre,
  teléfono, código), cancelarlas, y bloquear turnos o días completos
  (mantenimiento, torneo). Un turno bloqueado se ve como "Bloqueado" en la
  agenda pública.
- **Copia de los datos**: descargar/cargar un JSON y volver a los datos de
  ejemplo.

Es una demo sin backend: todo se guarda en `localStorage` con la clave
`padel-minas-club.datos.v1`. En un sitio real, el acceso al panel se hace con
una cuenta de Google (si los datos viven en una planilla) o con un login de
verdad en un backend (ej. Supabase); el PIN es solo para esta demostración.

### Fuente de datos opcional: Google Sheets

En `src/config.ts`, `FUENTE_DATOS` puede ser `{ tipo: 'local' }` (por
defecto, se edita desde el panel) o `{ tipo: 'sheets', csvUrl: '...' }` para
que "Clases y torneos" se lea de una planilla de Google publicada como CSV
(Archivo → Compartir → Publicar en la web → formato CSV). Columnas
esperadas, en cualquier orden: `id, titulo, tipo, dia, hora, profe, precio,
cupos, estado, foto` (`tipo` es `clase` o `torneo`; `estado` es `activo` o
`pausado`). Si el fetch falla, se usan los datos locales de ejemplo y se
muestra un aviso. Con esta fuente activa, el panel deja de mostrar el
formulario y muestra el link a la planilla.

## Importante: la agenda de reservas es solo frontend

- Los turnos "ocupados" de ejemplo se generan con un hash determinístico de
  fecha + cancha + hora (`src/data/schedule.ts`), así la agenda siempre se ve
  viva sin importar qué día se abra la demo, con más ocupación en el horario
  pico (18 a 21 hs).
- Los turnos de hoy que ya pasaron se bloquean automáticamente; los que
  bloqueó el club desde el panel se ven como "Bloqueado".
- Al reservar, se abre un panel/drawer que pide nombre y teléfono (validados),
  genera un código de reserva y ofrece "Avisar por WhatsApp" (mensaje
  prearmado) y "Agregar a calendario" (descarga un `.ics`).
- Todo se guarda en `localStorage` del navegador para sobrevivir un refresh.
  "Mis reservas" lista lo guardado en ese navegador, con cancelación mediante
  un diálogo propio, y se pagina de a 6.
- No hay servidor, base de datos, ni envío real de confirmaciones.

## Stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (vía `@tailwindcss/vite`, tokens
  en `src/index.css` con `@theme`)
- [@fontsource](https://fontsource.org/) para las tipografías (self-hosted)

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

Para generar el build de producción:

```bash
npm run build
npm run preview
```

## Estructura

- `src/components/` — sitio público: Header, Hero, Booking (agenda + Mis
  reservas + modal de reserva), Courts, Pricing, Clases, Ranking, LogoStrip,
  FAQ, Footer, WhatsAppButton, Pagination, Dialog (modal accesible
  reutilizable), CourtIllustration (SVG cenital).
- `src/admin/` — panel de administración: login por PIN, una sección por
  colección, componentes de formulario compartidos en `ui.tsx`.
- `src/data/`:
  - `types.ts` — tipos de todas las colecciones editables.
  - `defaults.ts` — datos de ejemplo (lo que se ve la primera vez, y lo que
    vuelve si se usa "Volver a los datos de ejemplo").
  - `store.tsx` / `useDatos.ts` — `DatosProvider` + hook `useDatos()`:
    estado compartido, persistencia en `localStorage` y, opcionalmente,
    carga desde Google Sheets.
  - `csv.ts` — parser de CSV propio (comillas y comas dentro de campos).
  - `schedule.ts` — horas de turno a partir del horario del club, ocupación
    de ejemplo determinística.
  - `booking.ts` — modelo de reserva, validaciones, WhatsApp, `.ics`,
    persistencia de las reservas en `localStorage`.
- `src/hooks/useReveal.ts` — animación de aparición al hacer scroll.
- `src/hooks/useHashRoute.ts` — ruteo mínimo por hash para `#/admin`.
- `src/config.ts` — datos del autor de la demo y `FUENTE_DATOS`.

## Cambiar datos del negocio o fotos

Todo se cambia desde el panel (`#/admin`, PIN `1234`), sin tocar código: ver
la sección "Panel de administración" más arriba. Si preferís editar el
código directamente, los datos de ejemplo están en `src/data/defaults.ts`.

- **Autor / crédito del footer**: `src/config.ts` (`AUTOR`).
- **Mapa**: el `iframe` de Google Maps está en `Footer.tsx`. En el sandbox de
  desarrollo puede no cargar (red bloqueada); en producción funciona normal.

## Deploy

- **Vercel**: importar el repo, framework "Vite", sin configuración extra.
- **Netlify**: build command `npm run build`, publish directory `dist`.
- **GitHub Pages / subcarpetas**: `vite.config.ts` ya tiene `base: './'`.

## Datos de ejemplo

Todos los datos (nombre del club, canchas, precios, número de WhatsApp
`+598 99 000 000`, dirección, marcas de la cinta de sponsors, ranking) son
**ficticios**, solo para ilustrar el diseño y la funcionalidad.
