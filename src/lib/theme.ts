import { useCallback, useEffect, useState, useSyncExternalStore } from "react"

export interface Palette {
  name: string
  ink: string
  ground: string
  /** Ink chroma and hue; the night paper ground is derived from the ink. */
  inkTone: [number, number]
  /** Day ground chroma and hue. */
  groundTone: [number, number]
}

/** Forest on Mint is the library default; none of them is purple. */
export const presets: Palette[] = [
  {
    name: "Forest",
    ink: "Forest",
    ground: "Mint",
    inkTone: [0.045, 175],
    groundTone: [0.012, 178],
  },
  {
    name: "Navy",
    ink: "Navy",
    ground: "Sky",
    inkTone: [0.08, 255],
    groundTone: [0.022, 245],
  },
  {
    name: "Brick",
    ink: "Brick",
    ground: "Peach",
    inkTone: [0.09, 35],
    groundTone: [0.03, 62],
  },
  {
    name: "Olive",
    ink: "Olive",
    ground: "Butter",
    inkTone: [0.06, 115],
    groundTone: [0.04, 95],
  },
  {
    name: "Cocoa",
    ink: "Cocoa",
    ground: "Rose",
    inkTone: [0.05, 50],
    groundTone: [0.022, 15],
  },
  {
    name: "Graphite",
    ink: "Graphite",
    ground: "Paper",
    inkTone: [0.01, 260],
    groundTone: [0.008, 85],
  },
]

export const DEFAULT_PALETTE = "Forest"

const color = (l: number, c: number, h: number, alpha?: number) =>
  `oklch(${l} ${+c.toFixed(3)} ${h}${alpha === undefined ? "" : ` / ${alpha}`})`

/** The seed tokens a palette sets, in light or dark. Forest reproduces the library defaults. */
export const paletteTokens = (
  palette: Palette,
  mode: "light" | "dark",
): Record<string, string> => {
  const [ic, ih] = palette.inkTone
  const [gc, gh] = palette.groundTone
  if (mode === "light") {
    const ink = color(0.29, ic, ih)
    return {
      "--kg-bg": color(0.927, gc, gh),
      "--kg-surface-sunken": color(0.955, gc * 0.83, gh),
      "--kg-muted": color(0.945, gc * 1.08, gh),
      "--kg-border": color(0.84, gc * 1.83, gh),
      "--kg-border-strong": ink,
      "--kg-fg": ink,
      "--kg-fg-muted": color(0.44, ic * 0.78, ih),
      "--kg-fg-faint": color(0.52, ic * 0.67, ih),
      "--kg-accent": ink,
      "--kg-accent-fg": color(0.955, gc, gh),
      "--kg-ink": ink,
      "--kg-overlay": color(0.22, ic * 0.88, ih, 0.45),
      "--kg-shadow-tint": `0.29 ${+ic.toFixed(3)} ${ih}`,
      "--kg-paper-sage": color(0.8, Math.max(0.02, Math.min(ic * 1.22, 0.066)), ih + 5),
    }
  }
  const k = ic / 0.045
  const q = Math.min(k, 1.3)
  const th = ih - 5
  return {
    "--kg-bg": color(0.2, 0.025 * q, ih),
    "--kg-surface": color(0.26, 0.035 * q, ih),
    "--kg-surface-raised": color(0.3, 0.038 * q, ih),
    "--kg-surface-sunken": color(0.17, 0.02 * q, ih),
    "--kg-muted": color(0.3, 0.03 * q, ih),
    "--kg-border": color(0.38, 0.03 * q, ih),
    "--kg-border-strong": color(0.86, 0.05 * q, ih),
    "--kg-fg": color(0.95, 0.015 * q, th),
    "--kg-fg-muted": color(0.8, 0.025 * q, th),
    "--kg-fg-faint": color(0.7, 0.025 * q, th),
    "--kg-accent": color(0.86, 0.06 * k, ih),
    "--kg-accent-fg": color(0.22, 0.04 * k, ih),
    "--kg-ink": color(0.72, 0.07 * k, ih),
    "--kg-overlay": color(0.1, 0.02 * q, ih, 0.66),
    "--kg-paper-sage": color(0.36, Math.max(0.02, Math.min(ic * 1.11, 0.06)), ih + 5),
  }
}

export interface ThemeSettings {
  palette: string
  radius: number
  density: number
}

const STORAGE_KEY = "kg-playground-studio-v2"
export const DEFAULT_THEME: ThemeSettings = {
  palette: DEFAULT_PALETTE,
  radius: 0.875,
  density: 1,
}
export const RADIUS_MAX = 1.5
export const DENSITIES = [0.85, 1, 1.15]

