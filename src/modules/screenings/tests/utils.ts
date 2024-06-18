import { expect } from 'vitest'
import type { Insertable } from 'kysely'
import type { Screening } from '@/database'

// type InsertableScreening = Omit<Screening, 'leftTickets' | 'id'>

export const fakeScreening = (
  overrides: Partial<Insertable<Screening>> = {}
): Insertable<Screening> => ({
  allocatedTickets: 100,
  leftTickets: 99,
  movieId: 1,
  screeningTime: '2025-02-02T11:11:00Z',
  ...overrides,
})

export const screeningMatcher = (
  overrides: Partial<Insertable<Screening>> = {}
) => ({
  id: expect.any(Number),
  ...overrides,
  ...fakeScreening(overrides),
})

export const fakeScreeningFull = (
  overrides: Partial<Insertable<Screening>> = {}
) => ({
  id: 22,
  ...fakeScreening(overrides),
})
