import { useContext } from "react"
import { DatosContext, type DatosContextValue } from "./store"
import type { Cancha, ClaseTorneo } from "./types"

export function useDatos(): DatosContextValue {
  const ctx = useContext(DatosContext)
  if (!ctx) throw new Error("useDatos() tiene que usarse dentro de <DatosProvider>")
  return ctx
}

export function canchasActivas(canchas: Cancha[]): Cancha[] {
  return canchas.filter((c) => c.activa)
}

export function clasesVisibles(clases: ClaseTorneo[]): ClaseTorneo[] {
  return clases.filter((c) => c.estado === "activo")
}
