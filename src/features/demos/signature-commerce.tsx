import {
  Carousel,
  CarouselSlide,
  DynamicIsland,
  DynamicIslandActivity,
  DynamicIslandRing,
  Price,
  ProductSpin,
  type ProductSpinHotspot,
  SwipeDeck,
} from "kitgrid"
import { Check, CreditCard, ShoppingBag, Timer, Truck } from "lucide-react"
import { type CSSProperties, type ReactNode, useEffect, useState } from "react"
import { type CatalogProduct, catalog } from "@/lib/data/catalog"
import { defineDemo, jsx, raw } from "./registry"

/** Neutral skeleton frames of an object turning on a plinth, with no backdrop of their own. */
const frames = Array.from({ length: 36 }, (_, i) => {
  const angle = (i / 36) * Math.PI * 2
  const w = Math.round(180 + 130 * Math.abs(Math.cos(angle)))
  const mark = 400 + Math.sin(angle) * w * 0.38
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">' +
    '<ellipse cx="400" cy="590" rx="240" ry="36" fill="#8a93a0" fill-opacity=".2"/>' +
    `<rect x="${400 - w / 2}" y="240" width="${w}" height="340" rx="32" fill="#8a93a0" fill-opacity=".3"/>` +
    `<rect x="${mark - 14}" y="272" width="28" height="276" rx="14" fill="#8a93a0" fill-opacity=".34"/>` +
    "</svg>"
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
})
const products = catalog.slice(0, 8)

const block = "color-mix(in oklab, var(--kg-muted), var(--kg-border) 55%)"

const muted: CSSProperties = { margin: 0, color: "var(--kg-fg-muted)" }

/** A product card as clean skeleton UI: a neutral block where the photo goes. */
const ProductTile = ({ product, flush = false }: { product: CatalogProduct; flush?: boolean }) => (
  <article
    style={{
      display: "grid",
      gap: 10,
      height: "100%",
      padding: flush ? 0 : 10,
      background: "var(--kg-surface)",
      border: flush ? 0 : "2px solid var(--kg-ink)",
      borderRadius: flush ? 0 : 18,
      boxShadow: flush ? "none" : "var(--kg-shadow-sm)",
      overflow: "hidden",
    }}
  >
    <div
      aria-hidden
      style={{ aspectRatio: "4 / 5", borderRadius: flush ? 0 : 12, background: block }}
    />
    <div style={{ display: "grid", gap: 2, padding: flush ? "4px 16px 16px" : "0 4px 4px" }}>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>
        {product.title}
      </h3>
      <Price amount={product.price} compareAt={product.compareAt} size="sm" />
    </div>
  </article>
)

const frameCode = `const frames = Array.from({ length: 36 }, (_, i) => {
  const w = Math.round(180 + 130 * Math.abs(Math.cos((i / 36) * Math.PI * 2)))
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">' +
    '<ellipse cx="400" cy="590" rx="240" ry="36" fill="#8a93a0" fill-opacity=".2"/>' +
    '<rect x="' + (400 - w / 2) + '" y="240" width="' + w + '" height="340" rx="32" fill="#8a93a0" fill-opacity=".3"/>' +
    "</svg>"
  return "data:image/svg+xml," + encodeURIComponent(svg)
})`

/* Product Spin ---------------------------------------------------------------------------- */

const hotspots: ProductSpinHotspot[] = [
  {
    id: "front",
    label: "Front panel",
    content: "Brushed aluminium, machined from one block.",
    frames: { from: 32, to: 4 },
    x: 50,
    y: 40,
  },
  {
    id: "side",
    label: "Side port",
    content: "USB-C with fast charge.",
    frames: { from: 7, to: 11 },
    x: 56,
    y: 62,
  },
]

const hotspotCode = `const hotspots = [
  { id: "front", label: "Front panel", content: "Brushed aluminium.", frames: { from: 32, to: 4 }, x: 50, y: 40 },
  { id: "side", label: "Side port", content: "USB-C with fast charge.", frames: { from: 7, to: 11 }, x: 56, y: 62 },
]`

/* Dynamic Island -------------------------------------------------------------------------- */

const islandStates = ["idle", "added", "shipped", "sale", "checkout"] as const
type IslandState = (typeof islandStates)[number]

