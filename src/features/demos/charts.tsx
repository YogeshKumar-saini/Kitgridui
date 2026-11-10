import type { ReactNode } from "react"
import {
  AreaChart,
  BandChart,
  BarChart,
  BoxplotChart,
  BulletChart,
  CandlestickChart,
  Chart,
  ComboChart,
  DivergingBars,
  DonutChart,
  DumbbellChart,
  FunnelChart,
  GaugeChart,
  GraphChart,
  HeatmapChart,
  HistogramChart,
  LineChart,
  LollipopChart,
  MekkoChart,
  ParallelChart,
  PictorialBarChart,
  PolarBarChart,
  ProgressRingChart,
  RadarChart,
  RadialStackedChart,
  RankedBars,
  SankeyChart,
  ScatterChart,
  SlopeChart,
  SparkGrid,
  Sparkline,
  StackedPercentBar,
  SunburstChart,
  ThemeRiverChart,
  TreeChart,
  TreemapChart,
  WaffleChart,
  WaterfallChart,
  formatCompact,
} from "kitgrid/charts"
import { defineDemo, jsx, raw } from "./registry"

class Expr {
  constructor(readonly code: string) {}
}

const expr = (code: string) => new Expr(code)

const keyOf = (key: string) => (/^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key))

/** Prints a value as a JavaScript literal, so snippets declare exactly the data the preview draws. */
const lit = (value: unknown, pad = ""): string => {
  if (value instanceof Expr) return value.code
  const inner = `${pad}  `
  if (Array.isArray(value)) {
    if (value.every((item) => item === null || typeof item !== "object"))
      return `[${value.map((item) => lit(item)).join(", ")}]`
    return `[\n${value.map((item) => inner + lit(item, inner)).join(",\n")},\n${pad}]`
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value).filter(([, item]) => item !== undefined)
    const flat = `{ ${entries.map(([key, item]) => `${keyOf(key)}: ${lit(item, pad)}`).join(", ")} }`
    if (flat.length + pad.length <= 92 && !flat.includes("\n")) return flat
    return `{\n${entries
      .map(([key, item]) => `${inner}${keyOf(key)}: ${lit(item, inner)}`)
      .join(",\n")},\n${pad}}`
  }
  return JSON.stringify(value)
}

/** Import line, top-level declarations, then one JSX expression. */
const snippet = (names: string[], decls: Record<string, unknown>, body: string) =>
  `import { ${names.join(", ")} } from "kitgrid/charts"\n\n` +
  Object.entries(decls)
    .map(([name, value]) => `const ${name} = ${lit(value)}\n\n`)
    .join("") +
  body

const inline = (value: unknown) => raw(lit(value, "  "))

const revenue = [
  { month: "Jan", online: 42800, retail: 31200, wholesale: 18400 },
  { month: "Feb", online: 45100, retail: 29800, wholesale: 19900 },
  { month: "Mar", online: 51900, retail: 33400, wholesale: 18100 },
  { month: "Apr", online: 49600, retail: 35100, wholesale: 21300 },
  { month: "May", online: 55300, retail: 34200, wholesale: 22800 },
  { month: "Jun", online: 61200, retail: 36900, wholesale: 21600 },
]

const channelSeries = [
  { key: "online", label: "Online" },
  { key: "retail", label: "Retail" },
  { key: "wholesale", label: "Wholesale" },
]

const quarters = [
  { quarter: "Q1", online: 139800, retail: 94400, wholesale: 56400 },
  { quarter: "Q2", online: 166100, retail: 106200, wholesale: 65700 },
  { quarter: "Q3", online: 190100, retail: 114300, wholesale: 69400 },
  { quarter: "Q4", online: 257000, retail: 136500, wholesale: 79000 },
]

const ordersByMonth = revenue.map(({ month, online, retail }) => ({
  month,
  online,
  retail,
  orders: Math.round((online + retail) / 62),
}))

const categories = [
  { label: "Outerwear", value: 184200 },
  { label: "Knitwear", value: 142900 },
  { label: "Denim", value: 121400 },
  { label: "Footwear", value: 98700 },
  { label: "Accessories", value: 76300 },
  { label: "Shirts", value: 64100 },
]

const shareChange = [
  { label: "Outerwear", value: 0.042 },
  { label: "Footwear", value: 0.018 },
  { label: "Knitwear", value: 0.009 },
  { label: "Denim", value: -0.021 },
  { label: "Swim", value: -0.034 },
]

const channels = [
  { label: "Online", value: 753000 },
  { label: "Retail", value: 451400 },
  { label: "Wholesale", value: 270500 },
  { label: "Marketplace", value: 118900 },
]

const weekly = [31, 34, 33, 38, 41, 40, 46, 48].map((value) => value * 1000)
const weeks = weekly.map((_, index) => `W${index + 1}`)

const stores = [
  { label: "Lisbon", value: 48200, delta: 12.4, trend: [31, 34, 33, 38, 41, 40, 46, 48] },
  { label: "Porto", value: 31900, delta: -3.8, trend: [36, 35, 37, 34, 33, 34, 32, 32] },
  { label: "Madrid", value: 66400, delta: 8.1, trend: [52, 55, 54, 58, 61, 60, 63, 66] },
  { label: "Seville", value: 27300, delta: 15.6, trend: [18, 19, 21, 20, 23, 24, 26, 27] },
]

const storeProfile = [
  { measure: "Sales", lisbon: 82, porto: 64, madrid: 91 },
  { measure: "Conversion", lisbon: 71, porto: 78, madrid: 66 },
  { measure: "Basket", lisbon: 58, porto: 69, madrid: 84 },
  { measure: "Margin", lisbon: 76, porto: 62, madrid: 70 },
  { measure: "Retention", lisbon: 63, porto: 81, madrid: 59 },
]

const profileSeries = [
  { key: "lisbon", label: "Lisbon" },
  { key: "porto", label: "Porto" },
  { key: "madrid", label: "Madrid" },
]

const heatDays = ["Mon", "Tue", "Wed", "Thu", "Fri"]
const heatHours = ["10:00", "13:00", "16:00", "19:00"]
const heatOrders = [
  [32, 58, 41, 66],
  [35, 61, 44, 70],
  [38, 64, 46, 74],
  [41, 66, 50, 81],
  [52, 79, 63, 96],
]
const heatChange = [
  [0.04, 0.12, -0.03, 0.18],
  [-0.06, 0.08, 0.02, 0.11],
  [0.01, -0.09, -0.14, 0.05],
  [0.09, 0.15, 0.03, -0.04],
  [0.21, 0.06, -0.08, 0.13],
]
const toCells = (matrix: number[][]) =>
  heatDays.flatMap((y, d) =>
    heatHours.map((x, h) => ({ x, y, value: matrix[d]?.[h] ?? 0 })),
  )
const cellsCode = `days.flatMap((y, d) => hours.map((x, h) => ({ x, y, value: values[d]?.[h] ?? 0 })))`

const calendarDays = Array.from({ length: 91 }, (_, i) => {
  const date = new Date(Date.UTC(2026, 0, 1 + i))
  const weekend = date.getUTCDay() % 6 === 0
  return {
    date: date.toISOString().slice(0, 10),
    value: 120 + (weekend ? 70 : 0) + Math.round(30 * Math.sin(i * 0.7)),
  }
})
const calendarCode = `Array.from({ length: 91 }, (_, i) => {
  const date = new Date(Date.UTC(2026, 0, 1 + i))
  const weekend = date.getUTCDay() % 6 === 0
  return {
    date: date.toISOString().slice(0, 10),
    value: 120 + (weekend ? 70 : 0) + Math.round(30 * Math.sin(i * 0.7)),
  }
})`

