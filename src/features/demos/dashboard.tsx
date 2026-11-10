import {
  ActivityFeed,
  type ActivityFeedItem,
  Avatar,
  Breadcrumb,
  Button,
  ChoiceList,
  Counter,
  DataTable,
  Delta,
  DeviationRows,
  FilterBar,
  type FilterBarFilter,
  IconButton,
  InsightList,
  type InsightListItem,
  KpiStrip,
  MemberList,
  type MemberListMember,
  PageHeader,
  Panel,
  PanelActions,
  PanelBody,
  PanelFooter,
  PanelGrid,
  PanelHeader,
  PanelMeta,
  PanelTitle,
  PermissionMatrix,
  Plate,
  Readout,
  RowSplitter,
  SeriesSwatch,
  StatePanel,
} from "kitgrid"
import {
  CalendarDays,
  Download,
  Ellipsis,
  FileSpreadsheet,
  FileText,
  KeyRound,
  RefreshCw,
  Sheet,
  Upload,
} from "lucide-react"
import { useState } from "react"
import { defineDemo, jsx, raw } from "./registry"

const imports = (names: string[]) =>
  `import { ${[...names].sort().join(", ")} } from "kitgrid"\n\n`

const orders = [
  { id: "NW-20481", customer: "Priya Raman", items: 3, total: 248.4, placed: "2026-10-23" },
  { id: "NW-20480", customer: "Mateo Alvarez", items: 1, total: 89, placed: "2026-10-23" },
  { id: "NW-20479", customer: "Hana Kobayashi", items: 5, total: 412.75, placed: "2026-10-22" },
  { id: "NW-20478", customer: "Seun Adeyemi", items: 2, total: 156.2, placed: "2026-10-22" },
  { id: "NW-20477", customer: "Sofia Lindqvist", items: 4, total: 301.9, placed: "2026-10-21" },
]

type Order = (typeof orders)[number]

const ordersCode = `const orders = [
  { id: "NW-20481", customer: "Priya Raman", items: 3, total: 248.4, placed: "2026-10-23" },
  { id: "NW-20480", customer: "Mateo Alvarez", items: 1, total: 89, placed: "2026-10-23" },
  { id: "NW-20479", customer: "Hana Kobayashi", items: 5, total: 412.75, placed: "2026-10-22" },
  { id: "NW-20478", customer: "Seun Adeyemi", items: 2, total: 156.2, placed: "2026-10-22" },
  { id: "NW-20477", customer: "Sofia Lindqvist", items: 4, total: 301.9, placed: "2026-10-21" },
]

`

const columnsCode = `[
    { key: "id", header: "Order", width: "7.5rem" },
    { key: "customer", header: "Customer", rowHeader: true },
    { key: "items", header: "Items", type: "number", width: "5rem" },
    { key: "total", header: "Total", type: "currency", width: "7rem" },
    { key: "placed", header: "Placed", type: "date", width: "7rem" },
  ]`

const OrdersTable = (props: Partial<Parameters<typeof DataTable<Order>>[0]>) => (
  <DataTable<Order>
    caption="Recent orders"
    hideCaption
    columns={[
      { key: "id", header: "Order", width: "7.5rem" },
      { key: "customer", header: "Customer", rowHeader: true },
      { key: "items", header: "Items", type: "number", width: "5rem" },
      { key: "total", header: "Total", type: "currency", width: "7rem" },
      {
        key: "placed",
        header: "Placed",
        type: "date",
        width: "7rem",
        format: { month: "short", day: "numeric", timeZone: "UTC" },
      },
    ]}
    rows={orders}
    sortable
    locale="en-US"
    {...props}
  />
)

const deviations = [
  { id: "conv", label: "Conversion rate", detail: "3.4% vs 3.0%", value: 13.3 },
  { id: "aov", label: "Average order", detail: "$96.40 vs $104.10", value: -7.4 },
  { id: "repeat", label: "Repeat customers", detail: "38% vs 31%", value: 22.6 },
  { id: "ship", label: "Ship time", detail: "1.9 vs 2.3 days", value: -17.4 },
]

const deviationsCode = `const rows = [
  { id: "conv", label: "Conversion rate", detail: "3.4% vs 3.0%", value: 13.3 },
  { id: "aov", label: "Average order", detail: "$96.40 vs $104.10", value: -7.4 },
  { id: "repeat", label: "Repeat customers", detail: "38% vs 31%", value: 22.6 },
  { id: "ship", label: "Ship time", detail: "1.9 vs 2.3 days", value: -17.4 },
]

`

const insights: InsightListItem[] = [
  {
    id: "1",
    title: "Linen overshirts doubled in the West",
    description: "Up from 412 to 866 units after the Oct 14 restock.",
    severity: "high",
    direction: "up",
    impact: 18400,
    impactLabel: "+$18.4k",
  },
  {
    id: "2",
    title: "Marketplace refunds are climbing",
    description: "9.2% of marketplace orders, against 5.1% last month.",
    severity: "medium",
    direction: "up",
    tone: "negative",
    impact: 6200,
    impactLabel: "-$6.2k",
  },
  {
    id: "3",
    title: "Store footfall eased mid-month",
    description: "Weekday visits dipped 4%, weekends held steady.",
    severity: "low",
    direction: "down",
    impact: 2100,
    impactLabel: "-$2.1k",
  },
  {
    id: "4",
    title: "Free shipping lifted basket size",
    description: "Orders between $70 and $80 grew 31%.",
    severity: "low",
    direction: "up",
    impact: 3900,
    impactLabel: "+$3.9k",
  },
]

