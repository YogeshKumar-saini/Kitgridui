import {
  Alert,
  Button,
  Card,
  Progress,
  ProgressRing,
  Skeleton,
  SkeletonGroup,
  Spinner,
} from "kitgrid"
import { useState } from "react"
import { defineDemo, jsx, raw } from "./registry"

const indent = (code: string, by = "  ") => code.replace(/\n/g, `\n${by}`)

const DismissibleAlert = ({
  tone,
  variant,
  actions,
}: {
  tone: "info" | "success" | "warning" | "danger" | "neutral"
  variant: "soft" | "outline" | "solid"
  actions: boolean
}) => {
  const [open, setOpen] = useState(true)
  return open ? (
    <Alert
      style={{ width: 440, maxWidth: "100%" }}
      tone={tone}
      variant={variant}
      title="Low stock on 3 products"
      onDismiss={() => setOpen(false)}
      actions={
        actions ? (
          <Button size="sm" variant={variant === "solid" ? "outline" : "solid"}>
            Reorder
          </Button>
        ) : undefined
      }
    >
      They sell out this week.
    </Alert>
  ) : (
    <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
      Show alert
    </Button>
  )
}

export const demos = [
  defineDemo({
    id: "skeleton",
    name: "Skeleton",
    category: "Feedback",
    description: "Placeholders that hold the layout while loading.",
    exports: ["Skeleton", "SkeletonGroup"],
    serverSafe: true,
    controls: {
      animation: {
        type: "select",
        options: ["shimmer", "pulse", "none"],
        default: "shimmer",
      },
      lines: { type: "number", min: 1, max: 4, step: 1, default: 2 },
      avatar: { type: "boolean", default: true },
      media: { type: "boolean", default: true },
    },
    render: ({ animation, lines, avatar, media }) => (
      <SkeletonGroup label="Loading product" style={{ width: 300 }}>
        <Card style={{ display: "grid", gap: 16 }}>
          {media && <Skeleton shape="rect" height={140} animation={animation} />}
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            {avatar && <Skeleton shape="circle" width={40} animation={animation} />}
            <div style={{ display: "grid", flex: 1, gap: 10 }}>
              <Skeleton width="55%" height={14} animation={animation} />
              <Skeleton lines={lines} animation={animation} />
            </div>
          </div>
        </Card>
      </SkeletonGroup>
    ),
    code: ({ animation, lines, avatar, media }) => {
      const a = (props: Record<string, unknown>) =>
        jsx("Skeleton", { ...props, animation }, undefined, { animation: "shimmer" })
      const row = [
        avatar ? a({ shape: "circle", width: 40 }) : "",
        `<div style={{ display: "grid", flex: 1, gap: 10 }}>\n  ${a({ width: "55%", height: 14 })}\n  ${a({ lines })}\n</div>`,
      ]
        .filter(Boolean)
        .join("\n")
      const body = [
        media ? a({ shape: "rect", height: 140 }) : "",
        `<div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>\n  ${indent(row)}\n</div>`,
      ]
        .filter(Boolean)
        .join("\n")
      return (
        `import { Card, Skeleton, SkeletonGroup } from "kitgrid"\n\n` +
        `<SkeletonGroup label="Loading product" style={{ width: 300 }}>\n  <Card style={{ display: "grid", gap: 16 }}>\n    ${indent(body, "    ")}\n  </Card>\n</SkeletonGroup>`
      )
    },
    accessibility: [
      "Every placeholder is aria-hidden; SkeletonGroup sets aria-busy and announces its label once, not once per bar.",
      "In wrapping mode the child is inert and hidden, so placeholder buttons can't be focused or read.",
      "The shimmer is decoration: it stops under reduced motion and the placeholder stays as a still block.",
    ],
  }),

  defineDemo({
    id: "spinner",
    name: "Spinner",
    category: "Feedback",
    description: "An indeterminate ring or dots loader.",
    exports: ["Spinner"],
    serverSafe: true,
    controls: {
      variant: { type: "select", options: ["ring", "dots"], default: "ring" },
      size: { type: "select", options: ["xs", "sm", "md", "lg", "xl"], default: "lg" },
      tone: {
        type: "select",
        options: ["current", "neutral", "accent", "success", "warning", "danger", "info"],
        default: "accent",
      },
      label: { type: "text", default: "Loading orders" },
    },
    render: ({ variant, size, tone, label }) => (
      <Spinner variant={variant} size={size} tone={tone} label={label} />
    ),
    code: ({ variant, size, tone, label }) =>
      `import { Spinner } from "kitgrid"\n\n` +
      jsx("Spinner", { variant, size, tone, label }, undefined, {
        variant: "ring",
        size: "md",
        tone: "current",
        label: "Loading",
      }),
    accessibility: [
      'role="status" with a visually hidden label (default “Loading”), so it is announced politely.',
      'tone="current" inherits text color, which keeps contrast inside buttons and alerts.',
      "Under reduced motion the ring and dots slow to roughly a third of their speed: progress stays visible without fast motion.",
    ],
  }),

  defineDemo({
    id: "progress",
    name: "Progress",
    category: "Feedback",
    description: "Linear and circular progress.",
    exports: ["Progress", "ProgressRing"],
    serverSafe: true,
    controls: {
      value: { type: "number", min: 0, max: 100, step: 1, default: 64 },
      tone: {
        type: "select",
        options: ["accent", "neutral", "success", "warning", "danger", "info"],
        default: "accent",
      },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      indeterminate: { type: "boolean", default: false },
    },
    render: ({ value, tone, size, indeterminate }) => (
      <div style={{ display: "flex", alignItems: "center", gap: 32, width: 460, maxWidth: "100%" }}>
        <div style={{ flex: 1 }}>
          <Progress
            label="Profile complete"
            value={value}
            indeterminate={indeterminate}
            tone={tone}
            size={size}
            showValue
          />
        </div>
        <ProgressRing
          label="Profile complete"
          value={value}
          indeterminate={indeterminate}
          tone={tone}
        />
      </div>
    ),
    code: ({ value, tone, size, indeterminate }) => {
      const shared = { value: indeterminate ? undefined : value, indeterminate, tone }
      return (
        `import { Progress, ProgressRing } from "kitgrid"\n\n` +
        `<div style={{ display: "flex", alignItems: "center", gap: 32 }}>\n  <div style={{ flex: 1 }}>\n    ${indent(
          jsx(
            "Progress",
            { label: "Profile complete", ...shared, size, showValue: true },
            undefined,
            { tone: "accent", size: "md" },
          ),
          "    ",
        )}\n  </div>\n  ${indent(
          jsx("ProgressRing", { label: "Profile complete", ...shared }, undefined, {
            tone: "accent",
          }),
        )}\n</div>`
      )
    },
    accessibility: [
      'role="progressbar" with aria-valuemin, aria-valuemax, aria-valuenow and a readable aria-valuetext (formatValue controls both).',
      "The visible label names the bar via aria-labelledby; ProgressRing takes a `label` string since it has no visible one.",
      "Indeterminate drops aria-valuenow, as the ARIA spec requires, and its sweep slows under reduced motion.",
      "Animated stripes are decoration and stop under reduced motion; value changes snap instead of gliding.",
    ],
  }),

  defineDemo({
    id: "alert",
    name: "Alert",
    category: "Feedback",
    description: "Inline messages in five tones.",
    exports: ["Alert"],
    serverSafe: true,
    controls: {
      tone: {
        type: "select",
        options: ["info", "success", "warning", "danger", "neutral"],
        default: "warning",
      },
      variant: {
        type: "select",
        options: ["soft", "outline", "solid"],
        default: "soft",
      },
      actions: { type: "boolean", default: true },
      dismissible: { type: "boolean", default: false },
    },
    render: ({ tone, variant, actions, dismissible }) =>
      dismissible ? (
        <DismissibleAlert tone={tone} variant={variant} actions={actions} />
      ) : (
        <Alert
          style={{ width: 440, maxWidth: "100%" }}
          tone={tone}
          variant={variant}
          title="Low stock on 3 products"
          actions={
            actions ? (
              <Button size="sm" variant={variant === "solid" ? "outline" : "solid"}>
                Reorder
              </Button>
            ) : undefined
          }
        >
          They sell out this week.
        </Alert>
      ),
    code: ({ tone, variant, actions, dismissible }) => {
      const alert = jsx(
        "Alert",
        {
          tone,
          variant,
          title: "Low stock on 3 products",
          actions: actions
            ? raw(`<Button size="sm"${variant === "solid" ? ` variant="outline"` : ""}>Reorder</Button>`)
            : undefined,
          onDismiss: dismissible ? raw("() => setOpen(false)") : undefined,
        },
        "They sell out this week.",
        { tone: "info", variant: "soft" },
      )
      const imports = `import { Alert${actions ? ", Button" : ""} } from "kitgrid"\n`
      if (!dismissible) return `${imports}\n${alert}`
      return `${imports}import { useState } from "react"\n\nfunction Example() {\n  const [open, setOpen] = useState(true)\n  if (!open) return null\n  return (\n    ${indent(alert, "    ")}\n  )\n}\n\n<Example />`
    },
    accessibility: [
      'Danger and warning use role="alert" (assertive); info, success and neutral use role="status" (polite). Override with `role`.',
      "Icons are inline SVG and aria-hidden; the title carries the meaning, so color is never the only signal.",
      "The close button is a native <button> labelled “Dismiss” (dismissLabel) with a 40px pointer target.",
      "The alert never removes itself: unmount it in onDismiss and move focus to a sensible place.",
    ],
  }),
]
