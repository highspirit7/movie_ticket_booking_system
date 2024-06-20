import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor, selectAllFor } from '@tests/utils/records'
import buildRepository from '../repository'

const db = await createTestDatabase()
const repository = buildRepository(db)
const createScreenings = createFor(db, 'screenings')
const createMovies = createFor(db, 'movies')
const createTickets = createFor(db, 'tickets')
const selectTickets = selectAllFor(db, 'tickets')

afterAll(() => db.destroy())

afterEach(async () => {
  await db.deleteFrom('movies').execute()
})

const fakeMovieRecords = [
  {
    id: 1,
    title: 'Sherlock Holmes',
    year: 2009,
  },
  {
    id: 101,
    title: 'Stranger',
    year: 2010,
  },
]

describe('findAll', () => {
  it('should return all (booked) tickets', async () => {
    await createMovies(fakeMovieRecords)
    await createScreenings([
      {
        id: 1,
        allocatedTickets: 100,
        leftTickets: 100,
        movieId: 1,
        screeningTime: '2025-02-02T11:11:00Z',
      },
      {
        id: 2,
        allocatedTickets: 88,
        leftTickets: 88,
        movieId: 101,
        screeningTime: '2025-02-02T11:22:00Z',
      },
    ])

    await createTickets([
      {
        screeningId: 1,
      },
      { screeningId: 2 },
    ])

    const allTickets = await repository.findAll()

    expect(allTickets).toEqual([
      {
        id: expect.any(Number),
        movieTitle: 'Sherlock Holmes',
        screeningTime: '2025-02-02T11:11:00Z',
        screeningId: 1,
        createdAt: expect.any(String),
      },
      {
        id: expect.any(Number),
        movieTitle: 'Stranger',
        screeningTime: '2025-02-02T11:22:00Z',
        screeningId: 2,
        createdAt: expect.any(String),
      },
    ])
  })
})

describe('create', () => {
  it('should create a ticket', async () => {
    await createMovies(fakeMovieRecords)
    await createScreenings([
      {
        id: 1,
        allocatedTickets: 100,
        leftTickets: 100,
        movieId: 1,
        screeningTime: '2025-02-02T11:11:00Z',
      },
      {
        id: 2,
        allocatedTickets: 88,
        leftTickets: 88,
        movieId: 101,
        screeningTime: '2025-02-02T11:22:00Z',
      },
    ])

    const ticket = await repository.create({
      screeningId: 1,
    })

    expect(ticket).toEqual({
      id: expect.any(Number),
      screeningId: expect.any(Number),
      createdAt: expect.any(String),
    })

    const ticketsInDatabase = await selectTickets()
    expect(ticketsInDatabase).toEqual([ticket])
  })
})
