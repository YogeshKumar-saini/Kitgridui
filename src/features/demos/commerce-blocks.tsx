import {
  AddToCartButton,
  Button,
  CartButton,
  CartDrawer,
  type CartLine,
  CartProvider,
  CheckoutSteps,
  CouponInput,
  IconButton,
  OrderSummary,
  type OrderSummaryLine,
  PriceRangeSlider,
  ProductCard,
  ProductGallery,
  QuickView,
  ReviewSummary,
  Toaster,
  useCart,
} from "kitgrid"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { type CatalogProduct, catalog } from "@/lib/data/catalog"
import { defineDemo, jsx, raw } from "./registry"
import { indent } from "./commerce-code"

/* Shared data -------------------------------------------------------------- */

const product = (id: string) => catalog.find((entry) => entry.id === id) as CatalogProduct
const overshirt = product("linen-overshirt")

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const applyCoupon = async (code: string) => {
  await wait(700)
  return code.trim().toUpperCase() === "WELCOME10"
    ? { ok: true, message: "You saved $12.40" }
    : { ok: false }
}

const lines: CartLine[] = [
  {
    id: "overshirt",
    productId: "overshirt",
    title: "Linen Overshirt",
    variantTitle: "Sage / M",
    price: 98,
    compareAt: 128,
    quantity: 1,
  },
  { id: "tote", productId: "tote", title: "Canvas Tote", price: 58, quantity: 2 },
]

const linesCode = `const lines = [\n  { id: "overshirt", productId: "overshirt", title: "Linen Overshirt", variantTitle: "Sage / M", price: 98, compareAt: 128, quantity: 1 },\n  { id: "tote", productId: "tote", title: "Canvas Tote", price: 58, quantity: 2 },\n]`

const summaryLines: OrderSummaryLine[] = lines.map(({ id, title, variantTitle, price, compareAt, quantity }) => ({
  id,
  title,
  variantTitle,
  price,
  compareAt,
  quantity,
}))

const summaryLinesCode = `const lines = [\n  { id: "overshirt", title: "Linen Overshirt", variantTitle: "Sage / M", price: 98, compareAt: 128, quantity: 1 },\n  { id: "tote", title: "Canvas Tote", price: 58, quantity: 2 },\n]`

