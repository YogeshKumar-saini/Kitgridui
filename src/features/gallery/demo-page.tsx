import { Badge } from "kitgrid"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  Minimize2,
  Server,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { categorySlug, demos } from "@/features/demos/catalog"
import { type Demo, defaultValues } from "@/features/demos/registry"
import { href } from "@/lib/router"
import { CodeBlock, InstallStrip } from "@/components/code-block"
import { KitButton } from "@/features/kit/kit-tray"
import { AccessSheet, proofFor } from "./access"
import { Controls } from "./controls"
import { Fan } from "./fan"
import { lift, paperFor, sheet } from "./paper"
import { MotionTools, Stage, StageModeSwitch, ToolButton, useStage } from "./stage"

/** Non-default prop values, serialised for `?full&props=` links. */
export const encodeProps = (
  values: Record<string, unknown>,
  defaults: Record<string, unknown>,
) => {
  const changed = Object.fromEntries(
    Object.entries(values).filter(([key, value]) => value !== defaults[key]),
  )
  return Object.keys(changed).length > 0 ? JSON.stringify(changed) : undefined
}

export const decodeProps = (raw: string | undefined): Record<string, unknown> => {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as unknown
    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, unknown>)
      : {}
  } catch {
    return {}
  }
}

const useFullscreen = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  useEffect(() => {
    const sync = () => setActive(document.fullscreenElement === ref.current)
    document.addEventListener("fullscreenchange", sync)
    return () => document.removeEventListener("fullscreenchange", sync)
  }, [])
  const toggle = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void ref.current?.requestFullscreen?.()
  }
  return { ref, active, toggle }
}

const toolbar = "flex flex-wrap items-center gap-1"
const divider = (
  <span className="mx-1 h-5 w-0.5 rounded-full bg-kg-border" aria-hidden="true" />
)
const sheetHead =
  "flex min-h-14 flex-wrap items-center gap-x-4 gap-y-2 border-b-2 border-kg-ink py-2 pr-2 pl-5"
const sheetTitle = "font-display text-xl font-extrabold tracking-tight"

