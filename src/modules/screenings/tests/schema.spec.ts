import { omit } from 'lodash/fp'
import { parse, parseInsertable } from '../schema'
import { fakeScreeningFull } from './utils'

it('parses a valid record', () => {
  const record = fakeScreeningFull()
  expect(parse(record)).toEqual(record)
})

it('throws an error due to zero/missing movieId', () => {
  const screeningWithoutMovieId = omit(['movieId'], fakeScreeningFull())
  const screeningEmptyMovieId = fakeScreeningFull({ movieId: 0 })
  expect(() => parseInsertable(screeningEmptyMovieId)).toThrow(/movieId/i)
  expect(() => parseInsertable(screeningWithoutMovieId)).toThrow(/movieId/i)
})

it('throws an error due to zero/missing allocatedTickets', () => {
  const screeningWithoutAllocatedTickets = omit(
    ['allocatedTickets'],
    fakeScreeningFull()
  )
  const screeningZeroAllocatedTickets = {
    ...fakeScreeningFull(),
    allocatedTickets: 0,
  }

  expect(() => parse(screeningWithoutAllocatedTickets)).toThrow(
    /allocatedTickets/i
  )
  expect(() => parse(screeningZeroAllocatedTickets)).toThrow(
    /allocatedTickets/i
  )
})

describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(fakeScreeningFull())

    expect(parsed).not.toHaveProperty('id')
  })
})
