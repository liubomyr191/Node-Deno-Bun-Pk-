import { config } from "../config.ts"
import { Event } from "../types.ts"

import { RequestContext } from "../server.ts"

/**
 * Peko's internal request logging function. Uses config.logString and log.Event underneath.
 * 
 * Returns promise so process isn't blocked when called without "await" keyword.
 * 
 * @param request: Request
 * @param status: number
 * @param start: number
 * @param responseTime: number
 * @returns Promise<void>
 */
export const logRequest = async (ctx: RequestContext, status: number, start: number, responseTime: number) => {
  const date = new Date(start)

  // can I define order of properties of object?
  const request: Request = ctx.request

  const requestEvent: Event = {
    id: `${ctx.request.method}-${request.url}-${date.toJSON()}`,
    type: "request",
    date: date,
    data: {
      status,
      responseTime: `${responseTime}ms`,
      request: request
    }
  }

  try {
    await config.logString(`[${requestEvent.date}] ${status} ${request.method} ${request.url} ${requestEvent.data.responseTime}`)
  } catch (error) {
    console.log(error)
  }

  try {
    await config.logEvent(requestEvent)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Peko's internal error logging function. Uses config.logEvent underneath.
 * 
 * Returns promise so process isn't blocked when called without "await" keyword.
 * 
 * @param id: string
 * @param error: any
 * @param date: Date
 */
export const logError = async (id: string, error: string, date: Date) => {
  const config = getConfig()

  try {
    return await config.logEvent({ id: `ERROR-${id}-${date.toJSON()}`, type: "error", date: date, data: { error } })
  } catch (e) {
    return console.error(e)
  }
}