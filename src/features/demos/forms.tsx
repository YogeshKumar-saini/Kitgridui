import {
  Checkbox,
  Field,
  Input,
  PinInput,
  RadioGroup,
  RadioGroupItem,
  SegmentedControl,
  Slider,
  Switch,
  Textarea,
} from "kitgrid"
import { AtSign, Columns3, LayoutGrid, List, Rocket, Truck, Zap } from "lucide-react"
import { defineDemo, jsx, raw } from "./registry"

const stack = { display: "grid", gap: 16, width: 340, maxWidth: "100%" } as const

const indent = (code: string) => code.replace(/\n/g, "\n  ")

const shipping = [
  { value: "standard", label: "Standard", description: "4 to 6 days", icon: "Truck", aside: "Free" },
  { value: "express", label: "Express", description: "1 to 2 days", icon: "Zap", aside: "$12" },
  { value: "same-day", label: "Same day", description: "Order by 2pm", icon: "Rocket", aside: "$24" },
] as const

const shippingIcons = { Truck: <Truck />, Zap: <Zap />, Rocket: <Rocket /> }

const percentMarks = [0, 25, 50, 75, 100].map((value) => ({ value, label: `${value}%` }))

export const demos = [
  defineDemo({
    id: "field",
    name: "Field",
    category: "Forms",
    description: "Label, description and error for any control.",
    exports: ["Field", "useField"],
    controls: {
      label: { type: "text", default: "Store name" },
      error: { type: "boolean", default: false, label: "Show error" },
      required: { type: "boolean", default: true },
      disabled: { type: "boolean", default: false },
    },
    render: ({ label, error, required, disabled }) => (
      <div style={stack}>
        <Field
          label={label}
          description="Shown on receipts."
          error={error ? "Use at least 3 characters." : undefined}
          required={required}
          disabled={disabled}
        >
          <Input placeholder="Northwind Goods" />
        </Field>
      </div>
    ),
    code: ({ label, error, required, disabled }) =>
      `import { Field, Input } from "kitgrid"\n\n` +
      jsx(
        "Field",
        {
          label,
          description: "Shown on receipts.",
          error: error ? "Use at least 3 characters." : undefined,
          required,
          disabled,
        },
        `<Input placeholder="Northwind Goods" />`,
      ),
    accessibility: [
      "The label targets the control through htmlFor; group controls (RadioGroup, Slider, PinInput) use aria-labelledby instead.",
      "description and error are joined into the control's aria-describedby; the error also sets aria-invalid and aria-errormessage.",
      "The error region is a polite live region, so a new message is announced once without moving focus.",
      "The error carries a glyph as well as color. Custom controls read the same wiring through useField().",
    ],
  }),

  defineDemo({
    id: "input",
    name: "Input",
    category: "Forms",
    description: "A text field with adornments and a clear button.",
    exports: ["Input"],
    controls: {
      variant: {
        type: "select",
        options: ["outline", "filled", "underline"],
        default: "outline",
      },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      invalid: { type: "boolean", default: false },
      disabled: { type: "boolean", default: false },
    },
    render: ({ variant, size, invalid, disabled }) => (
      <Input
        aria-label="Email"
        variant={variant}
        size={size}
        leading={<AtSign />}
        placeholder="name@shop.com"
        invalid={invalid}
        disabled={disabled}
        style={{ width: 300, maxWidth: "100%" }}
      />
    ),
    code: ({ variant, size, invalid, disabled }) =>
      `import { Input } from "kitgrid"\nimport { AtSign } from "lucide-react"\n\n` +
      jsx(
        "Input",
        {
          "aria-label": "Email",
          variant,
          size,
          leading: raw("<AtSign />"),
          placeholder: "name@shop.com",
          invalid,
          disabled,
        },
        undefined,
        { variant: "outline", size: "md" },
      ),
    accessibility: [
      "className and style go on the wrapper; every other prop and the ref reach the native <input>.",
      "Text adornments such as “$” or “.com” are added to aria-describedby so they are announced; icons are decorative.",
      "With onClear, the clear button is a real, labelled button that empties the value through onChange and returns focus.",
      "Inside a Field the input picks up id, aria-describedby, aria-invalid, aria-errormessage, required and disabled.",
    ],
  }),

  defineDemo({
    id: "textarea",
    name: "Textarea",
    category: "Forms",
    description: "A textarea that grows with its content.",
    exports: ["Textarea"],
    controls: {
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      autoGrow: { type: "boolean", default: true },
      invalid: { type: "boolean", default: false },
      disabled: { type: "boolean", default: false },
    },
    render: ({ size, autoGrow, invalid, disabled }) => (
      <div style={{ ...stack, width: 400 }}>
        <Field label="Review">
          <Textarea
            size={size}
            minRows={3}
            maxRows={8}
            maxLength={280}
            autoGrow={autoGrow}
            invalid={invalid}
            disabled={disabled}
            placeholder="What did you like?"
          />
        </Field>
      </div>
    ),
    code: ({ size, autoGrow, invalid, disabled }) =>
      `import { Field, Textarea } from "kitgrid"\n\n` +
      jsx(
        "Field",
        { label: "Review" },
        jsx(
          "Textarea",
          {
            size,
            maxRows: 8,
            maxLength: 280,
            autoGrow,
            invalid,
            disabled,
            placeholder: "What did you like?",
          },
          undefined,
          { size: "md", autoGrow: true },
        ).replace(/^<Textarea/, autoGrow ? "<Textarea" : "<Textarea\n  autoGrow={false}"),
      ),
    accessibility: [
      "Uses CSS field-sizing: content where supported and measures scrollHeight elsewhere; no layout shift on hydration.",
      "The visible count is aria-hidden. A separate polite live region starts announcing “N characters remaining” only within countThreshold of maxLength.",
      "Native maxLength still enforces the limit, so paste and autofill are covered.",
    ],
  }),

  defineDemo({
    id: "checkbox",
    name: "Checkbox",
    category: "Forms",
    description: "A checkbox with an indeterminate state and groups.",
    exports: ["Checkbox", "CheckboxGroup"],
    controls: {
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      indeterminate: { type: "boolean", default: false },
      invalid: { type: "boolean", default: false },
      disabled: { type: "boolean", default: false },
    },
    render: ({ size, indeterminate, invalid, disabled }) => (
      <Checkbox
        size={size}
        label="Email me when it's back"
        description="One email, then we forget you."
        indeterminate={indeterminate}
        invalid={invalid}
        disabled={disabled}
        defaultChecked
      />
    ),
    code: ({ size, indeterminate, invalid, disabled }) =>
      `import { Checkbox } from "kitgrid"\n\n` +
      jsx(
        "Checkbox",
        {
          size,
          label: "Email me when it's back",
          description: "One email, then we forget you.",
          indeterminate,
          invalid,
          disabled,
          defaultChecked: true,
        },
        undefined,
        { size: "md" },
      ),
    accessibility: [
      'A real <input type="checkbox">: Space toggles, forms submit and reset it, autofill works.',
      'indeterminate sets the DOM property, exposed as aria-checked="mixed".',
      "The label names the checkbox and the description is linked through aria-describedby, so it's never part of the name.",
      "CheckboxGroup is a <fieldset> with a <legend>; disabled on the group disables every checkbox natively.",
    ],
  }),

  defineDemo({
    id: "switch",
    name: "Switch",
    category: "Forms",
    description: "An on/off control with a smooth thumb.",
    exports: ["Switch"],
    controls: {
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      labelPosition: { type: "select", options: ["end", "start"], default: "end" },
      invalid: { type: "boolean", default: false },
      disabled: { type: "boolean", default: false },
    },
    render: ({ size, labelPosition, invalid, disabled }) => (
      <div style={{ width: labelPosition === "start" ? 300 : undefined, maxWidth: "100%" }}>
        <Switch
          size={size}
          label="Push notifications"
          labelPosition={labelPosition}
          invalid={invalid}
          disabled={disabled}
          defaultChecked
        />
      </div>
    ),
    code: ({ size, labelPosition, invalid, disabled }) =>
      `import { Switch } from "kitgrid"\n\n` +
      jsx(
        "Switch",
        {
          size,
          label: "Push notifications",
          labelPosition,
          invalid,
          disabled,
          defaultChecked: true,
        },
        undefined,
        { size: "md", labelPosition: "end" },
      ),
    accessibility: [
      'A native checkbox with role="switch", so screen readers announce “on/off” and Space toggles it.',
      "The track and thumb icons are aria-hidden; the label and description name and describe the input.",
      "Travel mirrors in right-to-left layouts; under reduced motion the thumb snaps instead of sliding.",
    ],
  }),

  defineDemo({
    id: "radio-group",
    name: "Radio Group",
    category: "Forms",
    description: "Native radios with a card variant.",
    exports: ["RadioGroup", "RadioGroupItem"],
    controls: {
      variant: { type: "select", options: ["default", "card"], default: "card" },
      orientation: {
        type: "select",
        options: ["vertical", "horizontal"],
        default: "vertical",
      },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      disabled: { type: "boolean", default: false },
    },
    render: ({ variant, orientation, size, disabled }) => (
      <div style={{ width: orientation === "horizontal" ? 520 : 340, maxWidth: "100%" }}>
        <Field label="Shipping">
          <RadioGroup
            variant={variant}
            orientation={orientation}
            size={size}
            disabled={disabled}
            defaultValue="standard"
          >
            {shipping.map((option) => (
              <RadioGroupItem
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
                icon={variant === "card" ? shippingIcons[option.icon] : undefined}
              >
                {variant === "card" ? option.aside : undefined}
              </RadioGroupItem>
            ))}
          </RadioGroup>
        </Field>
      </div>
    ),
    code: ({ variant, orientation, size, disabled }) => {
      const card = variant === "card"
      const items = shipping
        .map((option) =>
          jsx(
            "RadioGroupItem",
            {
              value: option.value,
              label: option.label,
              description: option.description,
              icon: card ? raw(`<${option.icon} />`) : undefined,
            },
            card ? option.aside : undefined,
          ),
        )
        .join("\n")
      return (
        `import { Field, RadioGroup, RadioGroupItem } from "kitgrid"\n` +
        (card ? `import { Rocket, Truck, Zap } from "lucide-react"\n` : "") +
        `\n<Field label="Shipping">\n  ${indent(
          jsx(
            "RadioGroup",
            { variant, orientation, size, disabled, defaultValue: "standard" },
            items,
            { variant: "default", orientation: "vertical", size: "md" },
          ),
        )}\n</Field>`
      )
    },
    accessibility: [
      'role="radiogroup" over native radios that share a name: Tab enters at the selected radio, arrow keys move and select, forms submit the value.',
      "In the card variant the whole card is the label, but aria-labelledby limits the name to the title; the description is linked separately.",
      "Inside a Field the group gets aria-labelledby, aria-describedby, aria-required and aria-invalid.",
      "value={null} is a controlled “nothing selected”; undefined leaves the group uncontrolled.",
    ],
  }),

  defineDemo({
    id: "slider",
    name: "Slider",
    category: "Forms",
    description: "Single or multi-thumb with marks.",
    exports: ["Slider"],
    controls: {
      mode: { type: "select", options: ["single", "range"], default: "range" },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      marks: { type: "boolean", default: true },
      disabled: { type: "boolean", default: false },
    },
    render: ({ mode, size, marks, disabled }) => (
      <div style={{ width: 380, maxWidth: "100%", paddingTop: 28 }}>
        <Slider
          key={mode}
          aria-label="Discount"
          defaultValue={mode === "range" ? [20, 70] : [40]}
          step={5}
          minStepsBetweenThumbs={1}
          marks={marks ? percentMarks : undefined}
          formatValue={(value) => `${value}%`}
          size={size}
          disabled={disabled}
        />
      </div>
    ),
    code: ({ mode, size, marks, disabled }) =>
      `import { Slider } from "kitgrid"\n\n` +
      (marks
        ? `const marks = [0, 25, 50, 75, 100].map((value) => ({ value, label: \`\${value}%\` }))\n\n`
        : "") +
      jsx(
        "Slider",
        {
          "aria-label": "Discount",
          defaultValue: mode === "range" ? [20, 70] : [40],
          step: 5,
          minStepsBetweenThumbs: mode === "range" ? 1 : undefined,
          marks: marks ? raw("marks") : undefined,
          formatValue: raw("(value) => `${value}%`"),
          size,
          disabled,
        },
        undefined,
        { size: "md" },
      ),
    accessibility: [
      'Each thumb is role="slider" with aria-valuenow, aria-valuetext (from formatValue) and min/max narrowed by its neighbours.',
      "Arrows move one step (Right/Up increase, mirrored in RTL), Shift+Arrow and PageUp/PageDown move largeStep, Home/End jump to the bounds.",
      "Range sliders are a named group; thumbs are named by thumbLabels, defaulting to “Minimum” / “Maximum”.",
      "onValueChange fires continuously; onValueCommit fires once on release or per key press.",
    ],
  }),

  defineDemo({
    id: "segmented-control",
    name: "Segmented Control",
    category: "Forms",
    description: "A compact single choice with a sliding thumb.",
    exports: ["SegmentedControl"],
    controls: {
      variant: {
        type: "select",
        options: ["default", "pill", "underline"],
        default: "default",
      },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      icons: { type: "boolean", default: true },
      disabled: { type: "boolean", default: false },
    },
    render: ({ variant, size, icons, disabled }) => (
      <SegmentedControl
        aria-label="View"
        variant={variant}
        size={size}
        disabled={disabled}
        defaultValue="grid"
        options={[
          { value: "grid", label: "Grid", icon: icons ? <LayoutGrid /> : undefined },
          { value: "list", label: "List", icon: icons ? <List /> : undefined },
          { value: "board", label: "Board", icon: icons ? <Columns3 /> : undefined },
        ]}
      />
    ),
    code: ({ variant, size, icons, disabled }) =>
      `import { SegmentedControl } from "kitgrid"\n` +
      (icons ? `import { Columns3, LayoutGrid, List } from "lucide-react"\n` : "") +
      "\n" +
      jsx(
        "SegmentedControl",
        {
          "aria-label": "View",
          variant,
          size,
          disabled,
          defaultValue: "grid",
          options: raw(
            icons
              ? `[\n    { value: "grid", label: "Grid", icon: <LayoutGrid /> },\n    { value: "list", label: "List", icon: <List /> },\n    { value: "board", label: "Board", icon: <Columns3 /> },\n  ]`
              : `[\n    { value: "grid", label: "Grid" },\n    { value: "list", label: "List" },\n    { value: "board", label: "Board" },\n  ]`,
          ),
        },
        undefined,
        { variant: "default", size: "md" },
      ),
    accessibility: [
      'role="radiogroup" over native radios: arrow keys move and select, Tab leaves the group, the value submits with forms.',
      "Icon-only options need an aria-label on the option.",
      "The thumb is measured in a layout effect and written to a CSS variable, so selection never re-renders for animation.",
      "Before hydration the selected item paints its own background, so the server render already shows the choice.",
    ],
  }),

  defineDemo({
    id: "pin-input",
    name: "Pin Input",
    category: "Forms",
    description: "One-time code entry with paste and autofill.",
    exports: ["PinInput"],
    controls: {
      length: { type: "number", min: 4, max: 8, default: 6 },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      mask: { type: "boolean", default: false },
      invalid: { type: "boolean", default: false },
    },
    render: ({ length, size, mask, invalid }) => (
      <PinInput
        aria-label="Verification code"
        length={length}
        groupSize={length === 6 ? 3 : length === 8 ? 4 : undefined}
        size={size}
        mask={mask}
        invalid={invalid}
      />
    ),
    code: ({ length, size, mask, invalid }) =>
      `import { PinInput } from "kitgrid"\n\n` +
      jsx(
        "PinInput",
        {
          "aria-label": "Verification code",
          length,
          groupSize: length === 6 ? 3 : length === 8 ? 4 : undefined,
          size,
          mask,
          invalid,
          onComplete: raw("(code) => console.log(code)"),
        },
        undefined,
        { length: 6, size: "md" },
      ),
    accessibility: [
      "A labelled group of inputs; each cell is named “Digit 1 of 6” (override with getCellLabel).",
      'The first cell has autocomplete="one-time-code" so iOS and Android offer codes from SMS; numeric mode sets inputmode="numeric".',
      "Typing advances, Backspace clears and steps back, Delete removes, arrows, Home and End move. Cells fill without gaps.",
      "Pasting anywhere strips separators (“123-456”) and fills the cells; onComplete fires once with the full code.",
      "invalid sets aria-invalid on every cell and shakes the row; the shake is removed under reduced motion.",
    ],
  }),
]
