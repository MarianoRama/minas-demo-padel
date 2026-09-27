const NAV_ITEMS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Canchas", href: "#canchas" },
  { label: "Reservar", href: "#reservar" },
  { label: "Precios", href: "#precios" },
  { label: "Contacto", href: "#contacto" },
]

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-16">
        <a href="#inicio" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-neutral-950 font-black text-lg">
            PM
          </span>
          <span className="text-white font-bold text-lg tracking-tight">
            Pádel Minas Club
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-neutral-300 hover:text-green-400 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#reservar"
          className="hidden sm:inline-flex items-center rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-green-400 transition-colors"
        >
          Reservar
        </a>
      </div>

      <nav className="md:hidden flex items-center justify-around gap-1 border-t border-white/10 px-2 py-2 overflow-x-auto">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="whitespace-nowrap text-xs font-medium text-neutral-300 hover:text-green-400 px-2 py-1"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

export default Header
