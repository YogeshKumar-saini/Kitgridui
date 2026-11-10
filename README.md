# Kitgridui

The Next.js showcase site for [kitgrid](../kitgridpackage/packages/kitgrid): every component, live, with props, code and a downloadable kit.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```

The site uses the published package `@yogeshsaini/kitgrid` (`"kitgrid": "npm:@yogeshsaini/kitgrid@^0.1.0"`).

| Path | |
| --- | --- |
| `src/app/` | Routes only (thin server files): `/`, `/components`, `/components/[id]`, `/kit`, `/theming`, `/storefront` |
| `src/features/home/` | Landing page |
| `src/features/gallery/` | Component gallery, component detail page, stage, controls, thumbnails |
| `src/features/demos/` | One file per component group (each exports `demos`), plus `catalog.ts` and `registry.ts` |
| `src/features/kit/` | Kit page, kit tray, selection and the Next.js zip export |
| `src/features/theming/` | Theme studio page |
| `src/features/storefront/` | Storefront showcase |
| `src/features/{docs,directory,templates,motion,icons,account}/` | Placeholders for later roadmap phases (README only) |
| `src/components/` | Site-wide UI: app shell, sidebar, topbar, search, logo, links, code block, not-found |
| `src/lib/` | Router helpers, theme state, shared sample data |
| `src/styles/` | `globals.css` |
| `docs/` | Design system (`DESIGN.md`) and research |
