import { defaultValues, type Demo } from "@/features/demos/registry"
import { save, zip } from "./zip"

// Library sources are bundled into public/kitgrid-sources.json by scripts/gen-sources.mjs and
// fetched on first export, so the download stays a client-only operation.
const sources: Record<string, string> = {}
const paths = new Set<string>()
let SHARED: string[] = []
let loading: Promise<void> | undefined

const ready = () =>
  (loading ??= fetch("/kitgrid-sources.json")
    .then((response) => response.json() as Promise<Record<string, string>>)
    .then((all) => {
      Object.assign(sources, all)
      for (const path of Object.keys(all)) paths.add(path)
      SHARED = [...paths].filter((p) => /^(hooks|utils|primitives|provider)\//.test(p))
    }))

const load = async (path: string) => sources[path] as string

const resolve = (from: string, spec: string) => {
  const parts = from.split("/").slice(0, -1)
  for (const part of spec.split("/")) {
    if (part === "..") parts.pop()
    else if (part !== ".") parts.push(part)
  }
  const joined = parts.join("/")
  const base = joined.replace(/\.js$/, "")
  return [joined, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`].find((p) => paths.has(p))
}

const exported = (text: string) =>
  [...text.matchAll(/export\s*(type\s*)?\{([^}]*)\}/g)].flatMap(([, whole, list]) =>
    (list as string)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => ({
        name: item.replace(/^type\s+/, "").split(/\s+as\s+/).pop() as string,
        type: !!whole || item.startsWith("type "),
      })),
  )

/** Folder behind each library name, plus the type-only names of the library and charts entries. */
const exportMap = async () => {
  const map = new Map<string, string>()
  const types = new Set<string>()
  const chartTypes = new Set<string>()
  const indexes = [...paths].filter((p) => /^(components\/[\w-]+|hooks|utils)\/index\.ts$/.test(p))
  await Promise.all([
    ...indexes.map(async (p) => {
      const folder = p.startsWith("components/") ? (p.split("/")[1] as string) : undefined
      for (const { name, type } of exported(await load(p))) {
        if (folder) map.set(name, folder)
        if (type) types.add(name)
      }
    }),
    (async () => {
      for (const { name, type } of exported(await load("charts/index.ts")))
        if (type) chartTypes.add(name)
    })(),
  ])
  return { map, types, chartTypes }
}

const closure = async (roots: string[]) => {
  const seen = new Set<string>()
  const queue = [...roots]
  while (queue.length) {
    const path = queue.pop() as string
    if (seen.has(path) || !paths.has(path)) continue
    seen.add(path)
    if (path.endsWith(".css")) continue
    for (const [, spec] of (await load(path)).matchAll(
      /(?:from|import)\s*\(?\s*["'](\.{1,2}\/[^"']+)["']/g,
    )) {
      const next = resolve(path, spec as string)
      if (next) queue.push(next)
    }
  }
  for (const path of [...seen]) {
    const folder = path.match(/^components\/[\w-]+\//)?.[0]
    if (folder)
      for (const sheet of paths)
        if (sheet.startsWith(folder) && sheet.endsWith(".css")) seen.add(sheet)
  }
  return seen
}

const pascal = (id: string) =>
  id.replace(/(^|[-_ ]+)(\w)/g, (_, __, c: string) => c.toUpperCase()).replace(/\W/g, "")

interface Snippet {
  imports: string[]
  decls: string
  jsx: string
}

const parse = (code: string): Snippet => {
  const lines = code.split("\n")
  const imports: string[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i] as string
    if (!line.trim()) {
      i++
      continue
    }
    if (!/^import\b/.test(line)) break
    let statement = line
    while (!/["'][^"']+["'];?\s*$/.test(statement) && i + 1 < lines.length)
      statement += `\n${lines[++i]}`
    imports.push(statement)
    i++
  }
  const rest = lines.slice(i)
  const start = rest.findIndex((line) => line.startsWith("<"))
  return start === -1
    ? { imports, decls: rest.join("\n"), jsx: "" }
    : {
        imports,
        decls: rest.slice(0, start).join("\n").trim(),
        jsx: rest.slice(start).join("\n").trim(),
      }
}

const importedNames = (imports: string[]) => {
  const names = new Set<string>()
  for (const statement of imports) {
    for (const [, list] of statement.matchAll(/\{([^}]*)\}/g))
      for (const item of (list as string).split(","))
        if (item.trim()) names.add(item.trim().replace(/^type\s+/, "").split(/\s+as\s+/).pop() as string)
    const lead = statement.match(/^import\s+(?:type\s+)?([A-Za-z_$][\w$]*)/)?.[1]
    if (lead) names.add(lead)
    const star = statement.match(/\*\s+as\s+([A-Za-z_$][\w$]*)/)?.[1]
    if (star) names.add(star)
  }
  return names
}

const declaredNames = (text: string) => {
  const names = new Set<string>()
  for (const [, name] of text.matchAll(/\b(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/g))
    names.add(name as string)
  for (const [, list] of text.matchAll(/\b(?:const|let|var)\s*[[{]([^\]}]*)[\]}]/g))
    for (const item of (list as string).split(",")) {
      const name = item.split(/[:=]/).pop()?.trim().replace(/^\.\.\./, "")
      if (name && /^[A-Za-z_$][\w$]*$/.test(name)) names.add(name)
    }
  return names
}

interface Universe {
  library: Set<string>
  charts: Set<string>
  icons: Set<string>
  react: Set<string>
  types: Set<string>
  chartTypes: Set<string>
}

const source = (demo: Demo, universe: Universe) => {
  const { imports, decls, jsx } = parse(demo.code(defaultValues(demo) as never))
  const taken = new Set([...importedNames(imports), ...declaredNames(decls + jsx)])
  const wanted: Record<string, Set<string>> = {
    kitgrid: new Set(),
    "kitgrid/charts": new Set(),
    "lucide-react": new Set(),
    react: new Set(),
  }
  const types: Record<string, Set<string>> = { kitgrid: new Set(), "kitgrid/charts": new Set() }
  for (const [word] of `${decls}\n${jsx}`.matchAll(/\b[A-Za-z_$][\w$]*\b/g)) {
    if (taken.has(word)) continue
    const upper = /^[A-Z]/.test(word)
    if (universe.library.has(word)) wanted.kitgrid?.add(word)
    else if (universe.charts.has(word)) wanted["kitgrid/charts"]?.add(word)
    else if (upper && universe.icons.has(word)) wanted["lucide-react"]?.add(word)
    else if ((upper || /^use[A-Z]/.test(word)) && universe.react.has(word)) wanted.react?.add(word)
    else if (upper && universe.types.has(word)) types.kitgrid?.add(word)
    else if (upper && universe.chartTypes.has(word)) types["kitgrid/charts"]?.add(word)
  }
  const line = (keyword: string) => ([from, names]: [string, Set<string>]) =>
    names.size ? [`import ${keyword}{ ${[...names].sort().join(", ")} } from "${from}"`] : []
  const added = [
    ...Object.entries(wanted).flatMap(line("")),
    ...Object.entries(types).flatMap(line("type ")),
  ]
  const name = `${pascal(demo.id)}Example`
  const body = jsx
    ? `  return (\n    <>\n${jsx
        .split("\n")
        .map((line) => `      ${line}`)
        .join("\n")}\n    </>\n  )`
    : "  return null"
  for (const statement of imports) {
    const from = statement.match(/from\s*["']([^"']+)["']/)?.[1]
    const into = from ? wanted[from] : undefined
    if (into) for (const imported of importedNames([statement])) into.add(imported)
  }
  return {
    name,
    text: `${[...imports, ...added].join("\n")}\n\n${decls ? `${decls}\n\n` : ""}export default function ${name}() {\n${body}\n}\n`,
    uses: wanted,
  }
}

const STATIC = {
  "next.config.ts": `import type { NextConfig } from "next"

const nextConfig: NextConfig = {}

export default nextConfig
`,
  "next-env.d.ts": `/// <reference types="next" />
/// <reference types="next/image-types/global" />
`,
  "tsconfig.json": `${JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        lib: ["ES2023", "DOM", "DOM.Iterable"],
        module: "ESNext",
        moduleResolution: "bundler",
        jsx: "react-jsx",
        strict: true,
        noUncheckedIndexedAccess: true,
        skipLibCheck: true,
        noEmit: true,
        allowJs: true,
        esModuleInterop: true,
        resolveJsonModule: true,
        isolatedModules: true,
        incremental: true,
        plugins: [{ name: "next" }],
        paths: {
          kitgrid: ["./src/kitgrid/index.ts"],
          "kitgrid/charts": ["./src/kitgrid/charts/index.ts"],
          "kitgrid/hooks": ["./src/kitgrid/hooks/index.ts"],
        },
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts"],
      exclude: ["node_modules"],
    },
    null,
    2,
  )}\n`,
  "src/app/layout.tsx": `import type { Metadata } from "next"
import type { ReactNode } from "react"
import "../kitgrid/styles/kit.css"
import "./globals.css"

export const metadata: Metadata = { title: "kitgrid kit" }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400..700&family=Geist+Mono:wght@400..600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
`,
  "src/app/globals.css": `body {
  margin: 0;
  background: var(--kg-bg);
  color: var(--kg-fg);
  font-family: var(--kg-font-sans);
}

.kit {
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
}

.kit-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.kit-head h1 {
  margin: 0;
  font-size: 1.25rem;
}

.kit-item {
  margin-top: 1rem;
  border: 1px solid var(--kg-border);
  border-radius: var(--kg-radius-lg);
  background: var(--kg-surface);
}

.kit-item h2 {
  margin: 0;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--kg-border);
  font-size: 0.875rem;
  font-weight: 600;
}

