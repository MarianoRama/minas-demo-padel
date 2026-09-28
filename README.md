# Pádel Minas Club — Demo de portafolio

Landing page **demo** para mostrar una propuesta de sitio responsive para un
club de pádel en Minas, Uruguay, con consultas de horarios por WhatsApp.

"Pádel Minas Club" es un **club ficticio**, creado solo para esta demo. No
representa a ningún negocio real.

## La agenda es ilustrativa

La persona elige fecha, cancha y hora y puede preparar una consulta. WhatsApp
se habilita al configurar el número real del negocio mediante
`VITE_WHATSAPP_NUMBER` (formato internacional, solo dígitos: `598` seguido de
ocho dígitos). Sin ese dato, el mensaje queda disponible para copiar. Los
horarios son ejemplos: no hay disponibilidad en tiempo real ni se confirman
reservas.

## Stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) (vía `@tailwindcss/vite`)

## Cómo correrlo

```bash
npm ci
npm run dev
```

Abre `http://localhost:5173`.

Para generar el build de producción:

```bash
npm run build
npm run preview
```

## Estructura

- `src/components/` — Header, Hero, Courts, Booking (consultas), Pricing,
  WhatsAppButton, Footer.
- `src/data/` — canchas, horarios y precios ilustrativos.

## Datos de ejemplo

Los datos de ejemplo, incluidos nombre del club, canchas, precios y dirección,
son **ficticios**, solo para ilustrar el diseño y la funcionalidad.
