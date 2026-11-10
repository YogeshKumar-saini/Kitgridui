"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AddToCartButton,
  AnnouncementBar,
  Badge,
  Breadcrumb,
  Button,
  CartButton,
  CartDrawer,
  CartProvider,
  Countdown,
  CouponInput,
  DeliveryEstimate,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  EmptyState,
  type FilterChipOption,
  FilterChips,
  Marquee,
  Price,
  PriceRangeSlider,
  type PriceRangeSliderValue,
  ProductCard,
  ProductGallery,
  QuantityStepper,
  QuickView,
  Rating,
  Reveal,
  ReviewSummary,
  Select,
  StockIndicator,
  Switch,
  TextHighlight,
  Toaster,
  TextReveal,
  toCartItem,
  toast,
  useCart,
  useConfetti,
  useFlyToCart,
  useProductVariant,
  VariantPicker,
  WishlistButton,
  withVariantAvailability,
} from "kitgrid"
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Leaf,
  Recycle,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Timer,
  Truck,
  Wrench,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import {
  type CatalogCategory,
  type CatalogProduct,
  catalog,
  categoryLabels,
  fromPrice,
  fromPricing,
  swatchesOf,
  totalStock,
} from "@/lib/data/catalog"

const FREE_SHIPPING = 150
const PRICE_MIN = 0
const PRICE_MAX = 300
const BUCKETS = 12

type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "new"

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "new", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
]

const sorters: Record<SortKey, (a: CatalogProduct, b: CatalogProduct) => number> = {
  featured: (a, b) => b.featured - a.featured,
  new: (a, b) =>
    Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) || b.featured - a.featured,
  "price-asc": (a, b) => fromPrice(a) - fromPrice(b),
  "price-desc": (a, b) => fromPrice(b) - fromPrice(a),
  rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
}

const histogram = Array.from({ length: BUCKETS }, (_, index) => {
  const width = (PRICE_MAX - PRICE_MIN) / BUCKETS
  return catalog.filter((product) => {
    const price = fromPrice(product)
    return price >= PRICE_MIN + index * width && price < PRICE_MIN + (index + 1) * width
  }).length
})

const values = [
  { icon: <RotateCcw />, label: "Free 60-day returns" },
  { icon: <Leaf />, label: "Carbon-neutral shipping" },
  { icon: <Wrench />, label: "Repairs for life" },
  { icon: <Recycle />, label: "Recycled packaging" },
  { icon: <BadgeCheck />, label: "B Corp certified" },
  { icon: <Truck />, label: "Ships in 24 hours" },
]

const reviews = [
  {
    id: 1,
    name: "Maren Kowalski",
    location: "Hamburg",
    rating: 5,
    date: "2026-09-14",
    title: "Softer every wash",
    body: "Boxy without being sloppy. Softens fast.",
  },
  {
    id: 2,
    name: "Daniel Okafor",
    location: "Leeds",
    rating: 4,
    date: "2026-08-30",
    title: "Runs a touch large",
    body: "Size down if you are between sizes.",
  },
  {
    id: 3,
    name: "Priya Sundaram",
    location: "Pune",
    rating: 5,
    date: "2026-08-02",
    title: "The ecru is perfect",
    body: "Warm off-white, never stark.",
  },
  {
    id: 4,
    name: "Tom Whitcombe",
    location: "Portland, OR",
    rating: 3,
    date: "2026-07-21",
    title: "Lovely but wrinkles",
    body: "Creases fast, steams out quickly.",
  },
]

const distribution = { 5: 318, 4: 64, 3: 18, 2: 7, 1: 5 }

const footerLinks = [
  { title: "Shop", links: ["New in", "Clothing", "Home", "Gift cards"] },
  { title: "Help", links: ["Shipping", "Returns", "Repairs", "Size guide"] },
  { title: "Nordwell", links: ["Our workshops", "Journal", "Stockists"] },
]

const sheet = "rounded-kg-xl border-2 border-kg-ink shadow-kg-md"
const h2 =
  "font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl"
const navLink =
  "rounded-full px-3 py-1.5 text-sm font-semibold text-kg-fg-muted transition-colors duration-(--kg-duration-fast) hover:bg-kg-muted hover:text-kg-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring"

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
})

