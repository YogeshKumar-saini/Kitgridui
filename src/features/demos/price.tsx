import { Price } from "kitgrid"
import { defineDemo, jsx, raw } from "./registry"

export const demos = [
  defineDemo({
    id: "price",
    name: "Price",
    category: "Commerce",
    description: "Locale-aware money with compare-at and savings.",
    exports: ["Price", "formatMoney"],
    serverSafe: true,
    controls: {
      amount: { type: "number", min: 1, max: 500, step: 0.5, default: 49.5 },
      compareAt: { type: "number", min: 0, max: 600, step: 1, default: 79 },
      currency: {
        type: "select",
        options: ["USD", "EUR", "INR", "JPY", "GBP"],
        default: "USD",
      },
      savings: {
        type: "select",
        options: ["percent", "amount", "none"],
        default: "percent",
      },
    },
    render: ({ amount, compareAt, currency, savings }) => (
      <Price
        amount={amount}
        compareAt={compareAt || undefined}
        currency={currency}
        size="lg"
        savings={savings === "none" ? false : savings}
      />
    ),
    code: ({ amount, compareAt, currency, savings }) =>
      `import { Price } from "kitgrid"\n\n` +
      jsx(
        "Price",
        {
          amount,
          compareAt: compareAt || undefined,
          currency,
          size: "lg",
          savings: savings === "none" ? raw("false") : savings,
        },
        undefined,
        { currency: "USD", size: "md", savings: "percent", superscript: false },
      ),
    accessibility: [
      "Reads as “Sale price $49.50, Regular price $79.00” rather than two bare numbers.",
      "The visual price is aria-hidden so superscript cents don't read as separate numbers.",
      "Formatting uses Intl.NumberFormat with cached formatters, so currency and locale are always correct.",
    ],
  }),
]
