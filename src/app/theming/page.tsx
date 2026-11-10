import type { Metadata } from "next"
import { Theming } from "@/features/theming/theming"

export const metadata: Metadata = { title: "Theming" }

export default function ThemingPage() {
  return <Theming />
}
