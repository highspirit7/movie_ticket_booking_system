import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import buildRepository from './repository'
import buildScreeningsRepository from '@/modules/screenings/repository'
import * as schema from './schema'
import { jsonRoute } from '@/utils/middleware'
import { Database } from '@/database'
import NotAvailableTickets from '@/utils/errors/NoAvailableTickets'
import BadRequest from '@/utils/errors/BadRequest'

export default (db: Database) => {
  const router = Router()
  const tickets = buildRepository(db)
  const screenings = buildScreeningsRepository(db)

  router
    .route('/')
    .get(jsonRoute(tickets.findAll))
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body)

        const screening = await screenings.findById(body.screeningId)

        if (!screening) {
          throw new BadRequest('The selected screening does not exist')
        }

        if (screening?.leftTickets === 0)
          throw new NotAvailableTickets(
            'The selected screening has no available tickets'
          )

        return tickets.create(body)
      }, StatusCodes.CREATED)
    )

  return router
}
