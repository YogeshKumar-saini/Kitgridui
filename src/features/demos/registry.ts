import type { ReactNode } from "react"

export const categories = [
  "Signature",
  "Charts",
  "Dashboard",
  "App Shell",
  "Assistant",
  "Actions",
  "Forms",
  "Overlays",
  "Navigation",
  "Data Display",
  "Feedback",
  "Text Effects",
  "Motion",
  "Backgrounds",
  "Commerce",
] as const

export type Category = (typeof categories)[number]

export type Control =
  | { type: "select"; options: readonly string[]; default: string; label?: string }
  | { type: "boolean"; default: boolean; label?: string }
  | {
      type: "number"
      min: number
      max: number
      step?: number
      default: number
      label?: string
    }
  | { type: "text"; default: string; label?: string }
  | { type: "color"; default: string; label?: string }

type ControlValue<C> = C extends { type: "boolean" }
  ? boolean
  : C extends { type: "number" }
    ? number
    : C extends { type: "select"; options: readonly (infer O)[] }
      ? O
      : string

export type Values<C extends Record<string, Control>> = {
  [K in keyof C]: ControlValue<C[K]>
}

export interface Example {
  name: string
  render: () => ReactNode
  code: string
}

export interface Demo<C extends Record<string, Control> = Record<string, Control>> {
  /** URL slug, matching the library folder name: `/components/<id>`. */
  id: string
  name: string
  category: Category
  description: string
  /** Named exports this demo documents, shown in the import line. */
  exports: string[]
  /** Entry the exports come from, `kitgrid` by default. */
  importFrom?: string
  /** Peer packages installed alongside, such as `echarts` for the charts entry. */
  peers?: readonly string[]
  controls?: C
  render: (values: Values<C>) => ReactNode
  code: (values: Values<C>) => string
  examples?: Example[]
  /** `center` (default) centres the preview; `fill` lets it span the frame edge to edge. */
  layout?: "center" | "fill"
  /** Preview frame height, in px. */
  height?: number
  /** Keyboard and screen-reader behaviour, shown under the preview. */
  accessibility?: string[]
  /** Marks components that the library ships as RSC-safe (no "use client"). */
  serverSafe?: boolean
  /**
   * A purpose-built preview for the gallery at `/components`. Rendered small, inert and
   * non-interactive. Falls back to `render(defaultValues)` when omitted.
   */
  thumbnail?: () => ReactNode
  /** Gives the demo a large tile in the gallery. Signature demos are featured by default. */
  featured?: boolean
}

export const defineDemo = <
  const C extends Record<string, Control> = Record<string, never>,
>(
  demo: Demo<C>,
): Demo => demo as unknown as Demo

export const defaultValues = (demo: Demo): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(demo.controls ?? {}).map(([key, control]) => [key, control.default]),
  )

const RAW = Symbol("raw")

/** A prop value printed verbatim as a JSX expression: `raw("<Heart />")` → `icon={<Heart />}`. */
export const raw = (expression: string) => ({ [RAW]: expression })

const formatProp = (key: string, value: unknown): string | null => {
  if (value === undefined || value === null) return null
  if (typeof value === "object" && RAW in value) return `${key}={${String(value[RAW])}}`
  if (value === false) return null
  if (value === true) return key
  if (typeof value === "string") return `${key}="${value}"`
  return `${key}={${JSON.stringify(value)}}`
}

/**
 * Builds a JSX snippet, dropping any prop whose value equals its default so the code shown is
 * what someone would actually write.
 */
export const jsx = (
  name: string,
  props: Record<string, unknown>,
  children?: string,
  defaults: Record<string, unknown> = {},
): string => {
  const attrs = Object.entries(props)
    .filter(([key, value]) => !(key in defaults && defaults[key] === value))
    .map(([key, value]) => formatProp(key, value))
    .filter((attr): attr is string => attr !== null)
  const open =
    attrs.length > 2
      ? `<${name}\n  ${attrs.join("\n  ")}\n`
      : `<${name}${attrs.map((a) => ` ${a}`).join("")}`
  if (!children) return `${open}${attrs.length > 2 ? "" : " "}/>`
  const indented = children.includes("\n")
    ? `\n${children
        .split("\n")
        .map((line) => `  ${line}`)
        .join("\n")}\n`
    : children
  return `${open}>${indented}</${name}>`
}