const fakeCoupon = async (code: string) => {
  await new Promise((resolve) => setTimeout(resolve, 700))
  return code === "WELCOME10"
    ? { ok: true, message: "10% off applied at checkout" }
    : { ok: false, message: "Try WELCOME10" }
}

/* Celebrate the moment free shipping unlocks -------------------------------- */

const FreeShippingCelebration = () => {
  const { subtotal, isOpen } = useCart()
  const fire = useConfetti()
  const previous = useRef<number | null>(null)
  useEffect(() => {
    const before = previous.current
    previous.current = subtotal
    if (before === null || before >= FREE_SHIPPING || subtotal < FREE_SHIPPING) return
    const origin = isOpen
      ? document.querySelector(".kg-cart-drawer .kg-free-shipping-progress")
      : document.querySelector("[data-cart-target]")
    void fire(origin ?? undefined, { particleCount: 90, spread: 70 })
    toast.success("You've unlocked free shipping")
  }, [subtotal, isOpen, fire])
  return null
}

/* Filters --------------------------------------------------------------------- */

interface Filters {
  categories: CatalogCategory[]
  price: PriceRangeSliderValue
  inStock: boolean
}

const FilterPanel = ({
  filters,
  onChange,
  counts,
}: {
  filters: Filters
  onChange: (filters: Filters) => void
  counts: Record<CatalogCategory, number>
}) => {
  const options: FilterChipOption<CatalogCategory>[] = (
    Object.keys(categoryLabels) as CatalogCategory[]
  ).map((value) => ({
    value,
    label: categoryLabels[value],
    count: counts[value],
    disabled: counts[value] === 0,
  }))
  return (
    <div className="grid gap-7">
      <FilterChips
        label="Category"
        options={options}
        value={filters.categories}
        onValueChange={(categories) => onChange({ ...filters, categories })}
        clearable
        size="sm"
      />
      <PriceRangeSlider
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={5}
        histogram={histogram}
        value={filters.price}
        onValueChange={(price) => onChange({ ...filters, price })}
      />
      <Switch
        label="In stock only"
        checked={filters.inStock}
        onCheckedChange={(inStock) => onChange({ ...filters, inStock })}
      />
    </div>
  )
}

/* Collection ------------------------------------------------------------------ */

