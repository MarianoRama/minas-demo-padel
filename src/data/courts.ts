export interface Court {
  id: string
  name: string
  type: "cubierta" | "aire libre"
  description: string
  detalle: string
  foto?: string
}

export const courts: Court[] = [
  {
    id: "c1",
    name: "Cancha 1 — Central",
    type: "cubierta",
    description: "Techada, con iluminación LED regulable.",
    detalle:
      "La cancha más pedida: techo alto, piso cerámico antideslizante y luz pareja para jugar de noche o con lluvia sin perder ni un punto.",
  },
  {
    id: "c2",
    name: "Cancha 2 — Norte",
    type: "aire libre",
    description: "Aire libre, césped sintético premium.",
    detalle:
      "Al aire libre, con cristales panorámicos y césped de última generación. La preferida para partidos de mañana, con sol y buen mate al lado.",
  },
  {
    id: "c3",
    name: "Cancha 3 — Sur",
    type: "aire libre",
    description: "Aire libre, ideal para el atardecer.",
    detalle:
      "Orientada de forma que el sol nunca te complica la devolución. Ideal para el picadito de después del trabajo, entre las 18 y las 20.",
  },
]
