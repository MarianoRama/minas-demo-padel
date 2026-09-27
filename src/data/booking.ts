// Modelo y persistencia de reservas hechas por el visitante.
// Todo vive en localStorage del navegador: es una demo, no hay backend.

import { courts as ALL_COURTS } from "./courts"
import { HOURS, DAYS_AHEAD, isOccupiedByDefault } from "./schedule"

const CLUB_TIMEZONE = "America/Montevideo"

/**
 * El club está en Uruguay: "hoy" y "ahora" se calculan siempre en su huso
 * horario, no en el del navegador de quien mira la demo (podría estar en
 * cualquier parte del mundo). Truco: armamos un Date "local" con los
 * números de reloj de Montevideo, así los getters locales (getFullYear,
 * getHours, etc.) que ya usa el resto del código devuelven directamente la
 * hora del club sin tener que tocar esa lógica.
 */
export function nowInClub(): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CLUB_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date())

  const map: Record<string, string> = {}
  for (const p of parts) map[p.type] = p.value

  const hour = Number(map.hour) % 24 // "24" a medianoche con hour12:false
  return new Date(Number(map.year), Number(map.month) - 1, Number(map.day), hour, Number(map.minute), Number(map.second))
}

export interface Reservation {
  id: string // código de reserva, ej. "PMC-7K2QF"
  dateKey: string // fecha absoluta YYYY-MM-DD (evita el bug de offsets relativos)
  courtId: string
  hour: number
  name: string
  phone: string
  createdAt: number
}

const STORAGE_KEY = "padel-minas-club.reservas.v2"

function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetItem(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

function isValidReservation(value: unknown): value is Reservation {
  if (!value || typeof value !== "object") return false
  const r = value as Record<string, unknown>
  return (
    typeof r.id === "string" &&
    typeof r.dateKey === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(r.dateKey) &&
    typeof r.courtId === "string" &&
    typeof r.hour === "number" &&
    typeof r.name === "string" &&
    typeof r.phone === "string"
  )
}

/**
 * Lee las reservas guardadas. El formato viejo (claves con offset de día
 * relativo, ej. "0-c1-9") vivía en otra clave de localStorage y con otra
 * forma de datos: como no matchea `isValidReservation` ni la clave nueva,
 * queda automáticamente ignorado sin romper nada.
 */
export function loadReservations(): Reservation[] {
  const raw = safeGetItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidReservation)
  } catch {
    return []
  }
}

export function saveReservations(list: Reservation[]): boolean {
  return safeSetItem(STORAGE_KEY, JSON.stringify(list))
}

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // sin 0/O/1/I para que se lea bien