const Collection = ({
  onQuickView,
}: {
  onQuickView: (product: CatalogProduct) => void
}) => {
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    price: [PRICE_MIN, PRICE_MAX],
    inStock: false,
  })
  const [sort, setSort] = useState<SortKey>("featured")
  const [wishlist, setWishlist] = useState<Set<string>>(() => new Set(["merino-crew"]))
  const [filtersOpen, setFiltersOpen] = useState(false)
  const cards = useRef(new Map<string, HTMLElement>())
  const fly = useFlyToCart()
  const { addItem } = useCart()

  const matchesPriceAndStock = (product: CatalogProduct) => {
    const price = fromPrice(product)
    return (
      price >= filters.price[0] &&
      price <= filters.price[1] &&
      (!filters.inStock || totalStock(product) > 0)
    )
  }

  const counts = Object.fromEntries(
    (Object.keys(categoryLabels) as CatalogCategory[]).map((category) => [
      category,
      catalog.filter(
        (product) => product.category === category && matchesPriceAndStock(product),
      ).length,
    ]),
  ) as Record<CatalogCategory, number>

  const results = catalog
    .filter(
      (product) =>
        matchesPriceAndStock(product) &&
        (filters.categories.length === 0 ||
          filters.categories.includes(product.category)),
    )
    .sort(sorters[sort])

  const reset = () =>
    setFilters({ categories: [], price: [PRICE_MIN, PRICE_MAX], inStock: false })

  const quickAdd = async (product: CatalogProduct) => {
    const variant = product.variants.find((entry) => entry.stock > 0)
    if (!variant) return
    // Stands in for the network round-trip of a real cart API.
    await new Promise((resolve) => setTimeout(resolve, 450))
    addItem(toCartItem(product, variant))
    void fly(cards.current.get(product.id)?.querySelector("img") ?? null)
  }

  const activeCount =
    filters.categories.length +
    (filters.inStock ? 1 : 0) +
    (filters.price[0] !== PRICE_MIN || filters.price[1] !== PRICE_MAX ? 1 : 0)

  return (
    <section
      className="scroll-mt-44 pt-20"
      id="shop"
      aria-labelledby="sf-collection-title"
    >
      <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <h2 id="sf-collection-title" className={h2}>
          Autumn, in ten pieces
        </h2>
        <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
          <Button
            className="lg:hidden"
            variant="outline"
            size="sm"
            leading={<SlidersHorizontal />}
            onClick={() => setFiltersOpen(true)}
          >
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </Button>
          <p
            className="hidden font-mono text-sm whitespace-nowrap text-kg-fg-muted tabular-nums sm:block"
            aria-live="polite"
          >
            {results.length} {results.length === 1 ? "product" : "products"}
          </p>
          <Select
            aria-label="Sort by"
            size="sm"
            options={sortOptions}
            value={sort}
            onValueChange={(value) => setSort(value as SortKey)}
          />
        </div>
      </header>

      <div className="grid items-start gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside
          className={`${sheet} sticky top-44 hidden bg-kg-surface p-5 lg:block`}
          aria-label="Filters"
        >
          <FilterPanel filters={filters} onChange={setFilters} counts={counts} />
        </aside>

        {results.length > 0 ? (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] sm:gap-x-5 sm:gap-y-7">
            {results.map((product, index) => {
              const soldOut = totalStock(product) === 0
              const hover =
                product.hoverImage !== undefined
                  ? product.images[product.hoverImage]
                  : undefined
              return (
                <li
                  key={product.id}
                  className="rounded-kg-xl border-2 border-kg-ink bg-kg-surface p-2 pb-3.5 shadow-kg-sm transition-[translate,box-shadow] duration-(--kg-duration-fast) ease-kg-out hover:-translate-px hover:shadow-kg-md sm:p-2.5 sm:pb-4"
                >
                  <ProductCard
                    className="[--_radius:var(--kg-radius-lg)]"
                    ref={(node) => {
                      if (node) cards.current.set(product.id, node)
                      else cards.current.delete(product.id)
                    }}
                    title={product.title}
                    vendor={product.vendor}
                    href="#sf-product"
                    image={product.images[0]}
                    hoverImage={hover}
                    price={fromPricing(product).price}
                    compareAt={fromPricing(product).compareAt}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    swatches={swatchesOf(product)}
                    badges={product.isNew ? [{ label: "New", tone: "accent" }] : []}
                    soldOut={soldOut}
                    priority={index < 3}
                    wishlisted={wishlist.has(product.id)}
                    onWishlistChange={(saved) =>
                      setWishlist((current) => {
                        const next = new Set(current)
                        if (saved) next.add(product.id)
                        else next.delete(product.id)
                        return next
                      })
                    }
                    onQuickAdd={
                      product.options.length <= 1 && !soldOut
                        ? () => quickAdd(product)
                        : undefined
                    }
                    onQuickView={() => onQuickView(product)}
                  />
                </li>
              )
            })}
          </ul>
        ) : (
          <EmptyState
            className={`${sheet} self-stretch bg-kg-surface`}
            icon={<Search />}
            title="Nothing matches those filters"
            description="Widen the filters."
            actions={<Button onClick={reset}>Clear all filters</Button>}
          />
        )}
      </div>

      <Drawer open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DrawerContent side="bottom" size="lg">
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <FilterPanel filters={filters} onChange={setFilters} counts={counts} />
          </DrawerBody>
          <DrawerFooter>
            <Button variant="ghost" onClick={reset}>
              Clear all
            </Button>
            <Button onClick={() => setFiltersOpen(false)}>
              Show {results.length} products
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </section>
  )
}

/* Product detail -------------------------------------------------------------- */

const featured = catalog[0] as CatalogProduct

