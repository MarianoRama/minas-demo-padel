import type { HorarioDia } from "./types"

export const DAYS_AHEAD = 7

export function isPeakHour(hour: number): boolean {
  return hour >= 18 && hour <= 21
}

/**
 * Hash determinístico chiquito (FNV-1a) para simular una agenda "viva":
 * el mismo día + cancha + hora siempre da el mismo resultado, así que la
 * demo se ve ocupada de forma consistente sin depender de un backend.
 */
function hashToUnit(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0) / 0xffffffff
}

/** Turnos de ejemplo ya "ocupados" para una fecha (YYYY-MM-DD) dada. */
export function isOccupiedByDefault(dateKey: string, courtId: string, hour: number): boolean {
  const threshold = isPeakHour(hour) ? 0.45 : 0.15
  return hashToUnit(`${dateKey}|${courtId}|${hour}`) < threshold
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + (m || 0)
}

/** Las horas de inicio de turno posibles para un día del horario del club
 * (de apertura a cierre, en pasos de 1 hora; el último turno tiene que
 * terminar antes o justo al cierre). */
export function buildHoursForDay(horarioDia: HorarioDia | undefined): number[] {
  if (!horarioDia || horarioDia.cerrado) return []
  const desde = Math.ceil(toMinutes(horarioDia.apertura) / 60)
  const hasta = Math.floor(toMinutes(horarioDia.cierre) / 60)
  const horas: number[] = []
  for (let h = desde; h < hasta; h++) horas.push(h)
  return horas
}

export function formatHora(hhmm: string): string {
  return hhmm
}

export function endLabel(hour: number, duracionMin: number): string {
  const totalMin = hour * 60 + duracionMin
  const h = Math.floor(totalMin / 60) % 24
  const m = totalMin % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

export function precioPorTurno(precioPorHora: number, duracionMin: number): number {
  return Math.round(precioPorHora * (duracionMin / 60))
}

/** Extrae el número de un precio en texto libre, ej. "$1.200" -> 1200. */
export function parsePrecio(precioTexto: string): number {
  const digits = precioTexto.replace(/[^\d]/g, "")
  return digits ? Number(digits) : 0
}
