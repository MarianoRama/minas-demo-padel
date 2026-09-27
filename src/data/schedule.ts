// Horario de la agenda: de 9:00 a 23:00, turnos de una hora.
export const HOURS: number[] = Array.from({ length: 14 }, (_, i) => i + 9) // 9..22 (último turno 22:00-23:00)

export const DAYS_AHEAD = 7

export const PRICE_PER_HOUR = 1200

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
  const threshold = isPeakHour(hour) ? 0.62 : 0.3
  return hashToUnit(`${dateKey}|${courtId}|${hour}`) < threshold
}
