import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Breadcrumb,
  type BreadcrumbItem,
  Pagination,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "kitgrid"
import { House } from "lucide-react"
import { useState } from "react"
import { defineDemo, jsx, raw } from "./registry"

const indent = (text: string, depth = 1) =>
  text
    .split("\n")
    .map((line) => (line ? `${"  ".repeat(depth)}${line}` : line))
    .join("\n")

const prose = { margin: 0, color: "var(--kg-fg-muted)", lineHeight: 1.6 } as const

/* ----------------------------------------------------------------- Tabs */

const tabs = [
  { value: "details", label: "Details", body: "Garment-dyed linen, relaxed fit." },
  { value: "shipping", label: "Shipping", body: "Free over $100." },
  { value: "returns", label: "Returns", body: "Free returns within 30 days." },
]

const ProductTabs = ({
  variant,
  orientation,
  activationMode,
}: {
  variant: "underline" | "pill" | "enclosed"
  orientation: "horizontal" | "vertical"
  activationMode: "automatic" | "manual"
}) => (
  <Tabs
    defaultValue="details"
    orientation={orientation}
    activationMode={activationMode}
    style={{ width: 420, maxWidth: "100%" }}
  >
    <TabsList variant={variant} aria-label="Product information">
      {tabs.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value}>
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
    {tabs.map((tab) => (
      <TabsContent key={tab.value} value={tab.value}>
        <p style={prose}>{tab.body}</p>
      </TabsContent>
    ))}
  </Tabs>
)

/* ------------------------------------------------------------ Accordion */

const faq = [
  {
    value: "shipping",
    question: "How long does shipping take?",
    answer: "Orders ship within 24 hours.",
  },
  {
    value: "returns",
    question: "What is your return policy?",
    answer: "Free returns within 30 days.",
  },
  {
    value: "care",
    question: "How should I care for linen?",
    answer: "Wash cold, line dry.",
  },
]

const Faq = ({ type, collapsible }: { type: "single" | "multiple"; collapsible: boolean }) => {
  const items = faq.map((item) => (
    <AccordionItem key={item.value} value={item.value}>
      <AccordionTrigger>{item.question}</AccordionTrigger>
      <AccordionContent>{item.answer}</AccordionContent>
    </AccordionItem>
  ))
  return (
    <div style={{ width: 460, maxWidth: "100%" }}>
      {type === "multiple" ? (
        <Accordion key="multiple" type="multiple" defaultValue={["shipping"]}>
          {items}
        </Accordion>
      ) : (
        <Accordion key="single" type="single" collapsible={collapsible} defaultValue="shipping">
          {items}
        </Accordion>
      )}
    </div>
  )
}

/* ----------------------------------------------------------- Breadcrumb */

const trail: BreadcrumbItem[] = [
  { label: "Home", href: "#/", icon: <House /> },
  { label: "Women", href: "#/women" },
  { label: "Clothing", href: "#/women/clothing" },
  { label: "Shirts", href: "#/women/clothing/shirts" },
  { label: "Linen overshirt" },
]

const separatorFor = (separator: string) =>
  separator === "slash" ? "/" : separator === "dot" ? "·" : undefined

/* ----------------------------------------------------------- Pagination */

const ProductPages = ({
  pageCount,
  siblings,
  size,
  compact,
}: {
  pageCount: number
  siblings: number
  size: "sm" | "md" | "lg"
  compact: boolean
}) => {
  const [page, setPage] = useState(6)
  return (
    <Pagination
      page={Math.min(page, pageCount)}
      pageCount={pageCount}
      siblings={siblings}
      size={size}
      compact={compact}
      onPageChange={setPage}
    />
  )
}

