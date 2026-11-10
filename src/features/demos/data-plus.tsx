import {
  Barcode,
  CalendarView,
  ChipList,
  Clamp,
  CodeBlock,
  CodeTabs,
  ComparisonTable,
  DescriptionList,
  DiffView,
  FileTree,
  FormattedNumber,
  Highlight,
  ImageCompare,
  InfiniteList,
  JsonViewer,
  KanbanBoard,
  KeyValue,
  Leaderboard,
  LogViewer,
  type LogViewerEntry,
  Masonry,
  MetricCompare,
  QrCode,
  RelativeTime,
  Skeleton,
  StatusDot,
  Terminal,
  Timeline,
  TreeView,
  type TreeViewNode,
  TruncateText,
  UsageMeter,
  VirtualList,
  Watermark,
} from "kitgrid"
import { Check, Package, Truck, Zap } from "lucide-react"
import { useState } from "react"
import { defineDemo, jsx, raw } from "./registry"

const DEMO_NOW = new Date(2026, 2, 10, 12, 0)

const treeNodes: TreeViewNode[] = [
  {
    id: "design",
    label: "Design",
    children: [
      { id: "tokens", label: "Tokens" },
      { id: "icons", label: "Icons" },
    ],
  },
  {
    id: "web",
    label: "Web",
    children: [
      { id: "checkout", label: "Checkout" },
      { id: "cart", label: "Cart" },
    ],
  },
  { id: "archive", label: "Archive", disabled: true },
]

const treeNodesCode = `const nodes = [
  {
    id: "design",
    label: "Design",
    children: [
      { id: "tokens", label: "Tokens" },
      { id: "icons", label: "Icons" },
    ],
  },
  {
    id: "web",
    label: "Web",
    children: [
      { id: "checkout", label: "Checkout" },
      { id: "cart", label: "Cart" },
    ],
  },
  { id: "archive", label: "Archive", disabled: true },
]`

const repo = ["src/app/page.tsx", "src/components/cart.tsx", "src/lib/money.ts", "package.json", "README.md"]

const kanbanColumns = [
  { id: "todo", title: "To do" },
  { id: "doing", title: "In progress", limit: 2 },
  { id: "done", title: "Done", color: "var(--kg-success)" },
]

const kanbanCards = [
  { id: "k1", column: "todo", title: "Refund copy", meta: "Content" },
  { id: "k2", column: "todo", title: "Gift cards", meta: "Checkout" },
  { id: "k3", column: "doing", title: "Address lookup", meta: "Forms" },
  { id: "k4", column: "done", title: "Shipping rates", meta: "Backend" },
]

const kanbanCode = `const columns = [
  { id: "todo", title: "To do" },
  { id: "doing", title: "In progress", limit: 2 },
  { id: "done", title: "Done", color: "var(--kg-success)" },
]

const cards = [
  { id: "k1", column: "todo", title: "Refund copy", meta: "Content" },
  { id: "k2", column: "todo", title: "Gift cards", meta: "Checkout" },
  { id: "k3", column: "doing", title: "Address lookup", meta: "Forms" },
  { id: "k4", column: "done", title: "Shipping rates", meta: "Backend" },
]`

const at = (day: number, hour = 0, minute = 0) => new Date(2026, 2, day, hour, minute)
const calendarEvents = [
  { id: "e1", title: "Design review", start: at(10, 14) },
  { id: "e2", title: "Launch", start: at(17), allDay: true, tone: "success" as const },
  { id: "e3", title: "Offsite", start: at(19), end: at(20), allDay: true, tone: "warning" as const },
  { id: "e4", title: "Planning", start: at(24, 10), tone: "info" as const },
]

const calendarCode = `const events = [
  { id: "e1", title: "Design review", start: new Date(2026, 2, 10, 14) },
  { id: "e2", title: "Launch", start: new Date(2026, 2, 17), allDay: true, tone: "success" as const },
  { id: "e3", title: "Offsite", start: new Date(2026, 2, 19), end: new Date(2026, 2, 20), allDay: true, tone: "warning" as const },
  { id: "e4", title: "Planning", start: new Date(2026, 2, 24, 10), tone: "info" as const },
]`

const logEntries: LogViewerEntry[] = [
  { id: 1, time: "12:00:31", level: "info", message: "GET /api/cart 200 18ms", source: "api" },
  { id: 2, time: "12:00:32", level: "debug", message: "cache hit sku=TEE-M", source: "web" },
  { id: 3, time: "12:00:34", level: "warn", message: "slow query orders.list 840ms", source: "api" },
  { id: 4, time: "12:00:35", level: "info", message: "POST /api/checkout 201 64ms", source: "api" },
  { id: 5, time: "12:00:37", level: "error", message: "webhook charge failed: timeout", source: "web" },
  { id: 6, time: "12:00:38", level: "info", message: "worker drained 12 jobs", source: "web" },
]

const logCode = `const entries = [
  { id: 1, time: "12:00:31", level: "info" as const, message: "GET /api/cart 200 18ms", source: "api" },
  { id: 2, time: "12:00:32", level: "debug" as const, message: "cache hit sku=TEE-M", source: "web" },
  { id: 3, time: "12:00:34", level: "warn" as const, message: "slow query orders.list 840ms", source: "api" },
  { id: 4, time: "12:00:35", level: "info" as const, message: "POST /api/checkout 201 64ms", source: "api" },
  { id: 5, time: "12:00:37", level: "error" as const, message: "webhook charge failed: timeout", source: "web" },
  { id: 6, time: "12:00:38", level: "info" as const, message: "worker drained 12 jobs", source: "web" },
]`

const InfiniteDemo = () => {
  const [rows, setRows] = useState(6)
  const [loading, setLoading] = useState(false)
  return (
    <div
      style={{
        height: 240,
        width: 300,
        overflow: "auto",
        border: "1px solid var(--kg-border)",
        borderRadius: "var(--kg-radius-xl)",
      }}
    >
      <InfiniteList
        hasMore={rows < 30}
        loading={loading}
        onLoadMore={() => {
          if (loading) return
          setLoading(true)
          setTimeout(() => {
            setRows((n) => n + 6)
            setLoading(false)
          }, 700)
        }}
      >
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} style={{ padding: "12px 16px", borderBottom: "1px solid var(--kg-border)" }}>
            <Skeleton animation="none" width={`${50 + ((i * 17) % 40)}%`} />
          </div>
        ))}
      </InfiniteList>
    </div>
  )
}

