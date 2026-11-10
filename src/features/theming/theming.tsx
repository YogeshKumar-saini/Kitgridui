"use client"

import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  IconButton,
  Input,
  Kbd,
  Price,
  Progress,
  ProgressRing,
  Rating,
  SegmentedControl,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tag,
} from "kitgrid"
import { Download, Heart, RotateCcw, Search } from "lucide-react"
import { type ReactNode, useEffect, useState } from "react"
import { CodeBlock } from "@/components/code-block"
import {
  DEFAULT_THEME,
  DENSITIES,
  isDefaultTheme,
  paletteTokens,
  presets,
  RADIUS_MAX,
  themeCss,
  useThemeStudio,
} from "@/lib/theme"

const densityLabels = ["Compact", "Cozy", "Roomy"]
const densities = DENSITIES.map((value, index) => ({
  value: String(value),
  label: densityLabels[index] ?? String(value),
}))

const tokens = [
  { name: "bg", note: "ground" },
  { name: "surface", note: "sheets" },
  { name: "ink", note: "edges, shadows" },
  { name: "accent", note: "fills" },
  { name: "fg-muted", note: "quiet text" },
  { name: "paper-sage", note: "lift" },
]

const sheet = "rounded-kg-xl border-2 border-kg-ink shadow-kg-md"
const label = "text-sm font-bold text-kg-fg"

const download = (css: string) => {
  const url = URL.createObjectURL(new Blob([css], { type: "text/css" }))
  const link = document.createElement("a")
  link.href = url
  link.download = "kitgrid-theme.css"
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

const Sheet = ({
  title,
  children,
  className = "",
}: {
  title: string
  children: ReactNode
  className?: string
}) => (
  <section
    aria-label={title}
    className={`${sheet} grid content-start gap-3 bg-kg-surface p-4 ${className}`}
  >
    {children}
  </section>
)

/** Real components composed into a small shop screen, re-themed live. */
const PreviewBoard = () => {
  const [size, setSize] = useState("M")
  const [threshold, setThreshold] = useState([90])
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Sheet title="Product">
        <div
          aria-hidden="true"
          className="grid aspect-[16/9] place-items-end rounded-kg-lg border-2 border-kg-ink bg-kg-paper-peach p-3 font-mono text-xs font-semibold text-kg-fg"
        >
          SS26 · 04 / 12
        </div>
        <div className="flex items-center justify-between gap-2">
          <Tag tone="accent" size="sm">
            New season
          </Tag>
          <IconButton
            label="Save to wishlist"
            icon={<Heart />}
            variant="ghost"
            size="sm"
          />
        </div>
        <h3 className="font-display text-xl font-extrabold tracking-tight">
          Linen overshirt
        </h3>
        <Rating value={4.6} count={212} size="sm" readOnly />
        <Price amount={68} compareAt={96} size="lg" />
        <SegmentedControl
          size="sm"
          aria-label="Size"
          options={["S", "M", "L", "XL"].map((value) => ({ value, label: value }))}
          value={size}
          onValueChange={setSize}
        />
        <div className="flex flex-wrap gap-2 pt-1">
          <Button>Add to cart</Button>
          <Button variant="outline">Buy now</Button>
        </div>
      </Sheet>

      <div className="grid gap-4">
        <Sheet title="Checkout">
          <h3 className="font-display text-lg font-extrabold">Checkout</h3>
          <Switch
            size="sm"
            label="Email receipts"
            labelPosition="start"
            defaultChecked
          />
          <Switch size="sm" label="Two-step sign in" labelPosition="start" />
          <Checkbox size="sm" label="Gift wrap this order" defaultChecked />
          <div className="grid gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-kg-fg-muted">Free shipping from</span>
              <output className="font-mono font-semibold">${threshold[0]}</output>
            </div>
            <Slider
              size="sm"
              min={40}
              max={150}
              step={5}
              value={threshold}
              onValueChange={setThreshold}
              thumbLabels={["Free shipping threshold"]}
              showValue="never"
            />
          </div>
        </Sheet>

        <Sheet title="Order status">
          <div className="flex items-center gap-3">
            <ProgressRing value={72} size={56} label="Order progress" showValue />
            <div className="grid flex-1 gap-2">
              <h3 className="font-display text-lg font-extrabold">
                Packed, ships today
              </h3>
              <Progress value={72} size="sm" label="Order progress" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">Priority</Badge>
            <Badge tone="success">Paid</Badge>
            <Badge variant="outline">2 items</Badge>
          </div>
        </Sheet>
      </div>

      <Sheet title="Search and tabs" className="sm:col-span-2">
        <Input
          size="sm"
          leading={<Search />}
          trailing={<Kbd keys={["mod", "k"]} separator={null} size="sm" />}
          placeholder="Search the shop"
          aria-label="Search the shop"
        />
        <Tabs defaultValue="details">
          <TabsList variant="underline" aria-label="Product info">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="fit">Fit</TabsTrigger>
            <TabsTrigger value="care">Care</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <p className="pt-2 text-sm text-kg-fg-muted">Washed linen, horn buttons.</p>
          </TabsContent>
          <TabsContent value="fit">
            <p className="pt-2 text-sm text-kg-fg-muted">True to size.</p>
          </TabsContent>
          <TabsContent value="care">
            <p className="pt-2 text-sm text-kg-fg-muted">Wash cold, line dry.</p>
          </TabsContent>
        </Tabs>
        <div className="flex items-center gap-3">
          <Avatar name="Maya Lindqvist" size="sm" />
          <p className="text-sm text-kg-fg-muted">
            "Wore it all summer, still looks new."
          </p>
        </div>
      </Sheet>
    </div>
  )
}

