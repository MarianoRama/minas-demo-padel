// Datos del autor de la demo — un solo lugar para cambiarlos.
export const AUTOR = {
  nombre: "Mariano Rama",
  whatsapp: "59899000000",
  texto: "Diseño y desarrollo web en Minas",
}

/**
 * De dónde salen las clases y torneos.
 * - "local": se editan desde el panel (#/admin), quedan en este navegador.
 * - "sheets": se editan en una planilla de Google Sheets publicada como CSV
 *   (Archivo → Compartir → Publicar en la web → formato CSV) y el sitio la
 *   lee sola. El panel deja de mostrar el formulario y muestra el link a la
 *   planilla. Columnas esperadas: ver README.md.
 */
export const FUENTE_DATOS: { tipo: "local" } | { tipo: "sheets"; csvUrl: string } = {
  tipo: "local",
}