const ProductDetail = () => {
  const product = featured
  const state = useProductVariant(product)
  const { variant } = state
  const [quantity, setQuantity] = useState(1)
  const [image, setImage] = useState(0)
  const [saved, setSaved] = useState(false)
  const [dealEndsAt] = useState(
    () => Date.now() + (2 * 24 + 5) * 3_600_000 + 17 * 60_000,
  )
  const gallery = useRef<HTMLDivElement>(null)
  const fly = useFlyToCart()
  const { addItem } = useCart()

  useEffect(() => {
    if (variant?.image !== undefined) setImage(variant.image)
    if (variant) setQuantity((current) => Math.min(current, Math.max(variant.stock, 1)))
  }, [variant])

  const add = async () => {
    await new Promise((resolve) => setTimeout(resolve, 550))
    addItem(toCartItem(product, variant), quantity)
    void fly(gallery.current?.querySelector("[data-active] img") ?? null)
  }

  return (
    <section
      className="scroll-mt-44 pt-20"
      id="sf-product"
      aria-labelledby="sf-product-title"
    >
      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/storefront" },
          { label: "Tops", href: "#shop" },
          { label: product.title },
        ]}
      />
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
        <div ref={gallery} className="lg:sticky lg:top-44">
          <ProductGallery
            images={product.images}
            index={image}
            onIndexChange={setImage}
            thumbnails="vertical"
            labels={{ region: `${product.title} images` }}
          />
        </div>

        <div className={`${sheet} grid gap-5 bg-kg-surface p-5 sm:p-7`}>
          <div className="grid gap-2">
            <p className="text-sm font-semibold text-kg-fg-muted">{product.vendor}</p>
            <h2
              id="sf-product-title"
              className="font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl"
            >
              {product.title}
            </h2>
            <Rating
              value={product.rating}
              count={product.reviewCount}
              href="#sf-reviews"
              showValue
              size="sm"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-dashed border-kg-border pb-5">
            <Price
              amount={state.price}
              compareAt={state.compareAt}
              size="xl"
              superscript
            />
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-kg-ink bg-kg-paper-butter px-3 py-1 text-sm text-kg-fg [&_.kg-countdown]:font-semibold">
              <span className="inline-flex items-center gap-1.5 [&_svg]:size-4">
                <Timer aria-hidden="true" /> Sale price for
              </span>
              <Countdown
                endsAt={dealEndsAt}
                variant="inline"
                size="sm"
                labels={{ prefix: "" }}
              />
            </div>
          </div>

          {product.options.map((option) => (
            <VariantPicker
              key={option.name}
              label={option.name}
              type={option.type ?? "chip"}
              options={withVariantAvailability(
                option.values,
                state.availability[option.name],
              )}
              value={state.selection[option.name] ?? null}
              onValueChange={(value) => state.select(option.name, value)}
              allowUnavailable={option.type === "swatch"}
              columns={option.type === "swatch" ? undefined : 5}
            />
          ))}

          {variant && (
            <StockIndicator quantity={variant.stock} lowStockThreshold={5} showBar />
          )}

          <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
            <QuantityStepper
              label={product.title}
              value={quantity}
              onValueChange={setQuantity}
              max={Math.max(variant?.stock ?? 1, 1)}
              disabled={!variant || variant.stock === 0}
              size="lg"
            />
            <AddToCartButton
              className="order-3 basis-full sm:order-none sm:flex-1 sm:basis-auto"
              soldOut={!variant || variant.stock === 0}
              onAdd={add}
            />
            <WishlistButton
              variant="floating"
              size="lg"
              pressed={saved}
              onPressedChange={setSaved}
              labels={{ label: `Save ${product.title}` }}
            />
          </div>

          <DeliveryEstimate minDays={2} maxDays={4} cutoff="15:00" variant="detailed" />

          <Accordion
            type="multiple"
            defaultValue={["details"]}
            className="[&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5"
          >
            <AccordionItem value="details">
              <AccordionTrigger>Details & fit</AccordionTrigger>
              <AccordionContent>
                <p>{product.description}</p>
                <ul>
                  <li>Relaxed, boxy fit. Size down for a closer cut</li>
                  <li>Model is 185 cm and wears M</li>
                  <li>100% European flax linen, 190 gsm</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="care">
              <AccordionTrigger>Materials & care</AccordionTrigger>
              <AccordionContent>
                Machine wash cold on a gentle cycle and line dry. The linen softens with
                every wash; a quick steam lifts the creases.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping & returns</AccordionTrigger>
              <AccordionContent>
                Free carbon-neutral shipping over $150. Free returns and exchanges
                within 60 days. Print the label from your order page.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  )
}

/* Reviews --------------------------------------------------------------------- */

