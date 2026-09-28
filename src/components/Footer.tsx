function Footer() {
  return (
    <footer id="contacto" className="bg-neutral-950 border-t border-white/10 pt-16 pb-24 sm:pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-neutral-950 font-black text-lg">
              PM
            </span>
            <span className="text-white font-bold text-lg">Pádel Minas Club</span>
          </div>
          <p className="text-sm text-neutral-400 max-w-sm">
            Demo de portafolio para un club ficticio en Minas, Lavalleja.
          </p>
          <div className="mt-6 space-y-1 text-sm text-neutral-400">
            <p>📍 Minas, Lavalleja, Uruguay</p>
            <p>WhatsApp disponible al configurar un número real del club.</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 min-h-[220px]">
          <iframe
            title="Mapa de referencia de Minas, Lavalleja; no indica la ubicación de un club real"
            src="https://www.google.com/maps?q=Minas,+Lavalleja,+Uruguay&output=embed"
            className="w-full h-full min-h-[220px]"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-10 pt-6 border-t border-white/5 text-xs text-neutral-500 text-center">
        Pádel Minas Club es un proyecto ficticio creado únicamente como demo de
        portafolio. No representa a ningún club real.
      </div>
    </footer>
  )
}

export default Footer
