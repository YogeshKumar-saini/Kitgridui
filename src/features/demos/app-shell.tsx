import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellSidebar,
  AppShellToggle,
  Breadcrumb,
  Button,
  Coachmark,
  type CommandPaletteGroup,
  CommandPalette,
  ConfirmButton,
  DateInput,
  DateRangePicker,
  type DateRangePickerValue,
  FetchProgress,
  Field,
  FilterChips,
  FilterSheet,
  FilterSheetSection,
  HintLayer,
  IconButton,
  Kbd,
  SearchField,
  SettingsNav,
  SettingsNavItem,
  ShortcutTable,
  type ShortcutTableItem,
  SidebarNav,
  SidebarNavGroup,
  SidebarNavItem,
  SidebarNavSection,
  Skeleton,
  SkipLink,
  Stat,
  Switch,
  Topbar,
  useAppShell,
  useCommandShortcut,
} from "kitgrid"
import {
  Bell,
  ChartColumn,
  Download,
  FileText,
  Inbox,
  Keyboard,
  LayoutDashboard,
  Palette,
  RefreshCw,
  Search,
  Settings,
  ShoppingBag,
  Store,
  SunMoon,
  Tag,
  Trash2,
  Users,
} from "lucide-react"
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { defineDemo, jsx } from "./registry"

const surface = {
  background: "var(--kg-surface)",
  border: "2px solid var(--kg-ink)",
  borderRadius: "var(--kg-radius-xl)",
  boxShadow: "var(--kg-shadow-sm)",
} as const

type Page = "overview" | "sales" | "weekly" | "monthly" | "alerts"

const pageLabels: Record<Page, string> = {
  overview: "Overview",
  sales: "Sales",
  weekly: "Weekly trading",
  monthly: "Monthly close",
  alerts: "Alerts",
}

const Brand = () => {
  const shell = useAppShell()
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: shell?.collapsed ? "center" : undefined,
        gap: 10,
        padding: "4px 6px 8px",
        minWidth: 0,
      }}
    >
      <span
        aria-hidden
        style={{
          flexShrink: 0,
          width: 26,
          height: 26,
          borderRadius: "var(--kg-radius-full)",
          background: "var(--kg-paper-sage)",
          border: "2px solid var(--kg-ink)",
        }}
      />
      <span className={shell?.collapsed ? "pg-sr" : undefined} style={{ fontWeight: 650, whiteSpace: "nowrap" }}>
        Halcyon
      </span>
    </div>
  )
}

const MainNav = ({
  page,
  onNavigate,
  collapsed,
  badges = true,
}: {
  page: Page
  onNavigate: (page: Page) => void
  collapsed?: boolean
  badges?: boolean
}) => {
  const item = (id: Page, icon: ReactNode, badge?: string) => (
    <SidebarNavItem
      key={id}
      href={`#${id}`}
      icon={icon}
      badge={badges ? badge : undefined}
      active={page === id}
      onClick={(event) => {
        event.preventDefault()
        onNavigate(id)
      }}
    >
      {pageLabels[id]}
    </SidebarNavItem>
  )
  const inReports = page === "weekly" || page === "monthly"
  return (
    <SidebarNav label="Main" collapsed={collapsed}>
      <SidebarNavSection title="Read">
        {item("overview", <LayoutDashboard />)}
        {item("sales", <ChartColumn />)}
        <SidebarNavGroup label="Reports" icon={<FileText />} defaultOpen={inReports} active={inReports}>
          {item("weekly", null)}
          {item("monthly", null)}
        </SidebarNavGroup>
      </SidebarNavSection>
      <SidebarNavSection title="Workspace">
        {item("alerts", <Inbox />, "12")}
        <SidebarNavItem href="#team" icon={<Users />} onClick={(e) => e.preventDefault()}>
          Team
        </SidebarNavItem>
      </SidebarNavSection>
    </SidebarNav>
  )
}

const brands = [
  { value: "zudio", label: "Zudio", count: 412 },
  { value: "westside", label: "Westside", count: 298 },
  { value: "misbu", label: "Misbu", count: 87 },
]
const regions = [
  { value: "north", label: "North", count: 61 },
  { value: "south", label: "South", count: 74 },
  { value: "west", label: "West", count: 69 },
]