const infiniteCode = `import { InfiniteList, Skeleton } from "kitgrid"
import { useState } from "react"

function Feed() {
  const [rows, setRows] = useState(6)
  const [loading, setLoading] = useState(false)
  const loadMore = () => {
    if (loading) return
    setLoading(true)
    setTimeout(() => {
      setRows((n) => n + 6)
      setLoading(false)
    }, 700)
  }
  return (
    <div style={{ height: 240, width: 300, overflow: "auto", border: "1px solid var(--kg-border)" }}>
      <InfiniteList hasMore={rows < 30} loading={loading} onLoadMore={loadMore}>
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} style={{ padding: "12px 16px", borderBottom: "1px solid var(--kg-border)" }}>
            <Skeleton animation="none" width={\`\${50 + ((i * 17) % 40)}%\`} />
          </div>
        ))}
      </InfiniteList>
    </div>
  )
}

<Feed />`

const masonryHeights = [160, 110, 200, 130, 180, 120]

const json = {
  id: "ord_8Fk2",
  status: "paid",
  total: 129.5,
  gift: false,
  customer: { name: "Lena Vogel", email: "lena@vogel.de" },
  items: [{ sku: "TEE-M-OAT", qty: 2 }],
}

const jsonCode = `const order = {
  id: "ord_8Fk2",
  status: "paid",
  total: 129.5,
  gift: false,
  customer: { name: "Lena Vogel", email: "lena@vogel.de" },
  items: [{ sku: "TEE-M-OAT", qty: 2 }],
}`

const before = `export const total = (items) => {
  let sum = 0
  for (const item of items) sum += item.price
  return sum
}`

const after = `export const total = (items, discount = 0) => {
  const sum = items.reduce((acc, item) => acc + item.price, 0)
  return Math.max(0, sum - discount)
}`

const codeSample = `export function lineTotal(price: number, qty: number) {
  const total = price * qty
  return total.toFixed(2)
}`

const shotStyle = {
  display: "grid",
  placeContent: "center",
  justifyItems: "center",
  gap: 10,
  height: "100%",
  padding: 28,
  boxSizing: "border-box",
} as const

const ShotPlaceholder = ({ tone }: { tone: string }) => (
  <div style={{ ...shotStyle, background: tone }}>
    <Skeleton shape="circle" width={72} animation="none" />
    <Skeleton animation="none" width={180} height={14} />
    <Skeleton animation="none" width={120} height={14} />
  </div>
)

const shotPlaceholderCode = `const Shot = ({ tone }: { tone: string }) => (
  <div style={{ display: "grid", placeContent: "center", justifyItems: "center", gap: 10, height: "100%", padding: 28, boxSizing: "border-box", background: tone }}>
    <Skeleton shape="circle" width={72} animation="none" />
    <Skeleton animation="none" width={180} height={14} />
    <Skeleton animation="none" width={120} height={14} />
  </div>
)`

const leaders = [
  { id: "tomas", name: "Tomás Ruiz", detail: "Madrid", value: 18240, movement: 2 },
  { id: "mira", name: "Mira Chen", detail: "Singapore", value: 16410 },
  { id: "ama", name: "Ama Owusu", detail: "Accra", value: 15980, movement: -1 },
  { id: "jonas", name: "Jonas Berg", detail: "Oslo", value: 11200 },
]

const leadersCode = `const sellers = [
  { id: "tomas", name: "Tomás Ruiz", detail: "Madrid", value: 18240, movement: 2 },
  { id: "mira", name: "Mira Chen", detail: "Singapore", value: 16410 },
  { id: "ama", name: "Ama Owusu", detail: "Accra", value: 15980, movement: -1 },
  { id: "jonas", name: "Jonas Berg", detail: "Oslo", value: 11200 },
]`

const indent = (text: string, depth = 1) =>
  text
    .split("\n")
    .map((line) => `${"  ".repeat(depth)}${line}`)
    .join("\n")

