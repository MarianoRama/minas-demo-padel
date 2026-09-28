import { useState } from "react"
import type { Reservation } from "../data/booking"
import AdminLogin from "./AdminLogin"
import { cerrarSesionAdmin, haySesionAdmin } from "./sesion"
import CanchasAdmin from "./CanchasAdmin"
import PreciosAdmin from "./PreciosAdmin"
import HorarioAdmin from "./HorarioAdmin"
import ClasesAdmin from "./ClasesAdmin"
import RankingAdmin from "./RankingAdmin"
import NegocioAdmin from "./NegocioAdmin"
import AgendaAdmin from "./AgendaAdmin"
import DatosAdmin from "./DatosAdmin"

interface AdminAppProps {
  reservations: Reservation[]
  cancelReservation: (id: string) => void
}

const PESTANIAS = [
  { id: "agenda", label: "Agenda" },
  { id: "canchas", label: "Canchas" },
  { id: "precios", label: "Precios" },
  { id: "horario", label: "Horario" },
  { id: "clases", label: "Clases y torneos" },
  { id: "ranking", label: "Ranking" },
  { id: "negocio", label: "Negocio" },
  { id: "datos", label: "Copia de datos" },
] as const

type PestaniaId = (typeof PESTANIAS)[number]["id"]

export default function AdminApp({ reservations, cancelReservation }: AdminAppProps) {
  const [logueado, setLogueado] = useState(haySesionAdmin)
  const [pestania, setPestania] = useState<PestaniaId>("agenda")

  if (!logueado) {
    return <AdminLogin onIngresar={() => setLogueado(true)} />
  }

  return (
    <div className="min-h-screen bg-hueso-100">
      <p className="bg-cancha-950 py-1.5 text-center text-xs font-semibold text-hueso-50">
        Modo demostración: los cambios se guardan solo en este navegador.
      </p>
      <header className="border-b border-cancha-900/15 bg-hueso-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <p className="font-display text-lg font-bold uppercase tracking-wide text-cancha-900">
              Panel · Pádel Minas Club
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a href="#inicio" className="text-sm font-semibold text-ink-700 underline underline-offset-2">
              Ver sitio
            </a>
            <button
              type="button"
              onClick={() => {
                cerrarSesionAdmin()
                setLogueado(false)
              }}
              className="text-sm font-semibold text-ladrillo-600"
            >
              Salir
            </button>
          </div>
        </div>
        <nav aria-label="Secciones del panel" className="mx-auto max-w-5xl overflow-x-auto px-4 pb-3 sm:px-6">
          <ul className="flex gap-2">
            {PESTANIAS.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setPestania(p.id)}
                  aria-current={pestania === p.id ? "page" : undefined}
                  className={`min-h-[44px] whitespace-nowrap border px-4 text-sm font-bold ${
                    pestania === p.id
                      ? "border-cancha-900 bg-cancha-900 text-hueso-50"
                      : "border-cancha-900/20 bg-hueso-50 text-ink-700"
                  }`}
                >
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {pestania === "agenda" && <AgendaAdmin reservations={reservations} cancelReservation={cancelReservation} />}
        {pestania === "canchas" && <CanchasAdmin />}
        {pestania === "precios" && <PreciosAdmin />}
        {pestania === "horario" && <HorarioAdmin />}
        {pestania === "clases" && <ClasesAdmin />}
        {pestania === "ranking" && <RankingAdmin />}
        {pestania === "negocio" && <NegocioAdmin />}
        {pestania === "datos" && <DatosAdmin />}
      </main>
    </div>
  )
}
