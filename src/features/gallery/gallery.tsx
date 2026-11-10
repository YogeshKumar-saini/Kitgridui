"use client"

import { Button, Input } from "kitgrid"
import { Search } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import {
  activeCategories,
  categoryFromSlug,
  categorySlug,
  countFor,
  demos,
  isFeatured,
} from "@/features/demos/catalog"
import type { Category, Demo } from "@/features/demos/registry"
import { href, useReplaceRoute } from "@/lib/router"
import { KitToggle } from "@/features/kit/kit-tray"
import { lift, paperFor, sheet } from "./paper"
import { LiveThumb } from "./thumbnail"

const kitToggle =
  "relative z-10 grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-kg-fg transition-colors duration-(--kg-duration-fast) hover:bg-kg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring [&>span]:size-4 [&>span]:rounded-[0.3rem] [&>span]:border-2 [&>span]:border-current aria-pressed:[&>span]:bg-kg-accent aria-pressed:[&>span]:border-kg-ink aria-pressed:[&>span]:shadow-[inset_0_0_0_2px_var(--kg-surface)]"

const Tile = ({ demo }: { demo: Demo }) => {
  const featured = isFeatured(demo)
  return (
    <li className={`grid min-w-0 ${featured ? "sm:col-span-2 sm:row-span-2" : ""}`}>
      <article
        className={`${sheet} ${lift} relative grid min-w-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden bg-kg-surface shadow-kg-sm has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-kg-ring`}
      >
        <LiveThumb
          demo={demo}
          base={featured ? 720 : 440}
          className={`border-b-2 border-kg-ink ${paperFor(demo.category).bg}`}
        />
        <div className="flex min-w-0 items-center justify-between gap-2 py-1.5 pr-1.5 pl-4">
          <h3 className="min-w-0 truncate font-bold">
            <Link
              className="outline-0 after:absolute after:inset-0 after:z-[5]"
              href={href({ page: "component", id: demo.id })}
            >
              {demo.name}
            </Link>
          </h3>
          <KitToggle id={demo.id} className={kitToggle} />
        </div>
      </article>
    </li>
  )
}

const Section = ({ category, items }: { category: Category; items: Demo[] }) => {
  const titleId = `gallery-${categorySlug(category)}`
  return (
    <section className="mt-12 first-of-type:mt-8" aria-labelledby={titleId}>
      <h2
        id={titleId}
        className="mb-4 flex items-center gap-3 font-display text-2xl font-extrabold tracking-tight"
      >
        <span
          aria-hidden="true"
          className={`size-4 rounded-full border-2 border-kg-ink ${paperFor(category).bg}`}
        />
        {category}
        <span className="font-sans text-base font-semibold text-kg-fg-muted tabular-nums">
          {items.length}
        </span>
      </h2>
      <ul className="m-0 grid list-none grid-flow-dense auto-rows-[13.5rem] grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-5 p-0">
        {items.map((demo) => (
          <Tile key={demo.id} demo={demo} />
        ))}
      </ul>
    </section>
  )
}

const chip =
  "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border-2 border-kg-ink px-3.5 text-kg-sm font-semibold text-kg-fg transition-[translate,box-shadow] duration-(--kg-duration-fast) ease-kg-out hover:-translate-px hover:shadow-kg-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring aria-pressed:bg-kg-accent aria-pressed:text-kg-accent-fg aria-pressed:shadow-kg-xs motion-reduce:transition-none"

export const Gallery = ({ category: slug }: { category?: string }) => {
  const replaceRoute = useReplaceRoute()
  const active = categoryFromSlug(slug)
  const [query, setQuery] = useState("")
  const needle = query.trim().toLowerCase()

  const matches = (demo: Demo) =>
    !needle ||
    demo.name.toLowerCase().includes(needle) ||
    demo.description.toLowerCase().includes(needle) ||
    demo.exports.some((name) => name.toLowerCase().includes(needle))

  const sections = (active ? [active] : activeCategories)
    .map((category) => ({
      category,
      items: demos.filter((demo) => demo.category === category && matches(demo)),
    }))
    .filter((section) => section.items.length > 0)
  const shown = sections.reduce((total, section) => total + section.items.length, 0)

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div>
          <h1 className="font-display text-5xl leading-none font-extrabold tracking-tighter sm:text-6xl">
            Components
          </h1>
          <p className="mt-3 text-lg text-kg-fg-muted">
            {demos.length} live, accessible pieces. Pick one up and use it.
          </p>
        </div>
        <Input
          className="w-full sm:w-80"
          leading={<Search />}
          placeholder="Filter by name or export"
          aria-label="Filter components"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={query ? () => setQuery("") : undefined}
        />
      </header>

      <div
        role="group"
        aria-label="Category"
        className="mt-6 flex flex-wrap gap-2 max-sm:-mx-3 max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:px-3 max-sm:pt-0.5 max-sm:pb-2 max-sm:[scrollbar-width:none]"
      >
        <button
          type="button"
          className={`${chip} bg-kg-surface`}
          aria-pressed={!active}
          onClick={() => replaceRoute({ page: "gallery" })}
        >
          All
          <span className="tabular-nums opacity-80">{demos.length}</span>
        </button>
        {activeCategories.map((category) => (
          <button
            key={category}
            type="button"
            className={`${chip} ${paperFor(category).bg}`}
            aria-pressed={active === category}
            onClick={() =>
              replaceRoute({
                page: "gallery",
                category: active === category ? undefined : categorySlug(category),
              })
            }
          >
            {category}
            <span className="tabular-nums opacity-80">{countFor(category)}</span>
          </button>
        ))}
      </div>

      <p
        className="mt-4 text-kg-sm font-semibold text-kg-fg-muted empty:mt-0"
        aria-live="polite"
      >
        {shown === demos.length ? "" : `Showing ${shown} of ${demos.length}`}
      </p>

      {sections.map((section) => (
        <Section key={section.category} {...section} />
      ))}

      {sections.length === 0 && (
        <div
          className={`${sheet} mt-8 flex flex-col items-start gap-4 bg-kg-paper-butter p-8 shadow-kg-sm`}
        >
          <p className="font-display text-xl font-bold">
            Nothing matches “{query}”{active ? ` in ${active}` : ""}.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setQuery("")
              replaceRoute({ page: "gallery" })
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
