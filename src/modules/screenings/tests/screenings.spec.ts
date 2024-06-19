import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor } from '@tests/utils/records'
import { fakeScreening, screeningMatcher } from './utils'
import createApp from '@/app'

const db = await createTestDatabase()
const app = createApp(db)
const createMovies = createFor(db, 'movies')
const createScreenings = createFor(db, 'screenings')

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

describe('GET', () => {
  it('should return an empty array when there is no screenings', async () => {
    const { body } = await supertest(app).get('/screenings').expect(200)

    expect(body).toEqual([])
  })

  it('should return an empty array when there is no available screenings', async () => {
    const { body } = await supertest(app)
      .get('/screenings?available=true')
      .expect(200)

    expect(body).toEqual([])
  })

  it('should return a list of available screenings', async () => {
    await createMovies(fakeMovieRecords)

    await createScreenings([
      fakeScreening(),
      fakeScreening({ leftTickets: 0, screeningTime: '2024-10-10T10:00:00Z' }),
    ])

    const { body } = await supertest(app)
      .get('/screenings?available=true')
      .expect(200)

    expect(body).toEqual([screeningMatcher()])
  })

  it('should return a list of unavailable screenings', async () => {
    await createMovies(fakeMovieRecords)

    await createScreenings([
      fakeScreening(),
      fakeScreening({ leftTickets: 0, screeningTime: '2024-10-10T10:00:00Z' }),
    ])

    const { body } = await supertest(app)
      .get('/screenings?available=false')
      .expect(200)

    expect(body).toEqual([
      screeningMatcher({
        leftTickets: 0,
        screeningTime: '2024-10-10T10:00:00Z',
      }),
    ])
  })

  it('should return a list of all screenings', async () => {
    await createMovies(fakeMovieRecords)

    await createScreenings([
      fakeScreening(),
      fakeScreening({ leftTickets: 0, screeningTime: '2024-10-10T10:00:00Z' }),
    ])

    const { body } = await supertest(app).get('/screenings').expect(200)

    expect(body).toEqual([
      screeningMatcher(),
      screeningMatcher({
        leftTickets: 0,
        screeningTime: '2024-10-10T10:00:00Z',
      }),
    ])
  })
})