const steps = [
  { id: "cart", label: "Cart" },
  { id: "information", label: "Information" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
]

const stepsCode = `const steps = [\n  { id: "cart", label: "Cart" },\n  { id: "information", label: "Information" },\n  { id: "shipping", label: "Shipping" },\n  { id: "payment", label: "Payment" },\n]`

const priceHistogram = [2, 5, 9, 14, 18, 12, 9, 7, 4, 3, 2, 1]

const swatches = [
  { label: "Sage", color: "oklch(0.72 0.06 150)" },
  { label: "Sand", color: "oklch(0.86 0.045 80)" },
  { label: "Ink", color: "oklch(0.28 0.04 265)" },
]

const placeholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Crect width='4' height='5' fill='%23e4e6ea'/%3E%3C/svg%3E"

/* Stateful examples -------------------------------------------------------- */

const CartSummary = () => {
  const cart = useCart()
  const money = (amount: number) =>
    new Intl.NumberFormat(cart.locale, { style: "currency", currency: cart.currency }).format(amount)
  return (
    <div className="pg-stack" style={{ width: 340, maxWidth: "100%", gap: 12 }}>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
        {cart.lines.map((line) => (
          <li key={line.id} className="pg-row" style={{ justifyContent: "space-between", gap: 8 }}>
            <span>
              {line.quantity} × {line.title}
            </span>
            <span className="pg-row" style={{ gap: 4 }}>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{money(line.price * line.quantity)}</span>
              <IconButton
                size="sm"
                variant="ghost"
                label={`Remove ${line.title}`}
                icon={<Trash2 />}
                onClick={() => cart.removeItem(line.id)}
              />
            </span>
          </li>
        ))}
      </ul>
      <div className="pg-row" style={{ justifyContent: "space-between" }}>
        <Button
          size="sm"
          variant="outline"
          leading={<Plus />}
          onClick={() => cart.addItem({ productId: "tote", title: "Canvas Tote", price: 58 })}
        >
          Add tote
        </Button>
        <strong style={{ fontVariantNumeric: "tabular-nums" }}>{money(cart.subtotal)}</strong>
      </div>
    </div>
  )
}

const QuickViewExample = ({ closeOnAdd }: { closeOnAdd: boolean }) => {
  const [open, setOpen] = useState(false)
  return (
    <CartProvider>
      <Toaster />
      <div className="pg-row" style={{ gap: 12 }}>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Quick view
        </Button>
        <CartButton variant="outline" />
      </div>
      <QuickView
        product={overshirt}
        open={open}
        onOpenChange={setOpen}
        closeOnAdd={closeOnAdd}
        detailsHref="/storefront"
      />
    </CartProvider>
  )
}

/* Demos ---------------------------------------------------------------------- */

export const demos = [
  defineDemo({
    id: "cart",
    name: "Cart",
    category: "Commerce",
    description: "Headless cart state with persistence and undo.",
    exports: ["CartProvider", "useCart", "useCartActions", "getCartTotals"],
    controls: {
      currency: { type: "select", options: ["USD", "EUR", "GBP", "JPY"], default: "USD" },
    },
    render: ({ currency }) => (
      <CartProvider key={currency} currency={currency} initialLines={lines}>
        <CartSummary />
      </CartProvider>
    ),
    code: ({ currency }) =>
      `import { Button, CartProvider, useCart } from "kitgrid"\n\n` +
      `function CartSummary() {\n  const { lines, subtotal, addItem, removeItem } = useCart()\n  return (\n    <div>\n      {lines.map((line) => (\n        <p key={line.id}>\n          {line.quantity} x {line.title}\n          <Button size="sm" variant="ghost" onClick={() => removeItem(line.id)}>Remove</Button>\n        </p>\n      ))}\n      <Button onClick={() => addItem({ productId: "tote", title: "Canvas Tote", price: 58 })}>Add tote</Button>\n      <p>Subtotal: {subtotal.toFixed(2)}</p>\n    </div>\n  )\n}\n\n` +
      jsx("CartProvider", { currency, storageKey: "my-store-cart" }, "<CartSummary />", { currency: "USD" }),
    accessibility: [
      "Headless: it renders nothing, so every surface keeps its own semantics.",
      "Actions live in their own context with stable identities, so add-to-cart buttons never re-render when the cart changes (useCartActions).",
      "storageKey is read after mount, so server and first client render match; other tabs stay in sync.",
    ],
  }),

  defineDemo({
    id: "cart-drawer",
    name: "Cart Drawer",
    category: "Commerce",
    description: "A slide-out cart with totals and checkout.",
    exports: ["CartDrawer", "CartLineItem"],
    controls: {
      freeShippingThreshold: { type: "number", min: 0, max: 400, step: 10, default: 150 },
      coupon: { type: "boolean", default: false },
      undoable: { type: "boolean", default: true },
      empty: { type: "boolean", default: false, label: "Start empty" },
    },
    render: ({ freeShippingThreshold, coupon, undoable, empty }) => (
      <CartProvider
        key={String(empty)}
        initialLines={empty ? [] : lines}
        freeShippingThreshold={freeShippingThreshold || undefined}
      >
        <Toaster />
        <CartButton variant="outline" size="lg" />
        <CartDrawer
          undoable={undoable}
          coupon={coupon ? <CouponInput onApply={applyCoupon} size="sm" /> : undefined}
          onCheckout={() => undefined}
        />
      </CartProvider>
    ),
    code: ({ freeShippingThreshold, coupon, undoable }) =>
      `import { CartButton, CartDrawer, CartProvider, CouponInput, Toaster } from "kitgrid"\n\n${linesCode}\n\n` +
      `<CartProvider initialLines={lines}${freeShippingThreshold ? ` freeShippingThreshold={${freeShippingThreshold}}` : ""}>\n  <CartButton />\n  ` +
      indent(
        jsx(
          "CartDrawer",
          {
            coupon: coupon
              ? raw(`<CouponInput size="sm" onApply={async (code) => ({ ok: code === "WELCOME10" })} />`)
              : undefined,
            undoable: undoable ? undefined : raw("false"),
            checkoutHref: "/checkout",
          },
        ),
        2,
      ) +
      `\n  <Toaster />\n</CartProvider>`,
    accessibility: [
      "A modal dialog named “Your cart”: focus moves in, Escape and the backdrop close it, focus returns to the cart button.",
      "Removing a line moves focus to the next line's quantity field and offers Undo in a toast.",
      "Lines collapse with grid-template-rows and snap under reduced motion.",
    ],
  }),

  defineDemo({
    id: "add-to-cart-button",
    name: "Add To Cart Button",
    category: "Commerce",
    description: "An async buy button with a fly-to-cart animation.",
    exports: ["AddToCartButton", "useFlyToCart"],
    controls: {
      size: { type: "select", options: ["sm", "md", "lg"], default: "lg" },
      fail: { type: "boolean", default: false, label: "onAdd rejects" },
      soldOut: { type: "boolean", default: false },
      hideIcon: { type: "boolean", default: false },
    },
    render: ({ size, fail, soldOut, hideIcon }) => (
      <>
        <Toaster />
        <AddToCartButton
          size={size}
          soldOut={soldOut}
          hideIcon={hideIcon}
          onAdd={async () => {
            await wait(800)
            if (fail) throw new Error("Out of stock")
          }}
          onError={() => undefined}
        />
      </>
    ),
    code: ({ size, fail, soldOut, hideIcon }) =>
      `import { AddToCartButton } from "kitgrid"\n\n` +
      jsx(
        "AddToCartButton",
        {
          onAdd: raw(
            fail
              ? `() => Promise.reject(new Error("Out of stock"))`
              : `() => new Promise((resolve) => setTimeout(resolve, 800))`,
          ),
          onError: fail ? raw("(error) => console.error(error)") : undefined,
          size,
          soldOut,
          hideIcon,
        },
        undefined,
        { size: "lg" },
      ),
    accessibility: [
      "Every label is stacked in one grid cell, so the width never jumps while the label morphs.",
      "While adding it stays focusable with aria-busy; repeated clicks are ignored.",
      "“Added to cart” is announced politely. Reduced motion skips the flight and the check appears without drawing.",
      "A rejected onAdd returns to idle and is passed to onError (or rethrown), never swallowed.",
    ],
  }),

  defineDemo({
    id: "cart-button",
    name: "Cart Button",
    category: "Commerce",
    description: "The header cart icon with a count badge.",
    exports: ["CartButton"],
    controls: {
      count: { type: "number", min: 0, max: 150, step: 1, default: 3 },
      variant: { type: "select", options: ["ghost", "outline", "soft"], default: "outline" },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
    },
    render: ({ count, variant, size }) => <CartButton count={count} variant={variant} size={size} />,
    code: ({ count, variant, size }) =>
      `import { CartButton } from "kitgrid"\n\n` +
      jsx("CartButton", { count, variant, size }, undefined, { variant: "ghost", size: "md" }),
    accessibility: [
      "Named “Cart, 3 items”; the visual badge is aria-hidden.",
      "Inside a CartProvider it reads the count itself and gets aria-haspopup=dialog and aria-expanded.",
      "Counts above max show as “99+” while the name keeps the exact number.",
    ],
  }),

  defineDemo({
    id: "product-card",
    name: "Product Card",
    category: "Commerce",
    description: "A merchandising tile with quick add and wishlist.",
    exports: ["ProductCard"],
    serverSafe: true,
    controls: {
      variant: { type: "select", options: ["default", "minimal", "horizontal"], default: "default" },
      quickAdd: { type: "boolean", default: true },
      wishlist: { type: "boolean", default: true },
      soldOut: { type: "boolean", default: false },
    },
    render: ({ variant, quickAdd, wishlist, soldOut }) => (
      <div style={{ width: variant === "horizontal" ? 420 : 240, maxWidth: "100%" }}>
        <ProductCard
          variant={variant}
          title="Linen Overshirt"
          vendor="Atelier Nord"
          href="/components/product-card"
          price={98}
          rating={4.8}
          reviewCount={412}
          swatches={swatches}
          soldOut={soldOut}
          wishlist={wishlist}
          onQuickAdd={quickAdd ? () => wait(700) : undefined}
        />
      </div>
    ),
    code: ({ variant, quickAdd, wishlist, soldOut }) =>
      `import { ProductCard } from "kitgrid"\n\n` +
      `<div style={{ width: ${variant === "horizontal" ? 420 : 240} }}>\n  ` +
      indent(
        jsx(
          "ProductCard",
          {
            variant,
            title: "Linen Overshirt",
            vendor: "Atelier Nord",
            href: "/products/linen-overshirt",
            price: 98,
            rating: 4.8,
            reviewCount: 412,
            swatches: raw(
              `[\n    { label: "Sage", color: "oklch(0.72 0.06 150)" },\n    { label: "Sand", color: "oklch(0.86 0.045 80)" },\n    { label: "Ink", color: "oklch(0.28 0.04 265)" },\n  ]`,
            ),
            soldOut,
            wishlist,
            onQuickAdd: quickAdd ? raw("() => new Promise((resolve) => setTimeout(resolve, 700))") : undefined,
          },
          undefined,
          { variant: "default" },
        ),
        2,
      ) +
      `\n</div>`,
    accessibility: [
      "The title is the only link; a stretched ::after makes the whole card clickable while the buttons sit above it.",
      "Every button's name includes the product (“Quick add: Linen Overshirt”).",
      "Without an image the media area renders a neutral placeholder of the same size, so grids never shift.",
      "Quick add appears on hover and keyboard focus, and is always visible on touch screens.",
    ],
  }),

  defineDemo({
    id: "product-gallery",
    name: "Product Gallery",
    category: "Commerce",
    description: "Product media with swipe, thumbnails, zoom and lightbox.",
    exports: ["ProductGallery"],
    controls: {
      thumbnails: { type: "select", options: ["horizontal", "vertical", "none"], default: "horizontal" },
      zoom: { type: "boolean", default: true },
      lightbox: { type: "boolean", default: true },
    },
    render: ({ thumbnails, zoom, lightbox }) => (
      <div style={{ width: 380, maxWidth: "100%" }}>
        <ProductGallery
          images={overshirt.images.slice(0, 3)}
          thumbnails={thumbnails}
          zoom={zoom}
          lightbox={lightbox}
        />
      </div>
    ),
    code: ({ thumbnails, zoom, lightbox }) =>
      `import { ProductGallery } from "kitgrid"\n\n` +
      `const placeholder =\n  "${placeholder}"\n\n` +
      `const images = [\n  { src: placeholder, alt: "Front", width: 800, height: 1000 },\n  { src: placeholder, alt: "Back", width: 800, height: 1000 },\n  { src: placeholder, alt: "Detail", width: 800, height: 1000 },\n]\n\n` +
      `<div style={{ width: 380 }}>\n  ` +
      jsx(
        "ProductGallery",
        {
          images: raw("images"),
          thumbnails,
          zoom: zoom ? undefined : raw("false"),
          lightbox: lightbox ? undefined : raw("false"),
        },
        undefined,
        { thumbnails: "horizontal" },
      ) +
      `\n</div>`,
    accessibility: [
      "A region with aria-roledescription=carousel; each slide is a group named “Image 2 of 3” and hidden slides leave the tab order.",
      "Arrow keys, Home and End move between images; a polite live region announces the change.",
      "The lightbox is a modal Dialog: Enter zooms, arrows page, Escape closes and returns focus.",
      "Hover zoom runs only for a mouse and never under reduced motion.",
    ],
  }),

  defineDemo({
    id: "quick-view",
    name: "Quick View",
    category: "Commerce",
    description: "A product preview dialog with variants and add to cart.",
    exports: ["QuickView", "useProductVariant", "toCartItem", "type QuickViewProduct"],
    controls: {
      closeOnAdd: { type: "boolean", default: false },
    },
    render: ({ closeOnAdd }) => <QuickViewExample closeOnAdd={closeOnAdd} />,
    code: ({ closeOnAdd }) =>
      `import { Button, CartProvider, QuickView } from "kitgrid"\nimport { useState } from "react"\n\n` +
      `const product = {\n  id: "overshirt",\n  title: "Linen Overshirt",\n  price: 98,\n  images: [],\n  options: [\n    { name: "Size", values: [{ value: "S", label: "S" }, { value: "M", label: "M" }, { value: "L", label: "L" }] },\n  ],\n  variants: [\n    { id: "s", options: { Size: "S" }, stock: 4 },\n    { id: "m", options: { Size: "M" }, stock: 8 },\n    { id: "l", options: { Size: "L" }, stock: 0 },\n  ],\n}\n\n` +
      `function Example() {\n  const [open, setOpen] = useState(false)\n  return (\n    <CartProvider>\n      <Button variant="outline" onClick={() => setOpen(true)}>Quick view</Button>\n      ` +
      indent(
        jsx(
          "QuickView",
          { product: raw("product"), open: raw("open"), onOpenChange: raw("setOpen"), closeOnAdd },
          undefined,
          { closeOnAdd: false },
        ),
        6,
      ) +
      `\n    </CartProvider>\n  )\n}\n\n<Example />`,
    accessibility: [
      "A modal dialog named by the product title and described by its description.",
      "Variant pickers are native radio groups; choosing a color with no stock in the current size switches to one that is in stock.",
      "Only one QuickView is needed per grid: swap the product and the last one stays rendered while the dialog animates out.",
    ],
  }),

  defineDemo({
    id: "checkout-steps",
    name: "Checkout Steps",
    category: "Commerce",
    description: "A checkout stepper with a compact mode.",
    exports: ["CheckoutSteps"],
    serverSafe: true,
    controls: {
      current: { type: "select", options: ["cart", "information", "shipping", "payment"], default: "shipping" },
      orientation: { type: "select", options: ["horizontal", "vertical"], default: "horizontal" },
      compact: { type: "select", options: ["auto", "always", "never"], default: "auto" },
    },
    render: ({ current, orientation, compact }) => (
      <div style={{ width: orientation === "vertical" ? 240 : 560, maxWidth: "100%" }}>
        <CheckoutSteps
          steps={steps}
          current={current}
          orientation={orientation}
          compact={compact === "always" ? true : compact === "never" ? false : "auto"}
        />
      </div>
    ),
    code: ({ current, orientation, compact }) =>
      `import { CheckoutSteps } from "kitgrid"\n\n${stepsCode}\n\n` +
      jsx(
        "CheckoutSteps",
        {
          steps: raw("steps"),
          current,
          orientation,
          compact: compact === "always" ? true : compact === "never" ? raw("false") : undefined,
        },
        undefined,
        { orientation: "horizontal" },
      ),
    accessibility: [
      'A navigation landmark (“Checkout progress”) around an ordered list; the current step has aria-current="step".',
      "Completed steps read “Cart, completed”; with onStepClick they become buttons.",
      'compact="auto" switches to “Step 3 of 4” with a progress bar through a container query.',
    ],
  }),

  defineDemo({
    id: "order-summary",
    name: "Order Summary",
    category: "Commerce",
    description: "Line items and totals that collapse on small screens.",
    exports: ["OrderSummary"],
    controls: {
      collapsible: { type: "select", options: ["mobile", "always", "never"], default: "never" },
      shipping: { type: "select", options: ["free", "paid", "pending"], default: "free" },
      discount: { type: "boolean", default: true },
      coupon: { type: "boolean", default: false },
    },
    render: ({ collapsible, shipping, discount, coupon }) => (
      <div style={{ width: 380, maxWidth: "100%" }}>
        <OrderSummary
          lines={summaryLines}
          collapsible={collapsible}
          discounts={discount ? [{ label: "WELCOME10", amount: 21.4 }] : []}
          shipping={shipping === "free" ? 0 : shipping === "paid" ? 8.5 : null}
          tax={14.6}
          coupon={coupon ? <CouponInput onApply={applyCoupon} size="sm" /> : undefined}
        />
      </div>
    ),
    code: ({ collapsible, shipping, discount, coupon }) =>
      `import { CouponInput, OrderSummary } from "kitgrid"\n\n${summaryLinesCode}\n\n` +
      `<div style={{ width: 380 }}>\n  ` +
      indent(
        jsx(
          "OrderSummary",
          {
            lines: raw("lines"),
            discounts: discount ? raw(`[{ label: "WELCOME10", amount: 21.4 }]`) : undefined,
            shipping: shipping === "free" ? 0 : shipping === "paid" ? 8.5 : raw("null"),
            tax: 14.6,
            collapsible,
            coupon: coupon
              ? raw(`<CouponInput size="sm" onApply={async (code) => ({ ok: code === "WELCOME10" })} />`)
              : undefined,
          },
          undefined,
          { collapsible: "mobile" },
        ),
        2,
      ) +
      `\n</div>`,
    accessibility: [
      "A region named by its “Order summary” heading; when collapsed, the toggle has aria-expanded and shows the total.",
      "Collapsed content leaves the tab order and the accessibility tree.",
      "Quantity badges are visual; each line also says “Quantity 2” for screen readers.",
    ],
  }),

  defineDemo({
    id: "price-range-slider",
    name: "Price Range Slider",
    category: "Commerce",
    description: "A two-thumb price filter with inputs.",
    exports: ["PriceRangeSlider"],
    controls: {
      histogram: { type: "boolean", default: true },
      inputs: { type: "boolean", default: true },
      currency: { type: "select", options: ["USD", "EUR", "GBP", "JPY"], default: "USD" },
      step: { type: "number", min: 1, max: 50, step: 1, default: 5 },
    },
    render: ({ histogram, inputs, currency, step }) => (
      <div style={{ width: 320, maxWidth: "100%" }}>
        <PriceRangeSlider
          key={currency}
          min={0}
          max={300}
          step={step}
          defaultValue={[40, 180]}
          currency={currency}
          histogram={histogram ? priceHistogram : undefined}
          inputs={inputs}
        />
      </div>
    ),
    code: ({ histogram, inputs, currency, step }) =>
      `import { PriceRangeSlider } from "kitgrid"\n\n` +
      `<div style={{ width: 320 }}>\n  ` +
      indent(
        jsx(
          "PriceRangeSlider",
          {
            min: 0,
            max: 300,
            step,
            defaultValue: raw("[40, 180]"),
            currency,
            histogram: histogram ? raw(JSON.stringify(priceHistogram).replace(/,/g, ", ")) : undefined,
            inputs: inputs ? undefined : raw("false"),
          },
          undefined,
          { step: 1, currency: "USD" },
        ),
        2,
      ) +
      `\n</div>`,
    accessibility: [
      "A group named “Price”; thumbs are APG sliders named “Minimum price” and “Maximum price” with aria-valuetext like “$40”.",
      "Inputs accept typing in the shopper's locale and validate on blur or Enter, never crossing the other thumb.",
      "onValueCommit fires once per gesture. Filter there, not on every drag frame.",
    ],
  }),

  defineDemo({
    id: "review-summary",
    name: "Review Summary",
    category: "Commerce",
    description: "Average score and a star distribution.",
    exports: ["ReviewSummary"],
    controls: {
      average: { type: "number", min: 1, max: 5, step: 0.1, default: 4.6 },
      writeReview: { type: "boolean", default: true, label: "Write a review" },
    },
    render: ({ average, writeReview }) => (
      <div style={{ width: 560, maxWidth: "100%" }}>
        <ReviewSummary
          average={average}
          count={1284}
          distribution={{ 5: 912, 4: 228, 3: 84, 2: 35, 1: 25 }}
          onWriteReview={writeReview ? () => undefined : undefined}
        />
      </div>
    ),
    code: ({ average, writeReview }) =>
      `import { ReviewSummary } from "kitgrid"\n\n` +
      jsx("ReviewSummary", {
        average,
        count: 1284,
        distribution: raw("{ 5: 912, 4: 228, 3: 84, 2: 35, 1: 25 }"),
        onWriteReview: writeReview ? raw(`() => console.log("Write a review")`) : undefined,
      }),
    accessibility: [
      "Each row has one complete name: “4 stars: 228 reviews, 18%”.",
      "With onFilter, rows are toggle buttons (aria-pressed); empty rows are disabled.",
      "The fill is a transform; under reduced motion it snaps.",
    ],
  }),
]
