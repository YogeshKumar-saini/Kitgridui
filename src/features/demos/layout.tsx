import {
  AspectRatio,
  Bleed,
  Box,
  Button,
  Center,
  Cluster,
  Code,
  Columns,
  Container,
  Frame,
  Grid,
  Heading,
  Hide,
  Link,
  Prose,
  Reel,
  Section,
  Show,
  Skeleton,
  Spacer,
  Stack,
  Sticky,
  Switcher,
  Text,
  VisuallyHidden,
} from "kitgrid"
import { X } from "lucide-react"
import type { CSSProperties, ReactNode } from "react"
import { defineDemo, jsx, raw } from "./registry"

const layout = { category: "App Shell", serverSafe: true } as const
const type = { category: "Data Display", serverSafe: true } as const

type Size = number | string | undefined

/** A still, neutral placeholder block, so a layout reads without any copy or color. */
const Tile = ({ w, h = 56, style }: { w?: Size; h?: Size; style?: CSSProperties }) => (
  <Skeleton shape="rect" animation="none" width={w} height={h} style={style} />
)

const prop = (name: string, value: Size) =>
  value === undefined ? "" : typeof value === "number" ? ` ${name}={${value}}` : ` ${name}="${value}"`

/** The same tile, printed as JSX for the code tab. */
const tile = (w?: Size, h: Size = 56, extra = "") =>
  `<Skeleton shape="rect" animation="none"${prop("width", w)}${prop("height", h)}${extra} />`

const indent = (text: string, depth = 1) =>
  text
    .split("\n")
    .map((line) => `${"  ".repeat(depth)}${line}`)
    .join("\n")

const importLine = (names: string[]) =>
  `import { ${[...names].sort().join(", ")} } from "kitgrid"\n\n`

const Stage = ({ children, width = 640 }: { children: ReactNode; width?: number }) => (
  <div style={{ width: "100%", maxWidth: width, margin: "auto", padding: 24, boxSizing: "border-box" }}>
    {children}
  </div>
)

const stackSizes = {
  vertical: [
    ["60%", 48],
    ["85%", 48],
    ["45%", 48],
  ],
  horizontal: [
    [96, 40],
    [96, 72],
    [96, 56],
  ],
} as const

const pillWidths = [56, 88, 72, 104, 64, 80]

