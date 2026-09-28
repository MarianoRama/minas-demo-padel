import { useMemo, useReducer, useState, type FormEvent } from "react"
import { courts } from "../data/courts"
import { DAYS_AHEAD, HOURS } from "../data/schedule"

const STARTING_CREDITS = 3
type DemoBooking = {
  id: number
  courtId: string
  date: string
  hour: number
  status: "active" | "cancelled"
  refunded: boolean
}
type DemoState = { credits: number; bookings: DemoBooking[] }
type DemoAction =
  | { type: "reserve"; courtId: string; date: string; hour: number }
  | { type: "cancel"; bookingId: number }

function demoReducer(state: DemoState, action: DemoAction): DemoState {
  if (action.type === "reserve") {
    if (state.credits < 1 || state.bookings.some((booking) => booking.status === "active" && booking.courtId === action.courtId && booking.date === action.date && booking.hour === action.hour)) return state
    const id = state.bookings.reduce((max, booking) => Math.max(max, booking.id), 0) + 1
    return { credits: state.credits - 1, bookings: [...state.bookings, { id, courtId: action.courtId, date: action.date, hour: action.hour, status: "active", refunded: false }] }
  }
  const booking = state.bookings.find((item) => item.id === action.bookingId)
  if (!booking || booking.status !== "active" || booking.refunded) return state
  return {
    credits: state.credits + 1,
    bookings: state.bookings.map((item) => item.id === action.bookingId ? { ...item, status: "cancelled", refunded: true } : item),
  }
}

function dateValue(date: Date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return localDate.toISOString().slice(0, 10)
}

function todayValue() {
  return dateValue(new Date())
}

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("es-UY", {
    weekday: "long", day: "numeric", month: "long",
  })
}

function validHours(date: string) {
  if (date !== todayValue()) return HOURS
  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  return HOURS.filter((hour) => hour * 60 > nowMinutes)
}