const Phone = ({ children }: { children: ReactNode }) => (
  <div style={{ display: "grid", placeItems: "center", padding: "clamp(16px, 4vw, 36px)" }}>
    <div
      style={{
        position: "relative",
        width: "min(100%, 400px)",
        height: 340,
        padding: "12px 12px 0",
        background: "var(--kg-surface)",
        border: "2px solid var(--kg-ink)",
        borderRadius: 44,
        boxShadow: "var(--kg-shadow-md)",
        overflow: "hidden",
      }}
    >
      {children}
      <div
        aria-hidden
        style={{ position: "absolute", inset: "auto 24px 24px", display: "grid", gap: 10 }}
      >
        <span style={{ height: 120, borderRadius: 18, background: block }} />
        {[72, 48].map((width) => (
          <span
            key={width}
            style={{ height: 10, width: `${width}%`, borderRadius: 99, background: block }}
          />
        ))}
      </div>
    </div>
  </div>
)

const Thumb = () => (
  <span
    aria-hidden
    style={{
      display: "block",
      width: "100%",
      height: "100%",
      borderRadius: "inherit",
      background: "color-mix(in oklab, white 22%, transparent)",
    }}
  />
)

const useCountdown = (seconds: number) => {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    const timer = setInterval(() => setLeft((value) => (value > 0 ? value - 1 : seconds)), 1000)
    return () => clearInterval(timer)
  }, [seconds])
  return `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`
}

const IslandPlayground = ({
  stiffness,
  damping,
  initial,
}: {
  stiffness: number
  damping: number
  initial: IslandState
}) => {
  const [state, setState] = useState<IslandState>(initial)
  const [paid, setPaid] = useState(0)
  const countdown = useCountdown(299)

  useEffect(() => setState(initial), [initial])

  useEffect(() => {
    if (state !== "checkout") return
    setPaid(0)
    const timer = setInterval(() => setPaid((value) => Math.min(1, value + 0.25)), 500)
    return () => clearInterval(timer)
  }, [state])

  return (
    <Phone>
      <DynamicIsland
        state={state}
        spring={{ stiffness, damping }}
        onDismiss={() => setState("idle")}
        sizes={{ added: "wide", shipped: "wide", sale: "compact", checkout: "expanded" }}
        views={{
          idle: (
            <DynamicIslandActivity
              leading={<ShoppingBag aria-hidden />}
              title="2 in bag"
              trailing={<span style={{ fontSize: 12, opacity: 0.7 }}>$290</span>}
            />
          ),
          added: (
            <DynamicIslandActivity
              leading={<Thumb />}
              title="Added to bag"
              description="Court Sneaker, size 42"
              trailing={<Check aria-hidden style={{ color: "var(--kg-paper-sage)" }} />}
            />
          ),
          shipped: (
            <DynamicIslandActivity
              leading={<Truck aria-hidden />}
              title="Order shipped"
              description="Arrives Thursday"
            />
          ),
          sale: (
            <DynamicIslandActivity
              leading={<Timer aria-hidden style={{ color: "var(--kg-paper-butter)" }} />}
              title={<span style={{ fontVariantNumeric: "tabular-nums" }}>{countdown}</span>}
              trailing={<span style={{ fontSize: 11, color: "var(--kg-paper-butter)" }}>-30%</span>}
            />
          ),
          checkout: (
            <div style={{ display: "grid", justifyItems: "center", gap: 12, textAlign: "center" }}>
              <DynamicIslandRing
                value={paid}
                size={56}
                label={paid < 1 ? "Payment progress" : undefined}
              >
                {paid >= 1 ? <Check aria-hidden /> : <CreditCard aria-hidden />}
              </DynamicIslandRing>
              <strong style={{ fontSize: 15 }}>
                {paid >= 1 ? "Payment complete" : "Paying $290.00"}
              </strong>
            </div>
          ),
        }}
      />
    </Phone>
  )
}

/* Swipe Deck ------------------------------------------------------------------------------ */

const DeckDemo = ({
  visible,
  threshold,
  undo,
}: {
  visible: number
  threshold: number
  undo: boolean
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr)",
      justifyItems: "center",
      padding: "clamp(20px, 4vw, 40px) 16px",
    }}
  >
    <SwipeDeck
      items={products}
      getKey={(product) => product.id}
      itemLabel={(product) => product.title}
      visible={visible}
      threshold={threshold}
      undo={undo}
      renderCard={(product) => <ProductTile product={product} flush />}
      empty={<span style={muted}>All caught up</span>}
      style={{ width: "100%", "--kg-swipe-deck-width": "17.5rem" } as CSSProperties}
    />
  </div>
)

const productCode = `const products = [
  { id: "court", title: "Court Sneaker", price: 120 },
  { id: "tote", title: "Canvas Tote", price: 68 },
  { id: "coat", title: "Wool Overcoat", price: 340 },
  { id: "cap", title: "Ripstop Cap", price: 38 },
  { id: "knit", title: "Merino Crew", price: 110 },
]`

