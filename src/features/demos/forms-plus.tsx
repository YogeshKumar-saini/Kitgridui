import {
  Autocomplete,
  AvatarUpload,
  Calendar,
  Cascader,
  CheckboxCard,
  ColorPicker,
  Combobox,
  CreditCardInput,
  CurrencyInput,
  DatePicker,
  DateTimeField,
  Field,
  FileDropzone,
  FormWizard,
  FormWizardStep,
  InlineEdit,
  Input,
  InputGroup,
  InputGroupAddon,
  Knob,
  MentionInput,
  MultiSelect,
  NumberField,
  PasswordField,
  PhoneInput,
  ScaleInput,
  SearchSelect,
  SignaturePad,
  SwitchGroup,
  TagInput,
  TimePicker,
  TimeSlotPicker,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  TransferList,
  TreeSelect,
} from "kitgrid"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bell,
  Bold,
  Gift,
  Italic,
  MapPin,
  Shield,
  Star,
  Truck,
  Underline,
} from "lucide-react"
import { useState } from "react"
import { defineDemo, jsx, raw } from "./registry"

const w = { width: 320, maxWidth: "100%" } as const
const stack = { display: "grid", gap: 12, width: 340, maxWidth: "100%" } as const

const decl = (name: string, value: unknown) =>
  `const ${name} = ${JSON.stringify(value, null, 2).replace(/"(\w+)":/g, "$1:")}`

const snippet = (imports: string[], body: string, decls: string[] = []) =>
  `${imports.join("\n")}\n\n${decls.length ? `${decls.join("\n\n")}\n\n` : ""}${body}`

const inField = (label: string, child: string) => jsx("Field", { label }, child)

const cities = [
  { value: "lis", label: "Lisbon" },
  { value: "osa", label: "Osaka" },
  { value: "mex", label: "Mexico City" },
  { value: "cpt", label: "Cape Town" },
  { value: "mtl", label: "Montreal" },
]

const streets = ["Baker Street", "Bakery Lane", "Abbey Road", "Brick Lane"]

const people = [
  { value: "maya", label: "Maya Chen" },
  { value: "kenji", label: "Kenji Mori" },
  { value: "lea", label: "Léa Martin" },
  { value: "omar", label: "Omar Haddad" },
]

const zones = [
  { value: "Europe/Lisbon", label: "Lisbon", aside: "UTC+0" },
  { value: "Europe/Berlin", label: "Berlin", aside: "UTC+1" },
  { value: "Asia/Dubai", label: "Dubai", aside: "UTC+4" },
  { value: "Asia/Tokyo", label: "Tokyo", aside: "UTC+9" },
  { value: "America/New_York", label: "New York", aside: "UTC-5" },
]

const folders = [
  {
    value: "design",
    label: "Design",
    children: [
      { value: "icons", label: "Icons" },
      { value: "logos", label: "Logos" },
    ],
  },
  {
    value: "finance",
    label: "Finance",
    children: [
      { value: "reports", label: "Reports" },
      { value: "invoices", label: "Invoices" },
    ],
  },
]

const regions = [
  {
    value: "jp",
    label: "Japan",
    children: [
      { value: "tokyo", label: "Tokyo" },
      { value: "osaka", label: "Osaka" },
    ],
  },
  {
    value: "pt",
    label: "Portugal",
    children: [
      { value: "lisbon", label: "Lisbon" },
      { value: "porto", label: "Porto" },
    ],
  },
]

const columns = [
  { value: "sku", label: "SKU" },
  { value: "price", label: "Price" },
  { value: "stock", label: "Stock" },
  { value: "vendor", label: "Vendor" },
  { value: "weight", label: "Weight" },
]

const slots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"].map((value) => ({
  value,
  disabled: value === "09:30",
}))

const swatches = ["#1f2937", "#e8742a", "#16a34a", "#0891b2", "#2563eb", "#e11d48"]

const Wizard = () => {
  const [email, setEmail] = useState("")
  return (
    <div style={{ width: 420, maxWidth: "100%" }}>
      <FormWizard>
        <FormWizardStep
          title="Contact"
          validate={() => (/^\S+@\S+\.\S+$/.test(email) ? true : "Enter an email address.")}
        >
          <Field label="Email">
            <Input
              type="email"
              placeholder="name@shop.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
        </FormWizardStep>
        <FormWizardStep title="Delivery">
          <Field label="Delivery day">
            <DatePicker />
          </Field>
        </FormWizardStep>
        <FormWizardStep title="Review">
          <Field label="Notes">
            <Input placeholder="Leave at the door" />
          </Field>
        </FormWizardStep>
      </FormWizard>
    </div>
  )
}

