import { useEffect, useState } from "react"
import { loadReservations, saveReservations, type Reservation } from "../data/booking"

/**
 * Estado compartido de las reservas del visitante, para que el widget del
 * hero y la agenda completa siempre muestren lo mismo sin depender de un
 * refresh de página.
 */
export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>(() => loadReservations())

  useEffect(() => {
    saveReservations(reservations)
  }, [reservations])

  function addReservation(reservation: Reservation) {
    setReservations((prev) => [...prev, reservation])
  }

  function cancelReservation(id: string) {
    setReservations((prev) => prev.filter((r) => r.id !== id))
  }

  return { reservations, addReservation, cancelReservation }
}
