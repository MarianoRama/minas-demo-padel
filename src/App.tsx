import Header from "./components/Header"
import Hero from "./components/Hero"
import Courts from "./components/Courts"
import Booking from "./components/Booking"
import Pricing from "./components/Pricing"
import WhatsAppButton from "./components/WhatsAppButton"
import Footer from "./components/Footer"

function App() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <Header />
      <main>
        <Hero />
        <Courts />
        <Booking />
        <Pricing />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default App