.kit-stage {
  display: grid;
  place-items: center;
  min-height: 16rem;
  padding: 2rem;
  overflow: auto;
}

.kit-error {
  color: var(--kg-fg-muted);
  font-size: 0.875rem;
}
`,
}

const page = (examples: { id: string; name: string; label: string }[]) => `"use client"

import { TooltipProvider } from "kitgrid"
import { Component, type ReactNode, useState } from "react"
${examples.map((e) => `import ${e.name} from "../examples/${e.name}"`).join("\n")}

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? <p className="kit-error">This example needs a closer look.</p> : this.props.children
  }
}

const examples = [
${examples.map((e) => `  { id: ${JSON.stringify(e.id)}, label: ${JSON.stringify(e.label)}, View: ${e.name} },`).join("\n")}
]

export default function Page() {
  const [dark, setDark] = useState(false)
  return (
    <TooltipProvider>
      <div className="kit" data-theme={dark ? "dark" : "light"}>
        <header className="kit-head">
          <h1>kitgrid kit</h1>
          <button type="button" onClick={() => setDark((value) => !value)}>
            {dark ? "Light" : "Dark"}
          </button>
        </header>
        {examples.map(({ id, label, View }) => (
          <section key={id} id={id} className="kit-item">
            <h2>{label}</h2>
            <div className="kit-stage">
              <Boundary>
                <View />
              </Boundary>
            </div>
          </section>
        ))}
      </div>
    </TooltipProvider>
  )
}
`

export const kitFiles = async (selected: Demo[]) => {
  await ready()
  const [library, charts, icons, react, { map, types, chartTypes }] = await Promise.all([
    import("kitgrid"),
    import("kitgrid/charts"),
    import("lucide-react"),
    import("react"),
    exportMap(),
  ])
  const universe: Universe = {
    library: new Set(Object.keys(library)),
    charts: new Set(Object.keys(charts)),
    icons: new Set(Object.keys(icons)),
    react: new Set(Object.keys(react)),
    types,
    chartTypes,
  }

  const files: Record<string, string> = { ...STATIC }
  const examples = selected.map((demo) => ({ demo, ...source(demo, universe) }))
  const used = (from: string) => examples.some((e) => (e.uses[from]?.size ?? 0) > 0)
  const usesCharts =
    used("kitgrid/charts") || selected.some((demo) => demo.importFrom === "kitgrid/charts")
  const usesIcons = used("lucide-react")

  const folders = new Set<string>()
  for (const demo of selected) if (paths.has(`components/${demo.id}/index.ts`)) folders.add(demo.id)
  for (const e of examples)
    for (const name of e.uses.kitgrid ?? []) {
      const folder = map.get(name)
      if (folder) folders.add(folder)
    }

  const roots = [...SHARED, ...[...folders].map((f) => `components/${f}/index.ts`)]
  if (usesCharts) roots.push("charts/index.ts", "charts/charts.css")
  const included = await closure(roots)
  for (const path of ["styles/tokens.css", "styles/base.css"]) included.add(path)

  // Turbopack does not map `./x.js` to `./x.ts` reliably, so relative specifiers lose the suffix.
  const unsuffixed = (text: string) =>
    text.replace(/((?:from|import)\s*\(?\s*["']\.{1,2}\/[^"']+)\.js(["'])/g, "$1$2")
  for (const path of included)
    files[`src/kitgrid/${path}`] = path.endsWith(".css") ? await load(path) : unsuffixed(await load(path))

  const componentFolders = [...included]
    .map((p) => p.match(/^components\/([\w-]+)\/index\.ts$/)?.[1])
    .filter((f): f is string => !!f)
    .sort()
  files["src/kitgrid/index.ts"] = [
    ...componentFolders.map((f) => `export * from "./components/${f}/index"`),
    `export * from "./hooks/index"`,
    `export * from "./utils/index"`,
    `export { Layer, type LayerProps } from "./primitives/layer"`,
    `export { Slot, type SlotProps } from "./primitives/slot"`,
    `export { KitgridProvider, type KitgridProviderProps } from "./provider/kitgrid-provider"`,
    "",
  ].join("\n")

  const sheets = [...included].filter((p) => p.startsWith("components/") && p.endsWith(".css")).sort()
  files["src/kitgrid/styles/kit.css"] = [
    "@layer kg.tokens, kg.base, kg.components;",
    "",
    `@import "./tokens.css";`,
    `@import "./base.css";`,
    ...sheets.map((p) => `@import "../${p}";`),
    ...(usesCharts ? [`@import "../charts/charts.css";`] : []),
    "",
  ].join("\n")

  for (const e of examples) files[`src/examples/${e.name}.tsx`] = e.text
  files["src/app/page.tsx"] = page(examples.map((e) => ({ id: e.demo.id, name: e.name, label: e.demo.name })))

  files["package.json"] = `${JSON.stringify(
    {
      name: "kitgrid-kit",
      private: true,
      version: "0.1.0",
      scripts: { dev: "next dev", build: "next build", start: "next start", typecheck: "tsc --noEmit" },
      dependencies: {
        ...(usesCharts ? { echarts: "^6.1.0" } : {}),
        ...(usesIcons ? { "lucide-react": "^1.61.0" } : {}),
        next: "16.4.3",
        react: "^19.3.0",
        "react-dom": "^19.3.0",
      },
      devDependencies: {
        "@types/node": "^24.19.2",
        "@types/react": "^19.3.0",
        "@types/react-dom": "^19.3.0",
        typescript: "^5.9.3",
      },
    },
    null,
    2,
  )}\n`

  files["README.md"] = `# kitgrid kit

${selected.length} component${selected.length === 1 ? "" : "s"}: ${selected.map((d) => d.name).join(", ")}.

\`\`\`bash
npm install
npm run dev        # http://localhost:3000
\`\`\`

A Next.js App Router project.

- \`src/app/page.tsx\`: renders every example.
- \`src/examples\`: one file per component, the same code the playground shows.
- \`src/kitgrid\`: the library source these components need. You own it; edit freely.
- \`import { … } from "kitgrid"\` resolves to \`src/kitgrid\` through \`paths\` in \`tsconfig.json\`, so switching to the npm package later is a one-line change.
- Change \`--kg-accent\` in \`src/app/globals.css\` to rebrand.
`
  return files
}

export const downloadKit = async (selected: Demo[]) => {
  const files = await kitFiles(selected)
  save(
    zip(Object.fromEntries(Object.entries(files).map(([p, c]) => [`kitgrid-kit/${p}`, c]))),
    "kitgrid-kit.zip",
  )
}
