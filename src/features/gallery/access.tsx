import { Check } from "lucide-react"
import type { Demo } from "@/features/demos/registry"
import proofData from "@/lib/generated/proof.json"

interface Proof {
  tests: number
  gzip: number
  motion: string
  tailwind: boolean
}

const proof: Record<string, Proof | undefined> = proofData

export const proofFor = (id: string) => proof[id]

const motionText: Record<string, string> = {
  none: "No motion",
  "respects-reduced": "Respects reduced motion",
  unchecked: "Reduced motion not verified yet",
}

const facts = (demo: Demo) => {
  const record = proofFor(demo.id)
  const rows: { label: string; value: string }[] = []
  if (record) {
    rows.push({
      label: "Tests",
      value:
        record.tests > 0
          ? `Covered by ${record.tests} test${record.tests === 1 ? "" : "s"}`
          : "No tests found yet",
    })
    if (record.gzip > 0)
      rows.push({
        label: "Size",
        value: `${(record.gzip / 1024).toFixed(1)} kB gzipped`,
      })
    rows.push({
      label: "Motion",
      value: motionText[record.motion] ?? "Reduced motion not verified yet",
    })
    if (record.tailwind)
      rows.push({ label: "Styling", value: "Paper Layers, Tailwind source" })
  }
  rows.push({
    label: "Rendering",
    value: demo.serverSafe ? "Server-safe, no “use client”" : "Client component",
  })
  rows.push({
    label: "Dependencies",
    value: demo.peers?.length
      ? `0 runtime dependencies, peer: ${demo.peers.join(", ")}`
      : "0 runtime dependencies",
  })
  if (!record)
    rows.push({
      label: "Not measured",
      value: "Tests, size and motion aren't generated for this entry yet",
    })
  return rows
}

export const AccessSheet = ({ demo }: { demo: Demo }) => {
  const notes = demo.accessibility ?? []
  return (
    <div className="grid gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="rounded-kg-xl border-2 border-kg-ink bg-kg-surface p-5">
        <h3 className="font-display text-lg font-extrabold tracking-tight">
          Keyboard and screen reader
        </h3>
        {notes.length > 0 ? (
          <ul className="mt-3 grid gap-2.5">
            {notes.map((line) => (
              <li key={line} className="flex gap-3 text-pretty">
                <Check
                  aria-hidden
                  className="mt-0.5 size-5 shrink-0 rounded-full border-2 border-kg-ink bg-kg-paper-sage p-0.5"
                />
                {line}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-kg-fg-muted">
            No notes written for this component yet.
          </p>
        )}
      </div>
      <dl className="grid content-start overflow-hidden rounded-kg-xl border-2 border-kg-ink bg-kg-surface">
        {facts(demo).map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 border-b-2 border-kg-ink px-5 py-3 last:border-b-0"
          >
            <dt className="text-kg-sm font-semibold text-kg-fg-muted">{row.label}</dt>
            <dd className="font-semibold">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
