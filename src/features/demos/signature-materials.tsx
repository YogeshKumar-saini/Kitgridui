import {
  Button,
  CircularText,
  HoloCard,
  IconButton,
  ImageTrail,
  LiquidGlass,
  MorphDialog,
  MorphDialogClose,
  MorphDialogContent,
  MorphDialogImage,
  MorphDialogTitle,
  MorphDialogTrigger,
  Price,
  ScrollStack,
  ScrollStackItem,
} from "kitgrid"
import { ArrowUpRight, ShoppingBag } from "lucide-react"
import { skeleton } from "@/lib/data/skeleton"
import { defineDemo, jsx, raw } from "./registry"

const block = "color-mix(in oklab, var(--kg-muted), var(--kg-border) 55%)"

const css = `
.sm-display { font-weight: 800; letter-spacing: -0.035em; line-height: 0.95; margin: 0; }
.sm-mono { font-family: var(--pg-mono, ui-monospace, monospace); font-size: 12px; letter-spacing: 0.02em; }

.sm-glass-stage { position: relative; height: 100%; min-height: inherit; overflow: clip; border-radius: inherit; }
.sm-glass-scroll { position: absolute; inset: 0; overflow-y: auto; overscroll-behavior: contain; padding: 88px 16px 24px; scrollbar-width: thin; }
.sm-glass-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
.sm-glass-grid > span { height: 180px; border-radius: 16px; background: ${block}; }
.sm-glass-grid > span:nth-child(3n + 2) { height: 240px; }
.sm-glass-grid > span[data-accent] { background: var(--kg-paper-peach); }
.sm-glass-nav { position: absolute; top: 16px; left: 50%; translate: -50% 0; z-index: 2; display: flex; align-items: center; gap: 4px; padding: 6px 6px 6px 18px; width: max-content; max-width: calc(100% - 24px); }
.sm-glass-nav a { display: block; padding: 7px 12px; border-radius: 999px; color: inherit; font-size: 13.5px; font-weight: 550; text-decoration: none; }
.sm-glass-nav a[aria-current] { background: color-mix(in oklab, var(--kg-fg) 10%, transparent); }
.sm-brand { font-weight: 750; letter-spacing: -0.02em; font-size: 15px; white-space: nowrap; margin-right: 8px; }
@media (max-width: 560px) { .sm-glass-nav a { display: none; } }

.sm-holo-stage { display: grid; place-items: center; padding: 40px 24px; min-height: inherit; }
.sm-gift { width: min(360px, 100%); --kg-holo-ratio: 1.586; }
.sm-gift .kg-holo-card__content { justify-content: space-between; padding: 22px 24px; }

.sm-trail { min-height: inherit; height: 100%; border-radius: inherit; }
.sm-trail-title { font-size: clamp(56px, 11vw, 140px); color: oklch(0.98 0.003 260); mix-blend-mode: difference; text-align: center; }

.sm-ring-stage { display: grid; place-items: center; min-height: inherit; padding: 32px; }
.sm-ring-icon { display: grid; place-items: center; width: 64px; height: 64px; border-radius: 999px; background: var(--kg-accent); color: var(--kg-accent-fg); }
.sm-ring-icon svg { width: 28px; height: 28px; }

.sm-stack-scroll { height: 100%; min-height: inherit; max-height: 560px; overflow-y: auto; overscroll-behavior: contain; padding: 32px clamp(16px, 4vw, 48px) 0; scrollbar-width: thin; }
.sm-stack-card { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; min-height: 300px; padding: clamp(18px, 3vw, 28px); }
.sm-stack-card > div { display: flex; flex-direction: column; justify-content: space-between; gap: 16px; }
.sm-stack-card > span { border-radius: 14px; background: ${block}; }
.sm-stack-card[data-accent] > span { background: var(--kg-paper-sage); }
.sm-stack-end { height: 320px; }
@media (max-width: 640px) { .sm-stack-card { grid-template-columns: 1fr; } .sm-stack-card > span { height: 140px; order: -1; } }

.sm-tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 16px; align-content: center; padding: 28px; min-height: inherit; }
.sm-tile-image { aspect-ratio: 4 / 5; }
.sm-tile-body { display: grid; gap: 2px; padding: 12px 14px 14px; }
.sm-tile-body .kg-morph-dialog__title { font-size: 14.5px; }
.sm-product { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
.sm-product[data-layout="stacked"] { grid-template-columns: 1fr; }
.sm-product .kg-morph-dialog__image { height: 100%; min-height: 320px; aspect-ratio: 4 / 5; }
.sm-product[data-layout="stacked"] .kg-morph-dialog__image { aspect-ratio: 16 / 10; min-height: 0; max-height: 40vh; }
.sm-product-info { display: grid; align-content: start; gap: 14px; padding: clamp(20px, 3vw, 32px); }
@media (max-width: 640px) { .sm-product { grid-template-columns: 1fr; } .sm-product .kg-morph-dialog__image { min-height: 0; aspect-ratio: 16 / 11; } }
`