const useFilters = () => {
  const [brand, setBrand] = useState<string[]>(["zudio"])
  const [region, setRegion] = useState<string[]>([])
  const [online, setOnline] = useState(false)
  const count = brand.length + region.length + (online ? 1 : 0)
  const reset = () => {
    setBrand([])
    setRegion([])
    setOnline(false)
  }
  const fields = (
    <>
      <FilterSheetSection title="Brand" icon={<Tag />} count={brand.length} onClear={() => setBrand([])}>
        <FilterChips label="Brand" options={brands} value={brand} onValueChange={setBrand} />
      </FilterSheetSection>
      <FilterSheetSection title="Region" icon={<Store />} count={region.length} onClear={() => setRegion([])}>
        <FilterChips label="Region" options={regions} value={region} onValueChange={setRegion} />
      </FilterSheetSection>
      <FilterSheetSection title="Channel" icon={<ShoppingBag />} count={online ? 1 : 0}>
        <Switch checked={online} onCheckedChange={setOnline} label="Online orders only" />
      </FilterSheetSection>
    </>
  )
  return { count, reset, fields }
}

const MiniApp = ({
  collapsed: collapsedProp,
  mobile,
  sidebarWidth,
}: {
  collapsed: boolean
  mobile: boolean
  sidebarWidth: string
}) => {
  const [collapsed, setCollapsed] = useState(collapsedProp)
  const [page, setPage] = useState<Page>("overview")
  const [commandOpen, setCommandOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const timer = useRef<number>(0)

  useEffect(() => setCollapsed(collapsedProp), [collapsedProp])
  useEffect(() => () => window.clearTimeout(timer.current), [])
  useCommandShortcut(() => setCommandOpen((open) => !open), { keys: ["mod", "j"] })

  const navigate = (next: Page) => {
    setPage(next)
    setLoading(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setLoading(false), 1200)
  }

  const groups: CommandPaletteGroup[] = [
    {
      heading: "Pages",
      items: (Object.keys(pageLabels) as Page[]).map((id) => ({
        id,
        label: pageLabels[id],
        icon: <FileText />,
        onSelect: () => navigate(id),
      })),
    },
  ]

  return (
    <AppShell
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
      mobileQuery={mobile ? "all" : undefined}
      sidebarWidth={sidebarWidth}
      style={{ height: "100%", position: "relative" }}
    >
      <AppShellSidebar label="Workspace">
        <Brand />
        <MainNav page={page} onNavigate={navigate} />
      </AppShellSidebar>

      <AppShellHeader>
        <FetchProgress active={loading} label="Loading page" />
        <Topbar
          leading={<AppShellToggle />}
          breadcrumb={<Breadcrumb items={[{ label: "Halcyon", href: "#" }, { label: pageLabels[page] }]} />}
          actions={
            <>
              <IconButton label="Search" icon={<Search />} onClick={() => setCommandOpen(true)} />
              <IconButton label="Notifications" icon={<Bell />} />
            </>
          }
        />
      </AppShellHeader>

      <AppShellMain>
        <div style={{ display: "grid", gap: 16, padding: "24px 28px 40px" }}>
          <h1 style={{ margin: 0, fontSize: "var(--kg-text-xl)", letterSpacing: "-0.02em" }}>{pageLabels[page]}</h1>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            {[
              { label: "Net sales", value: "₹4.82 Cr", delta: 8.4 },
              { label: "Orders", value: "61,240", delta: 3.1 },
              { label: "Return rate", value: "6.2%", delta: -0.8, invert: true },
            ].map((stat) => (
              <div key={stat.label} style={{ ...surface, padding: 16 }}>
                <Stat label={stat.label} value={stat.value} delta={stat.delta} invertDelta={stat.invert} size="sm" />
              </div>
            ))}
          </div>
          <div style={{ ...surface, display: "grid", gap: 14, padding: 20 }}>
            <Skeleton width="40%" height={14} />
            <Skeleton height={140} />
          </div>
        </div>
      </AppShellMain>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} groups={groups} placeholder="Jump to a page" />
    </AppShell>
  )
}

const SidebarNavDemo = ({ collapsed, badges }: { collapsed: boolean; badges: boolean }) => {
  const [page, setPage] = useState<Page>("sales")
  return (
    <div
      style={{
        ...surface,
        width: collapsed ? 76 : 248,
        padding: 12,
        transition: "width var(--kg-duration-slow) var(--kg-ease-out)",
      }}
    >
      <MainNav page={page} onNavigate={setPage} collapsed={collapsed} badges={badges} />
    </div>
  )
}

