import { omit } from 'lodash/fp'
import { parse, parseInsertable } from '../schema'

const record = {
  id: 1,
  allocatedTickets: 321,
  leftTickets: 123,
  screeningTime: '2025-02-02T11:11:00Z',
  movieId: 36606,
}

// Generally, schemas are tested with a few examples of valid and invalid records.
it('parses a valid record', () => {
  expect(parse(record)).toEqual(record)
})

it('throws an error due to empty/missing movieId (concrete)', () => {
  const screeningEmptyMovieId = {
    movieId: '',
    allocatedTickets: 321,
    screeningTime: '2025-02-02T11:11:00Z',
  }
  expect(() => parseInsertable(screeningEmptyMovieId)).toThrow(/movieId/i)
})

// a more generic vesion of the above test, which makes
// no assumptions about other properties
it('throws an error due to empty/missing title (generic)', () => {
  const screeningWithoutMovieId = omit(['movieId'], record)
  const screeningEmptyMovieId = { ...record, movieId: '' }

  expect(() => parse(screeningWithoutMovieId)).toThrow(/movieId/i)
  expect(() => parse(screeningEmptyMovieId)).toThrow(/movieId/i)
})
