import {
  AddressForm,
  BackInStockForm,
  BundleBuilder,
  Button,
  CheckoutForm,
  CookieBanner,
  CurrencySelector,
  FeatureComparison,
  GiftCard,
  Input,
  LogoCloud,
  LoyaltyMeter,
  MiniCart,
  type MiniCartItem,
  NewsletterForm,
  OrderTracker,
  PaymentMethodSelector,
  PricingCard,
  PricingTable,
  type PricingTablePlan,
  PricingToggle,
  ProductBadge,
  ProductCompare,
  ProductTabs,
  RecentlyViewed,
  ReferralCard,
  ReviewCard,
  ReviewForm,
  ShipmentTimeline,
  SizeGuide,
  StickyAddToCart,
  StoreLocatorList,
  SubscriptionSelector,
  SwatchPicker,
  TestimonialCard,
  TrustBadges,
  UpsellCard,
} from "kitgrid"
import { Clock, CreditCard, Package, ShoppingBag, Truck, Wallet } from "lucide-react"
import { useState } from "react"
import { defineDemo, jsx, raw } from "./registry"
import { declare, indent } from "./commerce-code"

/* Shared data ------------------------------------------------------------- */

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
const delay = (ms: number) => raw(`() => new Promise((resolve) => setTimeout(resolve, ${ms}))`)

const plans: PricingTablePlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For a first store",
    monthly: 0,
    yearly: 0,
    cta: "Start free",
    features: ["1 store", "100 orders a month"],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For growing brands",
    monthly: 39,
    yearly: 31,
    highlighted: true,
    features: ["3 stores", "Unlimited orders"],
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "For high volume",
    monthly: 99,
    yearly: 79,
    features: ["10 stores", "Priority support"],
  },
]

const comparisonPlans = [
  { id: "starter", name: "Starter" },
  { id: "growth", name: "Growth", highlighted: true },
  { id: "scale", name: "Scale" },
]

const comparisonGroups = [
  {
    label: "Selling",
    rows: [
      { label: "Stores", values: { starter: "1", growth: "3", scale: "10" } },
      { label: "Gift cards", values: { starter: false, growth: true, scale: true } },
    ],
  },
  {
    label: "Support",
    rows: [{ label: "Priority", values: { starter: false, growth: false, scale: true } }],
  },
]

const miniCartItems: MiniCartItem[] = [
  { id: "overshirt", name: "Linen Overshirt", variant: "Sage / M", price: 98, quantity: 1 },
  { id: "tote", name: "Canvas Tote", price: 58, quantity: 2 },
]

const swatches = [
  { value: "sage", label: "Sage", color: "oklch(0.72 0.06 150)" },
  { value: "sand", label: "Sand", color: "oklch(0.86 0.045 80)" },
  { value: "ink", label: "Ink", color: "oklch(0.3 0.04 265)" },
  { value: "rust", label: "Rust", color: "oklch(0.55 0.13 45)", available: false },
]

const sizeColumns = [
  { key: "chest", label: "Chest" },
  { key: "length", label: "Length" },
]

const sizeRows = [
  { size: "S", values: { chest: [88, 93] as [number, number], length: 70 } },
  { size: "M", values: { chest: [96, 101] as [number, number], length: 72 } },
  { size: "L", values: { chest: [104, 109] as [number, number], length: 74 } },
]

const trackerSteps = [
  { id: "ordered", label: "Ordered", date: "Oct 20" },
  { id: "packed", label: "Packed", date: "Oct 21" },
  { id: "shipped", label: "Shipped", date: "Oct 22" },
  { id: "delivered", label: "Delivered" },
]

const shipmentEvents = [
  { id: "3", title: "Out for delivery", location: "Austin, TX", time: "Today, 08:12" },
  { id: "2", title: "Departed facility", location: "Dallas, TX", time: "Oct 23, 06:05" },
  { id: "1", title: "Label created", time: "Oct 22" },
]

const storeList = [
  { id: "soho", name: "SoHo", address: "120 Prince St", distance: 0.8, open: true, hours: "Closes 8 pm", stock: "in-stock" as const },
  { id: "chelsea", name: "Chelsea", address: "214 W 14th St", distance: 2.1, open: true, stock: "low-stock" as const },
  { id: "wburg", name: "Williamsburg", address: "88 N 6th St", distance: 4.6, open: false, stock: "out-of-stock" as const },
]

const loyaltyTiers = [
  { name: "Member", threshold: 0 },
  { name: "Silver", threshold: 1000 },
  { name: "Gold", threshold: 2500 },
]

const cookieCategories = [
  { id: "necessary", label: "Necessary", description: "Cart and checkout", required: true },
  { id: "analytics", label: "Analytics", description: "Anonymous usage" },
]

const bundleItems = [
  { id: "sneaker", name: "Court Sneaker", price: 145, anchor: true },
  { id: "tee", name: "Pocket Tee", price: 42 },
  { id: "tote", name: "Canvas Tote", price: 58 },
]

const recentItems = [
  { id: "overshirt", name: "Linen Overshirt", href: "/components/recently-viewed", price: 98 },
  { id: "crew", name: "Merino Crew", href: "/components/recently-viewed", price: 120 },
  { id: "tote", name: "Canvas Tote", href: "/components/recently-viewed", price: 58 },
  { id: "sneaker", name: "Court Sneaker", href: "/components/recently-viewed", price: 145 },
]

