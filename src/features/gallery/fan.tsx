import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from "react"

export interface FanSheet {
  id: string
  label: string
  /** Background class for the sheet and its tab. */
  paper: string
  content: ReactNode
}

const placement = [
  "relative z-30",
  "absolute inset-0 z-20 overflow-hidden max-md:hidden md:translate-x-1.5 md:-rotate-[1.4deg]",
  "absolute inset-0 z-10 overflow-hidden max-md:hidden md:translate-x-3 md:-rotate-[2.8deg]",
]

/**
 * Sheets stacked like a fanned hand of paper: the chosen one lies flat in front, the others tilt
 * out behind it. A real tablist underneath, with roving focus and automatic activation.
 */
export const Fan = ({ label, sheets }: { label: string; sheets: FanSheet[] }) => {
  const base = useId()
  const [order, setOrder] = useState(() => sheets.map((sheet) => sheet.id))
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const front = order[0]

  const choose = (id: string) =>
    setOrder((current) => [id, ...current.filter((other) => other !== id)])

  const handleKey = (event: KeyboardEvent, index: number) => {
    const last = sheets.length - 1
    const target =
      event.key === "ArrowRight"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowLeft"
          ? index === 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : undefined
    if (target === undefined) return
    event.preventDefault()
    const sheet = sheets[target]
    if (!sheet) return
    choose(sheet.id)
    tabs.current[target]?.focus()
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        className="relative z-[1] mb-4 grid grid-cols-3 gap-2 md:mb-10 md:flex md:gap-2.5"
      >
        {sheets.map((sheet, index) => {
          const selected = sheet.id === front
          return (
            <button
              key={sheet.id}
              ref={(node) => {
                tabs.current[index] = node
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${sheet.id}`}
              aria-selected={selected}
              aria-controls={`${base}-panel-${sheet.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => choose(sheet.id)}
              onKeyDown={(event) => handleKey(event, index)}
              className={`${sheet.paper} flex h-11 items-center justify-center gap-2 rounded-full border-2 border-kg-ink px-5 font-display font-bold text-kg-fg transition-[translate,box-shadow] duration-(--kg-duration-fast) ease-kg-out hover:-translate-px hover:shadow-kg-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring aria-selected:-translate-px aria-selected:font-extrabold aria-selected:shadow-kg-sm motion-reduce:transition-none`}
            >
              <span
                aria-hidden="true"
                className={`size-2.5 rounded-full border-2 border-kg-ink ${selected ? "bg-kg-ink" : ""}`}
              />
              {sheet.label}
            </button>
          )
        })}
      </div>

      <div className="relative isolate z-0 grid">
        {sheets.map((sheet) => {
          const position = order.indexOf(sheet.id)
          return (
            <section
              key={sheet.id}
              role="tabpanel"
              id={`${base}-panel-${sheet.id}`}
              aria-labelledby={`${base}-tab-${sheet.id}`}
              inert={position !== 0}
              className={`${sheet.paper} ${placement[position]} min-w-0 origin-bottom-left rounded-kg-2xl border-2 border-kg-ink shadow-kg-md transition-[rotate,translate] duration-300 ease-kg-out motion-reduce:transition-none`}
            >
              {sheet.content}
            </section>
          )
        })}
      </div>
    </div>
  )
}
