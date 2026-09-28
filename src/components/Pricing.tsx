const PLANS = [
  {
    name: "Por hora",
    price: "$1.200",
    period: "/ turno de 1 hora",
    features: ["Cancha a elección", "Paletas de préstamo", "Vestuarios incluidos"],
    highlighted: false,
  },
  {
    name: "Bono 10 turnos",
    price: "$10.500",
    period: "/ paquete de 10 horas",
    features: ["Ahorrás vs. pago por hora", "Válido 3 meses", "Reserva prioritaria"],
    highlighted: true,
  },
  {
    name: "Socio mensual",
    price: "$3.900",
    period: "/ mes",
    features: ["4 horas de cancha incluidas", "Descuento en horas extra", "Acceso a torneos internos"],
    highlighted: false,
  },
]

function Pricing() {
  return (
    <section id="precios" className="bg-neutral-950 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Precios</h2>
          <p className="mt-3 text-neutral-400 max-w-xl mx-auto">
          Valores ilustrativos en pesos uruguayos para esta demo; consultá las
          condiciones antes de jugar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border flex flex-col ${
                plan.highlighted
                  ? "bg-green-500 border-green-400 text-neutral-950 sm:-translate-y-2 shadow-xl shadow-green-500/20"
                  : "bg-neutral-900 border-white/10 text-white"
              }`}
            >
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-3xl font-extrabold">{plan.price}</span>
                <span
                  className={`text-sm ml-1 ${plan.highlighted ? "text-neutral-900/70" : "text-neutral-400"}`}
                >
                  {plan.period}
                </span>
              </div>
              <ul className="mt-6 space-y-2 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-sm flex items-start gap-2">
                    <span>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#reservar"
                className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-neutral-950 text-white hover:bg-neutral-800"
                    : "bg-green-500 text-neutral-950 hover:bg-green-400"
                }`}
              >
                Consultar horarios
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
