import type { ColumnType } from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export interface Director {
  movieId: number
  personId: number
}

export interface Movie {
  id: number | null
  title: string
  year: number | null
}

export interface People {
  birth: number | null
  id: number | null
  name: string
}

export interface Ratings {
  movieId: number
  rating: number
  votes: number
}

export interface Screening {
  allocatedTickets: number
  id: Generated<number>
  leftTickets: number
  movieId: number
  screeningTime: string
}

export interface Star {
  movieId: number
  personId: number
}

export interface Ticket {
  createdAt: Generated<string>
  id: Generated<number>
  screeningId: number
}

export interface DB {
  directors: Director
  movies: Movie
  people: People
  ratings: Ratings
  screenings: Screening
  stars: Star
  tickets: Ticket
}
