import {
  GradientText,
  NumberTicker,
  RotatingText,
  ScrambleText,
  ScrollText,
  ShinyText,
  TextHighlight,
  TextReveal,
  Typewriter,
} from "kitgrid"
import type { CSSProperties } from "react"
import { defineDemo, jsx, raw } from "./registry"

const display: CSSProperties = {
  margin: 0,
  fontSize: "clamp(2.25rem, 6vw, 3.75rem)",
  fontWeight: 680,
  lineHeight: 1.08,
  letterSpacing: "-0.035em",
  textAlign: "center",
  textWrap: "balance",
}

const list = (value: string) =>
  value
    .split(",")
    .map((word) => word.trim())
    .filter(Boolean)

const wordsCode = (words: string[]) => raw(`[${words.map((word) => JSON.stringify(word)).join(", ")}]`)

const revealDefaults = { as: "span", split: "word", effect: "fade-up", duration: 650 }
const typewriterDefaults = { typeSpeed: 65, loop: true, cursor: "bar" }
const rotatingDefaults = { interval: 2600, transition: "slide-up", duration: 600 }

const CHARSETS = {
  letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&*+-<=>?@^_/\\|~",
  binary: "01",
  blocks: "▖▗▘▙▚▛▜▝▞▟░▒▓",
  katakana: "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ",
} as const

const formats = {
  number: undefined,
  currency: `{ style: "currency", currency: "USD" }`,
  percent: `{ style: "percent" }`,
  compact: `{ notation: "compact" }`,
} as const

