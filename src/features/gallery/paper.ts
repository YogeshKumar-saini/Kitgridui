import { activeCategories } from "@/features/demos/catalog"
import type { Category } from "@/features/demos/registry"

const papers = [
  { bg: "bg-kg-paper-sage", tone: "sage" },
  { bg: "bg-kg-paper-peach", tone: "peach" },
  { bg: "bg-kg-paper-sky", tone: "sky" },
  { bg: "bg-kg-paper-butter", tone: "butter" },
  { bg: "bg-kg-paper-rose", tone: "rose" },
] as const

/** Each category keeps one paper colour, cycled by its position in the catalogue. */
export const paperFor = (category: Category) =>
  papers[Math.max(0, activeCategories.indexOf(category)) % papers.length] ?? papers[0]

export const sheet = "rounded-kg-xl border-2 border-kg-ink"

export const lift =
  "transition-[translate,box-shadow] duration-(--kg-duration-fast) ease-kg-out hover:-translate-px hover:shadow-kg-md active:translate-0 active:shadow-kg-xs motion-reduce:transition-none"
