import { useState } from "react"
import { useDatos } from "../data/useDatos"
import type { ClaseTorneo } from "../data/types"
import { FUENTE_DATOS } from "../config"
import { archivoADataUrl } from "./imagenes"
import { BotonPeligro, BotonPrimario, BotonSecundario, Campo, ConfirmarDialogo, TarjetaSeccion, TextoInput, Toggle } from "./ui"

type Borrador = Omit<ClaseTorneo, "id">
const VACIO: Borrador = {
  titulo: "",
  tipo: "clase",
  dia: "",
  hora: "",
  profe: "",
  precio: "",
  cupos: 6,
  estado: "activo",
}

export default function ClasesAdmin() {
  const { datos, crear, actualizar, eliminar, duplicar, clasesDesdeSheets, cargandoClases, errorClases } = useDatos()
  const [busqueda, setBusqueda] = useState("")
  const [editando, setEditando] = useState<string | null | "nueva">(null)
  const [borrador, setBorrador] = useState<Borrador>(VACIO)
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [aEliminar, setAEliminar] = useState<ClaseTorneo | null>(null)
  const [subiendo, setSubiendo] = useState(false)

  if (clasesDesdeSheets) {
    return (
      <TarjetaSeccion titulo="Clases y torneos">
        <p className="text-sm text-ink-700">
          Estos datos se editan en tu planilla de Google, no acá. {cargandoClases && "Cargando…"}
        </p>
        {errorClases && <p className="mt-2 text-sm font-semibold text-ladrillo-700">{errorClases}</p>}
        {FUENTE_DATOS.tipo === "sheets" && (
          <a
            href={FUENTE_DATOS.csvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-bold text-cancha-900 underline underline-offset-2"
          >
            Abrir la planilla
          </a>
        )}
      </TarjetaSeccion>
    )
  }

  const filtradas = datos.clases.filter((c) => c.titulo.toLowerCase().includes(busqueda.toLowerCase()))

  function abrirNueva() {
    setBorrador(VACIO)
    setErrores({})
    setEditando("nueva")
  }
  function abrirEditar(c: ClaseTorneo) {
    setBorrador({
      titulo: c.titulo,
      tipo: c.tipo,
      dia: c.dia,
      hora: c.hora,
      profe: c.profe,
      precio: c.precio,
      cupos: c.cupos,
      estado: c.estado,
      foto: c.foto,
    })
    setErrores({})
    setEditando(c.id)
  }
  function validar(): boolean {
    const e: Record<string, string> = {}
    if (borrador.titulo.trim().length < 2) e.titulo = "Ponele un título."
    if (borrador.dia.trim().length < 2) e.dia = "Decí qué día es."
    if (borrador.hora.trim().length < 2) e.hora = "Decí a qué hora es."
    if (borrador.cupos < 1) e.cupos = "Tiene que haber al menos 1 cupo."
    setErrores(e)
    return Object.keys(e).length === 0
  }
  function guardar() {
    if (!validar()) return
    if (editando === "nueva") crear("clases", borrador)
    else if (editando) actualizar("clases", editando, borrador)
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
      <TarjetaSeccion titulo={editando === "nueva" ? "Nueva clase o torneo" : "Editar"}>
        <div className="space-y-4">
          <Campo label="Tipo">
            <div className="mt-1.5 flex gap-2">
              {(["clase", "torneo"] as const).map((t) => (
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
          <Campo label="Título" error={errores.titulo}>
            <TextoInput
              value={borrador.titulo}
              onChange={(e) => setBorrador({ ...borrador, titulo: e.target.value })}
              invalido={Boolean(errores.titulo)}
            />
          </Campo>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Día" ayuda="Texto libre, ej. martes y jueves." error={errores.dia}>
              <TextoInput
                value={borrador.dia}
                onChange={(e) => setBorrador({ ...borrador, dia: e.target.value })}
                invalido={Boolean(errores.dia)}
              />
            </Campo>
            <Campo label="Hora" ayuda="Ej. 19:00 a 20:00." error={errores.hora}>
              <TextoInput
                value={borrador.hora}
                onChange={(e) => setBorrador({ ...borrador, hora: e.target.value })}
                invalido={Boolean(errores.hora)}
              />
            </Campo>
          </div>
          <Campo label="A cargo de">
            <TextoInput value={borrador.profe} onChange={(e) => setBorrador({ ...borrador, profe: e.target.value })} />
          </Campo>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Precio" ayuda="Texto libre, ej. $900 la clase.">
              <TextoInput value={borrador.precio} onChange={(e) => setBorrador({ ...borrador, precio: e.target.value })} />
            </Campo>
            <Campo label="Cupos" error={errores.cupos}>
              <TextoInput
                type="number"
                min={1}
                value={borrador.cupos}
                onChange={(e) => setBorrador({ ...borrador, cupos: Number(e.target.value) })}
                invalido={Boolean(errores.cupos)}
              />
            </Campo>
          </div>
          <Campo label="Foto" ayuda="Opcional.">
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
              checked={borrador.estado === "activo"}
              onChange={(v) => setBorrador({ ...borrador, estado: v ? "activo" : "pausado" })}
              etiquetaOn="Activo"
              etiquetaOff="Pausado"
            />
          </Campo>
          <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row">
            <BotonSecundario className="flex-1" onClick={() => setEditando(null)}>
              Cancelar
            </BotonSecundario>
            <BotonPrimario className="flex-1" onClick={guardar}>
              Guardar
            </BotonPrimario>
          </div>
        </div>
      </TarjetaSeccion>
    )
  }

  return (
    <TarjetaSeccion titulo="Clases y torneos" ayuda="Lo pausado no se muestra en la web.">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TextoInput value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar..." className="sm:max-w-xs" />
        <BotonPrimario type="button" onClick={abrirNueva}>
          + Nueva clase o torneo
        </BotonPrimario>
      </div>
      <ul className="mt-4 divide-y divide-cancha-900/10 border border-cancha-900/15">
        {filtradas.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center gap-3 p-3">
            <div className="h-14 w-20 shrink-0 overflow-hidden border border-cancha-900/10 bg-hueso-100">
              {c.foto && <img src={c.foto} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-900">{c.titulo}</p>
              <p className="text-xs text-ink-500 capitalize">
                {c.tipo} · {c.dia}
              </p>
            </div>
            <span
              className={`px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                c.estado === "activo" ? "bg-cancha-800/10 text-cancha-800" : "bg-ink-500/10 text-ink-500"
              }`}
            >
              {c.estado === "activo" ? "Activo" : "Pausado"}
            </span>
            <div className="flex gap-1.5">
              <BotonSecundario onClick={() => abrirEditar(c)} className="!min-h-[40px] px-3 text-xs">
                Editar
              </BotonSecundario>
              <BotonSecundario onClick={() => duplicar("clases", c.id)} className="!min-h-[40px] px-3 text-xs">
                Duplicar
              </BotonSecundario>
              <BotonPeligro onClick={() => setAEliminar(c)} className="!min-h-[40px] px-3 text-xs">
                Eliminar
              </BotonPeligro>
            </div>
          </li>
        ))}
        {filtradas.length === 0 && <li className="p-4 text-center text-sm text-ink-500">Sin resultados.</li>}
      </ul>

      {aEliminar && (
        <ConfirmarDialogo
          titulo="Eliminar"
          onCancelar={() => setAEliminar(null)}
          onConfirmar={() => {
            eliminar("clases", aEliminar.id)
            setAEliminar(null)
          }}
        >
          ¿Eliminar "{aEliminar.titulo}"?
        </ConfirmarDialogo>
      )}
    </TarjetaSeccion>
  )
}
