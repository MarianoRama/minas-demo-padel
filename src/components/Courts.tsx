import type { Cancha } from "../data/types"
import { canchasActivas } from "../data/useDatos"
import CourtIllustration from "./CourtIllustration"
import { useReveal, revealClass } from "../hooks/useReveal"

interface CourtsProps {
  canchas: Cancha[]
  onVerHorario: (courtId: string) => void
}

function CourtRow({ court, index, onVerHorario }: { court: Cancha; index: number; onVerHorario: (id: string) => void }) {
  const { ref, visible } = useReveal<HTMLDivElement>(index * 70)
  const invertida = index % 2 === 1

  return (
    <div
      ref={ref}
      className={`reveal group grid items-center gap-8 border-t border-cancha-900/10 py-10 first:border-t-0 lg:grid-cols-[280px_1fr] ${
        invertida ? "lg:[&>*:first-child]:order-2" : ""
      } ${revealClass(visible)}`}
    >
      <div className="relative overflow-hidden transition-transform duration-300 ease-out group-hover:-translate-y-1">
        <span className="cinta cinta-tl" aria-hidden="true" />
        <span className="cinta cinta-br" aria-hidden="true" />
        {court.foto ? (
          <img
            src={court.foto}
            alt={court.nombre}
            className="h-56 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] lg:h-64"
          />
        ) : (
          <CourtIllustration
            variant={court.tipo}
            className="h-56 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] lg:h-64"
          />
        )}
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-cancha-900">
            {court.nombre}
          </h3>
          <span
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wide ${
              court.tipo === "cubierta" ? "bg-cancha-800/10 text-cancha-800" : "bg-ladrillo-600/10 text-ladrillo-700"
            }`}
          >
            {court.tipo === "cubierta" ? "Cubierta" : "Aire libre"}
          </span>
        </div>
        <p className="mt-3 max-w-xl text-base text-ink-700">{court.detalle}</p>
        <a
          href="#agenda"
          onClick={() => onVerHorario(court.id)}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-ladrillo-600"
        >
          Ver horarios de esta cancha
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

function Courts({ canchas, onVerHorario }: CourtsProps) {
  const { ref: headRef, visible: headVisible } = useReveal<HTMLDivElement>()
  const activas = canchasActivas(canchas)

  return (
    <section id="canchas" className="bg-hueso-50 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div ref={headRef} className={`reveal max-w-xl ${revealClass(headVisible)}`}>
          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-cancha-900 sm:text-5xl">
            Tres canchas, tres estilos
          </h2>
          <p className="mt-3 text-base text-ink-700">
            Panorámicas, techadas y siempre bien mantenidas. Llueva o haga sol, hay
            cancha para el partido.
          </p>
        </div>

        <div>
          {activas.map((court, i) => (
            <CourtRow key={court.id} court={court} index={i} onVerHorario={onVerHorario} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Courts
