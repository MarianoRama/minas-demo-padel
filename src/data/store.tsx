import { createContext, useEffect, useState, type ReactNode } from "react"
import { DEFAULT_DATOS } from "./defaults"
import { csvToObjects } from "./csv"
import { FUENTE_DATOS } from "../config"
import type {
  Bloqueo,
  Cancha,
  ClaseTorneo,
  ColeccionLista,
  DatosState,
  Horario,
  HorarioDia,
  Negocio,
  Precio,
  RankingFila,
} from "./types"

const STORAGE_KEY = "padel-minas-club.datos.v1"

type Coleccion<K extends ColeccionLista> = DatosState[K][number]

function genId(prefix: string): string {
  try {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
  } catch {
    return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`
  }
}

function safeParse(raw: string | null): Partial<DatosState> | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return typeof parsed === "object" && parsed !== null ? parsed : null
  } catch {
    return null
  }
}

/** Mezcla superficial contra los valores por defecto: si falta una clave o
 * quedó con forma inválida (ej. una versión vieja del sitio guardó otra
 * cosa), se usa el valor de fábrica en vez de romper el sitio. */
function mergeWithDefaults(saved: Partial<DatosState> | null): DatosState {
  const base = DEFAULT_DATOS
  if (!saved) return base
  return {
    canchas: Array.isArray(saved.canchas) ? (saved.canchas as Cancha[]) : base.canchas,
    precios: Array.isArray(saved.precios) ? (saved.precios as Precio[]) : base.precios,
    horario:
      saved.horario && Array.isArray((saved.horario as Horario).dias)
        ? (saved.horario as Horario)
        : base.horario,
    clases: Array.isArray(saved.clases) ? (saved.clases as ClaseTorneo[]) : base.clases,
    negocio:
      saved.negocio && typeof (saved.negocio as Negocio).whatsapp === "string"
        ? (saved.negocio as Negocio)
        : base.negocio,
    ranking: Array.isArray(saved.ranking) ? (saved.ranking as RankingFila[]) : base.ranking,
    bloqueos: Array.isArray(saved.bloqueos) ? (saved.bloqueos as Bloqueo[]) : base.bloqueos,
  }
}

function loadInitial(): DatosState {
  try {
    return mergeWithDefaults(safeParse(window.localStorage.getItem(STORAGE_KEY)))
  } catch {
    return DEFAULT_DATOS
  }
}

interface DatosContextValue {
  datos: DatosState
  storageError: string | null
  clasesDesdeSheets: boolean
  cargandoClases: boolean
  errorClases: string | null
  crear: <K extends ColeccionLista>(coleccion: K, item: Omit<Coleccion<K>, "id">) => string
  actualizar: <K extends ColeccionLista>(coleccion: K, id: string, patch: Partial<Coleccion<K>>) => void
  eliminar: (coleccion: ColeccionLista, id: string) => void
  duplicar: (coleccion: ColeccionLista, id: string) => void
  actualizarHorarioDia: (dia: HorarioDia["dia"], patch: Partial<HorarioDia>) => void
  actualizarDuracionTurno: (min: 60 | 90) => void
  actualizarNegocio: (patch: Partial<Negocio>) => void
  restaurarEjemplo: () => void
  exportarJson: () => string
  importarJson: (json: string) => { ok: true } | { ok: false; error: string }
}

const DatosContext = createContext<DatosContextValue | null>(null)

export function DatosProvider({ children }: { children: ReactNode }) {
  const [datos, setDatos] = useState<DatosState>(loadInitial)
  const [storageError, setStorageError] = useState<string | null>(null)
  const [cargandoClases, setCargandoClases] = useState(FUENTE_DATOS.tipo === "sheets")
  const [errorClases, setErrorClases] = useState<string | null>(null)

  /** Persiste en localStorage inmediatamente después de cada cambio de
   * estado (no en un useEffect aparte, para no encadenar un segundo render
   * solo para reflejar el resultado del guardado). */
  function setDatosYPersistir(updater: DatosState | ((prev: DatosState) => DatosState)) {
    setDatos((prev) => {
      const next = typeof updater === "function" ? (updater as (p: DatosState) => DatosState)(prev) : updater
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        queueMicrotask(() => setStorageError(null))
      } catch {
        queueMicrotask(() =>
          setStorageError(
            "No se pudieron guardar los cambios en este navegador (memoria local llena o bloqueada). Los cambios se ven en esta visita, pero podrían perderse al recargar."
          )
        )
      }
      return next
    })
  }

  // Fuente opcional: Google Sheets para clases/torneos. Se ejecuta una sola
  // vez al montar; el estado inicial de carga ya contempla el arranque.
  useEffect(() => {
    if (FUENTE_DATOS.tipo !== "sheets") return
    let cancelado = false

    fetch(FUENTE_DATOS.csvUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`La planilla respondió ${res.status}`)
        return res.text()
      })
      .then((text) => {
        if (cancelado) return
        const filas = csvToObjects(text)
        const clases: ClaseTorneo[] = filas.map((f, i) => ({
          id: f.id || `sheet-${i}`,
          titulo: f.titulo || "Sin título",
          tipo: f.tipo === "torneo" ? "torneo" : "clase",
          dia: f.dia || "",
          hora: f.hora || "",
          profe: f.profe || "",
          precio: f.precio || "",
          cupos: Number(f.cupos) || 0,
          estado: f.estado === "pausado" ? "pausado" : "activo",
          foto: f.foto || undefined,
        }))
        setDatos((prev) => ({ ...prev, clases }))
      })
      .catch((err: unknown) => {
        if (cancelado) return
        setErrorClases(
          err instanceof Error ? err.message : "No se pudo cargar la planilla. Mostrando datos de ejemplo."
        )
      })
      .finally(() => {
        if (!cancelado) setCargandoClases(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  const value = ((): DatosContextValue => {
    function crear<K extends ColeccionLista>(coleccion: K, item: Omit<Coleccion<K>, "id">): string {
      const id = genId(coleccion.slice(0, 2))
      setDatosYPersistir((prev) => ({
        ...prev,
        [coleccion]: [...(prev[coleccion] as Coleccion<K>[]), { ...item, id } as Coleccion<K>],
      }))
      return id
    }

    function actualizar<K extends ColeccionLista>(coleccion: K, id: string, patch: Partial<Coleccion<K>>) {
      setDatosYPersistir((prev) => ({
        ...prev,
        [coleccion]: (prev[coleccion] as Coleccion<K>[]).map((it) =>
          (it as { id: string }).id === id ? { ...it, ...patch } : it
        ),
      }))
    }

    function eliminar(coleccion: ColeccionLista, id: string) {
      setDatosYPersistir((prev) => ({
        ...prev,
        [coleccion]: (prev[coleccion] as { id: string }[]).filter((it) => it.id !== id),
      }))
    }

    function duplicar(coleccion: ColeccionLista, id: string) {
      setDatosYPersistir((prev) => {
        const lista = prev[coleccion] as { id: string }[]
        const original = lista.find((it) => it.id === id)
        if (!original) return prev
        const copia = { ...original, id: genId(coleccion.slice(0, 2)) }
        if ("nombre" in copia) (copia as { nombre: string }).nombre += " (copia)"
        if ("titulo" in copia) (copia as { titulo: string }).titulo += " (copia)"
        return { ...prev, [coleccion]: [...lista, copia] }
      })
    }

    function actualizarHorarioDia(dia: HorarioDia["dia"], patch: Partial<HorarioDia>) {
      setDatosYPersistir((prev) => ({
        ...prev,
        horario: {
          ...prev.horario,
          dias: prev.horario.dias.map((d) => (d.dia === dia ? { ...d, ...patch } : d)),
        },
      }))
    }

    function actualizarDuracionTurno(min: 60 | 90) {
      setDatosYPersistir((prev) => ({ ...prev, horario: { ...prev.horario, duracionTurnoMin: min } }))
    }

    function actualizarNegocio(patch: Partial<Negocio>) {
      setDatosYPersistir((prev) => ({ ...prev, negocio: { ...prev.negocio, ...patch } }))
    }

    function restaurarEjemplo() {
      setDatosYPersistir(DEFAULT_DATOS)
    }

    function exportarJson(): string {
      return JSON.stringify(datos, null, 2)
    }

    function importarJson(json: string): { ok: true } | { ok: false; error: string } {
      try {
        const parsed = JSON.parse(json)
        const merged = mergeWithDefaults(parsed)
        setDatosYPersistir(merged)
        return { ok: true }
      } catch {
        return { ok: false, error: "El archivo no tiene un formato JSON válido." }
      }
    }

    return {
      datos,
      storageError,
      clasesDesdeSheets: FUENTE_DATOS.tipo === "sheets",
      cargandoClases,
      errorClases,
      crear,
      actualizar,
      eliminar,
      duplicar,
      actualizarHorarioDia,
      actualizarDuracionTurno,
      actualizarNegocio,
      restaurarEjemplo,
      exportarJson,
      importarJson,
    }
  })()

  return <DatosContext.Provider value={value}>{children}</DatosContext.Provider>
}

export { DatosContext }
export type { DatosContextValue }
