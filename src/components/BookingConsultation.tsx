import { useMemo, useState } from "react"
import { courts } from "../data/courts"
import { DAYS_AHEAD, HOURS } from "../data/schedule"

const configuredWhatsAppNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? ""
const WHATSAPP_NUMBER = /^598\d{8}$/.test(configuredWhatsAppNumber) && configuredWhatsAppNumber !== "59899000000"
  ? configuredWhatsAppNumber
  : ""

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
      label:
        offset === 0
          ? "Hoy"
          : offset === 1
            ? "Mañana"
            : date.toLocaleDateString("es-UY", { weekday: "short" }),
      sublabel: date.toLocaleDateString("es-UY", {
        day: "2-digit",
        month: "2-digit",
      }),
    }
  })
}

function BookingConsultation() {
  const days = useMemo(buildDays, [])
  const [selectedDay, setSelectedDay] = useState(0)
  const [preparedQuery, setPreparedQuery] = useState<{ courtId: string; message: string } | null>(null)
  const day = days[selectedDay]

  function contactMessage(courtName: string, hour: number) {
    const date = day.date.toLocaleDateString("es-UY", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    return `Hola, quisiera consultar si tienen lugar el ${date} a las ${hour}:00 en ${courtName}. (Demo Pádel Minas Club)`
  }

  function contactLink(courtName: string, hour: number) {
    if (!WHATSAPP_NUMBER) return null
    const message = encodeURIComponent(contactMessage(courtName, hour))
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
  }

  return (
    <section id="reservar" className="bg-neutral-900 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-green-400">
            Coordiná tu partido
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Consultá un horario
          </h2>
          <p className="mt-3 text-neutral-300">
            Elegí una cancha, un día y una hora para preparar la consulta. El
            club confirma la disponibilidad por su canal de contacto.
          </p>
        </div>

        <div
          aria-label="Elegí el día de consulta"
          className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
        >
          {days.map((option) => (
            <button
              key={option.offset}
              type="button"
              aria-pressed={selectedDay === option.offset}
              onClick={() => { setSelectedDay(option.offset); setPreparedQuery(null) }}
              className={`flex min-h-14 shrink-0 flex-col items-center justify-center rounded-xl border px-4 py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300 ${
                selectedDay === option.offset
                  ? "border-green-400 bg-green-400 text-neutral-950"
                  : "border-white/15 bg-neutral-800 text-neutral-200 hover:border-green-400/60"
              }`}
            >
              <span className="text-xs font-semibold capitalize">
                {option.label}
              </span>
              <span className="text-sm font-bold">{option.sublabel}</span>
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courts.map((court) => (
            <article
              key={court.id}
              className="rounded-2xl border border-white/10 bg-neutral-950 p-5 sm:p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-white">{court.name}</h3>
                  <p className="mt-1 text-sm capitalize text-neutral-400">
                    {court.type}
                  </p>
                </div>
                <span aria-hidden="true" className="text-green-400">↗</span>
              </div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-400">
                Horarios de referencia · {day.label}, {day.sublabel}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {HOURS.map((hour) => {
                  const label = `${hour}:00`
                  const className = "inline-flex min-h-11 items-center justify-center rounded-lg border border-green-400/35 bg-green-400/10 px-2 text-sm font-semibold text-green-300 transition-colors hover:border-green-300 hover:bg-green-400 hover:text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300"
                  const href = contactLink(court.name, hour)

                  return href ? (
                    <a
                      key={hour}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Consultar por WhatsApp si hay lugar en ${court.name} a las ${label}`}
                      className={className}
                    >
                      {label}
                    </a>
                  ) : (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => setPreparedQuery({ courtId: court.id, message: contactMessage(court.name, hour) })}
                      aria-label={`Preparar una consulta por ${court.name} a las ${label}`}
                      className={className}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
              {!WHATSAPP_NUMBER && preparedQuery?.courtId === court.id && (
                <div className="mt-4 rounded-lg border border-white/10 bg-neutral-900 p-3">
                  <label htmlFor={`prepared-query-${court.id}`} className="text-xs text-neutral-300">
                    Consulta preparada · el número del negocio aún no está configurado
                  </label>
                  <textarea
                    id={`prepared-query-${court.id}`}
                    readOnly
                    value={preparedQuery.message}
                    rows={3}
                    onFocus={(event) => event.currentTarget.select()}
                    className="mt-2 w-full resize-none rounded-md border border-white/15 bg-neutral-950 p-2 text-sm text-white"
                  />
                  <p className="mt-1 text-xs text-neutral-400">Seleccioná y copiá el texto para usarlo cuando haya un contacto real.</p>
                </div>
              )}
            </article>
          ))}
        </div>

        <p className="mt-6 rounded-xl border border-white/10 bg-neutral-950/60 px-4 py-3 text-sm text-neutral-300">
          Agenda y horarios ilustrativos para esta demo. La disponibilidad se
          confirma con el club; no hay reservas en tiempo real. El WhatsApp se
          habilita al configurar el número real del negocio.
        </p>
      </div>
    </section>
  )
}

export default BookingConsultation
