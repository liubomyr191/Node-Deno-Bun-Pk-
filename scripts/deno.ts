import router from "../examples/preact/router.ts";

// Start Deno server with Peko router :^)
Deno.serve((req) => router.handle(req));

console.log("Deno server running with Peko router <3");