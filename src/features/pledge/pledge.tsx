"use client"

import { Button } from "kitgrid"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { GITHUB_URL } from "@/components/links"
import { href } from "@/lib/router"

const commitments = [
  {
    title: "MIT, forever",
    detail:
      "Every package and every component ships under MIT, now and in every release after.",
  },
  {
    title: "No paid tiers",
    detail:
      "No pro components and no premium pack. The free library is the whole library.",
  },
  {
    title: "No licence keys",
    detail: "Nothing to register, activate or renew. Install it and ship.",
  },
  {
    title: "No usage or revenue limits",
    detail: "A weekend project or a company of any size, the terms are the same.",
  },
  {
    title: "No telemetry",
    detail: "The packages never phone home. No tracking, no install pings.",
  },
  {
    title: "You own what you export",
    detail: "Kit and Studio export plain React you can keep, edit and take anywhere.",
  },
]

const papers = [
  "bg-kg-paper-sage",
  "bg-kg-paper-peach",
  "bg-kg-paper-sky",
  "bg-kg-paper-butter",
  "bg-kg-paper-rose",
  "bg-kg-paper-sage",
]

export const Pledge = () => (
  <article className="mx-auto flex max-w-[52rem] flex-col gap-14 pt-4 sm:gap-20 sm:pt-10">
    <header className="flex flex-col gap-6">
      <h1 className="font-display text-[clamp(3rem,8vw,5.75rem)] leading-[0.92] font-extrabold tracking-[-0.045em] text-balance">
        The MIT pledge
      </h1>
      <p className="max-w-[36rem] text-lg text-kg-fg-muted sm:text-xl">
        Kitgrid is MIT licensed and will stay that way. Here is what that means, in
        writing.
      </p>
    </header>

    <ol className="flex flex-col gap-4 sm:gap-5" aria-label="Commitments">
      {commitments.map((item, index) => (
        <li
          key={item.title}
          className="flex items-start gap-4 rounded-kg-2xl border-2 border-kg-ink bg-kg-surface p-5 shadow-kg-sm sm:gap-6 sm:p-7"
        >
          <span
            aria-hidden="true"
            className={`${papers[index]} grid size-12 shrink-0 place-items-center rounded-kg-lg border-2 border-kg-ink font-mono text-kg-base font-bold sm:size-14`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex flex-col gap-1 pt-1">
            <h2 className="font-display text-xl font-bold tracking-[-0.02em] sm:text-2xl">
              {item.title}
            </h2>
            <p className="text-kg-fg-muted">{item.detail}</p>
          </div>
        </li>
      ))}
    </ol>

    <section
      aria-labelledby="pledge-why"
      className="flex flex-col gap-4 rounded-kg-2xl border-2 border-kg-ink bg-kg-ink p-7 text-kg-accent-fg shadow-[6px_6px_0_var(--kg-paper-peach)] sm:p-10"
    >
      <h2
        id="pledge-why"
        className="font-display text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl"
      >
        Why write it down
      </h2>
      <p className="max-w-[40rem] text-lg leading-relaxed text-pretty">
        Licences across the ecosystem are tightening. Free libraries add keys, charge by
        revenue or ask for a logo, and builders keep your work on their platform. We
        think the code you build on should simply be yours.
      </p>
    </section>

    <div className="flex flex-wrap gap-3">
      <Button size="lg" asChild>
        <a href={`${GITHUB_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
          Read the LICENSE
          <ArrowUpRight />
        </a>
      </Button>
      <Button size="lg" variant="outline" asChild>
        <Link href={href({ page: "gallery" })}>
          Browse components
          <ArrowRight />
        </Link>
      </Button>
    </div>
  </article>
)
