import { useRef, useState } from "react"
import type { ClaseTorneo, Negocio } from "../data/types"
import { clasesVisibles } from "../data/useDatos"
import { useReveal, revealClass } from "../hooks/useReveal"
import Pagination from "./Pagination"
import { scrollToNode } from "../utils/scroll"

interface ClasesProps {
  clases: ClaseTorneo[]
  negocio: Negocio
}

const PAGE_SIZE = 6

function ClaseCard({ clase, negocio, index }: { clase: ClaseTorneo; negocio: Negocio; index: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>((index % PAGE_SIZE) * 60)
  const href = `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(
    `Hola! Quiero anotarme a "${clase.titulo}".`
  )}`

  return (
    <div
      ref={ref}
      className={`reveal group relative border border-cancha-900/15 bg-hueso-50 p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--color-cancha-900)] ${revealClass(visible)}`}
    >
      <span
        className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
          clase.tipo === "torneo" ? "bg-ladrillo-600/15 text-ladrillo-700" : "bg-cancha-800/10 text-cancha-800"
        }`}
      >
        {clase.tipo === "torneo" ? "Torneo" : "Clase"}
      </span>
      <h3 className="mt-2 font-display text-lg font-bold uppercase tracking-wide text-cancha-900">
        {clase.titulo}
      </h3>
      <dl className="mt-3 space-y-1 text-sm text-ink-700">
        <div className="flex justify-between gap-3">
          <dt className="text-ink-500">Día</dt>
          <dd className="text-right font-medium">{clase.dia}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-500">Hora</dt>
          <dd className="text-right font-medium">{clase.hora}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-500">A cargo de</dt>
          <dd className="text-right font-medium">{clase.profe}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-500">Cupos</dt>
          <dd className="text-right font-medium">{clase.cupos}</dd>
        </div>
      </dl>
      <p className="mt-3 font-marker text-xl text-ladrillo-600">{clase.precio}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-cancha-900"
      >
        Anotarme por WhatsApp
        <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </a>
    </div>
  )
}

function Clases({ clases, negocio }: ClasesProps) {
  const { ref: headRef, visible: headVisible } = useReveal<HTMLDivElement>()
  const [page, setPage] = useState(1)
  const gridRef = useRef<HTMLDivElement>(null)
  const visibles = clasesVisibles(clases)
  const pagina = visibles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <section id="clases" className="bg-hueso-100 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div ref={headRef} className={`reveal max-w-2xl ${revealClass(headVisible)}`}>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-cancha-900 sm:text-4xl">
            Clases y torneos
          </h2>
          <p className="mt-3 text-base text-ink-700">
            Con el Profe Nacho y la Profe Vale, martes, jueves y sábados. El
            club también arma clínicas para empresas y cumpleaños con cancha
            incluida.
          </p>
        </div>

        <div ref={gridRef} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pagina.map((clase, i) => (
            <ClaseCard key={clase.id} clase={clase} negocio={negocio} index={i} />
          ))}
        </div>

        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          totalItems={visibles.length}
          label="Páginas de clases y torneos"
          onPageChange={(p) => {
            setPage(p)
            scrollToNode(gridRef.current)
          }}
        />
      </div>
    </section>
  )
}

export default Clases