export const demos = [
  defineDemo({
    id: "tree-view",
    name: "Tree View",
    category: "Data Display",
    description: "Hierarchy with full tree keyboard support and checkboxes.",
    exports: ["TreeView"],
    controls: {
      selectionMode: { type: "select", options: ["single", "multiple", "none"], default: "single" },
      checkable: { type: "boolean", default: false },
      guides: { type: "boolean", default: true },
    },
    render: ({ selectionMode, checkable, guides }) => (
      <TreeView
        nodes={treeNodes}
        label="Workspace"
        selectionMode={selectionMode}
        checkable={checkable}
        guides={guides}
        defaultExpanded={["design", "web"]}
        defaultSelected={["icons"]}
        style={{ width: 240 }}
      />
    ),
    code: ({ selectionMode, checkable, guides }) =>
      `import { TreeView } from "kitgrid"\n\n${treeNodesCode}\n\n` +
      jsx(
        "TreeView",
        {
          nodes: raw("nodes"),
          label: "Workspace",
          selectionMode,
          checkable,
          guides,
          defaultExpanded: raw(`["design", "web"]`),
          defaultSelected: raw(`["icons"]`),
          style: raw("{ width: 240 }"),
        },
        undefined,
        { selectionMode: "single", checkable: false, guides: true },
      ),
    accessibility: [
      "role tree, treeitem and group with aria-level, aria-setsize and aria-posinset.",
      "Up/Down move, Right opens or enters, Left closes or goes to parent, Home/End, * expands siblings, type to find.",
      "Space selects or toggles a tri-state checkbox (aria-checked mixed for partial).",
    ],
  }),
  defineDemo({
    id: "file-tree",
    name: "File Tree",
    category: "Data Display",
    description: "Paths in, explorer out: inferred folders, file icons and git markers.",
    exports: ["FileTree"],
    controls: { expandAll: { type: "boolean", default: true } },
    render: ({ expandAll }) => (
      <FileTree
        key={String(expandAll)}
        paths={repo}
        label="Repository"
        expandAll={expandAll}
        defaultSelectedPath="src/app/page.tsx"
        status={{ "src/components/cart.tsx": "modified", "src/lib/money.ts": "added" }}
        style={{ width: 260 }}
      />
    ),
    code: ({ expandAll }) =>
      `import { FileTree } from "kitgrid"\n\nconst paths = ${JSON.stringify(repo, null, 2)}\n\n` +
      jsx(
        "FileTree",
        {
          paths: raw("paths"),
          label: "Repository",
          expandAll,
          defaultSelectedPath: "src/app/page.tsx",
          status: raw(`{ "src/components/cart.tsx": "modified", "src/lib/money.ts": "added" }`),
          style: raw("{ width: 260 }"),
        },
      ),
    accessibility: [
      "Inherits the TreeView keyboard map.",
      "Git status shows as a letter with the word for screen readers.",
    ],
  }),
  defineDemo({
    id: "timeline",
    name: "Timeline",
    category: "Data Display",
    description: "Ordered events with done, current and upcoming states.",
    exports: ["Timeline"],
    serverSafe: true,
    controls: {
      orientation: { type: "select", options: ["vertical", "horizontal"], default: "vertical" },
      align: { type: "select", options: ["start", "alternate"], default: "start" },
      icons: { type: "boolean", default: false },
    },
    render: ({ orientation, align, icons }) => (
      <Timeline
        orientation={orientation}
        align={align}
        style={{ width: orientation === "horizontal" ? 520 : 300 }}
        items={[
          { title: "Order placed", time: "Mar 8", icon: icons ? <Check /> : undefined },
          { title: "Packed", time: "Mar 9", icon: icons ? <Package /> : undefined },
          { title: "Out for delivery", time: "Today", status: "current", icon: icons ? <Truck /> : undefined },
          { title: "Delivered", status: "upcoming" },
        ]}
      />
    ),
    code: ({ orientation, align, icons }) => {
      const icon = (name: string) => (icons ? `, icon: <${name} />` : "")
      return (
        `import { Timeline } from "kitgrid"${icons ? `\nimport { Check, Package, Truck } from "lucide-react"` : ""}\n\n` +
        `const steps = [\n  { title: "Order placed", time: "Mar 8"${icon("Check")} },\n  { title: "Packed", time: "Mar 9"${icon("Package")} },\n  { title: "Out for delivery", time: "Today", status: "current" as const${icon("Truck")} },\n  { title: "Delivered", status: "upcoming" as const },\n]\n\n` +
        jsx(
          "Timeline",
          {
            orientation,
            align,
            items: raw("steps"),
            style: raw(`{ width: ${orientation === "horizontal" ? 520 : 300} }`),
          },
          undefined,
          { orientation: "vertical", align: "start" },
        )
      )
    },
    accessibility: [
      "An ordered list; the current item has aria-current=\"step\" and a hidden \"current\" suffix.",
      "The orbiting ring on the current marker stops under reduced motion.",
    ],
  }),
  defineDemo({
    id: "kanban-board",
    name: "Kanban Board",
    category: "Data Display",
    description: "Columns and cards that move by drag or keyboard, with WIP limits.",
    exports: ["KanbanBoard"],
    layout: "fill",
    height: 360,
    render: () => (
      <div style={{ padding: 24, width: "100%", maxWidth: 840, margin: "0 auto" }}>
        <KanbanBoard columns={kanbanColumns} defaultCards={kanbanCards} label="Sprint 14" />
      </div>
    ),
    code: () =>
      `import { KanbanBoard } from "kitgrid"\n\n${kanbanCode}\n\n<KanbanBoard label="Sprint 14" columns={columns} defaultCards={cards} />`,
    accessibility: [
      "Space or Enter lifts a card; arrows move it within and across columns; Space drops; Escape cancels.",
      "Each step is announced in an assertive live region.",
      "Pointer drag shows a ghost and a dashed placeholder at the drop spot.",
    ],
  }),
  defineDemo({
    id: "calendar-view",
    name: "Calendar View",
    category: "Data Display",
    description: "Month grid and week agenda from one list of events.",
    exports: ["CalendarView"],
    layout: "fill",
    height: 520,
    controls: { view: { type: "select", options: ["month", "agenda"], default: "month" } },
    render: ({ view }) => (
      <div style={{ padding: 24, width: "100%", maxWidth: 720, margin: "0 auto" }}>
        <CalendarView
          key={view}
          events={calendarEvents}
          defaultView={view}
          defaultDate={DEMO_NOW}
          today={DEMO_NOW}
        />
      </div>
    ),
    code: ({ view }) =>
      `import { CalendarView } from "kitgrid"\n\n${calendarCode}\n\n` +
      jsx(
        "CalendarView",
        { events: raw("events"), defaultView: view, defaultDate: raw("new Date(2026, 2, 10)") },
        undefined,
        { defaultView: "month" },
      ),
    accessibility: [
      "Month view is a grid: arrows by day and week, Home/End to week edges, Page Up/Down by month (Shift for year).",
      "Each day cell is named with its date and event count; today has aria-current=\"date\".",
    ],
  }),
  defineDemo({
    id: "description-list",
    name: "Description List",
    category: "Data Display",
    description: "Labelled values in a grid, inline rows or a stack.",
    exports: ["DescriptionList"],
    serverSafe: true,
    controls: {
      layout: { type: "select", options: ["grid", "inline", "stacked"], default: "grid" },
      variant: { type: "select", options: ["plain", "bordered", "striped"], default: "plain" },
      columns: { type: "number", min: 1, max: 4, default: 2 },
    },
    render: ({ layout, variant, columns }) => (
      <DescriptionList
        layout={layout}
        variant={variant}
        columns={columns}
        style={{ width: 420 }}
        items={[
          { term: "Plan", description: "Scale" },
          { term: "Seats", description: "24 of 30" },
          { term: "Renews", description: "Apr 2, 2026" },
          { term: "Status", description: <StatusDot status="success">Active</StatusDot> },
        ]}
      />
    ),
    code: ({ layout, variant, columns }) =>
      `import { DescriptionList, StatusDot } from "kitgrid"\n\n` +
      jsx(
        "DescriptionList",
        {
          layout,
          variant,
          columns,
          style: raw("{ width: 420 }"),
          items: raw(
            `[\n    { term: "Plan", description: "Scale" },\n    { term: "Seats", description: "24 of 30" },\n    { term: "Renews", description: "Apr 2, 2026" },\n    { term: "Status", description: <StatusDot status="success">Active</StatusDot> },\n  ]`,
          ),
        },
        undefined,
        { layout: "grid", variant: "plain", columns: 3 },
      ),
    accessibility: ["A native dl; each dt/dd pair is wrapped in a div so it stays together."],
  }),
  defineDemo({
    id: "key-value",
    name: "Key Value",
    category: "Data Display",
    description: "One labelled value per row, with optional leader and copy.",
    exports: ["KeyValue"],
    controls: {
      leader: { type: "boolean", default: true },
      mono: { type: "boolean", default: true },
      copyable: { type: "boolean", default: true },
    },
    render: ({ leader, mono, copyable }) => (
      <div style={{ display: "grid", gap: 10, width: 300 }}>
        <KeyValue label="Order" value="ord_8Fk2Qx" leader={leader} mono={mono} copyable={copyable} />
        <KeyValue label="Subtotal" value="€129.50" leader={leader} />
        <KeyValue label="Shipping" value="Free" leader={leader} />
      </div>
    ),
    code: ({ leader, mono, copyable }) =>
      `import { KeyValue } from "kitgrid"\n\n<div style={{ display: "grid", gap: 10, width: 300 }}>\n${indent(
        [
          jsx("KeyValue", { label: "Order", value: "ord_8Fk2Qx", leader, mono, copyable }),
          jsx("KeyValue", { label: "Subtotal", value: "€129.50", leader }),
          jsx("KeyValue", { label: "Shipping", value: "Free", leader }),
        ].join("\n"),
      )}\n</div>`,
    accessibility: [
      "A dl with one term and definition.",
      "The copy button is labelled and confirms through a status region.",
    ],
  }),
  defineDemo({
    id: "code-block",
    name: "Code Block",
    category: "Data Display",
    description: "Code with copy, line numbers and highlighted lines.",
    exports: ["CodeBlock"],
    controls: {
      lineNumbers: { type: "boolean", default: true },
      highlight: { type: "boolean", default: true },
      wrap: { type: "boolean", default: false },
    },
    render: ({ lineNumbers, highlight, wrap }) => (
      <CodeBlock
        code={codeSample}
        title="line-total.ts"
        language="ts"
        lineNumbers={lineNumbers}
        wrap={wrap}
        highlightLines={highlight ? [2] : undefined}
        style={{ width: 480 }}
      />
    ),
    code: ({ lineNumbers, highlight, wrap }) =>
      `import { CodeBlock } from "kitgrid"\n\nconst source = \`${codeSample}\`\n\n` +
      jsx("CodeBlock", {
        code: raw("source"),
        title: "line-total.ts",
        language: "ts",
        lineNumbers,
        wrap,
        highlightLines: highlight ? raw("[2]") : undefined,
        style: raw("{ width: 480 }"),
      }),
    accessibility: [
      "The scroll region is focusable so long lines can be scrolled from the keyboard.",
      "Line numbers are aria-hidden and unselectable; copy is announced.",
    ],
  }),
  defineDemo({
    id: "code-tabs",
    name: "Code Tabs",
    category: "Data Display",
    description: "One snippet in several flavours with a shared copy button.",
    exports: ["CodeTabs"],
    render: () => (
      <CodeTabs
        label="Install"
        style={{ width: 420 }}
        items={[
          { value: "npm", label: "npm", code: "npm install @yogeshsaini/kitgrid" },
          { value: "pnpm", label: "pnpm", code: "pnpm add @yogeshsaini/kitgrid" },
          { value: "yarn", label: "yarn", code: "yarn add @yogeshsaini/kitgrid" },
        ]}
      />
    ),
    code: () =>
      `import { CodeTabs } from "kitgrid"\n\n<CodeTabs\n  label="Install"\n  style={{ width: 420 }}\n  items={[\n    { value: "npm", label: "npm", code: "npm install @yogeshsaini/kitgrid" },\n    { value: "pnpm", label: "pnpm", code: "pnpm add @yogeshsaini/kitgrid" },\n    { value: "yarn", label: "yarn", code: "yarn add @yogeshsaini/kitgrid" },\n  ]}\n/>`,
    accessibility: ["Tabs pattern with roving focus: arrows move and select, Home/End jump."],
  }),
  defineDemo({
    id: "diff-view",
    name: "Diff View",
    category: "Data Display",
    description: "Line diff of two strings, unified or split, with inline change marks.",
    exports: ["DiffView"],
    controls: {
      mode: { type: "select", options: ["unified", "split"], default: "unified" },
      inline: { type: "boolean", default: true },
    },
    render: ({ mode, inline }) => (
      <DiffView
        before={before}
        after={after}
        mode={mode}
        inline={inline}
        title="cart/total.ts"
        style={{ width: "min(100%, 560px)" }}
      />
    ),
    code: ({ mode, inline }) =>
      `import { DiffView } from "kitgrid"\n\nconst previous = \`${before}\`\n\nconst next = \`${after}\`\n\n` +
      jsx(
        "DiffView",
        { before: raw("previous"), after: raw("next"), mode, inline, title: "cart/total.ts" },
        undefined,
        { mode: "unified", inline: true },
      ),
    accessibility: [
      "A captioned table; added and removed lines carry the words, not just color.",
      "Folded unchanged lines expand with a button.",
    ],
  }),
  defineDemo({
    id: "json-viewer",
    name: "JSON Viewer",
    category: "Data Display",
    description: "Collapsible, typed view of any JSON value.",
    exports: ["JsonViewer"],
    controls: {
      defaultExpandDepth: { type: "number", min: 0, max: 3, default: 1, label: "Depth" },
      sortKeys: { type: "boolean", default: false },
    },
    render: ({ defaultExpandDepth, sortKeys }) => (
      <JsonViewer
        key={`${defaultExpandDepth}-${sortKeys}`}
        data={json}
        defaultExpandDepth={defaultExpandDepth}
        sortKeys={sortKeys}
        style={{ width: 380 }}
      />
    ),
    code: ({ defaultExpandDepth, sortKeys }) =>
      `import { JsonViewer } from "kitgrid"\n\n${jsonCode}\n\n` +
      jsx(
        "JsonViewer",
        { data: raw("order"), defaultExpandDepth, sortKeys, style: raw("{ width: 380 }") },
        undefined,
        { defaultExpandDepth: 2, sortKeys: false },
      ),
    accessibility: ["Each object and array is a native button with aria-expanded."],
  }),
  defineDemo({
    id: "log-viewer",
    name: "Log Viewer",
    category: "Data Display",
    description: "Windowed log stream with level filters, search and tail-follow.",
    exports: ["LogViewer"],
    render: () => <LogViewer entries={logEntries} height={220} style={{ width: "min(100%, 560px)" }} />,
    code: () =>
      `import { LogViewer } from "kitgrid"\n\n${logCode}\n\n<LogViewer entries={entries} height={220} style={{ width: "min(100%, 560px)" }} />`,
    accessibility: [
      "Level filters are toggle buttons; search highlights matches.",
      "role log, silent by default; pass live to announce new lines.",
    ],
  }),
  defineDemo({
    id: "terminal",
    name: "Terminal",
    category: "Data Display",
    description: "A transcript that types its commands when scrolled into view.",
    exports: ["Terminal"],
    controls: { animate: { type: "boolean", default: true } },
    render: ({ animate }) => (
      <Terminal
        key={String(animate)}
        title="~/shop"
        animate={animate}
        style={{ width: 420 }}
        lines={[
          { kind: "input", text: "npm create kitgrid@latest" },
          { kind: "muted", text: "Installed 214 packages in 3.1s" },
          { kind: "input", text: "npm run dev" },
          { kind: "success", text: "Ready on localhost:5173" },
        ]}
      />
    ),
    code: ({ animate }) =>
      `import { Terminal } from "kitgrid"\n\nconst lines = [\n  { kind: "input" as const, text: "npm create kitgrid@latest" },\n  { kind: "muted" as const, text: "Installed 214 packages in 3.1s" },\n  { kind: "input" as const, text: "npm run dev" },\n  { kind: "success" as const, text: "Ready on localhost:5173" },\n]\n\n` +
      jsx(
        "Terminal",
        { title: "~/shop", animate, lines: raw("lines"), style: raw("{ width: 420 }") },
        undefined,
        { animate: true },
      ),
    accessibility: [
      "The full transcript is in a visually hidden pre; the animated copy is aria-hidden.",
      "Typing is CSS only and renders complete under reduced motion.",
    ],
  }),
  defineDemo({
    id: "image-compare",
    name: "Image Compare",
    category: "Data Display",
    description: "Before and after with a draggable, keyboard-operable divider.",
    exports: ["ImageCompare"],
    controls: {
      orientation: { type: "select", options: ["horizontal", "vertical"], default: "horizontal" },
      hover: { type: "boolean", default: false },
    },
    render: ({ orientation, hover }) => (
      <ImageCompare
        style={{ width: 460 }}
        orientation={orientation}
        hover={hover}
        beforeLabel="Before"
        afterLabel="After"
        before={<ShotPlaceholder tone="var(--kg-muted)" />}
        after={<ShotPlaceholder tone="var(--kg-surface-raised)" />}
      />
    ),
    code: ({ orientation, hover }) =>
      `import { ImageCompare, Skeleton } from "kitgrid"\n\n${shotPlaceholderCode}\n\n` +
      jsx(
        "ImageCompare",
        {
          before: raw(`<Shot tone="var(--kg-muted)" />`),
          after: raw(`<Shot tone="var(--kg-surface-raised)" />`),
          beforeLabel: "Before",
          afterLabel: "After",
          orientation,
          hover,
          style: raw("{ width: 460 }"),
        },
        undefined,
        { orientation: "horizontal", hover: false },
      ),
    accessibility: [
      "The divider is a slider: arrows (Shift for 10), Page Up/Down, Home, End.",
      "Position is painted through a CSS variable, so dragging never re-renders.",
    ],
  }),
  defineDemo({
    id: "masonry",
    name: "Masonry",
    category: "Data Display",
    description: "Shortest-column packing that keeps DOM order.",
    exports: ["Masonry"],
    layout: "fill",
    height: 440,
    controls: {
      minColumnWidth: { type: "number", min: 120, max: 320, step: 20, default: 160, label: "Min column" },
      gap: { type: "number", min: 4, max: 32, step: 2, default: 12 },
    },
    render: ({ minColumnWidth, gap }) => (
      <div style={{ padding: 24, width: "100%", maxWidth: 640, margin: "0 auto" }}>
        <Masonry minColumnWidth={minColumnWidth} gap={gap}>
          {masonryHeights.map((h) => (
            <Skeleton key={h} shape="rect" animation="none" height={h} />
          ))}
        </Masonry>
      </div>
    ),
    code: ({ minColumnWidth, gap }) =>
      `import { Masonry, Skeleton } from "kitgrid"\n\nconst heights = ${JSON.stringify(masonryHeights).replace(/,/g, ", ")}\n\n` +
      jsx(
        "Masonry",
        { minColumnWidth, gap },
        `{heights.map((height) => (\n  <Skeleton key={height} shape="rect" animation="none" height={height} />\n))}`,
        { minColumnWidth: 220, gap: 16 },
      ),
    accessibility: ["Items stay in source order, so Tab and reading order match what was authored."],
  }),
  defineDemo({
    id: "virtual-list",
    name: "Virtual List",
    category: "Data Display",
    description: "Ten thousand rows, only the visible window mounted.",
    exports: ["VirtualList"],
    render: () => (
      <VirtualList
        count={10_000}
        itemHeight={40}
        height={240}
        label="Transactions"
        style={{
          width: 300,
          border: "1px solid var(--kg-border)",
          borderRadius: "var(--kg-radius-xl)",
        }}
        renderItem={(i) => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
              padding: "0 16px",
              borderBottom: "1px solid var(--kg-border)",
              fontSize: 14,
            }}
          >
            <span>TX-{String(i + 1).padStart(5, "0")}</span>
            <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--kg-fg-muted)" }}>
              €{(((i * 37) % 900) + 12).toFixed(2)}
            </span>
          </div>
        )}
      />
    ),
    code: () =>
      `import { VirtualList } from "kitgrid"\n\n<VirtualList\n  count={10_000}\n  itemHeight={40}\n  height={240}\n  label="Transactions"\n  style={{ width: 300, border: "1px solid var(--kg-border)", borderRadius: "var(--kg-radius-xl)" }}\n  renderItem={(i) => (\n    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%", padding: "0 16px", fontSize: 14 }}>\n      <span>TX-{String(i + 1).padStart(5, "0")}</span>\n      <span>€{(((i * 37) % 900) + 12).toFixed(2)}</span>\n    </div>\n  )}\n/>`,
    accessibility: ["Rows keep aria-setsize and aria-posinset; the viewport is a focusable scroll region."],
  }),
  defineDemo({
    id: "infinite-list",
    name: "Infinite List",
    category: "Data Display",
    description: "Loads the next page when a sentinel nears the viewport.",
    exports: ["InfiniteList"],
    render: () => <InfiniteDemo />,
    code: () => infiniteCode,
    accessibility: [
      "aria-busy while loading, with a polite status message.",
      "showButton adds a Load more button for keyboard users.",
    ],
  }),
  defineDemo({
    id: "chip-list",
    name: "Chip List",
    category: "Data Display",
    description: "Read-only chips that fold overflow into +N.",
    exports: ["ChipList"],
    controls: {
      max: { type: "number", min: 1, max: 6, default: 3 },
      size: { type: "select", options: ["sm", "md"], default: "md" },
    },
    render: ({ max, size }) => (
      <ChipList
        aria-label="Skills"
        max={max}
        size={size}
        style={{ maxWidth: 320 }}
        items={[{ label: "React", tone: "accent" }, "TypeScript", "Figma", "Postgres", "Rust", "Motion"]}
      />
    ),
    code: ({ max, size }) =>
      `import { ChipList } from "kitgrid"\n\n` +
      jsx(
        "ChipList",
        {
          "aria-label": "Skills",
          max,
          size,
          items: raw(`[{ label: "React", tone: "accent" as const }, "TypeScript", "Figma", "Postgres", "Rust", "Motion"]`),
        },
        undefined,
        { size: "md" },
      ),
    accessibility: ["A list; the overflow chip is a button with aria-expanded and a spoken count."],
  }),
  defineDemo({
    id: "comparison-table",
    name: "Comparison Table",
    category: "Data Display",
    description: "Features down, options across, sticky first column.",
    exports: ["ComparisonTable"],
    serverSafe: true,
    render: () => (
      <ComparisonTable
        caption="Plans"
        style={{ width: "min(100%, 520px)" }}
        columns={[
          { key: "starter", label: "Starter", meta: "€0" },
          { key: "growth", label: "Growth", meta: "€29 / mo", highlight: true },
          { key: "scale", label: "Scale", meta: "€99 / mo" },
        ]}
        rows={[
          { feature: "Products", values: { starter: "50", growth: "5,000", scale: "Unlimited" } },
          { feature: "Custom domain", values: { starter: false, growth: true, scale: true } },
          { feature: "SSO", values: { starter: false, growth: false, scale: true } },
        ]}
      />
    ),
    code: () =>
      `import { ComparisonTable } from "kitgrid"\n\n<ComparisonTable\n  caption="Plans"\n  style={{ width: "min(100%, 520px)" }}\n  columns={[\n    { key: "starter", label: "Starter", meta: "€0" },\n    { key: "growth", label: "Growth", meta: "€29 / mo", highlight: true },\n    { key: "scale", label: "Scale", meta: "€99 / mo" },\n  ]}\n  rows={[\n    { feature: "Products", values: { starter: "50", growth: "5,000", scale: "Unlimited" } },\n    { feature: "Custom domain", values: { starter: false, growth: true, scale: true } },\n    { feature: "SSO", values: { starter: false, growth: false, scale: true } },\n  ]}\n/>`,
    accessibility: [
      "A real table with caption, column and row headers, and colgroup subheadings.",
      "Checks and dashes read as Included / Not included.",
    ],
  }),
  defineDemo({
    id: "metric-compare",
    name: "Metric Compare",
    category: "Data Display",
    description: "One metric across two periods with paired bars.",
    exports: ["MetricCompare"],
    serverSafe: true,
    controls: { invert: { type: "boolean", default: false } },
    render: ({ invert }) => (
      <MetricCompare
        label="Revenue"
        invert={invert}
        current={{ label: "March", value: 48120 }}
        previous={{ label: "February", value: 41300 }}
        format={(n) => `€${(n / 1000).toFixed(1)}k`}
        style={{ width: 260 }}
      />
    ),
    code: ({ invert }) =>
      `import { MetricCompare } from "kitgrid"\n\n` +
      jsx("MetricCompare", {
        label: "Revenue",
        invert,
        current: raw(`{ label: "March", value: 48120 }`),
        previous: raw(`{ label: "February", value: 41300 }`),
        format: raw("(n) => `€${(n / 1000).toFixed(1)}k`"),
        style: raw("{ width: 260 }"),
      }),
    accessibility: ["Periods are dt/dd pairs; bars are decorative."],
  }),
  defineDemo({
    id: "leaderboard",
    name: "Leaderboard",
    category: "Data Display",
    description: "Ranked rows with value bars, podium rings and movement.",
    exports: ["Leaderboard"],
    serverSafe: true,
    controls: { bars: { type: "boolean", default: true } },
    render: ({ bars }) => (
      <Leaderboard
        bars={bars}
        highlightId="ama"
        style={{ width: 340 }}
        format={(n) => `€${n.toLocaleString("en-US")}`}
        items={leaders}
      />
    ),
    code: ({ bars }) =>
      `import { Leaderboard } from "kitgrid"\n\n${leadersCode}\n\n` +
      jsx(
        "Leaderboard",
        {
          items: raw("sellers"),
          highlightId: "ama",
          bars,
          format: raw("(n) => `€${n.toLocaleString(\"en-US\")}`"),
          style: raw("{ width: 340 }"),
        },
        undefined,
        { bars: true },
      ),
    accessibility: ["An ordered list; rank and movement are spoken (\"Rank 1\", \"up 2\")."],
  }),
  defineDemo({
    id: "qr-code",
    name: "QR Code",
    category: "Data Display",
    description: "SVG QR code from a dependency-free encoder.",
    exports: ["QrCode"],
    serverSafe: true,
    controls: {
      value: { type: "text", default: "https://kitgrid.dev" },
      moduleStyle: { type: "select", options: ["square", "rounded", "dots"], default: "rounded" },
      level: { type: "select", options: ["L", "M", "Q", "H"], default: "M" },
      icon: { type: "boolean", default: false },
    },
    render: ({ value, moduleStyle, level, icon }) => (
      <QrCode
        value={value || " "}
        moduleStyle={moduleStyle}
        level={icon ? "H" : level}
        size={180}
        icon={icon ? <Zap /> : undefined}
      />
    ),
    code: ({ value, moduleStyle, level, icon }) =>
      `import { QrCode } from "kitgrid"${icon ? `\nimport { Zap } from "lucide-react"` : ""}\n\n` +
      jsx(
        "QrCode",
        {
          value: value || " ",
          moduleStyle,
          level: icon ? "H" : level,
          size: 180,
          icon: icon ? raw("<Zap />") : undefined,
        },
        undefined,
        { moduleStyle: "square", level: "M" },
      ),
    accessibility: [
      "role img named \"QR code: <value>\"; pass label to override.",
      "Keeps dark-on-light in dark themes so scanners read it.",
    ],
  }),
  defineDemo({
    id: "barcode",
    name: "Barcode",
    category: "Data Display",
    description: "Code 128 barcode as crisp SVG.",
    exports: ["Barcode"],
    serverSafe: true,
    controls: {
      value: { type: "text", default: "ORD-48213" },
      showValue: { type: "boolean", default: true },
      height: { type: "number", min: 32, max: 120, default: 64 },
    },
    render: ({ value, showValue, height }) => (
      <Barcode value={value} showValue={showValue} height={height} />
    ),
    code: ({ value, showValue, height }) =>
      `import { Barcode } from "kitgrid"\n\n` +
      jsx("Barcode", { value, showValue, height }, undefined, { showValue: true, height: 64 }),
    accessibility: ["role img named \"Barcode: <value>\"; the printed value is aria-hidden to avoid repeats."],
  }),
  defineDemo({
    id: "watermark",
    name: "Watermark",
    category: "Data Display",
    description: "Faint, rotated text tiled over content in theme colors.",
    exports: ["Watermark"],
    serverSafe: true,
    controls: {
      content: { type: "text", default: "Confidential" },
      rotate: { type: "number", min: -45, max: 45, default: -22 },
      opacity: { type: "number", min: 0.04, max: 0.3, step: 0.01, default: 0.09 },
    },
    render: ({ content, rotate, opacity }) => (
      <Watermark
        content={content}
        rotate={rotate}
        opacity={opacity}
        style={{
          width: 380,
          padding: 24,
          background: "var(--kg-surface)",
          border: "1px solid var(--kg-border)",
          borderRadius: "var(--kg-radius-xl)",
        }}
      >
        <DescriptionList
          layout="inline"
          items={[
            { term: "Candidate", description: "Jonas Berg" },
            { term: "Base", description: "€92,000" },
            { term: "Start", description: "May 4, 2026" },
          ]}
        />
      </Watermark>
    ),
    code: ({ content, rotate, opacity }) =>
      `import { DescriptionList, Watermark } from "kitgrid"\n\n` +
      jsx(
        "Watermark",
        {
          content,
          rotate,
          opacity,
          style: raw(
            `{ width: 380, padding: 24, background: "var(--kg-surface)", border: "1px solid var(--kg-border)", borderRadius: "var(--kg-radius-xl)" }`,
          ),
        },
        `<DescriptionList\n  layout="inline"\n  items={[\n    { term: "Candidate", description: "Jonas Berg" },\n    { term: "Base", description: "€92,000" },\n    { term: "Start", description: "May 4, 2026" },\n  ]}\n/>`,
        { rotate: -22, opacity: 0.09 },
      ),
    accessibility: ["The mark layer is aria-hidden and ignores pointer events."],
  }),
  defineDemo({
    id: "highlight",
    name: "Highlight",
    category: "Data Display",
    description: "Marks search terms in text.",
    exports: ["Highlight"],
    serverSafe: true,
    controls: {
      query: { type: "text", default: "ship" },
      variant: { type: "select", options: ["soft", "underline", "solid"], default: "soft" },
    },
    render: ({ query, variant }) => (
      <p style={{ maxWidth: 340, margin: 0, lineHeight: 1.6 }}>
        <Highlight query={query} variant={variant}>
          Orders ship within 24 hours, and free shipping starts at €50.
        </Highlight>
      </p>
    ),
    code: ({ query, variant }) =>
      `import { Highlight } from "kitgrid"\n\n` +
      jsx("Highlight", { query, variant }, "Orders ship within 24 hours, and free shipping starts at €50.", {
        variant: "soft",
      }),
    accessibility: ["Native mark elements; forced-colors mode uses the system Mark color."],
  }),
  defineDemo({
    id: "truncate-text",
    name: "Truncate Text",
    category: "Data Display",
    description: "One-line truncation at the end, start or middle.",
    exports: ["TruncateText"],
    serverSafe: true,
    controls: {
      position: { type: "select", options: ["middle", "end", "start"], default: "middle" },
      width: { type: "number", min: 80, max: 360, default: 180 },
    },
    render: ({ position, width }) => (
      <div style={{ width }}>
        <TruncateText position={position} tail={8}>
          quarterly-report-2026-final-v3.pdf
        </TruncateText>
      </div>
    ),
    code: ({ position, width }) =>
      `import { TruncateText } from "kitgrid"\n\n<div style={{ width: ${width} }}>\n${indent(
        jsx("TruncateText", { position, tail: 8 }, "quarterly-report-2026-final-v3.pdf", { position: "end" }),
      )}\n</div>`,
    accessibility: ["The full string stays in the DOM and in the title, so nothing is lost to assistive tech."],
  }),
  defineDemo({
    id: "clamp",
    name: "Clamp",
    category: "Data Display",
    description: "Line clamp with a toggle that only shows when needed.",
    exports: ["Clamp"],
    controls: { lines: { type: "number", min: 1, max: 6, default: 2 } },
    render: ({ lines }) => (
      <Clamp lines={lines} style={{ width: 320, lineHeight: 1.6 }}>
        Heavyweight organic cotton, garment-dyed for a lived-in feel from day one. Cut a little
        boxy through the body with dropped shoulders and a ribbed collar. Pre-washed, so it keeps
        its shape.
      </Clamp>
    ),
    code: ({ lines }) =>
      `import { Clamp } from "kitgrid"\n\n` +
      jsx(
        "Clamp",
        { lines, style: raw("{ width: 320, lineHeight: 1.6 }") },
        "Heavyweight organic cotton, garment-dyed for a lived-in feel from day one. Cut a little\nboxy through the body with dropped shoulders and a ribbed collar. Pre-washed, so it keeps\nits shape.",
        { lines: 3 },
      ),
    accessibility: ["The toggle is a button with aria-expanded and aria-controls."],
  }),
  defineDemo({
    id: "relative-time",
    name: "Relative Time",
    category: "Data Display",
    description: "\"3 minutes ago\" that stays fresh, with the exact time on hover.",
    exports: ["RelativeTime"],
    controls: { formatStyle: { type: "select", options: ["long", "short", "narrow"], default: "long" } },
    render: ({ formatStyle }) => (
      <div style={{ display: "grid", gap: 6, fontSize: 14 }}>
        {[-40, -3600 * 5, -86400 * 9].map((s) => (
          <RelativeTime
            key={s}
            formatStyle={formatStyle}
            date={new Date(DEMO_NOW.getTime() + s * 1000)}
            now={DEMO_NOW}
          />
        ))}
      </div>
    ),
    code: ({ formatStyle }) =>
      `import { RelativeTime } from "kitgrid"\n\n` +
      jsx("RelativeTime", { date: raw("new Date(Date.now() - 5 * 3600 * 1000)"), formatStyle }, undefined, {
        formatStyle: "long",
      }),
    accessibility: ["A time element with a machine-readable dateTime and the absolute date as title."],
  }),
  defineDemo({
    id: "formatted-number",
    name: "Formatted Number",
    category: "Data Display",
    description: "Intl number formats: compact, percent, currency, unit, bytes.",
    exports: ["FormattedNumber"],
    serverSafe: true,
    controls: {
      format: {
        type: "select",
        options: ["compact", "currency", "percent", "unit", "bytes", "decimal"],
        default: "compact",
      },
      value: { type: "number", min: -100000, max: 5000000, step: 1, default: 1284500 },
      signed: { type: "boolean", default: false },
    },
    render: ({ format, value, signed }) => (
      <span style={{ fontSize: 32, fontWeight: 650 }}>
        <FormattedNumber
          value={format === "percent" ? value / 1e6 : value}
          format={format}
          currency="EUR"
          unit="kilometer"
          tone={signed ? "signed" : "neutral"}
          signDisplay={signed ? "exceptZero" : "auto"}
        />
      </span>
    ),
    code: ({ format, value, signed }) =>
      `import { FormattedNumber } from "kitgrid"\n\n` +
      jsx(
        "FormattedNumber",
        {
          value: raw(String(format === "percent" ? value / 1e6 : value)),
          format,
          currency: format === "currency" ? "EUR" : undefined,
          unit: format === "unit" ? "kilometer" : undefined,
          tone: signed ? "signed" : undefined,
          signDisplay: signed ? "exceptZero" : undefined,
        },
        undefined,
        { format: "decimal" },
      ),
    accessibility: ["Wrapped in data with the raw value; signed tone keeps the sign as text."],
  }),
  defineDemo({
    id: "status-dot",
    name: "Status Dot",
    category: "Data Display",
    description: "A status marker that always carries a word.",
    exports: ["StatusDot"],
    serverSafe: true,
    controls: {
      status: {
        type: "select",
        options: ["online", "busy", "away", "offline", "success", "warning", "danger", "info"],
        default: "online",
      },
      pulse: { type: "boolean", default: true },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
    },
    render: ({ status, pulse, size }) => (
      <StatusDot status={status} pulse={pulse} size={size}>
        {status[0]?.toUpperCase() + status.slice(1)}
      </StatusDot>
    ),
    code: ({ status, pulse, size }) =>
      `import { StatusDot } from "kitgrid"\n\n` +
      jsx("StatusDot", { status, pulse, size }, status[0]?.toUpperCase() + status.slice(1), {
        status: "online",
        size: "md",
      }),
    accessibility: [
      "With text, the dot is decorative; alone, it is an img named by label or status.",
      "The pulse stops under reduced motion.",
    ],
  }),
  defineDemo({
    id: "usage-meter",
    name: "Usage Meter",
    category: "Data Display",
    description: "Quota as a meter with thresholds and an optional breakdown.",
    exports: ["UsageMeter"],
    serverSafe: true,
    controls: {
      value: { type: "number", min: 0, max: 100, default: 68 },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
    },
    render: ({ value, size }) => (
      <UsageMeter
        label="API calls"
        value={value}
        max={100}
        size={size}
        format={(n) => `${n}k`}
        style={{ width: 320 }}
      />
    ),
    code: ({ value, size }) =>
      `import { UsageMeter } from "kitgrid"\n\n` +
      jsx(
        "UsageMeter",
        {
          label: "API calls",
          value,
          max: 100,
          size,
          format: raw("(n) => `${n}k`"),
          style: raw("{ width: 320 }"),
        },
        undefined,
        { size: "md" },
      ),
    accessibility: ["role meter with value text; warning and danger states are spelled out."],
  }),
]
