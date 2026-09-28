import { useMemo, useRef, useState } from "react"
import Dialog from "./Dialog"
import type { Cancha } from "../data/types"
import { formatDateLabel, isPastSlot, type Reservation } from "../data/booking"
import Pagination from "./Pagination"
import { scrollToNode } from "../utils/scroll"

interface MisReservasProps {
  reservations: Reservation[]
  canchas: Cancha[]
  onCancel: (id: string) => void
}

const PAGE_SIZE = 6

function MisReservas({ reservations, canchas, onCancel }: MisReservasProps) {
  const [toCancel, setToCancel] = useState<Reservation | null>(null)
  const [page, setPage] = useState(1)
  const listRef = useRef<HTMLDivElement>(null)

  function courtName(id: string): string {
    return canchas.find((c) => c.id === id)?.nombre ?? id
  }

  const ordenadas = useMemo(
    () =>
      [...reservations].sort((a, b) => {
        const ka = `${a.dateKey}${String(a.hour).padStart(2, "0")}`
        const kb = `${b.dateKey}${String(b.hour).padStart(2, "0")}`
        return ka.localeCompare(kb)
      }),
    [reservations]
  )

  const pagina = ordenadas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div ref={listRef}>
      <h3 className="font-display text-xl font-bold uppercase tracking-wide text-cancha-900">
        Mis reservas
      </h3>
      <p className="mt-1 text-sm text-ink-500">
        Guardadas en este navegador. Para verlas en otro dispositivo tenés que reservar de nuevo.
      </p>

      {ordenadas.length === 0 ? (
        <p className="mt-4 border border-dashed border-cancha-900/20 px-4 py-6 text-center text-sm text-ink-500">
          Todavía no reservaste ningún turno.
        </p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {pagina.map((r) => {
            const pasado = isPastSlot(r.dateKey, r.hour)
            return (
              <li
                key={r.id}
                className={`flex items-center justify-between gap-3 border px-4 py-3 ${
                  pasado ? "border-ink-500/10 opacity-60" : "border-cancha-900/15 bg-hueso-50"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">
                    {courtName(r.courtId)} · {formatDateLabel(r.dateKey)} · {r.hour}:00
                  </p>
                  <p className="text-xs text-ink-500">
                    Código {r.id} {pasado && "· ya jugado"}
                  </p>
                </div>
                {!pasado && (
                  <button
                    type="button"
                    onClick={() => setToCancel(r)}
                    className="shrink-0 border border-ladrillo-600/50 px-3 py-2 text-xs font-bold uppercase tracking-wide text-ladrillo-600 hover:bg-ladrillo-600 hover:text-hueso-50"
                  >
                    Cancelar
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        totalItems={ordenadas.length}
        label="Páginas de mis reservas"
        onPageChange={(p) => {
          setPage(p)
          scrollToNode(listRef.current)
        }}
      />

      {toCancel && (
        <Dialog title="Cancelar reserva" onClose={() => setToCancel(null)}>
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-cancha-900">
            ¿Cancelar esta reserva?
          </h2>
          <p className="mt-2 text-sm text-ink-700">
            {courtName(toCancel.courtId)} · {formatDateLabel(toCancel.dateKey)} a las {toCancel.hour}:00.
            Esta acción no se puede deshacer.
          </p>
          <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={() => setToCancel(null)}
              className="flex min-h-[48px] flex-1 items-center justify-center border border-cancha-900/20 text-sm font-bold text-ink-700"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={() => {
                onCancel(toCancel.id)
                setToCancel(null)
              }}
              className="flex min-h-[48px] flex-1 items-center justify-center bg-ladrillo-600 text-sm font-bold text-hueso-50 hover:bg-ladrillo-700"
            >
              Sí, cancelar
            </button>
          </div>
        </Dialog>
      )}
    </div>
  )
}

export default MisReservas
