# kitgrid design language: Orbit

This is the visual identity of the library and its playground. Every component, demo and page
must read as one system that couldn't be mistaken for shadcn, Aceternity or Magic UI.

## Idea

The name is the concept: **360°**. Things orbit, rotate, catch light from a moving source and
settle with weight. The signature motifs are:

- **Orbit light.** A conic highlight that sweeps around an edge or surface, never a static
  glow. Use registered `@property --angle` with a `conic-gradient`.
- **Turn, not slide.** Where something enters, prefer rotation, perspective and depth
  (`rotateX`, `rotateY`, `perspective`) over flat translate-fades.
- **Physical surfaces.** Layered, not flat:
  - a 1px hairline border;
  - an inner top highlight (`--kg-shadow-inset-edge`);
  - shadows tinted with `--kg-shadow-tint`, never pure black;
  - optional grain, only on fixed, pointer-events-none layers.
- **Circles as a recurring shape.** Progress rings, orbit dots, circular text and the ring
  logo. Use them where a circle is natural; never force them.

## Color

- **Neutrals:** graphite, hue 260 at very low chroma. Light and dark are both first-class.
- **Accent:** one only, **Signal Orange** `oklch(0.72 0.185 50)` (dark theme
  `oklch(0.76 0.17 55)`), with near-black text on it (`--kg-accent-fg`).
- **Accent as text:** use `--kg-accent-strong` for text, icons and focus rings on surfaces.
  It's the accent pulled toward the text colour, so it passes AA. Never put
  `var(--kg-accent)` text on a light surface.
- **Fills:** `--kg-accent-hover` for hover fills, and `-soft`, `-edge` and `-glow` for tints.
- **Status colours** (`success`, `warning`, `danger`, `info`) are only for meaning. Sale prices
  are danger-red, which is visibly distinct from the orange.
- **Banned:**
  - purple or violet defaults, and purple-blue-pink "AI gradients";
  - neon outer glows;
  - beige, brass and espresso "premium" palettes;
  - pure `#000` and pure `#fff`.
- **Gradients** are monochrome-plus-accent: accent into graphite, or accent into a warm or
  cool neighbour hue (±25°). Never rainbow, except in the holographic foil effect, where
  iridescence is the point.

## Shape

| Element | Radius |
| --- | --- |
| Controls (buttons, inputs, selects) | `--kg-radius-md` |
| Cards and surfaces | `--kg-radius-xl` |
| Overlays | `--kg-radius-xl` |
| Chips, tags and pills | full |

## Type (playground)

- **Text:** Geist. **Mono:** Geist Mono. **Display:** Cabinet Grotesk 700/800, tight tracking.
- Emphasis inside a headline uses the same family (weight or italic), never a mixed serif.
- The library itself inherits the host app's font.

## Motion

- Every animation communicates hierarchy, feedback, state change or storytelling. Nothing
  loops just to look busy.
- Default to `--kg-ease-out`: things decelerate, they don't overshoot. Keep
  `--kg-ease-spring` and `--kg-ease-bounce` out of UI chrome; `createSpring` is for
  pointer-driven physics only.
- One marquee per page at most.
- Reduced motion snaps to the final state, live (see CONTRIBUTING).

## Copy

- No em-dashes or en-dashes anywhere visible. Use a period, comma, colon or hyphen.
- Ration the middle dot (`·`) to one per line.
- Eyebrow labels: at most one per three sections.
- No version pills in heroes, no decorative status dots, no scroll cues.
- Realistic names, prices and data. No "Acme" and no "John Doe".
