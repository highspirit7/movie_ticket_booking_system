import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor } from '@tests/utils/records'
import { omit } from 'lodash/fp'
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

    expect(body).toEqual([
      { ...screeningMatcher(), movieTitle: 'Sherlock Holmes', movieYear: 2009 },
    ])
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
      {
        ...screeningMatcher({
          leftTickets: 0,
          screeningTime: '2024-10-10T10:00:00Z',
        }),
        movieTitle: 'Sherlock Holmes',
        movieYear: 2009,
      },
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
      { ...screeningMatcher(), movieTitle: 'Sherlock Holmes', movieYear: 2009 },
      {
        ...screeningMatcher({
          leftTickets: 0,
          screeningTime: '2024-10-10T10:00:00Z',
        }),
        movieTitle: 'Sherlock Holmes',
        movieYear: 2009,
      },
    ])
  })
})

describe('POST', () => {
  it('should return 400 if movieId is missing', async () => {
    const { body } = await supertest(app)
      .post('/screenings')
      .send(omit(['movieId'], fakeScreening()))
      .expect(400)

    expect(body.error.message).toMatch(/movieId/i)
  })

  it('should return 400 if allocatedTickets is missing', async () => {
    // ACT (When we request...)
    const { body } = await supertest(app)
      .post('/screenings')
      .send(omit(['allocatedTickets'], fakeScreening()))
      .expect(400)

    // ASSERT (Then we should get...)
    expect(body.error.message).toMatch(/allocatedTickets/i)
  })

  it('should return 400 if screeningTime is missing', async () => {
    // ACT (When we request...)
    const { body } = await supertest(app)
      .post('/screenings')
      .send(omit(['screeningTime'], fakeScreening()))
      .expect(400)

    // ASSERT (Then we should get...)
    expect(body.error.message).toMatch(/screeningTime/i)
  })

  it('does not allow to create an screening with an empty screeningTime', async () => {
    // ACT (When we request...)
    const { body } = await supertest(app)
      .post('/screenings')
      .send(fakeScreening({ screeningTime: '' }))
      .expect(400)

    // ASSERT (Then we should get...)
    expect(body.error.message).toMatch(/screeningTime/i)
  })

  it('should return 201 and created screening record', async () => {
    await createMovies(fakeMovieRecords)

    const { body } = await supertest(app)
      .post('/screenings')
      .send(omit(['leftTickets'], fakeScreening()))
      .expect(201)

    expect(body).toEqual(screeningMatcher({ leftTickets: 100 }))
  })
})
