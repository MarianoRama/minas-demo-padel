// Tipos de las colecciones editables desde el panel de administración.
// El sitio público y el panel comparten estos tipos: lo que se edita en uno
// es exactamente lo que se muestra en el otro.

export interface Cancha {
  id: string
  nombre: string
  tipo: "cubierta" | "aire libre"
  descripcion: string
  detalle: string
  activa: boolean
  foto?: string
}

export interface Precio {
  id: string
  nombre: string
  precio: string
  unidad: string
  detalle: string
  destacado: boolean
}

export type DiaSemana = "domingo" | "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado"

export const DIAS_SEMANA: DiaSemana[] = [
  "domingo",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
]

export const DIA_LABEL: Record<DiaSemana, string> = {
  domingo: "Domingo",
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
}

export interface HorarioDia {
  dia: DiaSemana
  cerrado: boolean
  apertura: string // "HH:mm"
  cierre: string // "HH:mm"
}

export interface Horario {
  dias: HorarioDia[]
  duracionTurnoMin: 60 | 90
}

export type EstadoClase = "activo" | "pausado"

export interface ClaseTorneo {
  id: string
  titulo: string
  tipo: "clase" | "torneo"
  dia: string // texto libre: "Martes y jueves" o "Sábado 12 de octubre"
  hora: string // texto libre: "19:00 a 21:00"
  profe: string
  precio: string
  cupos: number
  estado: EstadoClase
  foto?: string
}

export interface Negocio {
  whatsapp: string
  direccion: string
  aviso: string
}

export interface Bloqueo {
  id: string
  dateKey: string
  courtId: string | null // null = todas las canchas ese día
  horaDesde: number
  horaHasta: number // inclusive
  motivo: string
}

export interface RankingFila {
  id: string
  pareja: string
  puntos: number
  partidos: number
}

export interface DatosState {
  canchas: Cancha[]
  precios: Precio[]
  horario: Horario
  clases: ClaseTorneo[]
  negocio: Negocio
  ranking: RankingFila[]
  bloqueos: Bloqueo[]
}

export type ColeccionLista = "canchas" | "precios" | "clases" | "ranking" | "bloqueos"
