# Arquitectura mínima para habilitar reservas y membresías

El sitio actual es estático. Las solicitudes y mensajes se construyen en el
navegador; no hay agenda compartida, cuentas, pagos ni confirmaciones.

## Reservas

Para aceptar reservas reales, el sitio necesita una API y una base de datos
que sean la fuente de verdad para canchas, horarios, precios y reservas. La
API debe volver a consultar el horario y bloquear la franja dentro de una
transacción al confirmar, para que dos personas no ocupen la misma cancha y
hora. Los estados deben distinguir al menos `solicitada`, `pendiente de
confirmación`, `confirmada` y `cancelada`. Solo el estado confirmado se
presenta como reserva.

Un primer lanzamiento puede conservar la aprobación manual: la web registra
la solicitud y el personal confirma el horario. Una página pública no debe
marcar disponibilidad basándose en un calendario local del navegador.

## Membresías con saldo

La sección interactiva actual es una simulación local: empieza con tres
créditos ficticios, asigna uno a cada turno de una hora y devuelve ese crédito
al cancelar una reserva activa. El estado vive únicamente en memoria del
navegador y se pierde al recargar. No crea una reserva real, no bloquea una
cancha y no representa un pago ni una membresía ofrecida por el club.

La membresía debe tener condiciones definidas por el club. El sistema guarda
un libro de créditos asociado a una persona y a un pago. Un proveedor externo
procesa el pago; una API del servidor valida la firma de su notificación y
registra el pago una sola vez. Recién entonces acredita el saldo. Cuando una
reserva se confirma, otra transacción descuenta los créditos. Cancelaciones y
devoluciones requieren movimientos compensatorios en el libro de créditos.
Las comprobaciones de saldo, la prevención de duplicados y la devolución deben
ser atómicas en el servidor; el navegador solo presenta el resultado. El club
también debe definir precio, vigencia, reglas de cancelación y cuándo un crédito
se consume. No se debe editar el saldo a mano ni activarlo desde el navegador.

## Datos, privacidad y despliegue

- Mantener credenciales, claves de firma y secretos únicamente en el servidor.
- Validar y limitar los datos de contacto recibidos; guardar solo lo necesario
  y definir un plazo de eliminación.
- Registrar las transiciones de estado y hacer idempotentes los webhooks.
- Conectar el botón de WhatsApp solo cuando el club entregue un número real.
- Elegir proveedor de pagos y calendario con el club antes de implementar la
  integración; no hay un proveedor conectado en este demo.

## Identidad y área privada

Una membresía real empieza con registro o inicio de sesión y correo verificado. El saldo y las reservas deben pertenecer al identificador de esa cuenta, nunca al nombre escrito en un formulario ni a datos modificables en el navegador. Cada consulta debe autorizarse en el servidor: un socio solo ve sus reservas, mientras que el personal autorizado puede administrar la agenda. Cerrar sesión debe retirar de pantalla los datos privados.

Flujo: cuenta verificada → pago pendiente → pago validado en el servidor → saldo disponible → reserva confirmada. Una vuelta del navegador desde una pantalla de pago no prueba que se pagó. La implementación requiere un servicio de autenticación y una base de datos conectados; GitHub Pages solo sirve la interfaz. La demo pública no incluye todavía ese servicio y no ofrece una pantalla de acceso ficticia.

Referencias evaluadas: https://github.com/supabase/supabase/tree/master/examples/user-management y https://github.com/nextjs/saas-starter. Son ejemplos de arquitectura, no integraciones ya realizadas. El antiguo https://github.com/vercel/nextjs-subscription-payments está archivado y no se propone como base nueva.
