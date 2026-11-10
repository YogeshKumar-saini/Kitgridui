import {
  ActionBar,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
  AnchorNav,
  BackToTop,
  BottomNavigation,
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
  BreadcrumbMenu,
  Button,
  ButtonGroup,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  DotPagination,
  FloatingActionButton,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  KeyboardShortcutsDialog,
  Lightbox,
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
  MobileNavSheet,
  ModalStack,
  ModalStackBody,
  ModalStackClose,
  ModalStackContent,
  ModalStackFooter,
  ModalStackHeader,
  ModalStackTitle,
  ModalStackTrigger,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NestedDrawer,
  NestedDrawerBody,
  NestedDrawerClose,
  NestedDrawerContent,
  NestedDrawerFooter,
  NestedDrawerHeader,
  NestedDrawerTitle,
  NestedDrawerTrigger,
  Pager,
  Popconfirm,
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
  ScrollArea,
  SegmentedNav,
  SpeedDial,
  SplitButton,
  Stepper,
  TableOfContents,
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarToggle,
} from "kitgrid"
import {
  Archive,
  Bell,
  Bold,
  Box,
  Camera,
  Code,
  CreditCard,
  Copy,
  Download,
  FileText,
  Globe,
  House,
  Inbox,
  Italic,
  Keyboard,
  Layers,
  LayoutGrid,
  Link,
  MapPin,
  Pencil,
  Plus,
  Rocket,
  Search,
  Share2,
  ShieldCheck,
  Tag,
  Trash2,
  Truck,
  Underline,
  User,
} from "lucide-react"
import { type CSSProperties, type ReactNode, useRef, useState } from "react"
import { skeleton } from "@/lib/data/skeleton"
import { defineDemo, jsx } from "./registry"

const indent = (text: string, depth = 1) =>
  text
    .split("\n")
    .map((line) => (line ? `${"  ".repeat(depth)}${line}` : line))
    .join("\n")

const muted = { margin: 0, color: "var(--kg-fg-muted)", fontSize: 14 } as const

const bar = (width: string, height = 10): CSSProperties => ({
  width,
  height,
  borderRadius: 6,
  background: "var(--kg-muted)",
})

/** Neutral placeholder rows: the content a real page would hold. */
const Lines = ({ count = 6 }: { count?: number }) => (
  <div aria-hidden style={{ display: "grid", gap: 10, padding: 20 }}>
    {Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        style={bar(index % 3 === 0 ? "100%" : `${88 - (index % 4) * 14}%`, index % 3 === 0 ? 64 : 12)}
      />
    ))}
  </div>
)

const LINES_CODE = `const Lines = () => (\n  <div style={{ display: "grid", gap: 10, padding: 20 }}>\n    {[100, 74, 88, 60, 100, 82].map((width, index) => (\n      <div\n        key={index}\n        style={{ width: \`\${width}%\`, height: 12, borderRadius: 6, background: "var(--kg-muted)" }}\n      />\n    ))}\n  </div>\n)\n\n`

const phone: CSSProperties = {
  position: "relative",
  width: 320,
  height: 480,
  overflow: "hidden",
  background: "var(--kg-bg)",
  border: "1px solid var(--kg-border)",
  borderRadius: 28,
}

const panel: CSSProperties = {
  border: "1px solid var(--kg-border)",
  borderRadius: "var(--kg-radius-xl)",
  background: "var(--kg-surface)",
}

const box = (children: ReactNode) => (
  <div style={{ width: 520, maxWidth: "100%" }}>{children}</div>
)

/* --------------------------------------------------------------- Context menu */

const ContextMenuDemo = () => (
  <ContextMenu>
    <ContextMenuTrigger
      tabIndex={0}
      aria-label="Canvas, right-click for actions"
      style={{
        display: "grid",
        placeItems: "center",
        width: 320,
        height: 180,
        border: "1px dashed var(--kg-border-strong)",
        borderRadius: "var(--kg-radius-xl)",
        color: "var(--kg-fg-muted)",
        fontSize: 14,
      }}
    >
      Right-click
    </ContextMenuTrigger>
    <ContextMenuContent aria-label="Canvas">
      <ContextMenuItem icon={<Copy />} shortcut="⌘C">
        Copy
      </ContextMenuItem>
      <ContextMenuItem icon={<Pencil />} shortcut="⌘R">
        Rename
      </ContextMenuItem>
      <ContextMenuItem icon={<Share2 />}>Share</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuCheckboxItem defaultChecked>Snap to grid</ContextMenuCheckboxItem>
      <ContextMenuSeparator />
      <ContextMenuItem icon={<Trash2 />} destructive shortcut="⌫">
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
)

/* --------------------------------------------------------------- Menubar */

const MenubarDemo = () => (
  <Menubar aria-label="Editor">
    <MenubarMenu value="file">
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem shortcut="⌘N">New tab</MenubarItem>
        <MenubarItem shortcut="⌘O">Open</MenubarItem>
        <MenubarSeparator />
        <MenubarItem shortcut="⌘P">Print</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu value="edit">
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem shortcut="⌘Z">Undo</MenubarItem>
        <MenubarItem shortcut="⇧⌘Z">Redo</MenubarItem>
        <MenubarSeparator />
        <MenubarItem shortcut="⌘F">Find</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu value="view">
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent>
        <MenubarCheckboxItem defaultChecked>Sidebar</MenubarCheckboxItem>
        <MenubarCheckboxItem>Minimap</MenubarCheckboxItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
)

/* --------------------------------------------------------------- Navigation menu */

const panelGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(12rem, 1fr))",
  gap: 4,
} as const

const NavigationMenuDemo = () => (
  <NavigationMenu aria-label="Main">
    <NavigationMenuList>
      <NavigationMenuItem value="products">
        <NavigationMenuTrigger>Products</NavigationMenuTrigger>
        <NavigationMenuContent>
          <div style={panelGrid}>
            <NavigationMenuLink href="#" icon={<CreditCard />} description="Cards and wallets">
              Payments
            </NavigationMenuLink>
            <NavigationMenuLink href="#" icon={<ShieldCheck />} description="Risk scoring">
              Radar
            </NavigationMenuLink>
            <NavigationMenuLink href="#" icon={<Globe />} description="135 currencies">
              Connect
            </NavigationMenuLink>
            <NavigationMenuLink href="#" icon={<FileText />} description="Ledger and reports">
              Billing
            </NavigationMenuLink>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem value="developers">
        <NavigationMenuTrigger>Developers</NavigationMenuTrigger>
        <NavigationMenuContent>
          <div style={{ display: "grid", gap: 4, minWidth: 240 }}>
            <NavigationMenuLink href="#" icon={<Code />} description="REST and webhooks">
              API
            </NavigationMenuLink>
            <NavigationMenuLink href="#" icon={<Rocket />} description="Ship in a day">
              Quickstart
            </NavigationMenuLink>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#">Pricing</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
)

/* --------------------------------------------------------------- Hover card */

const HoverCardDemo = ({ openDelay }: { openDelay: number }) => (
  <HoverCard openDelay={openDelay}>
    <HoverCardTrigger>
      <a href="#maya" style={{ color: "var(--kg-accent-strong)", fontWeight: 600 }}>
        @maya.okafor
      </a>
    </HoverCardTrigger>
    <HoverCardContent>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          aria-hidden
          style={{
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: "50%",
            background: "var(--kg-muted)",
            boxShadow: "inset 0 0 0 1px var(--kg-border)",
          }}
        />
        <div style={{ display: "grid", gap: 2 }}>
          <strong>Maya Okafor</strong>
          <span style={muted}>Design lead, Lagos</span>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
)

/* --------------------------------------------------------------- Alert dialog */

