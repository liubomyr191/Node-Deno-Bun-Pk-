import { 
  Route, 
  ssrHandler, 
  cacher,
  ResponseCache
} from "../../../mod.ts" // <- https://deno.land/x/peko/mod.ts

import { renderToString } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"

// Preact page components and HTML template for ssrHandler render logic
import Home from "../src/pages/Home.js"
import About from "../src/pages/About.js"
import htmlTemplate from "../template.ts"

const cache = new ResponseCache()
const env = Deno.env.toObject()

export const pages: Route[] = [
  {
    route: "/",
    middleware: [
      (ctx) => { 
        ctx.state = {
          request_time: `${Date.now()}`,
          ...Deno.env.toObject()
        }
      }
    ],
    handler: ssrHandler((ctx) => {
      const appHTML = renderToString(Home(ctx.state), null, null)
      return htmlTemplate({
        appHTML,
        title: `<title>Peko</title>`,
        modulepreload: `
          <script modulepreload="true" type="module" src="https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"></script>
          <script modulepreload="true" type="module" src="/pages/Home.js"></script>
        `,
        hydrationScript: `<script type="module">
          import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string";
          import Home from "/pages/Home.js";
          hydrate(Home(${JSON.stringify(ctx.state)}), document.getElementById("root"));
        </script>`
      })
    })
  },
  {
    route: "/about",
    // use cacher to serve responses from cache in prod env
    middleware: env.ENVIRONMENT === "production" ? cacher(cache) : [],
    handler: ssrHandler(() => {
      const appHTML = renderToString(About(), null, null)
      return htmlTemplate({
        appHTML,
        title: `<title>Peko | About</title>`,
        modulepreload: `
          <script modulepreload="true" type="module" src="https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string"></script>
          <script modulepreload="true" type="module" src="/pages/About.js"></script>
        `,
        hydrationScript: `<script type="module">
          import { hydrate } from "https://npm.reversehttp.com/preact,preact/hooks,htm/preact,preact-render-to-string";
          import About from "/pages/About.js";
          hydrate(About(), document.getElementById("root"))
        </script>`
      })
    }, {
      headers: new Headers({
        // instruct browser to cache page in prod env
        "Cache-Control": env.ENVIRONMENT === "production"
          ? "max-age=86400, stale-while-revalidate=86400"
          : "no-store"
      }),
    })
  }
]

export default pages