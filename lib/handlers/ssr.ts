import { RequestContext } from "../server.ts"
import { config } from "../config.ts"
import { hasher } from "../utils/hash.ts"

export type SSRData = { 
  srcURL?: URL
  render: Render
}
export type Render = (ctx: RequestContext) => string | Promise<string>

/**
 * Peko Server-Side Rendering handler. Generates "Cache-Control" and "ETAG" headers.
 * @param ctx: RequestContext
 * @param ssrData: SSRRoute
 * @returns Promise<Response>
 */
export const ssrHandler = async (ctx: RequestContext, ssrData: SSRData) => {
  // TODO: emit srcURL file change events from watcher worker (in devMode)

  // use provided render and template fcns for HTML generation
  const HTML = await ssrData.render(ctx)   
  const hashString = await hasher(HTML)

  return new Response(HTML, {
    headers : new Headers({
      'Content-Type': 'text/html; charset=utf-8',
      // tell browser not to cache if in devMode
      'Cache-Control': config.devMode
        ? 'no-store'
        : 'max-age=604800, stale-while-revalidate=86400',
      // create ETag hash so 304 (not modified) response can be given from cacher
      'ETag': hashString
    })
  })
}

// TODO: test angle bracket HTMLContent returned from render