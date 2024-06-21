import { omit } from 'lodash/fp'
import { parse, parseInsertable } from '../schema'
import { fakeTicketFull } from './utils'

it('parses a valid record', () => {
  const record = fakeTicketFull()
  expect(parse(record)).toEqual(record)
})

it('throws an error due to zero/missing screeningId', () => {
  const ticketWithoutScreeningId = omit(['screeningId'], fakeTicketFull())
  const ticketZeroScreeningId = fakeTicketFull({ screeningId: 0 })

  expect(() => parseInsertable(ticketWithoutScreeningId)).toThrow(
    /screeningId/i
  )
  expect(() => parseInsertable(ticketZeroScreeningId)).toThrow(/screeningId/i)
})

describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(fakeTicketFull())

    expect(parsed).not.toHaveProperty('id')
  })
})
