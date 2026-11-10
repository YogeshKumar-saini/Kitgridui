import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Field,
  IconButton,
  Input,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  Price,
  Select,
  type SelectOption,
  Toaster,
  type ToasterPosition,
  Tooltip,
  TooltipProvider,
  toast,
} from "kitgrid"
import {
  Copy,
  Heart,
  LogOut,
  Package,
  Pencil,
  Settings,
  Share2,
  ShoppingBag,
  User,
} from "lucide-react"
import { useState } from "react"
import { defineDemo, jsx, raw } from "./registry"

const indent = (text: string, depth = 1) =>
  text
    .split("\n")
    .map((line) => (line ? `${"  ".repeat(depth)}${line}` : line))
    .join("\n")

const off = (value: boolean) => (value ? undefined : raw("false"))

/* --------------------------------------------------------------- Dialog */

const DialogDemo = ({
  size,
  dismissible,
  closeButton,
}: {
  size: "sm" | "md" | "lg" | "full"
  dismissible: boolean
  closeButton: boolean
}) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" leading={<Pencil />}>
        Edit address
      </Button>
    </DialogTrigger>
    <DialogContent size={size} dismissible={dismissible} closeButton={closeButton}>
      <DialogHeader>
        <DialogTitle>Shipping address</DialogTitle>
        <DialogDescription>Saved for next time.</DialogDescription>
      </DialogHeader>
      <DialogBody>
        <div style={{ display: "grid", gap: 16 }}>
          <Field label="Full name">
            <Input defaultValue="Ana Silva" autoComplete="name" />
          </Field>
          <Field label="Street address">
            <Input defaultValue="221 Market Street" autoComplete="street-address" />
          </Field>
        </div>
      </DialogBody>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button>Save</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

/* --------------------------------------------------------------- Drawer */

const cart = [
  { name: "Linen overshirt", variant: "Sand, M", price: 89 },
  { name: "Merino socks", variant: "Charcoal", price: 24 },
  { name: "Canvas tote", variant: "Natural", price: 38 },
]

const thumb = {
  width: 48,
  height: 48,
  borderRadius: "var(--kg-radius-md)",
  background: "var(--kg-muted)",
} as const

const CartDrawer = ({
  side,
  size,
  dismissible,
}: {
  side: "left" | "right" | "top" | "bottom"
  size: "sm" | "md" | "lg" | "full"
  dismissible: boolean
}) => (
  <Drawer>
    <DrawerTrigger asChild>
      <Button leading={<ShoppingBag />}>Cart (3)</Button>
    </DrawerTrigger>
    <DrawerContent side={side} size={size} dismissible={dismissible}>
      <DrawerHeader>
        <DrawerTitle>Your cart</DrawerTitle>
        <DrawerDescription>Free shipping over $100.</DrawerDescription>
      </DrawerHeader>
      <DrawerBody>
        <ul style={{ display: "grid", gap: 14, margin: 0, padding: 0, listStyle: "none" }}>
          {cart.map((item) => (
            <li
              key={item.name}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr auto",
                gap: 12,
                alignItems: "center",
              }}
            >
              <span aria-hidden style={thumb} />
              <span style={{ display: "grid", gap: 2 }}>
                <strong style={{ fontWeight: 550 }}>{item.name}</strong>
                <small style={{ color: "var(--kg-fg-muted)" }}>{item.variant}</small>
              </span>
              <Price amount={item.price} size="sm" />
            </li>
          ))}
        </ul>
      </DrawerBody>
      <DrawerFooter>
        <DrawerClose asChild>
          <Button variant="outline">Keep shopping</Button>
        </DrawerClose>
        <Button>Checkout</Button>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
)

/* -------------------------------------------------------------- Popover */