export const demos = [
  defineDemo({
    id: "text-reveal",
    name: "Text Reveal",
    category: "Text Effects",
    description: "Staggered word or character entrances.",
    exports: ["TextReveal"],
    height: 300,
    controls: {
      text: { type: "text", default: "Effortless commerce" },
      effect: { type: "select", options: ["fade-up", "blur", "mask", "scale"], default: "mask" },
      split: { type: "select", options: ["word", "char"], default: "char" },
      duration: { type: "number", min: 150, max: 1600, step: 50, default: 750 },
    },
    render: ({ text, effect, split, duration }) => (
      <TextReveal key={`${effect}-${split}-${duration}`} as="h2" effect={effect} split={split} duration={duration} style={display}>
        {text}
      </TextReveal>
    ),
    code: ({ text, effect, split, duration }) =>
      `import { TextReveal } from "kitgrid"\n\n` +
      jsx("TextReveal", { as: "h2", effect, split, duration }, text, revealDefaults),
    accessibility: [
      "The full sentence lives in a visually hidden copy; every animated piece is aria-hidden, so screen readers hear it once.",
      "Reduced motion shows the final text immediately (CSS and JS), and onComplete still fires.",
      'trigger="view" text stays readable without JavaScript via @media (scripting: none).',
    ],
  }),
  defineDemo({
    id: "typewriter",
    name: "Typewriter",
    category: "Text Effects",
    description: "Types, holds and deletes a list of words.",
    exports: ["Typewriter"],
    height: 260,
    controls: {
      words: { type: "text", default: "stores, brands, apps" },
      typeSpeed: { type: "number", min: 15, max: 200, step: 5, default: 65 },
      cursor: { type: "select", options: ["bar", "block", "underscore", "none"], default: "bar" },
      loop: { type: "boolean", default: true },
    },
    render: ({ words, typeSpeed, cursor, loop }) => (
      <Typewriter
        key={String(loop)}
        as="h2"
        prefix="We build"
        words={list(words)}
        typeSpeed={typeSpeed}
        cursor={cursor}
        loop={loop}
        style={display}
      />
    ),
    code: ({ words, typeSpeed, cursor, loop }) =>
      `import { Typewriter } from "kitgrid"\n\n` +
      jsx(
        "Typewriter",
        { as: "h2", prefix: "We build", words: wordsCode(list(words)), typeSpeed, cursor, loop },
        undefined,
        typewriterDefaults,
      ),
    accessibility: [
      "Screen readers get one stable sentence: the prefix plus every word joined by commas. Typed characters are aria-hidden.",
      "Under reduced motion each word appears whole on the same rhythm instead of being typed.",
      "The server renders the first word, so there is real text before hydration.",
    ],
  }),
  defineDemo({
    id: "shiny-text",
    name: "Shiny Text",
    category: "Text Effects",
    description: "A band of light sweeping across text.",
    exports: ["ShinyText"],
    serverSafe: true,
    controls: {
      text: { type: "text", default: "On its way" },
      duration: { type: "number", min: 800, max: 8000, step: 100, default: 2800 },
      width: { type: "number", min: 5, max: 100, step: 1, default: 32 },
      disabled: { type: "boolean", default: false },
    },
    render: ({ text, duration, width, disabled }) => (
      <ShinyText as="h2" duration={duration} width={width} disabled={disabled} style={display}>
        {text}
      </ShinyText>
    ),
    code: ({ text, duration, width, disabled }) =>
      `import { ShinyText } from "kitgrid"\n\n` +
      jsx("ShinyText", { as: "h2", duration, width, disabled }, text, { duration: 2800, width: 32 }),
    accessibility: [
      "The text stays ordinary, selectable DOM text; only its fill is painted with a gradient.",
      "Reduced motion and forced-colors mode fall back to solid text.",
    ],
  }),
  defineDemo({
    id: "gradient-text",
    name: "Gradient Text",
    category: "Text Effects",
    description: "Text filled with a drifting accent gradient.",
    exports: ["GradientText"],
    serverSafe: true,
    controls: {
      text: { type: "text", default: "Sell beautifully" },
      angle: { type: "number", min: 0, max: 360, step: 5, default: 90 },
      duration: { type: "number", min: 1000, max: 16000, step: 500, default: 6000 },
      animate: { type: "boolean", default: true },
    },
    render: ({ text, angle, duration, animate }) => (
      <GradientText as="h2" angle={angle} duration={duration} animate={animate} style={display}>
        {text}
      </GradientText>
    ),
    code: ({ text, angle, duration, animate }) =>
      `import { GradientText } from "kitgrid"\n\n` +
      jsx("GradientText", { as: "h2", angle, duration, animate }, text, { angle: 90, duration: 6000, animate: true }),
    accessibility: [
      "Real text with a gradient fill: screen readers, selection and translation are unaffected.",
      "The drift stops under reduced motion; forced-colors mode shows solid system text.",
    ],
  }),
  defineDemo({
    id: "number-ticker",
    name: "Number Ticker",
    category: "Text Effects",
    description: "Counts to a number and animates changes.",
    exports: ["NumberTicker"],
    height: 280,
    controls: {
      value: { type: "number", min: 0, max: 1000000, step: 1, default: 48250 },
      variant: { type: "select", options: ["count", "roll"], default: "roll" },
      format: { type: "select", options: ["number", "currency", "percent", "compact"], default: "currency" },
      trigger: { type: "select", options: ["view", "mount"], default: "view" },
    },
    render: ({ value, variant, format, trigger }) => {
      const options: Intl.NumberFormatOptions =
        format === "currency"
          ? { style: "currency", currency: "USD" }
          : format === "percent"
            ? { style: "percent" }
            : format === "compact"
              ? { notation: "compact" }
              : {}
      return (
        <NumberTicker
          key={`${variant}-${trigger}`}
          value={format === "percent" ? value / 100000 : value}
          variant={variant}
          format={options}
          trigger={trigger}
          style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)", fontWeight: 680, letterSpacing: "-0.04em" }}
        />
      )
    },
    code: ({ value, variant, format, trigger }) =>
      `import { NumberTicker } from "kitgrid"\n\n` +
      jsx(
        "NumberTicker",
        {
          value: format === "percent" ? value / 100000 : value,
          variant,
          format: formats[format] ? raw(formats[format]) : undefined,
          trigger,
        },
        undefined,
        { variant: "count", trigger: "view" },
      ),
    accessibility: [
      "Assistive tech reads only the final formatted value from a visually hidden copy; the counting digits are aria-hidden.",
      "The box reserves the width of both the start and end values, so neither counting nor hydration shifts layout.",
      "Reduced motion lands on the value immediately, including later changes.",
    ],
  }),
  defineDemo({
    id: "scramble-text",
    name: "Scramble Text",
    category: "Text Effects",
    description: "Decodes text from random glyphs.",
    exports: ["ScrambleText"],
    height: 260,
    controls: {
      text: { type: "text", default: "Access granted" },
      trigger: { type: "select", options: ["mount", "view", "hover"], default: "mount" },
      duration: { type: "number", min: 200, max: 4000, step: 100, default: 1200 },
      charset: { type: "select", options: ["letters", "binary", "blocks", "katakana"], default: "letters" },
    },
    render: ({ text, trigger, duration, charset }) => (
      <ScrambleText
        key={`${trigger}-${duration}-${charset}`}
        as="h2"
        trigger={trigger}
        duration={duration}
        charset={CHARSETS[charset]}
        monospace
        style={{ ...display, letterSpacing: "-0.01em" }}
      >
        {text}
      </ScrambleText>
    ),
    code: ({ text, trigger, duration, charset }) =>
      `import { ScrambleText } from "kitgrid"\n\n` +
      jsx(
        "ScrambleText",
        {
          as: "h2",
          trigger,
          duration,
          charset: charset === "letters" ? undefined : CHARSETS[charset],
          monospace: true,
        },
        text,
        { trigger: "view", duration: 900 },
      ),
    accessibility: [
      "The real text is in a visually hidden copy; the glyphs are aria-hidden, so nobody hears noise.",
      'trigger="hover" also runs on focus within, so keyboard users get the same effect.',
      "Reduced motion never scrambles. View-triggered text is readable in server HTML.",
    ],
  }),
  defineDemo({
    id: "rotating-text",
    name: "Rotating Text",
    category: "Text Effects",
    description: "Cycles words in a fixed-width slot.",
    exports: ["RotatingText"],
    height: 260,
    controls: {
      words: { type: "text", default: "fast, often, anywhere" },
      transition: { type: "select", options: ["slide-up", "blur", "flip"], default: "slide-up" },
      interval: { type: "number", min: 800, max: 6000, step: 100, default: 2600 },
      duration: { type: "number", min: 150, max: 1500, step: 50, default: 600 },
    },
    render: ({ words, transition, interval, duration }) => (
      <h2 style={display}>
        Ship{" "}
        <RotatingText
          words={list(words)}
          transition={transition}
          interval={interval}
          duration={duration}
          style={{ color: "var(--kg-accent-strong)" }}
        />
      </h2>
    ),
    code: ({ words, transition, interval, duration }) =>
      `import { RotatingText } from "kitgrid"\n\n` +
      `<h2>\n  Ship{" "}\n  ${jsx("RotatingText", { words: wordsCode(list(words)), transition, interval, duration }, undefined, rotatingDefaults)
        .split("\n")
        .join("\n  ")}\n</h2>`,
    accessibility: [
      "Screen readers get every word once, joined by commas; the rotating copy is aria-hidden.",
      "Rotation holds on hover and while focus is inside, and idles offscreen and in hidden tabs.",
      "The slot is sized to the longest word, so the sentence never reflows.",
    ],
  }),
  defineDemo({
    id: "text-highlight",
    name: "Text Highlight",
    category: "Text Effects",
    description: "A marker, underline or circle drawn behind text.",
    exports: ["TextHighlight"],
    height: 260,
    controls: {
      variant: { type: "select", options: ["marker", "underline", "circle"], default: "marker" },
      duration: { type: "number", min: 150, max: 3000, step: 50, default: 900 },
      delay: { type: "number", min: 0, max: 2000, step: 50, default: 200 },
      trigger: { type: "select", options: ["view", "mount"], default: "view" },
    },
    render: ({ variant, duration, delay, trigger }) => (
      <p key={`${variant}-${trigger}-${duration}-${delay}`} style={display}>
        Returns are{" "}
        <TextHighlight variant={variant} duration={duration} delay={delay} trigger={trigger}>
          free
        </TextHighlight>
      </p>
    ),
    code: ({ variant, duration, delay, trigger }) =>
      `import { TextHighlight } from "kitgrid"\n\n<p>\n  Returns are{" "}\n  ${jsx(
        "TextHighlight",
        { variant, duration, delay, trigger },
        "free",
        { variant: "marker", duration: 900, delay: 0, trigger: "view" },
      )}\n</p>`,
    accessibility: [
      'Renders a <mark> by default; pick as="strong" or "em" when that fits better.',
      "The stroke is decoration only, and the circle SVG is aria-hidden.",
      "Reduced motion draws it immediately; forced-colors mode swaps the marker for an underline.",
    ],
  }),
  defineDemo({
    id: "scroll-text",
    name: "Scroll Text",
    category: "Text Effects",
    description: "Words that fill in as you scroll.",
    exports: ["ScrollText"],
    layout: "fill",
    controls: {
      dim: { type: "number", min: 0, max: 0.6, step: 0.02, default: 0.18 },
      start: { type: "number", min: 0, max: 90, step: 1, default: 10 },
      end: { type: "number", min: 10, max: 100, step: 1, default: 55 },
    },
    render: ({ dim, start, end }) => (
      <div style={{ height: 380, overflowY: "auto", overscrollBehavior: "contain" }}>
        <div style={{ display: "grid", justifyItems: "center", padding: "260px 24px 300px" }}>
          <ScrollText dim={dim} range={[start, Math.max(end, start + 1)]} style={display}>
            Quiet commerce wins
          </ScrollText>
        </div>
      </div>
    ),
    code: ({ dim, start, end }) =>
      `import { ScrollText } from "kitgrid"\n\n` +
      jsx(
        "ScrollText",
        { dim, range: start === 10 && end === 55 ? undefined : raw(`[${start}, ${end}]`) },
        "Quiet commerce wins",
        { dim: 0.18 },
      ),
    accessibility: [
      "Screen readers get the paragraph once, as plain text; the per-word spans are aria-hidden.",
      "Without JavaScript or scroll-timeline support, and under reduced motion, every word renders at full strength.",
    ],
  }),
]
