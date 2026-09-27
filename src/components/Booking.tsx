import { useMemo, useState } from "react"
import { courts } from "../data/courts"
import { DAYS_AHEAD, HOURS, PRICE_PER_HOUR, isOccupiedByDefault } from "../data/schedule"
import {
  buildDayOptions,
  findFreeSlots,
  isPastSlot,
  type Reservation,
} from "../data/booking"
import BookingModal from "./BookingModal"
import MisReservas from "./MisReservas"
import { useReveal, revealClass } from "../hooks/useReveal"

interface SelectedSlot {
  courtId: string
  hour: number
}

type SlotState = "pasado" | "ocupado" | "mia" | "libre"

interface BookingProps {
  reservations: Reservation[]
  onConfirmed: (reservation: Reservation) => void
  onCancel: (id: string) => void
}

function Booking({ reservations, onConfirmed, onCancel }: BookingProps) {
  const days = useMemo(() => buildDayOptions(DAYS_AHEAD), [])

  // Por default abrimos en el primer día que tenga algún turno libre: así la
  // agenda nunca "arranca" mostrando todo pasado/ocupado, sin importar la
  // hora a la que Mariano haga la demo.
  const [selectedDateKey, setSelectedDateKey] = useState(() => {
    const [firstFree] = findFreeSlots(reservations, 1, DAYS_AHEAD)
    return firstFree?.dateKey ?? days[0].dateKey
  })
  const [mobileCourtId, setMobileCourtId] = useState(courts[0].id)
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null)

  function slotState(dateKey: string, courtId: string, hour: number): SlotState {
    if (isPastSlot(dateKey, hour)) return "pasado"
    if (reservations.some((r) => r.dateKey === dateKey && r.courtId === courtId && r.hour === hour)) {
      return "mia"
    }
    if (isOccupiedByDefault(dateKey, courtId, hour)) return "ocupado"
    return "libre"
  }

  const selectedCourt = courts.find((c) => c.id === selectedSlot?.courtId) ?? null
  const { ref: headRef, visible: headVisible } = useReveal<HTMLDivElement>()
  const { ref: gridRef, visible: gridVisible } = useReveal<HTMLDivElement>(80)

  return (
    <section id="agenda" className="bg-hueso-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          ref={headRef}
          className={`reveal max-w-2xl ${revealClass(headVisible)}`}
        >
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-ladrillo-600">
            La agenda
          </p>
          <h2 className="mt-2 font-display text-4xl font-black uppercase tracking-tight text-cancha-900 sm:text-5xl">
            Reservá tu turno
          </h2>
          <p className="mt-3 text-base text-ink-700">
            Elegí el día, la cancha y el horario. Confirmás con tu nombre y
            teléfono, y te queda un código de reserva para mostrar en el club.
          </p>
        </div>

        {/* Selector de día */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {days.map((day) => (
            <button
              key={day.dateKey}
              onClick={() => setSelectedDateKey(day.dateKey)}
              className={`flex min-w-[76px] shrink-0 flex-col items-center rounded-lg border px-4 py-2.5 transition-colors ${
                selectedDateKey === day.dateKey
                  ? "border-cancha-900 bg-cancha-900 text-hueso-50"
                  : "border-cancha-900/15 bg-hueso-100 text-ink-700 hover:border-cancha-700/50"
              }`}
            >
              <span className="text-xs font-semibold capitalize">{day.label}</span>
              <span className="font-display text-lg font-bold">{day.sublabel}</span>
            </button>
          ))}
        </div>

        {/* Leyenda */}
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-ink-500">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm border-2 border-cancha-700 inline-block" /> Libre
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-cancha-900 inline-block" /> Tu reserva
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-ladrillo-600 inline-block" /> Ocupado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-ink-500/20 inline-block" /> Pasado
          </span>
        </div>

        {/* Grilla desktop */}
        <div
          ref={gridRef}
          className={`reveal mt-5 hidden overflow-x-auto rounded-xl border border-cancha-900/15 bg-cancha-900 md:block ${revealClass(gridVisible)}`}
        >
          <div className="min-w-[760px]">
            <div
              className="grid border-b border-hueso-50/10"
              style={{ gridTemplateColumns: `150px repeat(${HOURS.length}, 1fr)` }}
            >
              <div className="p-3 text-xs font-bold uppercase tracking-wide text-hueso-100/60">
                Cancha
              </div>
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="border-l border-hueso-50/5 p-3 text-center font-display text-sm font-bold text-hueso-100/70"
                >
                  {hour}
                </div>
              ))}
            </div>

            {courts.map((court) => (
              <div
                key={court.id}
                className="grid border-b border-hueso-50/5 last:border-b-0"
                style={{ gridTemplateColumns: `150px repeat(${HOURS.length}, 1fr)` }}
              >
                <div className="flex flex-col justify-center p-3">
                  <span className="text-sm font-semibold text-hueso-50">{court.name}</span>
                  <span className="text-[11px] capitalize text-hueso-100/50">{court.type}</span>
                </div>
                {HOURS.map((hour) => {
                  const state = slotState(selectedDateKey, court.id, hour)
                  return (
                    <button
                      key={hour}
                      disabled={state !== "libre"}
                      onClick={() => setSelectedSlot({ courtId: court.id, hour })}
                      title={
                        state === "ocupado"
                          ? "Turno ocupado"
                          : state === "pasado"
                            ? "Turno pasado"
                            : state === "mia"
                              ? "Tu reserva"
                              : `Reservar ${court.name} a las ${hour}:00`
                      }
                      className={`m-1.5 h-10 rounded-md border text-[11px] font-bold transition-all duration-200 ${
                        state === "ocupado"
                          ? "cursor-not-allowed border-ladrillo-600/40 bg-ladrillo-600/80 text-hueso-50/90"
                          : state === "pasado"
                            ? "cursor-not-allowed border-hueso-50/5 bg-hueso-50/5 text-hueso-100/30"
                            : state === "mia"
                              ? "border-hueso-50/30 bg-hueso-50 text-cancha-900"
                              : "border-hueso-50/25 bg-transparent text-hueso-100 hover:scale-[1.04] hover:border-hueso-50 hover:bg-hueso-50/10"
                      }`}
                    >
                      {state === "ocupado" ? "Ocupado" : state === "pasado" ? "—" : state === "mia" ? "Reservado" : "Libre"}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Vista mobile: tabs por cancha + lista vertical */}
        <div className="mt-5 md:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Elegir cancha">
            {courts.map((court) => (
              <button
                key={court.id}
                role="tab"
                aria-selected={mobileCourtId === court.id}
                onClick={() => setMobileCourtId(court.id)}
                className={`min-h-[44px] shrink-0 rounded-lg border px-4 text-sm font-bold transition-colors ${
                  mobileCourtId === court.id
                    ? "border-cancha-900 bg-cancha-900 text-hueso-50"
                    : "border-cancha-900/15 bg-hueso-100 text-ink-700"
                }`}
              >
                {court.name}
              </button>
            ))}
          </div>

          <ul className="mt-3 divide-y divide-cancha-900/10 rounded-xl border border-cancha-900/15 bg-hueso-100">
            {HOURS.map((hour) => {
              const state = slotState(selectedDateKey, mobileCourtId, hour)
              const disabled = state !== "libre"
              return (
                <li key={hour}>
                  <button
                    disabled={disabled}
                    onClick={() => setSelectedSlot({ courtId: mobileCourtId, hour })}
                    className="flex min-h-[56px] w-full items-center justify-between px-4 py-2 text-left disabled:cursor-not-allowed"
                  >
                    <span className="font-display text-xl font-bold text-cancha-900">
                      {hour}:00
                    </span>
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
                        state === "ocupado"
                          ? "bg-ladrillo-600/15 text-ladrillo-700"
                          : state === "pasado"
                            ? "bg-ink-500/10 text-ink-500"
                            : state === "mia"
                              ? "bg-cancha-900 text-hueso-50"
                              : "bg-cancha-700/10 text-cancha-800"
                      }`}
                    >
                      {state === "ocupado" ? "Ocupado" : state === "pasado" ? "Pasado" : state === "mia" ? "Reservado" : "Libre"}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <p className="mt-6 text-xs text-ink-500">
          Precio de referencia: ${PRICE_PER_HOUR} la hora. Demo: las reservas se
          guardan solo en tu navegador.
        </p>

        <div className="mt-14 border-t border-cancha-900/10 pt-10">
          <MisReservas reservations={reservations} onCancel={onCancel} />
        </div>
      </div>

      {selectedSlot && selectedCourt && (
        <BookingModal
          court={selectedCourt}
          dateKey={selectedDateKey}
          hour={selectedSlot.hour}
          onClose={() => setSelectedSlot(null)}
          onConfirmed={onConfirmed}
        />
      )}
    </section>
  )
}

export default Booking
