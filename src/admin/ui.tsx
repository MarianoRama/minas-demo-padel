import { cloneElement, isValidElement, useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactElement, type ReactNode, type TextareaHTMLAttributes } from "react"
import Dialog from "../components/Dialog"

export function Campo({
  label,
  ayuda,
  error,
  children,
}: {
  label: string
  ayuda?: string
  error?: string | null
  children: ReactNode
}) {
  const id = useId()
  const puedeAsociar = isValidElement(children)
  const contenido = puedeAsociar
    ? cloneElement(children as ReactElement<{ id?: string }>, { id })
    : children

  return (
    <div>
      <label htmlFor={puedeAsociar ? id : undefined} className="block text-sm font-semibold text-ink-700">
        {label}
      </label>
      {contenido}
      {ayuda && !error && <p className="mt-1 text-xs text-ink-500">{ayuda}</p>}
      {error && <p className="mt-1 text-xs font-semibold text-ladrillo-700">{error}</p>}
    </div>
  )
}

const campoBase =
  "mt-1.5 block w-full min-h-[48px] border px-3 text-base text-ink-900 focus:border-cancha-700 focus:outline-none focus:ring-2 focus:ring-cancha-700/30"

export function TextoInput(props: InputHTMLAttributes<HTMLInputElement> & { invalido?: boolean }) {
  const { invalido, className, ...rest } = props
  return (
    <input
      {...rest}
      className={`${campoBase} ${invalido ? "border-ladrillo-600" : "border-cancha-900/20"} ${className ?? ""}`}
    />
  )
}

export function TextoArea(props: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalido?: boolean }) {
  const { invalido, className, ...rest } = props
  return (
    <textarea
      {...rest}
      className={`${campoBase} min-h-[96px] py-2 ${invalido ? "border-ladrillo-600" : "border-cancha-900/20"} ${className ?? ""}`}
    />
  )
}

export function BotonPrimario({ className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`flex min-h-[48px] items-center justify-center gap-1.5 bg-cancha-900 px-5 text-sm font-bold text-hueso-50 transition-colors hover:bg-cancha-800 disabled:opacity-50 ${className}`}
    />
  )
}

export function BotonSecundario({ className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`flex min-h-[48px] items-center justify-center gap-1.5 border border-cancha-900/25 px-5 text-sm font-bold text-ink-700 transition-colors hover:bg-hueso-100 ${className}`}
    />
  )
}

export function BotonPeligro({ className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`flex min-h-[44px] items-center justify-center gap-1.5 border border-ladrillo-600/60 px-4 text-sm font-bold text-ladrillo-700 transition-colors hover:bg-ladrillo-600 hover:text-hueso-50 ${className}`}
    />
  )
}

export function Toggle({
  checked,
  onChange,
  etiquetaOn,
  etiquetaOff,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  etiquetaOn: string
  etiquetaOff: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex min-h-[44px] items-center gap-2 border px-4 text-sm font-bold uppercase tracking-wide transition-colors ${
        checked
          ? "border-cancha-900 bg-cancha-900 text-hueso-50"
          : "border-cancha-900/25 bg-hueso-50 text-ink-500"
      }`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${checked ? "bg-hueso-50" : "bg-ink-500/40"}`}
        aria-hidden="true"
      />
      {checked ? etiquetaOn : etiquetaOff}
    </button>
  )
}

export function ConfirmarDialogo({
  titulo,
  children,
  onConfirmar,
  onCancelar,
  textoConfirmar = "Sí, eliminar",
}: {
  titulo: string
  children: ReactNode
  onConfirmar: () => void
  onCancelar: () => void
  textoConfirmar?: string
}) {
  return (
    <Dialog title={titulo} onClose={onCancelar}>
      <h2 className="font-display text-xl font-bold uppercase tracking-wide text-cancha-900">{titulo}</h2>
      <div className="mt-2 text-sm text-ink-700">{children}</div>
      <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row">
        <BotonSecundario className="flex-1" onClick={onCancelar}>
          Volver
        </BotonSecundario>
        <BotonPeligro className="flex-1" onClick={onConfirmar}>
          {textoConfirmar}
        </BotonPeligro>
      </div>
    </Dialog>
  )
}

export function TarjetaSeccion({ titulo, ayuda, children }: { titulo: string; ayuda?: string; children: ReactNode }) {
  return (
    <div className="border border-cancha-900/15 bg-hueso-50 p-4 sm:p-6">
      <h2 className="font-display text-xl font-bold uppercase tracking-wide text-cancha-900">{titulo}</h2>
      {ayuda && <p className="mt-1 text-sm text-ink-500">{ayuda}</p>}
      <div className="mt-5">{children}</div>
    </div>
  )
}
