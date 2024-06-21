import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor, selectAllFor } from '@tests/utils/records'
import buildRepository from '../repository'
import { fakeScreening, screeningMatcher } from './utils'

const db = await createTestDatabase()
const repository = buildRepository(db)
const createScreenings = createFor(db, 'screenings')
const createMovies = createFor(db, 'movies')
const selectScreenings = selectAllFor(db, 'screenings')

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
  it('should return all available screenings', async () => {
    await createMovies(fakeMovieRecords)

    await createScreenings([
      {
        allocatedTickets: 100,
        leftTickets: 0,
        movieId: 1,
        screeningTime: '2025-02-02T11:11:00Z',
      },
      {
        allocatedTickets: 100,
        leftTickets: 100,
        movieId: 101,
        screeningTime: '2025-02-02T11:22:00Z',
      },
    ])

    const availableScreenings = await repository.findAll((eb) =>
      eb('leftTickets', '>', 0)
    )

    expect(availableScreenings).toEqual([
      {
        id: expect.any(Number),
        allocatedTickets: 100,
        leftTickets: 100,
        movieId: 101,
        screeningTime: '2025-02-02T11:22:00Z',
        movieTitle: 'Stranger',
        movieYear: 2010,
      },
    ])
  })

  it('should return all unavailable screenings', async () => {
    await createMovies(fakeMovieRecords)

    await createScreenings([
      {
        allocatedTickets: 100,
        leftTickets: 0,
        movieId: 1,
        screeningTime: '2025-02-02T11:11:00Z',
      },
      {
        allocatedTickets: 100,
        leftTickets: 100,
        movieId: 101,
        screeningTime: '2025-02-02T11:22:00Z',
      },
    ])

    const availableScreenings = await repository.findAll((eb) =>
      eb('leftTickets', '=', 0)
    )

    expect(availableScreenings).toEqual([
      {
        id: expect.any(Number),
        allocatedTickets: 100,
        leftTickets: 0,
        movieId: 1,
        screeningTime: '2025-02-02T11:11:00Z',
        movieTitle: 'Sherlock Holmes',
        movieYear: 2009,
      },
    ])
  })

  it('should return all screenings', async () => {
    await createMovies(fakeMovieRecords)

    await createScreenings([
      {
        allocatedTickets: 100,
        leftTickets: 0,
        movieId: 1,
        screeningTime: '2025-02-02T11:11:00Z',
      },
      {
        allocatedTickets: 100,
        leftTickets: 100,
        movieId: 101,
        screeningTime: '2025-02-02T11:22:00Z',
      },
    ])

    const availableScreenings = await repository.findAll()

    expect(availableScreenings).toEqual([
      {
        id: expect.any(Number),
        allocatedTickets: 100,
        leftTickets: 0,
        movieId: 1,
        screeningTime: '2025-02-02T11:11:00Z',
        movieTitle: 'Sherlock Holmes',
        movieYear: 2009,
      },
      {
        id: expect.any(Number),
        allocatedTickets: 100,
        leftTickets: 100,
        movieId: 101,
        screeningTime: '2025-02-02T11:22:00Z',
        movieTitle: 'Stranger',
        movieYear: 2010,
      },
    ])
  })
})

describe('create', () => {
  it('should create a screening (explicitly listing all fields)', async () => {
    await createMovies([
      {
        id: 100,
        title: 'Sherlock Holmes',
        year: 2009,
      },
    ])

    const screening = await repository.create({
      movieId: 100,
      allocatedTickets: 100,
      leftTickets: 100,
      screeningTime: '2024-08-02T18:00:00Z',
    })

    expect(screening).toEqual({
      id: expect.any(Number),
      movieId: 100,
      allocatedTickets: 100,
      leftTickets: 100,
      screeningTime: '2024-08-02T18:00:00Z',
    })

    const screeningsInDatabase = await selectScreenings()
    expect(screeningsInDatabase).toEqual([screening])
  })

  it('should create a screening (with fake data functions)', async () => {
    await createMovies([
      {
        id: 100,
        title: 'Sherlock Holmes',
        year: 2009,
      },
    ])
    const screening = await repository.create(fakeScreening({ movieId: 100 }))

    expect(screening).toEqual(screeningMatcher({ movieId: 100 }))

    const screeningsInDatabase = await selectScreenings()
    expect(screeningsInDatabase).toEqual([screening])
  })
})

describe('update', () => {
  it('should update left tickets of screening', async () => {
    await createMovies(fakeMovieRecords)

    const [screening] = await createScreenings(fakeScreening())

    const updatedScreening = await repository.update(screening.id, {
      leftTickets: screening.leftTickets - 1,
    })

    // ASSERT (Then we should get...)
    expect(updatedScreening).toMatchObject(
      screeningMatcher({
        leftTickets: screening.leftTickets - 1,
      })
    )
  })
})