const AlertDialogDemo = ({ tone }: { tone: "neutral" | "danger" | "warning" }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant={tone === "danger" ? "danger" : "outline"} leading={<Trash2 />}>
        Delete workspace
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent tone={tone} icon={<Trash2 />}>
      <AlertDialogTitle>Delete “Northwind”?</AlertDialogTitle>
      <AlertDialogDescription>All 38 projects go with it.</AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction variant={tone === "danger" ? "danger" : "solid"}>
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)

/* --------------------------------------------------------------- Lightbox */

const gallery = ["Ridge", "Valley", "Forest", "Lake"].map((name) => ({
  src: skeleton(`lightbox-${name}`, 1200, 900),
  thumbnail: skeleton(`lightbox-${name}`, 160, 120),
  alt: name,
}))

const LightboxDemo = ({ thumbnails, loop }: { thumbnails: boolean; loop: boolean }) => {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 88px)", gap: 8 }}>
        {gallery.map((image, position) => (
          <button
            key={image.alt}
            type="button"
            aria-label={`Open ${image.alt}`}
            onClick={() => {
              setIndex(position)
              setOpen(true)
            }}
            style={{
              padding: 0,
              border: "1px solid var(--kg-border)",
              borderRadius: "var(--kg-radius-md)",
              overflow: "hidden",
              cursor: "zoom-in",
              aspectRatio: "1",
              background: `center / cover url("${image.thumbnail}")`,
            }}
          />
        ))}
      </div>
      <Lightbox
        images={gallery}
        open={open}
        onOpenChange={setOpen}
        index={index}
        onIndexChange={setIndex}
        thumbnails={thumbnails}
        loop={loop}
      />
    </>
  )
}

/* --------------------------------------------------------------- Mobile shells */

const FabDemo = ({ extended, variant }: { extended: boolean; variant: "solid" | "surface" }) => (
  <div style={phone}>
    <Lines count={8} />
    <div style={{ position: "absolute", right: 20, bottom: 20 }}>
      <FloatingActionButton
        icon={<Pencil />}
        label="Compose"
        extended={extended}
        variant={variant}
        placement="static"
      />
    </div>
  </div>
)

const SpeedDialDemo = ({ layout }: { layout: "radial" | "up" | "left" }) => (
  <div style={phone}>
    <Lines count={8} />
    <div style={{ position: "absolute", right: 24, bottom: 24 }}>
      <SpeedDial
        layout={layout}
        placement="static"
        actions={[
          { label: "Photo", icon: <Camera /> },
          { label: "Document", icon: <FileText /> },
          { label: "Link", icon: <Link /> },
        ]}
      />
    </div>
  </div>
)

const bottomItems = [
  { value: "home", label: "Home", icon: <House /> },
  { value: "search", label: "Search", icon: <Search /> },
  { value: "inbox", label: "Inbox", icon: <Inbox />, badge: 4 },
  { value: "me", label: "Profile", icon: <User /> },
]

const BottomNavigationDemo = ({ compact }: { compact: boolean }) => (
  <div style={{ ...phone, display: "grid", gridTemplateRows: "1fr auto" }}>
    <Lines count={6} />
    <div style={{ padding: 12 }}>
      <BottomNavigation compact={compact} items={bottomItems} />
    </div>
  </div>
)

const navItems = [
  { label: "Home", href: "#", icon: <House />, active: true },
  {
    label: "Shop",
    icon: <Tag />,
    items: [
      { label: "New in", href: "#" },
      { label: "Women", items: [{ label: "Dresses", href: "#" }, { label: "Knitwear", href: "#" }] },
      { label: "Men", items: [{ label: "Shirts", href: "#" }, { label: "Outerwear", href: "#" }] },
    ],
  },
  { label: "Orders", href: "#", icon: <Truck /> },
  { label: "Stores", href: "#", icon: <MapPin /> },
]

/* --------------------------------------------------------------- Scrolling */

const article = [
  { id: "op-intro", label: "Overview" },
  { id: "op-install", label: "Install" },
  { id: "op-theme", label: "Theming", level: 2 },
  { id: "op-tokens", label: "Tokens", level: 2 },
  { id: "op-motion", label: "Motion" },
]

const Sections = ({ items }: { items: { id: string; label: string }[] }) => (
  <>
    {items.map((item) => (
      <section key={item.id} id={item.id} style={{ padding: "8px 0 28px", outline: "none" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>{item.label}</h3>
        <div aria-hidden style={{ display: "grid", gap: 8 }}>
          {[92, 100, 78, 64].map((width) => (
            <div key={width} style={bar(`${width}%`)} />
          ))}
        </div>
      </section>
    ))}
  </>
)

const TableOfContentsDemo = () => {
  const root = useRef<HTMLDivElement>(null)
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 32, width: 580, maxWidth: "100%" }}>
      <div ref={root} style={{ height: 340, overflowY: "auto", paddingRight: 8 }}>
        <Sections items={article} />
        <div style={{ height: 180 }} />
      </div>
      <TableOfContents items={article} root={root} offset={8} />
    </div>
  )
}

const anchors = [
  { id: "an-overview", label: "Overview" },
  { id: "an-specs", label: "Specs" },
  { id: "an-reviews", label: "Reviews" },
  { id: "an-shipping", label: "Shipping" },
]

const AnchorNavDemo = () => {
  const root = useRef<HTMLDivElement>(null)
  return (
    <div ref={root} style={{ ...panel, width: 520, maxWidth: "100%", height: 340, overflowY: "auto" }}>
      <AnchorNav items={anchors} root={root} offset={56} />
      <div style={{ padding: "16px 20px" }}>
        <Sections items={anchors} />
        <div style={{ height: 140 }} />
      </div>
    </div>
  )
}

const BackToTopDemo = () => {
  const root = useRef<HTMLDivElement>(null)
  return (
    <div style={{ position: "relative", width: 380, maxWidth: "100%" }}>
      <div ref={root} style={{ ...panel, height: 320, overflowY: "auto" }}>
        <Lines count={24} />
      </div>
      <div style={{ position: "absolute", right: 16, bottom: 16 }}>
        <BackToTop root={root} threshold={120} placement="static" />
      </div>
    </div>
  )
}

const releases = [
  "Faster cold starts",
  "Webhook retries",
  "API key scopes",
  "Audit log export",
  "Dashboard dark mode",
  "SAML single sign-on",
  "Usage alerts",
  "Node 22 runtime",
  "Bulk invites",
  "Preview domains",
]

const ScrollAreaDemo = ({ type }: { type: "hover" | "scroll" | "always" }) => (
  <ScrollArea type={type} aria-label="Releases" style={{ ...panel, width: 280, height: 260 }}>
    <ul style={{ margin: 0, padding: "6px 0", listStyle: "none" }}>
      {releases.map((item, index) => (
        <li
          key={item}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            padding: "10px 16px",
            fontSize: 14,
          }}
        >
          <span>{item}</span>
          <span style={{ color: "var(--kg-fg-faint)", fontVariantNumeric: "tabular-nums" }}>
            v4.{releases.length - index}
          </span>
        </li>
      ))}
    </ul>
  </ScrollArea>
)

/* --------------------------------------------------------------- Actions */

const files = ["Q3 report.pdf", "Brand kit.zip", "Roadmap.fig", "Invoices.csv"]

