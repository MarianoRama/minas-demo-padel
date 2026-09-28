import { AUTOR } from "../config"
import type { Horario, Negocio } from "../data/types"
import { DIA_LABEL } from "../data/types"

interface FooterProps {
  negocio: Negocio
  horario: Horario
}

function Footer({ negocio, horario }: FooterProps) {
  const autorHref = `https://wa.me/${AUTOR.whatsapp}?text=${encodeURIComponent(
    "Hola Mariano! Vi la demo de Pádel Minas Club y quiero una página así para mi negocio."
  )}`

  return (
    <footer id="llegar" className="bg-cancha-950 pb-28 pt-16 text-hueso-100 sm:pb-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-hueso-50">
            Cómo llegar
          </h2>
          <address className="mt-4 space-y-1 text-sm not-italic text-hueso-100/80">
            <p>{negocio.direccion}</p>
            <p>Tel. +{negocio.whatsapp.replace(/^0+/, "")} (WhatsApp)</p>
            <p>hola@padelminasclub.uy (ficticio)</p>
          </address>

          <dl className="mt-6 space-y-1 border-t border-hueso-50/10 pt-4 text-sm">
            {horario.dias.map((d) => (
              <div key={d.dia} className="flex justify-between gap-4">
                <dt className="capitalize text-hueso-100/60">{DIA_LABEL[d.dia]}</dt>
                <dd className="font-semibold text-hueso-50">
                  {d.cerrado ? "Cerrado" : `${d.apertura} – ${d.cierre}`}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative min-h-[240px] overflow-hidden border border-hueso-50/15 bg-cancha-900">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
            viewBox="0 0 400 240"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <line x1="0" y1="60" x2="400" y2="50" stroke="#faf7f0" strokeWidth="2" />
            <line x1="0" y1="150" x2="400" y2="165" stroke="#faf7f0" strokeWidth="2" />
            <line x1="90" y1="0" x2="70" y2="240" stroke="#faf7f0" strokeWidth="2" />
            <line x1="290" y1="0" x2="310" y2="240" stroke="#faf7f0" strokeWidth="1.5" />
            <path d="M200 90c-16 0-28 12-28 27 0 20 28 46 28 46s28-26 28-46c0-15-12-27-28-27Z" fill="var(--color-ladrillo-500)" />
            <circle cx="200" cy="117" r="10" fill="var(--color-cancha-900)" />
          </svg>
          <iframe
            title="Ubicación aproximada, Minas, Uruguay"
            src="https://www.google.com/maps?q=Minas,+Lavalleja,+Uruguay&output=embed"
            className="relative h-full min-h-[240px] w-full"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-hueso-50/10 px-4 pt-6 text-xs text-hueso-100/60 sm:px-6">
        <p>
          Pádel Minas Club es un proyecto ficticio creado únicamente como demo de portafolio. No
          representa a ningún club real.
        </p>
        <p className="mt-3">
          Sitio demo por{" "}
          <a href={autorHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-hueso-50 underline underline-offset-2 hover:text-ladrillo-400">
            {AUTOR.nombre}
          </a>{" "}
          ({AUTOR.texto}). ¿Querés una página así para tu negocio?{" "}
          <a href={autorHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-hueso-50 underline underline-offset-2 hover:text-ladrillo-400">
            Escribime
          </a>
          .
        </p>
        <p className="mt-3">
          <a href="#/admin" className="underline underline-offset-2 hover:text-hueso-50">
            Administrar sitio
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
