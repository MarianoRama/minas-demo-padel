interface CourtIllustrationProps {
  variant: "cubierta" | "aire libre"
  className?: string
}

/** Ilustración cenital de una cancha de pádel, duotono, sin fotos externas. */
function CourtIllustration({ variant, className }: CourtIllustrationProps) {
  const fill = variant === "cubierta" ? "var(--color-cancha-800)" : "var(--color-cancha-700)"
  return (
    <svg viewBox="0 0 240 320" className={className} role="img" aria-label={`Vista cenital de cancha ${variant}`}>
      <rect x="4" y="4" width="232" height="312" rx="10" fill={fill} />
      <rect x="20" y="20" width="200" height="280" fill="none" stroke="#faf7f0" strokeWidth="3" />
      <line x1="20" y1="160" x2="220" y2="160" stroke="#faf7f0" strokeWidth="3" />
      <line x1="20" y1="97" x2="220" y2="97" stroke="#faf7f0" strokeWidth="2" opacity="0.85" />
      <line x1="20" y1="223" x2="220" y2="223" stroke="#faf7f0" strokeWidth="2" opacity="0.85" />
      <line x1="120" y1="20" x2="120" y2="97" stroke="#faf7f0" strokeWidth="2" opacity="0.85" />
      <line x1="120" y1="223" x2="120" y2="300" stroke="#faf7f0" strokeWidth="2" opacity="0.85" />
      {/* red */}
      <rect x="14" y="156" width="212" height="8" fill="var(--color-ladrillo-500)" />
      {/* vidrios de fondo */}
      <rect x="20" y="20" width="200" height="6" fill="#faf7f0" opacity="0.4" />
      <rect x="20" y="294" width="200" height="6" fill="#faf7f0" opacity="0.4" />
    </svg>
  )
}

export default CourtIllustration
