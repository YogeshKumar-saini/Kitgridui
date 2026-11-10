"use client"

import { Kbd, Tooltip } from "kitgrid"
import { Menu, Moon, Search, Sun, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { href, type Route } from "@/lib/router"
import { useColorMode } from "@/lib/theme"
import { GITHUB_URL, GitHubMark } from "./links"
import { Logo } from "./logo"
import { SearchPalette } from "./search-palette"

const NAV: { label: string; route: Route; section: Route["page"][] }[] = [
  { label: "Components", route: { page: "gallery" }, section: ["gallery", "component"] },
  { label: "Kit", route: { page: "kit" }, section: ["kit"] },
  { label: "Theming", route: { page: "theming" }, section: ["theming"] },
  { label: "Storefront", route: { page: "storefront" }, section: ["storefront"] },
  { label: "Pledge", route: { page: "pledge" }, section: ["pledge"] },
]

const tool =
  "grid size-10 place-items-center rounded-full text-kg-fg transition-colors duration-(--kg-duration-fast) hover:bg-kg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring [&_svg]:size-[1.15rem]"

export const ThemeToggle = () => {
  const { mode, toggle } = useColorMode()
  const label = mode === "dark" ? "Switch to light theme" : "Switch to dark theme"
  return (
    <Tooltip content={label}>
      <button
        type="button"
        className={tool}
        aria-label={label}
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          toggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
        }}
      >
        {mode === "dark" ? <Sun aria-hidden /> : <Moon aria-hidden />}
      </button>
    </Tooltip>
  )
}

const NavLinks = ({ route, onNavigate }: { route: Route; onNavigate?: () => void }) =>
  NAV.map((item) => {
    const current = item.section.includes(route.page)
    return (
      <Link
        key={item.label}
        href={href(item.route)}
        onClick={onNavigate}
        aria-current={current ? "page" : undefined}
        className="rounded-full px-3.5 py-2 font-semibold text-kg-fg-muted transition-colors duration-(--kg-duration-fast) hover:text-kg-fg aria-[current=page]:bg-kg-accent aria-[current=page]:text-kg-accent-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring"
      >
        {item.label}
      </Link>
    )
  })

export const Topbar = ({ route }: { route: Route }) => {
  const [searching, setSearching] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setSearching(true)
      }
      if (event.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
      <div className="mx-auto flex h-16 max-w-[80rem] items-center gap-2 rounded-kg-xl border-2 border-kg-ink bg-kg-surface pr-2 pl-4 shadow-kg-sm">
        <Link
          href="/"
          className="mr-2 flex items-center gap-2.5 rounded-kg-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kg-ring"
        >
          <Logo />
          <span className="font-display text-xl font-extrabold tracking-tight">kitgrid</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          <NavLinks route={route} />
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearching(true)}
            aria-label="Search components"
            aria-keyshortcuts="Control+K Meta+K"
            className="flex h-10 items-center gap-2 rounded-full border-2 border-kg-ink px-3 font-semibold transition-[translate,box-shadow] duration-(--kg-duration-fast) hover:-translate-px hover:shadow-kg-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring [&_svg]:size-4"
          >
            <Search aria-hidden />
            <span className="hidden sm:inline">Search</span>
            <Kbd keys={["mod", "k"]} separator={null} size="sm" className="hidden sm:inline-flex" />
          </button>
          <Tooltip content="Source on GitHub">
            <a
              className={tool}
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="kitgrid on GitHub"
            >
              <GitHubMark />
            </a>
          </Tooltip>
          <ThemeToggle />
          <button
            type="button"
            className={`${tool} lg:hidden`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="site-menu"
          aria-label="Main"
          className="mx-auto mt-2 flex max-w-[80rem] flex-col gap-1 rounded-kg-xl border-2 border-kg-ink bg-kg-surface p-2 shadow-kg-md lg:hidden"
        >
          <NavLinks route={route} onNavigate={() => setMenuOpen(false)} />
        </nav>
      )}

      <SearchPalette open={searching} onClose={() => setSearching(false)} />
    </header>
  )
}
