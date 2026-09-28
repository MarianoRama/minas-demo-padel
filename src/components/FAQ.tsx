import { useReveal, revealClass } from "../hooks/useReveal"

const PREGUNTAS = [
  {
    q: "¿Tienen paletas para alquilar?",
    a: "Sí, en recepción prestamos paletas sin cargo si reservás con anticipación. Si sos socio mensual, siempre tenés una reservada.",
  },
  {
    q: "¿Qué pasa si llueve?",
    a: "La Cancha 1 es techada, así que el partido sigue igual. Si tenías reservada una cancha al aire libre, te reubicamos sin costo o te devolvemos la seña.",
  },
  {
    q: "¿Hasta cuándo puedo cancelar un turno?",
    a: "Podés cancelar sin costo hasta 3 horas antes desde \"Mis reservas\", acá mismo en la agenda. Pasado ese margen, se cobra el turno completo.",
  },
  {
    q: "¿Cómo pago?",
    a: "Efectivo, transferencia o tarjeta en el club. El bono de 10 turnos y la membresía mensual se abonan por adelantado.",
  },
]

function FAQ() {
  const { ref, visible } = useReveal<HTMLDivElement>()

  return (
    <section id="preguntas" className="bg-hueso-50 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div ref={ref} className={`reveal ${revealClass(visible)}`}>
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-ladrillo-600">
            Preguntas frecuentes
          </p>
          <h2 className="mt-2 font-display text-4xl font-black uppercase tracking-tight text-cancha-900 sm:text-5xl">
            Lo que siempre preguntan
          </h2>
        </div>

        <div className="mt-8 divide-y divide-cancha-900/10 border-t border-cancha-900/10">
          {PREGUNTAS.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-ink-900 marker:content-none">
                {item.q}
                <svg
                  viewBox="0 0 16 16"
                  className="h-4 w-4 shrink-0 text-ladrillo-600 transition-transform duration-300 group-open:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" d="M8 3v10M3 8h10" />
                </svg>
              </summary>
              <p className="mt-2 max-w-2xl text-sm text-ink-700">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
