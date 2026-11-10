"use client"

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardMedia,
  Price,
  Rating,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "kitgrid"
import { ArrowRight, ArrowUpRight, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { CopyButton } from "@/components/code-block"
import { GITHUB_URL, GitHubMark, NPM_URL } from "@/components/links"
import {
  activeCategories,
  categoryIndex,
  categorySlug,
  countFor,
  demos,
} from "@/features/demos/catalog"
import { catalog } from "@/lib/data/catalog"
import proof from "@/lib/generated/proof.json"
import { href } from "@/lib/router"

const records = Object.values(proof)
const totalTests = records.reduce((sum, record) => sum + record.tests, 0)
const totalKb = Math.round(records.reduce((sum, record) => sum + record.gzip, 0) / 1024)
const tailwindCount = records.filter((record) => record.tailwind).length

const stats = [
  {
    value: demos.length,
    label: "components",
    note: `${tailwindCount} rewritten in Tailwind`,
    paper: "bg-kg-paper-sage",
  },
  {
    value: totalTests.toLocaleString("en-US"),
    label: "tests",
    note: "Run on every change",
    paper: "bg-kg-paper-peach",
  },
  {
    value: `${totalKb.toLocaleString("en-US")} kB`,
    label: "gzipped in total",
    note: "Import one, ship one",
    paper: "bg-kg-paper-sky",
  },
  {
    value: 0,
    label: "runtime dependencies",
    note: "React is the only peer",
    paper: "bg-kg-paper-butter",
  },
]

const papers = [
  "bg-kg-paper-sage",
  "bg-kg-paper-peach",
  "bg-kg-paper-sky",
  "bg-kg-paper-butter",
  "bg-kg-paper-rose",
]

const tote = catalog.find((product) => product.id === "canvas-tote") ?? catalog[0]

const sheet = "rounded-kg-2xl border-2 border-kg-ink shadow-kg-md"
const nudge =
  "motion-safe:transition-[rotate,translate] motion-safe:duration-500 motion-safe:ease-kg-out"

const Fan = () => (
  <div
    className="group relative mx-auto h-[25rem] w-full max-w-[33rem] sm:h-[29rem]"
    aria-label="Live components"
    role="group"
  >
    <div
      aria-hidden="true"
      className={`${sheet} ${nudge} absolute inset-x-[8%] top-[6%] bottom-[4%] -rotate-6 bg-kg-paper-sage motion-safe:group-hover:-rotate-9`}
    />

    <div
      className={`${sheet} ${nudge} absolute top-[3%] right-0 z-20 w-[50%] rotate-[4deg] bg-kg-paper-sky p-3 sm:p-4 motion-safe:group-hover:translate-x-2 motion-safe:group-hover:-translate-y-2 motion-safe:group-hover:rotate-[6deg]`}
    >
      <Tabs defaultValue="details">
        <TabsList variant="pill" aria-label="Product info">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="care">Care</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="pt-2 text-kg-sm">
          16 oz waxed canvas.
        </TabsContent>
        <TabsContent value="care" className="pt-2 text-kg-sm">
          Wipe clean, rewax yearly.
        </TabsContent>
      </Tabs>
    </div>

    <div
      className={`${sheet} ${nudge} absolute right-[3%] bottom-[5%] z-20 flex w-[50%] -rotate-[3deg] flex-col gap-3 bg-kg-paper-peach p-3 sm:p-4 motion-safe:group-hover:translate-x-2 motion-safe:group-hover:translate-y-2 motion-safe:group-hover:-rotate-[5deg]`}
    >
      <Switch label="Gift wrap" defaultChecked size="sm" />
      <div className="flex flex-wrap gap-1.5">
        <Badge tone="sage" variant="solid">
          In stock
        </Badge>
        <Badge variant="outline">Free returns</Badge>
      </div>
    </div>

    {tote && (
      <Card
        padding="sm"
        className={`${nudge} absolute top-[8%] left-[3%] z-10 w-[56%] max-w-[18rem] -rotate-2 motion-safe:group-hover:-translate-x-1 motion-safe:group-hover:-rotate-3`}
      >
        <CardMedia ratio="4 / 3" inset>
          <img src={tote.images[0]?.src} alt={tote.images[0]?.alt ?? ""} />
        </CardMedia>
        <CardContent className="gap-1.5">
          <Rating value={tote.rating ?? 5} size="sm" />
          <p className="font-display font-bold leading-tight">{tote.title}</p>
          <Price amount={tote.price} size="sm" />
          <Button size="sm" fullWidth leading={<ShoppingBag />}>
            Add to bag
          </Button>
        </CardContent>
      </Card>
    )}
  </div>
)

const SectionTitle = ({ id, children }: { id: string; children: string }) => (
  <h2
    id={id}
    className="font-display text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl"
  >
    {children}
  </h2>
)

export const Home = () => (
  <article className="flex flex-col gap-20 sm:gap-28">
    <section
      aria-labelledby="home-title"
      className="grid items-center gap-12 pt-4 sm:pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10"
    >
      <div className="flex flex-col items-start gap-7">
        <h1
          id="home-title"
          className="font-display text-[clamp(3.6rem,10vw,7.25rem)] leading-[0.88] font-extrabold tracking-[-0.045em] text-balance"
        >
          Build in layers.
        </h1>
        <p className="max-w-[30rem] text-lg text-kg-fg-muted sm:text-xl">
          {demos.length} accessible React components. One install, nothing else to add.
        </p>
        <div className="flex items-center gap-1 rounded-full border-2 border-kg-ink bg-kg-surface py-1 pr-1 pl-5 shadow-kg-xs">
          <code className="bg-transparent p-0 font-mono text-kg-base">
            <span className="text-kg-fg-muted select-none">$ </span>npm i kitgrid
          </code>
          <CopyButton text="npm i kitgrid" label="Copy install command" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link href={href({ page: "gallery" })}>
              Browse components
              <ArrowRight />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href={href({ page: "pledge" })}>The MIT pledge</Link>
          </Button>
        </div>
      </div>
      <Fan />
    </section>

    <section
      aria-label="At a glance"
      className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${sheet} ${stat.paper} flex flex-col gap-1 p-5 shadow-kg-sm sm:p-6`}
        >
          <span className="font-display text-3xl font-extrabold tracking-[-0.03em] whitespace-nowrap tabular-nums sm:text-5xl">
            {stat.value}
          </span>
          <span className="font-semibold">{stat.label}</span>
          <span className="mt-auto pt-3 text-kg-sm text-kg-fg-muted">{stat.note}</span>
        </div>
      ))}
    </section>

    <section aria-labelledby="home-categories" className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle id="home-categories">Pick a stack.</SectionTitle>
        <Link
          href={href({ page: "gallery" })}
          className="inline-flex items-center gap-1 rounded-kg-md font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring"
        >
          All {demos.length} components
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {activeCategories.map((category, index) => (
          <li key={category}>
            <Link
              href={href({ page: "gallery", category: categorySlug(category) })}
              className={`${papers[index % papers.length]} flex h-full flex-col gap-5 rounded-kg-xl border-2 border-kg-ink p-4 shadow-kg-xs transition-[translate,box-shadow] duration-(--kg-duration-fast) ease-kg-out hover:-translate-y-0.5 hover:shadow-kg-md focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-kg-ring active:translate-y-0 active:shadow-none motion-reduce:transition-none sm:p-5`}
            >
              <span className="font-mono text-kg-xs text-kg-fg-muted">
                {categoryIndex(category)}
              </span>
              <span className="mt-auto flex flex-col gap-0.5">
                <span className="font-display text-lg leading-tight font-bold tracking-[-0.02em] sm:text-xl">
                  {category}
                </span>
                <span className="text-kg-sm text-kg-fg-muted tabular-nums">
                  {countFor(category)} components
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>

    <section
      aria-labelledby="home-pledge"
      className="flex flex-col items-start justify-between gap-6 rounded-kg-2xl border-2 border-kg-ink bg-kg-ink p-8 text-kg-accent-fg shadow-[6px_6px_0_var(--kg-paper-sage)] sm:p-12 md:flex-row md:items-center"
    >
      <h2
        id="home-pledge"
        className="max-w-[34rem] font-display text-3xl font-extrabold tracking-[-0.03em] text-balance sm:text-4xl"
      >
        Always MIT. No paid tiers, no licence keys.
      </h2>
      <Button size="lg" variant="outline" asChild>
        <Link href={href({ page: "pledge" })}>
          Read the pledge
          <ArrowRight />
        </Link>
      </Button>
    </section>

    <footer className="flex flex-col gap-4 rounded-kg-xl border-2 border-kg-ink bg-kg-surface px-6 py-5 text-kg-sm shadow-kg-xs sm:flex-row sm:items-center sm:justify-between">
      <p className="text-kg-fg-muted">
        <span className="font-display font-extrabold text-kg-fg">kitgrid</span>, MIT
        licensed. Free for everyone.
      </p>
      <nav
        aria-label="Project"
        className="flex flex-wrap gap-x-5 gap-y-2 font-semibold"
      >
        <a
          className="inline-flex items-center gap-1.5 rounded-kg-md hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring"
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
        >
          <GitHubMark className="size-4" />
          GitHub
        </a>
        <a
          className="inline-flex items-center gap-1 rounded-kg-md hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring"
          href={NPM_URL}
          target="_blank"
          rel="noreferrer"
        >
          npm
          <ArrowUpRight aria-hidden className="size-4" />
        </a>
        <Link
          className="rounded-kg-md hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring"
          href={href({ page: "pledge" })}
        >
          Pledge
        </Link>
      </nav>
    </footer>
  </article>
)