const insightsCode = `[
    {
      id: "1",
      title: "Linen overshirts doubled in the West",
      description: "Up from 412 to 866 units after the Oct 14 restock.",
      severity: "high",
      direction: "up",
      impact: 18400,
      impactLabel: "+$18.4k",
    },
    {
      id: "2",
      title: "Marketplace refunds are climbing",
      description: "9.2% of marketplace orders, against 5.1% last month.",
      severity: "medium",
      direction: "up",
      tone: "negative",
      impact: 6200,
      impactLabel: "-$6.2k",
    },
    {
      id: "3",
      title: "Store footfall eased mid-month",
      description: "Weekday visits dipped 4%, weekends held steady.",
      severity: "low",
      direction: "down",
      impact: 2100,
      impactLabel: "-$2.1k",
    },
    {
      id: "4",
      title: "Free shipping lifted basket size",
      description: "Orders between $70 and $80 grew 31%.",
      severity: "low",
      direction: "up",
      impact: 3900,
      impactLabel: "+$3.9k",
    },
  ]`

const now = new Date("2026-10-24T16:00:00Z")

const activity: ActivityFeedItem[] = [
  {
    id: "a1",
    actor: "Priya Raman",
    avatar: <Avatar name="Priya Raman" size="sm" />,
    action: "changed access for",
    target: "Finance team",
    time: "2026-10-24T14:12:00Z",
  },
  {
    id: "a2",
    icon: <RefreshCw />,
    tone: "success",
    action: "Nightly sync finished",
    detail: "48,210 rows from 3 sources",
    time: "2026-10-24T02:00:00Z",
  },
  {
    id: "a3",
    actor: "Mateo Alvarez",
    avatar: <Avatar name="Mateo Alvarez" size="sm" />,
    action: "downloaded",
    target: "October orders.csv",
    time: "2026-10-23T09:41:00Z",
  },
  {
    id: "a4",
    icon: <KeyRound />,
    tone: "danger",
    action: "Sign-in blocked for",
    target: "ops@northwind.io",
    time: "2026-10-23T08:22:00Z",
  },
]

const activityCode = `const now = new Date("2026-10-24T16:00:00Z")

`

const activityItemsCode = `[
    {
      id: "a1",
      actor: "Priya Raman",
      avatar: <Avatar name="Priya Raman" size="sm" />,
      action: "changed access for",
      target: "Finance team",
      time: "2026-10-24T14:12:00Z",
    },
    {
      id: "a2",
      icon: <RefreshCw />,
      tone: "success",
      action: "Nightly sync finished",
      detail: "48,210 rows from 3 sources",
      time: "2026-10-24T02:00:00Z",
    },
    {
      id: "a3",
      actor: "Mateo Alvarez",
      avatar: <Avatar name="Mateo Alvarez" size="sm" />,
      action: "downloaded",
      target: "October orders.csv",
      time: "2026-10-23T09:41:00Z",
    },
    {
      id: "a4",
      icon: <KeyRound />,
      tone: "danger",
      action: "Sign-in blocked for",
      target: "ops@northwind.io",
      time: "2026-10-23T08:22:00Z",
    },
  ]`

const members: MemberListMember[] = [
  {
    id: "m1",
    name: "Priya Raman",
    email: "priya@northwind.io",
    role: "Owner",
    roleTone: "accent",
    status: "active",
    self: true,
  },
  {
    id: "m2",
    name: "Mateo Alvarez",
    email: "mateo@northwind.io",
    role: "Editor",
    status: "active",
  },
  {
    id: "m3",
    name: "Hana Kobayashi",
    email: "hana@northwind.io",
    role: "Viewer",
    status: "invited",
  },
  {
    id: "m4",
    name: "Seun Adeyemi",
    email: "seun@northwind.io",
    role: "Editor",
    status: "paused",
    statusLabel: "Paused until Nov 4",
  },
]

const membersCode = `[
    { id: "m1", name: "Priya Raman", email: "priya@northwind.io", role: "Owner", roleTone: "accent", status: "active", self: true },
    { id: "m2", name: "Mateo Alvarez", email: "mateo@northwind.io", role: "Editor", status: "active" },
    { id: "m3", name: "Hana Kobayashi", email: "hana@northwind.io", role: "Viewer", status: "invited" },
    { id: "m4", name: "Seun Adeyemi", email: "seun@northwind.io", role: "Editor", status: "paused", statusLabel: "Paused until Nov 4" },
  ]`

const roles = [
  { id: "owner", label: "Owner" },
  { id: "editor", label: "Editor" },
  { id: "viewer", label: "Viewer" },
]

const permissions = [
  { id: "reports.view", label: "View reports", group: "Reports" },
  { id: "reports.export", label: "Export data", group: "Reports" },
  { id: "people.invite", label: "Invite people", group: "People" },
  { id: "people.roles", label: "Change roles", group: "People" },
  { id: "billing.manage", label: "Manage billing", group: "Account" },
]

const grants = {
  owner: permissions.map((p) => p.id),
  editor: ["reports.view", "reports.export", "people.invite"],
  viewer: ["reports.view"],
}

const permissionsCode = `const roles = [
  { id: "owner", label: "Owner" },
  { id: "editor", label: "Editor" },
  { id: "viewer", label: "Viewer" },
]

const permissions = [
  { id: "reports.view", label: "View reports", group: "Reports" },
  { id: "reports.export", label: "Export data", group: "Reports" },
  { id: "people.invite", label: "Invite people", group: "People" },
  { id: "people.roles", label: "Change roles", group: "People" },
  { id: "billing.manage", label: "Manage billing", group: "Account" },
]

const grants = {
  owner: permissions.map((p) => p.id),
  editor: ["reports.view", "reports.export", "people.invite"],
  viewer: ["reports.view"],
}

`