const bridge = [
  { label: "Q3", value: 412000, kind: "total" as const },
  { label: "Price", value: 38400 },
  { label: "Volume", value: 61200 },
  { label: "Mix", value: -22800 },
  { label: "Markdowns", value: -41300 },
  { label: "Q4", kind: "total" as const },
]

const valueFlow = [
  { source: "Online", target: "Gross sales", value: 753000 },
  { source: "Retail", target: "Gross sales", value: 451400 },
  { source: "Wholesale", target: "Gross sales", value: 270500 },
  { source: "Gross sales", target: "Net sales", value: 1312300 },
  { source: "Gross sales", target: "Returns", value: 162600 },
]

const assortment = [
  {
    label: "Women",
    children: [
      { label: "Outerwear", value: 118400 },
      { label: "Knitwear", value: 86200 },
    ],
  },
  {
    label: "Men",
    children: [
      { label: "Shirts", value: 64100 },
      { label: "Denim", value: 56500 },
    ],
  },
  {
    label: "Shoes",
    children: [
      { label: "Sneakers", value: 61300 },
      { label: "Boots", value: 37400 },
    ],
  },
]

const checkout = [
  { label: "Views", value: 184200 },
  { label: "Added to bag", value: 41800 },
  { label: "Checkout", value: 19600 },
  { label: "Payment", value: 12900 },
  { label: "Orders", value: 11400 },
]

const portfolio = [
  { label: "Outerwear", x: 0.124, y: 0.58, size: 184200, group: "Apparel" },
  { label: "Denim", x: -0.032, y: 0.49, size: 121400, group: "Apparel" },
  { label: "Swim", x: -0.081, y: 0.53, size: 31800, group: "Apparel" },
  { label: "Sneakers", x: 0.172, y: 0.41, size: 61300, group: "Footwear" },
  { label: "Boots", x: 0.044, y: 0.46, size: 37400, group: "Footwear" },
  { label: "Bags", x: 0.096, y: 0.67, size: 44800, group: "Accessories" },
]

const baskets = [
  { label: "Lisbon", from: 62.4, to: 71.8 },
  { label: "Porto", from: 58.1, to: 55.3 },
  { label: "Madrid", from: 74.9, to: 82.6 },
  { label: "Seville", from: 48.7, to: 57.9 },
  { label: "Bilbao", from: 66.3, to: 61.2 },
]

const scorecard = [
  { label: "Lisbon", value: 48200, target: 52000, bands: [30000, 42000, 60000] },
  { label: "Porto", value: 31900, target: 36000, bands: [24000, 32000, 44000] },
  { label: "Madrid", value: 66400, target: 61000, bands: [40000, 55000, 72000] },
  { label: "Seville", value: 27300, target: 24000, bands: [16000, 22000, 32000] },
]

const regionMix = [
  { region: "Iberia", online: 312000, retail: 228000, wholesale: 96000 },
  { region: "France", online: 204000, retail: 92000, wholesale: 71000 },
  { region: "Benelux", online: 128000, retail: 41000, wholesale: 52000 },
  { region: "Italy", online: 21000, retail: 71400, wholesale: 27500 },
]

const paceActual = [38, 79, 117, 161, 198]
const paceLast = [34, 70, 101, 140, 176, 211, 249, 286]
const pace = paceLast.map((last, index) => {
  const ahead = index - 4
  const forecast = ahead >= 0 ? 198000 + ahead * 44000 : null
  return {
    week: `W${index + 1}`,
    actual: paceActual[index] === undefined ? null : (paceActual[index] ?? 0) * 1000,
    lastYear: last * 1000,
    forecast,
    low: forecast === null ? null : forecast - ahead * 9000,
    high: forecast === null ? null : forecast + ahead * 11000,
  }
})

const seeded = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const priceRandom = seeded(7)
const candles = Array.from({ length: 10 }, (_, index) => index).reduce<
  { label: string; open: number; close: number; low: number; high: number }[]
>((list, index) => {
  const open = list[index - 1]?.close ?? 142
  const close = Math.round((open + (priceRandom() - 0.46) * 9) * 10) / 10
  const high = Math.round((Math.max(open, close) + priceRandom() * 3.5) * 10) / 10
  const low = Math.round((Math.min(open, close) - priceRandom() * 3.5) * 10) / 10
  list.push({ label: `Oct ${index + 1}`, open, close, low, high })
  return list
}, [])

const leadRandom = seeded(11)
const sample = (centre: number, spread: number, tail = 0) =>
  Array.from({ length: 12 }, (_, index) =>
    Math.round(
      (centre +
        (leadRandom() + leadRandom() + leadRandom() - 1.5) * spread +
        (index < tail ? spread * 3.2 : 0)) *
        10,
    ) / 10,
  )
const leadTimes = [
  { label: "Lisbon", values: sample(2.4, 1.1, 1) },
  { label: "Madrid", values: sample(3.1, 1.4, 1) },
  { label: "Porto", values: sample(2.0, 0.8) },
  { label: "Seville", values: sample(3.8, 1.9, 1) },
]

const basketValues = Array.from({ length: 240 }, (_, i) =>
  Math.round(
    64 +
      14 * (Math.sin(i * 12.9898) + Math.sin(i * 78.233) + Math.sin(i * 37.719)) +
      (i % 11 === 0 ? 60 : 0),
  ),
)
const basketCode = `Array.from({ length: 240 }, (_, i) =>
  Math.round(
    64 +
      14 * (Math.sin(i * 12.9898) + Math.sin(i * 78.233) + Math.sin(i * 37.719)) +
      (i % 11 === 0 ? 60 : 0),
  ),
)`

const conversionShift = [
  { label: "Lisbon", from: 0.031, to: 0.038 },
  { label: "Porto", from: 0.034, to: 0.029 },
  { label: "Madrid", from: 0.027, to: 0.033 },
  { label: "Seville", from: 0.036, to: 0.03 },
  { label: "Bilbao", from: 0.022, to: 0.027 },
]

const channelMix = [
  { region: "North", online: 48, retail: 31, wholesale: 21 },
  { region: "Central", online: 39, retail: 42, wholesale: 19 },
  { region: "South", online: 56, retail: 28, wholesale: 16 },
  { region: "Export", online: 22, retail: 9, wholesale: 69 },
]

const productFit = [
  { product: "Parka", price: 289, rating: 4.7, margin: 0.58, returns: 0.04 },
  { product: "Merino crew", price: 119, rating: 4.5, margin: 0.64, returns: 0.07 },
  { product: "Jeans", price: 165, rating: 4.2, margin: 0.52, returns: 0.13 },
  { product: "Runner", price: 145, rating: 4.4, margin: 0.41, returns: 0.09 },
  { product: "Tote", price: 45, rating: 4.6, margin: 0.72, returns: 0.02 },
]

const productDimensions = [
  { key: "price", label: "Price", format: "currency" },
  { key: "rating", label: "Rating", format: "number" },
  { key: "margin", label: "Margin", format: "percent" },
  { key: "returns", label: "Returns", format: "percent", inverse: true },
] as const

const serviceNodes = [
  { id: "Checkout", group: "Storefront" },
  { id: "Cart", group: "Storefront" },
  { id: "Pricing", group: "Core" },
  { id: "Inventory", group: "Core" },
  { id: "Payments", group: "Core" },
  { id: "Orders", group: "Core" },
  { id: "Carrier", group: "Partners" },
]
const serviceLinks = [
  { source: "Checkout", target: "Cart" },
  { source: "Checkout", target: "Payments" },
  { source: "Checkout", target: "Orders" },
  { source: "Cart", target: "Pricing" },
  { source: "Cart", target: "Inventory" },
  { source: "Orders", target: "Inventory" },
  { source: "Orders", target: "Carrier" },
]

