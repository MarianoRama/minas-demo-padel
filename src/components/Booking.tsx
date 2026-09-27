import { useEffect, useMemo, useState } from "react"
import { courts } from "../data/courts"
import { DAYS_AHEAD, HOURS, OCCUPIED_SLOTS } from "../data/schedule"

const STORAGE_KEY = "padel-minas-club.reservas"

interface DayOption {
  offset: number
  date: Date
  label: string
  sublabel: string
}

function buildDays(): DayOption[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Array.from({ length: DAYS_AHEAD }, (_, offset) => {
    const date = new Date(today)
    date.setDate(date.getDate() + offset)
    return {
      offset,
      date,
      label: offset === 0 ? "Hoy" : offset === 1 ? "Mañana" : date.toLocaleDateString("es-UY", { weekday: "short" }),
      sublabel: date.toLocaleDateString("es-UY", { day: "2-digit", month: "2-digit" }),
    }
  })
}

function slotKey(dayOffset: number, courtId: string, hour: number) {
  return `${dayOffset}-${courtId}-${hour}`
}

function loadReservations(): Set<string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as string[]
    return new Set(parsed)
  } catch {
    return new Set()
  }
}

function Booking() {
  const days = useMemo(buildDays, [])
  const [selectedDay, setSelectedDay] = useState(0)
  const [reservations, setReservations] = useState<Set<string>>(() => loadReservations())

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(reservations)))
  }, [reservations])

  const occupiedSet = useMemo(() => {
    return new Set(
      OCCUPIED_SLOTS.map((slot) => slotKey(slot.dayOffset, slot.courtId, slot.hour))
    )
  }, [])

  function handleSlotClick(courtId: string, hour: number) {
    const key = slotKey(selectedDay, courtId, hour)
    if (occupiedSet.has(key)) return

    setReservations((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        const confirmCancel = window.confirm("¿Cancelar esta reserva?")
        if (!confirmCancel) return prev
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <section id="reservar" className="bg-neutral-900 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Reservá tu turno</h2>
          <p className="mt-3 text-neutral-400 max-w-xl mx-auto">
            Elegí el día, la cancha y el horario. Los turnos disponibles se
            marcan en verde: hacé click para reservar.
          </p>
        </div>

        {/* Selector de día */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          {days.map((day) => (
            <button
              key={day.offset}
              onClick={() => setSelectedDay(day.offset)}
              className={`flex flex-col items-center shrink-0 rounded-xl border px-4 py-2.5 min-w-[72px] transition-colors ${
                selectedDay === day.offset
                  ? "bg-green-500 border-green-500 text-neutral-950"
                  : "bg-neutral-800 border-white/10 text-neutral-300 hover:border-green-500/50"
              }`}
            >
              <span className="text-xs font-semibold capitalize">{day.label}</span>
              <span className="text-sm font-bold">{day.sublabel}</span>
            </button>
          ))}
        </div>

        {/* Leyenda */}
        <div className="flex flex-wrap gap-4 mb-4 text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-green-500 inline-block" /> Disponible
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-blue-500 inline-block" /> Tu reserva
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-neutral-700 inline-block" /> Ocupado
          </span>
        </div>

        {/* Grilla de horarios */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-neutral-950">
          <div className="min-w-[720px]">
            <div
              className="grid border-b border-white/10"
              style={{ gridTemplateColumns: `140px repeat(${HOURS.length}, 1fr)` }}
            >
              <div className="p-3 text-xs font-semibold text-neutral-500">Cancha</div>
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="p-3 text-center text-xs font-semibold text-neutral-500 border-l border-white/5"
                >
                  {hour}:00
                </div>
              ))}
            </div>

            {courts.map((court) => (
              <div
                key={court.id}
                className="grid border-b border-white/5 last:border-b-0"
                style={{ gridTemplateColumns: `140px repeat(${HOURS.length}, 1fr)` }}
              >
                <div className="p-3 flex flex-col justify-center">
                  <span className="text-sm font-semibold text-white">{court.name}</span>
                  <span className="text-[11px] text-neutral-500 capitalize">{court.type}</span>
                </div>
                {HOURS.map((hour) => {
                  const key = slotKey(selectedDay, court.id, hour)
                  const isOccupied = occupiedSet.has(key)
                  const isReserved = reservations.has(key)

                  return (
                    <button
                      key={hour}
                      onClick={() => handleSlotClick(court.id, hour)}
                      disabled={isOccupied}
                      title={
                        isOccupied
                          ? "Turno ocupado"
                          : isReserved
                            ? "Tu reserva — click para cancelar"
                            : `Reservar ${court.name} a las ${hour}:00`
                      }
                      className={`m-1.5 h-10 rounded-lg border text-xs font-semibold transition-colors ${
                        isOccupied
                          ? "bg-neutral-800 border-neutral-700 text-neutral-600 cursor-not-allowed"
                          : isReserved
                            ? "bg-blue-500 border-blue-400 text-white hover:bg-blue-400"
                            : "bg-green-500/15 border-green-500/40 text-green-400 hover:bg-green-500 hover:text-neutral-950"
                      }`}
                    >
                      {isOccupied ? "—" : isReserved ? "Reservado" : "Libre"}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-neutral-500">
          Demo de portafolio: las reservas se guardan en tu navegador (localStorage),
          no hay backend real detrás.
        </p>
      </div>
    </section>
  )
}

export default Booking
