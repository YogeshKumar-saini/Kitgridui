"use client"

import { Button } from "kitgrid"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { href } from "@/lib/router"

export const NotFound = () => (
  <section
    aria-labelledby="not-found-title"
    className="grid place-items-center py-10 sm:py-20"
  >
    <div className="relative w-full max-w-[34rem]">
      <div
        aria-hidden="true"
        className="absolute inset-0 rotate-[5deg] rounded-kg-2xl border-2 border-kg-ink bg-kg-paper-peach"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -rotate-3 rounded-kg-2xl border-2 border-kg-ink bg-kg-paper-sage"
      />
      <div className="relative flex flex-col items-start gap-5 rounded-kg-2xl border-2 border-kg-ink bg-kg-surface p-8 shadow-kg-md sm:p-10">
        <span className="font-mono text-kg-sm font-bold text-kg-fg-muted">404</span>
        <h1
          id="not-found-title"
          className="font-display text-4xl leading-[0.95] font-extrabold tracking-[-0.04em] text-balance sm:text-5xl"
        >
          This sheet is missing.
        </h1>
        <p className="text-lg text-kg-fg-muted">
          The page may have moved. Start again from here.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Button asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={href({ page: "gallery" })}>
              Components
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
)
