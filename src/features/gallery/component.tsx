"use client"

import { demoById } from "@/features/demos/catalog"
import { notFound } from "next/navigation"
import { DemoPage, FullPreview } from "./demo-page"

/** One component's page: the full demo page, or the bare preview when `?full` is set. */
export const ComponentView = ({
  id,
  full,
  props,
}: {
  id: string
  full: boolean
  props?: string
}) => {
  const demo = demoById.get(id)
  if (!demo) notFound()
  return full ? <FullPreview demo={demo} props={props} /> : <DemoPage key={demo.id} demo={demo} />
}
