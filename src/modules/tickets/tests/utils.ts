import { expect } from 'vitest'
import type { Insertable } from 'kysely'
import type { Ticket } from '@/database'

export const fakeTicket = (
  overrides: Partial<Insertable<Ticket>> = {}
): Insertable<Ticket> => ({
  screeningId: 1,
  ...overrides,
})

export const ticketMatcher = (overrides: Partial<Insertable<Ticket>> = {}) => ({
  id: expect.any(Number),
  createdAt: expect.any(String),
  ...overrides, // for id
  ...fakeTicket(overrides),
})

export const fakeTicketFull = (
  overrides: Partial<Insertable<Ticket>> = {}
) => ({
  id: 2,
  createdAt: new Date().toISOString(),
  ...fakeTicket(overrides),
})
