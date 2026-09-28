import { useDatos } from "../data/useDatos"
import { DIA_LABEL } from "../data/types"
import { Campo, TarjetaSeccion, TextoInput, Toggle } from "./ui"

export default function HorarioAdmin() {
  const { datos, actualizarHorarioDia, actualizarDuracionTurno } = useDatos()

  return (
    <TarjetaSeccion titulo="Horario del club" ayuda="La agenda de la web usa exactamente estos horarios.">
      <Campo label="Duración de cada turno">
        <div className="mt-1.5 flex gap-2">
          {([60, 90] as const).map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => actualizarDuracionTurno(min)}
              className={`min-h-[48px] flex-1 border px-3 text-sm font-bold ${
                datos.horario.duracionTurnoMin === min
                  ? "border-cancha-900 bg-cancha-900 text-hueso-50"
                  : "border-cancha-900/20 text-ink-700"
              }`}
            >
              {min} minutos
            </button>
          ))}
        </div>
      </Campo>

      <div className="mt-6 space-y-3">
        {datos.horario.dias.map((d) => (
          <div key={d.dia} className="flex flex-wrap items-center gap-3 border border-cancha-900/10 p-3">
            <span className="w-28 shrink-0 text-sm font-semibold text-ink-900">{DIA_LABEL[d.dia]}</span>
            <Toggle
              checked={!d.cerrado}
              onChange={(v) => actualizarHorarioDia(d.dia, { cerrado: !v })}
              etiquetaOn="Abierto"
              etiquetaOff="Cerrado"
            />
            {!d.cerrado && (
              <div className="flex items-center gap-2">
                <TextoInput
                  type="time"
                  value={d.apertura}
                  onChange={(e) => actualizarHorarioDia(d.dia, { apertura: e.target.value })}
                  className="!mt-0 w-32"
                />
                <span className="text-sm text-ink-500">a</span>
                <TextoInput
                  type="time"
                  value={d.cierre}
                  onChange={(e) => actualizarHorarioDia(d.dia, { cierre: e.target.value })}
                  className="!mt-0 w-32"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </TarjetaSeccion>
  )
}
