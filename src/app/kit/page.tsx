import type { Metadata } from "next"
import { Kit } from "@/features/kit/kit"

export const metadata: Metadata = { title: "Kit" }

export default async function KitPage({ searchParams }: PageProps<"/kit">) {
  const { c } = await searchParams
  const ids = typeof c === "string" ? c.split(",").filter(Boolean) : undefined
  return <Kit ids={ids} />
}
