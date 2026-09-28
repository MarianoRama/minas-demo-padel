// Redimensiona una foto elegida desde el celular o la PC a un dataURL JPEG
// liviano, para que quepa cómodo en localStorage.

const MAX_LADO = 1200
const CALIDAD_JPEG = 0.75

export function archivoADataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onerror = () => reject(new Error("No se pudo leer el archivo."))
    lector.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error("El archivo no parece ser una imagen válida."))
      img.onload = () => {
        try {
          let { width, height } = img
          if (width > MAX_LADO || height > MAX_LADO) {
            if (width >= height) {
              height = Math.round((height * MAX_LADO) / width)
              width = MAX_LADO
            } else {
              width = Math.round((width * MAX_LADO) / height)
              height = MAX_LADO
            }
          }
          const canvas = document.createElement("canvas")
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          if (!ctx) throw new Error("No se pudo procesar la imagen en este navegador.")
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL("image/jpeg", CALIDAD_JPEG))
        } catch (err) {
          reject(err instanceof Error ? err : new Error("No se pudo procesar la imagen."))
        }
      }
      img.src = String(lector.result)
    }
    lector.readAsDataURL(file)
  })
}
