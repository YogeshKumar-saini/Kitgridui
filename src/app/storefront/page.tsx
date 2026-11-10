import type { Metadata } from "next"
import { Storefront } from "@/features/storefront/storefront"

export const metadata: Metadata = { title: "Storefront" }

export default function StorefrontPage() {
  return <Storefront />
}