const wizardCode = `import { DatePicker, Field, FormWizard, FormWizardStep, Input } from "kitgrid"
import { useState } from "react"

function Example() {
  const [email, setEmail] = useState("")
  return (
    <FormWizard onComplete={() => console.log(email)}>
      <FormWizardStep
        title="Contact"
        validate={() => (/^\\S+@\\S+\\.\\S+$/.test(email) ? true : "Enter an email address.")}
      >
        <Field label="Email">
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </Field>
      </FormWizardStep>
      <FormWizardStep title="Delivery">
        <Field label="Delivery day">
          <DatePicker />
        </Field>
      </FormWizardStep>
      <FormWizardStep title="Review">
        <Field label="Notes">
          <Input placeholder="Leave at the door" />
        </Field>
      </FormWizardStep>
    </FormWizard>
  )
}

<Example />`

const rules = [
  { label: "8 characters", test: (v: string) => v.length >= 8 },
  { label: "A number", test: (v: string) => /\d/.test(v) },
  { label: "An uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
]

const rulesCode = `const rules = [
  { label: "8 characters", test: (v: string) => v.length >= 8 },
  { label: "A number", test: (v: string) => /\\d/.test(v) },
  { label: "An uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
]`

export const demos = [
  defineDemo({
    id: "combobox",
    name: "Combobox",
    category: "Forms",
    description: "A filterable select you can type into.",
    exports: ["Combobox"],
    controls: {
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      clearable: { type: "boolean", default: true },
      invalid: { type: "boolean", default: false },
      disabled: { type: "boolean", default: false },
    },
    render: ({ size, clearable, invalid, disabled }) => (
      <div style={w}>
        <Field label="City">
          <Combobox
            options={cities}
            placeholder="Search cities"
            leading={<MapPin />}
            size={size}
            clearable={clearable}
            invalid={invalid}
            disabled={disabled}
          />
        </Field>
      </div>
    ),
    code: ({ size, clearable, invalid, disabled }) =>
      snippet(
        [`import { Combobox, Field } from "kitgrid"`, `import { MapPin } from "lucide-react"`],
        inField(
          "City",
          jsx(
            "Combobox",
            {
              options: raw("cities"),
              placeholder: "Search cities",
              leading: raw("<MapPin />"),
              size,
              clearable,
              invalid,
              disabled,
            },
            undefined,
            { size: "md" },
          ),
        ),
        [decl("cities", cities)],
      ),
    accessibility: [
      "Editable APG combobox: focus stays in the input, the active option is aria-activedescendant.",
      "Down and Up move, Enter picks, Escape closes then clears, Alt+Down opens without moving.",
      "Matches are counted in a polite live region.",
    ],
  }),

  defineDemo({
    id: "autocomplete",
    name: "Autocomplete",
    category: "Forms",
    description: "Free text with suggestions and optional inline completion.",
    exports: ["Autocomplete"],
    controls: { inlineComplete: { type: "boolean", default: true } },
    render: ({ inlineComplete }) => (
      <div style={w}>
        <Field label="Street">
          <Autocomplete
            inlineComplete={inlineComplete}
            placeholder="Start typing"
            suggestions={streets}
          />
        </Field>
      </div>
    ),
    code: ({ inlineComplete }) =>
      snippet(
        [`import { Autocomplete, Field } from "kitgrid"`],
        inField(
          "Street",
          jsx("Autocomplete", {
            suggestions: raw("streets"),
            placeholder: "Start typing",
            inlineComplete,
          }),
        ),
        [decl("streets", streets)],
      ),
    accessibility: [
      "aria-autocomplete is list, or both with inline completion.",
      "Tab or Right at the end accepts the ghost text; Escape closes, then clears.",
    ],
  }),

  defineDemo({
    id: "multi-select",
    name: "Multi Select",
    category: "Forms",
    description: "Pick several options as chips.",
    exports: ["MultiSelect"],
    controls: { maxChips: { type: "number", min: 1, max: 4, default: 3 } },
    render: ({ maxChips }) => (
      <div style={w}>
        <Field label="Reviewers">
          <MultiSelect
            options={people}
            defaultValue={["maya", "kenji"]}
            maxChips={maxChips}
            placeholder="Add people"
          />
        </Field>
      </div>
    ),
    code: ({ maxChips }) =>
      snippet(
        [`import { Field, MultiSelect } from "kitgrid"`],
        inField(
          "Reviewers",
          jsx("MultiSelect", {
            options: raw("people"),
            defaultValue: ["maya", "kenji"],
            maxChips,
            placeholder: "Add people",
          }),
        ),
        [decl("people", people)],
      ),
    accessibility: [
      "The listbox is aria-multiselectable; Enter toggles and keeps it open.",
      "Backspace on an empty field marks the last chip, a second press removes it.",
      "Left walks the chips; Backspace or Delete removes the focused one.",
    ],
  }),

  defineDemo({
    id: "tag-input",
    name: "Tag Input",
    category: "Forms",
    description: "Free-form tags with paste splitting.",
    exports: ["TagInput"],
    controls: { max: { type: "number", min: 1, max: 8, default: 5 } },
    render: ({ max }) => (
      <div style={w}>
        <Field label="Topics">
          <TagInput defaultValue={["design", "react"]} max={max} placeholder="Add a topic" />
        </Field>
      </div>
    ),
    code: ({ max }) =>
      snippet(
        [`import { Field, TagInput } from "kitgrid"`],
        inField(
          "Topics",
          jsx("TagInput", {
            defaultValue: ["design", "react"],
            max,
            placeholder: "Add a topic",
          }),
        ),
      ),
    accessibility: [
      "Enter or comma adds; pasted lists split on commas and new lines.",
      "Each chip has a labelled remove button reachable with Left.",
    ],
  }),

  defineDemo({
    id: "search-select",
    name: "Search Select",
    category: "Forms",
    description: "A select for long lists with a search box.",
    exports: ["SearchSelect"],
    controls: {
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
      disabled: { type: "boolean", default: false },
    },
    render: ({ size, disabled }) => (
      <div style={w}>
        <Field label="Time zone">
          <SearchSelect
            options={zones}
            defaultValue="Europe/Lisbon"
            size={size}
            disabled={disabled}
          />
        </Field>
      </div>
    ),
    code: ({ size, disabled }) =>
      snippet(
        [`import { Field, SearchSelect } from "kitgrid"`],
        inField(
          "Time zone",
          jsx(
            "SearchSelect",
            { options: raw("zones"), defaultValue: "Europe/Lisbon", size, disabled },
            undefined,
            { size: "md" },
          ),
        ),
        [decl("zones", zones)],
      ),
    accessibility: [
      "Opening moves focus to the search combobox; Enter picks and returns focus.",
      "The trigger's name includes the chosen value.",
    ],
  }),

  defineDemo({
    id: "tree-select",
    name: "Tree Select",
    category: "Forms",
    description: "A select over nested options.",
    exports: ["TreeSelect"],
    controls: { selectBranches: { type: "boolean", default: false } },
    render: ({ selectBranches }) => (
      <div style={w}>
        <Field label="Folder">
          <TreeSelect nodes={folders} defaultValue="logos" selectBranches={selectBranches} />
        </Field>
      </div>
    ),
    code: ({ selectBranches }) =>
      snippet(
        [`import { Field, TreeSelect } from "kitgrid"`],
        inField(
          "Folder",
          jsx("TreeSelect", { nodes: raw("folders"), defaultValue: "logos", selectBranches }),
        ),
        [decl("folders", folders)],
      ),
    accessibility: [
      "APG tree: Up and Down move, Right opens or enters, Left closes or goes to the parent.",
      "Enter picks; Escape closes and returns focus.",
    ],
  }),

  defineDemo({
    id: "cascader",
    name: "Cascader",
    category: "Forms",
    description: "Pick a path one column at a time.",
    exports: ["Cascader"],
    render: () => (
      <div style={w}>
        <Field label="Region">
          <Cascader options={regions} defaultValue={["jp", "tokyo"]} />
        </Field>
      </div>
    ),
    code: () =>
      snippet(
        [`import { Cascader, Field } from "kitgrid"`],
        inField(
          "Region",
          jsx("Cascader", { options: raw("regions"), defaultValue: ["jp", "tokyo"] }),
        ),
        [decl("regions", regions)],
      ),
    accessibility: ["Right or Enter opens a branch, Left steps back, Enter on a leaf picks the path."],
  }),

  defineDemo({
    id: "transfer-list",
    name: "Transfer List",
    category: "Forms",
    description: "Move items between two lists.",
    exports: ["TransferList"],
    controls: { searchable: { type: "boolean", default: false } },
    render: ({ searchable }) => (
      <div style={{ width: 520, maxWidth: "100%" }}>
        <TransferList options={columns} defaultValue={["sku", "price"]} searchable={searchable} />
      </div>
    ),
    code: ({ searchable }) =>
      snippet(
        [`import { TransferList } from "kitgrid"`],
        jsx("TransferList", {
          options: raw("columns"),
          defaultValue: ["sku", "price"],
          searchable,
        }),
        [decl("columns", columns)],
      ),
    accessibility: [
      "Each side is a multi-select listbox: Space checks, Enter moves, Ctrl or Cmd+A checks all.",
    ],
  }),

  defineDemo({
    id: "calendar",
    name: "Calendar",
    category: "Forms",
    description: "A month grid for days or ranges.",
    exports: ["Calendar"],
    controls: {
      mode: { type: "select", options: ["single", "range"], default: "single" },
      months: { type: "select", options: ["1", "2"], default: "1" },
    },
    render: ({ mode, months }) =>
      mode === "range" ? (
        <Calendar mode="range" months={months === "2" ? 2 : 1} />
      ) : (
        <Calendar months={months === "2" ? 2 : 1} />
      ),
    code: ({ mode, months }) =>
      snippet(
        [`import { Calendar } from "kitgrid"`],
        jsx("Calendar", { mode, months: months === "2" ? 2 : undefined }, undefined, {
          mode: "single",
        }),
      ),
    accessibility: [
      "APG date grid with one tab stop.",
      "Left and Right move a day, Up and Down a week, Home and End to week edges, Page Up and Down a month, with Shift a year.",
      "Today is aria-current=date; days outside min and max are aria-disabled.",
    ],
  }),

  defineDemo({
    id: "date-picker",
    name: "Date Picker",
    category: "Forms",
    description: "A field that opens a Calendar.",
    exports: ["DatePicker"],
    controls: {
      mode: { type: "select", options: ["single", "range"], default: "single" },
      clearable: { type: "boolean", default: true },
    },
    render: ({ mode, clearable }) => (
      <div style={w}>
        <Field label={mode === "range" ? "Stay" : "Delivery"}>
          {mode === "range" ? (
            <DatePicker mode="range" months={2} clearable={clearable} />
          ) : (
            <DatePicker clearable={clearable} />
          )}
        </Field>
      </div>
    ),
    code: ({ mode, clearable }) =>
      snippet(
        [`import { DatePicker, Field } from "kitgrid"`],
        inField(
          mode === "range" ? "Stay" : "Delivery",
          jsx(
            "DatePicker",
            { mode, months: mode === "range" ? 2 : undefined, clearable },
            undefined,
            { mode: "single" },
          ),
        ),
      ),
    accessibility: [
      "The popup is a labelled dialog; focus lands on the chosen day and returns on pick or Escape.",
    ],
  }),

  defineDemo({
    id: "time-picker",
    name: "Time Picker",
    category: "Forms",
    description: "Typed hour and minute segments.",
    exports: ["TimePicker"],
    controls: {
      hourCycle: { type: "select", options: ["12", "24"], default: "12" },
      minuteStep: { type: "number", min: 1, max: 30, default: 5 },
    },
    render: ({ hourCycle, minuteStep }) => (
      <Field label="Pickup">
        <TimePicker
          defaultValue="09:30"
          hourCycle={hourCycle === "24" ? 24 : 12}
          minuteStep={minuteStep}
        />
      </Field>
    ),
    code: ({ hourCycle, minuteStep }) =>
      snippet(
        [`import { Field, TimePicker } from "kitgrid"`],
        inField(
          "Pickup",
          jsx(
            "TimePicker",
            { defaultValue: "09:30", hourCycle: Number(hourCycle), minuteStep },
            undefined,
            { hourCycle: 12 },
          ),
        ),
      ),
    accessibility: [
      "Each segment is a spinbutton: type digits, Up and Down step, Left and Right move, Backspace clears.",
      "A or P sets the period on 12-hour clocks.",
    ],
  }),

  defineDemo({
    id: "date-time-field",
    name: "Date Time Field",
    category: "Forms",
    description: "Date and time segments in the locale's order.",
    exports: ["DateTimeField"],
    controls: {
      locale: { type: "select", options: ["en-US", "en-GB", "de-DE", "ja-JP"], default: "en-US" },
    },
    render: ({ locale }) => (
      <Field label="Starts">
        <DateTimeField locale={locale} defaultValue="2026-11-25T18:30" />
      </Field>
    ),
    code: ({ locale }) =>
      snippet(
        [`import { DateTimeField, Field } from "kitgrid"`],
        inField("Starts", jsx("DateTimeField", { locale, defaultValue: "2026-11-25T18:30" })),
      ),
    accessibility: ["Segments follow the locale; the calendar button opens a dialog for the date part."],
  }),

  defineDemo({
    id: "time-slot-picker",
    name: "Time Slot Picker",
    category: "Forms",
    description: "Bookable times as a grid.",
    exports: ["TimeSlotPicker"],
    controls: { disabled: { type: "boolean", default: false } },
    render: ({ disabled }) => (
      <div style={stack}>
        <TimeSlotPicker label="Appointment" defaultValue="10:30" slots={slots} disabled={disabled} />
      </div>
    ),
    code: ({ disabled }) =>
      snippet(
        [`import { TimeSlotPicker } from "kitgrid"`],
        jsx("TimeSlotPicker", {
          label: "Appointment",
          defaultValue: "10:30",
          slots: raw("slots"),
          disabled,
        }),
        [decl("slots", slots)],
      ),
    accessibility: ["Native radios: arrow keys move and skip taken slots."],
  }),

  defineDemo({
    id: "number-field",
    name: "Number Field",
    category: "Forms",
    description: "Locale-aware number entry with steppers.",
    exports: ["NumberField"],
    controls: {
      stepper: { type: "select", options: ["split", "stacked", "none"], default: "split" },
      locale: { type: "select", options: ["en-US", "de-DE", "fr-FR"], default: "en-US" },
    },
    render: ({ stepper, locale }) => (
      <div style={{ width: 200 }}>
        <Field label="Guests">
          <NumberField defaultValue={2} min={1} max={12} stepper={stepper} locale={locale} />
        </Field>
      </div>
    ),
    code: ({ stepper, locale }) =>
      snippet(
        [`import { Field, NumberField } from "kitgrid"`],
        inField(
          "Guests",
          jsx(
            "NumberField",
            { defaultValue: 2, min: 1, max: 12, stepper, locale },
            undefined,
            { stepper: "split", locale: "en-US" },
          ),
        ),
      ),
    accessibility: [
      "role=spinbutton with min, max and a formatted aria-valuetext.",
      "Up and Down step, Shift or Page keys step by ten, Home and End jump to the bounds.",
    ],
  }),

  defineDemo({
    id: "currency-input",
    name: "Currency Input",
    category: "Forms",
    description: "Amounts in the currency's minor units.",
    exports: ["CurrencyInput"],
    controls: {
      currency: { type: "select", options: ["USD", "EUR", "JPY", "INR"], default: "USD" },
      showCode: { type: "boolean", default: true },
    },
    render: ({ currency, showCode }) => (
      <div style={{ width: 240 }}>
        <Field label="Price">
          <CurrencyInput currency={currency} showCode={showCode} defaultValue={1249.5} />
        </Field>
      </div>
    ),
    code: ({ currency, showCode }) =>
      snippet(
        [`import { CurrencyInput, Field } from "kitgrid"`],
        inField("Price", jsx("CurrencyInput", { currency, showCode, defaultValue: 1249.5 })),
      ),
    accessibility: ["The symbol is outside the editable text; the amount is grouped on blur."],
  }),

  defineDemo({
    id: "phone-input",
    name: "Phone Input",
    category: "Forms",
    description: "National format with a searchable country code.",
    exports: ["PhoneInput"],
    controls: {
      defaultCountry: { type: "select", options: ["GB", "US", "IN", "JP"], default: "GB" },
    },
    render: ({ defaultCountry }) => (
      <div style={w}>
        <Field label="Phone">
          <PhoneInput key={defaultCountry} defaultCountry={defaultCountry} />
        </Field>
      </div>
    ),
    code: ({ defaultCountry }) =>
      snippet(
        [`import { Field, PhoneInput } from "kitgrid"`],
        inField("Phone", jsx("PhoneInput", { defaultCountry })),
      ),
    accessibility: ["Reports E.164; pasting a number with a + prefix switches the country."],
  }),

  defineDemo({
    id: "credit-card-input",
    name: "Credit Card Input",
    category: "Forms",
    description: "Number, expiry and code in one field.",
    exports: ["CreditCardInput"],
    render: () => (
      <div style={{ width: 380, maxWidth: "100%" }}>
        <Field label="Card">
          <CreditCardInput />
        </Field>
      </div>
    ),
    code: () =>
      snippet(
        [`import { CreditCardInput, Field } from "kitgrid"`],
        inField("Card", "<CreditCardInput />"),
      ),
    accessibility: [
      "Three labelled inputs with cc autocomplete tokens.",
      "Focus advances as each part fills; a failed Luhn check sets aria-invalid.",
    ],
  }),

  defineDemo({
    id: "password-field",
    name: "Password Field",
    category: "Forms",
    description: "Reveal, strength and requirements.",
    exports: ["PasswordField"],
    controls: {
      meter: { type: "boolean", default: true },
      rules: { type: "boolean", default: true },
    },
    render: ({ meter, rules: showRules }) => (
      <div style={w}>
        <Field label="Password">
          <PasswordField
            meter={meter}
            autoComplete="new-password"
            defaultValue="Harbor2026"
            rules={showRules ? rules : undefined}
          />
        </Field>
      </div>
    ),
    code: ({ meter, rules: showRules }) =>
      snippet(
        [`import { Field, PasswordField } from "kitgrid"`],
        inField(
          "Password",
          jsx("PasswordField", {
            meter,
            autoComplete: "new-password",
            rules: showRules ? raw("rules") : undefined,
          }),
        ),
        showRules ? [rulesCode] : [],
      ),
    accessibility: [
      "The reveal toggle keeps its name and flips aria-pressed.",
      "Strength and requirements describe the input; Caps Lock shows a hint.",
    ],
  }),

  defineDemo({
    id: "mention-input",
    name: "Mention Input",
    category: "Forms",
    description: "A textarea that suggests people after @.",
    exports: ["MentionInput"],
    render: () => (
      <div style={{ width: 380, maxWidth: "100%" }}>
        <Field label="Comment">
          <MentionInput
            suggestions={people}
            defaultValue="Looks good @maya, "
            placeholder="Write a comment"
          />
        </Field>
      </div>
    ),
    code: () =>
      snippet(
        [`import { Field, MentionInput } from "kitgrid"`],
        inField(
          "Comment",
          jsx("MentionInput", { suggestions: raw("people"), placeholder: "Write a comment" }),
        ),
        [decl("people", people)],
      ),
    accessibility: ["Up and Down choose, Enter or Tab inserts, Escape closes; matches are announced."],
  }),

  defineDemo({
    id: "inline-edit",
    name: "Inline Edit",
    category: "Forms",
    description: "Text that turns into an input.",
    exports: ["InlineEdit"],
    controls: { size: { type: "select", options: ["sm", "md", "lg", "xl"], default: "lg" } },
    render: ({ size }) => (
      <InlineEdit label="Project name" defaultValue="Harbor redesign" size={size} required />
    ),
    code: ({ size }) =>
      snippet(
        [`import { InlineEdit } from "kitgrid"`],
        jsx(
          "InlineEdit",
          { label: "Project name", defaultValue: "Harbor redesign", size, required: true },
          undefined,
          { size: "md" },
        ),
      ),
    accessibility: ["Enter saves, Escape cancels; focus returns to the text either way."],
  }),

  defineDemo({
    id: "input-group",
    name: "Input Group",
    category: "Forms",
    description: "The field surface for custom compositions.",
    exports: ["InputGroup", "InputGroupAddon"],
    serverSafe: true,
    render: () => (
      <div style={w}>
        <InputGroup>
          <InputGroupAddon kind="text">https://</InputGroupAddon>
          <input className="kg-input-group__control" aria-label="Domain" placeholder="store" />
          <InputGroupAddon kind="text">.shop</InputGroupAddon>
        </InputGroup>
      </div>
    ),
    code: () =>
      snippet(
        [`import { InputGroup, InputGroupAddon } from "kitgrid"`],
        `<InputGroup>\n  <InputGroupAddon kind="text">https://</InputGroupAddon>\n  <input className="kg-input-group__control" aria-label="Domain" placeholder="store" />\n  <InputGroupAddon kind="text">.shop</InputGroupAddon>\n</InputGroup>`,
      ),
    accessibility: ["Icon addons are aria-hidden; text addons stay readable."],
  }),

  defineDemo({
    id: "toggle",
    name: "Toggle",
    category: "Forms",
    description: "A two-state button.",
    exports: ["Toggle"],
    controls: {
      variant: { type: "select", options: ["ghost", "outline"], default: "outline" },
      disabled: { type: "boolean", default: false },
    },
    render: ({ variant, disabled }) => (
      <div style={{ display: "flex", gap: 8 }}>
        <Toggle aria-label="Bold" variant={variant} disabled={disabled} defaultPressed>
          <Bold />
        </Toggle>
        <Toggle variant={variant} disabled={disabled}>
          <Star /> Favorite
        </Toggle>
      </div>
    ),
    code: ({ variant, disabled }) => {
      const attrs = `${variant === "ghost" ? "" : ` variant="${variant}"`}${disabled ? " disabled" : ""}`
      return snippet(
        [`import { Toggle } from "kitgrid"`, `import { Bold, Star } from "lucide-react"`],
        `<div style={{ display: "flex", gap: 8 }}>
  <Toggle aria-label="Bold"${attrs} defaultPressed>
    <Bold />
  </Toggle>
  <Toggle${attrs}>
    <Star /> Favorite
  </Toggle>
</div>`,
      )
    },
    accessibility: ["aria-pressed carries the state; the name stays the same."],
  }),

  defineDemo({
    id: "toggle-group",
    name: "Toggle Group",
    category: "Forms",
    description: "Toggles with one tab stop.",
    exports: ["ToggleGroup", "ToggleGroupItem"],
    controls: {
      type: { type: "select", options: ["single", "multiple"], default: "single" },
      attached: { type: "boolean", default: true },
    },
    render: ({ type, attached }) =>
      type === "single" ? (
        <ToggleGroup aria-label="Alignment" defaultValue="left" required attached={attached}>
          <ToggleGroupItem value="left" aria-label="Left">
            <AlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Center">
            <AlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Right">
            <AlignRight />
          </ToggleGroupItem>
        </ToggleGroup>
      ) : (
        <ToggleGroup type="multiple" aria-label="Format" defaultValue={["bold"]} attached={attached}>
          <ToggleGroupItem value="bold" aria-label="Bold">
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <Italic />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <Underline />
          </ToggleGroupItem>
        </ToggleGroup>
      ),
    code: ({ type, attached }) =>
      type === "single"
        ? snippet(
            [
              `import { ToggleGroup, ToggleGroupItem } from "kitgrid"`,
              `import { AlignCenter, AlignLeft, AlignRight } from "lucide-react"`,
            ],
            `<ToggleGroup aria-label="Alignment" defaultValue="left" required${attached ? " attached" : ""}>\n  <ToggleGroupItem value="left" aria-label="Left">\n    <AlignLeft />\n  </ToggleGroupItem>\n  <ToggleGroupItem value="center" aria-label="Center">\n    <AlignCenter />\n  </ToggleGroupItem>\n  <ToggleGroupItem value="right" aria-label="Right">\n    <AlignRight />\n  </ToggleGroupItem>\n</ToggleGroup>`,
          )
        : snippet(
            [
              `import { ToggleGroup, ToggleGroupItem } from "kitgrid"`,
              `import { Bold, Italic, Underline } from "lucide-react"`,
            ],
            `<ToggleGroup type="multiple" aria-label="Format" defaultValue={["bold"]}${attached ? " attached" : ""}>\n  <ToggleGroupItem value="bold" aria-label="Bold">\n    <Bold />\n  </ToggleGroupItem>\n  <ToggleGroupItem value="italic" aria-label="Italic">\n    <Italic />\n  </ToggleGroupItem>\n  <ToggleGroupItem value="underline" aria-label="Underline">\n    <Underline />\n  </ToggleGroupItem>\n</ToggleGroup>`,
          ),
    accessibility: ["Arrow keys move between items; Space or Enter toggles."],
  }),

  defineDemo({
    id: "checkbox-card",
    name: "Checkbox Card",
    category: "Forms",
    description: "A native checkbox as a card.",
    exports: ["CheckboxCard"],
    serverSafe: true,
    controls: { disabled: { type: "boolean", default: false } },
    render: ({ disabled }) => (
      <div style={stack}>
        <CheckboxCard
          name="addons"
          value="gift"
          label="Gift wrap"
          description="Recycled paper"
          aside="$4"
          icon={<Gift />}
          disabled={disabled}
          defaultChecked
        />
        <CheckboxCard
          name="addons"
          value="insure"
          label="Insurance"
          description="Covers loss and damage"
          aside="$6"
          icon={<Shield />}
          disabled={disabled}
        />
      </div>
    ),
    code: ({ disabled }) =>
      snippet(
        [`import { CheckboxCard } from "kitgrid"`, `import { Gift, Shield } from "lucide-react"`],
        `<div style={{ display: "grid", gap: 12 }}>\n  ${jsx("CheckboxCard", { name: "addons", value: "gift", label: "Gift wrap", description: "Recycled paper", aside: "$4", icon: raw("<Gift />"), disabled, defaultChecked: true }).replace(/\n/g, "\n  ")}\n  ${jsx("CheckboxCard", { name: "addons", value: "insure", label: "Insurance", description: "Covers loss and damage", aside: "$6", icon: raw("<Shield />"), disabled }).replace(/\n/g, "\n  ")}\n</div>`,
      ),
    accessibility: ["The whole card is the label; Space toggles and forms submit natively."],
  }),

  defineDemo({
    id: "switch-group",
    name: "Switch Group",
    category: "Forms",
    description: "A settings list of switches.",
    exports: ["SwitchGroup"],
    controls: { disabled: { type: "boolean", default: false } },
    render: ({ disabled }) => (
      <div style={stack}>
        <SwitchGroup
          label="Notifications"
          defaultValue={["orders"]}
          disabled={disabled}
          options={[
            { value: "orders", label: "Order updates", icon: <Truck /> },
            { value: "restock", label: "Restock alerts", icon: <Bell /> },
            { value: "offers", label: "Offers", icon: <Gift /> },
          ]}
        />
      </div>
    ),
    code: ({ disabled }) =>
      snippet(
        [`import { SwitchGroup } from "kitgrid"`, `import { Bell, Gift, Truck } from "lucide-react"`],
        jsx("SwitchGroup", {
          label: "Notifications",
          defaultValue: ["orders"],
          disabled,
          options: raw(
            `[\n    { value: "orders", label: "Order updates", icon: <Truck /> },\n    { value: "restock", label: "Restock alerts", icon: <Bell /> },\n    { value: "offers", label: "Offers", icon: <Gift /> },\n  ]`,
          ),
        }),
      ),
    accessibility: ["Each row is a native switch with its own id, even inside a Field."],
  }),

  defineDemo({
    id: "scale-input",
    name: "Scale Input",
    category: "Forms",
    description: "A numbered rating scale.",
    exports: ["ScaleInput"],
    controls: { tone: { type: "select", options: ["plain", "nps"], default: "nps" } },
    render: ({ tone }) => (
      <ScaleInput
        label="How likely are you to recommend us?"
        tone={tone}
        defaultValue={9}
        minLabel="Not likely"
        maxLabel="Very likely"
      />
    ),
    code: ({ tone }) =>
      snippet(
        [`import { ScaleInput } from "kitgrid"`],
        jsx(
          "ScaleInput",
          {
            label: "How likely are you to recommend us?",
            tone,
            defaultValue: 9,
            minLabel: "Not likely",
            maxLabel: "Very likely",
          },
          undefined,
          { tone: "plain" },
        ),
      ),
    accessibility: ["Native radios; the end captions describe the group."],
  }),

  defineDemo({
    id: "knob",
    name: "Knob",
    category: "Forms",
    description: "A rotary slider.",
    exports: ["Knob"],
    controls: {
      size: { type: "select", options: ["sm", "md", "lg"], default: "lg" },
      disabled: { type: "boolean", default: false },
    },
    render: ({ size, disabled }) => (
      <Knob
        aria-label="Mix"
        size={size}
        disabled={disabled}
        defaultValue={64}
        formatValue={(v) => `${v}%`}
      />
    ),
    code: ({ size, disabled }) =>
      snippet(
        [`import { Knob } from "kitgrid"`],
        jsx(
          "Knob",
          {
            "aria-label": "Mix",
            size,
            disabled,
            defaultValue: 64,
            formatValue: raw("(v) => `${v}%`"),
          },
          undefined,
          { size: "md" },
        ),
      ),
    accessibility: ["role=slider: drag up or down, arrows step, Page keys move by tenths."],
  }),

  defineDemo({
    id: "color-picker",
    name: "Color Picker",
    category: "Forms",
    description: "Area, hue, opacity and hex.",
    exports: ["ColorPicker"],
    controls: { alpha: { type: "boolean", default: true } },
    render: ({ alpha }) => <ColorPicker alpha={alpha} defaultValue="#e8742a" swatches={swatches} />,
    code: ({ alpha }) =>
      snippet(
        [`import { ColorPicker } from "kitgrid"`],
        jsx("ColorPicker", { alpha, defaultValue: "#e8742a", swatches: raw("swatches") }),
        [decl("swatches", swatches)],
      ),
    accessibility: [
      "The area, hue and opacity are keyboard sliders with spoken values.",
      "Hex commits on Enter or blur; the eyedropper appears where the browser has one.",
    ],
  }),

  defineDemo({
    id: "file-dropzone",
    name: "File Dropzone",
    category: "Forms",
    description: "Drop or browse, with previews and progress.",
    exports: ["FileDropzone"],
    controls: { disabled: { type: "boolean", default: false } },
    render: ({ disabled }) => (
      <div style={{ width: 400, maxWidth: "100%" }}>
        <FileDropzone
          accept="image/*,.pdf"
          maxSize={10_000_000}
          disabled={disabled}
          labels={{ hint: "PNG, JPG or PDF, up to 10 MB" }}
        />
      </div>
    ),
    code: ({ disabled }) =>
      snippet(
        [`import { FileDropzone } from "kitgrid"`],
        jsx("FileDropzone", {
          accept: "image/*,.pdf",
          maxSize: raw("10_000_000"),
          disabled,
          labels: raw(`{ hint: "PNG, JPG or PDF, up to 10 MB" }`),
        }),
      ),
    accessibility: [
      "One real button opens the file dialog; rejections are announced in a status region.",
      "Each upload row has a labelled progressbar and remove button.",
    ],
  }),

  defineDemo({
    id: "avatar-upload",
    name: "Avatar Upload",
    category: "Forms",
    description: "A round photo picker.",
    exports: ["AvatarUpload"],
    controls: {
      size: { type: "select", options: ["sm", "md", "lg"], default: "lg" },
      initials: { type: "boolean", default: false },
      disabled: { type: "boolean", default: false },
    },
    render: ({ size, initials, disabled }) => (
      <AvatarUpload size={size} fallback={initials ? "MC" : undefined} disabled={disabled} />
    ),
    code: ({ size, initials, disabled }) =>
      snippet(
        [`import { AvatarUpload } from "kitgrid"`],
        jsx(
          "AvatarUpload",
          { size, fallback: initials ? "MC" : undefined, disabled },
          undefined,
          { size: "md" },
        ),
      ),
    accessibility: [
      "Change and Remove are labelled buttons; the preview is decorative.",
      "With no photo and no fallback, a neutral placeholder holds the shape.",
    ],
  }),

  defineDemo({
    id: "signature-pad",
    name: "Signature Pad",
    category: "Forms",
    description: "Sign with mouse, pen or finger.",
    exports: ["SignaturePad"],
    controls: { disabled: { type: "boolean", default: false } },
    render: ({ disabled }) => (
      <div style={{ width: 400, maxWidth: "100%" }}>
        <SignaturePad disabled={disabled} />
      </div>
    ),
    code: ({ disabled }) =>
      snippet(
        [`import { SignaturePad } from "kitgrid"`],
        jsx("SignaturePad", {
          disabled,
          onValueChange: raw("(dataUrl) => console.log(dataUrl)"),
        }),
      ),
    accessibility: [
      "The canvas is an img whose name says whether it is signed.",
      "Undo and Clear are buttons; offer a typed name as a keyboard alternative.",
    ],
  }),

  defineDemo({
    id: "form-wizard",
    name: "Form Wizard",
    category: "Forms",
    description: "Steps with validation before each move.",
    exports: ["FormWizard", "FormWizardStep", "useFormWizard"],
    render: () => <Wizard />,
    code: () => wizardCode,
    accessibility: [
      "The current step is aria-current=step; focus moves to each new step's heading.",
      "Validation messages are announced as alerts; visited steps can be revisited from the rail.",
    ],
  }),
]
