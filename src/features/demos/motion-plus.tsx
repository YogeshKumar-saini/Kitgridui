import {
  AnimatedBeam,
  AnimatedList,
  BounceCards,
  Button,
  CardSwap,
  CircularGallery,
  ClickSpark,
  Crosshair,
  CurvedLoop,
  ElasticSlider,
  FallingText,
  FlowingMenu,
  Folder,
  GlareHover,
  GlitchText,
  Lens,
  MagnetLines,
  MaskReveal,
  MorphingText,
  OrbitingCircles,
  ParallaxLayer,
  ParallaxLayers,
  PixelTransition,
  PointerTrail,
  ProgressiveBlur,
  ScrollProgress,
  ShuffleText,
  SplitFlap,
  StarBorder,
  StickyReveal,
  StrokeText,
  TextPressure,
  TracingBeam,
  TrueFocus,
  VariableProximity,
} from "kitgrid"
import {
  ArrowRight,
  Cloud,
  CreditCard,
  Database,
  Mail,
  MessageCircle,
  Package,
  ShoppingBag,
  Sparkles,
  Truck,
  Volume1,
  Volume2,
  Zap,
} from "lucide-react"
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react"
import { defineDemo, jsx, raw } from "./registry"
import { skeleton } from "@/lib/data/skeleton"

const display: CSSProperties = {
  margin: 0,
  fontSize: "clamp(2.25rem, 6vw, 4rem)",
  fontWeight: 700,
  lineHeight: 1.05,
  letterSpacing: "-0.04em",
  textAlign: "center",
}

const caption: CSSProperties = {
  margin: 0,
  color: "var(--kg-fg-muted)",
  fontSize: 14,
}

/** A neutral skeleton surface standing in for media. */
const Block = ({ seed, ratio = 0.8, style }: { seed: string; ratio?: number; style?: CSSProperties }) => (
  <div
    aria-hidden="true"
    style={{
      width: "100%",
      height: "100%",
      background: `url("${skeleton(seed, 800, Math.round(800 / ratio))}") center / cover, var(--kg-surface-sunken)`,
      ...style,
    }}
  />
)

