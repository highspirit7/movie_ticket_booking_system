import { StatusCodes } from 'http-status-codes'

export default class NotAvailableTickets extends Error {
  status: number

  constructor(
    message: string = 'No tickets available for the selected screening'
  ) {
    super(message)
    this.status = StatusCodes.CONFLICT
  }
}
