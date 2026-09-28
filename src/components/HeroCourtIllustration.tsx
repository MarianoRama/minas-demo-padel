/**
 * Ilustración decorativa: una cancha de pádel en perspectiva, con paredes de
 * vidrio, red, dos jugadores en silueta y una pelota con estela de
 * movimiento. Todo en la paleta del sitio (azul cancha + ladrillo).
 */
function HeroCourtIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 600"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pisoCancha" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-cancha-800)" />
          <stop offset="100%" stopColor="var(--color-cancha-700)" />
        </linearGradient>
      </defs>

      {/* pared de fondo (vidrio) */}
      <polygon points="170,20 310,20 310,60 170,60" fill="#faf7f0" opacity="0.14" />
      <polygon points="170,20 310,20 310,60 170,60" fill="none" stroke="#faf7f0" strokeOpacity="0.4" strokeWidth="1.5" />

      {/* pared lateral izquierda (vidrio) */}
      <polygon points="170,20 170,60 20,560 20,460" fill="#faf7f0" opacity="0.12" />
      <polygon points="170,20 170,60 20,560 20,460" fill="none" stroke="#faf7f0" strokeOpacity="0.35" strokeWidth="1.5" />

      {/* pared lateral derecha (vidrio) */}
      <polygon points="310,20 310,60 460,560 460,460" fill="#faf7f0" opacity="0.12" />
      <polygon points="310,20 310,60 460,560 460,460" fill="none" stroke="#faf7f0" strokeOpacity="0.35" strokeWidth="1.5" />

      {/* piso de la cancha en perspectiva */}
      <polygon points="170,60 310,60 460,560 20,560" fill="url(#pisoCancha)" />
      <polygon points="170,60 310,60 460,560 20,560" fill="none" stroke="#faf7f0" strokeWidth="3" />

      {/* línea central */}
      <line x1="240" y1="60" x2="240" y2="560" stroke="#faf7f0" strokeWidth="2" opacity="0.85" />
      {/* línea de servicio */}
      <line x1="57" y1="435" x2="423" y2="435" stroke="#faf7f0" strokeWidth="2" opacity="0.85" />

      {/* red */}
      <g>
        <rect x="90" y="298" width="300" height="4" fill="#faf7f0" opacity="0.9" />
        <rect x="90" y="302" width="300" height="20" fill="var(--color-cancha-950)" opacity="0.55" />
        {Array.from({ length: 11 }, (_, i) => (
          <line
            key={i}
            x1={90 + i * 30}
            y1="302"
            x2={90 + i * 30 - 10}
            y2="322"
            stroke="#faf7f0"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}
        <rect x="83" y="292" width="7" height="34" rx="1.5" fill="#faf7f0" opacity="0.8" />
        <rect x="390" y="292" width="7" height="34" rx="1.5" fill="#faf7f0" opacity="0.8" />
      </g>

      {/* pelota con estela de movimiento, viniendo de un saque */}
      <g opacity="0.9">
        <circle cx="198" cy="82" r="3" fill="var(--color-ladrillo-400)" opacity="0.18" />
        <circle cx="212" cy="104" r="4" fill="var(--color-ladrillo-400)" opacity="0.32" />
        <circle cx="228" cy="128" r="5.5" fill="var(--color-ladrillo-400)" opacity="0.55" />
        <circle cx="248" cy="156" r="8" fill="var(--color-ladrillo-400)" />
      </g>

      {/* jugador de fondo, cerca de la red */}
      <g opacity="0.92">
        <circle cx="335" cy="345" r="8" fill="#faf7f0" />
        <path d="M320 385c2-16 8-24 15-24s13 8 15 24Z" fill="#faf7f0" />
        <rect x="316" y="378" width="10" height="3.5" rx="1.5" fill="var(--color-ladrillo-500)" transform="rotate(-24 316 378)" />
      </g>

      {/* jugador en primer plano */}
      <g opacity="0.95">
        <circle cx="128" cy="452" r="17" fill="#faf7f0" />
        <path d="M97 528c4-34 16-52 31-52s27 18 31 52Z" fill="#faf7f0" />
        <rect x="90" y="512" width="20" height="7" rx="3" fill="var(--color-ladrillo-500)" transform="rotate(-32 90 512)" />
        <ellipse cx="82" cy="500" rx="9" ry="13" fill="none" stroke="var(--color-ladrillo-400)" strokeWidth="2.5" transform="rotate(-32 82 500)" />
      </g>
    </svg>
  )
}

export default HeroCourtIllustration
