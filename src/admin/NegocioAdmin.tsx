import { useState } from "react"
import { useDatos } from "../data/useDatos"
import { BotonPrimario, Campo, TarjetaSeccion, TextoArea, TextoInput } from "./ui"

export default function NegocioAdmin() {
  const { datos, actualizarNegocio } = useDatos()
  const [guardado, setGuardado] = useState(false)
  const [whatsapp, setWhatsapp] = useState(datos.negocio.whatsapp)
  const [direccion, setDireccion] = useState(datos.negocio.direccion)
  const [aviso, setAviso] = useState(datos.negocio.aviso)

  function guardar() {
    actualizarNegocio({ whatsapp: whatsapp.trim(), direccion: direccion.trim(), aviso: aviso.trim() })
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2000)
  }

  return (
    <TarjetaSeccion titulo="Datos del negocio" ayuda="Esto se ve en el sitio: WhatsApp, dirección y el aviso de la portada.">
      <div className="space-y-4">
        <Campo label="WhatsApp" ayuda="Con código de país, sin espacios ni +. Ej. 59899123456">
          <TextoInput value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} inputMode="numeric" />
        </Campo>
        <Campo label="Dirección">
          <TextoInput value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        </Campo>
        <Campo label="Aviso de la portada" ayuda='Se muestra como una nota pegada en la portada, ej. "Torneo social el sábado 12, anotate".'>
          <TextoArea value={aviso} onChange={(e) => setAviso(e.target.value)} />
        </Campo>
        <BotonPrimario onClick={guardar}>{guardado ? "Guardado" : "Guardar datos"}</BotonPrimario>
      </div>
    </TarjetaSeccion>
  )
}