const catalogTree = {
  label: "Catalog",
  children: [
    { label: "Apparel", children: [{ label: "Outerwear" }, { label: "Denim" }] },
    { label: "Footwear", children: [{ label: "Running" }, { label: "Boots" }] },
    { label: "Accessories", children: [{ label: "Bags" }, { label: "Hats" }] },
  ],
}

const topicWeeks = Array.from({ length: 8 }, (_, index) => {
  const wave = (shift: number, size: number) =>
    Math.round(size * (1.2 + Math.sin(index / 1.4 + shift)) * 10) / 10
  return {
    week: new Date(Date.UTC(2026, 6, 6 + index * 7)).toISOString().slice(0, 10),
    delivery: wave(0, 14),
    sizing: wave(1.8, 10),
    returns: wave(3.4, 8),
  }
})

const topics = [
  { key: "delivery", label: "Delivery" },
  { key: "sizing", label: "Sizing" },
  { key: "returns", label: "Returns" },
]

const segments = [
  { label: "Loyal", value: 8.4 },
  { label: "Returning", value: 6.1 },
  { label: "New", value: 4.3 },
  { label: "Lapsed", value: 2.2 },
]

const goals = [
  { label: "Revenue", value: 1_420_000, target: 1_600_000 },
  { label: "Orders", value: 21_900, target: 20_000 },
  { label: "Customers", value: 3_180, target: 5_000 },
]

const Frame = ({ children, width = 720 }: { children: ReactNode; width?: number }) => (
  <div
    style={{
      width: "100%",
      maxWidth: width,
      margin: "auto",
      padding: "24px 20px",
      boxSizing: "border-box",
    }}
  >
    {children}
  </div>
)

const legendValue = (legend: string) =>
  legend === "auto"
    ? undefined
    : legend === "none"
      ? false
      : (legend as "top" | "bottom")

const legendCode = (legend: string) =>
  legend === "auto" ? undefined : legend === "none" ? raw("false") : legend

const legendControl = {
  type: "select",
  options: ["auto", "top", "bottom", "none"],
  default: "auto",
} as const

const shared = {
  category: "Charts",
  importFrom: "kitgrid/charts",
  peers: ["echarts"],
  layout: "fill",
} as const

const themingNote =
  "Colors come from the --kg-* properties in scope, so dark mode and accent changes recolor the canvas live."

