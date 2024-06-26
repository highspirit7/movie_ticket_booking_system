import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor, selectAllFor } from '@tests/utils/records'
import createApp from '@/app'
import * as fixture from './fixtures'

const db = await createTestDatabase()
const app = createApp(db)
const createMovies = createFor(db, 'movies')
const createScreenings = createFor(db, 'screenings')
const createTickets = createFor(db, 'tickets')
const selectScreenings = selectAllFor(db, 'screenings')

afterAll(() => db.destroy())

afterEach(async () => {
  await db.deleteFrom('movies').execute()
})

describe('GET', () => {
  it('should return an empty array when there is no tickets', async () => {
    await createMovies(fixture.movies)
    await createScreenings(fixture.screenings)

    const { body } = await supertest(app).get('/tickets').expect(200)

    expect(body).toEqual([])
  })

  it('should return a list of tickets', async () => {
    await createMovies(fixture.movies)
    await createScreenings(fixture.screenings)
    await createTickets([{ screeningId: 1 }])

    const { body } = await supertest(app).get('/tickets').expect(200)

    expect(body).toEqual([
      {
        id: expect.any(Number),
        screeningId: 1,
        screeningTime: '2025-02-02T11:11:00.000Z',
        movieTitle: 'Sherlock Holmes',
        movieYear: 2009,
        createdAt: expect.any(String),
      },
    ])
  })
})

describe('POST', () => {
  it('should return 400 if screeningId is missing', async () => {
    await createMovies(fixture.movies)
    await createScreenings(fixture.screenings)
    const { body } = await supertest(app).post('/tickets').send({}).expect(400)

    expect(body.error.message).toMatch(/screeningId/i)
  })

  it('should return 400 if screeningId is zero', async () => {
    await createMovies(fixture.movies)
    await createScreenings(fixture.screenings)

    const { body } = await supertest(app)
      .post('/tickets')
      .send({ screeningId: 0 })
      .expect(400)

    expect(body.error.message).toMatch(/screeningId/i)
  })

  it('should return 201 and created ticket record', async () => {
    await createMovies(fixture.movies)
    await createScreenings(fixture.screenings)

    const { body } = await supertest(app)
      .post('/tickets')
      .send({ screeningId: 1 })
      .expect(201)

    expect(body).toEqual({
      id: expect.any(Number),
      screeningId: 1,
      createdAt: expect.any(String),
    })
  })

  it('should subtract 1 from left tickets of selected screening once ticket is successfully issued', async () => {
    await createMovies(fixture.movies)
    await createScreenings(fixture.screenings)

    const { body } = await supertest(app)
      .post('/tickets')
      .send({ screeningId: 1 })
      .expect(201)

    const selectedScreenings = await selectScreenings((eb) =>
      eb('id', '=', body.screeningId)
    )

    expect(selectedScreenings[0].leftTickets).toBe(99)
  })

  it('should return 400 if referenced screening does not exist', async () => {
    await createMovies(fixture.movies)
    await createScreenings(fixture.screenings)
    const { body } = await supertest(app)
      .post('/tickets')
      .send({ screeningId: 20320 })
      .expect(400)

    expect(body.error.message).toMatch('The selected screening does not exist')
  })

  it('should return 409 if referenced screening has no available tickets', async () => {
    await createMovies(fixture.movies)
    await createScreenings(fixture.screenings)
    const { body } = await supertest(app)
      .post('/tickets')
      .send({ screeningId: 2 })
      .expect(409)

    expect(body.error.message).toMatch(
      'The selected screening has no available tickets'
    )
  })
})
