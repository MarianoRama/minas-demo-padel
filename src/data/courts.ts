export interface Court {
  id: string
  name: string
  type: "cubierta" | "aire libre"
  description: string
}

export const courts: Court[] = [
  {
    id: "c1",
    name: "Cancha 1 - Central",
    type: "cubierta",
    description: "Cancha techada con iluminación LED, ideal para jugar de noche o con lluvia.",
  },
  {
    id: "c2",
    name: "Cancha 2 - Norte",
    type: "aire libre",
    description: "Cancha al aire libre con césped sintético premium y cristales panorámicos.",
  },
  {
    id: "c3",
    name: "Cancha 3 - Sur",
    type: "aire libre",
    description: "Cancha al aire libre, perfecta para partidos entre amigos al atardecer.",
  },
]
