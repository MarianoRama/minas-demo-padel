/** Scroll suave (o instantáneo con reduced-motion) hasta el nodo dado. */
export function scrollToNode(node: HTMLElement | null) {
  if (!node) return
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
}