const obj = (value: Record<string, unknown>) =>
  raw(
    `{ ${Object.entries(value)
      .map(([k, v]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${JSON.stringify(v)}`)
      .join(", ")} }`,
  )

const SKELETON = `background: "var(--kg-surface-sunken, #8882)"`

const Node = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div
    style={{
      display: "grid",
      placeItems: "center",
      width: 52,
      height: 52,
      borderRadius: 999,
      border: "2px solid var(--kg-ink)",
      background: "var(--kg-surface-raised)",
      boxShadow: "var(--kg-shadow-md)",
      zIndex: 1,
      ...style,
    }}
  >
    {children}
  </div>
)

const BeamDiagram = ({ curvature }: { curvature: number }) => {
  const container = useRef<HTMLDivElement>(null)
  const hub = useRef<HTMLDivElement>(null)
  const a = useRef<HTMLDivElement>(null)
  const b = useRef<HTMLDivElement>(null)
  const c = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={container}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        alignItems: "center",
        justifyItems: "center",
        width: 448, maxWidth: "100%",
        height: 220,
      }}
    >
      <div style={{ display: "grid", gap: 56 }}>
        <div ref={a}>
          <Node>
            <ShoppingBag size={20} />
          </Node>
        </div>
        <div ref={b}>
          <Node>
            <CreditCard size={20} />
          </Node>
        </div>
      </div>
      <div ref={hub}>
        <Node style={{ width: 68, height: 68, color: "var(--kg-ink)" }}>
          <Zap size={26} />
        </Node>
      </div>
      <div ref={c}>
        <Node>
          <Truck size={20} />
        </Node>
      </div>
      <AnimatedBeam containerRef={container} fromRef={a} toRef={hub} curvature={curvature} />
      <AnimatedBeam containerRef={container} fromRef={b} toRef={hub} curvature={-curvature} delay={600} />
      <AnimatedBeam containerRef={container} fromRef={hub} toRef={c} delay={1200} />
    </div>
  )
}

const boards = ["LISBON 08:45", "OSAKA  09:10", "QUITO  09:55"]

const Departures = ({ speed }: { speed: number }) => {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % boards.length), 3200)
    return () => window.clearInterval(t)
  }, [])
  return (
    <SplitFlap value={boards[i] ?? ""} length={12} speed={speed} style={{ fontSize: "clamp(1.25rem, 3.5vw, 2.25rem)" }} />
  )
}

const Notification = ({ icon, title }: { icon: ReactNode; title: string }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 14px",
      borderRadius: "var(--kg-radius-xl)",
      border: "2px solid var(--kg-ink)",
      background: "var(--kg-surface-raised)",
      boxShadow: "var(--kg-shadow-sm)",
    }}
  >
    <span
      style={{
        display: "grid",
        placeItems: "center",
        width: 32,
        height: 32,
        borderRadius: 999,
        background: "var(--kg-paper-sage)",
        color: "var(--kg-ink)",
      }}
    >
      {icon}
    </span>
    <span style={{ fontWeight: 560 }}>{title}</span>
  </div>
)

const lines = (count: number) =>
  Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      style={{
        height: 12,
        width: `${55 + ((i * 37) % 45)}%`,
        borderRadius: 999,
        background: "var(--kg-muted)",
      }}
    />
  ))

const ScrollBox = () => {
  const box = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={box}
      style={{
        position: "relative",
        width: 448, maxWidth: "100%",
        height: 260,
        overflow: "auto",
        borderRadius: "var(--kg-radius-xl)",
        border: "2px solid var(--kg-ink)",
        background: "var(--kg-surface)",
      }}
    >
      <div style={{ position: "sticky", top: 0, zIndex: 1 }}>
        <ScrollProgress target={box} position="static" />
      </div>
      <div style={{ display: "grid", gap: 14, padding: 24 }}>{lines(16)}</div>
    </div>
  )
}

const StickyBox = () => {
  const box = useRef<HTMLDivElement>(null)
  return (
    <div ref={box} style={{ width: "100%", height: 460, overflow: "auto", borderRadius: "var(--kg-radius-xl)" }}>
      <StickyReveal scroller={box} overlay={<h3 style={{ ...display, textAlign: "left", fontSize: 40 }}>Autumn line</h3>}>
        <Block seed="sticky" ratio={16 / 9} />
      </StickyReveal>
    </div>
  )
}

const SkeletonCard = () => (
  <div
    aria-hidden="true"
    style={{
      display: "grid",
      gap: 12,
      width: 260,
      padding: 16,
      borderRadius: "var(--kg-radius-xl)",
      border: "2px solid var(--kg-ink)",
      background: "var(--kg-surface)",
    }}
  >
    <div style={{ height: 96, borderRadius: "var(--kg-radius-lg)", background: "var(--kg-muted)" }} />
    {lines(2)}
  </div>
)

const SwapCard = ({ seed, title }: { seed: string; title: string }) => (
  <div style={{ display: "grid", gridTemplateRows: "1fr auto", height: "100%" }}>
    <Block seed={seed} ratio={1.8} />
    <strong style={{ padding: "12px 16px", fontSize: 15 }}>{title}</strong>
  </div>
)

const swapCards = ["Track set", "Wide leg", "Powder coat"]
const panels = ["Coat", "Knit", "Denim", "Linen", "Wool"]

export const demos = [
  defineDemo({
    id: "text-pressure",
    name: "Text Pressure",
    category: "Text Effects",
    description: "Letters swell under the pointer.",
    exports: ["TextPressure"],
    height: 320,
    controls: {
      text: { type: "text", default: "PRESS" },
      minWeight: { type: "number", min: 100, max: 900, step: 50, default: 300 },
      maxWeight: { type: "number", min: 100, max: 900, step: 50, default: 900 },
      radius: { type: "number", min: 60, max: 400, step: 10, default: 180 },
    },
    render: ({ text, minWeight, maxWeight, radius }) => (
      <TextPressure
        as="h2"
        minWeight={minWeight}
        maxWeight={maxWeight}
        radius={radius}
        style={{ ...display, fontSize: "clamp(3rem, 10vw, 7rem)" }}
      >
        {text}
      </TextPressure>
    ),
    code: ({ text, ...props }) =>
      `import { TextPressure } from "kitgrid"\n\n` +
      jsx("TextPressure", { as: "h2", ...props }, text, { minWeight: 300, maxWeight: 900, radius: 180 }),
    accessibility: ["Read once as plain text; the split letters are aria-hidden.", "Static under reduced motion."],
  }),
  defineDemo({
    id: "variable-proximity",
    name: "Variable Proximity",
    category: "Text Effects",
    description: "Font axes ripple with pointer distance.",
    exports: ["VariableProximity"],
    height: 300,
    controls: {
      text: { type: "text", default: "Feel the weight" },
      radius: { type: "number", min: 40, max: 300, step: 10, default: 110 },
      falloff: { type: "select", options: ["linear", "exponential", "gaussian"], default: "linear" },
    },
    render: ({ text, radius, falloff }) => (
      <VariableProximity
        as="p"
        from={{ wght: 300 }}
        to={{ wght: 900 }}
        radius={radius}
        falloff={falloff}
        style={{ ...display, fontSize: "clamp(2.25rem, 6vw, 3.75rem)" }}
      >
        {text}
      </VariableProximity>
    ),
    code: ({ text, radius, falloff }) =>
      `import { VariableProximity } from "kitgrid"\n\n` +
      jsx(
        "VariableProximity",
        { from: obj({ wght: 300 }), to: obj({ wght: 900 }), radius, falloff },
        text,
        { radius: 110, falloff: "linear" },
      ),
    accessibility: ["Needs a variable font for in-between weights.", "Static under reduced motion."],
  }),
  defineDemo({
    id: "falling-text",
    name: "Falling Text",
    category: "Text Effects",
    description: "Words drop and pile up.",
    exports: ["FallingText"],
    height: 340,
    controls: {
      trigger: { type: "select", options: ["click", "hover", "view"], default: "click" },
      gravity: { type: "number", min: 800, max: 5000, step: 100, default: 2600 },
      bounce: { type: "number", min: 0, max: 0.8, step: 0.05, default: 0.2 },
    },
    render: ({ trigger, gravity, bounce }) => (
      <FallingText
        key={trigger}
        trigger={trigger}
        gravity={gravity}
        bounce={bounce}
        highlight={["fall"]}
        style={{ width: 416, maxWidth: "100%", fontSize: 40, fontWeight: 650, letterSpacing: "-0.03em" }}
      >
        Let it fall
      </FallingText>
    ),
    code: ({ trigger, gravity, bounce }) =>
      `import { FallingText } from "kitgrid"\n\n` +
      jsx("FallingText", { trigger, gravity, bounce, highlight: ["fall"] }, "Let it fall", {
        trigger: "click",
        gravity: 2600,
      }),
    accessibility: ["A toggle button for click and hover: Enter or Space drops and restores.", "Never falls under reduced motion."],
  }),
  defineDemo({
    id: "glitch-text",
    name: "Glitch Text",
    category: "Text Effects",
    description: "Sliced, shifting copies in bursts.",
    exports: ["GlitchText"],
    serverSafe: true,
    height: 280,
    controls: {
      text: { type: "text", default: "SIGNAL LOST" },
      trigger: { type: "select", options: ["always", "hover"], default: "always" },
      speed: { type: "number", min: 600, max: 6000, step: 100, default: 2400 },
    },
    render: ({ text, trigger, speed }) => (
      <GlitchText as="h2" trigger={trigger} speed={speed} style={{ ...display, fontFamily: "var(--kg-font-mono)" }}>
        {text}
      </GlitchText>
    ),
    code: ({ text, trigger, speed }) =>
      `import { GlitchText } from "kitgrid"\n\n` +
      jsx("GlitchText", { as: "h2", trigger, speed }, text, { trigger: "always", speed: 2400 }),
    accessibility: ["The copies are pseudo elements, so the text is read once.", "The loop stops under reduced motion."],
  }),
  defineDemo({
    id: "shuffle-text",
    name: "Shuffle Text",
    category: "Text Effects",
    description: "Slot-machine reels land on each letter.",
    exports: ["ShuffleText"],
    height: 280,
    controls: {
      text: { type: "text", default: "JACKPOT" },
      trigger: { type: "select", options: ["mount", "view", "hover"], default: "hover" },
      direction: { type: "select", options: ["up", "down"], default: "up" },
      steps: { type: "number", min: 2, max: 16, step: 1, default: 6 },
    },
    render: ({ text, trigger, direction, steps }) => (
      <ShuffleText key={`${trigger}-${direction}-${steps}`} as="h2" trigger={trigger} direction={direction} steps={steps} style={display}>
        {text}
      </ShuffleText>
    ),
    code: ({ text, ...props }) =>
      `import { ShuffleText } from "kitgrid"\n\n` +
      jsx("ShuffleText", { as: "h2", ...props }, text, { trigger: "view", direction: "up", steps: 6 }),
    accessibility: ["Read once as plain text; the reels are aria-hidden.", "Shows the final text under reduced motion."],
  }),
  defineDemo({
    id: "curved-loop",
    name: "Curved Loop",
    category: "Text Effects",
    description: "A phrase riding a curved path. Drag it.",
    exports: ["CurvedLoop"],
    layout: "fill",
    height: 320,
    controls: {
      text: { type: "text", default: "Made to move" },
      curve: { type: "number", min: -200, max: 200, step: 10, default: 90 },
      speed: { type: "number", min: -200, max: 200, step: 10, default: 70 },
      draggable: { type: "boolean", default: true },
    },
    render: ({ text, curve, speed, draggable }) => (
      <div style={{ display: "grid", placeItems: "center", color: "var(--kg-ink)" }}>
        <CurvedLoop curve={curve} speed={speed} draggable={draggable}>
          {text}
        </CurvedLoop>
      </div>
    ),
    code: ({ text, curve, speed, draggable }) =>
      `import { CurvedLoop } from "kitgrid"\n\n` +
      jsx("CurvedLoop", { curve, speed, draggable: draggable ? undefined : false }, text, { curve: 90, speed: 70 }),
    accessibility: ["The phrase is read once; the SVG is aria-hidden.", "Holds still under reduced motion and offscreen."],
  }),
  defineDemo({
    id: "true-focus",
    name: "True Focus",
    category: "Text Effects",
    description: "One word sharp, the rest blurred.",
    exports: ["TrueFocus"],
    height: 280,
    controls: {
      text: { type: "text", default: "Design with intent" },
      mode: { type: "select", options: ["auto", "hover"], default: "auto" },
      interval: { type: "number", min: 600, max: 4000, step: 100, default: 1600 },
      blur: { type: "number", min: 1, max: 12, step: 1, default: 4 },
    },
    render: ({ text, mode, interval, blur }) => (
      <TrueFocus as="h2" mode={mode} interval={interval} blur={blur} style={display}>
        {text}
      </TrueFocus>
    ),
    code: ({ text, ...props }) =>
      `import { TrueFocus } from "kitgrid"\n\n` +
      jsx("TrueFocus", { as: "h2", ...props }, text, { mode: "auto", interval: 1600, blur: 4 }),
    accessibility: ["The sentence is read once, unblurred.", "Every word stays sharp under reduced motion."],
  }),
  defineDemo({
    id: "morphing-text",
    name: "Morphing Text",
    category: "Text Effects",
    description: "Words melt into one another.",
    exports: ["MorphingText"],
    height: 280,
    controls: {
      texts: { type: "text", default: "Craft, Speed, Care" },
      morph: { type: "number", min: 400, max: 3000, step: 100, default: 1100 },
      hold: { type: "number", min: 300, max: 4000, step: 100, default: 1400 },
    },
    render: ({ texts, morph, hold }) => (
      <MorphingText
        as="h2"
        texts={texts.split(",").map((t) => t.trim()).filter(Boolean)}
        morph={morph}
        hold={hold}
        style={{ ...display, fontSize: "clamp(3rem, 9vw, 6rem)" }}
      />
    ),
    code: ({ texts, morph, hold }) =>
      `import { MorphingText } from "kitgrid"\n\n` +
      jsx(
        "MorphingText",
        { texts: texts.split(",").map((t) => t.trim()).filter(Boolean), morph, hold },
        undefined,
        { morph: 1100, hold: 1400 },
      ),
    accessibility: ["Assistive tech reads the full list once.", "Holds the first text under reduced motion."],
  }),
  defineDemo({
    id: "split-flap",
    name: "Split Flap",
    category: "Text Effects",
    description: "A departure board that flips.",
    exports: ["SplitFlap"],
    height: 280,
    controls: {
      speed: { type: "number", min: 30, max: 200, step: 5, default: 70 },
    },
    render: ({ speed }) => <Departures speed={speed} />,
    code: ({ speed }) =>
      `import { SplitFlap } from "kitgrid"\n\n` +
      jsx("SplitFlap", { value: "LISBON 08:45", length: 12, speed }, undefined, { speed: 70 }),
    accessibility: ["The value is read as text; pass live to announce changes.", "Jumps straight to the value under reduced motion."],
  }),
  defineDemo({
    id: "stroke-text",
    name: "Stroke Text",
    category: "Text Effects",
    description: "Outlined type that fills with ink.",
    exports: ["StrokeText"],
    height: 280,
    controls: {
      text: { type: "text", default: "OUTLINE" },
      trigger: { type: "select", options: ["hover", "view", "scroll"], default: "hover" },
    },
    render: ({ text, trigger }) => (
      <StrokeText key={trigger} as="h2" trigger={trigger} style={{ ...display, fontSize: "clamp(3rem, 11vw, 7.5rem)", fontWeight: 800 }}>
        {text}
      </StrokeText>
    ),
    code: ({ text, trigger }) =>
      `import { StrokeText } from "kitgrid"\n\n` + jsx("StrokeText", { as: "h2", trigger }, text, { trigger: "hover" }),
    accessibility: ["One copy of the text in the DOM; the fill is a pseudo element.", "Renders filled under reduced motion."],
  }),
  defineDemo({
    id: "animated-list",
    name: "Animated List",
    category: "Motion",
    description: "A live feed, one arrival at a time.",
    exports: ["AnimatedList"],
    height: 360,
    controls: {
      interval: { type: "number", min: 300, max: 3000, step: 100, default: 1000 },
      order: { type: "select", options: ["newest-first", "oldest-first"], default: "newest-first" },
    },
    render: ({ interval, order }) => (
      <AnimatedList key={`${interval}-${order}`} interval={interval} order={order} style={{ width: 352, maxWidth: "100%" }}>
        <Notification icon={<ShoppingBag size={16} />} title="New order from Lisbon" />
        <Notification icon={<CreditCard size={16} />} title="Payout of $1,240 sent" />
        <Notification icon={<Truck size={16} />} title="Parcel out for delivery" />
        <Notification icon={<MessageCircle size={16} />} title="Review from Ines" />
      </AnimatedList>
    ),
    code: ({ interval, order }) =>
      `import { AnimatedList } from "kitgrid"\n\n` +
      `const events = ["New order from Lisbon", "Payout of $1,240 sent", "Parcel out for delivery", "Review from Ines"]\n\n` +
      jsx(
        "AnimatedList",
        { interval, order, style: obj({ width: 352 }) },
        `{events.map((title) => (\n  <div\n    key={title}\n    style={{ padding: "12px 14px", borderRadius: 16, border: "2px solid var(--kg-ink)", background: "var(--kg-surface-raised)" }}\n  >\n    {title}\n  </div>\n))}`,
        { interval: 1000, order: "newest-first" },
      ),
    accessibility: ["A plain list; items join it as they arrive.", "Every item shows at once under reduced motion."],
  }),
  defineDemo({
    id: "card-swap",
    name: "Card Swap",
    category: "Motion",
    description: "A 3D stack that deals itself.",
    exports: ["CardSwap"],
    height: 420,
    controls: {
      interval: { type: "number", min: 1500, max: 8000, step: 100, default: 3600 },
      skew: { type: "number", min: 0, max: 10, step: 1, default: 4 },
    },
    render: ({ interval, skew }) => (
      <CardSwap aria-label="Autumn looks" interval={interval} skew={skew} style={{ marginTop: 80 }}>
        {swapCards.map((title) => (
          <SwapCard key={title} seed={title} title={title} />
        ))}
      </CardSwap>
    ),
    code: ({ interval, skew }) =>
      `import { CardSwap } from "kitgrid"\n\n` +
      `const looks = ["Track set", "Wide leg", "Powder coat"]\n\n` +
      jsx(
        "CardSwap",
        { "aria-label": "Autumn looks", interval, skew },
        `{looks.map((title) => (\n  <div key={title} style={{ display: "grid", gridTemplateRows: "1fr auto", height: "100%" }}>\n    <div style={{ ${SKELETON} }} />\n    <strong style={{ padding: "12px 16px" }}>{title}</strong>\n  </div>\n))}`,
        { interval: 3600, skew: 4 },
      ),
    accessibility: [
      "The stack is one tab stop: Left and Right arrows deal the previous or next card, and the change is announced.",
      "Only the front card is interactive; the rest are inert.",
      "Pauses on hover and focus; stops under reduced motion.",
    ],
  }),
  defineDemo({
    id: "folder",
    name: "Folder",
    category: "Motion",
    description: "Opens and fans its papers.",
    exports: ["Folder"],
    height: 300,
    controls: {
      size: { type: "number", min: 4, max: 10, step: 0.5, default: 7 },
    },
    render: ({ size }) => (
      <Folder label="Q3 reports" papers={["Q3", "Sales", "Plan"]} style={{ "--kg-folder-size": `${size}rem` } as CSSProperties} />
    ),
    code: ({ size }) =>
      `import { Folder } from "kitgrid"\n\n` +
      jsx(
        "Folder",
        { label: "Q3 reports", papers: ["Q3", "Sales", "Plan"], style: size === 7 ? undefined : obj({ "--kg-folder-size": `${size}rem` }) },
      ),
    accessibility: ["A toggle button named by label, with aria-pressed.", "The artwork is aria-hidden."],
  }),
  defineDemo({
    id: "glare-hover",
    name: "Glare Hover",
    category: "Motion",
    description: "A sheen sweeps across on hover.",
    exports: ["GlareHover"],
    serverSafe: true,
    height: 340,
    controls: {
      angle: { type: "number", min: -90, max: 90, step: 5, default: -45 },
      duration: { type: "number", min: 300, max: 2000, step: 50, default: 750 },
      reverse: { type: "boolean", default: false },
    },
    render: ({ angle, duration, reverse }) => (
      <GlareHover angle={angle} duration={duration} reverse={reverse} style={{ width: 240, height: 300 }}>
        <Block seed="glare" />
      </GlareHover>
    ),
    code: ({ angle, duration, reverse }) =>
      `import { GlareHover } from "kitgrid"\n\n` +
      jsx(
        "GlareHover",
        { angle, duration, reverse, style: obj({ width: 240, height: 300 }) },
        `<div style={{ height: "100%", ${SKELETON} }} />`,
        { angle: -45, duration: 750 },
      ),
    accessibility: ["Also sweeps on focus within.", "Hidden under reduced motion."],
  }),
  defineDemo({
    id: "star-border",
    name: "Star Border",
    category: "Motion",
    description: "Two points of light trace the edge.",
    exports: ["StarBorder"],
    serverSafe: true,
    height: 240,
    controls: {
      label: { type: "text", default: "Start free trial" },
      speed: { type: "number", min: 1500, max: 12000, step: 500, default: 5000 },
    },
    render: ({ label, speed }) => (
      <StarBorder speed={speed}>
        {label} <ArrowRight size={16} />
      </StarBorder>
    ),
    code: ({ label, speed }) =>
      `import { StarBorder } from "kitgrid"\n\n` + jsx("StarBorder", { speed }, label, { speed: 5000 }),
    accessibility: ["A native button by default, or a link with as=\"a\".", "The light stops under reduced motion."],
  }),
  defineDemo({
    id: "click-spark",
    name: "Click Spark",
    category: "Motion",
    description: "Sparks fly from every press.",
    exports: ["ClickSpark"],
    layout: "fill",
    height: 300,
    controls: {
      count: { type: "number", min: 4, max: 16, step: 1, default: 8 },
      radius: { type: "number", min: 10, max: 60, step: 2, default: 22 },
    },
    render: ({ count, radius }) => (
      <ClickSpark count={count} radius={radius} style={{ display: "grid", placeItems: "center" }}>
        <Button variant="outline" leading={<Sparkles />}>
          Celebrate
        </Button>
      </ClickSpark>
    ),
    code: ({ count, radius }) =>
      `import { Button, ClickSpark } from "kitgrid"\n\n` +
      jsx(
        "ClickSpark",
        { count, radius, style: obj({ display: "grid", placeItems: "center", height: 300 }) },
        `<Button variant="outline">Celebrate</Button>`,
        { count: 8, radius: 22 },
      ),
    accessibility: ["The canvas is aria-hidden and never takes events.", "Off under reduced motion."],
  }),
  defineDemo({
    id: "pointer-trail",
    name: "Pointer Trail",
    category: "Motion",
    description: "A ribbon of light follows the cursor.",
    exports: ["PointerTrail"],
    layout: "fill",
    height: 300,
    controls: {
      life: { type: "number", min: 150, max: 1500, step: 50, default: 520 },
      width: { type: "number", min: 2, max: 30, step: 1, default: 14 },
    },
    render: ({ life, width }) => (
      <PointerTrail life={life} width={width} style={{ display: "grid", placeItems: "center", height: "100%" }}>
        <SkeletonCard />
      </PointerTrail>
    ),
    code: ({ life, width }) =>
      `import { PointerTrail } from "kitgrid"\n\n` +
      jsx("PointerTrail", { life, width, style: obj({ height: 300 }) }, undefined, { life: 520, width: 14 }),
    accessibility: ["Decorative canvas, aria-hidden.", "Off under reduced motion and for touch."],
  }),
  defineDemo({
    id: "crosshair",
    name: "Crosshair",
    category: "Motion",
    description: "Hairlines that track the pointer.",
    exports: ["Crosshair"],
    layout: "fill",
    height: 300,
    controls: {
      coordinates: { type: "boolean", default: true },
      hideCursor: { type: "boolean", default: false },
    },
    render: ({ coordinates, hideCursor }) => (
      <Crosshair coordinates={coordinates} hideCursor={hideCursor} style={{ display: "grid", placeItems: "center", height: "100%" }}>
        <SkeletonCard />
      </Crosshair>
    ),
    code: ({ coordinates, hideCursor }) =>
      `import { Crosshair } from "kitgrid"\n\n` +
      jsx("Crosshair", { coordinates, hideCursor, style: obj({ height: 300 }) }),
    accessibility: ["The lines and readout are aria-hidden."],
  }),
  defineDemo({
    id: "magnet-lines",
    name: "Magnet Lines",
    category: "Motion",
    description: "Filings that turn toward the pointer.",
    exports: ["MagnetLines"],
    height: 360,
    controls: {
      rows: { type: "number", min: 3, max: 14, step: 1, default: 8 },
      columns: { type: "number", min: 3, max: 14, step: 1, default: 8 },
      baseAngle: { type: "number", min: -90, max: 90, step: 5, default: -10 },
    },
    render: ({ rows, columns, baseAngle }) => <MagnetLines rows={rows} columns={columns} baseAngle={baseAngle} />,
    code: (values) =>
      `import { MagnetLines } from "kitgrid"\n\n` + jsx("MagnetLines", values, undefined, { baseAngle: -10 }),
    accessibility: ["Decorative and aria-hidden.", "Frozen at the base angle under reduced motion."],
  }),
  defineDemo({
    id: "elastic-slider",
    name: "Elastic Slider",
    category: "Motion",
    description: "Pull past the end, it stretches.",
    exports: ["ElasticSlider"],
    height: 240,
    controls: {
      showValue: { type: "boolean", default: true },
      step: { type: "number", min: 1, max: 20, step: 1, default: 1 },
    },
    render: ({ showValue, step }) => (
      <ElasticSlider
        label="Volume"
        defaultValue={40}
        step={step}
        showValue={showValue}
        leading={<Volume1 />}
        trailing={<Volume2 />}
        getValueText={(v) => `${v} percent`}
      />
    ),
    code: ({ showValue, step }) =>
      `import { ElasticSlider } from "kitgrid"\nimport { Volume1, Volume2 } from "lucide-react"\n\n` +
      jsx(
        "ElasticSlider",
        { label: "Volume", defaultValue: 40, step, showValue, leading: raw("<Volume1 />"), trailing: raw("<Volume2 />") },
        undefined,
        { step: 1 },
      ),
    accessibility: ["role=slider: arrows, Page Up/Down, Home and End.", "No stretch under reduced motion."],
  }),
  defineDemo({
    id: "circular-gallery",
    name: "Circular Gallery",
    category: "Motion",
    description: "Panels on a turning 3D ring.",
    exports: ["CircularGallery"],
    layout: "fill",
    height: 400,
    controls: {
      speed: { type: "number", min: -40, max: 40, step: 1, default: 8 },
      tilt: { type: "number", min: -20, max: 20, step: 1, default: -6 },
    },
    render: ({ speed, tilt }) => (
      <CircularGallery label="Autumn looks" speed={speed} tilt={tilt}>
        {panels.map((name) => (
          <Block key={name} seed={name} />
        ))}
      </CircularGallery>
    ),
    code: ({ speed, tilt }) =>
      `import { CircularGallery } from "kitgrid"\n\n` +
      `const panels = ["Coat", "Knit", "Denim", "Linen", "Wool"]\n\n` +
      jsx(
        "CircularGallery",
        { label: "Autumn looks", speed, tilt },
        `{panels.map((name) => (\n  <div key={name} style={{ height: "100%", ${SKELETON} }} />\n))}`,
        { speed: 8, tilt: -6 },
      ),
    accessibility: ["A labelled carousel region; Left and Right step one panel.", "No idle spin under reduced motion."],
  }),
  defineDemo({
    id: "flowing-menu",
    name: "Flowing Menu",
    category: "Motion",
    description: "Rows flood with a marquee on hover.",
    exports: ["FlowingMenu"],
    layout: "fill",
    height: 340,
    render: () => (
      <div style={{ display: "grid", alignContent: "center" }}>
        <FlowingMenu
          items={[
            { label: "Studio", href: "#studio" },
            { label: "Journal", href: "#journal" },
            { label: "Shop", href: "#shop" },
          ]}
        />
      </div>
    ),
    code: () =>
      `import { FlowingMenu } from "kitgrid"\n\n<FlowingMenu\n  items={[\n    { label: "Studio", href: "/studio" },\n    { label: "Journal", href: "/journal" },\n    { label: "Shop", href: "/shop" },\n  ]}\n/>`,
    accessibility: ["A nav landmark of plain links; the marquee is aria-hidden.", "Opens on focus too; no marquee under reduced motion."],
  }),
  defineDemo({
    id: "pixel-transition",
    name: "Pixel Transition",
    category: "Motion",
    description: "Faces swap through a field of pixels.",
    exports: ["PixelTransition"],
    height: 360,
    controls: {
      gridSize: { type: "number", min: 4, max: 20, step: 1, default: 8 },
      duration: { type: "number", min: 200, max: 1500, step: 50, default: 520 },
    },
    render: ({ gridSize, duration }) => (
      <PixelTransition
        gridSize={gridSize}
        duration={duration}
        style={{ width: 260, aspectRatio: "1" }}
        first={<Block seed="court" ratio={1} />}
        second={
          <div style={{ display: "grid", alignContent: "end", gap: 6, height: "100%", padding: 20, background: "var(--kg-surface-raised)" }}>
            <strong style={{ fontSize: 22 }}>Court 02</strong>
            <span style={caption}>$140</span>
          </div>
        }
      />
    ),
    code: ({ gridSize, duration }) =>
      `import { PixelTransition } from "kitgrid"\n\n` +
      jsx(
        "PixelTransition",
        {
          gridSize,
          duration,
          style: obj({ width: 260, aspectRatio: "1" }),
          first: raw(`<div style={{ height: "100%", ${SKELETON} }} />`),
          second: raw(`<div style={{ display: "grid", alignContent: "end", height: "100%", padding: 20 }}><strong>Court 02</strong>$140</div>`),
        },
        undefined,
        { gridSize: 8, duration: 520 },
      ),
    accessibility: ["Hover, focus or tap swaps faces; the hidden face is aria-hidden.", "Swaps instantly under reduced motion."],
  }),
  defineDemo({
    id: "lens",
    name: "Lens",
    category: "Motion",
    description: "A magnifier that follows the pointer.",
    exports: ["Lens"],
    height: 380,
    controls: {
      zoom: { type: "number", min: 1.25, max: 4, step: 0.25, default: 2 },
      size: { type: "number", min: 80, max: 300, step: 10, default: 170 },
    },
    render: ({ zoom, size }) => (
      <Lens zoom={zoom} size={size} style={{ width: 384, maxWidth: "100%", aspectRatio: "4 / 3" }}>
        <Block seed="lens" ratio={4 / 3} />
      </Lens>
    ),
    code: ({ zoom, size }) =>
      `import { Lens } from "kitgrid"\n\n` +
      jsx(
        "Lens",
        { zoom, size, style: obj({ width: 384, aspectRatio: "4 / 3" }) },
        `<div style={{ height: "100%", ${SKELETON} }} />`,
        { zoom: 2, size: 170 },
      ),
    accessibility: ["The magnified clone is inert and aria-hidden, with ids and names stripped."],
  }),
  defineDemo({
    id: "animated-beam",
    name: "Animated Beam",
    category: "Motion",
    description: "Pulses flowing between elements.",
    exports: ["AnimatedBeam"],
    height: 320,
    controls: {
      curvature: { type: "number", min: -120, max: 120, step: 5, default: 30 },
    },
    render: ({ curvature }) => <BeamDiagram curvature={curvature} />,
    code: ({ curvature }) =>
      `import { AnimatedBeam } from "kitgrid"\nimport { useRef } from "react"\n\n` +
      `const node = { display: "grid", placeItems: "center", width: 52, height: 52, borderRadius: 999, border: "2px solid var(--kg-ink)", background: "var(--kg-surface-raised)", zIndex: 1 } as const\n\n` +
      `function Example() {\n  const container = useRef<HTMLDivElement>(null)\n  const from = useRef<HTMLDivElement>(null)\n  const to = useRef<HTMLDivElement>(null)\n  return (\n    <div ref={container} style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", width: 320, height: 160 }}>\n      <div ref={from} style={node}>A</div>\n      <div ref={to} style={node}>B</div>\n      ` +
      jsx("AnimatedBeam", { containerRef: raw("container"), fromRef: raw("from"), toRef: raw("to"), curvature }, undefined, {
        curvature: 0,
      }).replace(/\n/g, "\n      ") +
      `\n    </div>\n  )\n}\n\n<Example />`,
    accessibility: ["Decorative SVG, aria-hidden.", "The pulse stops under reduced motion."],
  }),
  defineDemo({
    id: "orbiting-circles",
    name: "Orbiting Circles",
    category: "Motion",
    description: "Satellites circling a hub.",
    exports: ["OrbitingCircles"],
    serverSafe: true,
    height: 380,
    controls: {
      radius: { type: "number", min: 60, max: 160, step: 5, default: 120 },
      duration: { type: "number", min: 6, max: 60, step: 1, default: 24 },
      reverse: { type: "boolean", default: false },
    },
    render: ({ radius, duration, reverse }) => (
      <OrbitingCircles
        radius={radius}
        duration={duration}
        reverse={reverse}
        center={
          <span style={{ display: "grid", placeItems: "center", width: 60, height: 60, borderRadius: 999, background: "var(--kg-ink)", color: "var(--kg-surface)" }}>
            <Zap size={24} />
          </span>
        }
      >
        <Mail />
        <Cloud />
        <Database />
        <Package />
      </OrbitingCircles>
    ),
    code: ({ radius, duration, reverse }) =>
      `import { OrbitingCircles } from "kitgrid"\nimport { Cloud, Database, Mail, Package, Zap } from "lucide-react"\n\n` +
      jsx("OrbitingCircles", { radius, duration, reverse, center: raw("<Zap />") }, "<Mail />\n<Cloud />\n<Database />\n<Package />", {
        radius: 120,
        duration: 24,
      }),
    accessibility: ["Satellites stay in reading order.", "Still under reduced motion."],
  }),
  defineDemo({
    id: "scroll-progress",
    name: "Scroll Progress",
    category: "Motion",
    description: "A hairline that fills as you read.",
    exports: ["ScrollProgress"],
    height: 320,
    render: () => <ScrollBox />,
    code: () => `import { ScrollProgress } from "kitgrid"\n\n<ScrollProgress />`,
    accessibility: ["Decorative and aria-hidden."],
  }),
  defineDemo({
    id: "parallax-layers",
    name: "Parallax Layers",
    category: "Motion",
    description: "Layers drifting at their own depth.",
    exports: ["ParallaxLayers", "ParallaxLayer"],
    layout: "fill",
    height: 380,
    controls: {
      pointer: { type: "boolean", default: true },
      range: { type: "number", min: 40, max: 400, step: 10, default: 140 },
    },
    render: ({ pointer, range }) => (
      <ParallaxLayers pointer={pointer} range={range} style={{ minHeight: 380, placeItems: "center" }}>
        <ParallaxLayer depth={-0.3} style={{ width: "120%", height: "130%", alignSelf: "stretch", justifySelf: "center" }}>
          <Block seed="parallax" ratio={16 / 9} />
        </ParallaxLayer>
        <ParallaxLayer depth={0.6} style={{ zIndex: 1 }}>
          <h3 style={display}>Depth</h3>
        </ParallaxLayer>
      </ParallaxLayers>
    ),
    code: ({ pointer, range }) =>
      `import { ParallaxLayer, ParallaxLayers } from "kitgrid"\n\n` +
      jsx(
        "ParallaxLayers",
        { pointer, range, style: obj({ minHeight: 380, placeItems: "center" }) },
        `<ParallaxLayer depth={-0.3} style={{ width: "120%", height: "130%", alignSelf: "stretch", justifySelf: "center" }}>\n  <div style={{ height: "100%", ${SKELETON} }} />\n</ParallaxLayer>\n<ParallaxLayer depth={0.6} style={{ zIndex: 1 }}>\n  <h2>Depth</h2>\n</ParallaxLayer>`,
        { range: 140 },
      ),
    accessibility: ["Layers keep source order.", "At rest under reduced motion."],
  }),
  defineDemo({
    id: "sticky-reveal",
    name: "Sticky Reveal",
    category: "Motion",
    description: "Scroll to open the frame.",
    exports: ["StickyReveal"],
    layout: "fill",
    height: 460,
    render: () => <StickyBox />,
    code: () =>
      `import { StickyReveal } from "kitgrid"\n\n<StickyReveal overlay={<h2>Autumn line</h2>}>\n  <div style={{ height: "100%", ${SKELETON} }} />\n</StickyReveal>`,
    accessibility: ["Media and overlay stay in the accessibility tree.", "Renders open under reduced motion."],
  }),
  defineDemo({
    id: "progressive-blur",
    name: "Progressive Blur",
    category: "Motion",
    description: "An edge that falls out of focus.",
    exports: ["ProgressiveBlur"],
    serverSafe: true,
    height: 380,
    controls: {
      side: { type: "select", options: ["bottom", "top", "left", "right"], default: "bottom" },
      strength: { type: "number", min: 2, max: 40, step: 1, default: 12 },
    },
    render: ({ side, strength }) => (
      <div
        style={{
          position: "relative",
          display: "grid",
          alignContent: "start",
          gap: 14,
          width: 280,
          height: 320,
          padding: 24,
          overflow: "hidden",
          borderRadius: "var(--kg-radius-xl)",
          border: "2px solid var(--kg-ink)",
          background: "var(--kg-surface)",
        }}
      >
        {lines(14)}
        <ProgressiveBlur side={side} strength={strength} size="45%" />
      </div>
    ),
    code: ({ side, strength }) =>
      `import { ProgressiveBlur } from "kitgrid"\n\n` +
      `<div style={{ position: "relative", display: "grid", gap: 14, width: 280, height: 320, padding: 24, overflow: "hidden" }}>\n  {Array.from({ length: 14 }, (_, i) => (\n    <div key={i} style={{ height: 12, borderRadius: 999, ${SKELETON} }} />\n  ))}\n  ` +
      jsx("ProgressiveBlur", { side, strength, size: "45%" }, undefined, { side: "bottom", strength: 12 }) +
      `\n</div>`,
    accessibility: ["Decorative and aria-hidden."],
  }),
  defineDemo({
    id: "bounce-cards",
    name: "Bounce Cards",
    category: "Motion",
    description: "A fanned hand that makes room.",
    exports: ["BounceCards"],
    height: 340,
    controls: {
      spread: { type: "number", min: 0, max: 20, step: 1, default: 9 },
      offset: { type: "number", min: 40, max: 140, step: 4, default: 92 },
    },
    render: ({ spread, offset }) => (
      <BounceCards spread={spread} offset={offset}>
        {panels.map((name) => (
          <Block key={name} seed={`bounce-${name}`} ratio={1} />
        ))}
      </BounceCards>
    ),
    code: ({ spread, offset }) =>
      `import { BounceCards } from "kitgrid"\n\n` +
      `const cards = ["Coat", "Knit", "Denim", "Linen", "Wool"]\n\n` +
      jsx(
        "BounceCards",
        { spread, offset },
        `{cards.map((name) => (\n  <div key={name} style={{ height: "100%", ${SKELETON} }} />\n))}`,
        { spread: 9, offset: 92 },
      ),
    accessibility: ["Focus lifts a card like hover.", "No entrance motion under reduced motion."],
  }),
  defineDemo({
    id: "mask-reveal",
    name: "Mask Reveal",
    category: "Motion",
    description: "A spotlight uncovers what is beneath.",
    exports: ["MaskReveal"],
    height: 380,
    controls: {
      size: { type: "number", min: 80, max: 500, step: 10, default: 260 },
    },
    render: ({ size }) => (
      <MaskReveal size={size} style={{ width: 416, maxWidth: "100%", aspectRatio: "4 / 3" }} reveal={<Block seed="mask" ratio={4 / 3} />}>
        <div
          style={{
            display: "grid",
            placeItems: "center",
            height: "100%",
            background: "var(--kg-surface-sunken)",
            border: "2px solid var(--kg-ink)",
            borderRadius: "inherit",
          }}
        >
          <span style={{ ...display, fontSize: 40 }}>Court 05</span>
        </div>
      </MaskReveal>
    ),
    code: ({ size }) =>
      `import { MaskReveal } from "kitgrid"\n\n` +
      jsx(
        "MaskReveal",
        { size, style: obj({ width: 416, aspectRatio: "4 / 3" }), reveal: raw(`<div style={{ height: "100%", ${SKELETON} }} />`) },
        `<div style={{ display: "grid", placeItems: "center", height: "100%" }}>\n  <h3>Court 05</h3>\n</div>`,
        { size: 260 },
      ),
    accessibility: ["The revealed layer is aria-hidden: keep essentials in children."],
  }),
  defineDemo({
    id: "tracing-beam",
    name: "Tracing Beam",
    category: "Motion",
    description: "A rail that grows as you read.",
    exports: ["TracingBeam"],
    height: 480,
    render: () => (
      <TracingBeam style={{ width: 448, maxWidth: "100%" }}>
        <div style={{ display: "grid", gap: 28 }}>
          {["Faster checkout", "Saved carts", "Gift cards"].map((title) => (
            <div key={title} style={{ display: "grid", gap: 10 }}>
              <strong>{title}</strong>
              <div style={{ height: 96, borderRadius: "var(--kg-radius-lg)", background: "var(--kg-muted)" }} />
            </div>
          ))}
        </div>
      </TracingBeam>
    ),
    code: () =>
      `import { TracingBeam } from "kitgrid"\n\n` +
      `const releases = ["Faster checkout", "Saved carts", "Gift cards"]\n\n` +
      `<TracingBeam>\n  <div style={{ display: "grid", gap: 28 }}>\n    {releases.map((title) => (\n      <article key={title}>\n        <strong>{title}</strong>\n        <div style={{ height: 96, borderRadius: 12, ${SKELETON} }} />\n      </article>\n    ))}\n  </div>\n</TracingBeam>`,
    accessibility: ["The rail is aria-hidden.", "Tracks scroll exactly under reduced motion."],
  }),
]
