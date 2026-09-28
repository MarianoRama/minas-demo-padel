function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-br from-neutral-950 via-green-950 to-neutral-950"
    >
      {/* Líneas de cancha decorativas */}
      <svg
        className="absolute inset-0 h-full w-full opacity-20"
        viewBox="0 0 800 400"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <rect x="20" y="20" width="760" height="360" fill="none" stroke="#4ade80" strokeWidth="3" />
        <line x1="400" y1="20" x2="400" y2="380" stroke="#4ade80" strokeWidth="3" />
        <line x1="20" y1="200" x2="780" y2="200" stroke="#4ade80" strokeWidth="2" />
        <rect x="150" y="20" width="500" height="360" fill="none" stroke="#4ade80" strokeWidth="2" />
      </svg>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-32 text-center">
        <span className="inline-block rounded-full bg-green-500/10 border border-green-500/30 px-4 py-1 text-sm font-medium text-green-400 mb-6">
          Minas, Uruguay
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Tu próximo partido empieza acá
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto">
          Un lugar para encontrarse, jugar y volver a la cancha. Consultá por
          horarios y coordiná tu partido por WhatsApp.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#reservar"
            className="inline-flex items-center justify-center rounded-full bg-green-500 px-8 py-3.5 text-base font-semibold text-neutral-950 hover:bg-green-400 transition-colors shadow-lg shadow-green-500/20 w-full sm:w-auto"
          >
            Consultá un horario
          </a>
          <a
            href="#canchas"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-colors w-full sm:w-auto"
          >
            Ver canchas
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
