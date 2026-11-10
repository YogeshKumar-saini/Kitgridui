"use client"

import { TooltipProvider } from "kitgrid"
import { type ReactNode, useEffect } from "react"
import { demoById } from "@/features/demos/catalog"
import { KitTray } from "@/features/kit/kit-tray"
import { type Route, useRoute } from "@/lib/router"
import { applyStoredTheme } from "@/lib/theme"
import { Topbar } from "./topbar"

const titleFor = (route: Route) => {
  if (route.page === "component") {
    const demo = demoById.get(route.id)
    return demo ? `${demo.name} · kitgrid` : "Not found · kitgrid"
  }
  if (route.page === "gallery") return "Components · kitgrid"
  if (route.page === "theming") return "Theming · kitgrid"
  if (route.page === "kit") return "Kit · kitgrid"
  if (route.page === "storefront") return "Storefront · kitgrid"
  if (route.page === "pledge") return "The MIT pledge · kitgrid"
  if (route.page === "not-found") return "Not found · kitgrid"
  return "kitgrid: build in layers"
}

/** Persistent chrome (top bar, kit tray) around every route's page content. */
export const AppShell = ({ children }: { children: ReactNode }) => {
  const route = useRoute()
  const routeKey = route.page === "component" ? route.id : route.page

  useEffect(() => {
    window.scrollTo({ top: 0 })
    document.title = titleFor(route)
    // Keyed on route identity: query changes (filters) keep scroll and title.
  }, [routeKey])

  useEffect(() => {
    applyStoredTheme()
  }, [])

  // The standalone preview (?full) renders the demo alone, without chrome.
  if (route.page === "component" && route.full)
    return <TooltipProvider>{children}</TooltipProvider>

  return (
    <TooltipProvider>
      <div className="min-h-dvh">
        <Topbar route={route} />
        <main
          className="mx-auto w-full max-w-[80rem] px-3 pt-8 pb-24 sm:px-5"
          data-page={route.page}
        >
          {children}
        </main>
        {route.page !== "kit" && <KitTray />}
      </div>
    </TooltipProvider>
  )
}
