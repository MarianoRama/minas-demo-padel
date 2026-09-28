const SESSION_KEY = "padel-minas-club.admin.sesion"

export function haySesionAdmin(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "ok"
  } catch {
    return false
  }
}

export function guardarSesionAdmin() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "ok")
  } catch {
    // si sessionStorage falla, simplemente se vuelve a pedir el PIN al recargar
  }
}

export function cerrarSesionAdmin() {
  try {
    window.sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // nada que limpiar
  }
}