const TopbarDemo = ({ elevated, search }: { elevated: boolean; search: boolean }) => (
  <div style={{ ...surface, width: 760, maxWidth: "100%", overflow: "hidden" }}>
    <Topbar
      elevated={elevated}
      leading={<IconButton label="Open navigation" icon={<LayoutDashboard />} size="sm" />}
      breadcrumb={<Breadcrumb items={[{ label: "Reports", href: "#" }, { label: "Weekly trading" }]} />}
      search={search ? <SearchField size="sm" shortcut={["/"]} placeholder="Search reports" /> : undefined}
      actions={
        <Button size="sm" leading={<Download />}>
          Export
        </Button>
      }
    />
    <div style={{ display: "grid", gap: 10, padding: 20, background: "var(--kg-bg)" }}>
      <Skeleton width="30%" height={12} />
      <Skeleton height={64} />
    </div>
  </div>
)

const paletteGroups: CommandPaletteGroup[] = [
  {
    heading: "Pages",
    items: [
      { id: "overview", label: "Overview", icon: <LayoutDashboard /> },
      { id: "sales", label: "Sales", icon: <ChartColumn /> },
      { id: "weekly", label: "Weekly trading", hint: "Reports", icon: <FileText /> },
    ],
  },
  {
    heading: "Actions",
    items: [
      { id: "theme", label: "Switch theme", icon: <SunMoon />, shortcut: ["mod", "shift", "l"] },
      { id: "export", label: "Export as CSV", icon: <Download />, shortcut: ["mod", "shift", "e"] },
    ],
  },
]

const CommandPaletteDemo = ({ footer, placeholder }: { footer: boolean; placeholder: string }) => {
  const [open, setOpen] = useState(false)
  useCommandShortcut(() => setOpen((value) => !value), { keys: ["mod", "j"] })
  return (
    <>
      <Button variant="outline" leading={<Search />} onClick={() => setOpen(true)}>
        Search <Kbd keys={["mod", "j"]} size="sm" />
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={paletteGroups}
        placeholder={placeholder}
        footer={footer ? undefined : false}
      />
    </>
  )
}

const FetchProgressDemo = ({
  mode,
  value,
  delay,
}: {
  mode: "indeterminate" | "determinate"
  value: number
  delay: number
}) => (
  <div style={{ ...surface, position: "relative", width: 480, maxWidth: "100%", overflow: "hidden" }}>
    <FetchProgress active delay={delay} value={mode === "determinate" ? value : undefined} label="Updating sales data" />
    <div style={{ display: "grid", gap: 10, padding: 20 }}>
      <Skeleton width="45%" height={14} />
      <Skeleton lines={2} />
    </div>
  </div>
)

const SkipLinkDemo = () => {
  const link = useRef<HTMLAnchorElement>(null)
  return (
    <div style={{ ...surface, position: "relative", width: 440, maxWidth: "100%", padding: "56px 20px 20px" }}>
      <SkipLink ref={link} target="demo-skip-main" />
      <div id="demo-skip-main" style={{ display: "grid", gap: 10 }}>
        <Skeleton width="50%" height={14} />
        <Skeleton lines={2} />
      </div>
      <Button size="sm" variant="soft" style={{ marginTop: 16 }} onClick={() => link.current?.focus()}>
        Focus the skip link
      </Button>
    </div>
  )
}

const DateInputDemo = ({ size, clearable, disabled }: { size: "sm" | "md" | "lg"; clearable: boolean; disabled: boolean }) => {
  const [value, setValue] = useState("2026-10-20")
  return (
    <div style={{ width: 260 }}>
      <Field label="Invoice day">
        <DateInput size={size} clearable={clearable} disabled={disabled} value={value} onValueChange={setValue} />
      </Field>
    </div>
  )
}

const DateRangeDemo = ({ size, presets }: { size: "sm" | "md" | "lg"; presets: boolean }) => {
  const [range, setRange] = useState<DateRangePickerValue | null>({ start: "2026-10-01", end: "2026-10-24" })
  return (
    <DateRangePicker
      size={size}
      today="2026-10-24"
      max="2026-10-24"
      presets={presets ? undefined : []}
      value={range}
      onValueChange={setRange}
    />
  )
}

const products = ["Linen overshirt", "Merino socks", "Canvas tote", "Denim jacket", "Leather sandals"]

