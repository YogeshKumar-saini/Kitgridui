import { type NextRequest, NextResponse } from "next/server"
import demoIds from "@/features/demos/ids.json"

const known = new Set(demoIds)

// The page streams under the layout's Suspense, too late to set a 404, so unknown ids are
// sent to an unmatched path here.
export function proxy(request: NextRequest) {
  const id = decodeURIComponent(request.nextUrl.pathname.slice("/components/".length))
  if (!known.has(id)) return NextResponse.rewrite(new URL("/_not-found", request.url))
}

export const config = { matcher: "/components/:id" }