const Styles = () => (
  <style href="pg-signature-materials" precedence="default">
    {css}
  </style>
)

/* Liquid Glass */

const tints = {
  default: undefined,
  clear: "color-mix(in oklab, var(--kg-surface) 6%, transparent)",
  milk: "color-mix(in oklab, var(--kg-surface) 58%, transparent)",
  peach: "color-mix(in oklab, var(--kg-paper-peach) 40%, transparent)",
} as const

/* Image Trail */

const looks = Array.from({ length: 10 }, (_, index) => ({
  src: skeleton(`look-${index}`, 480, 600),
  alt: "",
}))

const looksCode = `const looks = Array.from({ length: 8 }, (_, i) => {
  const fill = i % 4 === 0 ? "#e8834a" : "#8a93a0"
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 600">' +
    '<rect width="480" height="600" fill="' + fill + '" fill-opacity=".22"/>' +
    '<rect x="140" y="200" width="200" height="200" rx="28" fill="' + fill + '" fill-opacity=".3"/>' +
    "</svg>"
  return { src: "data:image/svg+xml," + encodeURIComponent(svg), alt: "" }
})`

/* Scroll Stack */

const collections = [
  { title: "Outerwear", count: "42 pieces" },
  { title: "Footwear", count: "28 styles" },
  { title: "Knitwear", count: "19 pieces" },
  { title: "Leather", count: "11 pieces" },
]

/* Morph Dialog */

const products = [
  { title: "Field Jacket", price: 420, compareAt: 520, copy: "Waxed cotton, quilted lining." },
  { title: "Aran Poncho", price: 138, copy: "Open knit in undyed cotton." },
  { title: "Court Low", price: 120, copy: "Full-grain leather, stitched cupsole." },
  { title: "Studio ANC", price: 349, copy: "40 hours of battery, adaptive ANC." },
]

type Product = (typeof products)[number]

const ProductMorph = ({
  product,
  dismissible,
  layout,
}: {
  product: Product
  dismissible: boolean
  layout: string
}) => (
  <MorphDialog>
    <MorphDialogTrigger>
      <MorphDialogImage className="sm-tile-image" alt={product.title} />
      <span className="sm-tile-body">
        <MorphDialogTitle>{product.title}</MorphDialogTitle>
        <Price amount={product.price} compareAt={product.compareAt} size="sm" trimZeros />
      </span>
    </MorphDialogTrigger>
    <MorphDialogContent dismissible={dismissible} aria-describedby={undefined}>
      <div className="sm-product" data-layout={layout}>
        <MorphDialogImage alt={product.title} />
        <div className="sm-product-info">
          <MorphDialogTitle>{product.title}</MorphDialogTitle>
          <Price amount={product.price} compareAt={product.compareAt} size="lg" trimZeros />
          <p style={{ margin: 0, color: "var(--kg-fg-muted)" }}>{product.copy}</p>
          <Button size="lg" fullWidth leading={<ShoppingBag />}>
            Add to bag
          </Button>
        </div>
      </div>
      <MorphDialogClose />
    </MorphDialogContent>
  </MorphDialog>
)

