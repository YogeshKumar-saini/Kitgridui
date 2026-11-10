# Market research: React UI and motion libraries

Snapshot: **23 October 2026**. Star counts are from the GitHub API on that date. A vendor's
description of its own product is marked _(claim)_. Reddit blocks automated fetching, so
developer sentiment comes from Hacker News, GitHub issues/PRs and engineering blogs.

## Executive summary

The market splits into three camps, and no product covers all three:

1. **Headless accessible primitives** (Radix, Base UI, Ark, React Aria) are solid but unstyled
   and have no motion.
2. **Copy-paste motion galleries** (Aceternity, React Bits, Magic UI, Cult UI, Animata,
   Eldora, Velora) look stunning. They are Tailwind-only, can't be updated, are largely silent
   on accessibility and reduced motion, and pull in heavy animation engines.
3. **Installable kits** (MUI, Mantine, Chakra, HeroUI) can be updated, but they carry runtime
   CSS-in-JS or Tailwind requirements, have generic visuals, and have no premium motion or
   commerce coverage.

**Gap:** a single npm package, MIT-licensed, that combines accessible primitives, premium motion
with reduced-motion guarantees, an ecommerce kit, and styling that does not force Tailwind.
That is kitgrid's positioning.

## Landscape

| Library | Distribution | Styling | Motion engine | A11y base | Price | Stars |
|---|---|---|---|---|---|---|
| shadcn/ui | CLI copy-paste | Tailwind v4 + CSS vars | tw-animate-css | Base UI (default since Jul 2026) or Radix | Free MIT | 126.3k |
| Aceternity UI | copy-paste / shadcn CLI | Tailwind | Motion | not stated | Free + $199 Pro | — |
| React Bits | copy / CLI | CSS or Tailwind | GSAP, Motion, three, ogl | not stated | MIT + Commons Clause | 50.0k |
| Magic UI | copy-paste | Tailwind | Motion | not stated | Free + Pro | 22.8k |
| Annnimate | copy-paste | CSS | GSAP | not stated | Paid, 17 free | — |
| Velora | shadcn CLI | Tailwind v4 | Motion | "reduced-motion friendly" _(claim)_ | Free + Pro | — |
| Shadcn Space | copy-paste / CLI | Tailwind v4 | optional Motion | Radix / Base UI | Free + All-Access | — |
| Motion | npm | — | Motion (~43 kB full) | — | MIT + Motion+ | 34.5k |
| MUI | npm | Emotion runtime | CSS | strong | Free + MUI X | 99.3k |
| Mantine | npm | CSS Modules | CSS | good | Free | 31.9k |
| Chakra v3 | npm | Emotion runtime | CSS | Ark/Zag | Free + Pro | 40.7k |
| HeroUI v3 | npm | requires Tailwind v4 | CSS | React Aria | Free + Pro | 31.0k |
| Radix Primitives | npm, headless | — | — | strong | Free | 19.4k |
| Base UI | npm, headless | — | — | strong | Free | 11.2k |

## Pain points, with evidence

1. **Copy-paste can't be updated.** Upstream fixes never reach copied code. Vercel Academy says
   wrappers "effectively double the component design system size". A cmdk change broke shadcn
   Combobox for every adopter.
   [vercel.com/academy](https://vercel.com/academy/shadcn-ui/updating-and-maintaining-components),
   [dev.to](https://dev.to/this-is-learning/what-i-dont-like-about-shadcnui-3amf)
2. **Tailwind lock-in and churn.** The v4 migration silently broke registry components, and
   `tailwindcss-animate` was deprecated. HeroUI v3 requires Tailwind v4 and React 19.
   [21st.dev](https://21st.dev/blog/shadcn-tailwind-v4-migration),
   [heroui.com](https://heroui.com/docs/react/migration/full-migration)
3. **Motion libraries ignore reduced motion and focus.** Downstream projects keep retrofitting
   `prefers-reduced-motion` and focus handling.
   [fancy-ui #340](https://github.com/RamaHerbin/fancy-ui/pull/340),
   [escaro #96](https://github.com/Escaro-Labs/escaro/issues/96),
   [21st.dev on Cult UI](https://21st.dev/blog/cult-ui-components)
4. **Engine weight.** Motion's full component can't drop below ~43 kB. Developers replace it
   with CSS plus IntersectionObserver to save ~25 kB.
   [motion.dev](https://motion.dev/docs/react-reduce-bundle-size),
   [HN](https://news.ycombinator.com/item?id=32684156)
5. **RSC friction.** framer-motion throws `createContext` errors in Server Components, and
   runtime CSS-in-JS kits render client-only.
   [motion #2388](https://github.com/framer/motion/issues/2388),
   [Mantine](https://help.mantine.dev/q/server-components)
6. **Primitive churn.** Radix's pace slowed and shadcn switched its default to Base UI with
   breaking API changes.
   [openreplay](https://blog.openreplay.com/shadcn-ui-radix-base-ui-switch/)
7. **Sameness.** "They all look the same (purple gradient/shadcn)."
   [HN](https://news.ycombinator.com/item?id=45439298)
8. **Licensing traps.** React Bits uses Commons Clause; parts of coss ui are AGPL.
9. **Ecommerce is underserved.** No MIT npm package ships a polished product card, cart drawer
   and SKU-aware variant picker together. Shadcn Space has nine copy-paste ecommerce blocks.
   [shadcnspace.com](https://shadcnspace.com/)

## How kitgrid answers each gap

| Gap | kitgrid decision |
|---|---|
| Can't update copied code | Versioned npm package with per-component subpath exports (`kitgrid/<name>`) |
| Tailwind lock-in | Precompiled CSS in `@layer kg`, with an optional Tailwind v4 preset |
| Reduced motion ignored | A motion contract enforced by tokens (durations collapse) and a live `useReducedMotion` |
| Engine weight | No animation dependency: CSS `linear()` springs, WAAPI, and a 1 kB rAF spring |
| RSC friction | `"use client"` only on interactive modules; presentational components are server-safe |
| Primitive churn | Own primitives on platform APIs: `<dialog>`, the Popover API top layer, native inputs |
| Sameness | Token system with one-variable rebranding, scoped themes, density and radius scales |
| Licensing | MIT |
| Ecommerce | Price, rating, variant picker (SKU-aware), quantity stepper, cart, gallery, countdown… |

## Risks and counter-arguments

- **Building primitives in-house costs more maintenance** than wrapping Base UI. This is
  mitigated by leaning on platform features (native dialog, popover, radios) and by behaviour
  tests for every keyboard map.
- **Some teams want to own the source** (the shadcn argument). A shadcn-registry "eject" per
  component is a sensible follow-up, because the CSS-plus-TSX folder layout already maps 1:1.
- **Popover API and `linear()` need 2023+ browsers.** The CSS build targets Chrome/Edge 111,
  Firefox 113 and Safari 16.4, and `Layer` falls back to `position: fixed`.

## Recommendation

Ship kitgrid as an MIT npm package. Lead the marketing with three proofs that competitors
can't show side by side: `npm update` works, the reduced-motion toggle in the playground works
on every component, and the storefront demo is built entirely from the kit.
