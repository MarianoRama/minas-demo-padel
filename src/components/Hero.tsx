import { useMemo, useState } from "react"
import { courts } from "../data/courts"
import { PRICE_PER_HOUR } from "../data/schedule"
import { dayShortLabel, findFreeSlots, type FreeSlot, type Reservation } from "../data/booking"
import BookingModal from "./BookingModal"
import HeroCourtIllustration from "./HeroCourtIllustration"

interface HeroProps {
  reservations: Reservation[]
  onConfirmed: (reservation: Reservation) => void
}

function Hero({ reservations, onConfirmed }: HeroProps) {
  const freeSlots = useMemo(() => findFreeSlots(reservations, 6), [reservations])
  const [selectedSlot, setSelectedSlot] = useState<FreeSlot | null>(null)
  const selectedCourt = courts.find((c) => c.id === selectedSlot?.courtId) ?? null

  return (
    <section id="inicio" className="relative overflow-hidden bg-cancha-900 textura-cancha">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] md:block">
        <HeroCourtIllustration className="h-full w-full opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-cancha-900 via-cancha-900/10 to-transparent" />
      </div>

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
              Próximos libres
            </h2>
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-hueso-100/60">
              <span className="h-1.5 w-1.5 rounded-full bg-ladrillo-400" aria-hidden="true" />
              En vivo
            </span>
          </div>
          {freeSlots.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {freeSlots.map((slot) => {
                const court = courts.find((c) => c.id === slot.courtId)
                return (
                  <li key={`${slot.dateKey}-${slot.courtId}-${slot.hour}`}>
                    <button
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className="flex w-full min-h-[52px] items-center justify-between rounded-md bg-hueso-50/[0.06] px-3 py-2.5 text-left transition-colors hover:bg-hueso-50/[0.12]"
                    >
                      <span className="flex items-baseline gap-2">
                        <span className="font-display text-xl font-bold text-hueso-50">{slot.hour}:00</span>
                        <span className="text-xs font-semibold uppercase tracking-wide text-ladrillo-400">
                          {dayShortLabel(slot.dateKey)}
                        </span>
                      </span>
                      <span className="text-sm font-medium text-hueso-100">{court?.name}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-hueso-100/70">
              Por ahora no quedan turnos libres en los próximos días. Escribinos
              por WhatsApp y te avisamos ante alguna cancelación.
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

      {selectedSlot && selectedCourt && (
        <BookingModal
          court={selectedCourt}
          dateKey={selectedSlot.dateKey}
          hour={selectedSlot.hour}
          onClose={() => setSelectedSlot(null)}
          onConfirmed={onConfirmed}
        />
      )}
    </section>
  )
}

export default Hero