const SearchFieldDemo = ({ size, debounce, shortcut }: { size: "sm" | "md" | "lg"; debounce: number; shortcut: boolean }) => {
  const [query, setQuery] = useState("")
  const hits = useMemo(() => products.filter((name) => name.toLowerCase().includes(query.toLowerCase())), [query])
  return (
    <div style={{ display: "grid", gap: 12, width: 300 }}>
      <SearchField
        label="Search products"
        placeholder="Search products"
        size={size}
        debounce={debounce}
        shortcut={shortcut ? ["/"] : undefined}
        onSearch={setQuery}
      />
      <ul style={{ margin: 0, paddingInlineStart: 18, color: "var(--kg-fg-muted)", fontSize: "var(--kg-text-sm)" }}>
        {hits.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  )
}

const TourDemo = () => {
  const search = useRef<HTMLButtonElement>(null)
  const filters = useRef<HTMLButtonElement>(null)
  const exportButton = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 24 }}>
      <HintLayer />
      <div style={{ ...surface, display: "flex", gap: 4, padding: 6 }}>
        <Button ref={search} variant="ghost" leading={<Search />} data-hint="Search pages and actions">
          Search
        </Button>
        <Button ref={filters} variant="ghost" leading={<Tag />} data-hint="Filter every chart">
          Filters
        </Button>
        <Button ref={exportButton} variant="ghost" leading={<Download />} data-hint="Download as CSV">
          Export
        </Button>
      </div>
      <Button onClick={() => setOpen(true)}>Start the tour</Button>
      <Coachmark
        open={open}
        onOpenChange={setOpen}
        steps={[
          { target: search, title: "Find anything", content: "Pages and actions in one search." },
          { target: filters, title: "Narrow the view", content: "Filters apply to every chart." },
          { target: exportButton, title: "Share what you see", content: "Exports keep your filters." },
        ]}
      />
    </div>
  )
}

const shortcuts: ShortcutTableItem[] = [
  { group: "General", description: "Open command palette", keys: ["mod", "k"] },
  { group: "General", description: "Focus search", keys: [["/"], ["mod", "f"]] },
  { group: "Navigation", description: "Toggle sidebar", keys: ["mod", "b"] },
  { group: "Navigation", description: "Next page", keys: ["j"] },
]

const sections = [
  { id: "appearance", label: "Appearance", description: "Theme and density", icon: <Palette /> },
  { id: "notifications", label: "Notifications", description: "Alerts and digests", icon: <Bell /> },
  { id: "shortcuts", label: "Shortcuts", description: "Keyboard reference", icon: <Keyboard /> },
  { id: "account", label: "Account", description: "Profile and security", icon: <Settings /> },
]

const SettingsDemo = () => {
  const [active, setActive] = useState("appearance")
  const current = sections.find((section) => section.id === active)
  return (
    <div
      style={{
        ...surface,
        display: "grid",
        gridTemplateColumns: "minmax(0, 230px) minmax(0, 1fr)",
        gap: 24,
        width: 680,
        maxWidth: "100%",
        padding: 12,
      }}
    >
      <SettingsNav>
        {sections.map((section) => (
          <SettingsNavItem
            key={section.id}
            icon={section.icon}
            description={section.description}
            active={section.id === active}
            onClick={() => setActive(section.id)}
          >
            {section.label}
          </SettingsNavItem>
        ))}
      </SettingsNav>
      <div style={{ display: "grid", alignContent: "start", gap: 12, padding: "10px 8px" }}>
        <h3 style={{ margin: 0, fontSize: "var(--kg-text-lg)" }}>{current?.label}</h3>
        <Skeleton lines={3} />
        <Skeleton height={56} />
      </div>
    </div>
  )
}

const FilterSheetDemo = ({ side }: { side: "right" | "left" | "bottom" }) => {
  const filters = useFilters()
  return (
    <FilterSheet side={side} activeCount={filters.count} onReset={filters.reset}>
      {filters.fields}
    </FilterSheet>
  )
}

const sizeControl = { type: "select", options: ["sm", "md", "lg"], default: "md" } as const

const indent = (text: string, by = "  ") =>
  text
    .split("\n")
    .map((line) => by + line)
    .join("\n")

