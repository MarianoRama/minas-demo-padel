# Pádel Minas Club — Demo de portafolio

Landing page **demo** para mostrar a dueños de clubes/canchas de pádel en
Minas, Uruguay lo que un freelancer puede ofrecer: sitio moderno y responsive
más un sistema de reserva de turnos funcional en el frontend.

"Pádel Minas Club" es un **club ficticio**, creado solo para esta demo. No
representa a ningún negocio real.

## ⚠️ Importante: la agenda es solo frontend

La sección "Reservar" simula una agenda real, pero **no hay backend**:

- Los turnos "ocupados" son datos de ejemplo hardcodeados en
  `src/data/schedule.ts`.
- Al reservar un turno disponible, la reserva se guarda con `useState` y se
  persiste en `localStorage` del navegador (para que sobreviva un refresh).
- No hay servidor, base de datos, ni envío real de confirmaciones. Es una
  demostración de experiencia de usuario, pensada para mostrarse en una
  reunión comercial.

## Stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) (vía `@tailwindcss/vite`)

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

- `src/components/` — Header, Hero, Courts, Booking (agenda), Pricing,
  WhatsAppButton, Footer.
- `src/data/` — datos de ejemplo: canchas y turnos ocupados hardcodeados.

## Datos de ejemplo

Todos los datos (nombre del club, canchas, precios, número de WhatsApp
`+598 99 000 000`, dirección) son **ficticios**, solo para ilustrar el
diseño y la funcionalidad.
