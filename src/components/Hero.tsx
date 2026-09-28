import { useMemo } from "react"
import type { Bloqueo, Cancha, Horario, Negocio, Precio } from "../data/types"
import { canchasActivas } from "../data/useDatos"
import { parsePrecio, precioPorTurno } from "../data/schedule"
import { dayShortLabel, findFreeSlots, type Reservation } from "../data/booking"
import HeroCourtIllustration from "./HeroCourtIllustration"
import type { FocusRequest } from "../App"

interface HeroProps {
  reservations: Reservation[]
  canchas: Cancha[]
  horario: Horario
  precios: Precio[]
  bloqueos: Bloqueo[]
  negocio: Negocio
  onFocusSlot: (req: FocusRequest) => void
}

function Hero({ reservations, canchas, horario, precios, bloqueos, negocio, onFocusSlot }: HeroProps) {
  const activas = useMemo(() => canchasActivas(canchas), [canchas])
  const freeSlots = useMemo(
    () => findFreeSlots(reservations, activas, horario, bloqueos, 4),
    [reservations, activas, horario, bloqueos]
  )
  const turnoSuelto = precios.find((p) => p.nombre.toLowerCase().includes("suelto")) ?? precios[0]
  const precioHora = turnoSuelto ? parsePrecio(turnoSuelto.precio) : 0
  const precioTurno = precioPorTurno(precioHora, horario.duracionTurnoMin)

  return (
    <section id="inicio" className="relative overflow-hidden bg-cancha-900 textura-cancha">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] md:block">
        <HeroCourtIllustration className="h-full w-full opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-cancha-900 via-cancha-900/10 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-28">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-ladrillo-400">
            Minas, Lavalleja
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.75rem,9vw,4.75rem)] leading-[0.92] font-black uppercase tracking-tight text-hueso-50">
            Reservá tu cancha
            <br />
            <span className="text-ladrillo-400">y vení a jugar</span>
          </h1>
          <p className="mt-6 max-w-md text-base text-hueso-100/80 sm:text-lg">
            Tres canchas sobre la Ruta 8, agenda online y el mate siempre
            listo en recepción. Elegís día y hora, confirmás con tu nombre y
            listo.
          </p>

          {negocio.aviso && (
            <div className="nota-pegada mt-8 max-w-sm rotate-[-1.5deg] bg-[#fff3b0] px-4 py-3 text-sm font-semibold text-ink-900 shadow-[3px_4px_0_rgba(0,0,0,0.25)]">
              <span className="font-hand text-lg leading-tight">{negocio.aviso}</span>
            </div>
          )}
        </div>

        <div className="rounded-sm border border-hueso-50/15 bg-cancha-950/70 p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-hueso-50/15 pb-3">
            <h2 className="font-display text-lg font-bold uppercase tracking-wide text-hueso-50">
              Próximos libres
            </h2>
            <span className="text-xs font-semibold text-hueso-100/60">
              Turno de {horario.duracionTurnoMin} min
            </span>
          </div>
          {freeSlots.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {freeSlots.map((slot) => {
                const court = canchas.find((c) => c.id === slot.courtId)
                return (
                  <li key={`${slot.dateKey}-${slot.courtId}-${slot.hour}`}>
                    <a
                      href="#agenda"
                      onClick={() =>
                        onFocusSlot({ courtId: slot.courtId, dateKey: slot.dateKey, hour: slot.hour, ts: Date.now() })
                      }
                      className="flex w-full min-h-[52px] items-center justify-between rounded-sm bg-hueso-50/[0.06] px-3 py-2.5 text-left transition-colors hover:bg-hueso-50/[0.12]"
                    >
                      <span className="flex items-baseline gap-2">
                        <span className="font-display text-xl font-bold text-hueso-50">{slot.hour}:00</span>
                        <span className="text-xs font-semibold uppercase tracking-wide text-ladrillo-400">
                          {dayShortLabel(slot.dateKey)}
                        </span>
                      </span>
                      <span className="text-sm font-medium text-hueso-100">{court?.nombre}</span>
                    </a>
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
          <p className="mt-4 text-xs text-hueso-100/60">
            Desde ${precioTurno.toLocaleString("es-UY")} el turno de {horario.duracionTurnoMin} minutos.
          </p>
          <a
            href="#agenda"
            className="mt-5 flex min-h-[48px] items-center justify-center rounded-sm bg-hueso-50 text-sm font-bold uppercase tracking-wide text-cancha-900 transition-colors hover:bg-hueso-100"
          >
            Ver agenda completa
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
