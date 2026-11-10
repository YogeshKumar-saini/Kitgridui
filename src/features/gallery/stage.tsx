import { KitgridProvider, SegmentedControl, Tooltip } from "kitgrid"
import { Grid2x2, Monitor, Moon, RotateCcw, Snail, Sun } from "lucide-react"
import { type ReactNode, useState } from "react"

export type StageMode = "auto" | "light" | "dark" | "checker"

export const useStage = () => {
  const [mode, setMode] = useState<StageMode>("auto")
  const [reduced, setReduced] = useState(false)
  const [run, setRun] = useState(0)
  return {
    mode,
    setMode,
    reduced,
    toggleReduced: () => setReduced((value) => !value),
    run,
    replay: () => setRun((value) => value + 1),
  }
}

export type StageState = ReturnType<typeof useStage>

const modes: { value: StageMode; label: string; icon: ReactNode }[] = [
  { value: "auto", label: "Match page", icon: <Monitor aria-hidden /> },
  { value: "light", label: "Light stage", icon: <Sun aria-hidden /> },
  { value: "dark", label: "Dark stage", icon: <Moon aria-hidden /> },
  { value: "checker", label: "Checkerboard", icon: <Grid2x2 aria-hidden /> },
]

export const StageModeSwitch = ({ stage }: { stage: StageState }) => (
  <SegmentedControl
    size="sm"
    className="[&_svg]:size-3.5"
    aria-label="Stage background"
    options={modes.map(({ value, label, icon }) => ({
      value,
      icon,
      "aria-label": label,
    }))}
    value={stage.mode}
    onValueChange={stage.setMode}
  />
)

export const ToolButton = ({
  label,
  icon,
  pressed,
  onClick,
}: {
  label: string
  icon: ReactNode
  pressed?: boolean
  onClick: () => void
}) => (
  <Tooltip content={label}>
    <button
      type="button"
      className="grid size-8 place-items-center rounded-full text-kg-fg-muted transition-colors duration-(--kg-duration-fast) hover:bg-kg-muted hover:text-kg-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kg-ring aria-pressed:bg-kg-accent aria-pressed:text-kg-accent-fg [&_svg]:size-4"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {icon}
    </button>
  </Tooltip>
)

export const MotionTools = ({ stage }: { stage: StageState }) => (
  <>
    <ToolButton
      label={stage.reduced ? "Motion: reduced" : "Simulate reduced motion"}
      icon={<Snail aria-hidden />}
      pressed={stage.reduced}
      onClick={stage.toggleReduced}
    />
    <ToolButton
      label="Replay"
      icon={<RotateCcw aria-hidden />}
      onClick={stage.replay}
    />
  </>
)

export const Stage = ({
  stage,
  layout = "center",
  height,
  children,
}: {
  stage: StageState
  layout?: "center" | "fill"
  height?: number
  children: ReactNode
}) => (
  <div
    className="relative isolate grid min-h-80 bg-kg-bg bg-[radial-gradient(circle_at_1px_1px,var(--dot)_1px,transparent_0)] bg-size-[16px_16px] bg-center text-kg-fg [--dot:color-mix(in_oklab,var(--kg-fg)_14%,transparent)] data-[layout=center]:place-items-center data-[layout=center]:p-[clamp(1.5rem,5vw,3.5rem)] data-[mode=checker]:bg-[conic-gradient(var(--dot)_25%,transparent_0_50%,var(--dot)_0_75%,transparent_0)] data-[mode=checker]:bg-size-[18px_18px] data-[mode=checker]:[--dot:color-mix(in_oklab,var(--kg-fg)_8%,transparent)] md:min-h-96"
    data-layout={layout}
    data-mode={stage.mode}
    data-theme={
      stage.mode === "light" || stage.mode === "dark" ? stage.mode : undefined
    }
    style={height ? { minHeight: height } : undefined}
  >
    <KitgridProvider reducedMotion={stage.reduced ? "always" : "user"}>
      <div
        key={stage.run}
        className={
          layout === "fill" ? "grid min-h-[inherit] w-full min-w-0" : "min-w-0 max-w-full"
        }
      >
        {children}
      </div>
    </KitgridProvider>
  </div>
)
