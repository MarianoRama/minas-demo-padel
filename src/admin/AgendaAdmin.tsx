import { useMemo, useState } from "react"
import { useDatos } from "../data/useDatos"
import type { Reservation } from "../data/booking"
import { buildDayOptions, formatDateLabel, horarioDelDia, parseDateKey } from "../data/booking"
import { buildHoursForDay } from "../data/schedule"
import { BotonPeligro, BotonPrimario, BotonSecundario, Campo, ConfirmarDialogo, TarjetaSeccion, TextoInput } from "./ui"

interface AgendaAdminProps {
  reservations: Reservation[]
  cancelReservation: (id: string) => void
}

export default function AgendaAdmin({ reservations, cancelReservation }: AgendaAdminProps) {
  const { datos, crear, eliminar } = useDatos()
  const days = useMemo(() => buildDayOptions(14), [])
  const [dateKey, setDateKey] = useState(days[0].dateKey)
  const [aCancelar, setACancelar] = useState<Reservation | null>(null)

  const [courtId, setCourtId] = useState<string>("")
  const [horaDesde, setHoraDesde] = useState(9)
  const [horaHasta, setHoraHasta] = useState(9)
  const [motivo, setMotivo] = useState("")
  const [error, setError] = useState<string | null>(null)

  const horas = buildHoursForDay(horarioDelDia(datos.horario, parseDateKey(dateKey)))
  const reservasDelDia = reservations
    .filter((r) => r.dateKey === dateKey)
    .sort((a, b) => a.hour - b.hour)
  const bloqueosDelDia = datos.bloqueos.filter((b) => b.dateKey === dateKey)

  function nombreCancha(id: string | null): string {
    if (id === null) return "Todas las canchas"
    return datos.canchas.find((c) => c.id === id)?.nombre ?? id
  }

  function agregarBloqueo() {
    if (horaHasta < horaDesde) {
      setError("La hora hasta tiene que ser igual o mayor a la hora desde.")
      return
    }
    if (motivo.trim().length < 3) {
      setError("Contá el motivo del bloqueo (mantenimiento, torneo, etc.).")
      return
    }
    crear("bloqueos", {
      dateKey,
      courtId: courtId === "" ? null : courtId,
      horaDesde,
      horaHasta,
      motivo: motivo.trim(),
    })
    setMotivo("")
    setError(null)
  }

  return (
    <div className="space-y-6">
      <TarjetaSeccion titulo="Agenda" ayuda="Reservas hechas en este navegador, día por día.">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((d) => (
            <button
              key={d.dateKey}
              onClick={() => setDateKey(d.dateKey)}
              className={`flex min-w-[76px] shrink-0 flex-col items-center border px-3 py-2 ${
                dateKey === d.dateKey ? "border-cancha-900 bg-cancha-900 text-hueso-50" : "border-cancha-900/20 text-ink-700"
              }`}
            >
              <span className="text-xs font-semibold capitalize">{d.label}</span>
              <span className="font-display text-base font-bold">{d.sublabel}</span>
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm font-semibold capitalize text-ink-900">{formatDateLabel(dateKey)}</p>

        {reservasDelDia.length === 0 ? (
          <p className="mt-3 border border-dashed border-cancha-900/20 px-4 py-6 text-center text-sm text-ink-500">
            No hay reservas para este día en este navegador.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-cancha-900/10 border border-cancha-900/15">
            {reservasDelDia.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-3 p-3">
                <span className="font-display text-lg font-bold text-cancha-900">{r.hour}:00</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">
                    {r.name} · {nombreCancha(r.courtId)}
                  </p>
                  <p className="text-xs text-ink-500">
                    {r.phone} · Código {r.id}
                  </p>
                </div>
                <BotonPeligro onClick={() => setACancelar(r)} className="!min-h-[40px] px-3 text-xs">
                  Cancelar
                </BotonPeligro>
              </li>
            ))}
          </ul>
        )}
      </TarjetaSeccion>

      <TarjetaSeccion
        titulo="Bloquear turnos"
        ayuda='Para mantenimiento, torneos o cualquier motivo. Se ve como "Bloqueado" en la agenda pública.'
      >
        {horas.length === 0 ? (
          <p className="text-sm text-ink-500">El club está cerrado este día, no hay turnos para bloquear.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo label="Cancha">
              <select
                value={courtId}
                onChange={(e) => setCourtId(e.target.value)}
                className="mt-1.5 block min-h-[48px] w-full border border-cancha-900/20 px-3 text-base text-ink-900"
              >
                <option value="">Todas las canchas</option>
                {datos.canchas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </Campo>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Desde">
                <select
                  value={horaDesde}
                  onChange={(e) => setHoraDesde(Number(e.target.value))}
                  className="mt-1.5 block min-h-[48px] w-full border border-cancha-900/20 px-3 text-base text-ink-900"
                >
                  {horas.map((h) => (
                    <option key={h} value={h}>
                      {h}:00
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="Hasta">
                <select
                  value={horaHasta}
                  onChange={(e) => setHoraHasta(Number(e.target.value))}
                  className="mt-1.5 block min-h-[48px] w-full border border-cancha-900/20 px-3 text-base text-ink-900"
                >
                  {horas.map((h) => (
                    <option key={h} value={h}>
                      {h}:00
                    </option>
                  ))}
                </select>
              </Campo>
            </div>
            <div className="sm:col-span-2">
              <Campo label="Motivo" ayuda="Ej. Mantenimiento de piso, Torneo social." error={error}>
                <TextoInput value={motivo} onChange={(e) => setMotivo(e.target.value)} invalido={Boolean(error)} />
              </Campo>
            </div>
            <div className="sm:col-span-2">
              <BotonPrimario onClick={agregarBloqueo}>Bloquear</BotonPrimario>
            </div>
          </div>
        )}

        {bloqueosDelDia.length > 0 && (
          <ul className="mt-5 divide-y divide-cancha-900/10 border border-dashed border-cancha-900/20">
            {bloqueosDelDia.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-900">
                    {nombreCancha(b.courtId)} · {b.horaDesde}:00 a {b.horaHasta}:00
                  </p>
                  <p className="text-xs text-ink-500">{b.motivo}</p>
                </div>
                <BotonSecundario onClick={() => eliminar("bloqueos", b.id)} className="!min-h-[40px] px-3 text-xs">
                  Quitar bloqueo
                </BotonSecundario>
              </li>
            ))}
          </ul>
        )}
      </TarjetaSeccion>

      {aCancelar && (
        <ConfirmarDialogo
          titulo="Cancelar reserva"
          onCancelar={() => setACancelar(null)}
          onConfirmar={() => {
            cancelReservation(aCancelar.id)
            setACancelar(null)
          }}
        >
          ¿Cancelar la reserva de {aCancelar.name} ({aCancelar.id})?
        </ConfirmarDialogo>
      )}
    </div>
  )
}
