import { useState } from "react"
import { useDatos } from "../data/useDatos"
import type { Cancha } from "../data/types"
import { archivoADataUrl } from "./imagenes"
import { BotonPeligro, BotonPrimario, BotonSecundario, Campo, ConfirmarDialogo, TarjetaSeccion, TextoArea, TextoInput, Toggle } from "./ui"

type Borrador = Omit<Cancha, "id">

const VACIA: Borrador = { nombre: "", tipo: "cubierta", descripcion: "", detalle: "", activa: true }

export default function CanchasAdmin() {
  const { datos, crear, actualizar, eliminar, duplicar } = useDatos()
  const [busqueda, setBusqueda] = useState("")
  const [editando, setEditando] = useState<string | null | "nueva">(null)
  const [borrador, setBorrador] = useState<Borrador>(VACIA)
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [aEliminar, setAEliminar] = useState<Cancha | null>(null)
  const [subiendo, setSubiendo] = useState(false)

  const filtradas = datos.canchas.filter((c) => c.nombre.toLowerCase().includes(busqueda.toLowerCase()))

  function abrirNueva() {
    setBorrador(VACIA)
    setErrores({})
    setEditando("nueva")
  }

  function abrirEditar(c: Cancha) {
    setBorrador({ nombre: c.nombre, tipo: c.tipo, descripcion: c.descripcion, detalle: c.detalle, activa: c.activa, foto: c.foto })
    setErrores({})
    setEditando(c.id)
  }

  function validar(): boolean {
    const e: Record<string, string> = {}
    if (borrador.nombre.trim().length < 2) e.nombre = "Ponele un nombre a la cancha."
    if (borrador.descripcion.trim().length < 3) e.descripcion = "Escribí una descripción corta."
    if (borrador.detalle.trim().length < 10) e.detalle = "Contá un poco más en el detalle."
    setErrores(e)
    return Object.keys(e).length === 0
  }

  function guardar() {
    if (!validar()) return
    if (editando === "nueva") crear("canchas", borrador)
    else if (editando) actualizar("canchas", editando, borrador)
    setEditando(null)
  }

  async function subirFoto(file: File) {
    setSubiendo(true)
    try {
      const dataUrl = await archivoADataUrl(file)
      setBorrador((b) => ({ ...b, foto: dataUrl }))
    } catch {
      setErrores((e) => ({ ...e, foto: "No se pudo procesar esa imagen." }))
    } finally {
      setSubiendo(false)
    }
  }

  if (editando !== null) {
    return (
      <TarjetaSeccion titulo={editando === "nueva" ? "Nueva cancha" : "Editar cancha"}>
        <div className="space-y-4">
          <Campo label="Nombre" error={errores.nombre}>
            <TextoInput
              value={borrador.nombre}
              onChange={(e) => setBorrador({ ...borrador, nombre: e.target.value })}
              invalido={Boolean(errores.nombre)}
              placeholder="Ej. Cancha 4 · Terraza"
            />
          </Campo>

          <Campo label="Tipo">
            <div className="mt-1.5 flex gap-2">
              {(["cubierta", "aire libre"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setBorrador({ ...borrador, tipo: t })}
                  className={`min-h-[48px] flex-1 border px-3 text-sm font-bold capitalize ${
                    borrador.tipo === t ? "border-cancha-900 bg-cancha-900 text-hueso-50" : "border-cancha-900/20 text-ink-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Campo>

          <Campo label="Descripción corta" ayuda="Se ve en la tarjeta de la lista." error={errores.descripcion}>
            <TextoInput
              value={borrador.descripcion}
              onChange={(e) => setBorrador({ ...borrador, descripcion: e.target.value })}
              invalido={Boolean(errores.descripcion)}
            />
          </Campo>

          <Campo label="Detalle" ayuda="El texto largo que ven los jugadores." error={errores.detalle}>
            <TextoArea
              value={borrador.detalle}
              onChange={(e) => setBorrador({ ...borrador, detalle: e.target.value })}
              invalido={Boolean(errores.detalle)}
            />
          </Campo>

          <Campo label="Foto" ayuda="Se redimensiona sola. Si no cargás foto, se usa la ilustración." error={errores.foto}>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => e.target.files?.[0] && subirFoto(e.target.files[0])}
              className="mt-1.5 block w-full text-sm"
            />
            {subiendo && <p className="mt-1 text-xs text-ink-500">Procesando imagen…</p>}
            {borrador.foto && (
              <div className="mt-2 flex items-center gap-3">
                <img src={borrador.foto} alt="Vista previa" className="h-20 w-28 border border-cancha-900/15 object-cover" />
                <BotonSecundario type="button" onClick={() => setBorrador({ ...borrador, foto: undefined })}>
                  Quitar foto
                </BotonSecundario>
              </div>
            )}
          </Campo>

          <Campo label="Estado">
            <Toggle
              checked={borrador.activa}
              onChange={(v) => setBorrador({ ...borrador, activa: v })}
              etiquetaOn="Activa"
              etiquetaOff="Pausada"
            />
          </Campo>

          <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row">
            <BotonSecundario className="flex-1" onClick={() => setEditando(null)}>
              Cancelar
            </BotonSecundario>
            <BotonPrimario className="flex-1" onClick={guardar}>
              Guardar cancha
            </BotonPrimario>
          </div>
        </div>
      </TarjetaSeccion>
    )
  }

  return (
    <TarjetaSeccion titulo="Canchas" ayuda="Las canchas pausadas no aparecen en la web ni en la agenda.">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TextoInput
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar cancha..."
          className="sm:max-w-xs"
        />
        <BotonPrimario type="button" onClick={abrirNueva}>
          + Nueva cancha
        </BotonPrimario>
      </div>

      <ul className="mt-4 divide-y divide-cancha-900/10 border border-cancha-900/15">
        {filtradas.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center gap-3 p-3">
            <div className="h-14 w-20 shrink-0 overflow-hidden border border-cancha-900/10 bg-hueso-100">
              {c.foto && <img src={c.foto} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-900">{c.nombre}</p>
              <p className="text-xs capitalize text-ink-500">{c.tipo}</p>
            </div>
            <span
              className={`px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                c.activa ? "bg-cancha-800/10 text-cancha-800" : "bg-ink-500/10 text-ink-500"
              }`}
            >
              {c.activa ? "Activa" : "Pausada"}
            </span>
            <div className="flex gap-1.5">
              <BotonSecundario onClick={() => abrirEditar(c)} className="!min-h-[40px] px-3 text-xs">
                Editar
              </BotonSecundario>
              <BotonSecundario onClick={() => duplicar("canchas", c.id)} className="!min-h-[40px] px-3 text-xs">
                Duplicar
              </BotonSecundario>
              <BotonPeligro onClick={() => setAEliminar(c)} className="!min-h-[40px] px-3 text-xs">
                Eliminar
              </BotonPeligro>
            </div>
          </li>
        ))}
        {filtradas.length === 0 && (
          <li className="p-4 text-center text-sm text-ink-500">No hay canchas que coincidan con la búsqueda.</li>
        )}
      </ul>

      {aEliminar && (
        <ConfirmarDialogo
          titulo="Eliminar cancha"
          onCancelar={() => setAEliminar(null)}
          onConfirmar={() => {
            eliminar("canchas", aEliminar.id)
            setAEliminar(null)
          }}
        >
          ¿Eliminar "{aEliminar.nombre}"? Esta acción no se puede deshacer.
        </ConfirmarDialogo>
      )}
    </TarjetaSeccion>
  )
}
