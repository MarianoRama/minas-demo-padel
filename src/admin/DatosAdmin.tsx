import { useRef, useState } from "react"
import { useDatos } from "../data/useDatos"
import { BotonPeligro, BotonSecundario, ConfirmarDialogo, TarjetaSeccion } from "./ui"

export default function DatosAdmin() {
  const { exportarJson, importarJson, restaurarEjemplo, storageError } = useDatos()
  const fileRef = useRef<HTMLInputElement>(null)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [confirmarReset, setConfirmarReset] = useState(false)

  function descargar() {
    const blob = new Blob([exportarJson()], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "padel-minas-club-datos.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function cargar(file: File) {
    const lector = new FileReader()
    lector.onload = () => {
      const resultado = importarJson(String(lector.result))
      setMensaje(resultado.ok ? "Copia cargada con éxito." : resultado.error)
    }
    lector.onerror = () => setMensaje("No se pudo leer el archivo.")
    lector.readAsText(file)
  }

  return (
    <TarjetaSeccion titulo="Copia de los datos" ayuda="Todo lo que cargues en el panel vive en este navegador.">
      {storageError && (
        <p className="mb-4 border border-ladrillo-600 bg-ladrillo-100 px-3 py-2 text-sm font-semibold text-ladrillo-700">
          {storageError}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <BotonSecundario onClick={descargar}>Descargar copia (JSON)</BotonSecundario>
        <BotonSecundario onClick={() => fileRef.current?.click()}>Cargar copia</BotonSecundario>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && cargar(e.target.files[0])}
        />
        <BotonPeligro onClick={() => setConfirmarReset(true)}>Volver a los datos de ejemplo</BotonPeligro>
      </div>
      {mensaje && <p className="mt-3 text-sm text-ink-700">{mensaje}</p>}

      {confirmarReset && (
        <ConfirmarDialogo
          titulo="Volver a los datos de ejemplo"
          textoConfirmar="Sí, restaurar"
          onCancelar={() => setConfirmarReset(false)}
          onConfirmar={() => {
            restaurarEjemplo()
            setConfirmarReset(false)
            setMensaje("Se restauraron los datos de ejemplo.")
          }}
        >
          Esto reemplaza todo lo que cargaste (canchas, precios, horario, clases, ranking y bloqueos)
          por los datos de ejemplo originales. No se puede deshacer.
        </ConfirmarDialogo>
      )}
    </TarjetaSeccion>
  )
}
