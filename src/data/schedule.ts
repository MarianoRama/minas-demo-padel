// Horario de la agenda: de 9:00 a 23:00, turnos de una hora.
export const HOURS: number[] = Array.from({ length: 14 }, (_, i) => i + 9) // 9..22 (último turno 22:00-23:00)

export const DAYS_AHEAD = 7

export interface OccupiedSlot {
  dayOffset: number // 0 = hoy, 1 = mañana, ...
  courtId: string
  hour: number
}

// Datos de ejemplo (hardcodeados) para simular una agenda con turnos ya ocupados.
export const OCCUPIED_SLOTS: OccupiedSlot[] = [
  { dayOffset: 0, courtId: "c1", hour: 19 },
  { dayOffset: 0, courtId: "c1", hour: 20 },
  { dayOffset: 0, courtId: "c2", hour: 10 },
  { dayOffset: 0, courtId: "c3", hour: 21 },
  { dayOffset: 1, courtId: "c1", hour: 9 },
  { dayOffset: 1, courtId: "c2", hour: 18 },
  { dayOffset: 1, courtId: "c2", hour: 19 },
  { dayOffset: 1, courtId: "c3", hour: 12 },
  { dayOffset: 2, courtId: "c1", hour: 20 },
  { dayOffset: 2, courtId: "c1", hour: 21 },
  { dayOffset: 2, courtId: "c3", hour: 17 },
  { dayOffset: 3, courtId: "c2", hour: 9 },
  { dayOffset: 3, courtId: "c2", hour: 10 },
  { dayOffset: 3, courtId: "c1", hour: 22 },
  { dayOffset: 4, courtId: "c3", hour: 19 },
  { dayOffset: 4, courtId: "c3", hour: 20 },
  { dayOffset: 4, courtId: "c1", hour: 11 },
  { dayOffset: 5, courtId: "c1", hour: 18 },
  { dayOffset: 5, courtId: "c2", hour: 21 },
  { dayOffset: 6, courtId: "c2", hour: 20 },
  { dayOffset: 6, courtId: "c3", hour: 9 },
]
