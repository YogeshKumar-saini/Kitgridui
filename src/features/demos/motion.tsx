import {
  BorderBeam,
  Button,
  ConfettiButton,
  Dock,
  DockItem,
  DockSeparator,
  FlipCard,
  Magnetic,
  Marquee,
  Reveal,
  Ripple,
  ShimmerButton,
  TiltCard,
} from "kitgrid"
import {
  Aperture,
  ArrowRight,
  Atom,
  Box,
  Calendar,
  Cloud,
  Copy,
  Feather,
  Gift,
  Headphones,
  Hexagon,
  House,
  Layers,
  Mail,
  Music,
  PartyPopper,
  Search,
  Settings,
  ShoppingBag,
  Triangle,
} from "lucide-react"
import type { CSSProperties, ReactNode } from "react"
import { defineDemo, jsx, raw } from "./registry"

const muted: CSSProperties = {
  margin: 0,
  color: "var(--kg-fg-muted)",
  lineHeight: 1.5,
}

const card: CSSProperties = {
  padding: 16,
  background: "var(--kg-surface)",
  border: "2px solid var(--kg-ink)",
  borderRadius: "var(--kg-radius-xl)",
}

const brands: { name: string; icon: ReactNode }[] = [
  { name: "Northwind", icon: <Triangle /> },
  { name: "Hexa", icon: <Hexagon /> },
  { name: "Atomic", icon: <Atom /> },
  { name: "Layerly", icon: <Layers /> },
  { name: "Boxed", icon: <Box /> },
  { name: "Featherweight", icon: <Feather /> },
  { name: "Aperture", icon: <Aperture /> },
  { name: "Cloudline", icon: <Cloud /> },
]

const Logo = ({ name, icon }: { name: string; icon: ReactNode }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      fontSize: 18,
      fontWeight: 650,
      letterSpacing: "-0.02em",
      color: "var(--kg-fg-muted)",
      whiteSpace: "nowrap",
    }}
  >
    <span aria-hidden style={{ display: "inline-flex", width: 22, height: 22 }}>
      {icon}
    </span>
    {name}
  </span>
)

const features = ["Instant", "Composited", "Universal"]

const tiltDefaults = { maxTilt: 10, scale: 1.03, glare: true, reverse: false }
const beamDefaults = { size: 80, duration: 6, borderWidth: 1.5, reverse: false }
const marqueeDefaults = { speed: 40, reverse: false, pauseOnHover: true, fade: true }
const dockDefaults = { magnification: 1.8, distance: 140, baseSize: 48, orientation: "horizontal" }