export const demos = [
  defineDemo({
    id: "tabs",
    name: "Tabs",
    category: "Navigation",
    description: "Paper folder tabs, plus underline and pill styles.",
    exports: ["Tabs", "TabsList", "TabsTrigger", "TabsContent"],
    controls: {
      variant: {
        type: "select",
        options: ["enclosed", "underline", "pill"],
        default: "enclosed",
      },
      orientation: {
        type: "select",
        options: ["horizontal", "vertical"],
        default: "horizontal",
      },
      activationMode: {
        type: "select",
        options: ["automatic", "manual"],
        default: "automatic",
      },
    },
    render: (values) => <ProductTabs {...values} />,
    code: ({ variant, orientation, activationMode }) =>
      `import { Tabs, TabsContent, TabsList, TabsTrigger } from "kitgrid"\n\n` +
      jsx(
        "Tabs",
        { defaultValue: "details", orientation, activationMode },
        jsx(
          "TabsList",
          { variant, "aria-label": "Product information" },
          tabs
            .map((tab) => `<TabsTrigger value="${tab.value}">${tab.label}</TabsTrigger>`)
            .join("\n"),
          { variant: "enclosed" },
        ) +
          "\n" +
          tabs
            .map((tab) => `<TabsContent value="${tab.value}">${tab.body}</TabsContent>`)
            .join("\n"),
        { orientation: "horizontal", activationMode: "automatic" },
      ),
    accessibility: [
      "tablist / tab / tabpanel roles with aria-selected, aria-controls and aria-labelledby; only the selected tab is in the tab order.",
      "Arrow keys move between tabs (Left/Right, or Up/Down when vertical, mirrored in RTL); Home/End jump; disabled tabs are skipped.",
      "automatic selects on focus; manual moves focus only and waits for Enter or Space.",
      "Panels are focusable (tabIndex 0) so content without controls is still reachable; forceMount keeps inactive panels mounted but hidden.",
    ],
  }),
  defineDemo({
    id: "breadcrumb",
    name: "Breadcrumb",
    category: "Navigation",
    description: "A trail with an optional collapsed middle.",
    exports: ["Breadcrumb"],
    serverSafe: true,
    controls: {
      maxItems: {
        type: "number",
        min: 0,
        max: 5,
        step: 1,
        default: 0,
        label: "maxItems (0 = off)",
      },
      separator: {
        type: "select",
        options: ["chevron", "slash", "dot"],
        default: "chevron",
      },
    },
    render: ({ maxItems, separator }) => (
      <Breadcrumb
        key={maxItems}
        items={trail}
        maxItems={maxItems || undefined}
        separator={separatorFor(separator)}
      />
    ),
    code: ({ maxItems, separator }) =>
      `import { Breadcrumb } from "kitgrid"\nimport { House } from "lucide-react"\n\nconst items = [\n  { label: "Home", href: "/", icon: <House /> },\n  { label: "Women", href: "/women" },\n  { label: "Clothing", href: "/women/clothing" },\n  { label: "Shirts", href: "/women/clothing/shirts" },\n  { label: "Linen overshirt" },\n]\n\n` +
      jsx("Breadcrumb", {
        items: raw("items"),
        maxItems: maxItems || undefined,
        separator: separatorFor(separator),
      }),
    accessibility: [
      "A <nav> landmark named “Breadcrumb” containing an ordered list, as the APG breadcrumb pattern specifies.",
      'The last item carries aria-current="page"; separators are aria-hidden so they\'re never read.',
      "The collapsed ellipsis is a labelled button; expanding moves focus to the first revealed link.",
      "Pass renderLink to render each crumb with a router link such as Next.js Link.",
    ],
  }),
  defineDemo({
    id: "pagination",
    name: "Pagination",
    category: "Navigation",
    description: "Page ranges as buttons or links.",
    exports: ["Pagination", "paginationRange"],
    serverSafe: true,
    controls: {
      pageCount: { type: "number", min: 1, max: 40, step: 1, default: 20 },
      siblings: { type: "number", min: 0, max: 3, step: 1, default: 1 },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      compact: { type: "boolean", default: false },
    },
    render: (values) => <ProductPages {...values} />,
    code: ({ pageCount, siblings, size, compact }) =>
      `import { Pagination } from "kitgrid"\nimport { useState } from "react"\n\nfunction Example() {\n  const [page, setPage] = useState(6)\n  return (\n` +
      indent(
        jsx(
          "Pagination",
          {
            page: raw("page"),
            pageCount,
            siblings,
            size,
            compact,
            onPageChange: raw("setPage"),
          },
          undefined,
          { siblings: 1, size: "md" },
        ),
        2,
      ) +
      `\n  )\n}\n\n<Example />`,
    accessibility: [
      'A <nav> landmark named “Pagination”; every control has a name like “Page 4”, and the current one has aria-current="page".',
      "Ellipses are aria-hidden; Previous and Next are disabled at the ends (aria-disabled links in link mode).",
      "Pass getHref instead of onPageChange for crawlable links that need no client JavaScript.",
      "The number of slots never changes between pages, so controls don't jump under the pointer.",
    ],
  }),
  defineDemo({
    id: "accordion",
    name: "Accordion",
    category: "Data Display",
    description: "Single or multiple disclosure panels.",
    exports: ["Accordion", "AccordionItem", "AccordionTrigger", "AccordionContent"],
    controls: {
      type: { type: "select", options: ["single", "multiple"], default: "single" },
      collapsible: { type: "boolean", default: true, label: "Collapsible (single)" },
    },
    render: (values) => <Faq {...values} />,
    code: ({ type, collapsible }) =>
      `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "kitgrid"\n\n` +
      jsx(
        "Accordion",
        {
          type,
          collapsible: type === "single" ? collapsible : undefined,
          defaultValue: type === "multiple" ? raw(`["shipping"]`) : "shipping",
        },
        faq
          .map(
            (item) =>
              `<AccordionItem value="${item.value}">\n  <AccordionTrigger>${item.question}</AccordionTrigger>\n  <AccordionContent>${item.answer}</AccordionContent>\n</AccordionItem>`,
          )
          .join("\n"),
      ),
    accessibility: [
      "Each trigger is a button inside a heading (level prop, default h3) with aria-expanded and aria-controls; panels are labelled regions.",
      "ArrowUp/ArrowDown move between headers, Home/End jump to the first and last; arrows inside a panel's content are left alone.",
      'In a single, non-collapsible accordion the open header reports aria-disabled="true", as APG recommends.',
      "Closed panels animate shut and then become visibility: hidden, leaving the tab order and accessibility tree without unmounting.",
    ],
  }),
]
