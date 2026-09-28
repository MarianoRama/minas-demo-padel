# Pádel Minas Club — Demo de portafolio

Landing page **demo** para un club ficticio en Minas, Uruguay. Permite elegir
cancha, proponer fecha y hora, revisar una solicitud y enviarla por WhatsApp
cuando se configura un contacto real.

"Pádel Minas Club" es un **club ficticio**, creado solo para esta demo. No
representa a ningún negocio real.

## Reservas y membresías

El formulario prepara una solicitud con cancha, fecha, hora y datos de
contacto. No consulta disponibilidad ni confirma una reserva. Sin un número
real en `VITE_WHATSAPP_NUMBER`, el mensaje se muestra para copiar.

No se publican paquetes ni precios de membresía de ejemplo. La página explica
el circuito esperado: consulta, pago verificado, acreditación de saldo y
descuento al confirmar la reserva. Este demo no procesa pagos ni acredita
créditos. Ver [ARCHITECTURE.md](ARCHITECTURE.md) para una propuesta mínima de
integración real.

La foto de la portada es ilustrativa y no corresponde al club: Ashford Marx,
[Unsplash](https://unsplash.com/photos/Stb4Tx7YqXI).

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

- `src/components/` — Header, Hero, Courts, BookingRequest, Memberships,
  WhatsAppButton, Footer.
- `src/data/` — canchas y horarios de referencia.

## Datos de ejemplo

Los datos de ejemplo, incluidos nombre del club, canchas, precios y dirección,
son **ficticios**, solo para ilustrar el diseño y la funcionalidad.