const Kpis = ({ density }: { density?: "compact" | "default" | "comfortable" }) => (
  <KpiStrip label="Key metrics" density={density} minItemWidth="8.5rem">
    <Readout label="Net revenue" value="$184,920" delta={8.2} caption="vs September" />
    <Readout label="Orders" value="1,918" delta={4.6} caption="vs September" />
    <Readout
      label="Refund rate"
      value="6.1"
      unit="%"
      delta={24.5}
      deltaProps={{ invert: true }}
      caption="vs September"
    />
  </KpiStrip>
)

const kpisCode = `<KpiStrip label="Key metrics"DENSITY minItemWidth="8.5rem">
  <Readout label="Net revenue" value="$184,920" delta={8.2} caption="vs September" />
  <Readout label="Orders" value="1,918" delta={4.6} caption="vs September" />
  <Readout
    label="Refund rate"
    value="6.1"
    unit="%"
    delta={24.5}
    deltaProps={{ invert: true }}
    caption="vs September"
  />
</KpiStrip>`

const FILTERS: FilterBarFilter[] = [
  { id: "region", label: "Region", value: "West, North" },
  { id: "channel", label: "Channel", value: "Online", local: true },
]

const Filters = () => {
  const [filters, setFilters] = useState(FILTERS)
  const [scope, setScope] = useState("all")
  return (
    <FilterBar
      filters={filters}
      onRemove={(id) => setFilters((current) => current.filter((f) => f.id !== id))}
      onReset={() => {
        setFilters([])
        setScope("all")
      }}
      scopes={[
        { value: "all", label: "All stores" },
        { value: "outlet", label: "Outlets" },
      ]}
      scope={scope}
      onScopeChange={setScope}
      scopeLabel="Stores"
    >
      <Button size="sm" variant="outline" leading={<CalendarDays />}>
        Oct 1 to Oct 23
      </Button>
    </FilterBar>
  )
}

const CounterDemo = ({ flash }: { flash: boolean }) => {
  const [value, setValue] = useState(1284)
  return (
    <div className="pg-stack" style={{ justifyItems: "center", gap: 16 }}>
      <span style={{ fontSize: 44, fontWeight: 650, letterSpacing: "-0.03em" }}>
        <Counter value={value} flash={flash} locale="en-US" />
      </span>
      <div className="pg-row">
        <Button size="sm" variant="outline" onClick={() => setValue((v) => v - 48)}>
          Refund
        </Button>
        <Button size="sm" onClick={() => setValue((v) => v + 126)}>
          New orders
        </Button>
      </div>
    </div>
  )
}

const stateCopy = {
  empty: ["No orders in this window", "Widen the date range or drop a filter."],
  loading: ["Loading orders", undefined],
  error: ["Couldn't load orders", "The request timed out. Try again in a moment."],
  unavailable: ["Marketplace data is delayed", "The feed has not updated since 06:00."],
  "no-access": ["You don't have access to billing", "Ask an owner for access."],
} as const

const exportOptions = [
  { value: "csv", label: "CSV", description: "Opens in any spreadsheet", icon: <Sheet /> },
  {
    value: "xlsx",
    label: "Excel workbook",
    description: "Keeps number formats",
    icon: <FileSpreadsheet />,
    aside: "Most used",
  },
  { value: "pdf", label: "PDF report", description: "Ready to print or send", icon: <FileText /> },
]

