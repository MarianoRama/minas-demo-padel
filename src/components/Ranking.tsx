import { useRef, useState } from "react"
import type { RankingFila } from "../data/types"
import { useReveal, revealClass } from "../hooks/useReveal"
import Pagination from "./Pagination"
import { scrollToNode } from "../utils/scroll"

interface RankingProps {
  ranking: RankingFila[]
}

const PAGE_SIZE = 10

function Ranking({ ranking }: RankingProps) {
  const { ref: headRef, visible: headVisible } = useReveal<HTMLDivElement>()
  const [page, setPage] = useState(1)
  const tableRef = useRef<HTMLDivElement>(null)

  const ordenado = [...ranking].sort((a, b) => b.puntos - a.puntos)
  const pagina = ordenado.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (ranking.length === 0) return null

  return (
    <section id="ranking" className="bg-hueso-50 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div ref={headRef} className={`reveal ${revealClass(headVisible)}`}>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-cancha-900 sm:text-4xl">
            Ranking del torneo social
          </h2>
          <p className="mt-3 max-w-xl text-base text-ink-700">
            La planilla que llevamos en el mostrador, pareja por pareja. Se
            actualiza después de cada fecha del Torneo Social Minas.
          </p>
        </div>

        <div
          ref={tableRef}
          className="planilla-papel reveal mt-8 border border-cancha-900/15"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-cancha-900/20 text-left text-xs font-bold uppercase tracking-wide text-ink-500">
                <th className="w-14 px-4 py-3">#</th>
                <th className="px-2 py-3">Pareja</th>
                <th className="px-2 py-3 text-right">PJ</th>
                <th className="px-4 py-3 text-right">Puntos</th>
              </tr>
            </thead>
            <tbody>
              {pagina.map((fila, i) => {
                const puesto = (page - 1) * PAGE_SIZE + i + 1
                return (
                  <tr key={fila.id} className="border-b border-cancha-900/10 last:border-b-0">
                    <td className="px-4 py-2.5 font-hand text-xl text-ladrillo-600">{puesto}</td>
                    <td className="px-2 py-2.5 font-semibold text-ink-900">{fila.pareja}</td>
                    <td className="px-2 py-2.5 text-right text-ink-500">{fila.partidos}</td>
                    <td className="px-4 py-2.5 text-right font-display text-lg font-bold text-cancha-900">
                      {fila.puntos}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          totalItems={ordenado.length}
          label="Páginas del ranking"
          onPageChange={(p) => {
            setPage(p)
            scrollToNode(tableRef.current)
          }}
        />
      </div>
    </section>
  )
}

export default Ranking
