import { useState } from "react"
import { useDatos } from "../data/useDatos"
import type { Precio } from "../data/types"
import { BotonPeligro, BotonPrimario, BotonSecundario, Campo, ConfirmarDialogo, TarjetaSeccion, TextoArea, TextoInput, Toggle } from "./ui"

type Borrador = Omit<Precio, "id">
const VACIO: Borrador = { nombre: "", precio: "", unidad: "", detalle: "", destacado: false }

export default function PreciosAdmin() {
  const { datos, crear, actualizar, eliminar, duplicar } = useDatos()
  const [editando, setEditando] = useState<string | null | "nueva">(null)
  const [borrador, setBorrador] = useState<Borrador>(VACIO)
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [aEliminar, setAEliminar] = useState<Precio | null>(null)

  function abrirNuevo() {
    setBorrador(VACIO)
    setErrores({})
    setEditando("nueva")
  }
  function abrirEditar(p: Precio) {
    setBorrador({ nombre: p.nombre, precio: p.precio, unidad: p.unidad, detalle: p.detalle, destacado: p.destacado })
    setErrores({})
    setEditando(p.id)
  }
  function validar(): boolean {
    const e: Record<string, string> = {}
    if (borrador.nombre.trim().length < 2) e.nombre = "Ponele un nombre al plan."
    if (borrador.precio.trim().length < 1) e.precio = "Escribí el precio, ej. $1.200."
    setErrores(e)
    return Object.keys(e).length === 0
  }
  function guardar() {
    if (!validar()) return
    if (editando === "nueva") crear("precios", borrador)
    else if (editando) actualizar("precios", editando, borrador)
    setEditando(null)
  }

  if (editando !== null) {
    return (
      <TarjetaSeccion titulo={editando === "nueva" ? "Nuevo plan" : "Editar plan"}>
        <div className="space-y-4">
          <Campo label="Nombre del plan" error={errores.nombre}>
            <TextoInput
              value={borrador.nombre}
              onChange={(e) => setBorrador({ ...borrador, nombre: e.target.value })}
              invalido={Boolean(errores.nombre)}
              placeholder="Ej. Turno suelto"
            />
          </Campo>
          <Campo label="Precio" ayuda="En pesos uruguayos, con el símbolo $." error={errores.precio}>
            <TextoInput
              value={borrador.precio}
              onChange={(e) => setBorrador({ ...borrador, precio: e.target.value })}
              invalido={Boolean(errores.precio)}
              placeholder="$1.200"
            />
          </Campo>
          <Campo label="Unidad" ayuda='Ej. "por hora" o "por mes".'>
            <TextoInput value={borrador.unidad} onChange={(e) => setBorrador({ ...borrador, unidad: e.target.value })} />
          </Campo>
          <Campo label="Detalle">
            <TextoArea value={borrador.detalle} onChange={(e) => setBorrador({ ...borrador, detalle: e.target.value })} />
          </Campo>
          <Campo label="Destacado">
            <Toggle
              checked={borrador.destacado}
              onChange={(v) => setBorrador({ ...borrador, destacado: v })}
              etiquetaOn="El más elegido"
              etiquetaOff="Normal"
            />
          </Campo>
          <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row">
            <BotonSecundario className="flex-1" onClick={() => setEditando(null)}>
              Cancelar
            </BotonSecundario>
            <BotonPrimario className="flex-1" onClick={guardar}>
              Guardar plan
            </BotonPrimario>
          </div>
        </div>
      </TarjetaSeccion>
    )
  }

  return (
    <TarjetaSeccion titulo="Precios" ayuda="Estos planes son los que se muestran en el pizarrón de la web.">
      <div className="flex justify-end">
        <BotonPrimario type="button" onClick={abrirNuevo}>
          + Nuevo plan
        </BotonPrimario>
      </div>
      <ul className="mt-4 divide-y divide-cancha-900/10 border border-cancha-900/15">
        {datos.precios.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-3 p-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-900">
                {p.nombre} {p.destacado && <span className="text-ladrillo-600">★</span>}
              </p>
              <p className="text-xs text-ink-500">
                {p.precio} · {p.unidad}
              </p>
            </div>
            <div className="flex gap-1.5">
              <BotonSecundario onClick={() => abrirEditar(p)} className="!min-h-[40px] px-3 text-xs">
                Editar
              </BotonSecundario>
              <BotonSecundario onClick={() => duplicar("precios", p.id)} className="!min-h-[40px] px-3 text-xs">
                Duplicar
              </BotonSecundario>
              <BotonPeligro onClick={() => setAEliminar(p)} className="!min-h-[40px] px-3 text-xs">
                Eliminar
              </BotonPeligro>
            </div>
          </li>
        ))}
      </ul>

      {aEliminar && (
        <ConfirmarDialogo
          titulo="Eliminar plan"
          onCancelar={() => setAEliminar(null)}
          onConfirmar={() => {
            eliminar("precios", aEliminar.id)
            setAEliminar(null)
          }}
        >
          ¿Eliminar "{aEliminar.nombre}"?
        </ConfirmarDialogo>
      )}
    </TarjetaSeccion>
  )
}