export function generateCode(): string {
  let s = ""
  for (let i = 0; i < 5; i++) {
    s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  }
  return `PMC-${s}`
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function slotStart(dateKey: string, hour: number): Date {
  const d = parseDateKey(dateKey)
  d.setHours(hour, 0, 0, 0)
  return d
}

/** Un turno pasó si ya empezó (aplica solo a los turnos de hoy). */
export function isPastSlot(dateKey: string, hour: number, now: Date = nowInClub()): boolean {
  return slotStart(dateKey, hour).getTime() <= now.getTime()
}

export function formatDateLabel(dateKey: string): string {
  const d = parseDateKey(dateKey)
  return d.toLocaleDateString("es-UY", { weekday: "short", day: "2-digit", month: "2-digit" })
}

export function formatDateLong(dateKey: string): string {
  const d = parseDateKey(dateKey)
  return d.toLocaleDateString("es-UY", { weekday: "long", day: "2-digit", month: "long" })
}

/** "Hoy" / "Mañana" / abreviatura de día, tomando como referencia el huso del club. */
export function dayShortLabel(dateKey: string): string {
  const today = nowInClub()
  today.setHours(0, 0, 0, 0)
  const todayKey = toDateKey(today)
  if (dateKey === todayKey) return "Hoy"

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (dateKey === toDateKey(tomorrow)) return "Mañana"

  return parseDateKey(dateKey).toLocaleDateString("es-UY", { weekday: "short" })
}

export interface DayOption {
  dateKey: string
  label: string
  sublabel: string
}

/** Los próximos `daysAhead` días (incluido hoy), en el huso horario del club. */
export function buildDayOptions(daysAhead: number = DAYS_AHEAD): DayOption[] {
  const today = nowInClub()
  today.setHours(0, 0, 0, 0)
  return Array.from({ length: daysAhead }, (_, offset) => {
    const date = new Date(today)
    date.setDate(date.getDate() + offset)
    const dateKey = toDateKey(date)
    return {
      dateKey,
      label: dayShortLabel(dateKey),
      sublabel: date.toLocaleDateString("es-UY", { day: "2-digit", month: "2-digit" }),
    }
  })
}

export interface FreeSlot {
  dateKey: string
  courtId: string
  hour: number
}

/**
 * Los próximos turnos libres, en orden cronológico, mirando primero hoy y
 * después los días siguientes. Sirve tanto para el widget del hero como
 * para elegir el día que la agenda abre por default.
 */
export function findFreeSlots(reservations: Reservation[], limit: number, daysAhead: number = DAYS_AHEAD): FreeSlot[] {
  const mine = new Set(reservations.map((r) => `${r.dateKey}|${r.courtId}|${r.hour}`))
  const days = buildDayOptions(daysAhead)
  const result: FreeSlot[] = []

  for (const day of days) {
    for (const hour of HOURS) {
      if (isPastSlot(day.dateKey, hour)) continue
      for (const court of ALL_COURTS) {
        const key = `${day.dateKey}|${court.id}|${hour}`
        if (mine.has(key)) continue
        if (isOccupiedByDefault(day.dateKey, court.id, hour)) continue
        result.push({ dateKey: day.dateKey, courtId: court.id, hour })
        if (result.length >= limit) return result
      }
    }
  }
  return result
}

// --- Validación de datos de contacto ---

export function validateName(name: string): string | null {
  const trimmed = name.trim()
  if (trimmed.length < 3) return "Ingresá tu nombre completo."
  if (!/^[a-zA-ZÀ-ÿñÑ' .-]+$/.test(trimmed)) return "Usá solo letras, por favor."
  return null
}

export function validatePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "")
  if (digits.length < 8) return "Ingresá un teléfono válido (mínimo 8 dígitos)."
  if (digits.length > 12) return "Ese número parece tener dígitos de más."
  return null
}

// --- WhatsApp e .ics ---

export function buildWhatsAppMessage(res: Reservation, courtName: string): string {
  const fecha = formatDateLabel(res.dateKey)
  return (
    `Hola! Quería avisar que reservé ${courtName} el ${fecha} a las ${res.hour}:00 hs ` +
    `en Pádel Minas Club. Código de reserva: ${res.id}. A nombre de ${res.name}.`
  )
}

function pad2(n: number): string {
  return String(n).padStart(2, "0")
}

function icsDate(d: Date): string {
  return (
    `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}` +
    `T${pad2(d.getHours())}${pad2(d.getMinutes())}00`
  )
}

export function buildIcs(res: Reservation, courtName: string): string {
  const start = slotStart(res.dateKey, res.hour)
  const end = new Date(start.getTime() + 60 * 60 * 1000)
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Padel Minas Club//Demo//ES",
    "BEGIN:VEVENT",
    `UID:${res.id}@padelminasclub.demo`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:Turno de pádel — ${courtName}`,
    `DESCRIPTION:Reserva ${res.id} a nombre de ${res.name}. Pádel Minas Club (demo\\, no es un club real).`,
    "LOCATION:Pádel Minas Club\\, Minas\\, Lavalleja",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return lines.join("\r\n")
}

export function downloadIcs(filename: string, content: string): void {
  try {
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch {
    // Si el navegador bloquea la descarga, no rompemos el flujo de confirmación.
  }
}
