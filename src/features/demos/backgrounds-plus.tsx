import {
  BallPit,
  Bokeh,
  Button,
  CubeField,
  Dither,
  DotField,
  GlassPanel,
  GlowGrid,
  GradientBorder,
  Halftone,
  Iridescence,
  LightCone,
  LightRays,
  Lightning,
  MeshGradient,
  Moire,
  OrbitRings,
  Orb,
  Plasma,
  Prism,
  RadialBurst,
  Ribbons,
  RippleGrid,
  Silk,
  SquaresGrid,
  StarrySky,
  Starfield,
  Stripes,
  Threads,
  TopoLines,
  Vortex,
  Waves,
  WavyLines,
} from "kitgrid"
import type { CSSProperties } from "react"
import { defineDemo, jsx, raw } from "./registry"

const HEIGHT = 420

const stage: CSSProperties = {
  minHeight: HEIGHT,
  display: "grid",
  placeItems: "center",
  background: "var(--kg-bg)",
}

const nightStage: CSSProperties = { ...stage, color: "var(--kg-fg)" }

const Headline = ({ children }: { children: string }) => (
  <h2
    style={{
      margin: 0,
      padding: 24,
      fontSize: "clamp(2rem, 5vw, 3.2rem)",
      fontWeight: 680,
      lineHeight: 1.05,
      letterSpacing: "-0.04em",
      textAlign: "center",
    }}
  >
    {children}
  </h2>
)

const masks = ["none", "radial", "top", "bottom", "edges"] as const

const a11y = (extra: string) => [
  "Decorative: the effect layer is aria-hidden and pointer-events: none. With children the component becomes the section and paints behind them; alone it fills its positioned parent.",
  extra,
]

const cssMotion =
  'Pure CSS on transform, opacity or background-position. Every loop stops under prefers-reduced-motion and KitgridProvider reducedMotion="always".'
const canvasMotion =
  "Canvas with a capped device pixel ratio. It pauses offscreen and in hidden tabs, and draws one still frame under reduced motion."

const stageCode = raw(`{ minHeight: ${HEIGHT}, display: "grid", placeItems: "center" }`)

/**
 * `jsx()` drops `false`, which would silently fall back to a `true` default, so explicit
 * falses are printed as expressions.
 */
const code = (
  name: string,
  props: Record<string, unknown>,
  defaults: Record<string, unknown>,
  title?: string,
  extra: Record<string, unknown> = {},
) => {
  const printed = Object.fromEntries(
    Object.entries(props).map(([key, value]) => [
      key,
      value === false && defaults[key] !== false ? raw("false") : value,
    ]),
  )
  return (
    `import { ${name} } from "kitgrid"\n\n` +
    jsx(
      name,
      { ...printed, ...extra, style: stageCode },
      title ? `<h1>${title}</h1>` : undefined,
      defaults,
    )
  )
}

