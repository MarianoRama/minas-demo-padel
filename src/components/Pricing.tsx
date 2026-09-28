import type { Precio } from "../data/types"
import { useReveal, revealClass } from "../hooks/useReveal"

interface PricingProps {
  precios: Precio[]
}

function Pricing({ precios }: PricingProps) {
  const { ref: headRef, visible: headVisible } = useReveal<HTMLDivElement>()
  const { ref: boardRef, visible: boardVisible } = useReveal<HTMLDivElement>(70)

  return (
    <section id="precios" className="bg-cancha-950 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div ref={headRef} className={`reveal max-w-xl ${revealClass(headVisible)}`}>
          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-hueso-50 sm:text-5xl">
            Lo que sale jugar
          </h2>
          <p className="mt-3 text-base text-hueso-100/75">
            El pizarrón de la entrada, tal cual lo tenemos colgado. Precios de
            referencia en pesos uruguayos; el bono y la membresía se pagan por
            transferencia o en caja.
          </p>
        </div>

        <div
          ref={boardRef}
          className={`reveal pizarron mt-10 px-6 py-8 sm:px-10 sm:py-10 ${revealClass(boardVisible)}`}
        >
          <div className="divide-y divide-hueso-50/15">
            {precios.map((plan) => (
              <div
                key={plan.id}
                className="group grid gap-2 py-6 transition-transform duration-300 ease-out first:pt-0 last:pb-0 hover:translate-x-1 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-hand text-2xl font-bold text-hueso-50 sm:text-3xl">{plan.nombre}</h3>
                    {plan.destacado && (
                      <span className="border border-ladrillo-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ladrillo-300">
                        El más elegido
                      </span>
                    )}
                  </div>
                  <p className="mt-1 max-w-md text-sm text-hueso-100/70">{plan.detalle}</p>
                </div>
                <div className="flex items-baseline gap-2 sm:flex-col sm:items-end sm:gap-0.5">
                  <span className="font-marker text-3xl text-hueso-50">{plan.precio}</span>
                  <span className="text-xs text-hueso-100/60">{plan.unidad}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <a
          href="#agenda"
          className="mt-10 inline-flex min-h-[48px] items-center justify-center bg-ladrillo-600 px-8 text-sm font-bold uppercase tracking-wide text-hueso-50 transition-colors hover:bg-ladrillo-700"
        >
          Reservar ahora
        </a>
      </div>
    </section>
  )
}

export default Pricing
