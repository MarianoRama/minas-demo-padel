import { useReveal, revealClass } from "../hooks/useReveal"

const PLANES = [
  {
    name: "Turno suelto",
    price: "$1.200",
    unidad: "por hora, cancha a elección",
    detalle: "Paletas de préstamo y vestuarios incluidos. Ideal si venís de vez en cuando.",
    destacado: false,
  },
  {
    name: "Bono 10 turnos",
    price: "$10.500",
    unidad: "paquete de 10 horas, válido 3 meses",
    detalle: "Un 12% más barato que pagar suelto, con reserva prioritaria en horarios pico.",
    destacado: true,
  },
  {
    name: "Socio mensual",
    price: "$3.900",
    unidad: "por mes",
    detalle: "4 horas de cancha incluidas + 15% de descuento en horas extra y acceso a torneos internos.",
    destacado: false,
  },
]

function Pricing() {
  const { ref: headRef, visible: headVisible } = useReveal<HTMLDivElement>()
  const { ref: tableRef, visible: tableVisible } = useReveal<HTMLDivElement>(70)

  return (
    <section id="precios" className="bg-cancha-900 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div ref={headRef} className={`reveal max-w-xl ${revealClass(headVisible)}`}>
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-ladrillo-400">
            Precios
          </p>
          <h2 className="mt-2 font-display text-4xl font-black uppercase tracking-tight text-hueso-50 sm:text-5xl">
            Sin letra chica
          </h2>
          <p className="mt-3 text-base text-hueso-100/75">
            Precios de referencia en pesos uruguayos para esta demo. En el club real, el bono y la
            membresía se pagan por transferencia o en caja.
          </p>
        </div>

        <div ref={tableRef} className={`reveal mt-10 divide-y divide-hueso-50/10 ${revealClass(tableVisible)}`}>
          {PLANES.map((plan) => (
            <div
              key={plan.name}
              className={`group -mx-4 grid gap-2 rounded-lg px-4 py-6 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-hueso-50/[0.08] hover:shadow-lg hover:shadow-cancha-950/30 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 ${
                plan.destacado ? "bg-hueso-50/[0.06]" : ""
              }`}
            >
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display text-xl font-bold uppercase tracking-wide text-hueso-50">
                    {plan.name}
                  </h3>
                  {plan.destacado && (
                    <span className="rounded-full bg-ladrillo-500 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-hueso-50">
                      El más elegido
                    </span>
                  )}
                </div>
                <p className="mt-1 max-w-md text-sm text-hueso-100/70">{plan.detalle}</p>
              </div>
              <div className="flex items-baseline gap-2 sm:flex-col sm:items-end sm:gap-0.5">
                <span className="font-display text-3xl font-black text-hueso-50">{plan.price}</span>
                <span className="text-xs text-hueso-100/60">{plan.unidad}</span>
              </div>
            </div>
          ))}
        </div>

        <a
          href="#agenda"
          className="mt-10 inline-flex min-h-[48px] items-center justify-center rounded-md bg-ladrillo-600 px-8 text-sm font-bold uppercase tracking-wide text-hueso-50 transition-colors hover:bg-ladrillo-700"
        >
          Reservar ahora
        </a>
      </div>
    </section>
  )
}

export default Pricing
