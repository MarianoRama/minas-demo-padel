import Header from "./components/Header"
import Hero from "./components/Hero"
import Booking from "./components/Booking"
import Courts from "./components/Courts"
import Pricing from "./components/Pricing"
import Clases from "./components/Clases"
import LogoStrip from "./components/LogoStrip"
import FAQ from "./components/FAQ"
import Footer from "./components/Footer"
import WhatsAppButton from "./components/WhatsAppButton"
import { useReservations } from "./hooks/useReservations"

function App() {
  const { reservations, addReservation, cancelReservation } = useReservations()

  return (
    <div className="min-h-screen bg-hueso-50">
      <p className="bg-ladrillo-600 py-1.5 text-center text-xs font-semibold text-hueso-50">
        Sitio de demostración — negocio ficticio, sin relación con ningún club real
      </p>
      <Header />
      <main>
        <Hero reservations={reservations} onConfirmed={addReservation} />
        <Booking reservations={reservations} onConfirmed={addReservation} onCancel={cancelReservation} />
        <Courts />
        <Pricing />
        <Clases />
        <LogoStrip />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default App
