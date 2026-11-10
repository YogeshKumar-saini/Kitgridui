// Per-component proof numbers for the Access sheet, generated from the library so they never
// drift: tests covering the component, gzip size of its built JS and CSS, and how its motion
// treats reduced-motion users ("none" when it has no motion at all).
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { gzipSync } from "node:zlib"

const here = dirname(fileURLToPath(import.meta.url))
const lib = join(here, "../../kitgridpackage/packages/kitgrid")
const src = join(lib, "src/components")
const dist = join(lib, "dist/components")

const files = (dir, test) =>
  existsSync(dir) ? readdirSync(dir).filter(test).map((name) => join(dir, name)) : []

const gzip = (paths) => paths.reduce((sum, path) => sum + gzipSync(readFileSync(path)).length, 0)

const proof = {}
for (const id of readdirSync(src, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)) {
  const folder = join(src, id)
  const tests = files(folder, (name) => name.includes(".test."))
    .map((path) => readFileSync(path, "utf8").match(/^\s*(it|test)(\.each\([^)]*\))?\(/gm)?.length ?? 0)
    .reduce((sum, count) => sum + count, 0)
  const source = files(folder, (name) => /\.(tsx?|css)$/.test(name) && !name.includes(".test."))
    .map((path) => readFileSync(path, "utf8"))
    .join("\n")
  proof[id] = {
    tests,
    gzip: gzip(files(join(dist, id), (name) => /\.(js|css)$/.test(name))),
    motion: !/transition|animation|animate-|@keyframes|requestAnimationFrame/.test(source)
      ? "none"
      : /prefers-reduced-motion|motion-reduce|motion-safe|useReducedMotion|--kg-duration|duration-kg-/.test(source)
        ? "respects-reduced"
        : "unchecked",
    tailwind: !files(folder, (name) => name.endsWith(".css")).length,
  }
}

const out = join(here, "../src/lib/generated")
mkdirSync(out, { recursive: true })
writeFileSync(join(out, "proof.json"), `${JSON.stringify(proof, null, 1)}\n`)
console.log(`proof.json: ${Object.keys(proof).length} components`)
