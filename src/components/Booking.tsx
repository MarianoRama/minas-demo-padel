import { useEffect, useMemo, useState } from "react"
import type { Bloqueo, Cancha, Horario, Precio } from "../data/types"
import { canchasActivas } from "../data/useDatos"
import { buildHoursForDay, endLabel, isOccupiedByDefault, parsePrecio, precioPorTurno } from "../data/schedule"
import {
  buildDayOptions,
  findFreeSlots,
  horarioDelDia,
  isBlocked,
  isPastSlot,
  parseDateKey,
  type Reservation,
} from "../data/booking"
import BookingModal from "./BookingModal"
import MisReservas from "./MisReservas"
import { useReveal, revealClass } from "../hooks/useReveal"
import type { FocusRequest } from "../App"

interface SelectedSlot {
  courtId: string
  hour: number
}

type SlotState = "pasado" | "ocupado" | "bloqueado" | "mia" | "libre"

interface BookingProps {
  reservations: Reservation[]
  canchas: Cancha[]
  horario: Horario
  precios: Precio[]
  bloqueos: Bloqueo[]
  focusRequest: FocusRequest | null
  onConfirmed: (reservation: Reservation) => void
  onCancel: (id: string) => void
}

function Booking({ reservations, canchas, horario, precios, bloqueos, focusRequest, onConfirmed, onCancel }: BookingProps) {
  const activas = useMemo(() => canchasActivas(canchas), [canchas])
  const days = useMemo(() => buildDayOptions(), [])

  const [selectedDateKey, setSelectedDateKey] = useState(() => {
    const [firstFree] = findFreeSlots(reservations, activas, horario, bloqueos, 1)
    return firstFree?.dateKey ?? days[0].dateKey
  })
  const [mobileCourtId, setMobileCourtId] = useState(activas[0]?.id ?? "")
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null)
  const [pulse, setPulse] = useState<{ courtId: string; hour: number } | null>(null)
  const [ultimoFocusTs, setUltimoFocusTs] = useState<number | null>(null)

  // Ajuste de estado derivado de un prop que cambió, siguiendo el patrón que
  // recomienda React (no un useEffect) para no encadenar un render de más.
  if (focusRequest && focusRequest.ts !== ultimoFocusTs) {
    setUltimoFocusTs(focusRequest.ts)
    setMobileCourtId(focusRequest.courtId)
    if (focusRequest.dateKey) setSelectedDateKey(focusRequest.dateKey)
    setPulse(focusRequest.hour !== undefined ? { courtId: focusRequest.courtId, hour: focusRequest.hour } : null)
  }

  useEffect(() => {
    if (!pulse) return
    const t = setTimeout(() => setPulse(null), 2200)
    return () => clearTimeout(t)
  }, [pulse])

  const hours = useMemo(
    () => buildHoursForDay(horarioDelDia(horario, parseDateKey(selectedDateKey))),
    [horario, selectedDateKey]
  )

  function slotState(dateKey: string, courtId: string, hour: number): SlotState {
    if (isPastSlot(dateKey, hour)) return "pasado"
    if (reservations.some((r) => r.dateKey === dateKey && r.courtId === courtId && r.hour === hour)) {
      return "mia"
    }
    if (isBlocked(bloqueos, dateKey, courtId, hour)) return "bloqueado"
    if (isOccupiedByDefault(dateKey, courtId, hour)) return "ocupado"
    return "libre"
  }

  function diaCompleto(dateKey: string): boolean {
    const horas = buildHoursForDay(horarioDelDia(horario, parseDateKey(dateKey)))
    if (horas.length === 0 || activas.length === 0) return false
    return horas.every((h) => activas.every((c) => slotState(dateKey, c.id, h) !== "libre"))
  }

  const turnoSuelto = precios.find((p) => p.nombre.toLowerCase().includes("suelto")) ?? precios[0]
  const precioHora = turnoSuelto ? parsePrecio(turnoSuelto.precio) : 0
  const precioTurno = precioPorTurno(precioHora, horario.duracionTurnoMin)

  const selectedCourt = canchas.find((c) => c.id === selectedSlot?.courtId) ?? null
  const { ref: headRef, visible: headVisible } = useReveal<HTMLDivElement>()
  const { ref: gridRef, visible: gridVisible } = useReveal<HTMLDivElement>(80)

  return (
    <section id="agenda" className="bg-hueso-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div ref={headRef} className={`reveal max-w-2xl ${revealClass(headVisible)}`}>
          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-cancha-900 sm:text-5xl">
            Reservá tu turno
          </h2>
          <p className="mt-3 text-base text-ink-700">
            Elegí el día, la cancha y el horario. Confirmás con tu nombre y
            teléfono, y te queda un código para mostrar en recepción.
          </p>
        </div>

        {/* Selector de día */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {days.map((day) => {
            const completo = diaCompleto(day.dateKey)
            return (
              <button
                key={day.dateKey}
                onClick={() => setSelectedDateKey(day.dateKey)}
                className={`relative flex min-w-[76px] shrink-0 flex-col items-center border px-4 py-2.5 transition-colors ${
                  selectedDateKey === day.dateKey
                    ? "border-cancha-900 bg-cancha-900 text-hueso-50"
                    : "border-cancha-900/15 bg-hueso-100 text-ink-700 hover:border-cancha-700/50"
                }`}
              >
                <span className="text-xs font-semibold capitalize">{day.label}</span>
                <span className="font-display text-lg font-bold">{day.sublabel}</span>
                {completo && (
                  <span className="sello-completo absolute -top-2 -right-2 rotate-[-8deg] rounded-full border-2 border-ladrillo-600 bg-hueso-50 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-ladrillo-600">
                    Completo
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Leyenda */}
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-ink-500">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 border-2 border-cancha-700 inline-block" /> Libre
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 bg-cancha-900 inline-block" /> Tu reserva
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 bg-ladrillo-600 inline-block" /> Ocupado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 border-2 border-dashed border-ink-500 inline-block" /> Bloqueado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 bg-ink-500/20 inline-block" /> Pasado
          </span>
        </div>

        {hours.length === 0 ? (
          <p className="mt-6 rounded-sm border border-dashed border-cancha-900/25 px-4 py-8 text-center text-sm text-ink-500">
            El club está cerrado ese día. Elegí otra fecha.
          </p>
        ) : (
          <>
            {/* Grilla desktop */}
            <div
              ref={gridRef}
              className={`reveal mt-5 hidden overflow-x-auto border border-cancha-900/15 bg-cancha-900 md:block ${revealClass(gridVisible)}`}
            >
              <div className="min-w-[760px]">
                <div
                  className="grid border-b border-hueso-50/10"
                  style={{ gridTemplateColumns: `150px repeat(${hours.length}, 1fr)` }}
                >
                  <div className="p-3 text-xs font-bold uppercase tracking-wide text-hueso-100/60">Cancha</div>
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="border-l border-hueso-50/5 p-3 text-center font-display text-sm font-bold text-hueso-100/70"
                    >
                      {hour}
                    </div>
                  ))}
                </div>

                {activas.map((court) => (
                  <div
                    key={court.id}
                    className="grid border-b border-hueso-50/5 last:border-b-0"
                    style={{ gridTemplateColumns: `150px repeat(${hours.length}, 1fr)` }}
                  >
                    <div className="flex flex-col justify-center p-3">
                      <span className="text-sm font-semibold text-hueso-50">{court.nombre}</span>
                      <span className="text-[11px] capitalize text-hueso-100/50">{court.tipo}</span>
                    </div>
                    {hours.map((hour) => {
                      const state = slotState(selectedDateKey, court.id, hour)
                      const isPulsing = pulse?.courtId === court.id && pulse.hour === hour
                      return (
                        <button
                          key={hour}
                          disabled={state !== "libre"}
                          onClick={() => setSelectedSlot({ courtId: court.id, hour })}
                          title={
                            state === "ocupado"
                              ? "Turno ocupado"
                              : state === "bloqueado"
                                ? "Turno bloqueado por el club"
                                : state === "pasado"
                                  ? "Turno pasado"
                                  : state === "mia"
                                    ? "Tu reserva"
                                    : `Reservar ${court.nombre} a las ${hour}:00`
                          }
                          className={`m-1.5 h-10 border text-[11px] font-bold transition-all duration-200 ${
                            isPulsing ? "ring-2 ring-hueso-50 ring-offset-2 ring-offset-cancha-900 animate-pulse" : ""
                          } ${
                            state === "ocupado"
                              ? "cursor-not-allowed border-ladrillo-600/40 bg-ladrillo-600/80 text-hueso-50/90"
                              : state === "bloqueado"
                                ? "cursor-not-allowed border-dashed border-hueso-100/30 bg-hueso-50/5 text-hueso-100/50"
                                : state === "pasado"
                                  ? "cursor-not-allowed border-hueso-50/5 bg-hueso-50/5 text-hueso-100/30"
                                  : state === "mia"
                                    ? "border-hueso-50/30 bg-hueso-50 text-cancha-900"
                                    : "border-hueso-50/25 bg-transparent text-hueso-100 hover:scale-[1.04] hover:border-hueso-50 hover:bg-hueso-50/10"
                          }`}
                        >
                          {state === "ocupado"
                            ? "Ocupado"
                            : state === "bloqueado"
                              ? "Bloqueado"
                              : state === "pasado"
                                ? "-"
                                : state === "mia"
                                  ? "Reservado"
                                  : "Libre"}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Vista mobile: tabs por cancha + lista vertical, look "planilla en papel" */}
            <div className="mt-5 md:hidden">
              <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Elegir cancha">
                {activas.map((court) => (
                  <button
                    key={court.id}
                    role="tab"
                    aria-selected={mobileCourtId === court.id}
                    onClick={() => setMobileCourtId(court.id)}
                    className={`min-h-[44px] shrink-0 border px-4 text-sm font-bold transition-colors ${
                      mobileCourtId === court.id
                        ? "border-cancha-900 bg-cancha-900 text-hueso-50"
                        : "border-cancha-900/15 bg-hueso-100 text-ink-700"
                    }`}
                  >
                    {court.nombre}
                  </button>
                ))}
              </div>

              <ul className="planilla-papel mt-3 divide-y divide-cancha-900/10 border border-cancha-900/15">
                {hours.map((hour) => {
                  const state = slotState(selectedDateKey, mobileCourtId, hour)
                  const disabled = state !== "libre"
                  const isPulsing = pulse?.courtId === mobileCourtId && pulse.hour === hour
                  return (
                    <li key={hour}>
                      <button
                        disabled={disabled}
                        onClick={() => setSelectedSlot({ courtId: mobileCourtId, hour })}
                        className={`flex min-h-[56px] w-full items-center justify-between px-4 py-2 text-left disabled:cursor-not-allowed ${
                          isPulsing ? "bg-ladrillo-100/60" : ""
                        }`}
                      >
                        <span className="font-display text-xl font-bold text-cancha-900">{hour}:00</span>
                        <span
                          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
                            state === "ocupado"
                              ? "bg-ladrillo-600/15 text-ladrillo-700"
                              : state === "bloqueado"
                                ? "border border-dashed border-ink-500/40 text-ink-500"
                                : state === "pasado"
                                  ? "bg-ink-500/10 text-ink-500"
                                  : state === "mia"
                                    ? "bg-cancha-900 text-hueso-50"
                                    : "bg-cancha-700/10 text-cancha-800"
                          }`}
                        >
                          {state === "ocupado"
                            ? "Ocupado"
                            : state === "bloqueado"
                              ? "Bloqueado"
                              : state === "pasado"
                                ? "Pasado"
                                : state === "mia"
                                  ? "Reservado"
                                  : "Libre"}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </>
        )}

        <p className="mt-6 text-xs text-ink-500">
          ${precioTurno.toLocaleString("es-UY")} el turno de {horario.duracionTurnoMin} minutos. Demo: las
          reservas se guardan solo en tu navegador.
        </p>

        <div className="mt-14 border-t border-cancha-900/10 pt-10">
          <MisReservas reservations={reservations} canchas={canchas} onCancel={onCancel} />
        </div>
      </div>

      {selectedSlot && selectedCourt && (
        <BookingModal
          court={selectedCourt}
          dateKey={selectedDateKey}
          hour={selectedSlot.hour}
          precio={precioTurno}
          duracionMin={horario.duracionTurnoMin}
          horaFinLabel={endLabel(selectedSlot.hour, horario.duracionTurnoMin)}
          onClose={() => setSelectedSlot(null)}
          onConfirmed={onConfirmed}
        />
      )}
    </section>
  )
}

export default Booking
