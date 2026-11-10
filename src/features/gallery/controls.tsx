import {
  IconButton,
  Input,
  SegmentedControl,
  Select,
  Slider,
  Switch,
  Tooltip,
} from "kitgrid"
import { RotateCcw } from "lucide-react"
import { useId } from "react"
import type { Control } from "@/features/demos/registry"

interface ControlsProps {
  controls: Record<string, Control>
  values: Record<string, unknown>
  defaults: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
  onReset: () => void
}

const humanize = (key: string) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase())

/** Short option sets read best as a segmented switch; longer ones get a listbox. */
const fitsSegmented = (options: readonly string[]) =>
  options.length <= 3 && options.join("").length <= 22

const decimals = (step: number | undefined) =>
  step && step < 1 ? (String(step).split(".")[1]?.length ?? 0) : 0

const field = "grid gap-2 rounded-kg-lg px-1 py-1 data-[changed]:[&_.field-label]:after:ml-1.5 data-[changed]:[&_.field-label]:after:inline-block data-[changed]:[&_.field-label]:after:size-2 data-[changed]:[&_.field-label]:after:rounded-full data-[changed]:[&_.field-label]:after:bg-kg-ink data-[changed]:[&_.field-label]:after:content-['']"

const Field = ({
  name,
  control,
  value,
  changed,
  onChange,
}: {
  name: string
  control: Control
  value: unknown
  changed: boolean
  onChange: (value: unknown) => void
}) => {
  const id = useId()
  const labelId = `${id}-label`
  const label = control.label ?? humanize(name)

  if (control.type === "boolean")
    return (
      <div className={`${field} [&_label]:w-full [&_label]:justify-between`} data-changed={changed || undefined}>
        <Switch
          size="sm"
          label={label}
          labelPosition="start"
          checked={value as boolean}
          onCheckedChange={onChange}
        />
      </div>
    )

  const head = (output?: string) => (
    <div className="flex items-baseline justify-between gap-2">
      <span id={labelId} className="field-label text-kg-sm font-semibold">
        {label}
      </span>
      {output !== undefined && (
        <output htmlFor={id} className="font-mono text-kg-xs tabular-nums">
          {output}
        </output>
      )}
    </div>
  )

  switch (control.type) {
    case "select":
      return (
        <div className={field} data-changed={changed || undefined}>
          {head()}
          {fitsSegmented(control.options) ? (
            <SegmentedControl
              size="sm"
              fullWidth
              aria-labelledby={labelId}
              options={control.options.map((option) => ({
                value: option,
                label: option,
              }))}
              value={value as string}
              onValueChange={onChange}
            />
          ) : (
            <Select
              size="sm"
              aria-labelledby={labelId}
              options={control.options.map((option) => ({
                value: option,
                label: option,
              }))}
              value={value as string}
              onValueChange={onChange}
            />
          )}
        </div>
      )
    case "number": {
      const number = value as number
      return (
        <div className={field} data-changed={changed || undefined}>
          {head(number.toFixed(decimals(control.step)))}
          <Slider
            id={id}
            size="sm"
            min={control.min}
            max={control.max}
            step={control.step ?? 1}
            value={[number]}
            thumbLabels={[label]}
            showValue="never"
            onValueChange={([next]) => onChange(next)}
          />
        </div>
      )
    }
    case "color":
      return (
        <div className={field} data-changed={changed || undefined}>
          {head()}
          <label className="relative flex h-9 cursor-pointer items-center gap-2.5 rounded-kg-md border-2 border-kg-ink bg-kg-surface px-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-kg-ring">
            <input
              type="color"
              className="absolute inset-0 size-full cursor-pointer opacity-0"
              aria-labelledby={labelId}
              value={value as string}
              onChange={(event) => onChange(event.target.value)}
            />
            <span
              className="size-5 rounded-full border-2 border-kg-ink"
              style={{ background: value as string }}
            />
            <code className="font-mono text-kg-xs">{String(value).toUpperCase()}</code>
          </label>
        </div>
      )
    default:
      return (
        <div className={field} data-changed={changed || undefined}>
          {head()}
          <Input
            id={id}
            size="sm"
            aria-labelledby={labelId}
            value={value as string}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
      )
  }
}

export const Controls = ({
  controls,
  values,
  defaults,
  onChange,
  onReset,
}: ControlsProps) => {
  const entries = Object.entries(controls)
  const changed = entries.filter(([key]) => values[key] !== defaults[key]).length
  // Toggles sit together at the foot of the panel, like a bank of switches.
  const ordered = [
    ...entries.filter(([, control]) => control.type !== "boolean"),
    ...entries.filter(([, control]) => control.type === "boolean"),
  ]
  return (
    <aside
      className="flex min-w-0 flex-col rounded-kg-xl border-2 border-kg-ink bg-kg-paper-sage shadow-kg-sm"
      aria-labelledby="props-title"
    >
      <header className="flex items-center gap-2 border-b-2 border-kg-ink py-1.5 pr-1.5 pl-4">
        <h2 id="props-title" className="font-display text-lg font-extrabold tracking-tight">
          Props
        </h2>
        <span className="mr-auto text-kg-sm font-semibold tabular-nums">
          {changed > 0 ? `${changed} changed` : `${entries.length} props`}
        </span>
        <Tooltip content="Reset to defaults">
          <IconButton
            label="Reset props"
            icon={<RotateCcw />}
            variant="ghost"
            size="sm"
            disabled={changed === 0}
            onClick={onReset}
          />
        </Tooltip>
      </header>
      <div className="grid gap-4 p-4">
        {ordered.map(([key, control]) => (
          <Field
            key={key}
            name={key}
            control={control}
            value={values[key]}
            changed={values[key] !== defaults[key]}
            onChange={(value) => onChange(key, value)}
          />
        ))}
      </div>
    </aside>
  )
}