const paletteOf = (name: string) =>
  presets.find((preset) => preset.name === name) ?? (presets[0] as Palette)

/** Anything that is not a current palette, such as an Orbit era accent, falls back to the default. */
const read = (): ThemeSettings => {
  if (typeof window === "undefined") return DEFAULT_THEME
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "null",
    ) as Partial<ThemeSettings> | null
    if (!stored || !presets.some((preset) => preset.name === stored.palette))
      return DEFAULT_THEME
    const { radius, density } = stored
    return {
      palette: stored.palette as string,
      radius:
        typeof radius === "number" && radius >= 0 && radius <= RADIUS_MAX
          ? radius
          : DEFAULT_THEME.radius,
      density:
        typeof density === "number" && DENSITIES.includes(density)
          ? density
          : DEFAULT_THEME.density,
    }
  } catch {
    return DEFAULT_THEME
  }
}

const block = (selector: string, tokens: Record<string, string>, indent = "") =>
  `${indent}${selector} {\n${Object.entries(tokens)
    .map(([name, value]) => `${indent}  ${name}: ${value};\n`)
    .join("")}${indent}}\n`

/** The CSS a consumer would paste to reproduce the current studio settings. */
export const themeCss = ({ palette, radius, density }: ThemeSettings): string => {
  const preset = paletteOf(palette)
  const dark = paletteTokens(preset, "dark")
  return [
    block(':root,\n[data-theme="light"]', {
      ...paletteTokens(preset, "light"),
      "--kg-radius": `${radius}rem`,
      "--kg-density": String(density),
    }),
    block('[data-theme="dark"]', dark),
    `@media (prefers-color-scheme: dark) {\n${block('[data-theme="system"]', dark, "  ")}}\n`,
  ].join("\n")
}

export const isDefaultTheme = (settings: ThemeSettings) =>
  settings.palette === DEFAULT_THEME.palette &&
  settings.radius === DEFAULT_THEME.radius &&
  settings.density === DEFAULT_THEME.density

/** Applies the stored studio theme on boot, so every page shows it, not only Theming. */
export const applyStoredTheme = () => {
  const settings = read()
  if (!isDefaultTheme(settings)) writeStyle(settings)
}

const writeStyle = (settings: ThemeSettings) => {
  let style = document.getElementById("kg-studio") as HTMLStyleElement | null
  if (!style) {
    style = document.createElement("style")
    style.id = "kg-studio"
    document.head.append(style)
  }
  style.textContent = isDefaultTheme(settings) ? "" : themeCss(settings)
}

export const useThemeStudio = () => {
  // Defaults on the server and first render; the stored theme loads after mount, and nothing
  // is written back until it has, so the defaults never overwrite it.
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_THEME)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setSettings(read())
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    writeStyle(settings)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // Private mode: the studio still works, it just forgets on reload.
    }
  }, [settings, loaded])

  const update = useCallback(
    (patch: Partial<ThemeSettings>) =>
      setSettings((current) => ({ ...current, ...patch })),
    [],
  )
  const reset = useCallback(() => setSettings(DEFAULT_THEME), [])
  return { settings, update, reset }
}

/* Color mode: a tiny external store so the toggle can flip the DOM synchronously inside a
   view transition, before React re-renders. */

type Mode = "light" | "dark"
const listeners = new Set<() => void>()
const currentMode = (): Mode =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light"

const setMode = (mode: Mode) => {
  document.documentElement.dataset.theme = mode
  try {
    localStorage.setItem("kg-playground-theme", mode)
  } catch {
    // Persistence is best-effort.
  }
  for (const listener of listeners) listener()
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> }
}

/**
 * Flips the theme with a circular reveal that grows from `origin`, the Orbit "turn" applied to
 * the whole page. Reduced motion and older browsers swap instantly.
 */
export const toggleMode = (origin?: { x: number; y: number }) => {
  const next: Mode = currentMode() === "dark" ? "light" : "dark"
  const doc = document as ViewTransitionDocument
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches
  if (!doc.startViewTransition || reduce || !origin) {
    setMode(next)
    return
  }
  const { x, y } = origin
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  document.documentElement.dataset.themeSwitch = ""
  const transition = doc.startViewTransition(() => setMode(next))
  transition.ready
    .then(() => {
      const animation = document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 620,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      )
      animation.finished.finally(() => {
        delete document.documentElement.dataset.themeSwitch
      })
    })
    .catch(() => {
      delete document.documentElement.dataset.themeSwitch
    })
}

export const useColorMode = () => {
  const mode = useSyncExternalStore(subscribe, currentMode, () => "light" as Mode)
  return { mode, toggle: toggleMode }
}