const SharePopover = ({
  side,
  align,
  offset,
}: {
  side: "top" | "right" | "bottom" | "left"
  align: "start" | "center" | "end"
  offset: number
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" leading={<Share2 />}>
        Share
      </Button>
    </PopoverTrigger>
    <PopoverContent side={side} align={align} offset={offset} aria-label="Share link">
      <div style={{ display: "flex", gap: 8, width: 280 }}>
        <Input readOnly value="kitgrid.shop/p/linen" aria-label="Product link" />
        <PopoverClose asChild>
          <IconButton label="Copy link" icon={<Copy />} variant="outline" />
        </PopoverClose>
      </div>
    </PopoverContent>
  </Popover>
)

/* -------------------------------------------------------- Dropdown menu */

const AccountMenu = ({
  side,
  align,
}: {
  side: "top" | "right" | "bottom" | "left"
  align: "start" | "center" | "end"
}) => {
  const [prices, setPrices] = useState(true)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" leading={<User />}>
          Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align}>
        <DropdownMenuItem icon={<Package />} shortcut="⌘O">
          Orders
        </DropdownMenuItem>
        <DropdownMenuItem icon={<Heart />}>Wishlist</DropdownMenuItem>
        <DropdownMenuItem icon={<Settings />} shortcut="⌘,">
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={prices} onCheckedChange={setPrices}>
          Prices with tax
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<LogOut />} destructive>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* --------------------------------------------------------------- Select */

const sizes: SelectOption[] = [
  { value: "s", label: "Small" },
  { value: "m", label: "Medium" },
  { value: "l", label: "Large", disabled: true },
  { value: "xl", label: "Extra large" },
]

const SizeSelect = ({
  size,
  invalid,
  disabled,
  placeholder,
}: {
  size: "sm" | "md" | "lg"
  invalid: boolean
  disabled: boolean
  placeholder: string
}) => {
  const [value, setValue] = useState<string | undefined>(undefined)
  return (
    <div style={{ width: 260, maxWidth: "100%" }}>
      <Field label="Size" error={invalid ? "Choose a size." : undefined}>
        <Select
          options={sizes}
          value={value}
          onValueChange={setValue}
          size={size}
          disabled={disabled}
          placeholder={placeholder}
          name="size"
        />
      </Field>
    </div>
  )
}

/* ---------------------------------------------------------------- Toast */

type Tone = "default" | "success" | "error" | "warning" | "info"

const fire = (tone: Tone) => {
  const options = { description: "Linen overshirt, size M" }
  if (tone === "default") toast("Added to cart", options)
  else toast[tone](
    tone === "success"
      ? "Order placed"
      : tone === "error"
        ? "Card declined"
        : tone === "warning"
          ? "Only 2 left"
          : "Prices include VAT",
    options,
  )
}

const toastCall = (tone: Tone) =>
  tone === "default"
    ? `toast("Added to cart", { description: "Linen overshirt, size M" })`
    : `toast.${tone}("${
        tone === "success"
          ? "Order placed"
          : tone === "error"
            ? "Card declined"
            : tone === "warning"
              ? "Only 2 left"
              : "Prices include VAT"
      }", { description: "Linen overshirt, size M" })`

const ToastDemo = ({
  tone,
  position,
  closeButton,
  max,
}: {
  tone: Tone
  position: ToasterPosition
  closeButton: boolean
  max: number
}) => (
  <>
    <Button variant="outline" onClick={() => fire(tone)}>
      Show toast
    </Button>
    <Toaster position={position} closeButton={closeButton} max={max} />
  </>
)

