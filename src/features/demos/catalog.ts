// Kept apart from registry.ts: demo modules import the registry, so loading them from it would
// form a cycle that evaluates every demo before the helpers they call exist.
import * as m0 from "./actions"
import * as m1 from "./app-plus"
import * as m2 from "./app-shell"
import * as m3 from "./assistant"
import * as m4 from "./backgrounds"
import * as m5 from "./backgrounds-plus"
import * as m6 from "./charts"
import * as m7 from "./commerce-atoms"
import * as m8 from "./commerce-blocks"
import * as m9 from "./commerce-plus"
import * as m10 from "./dashboard"
import * as m11 from "./data-plus"
import * as m12 from "./display"
import * as m13 from "./feedback"
import * as m14 from "./forms"
import * as m15 from "./forms-plus"
import * as m16 from "./layout"
import * as m17 from "./motion"
import * as m18 from "./motion-plus"
import * as m19 from "./navigation"
import * as m20 from "./overlays"
import * as m21 from "./overlays-plus"
import * as m22 from "./price"
import * as m23 from "./signature-commerce"
import * as m24 from "./signature-materials"
import * as m25 from "./spotlight-card"
import * as m26 from "./text-effects"
import { type Category, categories, type Demo } from "./registry"

type DemoModule = { demos?: Demo[] }

const modules: DemoModule[] = [m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15, m16, m17, m18, m19, m20, m21, m22, m23, m24, m25, m26]

export const demos: Demo[] = modules
  .flatMap((module) => module.demos ?? [])
  .sort(
    (a, b) =>
      categories.indexOf(a.category) - categories.indexOf(b.category) ||
      a.name.localeCompare(b.name),
  )

export const demoById = new Map(demos.map((demo) => [demo.id, demo]))

/** Categories that currently hold at least one demo, in registry order. */
export const activeCategories: Category[] = categories.filter((category) =>
  demos.some((demo) => demo.category === category),
)

export const countFor = (category: Category) =>
  demos.filter((demo) => demo.category === category).length

export const categorySlug = (category: Category) =>
  category.toLowerCase().replace(/\s+/g, "-")

export const categoryFromSlug = (slug: string | undefined): Category | undefined =>
  slug ? categories.find((category) => categorySlug(category) === slug) : undefined

/** Two-digit catalogue index, e.g. `03`, used as a quiet wayfinding label. */
export const categoryIndex = (category: Category) =>
  String(activeCategories.indexOf(category) + 1).padStart(2, "0")

/**
 * Demos that earn a large gallery tile when they don't say so themselves: the pieces whose
 * motion or composition only reads at size.
 */
const showcase = new Set([
  "tilt-card",
  "aurora",
  "product-card",
  "spotlight-card",
  "text-reveal",
  "dock",
  "hero-spotlight",
  "flip-card",
  "number-ticker",
  "checkout-steps",
])

export const isFeatured = (demo: Demo) =>
  demo.featured ?? (demo.category === "Signature" || showcase.has(demo.id))
