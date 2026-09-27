import { courts } from "../data/courts"

function Courts() {
  return (
    <section id="canchas" className="bg-neutral-950 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Nuestras canchas</h2>
          <p className="mt-3 text-neutral-400 max-w-xl mx-auto">
            Tres canchas pensadas para que juegues en las mejores condiciones,
            llueva o haga sol.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <div
              key={court.id}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-green-900/20 to-neutral-900 p-6 hover:border-green-500/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{court.name}</h3>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    court.type === "cubierta"
                      ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                      : "bg-green-500/15 text-green-300 border border-green-500/30"
                  }`}
                >
                  {court.type === "cubierta" ? "Cubierta" : "Aire libre"}
                </span>
              </div>
              <p className="text-sm text-neutral-400">{court.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Courts
