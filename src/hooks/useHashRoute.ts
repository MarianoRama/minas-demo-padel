import { useEffect, useState } from "react"

/**
 * Ruteo mínimo por hash, sin librerías: solo distingue si estamos en la
 * "app" de administración (`#/admin...`) o en el sitio público (cualquier
 * otro hash, incluidos los anclas de scroll como `#agenda` o `#canchas`,
 * que el navegador sigue resolviendo solo).
 */
export function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    function onHashChange() {
      setHash(window.location.hash)
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  return hash
}

export function isAdminRoute(hash: string): boolean {
  return hash.startsWith("#/admin")
}