export const demos = [
  defineDemo({
    id: "liquid-glass",
    name: "Liquid Glass",
    category: "Signature",
    description: "A glass surface that refracts what sits behind it.",
    exports: ["LiquidGlass"],
    layout: "fill",
    height: 520,
    controls: {
      refraction: { type: "number", min: 0, max: 90, step: 2, default: 36, label: "Refraction (px)" },
      dispersion: { type: "number", min: 0, max: 1, step: 0.05, default: 0.45 },
      blur: { type: "number", min: 0, max: 16, step: 0.5, default: 3, label: "Blur (px)" },
      tint: { type: "select", options: ["default", "clear", "milk", "peach"], default: "default" },
    },
    render: ({ refraction, dispersion, blur, tint }) => (
      <div className="sm-glass-stage">
        <Styles />
        <div className="sm-glass-scroll" tabIndex={0} aria-label="New arrivals">
          <div className="sm-glass-grid" aria-hidden>
            {Array.from({ length: 12 }, (_, index) => (
              <span key={index} data-accent={index === 1 || undefined} />
            ))}
          </div>
        </div>
        <LiquidGlass
          as="nav"
          aria-label="Storefront"
          className="sm-glass-nav"
          radius={999}
          refraction={refraction}
          dispersion={dispersion}
          blur={blur}
          tint={tints[tint as keyof typeof tints]}
        >
          <span className="sm-brand">Northwind</span>
          <a href="/components/liquid-glass" aria-current="page">
            New in
          </a>
          <a href="/components/liquid-glass">Journal</a>
          <IconButton label="Bag" icon={<ShoppingBag />} size="sm" round variant="solid" />
        </LiquidGlass>
      </div>
    ),
    code: ({ refraction, dispersion, blur, tint }) =>
      `import { IconButton, LiquidGlass } from "kitgrid"\nimport { ShoppingBag } from "lucide-react"\n\n` +
      `<div style={{ position: "relative", height: 420, overflow: "hidden", borderRadius: 20 }}>\n` +
      `  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: "88px 16px 16px" }}>\n` +
      `    {Array.from({ length: 9 }, (_, i) => (\n` +
      `      <div key={i} style={{ height: 160, borderRadius: 16, background: i === 1 ? "var(--kg-paper-peach)" : "var(--kg-muted)" }} />\n` +
      `    ))}\n  </div>\n` +
      jsx(
        "LiquidGlass",
        {
          as: "nav",
          "aria-label": "Storefront",
          radius: 999,
          refraction,
          dispersion,
          blur,
          tint: tints[tint as keyof typeof tints],
          style: raw(
            `{ position: "absolute", top: 16, left: "50%", translate: "-50% 0", display: "flex", alignItems: "center", gap: 8, padding: "6px 6px 6px 18px" }`,
          ),
        },
        `<strong>Northwind</strong>\n<a href="#new">New in</a>\n<IconButton label="Bag" icon={<ShoppingBag />} size="sm" round variant="solid" />`,
        { refraction: 36, dispersion: 0.45, blur: 3 },
      )
        .split("\n")
        .map((line) => `  ${line}`)
        .join("\n") +
      `\n</div>`,
    accessibility: [
      'Purely a surface: it renders the element you choose (`as="nav"`, `asChild` onto a button) and never changes roles, names or focus order.',
      "Honours prefers-reduced-transparency by turning opaque, so text on the glass always has full contrast for people who need it.",
      "Without Chromium's SVG backdrop filters it falls back to a stronger frosted blur, chosen for legibility rather than looks.",
      "The orbiting rim light is decorative, pauses offscreen and stays at rest under reduced motion.",
    ],
  }),
  defineDemo({
    id: "holo-card",
    name: "Holo Card",
    category: "Signature",
    description: "A holographic foil card that tilts with the light.",
    exports: ["HoloCard"],
    layout: "fill",
    height: 480,
    controls: {
      foil: { type: "select", options: ["rainbow", "gold", "silver", "accent"], default: "rainbow" },
      intensity: { type: "number", min: 0, max: 1, step: 0.05, default: 0.7 },
      maxTilt: { type: "number", min: 0, max: 25, step: 1, default: 14, label: "Max tilt (deg)" },
      glare: { type: "boolean", default: true },
    },
    render: (v) => (
      <div className="sm-holo-stage">
        <Styles />
        <HoloCard {...v} className="sm-gift" tabIndex={0} aria-label="Gift card, 150 dollars">
          <span className="sm-brand" data-depth="18">
            Northwind
          </span>
          <span className="sm-display" style={{ fontSize: 60 }} data-depth="44">
            $150
          </span>
        </HoloCard>
      </div>
    ),
    code: (v) =>
      `import { HoloCard } from "kitgrid"\nimport type { CSSProperties } from "react"\n\n` +
      jsx(
        "HoloCard",
        {
          ...v,
          glare: v.glare ? undefined : raw("false"),
          tabIndex: raw("0"),
          "aria-label": "Gift card, 150 dollars",
          style: raw(
            `{ width: 360, "--kg-holo-ratio": 1.586 } as CSSProperties`,
          ),
        },
        `<strong data-depth="18">Northwind</strong>\n<strong data-depth="44" style={{ fontSize: 60 }}>$150</strong>`,
        { foil: "rainbow", intensity: 0.7, maxTilt: 14 },
      ),
    accessibility: [
      "Content keeps its semantics; the foil, glitter, glare and ink rim are aria-hidden layers and the artwork takes imageAlt.",
      "Keyboard focus inside the card turns it to a showcase pose, so the foil isn't a mouse-only reward.",
      "Touch never tilts the card, so it can't hijack scrolling. The gyroscope is opt-in and iOS asks for permission on the first tap.",
      "Reduced motion holds a still foil sheen at a flattering angle with no listeners attached.",
    ],
  }),
  defineDemo({
    id: "image-trail",
    name: "Image Trail",
    category: "Signature",
    description: "A trail of images that follows the pointer.",
    exports: ["ImageTrail"],
    layout: "fill",
    height: 520,
    controls: {
      variant: { type: "select", options: ["pop", "stack", "scatter"], default: "pop" },
      threshold: { type: "number", min: 20, max: 240, step: 10, default: 80, label: "Threshold (px)" },
      lifetime: { type: "number", min: 400, max: 3000, step: 100, default: 1100, label: "Lifetime (ms)" },
      size: { type: "number", min: 100, max: 320, step: 10, default: 190, label: "Size (px)" },
    },
    render: (v) => (
      <ImageTrail {...v} className="sm-trail" images={looks} description="Spring lookbook.">
        <Styles />
        <h2 className="sm-display sm-trail-title">Spring</h2>
      </ImageTrail>
    ),
    code: (v) =>
      `import { ImageTrail } from "kitgrid"\n\n${looksCode}\n\n` +
      jsx(
        "ImageTrail",
        {
          images: raw("looks"),
          ...v,
          description: "Spring lookbook.",
          style: raw(`{ minHeight: 420, display: "grid", placeItems: "center" }`),
        },
        `<h2>Spring</h2>`,
        { variant: "pop", threshold: 80, lifetime: 1100, size: 190 },
      ),
    accessibility: [
      "Trail images are decorative (aria-hidden, empty alt); the description prop is read instead, so screen-reader users learn what the region shows.",
      "Interactive children (links, buttons) stay clickable above the trail.",
      "Touch scrolling is never intercepted: dragging scrolls the page and a tap drops a single image.",
      "Under reduced motion the trail becomes a still collage of five images and no listeners run.",
    ],
  }),
  defineDemo({
    id: "circular-text",
    name: "Circular Text",
    category: "Signature",
    description: "Text on a circle that turns under the pointer.",
    exports: ["CircularText"],
    layout: "fill",
    height: 400,
    serverSafe: true,
    controls: {
      text: { type: "text", default: "FREE RETURNS • CARBON NEUTRAL SHIPPING • " },
      fontSize: { type: "number", min: 9, max: 24, step: 1, default: 13, label: "Font size (px)" },
      duration: { type: "number", min: 4, max: 40, step: 1, default: 18, label: "Turn (s)" },
      hover: {
        type: "select",
        options: ["speed-up", "reverse", "pause", "none"],
        default: "speed-up",
      },
    },
    render: (v) => (
      <div className="sm-ring-stage">
        <Styles />
        <CircularText {...v}>
          <span className="sm-ring-icon">
            <ArrowUpRight aria-hidden />
          </span>
        </CircularText>
      </div>
    ),
    code: (v) =>
      `import { CircularText } from "kitgrid"\nimport { ArrowUpRight } from "lucide-react"\n\n` +
      jsx("CircularText", v, `<ArrowUpRight aria-hidden />`, {
        fontSize: 13,
        duration: 18,
        hover: "speed-up",
      }),
    accessibility: [
      "Screen readers hear the text once, in order, from a visually hidden copy; the rotating SVG ring is aria-hidden.",
      "Put it inside a link or button with its own aria-label when it is interactive.",
      "Under reduced motion the ring holds still. Hover changes rotation without ever jumping the angle.",
      "Server component safe: rotation and hover are CSS on a registered keyframe, nothing hydrates.",
    ],
  }),
  defineDemo({
    id: "scroll-stack",
    name: "Scroll Stack",
    category: "Signature",
    description: "Cards that pin and stack as you scroll.",
    exports: ["ScrollStack", "ScrollStackItem"],
    layout: "fill",
    height: 560,
    controls: {
      top: { type: "number", min: 0, max: 160, step: 4, default: 24, label: "Top (px)" },
      peek: { type: "number", min: 0, max: 32, step: 1, default: 14, label: "Peek (px)" },
      gap: { type: "number", min: 0, max: 240, step: 8, default: 48, label: "Gap (px)" },
      scaleStep: { type: "number", min: 0, max: 0.12, step: 0.01, default: 0.05, label: "Scale step" },
    },
    render: (v) => (
      <div className="sm-stack-scroll" tabIndex={0} aria-label="Collections">
        <Styles />
        <ScrollStack {...v}>
          {collections.map((collection, index) => (
            <ScrollStackItem key={collection.title}>
              <article className="sm-stack-card" data-accent={index === 0 || undefined}>
                <div>
                  <span className="sm-mono" style={{ color: "var(--kg-fg-muted)" }}>
                    {collection.count}
                  </span>
                  <h3 className="sm-display" style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>
                    {collection.title}
                  </h3>
                  <Button variant="outline" size="sm" trailing={<ArrowUpRight />}>
                    Shop
                  </Button>
                </div>
                <span aria-hidden />
              </article>
            </ScrollStackItem>
          ))}
        </ScrollStack>
        <div className="sm-stack-end" />
      </div>
    ),
    code: (v) =>
      `import { ScrollStack, ScrollStackItem } from "kitgrid"\n\n` +
      `const collections = ["Outerwear", "Footwear", "Knitwear", "Leather"]\n\n` +
      jsx(
        "ScrollStack",
        v,
        `{collections.map((title) => (\n  <ScrollStackItem key={title}>\n    <article style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, minHeight: 300, padding: 24 }}>\n      <h3>{title}</h3>\n      <div style={{ borderRadius: 14, background: "var(--kg-muted)" }} />\n    </article>\n  </ScrollStackItem>\n))}`,
        { top: 96, peek: 14, gap: 64, scaleStep: 0.05 },
      ),
    accessibility: [
      "Renders a list (role list and listitem), so screen readers announce how many cards there are.",
      "Content stays in document order and every card scrolls fully into view, so keyboard focus is never trapped under another card.",
      "The receding effect is a transform and an overlay; text is never blurred and nothing depends on it.",
      "Under reduced motion the cards stop pinning and become a plain stacked list.",
    ],
  }),
  defineDemo({
    id: "morph-dialog",
    name: "Morph Dialog",
    category: "Signature",
    description: "A card that morphs into its own dialog.",
    exports: [
      "MorphDialog",
      "MorphDialogTrigger",
      "MorphDialogContent",
      "MorphDialogImage",
      "MorphDialogTitle",
      "MorphDialogClose",
    ],
    layout: "fill",
    height: 480,
    controls: {
      layout: {
        type: "select",
        options: ["split", "stacked"],
        default: "split",
        label: "Dialog layout",
      },
      dismissible: { type: "boolean", default: true, label: "Backdrop closes" },
    },
    render: ({ layout, dismissible }) => (
      <div className="sm-tiles">
        <Styles />
        {products.map((product) => (
          <ProductMorph
            key={product.title}
            product={product}
            layout={layout}
            dismissible={dismissible}
          />
        ))}
      </div>
    ),
    code: ({ dismissible }) =>
      `import {\n  Button,\n  MorphDialog,\n  MorphDialogClose,\n  MorphDialogContent,\n  MorphDialogImage,\n  MorphDialogTitle,\n  MorphDialogTrigger,\n  Price,\n} from "kitgrid"\n\n` +
      `<MorphDialog>\n  <MorphDialogTrigger style={{ width: 220 }}>\n    <MorphDialogImage alt="Field Jacket" style={{ aspectRatio: "4 / 5" }} />\n    <MorphDialogTitle>Field Jacket</MorphDialogTitle>\n    <Price amount={420} />\n  </MorphDialogTrigger>\n  ` +
      jsx(
        "MorphDialogContent",
        { dismissible: dismissible ? undefined : raw("false") },
        `<MorphDialogImage alt="Field Jacket" style={{ aspectRatio: "16 / 10" }} />\n<div style={{ display: "grid", gap: 12, padding: 24 }}>\n  <MorphDialogTitle>Field Jacket</MorphDialogTitle>\n  <Price amount={420} />\n  <Button>Add to bag</Button>\n</div>\n<MorphDialogClose />`,
      )
        .split("\n")
        .join("\n  ") +
      `\n</MorphDialog>`,
    accessibility: [
      'The card is a button with aria-haspopup="dialog" and aria-expanded; the dialog is a native modal <dialog> named by its title.',
      "Focus moves into the dialog (skipping the corner close button), is trapped there, and returns to the card on close. The page is inert and its scroll locked.",
      "Escape always closes, morphing back; a backdrop click closes unless dismissible is false.",
      "Without a src, MorphDialogImage renders a neutral placeholder that still morphs with the card.",
      "Under reduced motion the dialog crossfades in place of the shared-element morph.",
    ],
  }),
]
