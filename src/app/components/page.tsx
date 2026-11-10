import type { Metadata } from "next"
import { Gallery } from "@/features/gallery/gallery"

export const metadata: Metadata = { title: "Components" }

export default async function ComponentsPage({
  searchParams,
}: PageProps<"/components">) {
  const { category } = await searchParams
  return <Gallery category={typeof category === "string" ? category : undefined} />
}
