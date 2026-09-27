import { useEffect, useState } from "react"

const NAV_ITEMS = [
  { label: "Agenda", href: "#agenda" },
  { label: "Canchas", href: "#canchas" },
  { label: "Precios", href: "#precios" },
  { label: "Clases", href: "#clases" },
  { label: "Cómo llegar", href: "#llegar" },
  { label: "Preguntas", href: "#preguntas" },
]

function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="6" fill="var(--color-cancha-900)" />
      <path
        d="M9 23V9h6a5 5 0 0 1 0 10h-3v4H9Zm3-7h3a2 2 0 0 0 0-4h-3v4Z"
        fill="var(--color-hueso-50)"
      />
      <circle cx="24" cy="9" r="2.4" fill="var(--color-ladrillo-500)" />
    </svg>
  )
}

function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-cancha-900/10 bg-hueso-50/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#inicio" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <LogoMark />
          <span className="font-display text-xl font-bold uppercase tracking-wide text-cancha-900">
            Pádel Minas Club
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Principal">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-ink-700 transition-colors hover:text-ladrillo-600"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#agenda"
            className="hidden sm:inline-flex items-center rounded-md bg-ladrillo-600 px-4 py-2.5 text-sm font-bold text-hueso-50 transition-colors hover:bg-ladrillo-700"
          >
            Reservar cancha
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-cancha-900/15 text-cancha-900 lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="menu-mobile"
          aria-label="Menú mobile"
          className="lg:hidden border-t border-cancha-900/10 bg-hueso-50 px-4 pb-4 pt-2 sm:px-6"
        >
          <ul className="flex flex-col divide-y divide-cancha-900/10">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[48px] items-center text-base font-semibold text-ink-700"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#agenda"
            onClick={() => setOpen(false)}
            className="mt-3 flex min-h-[48px] items-center justify-center rounded-md bg-ladrillo-600 text-base font-bold text-hueso-50"
          >
            Reservar cancha
          </a>
        </nav>
      )}
    </header>
  )
}

export default Header
