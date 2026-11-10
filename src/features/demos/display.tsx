import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
  EmptyState,
  Kbd,
  Price,
  Separator,
  Stat,
  Tag,
} from "kitgrid"
import { PackageOpen, Plus, Sparkles } from "lucide-react"
import { useState } from "react"
import { defineDemo, jsx, raw } from "./registry"

const team = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra"]

const initialFilters = ["Linen", "Size M", "Under $80"]

const ActiveFilters = () => {
  const [filters, setFilters] = useState(initialFilters)
  return (
    <div className="pg-row" style={{ gap: 8 }}>
      {filters.map((filter) => (
        <Tag
          key={filter}
          tone="accent"
          onRemove={() => setFilters((current) => current.filter((f) => f !== filter))}
        >
          {filter}
        </Tag>
      ))}
      {filters.length === 0 && (
        <Button size="sm" variant="ghost" onClick={() => setFilters(initialFilters)}>
          Reset
        </Button>
      )}
    </div>
  )
}

export const demos = [
  defineDemo({
    id: "badge",
    name: "Badge",
    category: "Data Display",
    description: "Paper chips for status and categories.",
    exports: ["Badge"],
    serverSafe: true,
    controls: {
      tone: {
        type: "select",
        options: ["neutral", "accent", "success", "warning", "danger", "info", "sage", "peach", "sky", "butter", "rose"],
        default: "accent",
      },
      variant: {
        type: "select",
        options: ["soft", "solid", "outline"],
        default: "soft",
      },
      size: { type: "select", options: ["sm", "md"], default: "md" },
      icon: { type: "boolean", default: false },
    },
    render: ({ tone, variant, size, icon }) => (
      <Badge tone={tone} variant={variant} size={size} icon={icon ? <Sparkles /> : undefined}>
        New arrival
      </Badge>
    ),
    code: ({ tone, variant, size, icon }) =>
      `import { Badge } from "kitgrid"${icon ? `\nimport { Sparkles } from "lucide-react"` : ""}\n\n` +
      jsx(
        "Badge",
        { tone, variant, size, icon: icon ? raw("<Sparkles />") : undefined },
        "New arrival",
        { tone: "neutral", variant: "soft", size: "md" },
      ),
    accessibility: [
      "Plain inline text, so the label is read in place with no extra role.",
      "The dot and icon are aria-hidden; the text alone carries the meaning, so color is never the only signal.",
      "The pulse ring is decoration and is removed under reduced motion.",
    ],
  }),
  defineDemo({
    id: "card",
    name: "Card",
    category: "Data Display",
    description: "A composable surface with header, media and footer.",
    exports: [
      "Card",
      "CardHeader",
      "CardTitle",
      "CardDescription",
      "CardContent",
      "CardFooter",
      "CardMedia",
    ],
    serverSafe: true,
    controls: {
      variant: {
        type: "select",
        options: ["elevated", "outline", "ghost", "inset"],
        default: "elevated",
      },
      padding: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      interactive: { type: "boolean", default: true },
      media: { type: "boolean", default: true },
    },
    render: ({ variant, padding, interactive, media }) => (
      <Card variant={variant} padding={padding} interactive={interactive} style={{ width: 280 }}>
        {media && <CardMedia ratio={4 / 3} />}
        <CardHeader>
          <CardTitle>Linen overshirt</CardTitle>
          <CardDescription>Garment-dyed, relaxed fit.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Price amount={89} compareAt={119} />
          <Button size="sm" style={{ marginInlineStart: "auto" }}>
            Add
          </Button>
        </CardFooter>
      </Card>
    ),
    code: ({ variant, padding, interactive, media }) =>
      `import { Button, Card, CardDescription, CardFooter, CardHeader, CardMedia, CardTitle, Price } from "kitgrid"\n\n` +
      jsx(
        "Card",
        { variant, padding, interactive, style: raw("{ width: 280 }") },
        [
          media ? `<CardMedia ratio={4 / 3} />` : "",
          `<CardHeader>\n  <CardTitle>Linen overshirt</CardTitle>\n  <CardDescription>Garment-dyed, relaxed fit.</CardDescription>\n</CardHeader>`,
          `<CardFooter>\n  <Price amount={89} compareAt={119} />\n  <Button size="sm" style={{ marginInlineStart: "auto" }}>\n    Add\n  </Button>\n</CardFooter>`,
        ]
          .filter(Boolean)
          .join("\n"),
        { variant: "elevated", padding: "md" },
      ),
    accessibility: [
      "CardTitle is an <h3> by default; use `as` to match the page outline.",
      "asChild renders your <a> as the card, so the whole surface is a single link with one accessible name, never a nested link.",
      "An empty CardMedia renders a still skeleton surface, so a card without an image keeps its shape.",
    ],
  }),
  defineDemo({
    id: "avatar",
    name: "Avatar",
    category: "Data Display",
    description: "Initials from a name, with status and groups.",
    exports: ["Avatar", "AvatarGroup"],
    controls: {
      name: { type: "text", default: "Ada Lovelace" },
      size: { type: "select", options: ["xs", "sm", "md", "lg", "xl"], default: "lg" },
      shape: { type: "select", options: ["circle", "square"], default: "circle" },
      status: {
        type: "select",
        options: ["none", "online", "away", "busy", "offline"],
        default: "online",
      },
    },
    render: ({ name, size, shape, status }) => (
      <Avatar
        name={name}
        size={size}
        shape={shape}
        status={status === "none" ? undefined : status}
      />
    ),
    code: ({ name, size, shape, status }) =>
      `import { Avatar } from "kitgrid"\n\n` +
      jsx(
        "Avatar",
        { name, size, shape, status: status === "none" ? undefined : status },
        undefined,
        { size: "md", shape: "circle" },
      ),
    examples: [
      {
        name: "Group",
        render: () => (
          <AvatarGroup max={4} aria-label="Project members">
            {team.map((name) => (
              <Avatar key={name} name={name} />
            ))}
          </AvatarGroup>
        ),
        code: `import { Avatar, AvatarGroup } from "kitgrid"\n\nconst team = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra"]\n\n<AvatarGroup max={4} aria-label="Project members">\n  {team.map((name) => (\n    <Avatar key={name} name={name} />\n  ))}\n</AvatarGroup>`,
      },
    ],
    accessibility: [
      'Exposed as role="img" named by `name` (or `alt`), with the status appended: “Ada Lovelace, Online”.',
      'Pass alt="" for a decorative avatar next to a visible name; it is then hidden from assistive technology.',
      "Each status has its own shape (solid, crescent, bar, ring) as well as its own color.",
      'AvatarGroup is a role="group"; the “+N” chip is announced as “N more”, customisable with overflowLabel.',
      "Hues are hashed from the name, so server and client render the same color with no hydration mismatch.",
    ],
  }),
  defineDemo({
    id: "kbd",
    name: "Kbd",
    category: "Data Display",
    description: "Keyboard keys and shortcuts, platform aware.",
    exports: ["Kbd"],
    serverSafe: true,
    controls: {
      shortcut: {
        type: "select",
        options: ["mod+k", "mod+shift+p", "alt+enter", "esc"],
        default: "mod+k",
      },
      separator: { type: "select", options: ["+", "none", "then"], default: "+" },
      size: { type: "select", options: ["sm", "md"], default: "md" },
    },
    render: ({ shortcut, separator, size }) => (
      <Kbd
        keys={shortcut.split("+")}
        separator={separator === "none" ? null : separator}
        size={size}
      />
    ),
    code: ({ shortcut, separator, size }) =>
      `import { Kbd } from "kitgrid"\n\n` +
      jsx(
        "Kbd",
        {
          keys: raw(JSON.stringify(shortcut.split("+"))),
          separator: separator === "none" ? raw("null") : separator,
          size,
        },
        undefined,
        { separator: "+", size: "md" },
      ),
    accessibility: [
      "Uses nested <kbd> elements, the HTML pattern for a key combination.",
      "Glyph keys carry visually hidden names: ⌘ is read as “Command”, ⇧ as “Shift”, ↵ as “Enter”.",
      "Platform detection runs only in the browser: the server renders “Ctrl”, then useSyncExternalStore upgrades it after hydration without a mismatch.",
    ],
  }),
  defineDemo({
    id: "separator",
    name: "Separator",
    category: "Data Display",
    description: "A hairline divider, horizontal or vertical.",
    exports: ["Separator"],
    serverSafe: true,
    controls: {
      orientation: {
        type: "select",
        options: ["horizontal", "vertical"],
        default: "horizontal",
      },
      label: { type: "text", default: "or" },
      labelPosition: {
        type: "select",
        options: ["start", "center", "end"],
        default: "center",
      },
    },
    render: ({ orientation, label, labelPosition }) =>
      orientation === "vertical" ? (
        <div className="pg-row" style={{ height: 20, gap: 14, fontSize: 14 }}>
          <span>Orders</span>
          <Separator orientation="vertical" />
          <span>Returns</span>
          <Separator orientation="vertical" />
          <span>Payouts</span>
        </div>
      ) : (
        <div style={{ width: 280 }}>
          <Separator label={label || undefined} labelPosition={labelPosition} />
        </div>
      ),
    code: ({ orientation, label, labelPosition }) =>
      `import { Separator } from "kitgrid"\n\n` +
      (orientation === "vertical"
        ? `<div style={{ display: "flex", alignItems: "center", gap: 14, height: 20 }}>\n  <span>Orders</span>\n  <Separator orientation="vertical" />\n  <span>Returns</span>\n</div>`
        : `<div style={{ width: 280 }}>\n${jsx(
            "Separator",
            { label: label || undefined, labelPosition: label ? labelPosition : undefined },
            undefined,
            { labelPosition: "center" },
          )
            .split("\n")
            .map((line) => `  ${line}`)
            .join("\n")}\n</div>`),
    accessibility: [
      'Decorative separators are role="none", so screen readers skip them.',
      'decorative={false} gives role="separator" and aria-orientation; a string label becomes its accessible name.',
    ],
  }),
  defineDemo({
    id: "tag",
    name: "Tag",
    category: "Data Display",
    description: "Removable chips for filters, keywords and recipients.",
    exports: ["Tag"],
    serverSafe: true,
    controls: {
      tone: {
        type: "select",
        options: ["neutral", "accent", "success", "warning", "danger", "info"],
        default: "neutral",
      },
      variant: { type: "select", options: ["soft", "outline"], default: "soft" },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      removable: { type: "boolean", default: true },
    },
    render: ({ tone, variant, size, removable }) => (
      <Tag tone={tone} variant={variant} size={size} onRemove={removable ? () => {} : undefined}>
        Linen
      </Tag>
    ),
    code: ({ tone, variant, size, removable }) =>
      `import { Tag } from "kitgrid"\n\n` +
      jsx(
        "Tag",
        { tone, variant, size, onRemove: removable ? raw("() => {}") : undefined },
        "Linen",
        { tone: "neutral", variant: "soft", size: "md" },
      ),
    examples: [
      {
        name: "Active filters",
        render: () => <ActiveFilters />,
        code: `import { Tag } from "kitgrid"\nimport { useState } from "react"\n\nfunction Filters() {\n  const [filters, setFilters] = useState(["Linen", "Size M", "Under $80"])\n  return (\n    <div style={{ display: "flex", gap: 8 }}>\n      {filters.map((filter) => (\n        <Tag\n          key={filter}\n          tone="accent"\n          onRemove={() => setFilters((current) => current.filter((f) => f !== filter))}\n        >\n          {filter}\n        </Tag>\n      ))}\n    </div>\n  )\n}\n\n<Filters />`,
      },
    ],
    accessibility: [
      "The remove control is a real <button> named “Remove <label>” (override with removeLabel), so Enter and Space work.",
      "A 28px pointer target is kept around the small visual button.",
      "The exit animation waits for its CSS animation before calling onRemove; under reduced motion it is instant.",
      "After removal, move focus somewhere sensible (the next tag or the filter input), since the focused button is gone.",
    ],
  }),
  defineDemo({
    id: "stat",
    name: "Stat",
    category: "Data Display",
    description: "A KPI with a delta and sparkline.",
    exports: ["Stat"],
    serverSafe: true,
    controls: {
      delta: { type: "number", min: -40, max: 40, step: 0.5, default: 12.4 },
      invertDelta: { type: "boolean", default: false, label: "Down is good" },
      trend: { type: "boolean", default: true },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
    },
    render: ({ delta, invertDelta, trend, size }) => (
      <Card style={{ width: 280 }}>
        <Stat
          label="Net revenue"
          value="$48,120"
          delta={delta}
          invertDelta={invertDelta}
          helper="vs last month"
          size={size}
          trend={trend ? [31, 34, 30, 38, 36, 42, 40, 47, 45, 52] : undefined}
        />
      </Card>
    ),
    code: ({ delta, invertDelta, trend, size }) =>
      `import { Card, Stat } from "kitgrid"\n\n` +
      `<Card style={{ width: 280 }}>\n${jsx(
        "Stat",
        {
          label: "Net revenue",
          value: "$48,120",
          delta,
          invertDelta,
          helper: "vs last month",
          size,
          trend: trend ? raw("[31, 34, 30, 38, 36, 42, 40, 47, 45, 52]") : undefined,
        },
        undefined,
        { size: "md" },
      )
        .split("\n")
        .map((line) => `  ${line}`)
        .join("\n")}\n</Card>`,
    accessibility: [
      "Rendered as a <dl>: the label is the term and the value its definition, so they are read together.",
      "The delta arrow is hidden; screen readers hear “up 12.4%” or “down 4%” (wording configurable via deltaLabels).",
      "Tone follows meaning, not sign: invertDelta makes a fall green for metrics such as churn.",
      "The sparkline is decorative unless you pass trendLabel, which exposes it as an image with that name.",
    ],
  }),
  defineDemo({
    id: "empty-state",
    name: "Empty State",
    category: "Data Display",
    description: "What a view shows when there is nothing yet.",
    exports: ["EmptyState"],
    serverSafe: true,
    controls: {
      variant: { type: "select", options: ["default", "dashed"], default: "dashed" },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      icon: { type: "boolean", default: true },
      actions: { type: "boolean", default: true },
    },
    render: ({ variant, size, icon, actions }) => (
      <EmptyState
        style={{ width: "min(440px, 100%)" }}
        variant={variant}
        size={size}
        icon={icon ? <PackageOpen /> : undefined}
        title="No products yet"
        description="Add your first product to start selling."
        actions={actions ? <Button leading={<Plus />}>Add product</Button> : undefined}
      />
    ),
    code: ({ variant, size, icon, actions }) =>
      `import { Button, EmptyState } from "kitgrid"\nimport { PackageOpen, Plus } from "lucide-react"\n\n` +
      jsx(
        "EmptyState",
        {
          variant,
          size,
          icon: icon ? raw("<PackageOpen />") : undefined,
          title: "No products yet",
          description: "Add your first product to start selling.",
          actions: actions ? raw("<Button leading={<Plus />}>Add product</Button>") : undefined,
        },
        undefined,
        { variant: "default", size: "md" },
      ),
    accessibility: [
      "The title is an <h3> by default; use titleAs to fit the page outline.",
      "The icon tile is decorative and hidden from assistive technology.",
      "Pair with aria-live on the parent region if the empty state appears after a filter change.",
    ],
  }),
]
