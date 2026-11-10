import { Kbd } from "kitgrid"
import { CornerDownLeft, LayoutGrid, Palette, Search, ShoppingBag } from "lucide-react"
import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useRouter } from "next/navigation"
import { categoryIndex, demos } from "@/features/demos/catalog"
import { href } from "@/lib/router"

interface Result {
  id: string
  label: string
  meta: string
  to: string
  icon?: ReactNode
}

const pages: Result[] = [
  {
    id: "page-gallery",
    label: "Browse all components",
    meta: "Gallery",
    to: href({ page: "gallery" }),
    icon: <LayoutGrid aria-hidden />,
  },
  {
    id: "page-theming",
    label: "Theming studio",
    meta: "Guide",
    to: href({ page: "theming" }),
    icon: <Palette aria-hidden />,
  },
  {
    id: "page-storefront",
    label: "Storefront demo",
    meta: "Guide",
    to: href({ page: "storefront" }),
    icon: <ShoppingBag aria-hidden />,
  },
]

const componentResults: (Result & { haystack: string })[] = demos.map((demo) => ({
  id: demo.id,
  label: demo.name,
  meta: `${categoryIndex(demo.category)} ${demo.category}`,
  to: href({ page: "component", id: demo.id }),
  haystack:
    `${demo.category} ${demo.description} ${demo.exports.join(" ")}`.toLowerCase(),
}))

export const SearchPalette = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  const router = useRouter()
  const dialog = useRef<HTMLDialogElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)

  useEffect(() => {
    const node = dialog.current
    if (!node) return
    if (open && !node.open) {
      setQuery("")
      setActive(0)
      node.showModal()
    } else if (!open && node.open) node.close()
  }, [open])

  const results = useMemo<Result[]>(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return [...pages, ...componentResults.slice(0, 9)]
    const pageHits = pages.filter((page) => page.label.toLowerCase().includes(needle))
    const hits = componentResults
      .map((result) => {
        const name = result.label.toLowerCase()
        const score = name.startsWith(needle)
          ? 3
          : name.includes(needle)
            ? 2
            : result.haystack.includes(needle)
              ? 1
              : 0
        return { result, score }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.result)
    return [...hits, ...pageHits]
  }, [query])

  useEffect(() => {
    list.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" })
  }, [active])

  const go = (index: number) => {
    const result = results[index]
    if (!result) return
    router.push(result.to)
    onClose()
  }

  const handleKey = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActive((index) => Math.min(index + 1, results.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActive((index) => Math.max(index - 1, 0))
    } else if (event.key === "Enter") {
      event.preventDefault()
      go(active)
    }
  }

  const activeId = results[active] ? `pg-result-${results[active].id}` : undefined

  return (
    <dialog
      ref={dialog}
      className="mx-auto mt-[12vh] max-h-[76vh] w-[min(40rem,calc(100%-2rem))] flex-col overflow-hidden rounded-kg-2xl border-2 border-kg-ink bg-kg-surface p-0 text-kg-fg shadow-kg-lg backdrop:bg-kg-overlay open:flex motion-safe:transition-[opacity,translate] motion-safe:duration-200 motion-safe:ease-kg-out starting:open:translate-y-2 starting:open:opacity-0"
      aria-label="Search"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="flex items-center gap-3 border-b-2 border-kg-ink px-5 [&>svg]:size-5 [&>svg]:shrink-0">
        <Search aria-hidden />
        <input
          autoFocus
          role="combobox"
          aria-expanded="true"
          aria-controls="pg-results"
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          aria-label="Search components and guides"
          className="h-16 min-w-0 flex-1 bg-transparent font-display text-lg font-semibold outline-none placeholder:font-normal placeholder:text-kg-fg-muted"
          placeholder={`Search ${demos.length} components`}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={handleKey}
        />
        <Kbd keys={["esc"]} size="sm" />
      </div>
      <ul
        ref={list}
        id="pg-results"
        role="listbox"
        className="m-0 min-h-0 flex-1 list-none overflow-y-auto overscroll-contain p-2"
        aria-label="Results"
      >
        {results.map((result, index) => (
          <li
            key={result.id}
            id={`pg-result-${result.id}`}
            role="option"
            aria-selected={index === active}
            onPointerMove={() => setActive(index)}
            onClick={() => go(index)}
            className="group flex cursor-pointer items-center gap-3 rounded-kg-lg border-2 border-transparent px-3 py-2 aria-selected:border-kg-ink aria-selected:bg-kg-paper-butter"
          >
            <span
              className="grid size-8 shrink-0 place-items-center rounded-kg-md border-2 border-kg-ink bg-kg-surface font-display font-extrabold [&_svg]:size-4"
              aria-hidden="true"
            >
              {result.icon ?? result.label.slice(0, 1)}
            </span>
            <span className="min-w-0 flex-1 truncate font-semibold">{result.label}</span>
            <small className="shrink-0 text-kg-sm text-kg-fg-muted group-aria-selected:text-kg-fg">
              {result.meta}
            </small>
            <CornerDownLeft
              aria-hidden
              className="size-4 shrink-0 opacity-0 group-aria-selected:opacity-100"
            />
          </li>
        ))}
        {results.length === 0 && (
          <li className="px-4 py-8 text-center text-kg-fg-muted" role="presentation">
            Nothing matches “{query}”. Try a category, like motion or commerce.
          </li>
        )}
      </ul>
      <footer
        className="flex gap-5 border-t-2 border-kg-ink bg-kg-muted px-5 py-2.5 text-kg-sm text-kg-fg-muted [&>span]:flex [&>span]:items-center [&>span]:gap-1.5"
        aria-hidden="true"
      >
        <span>
          <Kbd keys={["up"]} size="sm" />
          <Kbd keys={["down"]} size="sm" /> move
        </span>
        <span>
          <Kbd keys={["enter"]} size="sm" /> open
        </span>
      </footer>
    </dialog>
  )
}