export const demos = [
  defineDemo({
    ...shared,
    id: "line-chart",
    name: "Line Chart",
    description: "Trends over time, straight, smooth or stepped.",
    exports: ["LineChart"],
    controls: {
      curve: {
        type: "select",
        options: ["linear", "smooth", "step"],
        default: "smooth",
      },
      area: { type: "boolean", default: false },
      points: { type: "boolean", default: false },
      legend: legendControl,
    },
    render: ({ curve, area, points, legend }) => (
      <Frame>
        <LineChart
          label="Monthly revenue by channel"
          data={revenue}
          xKey="month"
          series={channelSeries}
          curve={curve}
          area={area}
          points={points}
          legend={legendValue(legend)}
          format="currency"
        />
      </Frame>
    ),
    code: ({ curve, area, points, legend }) =>
      snippet(
        ["LineChart"],
        { data: revenue, series: channelSeries },
        jsx(
          "LineChart",
          {
            label: "Monthly revenue by channel",
            data: raw("data"),
            xKey: "month",
            series: raw("series"),
            curve,
            area,
            points,
            legend: legendCode(legend),
            format: "currency",
          },
          undefined,
          { curve: "linear" },
        ),
      ),
    accessibility: [
      'The canvas is a named image (role="img"), described by a visually hidden table of every value.',
      "Animation is skipped under reduced motion, live.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "area-chart",
    name: "Area Chart",
    description: "Composition over time as stacked bands.",
    exports: ["AreaChart"],
    controls: {
      mode: {
        type: "select",
        options: ["stacked", "overlap", "percent", "stream"],
        default: "stacked",
      },
      curve: {
        type: "select",
        options: ["smooth", "linear", "step"],
        default: "smooth",
      },
      legend: legendControl,
    },
    render: ({ mode, curve, legend }) => (
      <Frame>
        <AreaChart
          label="Revenue mix by channel"
          data={revenue}
          xKey="month"
          series={channelSeries}
          mode={mode}
          curve={curve}
          legend={legendValue(legend)}
          format="currency"
        />
      </Frame>
    ),
    code: ({ mode, curve, legend }) =>
      snippet(
        ["AreaChart"],
        { data: revenue, series: channelSeries },
        jsx(
          "AreaChart",
          {
            label: "Revenue mix by channel",
            data: raw("data"),
            xKey: "month",
            series: raw("series"),
            mode,
            curve,
            legend: legendCode(legend),
            format: "currency",
          },
          undefined,
          { mode: "stacked", curve: "smooth" },
        ),
      ),
    accessibility: [
      "Percent mode shows each band's share in the tooltip next to its raw value.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "bar-chart",
    name: "Bar Chart",
    description: "Columns or rows per category, grouped or stacked.",
    exports: ["BarChart"],
    controls: {
      orientation: {
        type: "select",
        options: ["vertical", "horizontal"],
        default: "vertical",
      },
      stacked: { type: "boolean", default: false },
      values: { type: "boolean", default: false },
      legend: legendControl,
    },
    render: ({ orientation, stacked, values, legend }) => (
      <Frame>
        <BarChart
          label="Revenue by channel"
          data={quarters}
          xKey="quarter"
          series={channelSeries}
          orientation={orientation}
          stacked={stacked}
          values={values}
          legend={legendValue(legend)}
          format="currency"
        />
      </Frame>
    ),
    code: ({ orientation, stacked, values, legend }) =>
      snippet(
        ["BarChart"],
        { data: quarters, series: channelSeries },
        jsx(
          "BarChart",
          {
            label: "Revenue by channel",
            data: raw("data"),
            xKey: "quarter",
            series: raw("series"),
            orientation,
            stacked,
            values,
            legend: legendCode(legend),
            format: "currency",
          },
          undefined,
          { orientation: "vertical" },
        ),
      ),
    accessibility: [
      "Hovering a category shows every series in one tooltip, titled by the category.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "ranked-bars",
    name: "Ranked Bars",
    description: "Rows sorted largest first.",
    exports: ["RankedBars"],
    controls: {
      limit: { type: "number", min: 3, max: 6, step: 1, default: 6 },
      sort: { type: "select", options: ["desc", "asc", "none"], default: "desc" },
      values: { type: "boolean", default: true },
      color: {
        type: "select",
        options: ["accent", "info", "success", "neutral"],
        default: "accent",
      },
    },
    render: ({ limit, sort, values, color }) => (
      <Frame width={560}>
        <RankedBars
          label="Revenue by category"
          data={categories}
          limit={limit}
          sort={sort}
          values={values}
          color={color}
          format="currency"
        />
      </Frame>
    ),
    code: ({ limit, sort, values, color }) =>
      snippet(
        ["RankedBars"],
        { data: categories },
        jsx(
          "RankedBars",
          {
            label: "Revenue by category",
            data: raw("data"),
            limit,
            sort,
            values,
            color,
            format: "currency",
          },
          undefined,
          { limit: 10, sort: "desc", values: true, color: "accent" },
        ),
      ),
    accessibility: [
      "Height follows the row count, so every label stays legible.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "diverging-bars",
    name: "Diverging Bars",
    description: "Rows above or below zero.",
    exports: ["DivergingBars"],
    controls: {
      invert: { type: "boolean", default: false, label: "Down is good" },
      values: { type: "boolean", default: true },
      sort: { type: "select", options: ["desc", "asc", "none"], default: "desc" },
    },
    render: ({ invert, values, sort }) => (
      <Frame width={560}>
        <DivergingBars
          label="Change in share by category"
          data={shareChange}
          invert={invert}
          values={values}
          sort={sort}
          format="percent"
        />
      </Frame>
    ),
    code: ({ invert, values, sort }) =>
      snippet(
        ["DivergingBars"],
        { data: shareChange },
        jsx(
          "DivergingBars",
          {
            label: "Change in share by category",
            data: raw("data"),
            invert,
            values,
            sort,
            format: "percent",
          },
          undefined,
          { values: true, sort: "desc" },
        ),
      ),
    accessibility: [
      "Values print with an explicit sign, so direction never relies on color.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "combo-chart",
    name: "Combo Chart",
    description: "Columns and a line on two axes.",
    exports: ["ComboChart"],
    controls: {
      dualAxis: { type: "boolean", default: true, label: "Second axis" },
      stacked: { type: "boolean", default: false },
      curve: {
        type: "select",
        options: ["smooth", "linear", "step"],
        default: "smooth",
      },
      legend: legendControl,
    },
    render: ({ dualAxis, stacked, curve, legend }) => (
      <Frame>
        <ComboChart
          label="Revenue and orders"
          data={ordersByMonth}
          xKey="month"
          bars={channelSeries.slice(0, 2)}
          lines={[{ key: "orders", label: "Orders" }]}
          format="currency"
          lineFormat="number"
          dualAxis={dualAxis}
          stacked={stacked}
          curve={curve}
          legend={legendValue(legend)}
        />
      </Frame>
    ),
    code: ({ dualAxis, stacked, curve, legend }) =>
      snippet(
        ["ComboChart"],
        { data: ordersByMonth },
        jsx(
          "ComboChart",
          {
            label: "Revenue and orders",
            data: raw("data"),
            xKey: "month",
            bars: inline(channelSeries.slice(0, 2)),
            lines: inline([{ key: "orders", label: "Orders" }]),
            format: "currency",
            lineFormat: "number",
            dualAxis,
            stacked,
            curve,
            legend: legendCode(legend),
          },
          undefined,
          { dualAxis: true, curve: "smooth" },
        ),
      ),
    accessibility: [
      "The hidden table carries bar and line columns side by side.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "donut-chart",
    name: "Donut Chart",
    description: "Share of a whole, as a donut or pie.",
    exports: ["DonutChart"],
    controls: {
      variant: { type: "select", options: ["donut", "pie"], default: "donut" },
      labels: { type: "boolean", default: true },
      legend: { ...legendControl, default: "none" },
      centerLabel: { type: "text", default: "Net revenue" },
    },
    render: ({ variant, labels, legend, centerLabel }) => (
      <Frame width={520}>
        <DonutChart
          label="Revenue by channel"
          data={channels}
          variant={variant}
          labels={labels}
          legend={legendValue(legend)}
          centerLabel={centerLabel || undefined}
          format="currency"
        />
      </Frame>
    ),
    code: ({ variant, labels, legend, centerLabel }) =>
      snippet(
        ["DonutChart"],
        { data: channels },
        jsx(
          "DonutChart",
          {
            label: "Revenue by channel",
            data: raw("data"),
            variant,
            labels: labels ? undefined : raw("false"),
            legend: legendCode(legend),
            centerLabel: centerLabel || undefined,
            format: "currency",
          },
          undefined,
          { variant: "donut" },
        ),
      ),
    accessibility: [
      "Outside labels print each share as a percentage, not only a slice size.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "sparkline",
    name: "Sparkline",
    description: "A trend at the size of a word.",
    exports: ["Sparkline"],
    controls: {
      color: {
        type: "select",
        options: ["accent", "success", "danger", "info", "neutral"],
        default: "accent",
      },
      area: { type: "boolean", default: true },
      smooth: { type: "boolean", default: true },
      reference: { type: "boolean", default: false, label: "Average line" },
    },
    render: ({ color, area, smooth, reference }) => (
      <Frame width={280}>
        <Sparkline
          label="Online revenue, last 8 weeks"
          values={weekly}
          labels={weeks}
          color={color}
          area={area}
          smooth={smooth}
          reference={reference ? 38875 : undefined}
          format="currency"
          height={56}
        />
      </Frame>
    ),
    code: ({ color, area, smooth, reference }) =>
      snippet(
        ["Sparkline"],
        { values: weekly, labels: weeks },
        jsx(
          "Sparkline",
          {
            label: "Online revenue, last 8 weeks",
            values: raw("values"),
            labels: raw("labels"),
            color,
            area: area ? undefined : raw("false"),
            smooth: smooth ? undefined : raw("false"),
            reference: reference ? 38875 : undefined,
            format: "currency",
            height: 56,
          },
          undefined,
          { color: "accent" },
        ),
      ),
    accessibility: [
      "Named by its label and described by a hidden table of points.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "spark-grid",
    name: "Spark Grid",
    description: "A grid of KPI tiles with sparklines.",
    exports: ["SparkGrid"],
    controls: {
      minTileWidth: { type: "number", min: 140, max: 320, step: 10, default: 220 },
      size: { type: "select", options: ["sm", "md"], default: "sm" },
      helper: { type: "text", default: "vs last week" },
    },
    render: ({ minTileWidth, size, helper }) => (
      <Frame width={600}>
        <SparkGrid
          aria-label="Revenue by store"
          items={stores}
          format="currency"
          minTileWidth={minTileWidth}
          size={size}
          helper={helper || undefined}
        />
      </Frame>
    ),
    code: ({ minTileWidth, size, helper }) =>
      snippet(
        ["SparkGrid"],
        { items: stores },
        jsx(
          "SparkGrid",
          {
            "aria-label": "Revenue by store",
            items: raw("items"),
            format: "currency",
            minTileWidth,
            size,
            helper: helper || undefined,
          },
          undefined,
          { minTileWidth: 180, size: "sm" },
        ),
      ),
    accessibility: [
      "A list of description lists: each label stays paired with its value.",
      "The change reads as “up 12.4%” in words, and each sparkline is named with its start and end.",
    ],
  }),

  defineDemo({
    ...shared,
    id: "gauge-chart",
    name: "Gauge Chart",
    description: "One value against its range on an arc.",
    exports: ["GaugeChart"],
    controls: {
      value: { type: "number", min: 0, max: 100, step: 1, default: 78 },
      target: { type: "number", min: 0, max: 100, step: 1, default: 90 },
      caption: { type: "text", default: "Of monthly goal" },
      color: {
        type: "select",
        options: ["accent", "success", "warning", "info"],
        default: "accent",
      },
    },
    render: ({ value, target, caption, color }) => (
      <Frame width={300}>
        <GaugeChart
          label="Monthly goal progress"
          value={value}
          max={100}
          target={target || undefined}
          caption={caption || undefined}
          color={color}
          format={(n) => `${Math.round(n)}%`}
        />
      </Frame>
    ),
    code: ({ value, target, caption, color }) =>
      snippet(
        ["GaugeChart"],
        {},
        jsx(
          "GaugeChart",
          {
            label: "Monthly goal progress",
            value,
            max: 100,
            target: target || undefined,
            caption: caption || undefined,
            color,
            format: raw("(n) => `${Math.round(n)}%`"),
          },
          undefined,
          { color: "accent" },
        ),
      ),
    accessibility: [
      "The hidden table states value, range and target in words.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "chart",
    name: "Chart",
    description: "The ECharts host every chart is built on.",
    exports: ["Chart", "formatCompact"],
    controls: {
      height: { type: "number", min: 180, max: 420, step: 20, default: 280 },
    },
    render: ({ height }) => (
      <Frame>
        <Chart
          label="Average order value by weekday"
          height={height}
          option={(tokens) => ({
            grid: { left: 4, right: 12, top: 12, bottom: 4, containLabel: true },
            tooltip: { trigger: "axis" },
            xAxis: {
              type: "category",
              data: ["Mon", "Tue", "Wed", "Thu", "Fri"],
              axisTick: { show: false },
              axisLine: { lineStyle: { color: tokens.border } },
            },
            yAxis: {
              type: "value",
              splitLine: { lineStyle: { color: tokens.grid, type: "dashed" } },
              axisLabel: {
                formatter: (n: number) => formatCompact(n, { currency: "USD" }),
              },
            },
            series: [
              {
                type: "bar",
                data: [62, 58, 64, 71, 88],
                itemStyle: { color: tokens.accent, borderRadius: [6, 6, 2, 2] },
                barMaxWidth: 28,
              },
            ],
          })}
        />
      </Frame>
    ),
    code: ({ height }) =>
      snippet(
        ["Chart", "formatCompact"],
        { days: ["Mon", "Tue", "Wed", "Thu", "Fri"], aov: [62, 58, 64, 71, 88] },
        `<Chart
  label="Average order value by weekday"${height === 280 ? "" : `\n  height={${height}}`}
  option={(tokens) => ({
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: days },
    yAxis: {
      type: "value",
      axisLabel: { formatter: (n: number) => formatCompact(n, { currency: "USD" }) },
    },
    series: [{ type: "bar", data: aov, itemStyle: { color: tokens.accent } }],
  })}
/>`,
      ),
    accessibility: [
      "Pass summary={{ columns, rows }} to describe a custom chart with a hidden table.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "radar-chart",
    name: "Radar Chart",
    description: "Profiles across several measures.",
    exports: ["RadarChart"],
    controls: {
      filled: { type: "boolean", default: true },
      shared: { type: "boolean", default: false, label: "Shared ceiling" },
      legend: { ...legendControl, default: "bottom" },
    },
    render: ({ filled, shared: ceiling, legend }) => (
      <Frame width={520}>
        <RadarChart
          label="Store profiles"
          data={storeProfile}
          xKey="measure"
          series={profileSeries}
          filled={filled}
          max={ceiling ? 100 : undefined}
          legend={legendValue(legend)}
          format="number"
          height={320}
        />
      </Frame>
    ),
    code: ({ filled, shared: ceiling, legend }) =>
      snippet(
        ["RadarChart"],
        { data: storeProfile, series: profileSeries },
        jsx("RadarChart", {
          label: "Store profiles",
          data: raw("data"),
          xKey: "measure",
          series: raw("series"),
          filled: filled ? undefined : raw("false"),
          max: ceiling ? 100 : undefined,
          legend: legendCode(legend),
          format: "number",
        }),
      ),
    accessibility: [
      "The tooltip lists every spoke's value for the shape under the pointer.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "heatmap-chart",
    name: "Heatmap Chart",
    description: "Intensity across two categories or a calendar.",
    exports: ["HeatmapChart"],
    controls: {
      mode: { type: "select", options: ["grid", "calendar"], default: "grid" },
      scheme: {
        type: "select",
        options: ["sequential", "diverging"],
        default: "sequential",
      },
      values: { type: "boolean", default: true },
    },
    render: ({ mode, scheme, values }) => (
      <Frame width={mode === "calendar" ? 760 : 600}>
        {mode === "calendar" ? (
          <HeatmapChart
            label="Daily orders, first quarter"
            days={calendarDays}
            scheme={scheme}
            format="number"
          />
        ) : (
          <HeatmapChart
            label="Orders by hour"
            data={toCells(scheme === "diverging" ? heatChange : heatOrders)}
            scheme={scheme}
            values={values}
            format={scheme === "diverging" ? "percent" : "number"}
          />
        )}
      </Frame>
    ),
    code: ({ mode, scheme, values }) =>
      mode === "calendar"
        ? snippet(
            ["HeatmapChart"],
            { days: expr(calendarCode) },
            jsx(
              "HeatmapChart",
              {
                label: "Daily orders, first quarter",
                days: raw("days"),
                scheme,
                format: "number",
              },
              undefined,
              { scheme: "sequential" },
            ),
          )
        : snippet(
            ["HeatmapChart"],
            {
              days: heatDays,
              hours: heatHours,
              values: scheme === "diverging" ? heatChange : heatOrders,
              data: expr(cellsCode),
            },
            jsx(
              "HeatmapChart",
              {
                label: "Orders by hour",
                data: raw("data"),
                scheme,
                values: values ? undefined : raw("false"),
                format: scheme === "diverging" ? "percent" : "number",
              },
              undefined,
              { scheme: "sequential" },
            ),
          ),
    accessibility: [
      "Values print in each cell, so intensity never rests on color alone.",
      "The hidden table is the grid itself: one row per category, one column per column.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "waterfall-chart",
    name: "Waterfall Chart",
    description: "A bridge from start to end through each change.",
    exports: ["WaterfallChart"],
    controls: {
      invert: { type: "boolean", default: false, label: "Down is good" },
      values: { type: "boolean", default: true },
    },
    render: ({ invert, values }) => (
      <Frame>
        <WaterfallChart
          label="Gross margin bridge, Q3 to Q4"
          data={bridge}
          invert={invert}
          values={values}
          format="currency"
        />
      </Frame>
    ),
    code: ({ invert, values }) =>
      snippet(
        ["WaterfallChart"],
        {},
        jsx("WaterfallChart", {
          label: "Gross margin bridge, Q3 to Q4",
          data: inline(bridge),
          invert,
          values: values ? undefined : raw("false"),
          format: "currency",
        }),
      ),
    accessibility: [
      "Changes print with an explicit sign, and the tooltip gives the level after each step.",
      "A total without a value closes the running sum.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "sankey-chart",
    name: "Sankey Chart",
    description: "Flows between stages, sized by value.",
    exports: ["SankeyChart"],
    controls: {
      orient: {
        type: "select",
        options: ["horizontal", "vertical"],
        default: "horizontal",
      },
    },
    render: ({ orient }) => (
      <Frame>
        <SankeyChart
          label="Revenue from channel to net sales"
          links={valueFlow}
          orient={orient}
          format="currency"
          height={orient === "vertical" ? 420 : 320}
        />
      </Frame>
    ),
    code: ({ orient }) =>
      snippet(
        ["SankeyChart"],
        { links: valueFlow },
        jsx(
          "SankeyChart",
          {
            label: "Revenue from channel to net sales",
            links: raw("links"),
            orient,
            format: "currency",
          },
          undefined,
          { orient: "horizontal" },
        ),
      ),
    accessibility: [
      "Hovering a node lights its flows; the tooltip names both ends of a flow in words.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "sunburst-chart",
    name: "Sunburst Chart",
    description: "A hierarchy as rings.",
    exports: ["SunburstChart"],
    controls: {
      labels: { type: "boolean", default: true },
    },
    render: ({ labels }) => (
      <Frame width={480}>
        <SunburstChart
          label="Revenue by department and category"
          data={assortment}
          labels={labels}
          format="currency"
        />
      </Frame>
    ),
    code: ({ labels }) =>
      snippet(
        ["SunburstChart"],
        { data: assortment },
        jsx("SunburstChart", {
          label: "Revenue by department and category",
          data: raw("data"),
          labels: labels ? undefined : raw("false"),
          format: "currency",
        }),
      ),
    accessibility: ["The tooltip names the full path and the share of the total.", themingNote],
  }),

  defineDemo({
    ...shared,
    id: "treemap-chart",
    name: "Treemap Chart",
    description: "A hierarchy as nested tiles.",
    exports: ["TreemapChart"],
    controls: {
      nested: { type: "boolean", default: true },
      labels: { type: "boolean", default: true },
    },
    render: ({ nested, labels }) => (
      <Frame>
        <TreemapChart
          label="Revenue by department and category"
          data={nested ? assortment : categories}
          labels={labels}
          format="currency"
          height={320}
        />
      </Frame>
    ),
    code: ({ nested, labels }) =>
      snippet(
        ["TreemapChart"],
        { data: nested ? assortment : categories },
        jsx("TreemapChart", {
          label: "Revenue by department and category",
          data: raw("data"),
          labels: labels ? undefined : raw("false"),
          format: "currency",
        }),
      ),
    accessibility: ["The hidden table lists every leaf by its path.", themingNote],
  }),

  defineDemo({
    ...shared,
    id: "funnel-chart",
    name: "Funnel Chart",
    description: "How many make it through each stage.",
    exports: ["FunnelChart"],
    controls: {
      conversion: { type: "boolean", default: true },
    },
    render: ({ conversion }) => (
      <Frame width={560}>
        <FunnelChart
          label="Checkout funnel, last 30 days"
          data={checkout}
          conversion={conversion}
          format="number"
        />
      </Frame>
    ),
    code: ({ conversion }) =>
      snippet(
        ["FunnelChart"],
        { data: checkout },
        jsx("FunnelChart", {
          label: "Checkout funnel, last 30 days",
          data: raw("data"),
          conversion: conversion ? undefined : raw("false"),
          format: "number",
        }),
      ),
    accessibility: [
      "The tooltip adds the step conversion from the previous stage.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "scatter-chart",
    name: "Scatter Chart",
    description: "Two measures per point, split into quadrants.",
    exports: ["ScatterChart"],
    controls: {
      quadrants: { type: "boolean", default: true },
      bubbles: { type: "boolean", default: true },
      labels: { type: "boolean", default: true },
      legend: legendControl,
    },
    render: ({ quadrants, bubbles, labels, legend }) => (
      <Frame>
        <ScatterChart
          label="Categories by growth and margin"
          data={bubbles ? portfolio : portfolio.map(({ size: _size, ...point }) => point)}
          xLabel="Growth"
          yLabel="Margin"
          sizeLabel="Revenue"
          xFormat="percent"
          yFormat="percent"
          sizeFormat="currency"
          quadrants={quadrants}
          labels={labels}
          legend={legendValue(legend)}
        />
      </Frame>
    ),
    code: ({ quadrants, bubbles, labels, legend }) =>
      snippet(
        ["ScatterChart"],
        {
          data: bubbles ? portfolio : portfolio.map(({ size: _size, ...point }) => point),
        },
        jsx("ScatterChart", {
          label: "Categories by growth and margin",
          data: raw("data"),
          xLabel: "Growth",
          yLabel: "Margin",
          sizeLabel: bubbles ? "Revenue" : undefined,
          xFormat: "percent",
          yFormat: "percent",
          sizeFormat: bubbles ? "currency" : undefined,
          quadrants,
          labels,
          legend: legendCode(legend),
        }),
      ),
    accessibility: [
      "Bubbles scale by area, so a value twice as large reads twice as big.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "dumbbell-chart",
    name: "Dumbbell Chart",
    description: "Each row's change between two periods.",
    exports: ["DumbbellChart"],
    controls: {
      sort: { type: "select", options: ["desc", "asc", "none"], default: "desc" },
      invert: { type: "boolean", default: false, label: "Down is good" },
    },
    render: ({ sort, invert }) => (
      <Frame width={620}>
        <DumbbellChart
          label="Average basket by store"
          data={baskets}
          fromLabel="Last year"
          toLabel="This year"
          sort={sort}
          invert={invert}
          format="currency"
        />
      </Frame>
    ),
    code: ({ sort, invert }) =>
      snippet(
        ["DumbbellChart"],
        { data: baskets },
        jsx(
          "DumbbellChart",
          {
            label: "Average basket by store",
            data: raw("data"),
            fromLabel: "Last year",
            toLabel: "This year",
            sort,
            invert,
            format: "currency",
          },
          undefined,
          { sort: "none" },
        ),
      ),
    accessibility: [
      "Before and after differ in shape (hollow and solid) as well as color.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "bullet-chart",
    name: "Bullet Chart",
    description: "A value against its target and ranges.",
    exports: ["BulletChart"],
    controls: {
      bands: { type: "boolean", default: true, label: "Ranges" },
      color: {
        type: "select",
        options: ["accent", "info", "neutral"],
        default: "accent",
      },
    },
    render: ({ bands, color }) => (
      <Frame width={620}>
        <BulletChart
          label="Store sales against target"
          data={bands ? scorecard : scorecard.map(({ bands: _bands, ...row }) => row)}
          color={color}
          format="currency"
        />
      </Frame>
    ),
    code: ({ bands, color }) =>
      snippet(
        ["BulletChart"],
        { data: bands ? scorecard : scorecard.map(({ bands: _bands, ...row }) => row) },
        jsx(
          "BulletChart",
          {
            label: "Store sales against target",
            data: raw("data"),
            color,
            format: "currency",
          },
          undefined,
          { color: "accent" },
        ),
      ),
    accessibility: [
      "The tooltip states value, target and the share of target reached in words.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "mekko-chart",
    name: "Mekko Chart",
    description: "Column widths and segment heights as shares.",
    exports: ["MekkoChart"],
    controls: {
      values: { type: "boolean", default: true },
      legend: legendControl,
    },
    render: ({ values, legend }) => (
      <Frame>
        <MekkoChart
          label="Channel mix by region"
          data={regionMix}
          xKey="region"
          series={channelSeries}
          values={values}
          legend={legendValue(legend)}
          format="currency"
        />
      </Frame>
    ),
    code: ({ values, legend }) =>
      snippet(
        ["MekkoChart"],
        { data: regionMix, series: channelSeries },
        jsx("MekkoChart", {
          label: "Channel mix by region",
          data: raw("data"),
          xKey: "region",
          series: raw("series"),
          values: values ? undefined : raw("false"),
          legend: legendCode(legend),
          format: "currency",
        }),
      ),
    accessibility: [
      "Column names and their share print under each column; segment shares print inside where they fit.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "polar-bar-chart",
    name: "Polar Bar Chart",
    description: "Bars bent around a centre.",
    exports: ["PolarBarChart"],
    controls: {
      variant: { type: "select", options: ["radial", "rose"], default: "radial" },
    },
    render: ({ variant }) => (
      <Frame width={480}>
        <PolarBarChart
          label="Revenue by channel"
          data={channels}
          variant={variant}
          format="currency"
        />
      </Frame>
    ),
    code: ({ variant }) =>
      snippet(
        ["PolarBarChart"],
        { data: channels },
        jsx(
          "PolarBarChart",
          { label: "Revenue by channel", data: raw("data"), variant, format: "currency" },
          undefined,
          { variant: "radial" },
        ),
      ),
    accessibility: [
      "Each ring's name and value print upright where it starts, never along the curve.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "band-chart",
    name: "Band Chart",
    description: "Lines inside a shaded range or forecast cone.",
    exports: ["BandChart"],
    controls: {
      mid: { type: "boolean", default: true, label: "Projected path" },
      marker: { type: "boolean", default: true, label: "Today rule" },
      lastYear: { type: "boolean", default: true, label: "Last year" },
    },
    render: ({ mid, marker, lastYear }) => (
      <Frame>
        <BandChart
          label="Cumulative sales against last year, with forecast"
          data={pace}
          xKey="week"
          series={
            lastYear
              ? [
                  { key: "actual", label: "This year" },
                  { key: "lastYear", label: "Last year", color: "neutral", dashed: true },
                ]
              : [{ key: "actual", label: "This year" }]
          }
          band={{
            low: "low",
            high: "high",
            mid: mid ? "forecast" : undefined,
            label: "Forecast range",
            midLabel: "Forecast",
          }}
          markers={marker ? [{ x: "W5", label: "Today" }] : undefined}
          format="currency"
        />
      </Frame>
    ),
    code: ({ mid, marker, lastYear }) =>
      snippet(
        ["BandChart"],
        { data: pace },
        jsx("BandChart", {
          label: "Cumulative sales against last year, with forecast",
          data: raw("data"),
          xKey: "week",
          series: inline(
            lastYear
              ? [
                  { key: "actual", label: "This year" },
                  { key: "lastYear", label: "Last year", color: "neutral", dashed: true },
                ]
              : [{ key: "actual", label: "This year" }],
          ),
          band: inline({
            low: "low",
            high: "high",
            mid: mid ? "forecast" : undefined,
            label: "Forecast range",
            midLabel: "Forecast",
          }),
          markers: marker ? inline([{ x: "W5", label: "Today" }]) : undefined,
          format: "currency",
        }),
      ),
    accessibility: [
      "The tooltip reads the range as words, “from X to Y”, beside each line's value.",
      "The forecast is dashed, so it differs from actuals by more than color.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "candlestick-chart",
    name: "Candlestick Chart",
    description: "Open, high, low and close per period.",
    exports: ["CandlestickChart"],
    controls: {
      average: { type: "boolean", default: true, label: "3-day average" },
    },
    render: ({ average }) => (
      <Frame>
        <CandlestickChart
          label="Share price, October"
          data={candles}
          average={average ? 3 : undefined}
          format="currency"
        />
      </Frame>
    ),
    code: ({ average }) =>
      snippet(
        ["CandlestickChart"],
        { data: candles },
        jsx("CandlestickChart", {
          label: "Share price, October",
          data: raw("data"),
          average: average ? 3 : undefined,
          format: "currency",
        }),
      ),
    accessibility: [
      "Rising candles are hollow and falling ones filled, so direction never rests on color.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "boxplot-chart",
    name: "Boxplot Chart",
    description: "Spread and outliers, computed from raw values.",
    exports: ["BoxplotChart"],
    controls: {
      orientation: {
        type: "select",
        options: ["vertical", "horizontal"],
        default: "vertical",
      },
      outliers: { type: "boolean", default: true },
    },
    render: ({ orientation, outliers }) => (
      <Frame width={620}>
        <BoxplotChart
          label="Delivery lead time by store, days"
          data={leadTimes}
          orientation={orientation}
          outliers={outliers}
          format="number"
        />
      </Frame>
    ),
    code: ({ orientation, outliers }) =>
      snippet(
        ["BoxplotChart"],
        { data: leadTimes },
        jsx(
          "BoxplotChart",
          {
            label: "Delivery lead time by store, days",
            data: raw("data"),
            orientation,
            outliers: outliers ? undefined : raw("false"),
            format: "number",
          },
          undefined,
          { orientation: "vertical" },
        ),
      ),
    accessibility: [
      "The hidden table lists each group's five numbers and its outlier count.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "histogram-chart",
    name: "Histogram Chart",
    description: "How values distribute, binned on round edges.",
    exports: ["HistogramChart"],
    controls: {
      bins: { type: "number", min: 4, max: 24, step: 1, default: 12 },
      showMedian: { type: "boolean", default: true, label: "Median" },
    },
    render: ({ bins, showMedian }) => (
      <Frame>
        <HistogramChart
          label="Basket value"
          values={basketValues}
          bins={bins}
          showMedian={showMedian}
          format="currency"
        />
      </Frame>
    ),
    code: ({ bins, showMedian }) =>
      snippet(
        ["HistogramChart"],
        { values: expr(basketCode) },
        jsx("HistogramChart", {
          label: "Basket value",
          values: raw("values"),
          bins,
          showMedian,
          format: "currency",
        }),
      ),
    accessibility: [
      "Each bin's range is spoken as “from X to Y” in the tooltip and the table.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "slope-chart",
    name: "Slope Chart",
    description: "Who rose and who fell between two moments.",
    exports: ["SlopeChart"],
    controls: {
      highlight: { type: "boolean", default: false, label: "Highlight two" },
    },
    render: ({ highlight }) => (
      <Frame width={520}>
        <SlopeChart
          label="Conversion by store"
          data={conversionShift}
          fromLabel="2025"
          toLabel="2026"
          highlight={highlight ? ["Lisbon", "Seville"] : undefined}
          format="percent"
        />
      </Frame>
    ),
    code: ({ highlight }) =>
      snippet(
        ["SlopeChart"],
        { data: conversionShift },
        jsx("SlopeChart", {
          label: "Conversion by store",
          data: raw("data"),
          fromLabel: "2025",
          toLabel: "2026",
          highlight: highlight ? raw(`["Lisbon", "Seville"]`) : undefined,
          format: "percent",
        }),
      ),
    accessibility: ["Every end carries its value as text; the tooltip adds the change.", themingNote],
  }),

  defineDemo({
    ...shared,
    id: "stacked-percent-bar",
    name: "Stacked Percent Bar",
    description: "Composition per row, every bar to 100%.",
    exports: ["StackedPercentBar"],
    controls: {
      orientation: {
        type: "select",
        options: ["horizontal", "vertical"],
        default: "horizontal",
      },
      labels: { type: "boolean", default: true },
    },
    render: ({ orientation, labels }) => (
      <Frame width={620}>
        <StackedPercentBar
          label="Channel mix by region"
          data={channelMix}
          xKey="region"
          series={channelSeries}
          orientation={orientation}
          labels={labels}
          format="number"
        />
      </Frame>
    ),
    code: ({ orientation, labels }) =>
      snippet(
        ["StackedPercentBar"],
        { data: channelMix, series: channelSeries },
        jsx(
          "StackedPercentBar",
          {
            label: "Channel mix by region",
            data: raw("data"),
            xKey: "region",
            series: raw("series"),
            orientation,
            labels: labels ? undefined : raw("false"),
          },
          undefined,
          { orientation: "horizontal" },
        ),
      ),
    accessibility: ["Segment labels pick ink or surface by contrast with their fill.", themingNote],
  }),

  defineDemo({
    ...shared,
    id: "parallel-chart",
    name: "Parallel Chart",
    description: "Many measures, one axis each, one line per item.",
    exports: ["ParallelChart"],
    controls: {
      highlight: { type: "boolean", default: true, label: "Highlight best" },
    },
    render: ({ highlight }) => (
      <Frame>
        <ParallelChart
          label="Product scorecard"
          data={productFit}
          labelKey="product"
          dimensions={[...productDimensions]}
          highlight={highlight ? ["Parka", "Tote"] : undefined}
        />
      </Frame>
    ),
    code: ({ highlight }) =>
      snippet(
        ["ParallelChart"],
        { data: productFit },
        jsx("ParallelChart", {
          label: "Product scorecard",
          data: raw("data"),
          labelKey: "product",
          dimensions: inline(productDimensions),
          highlight: highlight ? raw(`["Parka", "Tote"]`) : undefined,
        }),
      ),
    accessibility: [
      "Inverted axes put the better end on top for measures like returns.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "graph-chart",
    name: "Graph Chart",
    description: "A network laid out by force.",
    exports: ["GraphChart"],
    controls: {
      labels: { type: "boolean", default: true },
      interactive: { type: "boolean", default: false, label: "Drag and pan" },
    },
    render: ({ labels, interactive }) => (
      <Frame>
        <GraphChart
          label="Service dependencies"
          nodes={serviceNodes}
          links={serviceLinks}
          labels={labels}
          interactive={interactive}
        />
      </Frame>
    ),
    code: ({ labels, interactive }) =>
      snippet(
        ["GraphChart"],
        { nodes: serviceNodes, links: serviceLinks },
        jsx("GraphChart", {
          label: "Service dependencies",
          nodes: raw("nodes"),
          links: raw("links"),
          labels: labels ? undefined : raw("false"),
          interactive,
        }),
      ),
    accessibility: [
      "Hovering a node dims everything but its neighbours.",
      "The hidden table lists every link.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "tree-chart",
    name: "Tree Chart",
    description: "A hierarchy as a tidy tree.",
    exports: ["TreeChart"],
    controls: {
      orient: {
        type: "select",
        options: ["horizontal", "vertical", "radial"],
        default: "horizontal",
      },
    },
    render: ({ orient }) => (
      <Frame>
        <TreeChart label="Catalog structure" data={catalogTree} orient={orient} />
      </Frame>
    ),
    code: ({ orient }) =>
      snippet(
        ["TreeChart"],
        { data: catalogTree },
        jsx(
          "TreeChart",
          { label: "Catalog structure", data: raw("data"), orient },
          undefined,
          { orient: "horizontal" },
        ),
      ),
    accessibility: [
      "Parents are filled and leaves hollow; branches collapse on click.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "theme-river-chart",
    name: "Theme River Chart",
    description: "A streamgraph of themes swelling and fading.",
    exports: ["ThemeRiverChart"],
    controls: { legend: legendControl },
    render: ({ legend }) => (
      <Frame>
        <ThemeRiverChart
          label="Support topics per week"
          data={topicWeeks}
          xKey="week"
          series={topics}
          legend={legendValue(legend)}
          format="number"
        />
      </Frame>
    ),
    code: ({ legend }) =>
      snippet(
        ["ThemeRiverChart"],
        { data: topicWeeks, series: topics },
        jsx("ThemeRiverChart", {
          label: "Support topics per week",
          data: raw("data"),
          xKey: "week",
          series: raw("series"),
          legend: legendCode(legend),
          format: "number",
        }),
      ),
    accessibility: ["The tooltip lists every theme for the hovered week.", themingNote],
  }),

  defineDemo({
    ...shared,
    id: "pictorial-bar-chart",
    name: "Pictorial Bar Chart",
    description: "Bars of repeated symbols.",
    exports: ["PictorialBarChart"],
    controls: {
      symbol: {
        type: "select",
        options: ["person", "circle", "square", "diamond", "drop"],
        default: "person",
      },
    },
    render: ({ symbol }) => (
      <Frame width={560}>
        <PictorialBarChart
          label="Customers by segment, thousands"
          data={segments}
          symbol={symbol}
          max={10}
          format="number"
        />
      </Frame>
    ),
    code: ({ symbol }) =>
      snippet(
        ["PictorialBarChart"],
        { data: segments },
        jsx(
          "PictorialBarChart",
          {
            label: "Customers by segment, thousands",
            data: raw("data"),
            symbol,
            max: 10,
            format: "number",
          },
          undefined,
          { symbol: "circle" },
        ),
      ),
    accessibility: ["Each row prints its value at the end of the track.", themingNote],
  }),

  defineDemo({
    ...shared,
    id: "lollipop-chart",
    name: "Lollipop Chart",
    description: "A ranked bar chart with less ink.",
    exports: ["LollipopChart"],
    controls: {
      orientation: {
        type: "select",
        options: ["horizontal", "vertical"],
        default: "horizontal",
      },
      labels: { type: "boolean", default: true },
    },
    render: ({ orientation, labels }) => (
      <Frame width={600}>
        <LollipopChart
          label="Revenue by category"
          data={categories}
          orientation={orientation}
          labels={labels}
          format="currency"
        />
      </Frame>
    ),
    code: ({ orientation, labels }) =>
      snippet(
        ["LollipopChart"],
        { data: categories },
        jsx(
          "LollipopChart",
          {
            label: "Revenue by category",
            data: raw("data"),
            orientation,
            labels: labels ? undefined : raw("false"),
            format: "currency",
          },
          undefined,
          { orientation: "horizontal" },
        ),
      ),
    accessibility: ["Values print beside each dot.", themingNote],
  }),

  defineDemo({
    ...shared,
    id: "waffle-chart",
    name: "Waffle Chart",
    description: "Parts of a whole in a grid of cells.",
    exports: ["WaffleChart"],
    controls: {
      roundness: { type: "number", min: 0, max: 1, step: 0.1, default: 0.3 },
    },
    render: ({ roundness }) => (
      <Frame width={400}>
        <WaffleChart
          label="Revenue by channel"
          data={channels}
          roundness={roundness}
          format="currency"
        />
      </Frame>
    ),
    code: ({ roundness }) =>
      snippet(
        ["WaffleChart"],
        { data: channels },
        jsx(
          "WaffleChart",
          { label: "Revenue by channel", data: raw("data"), roundness, format: "currency" },
          undefined,
          { roundness: 0.3 },
        ),
      ),
    accessibility: [
      "Cells are assigned by largest remainder, so they always add up to the grid.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "progress-ring-chart",
    name: "Progress Ring Chart",
    description: "Concentric rings closing on their own targets.",
    exports: ["ProgressRingChart"],
    controls: { center: { type: "boolean", default: true, label: "Centre value" } },
    render: ({ center }) => (
      <Frame width={520}>
        <ProgressRingChart label="Quarter goals" data={goals} center={center} format="compact" />
      </Frame>
    ),
    code: ({ center }) =>
      snippet(
        ["ProgressRingChart"],
        { data: goals },
        jsx("ProgressRingChart", {
          label: "Quarter goals",
          data: raw("data"),
          center: center ? undefined : raw("false"),
        }),
      ),
    accessibility: [
      "The legend prints each value against its target.",
      "A ring past its target stays full; the tooltip gives the real share.",
      themingNote,
    ],
  }),

  defineDemo({
    ...shared,
    id: "radial-stacked-chart",
    name: "Radial Stacked Chart",
    description: "Stacked columns wrapped around a cycle.",
    exports: ["RadialStackedChart"],
    controls: { legend: legendControl },
    render: ({ legend }) => (
      <Frame width={520}>
        <RadialStackedChart
          label="Monthly revenue by channel"
          data={revenue}
          xKey="month"
          series={channelSeries}
          legend={legendValue(legend)}
          format="currency"
        />
      </Frame>
    ),
    code: ({ legend }) =>
      snippet(
        ["RadialStackedChart"],
        { data: revenue, series: channelSeries },
        jsx("RadialStackedChart", {
          label: "Monthly revenue by channel",
          data: raw("data"),
          xKey: "month",
          series: raw("series"),
          legend: legendCode(legend),
          format: "currency",
        }),
      ),
    accessibility: ["The tooltip lists each channel and the month's total.", themingNote],
  }),
]
