import { useState, type FormEvent } from "react"
import Dialog from "./Dialog"
import type { Court } from "../data/courts"
import { PRICE_PER_HOUR } from "../data/schedule"
import {
  buildIcs,
  buildWhatsAppMessage,
  downloadIcs,
  formatDateLong,
  generateCode,
  validateName,
  validatePhone,
  type Reservation,
} from "../data/booking"

interface BookingModalProps {
  court: Court
  dateKey: string
  hour: number
  onClose: () => void
  onConfirmed: (reservation: Reservation) => void
}

function BookingModal({ court, dateKey, hour, onClose, onConfirmed }: BookingModalProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [nameError, setNameError] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [result, setResult] = useState<Reservation | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nErr = validateName(name)
    const pErr = validatePhone(phone)
    setNameError(nErr)
    setPhoneError(pErr)
    if (nErr || pErr) return

    const reservation: Reservation = {
      id: generateCode(),
      dateKey,
      courtId: court.id,
      hour,
      name: name.trim(),
      phone: phone.trim(),
      createdAt: Date.now(),
    }
    onConfirmed(reservation)
    setResult(reservation)
  }

  if (result) {
    const waHref = `https://wa.me/?text=${encodeURIComponent(buildWhatsAppMessage(result, court.name))}`
    return (
      <Dialog title="Turno confirmado" onClose={onClose}>
        <div className="text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cancha-900">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#faf7f0" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-wide text-cancha-900">
            ¡Turno confirmado!
          </h2>
          <p className="mt-1 text-sm text-ink-500">Guardá tu código de reserva</p>
          <p className="mt-3 font-display text-4xl font-black tracking-wider text-ladrillo-600">
            {result.id}
          </p>
        </div>

        <dl className="mt-6 space-y-2 rounded-lg bg-hueso-100 p-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-500">Cancha</dt>
            <dd className="font-semibold text-ink-900">{court.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">Día</dt>
            <dd className="font-semibold text-ink-900 capitalize">{formatDateLong(dateKey)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">Hora</dt>
            <dd className="font-semibold text-ink-900">{hour}:00 a {hour + 1}:00</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">Precio</dt>
            <dd className="font-semibold text-ink-900">${PRICE_PER_HOUR}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col gap-2.5">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-[#25D366] text-sm font-bold text-ink-900"
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-current" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.16c-.24.68-1.4 1.32-1.94 1.4-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.13 1.02-2.42.27-.29.58-.37.78-.37.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.75 1.24 1.61 2.01 1.11.99 2.04 1.29 2.33 1.44.29.15.46.13.63-.08.17-.21.72-.84.91-1.13.19-.29.39-.24.65-.14.27.1 1.68.79 1.97.94.29.14.48.21.55.33.07.12.07.68-.17 1.36z" />
            </svg>
            Avisar por WhatsApp
          </a>
          <button
            type="button"
            onClick={() => downloadIcs(`turno-${result.id}.ics`, buildIcs(result, court.name))}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-md border border-cancha-900/20 text-sm font-bold text-cancha-900"
          >
            Agregar a calendario
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-1 flex min-h-[44px] items-center justify-center text-sm font-semibold text-ink-500"
          >
            Cerrar
          </button>
        </div>
      </Dialog>
    )
  }

  return (
    <Dialog title="Confirmá tu turno" onClose={onClose}>
      <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-cancha-900">
        Confirmá tu turno
      </h2>

      <dl className="mt-4 space-y-2 rounded-lg bg-hueso-100 p-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-500">Cancha</dt>
          <dd className="font-semibold text-ink-900">{court.name}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-500">Día</dt>
          <dd className="font-semibold text-ink-900 capitalize">{formatDateLong(dateKey)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-500">Hora</dt>
          <dd className="font-semibold text-ink-900">{hour}:00 a {hour + 1}:00</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-500">Precio</dt>
          <dd className="font-semibold text-ink-900">${PRICE_PER_HOUR}</dd>
        </div>
      </dl>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="booking-name" className="block text-sm font-semibold text-ink-700">
            Nombre y apellido
          </label>
          <input
            id="booking-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? "booking-name-error" : undefined}
            className="mt-1.5 block w-full min-h-[44px] rounded-md border border-cancha-900/20 px-3 text-base text-ink-900 focus:border-cancha-700 focus:outline-none focus:ring-2 focus:ring-cancha-700/30"
            placeholder="Ej. Lucía Fernández"
          />
          {nameError && (
            <p id="booking-name-error" className="mt-1 text-sm text-ladrillo-700">
              {nameError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="booking-phone" className="block text-sm font-semibold text-ink-700">
            Teléfono / WhatsApp
          </label>
          <input
            id="booking-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={Boolean(phoneError)}
            aria-describedby={phoneError ? "booking-phone-error" : undefined}
            className="mt-1.5 block w-full min-h-[44px] rounded-md border border-cancha-900/20 px-3 text-base text-ink-900 focus:border-cancha-700 focus:outline-none focus:ring-2 focus:ring-cancha-700/30"
            placeholder="Ej. 099 123 456"
          />
          {phoneError && (
            <p id="booking-phone-error" className="mt-1 text-sm text-ladrillo-700">
              {phoneError}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-md border border-cancha-900/20 text-sm font-bold text-ink-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-md bg-ladrillo-600 text-sm font-bold text-hueso-50 hover:bg-ladrillo-700"
          >
            Confirmar turno
          </button>
        </div>
      </form>
    </Dialog>
  )
}

export default BookingModal