const compareAttributes = [
  { key: "material", label: "Material" },
  { key: "fit", label: "Fit" },
  { key: "returns", label: "Free returns" },
]

const compareProducts = [
  { id: "crew", name: "Merino Crew", price: 120, specs: { material: "Merino", fit: "Slim", returns: true } },
  { id: "hoodie", name: "Fleece Hoodie", price: 88, specs: { material: "Cotton", fit: "Relaxed", returns: true } },
]

const frequencies = [
  { value: "2w", label: "2 weeks" },
  { value: "4w", label: "4 weeks" },
  { value: "8w", label: "8 weeks" },
]

const shippingOptions = [
  { id: "standard", label: "Standard", detail: "3-5 days", price: 0 },
  { id: "express", label: "Express", detail: "1-2 days", price: 12 },
]

const simpleMethods = [
  { id: "card", label: "Card", description: "Visa, Mastercard, Amex" },
  { id: "wallet", label: "Wallet", description: "Express checkout" },
]

const CardFields = () => (
  <div style={{ display: "grid", gap: 8, gridTemplateColumns: "2fr 1fr 1fr" }}>
    <Input aria-label="Card number" placeholder="Card number" />
    <Input aria-label="Expiry" placeholder="MM / YY" />
    <Input aria-label="CVC" placeholder="CVC" />
  </div>
)

const paymentMethods = [
  { id: "card", label: "Card", description: "Visa, Mastercard, Amex", icon: <CreditCard />, content: <CardFields /> },
  { id: "wallet", label: "Wallet", description: "Express checkout", icon: <Wallet /> },
  { id: "later", label: "Pay in 4", description: "Interest-free", icon: <Clock /> },
]

const paymentMethodsCode = `const methods = [\n  {\n    id: "card",\n    label: "Card",\n    description: "Visa, Mastercard, Amex",\n    icon: <CreditCard />,\n    content: (\n      <div style={{ display: "grid", gap: 8, gridTemplateColumns: "2fr 1fr 1fr" }}>\n        <Input aria-label="Card number" placeholder="Card number" />\n        <Input aria-label="Expiry" placeholder="MM / YY" />\n        <Input aria-label="CVC" placeholder="CVC" />\n      </div>\n    ),\n  },\n  { id: "wallet", label: "Wallet", description: "Express checkout", icon: <Wallet /> },\n  { id: "later", label: "Pay in 4", description: "Interest-free", icon: <Clock /> },\n]`

/* Stateful examples ------------------------------------------------------- */

const MiniCartExample = () => {
  const [items, setItems] = useState(miniCartItems)
  return (
    <MiniCart
      items={items}
      onRemove={(id) => setItems((current) => current.filter((item) => item.id !== id))}
      cartHref="/components/mini-cart"
      icon={<ShoppingBag />}
    />
  )
}

const CookieExample = () => {
  const [open, setOpen] = useState(true)
  return open ? (
    <CookieBanner
      style={{ width: "min(100%, 440px)" }}
      position="inline"
      categories={cookieCategories}
      onConsent={() => {}}
      open={open}
      onOpenChange={setOpen}
    >
      <p>We use cookies to run the store and, with your OK, to measure it.</p>
    </CookieBanner>
  ) : (
    <Button variant="outline" onClick={() => setOpen(true)}>
      Cookie settings
    </Button>
  )
}

const CompareExample = () => {
  const [ids, setIds] = useState(compareProducts.map((product) => product.id))
  return (
    <ProductCompare
      style={{ width: "100%" }}
      onRemove={(id) => setIds((current) => current.filter((value) => value !== id))}
      attributes={compareAttributes}
      products={compareProducts.filter((product) => ids.includes(product.id))}
    />
  )
}

/* Demos ------------------------------------------------------------------- */

