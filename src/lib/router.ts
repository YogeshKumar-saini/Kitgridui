"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export type Route =
  | { page: "home" }
  | { page: "gallery"; category?: string }
  | { page: "component"; id: string; full?: boolean; props?: string }
  | { page: "storefront" }
  | { page: "theming" }
  | { page: "kit"; ids?: string[] }
  | { page: "pledge" }
  | { page: "not-found" }

export const parseRoute = (pathname: string, query: URLSearchParams): Route => {
  const [, section, id, extra] = pathname.split("/")
  if (extra) return { page: "not-found" }
  if (section === "components" && id)
    return {
      page: "component",
      id,
      full: query.has("full") || undefined,
      props: query.get("props") ?? undefined,
    }
  if (section === "components")
    return { page: "gallery", category: query.get("category") ?? undefined }
  if (section === "storefront" && !id) return { page: "storefront" }
  if (section === "theming" && !id) return { page: "theming" }
  if (section === "pledge" && !id) return { page: "pledge" }
  if (section === "kit" && !id)
    return { page: "kit", ids: query.get("c")?.split(",").filter(Boolean) }
  if (!section) return { page: "home" }
  return { page: "not-found" }
}

export const useRoute = (): Route => {
  const pathname = usePathname()
  const query = useSearchParams()
  return parseRoute(pathname, new URLSearchParams(query.toString()))
}

export const href = (route: Route): string => {
  switch (route.page) {
    case "component": {
      const query = new URLSearchParams()
      if (route.full) query.set("full", "")
      if (route.props) query.set("props", route.props)
      const search = query.toString().replace(/^full=(&|$)/, "full$1")
      return `/components/${route.id}${search ? `?${search}` : ""}`
    }
    case "gallery":
      return route.category ? `/components?category=${route.category}` : "/components"
    case "storefront":
      return "/storefront"
    case "theming":
      return "/theming"
    case "pledge":
      return "/pledge"
    case "kit":
      return route.ids?.length ? `/kit?c=${route.ids.join(",")}` : "/kit"
    default:
      return "/"
  }
}

/** Replaces the URL without adding a history entry, for filters that shouldn't pile up. */
export const useReplaceRoute = () => {
  const router = useRouter()
  return useCallback(
    (route: Route) => router.replace(href(route), { scroll: false }),
    [router],
  )
}
