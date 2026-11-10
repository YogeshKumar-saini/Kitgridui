import type { ProductGalleryImage, QuickViewProduct, VariantOption } from "kitgrid"
import { skeleton } from "./skeleton"

export type CatalogCategory =
  "tops" | "outerwear" | "shoes" | "bags" | "home" | "accessories"

export interface CatalogProduct extends QuickViewProduct {
  category: CatalogCategory
  /** Index into `images` shown on card hover. */
  hoverImage?: number
  isNew?: boolean
  /** Higher sorts first under "Featured". */
  featured: number
}

const photo = (id: string, alt: string): ProductGalleryImage => ({
  src: skeleton(id),
  thumbnail: skeleton(id, 200, 250),
  zoomSrc: skeleton(id, 1600, 2000),
  alt,
  width: 800,
  height: 1000,
})

const sizes = (values: string[]): VariantOption[] =>
  values.map((value) => ({ value, label: value }))

/** Every color × size, with stock from a compact table (rows = colors, columns = sizes). */
const grid = (
  prefix: string,
  colors: string[],
  sizeValues: string[],
  stock: number[][],
  image: (color: string) => number = (color) => colors.indexOf(color),
) =>
  colors.flatMap((color, row) =>
    sizeValues.map((size, column) => ({
      id: `${prefix}-${color}-${size}`.toLowerCase(),
      options: { Color: color, Size: size },
      stock: stock[row]?.[column] ?? 0,
      image: image(color),
    })),
  )

