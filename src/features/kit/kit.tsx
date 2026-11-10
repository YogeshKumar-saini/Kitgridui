"use client"

import { Badge, Button } from "kitgrid"
import { ArrowRight, Download, Link2, Plus, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { demoById } from "@/features/demos/catalog"
import { downloadKit } from "./export"
import { kit, kitLink, useKit } from "./selection"
import type { Demo } from "@/features/demos/registry"
import { href } from "@/lib/router"
import { useCopy } from "@/components/code-block"

export const useDownload = () => {
  const [busy, setBusy] = useState(false)
  const run = async (list: Demo[]) => {
    setBusy(true)
    try {
      await downloadKit(list)
    } finally {
      setBusy(false)
    }
  }
  return { busy, run }
}

const papers = [
  "bg-kg-paper-sage",
  "bg-kg-paper-peach",
  "bg-kg-paper-sky",
  "bg-kg-paper-butter",
]

const Empty = () => (
  <div className="grid justify-items-center gap-6 rounded-kg-2xl border-2 border-dashed border-kg-ink bg-kg-surface px-6 py-14 text-center">
    <div aria-hidden="true" className="relative h-24 w-36">
      {papers.slice(0, 3).map((paper, index) => (
        <span
          key={paper}
          className={`absolute inset-x-4 h-14 rounded-kg-lg border-2 border-kg-ink shadow-kg-sm ${paper}`}
          style={{ top: index * 12, rotate: `${(index - 1) * 6}deg` }}
        />
      ))}
    </div>
    <div className="grid max-w-sm gap-2">
      <h2 className="font-display text-2xl font-extrabold tracking-tight">
        Your kit is empty
      </h2>
      <p className="text-kg-fg-muted text-pretty">
        Add components from the gallery, then download them as one zip.
      </p>
    </div>
    <Button asChild trailing={<ArrowRight />}>
      <Link href={href({ page: "gallery" })}>Browse components</Link>
    </Button>
  </div>
)

export const Kit = ({ ids }: { ids?: string[] }) => {
  const mine = useKit()
  const shared = ids?.length ? ids : undefined
  const list = (shared ?? mine)
    .map((id) => demoById.get(id))
    .filter((demo): demo is Demo => !!demo)
  const { copied, copy } = useCopy(kitLink(list.map((demo) => demo.id)))
  const { busy, run } = useDownload()

  return (
    <div className="mx-auto grid max-w-3xl gap-8">
      <header className="grid gap-5">
        <div className="grid gap-3">
          <h1 className="flex items-baseline gap-3 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
            {shared ? "Shared kit" : "Kit"}
            <span className="rounded-full border-2 border-kg-ink bg-kg-paper-butter px-3 py-0.5 font-mono text-xl font-bold tabular-nums text-kg-fg shadow-kg-xs sm:text-2xl">
              {list.length}
            </span>
          </h1>
          <p className="text-lg text-pretty text-kg-fg-muted">
            {shared
              ? "Someone picked these for you. Download them, or add them to your own kit."
              : "The components you picked, bundled with their styles in one zip."}
          </p>
        </div>
        {list.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <Button leading={<Download />} loading={busy} onClick={() => run(list)}>
              Download zip
            </Button>
            <Button variant="outline" leading={<Link2 />} onClick={copy}>
              <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
            </Button>
            {shared && (
              <Button
                variant="outline"
                leading={<Plus />}
                onClick={() => kit.set([...mine, ...shared])}
              >
                Add to my kit
              </Button>
            )}
          </div>
        )}
      </header>

      {list.length === 0 ? (
        <Empty />
      ) : (
        <ul className="grid gap-3" aria-label="Components in this kit">
          {list.map((demo, index) => (
            <li
              key={demo.id}
              className="group relative flex items-center gap-4 rounded-kg-xl border-2 border-kg-ink bg-kg-surface p-3 pr-3 shadow-kg-sm transition-[translate,box-shadow] duration-(--kg-duration-fast) ease-kg-out focus-within:-translate-px focus-within:shadow-kg-md hover:-translate-px hover:shadow-kg-md motion-reduce:transition-none"
            >
              <span
                aria-hidden="true"
                className={`grid size-11 shrink-0 place-items-center rounded-kg-md border-2 border-kg-ink font-display text-lg font-extrabold ${papers[index % papers.length]}`}
              >
                {demo.name.charAt(0)}
              </span>
              <div className="grid min-w-0 flex-1 gap-0.5">
                <Link
                  href={href({ page: "component", id: demo.id })}
                  className="truncate font-display text-lg font-bold outline-none after:absolute after:inset-0 after:rounded-kg-xl focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-kg-ring"
                >
                  {demo.name}
                </Link>
                <span className="truncate text-sm text-kg-fg-muted">
                  {demo.description}
                </span>
              </div>
              <Badge variant="outline" className="hidden shrink-0 sm:inline-flex">
                {demo.category}
              </Badge>
              {!shared && (
                <button
                  type="button"
                  aria-label={`Remove ${demo.name}`}
                  onClick={() => kit.toggle(demo.id)}
                  className="relative z-10 grid size-9 shrink-0 place-items-center rounded-full text-kg-fg-muted transition-colors duration-(--kg-duration-fast) hover:bg-kg-muted hover:text-kg-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring [&_svg]:size-4"
                >
                  <X aria-hidden />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
