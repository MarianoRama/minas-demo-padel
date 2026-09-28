import Header from "./components/Header"
import Hero from "./components/Hero"
import Courts from "./components/Courts"
import Booking from "./components/BookingRequest"
import Memberships from "./components/Memberships"
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
        <Memberships />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default App
