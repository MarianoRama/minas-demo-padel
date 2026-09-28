import { useState } from "react"
import Header from "./components/Header"
import Hero from "./components/Hero"
import Booking from "./components/Booking"
import Courts from "./components/Courts"
import Pricing from "./components/Pricing"
import Clases from "./components/Clases"
import Ranking from "./components/Ranking"
import LogoStrip from "./components/LogoStrip"
import FAQ from "./components/FAQ"
import Footer from "./components/Footer"
import WhatsAppButton from "./components/WhatsAppButton"
import { useReservations } from "./hooks/useReservations"
import { useHashRoute, isAdminRoute } from "./hooks/useHashRoute"
import { DatosProvider } from "./data/store"
import { useDatos } from "./data/useDatos"
import type { Reservation } from "./data/booking"
import AdminApp from "./admin/AdminApp"

export interface FocusRequest {
  courtId: string
  dateKey?: string
  hour?: number
  ts: number
}

interface SitioPublicoProps {
  reservations: Reservation[]
  addReservation: (r: Reservation) => void
  cancelReservation: (id: string) => void
}

function SitioPublico({ reservations, addReservation, cancelReservation }: SitioPublicoProps) {
  const { datos } = useDatos()
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null)

  return (
    <div className="min-h-screen bg-hueso-50">
      <p className="bg-ladrillo-600 py-1.5 text-center text-xs font-semibold text-hueso-50">
        Sitio de demostración: negocio ficticio, sin relación con ningún club real
      </p>
      <Header />
      <main>
        <Hero
          reservations={reservations}
          canchas={datos.canchas}
          horario={datos.horario}
          precios={datos.precios}
          bloqueos={datos.bloqueos}
          negocio={datos.negocio}
          onFocusSlot={(req) => setFocusRequest(req)}
        />
        <Booking
          reservations={reservations}
          canchas={datos.canchas}
          horario={datos.horario}
          precios={datos.precios}
          bloqueos={datos.bloqueos}
          focusRequest={focusRequest}
          onConfirmed={addReservation}
          onCancel={cancelReservation}
        />
        <Courts canchas={datos.canchas} onVerHorario={(courtId) => setFocusRequest({ courtId, ts: Date.now() })} />
        <Pricing precios={datos.precios} />
        <Clases clases={datos.clases} negocio={datos.negocio} />
        <Ranking ranking={datos.ranking} />
        <LogoStrip />
        <FAQ />
      </main>
      <Footer negocio={datos.negocio} horario={datos.horario} />
      <WhatsAppButton whatsapp={datos.negocio.whatsapp} />
    </div>
  )
}

function AppInterno() {
  const hash = useHashRoute()
  const { reservations, addReservation, cancelReservation } = useReservations()

  if (isAdminRoute(hash)) {
    return <AdminApp reservations={reservations} cancelReservation={cancelReservation} />
  }
  return (
    <SitioPublico
      reservations={reservations}
      addReservation={addReservation}
      cancelReservation={cancelReservation}
    />
  )
}

function App() {
  return (
    <DatosProvider>
      <AppInterno />
    </DatosProvider>
  )
}

export default App