const tileCode = (padding: string) =>
  `<article style={{ display: "grid", gap: 8, padding: ${padding}, borderRadius: 18, border: "2px solid var(--kg-ink)", background: "var(--kg-surface)" }}>
  <div style={{ aspectRatio: "4 / 5", borderRadius: 12, background: "var(--kg-muted)" }} />
  <strong>{product.title}</strong>
  <Price amount={product.price} size="sm" />
</article>`

/* Demos ----------------------------------------------------------------------------------- */

export const demos = [
  defineDemo({
    id: "product-spin",
    name: "Product Spin",
    category: "Signature",
    description: "A 360 degree product viewer with hotspots.",
    exports: ["ProductSpin"],
    layout: "fill",
    height: 560,
    controls: {
      autoplay: { type: "boolean", default: true },
      hotspots: { type: "boolean", default: true },
      zoom: { type: "boolean", default: true },
      speed: { type: "number", min: 5, max: 120, step: 5, default: 30, label: "Speed (deg/s)" },
    },
    render: ({ hotspots: withHotspots, ...values }) => (
      <div style={{ display: "grid", placeItems: "center", padding: "clamp(16px, 4vw, 40px)" }}>
        <div style={{ width: "min(100%, 760px)" }}>
          <ProductSpin
            frames={frames}
            alt="Speaker, turning on a plinth"
            hotspots={withHotspots ? hotspots : undefined}
            aspectRatio="16 / 10"
            {...values}
          />
        </div>
      </div>
    ),
    code: ({ hotspots: withHotspots, zoom, ...values }) =>
      `import { ProductSpin } from "kitgrid"\n\n${frameCode}\n\n` +
      (withHotspots ? `${hotspotCode}\n\n` : "") +
      jsx(
        "ProductSpin",
        {
          frames: raw("frames"),
          alt: "Speaker, turning on a plinth",
          hotspots: withHotspots ? raw("hotspots") : undefined,
          aspectRatio: "16 / 10",
          zoom: zoom ? undefined : raw("false"),
          ...values,
        },
        undefined,
        { autoplay: false, speed: 30 },
      ),
    accessibility: [
      'The stage is a role="slider" with aria-valuenow in degrees and aria-valuetext such as "Rotated 120 degrees".',
      "Left and Right (or Down and Up) step one frame, Shift or Page Up and Page Down turn 45°, Home and End jump to the first and last frame, Escape leaves zoom.",
      "Hotspot pins are buttons with aria-expanded; their cards close on Escape (focus returns to the pin) or a click outside. Pins on angles where the feature is hidden leave the tab order.",
      "Autoplay stops on the first interaction, pauses offscreen and in background tabs, has a pause button, and never starts under reduced motion; inertia and springs are off there too.",
      "Touch drags only claim horizontal movement (touch-action: pan-y), so vertical swipes still scroll the page.",
    ],
  }),
  defineDemo({
    id: "dynamic-island",
    name: "Dynamic Island",
    category: "Signature",
    description: "A pill that morphs between live states.",
    exports: ["DynamicIsland", "DynamicIslandActivity", "DynamicIslandRing", "useDynamicIsland"],
    layout: "fill",
    height: 440,
    controls: {
      state: { type: "select", options: islandStates, default: "added" },
      stiffness: { type: "number", min: 120, max: 600, step: 20, default: 340 },
      damping: { type: "number", min: 10, max: 40, step: 1, default: 27 },
    },
    render: ({ state, stiffness, damping }) => (
      <IslandPlayground stiffness={stiffness} damping={damping} initial={state} />
    ),
    code: ({ state, stiffness, damping }) =>
      `import { DynamicIsland, DynamicIslandActivity } from "kitgrid"\nimport { CreditCard, ShoppingBag, Timer, Truck } from "lucide-react"\n\n` +
      jsx("DynamicIsland", {
        state,
        sizes: raw(`{ added: "wide", shipped: "wide", checkout: "expanded" }`),
        views: raw(
          `{\n    idle: <DynamicIslandActivity leading={<ShoppingBag aria-hidden />} title="2 in bag" />,\n    added: <DynamicIslandActivity leading={<ShoppingBag aria-hidden />} title="Added to bag" description="Court Sneaker, size 42" />,\n    shipped: <DynamicIslandActivity leading={<Truck aria-hidden />} title="Order shipped" description="Arrives Thursday" />,\n    sale: <DynamicIslandActivity leading={<Timer aria-hidden />} title="04:59" trailing="-30%" />,\n    checkout: <DynamicIslandActivity leading={<CreditCard aria-hidden />} title="Paying $290.00" />,\n  }`,
        ),
        spring:
          stiffness !== 340 || damping !== 27
            ? raw(`{ stiffness: ${stiffness}, damping: ${damping} }`)
            : undefined,
      }),
    accessibility: [
      'Each new view\'s text is announced through a polite role="status" region, so "Added to bag" reaches screen readers without moving focus.',
      "Escape anywhere inside the island calls onDismiss. Outgoing views are inert and aria-hidden while they fade.",
      "Hover or focus holds a timed event open (onHoldChange), so nobody loses a message they are reading.",
      "Under reduced motion the island snaps to each size and only cross-fades.",
    ],
  }),
  defineDemo({
    id: "carousel",
    name: "Carousel",
    category: "Signature",
    description: "Product rails: snap, coverflow or a stack.",
    exports: ["Carousel", "CarouselSlide"],
    layout: "fill",
    height: 520,
    controls: {
      variant: { type: "select", options: ["snap", "coverflow", "stack"], default: "snap" },
      slidesPerView: {
        type: "number",
        min: 1,
        max: 5,
        step: 0.5,
        default: 3.5,
        label: "Slides per view (md+)",
      },
      loop: { type: "boolean", default: false },
      autoplay: { type: "boolean", default: false },
    },
    render: ({ variant, slidesPerView, ...values }) => (
      <div style={{ padding: "clamp(20px, 4vw, 40px)", minWidth: 0 }}>
        <Carousel
          key={variant}
          variant={variant}
          defaultIndex={variant === "coverflow" ? 2 : 0}
          label="New arrivals"
          slidesPerView={{ base: 1.2, sm: 2.2, md: slidesPerView }}
          {...values}
        >
          {products.map((product) => (
            <CarouselSlide key={product.id}>
              <ProductTile product={product} />
            </CarouselSlide>
          ))}
        </Carousel>
      </div>
    ),
    code: ({ variant, slidesPerView, ...values }) =>
      `import { Carousel, CarouselSlide, Price } from "kitgrid"\n\n${productCode}\n\n` +
      jsx(
        "Carousel",
        {
          variant,
          label: "New arrivals",
          slidesPerView:
            variant === "snap" ? raw(`{ base: 1.2, sm: 2.2, md: ${slidesPerView} }`) : undefined,
          ...values,
        },
        `{products.map((product) => (\n  <CarouselSlide key={product.id}>\n${tileCode("10")
          .split("\n")
          .map((line) => `    ${line}`)
          .join("\n")}\n  </CarouselSlide>\n))}`,
        { variant: "snap", loop: false, autoplay: false },
      ),
    accessibility: [
      'A region with aria-roledescription="carousel"; every slide is a group named "3 of 8" with aria-roledescription="slide".',
      "Left and Right move one slide when focus is inside, Home and End jump to the ends. The scroller itself is focusable.",
      "Previous and next disable at the ends unless loop is on. Changes are announced politely, but not while autoplay runs.",
      "Autoplay has a pause button (WCAG 2.2.2), pauses on hover, on focus, offscreen and in background tabs, and never starts under reduced motion.",
      "In the stack, cards behind the top one are inert and hidden from assistive tech.",
    ],
  }),
  defineDemo({
    id: "swipe-deck",
    name: "Swipe Deck",
    category: "Signature",
    description: "Swipe right to save, left to skip.",
    exports: ["SwipeDeck"],
    layout: "fill",
    height: 600,
    controls: {
      visible: { type: "number", min: 1, max: 5, step: 1, default: 3, label: "Cards in stack" },
      threshold: { type: "number", min: 0.1, max: 0.6, step: 0.05, default: 0.3 },
      undo: { type: "boolean", default: true },
    },
    render: ({ visible, threshold, undo }) => (
      <DeckDemo visible={visible} threshold={threshold} undo={undo} />
    ),
    code: ({ visible, threshold, undo }) =>
      `import { Price, SwipeDeck } from "kitgrid"\n\n${productCode}\n\n` +
      jsx(
        "SwipeDeck",
        {
          items: raw("products"),
          getKey: raw("(product) => product.id"),
          itemLabel: raw("(product) => product.title"),
          renderCard: raw(
            `(product) => (\n    ${tileCode("0")
              .split("\n")
              .join("\n    ")}\n  )`,
          ),
          visible,
          threshold,
          undo: undo ? undefined : raw("false"),
        },
        undefined,
        { visible: 3, threshold: 0.3 },
      ),
    accessibility: [
      "The top card is a focusable group named after the product, described by a hint; Left skips and Right saves.",
      "Skip, Undo and Save are labelled buttons, and the button the card leans toward swells as you drag.",
      'Every swipe and undo is announced politely, for example "Saved Leather Court Sneaker. 4 left."',
      "Cards behind the top one are inert. Under reduced motion cards slide out without rotating.",
    ],
  }),
]