const Reviews = () => {
  const [filter, setFilter] = useState<number | null>(null)
  const shown =
    filter === null ? reviews : reviews.filter((review) => review.rating === filter)
  return (
    <section
      className="scroll-mt-44 pt-20"
      id="sf-reviews"
      aria-labelledby="sf-reviews-title"
    >
      <h2 id="sf-reviews-title" className={h2}>
        412 reviews, mostly about the linen
      </h2>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
        <ReviewSummary
          className={`${sheet} bg-kg-surface p-5 sm:p-6`}
          average={4.8}
          count={412}
          distribution={distribution}
          filter={filter}
          onFilter={setFilter}
          onWriteReview={() => toast("Thanks! Reviews open once your order arrives.")}
        />
        <ul className="grid gap-4" aria-live="polite">
          {shown.length === 0 && (
            <li
              className={`${sheet} border-dashed bg-kg-surface p-5 text-kg-fg-muted shadow-none`}
            >
              No {filter}-star reviews on this page yet.
            </li>
          )}
          {shown.map((review) => (
            <li key={review.id} className={`${sheet} grid gap-2 bg-kg-surface p-5`}>
              <div className="flex items-center justify-between gap-4">
                <Rating value={review.rating} size="sm" />
                <time
                  dateTime={review.date}
                  className="font-mono text-xs text-kg-fg-muted tabular-nums"
                >
                  {dateFormat.format(new Date(review.date))}
                </time>
              </div>
              <p className="font-display text-lg font-bold">{review.title}</p>
              <p className="leading-relaxed text-kg-fg-muted">{review.body}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm font-semibold">
                {review.name}
                <span className="font-normal text-kg-fg-muted">{review.location}</span>
                <Badge size="sm" tone="success">
                  Verified buyer
                </Badge>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* Page -------------------------------------------------------------------------- */

const Shop = () => {
  const [quickProduct, setQuickProduct] = useState<CatalogProduct | null>(null)
  const [quickOpen, setQuickOpen] = useState(false)
  const { open } = useCart()
  const heroProduct = catalog[1]
  const heroImage = heroProduct?.images[0]

  return (
    <div className="flex flex-col">
      <AnnouncementBar
        className="rounded-kg-xl border-2 border-kg-ink"
        messages={[
          "Free carbon-neutral shipping on orders over $150",
          <>
            The autumn collection is here. <a href="#shop">Shop now</a>
          </>,
          "Free returns for 60 days. Repairs for life.",
        ]}
        dismissible
      />

      <header
        className={`${sheet} z-30 mt-4 grid h-16 grid-cols-[1fr_auto] items-center gap-4 bg-kg-surface pr-2 pl-5 shadow-kg-sm md:sticky md:top-24 md:grid-cols-[1fr_auto_1fr]`}
      >
        <a
          className="justify-self-start rounded-kg-sm font-display text-xl font-extrabold tracking-tight uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kg-ring"
          href="/storefront"
          aria-label="Nordwell home"
        >
          Nordwell
        </a>
        <nav className="hidden gap-1 md:flex" aria-label="Shop">
          {["New in", "Clothing", "Home"].map((label) => (
            <a key={label} href="#shop" className={navLink}>
              {label}
            </a>
          ))}
          <a href="#sf-reviews" className={navLink}>
            Journal
          </a>
        </nav>
        <div className="flex justify-self-end">
          <CartButton />
        </div>
      </header>

      <section
        className={`${sheet} mt-4 grid overflow-hidden bg-kg-surface shadow-kg-lg md:min-h-[32rem] md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]`}
        aria-labelledby="sf-hero-title"
      >
        <div className="grid content-center justify-items-start gap-5 p-6 sm:p-10 lg:p-14">
          <h1
            id="sf-hero-title"
            className="font-display text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.95] font-extrabold tracking-tight text-balance"
          >
            <TextReveal as="span" trigger="mount">
              Built for the
            </TextReveal>{" "}
            <TextHighlight
              as="span"
              variant="underline"
              trigger="mount"
              delay={700}
              color="var(--kg-paper-butter)"
            >
              <TextReveal as="span" trigger="mount" delay={180}>
                long way round.
              </TextReveal>
            </TextHighlight>
          </h1>
          <p className="max-w-md text-lg text-pretty text-kg-fg-muted">
            Linen, merino and leather. Repairs free for life.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button asChild size="lg" trailing={<ArrowRight />}>
              <a href="#shop">Shop autumn</a>
            </Button>
            <Button variant="outline" size="lg" onClick={open}>
              View cart
            </Button>
          </div>
          <p className="mt-2 hidden items-center gap-2 text-sm text-kg-fg-muted sm:flex">
            <span className="rounded-full border-2 border-kg-ink bg-kg-paper-butter px-2 py-0.5 font-mono font-bold text-kg-fg">
              4.8
            </span>
            from 3,912 reviews
          </p>
        </div>
        {heroImage && heroProduct && (
          <Reveal
            className="relative order-first aspect-[16/11] border-b-2 border-kg-ink bg-kg-paper-sage md:order-none md:aspect-auto md:border-b-0 md:border-l-2"
            variant="fade"
          >
            <img
              className="absolute inset-0 size-full object-cover object-[50%_22%]"
              src={heroImage.src}
              alt={heroImage.alt}
              width={heroImage.width}
              height={heroImage.height}
              fetchPriority="high"
            />
            <a
              className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full border-2 border-kg-ink bg-kg-surface py-1.5 pr-4 pl-1.5 text-sm text-kg-fg shadow-kg-sm transition-[translate,box-shadow] duration-(--kg-duration-fast) ease-kg-out hover:-translate-px hover:shadow-kg-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring active:translate-x-0.5 active:translate-y-0.5 active:shadow-none sm:bottom-6 sm:left-6"
              href="#shop"
              onClick={(event) => {
                event.preventDefault()
                setQuickProduct(heroProduct)
                setQuickOpen(true)
              }}
            >
              <img
                className="size-10 rounded-full border-2 border-kg-ink object-cover"
                src={heroImage.thumbnail ?? heroImage.src}
                alt=""
              />
              <span className="grid leading-tight">
                <strong className="font-bold">{heroProduct.title}</strong>
                <span className="hidden text-kg-fg-muted sm:inline">
                  Marigold, ${fromPrice(heroProduct)}
                </span>
              </span>
              <ArrowUpRight aria-hidden="true" className="size-4 text-kg-fg-muted" />
            </a>
          </Reveal>
        )}
      </section>

      <Marquee
        className="mt-16 rounded-full border-2 border-kg-ink bg-kg-paper-sage py-3"
        speed={40}
        pauseOnHover
        fade
        gap="3rem"
      >
        {values.map((value) => (
          <span
            key={value.label}
            className="inline-flex items-center gap-2.5 text-sm font-semibold whitespace-nowrap text-kg-fg [&_svg]:size-4"
          >
            <span aria-hidden="true">{value.icon}</span>
            {value.label}
          </span>
        ))}
      </Marquee>

      <Collection
        onQuickView={(product) => {
          setQuickProduct(product)
          setQuickOpen(true)
        }}
      />
      <ProductDetail />
      <Reviews />

      <footer className="mt-20 grid grid-cols-2 gap-8 rounded-kg-2xl border-2 border-kg-ink bg-kg-accent p-8 text-kg-accent-fg shadow-[5px_5px_0_var(--kg-paper-sage)] sm:p-10 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div className="col-span-2 grid content-start gap-2 md:col-span-1">
          <span className="font-display text-2xl font-extrabold tracking-tight uppercase">
            Nordwell
          </span>
          <p className="max-w-xs text-sm opacity-85">Made slowly, mended for free.</p>
        </div>
        {footerLinks.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h3 className="mb-3 text-sm font-bold">{column.title}</h3>
            <ul className="grid gap-2">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href="#shop"
                    className="text-sm opacity-85 underline-offset-4 hover:underline hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </footer>

      <QuickView
        product={quickProduct}
        open={quickOpen}
        onOpenChange={setQuickOpen}
        closeOnAdd
        detailsHref="#sf-product"
      />
      <CartDrawer
        mobileSheet
        coupon={<CouponInput onApply={fakeCoupon} size="sm" />}
        onCheckout={() => toast.success("Demo store: no card needed.")}
      />
      <FreeShippingCelebration />
      <Toaster position="bottom-center" />
    </div>
  )
}

export const Storefront = () => (
  <CartProvider
    currency="USD"
    storageKey="kg-storefront-cart"
    freeShippingThreshold={FREE_SHIPPING}
  >
    <Shop />
  </CartProvider>
)
