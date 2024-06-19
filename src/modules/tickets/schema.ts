import { z } from 'zod'
import { Ticket } from '@/database'

type Record = Ticket

const schema = z.object({
  id: z.coerce.number().int().positive(),
  screeningId: z.number().int().positive(),
  createdAt: z.string().datetime(),
})

const insertable = schema.omit({
  id: true,
  createdAt: true,
})

export const parseId = (id: unknown) => schema.shape.id.parse(id)
export const parse = (record: unknown) => schema.parse(record)
export const parseInsertable = (record: unknown) => insertable.parse(record)

// matches database and validation schema keys
export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
