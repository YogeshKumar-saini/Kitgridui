import {
  AnnouncementBar,
  Countdown,
  CouponInput,
  DeliveryEstimate,
  type FilterChipOption,
  FilterChips,
  FreeShippingProgress,
  QuantityStepper,
  Rating,
  StockIndicator,
  type VariantOption,
  VariantPicker,
  WishlistButton,
} from "kitgrid"
import { useState } from "react"
import { defineDemo, jsx, raw } from "./registry"
import { indent } from "./commerce-code"

/* Shared data -------------------------------------------------------------- */

const colors: VariantOption[] = [
  { value: "sage", label: "Sage", color: "oklch(0.72 0.06 150)" },
  { value: "sand", label: "Sand", color: "oklch(0.86 0.045 80)" },
  { value: "clay", label: "Clay", color: "oklch(0.62 0.11 40)", available: false },
  { value: "ink", label: "Ink", color: "oklch(0.28 0.04 265)" },
]

const sizes: VariantOption[] = [
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL", available: false },
]

const finishes: VariantOption[] = [
  { value: "oak", label: "Oak" },
  { value: "walnut", label: "Walnut" },
  { value: "ash", label: "Ash" },
  { value: "black", label: "Black", available: false },
]

const pickerSource = {
  swatch: {
    label: "Color",
    value: "sage",
    options: colors,
    code: `const options = [\n  { value: "sage", label: "Sage", color: "oklch(0.72 0.06 150)" },\n  { value: "sand", label: "Sand", color: "oklch(0.86 0.045 80)" },\n  { value: "clay", label: "Clay", color: "oklch(0.62 0.11 40)", available: false },\n  { value: "ink", label: "Ink", color: "oklch(0.28 0.04 265)" },\n]`,
  },
  chip: {
    label: "Size",
    value: "M",
    options: sizes,
    code: `const options = [\n  { value: "S", label: "S" },\n  { value: "M", label: "M" },\n  { value: "L", label: "L" },\n  { value: "XL", label: "XL", available: false },\n]`,
  },
  image: {
    label: "Finish",
    value: "oak",
    options: finishes,
    code: `const options = [\n  { value: "oak", label: "Oak" },\n  { value: "walnut", label: "Walnut" },\n  { value: "ash", label: "Ash" },\n  { value: "black", label: "Black", available: false },\n]`,
  },
} as const

const materials: FilterChipOption[] = [
  { value: "linen", label: "Linen", count: 48 },
  { value: "cotton", label: "Cotton", count: 112 },
  { value: "merino", label: "Merino", count: 36 },
  { value: "recycled", label: "Recycled", count: 21 },
  { value: "cashmere", label: "Cashmere", count: 0, disabled: true },
]

const materialsCode = `const materials = [\n  { value: "linen", label: "Linen", count: 48 },\n  { value: "cotton", label: "Cotton", count: 112 },\n  { value: "merino", label: "Merino", count: 36 },\n  { value: "recycled", label: "Recycled", count: 21 },\n  { value: "cashmere", label: "Cashmere", count: 0, disabled: true },\n]`

const announcements = ["Free shipping on orders over $75", "The linen edit is here", "30-day free returns"]

const applyCoupon = async (code: string) => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return code.trim().toUpperCase() === "WELCOME10"
    ? { ok: true, message: "You saved $12.40" }
    : { ok: false }
}

function CountdownDemo({
  variant,
  hours,
  size,
}: {
  variant: "inline" | "blocks"
  hours: number
  size: "sm" | "md" | "lg"
}) {
  const [start] = useState(() => Date.now())
  return (
    <Countdown
      endsAt={start + hours * 3_600_000 + 14 * 60_000 + 9_000}
      variant={variant}
      size={size}
      expiredLabel="This sale has ended"
    />
  )
}

/* Demos ------------------------------------------------------------------- */