export const demos = [
  defineDemo({
    id: "app-shell",
    name: "App Shell",
    category: "App Shell",
    featured: true,
    description: "Sidebar, header and main region with a skip link.",
    exports: ["AppShell", "AppShellSidebar", "AppShellHeader", "AppShellMain", "AppShellToggle", "useAppShell"],
    layout: "fill",
    height: 600,
    controls: {
      collapsed: { type: "boolean", default: false, label: "Rail (collapsed)" },
      mobile: { type: "boolean", default: false, label: "Force mobile layout" },
      sidebarWidth: { type: "select", options: ["14rem", "16rem", "18rem"], default: "16rem", label: "Sidebar width" },
    },
    render: (values) => <MiniApp {...values} />,
    code: ({ collapsed, mobile, sidebarWidth }) =>
      jsx(
        "AppShell",
        { defaultCollapsed: collapsed, mobileQuery: mobile ? "all" : undefined, sidebarWidth, style: { height: 480 } },
        `<AppShellSidebar label="Workspace">
  <SidebarNav label="Main">
    <SidebarNavSection title="Read">
      <SidebarNavItem href="#overview" icon={<LayoutDashboard />} active>
        Overview
      </SidebarNavItem>
      <SidebarNavItem href="#sales" icon={<ChartColumn />}>
        Sales
      </SidebarNavItem>
      <SidebarNavItem href="#alerts" icon={<Inbox />} badge="12">
        Alerts
      </SidebarNavItem>
    </SidebarNavSection>
  </SidebarNav>
</AppShellSidebar>
<AppShellHeader>
  <Topbar
    leading={<AppShellToggle />}
    breadcrumb={<Breadcrumb items={[{ label: "Halcyon", href: "#" }, { label: "Overview" }]} />}
  />
</AppShellHeader>
<AppShellMain>
  <div style={{ display: "grid", gap: 12, padding: 24 }}>
    <Skeleton width="40%" height={16} />
    <Skeleton height={160} />
  </div>
</AppShellMain>`,
        { defaultCollapsed: false, sidebarWidth: "16rem" },
      ),
    accessibility: [
      "Renders complementary (sidebar), banner (header) and main landmarks; main takes focus with tabindex -1.",
      "The built-in skip link is the first tab stop and moves focus to main by hand, so it also works under hash routers.",
      'AppShellToggle exposes aria-expanded and aria-controls on desktop, and aria-haspopup="dialog" when it opens the mobile drawer.',
      "On mobile the sidebar is a modal <dialog> drawer: inert page, Escape closes, focus returns to the toggle. Choosing a page closes it.",
      "Collapsed state can persist in localStorage (storageKey); widths are the --kg-app-shell-sidebar and --kg-app-shell-rail variables.",
    ],
  }),
  defineDemo({
    id: "sidebar-nav",
    name: "Sidebar Nav",
    category: "App Shell",
    description: "Sections, items, groups and a current-page mark.",
    exports: ["SidebarNav", "SidebarNavSection", "SidebarNavItem", "SidebarNavGroup"],
    height: 480,
    controls: {
      collapsed: { type: "boolean", default: false, label: "Rail (collapsed)" },
      badges: { type: "boolean", default: true, label: "Badges" },
    },
    render: (values) => <SidebarNavDemo {...values} />,
    code: ({ collapsed, badges }) =>
      jsx(
        "SidebarNav",
        { label: "Main", collapsed },
        `<SidebarNavSection title="Read">
  <SidebarNavItem href="#overview" icon={<LayoutDashboard />} active>
    Overview
  </SidebarNavItem>
  <SidebarNavItem href="#alerts" icon={<Inbox />}${badges ? ' badge="12"' : ""}>
    Alerts
  </SidebarNavItem>
  <SidebarNavGroup label="Reports" icon={<FileText />}>
    <SidebarNavItem href="#weekly">Weekly trading</SidebarNavItem>
    <SidebarNavItem href="#monthly">Monthly close</SidebarNavItem>
  </SidebarNavGroup>
</SidebarNavSection>`,
        { label: "Main", collapsed: false },
      ),
    accessibility: [
      "A labelled navigation landmark; each titled section is a list labelled by its title.",
      "Up and Down Arrow, Home and End move focus between visible items; links inside a closed group are skipped.",
      "Groups are disclosure buttons with aria-expanded; Right Arrow opens, Left Arrow closes. In the rail, opening a group widens the sidebar.",
      'The current page has aria-current="page" and is marked by weight, surface and an accent bar, not colour alone.',
      "In the rail, labels stay in the accessibility tree and show as tooltips on hover and focus.",
    ],
  }),
  defineDemo({
    id: "topbar",
    name: "Topbar",
    category: "App Shell",
    serverSafe: true,
    description: "Breadcrumb, search and action slots in one bar.",
    exports: ["Topbar"],
    height: 300,
    controls: {
      elevated: { type: "boolean", default: true, label: "Elevated" },
      search: { type: "boolean", default: true, label: "Search slot" },
    },
    render: (values) => <TopbarDemo {...values} />,
    code: ({ elevated, search }) => `<Topbar${elevated ? "\n  elevated" : ""}
  leading={<IconButton label="Open navigation" icon={<LayoutDashboard />} size="sm" />}
  breadcrumb={<Breadcrumb items={[{ label: "Reports", href: "#" }, { label: "Weekly trading" }]} />}${
    search ? `\n  search={<SearchField size="sm" shortcut={["/"]} placeholder="Search reports" />}` : ""
  }
  actions={<Button size="sm" leading={<Download />}>Export</Button>}
/>`,
    accessibility: [
      "Purely layout and server-safe: landmarks come from AppShellHeader or your own <header>.",
      "Slots keep DOM order (leading, trail, search, actions), so tab order matches what you see.",
    ],
  }),
  defineDemo({
    id: "command-palette",
    name: "Command Palette",
    category: "App Shell",
    featured: true,
    description: "Grouped, searchable commands in a dialog.",
    exports: ["CommandPalette", "useCommandShortcut", "commandPaletteFilter"],
    height: 320,
    controls: {
      footer: { type: "boolean", default: true, label: "Key hints footer" },
      placeholder: { type: "text", default: "Search or jump to" },
    },
    render: (values) => <CommandPaletteDemo {...values} />,
    code: ({ footer, placeholder }) => `const groups = [
  {
    heading: "Pages",
    items: [
      { id: "overview", label: "Overview", icon: <LayoutDashboard /> },
      { id: "sales", label: "Sales", icon: <ChartColumn /> },
    ],
  },
  {
    heading: "Actions",
    items: [{ id: "export", label: "Export as CSV", icon: <Download />, shortcut: ["mod", "shift", "e"] }],
  },
]

function Example() {
  const [open, setOpen] = useState(false)
  useCommandShortcut(() => setOpen((value) => !value))
  return (
    <>
      <Button variant="outline" leading={<Search />} onClick={() => setOpen(true)}>
        Search
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={groups}
        placeholder="${placeholder}"${footer ? "" : "\n        footer={false}"}
      />
    </>
  )
}

<Example />`,
    accessibility: [
      'The field is a combobox (aria-autocomplete="list") that owns a listbox through aria-controls and aria-activedescendant; focus never leaves it.',
      "Up and Down Arrow move (wrapping), Page Up and Page Down jump five, Enter runs, Escape closes and returns focus.",
      'Groups are role="group" labelled by their heading; disabled rows are aria-disabled and skipped by the arrows.',
      "A polite status announces the result count while typing; the matched text is a <mark>, underlined as well as coloured.",
      "useCommandShortcut binds Cmd+K on Apple platforms and Ctrl+K elsewhere.",
    ],
  }),
  defineDemo({
    id: "fetch-progress",
    name: "Fetch Progress",
    category: "App Shell",
    description: "A hairline along the top for background fetches.",
    exports: ["FetchProgress"],
    height: 240,
    controls: {
      mode: { type: "select", options: ["indeterminate", "determinate"], default: "indeterminate" },
      value: { type: "number", min: 0, max: 100, step: 1, default: 64, label: "Value (determinate)" },
      delay: { type: "number", min: 0, max: 1000, step: 50, default: 300, label: "Delay (ms)" },
    },
    render: (values) => <FetchProgressDemo {...values} />,
    code: ({ mode, value, delay }) => `<div style={{ position: "relative", height: 120 }}>
${indent(
  jsx(
    "FetchProgress",
    { active: true, value: mode === "determinate" ? value : undefined, delay, label: "Updating sales data" },
    undefined,
    { delay: 300 },
  ),
)}
</div>`,
    accessibility: [
      'role="progressbar" with a label; aria-valuenow only when the value is known.',
      "The indeterminate sweep slows to a calm pace under reduced motion instead of stopping.",
    ],
  }),
  defineDemo({
    id: "skip-link",
    name: "Skip Link",
    category: "App Shell",
    description: "Hidden until focused, then skips to content.",
    exports: ["SkipLink"],
    height: 280,
    render: () => <SkipLinkDemo />,
    code: () => `<div>
  <SkipLink target="main">Skip to content</SkipLink>
  <nav aria-label="Main">
    <a href="#overview">Overview</a>
  </nav>
  <main id="main">
    <Skeleton lines={3} />
  </main>
</div>`,
    accessibility: [
      "Put it first in the document; it slides in on focus and stays reachable to screen readers when hidden.",
      "Gives the target tabindex -1 when needed and focuses it, without touching the URL hash.",
    ],
  }),
  defineDemo({
    id: "date-input",
    name: "Date Input",
    category: "App Shell",
    description: "The native date field, themed.",
    exports: ["DateInput"],
    height: 220,
    controls: {
      size: sizeControl,
      clearable: { type: "boolean", default: true },
      disabled: { type: "boolean", default: false },
    },
    render: (values) => <DateInputDemo {...values} />,
    code: ({ size, clearable, disabled }) => `function Example() {
  const [day, setDay] = useState("2026-10-20")
  return (
    <Field label="Invoice day">
      <DateInput
        value={day}
        onValueChange={setDay}${size === "md" ? "" : `\n        size="${size}"`}${clearable ? "" : "\n        clearable={false}"}${disabled ? "\n        disabled" : ""}
      />
    </Field>
  )
}

<Example />`,
    accessibility: [
      'A native <input type="date">: segment-by-segment keyboard entry and the platform picker come free.',
      "Values are always yyyy-mm-dd; the clear button is labelled and appears only while a date is set.",
    ],
  }),
  defineDemo({
    id: "date-range-picker",
    name: "Date Range Picker",
    category: "App Shell",
    description: "Two date fields with presets.",
    exports: ["DateRangePicker", "dateRangePickerPresets"],
    height: 240,
    controls: {
      size: sizeControl,
      presets: { type: "boolean", default: true, label: "Preset chips" },
    },
    render: (values) => <DateRangeDemo {...values} />,
    code: ({ size, presets }) => `function Example() {
  const [range, setRange] = useState<DateRangePickerValue | null>({ start: "2026-10-01", end: "2026-10-24" })
  return (
    <DateRangePicker
      value={range}
      onValueChange={setRange}${size === "md" ? "" : `\n      size="${size}"`}${presets ? "" : "\n      presets={[]}"}
    />
  )
}

<Example />`,
    accessibility: [
      "A labelled group holding two labelled date fields; each field's min and max follow the other end.",
      "Presets are toggle buttons with aria-pressed and a check mark; ones outside min and max are disabled.",
    ],
  }),
  defineDemo({
    id: "search-field",
    name: "Search Field",
    category: "App Shell",
    description: "A searchbox with clear, shortcut and debounce.",
    exports: ["SearchField"],
    height: 280,
    controls: {
      size: sizeControl,
      debounce: { type: "number", min: 0, max: 800, step: 50, default: 250, label: "Debounce (ms)" },
      shortcut: { type: "boolean", default: true, label: "/ shortcut" },
    },
    render: (values) => <SearchFieldDemo {...values} />,
    code: ({ size, debounce, shortcut }) =>
      `<SearchField
  label="Search products"
  placeholder="Search products"${debounce ? `\n  debounce={${debounce}}` : ""}${shortcut ? `\n  shortcut={["/"]}` : ""}${
    size === "md" ? "" : `\n  size="${size}"`
  }
  onSearch={(query) => console.log(query)}
/>`,
    accessibility: [
      'type="search" with an accessible name; inside a Field it uses the Field\'s label instead.',
      "Escape empties a filled field and stops there; on an empty field it passes through, so it can still close a dialog.",
      "The shortcut is ignored while typing in another field, and the hint hides on focus.",
    ],
  }),
  defineDemo({
    id: "confirm-button",
    name: "Confirm Button",
    category: "App Shell",
    description: "Press twice or hold to confirm.",
    exports: ["ConfirmButton"],
    height: 220,
    controls: {
      mode: { type: "select", options: ["click", "hold"], default: "click" },
      holdDuration: { type: "number", min: 400, max: 3000, step: 100, default: 1200, label: "Hold (ms)" },
    },
    render: ({ mode, holdDuration }) => (
      <ConfirmButton mode={mode} holdDuration={holdDuration} leading={<Trash2 />} onConfirm={() => {}}>
        {mode === "hold" ? "Hold to delete" : "Delete view"}
      </ConfirmButton>
    ),
    code: ({ mode, holdDuration }) =>
      `<ConfirmButton${mode === "hold" ? ` mode="hold"${holdDuration === 1200 ? "" : ` holdDuration={${holdDuration}}`}` : ""} leading={<Trash2 />} onConfirm={() => console.log("deleted")}>
  ${mode === "hold" ? "Hold to delete" : "Delete view"}
</ConfirmButton>`,
    accessibility: [
      'Click mode: the first press arms the button, changes its label and announces "Press again to confirm"; blur, Escape or the timeout disarm it.',
      "Hold mode: Space or Enter can be held like a pointer, and the hint is the button's description.",
      "Screen reader activation sends a click with no press to hold, so hold mode falls back to two presses there.",
    ],
  }),
  defineDemo({
    id: "hint-layer",
    name: "Coachmark and Hint Layer",
    category: "App Shell",
    description: "Guided tours and pointer-following hints.",
    exports: ["Coachmark", "HintLayer"],
    height: 340,
    render: () => <TourDemo />,
    code: () => `function Example() {
  const search = useRef(null)
  const exportButton = useRef(null)
  const [open, setOpen] = useState(false)
  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 16 }}>
      <HintLayer />
      <div style={{ display: "flex", gap: 4 }}>
        <Button ref={search} variant="ghost" data-hint="Search pages and actions">Search</Button>
        <Button ref={exportButton} variant="ghost" data-hint="Download as CSV">Export</Button>
      </div>
      <Button onClick={() => setOpen(true)}>Start the tour</Button>
      <Coachmark
        open={open}
        onOpenChange={setOpen}
        steps={[
          { target: search, title: "Find anything", content: "Pages and actions in one search." },
          { target: exportButton, title: "Share what you see", content: "Exports keep your filters." },
        ]}
      />
    </div>
  )
}

<Example />`,
    accessibility: [
      "Each tip is a non-modal dialog labelled by its title and described by its body; focus moves to Next on open and returns afterwards.",
      "Escape or Skip ends the tour; the page stays usable while it runs.",
      "HintLayer's surface is aria-hidden: the hint text is copied to the host's aria-description, as a title would be. Keyboard focus shows it too.",
    ],
  }),
  defineDemo({
    id: "shortcut-table",
    name: "Shortcut Table",
    category: "App Shell",
    serverSafe: true,
    description: "A grouped keyboard reference.",
    exports: ["ShortcutTable"],
    height: 380,
    render: () => (
      <div style={{ ...surface, width: 440, maxWidth: "100%", padding: 20 }}>
        <ShortcutTable shortcuts={shortcuts} />
      </div>
    ),
    code: () => `<ShortcutTable
  shortcuts={[
    { group: "General", description: "Open command palette", keys: ["mod", "k"] },
    { group: "General", description: "Focus search", keys: [["/"], ["mod", "f"]] },
    { group: "Navigation", description: "Toggle sidebar", keys: ["mod", "b"] },
    { group: "Navigation", description: "Next page", keys: ["j"] },
  ]}
/>`,
    accessibility: [
      "One table per group, captioned by the group name; each description is a row header for its keys.",
      "Kbd renders mod as Command on Apple platforms and Ctrl elsewhere, with spoken names for glyphs.",
    ],
  }),
  defineDemo({
    id: "settings-nav",
    name: "Settings Nav",
    category: "App Shell",
    serverSafe: true,
    description: "The section list beside a settings page.",
    exports: ["SettingsNav", "SettingsNavItem"],
    height: 340,
    render: () => <SettingsDemo />,
    code: () => `<SettingsNav>
  <SettingsNavItem href="#appearance" icon={<Palette />} description="Theme and density" active>
    Appearance
  </SettingsNavItem>
  <SettingsNavItem href="#notifications" icon={<Bell />} description="Alerts and digests">
    Notifications
  </SettingsNavItem>
  <SettingsNavItem href="#shortcuts" icon={<Keyboard />} description="Keyboard reference">
    Shortcuts
  </SettingsNavItem>
</SettingsNav>`,
    accessibility: [
      "A labelled navigation landmark holding a list of links (or buttons without href).",
      'The current section has aria-current="page" and a filled icon tile as well as weight.',
    ],
  }),
  defineDemo({
    id: "filter-sheet",
    name: "Filter Sheet",
    category: "App Shell",
    description: "A side sheet of filter sections.",
    exports: ["FilterSheet", "FilterSheetSection"],
    height: 220,
    controls: {
      side: { type: "select", options: ["right", "left", "bottom"], default: "right" },
    },
    render: (values) => <FilterSheetDemo {...values} />,
    code: ({ side }) => `const brands = [
  { value: "zudio", label: "Zudio", count: 412 },
  { value: "westside", label: "Westside", count: 298 },
  { value: "misbu", label: "Misbu", count: 87 },
]

function Example() {
  const [brand, setBrand] = useState(["zudio"])
  return (
    <FilterSheet${side === "right" ? "" : ` side="${side}"`} activeCount={brand.length} onReset={() => setBrand([])}>
      <FilterSheetSection title="Brand" count={brand.length} onClear={() => setBrand([])}>
        <FilterChips label="Brand" options={brands} value={brand} onValueChange={setBrand} />
      </FilterSheetSection>
    </FilterSheet>
  )
}

<Example />`,
    accessibility: [
      'The trigger names the active count ("Filters, 3 active"); the sheet is a modal dialog titled Filters.',
      "Each section is a region labelled by its heading; Clear buttons name their section.",
      "The footer readout is a polite live region, so counts are announced as filters change.",
    ],
  }),
]
