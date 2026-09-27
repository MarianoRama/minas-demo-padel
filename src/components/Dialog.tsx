import { useEffect, useRef, type ReactNode } from "react"

interface DialogProps {
  title: string
  onClose: () => void
  children: ReactNode
}

/** Modal accesible y reutilizable: drawer desde abajo en mobile, panel centrado en desktop. */
function Dialog({ title, onClose, children }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const focusable = panelRef.current?.querySelector<HTMLElement>(
      "input, button, textarea, select, a[href]"
    )
    focusable?.focus()

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink-900/55 backdrop-blur-[2px] sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-hueso-50 p-6 shadow-2xl sm:max-w-md sm:rounded-2xl"
      >
        {children}
      </div>
    </div>
  )
}

export default Dialog
