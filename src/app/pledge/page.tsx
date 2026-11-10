import type { Metadata } from "next"
import { Pledge } from "@/features/pledge/pledge"

export const metadata: Metadata = { title: "The MIT pledge" }

export default function PledgePage() {
  return <Pledge />
}
