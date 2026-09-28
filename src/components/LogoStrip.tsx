// Marcas ficticias del rubro deportivo/local — la cinta es puramente decorativa,
// ninguna corresponde a una empresa real.
const SPONSORS = [
  { name: "Estrella Grip", tag: "indumentaria" },
  { name: "Ruta 8 Deportes", tag: "artículos" },
  { name: "Salus Padel Wear", tag: "ropa técnica" },
  { name: "Cerro Sport", tag: "pelotas y grips" },
  { name: "Villa Serrana Café", tag: "cafetería" },
  { name: "Norte Bebidas", tag: "isotónicas" },
]

function LogoItem({ name, tag }: { name: string; tag: string }) {
  return (
    <div className="flex shrink-0 items-center gap-3 px-8">
      <span className="font-display text-2xl font-bold uppercase tracking-wide text-ink-500 transition-colors duration-300 hover:text-ladrillo-600">
        {name}
      </span>
      <span className="hidden text-xs uppercase tracking-widest text-ink-500/50 sm:inline">
        {tag}
      </span>
    </div>
  )
}

function LogoStrip() {
  return (
    <section aria-label="Marcas con las que trabajamos" className="border-y border-cancha-900/10 bg-hueso-100 py-10">
      <p className="mx-auto max-w-6xl px-4 text-center text-xs font-bold uppercase tracking-[0.25em] text-ink-500 sm:px-6">
        Marcas con las que trabajamos
      </p>
      <div className="marquee-mask relative mt-6 overflow-hidden">
        <div className="marquee-track flex w-max">
          {[0, 1].map((rep) => (
            <div key={rep} className="flex" aria-hidden={rep === 1}>
              {SPONSORS.map((s) => (
                <LogoItem key={`${rep}-${s.name}`} name={s.name} tag={s.tag} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LogoStrip