const Example = ({
  demo,
  example,
}: {
  demo: Demo
  example: NonNullable<Demo["examples"]>[number]
}) => {
  const stage = useStage()
  return (
    <div className={`${sheet} overflow-hidden bg-kg-surface shadow-kg-sm`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-kg-ink py-1.5 pr-2 pl-5">
        <h3 className="font-display text-lg font-bold">{example.name}</h3>
        <div className={toolbar}>
          <StageModeSwitch stage={stage} />
          <MotionTools stage={stage} />
        </div>
      </div>
      <div className="grid gap-3 p-3 sm:p-4 lg:grid-cols-2">
        <div className="grid min-w-0 overflow-hidden rounded-kg-lg border-2 border-kg-ink">
          <Stage stage={stage} layout={demo.layout}>
            {example.render()}
          </Stage>
        </div>
        <CodeBlock code={example.code} compact />
      </div>
    </div>
  )
}

const PagerLink = ({ demo, rel }: { demo: Demo; rel: "prev" | "next" }) => (
  <Link
    href={href({ page: "component", id: demo.id })}
    rel={rel}
    className={`${sheet} ${lift} flex items-center gap-4 bg-kg-surface px-5 py-4 shadow-kg-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kg-ring [&>svg]:size-5 [&>svg]:shrink-0 ${rel === "next" ? "justify-end text-right sm:col-start-2" : ""}`}
  >
    {rel === "prev" && <ArrowLeft aria-hidden />}
    <span className="grid min-w-0">
      <span className="text-kg-sm font-semibold text-kg-fg-muted">
        {rel === "prev" ? "Previous" : "Next"}
      </span>
      <span className="truncate font-display text-lg font-extrabold">{demo.name}</span>
    </span>
    {rel === "next" && <ArrowRight aria-hidden />}
  </Link>
)

export const DemoPage = ({ demo }: { demo: Demo }) => {
  const defaults = useMemo(() => defaultValues(demo), [demo])
  const [values, setValues] = useState<Record<string, unknown>>(defaults)
  const stage = useStage()
  const fullscreen = useFullscreen()
  const index = demos.indexOf(demo)
  const previous = demos[index - 1]
  const next = demos[index + 1]
  const code = demo.code(values as never)
  const hasControls = Object.keys(demo.controls ?? {}).length > 0
  const standalone = href({
    page: "component",
    id: demo.id,
    full: true,
    props: encodeProps(values, defaults),
  })

  const preview = (
    <div
      ref={fullscreen.ref}
      className="flex min-h-full flex-col rounded-[inherit] [&:fullscreen]:overflow-auto [&:fullscreen]:rounded-none [&:fullscreen]:bg-kg-surface"
    >
      <div className={sheetHead}>
        <h2 className={sheetTitle}>Preview</h2>
        <div
          className={`${toolbar} ml-auto`}
          role="toolbar"
          aria-label="Preview options"
        >
          <StageModeSwitch stage={stage} />
          {divider}
          <MotionTools stage={stage} />
          <ToolButton
            label={fullscreen.active ? "Exit full screen" : "Full screen"}
            icon={
              fullscreen.active ? <Minimize2 aria-hidden /> : <Maximize2 aria-hidden />
            }
            onClick={fullscreen.toggle}
          />
          <ToolButton
            label="Open in new tab"
            icon={<ArrowUpRight aria-hidden />}
            onClick={() => window.open(standalone, "_blank", "noopener")}
          />
        </div>
      </div>
      <div
        className={`grid flex-1 gap-3 p-3 sm:gap-4 sm:p-4 ${hasControls ? "lg:grid-cols-[minmax(0,1fr)_19rem]" : ""}`}
      >
        <div className="grid min-w-0 overflow-hidden rounded-kg-xl border-2 border-kg-ink">
          <Stage stage={stage} layout={demo.layout} height={demo.height}>
            {demo.render(values as never)}
          </Stage>
        </div>
        {hasControls && (
          <Controls
            controls={demo.controls ?? {}}
            values={values}
            defaults={defaults}
            onChange={(key, value) =>
              setValues((current) => ({ ...current, [key]: value }))
            }
            onReset={() => setValues(defaults)}
          />
        )}
      </div>
    </div>
  )

  return (
    <article>
      <header className="grid gap-6">
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={href({ page: "gallery", category: categorySlug(demo.category) })}
                className={`${paperFor(demo.category).bg} inline-flex h-8 items-center rounded-full border-2 border-kg-ink px-3 text-kg-sm font-semibold transition-[translate,box-shadow] duration-(--kg-duration-fast) ease-kg-out hover:-translate-px hover:shadow-kg-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring motion-reduce:transition-none`}
              >
                {demo.category}
              </Link>
              {demo.serverSafe && (
                <Badge variant="outline" icon={<Server aria-hidden />}>
                  Server-safe
                </Badge>
              )}
              {proofFor(demo.id)?.tailwind && (
                <Badge variant="outline">Tailwind source</Badge>
              )}
            </div>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] font-extrabold tracking-tighter text-balance sm:text-7xl">
              {demo.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-pretty text-kg-fg-muted">
              {demo.description}
            </p>
          </div>
          <KitButton id={demo.id} />
        </div>
        <InstallStrip
          exports={demo.exports}
          from={demo.importFrom}
          peers={demo.peers}
        />
      </header>

      <div className="mt-10">
        <Fan
          label="Component views"
          sheets={[
            {
              id: "preview",
              label: "Preview",
              paper: "bg-kg-surface",
              content: preview,
            },
            {
              id: "code",
              label: "Code",
              paper: "bg-kg-paper-peach",
              content: (
                <>
                  <div className={sheetHead}>
                    <h2 className={sheetTitle}>Code</h2>
                    <p className="text-kg-sm font-medium">
                      Follows the props you set in Preview.
                    </p>
                  </div>
                  <div className="p-3 sm:p-4">
                    <CodeBlock code={code} title={`${demo.id}.tsx`} />
                  </div>
                </>
              ),
            },
            {
              id: "access",
              label: "Access",
              paper: "bg-kg-paper-sky",
              content: (
                <>
                  <div className={sheetHead}>
                    <h2 className={sheetTitle}>Access</h2>
                    <p className="text-kg-sm font-medium">
                      Numbers generated from the source.
                    </p>
                  </div>
                  <AccessSheet demo={demo} />
                </>
              ),
            },
          ]}
        />
      </div>

      {demo.examples && demo.examples.length > 0 && (
        <section className="mt-16 grid gap-6" aria-labelledby="examples">
          <h2
            id="examples"
            className="flex items-baseline gap-3 font-display text-3xl font-extrabold tracking-tight"
          >
            Examples
            <span className="font-sans text-lg font-semibold text-kg-fg-muted tabular-nums">
              {demo.examples.length}
            </span>
          </h2>
          {demo.examples.map((example) => (
            <Example key={example.name} demo={demo} example={example} />
          ))}
        </section>
      )}

      <nav className="mt-16 grid gap-4 sm:grid-cols-2" aria-label="Component pages">
        {previous && <PagerLink demo={previous} rel="prev" />}
        {next && <PagerLink demo={next} rel="next" />}
      </nav>
    </article>
  )
}

/** `/components/<id>?full`: the preview alone, edge to edge, for demos and screenshots. */
export const FullPreview = ({ demo, props }: { demo: Demo; props?: string }) => {
  const values = useMemo(
    () => ({ ...defaultValues(demo), ...decodeProps(props) }),
    [demo, props],
  )
  const stage = useStage()
  return (
    <div className="grid min-h-dvh [&>:first-child]:min-h-dvh">
      <Stage stage={stage} layout={demo.layout}>
        {demo.render(values as never)}
      </Stage>
      <div className="fixed bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border-2 border-kg-ink bg-kg-surface p-1 shadow-kg-md">
        <Link
          href={href({ page: "component", id: demo.id })}
          className="inline-flex h-8 items-center gap-1.5 rounded-full pr-3 pl-2 text-kg-sm font-semibold hover:bg-kg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring [&_svg]:size-4"
        >
          <ArrowLeft aria-hidden />
          <span>{demo.name}</span>
        </Link>
        {divider}
        <StageModeSwitch stage={stage} />
        <MotionTools stage={stage} />
      </div>
    </div>
  )
}
