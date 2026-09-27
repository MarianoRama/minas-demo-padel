import { useReveal, revealClass } from "../hooks/useReveal"

function ProfeIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="h-40 w-40 shrink-0" role="img" aria-label="Ilustración de profesor de pádel">
      <circle cx="100" cy="100" r="96" fill="var(--color-ladrillo-100)" />
      <circle cx="100" cy="72" r="30" fill="var(--color-cancha-900)" />
      <path
        d="M46 176c4-38 26-58 54-58s50 20 54 58"
        fill="none"
        stroke="var(--color-cancha-900)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <rect x="126" y="120" width="42" height="10" rx="5" fill="var(--color-ladrillo-600)" transform="rotate(28 126 120)" />
      <circle cx="168" cy="112" r="9" fill="var(--color-ladrillo-600)" />
    </svg>
  )
}

function Clases() {
  const { ref, visible } = useReveal<HTMLDivElement>()

  return (
    <section id="clases" className="bg-hueso-100 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div
          ref={ref}
          className={`reveal grid gap-10 sm:grid-cols-[auto_1fr] sm:items-center ${revealClass(visible)}`}
        >
          <ProfeIllustration />
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-ladrillo-600">
              Clases y torneos
            </p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight text-cancha-900 sm:text-4xl">
              Con el Profe Nacho, martes y jueves
            </h2>
            <p className="mt-3 max-w-2xl text-base text-ink-700">
              Clases grupales de iniciación y perfeccionamiento, de 19 a 21 hs. También armamos
              clínicas para grupos de empresa y cumpleaños. El primer sábado de cada mes hacemos
              el <strong className="text-ink-900">Torneo Social Minas</strong>, categoría libre,
              con premios para los finalistas.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:gap-6">
              <p className="text-sm font-semibold text-cancha-900">
                Clase suelta: $900 · Mensual (2x semana): $3.200
              </p>
            </div>
            <a
              href="https://wa.me/59899000000?text=Hola!%20Quiero%20anotarme%20a%20las%20clases%20de%20p%C3%A1del."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-ladrillo-600"
            >
              Anotarme por WhatsApp
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Clases
