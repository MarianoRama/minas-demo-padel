import { useMemo } from "react"
import { courts } from "../data/courts"
import { HOURS, PRICE_PER_HOUR, isOccupiedByDefault } from "../data/schedule"
import { formatDateLabel, isPastSlot, loadReservations, toDateKey } from "../data/booking"

interface FreeSlot {
  courtId: string
  courtName: string
  hour: number
}

function useTurnosLibresHoy(limit = 4): FreeSlot[] {
  return useMemo(() => {
    const todayKey = toDateKey(new Date())
    const mine = new Set(loadReservations().map((r) => `${r.dateKey}|${r.courtId}|${r.hour}`))
    const free: FreeSlot[] = []
    for (const hour of HOURS) {
      if (isPastSlot(todayKey, hour)) continue
      for (const court of courts) {
        const key = `${todayKey}|${court.id}|${hour}`
        if (isOccupiedByDefault(todayKey, court.id, hour)) continue
        if (mine.has(key)) continue
        free.push({ courtId: court.id, courtName: court.name, hour })
      }
      if (free.length >= limit) break
    }
    return free.slice(0, limit)
  }, [limit])
}

function Hero() {
  const libres = useTurnosLibresHoy()
  const todayLabel = formatDateLabel(toDateKey(new Date()))

  return (
    <section id="inicio" className="relative overflow-hidden bg-cancha-900 textura-cancha">
      <svg
        className="pointer-events-none absolute inset-y-0 right-[-6%] hidden h-full w-[60%] opacity-[0.14] md:block"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <rect x="10" y="10" width="380" height="380" fill="none" stroke="#faf7f0" strokeWidth="3" />
        <line x1="200" y1="10" x2="200" y2="390" stroke="#faf7f0" strokeWidth="2" />
        <line x1="10" y1="200" x2="390" y2="200" stroke="#faf7f0" strokeWidth="2" />
        <rect x="60" y="10" width="280" height="380" fill="none" stroke="#faf7f0" strokeWidth="2" />
        <circle cx="200" cy="200" r="3.5" fill="#faf7f0" />
      </svg>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-28">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-ladrillo-400">
            Minas, Lavalleja — desde 2016
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.75rem,9vw,4.75rem)] leading-[0.92] font-black uppercase tracking-tight text-hueso-50">
            Sacá tu
            <br />
            turno de pádel
            <br />
            <span className="text-ladrillo-400">en 30 segundos</span>
          </h1>
          <p className="mt-6 max-w-md text-base text-hueso-100/80 sm:text-lg">
            Tres canchas, agenda online al minuto y el mate siempre listo en el
            club. Elegí día y hora, confirmá con tu nombre y listo.
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-hueso-50/15 pt-6 max-w-md">
            <div>
              <dt className="text-xs uppercase tracking-wide text-hueso-100/60">Canchas</dt>
              <dd className="font-display text-3xl font-bold text-hueso-50">3</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-hueso-100/60">Horario</dt>
              <dd className="font-display text-3xl font-bold text-hueso-50">9-23</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-hueso-100/60">Desde</dt>
              <dd className="font-display text-3xl font-bold text-hueso-50">${PRICE_PER_HOUR}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-hueso-50/15 bg-cancha-950/60 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
          <div className="flex items-center justify-between border-b border-hueso-50/15 pb-3">
            <h2 className="font-display text-lg font-bold uppercase tracking-wide text-hueso-50">
              Libres hoy
            </h2>
            <span className="rounded bg-ladrillo-600 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-hueso-50">
              {todayLabel}
            </span>
          </div>
          {libres.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {libres.map((slot) => (
                <li
                  key={`${slot.courtId}-${slot.hour}`}
                  className="flex items-center justify-between rounded-md bg-hueso-50/[0.06] px-3 py-2.5"
                >
                  <span className="text-sm font-medium text-hueso-100">{slot.courtName}</span>
                  <span className="font-display text-xl font-bold text-hueso-50">{slot.hour}:00</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-hueso-100/70">
              Hoy ya no quedan turnos libres, pero mañana la agenda se abre de nuevo.
            </p>
          )}
          <a
            href="#agenda"
            className="mt-5 flex min-h-[48px] items-center justify-center rounded-md bg-hueso-50 text-sm font-bold uppercase tracking-wide text-cancha-900 transition-colors hover:bg-hueso-100"
          >
            Ver agenda completa
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