export const demos = [
  defineDemo({
    ...layout,
    id: "box",
    name: "Box",
    description: "Padding, surface, radius, border and shadow from tokens.",
    exports: ["Box"],
    controls: {
      padding: { type: "number", min: 0, max: 12, step: 1, default: 6 },
      surface: {
        type: "select",
        options: ["surface", "raised", "sunken", "muted", "none"],
        default: "surface",
      },
      radius: { type: "select", options: ["none", "md", "lg", "xl", "2xl"], default: "xl" },
      shadow: { type: "select", options: ["none", "xs", "sm", "md", "lg"], default: "sm" },
    },
    render: ({ padding, surface, radius, shadow }) => (
      <Box
        padding={padding}
        surface={surface}
        radius={radius}
        shadow={shadow}
        border
        style={{ width: 260 }}
      >
        <Stack gap={3}>
          <Skeleton animation="none" width="40%" />
          <Skeleton animation="none" width="70%" height={20} />
        </Stack>
      </Box>
    ),
    code: ({ padding, surface, radius, shadow }) =>
      importLine(["Box", "Skeleton", "Stack"]) +
      jsx(
        "Box",
        { padding, surface, radius, shadow, border: true, style: raw("{ width: 260 }") },
        `<Stack gap={3}>\n  <Skeleton animation="none" width="40%" />\n  <Skeleton animation="none" width="70%" height={20} />\n</Stack>`,
        { surface: "none", shadow: "none" },
      ),
    accessibility: ["Renders a plain div by default; pass `as` for a semantic element."],
  }),

  defineDemo({
    ...layout,
    id: "stack",
    layout: "fill",
    name: "Stack",
    description: "Children in one column or row, evenly spaced.",
    exports: ["Stack"],
    controls: {
      direction: { type: "select", options: ["vertical", "horizontal"], default: "vertical" },
      gap: { type: "number", min: 0, max: 10, step: 1, default: 3 },
      align: {
        type: "select",
        options: ["stretch", "start", "center", "end"],
        default: "start",
      },
      dividers: { type: "boolean", default: false },
    },
    render: ({ direction, gap, align, dividers }) => (
      <Stage width={420}>
        <Stack direction={direction} gap={gap} align={align} dividers={dividers}>
          {stackSizes[direction].map(([w, h], index) => (
            <Tile key={index} w={align === "stretch" && direction === "vertical" ? undefined : w} h={h} />
          ))}
        </Stack>
      </Stage>
    ),
    code: ({ direction, gap, align, dividers }) =>
      importLine(["Skeleton", "Stack"]) +
      jsx(
        "Stack",
        { direction, gap, align, dividers },
        stackSizes[direction]
          .map(([w, h]) => tile(align === "stretch" && direction === "vertical" ? undefined : w, h))
          .join("\n"),
        { direction: "vertical", gap: 3, align: "stretch" },
      ),
    accessibility: ["Pass `as=\"ul\"` for a list; list styling is reset."],
  }),

  defineDemo({
    ...layout,
    id: "cluster",
    layout: "fill",
    name: "Cluster",
    description: "Items of any width that wrap as needed.",
    exports: ["Cluster"],
    controls: {
      gap: { type: "number", min: 0, max: 8, step: 1, default: 2 },
      justify: {
        type: "select",
        options: ["start", "center", "end", "between"],
        default: "start",
      },
    },
    render: ({ gap, justify }) => (
      <Stage width={360}>
        <Cluster gap={gap} justify={justify}>
          {pillWidths.map((w) => (
            <Tile key={w} w={w} h={28} style={{ borderRadius: 999 }} />
          ))}
        </Cluster>
      </Stage>
    ),
    code: ({ gap, justify }) =>
      importLine(["Cluster", "Skeleton"]) +
      `const widths = ${JSON.stringify(pillWidths).replace(/,/g, ", ")}\n\n` +
      jsx(
        "Cluster",
        { gap, justify },
        `{widths.map((width) => (\n  <Skeleton\n    key={width}\n    shape="rect"\n    animation="none"\n    width={width}\n    height={28}\n    style={{ borderRadius: 999 }}\n  />\n))}`,
        { gap: 2, justify: "start" },
      ),
  }),

  defineDemo({
    ...layout,
    id: "switcher",
    layout: "fill",
    name: "Switcher",
    description: "Side by side, or stacked below a width. No breakpoints.",
    exports: ["Switcher"],
    controls: {
      threshold: {
        type: "select",
        options: ["20rem", "30rem", "40rem", "60rem"],
        default: "30rem",
      },
    },
    render: ({ threshold }) => (
      <Stage>
        <Switcher threshold={threshold} gap={3}>
          <Tile h={72} />
          <Tile h={72} />
          <Tile h={72} />
        </Switcher>
      </Stage>
    ),
    code: ({ threshold }) =>
      importLine(["Skeleton", "Switcher"]) +
      jsx("Switcher", { threshold, gap: 3 }, [tile(undefined, 72), tile(undefined, 72), tile(undefined, 72)].join("\n"), {
        threshold: "30rem",
      }),
    accessibility: ["Reacts to its own width, so it works in any container."],
  }),

  defineDemo({
    ...layout,
    id: "reel",
    layout: "fill",
    name: "Reel",
    description: "A horizontal strip that scrolls and snaps.",
    exports: ["Reel"],
    controls: {
      snap: { type: "boolean", default: true },
      hideScrollbar: { type: "boolean", default: false },
    },
    render: ({ snap, hideScrollbar }) => (
      <Stage>
        <Reel label="New arrivals" itemWidth="10rem" snap={snap} hideScrollbar={hideScrollbar}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Frame key={n} ratio={4 / 5} radius="md" />
          ))}
        </Reel>
      </Stage>
    ),
    code: ({ snap, hideScrollbar }) =>
      importLine(["Frame", "Reel"]) +
      jsx(
        "Reel",
        { label: "New arrivals", itemWidth: "10rem", snap, hideScrollbar },
        `{[1, 2, 3, 4, 5, 6].map((n) => (\n  <Frame key={n} ratio={4 / 5} radius="md" />\n))}`,
        { snap: true },
      ),
    accessibility: [
      "A named region that takes focus, so arrow keys scroll it.",
      "Smooth scrolling is turned off under reduced motion.",
    ],
  }),

  defineDemo({
    ...layout,
    id: "grid",
    layout: "fill",
    name: "Grid",
    description: "Columns that follow the grid's own width.",
    exports: ["Grid"],
    controls: {
      mode: { type: "select", options: ["per width", "min width"], default: "per width" },
      gap: { type: "number", min: 0, max: 8, step: 1, default: 3 },
    },
    render: ({ mode, gap }) => (
      <Stage width={720}>
        <Grid
          columns={{ base: 1, sm: 2, md: 3 }}
          minItemWidth={mode === "min width" ? "9rem" : undefined}
          gap={gap}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Tile key={n} h={72} />
          ))}
        </Grid>
      </Stage>
    ),
    code: ({ mode, gap }) => {
      const children = `{[1, 2, 3, 4, 5, 6].map((n) => (\n  <Skeleton key={n} shape="rect" animation="none" height={72} />\n))}`
      const gapProp = gap === 4 ? "" : ` gap={${gap}}`
      return (
        importLine(["Grid", "Skeleton"]) +
        (mode === "min width"
          ? `<Grid minItemWidth="9rem"${gapProp}>\n${indent(children)}\n</Grid>`
          : `<Grid columns={{ base: 1, sm: 2, md: 3 }}${gapProp}>\n${indent(children)}\n</Grid>`)
      )
    },
    accessibility: [
      "Container queries, not media queries: the same grid fits a sidebar or a page.",
    ],
  }),

  defineDemo({
    ...layout,
    id: "columns",
    layout: "fill",
    name: "Columns",
    description: "A side column and a main column that stack when squeezed.",
    exports: ["Columns"],
    controls: {
      side: { type: "select", options: ["start", "end"], default: "start" },
      sideWidth: {
        type: "select",
        options: ["12rem", "16rem", "20rem"],
        default: "12rem",
      },
    },
    render: ({ side, sideWidth }) => {
      const aside = <Tile key="side" h={180} />
      const main = <Tile key="main" h={180} />
      return (
        <Stage width={720}>
          <Columns side={side} sideWidth={sideWidth} gap={3}>
            {side === "start" ? [aside, main] : [main, aside]}
          </Columns>
        </Stage>
      )
    },
    code: ({ side, sideWidth }) =>
      importLine(["Columns", "Skeleton"]) +
      jsx("Columns", { side, sideWidth, gap: 3 }, [tile(undefined, 180), tile(undefined, 180)].join("\n"), {
        side: "start",
        sideWidth: "16rem",
      }),
  }),

  defineDemo({
    ...layout,
    id: "center",
    layout: "fill",
    name: "Center",
    description: "A centred column with a readable maximum width.",
    exports: ["Center"],
    controls: {
      max: { type: "select", options: ["20rem", "32rem", "60ch"], default: "20rem" },
      intrinsic: { type: "boolean", default: false },
    },
    render: ({ max, intrinsic }) => (
      <Stage width={720}>
        <Center max={max} intrinsic={intrinsic} gutters={4}>
          <Stack gap={3}>
            <Tile w={intrinsic ? 160 : undefined} h={20} />
            <Tile w={intrinsic ? 220 : undefined} h={96} />
          </Stack>
        </Center>
      </Stage>
    ),
    code: ({ max, intrinsic }) =>
      importLine(["Center", "Skeleton", "Stack"]) +
      jsx(
        "Center",
        { max, intrinsic, gutters: 4 },
        `<Stack gap={3}>\n${indent(tile(intrinsic ? 160 : undefined, 20))}\n${indent(tile(intrinsic ? 220 : undefined, 96))}\n</Stack>`,
        { max: "60ch" },
      ),
  }),

  defineDemo({
    ...layout,
    id: "container",
    layout: "fill",
    name: "Container",
    description: "The page column, and a size container for what is inside.",
    exports: ["Container"],
    controls: {
      size: { type: "select", options: ["sm", "md", "lg", "xl", "prose"], default: "md" },
    },
    render: ({ size }) => (
      <div style={{ width: "100%", paddingBlock: 24 }}>
        <Container size={size}>
          <Tile h={120} />
        </Container>
      </div>
    ),
    code: ({ size }) =>
      importLine(["Container", "Skeleton"]) +
      jsx("Container", { size }, tile(undefined, 120), { size: "lg" }),
  }),

  defineDemo({
    ...layout,
    id: "section",
    layout: "fill",
    name: "Section",
    description: "A full-width band with vertical rhythm.",
    exports: ["Section"],
    controls: {
      spacing: { type: "select", options: ["sm", "md", "lg", "xl"], default: "md" },
      surface: {
        type: "select",
        options: ["none", "surface", "sunken", "muted"],
        default: "sunken",
      },
    },
    render: ({ spacing, surface }) => (
      <div style={{ width: "100%" }}>
        <Section spacing={spacing} surface={surface} aria-labelledby="section-demo">
          <Container size="md">
            <Stack gap={3}>
              <Heading id="section-demo" level={2} size="xl">
                Shipping
              </Heading>
              <Skeleton animation="none" lines={2} />
            </Stack>
          </Container>
        </Section>
      </div>
    ),
    code: ({ spacing, surface }) =>
      importLine(["Container", "Heading", "Section", "Skeleton", "Stack"]) +
      jsx(
        "Section",
        { spacing, surface, "aria-labelledby": "shipping" },
        `<Container size="md">\n  <Stack gap={3}>\n    <Heading id="shipping" level={2} size="xl">\n      Shipping\n    </Heading>\n    <Skeleton animation="none" lines={2} />\n  </Stack>\n</Container>`,
        { spacing: "md", surface: "none" },
      ),
    accessibility: ["Labelled by its heading, it is announced as a named region."],
  }),

  defineDemo({
    ...layout,
    id: "spacer",
    layout: "fill",
    name: "Spacer",
    description: "A fixed gap, or one that pushes siblings apart.",
    exports: ["Spacer"],
    controls: { flexible: { type: "boolean", default: true } },
    render: ({ flexible }) => (
      <Stage width={480}>
        <Stack direction="horizontal" gap={0} align="center">
          <Tile w={72} h={32} />
          <Spacer size={flexible ? undefined : 4} axis="inline" />
          <Tile w={120} h={32} />
        </Stack>
      </Stage>
    ),
    code: ({ flexible }) =>
      importLine(["Skeleton", "Spacer", "Stack"]) +
      `<Stack direction="horizontal" gap={0} align="center">\n  ${tile(72, 32)}\n  ${flexible ? `<Spacer axis="inline" />` : `<Spacer size={4} axis="inline" />`}\n  ${tile(120, 32)}\n</Stack>`,
    accessibility: ["Hidden from assistive tech."],
  }),

  defineDemo({
    ...layout,
    id: "aspect-ratio",
    layout: "fill",
    name: "Aspect Ratio",
    description: "Holds a ratio so embeds never jump.",
    exports: ["AspectRatio"],
    controls: {
      ratio: { type: "select", options: ["16 / 9", "4 / 3", "1 / 1", "21 / 9"], default: "16 / 9" },
    },
    render: ({ ratio }) => {
      const [w = 16, h = 9] = ratio.split(" / ").map(Number)
      return (
        <Stage width={420}>
          <AspectRatio ratio={w / h} style={{ borderRadius: "var(--kg-radius-lg)" }}>
            <Skeleton shape="rect" animation="none" height="100%" />
          </AspectRatio>
        </Stage>
      )
    },
    code: ({ ratio }) =>
      importLine(["AspectRatio", "Skeleton"]) +
      `<AspectRatio ratio={${ratio}} style={{ borderRadius: "var(--kg-radius-lg)" }}>\n  <Skeleton shape="rect" animation="none" height="100%" />\n</AspectRatio>`,
  }),

  defineDemo({
    ...layout,
    id: "frame",
    name: "Frame",
    description: "Crops media to a ratio, with a skeleton surface until it loads.",
    exports: ["Frame"],
    controls: {
      ratio: { type: "select", options: ["4 / 5", "1 / 1", "4 / 3", "16 / 9"], default: "4 / 5" },
      radius: { type: "select", options: ["none", "md", "lg", "xl", "full"], default: "lg" },
    },
    render: ({ ratio, radius }) => {
      const [w = 4, h = 5] = ratio.split(" / ").map(Number)
      return (
        <div style={{ width: 220 }}>
          <Frame ratio={w / h} radius={radius} />
        </div>
      )
    },
    code: ({ ratio, radius }) =>
      importLine(["Frame"]) +
      `<div style={{ width: 220 }}>\n  <Frame ratio={${ratio}}${radius === "lg" ? "" : ` radius="${radius}"`} />\n</div>`,
    accessibility: [
      "Put an <img> with its own alt text inside; the frame adds no semantics.",
      "An empty frame, or one whose image has no src yet, shows a still skeleton surface.",
    ],
  }),

  defineDemo({
    ...layout,
    id: "bleed",
    name: "Bleed",
    description: "Escapes the parent's padding for edge-to-edge media.",
    exports: ["Bleed"],
    controls: { inline: { type: "number", min: 0, max: 10, step: 1, default: 6 } },
    render: ({ inline }) => (
      <Box padding={6} surface="surface" radius="xl" border style={{ width: 320, overflow: "hidden" }}>
        <Stack gap={4}>
          <Skeleton animation="none" width="50%" />
          <Bleed inline={inline}>
            <Frame ratio={16 / 9} radius="none" edge={false} />
          </Bleed>
          <Skeleton animation="none" lines={2} />
        </Stack>
      </Box>
    ),
    code: ({ inline }) =>
      importLine(["Bleed", "Box", "Frame", "Skeleton", "Stack"]) +
      `<Box padding={6} surface="surface" radius="xl" border style={{ width: 320, overflow: "hidden" }}>\n  <Stack gap={4}>\n    <Skeleton animation="none" width="50%" />\n    <Bleed inline={${inline}}>\n      <Frame ratio={16 / 9} radius="none" edge={false} />\n    </Bleed>\n    <Skeleton animation="none" lines={2} />\n  </Stack>\n</Box>`,
  }),

  defineDemo({
    ...layout,
    serverSafe: false,
    id: "sticky",
    name: "Sticky",
    description: "Sticks to an edge and reports when stuck.",
    exports: ["Sticky"],
    render: () => (
      <div
        style={{
          width: 340,
          height: 260,
          overflow: "auto",
          border: "1px solid var(--kg-border)",
          borderRadius: "var(--kg-radius-lg)",
          background: "var(--kg-surface)",
        }}
      >
        <Sticky
          style={{
            padding: "12px 16px",
            background: "var(--kg-surface)",
            borderBottom: "1px solid var(--kg-border)",
          }}
        >
          <Text weight="semibold">Orders</Text>
        </Sticky>
        <Stack gap={3} style={{ padding: 16 }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Tile key={n} h={40} />
          ))}
        </Stack>
      </div>
    ),
    code: () =>
      importLine(["Skeleton", "Stack", "Sticky", "Text"]) +
      `<div style={{ height: 260, overflow: "auto", border: "1px solid var(--kg-border)" }}>\n  <Sticky style={{ padding: "12px 16px", background: "var(--kg-surface)" }}>\n    <Text weight="semibold">Orders</Text>\n  </Sticky>\n  <Stack gap={3} style={{ padding: 16 }}>\n    {[1, 2, 3, 4, 5, 6].map((n) => (\n      <Skeleton key={n} shape="rect" animation="none" height={40} />\n    ))}\n  </Stack>\n</div>`,
    accessibility: ["`data-stuck` is set while stuck, for a shadow or surface in CSS."],
  }),

  defineDemo({
    ...layout,
    id: "show",
    layout: "fill",
    name: "Show / Hide",
    description: "Width-based visibility in CSS alone.",
    exports: ["Show", "Hide"],
    controls: {
      scope: { type: "select", options: ["container", "viewport"], default: "container" },
    },
    render: ({ scope }) => (
      <Container size="md" style={{ paddingBlock: 48, textAlign: "center" }}>
        <Show above="md" scope={scope}>
          <Text>Wide layout</Text>
        </Show>
        <Hide above="md" scope={scope}>
          <Text>Compact layout</Text>
        </Hide>
      </Container>
    ),
    code: ({ scope }) => {
      const scopeProp = scope === "viewport" ? "" : ` scope="container"`
      return (
        importLine(["Container", "Hide", "Show", "Text"]) +
        `<Container size="md">\n  <Show above="md"${scopeProp}>\n    <Text>Wide layout</Text>\n  </Show>\n  <Hide above="md"${scopeProp}>\n    <Text>Compact layout</Text>\n  </Hide>\n</Container>`
      )
    },
    accessibility: [
      "Hidden content is display: none, so it is removed from the accessibility tree too.",
    ],
  }),

  defineDemo({
    ...layout,
    id: "visually-hidden",
    name: "Visually Hidden",
    description: "Read by screen readers, invisible on screen.",
    exports: ["VisuallyHidden"],
    render: () => (
      <Button variant="outline">
        <X aria-hidden />
        <VisuallyHidden>Close</VisuallyHidden>
      </Button>
    ),
    code: () =>
      importLine(["Button", "VisuallyHidden"]) +
      `import { X } from "lucide-react"\n\n<Button variant="outline">\n  <X aria-hidden />\n  <VisuallyHidden>Close</VisuallyHidden>\n</Button>`,
    accessibility: [
      "The button is announced as “Close” while showing only the icon.",
      "Pass focusable with asChild for a skip link that appears while focused.",
    ],
  }),

  defineDemo({
    ...type,
    id: "heading",
    name: "Heading",
    description: "Outline level and visual size, chosen apart.",
    exports: ["Heading"],
    controls: {
      text: { type: "text", default: "Autumn collection" },
      level: { type: "select", options: ["1", "2", "3", "4"], default: "2" },
      size: {
        type: "select",
        options: ["auto", "md", "lg", "xl", "2xl", "3xl", "4xl"],
        default: "auto",
      },
      tone: { type: "select", options: ["default", "muted", "accent"], default: "default" },
    },
    render: ({ text, level, size, tone }) => (
      <Heading
        level={Number(level) as 1 | 2 | 3 | 4}
        size={size === "auto" ? undefined : size}
        tone={tone}
      >
        {text}
      </Heading>
    ),
    code: ({ text, level, size, tone }) =>
      importLine(["Heading"]) +
      jsx(
        "Heading",
        { level: Number(level), size: size === "auto" ? undefined : size, tone },
        text,
        { level: 2, tone: "default" },
      ),
  }),

  defineDemo({
    ...type,
    id: "text",
    name: "Text",
    description: "Body text with tone, weight and clamping.",
    exports: ["Text"],
    controls: {
      size: { type: "select", options: ["xs", "sm", "base", "md", "lg", "xl"], default: "base" },
      tone: {
        type: "select",
        options: ["default", "muted", "faint", "accent", "success", "warning", "danger", "info"],
        default: "default",
      },
      lines: { type: "number", min: 0, max: 4, step: 1, default: 2 },
    },
    render: ({ size, tone, lines }) => (
      <div style={{ maxWidth: 340 }}>
        <Text size={size} tone={tone} lines={lines || undefined}>
          Garment-washed European flax with a relaxed, boxy cut and a curved hem that works tucked
          or loose.
        </Text>
      </div>
    ),
    code: ({ size, tone, lines }) =>
      importLine(["Text"]) +
      `<div style={{ maxWidth: 340 }}>\n${indent(
        jsx(
          "Text",
          { size, tone, lines: lines || undefined },
          "Garment-washed European flax with a relaxed, boxy cut and a curved hem that works tucked or loose.",
          { size: "base", tone: "default" },
        ),
      )}\n</div>`,
  }),

  defineDemo({
    ...type,
    id: "link",
    name: "Link",
    description: "Inline links with a safe external mode.",
    exports: ["Link"],
    controls: {
      tone: { type: "select", options: ["accent", "default", "muted"], default: "accent" },
      underline: { type: "select", options: ["always", "hover", "none"], default: "always" },
      external: { type: "boolean", default: true },
    },
    render: ({ tone, underline, external }) => (
      <Text>
        Read the{" "}
        <Link href="https://example.com" tone={tone} underline={underline} external={external}>
          returns policy
        </Link>
      </Text>
    ),
    code: ({ tone, underline, external }) =>
      importLine(["Link", "Text"]) +
      `<Text>\n  Read the{" "}\n${indent(
        jsx(
          "Link",
          { href: "https://example.com", tone, underline, external },
          "returns policy",
          { tone: "accent", underline: "always" },
        ),
      )}\n</Text>`,
    accessibility: [
      "External links add rel=\"noopener noreferrer\" and say “opens in a new tab”.",
      "Use asChild to style your router's link.",
    ],
  }),

  defineDemo({
    ...type,
    id: "code",
    name: "Code",
    description: "Inline code that scales with its text.",
    exports: ["Code"],
    controls: { tone: { type: "select", options: ["neutral", "accent"], default: "neutral" } },
    render: ({ tone }) => (
      <Text>
        Run <Code tone={tone}>npm run dev</Code> to start.
      </Text>
    ),
    code: ({ tone }) =>
      importLine(["Code", "Text"]) +
      `<Text>\n  Run ${jsx("Code", { tone }, "npm run dev", { tone: "neutral" })} to start.\n</Text>`,
  }),

  defineDemo({
    ...type,
    id: "prose",
    layout: "fill",
    name: "Prose",
    description: "Typesets Markdown or CMS HTML.",
    exports: ["Prose"],
    controls: { size: { type: "select", options: ["sm", "md", "lg"], default: "md" } },
    render: ({ size }) => (
      <Stage width={560}>
        <Prose size={size}>
          <h2>Care</h2>
          <p>
            Wash cold, inside out, and dry flat in the shade. Linen softens with every wash.
          </p>
          <ul>
            <li>Cool iron while damp</li>
            <li>No bleach</li>
          </ul>
        </Prose>
      </Stage>
    ),
    code: ({ size }) =>
      importLine(["Prose"]) +
      jsx(
        "Prose",
        { size },
        `<h2>Care</h2>\n<p>Wash cold, inside out, and dry flat in the shade. Linen softens with every wash.</p>\n<ul>\n  <li>Cool iron while damp</li>\n  <li>No bleach</li>\n</ul>`,
        { size: "md" },
      ),
    accessibility: ["Styles have zero specificity, so a class on any child wins."],
  }),
]