function Memberships() {
  const [{ credits, bookings }, dispatch] = useReducer(demoReducer, { credits: STARTING_CREDITS, bookings: [] })
  const [courtId, setCourtId] = useState(courts[0]?.id ?? "")
  const [date, setDate] = useState(todayValue())
  const [hour, setHour] = useState<number | null>(validHours(todayValue())[0] ?? null)
  const [feedback, setFeedback] = useState("")
  const court = courts.find((option) => option.id === courtId) ?? courts[0]
  const hours = validHours(date)
  const maxDate = useMemo(() => {
    const limit = new Date()
    limit.setDate(limit.getDate() + DAYS_AHEAD)
    return dateValue(limit)
  }, [])
  const activeBookings = bookings.filter((booking) => booking.status === "active")

  function reserve(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (credits < 1) {
      setFeedback("Te quedaste sin créditos de prueba. Cancelá una reserva activa para recuperar uno.")
      return
    }
    if (hour === null || !hours.includes(hour)) {
      setFeedback("Elegí un horario futuro para continuar.")
      return
    }
    const duplicate = activeBookings.some((booking) => booking.courtId === courtId && booking.date === date && booking.hour === hour)
    if (duplicate) {
      setFeedback("Ya tenés una reserva activa para esa cancha y ese horario.")
      return
    }
    dispatch({ type: "reserve", courtId, date, hour })
    setFeedback("Reserva de prueba creada. Se descontó 1 crédito de demostración.")
  }

  function cancel(bookingId: number) {
    dispatch({ type: "cancel", bookingId })
    setFeedback("Reserva cancelada. El crédito de prueba volvió a tu saldo.")
  }

  return (
    <section id="precios" className="scroll-mt-32 bg-neutral-950 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-400">Membresía de muestra</p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Probá reservar con créditos</h2>
          <p className="mt-4 leading-relaxed text-neutral-300">En esta demo cada turno dura una hora y usa 1 crédito. Empezás con 3 créditos de prueba; podés reservar, cancelar y ver cómo vuelve el saldo.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="h-fit rounded-2xl border border-green-400/25 bg-green-400/10 p-6 text-white">
            <p className="text-sm font-medium text-green-200">Saldo de prueba</p>
            <p className="mt-2 text-5xl font-bold tabular-nums" aria-live="polite">{credits}<span className="ml-2 text-lg font-medium text-neutral-300">{credits === 1 ? "crédito" : "créditos"}</span></p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-300">Cada reserva activa usa 1 crédito. Cancelarla devuelve ese crédito una sola vez.</p>
            <div className="mt-5 flex gap-1.5" aria-label={`${credits} de ${STARTING_CREDITS} créditos disponibles`}>
              {Array.from({ length: STARTING_CREDITS }, (_, index) => <span key={index} className={`h-2 flex-1 rounded-full ${index < credits ? "bg-green-400" : "bg-white/15"}`} />)}
            </div>
            <span className="mt-2 block text-xs text-neutral-500">3 créditos al iniciar · 1 turno = 1 hora</span>
          </aside>

          <form onSubmit={reserve} className="space-y-5 rounded-2xl border border-white/10 bg-neutral-900 p-5 sm:p-7">
            <div>
              <h3 className="text-xl font-semibold text-white">Nueva reserva de prueba</h3>
              <p className="mt-1 text-sm text-neutral-400">Elegí una cancha, una fecha y un horario disponible en la simulación.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-neutral-200">
                Cancha
                <select value={courtId} onChange={(event) => setCourtId(event.target.value)} className="mt-2 min-h-12 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 text-base text-white">
                  {courts.map((option) => <option key={option.id} value={option.id}>{option.name} · {option.type}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium text-neutral-200">
                Fecha
                <input required type="date" min={todayValue()} max={maxDate} value={date} onChange={(event) => { setDate(event.target.value); setHour(validHours(event.target.value)[0] ?? null); setFeedback("") }} className="mt-2 min-h-12 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 text-base text-white" />
              </label>
            </div>
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium text-neutral-200">Horario · 1 hora</p>
                <p className="text-xs text-neutral-500">{formatDate(date)}</p>
              </div>
              <div role="group" aria-label="Elegí un horario para la membresía" className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {hours.map((option) => {
                  const taken = activeBookings.some((booking) => booking.courtId === courtId && booking.date === date && booking.hour === option)
                  return <button key={option} type="button" disabled={taken} aria-pressed={hour === option} onClick={() => { setHour(option); setFeedback("") }} className={`min-h-11 rounded-lg border px-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-35 ${hour === option ? "border-green-400 bg-green-400 text-neutral-950" : "border-white/15 bg-neutral-950 text-neutral-200 hover:border-green-400"}`}>{String(option).padStart(2, "0")}:00{taken ? " · ocupada" : ""}</button>
                })}
              </div>
              {!hours.length && <p className="mt-2 text-sm text-amber-300">No quedan horarios futuros para hoy. Elegí otra fecha.</p>}
            </div>
            <button type="submit" disabled={credits < 1 || hour === null || !hours.includes(hour)} className="min-h-12 w-full rounded-full bg-green-400 px-6 py-3 font-semibold text-neutral-950 transition-colors hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto">Reservar con 1 crédito</button>
            {feedback && <p role="status" className="rounded-lg border border-green-400/20 bg-green-400/10 p-3 text-sm text-green-100">{feedback}</p>}
          </form>
        </div>

        <section aria-labelledby="my-bookings-title" className="mt-8 rounded-2xl border border-white/10 bg-neutral-900 p-5 sm:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 id="my-bookings-title" className="text-xl font-semibold text-white">Mis reservas de prueba</h3>
            <span className="text-sm text-neutral-400">{activeBookings.length} activas</span>
          </div>
          {!bookings.length ? <p className="mt-4 rounded-xl border border-dashed border-white/15 p-5 text-sm text-neutral-400">Todavía no hay reservas. Elegí un horario arriba para probar el circuito.</p> : (
            <ul className="mt-4 divide-y divide-white/10">
              {[...bookings].reverse().map((booking) => {
                const itemCourt = courts.find((option) => option.id === booking.courtId)
                const isActive = booking.status === "active"
                return <li key={booking.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-white">{itemCourt?.name ?? court?.name} <span className="font-normal text-neutral-400">· {String(booking.hour).padStart(2, "0")}:00 a {String(booking.hour + 1).padStart(2, "0")}:00</span></p>
                    <p className="mt-1 text-sm capitalize text-neutral-400">{formatDate(booking.date)} · {isActive ? "Activa · 1 crédito usado" : "Cancelada · crédito devuelto"}</p>
                  </div>
                  {isActive ? <button type="button" onClick={() => cancel(booking.id)} className="min-h-10 rounded-full border border-white/20 px-4 text-sm font-semibold text-white hover:border-green-300 hover:text-green-200">Cancelar y devolver crédito</button> : <span className="text-xs font-medium text-neutral-500">Crédito devuelto</span>}
                </li>
              })}
            </ul>
          )}
        </section>

        <p className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/5 px-4 py-3 text-sm leading-relaxed text-amber-100/80">Demo interactiva: los créditos y reservas son de ejemplo y se guardan solo mientras esta página está abierta. No hay cuenta, pago, agenda real ni confirmación del club.</p>
      </div>
    </section>
  )
}

export default Memberships