const ActionBarDemo = () => {
  const [selected, setSelected] = useState<string[]>(files.slice(0, 2))
  return (
    <div style={{ ...panel, position: "relative", width: 400, maxWidth: "100%", height: 300, overflow: "hidden" }}>
      <ul style={{ margin: 0, padding: 8, listStyle: "none" }}>
        {files.map((file) => (
          <li key={file}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                fontSize: 14,
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={selected.includes(file)}
                onChange={(event) =>
                  setSelected((current) =>
                    event.target.checked
                      ? [...current, file]
                      : current.filter((name) => name !== file),
                  )
                }
              />
              {file}
            </label>
          </li>
        ))}
      </ul>
      <ActionBar count={selected.length} position="absolute" onClear={() => setSelected([])}>
        <ToolbarButton label="Download" icon={<Download />} />
        <ToolbarButton label="Archive" icon={<Archive />} />
        <ToolbarButton label="Delete" icon={<Trash2 />} />
      </ActionBar>
    </div>
  )
}

const ToolbarDemo = ({ orientation }: { orientation: "horizontal" | "vertical" }) => (
  <Toolbar aria-label="Formatting" orientation={orientation}>
    <ToolbarToggle label="Bold" icon={<Bold />} defaultPressed />
    <ToolbarToggle label="Italic" icon={<Italic />} />
    <ToolbarToggle label="Underline" icon={<Underline />} />
    <ToolbarSeparator />
    <ToolbarButton label="Insert link" icon={<Link />} />
  </Toolbar>
)

/* --------------------------------------------------------------- Layered surfaces */

const ModalStackDemo = () => (
  <ModalStack>
    <ModalStackTrigger asChild>
      <Button variant="outline" leading={<Layers />}>
        Team settings
      </Button>
    </ModalStackTrigger>
    <ModalStackContent>
      <ModalStackHeader>
        <ModalStackTitle>Team</ModalStackTitle>
      </ModalStackHeader>
      <ModalStackBody>
        <p style={muted}>6 members</p>
      </ModalStackBody>
      <ModalStackFooter>
        <ModalStack>
          <ModalStackTrigger asChild>
            <Button leading={<Plus />}>Invite</Button>
          </ModalStackTrigger>
          <ModalStackContent size="sm">
            <ModalStackHeader>
              <ModalStackTitle>Invite member</ModalStackTitle>
            </ModalStackHeader>
            <ModalStackBody>
              <Input aria-label="Email" placeholder="name@company.com" />
            </ModalStackBody>
            <ModalStackFooter>
              <ModalStackClose asChild>
                <Button variant="ghost">Cancel</Button>
              </ModalStackClose>
              <ModalStackClose asChild>
                <Button>Send</Button>
              </ModalStackClose>
            </ModalStackFooter>
          </ModalStackContent>
        </ModalStack>
      </ModalStackFooter>
    </ModalStackContent>
  </ModalStack>
)

const NestedDrawerDemo = () => (
  <NestedDrawer>
    <NestedDrawerTrigger asChild>
      <Button variant="outline" leading={<Box />}>
        Checkout
      </Button>
    </NestedDrawerTrigger>
    <NestedDrawerContent size="sm">
      <NestedDrawerHeader>
        <NestedDrawerTitle>Checkout</NestedDrawerTitle>
      </NestedDrawerHeader>
      <NestedDrawerBody>
        <p style={muted}>Ships to 221 Market St</p>
      </NestedDrawerBody>
      <NestedDrawerFooter>
        <NestedDrawer>
          <NestedDrawerTrigger asChild>
            <Button variant="outline">Change address</Button>
          </NestedDrawerTrigger>
          <NestedDrawerContent size="sm">
            <NestedDrawerHeader>
              <NestedDrawerTitle>Address</NestedDrawerTitle>
            </NestedDrawerHeader>
            <NestedDrawerBody>
              <p style={muted}>221 Market St, San Francisco</p>
            </NestedDrawerBody>
            <NestedDrawerFooter>
              <NestedDrawerClose asChild>
                <Button>Done</Button>
              </NestedDrawerClose>
            </NestedDrawerFooter>
          </NestedDrawerContent>
        </NestedDrawer>
        <Button>Pay $128</Button>
      </NestedDrawerFooter>
    </NestedDrawerContent>
  </NestedDrawer>
)

const BottomSheetDemo = () => (
  <BottomSheet>
    <BottomSheetTrigger asChild>
      <Button variant="outline" leading={<LayoutGrid />}>
        Filters
      </Button>
    </BottomSheetTrigger>
    <BottomSheetContent snapPoints={[0.35, 0.6, 0.92]}>
      <BottomSheetHeader>
        <BottomSheetTitle>Filters</BottomSheetTitle>
      </BottomSheetHeader>
      <BottomSheetBody>
        <Lines count={10} />
      </BottomSheetBody>
    </BottomSheetContent>
  </BottomSheet>
)

const ResponsiveDialogDemo = () => (
  <ResponsiveDialog>
    <ResponsiveDialogTrigger asChild>
      <Button variant="outline" leading={<Share2 />}>
        Share
      </Button>
    </ResponsiveDialogTrigger>
    <ResponsiveDialogContent>
      <ResponsiveDialogHeader>
        <ResponsiveDialogTitle>Share “Roadmap”</ResponsiveDialogTitle>
        <ResponsiveDialogDescription>Anyone with the link can view.</ResponsiveDialogDescription>
      </ResponsiveDialogHeader>
      <ResponsiveDialogBody>
        <Input readOnly value="kitgrid.app/s/r8k2" aria-label="Share link" />
      </ResponsiveDialogBody>
      <ResponsiveDialogFooter>
        <ResponsiveDialogClose asChild>
          <Button variant="ghost">Close</Button>
        </ResponsiveDialogClose>
        <Button leading={<Copy />}>Copy link</Button>
      </ResponsiveDialogFooter>
    </ResponsiveDialogContent>
  </ResponsiveDialog>
)

const shortcutGroups = [
  {
    title: "General",
    shortcuts: [
      { keys: ["mod", "k"], label: "Command menu" },
      { keys: ["?"], label: "Shortcuts" },
      { keys: ["mod", ","], label: "Settings" },
    ],
  },
  {
    title: "Editing",
    shortcuts: [
      { keys: ["mod", "z"], label: "Undo" },
      { keys: ["mod", "shift", "z"], label: "Redo" },
      { keys: ["mod", "d"], label: "Duplicate" },
    ],
  },
]

const ShortcutsDemo = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="outline" leading={<Keyboard />} onClick={() => setOpen(true)}>
        Shortcuts
      </Button>
      <KeyboardShortcutsDialog groups={shortcutGroups} open={open} onOpenChange={setOpen} />
    </>
  )
}

/* --------------------------------------------------------------- Progress and paging */

const steps = [{ label: "Account" }, { label: "Workspace" }, { label: "Billing" }, { label: "Invite" }]

const StepperDemo = ({ orientation }: { orientation: "horizontal" | "vertical" }) => {
  const [current, setCurrent] = useState(2)
  return (
    <div style={{ width: orientation === "vertical" ? 220 : 520, maxWidth: "100%" }}>
      <Stepper steps={steps} current={current} orientation={orientation} onStepClick={setCurrent} />
    </div>
  )
}

const DotPaginationDemo = () => {
  const [page, setPage] = useState(1)
  return (
    <div style={{ display: "grid", gap: 16, justifyItems: "center" }}>
      <div
        role="img"
        aria-label={`Slide ${page + 1} of 4`}
        style={{
          width: 300,
          height: 180,
          borderRadius: "var(--kg-radius-xl)",
          background: `center / cover url("${skeleton(`dot-${page}`, 600, 360)}")`,
          border: "1px solid var(--kg-border)",
        }}
      />
      <DotPagination count={4} value={page} onValueChange={setPage} />
    </div>
  )
}

const a11y = {
  modal: "Native <dialog> with showModal(): inert page, Escape closes, focus returns.",
}

