import {
  Aurora,
  BackgroundBeams,
  DotPattern,
  GridPattern,
  HeroSpotlight,
  Meteors,
  Noise,
  Particles,
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

const stageCode = raw(`{ minHeight: ${HEIGHT}, display: "grid", placeItems: "center" }`)

/**
 * `jsx()` drops `false`, which would silently fall back to a `true` default, so explicit
 * falses are printed as expressions.
 */
const code = (
  name: string,
  props: Record<string, unknown>,
  defaults: Record<string, unknown>,
  title: string,
) => {
  const printed = Object.fromEntries(
    Object.entries(props).map(([key, value]) => [
      key,
      value === false && defaults[key] !== false ? raw("false") : value,
    ]),
  )
  return (
    `import { ${name} } from "kitgrid"\n\n` +
    jsx(name, { ...printed, style: stageCode }, `<h1>${title}</h1>`, defaults)
  )
}

const sharedA11y = [
  "Purely decorative: the effect layer is aria-hidden and pointer-events: none, so it never reaches the accessibility tree or steals clicks.",
  "With children, the component becomes the section and paints behind them in an isolated stacking context; on its own it fills its positioned parent.",
]

const masks = ["none", "radial", "top", "bottom", "edges"] as const

export const demos = [
  defineDemo({
    id: "aurora",
    name: "Aurora",
    category: "Backgrounds",
    description: "Slow, blurred ribbons of light in the paper colours.",
    exports: ["Aurora"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      intensity: { type: "number", min: 0.1, max: 1, step: 0.05, default: 0.6 },
      blur: { type: "number", min: 0, max: 140, step: 4, default: 64, label: "Blur (px)" },
      speed: { type: "number", min: 0.2, max: 4, step: 0.1, default: 1 },
      mask: { type: "select", options: masks, default: "radial" },
    },
    render: (v) => (
      <Aurora {...v} style={stage}>
        <Headline>Northern lights</Headline>
      </Aurora>
    ),
    code: (v) =>
      code("Aurora", v, { intensity: 0.6, blur: 64, speed: 1, mask: "radial" }, "Northern lights"),
    accessibility: [
      ...sharedA11y,
      'Animates transform only; every loop is removed under prefers-reduced-motion and KitgridProvider reducedMotion="always", leaving a still composition.',
    ],
  }),

  defineDemo({
    id: "grid-pattern",
    name: "Grid Pattern",
    category: "Backgrounds",
    description: "An SVG line grid with flashing cells and edge masks.",
    exports: ["GridPattern"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      variant: { type: "select", options: ["flat", "floor"], default: "flat" },
      animated: { type: "boolean", default: true },
      size: { type: "number", min: 16, max: 96, step: 4, default: 40, label: "Cell size" },
      mask: { type: "select", options: masks, default: "radial" },
    },
    render: (v) => (
      <GridPattern {...v} style={stage}>
        <Headline>Floor plans</Headline>
      </GridPattern>
    ),
    code: (v) =>
      code(
        "GridPattern",
        v,
        { variant: "flat", animated: false, size: 40, mask: "radial" },
        "Floor plans",
      ),
    accessibility: [
      ...sharedA11y,
      "Animated cells relocate by writing SVG attributes directly between flashes: no React renders. Flashing and the floor scroll stop under reduced motion; lit cells stay as a still pattern.",
    ],
  }),

  defineDemo({
    id: "dot-pattern",
    name: "Dot Pattern",
    category: "Backgrounds",
    description: "An SVG dot grid that darkens near the cursor.",
    exports: ["DotPattern"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      glow: { type: "boolean", default: true, label: "Glow near pointer" },
      gap: { type: "number", min: 8, max: 48, step: 2, default: 20 },
      radius: { type: "number", min: 0.5, max: 4, step: 0.25, default: 1 },
      mask: { type: "select", options: masks, default: "radial" },
    },
    render: (v) => (
      <DotPattern {...v} style={stage}>
        <Headline>Fine print</Headline>
      </DotPattern>
    ),
    code: (v) =>
      code("DotPattern", v, { glow: false, gap: 20, radius: 1, mask: "radial" }, "Fine print"),
    accessibility: [
      ...sharedA11y,
      "The glow is a cursor affordance only and carries no information. Pointer tracking writes at most once per animation frame.",
    ],
  }),

  defineDemo({
    id: "particles",
    name: "Particles",
    category: "Backgrounds",
    description: "A canvas particle field with links and pointer pull.",
    exports: ["Particles"],
    layout: "fill",
    height: HEIGHT,
    controls: {
      quantity: { type: "number", min: 10, max: 600, step: 10, default: 90 },
      speed: { type: "number", min: 0, max: 2, step: 0.05, default: 0.25 },
      links: { type: "boolean", default: false, label: "Connect nearby" },
      accent: { type: "boolean", default: false, label: "Accent particles" },
    },
    render: ({ accent, ...v }) => (
      <Particles {...v} color={accent ? "var(--kg-accent)" : undefined} style={stage}>
        <Headline>Dark skies</Headline>
      </Particles>
    ),
    code: ({ accent, ...v }) =>
      code(
        "Particles",
        { ...v, color: accent ? "var(--kg-accent)" : undefined },
        { quantity: 90, speed: 0.25, links: false },
        "Dark skies",
      ),
    accessibility: [
      ...sharedA11y,
      "Under reduced motion the field renders one still frame (and redraws only on resize or theme change); nothing runs while offscreen or while the tab is hidden.",
    ],
  }),

  defineDemo({
    id: "meteors",
    name: "Meteors",
    category: "Backgrounds",
    description: "Meteors streaking across the frame, CSS only.",
    exports: ["Meteors"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      count: { type: "number", min: 1, max: 60, step: 1, default: 20 },
      angle: { type: "number", min: 0, max: 360, step: 5, default: 130, label: "Angle (deg)" },
      tailLength: { type: "number", min: 20, max: 240, step: 10, default: 90 },
      accent: { type: "boolean", default: false, label: "Accent meteors" },
    },
    render: ({ accent, ...v }) => (
      <Meteors {...v} color={accent ? "var(--kg-accent)" : undefined} style={stage}>
        <Headline>Orionids</Headline>
      </Meteors>
    ),
    code: ({ accent, ...v }) =>
      code(
        "Meteors",
        { ...v, color: accent ? "var(--kg-accent)" : undefined },
        { count: 20, angle: 130, tailLength: 90 },
        "Orionids",
      ),
    accessibility: [
      ...sharedA11y,
      "Under reduced motion each meteor freezes at its mid-flight point as a still streak.",
    ],
  }),

  defineDemo({
    id: "background-beams",
    name: "Background Beams",
    category: "Backgrounds",
    description: "Curved beams with light running along them.",
    exports: ["BackgroundBeams"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      count: { type: "number", min: 4, max: 48, step: 1, default: 24 },
      duration: { type: "number", min: 2, max: 20, step: 0.5, default: 9 },
      strokeWidth: { type: "number", min: 0.5, max: 4, step: 0.25, default: 1.5 },
      mask: { type: "select", options: masks, default: "radial" },
    },
    render: (v) => (
      <BackgroundBeams {...v} style={stage}>
        <Headline>Live events</Headline>
      </BackgroundBeams>
    ),
    code: (v) =>
      code(
        "BackgroundBeams",
        v,
        { count: 32, duration: 9, strokeWidth: 1.5, mask: "radial" },
        "Live events",
      ),
    accessibility: [
      ...sharedA11y,
      "Under reduced motion each light rests at a seeded point along its beam.",
    ],
  }),

  defineDemo({
    id: "noise",
    name: "Noise",
    category: "Backgrounds",
    description: "Film grain from an inline SVG tile.",
    exports: ["Noise"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      opacity: { type: "number", min: 0, max: 1, step: 0.02, default: 0.18 },
      baseFrequency: { type: "number", min: 0.2, max: 2, step: 0.05, default: 0.8 },
      blendMode: {
        type: "select",
        options: ["overlay", "soft-light", "multiply", "screen", "normal"],
        default: "overlay",
      },
      animated: { type: "boolean", default: false, label: "Flicker" },
    },
    render: (v) => (
      <Noise
        {...v}
        style={{
          ...stage,
          background:
            "radial-gradient(60% 80% at 20% 10%, var(--kg-paper-sage), transparent 70%), radial-gradient(50% 70% at 85% 90%, color-mix(in oklab, var(--kg-fg) 14%, transparent), transparent 70%), var(--kg-bg)",
        }}
      >
        <Headline>Grain</Headline>
      </Noise>
    ),
    code: (v) =>
      code(
        "Noise",
        v,
        { opacity: 0.18, baseFrequency: 0.8, blendMode: "overlay", animated: false },
        "Grain",
      ),
    accessibility: [
      ...sharedA11y,
      "Grain is painted over children with a blend mode, like a lens, and never intercepts pointer events. Keep opacity low over body text to preserve contrast.",
      "The flicker uses stepped transform keyframes and stops under reduced motion.",
    ],
  }),

  defineDemo({
    id: "hero-spotlight",
    name: "Hero Spotlight",
    category: "Backgrounds",
    description: "A soft beam that sweeps in and settles.",
    exports: ["HeroSpotlight"],
    serverSafe: true,
    layout: "fill",
    height: HEIGHT,
    controls: {
      origin: { type: "select", options: ["top-left", "top-right", "top"], default: "top-left" },
      angle: { type: "number", min: 0, max: 90, step: 1, default: 28, label: "Angle (deg)" },
      duration: { type: "number", min: 0.4, max: 5, step: 0.1, default: 2 },
      core: { type: "boolean", default: true, label: "Bright core" },
    },
    render: ({ origin, angle, duration, core }) => (
      <HeroSpotlight
        origin={origin}
        angle={origin === "top" ? 90 : angle}
        duration={duration}
        fill={core ? undefined : false}
        style={stage}
      >
        <Headline>Spotlight</Headline>
      </HeroSpotlight>
    ),
    code: ({ origin, angle, duration, core }) =>
      code(
        "HeroSpotlight",
        {
          origin,
          angle: origin === "top" ? undefined : angle,
          duration,
          fill: core ? undefined : false,
        },
        { origin: "top-left", angle: 28, duration: 2 },
        "Spotlight",
      ),
    accessibility: [
      ...sharedA11y,
      "The sweep runs once. Under reduced motion it is skipped and the settled light is shown immediately.",
    ],
  }),
]
