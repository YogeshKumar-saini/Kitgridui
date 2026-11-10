import { SpotlightCard } from "kitgrid"
import { Ticket } from "lucide-react"
import { defineDemo, jsx } from "./registry"

export const demos = [
  defineDemo({
    id: "spotlight-card",
    name: "Spotlight Card",
    category: "Motion",
    description: "A paper sheet lit by a soft tint that tracks the pointer.",
    exports: ["SpotlightCard"],
    controls: {
      useAccent: { type: "boolean", default: true, label: "Use the sage paper tint" },
      color: { type: "color", default: "#4f7fd6" },
      radius: { type: "number", min: 120, max: 640, step: 20, default: 360 },
      border: { type: "boolean", default: true },
    },
    render: ({ color, useAccent, radius, border }) => (
      <SpotlightCard color={useAccent ? undefined : color} radius={radius} border={border} style={{ width: 320 }}>
        <Ticket aria-hidden style={{ color: "var(--kg-fg)" }} />
        <h3 style={{ margin: "12px 0 6px", fontSize: 18 }}>Early access</h3>
        <p style={{ margin: 0, color: "var(--kg-fg-muted)", lineHeight: 1.5 }}>Join 2,400 stores on the beta.</p>
      </SpotlightCard>
    ),
    code: ({ color, useAccent, radius, border }) =>
      `import { SpotlightCard } from "kitgrid"\nimport { Ticket } from "lucide-react"\n\n` +
      jsx(
        "SpotlightCard",
        { color: useAccent ? undefined : color, radius, border },
        `<Ticket aria-hidden />\n<h3>Early access</h3>\n<p>Join 2,400 stores on the beta.</p>`,
        { radius: 360, border: true },
      ),
    accessibility: [
      "Purely decorative: the light never carries meaning, and the border also lights on :focus-within for keyboard users.",
      "Pointer tracking is throttled to one style write per animation frame.",
    ],
  }),
]