export const demos = [
  defineDemo({
    id: "panel-grid",
    name: "Panel Grid",
    category: "Dashboard",
    description: "A 12-column grid driven by container queries.",
    exports: ["PanelGrid"],
    serverSafe: true,
    featured: true,
    layout: "fill",
    height: 640,
    controls: {
      variant: { type: "select", options: ["spaced", "seam"], default: "spaced" },
    },
    render: ({ variant }) => (
      <div style={{ padding: 24, width: "100%" }}>
        <PanelGrid variant={variant}>
          <Panel span="full">
            <PanelBody>
              <Kpis />
            </PanelBody>
          </Panel>
          <Panel span={8}>
            <PanelHeader>
              <PanelTitle>Recent orders</PanelTitle>
            </PanelHeader>
            <PanelBody bleed>
              <OrdersTable density="compact" rows={orders.slice(0, 4)} />
            </PanelBody>
          </Panel>
          <Panel span={4} spanMd="full">
            <PanelHeader>
              <PanelTitle>Store vs region</PanelTitle>
            </PanelHeader>
            <PanelBody>
              <DeviationRows rows={deviations.slice(0, 3)} hideRange />
            </PanelBody>
          </Panel>
        </PanelGrid>
      </div>
    ),
    code: ({ variant }) =>
      imports([
        "DataTable",
        "DeviationRows",
        "KpiStrip",
        "Panel",
        "PanelBody",
        "PanelGrid",
        "PanelHeader",
        "PanelTitle",
        "Readout",
      ]) +
      ordersCode +
      deviationsCode +
      jsx(
        "PanelGrid",
        { variant },
        `<Panel span="full">
  <PanelBody>
${kpisCode
  .replace("DENSITY", "")
  .split("\n")
  .map((line) => `    ${line}`)
  .join("\n")}
  </PanelBody>
</Panel>
<Panel span={8}>
  <PanelHeader>
    <PanelTitle>Recent orders</PanelTitle>
  </PanelHeader>
  <PanelBody bleed>
    <DataTable
      caption="Recent orders"
      hideCaption
      density="compact"
      rows={orders.slice(0, 4)}
      columns={${columnsCode.replace(/\n/g, "\n    ")}}
    />
  </PanelBody>
</Panel>
<Panel span={4} spanMd="full">
  <PanelHeader>
    <PanelTitle>Store vs region</PanelTitle>
  </PanelHeader>
  <PanelBody>
    <DeviationRows rows={rows.slice(0, 3)} hideRange />
  </PanelBody>
</Panel>`,
        { variant: "spaced" },
      ),
    accessibility: [
      "A plain layout container with no role; each Panel inside is a named region.",
      "Columns follow the grid's own width (below 40rem everything stacks), so reading order matches source order.",
    ],
  }),
  defineDemo({
    id: "panel",
    name: "Panel",
    category: "Dashboard",
    description: "The dashboard surface with header, body and footer.",
    exports: [
      "Panel",
      "PanelHeader",
      "PanelTitle",
      "PanelMeta",
      "PanelActions",
      "PanelBody",
      "PanelFooter",
    ],
    controls: {
      variant: {
        type: "select",
        options: ["plain", "raised", "inset"],
        default: "plain",
      },
      padding: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      collapsible: { type: "boolean", default: false },
      footer: { type: "boolean", default: true },
    },
    render: ({ variant, padding, collapsible, footer }) => (
      <Panel
        variant={variant}
        padding={padding}
        collapsible={collapsible}
        style={{ width: "26rem", maxWidth: "100%" }}
      >
        <PanelHeader>
          <PanelTitle>Revenue by channel</PanelTitle>
          <PanelMeta>October</PanelMeta>
          <PanelActions>
            <IconButton size="sm" variant="ghost" label="More actions" icon={<Ellipsis />} />
          </PanelActions>
        </PanelHeader>
        <PanelBody>
          <div style={{ display: "grid", gap: 10 }}>
            <Readout layout="inline" label="Online" value="$96,480" delta={11.2} />
            <Readout layout="inline" label="Stores" value="$61,330" delta={-2.4} />
            <Readout layout="inline" label="Marketplace" value="$27,110" delta={6.8} />
          </div>
        </PanelBody>
        {footer && <PanelFooter>Updated 4 minutes ago</PanelFooter>}
      </Panel>
    ),
    code: ({ variant, padding, collapsible, footer }) =>
      imports([
        "IconButton",
        "Panel",
        "PanelActions",
        "PanelBody",
        "PanelHeader",
        "PanelMeta",
        "PanelTitle",
        "Readout",
        ...(footer ? ["PanelFooter"] : []),
      ]) +
      `import { Ellipsis } from "lucide-react"\n\n` +
      jsx(
        "Panel",
        { variant, padding, collapsible },
        `<PanelHeader>
  <PanelTitle>Revenue by channel</PanelTitle>
  <PanelMeta>October</PanelMeta>
  <PanelActions>
    <IconButton size="sm" variant="ghost" label="More actions" icon={<Ellipsis />} />
  </PanelActions>
</PanelHeader>
<PanelBody>
  <div style={{ display: "grid", gap: 10 }}>
    <Readout layout="inline" label="Online" value="$96,480" delta={11.2} />
    <Readout layout="inline" label="Stores" value="$61,330" delta={-2.4} />
    <Readout layout="inline" label="Marketplace" value="$27,110" delta={6.8} />
  </div>
</PanelBody>${footer ? "\n<PanelFooter>Updated 4 minutes ago</PanelFooter>" : ""}`,
        { variant: "plain", padding: "md" },
      ),
    accessibility: [
      "Renders a <section> named by its PanelTitle, so each panel is a landmark region.",
      "Collapsible panels follow the disclosure pattern: the title is a button with aria-expanded and aria-controls.",
      "A folded body is inert, so its links and buttons leave the tab order.",
    ],
  }),
  defineDemo({
    id: "page-header",
    name: "Page Header",
    category: "Dashboard",
    description: "Breadcrumb, title, meta and page actions.",
    exports: ["PageHeader"],
    serverSafe: true,
    layout: "fill",
    controls: {
      size: { type: "select", options: ["md", "lg"], default: "md" },
      rule: { type: "boolean", default: true },
      breadcrumb: { type: "boolean", default: true },
      actions: { type: "boolean", default: true },
    },
    render: ({ size, rule, breadcrumb, actions }) => (
      <div style={{ padding: 32, width: "100%" }}>
        <PageHeader
          title="Store performance"
          description="October, all channels."
          size={size}
          rule={rule}
          breadcrumb={
            breadcrumb ? (
              <Breadcrumb
                items={[
                  { label: "Reports", href: "/components/page-header" },
                  { label: "Store performance" },
                ]}
              />
            ) : undefined
          }
          meta={<span>Data through Oct 23</span>}
          actions={
            actions ? (
              <>
                <Button size="sm" variant="outline" leading={<Download />}>
                  Export
                </Button>
                <Button size="sm">Share</Button>
              </>
            ) : undefined
          }
        />
      </div>
    ),
    code: ({ size, rule, breadcrumb, actions }) =>
      imports([
        "PageHeader",
        ...(breadcrumb ? ["Breadcrumb"] : []),
        ...(actions ? ["Button"] : []),
      ]) +
      (actions ? `import { Download } from "lucide-react"\n\n` : "") +
      jsx(
        "PageHeader",
        {
          title: "Store performance",
          description: "October, all channels.",
          size,
          rule,
          breadcrumb: breadcrumb
            ? raw(
                `<Breadcrumb items={[{ label: "Reports", href: "#" }, { label: "Store performance" }]} />`,
              )
            : undefined,
          meta: "Data through Oct 23",
          actions: actions
            ? raw(`(
    <>
      <Button size="sm" variant="outline" leading={<Download />}>
        Export
      </Button>
      <Button size="sm">Share</Button>
    </>
  )`)
            : undefined,
        },
        undefined,
        { size: "md", rule: true },
      ),
    accessibility: [
      "The title is an h1 by default; titleAs picks another level for nested pages.",
      "The accent rule is decorative and drawn with CSS.",
    ],
  }),
  defineDemo({
    id: "state-panel",
    name: "State Panel",
    category: "Dashboard",
    description: "Empty, loading, error and no-access states.",
    exports: ["StatePanel"],
    serverSafe: true,
    controls: {
      state: {
        type: "select",
        options: ["empty", "loading", "error", "unavailable", "no-access"],
        default: "error",
      },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      framed: { type: "boolean", default: true },
    },
    render: ({ state, size, framed }) => {
      const [title, description] = stateCopy[state]
      return (
        <div style={{ width: "26rem", maxWidth: "100%" }}>
          <StatePanel
            state={state}
            size={size}
            framed={framed}
            title={title}
            description={description}
            action={
              state === "error" ? (
                <Button size="sm" variant="outline" leading={<RefreshCw />}>
                  Try again
                </Button>
              ) : undefined
            }
          />
        </div>
      )
    },
    code: ({ state, size, framed }) => {
      const [title, description] = stateCopy[state]
      return (
        imports(state === "error" ? ["Button", "StatePanel"] : ["StatePanel"]) +
        (state === "error" ? `import { RefreshCw } from "lucide-react"\n\n` : "") +
        jsx(
          "StatePanel",
          {
            state,
            size,
            framed,
            title,
            description,
            action:
              state === "error"
                ? raw(`(
    <Button size="sm" variant="outline" leading={<RefreshCw />}>
      Try again
    </Button>
  )`)
                : undefined,
          },
          undefined,
          { state: "empty", size: "md" },
        )
      )
    },
    accessibility: [
      "The whole state is a status region, so a panel switching to it is announced.",
      "Loading sets aria-busy; the spinner is hidden because the title already says it.",
    ],
  }),
  defineDemo({
    id: "plate",
    name: "Plate",
    category: "Dashboard",
    description: "A recessed area for charts, previews or drops.",
    exports: ["Plate"],
    serverSafe: true,
    controls: {
      variant: {
        type: "select",
        options: ["sunken", "dashed", "grid"],
        default: "dashed",
      },
      padding: { type: "select", options: ["none", "sm", "md", "lg"], default: "lg" },
      marks: { type: "boolean", default: false },
    },
    render: ({ variant, padding, marks }) => (
      <Plate
        variant={variant}
        padding={padding}
        marks={marks}
        style={{ width: "24rem", maxWidth: "100%" }}
      >
        <div
          style={{
            display: "grid",
            justifyItems: "center",
            gap: 8,
            color: "var(--kg-fg-muted)",
            fontSize: 14,
          }}
        >
          <Upload size={18} aria-hidden="true" />
          Drop a CSV here
        </div>
      </Plate>
    ),
    code: ({ variant, padding, marks }) =>
      imports(["Plate"]) +
      `import { Upload } from "lucide-react"\n\n` +
      jsx(
        "Plate",
        { variant, padding, marks },
        `<div style={{ display: "grid", justifyItems: "center", gap: 8 }}>
  <Upload size={18} aria-hidden="true" />
  Drop a CSV here
</div>`,
        { variant: "sunken", padding: "md" },
      ),
    accessibility: [
      "A plain container with no role; give it one (region, group) when it stands alone.",
    ],
  }),
  defineDemo({
    id: "delta",
    name: "Delta",
    category: "Dashboard",
    description: "A signed change with arrow and tone.",
    exports: ["Delta"],
    serverSafe: true,
    controls: {
      value: { type: "number", min: -40, max: 40, step: 0.1, default: 8.2 },
      unit: {
        type: "select",
        options: ["percent", "points", "number"],
        default: "percent",
      },
      variant: { type: "select", options: ["plain", "pill"], default: "pill" },
      invert: { type: "boolean", default: false },
    },
    render: ({ value, unit, variant, invert }) => (
      <Delta value={value} unit={unit} variant={variant} invert={invert} caption="vs September" />
    ),
    code: ({ value, unit, variant, invert }) =>
      imports(["Delta"]) +
      jsx(
        "Delta",
        { value, unit, variant, invert, caption: "vs September" },
        undefined,
        { unit: "percent", variant: "plain" },
      ),
    accessibility: [
      "The direction is read out in words before the figure (up, down, no change); the arrow is hidden.",
      "Locale-free default format, so server and client render the same string.",
    ],
  }),
  defineDemo({
    id: "readout",
    name: "Readout",
    category: "Dashboard",
    description: "A labelled figure with unit and delta.",
    exports: ["Readout"],
    serverSafe: true,
    controls: {
      layout: {
        type: "select",
        options: ["stacked", "compact", "inline"],
        default: "stacked",
      },
      size: { type: "select", options: ["sm", "md", "lg", "xl"], default: "lg" },
      delta: { type: "number", min: -30, max: 30, step: 0.1, default: 8.2 },
      invert: { type: "boolean", default: false },
    },
    render: ({ layout, size, delta, invert }) => (
      <Readout
        style={{ width: layout === "inline" ? 320 : undefined }}
        layout={layout}
        size={size}
        label="Net revenue"
        value="$184,920"
        delta={delta}
        deltaProps={{ invert }}
        caption="vs September"
        marker={<SeriesSwatch index={0} />}
      />
    ),
    code: ({ layout, size, delta, invert }) =>
      imports(["Readout", "SeriesSwatch"]) +
      jsx(
        "Readout",
        {
          layout,
          size,
          label: "Net revenue",
          value: "$184,920",
          delta,
          deltaProps: invert ? raw("{ invert: true }") : undefined,
          caption: "vs September",
          marker: raw("<SeriesSwatch index={0} />"),
        },
        undefined,
        { layout: "stacked", size: "lg" },
      ),
    accessibility: [
      "A description list: the label is the term and the value its definition, so they are read together.",
    ],
  }),
  defineDemo({
    id: "series-swatch",
    name: "Series Swatch",
    category: "Dashboard",
    description: "A legend mark beside a label.",
    exports: ["SeriesSwatch"],
    serverSafe: true,
    controls: {
      shape: {
        type: "select",
        options: ["dot", "square", "line", "dash", "area"],
        default: "dot",
      },
      index: { type: "number", min: 0, max: 7, default: 0 },
      label: { type: "text", default: "Online" },
    },
    render: ({ shape, index, label }) => (
      <SeriesSwatch shape={shape} index={index}>
        {label}
      </SeriesSwatch>
    ),
    code: ({ shape, index, label }) =>
      imports(["SeriesSwatch"]) +
      jsx("SeriesSwatch", { shape, index }, label, { shape: "dot", index: 0 }),
    accessibility: [
      "The mark is aria-hidden; the label text names the series, so colour is never the only key.",
    ],
  }),
  defineDemo({
    id: "kpi-strip",
    name: "KPI Strip",
    category: "Dashboard",
    description: "A row of readouts separated by hairlines.",
    exports: ["KpiStrip"],
    serverSafe: true,
    layout: "fill",
    controls: {
      density: {
        type: "select",
        options: ["compact", "default", "comfortable"],
        default: "default",
      },
    },
    render: ({ density }) => (
      <div style={{ padding: 24, width: "100%", maxWidth: 760, margin: "auto" }}>
        <Panel>
          <PanelBody>
            <Kpis density={density} />
          </PanelBody>
        </Panel>
      </div>
    ),
    code: ({ density }) =>
      imports(["KpiStrip", "Readout"]) +
      kpisCode.replace("DENSITY", density === "default" ? "" : ` density="${density}"`),
    accessibility: [
      "A labelled list with one item per readout, so screen readers announce how many metrics there are.",
    ],
  }),
  defineDemo({
    id: "data-table",
    name: "Data Table",
    category: "Dashboard",
    description: "A sortable, selectable table with densities.",
    exports: ["DataTable"],
    layout: "fill",
    height: 420,
    controls: {
      density: {
        type: "select",
        options: ["compact", "default", "comfortable"],
        default: "default",
      },
      selectable: { type: "boolean", default: true },
      zebra: { type: "boolean", default: false },
      empty: { type: "boolean", default: false, label: "No rows" },
    },
    render: ({ density, selectable, zebra, empty }) => (
      <div style={{ padding: 24, width: "100%", maxWidth: 760, margin: "auto" }}>
        <Panel>
          <PanelBody bleed>
            <OrdersTable
              density={density}
              selectable={selectable}
              zebra={zebra}
              rows={empty ? [] : orders}
              defaultSelected={["NW-20479"]}
              empty={
                <StatePanel
                  size="sm"
                  title="No orders yet"
                  description="Orders show up here as they come in."
                />
              }
            />
          </PanelBody>
        </Panel>
      </div>
    ),
    code: ({ density, selectable, zebra, empty }) =>
      imports(["DataTable", "StatePanel"]) +
      (empty ? "" : ordersCode) +
      jsx(
        "DataTable",
        {
          caption: "Recent orders",
          columns: raw(columnsCode),
          rows: raw(empty ? "[]" : "orders"),
          sortable: true,
          density,
          selectable,
          zebra,
          empty: raw(
            `<StatePanel size="sm" title="No orders yet" description="Orders show up here as they come in." />`,
          ),
        },
        undefined,
        { density: "default" },
      ),
    accessibility: [
      "A real <table> with caption, column headers and row headers, so screen readers navigate it natively.",
      "Sortable headers are buttons inside th elements that carry aria-sort.",
      "Row checkboxes are named after their row key and the header checkbox reports a mixed state.",
    ],
  }),
  defineDemo({
    id: "deviation-rows",
    name: "Deviation Rows",
    category: "Dashboard",
    description: "Signed gaps as bars from zero.",
    exports: ["DeviationRows"],
    serverSafe: true,
    controls: {
      invert: { type: "boolean", default: false },
      oneSided: { type: "boolean", default: false, label: "One-sided" },
    },
    render: ({ invert, oneSided }) => (
      <div style={{ width: "30rem", maxWidth: "100%" }}>
        <DeviationRows
          caption="Store vs region"
          invert={invert}
          rows={
            oneSided
              ? deviations.map((row) => ({ ...row, value: Math.abs(row.value) }))
              : deviations
          }
        />
      </div>
    ),
    code: ({ invert, oneSided }) =>
      imports(["DeviationRows"]) +
      deviationsCode +
      jsx("DeviationRows", {
        caption: "Store vs region",
        rows: raw(oneSided ? "rows.map((row) => ({ ...row, value: Math.abs(row.value) }))" : "rows"),
        invert,
      }),
    accessibility: [
      "A list with one item per row; the signed figure is text, and the bar is aria-hidden.",
      "Bars grow with a transform, so reduced motion shows them at full length at once.",
    ],
  }),
  defineDemo({
    id: "activity-feed",
    name: "Activity Feed",
    category: "Dashboard",
    description: "A timeline of who did what, grouped by day.",
    exports: ["ActivityFeed"],
    serverSafe: true,
    controls: {
      groupByDay: { type: "boolean", default: true },
    },
    render: ({ groupByDay }) => (
      <div style={{ width: "28rem", maxWidth: "100%" }}>
        <ActivityFeed
          items={activity}
          groupByDay={groupByDay}
          now={now}
          timeZone="UTC"
          locale="en-US"
        />
      </div>
    ),
    code: ({ groupByDay }) =>
      imports(["ActivityFeed", "Avatar"]) +
      `import { KeyRound, RefreshCw } from "lucide-react"\n\n` +
      activityCode +
      jsx(
        "ActivityFeed",
        {
          items: raw(activityItemsCode),
          now: raw("now"),
          timeZone: "UTC",
          locale: "en-US",
          groupByDay,
        },
        undefined,
        { groupByDay: true },
      ),
    accessibility: [
      "Each day is a region named by its heading; events are an ordered list.",
      "Times are <time> elements with a machine-readable datetime.",
      "Pass now when rendering on the server so Today and Yesterday agree after hydration.",
    ],
  }),
  defineDemo({
    id: "permission-matrix",
    name: "Permission Matrix",
    category: "Dashboard",
    description: "Roles across, permissions down.",
    exports: ["PermissionMatrix"],
    layout: "fill",
    height: 500,
    controls: {
      control: { type: "select", options: ["checkbox", "switch"], default: "checkbox" },
      columnToggles: { type: "boolean", default: true },
      disabled: { type: "boolean", default: false },
    },
    render: ({ control, columnToggles, disabled }) => (
      <div style={{ padding: 24, width: "100%", maxWidth: 640, margin: "auto" }}>
        <PermissionMatrix
          caption="Role permissions"
          hideCaption
          roles={roles}
          permissions={permissions}
          defaultValue={grants}
          locked={{ owner: ["billing.manage", "people.roles"] }}
          control={control}
          columnToggles={columnToggles}
          disabled={disabled}
        />
      </div>
    ),
    code: ({ control, columnToggles, disabled }) =>
      imports(["PermissionMatrix"]) +
      permissionsCode +
      jsx(
        "PermissionMatrix",
        {
          caption: "Role permissions",
          roles: raw("roles"),
          permissions: raw("permissions"),
          defaultValue: raw("grants"),
          locked: raw('{ owner: ["billing.manage", "people.roles"] }'),
          control,
          columnToggles,
          disabled,
        },
        undefined,
        { control: "checkbox" },
      ),
    accessibility: [
      'role="grid" with a single Tab stop. Arrow keys move between cells, Home and End to the row ends. Space toggles.',
      'Each control is named by its permission and role headers, e.g. "Export data Editor".',
      "Locked cells are disabled and skipped by the arrow keys.",
    ],
  }),
  defineDemo({
    id: "member-list",
    name: "Member List",
    category: "Dashboard",
    description: "People with access, role and status.",
    exports: ["MemberList"],
    serverSafe: true,
    layout: "fill",
    controls: {
      density: { type: "select", options: ["compact", "default"], default: "default" },
      actions: { type: "boolean", default: true },
    },
    render: ({ density, actions }) => (
      <div style={{ padding: 24, width: "100%", maxWidth: 640, margin: "auto" }}>
        <MemberList
          aria-label="People"
          members={members}
          density={density}
          actions={
            actions
              ? (member) => (
                  <IconButton
                    size="sm"
                    variant="ghost"
                    label={`More actions for ${member.name}`}
                    icon={<Ellipsis />}
                  />
                )
              : undefined
          }
        />
      </div>
    ),
    code: ({ density, actions }) =>
      imports(actions ? ["IconButton", "MemberList"] : ["MemberList"]) +
      (actions ? `import { Ellipsis } from "lucide-react"\n\n` : "") +
      jsx(
        "MemberList",
        {
          "aria-label": "People",
          members: raw(membersCode),
          density,
          actions: actions
            ? raw(`(member) => (
    <IconButton
      size="sm"
      variant="ghost"
      label={\`More actions for \${member.name}\`}
      icon={<Ellipsis />}
    />
  )`)
            : undefined,
        },
        undefined,
        { density: "default" },
      ),
    accessibility: [
      "A list of people; the avatar is hidden because the name next to it already says who it is.",
      "Status is always written out (Active, Invited, Paused), never shown by colour alone.",
    ],
  }),
  defineDemo({
    id: "insight-list",
    name: "Insight List",
    category: "Dashboard",
    description: "Findings with direction, severity and impact.",
    exports: ["InsightList"],
    controls: {
      maxVisible: { type: "number", min: 1, max: 4, default: 3 },
    },
    render: ({ maxVisible }) => (
      <div style={{ width: "28rem", maxWidth: "100%" }}>
        <InsightList items={insights} maxVisible={maxVisible} />
      </div>
    ),
    code: ({ maxVisible }) =>
      imports(["InsightList"]) +
      jsx("InsightList", { items: raw(insightsCode), maxVisible }, undefined, {
        maxVisible: 5,
      }),
    accessibility: [
      'An ordered list; severity is spoken with a hidden "Severity:" prefix.',
      "The Show all button reports aria-expanded and controls the list.",
    ],
  }),
  defineDemo({
    id: "filter-bar",
    name: "Filter Bar",
    category: "Dashboard",
    description: "Scope, applied filter chips and reset.",
    exports: ["FilterBar"],
    layout: "fill",
    height: 160,
    render: () => (
      <div style={{ padding: 24, width: "100%" }}>
        <Filters />
      </div>
    ),
    code: () =>
      imports(["Button", "FilterBar"]) +
      `import { CalendarDays } from "lucide-react"
import { useState } from "react"

const initial = [
  { id: "region", label: "Region", value: "West, North" },
  { id: "channel", label: "Channel", value: "Online", local: true },
]

function Example() {
  const [filters, setFilters] = useState(initial)
  const [scope, setScope] = useState("all")
  return (
    <FilterBar
      filters={filters}
      onRemove={(id) => setFilters((current) => current.filter((f) => f.id !== id))}
      onReset={() => {
        setFilters([])
        setScope("all")
      }}
      scopes={[
        { value: "all", label: "All stores" },
        { value: "outlet", label: "Outlets" },
      ]}
      scope={scope}
      onScopeChange={setScope}
      scopeLabel="Stores"
    >
      <Button size="sm" variant="outline" leading={<CalendarDays />}>
        Oct 1 to Oct 23
      </Button>
    </FilterBar>
  )
}

<Example />`,
    accessibility: [
      "A labelled group. The scope is a menu button with radio items.",
      "Each remove button names the filter it clears.",
      "Filters set on this view alone are tinted with the accent and still read the same in words.",
    ],
  }),
  defineDemo({
    id: "row-splitter",
    name: "Row Splitter",
    category: "Dashboard",
    description: "Two panes with a draggable separator.",
    exports: ["RowSplitter"],
    layout: "fill",
    height: 380,
    controls: {
      orientation: {
        type: "select",
        options: ["horizontal", "vertical"],
        default: "horizontal",
      },
      min: { type: "number", min: 10, max: 45, step: 5, default: 25 },
      max: { type: "number", min: 55, max: 90, step: 5, default: 75 },
    },
    render: ({ orientation, min, max }) => (
      <div style={{ padding: 24, width: "100%", height: 340 }}>
        <RowSplitter
          key={orientation}
          orientation={orientation}
          min={min}
          max={max}
          defaultValue={60}
          label="Resize panes"
          style={{ height: "100%" }}
        >
          <Plate variant="grid" style={{ height: "100%" }} />
          <Plate variant="sunken" style={{ height: "100%" }} />
        </RowSplitter>
      </div>
    ),
    code: ({ orientation, min, max }) =>
      imports(["Plate", "RowSplitter"]) +
      jsx(
        "RowSplitter",
        {
          orientation,
          min,
          max,
          defaultValue: 60,
          label: "Resize panes",
          style: raw(`{ height: 320 }`),
        },
        `<Plate variant="grid" style={{ height: "100%" }} />\n<Plate variant="sunken" style={{ height: "100%" }} />`,
        { orientation: "horizontal", min: 20, max: 80 },
      ),
    accessibility: [
      "The window splitter pattern: a focusable separator with aria-valuenow, aria-valuemin, aria-valuemax and aria-controls.",
      "Arrow keys move it by the step (Shift for five steps), Home and End jump to the limits, Enter restores the default.",
    ],
  }),
  defineDemo({
    id: "counter",
    name: "Counter",
    category: "Dashboard",
    description: "A live figure that tweens on refresh.",
    exports: ["Counter"],
    controls: {
      flash: { type: "boolean", default: true },
    },
    render: ({ flash }) => <CounterDemo flash={flash} />,
    code: ({ flash }) =>
      imports(["Button", "Counter"]) +
      `import { useState } from "react"

function Example() {
  const [value, setValue] = useState(1284)
  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 16 }}>
      <span style={{ fontSize: 44, fontWeight: 650 }}>
        <Counter value={value}${flash ? "" : " flash={false}"} locale="en-US" />
      </span>
      <div style={{ display: "flex", gap: 8 }}>
        <Button size="sm" variant="outline" onClick={() => setValue((v) => v - 48)}>
          Refund
        </Button>
        <Button size="sm" onClick={() => setValue((v) => v + 126)}>
          New orders
        </Button>
      </div>
    </div>
  )
}

<Example />`,
    accessibility: [
      "Only the final formatted value is exposed to assistive tech; in-between frames are hidden.",
      "Under reduced motion the figure snaps to the new value and the flash is removed.",
    ],
  }),
  defineDemo({
    id: "choice-list",
    name: "Choice List",
    category: "Dashboard",
    description: "A single choice presented as cards.",
    exports: ["ChoiceList"],
    controls: {
      layout: { type: "select", options: ["list", "grid"], default: "list" },
      size: { type: "select", options: ["sm", "md"], default: "md" },
    },
    render: ({ layout, size }) => (
      <div style={{ width: layout === "grid" ? "40rem" : "24rem", maxWidth: "100%" }}>
        <ChoiceList
          label="Export format"
          layout={layout}
          size={size}
          defaultValue="xlsx"
          options={exportOptions}
        />
      </div>
    ),
    code: ({ layout, size }) =>
      imports(["ChoiceList"]) +
      `import { FileSpreadsheet, FileText, Sheet } from "lucide-react"\n\n` +
      jsx(
        "ChoiceList",
        {
          label: "Export format",
          defaultValue: "xlsx",
          layout,
          size,
          options: raw(`[
    { value: "csv", label: "CSV", description: "Opens in any spreadsheet", icon: <Sheet /> },
    {
      value: "xlsx",
      label: "Excel workbook",
      description: "Keeps number formats",
      icon: <FileSpreadsheet />,
      aside: "Most used",
    },
    { value: "pdf", label: "PDF report", description: "Ready to print or send", icon: <FileText /> },
  ]`),
        },
        undefined,
        { layout: "list", size: "md" },
      ),
    accessibility: [
      "Native radio inputs in a named radiogroup: Tab enters the group, arrow keys move and select.",
      "Descriptions are linked with aria-describedby.",
    ],
  }),
]