export const demos = [
  defineDemo({
    id: "pricing-table",
    name: "Pricing Table",
    category: "Commerce",
    description: "Plan cards driven by a monthly and yearly switch.",
    exports: ["PricingTable"],
    layout: "fill",
    height: 560,
    controls: {
      defaultBilling: { type: "select", options: ["monthly", "yearly"], default: "monthly" },
      hideToggle: { type: "boolean", default: false },
    },
    render: ({ defaultBilling, hideToggle }) => (
      <div style={{ width: "min(100%, 920px)", margin: "0 auto", padding: "32px 16px" }}>
        <PricingTable key={defaultBilling} plans={plans} defaultBilling={defaultBilling} hideToggle={hideToggle} />
      </div>
    ),
    code: ({ defaultBilling, hideToggle }) =>
      `import { PricingTable } from "kitgrid"\n\n${declare("plans", plans)}\n\n` +
      jsx(
        "PricingTable",
        {
          plans: raw("plans"),
          defaultBilling,
          hideToggle,
          onSelect: raw("(planId, billing) => console.log(planId, billing)"),
        },
        undefined,
        { defaultBilling: "monthly" },
      ),
    accessibility: [
      "The billing switch is a radio group named “Billing period”; the yearly saving is part of the option's name.",
      "Each plan is an article with a heading; excluded features read “Not included”.",
      "The highlighted plan's orbit light stops under reduced motion.",
    ],
  }),

  defineDemo({
    id: "pricing-card",
    name: "Pricing Card",
    category: "Commerce",
    description: "A single tier with a large price, call to action and feature list.",
    exports: ["PricingCard"],
    serverSafe: true,
    controls: {
      highlighted: { type: "boolean", default: true },
      price: { type: "number", min: 0, max: 300, step: 1, default: 39 },
    },
    render: ({ highlighted, price }) => (
      <PricingCard
        style={{ width: 280 }}
        name="Growth"
        tagline="For growing brands"
        price={price}
        period="/ mo"
        highlighted={highlighted}
        action={<Button fullWidth>Get started</Button>}
        features={["3 stores", "Unlimited orders", { label: "POS hardware", included: false }]}
      />
    ),
    code: ({ highlighted, price }) =>
      `import { Button, PricingCard } from "kitgrid"\n\n` +
      jsx("PricingCard", {
        style: raw("{ width: 280 }"),
        name: "Growth",
        tagline: "For growing brands",
        price,
        period: "/ mo",
        highlighted,
        action: raw("<Button fullWidth>Get started</Button>"),
        features: raw(`["3 stores", "Unlimited orders", { label: "POS hardware", included: false }]`),
      }),
    accessibility: [
      "An article named by its heading. Each feature reads “Included:” or “Not included:”.",
    ],
  }),

  defineDemo({
    id: "pricing-toggle",
    name: "Pricing Toggle",
    category: "Commerce",
    description: "Monthly and yearly billing switch with a savings tag.",
    exports: ["PricingToggle"],
    controls: { savings: { type: "text", default: "−20%" } },
    render: ({ savings }) => <PricingToggle savings={savings || undefined} />,
    code: ({ savings }) =>
      `import { PricingToggle } from "kitgrid"\n\n` +
      jsx("PricingToggle", {
        defaultValue: "monthly",
        savings: savings || undefined,
        onValueChange: raw("(billing) => console.log(billing)"),
      }),
    accessibility: ["Native radios: Arrow keys switch period. Group name “Billing period”."],
  }),

  defineDemo({
    id: "feature-comparison",
    name: "Feature Comparison",
    category: "Commerce",
    description: "Plan-by-feature matrix with grouped rows and a highlighted column.",
    exports: ["FeatureComparison"],
    serverSafe: true,
    layout: "fill",
    render: () => (
      <div style={{ width: "min(100%, 640px)", margin: "0 auto", padding: 24 }}>
        <FeatureComparison plans={comparisonPlans} groups={comparisonGroups} />
      </div>
    ),
    code: () =>
      `import { FeatureComparison } from "kitgrid"\n\n${declare("plans", comparisonPlans)}\n\n${declare("groups", comparisonGroups)}\n\n` +
      jsx("FeatureComparison", { plans: raw("plans"), groups: raw("groups") }),
    accessibility: [
      "A real table: plans are column headers, features row headers, groups colgroup headers.",
      "Marks read “Included” or “Not included”.",
    ],
  }),

  defineDemo({
    id: "testimonial-card",
    name: "Testimonial Card",
    category: "Commerce",
    description: "A customer quote with attribution and optional stars.",
    exports: ["TestimonialCard"],
    serverSafe: true,
    controls: {
      variant: { type: "select", options: ["card", "quote"], default: "card" },
      rating: { type: "boolean", default: true },
    },
    render: ({ variant, rating }) => (
      <TestimonialCard
        style={{ width: 340 }}
        variant={variant}
        rating={rating ? 5 : undefined}
        quote="Checkout conversion went up 14% in the first month."
        author="Maya Chen"
        byline="Founder, Nook Goods"
      />
    ),
    code: ({ variant, rating }) =>
      `import { TestimonialCard } from "kitgrid"\n\n` +
      jsx(
        "TestimonialCard",
        {
          variant,
          rating: rating ? 5 : undefined,
          quote: "Checkout conversion went up 14% in the first month.",
          author: "Maya Chen",
          byline: "Founder, Nook Goods",
        },
        undefined,
        { variant: "card" },
      ),
    accessibility: ["figure, blockquote and figcaption. Stars are one image named “Rated 5 out of 5”."],
  }),

  defineDemo({
    id: "logo-cloud",
    name: "Logo Cloud",
    category: "Commerce",
    description: "A quiet row or grid of customer marks.",
    exports: ["LogoCloud"],
    serverSafe: true,
    controls: {
      variant: { type: "select", options: ["row", "grid"], default: "row" },
      muted: { type: "boolean", default: true },
    },
    render: ({ variant, muted }) => (
      <LogoCloud
        style={{ width: "min(100%, 640px)" }}
        variant={variant}
        muted={muted}
        title="Trusted by 4,000 stores"
        logos={["Northwind", "Halcyon", "Fieldnote", "Kestrel", "Lumen"].map((name) => ({ name }))}
      />
    ),
    code: ({ variant, muted }) =>
      `import { LogoCloud } from "kitgrid"\n\n` +
      jsx(
        "LogoCloud",
        {
          title: "Trusted by 4,000 stores",
          variant,
          muted: muted ? undefined : raw("false"),
          logos: raw(`["Northwind", "Halcyon", "Fieldnote", "Kestrel", "Lumen"].map((name) => ({ name }))`),
        },
        undefined,
        { variant: "row" },
      ),
    accessibility: ["Each mark is named by the company; linked marks get a visible focus ring."],
  }),

  defineDemo({
    id: "trust-badges",
    name: "Trust Badges",
    category: "Commerce",
    description: "Short reassurance points with preset icons.",
    exports: ["TrustBadges"],
    serverSafe: true,
    controls: { layout: { type: "select", options: ["row", "grid", "stack"], default: "row" } },
    render: ({ layout }) => (
      <TrustBadges
        layout={layout}
        style={{ maxWidth: 600 }}
        items={["secure", { preset: "returns", detail: "30 days" }, { preset: "shipping", detail: "Over $75" }]}
      />
    ),
    code: ({ layout }) =>
      `import { TrustBadges } from "kitgrid"\n\n` +
      jsx(
        "TrustBadges",
        { layout, items: raw(`["secure", { preset: "returns", detail: "30 days" }, { preset: "shipping", detail: "Over $75" }]`) },
        undefined,
        { layout: "row" },
      ),
    accessibility: ["A plain list; icons are decorative."],
  }),

  defineDemo({
    id: "product-badge",
    name: "Product Badge",
    category: "Commerce",
    description: "Merchandising labels in pill, tag and flag shapes.",
    exports: ["ProductBadge", "ProductBadgeGroup"],
    serverSafe: true,
    controls: { shape: { type: "select", options: ["pill", "tag", "flag"], default: "pill" } },
    render: ({ shape }) => (
      <div className="pg-row" style={{ gap: 8 }}>
        {(["new", "sale", "bestseller", "sold-out"] as const).map((kind) => (
          <ProductBadge key={kind} kind={kind} shape={shape} />
        ))}
      </div>
    ),
    code: ({ shape }) =>
      `import { ProductBadge } from "kitgrid"\n\n` +
      `<div style={{ display: "flex", gap: 8 }}>\n` +
      (["new", "sale", "bestseller", "sold-out"] as const)
        .map((kind) => `  ${jsx("ProductBadge", { kind, shape }, undefined, { shape: "pill" })}`)
        .join("\n") +
      `\n</div>`,
    accessibility: [
      "Badges are text, so the label is always read; the bestseller sheen stops under reduced motion.",
      "ProductBadgeGroup pins a stack of badges to a corner of a product image.",
    ],
  }),

  defineDemo({
    id: "newsletter-form",
    name: "Newsletter Form",
    category: "Commerce",
    description: "Email capture with inline validation and an announced confirmation.",
    exports: ["NewsletterForm"],
    controls: { variant: { type: "select", options: ["inline", "stacked"], default: "inline" } },
    render: ({ variant }) => (
      <div style={{ width: "min(100%, 380px)" }}>
        <NewsletterForm variant={variant} onSubscribe={() => wait(900)} />
      </div>
    ),
    code: ({ variant }) =>
      `import { NewsletterForm } from "kitgrid"\n\n` +
      jsx("NewsletterForm", { variant, onSubscribe: delay(900) }, undefined, { variant: "inline" }),
    accessibility: [
      "Hidden label “Email address”; errors are linked with aria-describedby and focus returns to the field.",
      "Success is announced through a status region.",
    ],
  }),

  defineDemo({
    id: "cookie-banner",
    name: "Cookie Banner",
    category: "Commerce",
    description: "Consent banner with equal-weight Accept and Reject, plus preferences.",
    exports: ["CookieBanner"],
    render: () => <CookieExample />,
    code: () =>
      `import { CookieBanner } from "kitgrid"\n\n${declare("categories", cookieCategories)}\n\n` +
      `<CookieBanner\n  position="inline"\n  categories={categories}\n  onConsent={(consent) => console.log(consent)}\n>\n  <p>We use cookies to run the store and, with your OK, to measure it.</p>\n</CookieBanner>`,
    accessibility: [
      "A region named by its heading, not a modal: the page stays usable.",
      "Reject all and Accept all share size and style, as EU regulators expect.",
      "Preferences use switches; required categories are checked and disabled.",
    ],
  }),

  defineDemo({
    id: "review-card",
    name: "Review Card",
    category: "Commerce",
    description: "One customer review with stars and a helpful vote.",
    exports: ["ReviewCard"],
    render: () => (
      <ReviewCard
        style={{ width: 360 }}
        author="Priya S."
        rating={5}
        date="Oct 12"
        title="Soft from day one"
        body="Runs a little roomy. I sized down and it's perfect."
        verified
        helpfulCount={12}
        onHelpful={() => {}}
      />
    ),
    code: () =>
      `import { ReviewCard } from "kitgrid"\n\n` +
      jsx("ReviewCard", {
        style: raw("{ width: 360 }"),
        author: "Priya S.",
        rating: 5,
        date: "Oct 12",
        title: "Soft from day one",
        body: "Runs a little roomy. I sized down and it's perfect.",
        verified: true,
        helpfulCount: 12,
        onHelpful: raw("() => console.log(\"helpful\")"),
      }),
    accessibility: ["An article; the helpful button is a toggle (aria-pressed) that locks after one vote."],
  }),

  defineDemo({
    id: "review-form",
    name: "Review Form",
    category: "Commerce",
    description: "Star rating, title and body with validation.",
    exports: ["ReviewForm"],
    render: () => <ReviewForm style={{ width: 380 }} onSubmit={() => wait(800)} />,
    code: () =>
      `import { ReviewForm } from "kitgrid"\n\n` +
      jsx("ReviewForm", { style: raw("{ width: 380 }"), onSubmit: raw("(review) => console.log(review)") }),
    accessibility: [
      "Stars are a native radio group; a missing rating moves focus to it.",
      "Field errors are linked to their controls; success is a status message.",
    ],
  }),

  defineDemo({
    id: "size-guide",
    name: "Size Guide",
    category: "Commerce",
    description: "Measurement table with a cm and in switch, in a dialog.",
    exports: ["SizeGuide", "SizeGuideTable"],
    render: () => <SizeGuide columns={sizeColumns} rows={sizeRows} highlight="M" />,
    code: () =>
      `import { SizeGuide } from "kitgrid"\n\n${declare("columns", sizeColumns)}\n\n${declare("rows: SizeGuideRow[]", sizeRows)}\n\n` +
      jsx("SizeGuide", { columns: raw("columns"), rows: raw("rows"), highlight: "M" }),
    accessibility: [
      "Modal dialog named “Size guide”; Escape closes and focus returns to the link.",
      "The highlighted row has aria-current; values are stored in cm and converted on display.",
      "SizeGuideTable renders the same table inline.",
    ],
  }),

  defineDemo({
    id: "swatch-picker",
    name: "Swatch Picker",
    category: "Commerce",
    description: "Round color swatches as native radios.",
    exports: ["SwatchPicker"],
    controls: {
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      showNames: { type: "boolean", default: false },
    },
    render: ({ size, showNames }) => (
      <SwatchPicker label="Color" options={swatches} defaultValue="sage" size={size} showNames={showNames} />
    ),
    code: ({ size, showNames }) =>
      `import { SwatchPicker } from "kitgrid"\n\n${declare("swatches", swatches)}\n\n` +
      jsx(
        "SwatchPicker",
        { label: "Color", options: raw("swatches"), defaultValue: "sage", size, showNames },
        undefined,
        { size: "md" },
      ),
    accessibility: [
      "The legend reads “Color: Sage”, so color is never the only signal.",
      "Sold-out swatches are struck and named “Rust, sold out”, but stay selectable for back-in-stock flows.",
    ],
  }),

  defineDemo({
    id: "mini-cart",
    name: "Mini Cart",
    category: "Commerce",
    description: "Header cart button that opens a compact popover with subtotal.",
    exports: ["MiniCart"],
    height: 420,
    render: () => <MiniCartExample />,
    code: () =>
      `import { MiniCart } from "kitgrid"\nimport { ShoppingBag } from "lucide-react"\nimport { useState } from "react"\n\n${declare("initialItems", miniCartItems)}\n\n` +
      `function Example() {\n  const [items, setItems] = useState(initialItems)\n  return (\n    <MiniCart\n      items={items}\n      icon={<ShoppingBag />}\n      cartHref="/cart"\n      onRemove={(id) => setItems((current) => current.filter((item) => item.id !== id))}\n    />\n  )\n}\n\n<Example />`,
    accessibility: [
      "Trigger is named “Cart, 3 items”; the popover is a dialog named “Your cart”.",
      "Escape or an outside press closes it and returns focus. Remove buttons name their product.",
    ],
  }),

  defineDemo({
    id: "upsell-card",
    name: "Upsell Card",
    category: "Commerce",
    description: "One-tap add-on offer for cart drawers and order summaries.",
    exports: ["UpsellCard"],
    render: () => (
      <UpsellCard style={{ width: 340 }} name="Stoneware Mug Set" price={64} onAdd={() => wait(700)} />
    ),
    code: () =>
      `import { UpsellCard } from "kitgrid"\n\n` +
      jsx("UpsellCard", {
        style: raw("{ width: 340 }"),
        name: "Stoneware Mug Set",
        price: 64,
        onAdd: delay(700),
      }),
    accessibility: ["The add button names the product and announces “added”."],
  }),

  defineDemo({
    id: "bundle-builder",
    name: "Bundle Builder",
    category: "Commerce",
    description: "Frequently bought together, with tick boxes and a live total.",
    exports: ["BundleBuilder"],
    controls: { discount: { type: "number", min: 0, max: 30, step: 5, default: 10 } },
    render: ({ discount }) => (
      <BundleBuilder style={{ width: 400 }} discount={discount} onAdd={() => wait(700)} items={bundleItems} />
    ),
    code: ({ discount }) =>
      `import { BundleBuilder } from "kitgrid"\n\n${declare("items", bundleItems)}\n\n` +
      jsx("BundleBuilder", { style: raw("{ width: 400 }"), items: raw("items"), discount, onAdd: delay(700) }),
    accessibility: ["Native checkboxes; the viewed product is checked and disabled. The total is a polite live region."],
  }),

  defineDemo({
    id: "subscription-selector",
    name: "Subscription Selector",
    category: "Commerce",
    description: "One-time versus subscribe and save, with delivery frequency.",
    exports: ["SubscriptionSelector"],
    controls: { discount: { type: "number", min: 5, max: 30, step: 5, default: 15 } },
    render: ({ discount }) => (
      <SubscriptionSelector style={{ width: 360 }} price={24} discount={discount} frequencies={frequencies} />
    ),
    code: ({ discount }) =>
      `import { SubscriptionSelector } from "kitgrid"\n\n${declare("frequencies", frequencies)}\n\n` +
      jsx("SubscriptionSelector", {
        style: raw("{ width: 360 }"),
        price: 24,
        discount,
        frequencies: raw("frequencies"),
      }),
    accessibility: [
      "One-time is the default. Both options are radios whose names include the per-delivery price.",
      "Frequency radios are disabled until subscribing; more than four switch to a select.",
    ],
  }),

  defineDemo({
    id: "back-in-stock-form",
    name: "Back In Stock Form",
    category: "Commerce",
    description: "Sold-out replacement for the buy button that collects an email alert.",
    exports: ["BackInStockForm"],
    render: () => (
      <div style={{ width: 340 }}>
        <BackInStockForm variant="Rust / M" onNotify={() => wait(800)} />
      </div>
    ),
    code: () =>
      `import { BackInStockForm } from "kitgrid"\n\n` +
      `<div style={{ width: 340 }}>\n  ` +
      jsx("BackInStockForm", { variant: "Rust / M", onNotify: delay(800) }) +
      `\n</div>`,
    accessibility: ["The trigger reveals a labelled email field and moves focus to it; confirmation is announced."],
  }),

  defineDemo({
    id: "sticky-add-to-cart",
    name: "Sticky Add To Cart",
    category: "Commerce",
    description: "A slim bar that keeps the buy button in reach after scrolling past it.",
    exports: ["StickyAddToCart"],
    controls: { visible: { type: "boolean", default: true } },
    render: ({ visible }) => (
      <div style={{ width: "min(100%, 560px)" }}>
        <StickyAddToCart position="inline" visible={visible} name="Linen Overshirt" variant="Sage / M" price={98} />
      </div>
    ),
    code: ({ visible }) =>
      `import { StickyAddToCart } from "kitgrid"\n\n` +
      jsx("StickyAddToCart", {
        position: "inline",
        visible: visible ? true : raw("false"),
        name: "Linen Overshirt",
        variant: "Sage / M",
        price: 98,
        onAdd: raw(`() => console.log("added")`),
      }),
    accessibility: [
      "A region named “Quick add to cart”. While hidden it is aria-hidden and inert, so it leaves the tab order.",
      "With target, it appears only once the real button leaves through the top of the viewport.",
    ],
  }),

  defineDemo({
    id: "recently-viewed",
    name: "Recently Viewed",
    category: "Commerce",
    description: "A scroll-snapping rail of viewed products with paging buttons.",
    exports: ["RecentlyViewed"],
    layout: "fill",
    render: () => (
      <div style={{ width: "min(100%, 680px)", margin: "0 auto", padding: 24 }}>
        <RecentlyViewed onClear={() => {}} items={recentItems} />
      </div>
    ),
    code: () =>
      `import { RecentlyViewed } from "kitgrid"\n\n${declare("items", recentItems)}\n\n` +
      jsx("RecentlyViewed", { items: raw("items"), onClear: raw(`() => console.log("cleared")`) }),
    accessibility: ["A titled region; paging buttons disable at either end and respect RTL."],
  }),

  defineDemo({
    id: "product-compare",
    name: "Product Compare",
    category: "Commerce",
    description: "Side-by-side spec table that can hide matching rows.",
    exports: ["ProductCompare"],
    layout: "fill",
    render: () => (
      <div style={{ width: "min(100%, 560px)", margin: "0 auto", padding: 24 }}>
        <CompareExample />
      </div>
    ),
    code: () =>
      `import { ProductCompare } from "kitgrid"\n\n${declare("attributes", compareAttributes)}\n\n${declare("products", compareProducts)}\n\n` +
      jsx("ProductCompare", { products: raw("products"), attributes: raw("attributes") }),
    accessibility: [
      "A table with products as column headers and attributes as row headers.",
      "Rows that differ are tinted and edged; “Only differences” is a switch.",
    ],
  }),

  defineDemo({
    id: "product-tabs",
    name: "Product Tabs",
    category: "Commerce",
    description: "Details, shipping and returns as tabs or an accordion.",
    exports: ["ProductTabs"],
    controls: { layout: { type: "select", options: ["tabs", "accordion"], default: "tabs" } },
    render: ({ layout }) => (
      <ProductTabs
        style={{ width: 380 }}
        layout={layout}
        sections={[
          { id: "details", label: "Details", content: <p>100% European linen. Corozo buttons.</p> },
          { id: "shipping", label: "Shipping", content: <p>Free over $75. Ships in 1-2 days.</p> },
          { id: "returns", label: "Returns", content: <p>Free returns within 30 days.</p> },
        ]}
      />
    ),
    code: ({ layout }) =>
      `import { ProductTabs } from "kitgrid"\n\n` +
      `const sections = [\n  { id: "details", label: "Details", content: <p>100% European linen. Corozo buttons.</p> },\n  { id: "shipping", label: "Shipping", content: <p>Free over $75. Ships in 1-2 days.</p> },\n  { id: "returns", label: "Returns", content: <p>Free returns within 30 days.</p> },\n]\n\n` +
      jsx("ProductTabs", { style: raw("{ width: 380 }"), layout, sections: raw("sections") }, undefined, { layout: "tabs" }),
    accessibility: ["Tabs follow the APG pattern; the accordion uses native details and summary."],
  }),

  defineDemo({
    id: "address-form",
    name: "Address Form",
    category: "Commerce",
    description: "Address fields that relabel and reorder for the chosen country.",
    exports: ["AddressForm"],
    render: () => <AddressForm style={{ width: 400 }} />,
    code: () =>
      `import { AddressForm } from "kitgrid"\n\n` +
      jsx("AddressForm", { style: raw("{ width: 400 }"), onValueChange: raw("(address) => console.log(address)") }),
    accessibility: [
      "A fieldset named “Shipping address” with full autocomplete tokens.",
      "Postal code and region labels follow the country; the second address line hides behind a link.",
    ],
  }),

  defineDemo({
    id: "payment-method-selector",
    name: "Payment Method Selector",
    category: "Commerce",
    description: "Payment options as connected radio rows; the chosen row reveals its fields.",
    exports: ["PaymentMethodSelector"],
    render: () => <PaymentMethodSelector style={{ width: 400 }} methods={paymentMethods} />,
    code: () =>
      `import { Input, PaymentMethodSelector } from "kitgrid"\nimport { Clock, CreditCard, Wallet } from "lucide-react"\n\n${paymentMethodsCode}\n\n` +
      jsx("PaymentMethodSelector", { style: raw("{ width: 400 }"), methods: raw("methods"), defaultValue: "card" }),
    accessibility: [
      "Native radios inside a fieldset; Arrow keys move between methods.",
      "Collapsed method content is inert, so hidden fields never take focus.",
    ],
  }),

  defineDemo({
    id: "checkout-form",
    name: "Checkout Form",
    category: "Commerce",
    description: "One-page checkout: contact, address, delivery and payment.",
    exports: ["CheckoutForm"],
    layout: "fill",
    height: 1000,
    render: () => (
      <div style={{ width: "min(100%, 480px)", margin: "0 auto", padding: "32px 16px" }}>
        <CheckoutForm
          subtotal={156}
          onSubmit={() => wait(900)}
          shippingOptions={shippingOptions}
          payment={<PaymentMethodSelector methods={simpleMethods} />}
        />
      </div>
    ),
    code: () =>
      `import { CheckoutForm, PaymentMethodSelector } from "kitgrid"\n\n${declare("shippingOptions", shippingOptions)}\n\n${declare("methods", simpleMethods)}\n\n` +
      `<div style={{ width: 480 }}>\n  ` +
      indent(
        jsx("CheckoutForm", {
          subtotal: 156,
          shippingOptions: raw("shippingOptions"),
          payment: raw("<PaymentMethodSelector methods={methods} />"),
          onSubmit: raw("(checkout) => console.log(checkout)"),
        }),
        2,
      ) +
      `\n</div>`,
    accessibility: [
      "Each section is a region named by its heading.",
      "Errors appear after the first submit and focus moves to the first invalid field.",
      "The submit button states the total, including the chosen delivery rate.",
    ],
  }),

  defineDemo({
    id: "order-tracker",
    name: "Order Tracker",
    category: "Commerce",
    description: "Ordered to delivered progress with the current step ringed.",
    exports: ["OrderTracker"],
    serverSafe: true,
    controls: {
      current: { type: "select", options: ["ordered", "packed", "shipped", "delivered"], default: "shipped" },
      orientation: { type: "select", options: ["horizontal", "vertical"], default: "horizontal" },
      exception: { type: "boolean", default: false },
    },
    render: ({ current, orientation, exception }) => (
      <OrderTracker
        style={{ width: orientation === "vertical" ? 240 : 480, maxWidth: "100%" }}
        steps={trackerSteps.map((step, index) => ({
          ...step,
          icon: index === 2 ? <Truck /> : index === 3 ? <Package /> : undefined,
        }))}
        current={current}
        orientation={orientation}
        status={exception ? "exception" : "normal"}
      />
    ),
    code: ({ current, orientation, exception }) =>
      `import { OrderTracker } from "kitgrid"\nimport { Package, Truck } from "lucide-react"\n\n` +
      `const steps = [\n  { id: "ordered", label: "Ordered", date: "Oct 20" },\n  { id: "packed", label: "Packed", date: "Oct 21" },\n  { id: "shipped", label: "Shipped", date: "Oct 22", icon: <Truck /> },\n  { id: "delivered", label: "Delivered", icon: <Package /> },\n]\n\n` +
      jsx(
        "OrderTracker",
        {
          style: raw(`{ width: ${orientation === "vertical" ? 240 : 480} }`),
          steps: raw("steps"),
          current,
          orientation,
          status: exception ? "exception" : undefined,
        },
        undefined,
        { orientation: "horizontal" },
      ),
    accessibility: ['A navigation landmark around an ordered list; the current step has aria-current="step" and each step reads its state.'],
  }),

  defineDemo({
    id: "shipment-timeline",
    name: "Shipment Timeline",
    category: "Commerce",
    description: "Carrier scan history, newest first.",
    exports: ["ShipmentTimeline"],
    serverSafe: true,
    render: () => (
      <ShipmentTimeline style={{ width: 340 }} carrier="UPS Ground" trackingNumber="1Z 84V 2X0 39" events={shipmentEvents} />
    ),
    code: () =>
      `import { ShipmentTimeline } from "kitgrid"\n\n${declare("events", shipmentEvents)}\n\n` +
      jsx("ShipmentTimeline", {
        style: raw("{ width: 340 }"),
        carrier: "UPS Ground",
        trackingNumber: "1Z 84V 2X0 39",
        events: raw("events"),
      }),
    accessibility: ["An ordered list named “Shipment history”; the first item is prefixed “Latest”. Times use <time>."],
  }),

  defineDemo({
    id: "store-locator-list",
    name: "Store Locator List",
    category: "Commerce",
    description: "Pickup store chooser with distance, opening status and stock.",
    exports: ["StoreLocatorList"],
    render: () => <StoreLocatorList style={{ width: 380 }} stores={storeList} unit="mi" defaultValue="soho" />,
    code: () =>
      `import { StoreLocatorList } from "kitgrid"\n\n${declare("stores: StoreLocatorListStore[]", storeList)}\n\n` +
      jsx("StoreLocatorList", { style: raw("{ width: 380 }"), stores: raw("stores"), unit: "mi", defaultValue: "soho" }),
    accessibility: [
      "Native radios named by store and distance, described by address, hours and stock.",
      "Out-of-stock stores are disabled. Status always has text, never color alone.",
    ],
  }),

  defineDemo({
    id: "loyalty-meter",
    name: "Loyalty Meter",
    category: "Commerce",
    description: "Reward points with tier markers, as a bar or ring.",
    exports: ["LoyaltyMeter"],
    serverSafe: true,
    controls: {
      points: { type: "number", min: 0, max: 3000, step: 50, default: 1650 },
      variant: { type: "select", options: ["bar", "ring"], default: "bar" },
    },
    render: ({ points, variant }) => (
      <LoyaltyMeter style={{ width: 360 }} points={points} tiers={loyaltyTiers} variant={variant} />
    ),
    code: ({ points, variant }) =>
      `import { LoyaltyMeter } from "kitgrid"\n\n${declare("tiers", loyaltyTiers)}\n\n` +
      jsx("LoyaltyMeter", { style: raw("{ width: 360 }"), points, tiers: raw("tiers"), variant }, undefined, { variant: "bar" }),
    accessibility: ["role=meter with a value text such as “1,650 pts, Silver. 850 pts to Gold”."],
  }),

  defineDemo({
    id: "referral-card",
    name: "Referral Card",
    category: "Commerce",
    description: "Give-and-get offer with a copyable link and the native share sheet.",
    exports: ["ReferralCard"],
    render: () => (
      <ReferralCard
        style={{ width: 360 }}
        title="Give $20, get $20"
        description="On their first order over $60."
        link="https://nook.shop/r/maya20"
      />
    ),
    code: () =>
      `import { ReferralCard } from "kitgrid"\n\n` +
      jsx("ReferralCard", {
        style: raw("{ width: 360 }"),
        title: "Give $20, get $20",
        description: "On their first order over $60.",
        link: "https://nook.shop/r/maya20",
      }),
    accessibility: [
      "A region named by the offer. The link is a labelled read-only field that selects on focus.",
      "Copy announces “Copied”; Share appears only where the Web Share API exists.",
    ],
  }),

  defineDemo({
    id: "gift-card",
    name: "Gift Card",
    category: "Commerce",
    description: "A gift card with a masked, copyable code.",
    exports: ["GiftCard"],
    controls: { finish: { type: "select", options: ["accent", "graphite"], default: "accent" } },
    render: ({ finish }) => <GiftCard finish={finish} amount={100} brand="Nook" code="NOOK-7Q2X-K9MA" />,
    code: ({ finish }) =>
      `import { GiftCard } from "kitgrid"\n\n` +
      jsx("GiftCard", { finish, amount: 100, brand: "Nook", code: "NOOK-7Q2X-K9MA" }, undefined, { finish: "accent" }),
    accessibility: [
      "The balance reads “Gift card balance $100”. The masked code reads “Code hidden” until revealed.",
      "Show code is a toggle button; Copy announces “Code copied”. The hover tilt stops under reduced motion.",
    ],
  }),

  defineDemo({
    id: "currency-selector",
    name: "Currency Selector",
    category: "Commerce",
    description: "Store currency picker with localized names and symbols.",
    exports: ["CurrencySelector"],
    height: 360,
    controls: { compact: { type: "boolean", default: false } },
    render: ({ compact }) => (
      <div style={{ width: compact ? 120 : 240 }}>
        <CurrencySelector currencies={["USD", "EUR", "GBP", "JPY"]} defaultValue="USD" compact={compact} />
      </div>
    ),
    code: ({ compact }) =>
      `import { CurrencySelector } from "kitgrid"\n\n` +
      `<div style={{ width: ${compact ? 120 : 240} }}>\n  ` +
      jsx("CurrencySelector", { currencies: raw(`["USD", "EUR", "GBP", "JPY"]`), defaultValue: "USD", compact }) +
      `\n</div>`,
    accessibility: ["A Select (combobox and listbox) named “Currency”; names come from Intl.DisplayNames."],
  }),
]
