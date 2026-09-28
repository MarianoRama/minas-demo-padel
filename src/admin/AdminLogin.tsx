import { useState, type FormEvent } from "react"
import { BotonPrimario, TextoInput } from "./ui"
import { guardarSesionAdmin } from "./sesion"

const PIN_DEMO = "1234"

export default function AdminLogin({ onIngresar }: { onIngresar: () => void }) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (pin.trim() === PIN_DEMO) {
      guardarSesionAdmin()
      onIngresar()
    } else {
      setError("PIN incorrecto. Probá de nuevo.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cancha-950 px-4">
      <div className="w-full max-w-sm border border-hueso-50/15 bg-cancha-900 p-6 sm:p-8">
        <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-ladrillo-400">
          Panel del club
        </p>
        <h1 className="mt-2 font-display text-3xl font-black uppercase tracking-tight text-hueso-50">
          Pádel Minas Club
        </h1>
        <p className="mt-2 text-sm text-hueso-100/70">
          Ingresá el PIN para editar canchas, precios, horarios, clases y la agenda.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="pin" className="block text-sm font-semibold text-hueso-100">
              PIN de acceso
            </label>
            <TextoInput
              id="pin"
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value)
                setError(null)
              }}
              invalido={Boolean(error)}
              className="border-hueso-50/25 bg-cancha-950 text-hueso-50 placeholder:text-hueso-100/30"
              placeholder="••••"
              autoFocus
            />
            {error && <p className="mt-1 text-xs font-semibold text-ladrillo-400">{error}</p>}
          </div>
          <BotonPrimario type="submit" className="w-full">
            Ingresar
          </BotonPrimario>
        </form>

        <p className="mt-5 border border-dashed border-hueso-50/20 px-3 py-2 text-xs text-hueso-100/60">
          PIN de demostración: <strong className="text-hueso-100">1234</strong>. En un sitio real, el
          acceso se hace con una cuenta de Google (si los datos viven en Sheets) o con un login de
          verdad en un backend (ej. Supabase); este PIN es solo para esta demo.
        </p>
        <a href="#inicio" className="mt-4 inline-block text-xs font-semibold text-hueso-100/60 underline underline-offset-2">
          Volver al sitio
        </a>
      </div>
    </div>
  )
}
