import { useState } from "react"
import { useDatos } from "../data/useDatos"
import type { RankingFila } from "../data/types"
import { BotonPeligro, BotonPrimario, BotonSecundario, Campo, ConfirmarDialogo, TarjetaSeccion, TextoInput } from "./ui"

type Borrador = Omit<RankingFila, "id">
const VACIO: Borrador = { pareja: "", puntos: 0, partidos: 0 }

export default function RankingAdmin() {
  const { datos, crear, actualizar, eliminar } = useDatos()
  const [editando, setEditando] = useState<string | null | "nueva">(null)
  const [borrador, setBorrador] = useState<Borrador>(VACIO)
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [aEliminar, setAEliminar] = useState<RankingFila | null>(null)

  const ordenado = [...datos.ranking].sort((a, b) => b.puntos - a.puntos)

  function abrirNueva() {
    setBorrador(VACIO)
    setErrores({})
    setEditando("nueva")
  }
  function abrirEditar(f: RankingFila) {
    setBorrador({ pareja: f.pareja, puntos: f.puntos, partidos: f.partidos })
    setErrores({})
    setEditando(f.id)
  }
  function validar(): boolean {
    const e: Record<string, string> = {}
    if (borrador.pareja.trim().length < 2) e.pareja = "Escribí los apellidos de la pareja."
    setErrores(e)
    return Object.keys(e).length === 0
  }
  function guardar() {
    if (!validar()) return
    if (editando === "nueva") crear("ranking", borrador)
    else if (editando) actualizar("ranking", editando, borrador)
    setEditando(null)
  }

  if (editando !== null) {
    return (
      <TarjetaSeccion titulo={editando === "nueva" ? "Nueva pareja" : "Editar pareja"}>
        <div className="space-y-4">
          <Campo label="Pareja" ayuda='Ej. "Fernández / Rossi".' error={errores.pareja}>
            <TextoInput
              value={borrador.pareja}
              onChange={(e) => setBorrador({ ...borrador, pareja: e.target.value })}
              invalido={Boolean(errores.pareja)}
            />
          </Campo>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Puntos">
              <TextoInput
                type="number"
                value={borrador.puntos}
                onChange={(e) => setBorrador({ ...borrador, puntos: Number(e.target.value) })}
              />
            </Campo>
            <Campo label="Partidos jugados">
              <TextoInput
                type="number"
                value={borrador.partidos}
                onChange={(e) => setBorrador({ ...borrador, partidos: Number(e.target.value) })}
              />
            </Campo>
          </div>
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
    <TarjetaSeccion titulo="Ranking del torneo social" ayuda="Se ordena solo por puntos, de mayor a menor.">
      <div className="flex justify-end">
        <BotonPrimario type="button" onClick={abrirNueva}>
          + Agregar pareja
        </BotonPrimario>
      </div>
      <ul className="mt-4 divide-y divide-cancha-900/10 border border-cancha-900/15">
        {ordenado.map((f, i) => (
          <li key={f.id} className="flex flex-wrap items-center gap-3 p-3">
            <span className="w-8 shrink-0 font-display text-lg font-bold text-ladrillo-600">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-900">{f.pareja}</p>
              <p className="text-xs text-ink-500">
                {f.puntos} puntos · {f.partidos} PJ
              </p>
            </div>
            <div className="flex gap-1.5">
              <BotonSecundario onClick={() => abrirEditar(f)} className="!min-h-[40px] px-3 text-xs">
                Editar
              </BotonSecundario>
              <BotonPeligro onClick={() => setAEliminar(f)} className="!min-h-[40px] px-3 text-xs">
                Eliminar
              </BotonPeligro>
            </div>
          </li>
        ))}
        {ordenado.length === 0 && <li className="p-4 text-center text-sm text-ink-500">Todavía no hay parejas cargadas.</li>}
      </ul>

      {aEliminar && (
        <ConfirmarDialogo
          titulo="Eliminar pareja"
          onCancelar={() => setAEliminar(null)}
          onConfirmar={() => {
            eliminar("ranking", aEliminar.id)
            setAEliminar(null)
          }}
        >
          ¿Eliminar a "{aEliminar.pareja}" del ranking?
        </ConfirmarDialogo>
      )}
    </TarjetaSeccion>
  )
}
