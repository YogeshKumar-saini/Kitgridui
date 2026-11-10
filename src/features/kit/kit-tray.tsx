import { Button } from "kitgrid"
import { ArrowRight, Check, Download, Plus, X } from "lucide-react"
import Link from "next/link"
import { demoById } from "@/features/demos/catalog"
import { kit, useKit } from "./selection"
import { useDownload } from "./kit"
import type { Demo } from "@/features/demos/registry"
import { href } from "@/lib/router"

const round =
  "grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-(--kg-duration-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring [&_svg]:size-4"

export const KitTray = () => {
  const ids = useKit()
  const { busy, run } = useDownload()
  if (!ids.length) return null
  const list = ids.map((id) => demoById.get(id)).filter((demo): demo is Demo => !!demo)
  return (
    <div
      role="region"
      aria-label="Your kit"
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center transition-[opacity,translate] duration-(--kg-duration-base) ease-kg-out starting:translate-y-4 starting:opacity-0 gap-1.5 rounded-full border-2 border-kg-ink bg-kg-surface py-1.5 pr-1.5 pl-2 text-kg-fg shadow-kg-md"
    >
      <span
        aria-hidden="true"
        className="grid h-9 min-w-9 place-items-center rounded-full bg-kg-accent px-2 font-mono text-sm font-bold tabular-nums text-kg-accent-fg"
      >
        {list.length}
      </span>
      <span className="pr-1 pl-0.5 text-sm font-semibold whitespace-nowrap">
        <span className="sr-only">{list.length} </span>in your kit
      </span>
      <Button size="sm" leading={<Download />} loading={busy} onClick={() => run(list)}>
        Download
      </Button>
      <Link
        href={href({ page: "kit" })}
        aria-label="View kit"
        className={`${round} hover:bg-kg-muted sm:w-auto sm:gap-1 sm:px-3 sm:text-sm sm:font-semibold sm:flex sm:items-center`}
      >
        <span className="hidden sm:inline">View</span>
        <ArrowRight aria-hidden />
      </Link>
      <button
        type="button"
        aria-label="Clear kit"
        onClick={kit.clear}
        className={`${round} text-kg-fg-muted hover:bg-kg-muted hover:text-kg-fg`}
      >
        <X aria-hidden />
      </button>
    </div>
  )
}

export const KitButton = ({ id }: { id: string }) => {
  const on = useKit().includes(id)
  return (
    <Button
      variant={on ? "soft" : "outline"}
      size="sm"
      aria-pressed={on}
      leading={on ? <Check /> : <Plus />}
      onClick={() => kit.toggle(id)}
    >
      {on ? "In kit" : "Add to kit"}
    </Button>
  )
}

export const KitToggle = ({ id, className }: { id: string; className?: string }) => {
  const on = useKit().includes(id)
  return (
    <button
      type="button"
      className={
        className ??
        "group relative z-[6] grid size-8 shrink-0 place-items-center rounded-kg-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-kg-ring"
      }
      aria-pressed={on}
      aria-label={on ? "Remove from kit" : "Add to kit"}
      title={on ? "Remove from kit" : "Add to kit"}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        kit.toggle(id)
      }}
    >
      <span
        aria-hidden
        className="grid size-5 place-items-center rounded-md border-2 border-kg-ink bg-kg-surface text-kg-accent-fg transition-[background-color,box-shadow,translate] duration-(--kg-duration-fast) ease-kg-out group-hover:-translate-px group-hover:shadow-kg-xs group-aria-pressed:bg-kg-accent [&_svg]:size-3.5 [&_svg]:opacity-0 group-aria-pressed:[&_svg]:opacity-100"
      >
        <Check strokeWidth={3} />
      </span>
    </button>
  )
}
