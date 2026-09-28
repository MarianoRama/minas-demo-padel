const configuredNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? ""
const whatsappNumber = /^598\d{8}$/.test(configuredNumber) && configuredNumber !== "59899000000"
  ? configuredNumber
  : ""

export function whatsappLink(message: string) {
  if (!whatsappNumber) return null
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
}
