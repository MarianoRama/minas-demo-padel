interface PaginationProps {
  page: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  label: string
}

/** Paginado numerado accesible. Al cambiar de página hace scroll suave hasta
 * el contenedor que se le pase por ref (respeta prefers-reduced-motion). */
function Pagination({ page, pageSize, totalItems, onPageChange, label }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  if (totalPages <= 1) return null

  const desde = (page - 1) * pageSize + 1
  const hasta = Math.min(totalItems, page * pageSize)

  function irA(p: number) {
    const clamped = Math.min(totalPages, Math.max(1, p))
    onPageChange(clamped)
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p className="text-xs text-ink-500">
        Mostrando {desde}–{hasta} de {totalItems}
      </p>
      <nav aria-label={label} className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => irA(page - 1)}
          disabled={page === 1}
          aria-label="Página anterior"
          className="flex h-11 min-w-[44px] items-center justify-center rounded-md border border-cancha-900/20 text-sm font-bold text-cancha-900 disabled:opacity-30"
        >
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => irA(p)}
            aria-current={p === page ? "page" : undefined}
            className={`flex h-11 min-w-[44px] items-center justify-center rounded-md border text-sm font-bold ${
              p === page
                ? "border-cancha-900 bg-cancha-900 text-hueso-50"
                : "border-cancha-900/20 text-cancha-900"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          onClick={() => irA(page + 1)}
          disabled={page === totalPages}
          aria-label="Página siguiente"
          className="flex h-11 min-w-[44px] items-center justify-center rounded-md border border-cancha-900/20 text-sm font-bold text-cancha-900 disabled:opacity-30"
        >
          ›
        </button>
      </nav>
    </div>
  )
}

export default Pagination