export const demos = [
  defineDemo({
    id: "tilt-card",
    name: "Tilt Card",
    category: "Motion",
    description: "A surface that tilts toward the pointer.",
    exports: ["TiltCard"],
    height: 420,
    controls: {
      maxTilt: { type: "number", min: 0, max: 30, step: 1, default: 10, label: "Max tilt (deg)" },
      scale: { type: "number", min: 1, max: 1.15, step: 0.01, default: 1.03 },
      glare: { type: "boolean", default: true },
      reverse: { type: "boolean", default: false },
    },
    render: ({ maxTilt, scale, glare, reverse }) => (
      <TiltCard maxTilt={maxTilt} scale={scale} glare={glare} reverse={reverse} style={{ width: 280 }}>
        <div
          style={{
            display: "grid",
            placeItems: "center",
            height: 168,
            marginBottom: 16,
            borderRadius: "var(--kg-radius-lg)",
            background: "var(--kg-surface-sunken)",
          }}
        >
          <Headphones aria-hidden data-depth="70" style={{ width: 80, height: 80, color: "var(--kg-accent-strong)" }} />
        </div>
        <h3 data-depth="30" style={{ margin: "0 0 14px", fontSize: 18 }}>
          Halden Headphones
        </h3>
        <div data-depth="20" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ fontSize: 20 }}>$349</strong>
          <Button size="sm" leading={<ShoppingBag />}>
            Add to bag
          </Button>
        </div>
      </TiltCard>
    ),
    code: ({ maxTilt, scale, glare, reverse }) =>
      `import { Button, TiltCard } from "kitgrid"\n\n` +
      jsx(
        "TiltCard",
        { maxTilt, scale, glare, reverse, style: raw("{ width: 280 }") },
        `<div data-depth="70" style={{ height: 168, marginBottom: 16, borderRadius: 12, background: "var(--kg-surface-sunken, #8882)" }} />\n<h3 data-depth="30">Halden Headphones</h3>\n<div data-depth="20" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>\n  <strong>$349</strong>\n  <Button size="sm">Add to bag</Button>\n</div>`,
        tiltDefaults,
      ),
    accessibility: [
      "Purely visual: content, focus order and semantics are untouched, and the glare is aria-hidden.",
      "Ignores touch by default so it never competes with scrolling; pass touch to opt in.",
      "Under reduced motion the card stays flat and no pointer listeners are attached.",
    ],
  }),
  defineDemo({
    id: "magnetic",
    name: "Magnetic",
    category: "Motion",
    description: "Pulls an element toward a nearby pointer.",
    exports: ["Magnetic"],
    controls: {
      strength: { type: "number", min: 0.05, max: 1, step: 0.05, default: 0.35 },
      radius: { type: "number", min: 0, max: 200, step: 10, default: 80, label: "Radius (px)" },
    },
    render: ({ strength, radius }) => (
      <Magnetic strength={strength} radius={radius}>
        <Button size="lg" trailing={<ArrowRight />}>
          Get started
        </Button>
      </Magnetic>
    ),
    code: ({ strength, radius }) =>
      `import { Button, Magnetic } from "kitgrid"\n\n` +
      jsx("Magnetic", { strength, radius }, `<Button size="lg">Get started</Button>`, { strength: 0.35, radius: 80 }),
    accessibility: [
      "Renders no wrapper: the child keeps its role, name, focus and click behaviour; only its translate changes.",
      "Mouse and pen only; touch never moves the element out from under a finger.",
      "Under reduced motion and while offscreen no listeners run and the element never moves.",
    ],
  }),
  defineDemo({
    id: "shimmer-button",
    name: "Shimmer Button",
    category: "Motion",
    description: "A call to action with a light around its border.",
    exports: ["ShimmerButton"],
    controls: {
      label: { type: "text", default: "Start free trial" },
      size: { type: "select", options: ["sm", "md", "lg"], default: "lg" },
      duration: { type: "number", min: 1, max: 8, step: 0.5, default: 3, label: "Duration (s)" },
      pill: { type: "boolean", default: true },
    },
    render: ({ label, size, duration, pill }) => (
      <ShimmerButton size={size} duration={duration} radius={pill ? undefined : 12}>
        {label}
        <ArrowRight />
      </ShimmerButton>
    ),
    code: ({ label, size, duration, pill }) =>
      `import { ShimmerButton } from "kitgrid"\n\n` +
      jsx("ShimmerButton", { size, duration, radius: pill ? undefined : 12 }, label, { size: "md", duration: 3 }),
    accessibility: [
      'A native <button type="button"> (or your element via asChild) with the standard focus ring.',
      "Both decorative layers are pseudo-elements, so they never reach the accessibility tree.",
      "Reduced motion replaces the travelling light with a static edge highlight and removes the sheen.",
    ],
  }),
  defineDemo({
    id: "border-beam",
    name: "Border Beam",
    category: "Motion",
    description: "A beam of ink that travels around a border.",
    exports: ["BorderBeam"],
    controls: {
      size: { type: "number", min: 20, max: 240, step: 10, default: 80, label: "Size (px)" },
      duration: { type: "number", min: 2, max: 16, step: 1, default: 6, label: "Duration (s)" },
      borderWidth: { type: "number", min: 1, max: 4, step: 0.5, default: 1.5 },
      reverse: { type: "boolean", default: false },
    },
    render: ({ size, duration, borderWidth, reverse }) => (
      <div style={{ ...card, position: "relative", display: "grid", gap: 16, width: 280, padding: 24 }}>
        <div>
          <h3 style={{ margin: "0 0 4px", fontSize: 18 }}>Pro</h3>
          <p style={{ margin: 0, fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em" }}>
            $24
            <span style={{ fontSize: 14, fontWeight: 500, color: "var(--kg-fg-muted)" }}> / month</span>
          </p>
        </div>
        <Button fullWidth>Choose Pro</Button>
        <BorderBeam size={size} duration={duration} borderWidth={borderWidth} reverse={reverse} />
      </div>
    ),
    code: ({ size, duration, borderWidth, reverse }) =>
      `import { BorderBeam, Button } from "kitgrid"\n\n` +
      `<div style={{ position: "relative", display: "grid", gap: 16, width: 280, padding: 24, border: "2px solid var(--kg-ink)", borderRadius: 16 }}>\n  <h3>Pro, $24 / month</h3>\n  <Button fullWidth>Choose Pro</Button>\n  ` +
      jsx("BorderBeam", { size, duration, borderWidth, reverse }, undefined, beamDefaults) +
      `\n</div>`,
    accessibility: [
      "aria-hidden and pointer-events: none: it never intercepts clicks or reaches screen readers.",
      "Paused while offscreen or in a background tab.",
      "Reduced motion shows a still gradient edge in the same colours.",
    ],
  }),
  defineDemo({
    id: "marquee",
    name: "Marquee",
    category: "Motion",
    description: "An infinite strip that eases to a stop on hover.",
    exports: ["Marquee"],
    layout: "fill",
    height: 200,
    controls: {
      speed: { type: "number", min: 10, max: 200, step: 5, default: 40, label: "Speed (px/s)" },
      reverse: { type: "boolean", default: false },
      pauseOnHover: { type: "boolean", default: true },
      fade: { type: "boolean", default: true },
    },
    render: ({ speed, reverse, pauseOnHover, fade }) => (
      <div style={{ display: "grid", alignContent: "center", minHeight: 200 }}>
        <Marquee aria-label="Customer logos" speed={speed} reverse={reverse} pauseOnHover={pauseOnHover} fade={fade} gap={56}>
          {brands.map((brand) => (
            <Logo key={brand.name} {...brand} />
          ))}
        </Marquee>
      </div>
    ),
    code: ({ speed, reverse, pauseOnHover, fade }) =>
      `import { Marquee } from "kitgrid"\n\n` +
      `const logos = ["Northwind", "Hexa", "Atomic", "Layerly", "Boxed", "Cloudline"]\n\n` +
      jsx(
        "Marquee",
        { "aria-label": "Customer logos", speed, reverse, pauseOnHover, fade, gap: 56 },
        `{logos.map((name) => (\n  <span key={name} style={{ fontSize: 18, fontWeight: 650 }}>{name}</span>\n))}`,
        marqueeDefaults,
      ),
    accessibility: [
      "The content appears once in the accessibility tree; copies are aria-hidden and inert, so links are tabbable once.",
      "Focus inside stops the strip immediately so keyboard users never chase a moving target.",
      "Reduced motion removes the loop and the copies: the strip becomes keyboard-scrollable. Give it an aria-label.",
    ],
  }),
  defineDemo({
    id: "reveal",
    name: "Reveal",
    category: "Motion",
    description: "Scroll-triggered entrances with stagger.",
    exports: ["Reveal"],
    layout: "fill",
    height: 360,
    controls: {
      variant: {
        type: "select",
        options: ["fade-up", "fade", "scale", "blur", "slide-left", "slide-right"],
        default: "fade-up",
      },
      duration: { type: "number", min: 200, max: 1600, step: 50, default: 700, label: "Duration (ms)" },
      stagger: { type: "number", min: 0, max: 250, step: 10, default: 90, label: "Stagger (ms)" },
      once: { type: "boolean", default: true },
    },
    render: ({ variant, duration, stagger, once }) => (
      <div style={{ height: 360, overflowY: "auto", padding: 24 }}>
        <div style={{ display: "grid", gap: 14, height: 340, alignContent: "start" }}>
          {[92, 78, 86, 64, 90, 72, 84, 58, 88, 70, 80, 62].map((width, i) => (
            <div key={i} style={{ height: 12, width: `${width}%`, borderRadius: 999, background: "var(--kg-muted)" }} />
          ))}
        </div>
        <Reveal
          variant={variant}
          duration={duration}
          stagger={stagger}
          once={once}
          style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}
        >
          {features.map((title) => (
            <div key={title} style={card}>
              <div style={{ height: 56, marginBottom: 12, borderRadius: "var(--kg-radius-md)", background: "var(--kg-muted)" }} />
              <strong style={{ fontSize: 14 }}>{title}</strong>
            </div>
          ))}
        </Reveal>
        <div style={{ height: 160 }} />
      </div>
    ),
    code: ({ variant, duration, stagger, once }) =>
      `import { Reveal } from "kitgrid"\n\n` +
      `const features = ["Instant", "Composited", "Universal"]\n\n` +
      jsx(
        "Reveal",
        {
          variant,
          duration,
          stagger: stagger || undefined,
          once,
          style: raw(`{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }`),
        },
        `{features.map((title) => (\n  <div key={title} style={{ padding: 16, border: "2px solid var(--kg-ink)", borderRadius: 16 }}>\n    {title}\n  </div>\n))}`,
        { variant: "fade-up", duration: 700, once: true },
      ),
    accessibility: [
      "Never hides content for server rendering, no-JS visitors or crawlers; elements already in view on load are left alone.",
      "Under reduced motion nothing is hidden or moved, and the setting is honoured live.",
      "Only opacity, translate, scale and filter transition, so reveals never shift layout.",
    ],
  }),
  defineDemo({
    id: "dock",
    name: "Dock",
    category: "Motion",
    description: "A dock whose items swell near the pointer.",
    exports: ["Dock", "DockItem", "DockSeparator"],
    layout: "fill",
    height: 260,
    controls: {
      magnification: { type: "number", min: 1, max: 2.5, step: 0.1, default: 1.8 },
      distance: { type: "number", min: 60, max: 300, step: 10, default: 140, label: "Distance (px)" },
      baseSize: { type: "number", min: 32, max: 72, step: 4, default: 48, label: "Base size (px)" },
      orientation: { type: "select", options: ["horizontal", "vertical"], default: "horizontal" },
    },
    render: ({ magnification, distance, baseSize, orientation }) => (
      <div
        style={{
          display: "grid",
          placeItems: orientation === "horizontal" ? "end center" : "center start",
          padding: orientation === "horizontal" ? "0 16px 28px" : "16px 28px",
          minHeight: 260,
        }}
      >
        <Dock label="Applications" magnification={magnification} distance={distance} baseSize={baseSize} orientation={orientation}>
          <DockItem label="Home" icon={<House />} active />
          <DockItem label="Search" icon={<Search />} />
          <DockItem label="Mail" icon={<Mail />} />
          <DockItem label="Music" icon={<Music />} />
          <DockItem label="Calendar" icon={<Calendar />} />
          <DockSeparator />
          <DockItem label="Settings" icon={<Settings />} />
        </Dock>
      </div>
    ),
    code: ({ magnification, distance, baseSize, orientation }) =>
      `import { Dock, DockItem, DockSeparator } from "kitgrid"\nimport { House, Mail, Music, Search, Settings } from "lucide-react"\n\n` +
      jsx(
        "Dock",
        { label: "Applications", magnification, distance, baseSize, orientation },
        `<DockItem label="Home" icon={<House />} active />\n<DockItem label="Search" icon={<Search />} />\n<DockItem label="Mail" icon={<Mail />} />\n<DockItem label="Music" icon={<Music />} />\n<DockSeparator />\n<DockItem label="Settings" icon={<Settings />} />`,
        dockDefaults,
      ),
    accessibility: [
      'role="toolbar" with a single tab stop; Arrow keys move between items (mirrored in RTL), Home and End jump to the ends.',
      "Each item is named by its visible tooltip label; active items expose aria-current.",
      "Touch input and reduced motion disable magnification; items stay at their base size.",
    ],
  }),
  defineDemo({
    id: "ripple",
    name: "Ripple",
    category: "Motion",
    description: "Ink that spreads from the press point.",
    exports: ["Ripple"],
    controls: {
      currentColor: { type: "boolean", default: true, label: "Use currentColor" },
      color: { type: "color", default: "#e0552c" },
      duration: { type: "number", min: 200, max: 1500, step: 50, default: 550, label: "Duration (ms)" },
      opacity: { type: "number", min: 0.05, max: 0.6, step: 0.01, default: 0.22 },
    },
    render: ({ currentColor, color, duration, opacity }) => (
      <Ripple color={currentColor ? undefined : color} duration={duration} opacity={opacity}>
        <Button size="lg">Save changes</Button>
      </Ripple>
    ),
    code: ({ currentColor, color, duration, opacity }) =>
      `import { Button, Ripple } from "kitgrid"\n\n` +
      jsx("Ripple", { color: currentColor ? undefined : color, duration, opacity }, `<Button size="lg">Save changes</Button>`, {
        duration: 550,
        opacity: 0.22,
      }),
    accessibility: [
      "Adds no wrapper and no semantics: the ink layer is aria-hidden and pointer-events: none.",
      "Keyboard presses (Enter, Space) ripple from the centre, so feedback is not pointer-only.",
      "Under reduced motion the ink is a brief full-surface fade instead of a spreading wave.",
    ],
  }),
  defineDemo({
    id: "confetti",
    name: "Confetti",
    category: "Motion",
    description: "Physics confetti on a top-layer canvas.",
    exports: ["ConfettiButton", "useConfetti", "confetti"],
    controls: {
      particleCount: { type: "number", min: 10, max: 300, step: 10, default: 80 },
      spread: { type: "number", min: 10, max: 360, step: 10, default: 70, label: "Spread (deg)" },
      startVelocity: { type: "number", min: 15, max: 80, step: 1, default: 42 },
      shapes: { type: "select", options: ["mixed", "rect", "circle", "star"], default: "mixed" },
    },
    render: ({ particleCount, spread, startVelocity, shapes }) => (
      <ConfettiButton
        size="lg"
        leading={<PartyPopper />}
        options={{ particleCount, spread, startVelocity, shapes: shapes === "mixed" ? undefined : [shapes] }}
      >
        Place order
      </ConfettiButton>
    ),
    code: ({ particleCount, spread, startVelocity, shapes }) => {
      const options = {
        ...(particleCount !== 80 ? { particleCount } : null),
        ...(spread !== 70 ? { spread } : null),
        ...(startVelocity !== 42 ? { startVelocity } : null),
        ...(shapes !== "mixed" ? { shapes: [shapes] } : null),
      }
      const entries = Object.entries(options).map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      return (
        `import { ConfettiButton } from "kitgrid"\n\n` +
        jsx("ConfettiButton", { options: entries.length ? raw(`{ ${entries.join(", ")} }`) : undefined }, "Place order")
      )
    },
    accessibility: [
      "The canvas is aria-hidden and pointer-events: none, so it never blocks the page or a dialog beneath it.",
      "A no-op under reduced motion (OS setting or KitgridProvider), and on the server.",
      "Celebrate alongside a text confirmation: confetti is never the only signal of success.",
    ],
  }),
  defineDemo({
    id: "flip-card",
    name: "Flip Card",
    category: "Motion",
    description: "Two faces and a spring flip.",
    exports: ["FlipCard"],
    height: 340,
    controls: {
      trigger: { type: "select", options: ["click", "hover"], default: "click" },
      axis: { type: "select", options: ["y", "x"], default: "y" },
    },
    render: ({ trigger, axis }) => (
      <FlipCard
        trigger={trigger}
        axis={axis}
        label="Show gift card details"
        style={{ width: 280 }}
        front={
          <div style={{ display: "grid", gap: 10, minHeight: 150, alignContent: "space-between" }}>
            <Gift aria-hidden style={{ width: 28, height: 28, color: "var(--kg-accent-strong)" }} />
            <div>
              <h3 style={{ margin: 0, fontSize: 18 }}>Gift card</h3>
              <p style={{ ...muted, fontSize: 28, fontWeight: 700, color: "var(--kg-fg)" }}>$100</p>
            </div>
          </div>
        }
        back={
          <div style={{ display: "grid", gap: 12, minHeight: 150, alignContent: "center" }}>
            <code style={{ fontFamily: "var(--kg-font-mono)", fontSize: 18, letterSpacing: "0.08em" }}>HX4K-92PL</code>
            <Button size="sm" variant="outline" leading={<Copy />}>
              Copy code
            </Button>
          </div>
        }
      />
    ),
    code: ({ trigger, axis }) =>
      `import { Button, FlipCard } from "kitgrid"\n\n` +
      jsx(
        "FlipCard",
        {
          trigger,
          axis,
          label: "Show gift card details",
          style: raw("{ width: 280 }"),
          front: raw(`<div style={{ minHeight: 150 }}><h3>Gift card</h3><p>$100</p></div>`),
          back: raw(`<div style={{ display: "grid", gap: 12, minHeight: 150 }}><code>HX4K-92PL</code><Button size="sm">Copy code</Button></div>`),
        },
        undefined,
        { trigger: "click", axis: "y" },
      ),
    accessibility: [
      "In click and hover modes a toggle button with aria-pressed flips the card; Tab to it and press Enter or Space.",
      "Clicking a link or button on a face uses that control and does not flip the card.",
      "The hidden face is inert and aria-hidden, so screen readers and Tab only reach the visible face.",
      "Under reduced motion the faces crossfade instead of rotating.",
    ],
  }),
]
