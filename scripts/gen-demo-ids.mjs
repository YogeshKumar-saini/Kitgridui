// Writes src/features/demos/ids.json from the real demo catalog, so the proxy can 404 unknown
// /components/<id> before the page streams.
import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { createJiti } from "jiti"

const root = fileURLToPath(new URL("..", import.meta.url))
const jiti = createJiti(import.meta.url, {
  jsx: { runtime: "automatic" },
  alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) },
  fsCache: false,
})
const { demos } = await jiti.import("../src/features/demos/catalog.ts")
const ids = demos.map((demo) => demo.id)
writeFileSync(`${root}src/features/demos/ids.json`, JSON.stringify(ids))
console.log(`ids.json: ${ids.length} demos`)
