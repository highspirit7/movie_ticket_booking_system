import { z } from 'zod'
import { Screenings } from '@/database'

type Record = Screenings

const schema = z.object({
  id: z.coerce.number().int().positive(),
  allocatedTickets: z.number().int().positive(),
  leftTickets: z.number().int().nonnegative(),
  screeningTime: z.string().datetime(),
  movieId: z.number().int().positive(),
})

// create new viewing screenings for watching a movie that has a timestamp and a provided allocated number of tickets
// get a list of screenings available for booking. Screenings should include session information (timestamp, number of tickets, number of tickets left) and movie: (title and year)

// parsers for validating and coercing data
const insertable = schema.omit({
  id: true,
  leftTickets: true,
})
//   const partial = insertable.partial()

export const parseId = (id: unknown) => schema.shape.id.parse(id)
export const parse = (record: unknown) => schema.parse(record)
export const parseInsertable = (record: unknown) => insertable.parse(record)
//   export const parsePartial = (record: unknown) => partial.parse(record)

// matches database and validation schema keys
export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
