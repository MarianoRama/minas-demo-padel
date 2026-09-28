function Hero() {
  return (
    <section id="inicio" className="bg-neutral-950 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:py-20">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-green-400">Pádel · Minas, Uruguay</p>
          <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
            El partido empieza con un buen plan.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-300 sm:text-lg">
            Elegí cancha, proponé día y hora, y enviá una solicitud. El club confirma la disponibilidad antes de cerrar el partido.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#reservar" className="inline-flex min-h-12 items-center justify-center rounded-full bg-green-400 px-7 py-3 font-semibold text-neutral-950 transition-colors hover:bg-green-300">
              Armar mi solicitud
            </a>
            <a href="#canchas" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10">
              Conocer las canchas
            </a>
          </div>
          <p className="mt-5 text-xs text-neutral-500">Demo de portafolio · la cancha y la foto son referencias ilustrativas.</p>
        </div>

        <figure className="min-w-0">
          <img
            src={`${import.meta.env.BASE_URL}padel-court.jpg`}
            alt="Dos personas jugando al pádel en una cancha exterior, imagen ilustrativa"
            fetchPriority="high"
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
          <figcaption className="mt-2 text-right text-xs text-neutral-500">Foto de referencia: Ashford Marx / Unsplash · no corresponde al club.</figcaption>
        </figure>
      </div>
    </section>
  )
}

export default Hero