export const catalog: CatalogProduct[] = [
  {
    id: "linen-overshirt",
    title: "Washed Linen Overshirt",
    vendor: "Atelier Nord",
    category: "tops",
    featured: 10,
    isNew: true,
    description:
      "Garment-washed European flax with a relaxed, boxy cut. Corozo buttons, a single chest pocket and a curved hem that works tucked or loose.",
    price: 98,
    compareAt: 128,
    rating: 4.8,
    reviewCount: 412,
    href: "/storefront",
    images: [
      photo(
        "1596755094514-f87e34085b2c",
        "Chambray-blue linen overshirt on a wooden hanger",
      ),
      photo(
        "1602810318383-e386cc2a3ccf",
        "Three overshirts in slate, ecru and oxblood laid flat on oak",
      ),
      photo(
        "1490481651871-ab68de25d43d",
        "Overshirts hanging on a rail in natural tones",
      ),
    ],
    hoverImage: 1,
    options: [
      {
        name: "Color",
        type: "swatch",
        values: [
          { value: "chambray", label: "Chambray", color: "oklch(0.58 0.06 245)" },
          { value: "ecru", label: "Ecru", color: "oklch(0.93 0.02 85)" },
          { value: "oxblood", label: "Oxblood", color: "oklch(0.36 0.1 15)" },
        ],
      },
      { name: "Size", values: sizes(["XS", "S", "M", "L", "XL"]) },
    ],
    variants: grid(
      "overshirt",
      ["chambray", "ecru", "oxblood"],
      ["XS", "S", "M", "L", "XL"],
      [
        [4, 12, 3, 0, 6],
        [0, 8, 14, 9, 2],
        [2, 0, 1, 5, 0],
      ],
      (color) => (color === "chambray" ? 0 : 1),
    ),
  },
  {
    id: "merino-crew",
    title: "Fine Merino Crew",
    vendor: "Atelier Nord",
    category: "tops",
    featured: 9,
    description:
      "18.5-micron extrafine merino, knitted seamlessly so there is nothing to itch. Breathable in spring, warm in winter, machine washable.",
    price: 120,
    rating: 4.6,
    reviewCount: 286,
    images: [
      photo(
        "1578587018452-892bacefd3f2",
        "Model in a marigold merino crew sweater and jeans",
      ),
      photo(
        "1490481651871-ab68de25d43d",
        "Knitwear in oat and charcoal on a clothing rail",
      ),
    ],
    hoverImage: 1,
    options: [
      {
        name: "Color",
        type: "swatch",
        values: [
          { value: "marigold", label: "Marigold", color: "oklch(0.74 0.15 60)" },
          { value: "oat", label: "Oat", color: "oklch(0.88 0.03 80)" },
          { value: "charcoal", label: "Charcoal", color: "oklch(0.32 0.01 270)" },
          { value: "forest", label: "Forest", color: "oklch(0.42 0.07 155)" },
        ],
      },
      { name: "Size", values: sizes(["S", "M", "L", "XL"]) },
    ],
    variants: grid(
      "merino",
      ["marigold", "oat", "charcoal", "forest"],
      ["S", "M", "L", "XL"],
      [
        [6, 9, 4, 1],
        [3, 0, 7, 2],
        [10, 12, 8, 6],
        [0, 2, 0, 0],
      ],
      (color) => (color === "marigold" ? 0 : 1),
    ),
  },
  {
    id: "canvas-tote",
    title: "Waxed Canvas Tote",
    vendor: "Field Supply",
    category: "bags",
    featured: 7,
    description:
      "16 oz organic cotton canvas, waxed by hand to shrug off rain. Fits a 16″ laptop, with an inner zip pocket for keys.",
    price: 58,
    rating: 4.9,
    reviewCount: 1038,
    images: [
      photo("1544816155-12df9643f363", "Tan waxed canvas tote bag standing upright"),
    ],
    options: [],
    variants: [{ id: "tote-natural", options: {}, stock: 34 }],
  },
  {
    id: "court-sneaker",
    title: "Leather Court Sneaker",
    vendor: "Maison Pas",
    category: "shoes",
    featured: 8,
    isNew: true,
    description:
      "Full-grain Italian leather on a stitched natural-rubber cupsole. Cushioned cork footbed that moulds to your foot in a week.",
    price: 145,
    compareAt: 180,
    rating: 4.7,
    reviewCount: 534,
    images: [
      photo(
        "1608231387042-66d1773070a5",
        "White leather court sneaker on a black background",
      ),
      photo("1549298916-b41d501d3772", "Tan leather sneaker resting on ochre fabric"),
      photo(
        "1600185365483-26d7a4cc7519",
        "Sneaker with a sunset-orange sole floating on grey",
      ),
    ],
    hoverImage: 1,
    options: [
      {
        name: "Color",
        type: "swatch",
        values: [
          { value: "white", label: "Chalk", color: "oklch(0.97 0.005 90)" },
          { value: "tan", label: "Tan", color: "oklch(0.68 0.09 65)" },
          { value: "ember", label: "Ember", color: "oklch(0.68 0.17 40)" },
        ],
      },
      { name: "Size", values: sizes(["39", "40", "41", "42", "43", "44", "45"]) },
    ],
    variants: grid(
      "court",
      ["white", "tan", "ember"],
      ["39", "40", "41", "42", "43", "44", "45"],
      [
        [3, 6, 9, 12, 5, 2, 0],
        [0, 2, 4, 1, 0, 3, 1],
        [1, 0, 0, 2, 4, 0, 0],
      ],
    ),
  },
  {
    id: "mug-set",
    title: "Stoneware Mug Set",
    vendor: "Kiln & Co",
    category: "home",
    featured: 6,
    description:
      "Four wheel-thrown stoneware mugs in a speckled oat glaze. Each one is slightly different, and that is the point. Dishwasher safe.",
    price: 64,
    compareAt: 80,
    rating: 4.9,
    reviewCount: 198,
    images: [
      photo(
        "1610701596007-11502861dcfa",
        "Stacked speckled stoneware cups in cream and sand",
      ),
      photo(
        "1514228742587-6b1558fcca3d",
        "A single white stoneware mug on a pale table",
      ),
    ],
    hoverImage: 1,
    options: [
      {
        name: "Set",
        values: [
          { value: "2", label: "Set of 2" },
          { value: "4", label: "Set of 4" },
        ],
      },
    ],
    variants: [
      { id: "mug-2", options: { Set: "2" }, stock: 14, price: 36, compareAt: 44 },
      { id: "mug-4", options: { Set: "4" }, stock: 3 },
    ],
  },
  {
    id: "bomber",
    title: "Recycled Nylon Bomber",
    vendor: "Field Supply",
    category: "outerwear",
    featured: 5,
    description:
      "A water-repellent shell spun from recycled fishing nets, lined in brushed cotton. Rib-knit cuffs and a two-way zip.",
    price: 210,
    rating: 4.5,
    reviewCount: 87,
    images: [
      photo("1591047139829-d91aecb6caea", "Rust bomber jacket held up on a hanger"),
      photo("1490481651871-ab68de25d43d", "Jackets and shirts on a rail"),
    ],
    hoverImage: 1,
    options: [
      {
        name: "Color",
        type: "swatch",
        values: [
          { value: "rust", label: "Rust", color: "oklch(0.58 0.12 45)" },
          { value: "olive", label: "Olive", color: "oklch(0.5 0.06 120)" },
        ],
      },
      { name: "Size", values: sizes(["S", "M", "L", "XL"]) },
    ],
    variants: grid(
      "bomber",
      ["rust", "olive"],
      ["S", "M", "L", "XL"],
      [
        [2, 4, 0, 1],
        [0, 0, 0, 0],
      ],
      () => 0,
    ),
  },
  {
    id: "heavy-tee",
    title: "Heavyweight Pocket Tee",
    vendor: "Atelier Nord",
    category: "tops",
    featured: 4,
    description:
      "260 gsm organic cotton jersey, pre-shrunk and garment-dyed. Dense enough to hold its shape, soft from the first wear.",
    price: 42,
    rating: 4.4,
    reviewCount: 1520,
    images: [
      photo("1521572163474-6864f9cf17ab", "Model wearing a white heavyweight tee"),
      photo("1583743814966-8936f5b7be1a", "Black heavyweight tee on a wooden hanger"),
      photo(
        "1529374255404-311a2a4f1fd9",
        "Close-up of the white tee's collar and fabric",
      ),
    ],
    hoverImage: 2,
    options: [
      {
        name: "Color",
        type: "swatch",
        values: [
          { value: "white", label: "Optic white", color: "oklch(0.98 0 0)" },
          { value: "black", label: "Black", color: "oklch(0.2 0 0)" },
        ],
      },
      { name: "Size", values: sizes(["XS", "S", "M", "L", "XL", "XXL"]) },
    ],
    variants: grid(
      "tee",
      ["white", "black"],
      ["XS", "S", "M", "L", "XL", "XXL"],
      [
        [12, 30, 44, 28, 9, 4],
        [8, 22, 0, 16, 7, 0],
      ],
    ),
  },
  {
    id: "leather-backpack",
    title: "Roll-Top Leather Backpack",
    vendor: "Maison Pas",
    category: "bags",
    featured: 3,
    description:
      "Vegetable-tanned leather that darkens beautifully with use. Padded laptop sleeve, magnetic roll-top and a lifetime repair promise.",
    price: 265,
    compareAt: 320,
    rating: 4.8,
    reviewCount: 143,
    images: [
      photo(
        "1622560480605-d83c853bc5c3",
        "Clay-red leather backpack on a blush backdrop",
      ),
      photo("1553062407-98eeb64c6a62", "Navy backpack standing on a white floor"),
    ],
    hoverImage: 1,
    options: [
      {
        name: "Color",
        type: "swatch",
        values: [
          { value: "clay", label: "Clay", color: "oklch(0.55 0.1 30)" },
          { value: "navy", label: "Navy", color: "oklch(0.3 0.06 260)" },
        ],
      },
    ],
    variants: [
      { id: "pack-clay", options: { Color: "clay" }, stock: 2, image: 0 },
      { id: "pack-navy", options: { Color: "navy" }, stock: 11, image: 1 },
    ],
  },
  {
    id: "round-sunglasses",
    title: "Round Titanium Sunglasses",
    vendor: "Lumen Optics",
    category: "accessories",
    featured: 2,
    isNew: true,
    description:
      "Featherweight titanium frames with polarised mineral-glass lenses. Made in Japan, 100% UV protection.",
    price: 175,
    rating: 4.6,
    reviewCount: 64,
    images: [
      photo(
        "1511499767150-a48a237f0083",
        "Gold round sunglasses with green lenses on white",
      ),
      photo("1572635196237-14b3f281503f", "Black acetate sunglasses on white"),
    ],
    hoverImage: 1,
    options: [
      {
        name: "Frame",
        type: "swatch",
        values: [
          { value: "gold", label: "Gold / Green", color: "oklch(0.8 0.1 85)" },
          { value: "black", label: "Black / Grey", color: "oklch(0.22 0 0)" },
        ],
      },
    ],
    variants: [
      { id: "sun-gold", options: { Frame: "gold" }, stock: 7, image: 0 },
      { id: "sun-black", options: { Frame: "black" }, stock: 0, image: 1 },
    ],
  },
  {
    id: "fleece-hoodie",
    title: "Loopback Fleece Hoodie",
    vendor: "Field Supply",
    category: "tops",
    featured: 1,
    description:
      "Brushed loopback cotton with a double-layer hood and flatlock seams. The hoodie you will reach for every Sunday.",
    price: 88,
    rating: 4.3,
    reviewCount: 356,
    images: [
      photo(
        "1556821840-3a63f95609a7",
        "Person seen from behind wearing a heather-grey hoodie",
      ),
    ],
    options: [
      {
        name: "Size",
        values: sizes(["S", "M", "L", "XL"]),
      },
    ],
    variants: [
      { id: "hoodie-s", options: { Size: "S" }, stock: 0 },
      { id: "hoodie-m", options: { Size: "M" }, stock: 0 },
      { id: "hoodie-l", options: { Size: "L" }, stock: 0 },
      { id: "hoodie-xl", options: { Size: "XL" }, stock: 0 },
    ],
  },
]

export const categoryLabels: Record<CatalogCategory, string> = {
  tops: "Tops",
  outerwear: "Outerwear",
  shoes: "Shoes",
  bags: "Bags",
  home: "Home",
  accessories: "Accessories",
}

export const totalStock = (product: QuickViewProduct): number =>
  product.variants.reduce((sum, variant) => sum + variant.stock, 0)

/** The cheapest SKU's price and its compare-at, so a card's "from" price and badge agree. */
export const fromPricing = (
  product: QuickViewProduct,
): { price: number; compareAt?: number } =>
  product.variants.reduce<{ price: number; compareAt?: number }>(
    (best, variant) =>
      (variant.price ?? product.price) < best.price
        ? { price: variant.price ?? product.price, compareAt: variant.compareAt }
        : best,
    { price: product.price, compareAt: product.compareAt },
  )

export const fromPrice = (product: QuickViewProduct): number =>
  fromPricing(product).price

export const swatchesOf = (product: QuickViewProduct) =>
  product.options
    .find((option) => option.type === "swatch")
    ?.values.map((value) => ({
      label: value.label,
      color: value.color ?? "transparent",
    }))
