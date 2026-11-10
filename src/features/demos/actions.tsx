import { Button, IconButton } from "kitgrid"
import { Heart, Plus, Share2, ShoppingBag } from "lucide-react"
import { defineDemo, jsx, raw } from "./registry"

const buttonDefaults = { variant: "solid", size: "md", loading: false, disabled: false }

export const demos = [
  defineDemo({
    id: "button",
    name: "Button",
    category: "Actions",
    description: "Six variants, three sizes and a stable loading state.",
    exports: ["Button"],
    serverSafe: true,
    controls: {
      variant: {
        type: "select",
        options: [
          "solid",
          "soft",
          "outline",
          "ghost",
          "danger",
          "link",
        ],
        default: "solid",
      },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      loading: { type: "boolean", default: false },
      disabled: { type: "boolean", default: false },
    },
    render: ({ variant, size, loading, disabled }) => (
      <Button
        variant={variant}
        size={size}
        loading={loading}
        disabled={disabled}
        leading={<ShoppingBag />}
      >
        Add to cart
      </Button>
    ),
    code: ({ variant, size, loading, disabled }) =>
      `import { Button } from "kitgrid"\nimport { ShoppingBag } from "lucide-react"\n\n` +
      jsx(
        "Button",
        {
          variant,
          size,
          loading,
          disabled,
          leading: raw("<ShoppingBag />"),
        },
        "Add to cart",
        buttonDefaults,
      ),
    accessibility: [
      'Renders a native <button type="button">, so Enter and Space work without extra code.',
      "loading sets aria-busy and disables the button; the label stays in the DOM and keeps its width.",
      "asChild forwards every prop and ref to the child, and uses aria-disabled where disabled can't apply.",
    ],
  }),
  defineDemo({
    id: "icon-button",
    name: "Icon Button",
    category: "Actions",
    description: "An icon control with a required accessible name.",
    exports: ["IconButton"],
    serverSafe: true,
    controls: {
      variant: {
        type: "select",
        options: ["solid", "soft", "outline", "ghost"],
        default: "outline",
      },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      round: { type: "boolean", default: false },
    },
    render: ({ variant, size, round }) => (
      <div style={{ display: "flex", gap: 8 }}>
        <IconButton
          label="Add"
          icon={<Plus />}
          variant={variant}
          size={size}
          round={round}
        />
        <IconButton
          label="Save"
          icon={<Heart />}
          variant={variant}
          size={size}
          round={round}
        />
        <IconButton
          label="Share"
          icon={<Share2 />}
          variant={variant}
          size={size}
          round={round}
        />
      </div>
    ),
    code: ({ variant, size, round }) => {
      const button = (label: string, icon: string) =>
        jsx("IconButton", { label, icon: raw(`<${icon} />`), variant, size, round }, undefined, {
          variant: "ghost",
          size: "md",
          round: false,
        }).replace(/\n/g, "\n  ")
      return (
        `import { IconButton } from "kitgrid"\nimport { Heart, Plus, Share2 } from "lucide-react"\n\n` +
        `<div style={{ display: "flex", gap: 8 }}>\n  ${button("Add", "Plus")}\n  ${button("Save", "Heart")}\n  ${button("Share", "Share2")}\n</div>`
      )
    },
    accessibility: [
      "label is a required prop and becomes aria-label, so an unnamed icon button fails to compile.",
      "Small sizes extend an invisible ::before to keep a 40 by 40px pointer target.",
    ],
  }),
]
