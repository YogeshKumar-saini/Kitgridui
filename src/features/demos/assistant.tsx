import {
  AccentPicker,
  type AccentPickerOption,
  AgentTrace,
  type AgentTraceStep,
  AppearancePreview,
  Avatar,
  Badge,
  BentoLight,
  BentoLightCell,
  ChatMessage,
  ChatThread,
  ChatThreadDivider,
  FontPicker,
  type FontPickerOption,
  Grainient,
  IconButton,
  MarkdownText,
  ModeToggle,
  OptionTile,
  PointerLight,
  PromptInput,
  SessionList,
  type SessionListItem,
  Skeleton,
  SuggestionChips,
  ThemeCard,
  ThoughtLine,
} from "kitgrid"
import {
  ChartColumn,
  Database,
  Paperclip,
  Pencil,
  Search,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react"
import { type CSSProperties, useEffect, useRef, useState } from "react"
import { defineDemo, jsx, raw } from "./registry"

const panel: CSSProperties = {
  width: 720,
  maxWidth: "100%",
  background: "var(--kg-surface)",
  border: "2px solid var(--kg-ink)",
  borderRadius: "var(--kg-radius-xl)",
  boxShadow: "var(--kg-shadow-md)",
  overflow: "hidden",
}

const stack: CSSProperties = { display: "grid", gap: 16, width: 560, maxWidth: "100%" }

const ANSWER = `Revenue reached **₹2.41 Cr** last week, up **12.4%**.

- **Mumbai** led with ₹84.2 L.
- **Pune** dipped 3.1% after a stockout.`

const STEPS: AgentTraceStep[] = [
  {
    id: "schema",
    title: "Read the orders schema",
    status: "done",
    duration: 0.4,
    icon: <Search />,
  },
  {
    id: "query",
    title: "orders_by_city, last 14 days",
    status: "done",
    duration: 1.8,
    icon: <Database />,
    note: "Last two full weeks.",
    detail: (
      <code>
        select city, sum(net) from orders where placed_at &gt;= now() - 14 group by 1
      </code>
    ),
  },
  {
    id: "chart",
    title: "Chart revenue by city",
    status: "done",
    duration: 0.6,
    icon: <ChartColumn />,
  },
]

const STARTERS = [
  "How did revenue move last week?",
  "Which cities are growing fastest?",
  "Show refunds by reason",
]

type Turn = {
  id: number
  question: string
  steps: AgentTraceStep[]
  text: string
  done: boolean
  took?: number
  stopped?: boolean
}

const plain = (markdown: string) => markdown.replace(/\*\*|`/g, "")

const AssistantDemo = () => {
  const [turns, setTurns] = useState<Turn[]>([])
  const timers = useRef<number[]>([])
  const busy = turns.some((turn) => !turn.done)

  const clear = () => {
    for (const timer of timers.current) window.clearTimeout(timer)
    timers.current = []
  }
  useEffect(() => clear, [])

  const patch = (id: number, next: Partial<Turn>) =>
    setTurns((all) => all.map((turn) => (turn.id === id ? { ...turn, ...next } : turn)))

  const ask = (question: string) => {
    const id = Date.now()
    const started = performance.now()
    const later = (ms: number, run: () => void) => {
      timers.current.push(window.setTimeout(run, ms))
    }
    setTurns((all) => [...all, { id, question, steps: [], text: "", done: false }])
    STEPS.forEach((step, index) => {
      later(500 + index * 900, () =>
        patch(id, {
          steps: STEPS.slice(0, index + 1).map((s, at) =>
            at === index ? { ...s, status: "running", duration: undefined } : s,
          ),
        }),
      )
    })
    const words = ANSWER.split(/(?<=\s)/)
    const start = 500 + STEPS.length * 900
    later(start, () => patch(id, { steps: STEPS }))
    words.forEach((_, index) => {
      later(start + 200 + index * 28, () =>
        patch(id, {
          text: words.slice(0, index + 1).join(""),
          ...(index === words.length - 1
            ? { done: true, took: (performance.now() - started) / 1000 }
            : null),
        }),
      )
    })
  }

  const stop = () => {
    clear()
    setTurns((all) =>
      all.map((turn) =>
        turn.done
          ? turn
          : {
              ...turn,
              done: true,
              stopped: true,
              steps: turn.steps.map((step) =>
                step.status === "running" ? { ...step, status: "failed" } : step,
              ),
            },
      ),
    )
  }

  const last = turns[turns.length - 1]

  return (
    <div
      style={{
        ...panel,
        display: "flex",
        flexDirection: "column",
        height: 520,
        width: 640,
      }}
    >
      <ChatThread
        busy={busy}
        style={{ flex: 1 }}
        empty={
          <SuggestionChips layout="list" suggestions={STARTERS} onSelect={ask} />
        }
      >
        {turns.length > 0 && <ChatThreadDivider date={new Date()} />}
        {turns.flatMap((turn) => [
          <ChatMessage key={`${turn.id}-q`} from="user">
            {turn.question}
          </ChatMessage>,
          <ChatMessage
            key={`${turn.id}-a`}
            streaming={!turn.done}
            copyText={turn.done ? plain(turn.text) : undefined}
            onRetry={turn === last && turn.done ? () => ask(turn.question) : undefined}
            actions={
              turn.done && !turn.stopped ? (
                <>
                  <IconButton size="sm" label="Good answer" icon={<ThumbsUp />} />
                  <IconButton size="sm" label="Bad answer" icon={<ThumbsDown />} />
                </>
              ) : null
            }
          >
            <ThoughtLine
              active={!turn.done && turn.text === ""}
              label={String(
                turn.steps.find((step) => step.status === "running")?.title ??
                  "Thinking",
              )}
              duration={turn.took}
              settledLabel={(took) =>
                turn.stopped
                  ? "Stopped"
                  : took
                    ? `Worked for ${took.toFixed(1)}s`
                    : "Worked"
              }
            >
              {turn.steps.length > 0 ? <AgentTrace steps={turn.steps} /> : undefined}
            </ThoughtLine>
            {turn.text && <MarkdownText>{turn.text}</MarkdownText>}
          </ChatMessage>,
        ])}
      </ChatThread>
      <div style={{ padding: "4px 12px 12px" }}>
        <PromptInput
          placeholder="Ask about revenue, orders or refunds"
          streaming={busy}
          onStop={stop}
          onSubmit={ask}
          maxLength={1000}
          toolbar={<IconButton size="sm" label="Attach a file" icon={<Paperclip />} />}
        />
      </div>
    </div>
  )
}

const assistantCode = `function Example() {
  const [messages, setMessages] = useState<{ id: number; from: ChatMessageFrom; text: string }[]>([
    { id: 1, from: "user", text: "How did revenue move last week?" },
    { id: 2, from: "assistant", text: "Revenue reached **₹2.41 Cr**, up **12.4%**." },
  ])
  const send = (text: string) => setMessages((all) => [...all, { id: Date.now(), from: "user", text }])
  return (
    <div style={{ display: "flex", flexDirection: "column", height: 480 }}>
      <ChatThread style={{ flex: 1 }}>
        <ChatThreadDivider date={new Date()} />
        {messages.map((message) => (
          <ChatMessage key={message.id} from={message.from}>
            {message.from === "assistant" ? <MarkdownText>{message.text}</MarkdownText> : message.text}
          </ChatMessage>
        ))}
      </ChatThread>
      <PromptInput placeholder="Ask about revenue" onSubmit={send} />
    </div>
  )
}

<Example />`

const now = new Date()
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 3_600_000)

const SESSIONS: SessionListItem[] = [
  {
    id: "1",
    title: "Revenue by city, last week",
    updatedAt: hoursAgo(0.5),
    meta: "Overview",
  },
  { id: "2", title: "Why did Pune dip?", updatedAt: hoursAgo(2), meta: "Sales" },
  { id: "3", title: "Refunds by reason", updatedAt: hoursAgo(26), meta: "Returns" },
  { id: "4", title: "Diwali campaign recap", updatedAt: hoursAgo(24 * 12), meta: "Marketing" },
]

const SessionListDemo = ({ actions }: { actions: boolean }) => {
  const [sessions, setSessions] = useState(SESSIONS)
  const [active, setActive] = useState<string | null>("2")
  return (
    <div style={{ ...panel, width: 280, padding: 8, height: 340, display: "flex" }}>
      <SessionList
        style={{ flex: 1 }}
        sessions={sessions}
        activeId={active}
        onSelect={setActive}
        onNew={() => setActive(null)}
        actions={
          actions
            ? (session) => (
                <>
                  <IconButton
                    size="sm"
                    label={`Rename ${session.title}`}
                    icon={<Pencil />}
                  />
                  <IconButton
                    size="sm"
                    label={`Delete ${session.title}`}
                    icon={<Trash2 />}
                    onClick={() =>
                      setSessions((all) => all.filter((item) => item.id !== session.id))
                    }
                  />
                </>
              )
            : undefined
        }
      />
    </div>
  )
}

const ACCENTS: AccentPickerOption[] = [
  { value: "ink", label: "Ink", color: "var(--kg-ink)" },
  { value: "sage", label: "Sage", color: "var(--kg-paper-sage)" },
  { value: "peach", label: "Peach", color: "var(--kg-paper-peach)" },
  { value: "sky", label: "Sky", color: "var(--kg-paper-sky)" },
  { value: "butter", label: "Butter", color: "var(--kg-paper-butter)" },
  { value: "rose", label: "Rose", color: "var(--kg-paper-rose)" },
]

const FONTS: FontPickerOption[] = [
  {
    value: "bricolage",
    label: "Bricolage Grotesque",
    family: "var(--font-bricolage), system-ui, sans-serif",
    note: "Warm grotesk, the default",
  },
  {
    value: "geist",
    label: "Geist",
    family: "Geist, system-ui, sans-serif",
    note: "Neutral, for dense screens",
  },
  {
    value: "mono",
    label: "JetBrains Mono",
    family: "var(--font-jetbrains), ui-monospace, monospace",
    note: "Monospaced, for data",
  },
]

const PointerLightDemo = ({ blend, size }: { blend: string; size: number }) => (
  <PointerLight
    blend={blend as "normal"}
    size={size}
    style={{ ...panel, width: 520, padding: 28 }}
  >
    <p style={{ margin: 0, fontSize: 13, color: "var(--kg-fg-muted)" }}>
      Net revenue
    </p>
    <p
      style={{
        margin: "4px 0 18px",
        fontSize: 34,
        fontWeight: 700,
        letterSpacing: "-0.03em",
      }}
    >
      ₹2.41 Cr
    </p>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
      {[0.34, 0.52, 0.41, 0.68, 0.55, 0.88, 0.72, 0.8].map((height, index) => (
        <span
          key={index}
          style={{
            flex: 1,
            height: `${height * 100}%`,
            borderRadius: "4px 4px 0 0",
            background:
              index === 5
                ? "var(--kg-accent)"
                : "color-mix(in oklab, var(--kg-accent) 35%, var(--kg-surface))",
          }}
        />
      ))}
    </div>
  </PointerLight>
)

const BENTO = [
  { title: "Revenue", value: "₹2.41 Cr", span: 2 },
  { title: "Orders", value: "18,204" },
  { title: "Repeat buyers", value: "41%" },
  { title: "Refund rate", value: "2.7%", span: 2 },
]

const DENSITY = [
  { value: "compact", label: "Compact", gap: 2 },
  { value: "default", label: "Default", gap: 4 },
  { value: "spacious", label: "Spacious", gap: 7 },
]

const Rows = ({ gap }: { gap: number }) => (
  <span style={{ display: "grid", gap, width: 44 }}>
    <Skeleton height={4} />
    <Skeleton height={4} />
    <Skeleton height={4} />
  </span>
)

const Chip = () => <Badge variant="outline">orders-october.csv</Badge>

export const demos = [
  defineDemo({
    id: "chat-thread",
    name: "Chat Thread",
    category: "Assistant",
    description: "A conversation log that follows streaming answers.",
    exports: ["ChatThread", "ChatThreadDivider"],
    height: 600,
    featured: true,
    render: () => <AssistantDemo />,
    code: () => assistantCode,
    accessibility: [
      'The thread is role="log" with aria-live="polite", so new messages are announced without moving focus.',
      "aria-busy is set while an answer streams, so screen readers read the settled answer instead of every word.",
      "The scroll region is focusable, so it scrolls with the arrow keys. The jump button appears only when you have scrolled away.",
      "Day dividers are plain text, read in order with the messages.",
    ],
  }),

  defineDemo({
    id: "chat-message",
    name: "Chat Message",
    category: "Assistant",
    description: "One user, assistant or system turn.",
    exports: ["ChatMessage"],
    controls: {
      from: { type: "select", options: ["assistant", "user", "system"], default: "assistant" },
      streaming: { type: "boolean", default: false },
      actions: { type: "boolean", default: true, label: "Copy and retry" },
    },
    render: ({ from, streaming, actions }) => (
      <div style={{ ...stack, width: 520 }}>
        <ChatMessage
          from={from}
          streaming={streaming}
          time="10:42"
          copyText={actions ? "Mumbai led with ₹84.2 L." : undefined}
          onRetry={actions ? () => {} : undefined}
          avatar={from === "user" ? <Avatar size="sm" name="Ananya Rao" /> : undefined}
        >
          {from === "assistant" ? (
            <MarkdownText>{"**Mumbai** led with ₹84.2 L."}</MarkdownText>
          ) : from === "user" ? (
            "Which city led last week?"
          ) : (
            "Switched to the Sales dataset"
          )}
        </ChatMessage>
      </div>
    ),
    code: ({ from, streaming, actions }) => {
      const props = [
        from === "assistant" ? "" : ` from="${from}"`,
        streaming ? " streaming" : "",
        ' time="10:42"',
        actions && from !== "user" ? ` copyText="Mumbai led with ₹84.2 L." onRetry={() => {}}` : "",
      ].join("")
      const body =
        from === "assistant"
          ? `<MarkdownText>{"**Mumbai** led with ₹84.2 L."}</MarkdownText>`
          : from === "user"
            ? "Which city led last week?"
            : "Switched to the Sales dataset"
      return `<ChatMessage${props}>\n  ${body}\n</ChatMessage>`
    },
    accessibility: [
      "Each message is an article named by its author (You, Assistant, System or your name).",
      "Streaming sets aria-busy and draws a caret after the last words; the caret stops blinking under reduced motion.",
      "Copy confirms through its label and a polite status. Actions are revealed on hover and focus, and always shown on touch screens.",
    ],
  }),

  defineDemo({
    id: "thought-line",
    name: "Thought Line",
    category: "Assistant",
    description: "The assistant's reasoning line with a timer.",
    exports: ["ThoughtLine", "formatThoughtDuration"],
    controls: {
      active: { type: "boolean", default: true },
      label: { type: "text", default: "Querying orders by city" },
      steps: { type: "boolean", default: true, label: "With steps" },
    },
    render: ({ active, label, steps }) => (
      <div style={{ ...stack, width: 420 }}>
        <ThoughtLine active={active} label={label} duration={active ? undefined : 4.1}>
          {steps ? <AgentTrace steps={STEPS} /> : undefined}
        </ThoughtLine>
      </div>
    ),
    code: ({ active, label, steps }) => {
      const open = `<ThoughtLine${active ? " active" : ""} label="${label}"${active ? "" : " duration={4.1}"}`
      if (!steps) return `${open} />`
      return `const steps: AgentTraceStep[] = [
  { id: "schema", title: "Read the orders schema", status: "done", duration: 0.4 },
  { id: "query", title: "orders_by_city, last 14 days", status: "done", duration: 1.8 },
  { id: "chart", title: "Chart revenue by city", status: "done", duration: 0.6 },
]

${open}>
  <AgentTrace steps={steps} />
</ThoughtLine>`
    },
    accessibility: [
      "With steps it is a disclosure button with aria-expanded and aria-controls; without, plain text.",
      "The current label is mirrored into a polite status, so progress is spoken once per change, not per clock tick.",
      "The breathing glyph stops under reduced motion; the clock keeps counting because it carries information.",
    ],
  }),

  defineDemo({
    id: "agent-trace",
    name: "Agent Trace",
    category: "Assistant",
    description: "Each tool call an agent made, on a rail.",
    exports: ["AgentTrace"],
    controls: {
      running: { type: "boolean", default: true, label: "Last step running" },
      failed: { type: "boolean", default: false, label: "A step failed" },
    },
    render: ({ running, failed }) => (
      <div style={{ ...stack, width: 420 }}>
        <AgentTrace
          aria-label="Steps"
          steps={[
            STEPS[0] as AgentTraceStep,
            { ...(STEPS[1] as AgentTraceStep), status: failed ? "failed" : "done" },
            {
              ...(STEPS[2] as AgentTraceStep),
              status: running ? "running" : "done",
              duration: running ? undefined : 0.6,
            },
          ]}
        />
      </div>
    ),
    code: ({ running, failed }) => `<AgentTrace
  aria-label="Steps"
  steps={[
    { id: "schema", title: "Read the orders schema", status: "done", duration: 0.4, icon: <Search /> },
    {
      id: "query",
      title: "orders_by_city, last 14 days",
      status: "${failed ? "failed" : "done"}",
      duration: 1.8,
      icon: <Database />,
      detail: <code>select city, sum(net) from orders group by 1</code>,
    },
    { id: "chart", title: "Chart revenue by city", status: "${running ? "running" : "done"}"${running ? "" : ", duration: 0.6"}, icon: <ChartColumn /> },
  ]}
/>`,
    accessibility: [
      "An ordered list. Each step speaks its status in words, since the icon alone carries it visually, and shape differs per status too.",
      "Steps with detail are buttons with aria-expanded; the detail is hidden, not just transparent, while closed.",
      "The running spinner slows down under reduced motion instead of stopping, so progress still reads.",
    ],
  }),

  defineDemo({
    id: "markdown-text",
    name: "Markdown Text",
    category: "Assistant",
    description: "A small, safe markdown renderer for model output.",
    exports: ["MarkdownText"],
    serverSafe: true,
    controls: {
      source: {
        type: "text",
        default: "Revenue rose **12.4%**, led by *Mumbai*. Run `orders_by_city` again Monday.",
      },
    },
    render: ({ source }) => (
      <div style={{ ...stack, width: 520 }}>
        <MarkdownText>{source}</MarkdownText>
      </div>
    ),
    code: ({ source }) => `<MarkdownText>{${JSON.stringify(source)}}</MarkdownText>`,
    accessibility: [
      "Headings start at h3 by default (headingLevel), so an answer slots under the page's own outline.",
      "Tables get real th scope=col headers; numeric cells align to the end in tabular figures.",
      "Only http, https, mailto, tel and relative links survive; external ones open with rel=noopener noreferrer.",
    ],
  }),

  defineDemo({
    id: "prompt-input",
    name: "Prompt Input",
    category: "Assistant",
    description: "A growing prompt box with send and stop.",
    exports: ["PromptInput"],
    controls: {
      streaming: { type: "boolean", default: false },
      attachments: { type: "boolean", default: false },
      maxRows: { type: "number", min: 2, max: 12, default: 8 },
    },
    render: ({ streaming, attachments, maxRows }) => (
      <div style={{ ...stack, width: 520 }}>
        <PromptInput
          streaming={streaming}
          maxRows={maxRows}
          placeholder="Ask about revenue or orders"
          toolbar={<IconButton size="sm" label="Attach a file" icon={<Paperclip />} />}
          attachments={attachments ? <Chip /> : undefined}
        />
      </div>
    ),
    code: ({ streaming, attachments, maxRows }) => `<PromptInput
  placeholder="Ask about revenue or orders"${streaming ? "\n  streaming" : ""}${maxRows === 8 ? "" : `\n  maxRows={${maxRows}}`}
  toolbar={<IconButton size="sm" label="Attach a file" icon={<Paperclip />} />}${
    attachments
      ? `\n  attachments={<Badge variant="outline">orders-october.csv</Badge>}`
      : ""
  }
  onSubmit={(text) => console.log(text)}
  onStop={() => {}}
/>`,
    accessibility: [
      "The textarea is named by label (default Message). Enter while an IME is composing picks the candidate and never sends.",
      "Send is a submit button named Send, disabled for blank drafts; while streaming it becomes Stop, a plain button.",
      "A character count appears near maxLength and is announced politely.",
    ],
  }),

  defineDemo({
    id: "session-list",
    name: "Session List",
    category: "Assistant",
    description: "Past conversations grouped by date.",
    exports: ["SessionList"],
    controls: {
      actions: { type: "boolean", default: true, label: "Rename and delete" },
    },
    render: ({ actions }) => <SessionListDemo actions={actions} />,
    code: ({ actions }) => `const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600000)

function Example() {
  const [sessions, setSessions] = useState([
    { id: "1", title: "Revenue by city", updatedAt: hoursAgo(0.5), meta: "Overview" },
    { id: "2", title: "Why did Pune dip?", updatedAt: hoursAgo(2), meta: "Sales" },
    { id: "3", title: "Refunds by reason", updatedAt: hoursAgo(26), meta: "Returns" },
  ])
  const [active, setActive] = useState<string | null>("2")
  return (
    <SessionList
      sessions={sessions}
      activeId={active}
      onSelect={setActive}
      onNew={() => setActive(null)}${
        actions
          ? `
      actions={(session) => (
        <IconButton
          size="sm"
          label={\`Delete \${session.title}\`}
          icon={<Trash2 />}
          onClick={() => setSessions((all) => all.filter((item) => item.id !== session.id))}
        />
      )}`
          : ""
      }
    />
  )
}

<Example />`,
    accessibility: [
      "A navigation landmark named Chats. Each day is a group labelled by its heading.",
      "The open chat carries aria-current and a bar marker as well as a tint.",
      "Up and Down move between chats; Tab reaches each row's actions, which appear on focus as well as hover.",
    ],
  }),

  defineDemo({
    id: "suggestion-chips",
    name: "Suggestion Chips",
    category: "Assistant",
    description: "Starter questions as pills or cards.",
    exports: ["SuggestionChips"],
    serverSafe: true,
    controls: {
      layout: { type: "select", options: ["wrap", "grid", "list"], default: "wrap" },
      title: { type: "text", default: "Follow up" },
    },
    render: ({ layout, title }) => (
      <div style={{ ...stack, width: 520 }}>
        <SuggestionChips layout={layout} title={title || undefined} suggestions={STARTERS} />
      </div>
    ),
    code: ({ layout, title }) =>
      jsx(
        "SuggestionChips",
        { layout, title: title || undefined, suggestions: STARTERS, onSelect: raw("(text) => console.log(text)") },
        undefined,
        { layout: "wrap" },
      ),
    accessibility: [
      "A group named by its title, holding a list of plain buttons, so each is reached with Tab and spoken with its full question.",
    ],
  }),

  defineDemo({
    id: "theme-card",
    name: "Theme Card",
    category: "Forms",
    description: "A theme choice as a radio tile.",
    exports: ["ThemeCard"],
    serverSafe: true,
    render: () => (
      <div
        role="radiogroup"
        aria-label="Theme"
        style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(3, minmax(0, 1fr))", width: 480, maxWidth: "100%" }}
      >
        <ThemeCard name="theme" value="daylight" theme="light" label="Daylight" defaultChecked />
        <ThemeCard name="theme" value="graphite" theme="dark" label="Graphite" />
        <ThemeCard name="theme" value="lagoon" theme="dark" label="Lagoon" accent="oklch(0.7 0.11 200)" />
      </div>
    ),
    code: () => `<div role="radiogroup" aria-label="Theme" style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(3, 1fr)" }}>
  <ThemeCard name="theme" value="daylight" theme="light" label="Daylight" defaultChecked />
  <ThemeCard name="theme" value="graphite" theme="dark" label="Graphite" />
  <ThemeCard name="theme" value="lagoon" theme="dark" label="Lagoon" accent="oklch(0.7 0.11 200)" />
</div>`,
    accessibility: [
      "A native radio named by its label; arrow keys move the selection within the group and the value submits with a form.",
      "The miniature is aria-hidden, and the selected tile lifts onto sage with a check badge, so the choice never rests on colour alone.",
    ],
  }),

  defineDemo({
    id: "accent-picker",
    name: "Accent Picker",
    category: "Forms",
    description: "Accent swatches as a radio group.",
    exports: ["AccentPicker"],
    controls: {
      allowCustom: { type: "boolean", default: true, label: "Custom color" },
      size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
    },
    render: ({ allowCustom, size }) => (
      <AccentPicker options={ACCENTS} defaultValue="ink" allowCustom={allowCustom} size={size} />
    ),
    code: ({ allowCustom, size }) => `const accents = [
${ACCENTS.map((accent) => `  { value: "${accent.value}", label: "${accent.label}", color: "${accent.color}" },`).join("\n")}
]

${jsx("AccentPicker", { options: raw("accents"), defaultValue: "ink", allowCustom, size }, undefined, {
  allowCustom: false,
  size: "md",
})}`,
    accessibility: [
      "A radiogroup named Accent color; every swatch has a spoken label, so color is never the only name.",
      "Arrow keys move between swatches. The custom swatch is a native color input with its own label.",
    ],
  }),

  defineDemo({
    id: "mode-toggle",
    name: "Mode Toggle",
    category: "Forms",
    description: "Light, dark or system.",
    exports: ["ModeToggle"],
    controls: {
      variant: { type: "select", options: ["cycle", "segmented"], default: "cycle" },
      showLabels: { type: "boolean", default: true, label: "Labels (segmented)" },
    },
    render: ({ variant, showLabels }) => <ModeToggle variant={variant} showLabels={showLabels} />,
    code: ({ variant, showLabels }) =>
      jsx("ModeToggle", { variant, showLabels, defaultValue: "system" }, undefined, {
        variant: "cycle",
        showLabels: true,
      }),
    accessibility: [
      "Cycle: one button named Color mode plus the current mode; its title says which mode comes next.",
      "Segmented: a native radiogroup, so arrow keys pick the mode.",
      "It only reports the choice; apply it with data-theme on the root element.",
    ],
  }),

  defineDemo({
    id: "font-picker",
    name: "Font Picker",
    category: "Forms",
    description: "Typefaces as a radio list.",
    exports: ["FontPicker"],
    render: () => (
      <div style={{ ...stack, width: 360 }}>
        <FontPicker options={FONTS} defaultValue="bricolage" />
      </div>
    ),
    code: () => `const fonts = [
${FONTS.map((font) => `  { value: "${font.value}", label: "${font.label}", family: ${JSON.stringify(font.family)}, note: "${font.note}" },`).join("\n")}
]

<FontPicker options={fonts} defaultValue="bricolage" />`,
    accessibility: ["A radiogroup named Typeface. Each option is a native radio named by its label and note."],
  }),

  defineDemo({
    id: "option-tile",
    name: "Option Tile",
    category: "Forms",
    description: "A radio drawn as a tile with a preview.",
    exports: ["OptionTile"],
    serverSafe: true,
    controls: {
      layout: { type: "select", options: ["stack", "row"], default: "stack" },
    },
    render: ({ layout }) => (
      <div
        role="radiogroup"
        aria-label="Density"
        style={{
          display: "grid",
          gap: 10,
          gridTemplateColumns: layout === "row" ? "1fr" : "repeat(3, minmax(0, 1fr))",
          width: layout === "row" ? 340 : 420,
          maxWidth: "100%",
        }}
      >
        {DENSITY.map((option) => (
          <OptionTile
            key={option.value}
            name="density"
            value={option.value}
            label={option.label}
            layout={layout}
            defaultChecked={option.value === "default"}
            preview={<Rows gap={option.gap} />}
          />
        ))}
      </div>
    ),
    code: ({ layout }) => `const densities = [
  { value: "compact", label: "Compact", gap: 2 },
  { value: "default", label: "Default", gap: 4 },
  { value: "spacious", label: "Spacious", gap: 7 },
]

<div role="radiogroup" aria-label="Density" style={{ display: "grid", gap: 10, gridTemplateColumns: "${layout === "row" ? "1fr" : "repeat(3, 1fr)"}" }}>
  {densities.map((option) => (
    <OptionTile
      key={option.value}
      name="density"
      value={option.value}
      label={option.label}${layout === "row" ? `\n      layout="row"` : ""}
      defaultChecked={option.value === "default"}
      preview={
        <span style={{ display: "grid", gap: option.gap, width: 44 }}>
          <Skeleton height={4} />
          <Skeleton height={4} />
          <Skeleton height={4} />
        </span>
      }
    />
  ))}
</div>`,
    accessibility: [
      "A real input type=radio covering the tile: click, Space and arrow keys work natively and the value submits with a form.",
      "The preview is aria-hidden; the selected tile lifts onto sage with a check badge, so the choice never rests on colour alone.",
    ],
  }),

  defineDemo({
    id: "appearance-preview",
    name: "Appearance Preview",
    category: "Forms",
    description: "A miniature app drawn in the theme tokens.",
    exports: ["AppearancePreview"],
    serverSafe: true,
    controls: {
      theme: { type: "select", options: ["light", "dark"], default: "dark" },
      accent: { type: "color", default: "#2f9e8f" },
      radius: { type: "number", min: 0, max: 20, default: 10 },
      railEnd: { type: "boolean", default: false, label: "Rail on the end" },
    },
    render: ({ theme, accent, radius, railEnd }) => (
      <AppearancePreview
        theme={theme}
        accent={accent}
        radius={radius}
        railEnd={railEnd}
        label={`Preview of the ${theme} theme`}
        style={{ width: 480, maxWidth: "100%", height: 240 }}
      />
    ),
    code: ({ theme, accent, radius, railEnd }) =>
      jsx(
        "AppearancePreview",
        { theme, accent, radius, railEnd, style: raw("{ width: 480, height: 240 }") },
        undefined,
        { radius: 10, railEnd: false },
      ),
    accessibility: [
      "Decorative and aria-hidden by default. Pass label to expose it as a named image.",
      "The theme is scoped with data-theme and data-kg-scope, so the derived accent shades follow the override.",
    ],
  }),

  defineDemo({
    id: "grainient",
    name: "Grainient",
    category: "Backgrounds",
    description: "A drifting, grainy colour field.",
    exports: ["Grainient"],
    serverSafe: true,
    layout: "fill",
    height: 400,
    controls: {
      speed: { type: "number", min: 0.2, max: 4, step: 0.1, default: 1 },
      blur: { type: "number", min: 0, max: 120, step: 4, default: 56 },
      grain: { type: "number", min: 0, max: 0.6, step: 0.02, default: 0.22 },
      animated: { type: "boolean", default: true },
    },
    render: ({ speed, blur, grain, animated }) => (
      <Grainient
        speed={speed}
        blur={blur}
        grain={grain}
        animated={animated}
        style={{ minHeight: 400, display: "grid", placeItems: "center" }}
      >
        <h2 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.04em" }}>
          The week in numbers
        </h2>
      </Grainient>
    ),
    code: ({ speed, blur, grain, animated }) =>
      jsx(
        "Grainient",
        { speed, blur, grain, animated, style: raw(`{ minHeight: 320, display: "grid", placeItems: "center" }`) },
        "<h2>The week in numbers</h2>",
        { speed: 1, blur: 56, grain: 0.22, animated: true },
      ),
    accessibility: [
      "Purely decorative: the effect layer is aria-hidden and pointer-events: none.",
      "The drift stops entirely under reduced motion; the resting composition is the static frame.",
      "Only transform animates, so the compositor does the work and the page never repaints.",
    ],
  }),

  defineDemo({
    id: "pointer-light",
    name: "Pointer Light",
    category: "Backgrounds",
    description: "A light that follows the cursor over any surface.",
    exports: ["PointerLight"],
    controls: {
      blend: {
        type: "select",
        options: ["normal", "soft-light", "overlay", "screen", "plus-lighter"],
        default: "normal",
      },
      size: { type: "number", min: 120, max: 600, step: 20, default: 280 },
    },
    render: ({ blend, size }) => <PointerLightDemo blend={blend} size={size} />,
    code: ({ blend, size }) =>
      jsx(
        "PointerLight",
        {
          blend,
          size,
          style: raw(`{ width: 420, padding: 28, borderRadius: 16, border: "1px solid var(--kg-border)" }`),
        },
        `<p style={{ margin: 0, color: "var(--kg-fg-muted)" }}>Net revenue</p>\n<p style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>₹2.41 Cr</p>`,
        { blend: "normal", size: 280 },
      ),
    accessibility: [
      "Decorative only: a pointer-events: none pseudo-element, never in the accessibility tree.",
      "Pointer tracking writes CSS variables once per frame through a ref, with no React renders.",
    ],
  }),

  defineDemo({
    id: "bento-light",
    name: "Bento Light",
    category: "Backgrounds",
    description: "A bento grid lit by one travelling light.",
    exports: ["BentoLight", "BentoLightCell"],
    controls: {
      radius: { type: "number", min: 120, max: 520, step: 20, default: 260 },
      columns: { type: "number", min: 2, max: 4, default: 3 },
    },
    render: ({ radius, columns }) => (
      <BentoLight radius={radius} columns={columns} style={{ width: 640, maxWidth: "100%" }}>
        {BENTO.map((item) => (
          <BentoLightCell key={item.title} colSpan={item.span}>
            <p style={{ margin: 0, fontSize: 13, color: "var(--kg-fg-muted)" }}>{item.title}</p>
            <p style={{ margin: "6px 0 0", fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em" }}>{item.value}</p>
          </BentoLightCell>
        ))}
      </BentoLight>
    ),
    code: ({ radius, columns }) =>
      jsx(
        "BentoLight",
        { radius, columns },
        `<BentoLightCell colSpan={2}>Revenue ₹2.41 Cr</BentoLightCell>\n<BentoLightCell>Orders 18,204</BentoLightCell>\n<BentoLightCell>Repeat buyers 41%</BentoLightCell>\n<BentoLightCell colSpan={2}>Refund rate 2.7%</BentoLightCell>`,
        { radius: 260, columns: 3 },
      ),
    accessibility: [
      "Decorative light only; cells are ordinary containers for your content.",
      "A cell's edge also lights on :focus-within, so keyboard users see where focus is.",
      "One pointer listener on the grid, one style write per cell per frame, no re-renders.",
    ],
  }),
]
