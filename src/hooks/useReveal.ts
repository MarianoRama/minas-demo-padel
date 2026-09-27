import { useEffect, useRef, useState } from "react"

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Revela un elemento (fade + slide corto) cuando entra en viewport, una sola
 * vez. Usa un listener de scroll/resize con getBoundingClientRect (en vez de
 * IntersectionObserver) porque es síncrono y no se pierde con scrolls
 * programáticos muy rápidos. Respeta prefers-reduced-motion.
 */
export function useReveal<T extends HTMLElement>(delayMs = 0) {
  const ref = useRef<T | null>(null)
  const [reduceMotion] = useState(prefersReducedMotion)
  const [visible, setVisible] = useState(reduceMotion)

  useEffect(() => {
    if (reduceMotion || visible) return
    const node = ref.current
    if (!node) return

    let rafId = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    let settled = false

    function cleanupListeners() {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }

    function check() {
      if (settled || !node) return
      const rect = node.getBoundingClientRect()
      const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0
      if (inView) {
        settled = true
        cleanupListeners()
        timer = setTimeout(() => setVisible(true), delayMs)
      }
    }

    function onScroll() {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(check)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    check()

    return () => {
      cleanupListeners()
      cancelAnimationFrame(rafId)
      if (timer) clearTimeout(timer)
    }
  }, [delayMs, reduceMotion, visible])

  return { ref, visible }
}

export const revealClass = (visible: boolean) =>
  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