export const demos = [
  defineDemo({
    id: "waves",
    name: "Waves",
    category: "Backgrounds",
    description: "Layered SVG swells rolling along the edge of a section.",
    exports: ["Waves"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      layers: { type: "number", min: 1, max: 6, step: 1, default: 4 },
      amplitude: { type: "number", min: 0, max: 1, step: 0.05, default: 0.35 },
      speed: { type: "number", min: 0, max: 4, step: 0.1, default: 1 },
      position: { type: "select", options: ["bottom", "top"], default: "bottom" },
    },
    render: (v) => (
      <Waves {...v} style={stage}>
        <Headline>Low tide</Headline>
      </Waves>
    ),
    code: (v) =>
      code("Waves", v, { layers: 4, amplitude: 0.35, speed: 1, position: "bottom" }, "Low tide"),
    accessibility: a11y(cssMotion),
  }),

  defineDemo({
    id: "silk",
    name: "Silk",
    category: "Backgrounds",
    description: "Soft folds of light sliding over each other like draped fabric.",
    exports: ["Silk"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      speed: { type: "number", min: 0, max: 4, step: 0.1, default: 1 },
      softness: { type: "number", min: 0, max: 48, step: 2, default: 18 },
      angle: { type: "number", min: -60, max: 60, step: 2, default: -28 },
      intensity: { type: "number", min: 0.1, max: 1, step: 0.05, default: 0.7 },
    },
    render: (v) => (
      <Silk {...v} style={stage}>
        <Headline>Drape</Headline>
      </Silk>
    ),
    code: (v) =>
      code("Silk", v, { speed: 1, softness: 18, angle: -28, intensity: 0.7 }, "Drape"),
    accessibility: a11y(cssMotion),
  }),

  defineDemo({
    id: "orb",
    name: "Orb",
    category: "Backgrounds",
    description: "A lit sphere with an inner swirl and an orbit light on its rim.",
    exports: ["Orb"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      speed: { type: "number", min: 0, max: 4, step: 0.1, default: 1 },
      glow: { type: "number", min: 0, max: 1, step: 0.05, default: 0.6 },
      position: { type: "select", options: ["center", "top", "bottom"], default: "center" },
    },
    render: (v) => <Orb {...v} style={stage} />,
    code: (v) =>
      `import { Orb } from "kitgrid"\n\n` +
      jsx("Orb", { ...v, style: stageCode }, undefined, {
        speed: 1,
        glow: 0.6,
        position: "center",
      }),
    accessibility: a11y(cssMotion),
  }),

  defineDemo({
    id: "iridescence",
    name: "Iridescence",
    category: "Backgrounds",
    description: "A pearlescent sheen in the paper colors, sliding with the light.",
    exports: ["Iridescence"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      speed: { type: "number", min: 0, max: 4, step: 0.1, default: 1 },
      intensity: { type: "number", min: 0.1, max: 1, step: 0.05, default: 0.7 },
      foil: { type: "boolean", default: true },
      mask: { type: "select", options: masks, default: "none" },
    },
    render: (v) => (
      <Iridescence {...v} style={stage}>
        <Headline>Foil</Headline>
      </Iridescence>
    ),
    code: (v) =>
      code("Iridescence", v, { speed: 1, intensity: 0.7, foil: true, mask: "none" }, "Foil"),
    accessibility: a11y(cssMotion),
  }),

  defineDemo({
    id: "dither",
    name: "Dither",
    category: "Backgrounds",
    description: "A flowing gradient rendered through an ordered Bayer dither.",
    exports: ["Dither"],
    layout: "fill",
    height: HEIGHT,
    controls: {
      pixelSize: { type: "number", min: 2, max: 12, step: 1, default: 3 },
      scale: { type: "number", min: 0.3, max: 3, step: 0.1, default: 1 },
      speed: { type: "number", min: 0, max: 4, step: 0.1, default: 1 },
      interactive: { type: "boolean", default: true },
    },
    render: (v) => (
      <Dither {...v} style={stage}>
        <Headline>Two inks</Headline>
      </Dither>
    ),
    code: (v) =>
      code("Dither", v, { pixelSize: 3, scale: 1, speed: 1, interactive: true }, "Two inks"),
    accessibility: a11y(canvasMotion),
  }),

  defineDemo({
    id: "threads",
    name: "Threads",
    category: "Backgrounds",
    description: "A bundle of hairline threads that pinch and fan as they drift.",
    exports: ["Threads"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      count: { type: "number", min: 2, max: 48, step: 1, default: 18 },
      spread: { type: "number", min: 0, max: 1, step: 0.05, default: 0.6 },
      amplitude: { type: "number", min: 0, max: 1, step: 0.05, default: 0.5 },
      speed: { type: "number", min: 0, max: 4, step: 0.1, default: 1 },
    },
    render: (v) => (
      <Threads {...v} style={stage}>
        <Headline>Connected</Headline>
      </Threads>
    ),
    code: (v) =>
      code("Threads", v, { count: 18, spread: 0.6, amplitude: 0.5, speed: 1 }, "Connected"),
    accessibility: a11y(cssMotion),
  }),

  defineDemo({
    id: "ripple-grid",
    name: "Ripple Grid",
    category: "Backgrounds",
    description: "Rings of light rippling out through a hairline grid.",
    exports: ["RippleGrid"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      columns: { type: "number", min: 4, max: 40, step: 1, default: 24 },
      rows: { type: "number", min: 2, max: 24, step: 1, default: 12 },
      interval: { type: "number", min: 1, max: 10, step: 0.5, default: 4 },
      mask: { type: "select", options: masks, default: "radial" },
    },
    render: (v) => (
      <RippleGrid {...v} style={stage}>
        <Headline>Signal</Headline>
      </RippleGrid>
    ),
    code: (v) =>
      code("RippleGrid", v, { columns: 24, rows: 12, interval: 4, mask: "radial" }, "Signal"),
    accessibility: a11y(cssMotion),
  }),

  defineDemo({
    id: "squares-grid",
    name: "Squares Grid",
    category: "Backgrounds",
    description: "A scrolling hairline grid that lights the cell under the pointer.",
    exports: ["SquaresGrid"],
    layout: "fill",
    height: HEIGHT,
    controls: {
      direction: {
        type: "select",
        options: ["diagonal", "right", "left", "up", "down"],
        default: "diagonal",
      },
      speed: { type: "number", min: 0, max: 2, step: 0.05, default: 0.4 },
      size: { type: "number", min: 16, max: 96, step: 4, default: 44 },
      mask: { type: "select", options: masks, default: "radial" },
    },
    render: (v) => (
      <SquaresGrid {...v} style={stage}>
        <Headline>Next move</Headline>
      </SquaresGrid>
    ),
    code: (v) =>
      code(
        "SquaresGrid",
        v,
        { direction: "diagonal", speed: 0.4, size: 44, mask: "radial" },
        "Next move",
      ),
    accessibility: a11y(canvasMotion),
  }),

  defineDemo({
    id: "starfield",
    name: "Starfield",
    category: "Backgrounds",
    description: "Flying through stars that stretch into warp streaks.",
    exports: ["Starfield"],
    layout: "fill",
    height: HEIGHT,
    controls: {
      count: { type: "number", min: 50, max: 1200, step: 10, default: 420 },
      speed: { type: "number", min: 0, max: 4, step: 0.1, default: 1 },
      warp: { type: "number", min: 0, max: 1, step: 0.05, default: 0.35 },
    },
    render: (v) => (
      <Starfield {...v} style={stage}>
        <Headline>Liftoff</Headline>
      </Starfield>
    ),
    code: (v) => code("Starfield", v, { count: 420, speed: 1, warp: 0.35 }, "Liftoff"),
    accessibility: a11y(canvasMotion),
  }),

  defineDemo({
    id: "light-rays",
    name: "Light Rays",
    category: "Backgrounds",
    description: "Soft shafts of light falling from above, swaying on their own loops.",
    exports: ["LightRays"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      count: { type: "number", min: 3, max: 24, step: 1, default: 9 },
      spread: { type: "number", min: 10, max: 140, step: 5, default: 70 },
      origin: { type: "select", options: ["top", "top-left", "top-right"], default: "top" },
      intensity: { type: "number", min: 0.1, max: 1, step: 0.05, default: 0.7 },
    },
    render: (v) => (
      <LightRays {...v} style={stage}>
        <Headline>Morning</Headline>
      </LightRays>
    ),
    code: (v) =>
      code("LightRays", v, { count: 9, spread: 70, origin: "top", intensity: 0.7 }, "Morning"),
    accessibility: a11y(cssMotion),
  }),

  defineDemo({
    id: "halftone",
    name: "Halftone",
    category: "Backgrounds",
    description: "A rotated dot screen whose dots swell over drifting pools of light.",
    exports: ["Halftone"],
    layout: "fill",
    height: HEIGHT,
    controls: {
      spacing: { type: "number", min: 6, max: 32, step: 1, default: 14 },
      angle: { type: "number", min: 0, max: 90, step: 1, default: 18 },
      speed: { type: "number", min: 0, max: 4, step: 0.1, default: 1 },
      interactive: { type: "boolean", default: true },
    },
    render: (v) => (
      <Halftone {...v} style={stage}>
        <Headline>Issue 14</Headline>
      </Halftone>
    ),
    code: (v) =>
      code("Halftone", v, { spacing: 14, angle: 18, speed: 1, interactive: true }, "Issue 14"),
    accessibility: a11y(canvasMotion),
  }),

  defineDemo({
    id: "stripes",
    name: "Stripes",
    category: "Backgrounds",
    description: "Hairline stripes scrolling along their own axis.",
    exports: ["Stripes"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      angle: { type: "number", min: -90, max: 90, step: 5, default: -45 },
      width: { type: "number", min: 0.5, max: 12, step: 0.5, default: 1 },
      gap: { type: "number", min: 2, max: 40, step: 1, default: 10 },
      speed: { type: "number", min: 0, max: 4, step: 0.1, default: 1 },
    },
    render: (v) => (
      <Stripes {...v} style={stage}>
        <Headline>Underway</Headline>
      </Stripes>
    ),
    code: (v) => code("Stripes", v, { angle: -45, width: 1, gap: 10, speed: 1 }, "Underway"),
    accessibility: a11y(cssMotion),
  }),

  defineDemo({
    id: "topo-lines",
    name: "Topo Lines",
    category: "Backgrounds",
    description: "A seeded contour map with index lines in stronger ink.",
    exports: ["TopoLines"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      peaks: { type: "number", min: 1, max: 6, step: 1, default: 3 },
      rings: { type: "number", min: 3, max: 24, step: 1, default: 12 },
      animated: { type: "boolean", default: true },
      seed: { type: "number", min: 1, max: 99, step: 1, default: 11 },
    },
    render: (v) => (
      <TopoLines {...v} style={stage}>
        <Headline>Trailhead</Headline>
      </TopoLines>
    ),
    code: (v) =>
      code("TopoLines", v, { peaks: 3, rings: 12, animated: true, seed: 11 }, "Trailhead"),
    accessibility: a11y(cssMotion),
  }),

  defineDemo({
    id: "plasma",
    name: "Plasma",
    category: "Backgrounds",
    description: "Sum-of-sines plasma in ink, sage and peach, soft and cheap.",
    exports: ["Plasma"],
    layout: "fill",
    height: HEIGHT,
    controls: {
      scale: { type: "number", min: 0.3, max: 3, step: 0.1, default: 1 },
      speed: { type: "number", min: 0, max: 4, step: 0.1, default: 1 },
      intensity: { type: "number", min: 0.1, max: 1, step: 0.05, default: 0.85 },
      mask: { type: "select", options: masks, default: "none" },
    },
    render: (v) => (
      <Plasma {...v} style={stage}>
        <Headline>Running hot</Headline>
      </Plasma>
    ),
    code: (v) =>
      code("Plasma", v, { scale: 1, speed: 1, intensity: 0.85, mask: "none" }, "Running hot"),
    accessibility: a11y(canvasMotion),
  }),

  defineDemo({
    id: "mesh-gradient",
    name: "Mesh Gradient",
    category: "Backgrounds",
    description: "Soft pools of color around control points, wandering slowly.",
    exports: ["MeshGradient"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      animated: { type: "boolean", default: true },
      speed: { type: "number", min: 0.2, max: 4, step: 0.1, default: 1 },
    },
    render: (v) => (
      <MeshGradient {...v} style={stage}>
        <Headline>Warm</Headline>
      </MeshGradient>
    ),
    code: (v) => code("MeshGradient", v, { animated: true, speed: 1 }, "Warm"),
    accessibility: a11y(cssMotion),
  }),

  defineDemo({
    id: "orbit-rings",
    name: "Orbit Rings",
    category: "Backgrounds",
    description: "Concentric hairline rings, each with its own sweeping light.",
    exports: ["OrbitRings"],
    serverSafe: true,
    featured: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      rings: { type: "number", min: 2, max: 8, step: 1, default: 5 },
      position: { type: "select", options: ["center", "bottom"], default: "center" },
      speed: { type: "number", min: 0, max: 4, step: 0.1, default: 1 },
      bodies: { type: "boolean", default: true },
    },
    render: (v) => (
      <OrbitRings {...v} style={stage}>
        <Headline>Full circle</Headline>
      </OrbitRings>
    ),
    code: (v) =>
      code(
        "OrbitRings",
        v,
        { rings: 5, position: "center", speed: 1, bodies: true },
        "Full circle",
      ),
    accessibility: a11y(cssMotion),
  }),

  defineDemo({
    id: "glow-grid",
    name: "Glow Grid",
    category: "Backgrounds",
    description: "A quiet grid that lights up around the pointer like a torch.",
    exports: ["GlowGrid"],
    layout: "fill",
    height: HEIGHT,
    controls: {
      size: { type: "number", min: 16, max: 96, step: 4, default: 48 },
      radius: { type: "number", min: 80, max: 500, step: 10, default: 260 },
      mask: { type: "select", options: masks, default: "radial" },
    },
    render: (v) => (
      <GlowGrid {...v} style={stage}>
        <Headline>Torchlight</Headline>
      </GlowGrid>
    ),
    code: (v) => code("GlowGrid", v, { size: 48, radius: 260, mask: "radial" }, "Torchlight"),
    accessibility: a11y(
      "The light rests at a fixed point for touch and keyboard users. Pointer tracking writes two CSS variables at most once per frame.",
    ),
  }),

  defineDemo({
    id: "dot-field",
    name: "Dot Field",
    category: "Backgrounds",
    description: "Dots that swell, light up and part around the pointer.",
    exports: ["DotField"],
    layout: "fill",
    height: HEIGHT,
    controls: {
      spacing: { type: "number", min: 8, max: 48, step: 1, default: 22 },
      radius: { type: "number", min: 0.5, max: 4, step: 0.1, default: 1.3 },
      reach: { type: "number", min: 40, max: 400, step: 10, default: 150 },
      wave: { type: "boolean", default: true },
    },
    render: (v) => (
      <DotField {...v} style={stage}>
        <Headline>Move closer</Headline>
      </DotField>
    ),
    code: (v) =>
      code("DotField", v, { spacing: 22, radius: 1.3, reach: 150, wave: true }, "Move closer"),
    accessibility: a11y(canvasMotion),
  }),

  defineDemo({
    id: "wavy-lines",
    name: "Wavy Lines",
    category: "Backgrounds",
    description: "Flowing lines that bend apart around the pointer.",
    exports: ["WavyLines"],
    layout: "fill",
    height: HEIGHT,
    controls: {
      lines: { type: "number", min: 4, max: 80, step: 1, default: 28 },
      amplitude: { type: "number", min: 0, max: 40, step: 1, default: 14 },
      speed: { type: "number", min: 0, max: 4, step: 0.1, default: 1 },
      reach: { type: "number", min: 40, max: 400, step: 10, default: 160 },
    },
    render: (v) => (
      <WavyLines {...v} style={stage}>
        <Headline>Flow</Headline>
      </WavyLines>
    ),
    code: (v) =>
      code("WavyLines", v, { lines: 28, amplitude: 14, speed: 1, reach: 160 }, "Flow"),
    accessibility: a11y(canvasMotion),
  }),

  defineDemo({
    id: "radial-burst",
    name: "Radial Burst",
    category: "Backgrounds",
    description: "A slow-turning sunburst that fades into light at its rim.",
    exports: ["RadialBurst"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      rays: { type: "number", min: 8, max: 96, step: 2, default: 36 },
      origin: { type: "select", options: ["center", "top", "bottom"], default: "center" },
      duty: { type: "number", min: 0.1, max: 0.9, step: 0.05, default: 0.45 },
      intensity: { type: "number", min: 0.1, max: 1, step: 0.05, default: 0.5 },
    },
    render: (v) => (
      <RadialBurst {...v} style={stage}>
        <Headline>Doors open</Headline>
      </RadialBurst>
    ),
    code: (v) =>
      code(
        "RadialBurst",
        v,
        { rays: 36, origin: "center", duty: 0.45, intensity: 0.5 },
        "Doors open",
      ),
    accessibility: a11y(cssMotion),
  }),

  defineDemo({
    id: "lightning",
    name: "Lightning",
    category: "Backgrounds",
    description: "Seeded SVG bolts that strike in turn with a double flicker.",
    exports: ["Lightning"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      bolts: { type: "number", min: 1, max: 5, step: 1, default: 3 },
      interval: { type: "number", min: 2, max: 12, step: 0.5, default: 6 },
      branches: { type: "boolean", default: true },
      seed: { type: "number", min: 1, max: 99, step: 1, default: 7 },
    },
    render: (v) => (
      <Lightning {...v} className="dark" style={nightStage}>
        <Headline>Storm</Headline>
      </Lightning>
    ),
    code: (v) =>
      code("Lightning", v, { bolts: 3, interval: 6, branches: true, seed: 7 }, "Storm"),
    accessibility: a11y(
      "Flashes are short, low-contrast and spaced at least two seconds apart per bolt, well under three per second. Under reduced motion the bolts stay as a quiet still.",
    ),
  }),

  defineDemo({
    id: "ball-pit",
    name: "Ball Pit",
    category: "Backgrounds",
    description: "Balls that fall, stack and get shoved around by the pointer.",
    exports: ["BallPit"],
    layout: "fill",
    height: HEIGHT,
    controls: {
      count: { type: "number", min: 5, max: 120, step: 1, default: 46 },
      gravity: { type: "number", min: 0, max: 3, step: 0.1, default: 1 },
      seed: { type: "number", min: 1, max: 99, step: 1, default: 6 },
    },
    render: (v) => (
      <BallPit {...v} style={{ ...stage, placeItems: "start center" }}>
        <Headline>Play</Headline>
      </BallPit>
    ),
    code: (v) => code("BallPit", v, { count: 46, gravity: 1, seed: 6 }, "Play"),
    accessibility: a11y(
      "Canvas physics with a capped device pixel ratio. It pauses offscreen and in hidden tabs, and renders the settled pile once under reduced motion.",
    ),
  }),

  defineDemo({
    id: "ribbons",
    name: "Ribbons",
    category: "Backgrounds",
    description: "Soft ribbons that chase the pointer and coil when it leaves.",
    exports: ["Ribbons"],
    layout: "fill",
    height: HEIGHT,
    controls: {
      thickness: { type: "number", min: 2, max: 40, step: 1, default: 14 },
      length: { type: "number", min: 8, max: 80, step: 1, default: 36 },
      follow: { type: "number", min: 0.05, max: 0.6, step: 0.01, default: 0.28 },
    },
    render: (v) => (
      <Ribbons {...v} style={stage}>
        <Headline>Follow</Headline>
      </Ribbons>
    ),
    code: (v) => code("Ribbons", v, { thickness: 14, length: 36, follow: 0.28 }, "Follow"),
    accessibility: a11y(canvasMotion),
  }),

  defineDemo({
    id: "vortex",
    name: "Vortex",
    category: "Backgrounds",
    description: "A whirlpool of light spiralling inward with fading trails.",
    exports: ["Vortex"],
    layout: "fill",
    height: HEIGHT,
    controls: {
      count: { type: "number", min: 100, max: 1500, step: 50, default: 700 },
      speed: { type: "number", min: 0, max: 4, step: 0.1, default: 1 },
      trail: { type: "number", min: 0, max: 0.97, step: 0.01, default: 0.85 },
    },
    render: (v) => (
      <Vortex {...v} style={stage}>
        <Headline>Pulled in</Headline>
      </Vortex>
    ),
    code: (v) => code("Vortex", v, { count: 700, speed: 1, trail: 0.85 }, "Pulled in"),
    accessibility: a11y(canvasMotion),
  }),

  defineDemo({
    id: "starry-sky",
    name: "Starry Sky",
    category: "Backgrounds",
    description: "Twinkling stars crossed now and then by a shooting star.",
    exports: ["StarrySky"],
    layout: "fill",
    height: HEIGHT,
    controls: {
      density: { type: "number", min: 0.2, max: 6, step: 0.1, default: 1.6 },
      interval: { type: "number", min: 0, max: 10, step: 0.5, default: 3.5 },
      mask: { type: "select", options: masks, default: "top" },
    },
    render: (v) => (
      <StarrySky {...v} style={stage}>
        <Headline>Clear skies</Headline>
      </StarrySky>
    ),
    code: (v) => code("StarrySky", v, { density: 1.6, interval: 3.5, mask: "top" }, "Clear skies"),
    accessibility: a11y(canvasMotion),
  }),

  defineDemo({
    id: "light-cone",
    name: "Light Cone",
    category: "Backgrounds",
    description: "A stage light that opens once and casts a soft cone downward.",
    exports: ["LightCone"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      angle: { type: "number", min: 20, max: 160, step: 5, default: 70 },
      top: { type: "text", default: "18%" },
      duration: { type: "number", min: 0, max: 4, step: 0.1, default: 1.2 },
    },
    render: (v) => (
      <LightCone {...v} style={{ ...stage, placeItems: "end center", paddingBottom: 24 }}>
        <Headline>Now showing</Headline>
      </LightCone>
    ),
    code: (v) => code("LightCone", v, { angle: 70, top: "18%", duration: 1.2 }, "Now showing"),
    accessibility: a11y(
      "Opens once on mount with transform and opacity; its resting styles are the final frame, so reduced motion shows the open cone.",
    ),
  }),

  defineDemo({
    id: "bokeh",
    name: "Bokeh",
    category: "Backgrounds",
    description: "Out-of-focus discs of light floating in front of the lens.",
    exports: ["Bokeh"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      count: { type: "number", min: 3, max: 40, step: 1, default: 16 },
      speed: { type: "number", min: 0, max: 4, step: 0.1, default: 1 },
      seed: { type: "number", min: 1, max: 99, step: 1, default: 9 },
      mask: { type: "select", options: masks, default: "none" },
    },
    render: (v) => (
      <Bokeh {...v} style={stage}>
        <Headline>After hours</Headline>
      </Bokeh>
    ),
    code: (v) => code("Bokeh", v, { count: 16, speed: 1, seed: 9, mask: "none" }, "After hours"),
    accessibility: a11y(cssMotion),
  }),

  defineDemo({
    id: "cube-field",
    name: "Cube Field",
    category: "Backgrounds",
    description: "An isometric field of CSS 3D cubes with a wave rising through it.",
    exports: ["CubeField"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      columns: { type: "number", min: 3, max: 14, step: 1, default: 9 },
      size: { type: "number", min: 16, max: 80, step: 2, default: 44 },
      accentRatio: { type: "number", min: 0, max: 1, step: 0.02, default: 0.08 },
      speed: { type: "number", min: 0, max: 4, step: 0.1, default: 1 },
    },
    render: (v) => <CubeField {...v} style={stage} />,
    code: (v) =>
      `import { CubeField } from "kitgrid"\n\n` +
      jsx("CubeField", { ...v, style: stageCode }, undefined, {
        columns: 9,
        size: 44,
        accentRatio: 0.08,
        speed: 1,
      }),
    accessibility: a11y(cssMotion),
  }),

  defineDemo({
    id: "prism",
    name: "Prism",
    category: "Backgrounds",
    description: "A glass prism splitting one beam into a fan of paper-colored light.",
    exports: ["Prism"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      size: { type: "text", default: "min(34%, 15rem)" },
      speed: { type: "number", min: 0, max: 4, step: 0.1, default: 1 },
    },
    render: (v) => <Prism {...v} style={stage} />,
    code: (v) =>
      `import { Prism } from "kitgrid"\n\n` +
      jsx("Prism", { ...v, style: stageCode }, undefined, {
        size: "min(34%, 15rem)",
        speed: 1,
      }),
    accessibility: a11y(cssMotion),
  }),

  defineDemo({
    id: "moire",
    name: "Moire",
    category: "Backgrounds",
    description: "Two hairline patterns drifting against each other into interference fringes.",
    exports: ["Moire"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      pattern: { type: "select", options: ["rings", "lines"], default: "rings" },
      spacing: { type: "number", min: 3, max: 24, step: 1, default: 9 },
      speed: { type: "number", min: 0, max: 4, step: 0.1, default: 1 },
      mask: { type: "select", options: masks, default: "radial" },
    },
    render: (v) => (
      <Moire {...v} style={stage}>
        <Headline>Look closer</Headline>
      </Moire>
    ),
    code: (v) =>
      code("Moire", v, { pattern: "rings", spacing: 9, speed: 1, mask: "radial" }, "Look closer"),
    accessibility: a11y(cssMotion),
  }),

  defineDemo({
    id: "gradient-border",
    name: "Gradient Border",
    category: "Backgrounds",
    description: "A card surface whose edge light orbits the border.",
    exports: ["GradientBorder"],
    serverSafe: true,
    height: 320,
    controls: {
      width: { type: "number", min: 0.5, max: 4, step: 0.5, default: 1 },
      animated: { type: "boolean", default: true },
      duration: { type: "number", min: 1, max: 16, step: 0.5, default: 6 },
      glow: { type: "boolean", default: false },
    },
    render: (v) => (
      <GradientBorder {...v} style={{ width: "min(100%, 320px)", padding: 24 }}>
        <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
          <strong style={{ fontSize: 20, letterSpacing: "-0.02em" }}>Team plan</strong>
          <Button>Upgrade</Button>
        </div>
      </GradientBorder>
    ),
    code: (v) => {
      const printed = { ...v, animated: v.animated ? true : raw("false") }
      return (
        `import { Button, GradientBorder } from "kitgrid"\n\n` +
        jsx(
          "GradientBorder",
          { ...printed, style: raw(`{ width: 320, padding: 24 }`) },
          `<strong>Team plan</strong>\n<Button>Upgrade</Button>`,
          { width: 1, animated: true, duration: 6, glow: false },
        )
      )
    },
    accessibility: [
      "An ordinary container: its content stays in the accessibility tree, and the edge light is paint only.",
      "The gradient turns through a registered custom property and stops under reduced motion, leaving a still highlight.",
    ],
  }),

  defineDemo({
    id: "glass-panel",
    name: "Glass Panel",
    category: "Backgrounds",
    description: "A frosted surface with a lit top edge, for panels over any background.",
    exports: ["GlassPanel"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      blur: { type: "number", min: 0, max: 48, step: 2, default: 18 },
      tint: { type: "number", min: 0, max: 1, step: 0.05, default: 0.55 },
      grain: { type: "boolean", default: false },
      radius: { type: "select", options: ["lg", "xl", "2xl"], default: "xl" },
    },
    render: (v) => (
      <MeshGradient style={stage}>
        <GlassPanel {...v} style={{ padding: "28px 32px", display: "grid", gap: 16 }}>
          <strong style={{ fontSize: 20, letterSpacing: "-0.02em" }}>Payout Friday</strong>
          <Button variant="outline">Schedule</Button>
        </GlassPanel>
      </MeshGradient>
    ),
    code: (v) =>
      `import { Button, GlassPanel, MeshGradient } from "kitgrid"\n\n` +
      `<MeshGradient style={{ minHeight: ${HEIGHT}, display: "grid", placeItems: "center" }}>\n` +
      jsx(
        "GlassPanel",
        { ...v, style: raw(`{ padding: "28px 32px", display: "grid", gap: 16 }`) },
        `<strong>Payout Friday</strong>\n<Button variant="outline">Schedule</Button>`,
        { blur: 18, tint: 0.55, grain: false, radius: "xl" },
      )
        .split("\n")
        .map((line) => `  ${line}`)
        .join("\n") +
      `\n</MeshGradient>`,
    accessibility: [
      "An ordinary container with no role of its own; give it one (region, dialog) when the content calls for it.",
      "Text sits on a tinted surface, so contrast holds even when backdrop-filter is unsupported.",
    ],
  }),
]
