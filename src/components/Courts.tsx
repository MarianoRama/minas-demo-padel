import { courts } from "../data/courts"
import CourtIllustration from "./CourtIllustration"
import { useReveal, revealClass } from "../hooks/useReveal"

function CourtRow({ court, index }: { court: (typeof courts)[number]; index: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>(index * 70)
  const invertida = index % 2 === 1

  return (
    <div
      ref={ref}
      className={`reveal group grid items-center gap-8 border-t border-cancha-900/10 py-10 first:border-t-0 lg:grid-cols-[280px_1fr] ${
        invertida ? "lg:[&>*:first-child]:order-2" : ""
      } ${revealClass(visible)}`}
    >
      <div className="overflow-hidden rounded-xl transition-transform duration-300 ease-out group-hover:-translate-y-1">
        <CourtIllustration
          variant={court.type}
          className="h-56 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] lg:h-64"
        />
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-cancha-900">
            {court.name}
          </h3>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
              court.type === "cubierta"
                ? "bg-cancha-800/10 text-cancha-800"
                : "bg-ladrillo-600/10 text-ladrillo-700"
            }`}
          >
            {court.type === "cubierta" ? "Cubierta" : "Aire libre"}
          </span>
        </div>
        <p className="mt-3 max-w-xl text-base text-ink-700">{court.detalle}</p>
        <a
          href="#agenda"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-ladrillo-600"
        >
          Ver horarios disponibles
          <svg
            viewBox="0 0 16 16"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </a>
      </div>
    </div>
  )
}

function Courts() {
  const { ref: headRef, visible: headVisible } = useReveal<HTMLDivElement>()

  return (
    <section id="canchas" className="bg-hueso-50 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div ref={headRef} className={`reveal max-w-xl ${revealClass(headVisible)}`}>
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-ladrillo-600">
            Nuestras canchas
          </p>
          <h2 className="mt-2 font-display text-4xl font-black uppercase tracking-tight text-cancha-900 sm:text-5xl">
            Tres canchas, tres estilos
          </h2>
          <p className="mt-3 text-base text-ink-700">
            Panorámicas, techadas y siempre bien mantenidas — llueva o haga sol,
            hay cancha para tu partido.
          </p>
        </div>

        <div>
          {courts.map((court, i) => (
            <CourtRow key={court.id} court={court} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Courts
