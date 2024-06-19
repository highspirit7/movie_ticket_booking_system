import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import buildRepository from './repository'
import * as schema from './schema'
import { jsonRoute } from '@/utils/middleware'
import { Database } from '@/database'
import BadRequest from '@/utils/errors/BadRequest'

export default (db: Database) => {
  const router = Router()
  const screenings = buildRepository(db)

  router
    .route('/')
    .get(
      jsonRoute(async (req) => {
        const { available } = req.query
        const availableScreenings = await screenings.findAll((eb) =>
          eb('leftTickets', '>', 0)
        )
        const unavailableScreenings = await screenings.findAll((eb) =>
          eb('leftTickets', '=', 0)
        )
        const allScreenings = await screenings.findAll()

        if (!available) return allScreenings
        if (available === 'true') return availableScreenings
        if (available === 'false') return unavailableScreenings

        throw new BadRequest(
          "Please provide 'true' or 'false' for available query"
        )
      })
    )
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body)

        return screenings.create({
          ...body,
          leftTickets: body.allocatedTickets,
        })
      }, StatusCodes.CREATED)
    )

  return router
}
