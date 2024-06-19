import { expect } from 'vitest'
import type { Insertable } from 'kysely'
import type { Ticket } from '@/database'

export const fakeTicket = (
  overrides: Partial<Insertable<Ticket>> = {}
): Insertable<Ticket> => ({
  screeningId: 1,
  createdAt: '2024-06-16T10:10:10Z',
  ...overrides,
})

export const TicketMatcher = (overrides: Partial<Insertable<Ticket>> = {}) => ({
  id: expect.any(Number),
  ...overrides, // for id
  ...fakeTicket(overrides),
})

export const fakeTicketFull = (
  overrides: Partial<Insertable<Ticket>> = {}
) => ({
  id: 2,
  ...fakeTicket(overrides),
})
