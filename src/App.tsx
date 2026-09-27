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

function App() {
  return (
    <div className="min-h-screen bg-hueso-50">
      <p className="bg-ladrillo-600 py-1.5 text-center text-xs font-semibold text-hueso-50">
        Sitio de demostración — negocio ficticio, sin relación con ningún club real
      </p>
      <Header />
      <main>
        <Hero />
        <Booking />
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
