// Bundles the kitgrid library sources into public/kitgrid-sources.json for the kit exporter.
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, "../../kitgridpackage/packages/kitgrid/src")
const out = {}

const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      if (name !== "test") walk(full)
    } else if (/\.(ts|tsx|css)$/.test(name) && !/\.test\.(ts|tsx)$/.test(name)) {
      out[relative(root, full).replaceAll("\\", "/")] = readFileSync(full, "utf8")
    }
  }
}
walk(root)

mkdirSync(join(here, "../public"), { recursive: true })
writeFileSync(join(here, "../public/kitgrid-sources.json"), JSON.stringify(out))
console.log(`kitgrid-sources.json: ${Object.keys(out).length} files`)
