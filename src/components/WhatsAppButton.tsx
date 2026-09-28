const WHATSAPP_MESSAGE = "Hola! Quería consultar sobre las canchas de Pádel Minas Club."

interface WhatsAppButtonProps {
  whatsapp: string
}

function WhatsAppButton({ whatsapp }: WhatsAppButtonProps) {
  const href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-ink-900 shadow-lg shadow-ink-900/25 transition-transform duration-200 hover:scale-105 sm:right-5"
      aria-label="Consultar por WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.16c-.24.68-1.4 1.32-1.94 1.4-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.13 1.02-2.42.27-.29.58-.37.78-.37.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.75 1.24 1.61 2.01 1.11.99 2.04 1.29 2.33 1.44.29.15.46.13.63-.08.17-.21.72-.84.91-1.13.19-.29.39-.24.65-.14.27.1 1.68.79 1.97.94.29.14.48.21.55.33.07.12.07.68-.17 1.36z" />
      </svg>
    </a>
  )
}

export default WhatsAppButton