export const demos = [
  defineDemo({
    id: "rating",
    name: "Rating",
    category: "Commerce",
    description: "Fractional stars for display, or a star input.",
    exports: ["Rating"],
    serverSafe: true,
    controls: {
      value: { type: "number", min: 0, max: 5, step: 0.1, default: 4.6 },
      count: { type: "number", min: 0, max: 5000, step: 1, default: 1284 },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      showValue: { type: "boolean", default: true },
    },
    render: ({ value, count, size, showValue }) => (
      <Rating value={value} count={count || undefined} size={size} showValue={showValue} />
    ),
    code: ({ value, count, size, showValue }) =>
      `import { Rating } from "kitgrid"\n\n` +
      jsx(
        "Rating",
        { value, count: count || undefined, size, showValue },
        undefined,
        { size: "md", showValue: false },
      ),
    accessibility: [
      "Display mode reads one sentence: “4.6 out of 5 stars, 1,284 reviews”; the stars are aria-hidden.",
      "Input mode (onValueChange) is a fieldset of native radios: Arrow keys move and select, each radio is named “4 stars”.",
      "Hover preview only follows a mouse, so touch never leaves a sticky preview.",
    ],
  }),

  defineDemo({
    id: "quantity-stepper",
    name: "Quantity Stepper",
    category: "Commerce",
    description: "A spinbutton with hold-to-repeat and rolling digits.",
    exports: ["QuantityStepper"],
    controls: {
      variant: { type: "select", options: ["outline", "soft"], default: "outline" },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      max: { type: "number", min: 1, max: 99, step: 1, default: 10 },
      removable: { type: "boolean", default: true },
    },
    render: ({ variant, size, max, removable }) => (
      <QuantityStepper
        label="Linen shirt"
        defaultValue={2}
        variant={variant}
        size={size}
        max={max}
        onRemove={removable ? () => {} : undefined}
      />
    ),
    code: ({ variant, size, max, removable }) =>
      `import { QuantityStepper } from "kitgrid"\nimport { useState } from "react"\n\n` +
      `function Example() {\n  const [quantity, setQuantity] = useState(2)\n  return (\n    ` +
      indent(
        jsx(
          "QuantityStepper",
          {
            label: "Linen shirt",
            value: raw("quantity"),
            onValueChange: raw("setQuantity"),
            onRemove: removable ? raw("() => setQuantity(1)") : undefined,
            variant,
            size,
            max,
          },
          undefined,
          { variant: "outline", size: "md" },
        ),
        4,
      ) +
      `\n  )\n}\n\n<Example />`,
    accessibility: [
      "role=spinbutton with aria-valuenow/min/max: ↑/↓ step, PageUp/PageDown step ×10, Home/End jump to the bounds.",
      "Buttons carry the product name (“Decrease quantity of Linen shirt”) and become aria-disabled at a bound, so focus is never dropped mid-hold.",
      "onValueCommit fires once per gesture; sync the cart there. Digits snap under reduced motion.",
    ],
  }),

  defineDemo({
    id: "variant-picker",
    name: "Variant Picker",
    category: "Commerce",
    description: "Swatches, chips or image tiles with sold-out states.",
    exports: ["VariantPicker", "resolveVariantAvailability", "findVariant", "withVariantAvailability"],
    controls: {
      type: { type: "select", options: ["swatch", "chip", "image"], default: "swatch" },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      allowUnavailable: { type: "boolean", default: false },
    },
    render: ({ type, size, allowUnavailable }) => {
      const source = pickerSource[type]
      return (
        <VariantPicker
          key={type}
          label={source.label}
          type={type}
          options={source.options}
          defaultValue={source.value}
          size={size}
          allowUnavailable={allowUnavailable}
        />
      )
    },
    code: ({ type, size, allowUnavailable }) => {
      const source = pickerSource[type]
      return (
        `import { VariantPicker } from "kitgrid"\n\n${source.code}\n\n` +
        jsx(
          "VariantPicker",
          {
            label: source.label,
            type,
            options: raw("options"),
            defaultValue: source.value,
            size,
            allowUnavailable,
          },
          undefined,
          { type: "chip", size: "md" },
        )
      )
    },
    accessibility: [
      "A fieldset with a legend (“Color”); every option is a native radio, so Arrow keys move and select.",
      "Sold-out options are struck through (never color alone) and disabled unless allowUnavailable.",
      "resolveVariantAvailability checks each value against the other selections, so shoppers can switch color without clearing size.",
    ],
  }),

  defineDemo({
    id: "wishlist-button",
    name: "Wishlist Button",
    category: "Commerce",
    description: "A heart toggle with a fill and burst.",
    exports: ["WishlistButton"],
    controls: {
      variant: { type: "select", options: ["floating", "inline"], default: "floating" },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
    },
    render: ({ variant, size }) =>
      variant === "floating" ? (
        <div
          style={{
            position: "relative",
            width: 200,
            aspectRatio: "4 / 5",
            borderRadius: "var(--kg-radius-xl)",
            background: "var(--kg-muted)",
          }}
        >
          <WishlistButton size={size} style={{ position: "absolute", top: 12, right: 12 }} />
        </div>
      ) : (
        <WishlistButton variant="inline" size={size} />
      ),
    code: ({ variant, size }) =>
      `import { WishlistButton } from "kitgrid"\n\n` +
      (variant === "floating"
        ? `<div style={{ position: "relative", width: 200, aspectRatio: "4 / 5", background: "var(--kg-muted)" }}>\n  ` +
          jsx(
            "WishlistButton",
            { size, style: raw(`{ position: "absolute", top: 12, right: 12 }`) },
            undefined,
            { size: "md" },
          ) +
          `\n</div>`
        : jsx("WishlistButton", { variant, size }, undefined, { size: "md" })),
    accessibility: [
      "A toggle button with aria-pressed and a stable name (“Add to wishlist”).",
      "Each change is announced politely: “Added to wishlist” or “Removed from wishlist”.",
      "The burst plays only on user activation; under reduced motion only the fill changes.",
    ],
  }),

  defineDemo({
    id: "stock-indicator",
    name: "Stock Indicator",
    category: "Commerce",
    description: "Availability as a dot, words and a scarcity bar.",
    exports: ["StockIndicator", "getStockStatus"],
    serverSafe: true,
    controls: {
      quantity: { type: "number", min: 0, max: 30, step: 1, default: 3 },
      status: {
        type: "select",
        options: ["auto", "in-stock", "low-stock", "out-of-stock", "backorder", "preorder"],
        default: "auto",
      },
      showBar: { type: "boolean", default: true },
      size: { type: "select", options: ["sm", "md"], default: "md" },
    },
    render: ({ quantity, status, showBar, size }) => (
      <StockIndicator
        quantity={quantity}
        status={status === "auto" ? undefined : status}
        showBar={showBar}
        size={size}
      />
    ),
    code: ({ quantity, status, showBar, size }) =>
      `import { StockIndicator } from "kitgrid"\n\n` +
      jsx(
        "StockIndicator",
        { quantity, status: status === "auto" ? undefined : status, showBar, size },
        undefined,
        { showBar: false, size: "md" },
      ),
    accessibility: [
      "Status is always written out (“Only 3 left”), so the dot's color is never the only signal.",
      "The scarcity bar is aria-hidden; the low-stock pulse is removed under reduced motion.",
    ],
  }),

  defineDemo({
    id: "countdown",
    name: "Countdown",
    category: "Commerce",
    description: "A sale timer, inline or as rolling tiles.",
    exports: ["Countdown", "getCountdownParts"],
    controls: {
      variant: { type: "select", options: ["inline", "blocks"], default: "blocks" },
      hours: { type: "number", min: 0, max: 72, step: 1, default: 26 },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
    },
    render: ({ variant, hours, size }) => (
      <CountdownDemo variant={variant} hours={hours} size={size} />
    ),
    code: ({ variant, size }) =>
      `import { Countdown } from "kitgrid"\n\n` +
      jsx(
        "Countdown",
        { endsAt: "2026-11-27T08:00:00Z", variant, size, expiredLabel: "This sale has ended" },
        undefined,
        { variant: "inline", size: "md" },
      ),
    accessibility: [
      "role=timer. Digits are aria-hidden; screen readers get “Ends in 1 day, 2 hours, 14 minutes”, updated at most once a minute.",
      "Server and first client render show “--” placeholders with the same layout, so hydration never mismatches.",
      "Ticks pause in hidden tabs; onComplete fires once, even when the end is already past.",
    ],
  }),

  defineDemo({
    id: "free-shipping-progress",
    name: "Free Shipping Progress",
    category: "Commerce",
    description: "Progress toward a free-shipping threshold.",
    exports: ["FreeShippingProgress"],
    serverSafe: true,
    controls: {
      subtotal: { type: "number", min: 0, max: 120, step: 0.5, default: 62.6 },
      threshold: { type: "number", min: 10, max: 150, step: 5, default: 75 },
      currency: { type: "select", options: ["USD", "EUR", "GBP", "INR", "JPY"], default: "USD" },
      size: { type: "select", options: ["sm", "md"], default: "md" },
    },
    render: ({ subtotal, threshold, currency, size }) => (
      <div style={{ width: "min(100%, 360px)" }}>
        <FreeShippingProgress subtotal={subtotal} threshold={threshold} currency={currency} size={size} />
      </div>
    ),
    code: ({ subtotal, threshold, currency, size }) =>
      `import { FreeShippingProgress } from "kitgrid"\n\n` +
      jsx("FreeShippingProgress", { subtotal, threshold, currency, size }, undefined, {
        currency: "USD",
        size: "md",
      }),
    accessibility: [
      "role=progressbar named “Free shipping progress” with aria-valuetext “$12.40 away from free shipping”.",
      "The message is a polite live region, so adding an item announces the new remaining amount.",
    ],
  }),

  defineDemo({
    id: "coupon-input",
    name: "Coupon Input",
    category: "Commerce",
    description: "A discount-code field with async validation; try WELCOME10.",
    exports: ["CouponInput"],
    controls: {
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      showLabel: { type: "boolean", default: false },
      disabled: { type: "boolean", default: false },
    },
    render: ({ size, showLabel, disabled }) => (
      <div style={{ width: "min(100%, 360px)" }}>
        <CouponInput onApply={applyCoupon} size={size} showLabel={showLabel} disabled={disabled} />
      </div>
    ),
    code: ({ size, showLabel, disabled }) =>
      `import { CouponInput } from "kitgrid"\n\n` +
      jsx(
        "CouponInput",
        {
          onApply: raw(
            `async (code) =>\n    code === "WELCOME10" ? { ok: true, message: "You saved $12.40" } : { ok: false }`,
          ),
          size,
          showLabel,
          disabled,
        },
        undefined,
        { size: "md" },
      ),
    accessibility: [
      "Labelled text field; Enter applies and never submits a surrounding checkout form.",
      "While applying, the button is aria-busy and focus returns to the field afterwards.",
      "Errors set aria-invalid and aria-describedby; results are announced through a polite status region.",
    ],
  }),

  defineDemo({
    id: "announcement-bar",
    name: "Announcement Bar",
    category: "Commerce",
    description: "Rotating site-wide promos with pause and dismiss.",
    exports: ["AnnouncementBar"],
    layout: "fill",
    controls: {
      tone: { type: "select", options: ["accent", "neutral", "inverse"], default: "accent" },
      autoPlay: { type: "boolean", default: true },
      dismissible: { type: "boolean", default: true },
    },
    render: ({ tone, autoPlay, dismissible }) => (
      <div style={{ width: "100%" }}>
        <AnnouncementBar
          key={`${autoPlay}-${dismissible}`}
          tone={tone}
          autoPlay={autoPlay}
          dismissible={dismissible}
          messages={announcements}
        />
      </div>
    ),
    code: ({ tone, autoPlay, dismissible }) =>
      `import { AnnouncementBar } from "kitgrid"\n\n` +
      jsx(
        "AnnouncementBar",
        {
          tone,
          autoPlay,
          dismissible,
          messages: raw(JSON.stringify(announcements).replace(/","/g, `", "`)),
        },
        undefined,
        { tone: "accent", autoPlay: true },
      ),
    accessibility: [
      "APG carousel: a region with aria-roledescription=carousel; each message is a group named “2 of 3”.",
      "A visible pause control comes first (WCAG 2.2.2). Rotation also pauses on hover, on focus and in hidden tabs.",
      "Under reduced motion nothing auto-rotates; previous and next still work.",
    ],
  }),

  defineDemo({
    id: "filter-chips",
    name: "Filter Chips",
    category: "Commerce",
    description: "Collection filters as toggle chips with counts.",
    exports: ["FilterChips"],
    controls: {
      selectionMode: { type: "select", options: ["multiple", "single"], default: "multiple" },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      maxVisible: { type: "number", min: 0, max: 5, step: 1, default: 0 },
    },
    render: ({ selectionMode, size, maxVisible }) => (
      <div style={{ maxWidth: 520 }}>
        <FilterChips
          key={selectionMode}
          label="Material"
          selectionMode={selectionMode}
          size={size}
          maxVisible={maxVisible || undefined}
          defaultValue={["linen"]}
          options={materials}
        />
      </div>
    ),
    code: ({ selectionMode, size, maxVisible }) =>
      `import { FilterChips } from "kitgrid"\n\n${materialsCode}\n\n` +
      jsx(
        "FilterChips",
        {
          label: "Material",
          options: raw("materials"),
          defaultValue: raw(`["linen"]`),
          selectionMode,
          maxVisible: maxVisible || undefined,
          size,
        },
        undefined,
        { selectionMode: "multiple", size: "md" },
      ),
    accessibility: [
      "A group named by label; every chip is a native button with aria-pressed.",
      "Counts are part of the name: “Linen, 48 results”.",
      "“+N more” is a disclosure with aria-expanded; Clear all moves focus to the first chip.",
    ],
  }),

  defineDemo({
    id: "delivery-estimate",
    name: "Delivery Estimate",
    category: "Commerce",
    description: "Order-by cutoffs and arrival dates, business-day aware.",
    exports: ["DeliveryEstimate", "getDeliveryEstimate"],
    controls: {
      variant: { type: "select", options: ["compact", "detailed"], default: "detailed" },
      minDays: { type: "number", min: 0, max: 10, step: 1, default: 2 },
      maxDays: { type: "number", min: 0, max: 14, step: 1, default: 4 },
      cutoff: { type: "text", default: "18:00" },
    },
    render: ({ variant, minDays, maxDays, cutoff }) => (
      <div style={{ width: "min(100%, 380px)" }}>
        <DeliveryEstimate
          variant={variant}
          minDays={minDays}
          maxDays={Math.max(minDays, maxDays)}
          cutoff={cutoff || undefined}
        />
      </div>
    ),
    code: ({ variant, minDays, maxDays, cutoff }) =>
      `import { DeliveryEstimate } from "kitgrid"\n\n` +
      jsx(
        "DeliveryEstimate",
        {
          variant,
          minDays,
          maxDays: Math.max(minDays, maxDays),
          cutoff: cutoff || undefined,
          timeZone: "America/New_York",
        },
        undefined,
        { variant: "compact" },
      ),
    accessibility: [
      "Plain text: “Order within 3h 12m to get it by Wed, Oct 28”, without a live region, so minute ticks are not re-announced.",
      "Without now, the server renders a placeholder and the estimate is computed after mount.",
      "The detailed timeline is an ordered list named “Delivery timeline”.",
    ],
  }),
]