export const demos = [
  defineDemo({
    id: "context-menu",
    name: "Context Menu",
    category: "Overlays",
    description: "Right-click, long-press or Shift+F10 menu at the pointer.",
    exports: [
      "ContextMenu",
      "ContextMenuTrigger",
      "ContextMenuContent",
      "ContextMenuItem",
      "ContextMenuCheckboxItem",
      "ContextMenuLabel",
      "ContextMenuSeparator",
    ],
    render: () => <ContextMenuDemo />,
    code: () =>
      `import {\n  ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem,\n  ContextMenuSeparator, ContextMenuTrigger,\n} from "kitgrid"\nimport { Copy, Pencil, Trash2 } from "lucide-react"\n\n<ContextMenu>\n  <ContextMenuTrigger\n    tabIndex={0}\n    style={{ display: "grid", placeItems: "center", width: 320, height: 180, border: "1px dashed var(--kg-border-strong)", borderRadius: 16 }}\n  >\n    Right-click\n  </ContextMenuTrigger>\n  <ContextMenuContent aria-label="Canvas">\n    <ContextMenuItem icon={<Copy />} shortcut="⌘C">Copy</ContextMenuItem>\n    <ContextMenuItem icon={<Pencil />} shortcut="⌘R">Rename</ContextMenuItem>\n    <ContextMenuSeparator />\n    <ContextMenuCheckboxItem defaultChecked>Snap to grid</ContextMenuCheckboxItem>\n    <ContextMenuSeparator />\n    <ContextMenuItem icon={<Trash2 />} destructive shortcut="⌫">Delete</ContextMenuItem>\n  </ContextMenuContent>\n</ContextMenu>`,
    accessibility: [
      "role=menu; arrows, Home/End and typeahead move focus; Enter or Space selects.",
      "Shift+F10 and the ContextMenu key open it from the keyboard.",
      "Escape closes and returns focus.",
    ],
  }),
  defineDemo({
    id: "menubar",
    name: "Menubar",
    category: "Navigation",
    description: "Desktop-style application menus.",
    exports: [
      "Menubar",
      "MenubarMenu",
      "MenubarTrigger",
      "MenubarContent",
      "MenubarItem",
      "MenubarCheckboxItem",
      "MenubarSeparator",
    ],
    render: () => <MenubarDemo />,
    height: 320,
    code: () =>
      `import {\n  Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarMenu,\n  MenubarSeparator, MenubarTrigger,\n} from "kitgrid"\n\n<Menubar aria-label="Editor">\n  <MenubarMenu value="file">\n    <MenubarTrigger>File</MenubarTrigger>\n    <MenubarContent>\n      <MenubarItem shortcut="⌘N">New tab</MenubarItem>\n      <MenubarItem shortcut="⌘O">Open</MenubarItem>\n      <MenubarSeparator />\n      <MenubarItem shortcut="⌘P">Print</MenubarItem>\n    </MenubarContent>\n  </MenubarMenu>\n  <MenubarMenu value="view">\n    <MenubarTrigger>View</MenubarTrigger>\n    <MenubarContent>\n      <MenubarCheckboxItem defaultChecked>Sidebar</MenubarCheckboxItem>\n      <MenubarCheckboxItem>Minimap</MenubarCheckboxItem>\n    </MenubarContent>\n  </MenubarMenu>\n</Menubar>`,
    accessibility: [
      "One tab stop; Left/Right move between menus, Down opens.",
      "Left/Right inside an open menu switch to the neighbouring menu.",
      "Hover switches menus once one is open.",
    ],
  }),
  defineDemo({
    id: "navigation-menu",
    name: "Navigation Menu",
    category: "Navigation",
    description: "Mega menu with directional panels and a gliding indicator.",
    exports: [
      "NavigationMenu",
      "NavigationMenuList",
      "NavigationMenuItem",
      "NavigationMenuTrigger",
      "NavigationMenuContent",
      "NavigationMenuLink",
    ],
    render: () => (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", width: "100%", height: 300 }}>
        <NavigationMenuDemo />
      </div>
    ),
    height: 360,
    code: () =>
      `import {\n  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink,\n  NavigationMenuList, NavigationMenuTrigger,\n} from "kitgrid"\nimport { Code, CreditCard, Globe, Rocket } from "lucide-react"\n\n<NavigationMenu aria-label="Main">\n  <NavigationMenuList>\n    <NavigationMenuItem value="products">\n      <NavigationMenuTrigger>Products</NavigationMenuTrigger>\n      <NavigationMenuContent>\n        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(12rem, 1fr))", gap: 4 }}>\n          <NavigationMenuLink href="/payments" icon={<CreditCard />} description="Cards and wallets">\n            Payments\n          </NavigationMenuLink>\n          <NavigationMenuLink href="/connect" icon={<Globe />} description="135 currencies">\n            Connect\n          </NavigationMenuLink>\n        </div>\n      </NavigationMenuContent>\n    </NavigationMenuItem>\n    <NavigationMenuItem value="developers">\n      <NavigationMenuTrigger>Developers</NavigationMenuTrigger>\n      <NavigationMenuContent>\n        <NavigationMenuLink href="/api" icon={<Code />} description="REST and webhooks">\n          API\n        </NavigationMenuLink>\n        <NavigationMenuLink href="/quickstart" icon={<Rocket />} description="Ship in a day">\n          Quickstart\n        </NavigationMenuLink>\n      </NavigationMenuContent>\n    </NavigationMenuItem>\n    <NavigationMenuItem>\n      <NavigationMenuLink href="/pricing">Pricing</NavigationMenuLink>\n    </NavigationMenuItem>\n  </NavigationMenuList>\n</NavigationMenu>`,
    accessibility: [
      "A nav landmark of disclosure buttons, not a menu: links stay links.",
      "Left/Right/Home/End across the top row; Down enters a panel; Escape closes.",
      "Opens on hover intent or click.",
    ],
  }),
  defineDemo({
    id: "hover-card",
    name: "Hover Card",
    category: "Overlays",
    description: "Preview card on hover or focus.",
    exports: ["HoverCard", "HoverCardTrigger", "HoverCardContent"],
    controls: {
      openDelay: { type: "number", min: 0, max: 1000, step: 50, default: 500 },
    },
    render: (values) => <HoverCardDemo {...values} />,
    code: ({ openDelay }) =>
      `import { HoverCard, HoverCardContent, HoverCardTrigger } from "kitgrid"\n\n` +
      jsx(
        "HoverCard",
        { openDelay },
        `<HoverCardTrigger>\n  <a href="/maya">@maya.okafor</a>\n</HoverCardTrigger>\n<HoverCardContent>\n  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>\n    <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--kg-muted)" }} />\n    <div>\n      <strong>Maya Okafor</strong>\n      <p style={{ margin: 0, color: "var(--kg-fg-muted)" }}>Design lead, Lagos</p>\n    </div>\n  </div>\n</HoverCardContent>`,
        { openDelay: 500 },
      ),
    accessibility: [
      "Opens on keyboard focus too; Escape closes.",
      "Supplementary only: the link works without it.",
    ],
  }),
  defineDemo({
    id: "alert-dialog",
    name: "Alert Dialog",
    category: "Overlays",
    description: "Blocking confirmation with a tone-coloured icon disc.",
    exports: [
      "AlertDialog",
      "AlertDialogTrigger",
      "AlertDialogContent",
      "AlertDialogTitle",
      "AlertDialogDescription",
      "AlertDialogFooter",
      "AlertDialogCancel",
      "AlertDialogAction",
    ],
    controls: {
      tone: { type: "select", options: ["danger", "warning", "neutral"], default: "danger" },
    },
    render: ({ tone }) => <AlertDialogDemo tone={tone} />,
    code: ({ tone }) =>
      `import {\n  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,\n  AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger, Button,\n} from "kitgrid"\nimport { Trash2 } from "lucide-react"\n\n` +
      `<AlertDialog>\n  <AlertDialogTrigger asChild>\n    <Button variant="${tone === "danger" ? "danger" : "outline"}">Delete workspace</Button>\n  </AlertDialogTrigger>\n` +
      `  <AlertDialogContent tone="${tone}" icon={<Trash2 />}>\n    <AlertDialogTitle>Delete “Northwind”?</AlertDialogTitle>\n    <AlertDialogDescription>All 38 projects go with it.</AlertDialogDescription>\n    <AlertDialogFooter>\n      <AlertDialogCancel>Cancel</AlertDialogCancel>\n      <AlertDialogAction variant="${tone === "danger" ? "danger" : "solid"}">Delete</AlertDialogAction>\n    </AlertDialogFooter>\n  </AlertDialogContent>\n</AlertDialog>`,
    accessibility: [
      "role=alertdialog; focus lands on Cancel.",
      "Backdrop clicks are ignored; Escape cancels.",
    ],
  }),
  defineDemo({
    id: "popconfirm",
    name: "Popconfirm",
    category: "Overlays",
    description: "Small anchored confirmation.",
    exports: ["Popconfirm"],
    controls: {
      tone: { type: "select", options: ["danger", "neutral"], default: "danger" },
      side: { type: "select", options: ["top", "bottom", "left", "right"], default: "top" },
    },
    render: ({ tone, side }) => (
      <Popconfirm
        title="Remove this member?"
        description="They lose access now."
        confirmLabel="Remove"
        tone={tone}
        side={side}
        onConfirm={() => new Promise((resolve) => setTimeout(resolve, 700))}
      >
        <Button variant="outline">Remove</Button>
      </Popconfirm>
    ),
    code: ({ tone, side }) =>
      `import { Button, Popconfirm } from "kitgrid"\n\n` +
      jsx(
        "Popconfirm",
        {
          title: "Remove this member?",
          description: "They lose access now.",
          confirmLabel: "Remove",
          tone,
          side,
        },
        `<Button variant="outline">Remove</Button>`,
        { tone: "neutral", side: "top" },
      ),
    accessibility: [
      "Non-modal alertdialog; focus moves to Cancel.",
      "Escape or an outside click cancels; async onConfirm shows a spinner.",
    ],
  }),
  defineDemo({
    id: "lightbox",
    name: "Lightbox",
    category: "Overlays",
    description: "Image viewer with zoom, pan and swipe.",
    exports: ["Lightbox"],
    controls: {
      thumbnails: { type: "boolean", default: true },
      loop: { type: "boolean", default: true },
    },
    render: (values) => <LightboxDemo {...values} />,
    code: ({ thumbnails, loop }) =>
      `import { Button, Lightbox } from "kitgrid"\nimport { useState } from "react"\n\nconst images = [\n  { alt: "Ridge" },\n  { alt: "Valley" },\n  { alt: "Forest" },\n]\n\nfunction Example() {\n  const [open, setOpen] = useState(false)\n  const [index, setIndex] = useState(0)\n  return (\n    <>\n      <Button variant="outline" onClick={() => setOpen(true)}>Open gallery</Button>\n` +
      indent(
        `<Lightbox\n  images={images}\n  open={open}\n  onOpenChange={setOpen}\n  index={index}\n  onIndexChange={setIndex}${thumbnails ? "" : "\n  thumbnails={false}"}${loop ? "" : "\n  loop={false}"}\n/>`,
        3,
      ) +
      `\n    </>\n  )\n}\n\n<Example />`,
    accessibility: [
      "Arrows change image, + / - / 0 zoom, Escape closes.",
      "Wheel and double-click zoom at the pointer; drag pans.",
      "Images without src show a neutral skeleton surface that keeps its accessible name.",
    ],
  }),
  defineDemo({
    id: "floating-action-button",
    name: "Floating Action Button",
    category: "Overlays",
    description: "Primary action pinned to a corner.",
    exports: ["FloatingActionButton"],
    controls: {
      extended: { type: "boolean", default: true },
      variant: { type: "select", options: ["solid", "surface"], default: "solid" },
    },
    render: (values) => <FabDemo {...values} />,
    height: 540,
    code: ({ extended, variant }) =>
      `import { FloatingActionButton } from "kitgrid"\nimport { Pencil } from "lucide-react"\n\n` +
      `<FloatingActionButton\n  icon={<Pencil />}\n  label="Compose"${extended ? "\n  extended\n  collapseOnScroll" : ""}${variant === "solid" ? "" : `\n  variant="${variant}"`}\n/>`,
    accessibility: ["label is the accessible name, shown as text when extended."],
  }),
  defineDemo({
    id: "speed-dial",
    name: "Speed Dial",
    category: "Overlays",
    description: "FAB that fans out related actions.",
    exports: ["SpeedDial"],
    controls: {
      layout: { type: "select", options: ["radial", "up", "left"], default: "radial" },
    },
    render: (values) => <SpeedDialDemo {...values} />,
    height: 540,
    code: ({ layout }) =>
      `import { SpeedDial } from "kitgrid"\nimport { Camera, FileText, Link } from "lucide-react"\n\n<SpeedDial\n  layout="${layout}"\n  actions={[\n    { label: "Photo", icon: <Camera /> },\n    { label: "Document", icon: <FileText /> },\n    { label: "Link", icon: <Link /> },\n  ]}\n/>`,
    accessibility: [
      "Toggle button with aria-expanded; actions are a labelled group.",
      "Arrows move between actions; Escape closes and returns focus.",
    ],
  }),
  defineDemo({
    id: "bottom-navigation",
    name: "Bottom Navigation",
    category: "Navigation",
    description: "Mobile tab bar with a sliding pill.",
    exports: ["BottomNavigation"],
    controls: { compact: { type: "boolean", default: false, label: "Active label only" } },
    render: (values) => <BottomNavigationDemo {...values} />,
    height: 540,
    code: ({ compact }) =>
      `import { BottomNavigation } from "kitgrid"\nimport { House, Inbox, Search, User } from "lucide-react"\n\nconst items = [\n  { value: "home", label: "Home", icon: <House /> },\n  { value: "search", label: "Search", icon: <Search /> },\n  { value: "inbox", label: "Inbox", icon: <Inbox />, badge: 4 },\n  { value: "me", label: "Profile", icon: <User /> },\n]\n\n` +
      `<BottomNavigation items={items}${compact ? " compact" : ""} />`,
    accessibility: [
      "nav landmark; the active item has aria-current=page.",
      "Badges are read with the label.",
      "Items with href render as links; pass renderLink to use a router link.",
    ],
  }),
  defineDemo({
    id: "mobile-nav-sheet",
    name: "Mobile Nav Sheet",
    category: "Navigation",
    description: "Hamburger sheet with drill-down levels.",
    exports: ["MobileNavSheet"],
    render: () => <MobileNavSheet items={navItems} />,
    code: () =>
      `import { MobileNavSheet } from "kitgrid"\n\nconst items = [\n  { label: "Home", href: "/", active: true },\n  {\n    label: "Shop",\n    items: [\n      { label: "New in", href: "/new" },\n      { label: "Women", items: [{ label: "Dresses", href: "/women/dresses" }] },\n    ],\n  },\n  { label: "Orders", href: "/orders" },\n]\n\n<MobileNavSheet items={items} />`,
    accessibility: [
      "Modal drawer titled by the current level.",
      "Back returns focus to the item that opened the level.",
    ],
  }),
  defineDemo({
    id: "scroll-area",
    name: "Scroll Area",
    category: "Navigation",
    description: "Native scrolling with slim overlay scrollbars.",
    exports: ["ScrollArea"],
    controls: {
      type: { type: "select", options: ["hover", "scroll", "always"], default: "hover" },
    },
    render: (values) => <ScrollAreaDemo {...values} />,
    code: ({ type }) =>
      `import { ScrollArea } from "kitgrid"\n\nconst releases = ["Faster cold starts", "Webhook retries", "API key scopes", "Audit log export", "Usage alerts", "Node 22 runtime", "Bulk invites", "Preview domains"]\n\n` +
      `<ScrollArea${type === "hover" ? "" : ` type="${type}"`} aria-label="Releases" style={{ width: 280, height: 260 }}>\n  <ul style={{ margin: 0, padding: 8 }}>\n    {releases.map((item) => (\n      <li key={item} style={{ padding: "10px 8px", listStyle: "none" }}>{item}</li>\n    ))}\n  </ul>\n</ScrollArea>`,
    accessibility: [
      "The viewport stays natively scrollable and focusable.",
      "Custom bars are aria-hidden.",
    ],
  }),
  defineDemo({
    id: "back-to-top",
    name: "Back To Top",
    category: "Navigation",
    description: "Appears on scroll with a progress ring.",
    exports: ["BackToTop"],
    render: () => <BackToTopDemo />,
    code: () => `import { BackToTop } from "kitgrid"\n\n<BackToTop threshold={400} />`,
    accessibility: [
      "Hidden and untabbable until past the threshold.",
      "Smooth scroll unless reduced motion is on.",
    ],
  }),
  defineDemo({
    id: "table-of-contents",
    name: "Table Of Contents",
    category: "Navigation",
    description: "Scrollspy outline with a gliding marker.",
    exports: ["TableOfContents"],
    render: () => <TableOfContentsDemo />,
    code: () =>
      `import { TableOfContents } from "kitgrid"\n\nconst items = [\n  { id: "overview", label: "Overview" },\n  { id: "install", label: "Install" },\n  { id: "theming", label: "Theming", level: 2 },\n  { id: "motion", label: "Motion" },\n]\n\n<TableOfContents items={items} />`,
    accessibility: [
      "nav landmark; the current link has aria-current=location.",
      "Clicking moves focus to the section.",
    ],
  }),
  defineDemo({
    id: "anchor-nav",
    name: "Anchor Nav",
    category: "Navigation",
    description: "Sticky in-page section bar.",
    exports: ["AnchorNav"],
    render: () => <AnchorNavDemo />,
    code: () =>
      `import { AnchorNav } from "kitgrid"\n\nconst items = [\n  { id: "overview", label: "Overview" },\n  { id: "specs", label: "Specs" },\n  { id: "reviews", label: "Reviews" },\n  { id: "shipping", label: "Shipping" },\n]\n\n<AnchorNav items={items} />`,
    accessibility: [
      "aria-current=location follows scroll.",
      "The current link is kept in view on narrow screens.",
    ],
  }),
  defineDemo({
    id: "stepper",
    name: "Stepper",
    category: "Navigation",
    description: "Progress through ordered steps.",
    exports: ["Stepper"],
    serverSafe: true,
    controls: {
      orientation: { type: "select", options: ["horizontal", "vertical"], default: "horizontal" },
    },
    render: (values) => <StepperDemo {...values} />,
    code: ({ orientation }) =>
      `import { Stepper } from "kitgrid"\nimport { useState } from "react"\n\nconst steps = [{ label: "Account" }, { label: "Workspace" }, { label: "Billing" }, { label: "Invite" }]\n\nfunction Example() {\n  const [current, setCurrent] = useState(2)\n  return (\n    <Stepper\n      steps={steps}\n      current={current}\n      onStepClick={setCurrent}${orientation === "horizontal" ? "" : `\n      orientation="${orientation}"`}\n    />\n  )\n}\n\n<Example />`,
    accessibility: [
      "Ordered list; the current step has aria-current=step.",
      "Each step announces its status.",
    ],
  }),
  defineDemo({
    id: "segmented-nav",
    name: "Segmented Nav",
    category: "Navigation",
    description: "Page links on a segmented track.",
    exports: ["SegmentedNav"],
    controls: { size: { type: "select", options: ["md", "sm"], default: "md" } },
    render: ({ size }) => (
      <SegmentedNav
        aria-label="Project"
        size={size}
        items={[
          { value: "overview", label: "Overview" },
          { value: "activity", label: "Activity" },
          { value: "deploys", label: "Deploys" },
          { value: "settings", label: "Settings" },
        ]}
      />
    ),
    code: ({ size }) =>
      `import { SegmentedNav } from "kitgrid"\n\nconst items = [\n  { value: "overview", label: "Overview", href: "/overview" },\n  { value: "activity", label: "Activity", href: "/activity" },\n  { value: "deploys", label: "Deploys", href: "/deploys" },\n  { value: "settings", label: "Settings", href: "/settings" },\n]\n\n` +
      `<SegmentedNav aria-label="Project" items={items}${size === "md" ? "" : ` size="${size}"`} />`,
    accessibility: [
      "Links with aria-current=page; use SegmentedControl for values.",
      "Pass renderLink to render each item with a router link.",
    ],
  }),
  defineDemo({
    id: "collapsible",
    name: "Collapsible",
    category: "Navigation",
    description: "One trigger, one region.",
    exports: ["Collapsible", "CollapsibleTrigger", "CollapsibleContent"],
    render: () => (
      <Collapsible style={{ width: 280 }}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" trailing={<Plus />}>
            3 more repositories
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul style={{ margin: "8px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
            <li>atlas-api</li>
            <li>atlas-web</li>
            <li>atlas-infra</li>
          </ul>
        </CollapsibleContent>
      </Collapsible>
    ),
    code: () =>
      `import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from "kitgrid"\nimport { Plus } from "lucide-react"\n\n<Collapsible>\n  <CollapsibleTrigger asChild>\n    <Button variant="ghost" trailing={<Plus />}>3 more repositories</Button>\n  </CollapsibleTrigger>\n  <CollapsibleContent>\n    <ul>\n      <li>atlas-api</li>\n      <li>atlas-web</li>\n      <li>atlas-infra</li>\n    </ul>\n  </CollapsibleContent>\n</Collapsible>`,
    accessibility: ["Button with aria-expanded and aria-controls; closed content is inert."],
  }),
  defineDemo({
    id: "button-group",
    name: "Button Group",
    category: "Overlays",
    description: "Fused related buttons.",
    exports: ["ButtonGroup"],
    serverSafe: true,
    controls: {
      attached: { type: "boolean", default: true },
      orientation: { type: "select", options: ["horizontal", "vertical"], default: "horizontal" },
    },
    render: ({ attached, orientation }) => (
      <ButtonGroup aria-label="View" attached={attached} orientation={orientation}>
        <Button variant="outline">Day</Button>
        <Button variant="outline">Week</Button>
        <Button variant="outline">Month</Button>
      </ButtonGroup>
    ),
    code: ({ attached, orientation }) =>
      `import { Button, ButtonGroup } from "kitgrid"\n\n` +
      `<ButtonGroup aria-label="View"${attached ? "" : " attached={false}"}${orientation === "horizontal" ? "" : ` orientation="${orientation}"`}>\n  <Button variant="outline">Day</Button>\n  <Button variant="outline">Week</Button>\n  <Button variant="outline">Month</Button>\n</ButtonGroup>`,
    accessibility: ["role=group; name it with aria-label."],
  }),
  defineDemo({
    id: "split-button",
    name: "Split Button",
    category: "Overlays",
    description: "Primary action with a menu of alternatives.",
    exports: ["SplitButton"],
    controls: {
      variant: { type: "select", options: ["solid", "soft", "outline"], default: "solid" },
    },
    render: ({ variant }) => (
      <SplitButton
        variant={variant}
        leading={<Rocket />}
        actions={[
          { label: "Deploy to preview", icon: <Globe /> },
          { label: "Schedule", icon: <Bell /> },
          { label: "Roll back", icon: <Archive />, separated: true, destructive: true },
        ]}
      >
        Deploy
      </SplitButton>
    ),
    code: ({ variant }) =>
      `import { SplitButton } from "kitgrid"\nimport { Archive, Bell, Globe, Rocket } from "lucide-react"\n\nconst actions = [\n  { label: "Deploy to preview", icon: <Globe /> },\n  { label: "Schedule", icon: <Bell /> },\n  { label: "Roll back", icon: <Archive />, separated: true, destructive: true },\n]\n\n` +
      `<SplitButton${variant === "solid" ? "" : ` variant="${variant}"`} leading={<Rocket />} actions={actions}>\n  Deploy\n</SplitButton>`,
    accessibility: ["Two buttons; the caret is a labelled menu button."],
  }),
  defineDemo({
    id: "toolbar",
    name: "Toolbar",
    category: "Overlays",
    description: "ARIA toolbar with roving focus.",
    exports: ["Toolbar", "ToolbarButton", "ToolbarToggle", "ToolbarSeparator", "ToolbarGroup"],
    controls: {
      orientation: { type: "select", options: ["horizontal", "vertical"], default: "horizontal" },
    },
    render: (values) => <ToolbarDemo {...values} />,
    code: ({ orientation }) =>
      `import { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarToggle } from "kitgrid"\nimport { Bold, Italic, Link, Underline } from "lucide-react"\n\n` +
      jsx(
        "Toolbar",
        { "aria-label": "Formatting", orientation },
        `<ToolbarToggle label="Bold" icon={<Bold />} defaultPressed />\n<ToolbarToggle label="Italic" icon={<Italic />} />\n<ToolbarToggle label="Underline" icon={<Underline />} />\n<ToolbarSeparator />\n<ToolbarButton label="Insert link" icon={<Link />} />`,
        { orientation: "horizontal" },
      ),
    accessibility: [
      "One tab stop; arrows, Home and End move; position is remembered.",
      "Toggles expose aria-pressed.",
    ],
  }),
  defineDemo({
    id: "action-bar",
    name: "Action Bar",
    category: "Overlays",
    description: "Floating bulk actions for a selection.",
    exports: ["ActionBar"],
    render: () => <ActionBarDemo />,
    code: () =>
      `import { ActionBar, ToolbarButton } from "kitgrid"\nimport { Archive, Download, Trash2 } from "lucide-react"\nimport { useState } from "react"\n\nconst files = ["Q3 report.pdf", "Brand kit.zip", "Roadmap.fig", "Invoices.csv"]\n\nfunction Example() {\n  const [selected, setSelected] = useState(files.slice(0, 2))\n  const toggle = (file: string) =>\n    setSelected((current) =>\n      current.includes(file) ? current.filter((name) => name !== file) : [...current, file],\n    )\n  return (\n    <div style={{ position: "relative", width: 400, height: 300 }}>\n      {files.map((file) => (\n        <label key={file} style={{ display: "flex", gap: 12, padding: 10 }}>\n          <input type="checkbox" checked={selected.includes(file)} onChange={() => toggle(file)} />\n          {file}\n        </label>\n      ))}\n      <ActionBar count={selected.length} position="absolute" onClear={() => setSelected([])}>\n        <ToolbarButton label="Download" icon={<Download />} />\n        <ToolbarButton label="Archive" icon={<Archive />} />\n        <ToolbarButton label="Delete" icon={<Trash2 />} />\n      </ActionBar>\n    </div>\n  )\n}\n\n<Example />`,
    accessibility: [
      "A toolbar; the count is a polite live region.",
      "Escape inside clears the selection.",
    ],
  }),
  defineDemo({
    id: "breadcrumb-menu",
    name: "Breadcrumb Menu",
    category: "Navigation",
    description: "Long trails fold into a menu.",
    exports: ["BreadcrumbMenu"],
    controls: { maxItems: { type: "number", min: 3, max: 7, default: 4 } },
    render: ({ maxItems }) =>
      box(
        <BreadcrumbMenu
          maxItems={maxItems}
          onNavigate={() => {}}
          items={[
            { label: "Home", href: "#", icon: <House /> },
            { label: "Projects", href: "#" },
            { label: "Atlas", href: "#" },
            { label: "Docs", href: "#" },
            { label: "API", href: "#" },
            { label: "Webhooks" },
          ]}
        />,
      ),
    code: ({ maxItems }) =>
      `import { BreadcrumbMenu } from "kitgrid"\nimport { House } from "lucide-react"\n\nconst items = [\n  { label: "Home", href: "/", icon: <House /> },\n  { label: "Projects", href: "/projects" },\n  { label: "Atlas", href: "/projects/atlas" },\n  { label: "Docs", href: "/projects/atlas/docs" },\n  { label: "API", href: "/projects/atlas/docs/api" },\n  { label: "Webhooks" },\n]\n\n` +
      `<BreadcrumbMenu items={items}${maxItems === 4 ? "" : ` maxItems={${maxItems}}`} />`,
    accessibility: [
      "Ordered list in a Breadcrumb landmark; last crumb is aria-current=page.",
      "The fold is a labelled menu button.",
      "Pass renderLink for router links and onNavigate for crumbs chosen from the fold.",
    ],
  }),
  defineDemo({
    id: "modal-stack",
    name: "Modal Stack",
    category: "Overlays",
    description: "Dialogs that stack; parents recede.",
    exports: [
      "ModalStack",
      "ModalStackTrigger",
      "ModalStackContent",
      "ModalStackHeader",
      "ModalStackTitle",
      "ModalStackBody",
      "ModalStackFooter",
      "ModalStackClose",
    ],
    render: () => <ModalStackDemo />,
    code: () =>
      `import {\n  Button, Input, ModalStack, ModalStackBody, ModalStackClose, ModalStackContent,\n  ModalStackFooter, ModalStackHeader, ModalStackTitle, ModalStackTrigger,\n} from "kitgrid"\n\n<ModalStack>\n  <ModalStackTrigger asChild>\n    <Button variant="outline">Team settings</Button>\n  </ModalStackTrigger>\n  <ModalStackContent>\n    <ModalStackHeader>\n      <ModalStackTitle>Team</ModalStackTitle>\n    </ModalStackHeader>\n    <ModalStackBody>6 members</ModalStackBody>\n    <ModalStackFooter>\n      <ModalStack>\n        <ModalStackTrigger asChild>\n          <Button>Invite</Button>\n        </ModalStackTrigger>\n        <ModalStackContent size="sm">\n          <ModalStackHeader>\n            <ModalStackTitle>Invite member</ModalStackTitle>\n          </ModalStackHeader>\n          <ModalStackBody>\n            <Input aria-label="Email" placeholder="name@company.com" />\n          </ModalStackBody>\n          <ModalStackFooter>\n            <ModalStackClose asChild>\n              <Button>Send</Button>\n            </ModalStackClose>\n          </ModalStackFooter>\n        </ModalStackContent>\n      </ModalStack>\n    </ModalStackFooter>\n  </ModalStackContent>\n</ModalStack>`,
    accessibility: [a11y.modal, "Escape peels one layer at a time."],
  }),
  defineDemo({
    id: "nested-drawer",
    name: "Nested Drawer",
    category: "Overlays",
    description: "Drawers that push drawers.",
    exports: [
      "NestedDrawer",
      "NestedDrawerTrigger",
      "NestedDrawerContent",
      "NestedDrawerHeader",
      "NestedDrawerTitle",
      "NestedDrawerBody",
      "NestedDrawerFooter",
      "NestedDrawerClose",
    ],
    render: () => <NestedDrawerDemo />,
    code: () =>
      `import {\n  Button, NestedDrawer, NestedDrawerBody, NestedDrawerClose, NestedDrawerContent,\n  NestedDrawerFooter, NestedDrawerHeader, NestedDrawerTitle, NestedDrawerTrigger,\n} from "kitgrid"\n\n<NestedDrawer>\n  <NestedDrawerTrigger asChild>\n    <Button variant="outline">Checkout</Button>\n  </NestedDrawerTrigger>\n  <NestedDrawerContent size="sm">\n    <NestedDrawerHeader>\n      <NestedDrawerTitle>Checkout</NestedDrawerTitle>\n    </NestedDrawerHeader>\n    <NestedDrawerBody>Ships to 221 Market St</NestedDrawerBody>\n    <NestedDrawerFooter>\n      <NestedDrawer>\n        <NestedDrawerTrigger asChild>\n          <Button variant="outline">Change address</Button>\n        </NestedDrawerTrigger>\n        <NestedDrawerContent size="sm">\n          <NestedDrawerHeader>\n            <NestedDrawerTitle>Address</NestedDrawerTitle>\n          </NestedDrawerHeader>\n          <NestedDrawerFooter>\n            <NestedDrawerClose asChild>\n              <Button>Done</Button>\n            </NestedDrawerClose>\n          </NestedDrawerFooter>\n        </NestedDrawerContent>\n      </NestedDrawer>\n      <Button>Pay $128</Button>\n    </NestedDrawerFooter>\n  </NestedDrawerContent>\n</NestedDrawer>`,
    accessibility: [a11y.modal, "Parents slide back and dim while a child is open."],
  }),
  defineDemo({
    id: "bottom-sheet",
    name: "Bottom Sheet",
    category: "Overlays",
    description: "Sheet that rests at snap points.",
    exports: [
      "BottomSheet",
      "BottomSheetTrigger",
      "BottomSheetContent",
      "BottomSheetHeader",
      "BottomSheetTitle",
      "BottomSheetBody",
    ],
    render: () => <BottomSheetDemo />,
    code: () =>
      `import {\n  BottomSheet, BottomSheetBody, BottomSheetContent, BottomSheetHeader, BottomSheetTitle,\n  BottomSheetTrigger, Button,\n} from "kitgrid"\n\n${LINES_CODE}<BottomSheet>\n  <BottomSheetTrigger asChild>\n    <Button variant="outline">Filters</Button>\n  </BottomSheetTrigger>\n  <BottomSheetContent snapPoints={[0.35, 0.6, 0.92]}>\n    <BottomSheetHeader>\n      <BottomSheetTitle>Filters</BottomSheetTitle>\n    </BottomSheetHeader>\n    <BottomSheetBody>\n      <Lines />\n    </BottomSheetBody>\n  </BottomSheetContent>\n</BottomSheet>`,
    accessibility: [
      a11y.modal,
      "The handle is a button: Up/Down step snap points.",
      "Velocity-aware drag; below the lowest point closes.",
    ],
  }),
  defineDemo({
    id: "responsive-dialog",
    name: "Responsive Dialog",
    category: "Overlays",
    description: "Dialog on desktop, bottom sheet on mobile.",
    exports: [
      "ResponsiveDialog",
      "ResponsiveDialogTrigger",
      "ResponsiveDialogContent",
      "ResponsiveDialogHeader",
      "ResponsiveDialogTitle",
      "ResponsiveDialogDescription",
      "ResponsiveDialogBody",
      "ResponsiveDialogFooter",
      "ResponsiveDialogClose",
    ],
    render: () => <ResponsiveDialogDemo />,
    code: () =>
      `import {\n  Button, Input, ResponsiveDialog, ResponsiveDialogBody, ResponsiveDialogClose,\n  ResponsiveDialogContent, ResponsiveDialogDescription, ResponsiveDialogFooter,\n  ResponsiveDialogHeader, ResponsiveDialogTitle, ResponsiveDialogTrigger,\n} from "kitgrid"\n\n<ResponsiveDialog query="(min-width: 40rem)">\n  <ResponsiveDialogTrigger asChild>\n    <Button variant="outline">Share</Button>\n  </ResponsiveDialogTrigger>\n  <ResponsiveDialogContent>\n    <ResponsiveDialogHeader>\n      <ResponsiveDialogTitle>Share “Roadmap”</ResponsiveDialogTitle>\n      <ResponsiveDialogDescription>Anyone with the link can view.</ResponsiveDialogDescription>\n    </ResponsiveDialogHeader>\n    <ResponsiveDialogBody>\n      <Input readOnly value="kitgrid.app/s/r8k2" aria-label="Share link" />\n    </ResponsiveDialogBody>\n    <ResponsiveDialogFooter>\n      <ResponsiveDialogClose asChild>\n        <Button variant="ghost">Close</Button>\n      </ResponsiveDialogClose>\n      <Button>Copy link</Button>\n    </ResponsiveDialogFooter>\n  </ResponsiveDialogContent>\n</ResponsiveDialog>`,
    accessibility: [a11y.modal, "Same labelling on both surfaces."],
  }),
  defineDemo({
    id: "keyboard-shortcuts-dialog",
    name: "Keyboard Shortcuts Dialog",
    category: "Overlays",
    description: "Searchable cheat sheet, opened with ?.",
    exports: ["KeyboardShortcutsDialog"],
    render: () => <ShortcutsDemo />,
    code: () =>
      `import { Button, KeyboardShortcutsDialog } from "kitgrid"\nimport { useState } from "react"\n\nconst groups = [\n  {\n    title: "General",\n    shortcuts: [\n      { keys: ["mod", "k"], label: "Command menu" },\n      { keys: ["?"], label: "Shortcuts" },\n    ],\n  },\n  {\n    title: "Editing",\n    shortcuts: [\n      { keys: ["mod", "z"], label: "Undo" },\n      { keys: ["mod", "shift", "z"], label: "Redo" },\n    ],\n  },\n]\n\nfunction Example() {\n  const [open, setOpen] = useState(false)\n  return (\n    <>\n      <Button variant="outline" onClick={() => setOpen(true)}>Shortcuts</Button>\n      <KeyboardShortcutsDialog groups={groups} open={open} onOpenChange={setOpen} hotkey="?" />\n    </>\n  )\n}\n\n<Example />`,
    accessibility: [
      a11y.modal,
      "? opens it anywhere outside a text field.",
      "Groups are labelled regions of description lists.",
    ],
  }),
  defineDemo({
    id: "dot-pagination",
    name: "Dot Pagination",
    category: "Navigation",
    description: "Page dots with a gliding bead.",
    exports: ["DotPagination"],
    render: () => <DotPaginationDemo />,
    code: () =>
      `import { DotPagination } from "kitgrid"\nimport { useState } from "react"\n\nfunction Example() {\n  const [page, setPage] = useState(1)\n  return <DotPagination count={4} value={page} onValueChange={setPage} />\n}\n\n<Example />`,
    accessibility: [
      "One tab stop; arrows select. The current dot has aria-current.",
      "24px hit areas around 8px dots.",
    ],
  }),
  defineDemo({
    id: "pager",
    name: "Pager",
    category: "Navigation",
    description: "Previous and next page links.",
    exports: ["Pager"],
    serverSafe: true,
    render: () =>
      box(
        <Pager
          previous={{ label: "Installation", href: "#" }}
          next={{ label: "Theming", href: "#" }}
        />,
      ),
    code: () =>
      `import { Pager } from "kitgrid"\n\n<Pager\n  previous={{ label: "Installation", href: "/docs/install" }}\n  next={{ label: "Theming", href: "/docs/theming" }}\n/>`,
    accessibility: ["Links carry rel=prev and rel=next."],
  }),
]