export const demos = [
  defineDemo({
    id: "dialog",
    name: "Dialog",
    category: "Overlays",
    description: "A modal built on the native dialog element.",
    exports: [
      "Dialog",
      "DialogTrigger",
      "DialogContent",
      "DialogHeader",
      "DialogTitle",
      "DialogDescription",
      "DialogBody",
      "DialogFooter",
      "DialogClose",
    ],
    controls: {
      size: { type: "select", options: ["sm", "md", "lg", "full"], default: "md" },
      dismissible: { type: "boolean", default: true, label: "Close on backdrop" },
      closeButton: { type: "boolean", default: true, label: "Close button" },
    },
    render: (values) => <DialogDemo {...values} />,
    code: ({ size, dismissible, closeButton }) =>
      `import {\n  Button, Dialog, DialogBody, DialogClose, DialogContent, DialogDescription,\n  DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Field, Input,\n} from "kitgrid"\n\n` +
      `<Dialog>\n  <DialogTrigger asChild>\n    <Button variant="outline">Edit address</Button>\n  </DialogTrigger>\n` +
      indent(
        jsx(
          "DialogContent",
          { size, dismissible: off(dismissible), closeButton: off(closeButton) },
          `<DialogHeader>\n  <DialogTitle>Shipping address</DialogTitle>\n  <DialogDescription>Saved for next time.</DialogDescription>\n</DialogHeader>\n<DialogBody>\n  <Field label="Full name">\n    <Input defaultValue="Ana Silva" />\n  </Field>\n</DialogBody>\n<DialogFooter>\n  <DialogClose asChild>\n    <Button variant="ghost">Cancel</Button>\n  </DialogClose>\n  <DialogClose asChild>\n    <Button>Save</Button>\n  </DialogClose>\n</DialogFooter>`,
          { size: "md" },
        ),
      ) +
      `\n</Dialog>`,
    accessibility: [
      "Uses showModal(), so the page behind is inert and the dialog sits in the browser top layer; scroll is locked with scrollbar-gutter compensation.",
      "Escape fires the native cancel event, which is intercepted so the exit animation plays before close().",
      "Focus moves to initialFocus or the first field (not the corner close button) and returns to the trigger on close.",
      'DialogTitle and DialogDescription wire aria-labelledby and aria-describedby automatically; pass role="alertdialog" for confirmations.',
    ],
  }),
  defineDemo({
    id: "drawer",
    name: "Drawer",
    category: "Overlays",
    description: "A sheet from any edge with drag to dismiss.",
    exports: [
      "Drawer",
      "DrawerTrigger",
      "DrawerContent",
      "DrawerHeader",
      "DrawerTitle",
      "DrawerDescription",
      "DrawerBody",
      "DrawerFooter",
      "DrawerClose",
    ],
    controls: {
      side: {
        type: "select",
        options: ["right", "left", "bottom", "top"],
        default: "right",
      },
      size: { type: "select", options: ["sm", "md", "lg", "full"], default: "md" },
      dismissible: { type: "boolean", default: true, label: "Backdrop and drag dismiss" },
    },
    render: (values) => <CartDrawer {...values} />,
    code: ({ side, size, dismissible }) =>
      `import {\n  Button, Drawer, DrawerBody, DrawerClose, DrawerContent, DrawerDescription,\n  DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger,\n} from "kitgrid"\n\n` +
      `<Drawer>\n  <DrawerTrigger asChild>\n    <Button>Cart (3)</Button>\n  </DrawerTrigger>\n` +
      indent(
        jsx(
          "DrawerContent",
          { side, size, dismissible: off(dismissible) },
          `<DrawerHeader>\n  <DrawerTitle>Your cart</DrawerTitle>\n  <DrawerDescription>Free shipping over $100.</DrawerDescription>\n</DrawerHeader>\n<DrawerBody>\n  <p>Linen overshirt, $89</p>\n</DrawerBody>\n<DrawerFooter>\n  <DrawerClose asChild>\n    <Button variant="outline">Keep shopping</Button>\n  </DrawerClose>\n  <Button>Checkout</Button>\n</DrawerFooter>`,
          { side: "right", size: "md" },
        ),
      ) +
      `\n</Drawer>`,
    accessibility: [
      "Same native modal dialog as Dialog: inert page, Escape via cancel, focus in on open and back to the trigger on close.",
      "Dragging starts only on non-interactive surface; a scrollable body keeps vertical gestures for scrolling.",
      "A fling past the velocity threshold or a drag beyond 35% of the panel closes it; anything less settles back.",
    ],
  }),
  defineDemo({
    id: "popover",
    name: "Popover",
    category: "Overlays",
    description: "A non-modal panel anchored to its trigger.",
    exports: [
      "Popover",
      "PopoverTrigger",
      "PopoverContent",
      "PopoverClose",
      "PopoverAnchor",
    ],
    controls: {
      side: {
        type: "select",
        options: ["bottom", "top", "right", "left"],
        default: "bottom",
      },
      align: { type: "select", options: ["center", "start", "end"], default: "center" },
      offset: { type: "number", min: 0, max: 24, step: 1, default: 8 },
    },
    render: (values) => <SharePopover {...values} />,
    code: ({ side, align, offset }) =>
      `import {\n  Button, IconButton, Input, Popover, PopoverClose, PopoverContent, PopoverTrigger,\n} from "kitgrid"\nimport { Copy } from "lucide-react"\n\n` +
      `<Popover>\n  <PopoverTrigger asChild>\n    <Button variant="outline">Share</Button>\n  </PopoverTrigger>\n` +
      indent(
        jsx(
          "PopoverContent",
          { side, align, offset, "aria-label": "Share link" },
          `<div style={{ display: "flex", gap: 8, width: 280 }}>\n  <Input readOnly value="kitgrid.shop/p/linen" aria-label="Product link" />\n  <PopoverClose asChild>\n    <IconButton label="Copy link" icon={<Copy />} variant="outline" />\n  </PopoverClose>\n</div>`,
          { side: "bottom", align: "center", offset: 8 },
        ),
      ) +
      `\n</Popover>`,
    accessibility: [
      'The trigger reports aria-haspopup="dialog", aria-expanded and aria-controls; the content has role="dialog" (name it with aria-label or aria-labelledby).',
      "Focus moves to the first focusable element on open and returns to the trigger on Escape or PopoverClose.",
      "Tabbing out or pressing outside closes it without pulling focus back; nested layers close one Escape at a time.",
    ],
  }),
  defineDemo({
    id: "tooltip",
    name: "Tooltip",
    category: "Overlays",
    description: "Short help text on hover and focus.",
    exports: ["Tooltip", "TooltipProvider"],
    controls: {
      side: {
        type: "select",
        options: ["top", "bottom", "right", "left"],
        default: "top",
      },
      delay: {
        type: "number",
        min: 0,
        max: 1200,
        step: 50,
        default: 500,
        label: "Delay (ms)",
      },
    },
    render: ({ side, delay }) => (
      <TooltipProvider delayDuration={delay}>
        <Tooltip side={side} content="Copy link">
          <IconButton label="Copy link" icon={<Copy />} variant="outline" />
        </Tooltip>
      </TooltipProvider>
    ),
    code: ({ side, delay }) =>
      `import { IconButton, Tooltip, TooltipProvider } from "kitgrid"\nimport { Copy } from "lucide-react"\n\n` +
      jsx(
        "TooltipProvider",
        { delayDuration: delay },
        jsx(
          "Tooltip",
          { side, content: "Copy link" },
          `<IconButton label="Copy link" icon={<Copy />} variant="outline" />`,
          { side: "top" },
        ),
        { delayDuration: 500 },
      ),
    accessibility: [
      "Opens on hover after the delay and immediately on keyboard focus; it is linked with aria-describedby only while shown.",
      "It never takes focus. Escape hides it without moving focus, and pressing the trigger hides it too.",
      "Hoverable and persistent (WCAG 1.4.13): the pointer can move onto the bubble, and it stays until the pointer or focus leaves.",
    ],
  }),
  defineDemo({
    id: "dropdown-menu",
    name: "Dropdown Menu",
    category: "Overlays",
    description: "A menu button with typeahead and checkable items.",
    exports: [
      "DropdownMenu",
      "DropdownMenuTrigger",
      "DropdownMenuContent",
      "DropdownMenuItem",
      "DropdownMenuCheckboxItem",
      "DropdownMenuRadioGroup",
      "DropdownMenuRadioItem",
      "DropdownMenuLabel",
      "DropdownMenuSeparator",
      "DropdownMenuGroup",
    ],
    controls: {
      side: {
        type: "select",
        options: ["bottom", "top", "right", "left"],
        default: "bottom",
      },
      align: { type: "select", options: ["start", "center", "end"], default: "start" },
    },
    render: (values) => <AccountMenu {...values} />,
    code: ({ side, align }) =>
      `import {\n  Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem,\n  DropdownMenuSeparator, DropdownMenuTrigger,\n} from "kitgrid"\nimport { Heart, LogOut, Package, Settings } from "lucide-react"\nimport { useState } from "react"\n\n` +
      `function Example() {\n  const [prices, setPrices] = useState(true)\n  return (\n    <DropdownMenu>\n      <DropdownMenuTrigger asChild>\n        <Button variant="outline">Account</Button>\n      </DropdownMenuTrigger>\n` +
      indent(
        jsx(
          "DropdownMenuContent",
          { side, align },
          `<DropdownMenuItem icon={<Package />} shortcut="⌘O">Orders</DropdownMenuItem>\n<DropdownMenuItem icon={<Heart />}>Wishlist</DropdownMenuItem>\n<DropdownMenuItem icon={<Settings />} shortcut="⌘,">Settings</DropdownMenuItem>\n<DropdownMenuSeparator />\n<DropdownMenuCheckboxItem checked={prices} onCheckedChange={setPrices}>\n  Prices with tax\n</DropdownMenuCheckboxItem>\n<DropdownMenuSeparator />\n<DropdownMenuItem icon={<LogOut />} destructive>Sign out</DropdownMenuItem>`,
          { side: "bottom", align: "start" },
        ),
        3,
      ) +
      `\n    </DropdownMenu>\n  )\n}\n\n<Example />`,
    accessibility: [
      "Enter, Space or ArrowDown open the menu on the first item; ArrowUp opens it on the last. A pointer click focuses the menu itself.",
      "ArrowUp/ArrowDown rove (wrapping), Home/End jump, typing a letter jumps to the matching item, disabled items are skipped.",
      "Enter/Space activate; onSelect can call event.preventDefault() to keep the menu open. Checkbox and radio items stay open by default.",
      "Escape and Tab close the menu and return focus to the trigger; labels name their groups via aria-labelledby.",
    ],
  }),
  defineDemo({
    id: "select",
    name: "Select",
    category: "Overlays",
    description: "A select with groups, icons and typeahead.",
    exports: ["Select"],
    controls: {
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      placeholder: { type: "text", default: "Choose a size" },
      invalid: { type: "boolean", default: false },
      disabled: { type: "boolean", default: false },
    },
    render: (values) => <SizeSelect {...values} />,
    code: ({ size, placeholder, invalid, disabled }) =>
      `import { Field, Select } from "kitgrid"\nimport { useState } from "react"\n\nconst sizes = [\n  { value: "s", label: "Small" },\n  { value: "m", label: "Medium" },\n  { value: "l", label: "Large", disabled: true },\n  { value: "xl", label: "Extra large" },\n]\n\n` +
      `function Example() {\n  const [size, setSize] = useState<string>()\n  return (\n` +
      indent(
        jsx(
          "Field",
          { label: "Size", error: invalid ? "Choose a size." : undefined },
          jsx(
            "Select",
            {
              options: raw("sizes"),
              value: raw("size"),
              onValueChange: raw("setSize"),
              size,
              placeholder,
              disabled,
              name: "size",
            },
            undefined,
            { size: "md" },
          ),
        ),
        2,
      ) +
      `\n  )\n}\n\n<Example />`,
    accessibility: [
      'role="combobox" with aria-haspopup="listbox" and aria-expanded; focus never leaves the trigger, and the active option is announced through aria-activedescendant.',
      "Closed: Enter, Space, ArrowUp/Down open it; Home/End open at the ends; typing opens it on the matching option.",
      "Open: arrows, Home/End and PageUp/PageDown move, Enter/Space/Tab choose, Escape cancels, typeahead jumps (repeat a letter to cycle).",
      "Inside a Field it takes the label, description and error (aria-invalid, aria-errormessage) automatically.",
    ],
  }),
  defineDemo({
    id: "toast",
    name: "Toast",
    category: "Overlays",
    description: "Stacked notifications you can call from anywhere.",
    exports: ["Toaster", "toast"],
    controls: {
      tone: {
        type: "select",
        options: ["default", "success", "error", "warning", "info"],
        default: "success",
      },
      position: {
        type: "select",
        options: [
          "bottom-right",
          "bottom-center",
          "bottom-left",
          "top-right",
          "top-center",
          "top-left",
        ],
        default: "bottom-right",
      },
      max: { type: "number", min: 1, max: 5, step: 1, default: 3, label: "Visible" },
      closeButton: { type: "boolean", default: false, label: "Close buttons" },
    },
    render: (values) => <ToastDemo {...values} />,
    code: ({ tone, position, max, closeButton }) =>
      `import { Button, Toaster, toast } from "kitgrid"\n\n` +
      `<>\n  <Button variant="outline" onClick={() => ${toastCall(tone)}}>\n    Show toast\n  </Button>\n` +
      indent(
        jsx("Toaster", { position, max, closeButton }, undefined, {
          position: "bottom-right",
          max: 3,
        }),
      ) +
      `\n</>`,
    accessibility: [
      "Toasts live in a region landmark named “Notifications”; Alt+T (aria-keyshortcuts) moves focus to the newest one.",
      'Each toast is role="status" (polite); errors and important toasts use role="alert". Tone icons differ in shape, not just color.',
      "Timers pause while the stack is hovered or focused and while the tab is hidden; toasts beyond the visible limit wait with paused timers.",
      "Escape dismisses the focused toast, and focus stays in the region instead of falling to the page.",
    ],
  }),
]
