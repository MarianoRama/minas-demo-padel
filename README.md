# Pádel Minas Club — Demo de portafolio

Landing page **demo** para mostrar a dueños de clubes/canchas de pádel en
Minas, Uruguay lo que un freelancer puede ofrecer: sitio con identidad propia
y un sistema de reserva de turnos funcional en el frontend.

"Pádel Minas Club" es un **club ficticio**, creado solo para esta demo. No
representa a ningún negocio real.

## Identidad visual

- **Paleta**: azul cancha profundo (`cancha-*`), ladrillo/arcilla (`ladrillo-*`)
  y hueso/blanco cálido (`hueso-*`). Sin neón ni gradientes violeta.
- **Tipografías** (self-hosted vía `@fontsource`): "Big Shoulders Display"
  (títulos, estilo marcador deportivo) + "Inter" (texto).
- Ilustraciones de cancha 100% SVG propias (sin fotos externas).

## ⚠️ Importante: la agenda es solo frontend

La sección "Agenda" simula una agenda real, pero **no hay backend**:

- Los turnos "ocupados" de ejemplo se generan con un hash determinístico de
  fecha + cancha + hora (`src/data/schedule.ts`), así la agenda siempre se ve
  viva sin importar qué día se abra la demo, con más ocupación en el horario
  pico (18 a 21 hs).
- Los turnos de hoy que ya pasaron se bloquean automáticamente.
- Al reservar, se abre un panel/drawer que pide nombre y teléfono (validados),
  genera un código de reserva y ofrece "Avisar por WhatsApp" (mensaje
  prearmado) y "Agregar a calendario" (descarga un `.ics`).
- Todo se guarda en `localStorage` del navegador (clave con fecha absoluta,
  no offsets relativos) para sobrevivir un refresh. "Mis reservas" lista lo
  guardado en ese navegador, con cancelación mediante un diálogo propio.
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

- `src/components/` — Header, Hero, Booking (agenda + Mis reservas + modal de
  reserva), Courts, Pricing, Clases, LogoStrip, FAQ, Footer, WhatsAppButton,
  Dialog (modal accesible reutilizable), CourtIllustration (SVG cenital).
- `src/data/` — `courts.ts` (canchas), `schedule.ts` (horario y ocupación
  determinística), `booking.ts` (modelo de reserva, validaciones, WhatsApp,
  `.ics`, persistencia en `localStorage`).
- `src/hooks/useReveal.ts` — animación de aparición al hacer scroll (respeta
  `prefers-reduced-motion`).
- `src/config.ts` — datos del autor de la demo (nombre, WhatsApp, texto del
  footer). Es el único lugar que hay que tocar para cambiarlos.

## Cambiar datos del negocio o fotos

- **Canchas**: editar `src/data/courts.ts`. Cada cancha tiene un campo
  opcional `foto?: string` — si se completa con una URL/ruta de imagen real,
  se puede usar en lugar de la ilustración SVG (hoy no hay foto real, así que
  se muestra la ilustración).
- **Horarios y precio**: `src/data/schedule.ts` (`HOURS`, `PRICE_PER_HOUR`) y
  `Pricing.tsx` (planes).
- **WhatsApp del club**: número y mensaje en `WhatsAppButton.tsx`,
  `Clases.tsx` y `Footer.tsx`.
- **Autor / crédito del footer**: `src/config.ts`.
- **Mapa**: el `iframe` de Google Maps está en `Footer.tsx`. En el sandbox de
  desarrollo puede no cargar (red bloqueada); en producción funciona normal.

## Deploy

- **Vercel**: importar el repo, framework "Vite", sin configuración extra.
- **Netlify**: build command `npm run build`, publish directory `dist`.
- **GitHub Pages / subcarpetas**: `vite.config.ts` ya tiene `base: './'`.

## Datos de ejemplo

Todos los datos (nombre del club, canchas, precios, número de WhatsApp
`+598 99 000 000`, dirección, marcas de la cinta de sponsors) son
**ficticios**, solo para ilustrar el diseño y la funcionalidad.