const Group = ({
  id,
  title,
  value,
  children,
}: {
  id: string
  title: string
  value?: ReactNode
  children: ReactNode
}) => (
  <div className="grid gap-2.5">
    <div className="flex items-baseline justify-between">
      <span id={id} className={label}>
        {title}
      </span>
      {value && <output className="font-mono text-sm text-kg-fg-muted">{value}</output>}
    </div>
    {children}
  </div>
)

export const Theming = () => {
  const { settings, update, reset } = useThemeStudio()
  const [mode, setMode] = useState<"light" | "dark">("light")
  // The preview starts in the site's current mode, which only the browser knows.
  useEffect(() => {
    if (document.documentElement.dataset.theme === "dark") setMode("dark")
  }, [])
  const css = themeCss(settings)
  const current = presets.find((preset) => preset.name === settings.palette)

  return (
    <article className="grid gap-12">
      <header className="grid max-w-2xl gap-3">
        <h1 className="font-display text-5xl font-extrabold tracking-tight text-balance sm:text-6xl">
          Theming
        </h1>
        <p className="text-lg text-pretty text-kg-fg-muted">
          Pick an ink and a ground. Every sheet, edge and shadow follows, across the
          whole site.
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[21rem_minmax(0,1fr)]">
        <section
          aria-label="Theme settings"
          className={`${sheet} grid gap-6 bg-kg-surface p-5 lg:sticky lg:top-24`}
        >
          <fieldset className="grid gap-2.5">
            <legend className={`${label} mb-2.5`}>Palette</legend>
            <div className="grid grid-cols-2 gap-2.5">
              {presets.map((preset) => {
                const swatch = paletteTokens(preset, mode)
                const ink = mode === "dark" ? swatch["--kg-accent"] : swatch["--kg-ink"]
                return (
                  <button
                    key={preset.name}
                    type="button"
                    aria-pressed={settings.palette === preset.name}
                    onClick={() => update({ palette: preset.name })}
                    className="group grid gap-2 rounded-kg-lg border-2 border-transparent p-1.5 text-left transition-[border-color,background-color] duration-(--kg-duration-fast) ease-kg-out hover:bg-kg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring aria-pressed:border-kg-ink aria-pressed:bg-kg-surface-sunken"
                  >
                    <span
                      aria-hidden="true"
                      className="relative block h-14 overflow-hidden rounded-kg-md border-2 border-kg-ink"
                      style={{ background: swatch["--kg-bg"] }}
                    >
                      <span
                        className="absolute top-2.5 left-3 h-7 w-12 rounded-md border-2 transition-transform duration-(--kg-duration-base) ease-kg-out group-hover:-translate-y-0.5"
                        style={{
                          borderColor: ink,
                          background:
                            mode === "dark" ? swatch["--kg-surface"] : "white",
                          boxShadow: `3px 3px 0 ${ink}`,
                        }}
                      />
                      <span
                        className="absolute right-3 bottom-2.5 size-4 rounded-full"
                        style={{ background: ink }}
                      />
                    </span>
                    <span className="px-0.5 leading-tight">
                      <span className="block text-sm font-bold">{preset.ink}</span>
                      <span className="block text-xs text-kg-fg-muted">
                        on {preset.ground}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <Group
            id="studio-radius"
            title="Radius"
            value={`${settings.radius.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")}rem`}
          >
            <Slider
              size="sm"
              min={0}
              max={RADIUS_MAX}
              step={0.125}
              value={[settings.radius]}
              thumbLabels={["Radius"]}
              showValue="never"
              onValueChange={([radius]) => update({ radius })}
            />
          </Group>

          <Group id="studio-density" title="Density">
            <SegmentedControl
              size="sm"
              fullWidth
              aria-labelledby="studio-density"
              options={densities}
              value={String(settings.density)}
              onValueChange={(value) => update({ density: Number(value) })}
            />
          </Group>

          <Group id="studio-mode" title="Preview in">
            <SegmentedControl
              size="sm"
              fullWidth
              aria-labelledby="studio-mode"
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
              value={mode}
              onValueChange={(value) => setMode(value as "light" | "dark")}
            />
          </Group>

          <Button
            variant="outline"
            size="sm"
            leading={<RotateCcw />}
            onClick={reset}
            disabled={isDefaultTheme(settings)}
          >
            Reset to {DEFAULT_THEME.palette} on {presets[0]?.ground}
          </Button>
        </section>

        <div
          data-theme={mode}
          className="grid gap-4 rounded-kg-2xl border-2 border-kg-ink bg-kg-bg p-3 text-kg-fg sm:p-5"
        >
          <p className="flex items-center justify-between gap-3 text-sm font-semibold text-kg-fg-muted">
            <span>
              {current?.ink} ink on {current?.ground}, {mode}
            </span>
            <span className="font-mono text-xs">live preview</span>
          </p>
          <PreviewBoard />
          <ul
            aria-label="Palette tokens"
            className="grid grid-cols-2 gap-2 sm:grid-cols-3"
          >
            {tokens.map((token) => (
              <li
                key={token.name}
                className="flex items-center gap-2.5 rounded-kg-lg border-2 border-kg-ink bg-kg-surface p-2 text-xs"
              >
                <span
                  aria-hidden="true"
                  className="size-7 shrink-0 rounded-kg-sm border-2 border-kg-ink"
                  style={{ background: `var(--kg-${token.name})` }}
                />
                <span className="grid min-w-0">
                  <code className="truncate font-mono font-semibold">
                    --kg-{token.name}
                  </code>
                  <span className="text-kg-fg-muted">{token.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section aria-labelledby="export" className="grid gap-4">
        <div className="grid gap-1">
          <h2
            id="export"
            className="font-display text-3xl font-extrabold tracking-tight"
          >
            CSS to paste
          </h2>
          <p className="text-kg-fg-muted">
            This is exactly what the studio applies to this site.
          </p>
        </div>
        <CodeBlock
          code={css}
          language="css"
          title="theme.css"
          actions={
            <button
              type="button"
              onClick={() => download(css)}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-current transition-colors duration-(--kg-duration-fast) hover:bg-current/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring [&_svg]:size-3.5"
            >
              <Download aria-hidden />
              Download
            </button>
          }
        />
      </section>

      <div className="grid items-start gap-6 md:grid-cols-2">
        <section
          aria-labelledby="scoped"
          className={`${sheet} grid content-start gap-3 bg-kg-paper-sky p-5`}
        >
          <h2
            id="scoped"
            className="font-display text-2xl font-extrabold tracking-tight"
          >
            Scoped themes
          </h2>
          <p className="text-kg-fg">
            Add <code className="font-mono text-kg-fg">data-kg-scope</code> to re-theme
            a subtree.
          </p>
          <CodeBlock
            title="clearance.tsx"
            code={`const brick = "oklch(0.29 0.09 35)"\n\n<section\n  data-kg-scope\n  style={{ "--kg-accent": brick, "--kg-ink": brick }}\n>\n  <Button>Clearance</Button>\n</section>`}
          />
        </section>
        <section
          aria-labelledby="dark"
          className={`${sheet} grid content-start gap-3 bg-kg-paper-butter p-5`}
        >
          <h2 id="dark" className="font-display text-2xl font-extrabold tracking-tight">
            Night paper
          </h2>
          <p className="text-kg-fg">
            Set <code className="font-mono text-kg-fg">data-theme="dark"</code> or{" "}
            <code className="font-mono text-kg-fg">"system"</code> on any ancestor. Each
            palette ships its own night ground, derived from the ink.
          </p>
        </section>
      </div>
    </article>
  )
}
