import { useState, type FormEvent } from "react"
import { courts } from "../data/courts"
import { HOURS } from "../data/schedule"
import { whatsappLink } from "../lib/contact"

function todayValue() {
  const date = new Date()
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return localDate.toISOString().slice(0, 10)
}

function validHours(date: string) {
  if (date !== todayValue()) return HOURS
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes()
  return HOURS.filter((hour) => hour * 60 > nowMinutes)
}

function formatDate(value: string) {
  if (!value) return "Elegí una fecha"
  return new Date(`${value}T12:00:00`).toLocaleDateString("es-UY", {
    weekday: "long", day: "numeric", month: "long",
  })
}

function BookingRequest() {
  const [courtId, setCourtId] = useState(courts[0]?.id ?? "")
  const [date, setDate] = useState(todayValue())
  const [time, setTime] = useState(String(validHours(todayValue())[0] ?? HOURS[0] ?? 9))
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const court = courts.find((option) => option.id === courtId) ?? courts[0]

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validHours(date).includes(Number(time))) return
    setMessage([
      "Hola, quisiera solicitar una cancha en Pádel Minas Club (demo).",
      `Cancha: ${court.name}`,
      `Fecha: ${formatDate(date)}`,
      `Hora propuesta: ${time}:00`,
      `Nombre: ${name.trim()}`,
      phone.trim() ? `Teléfono de contacto: ${phone.trim()}` : "Sin teléfono de contacto indicado",
    ].join("\n"))
  }

  const contactUrl = message ? whatsappLink(message) : null
  const times = validHours(date)

  return (
    <section id="reservar" className="scroll-mt-32 bg-neutral-900 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-400">Una solicitud, sin pasos ocultos</p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Elegí cancha y horario</h2>
          <p className="mt-3 leading-relaxed text-neutral-300">Completá los datos y revisá el resumen. El horario es una propuesta: el club debe confirmar que la cancha esté libre antes de dar por cerrado el turno.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.8fr]">
          <form onSubmit={handleSubmit} onChange={() => setMessage("")} className="space-y-6 rounded-2xl border border-white/10 bg-neutral-950 p-5 sm:p-8">
            <fieldset className="grid gap-4 sm:grid-cols-2">
              <legend className="mb-3 text-lg font-semibold text-white">1. Lugar y horario solicitado</legend>
              <label className="text-sm font-medium text-neutral-200 sm:col-span-2">
                Cancha
                <select required value={courtId} onChange={(event) => setCourtId(event.target.value)} className="mt-2 min-h-12 w-full rounded-lg border border-white/15 bg-neutral-900 px-3 text-base text-white">
                  {courts.map((option) => <option key={option.id} value={option.id}>{option.name} · {option.type}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium text-neutral-200">
                Día
                <input required type="date" min={todayValue()} value={date} onChange={(event) => { setDate(event.target.value); setTime(String(validHours(event.target.value)[0] ?? "")) }} className="mt-2 min-h-12 w-full rounded-lg border border-white/15 bg-neutral-900 px-3 text-base text-white" />
              </label>
              <label className="text-sm font-medium text-neutral-200">
                Hora propuesta
                <span className="mt-2 block text-xs font-normal text-neutral-500">Duración propuesta: 1 hora</span>
                <div role="group" aria-label="Elegí una hora propuesta" className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {times.map((hour) => (
                    <button key={hour} type="button" aria-pressed={time === String(hour)} onClick={() => { setTime(String(hour)); setMessage("") }} className={`min-h-11 rounded-lg border px-2 text-sm font-semibold ${time === String(hour) ? "border-green-400 bg-green-400 text-neutral-950" : "border-white/15 bg-neutral-900 text-neutral-200 hover:border-green-400"}`}>
                      {String(hour).padStart(2, "0")}:00
                    </button>
                  ))}
                </div>
                {!times.length && <p className="mt-2 text-xs text-amber-300">No quedan horas de referencia para hoy; elegí otra fecha.</p>}
              </label>
              <p className="text-xs leading-relaxed text-neutral-500 sm:col-span-2">Fechas y horas de referencia. Este formulario no consulta canchas libres.</p>
            </fieldset>

            <fieldset className="grid gap-4 sm:grid-cols-2">
              <legend className="mb-3 text-lg font-semibold text-white">2. Datos para responderte</legend>
              <label className="text-sm font-medium text-neutral-200">
                Nombre
                <input required maxLength={80} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="mt-2 min-h-12 w-full rounded-lg border border-white/15 bg-neutral-900 px-3 text-base text-white" placeholder="Cómo te llamás" />
              </label>
              <label className="text-sm font-medium text-neutral-200">
                Teléfono <span className="font-normal text-neutral-500">(opcional)</span>
                <input type="tel" maxLength={30} autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-2 min-h-12 w-full rounded-lg border border-white/15 bg-neutral-900 px-3 text-base text-white" placeholder="Tu número de contacto" />
              </label>
            </fieldset>

            <button type="submit" disabled={!times.includes(Number(time))} className="min-h-12 w-full rounded-full bg-green-400 px-6 py-3 font-semibold text-neutral-950 transition-colors hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto">Revisar solicitud</button>
          </form>

          <aside aria-live="polite" className="h-fit rounded-2xl border border-white/10 bg-neutral-950 p-5 text-white sm:p-7 lg:sticky lg:top-36">
            <p className="text-xs font-semibold uppercase tracking-widest text-green-400">Tu propuesta</p>
            <h3 className="mt-2 text-2xl font-semibold">Solicitud de cancha</h3>
            <dl className="mt-5 space-y-3 text-sm">
              <div><dt className="text-neutral-500">Cancha</dt><dd className="font-medium">{court?.name}</dd></div>
              <div><dt className="text-neutral-500">Fecha y hora</dt><dd className="font-medium capitalize">{formatDate(date)} · {String(time).padStart(2, "0")}:00 · 1 hora</dd></div>
              <div><dt className="text-neutral-500">A nombre de</dt><dd className="font-medium">{name || "Completá tu nombre"}</dd></div>
            </dl>
            {message && (
              <div className="mt-6 border-t border-white/10 pt-5">
                {contactUrl ? (
                  <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-green-400 px-5 py-3 text-center font-semibold text-neutral-950 hover:bg-green-300">Enviar solicitud por WhatsApp</a>
                ) : (
                  <label className="block text-sm text-neutral-300">Número real del club pendiente de configurar<textarea readOnly value={message} rows={7} onFocus={(event) => event.currentTarget.select()} className="mt-2 w-full rounded-lg border border-white/15 bg-neutral-900 p-3 text-sm text-white" /></label>
                )}
                <p className="mt-3 text-xs leading-relaxed text-neutral-500">Enviar la consulta no confirma la reserva. El club debe verificar disponibilidad y responder.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}

export default BookingRequest
