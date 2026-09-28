// Parser de CSV propio (soporta comillas, comas y comillas escapadas dentro
// de un campo) para poder cargar la colección de clases/torneos desde una
// hoja de Google Sheets publicada como CSV. Sin dependencias externas.

export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let inQuotes = false
  const src = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n")

  for (let i = 0; i < src.length; i++) {
    const char = src[i]

    if (inQuotes) {
      if (char === '"') {
        if (src[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === ",") {
      row.push(field)
      field = ""
    } else if (char === "\n") {
      row.push(field)
      rows.push(row)
      row = []
      field = ""
    } else {
      field += char
    }
  }

  // último campo/fila si el archivo no termina con salto de línea
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ""))
}

/** Convierte filas CSV (con encabezado) en objetos, usando la primera fila como claves. */
export function csvToObjects(text: string): Record<string, string>[] {
  const rows = parseCsv(text)
  if (rows.length === 0) return []
  const headers = rows[0].map((h) => h.trim())
  return rows.slice(1).map((r) => {
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => {
      obj[h] = (r[i] ?? "").trim()
    })
    return obj
  })
}
