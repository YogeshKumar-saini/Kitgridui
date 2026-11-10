import { SegmentedControl } from "kitgrid"
import { Check, Copy } from "lucide-react"
import { type ReactNode, useEffect, useMemo, useState } from "react"
import { highlight } from "sugar-high"

export const useCopy = (text: string) => {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      // Clipboard can be blocked (insecure origin, permissions); the text stays selectable.
    }
  }
  return { copied, copy }
}

const nightPaper =
  "bg-[oklch(0.22_0.03_175)] text-[oklch(0.95_0.01_170)] [--sh-identifier:oklch(0.95_0.01_170)] [--sh-keyword:oklch(0.82_0.13_60)] [--sh-string:oklch(0.85_0.11_140)] [--sh-class:oklch(0.83_0.09_235)] [--sh-entity:oklch(0.83_0.09_235)] [--sh-property:oklch(0.84_0.04_200)] [--sh-jsxliterals:oklch(0.92_0.01_170)] [--sh-sign:oklch(0.74_0.03_175)] [--sh-comment:oklch(0.7_0.03_175)]"

export const CopyButton = ({
  text,
  label = "Copy code",
  compact,
}: {
  text: string
  label?: string
  /** Icon only, for tight strips. */
  compact?: boolean
}) => {
  const { copied, copy } = useCopy(text)
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full font-semibold text-kg-sm text-current opacity-85 transition-[opacity,background-color] duration-(--kg-duration-fast) hover:bg-[color-mix(in_oklab,currentColor_12%,transparent)] hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring [&_svg]:size-4 ${compact ? "w-8 justify-center" : "px-3"}`}
    >
      {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
      {!compact && <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>}
    </button>
  )
}

export interface CodeBlockProps {
  code: string
  language?: "tsx" | "css" | "bash"
  title?: string
  compact?: boolean
  /** Extra controls rendered in the title bar, before Copy. */
  actions?: ReactNode
}

export const CodeBlock = ({
  code,
  language = "tsx",
  title,
  compact,
  actions,
}: CodeBlockProps) => {
  const html = useMemo(
    () => (language === "bash" ? null : highlight(code)),
    [code, language],
  )
  const numbered = code.split("\n").length > 3
  return (
    <figure
      className={`m-0 min-w-0 overflow-hidden rounded-kg-xl border-2 border-kg-ink shadow-kg-sm ${nightPaper}`}
    >
      <figcaption
        data-theme="dark"
        className="flex min-h-11 items-center gap-2.5 border-b-2 border-[oklch(1_0_0/0.12)] py-1 pr-1.5 pl-4"
      >
        <span className="truncate font-mono text-kg-xs">
          {title ?? `example.${language}`}
        </span>
        <span
          className="rounded-full border border-[oklch(1_0_0/0.25)] px-2 py-px font-mono text-[0.6875rem] uppercase tracking-wider text-[oklch(0.82_0.02_175)]"
          aria-hidden="true"
        >
          {language}
        </span>
        <span className="ml-auto flex items-center gap-1">
          {actions}
          <CopyButton text={code} />
        </span>
      </figcaption>
      <pre
        data-theme="dark"
        tabIndex={0}
        className={`m-0 overflow-auto px-5 pt-4 pb-5 font-mono text-sm leading-7 [counter-reset:line] [scrollbar-color:oklch(1_0_0/0.2)_transparent] [scrollbar-width:thin] [tab-size:2] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-kg-ring ${compact ? "max-h-72" : "max-h-[34rem]"} ${numbered ? "[&_code>span]:before:mr-5 [&_code>span]:before:inline-block [&_code>span]:before:w-[2ch] [&_code>span]:before:text-right [&_code>span]:before:text-[oklch(0.66_0.02_175)] [&_code>span]:before:select-none [&_code>span]:before:[counter-increment:line] [&_code>span]:before:content-[counter(line)]" : ""}`}
      >
        {html ? (
          <code dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <code>{code}</code>
        )}
      </pre>
    </figure>
  )
}

const managers = ["npm", "pnpm", "yarn", "bun"] as const
type Manager = (typeof managers)[number]
const installCommand: Record<Manager, string> = {
  npm: "npm i @yogeshsaini/kitgrid",
  pnpm: "pnpm add @yogeshsaini/kitgrid",
  yarn: "yarn add @yogeshsaini/kitgrid",
  bun: "bun add @yogeshsaini/kitgrid",
}
const PM_KEY = "kg-playground-pm"

const readManager = (): Manager => {
  if (typeof window === "undefined") return "npm"
  try {
    const stored = window.localStorage.getItem(PM_KEY)
    return managers.includes(stored as Manager) ? (stored as Manager) : "npm"
  } catch {
    return "npm"
  }
}

/** Install command and import line, each copyable, with a remembered package manager. */
export const InstallStrip = ({
  exports,
  from = "kitgrid",
  peers = [],
}: {
  exports: string[]
  from?: string
  peers?: readonly string[]
}) => {
  const [manager, setManager] = useState<Manager>(readManager)
  const command = [installCommand[manager], ...peers].join(" ")
  const importLine = `import { ${exports.join(", ")} } from "${from}"`
  return (
    <div
      className={`grid min-w-0 overflow-hidden rounded-kg-xl border-2 border-kg-ink shadow-kg-sm ${nightPaper}`}
    >
      <div
        data-theme="dark"
        className="flex min-w-0 flex-wrap items-center gap-3 py-2 pr-2 pl-2"
      >
        <SegmentedControl
          size="sm"
          aria-label="Package manager"
          options={managers.map((value) => ({ value, label: value }))}
          value={manager}
          onValueChange={(value) => {
            setManager(value)
            try {
              localStorage.setItem(PM_KEY, value)
            } catch {
              // Best-effort.
            }
          }}
        />
        <code className="min-w-48 flex-1 truncate bg-transparent p-0 font-mono text-sm">
          <span aria-hidden="true" className="mr-2 text-[oklch(0.74_0.03_175)]">
            $
          </span>
          {command}
        </code>
        <CopyButton text={command} label="Copy install command" compact />
      </div>
      <div
        data-theme="dark"
        className="flex min-w-0 items-center gap-3 border-t-2 border-[oklch(1_0_0/0.12)] py-2 pr-2 pl-4"
      >
        <code
          className="min-w-0 flex-1 overflow-x-auto bg-transparent p-0 font-mono text-sm whitespace-nowrap"
          dangerouslySetInnerHTML={{ __html: highlight(importLine) }}
        />
        <CopyButton text={importLine} label="Copy import" compact />
      </div>
    </div>
  )
}
