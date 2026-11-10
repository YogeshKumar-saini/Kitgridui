import {
  ApiKeyField,
  AuditLog,
  type AuditLogGroup,
  BillingUsage,
  Button,
  ChangelogList,
  type ChangelogListEntry,
  CommentThread,
  type CommentThreadComment,
  CopyField,
  DeployStatus,
  type DeployStatusStep,
  DropdownMenuItem,
  DropdownMenuSeparator,
  EnvironmentSwitcher,
  FeatureFlagList,
  type FeatureFlagListFlag,
  GettingStartedCards,
  IncidentTimeline,
  type IncidentTimelineUpdate,
  InboxList,
  type InboxListItem,
  IntegrationCard,
  InviteMembers,
  LiveCursorBadge,
  NotificationCenter,
  type NotificationCenterItem,
  OnboardingChecklist,
  PlanBadge,
  PlanSummary,
  Poll,
  PresenceAvatars,
  type PresenceAvatarsPerson,
  ProductBanner,
  ProjectCard,
  QuotaBar,
  ReactionsBar,
  RoadmapBoard,
  type RoadmapBoardItem,
  SecretInput,
  StatusIndicator,
  TeamSwitcher,
  TrialCountdown,
  UptimeBars,
  type UptimeBarsDay,
  UserMenu,
  WebhookLog,
  type WebhookLogDelivery,
  WorkspaceSwitcher,
} from "kitgrid"
import {
  Check,
  CreditCard,
  Database,
  Eye,
  Gauge,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PartyPopper,
  Plug,
  Rocket,
  Settings,
  ThumbsUp,
  UserPlus,
} from "lucide-react"
import { useState } from "react"
import { defineDemo, jsx } from "./registry"

const people = {
  priya: "Priya Raman",
  mateo: "Mateo Alvarez",
  hana: "Hana Kobayashi",
  arjun: "Arjun Mehta",
  sofia: "Sofia Lindqvist",
}

const notifications: NotificationCenterItem[] = [
  { id: "n1", title: "Priya commented on Q3 revenue", time: "4m", actor: people.priya },
  { id: "n2", title: "Weekly KPIs export is ready", time: "1h", actor: people.arjun },
  { id: "n3", title: "Mateo shared Churn model", time: "2d", actor: people.mateo, read: true },
]

const inbox: InboxListItem[] = [
  { id: "i1", from: people.priya, subject: "Region split looks off", preview: "West is double counted", time: "9:41", unread: true },
  { id: "i2", from: people.mateo, subject: "Churn model is ready", preview: "Accuracy 0.91 on holdout", time: "Tue" },
  { id: "i3", from: people.hana, subject: "Access request", preview: "Finance workspace", time: "Mon", unread: true },
]

const workspaces = [
  { id: "nw", name: "Northwind", meta: "Pro, 12 members" },
  { id: "lm", name: "Lumen Labs", meta: "Team, 31 members" },
  { id: "ot", name: "Otter Retail", meta: "Free" },
]

const teams = [
  { id: "an", name: "Analytics", key: "AN" },
  { id: "gr", name: "Growth", key: "GR" },
  { id: "fi", name: "Finance", key: "FI" },
]

const days = (count: number): UptimeBarsDay[] =>
  Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(2026, 9, 24) - (count - 1 - index) * 86_400_000)
    const iso = date.toISOString().slice(0, 10)
    if (index === count - 12) return { date: iso, status: "down", uptime: 97.9, note: "Query outage, 30 min" }
    if (index === count - 4) return { date: iso, status: "degraded", uptime: 99.6, note: "Slow dashboards" }
    return { date: iso, status: "up", uptime: 100 }
  })

const incident: IncidentTimelineUpdate[] = [
  { id: "u3", stage: "resolved", time: "15:10 UTC", message: "Query latency is back to normal." },
  { id: "u2", stage: "monitoring", time: "14:52 UTC", message: "A fix is live." },
  { id: "u1", stage: "investigating", time: "14:32 UTC", message: "Dashboards are loading slowly." },
]

const steps: DeployStatusStep[] = [
  { id: "install", label: "Install", state: "done", duration: "18s" },
  { id: "build", label: "Build", state: "done", duration: "1m 04s" },
  { id: "test", label: "Test", state: "running", duration: "22s" },
  { id: "deploy", label: "Deploy", state: "queued" },
]

const flags: FeatureFlagListFlag[] = [
  { id: "f1", name: "New billing page", flagKey: "new-billing", enabled: { dev: true, staging: true, prod: false } },
  { id: "f2", name: "AI summaries", flagKey: "ai-summaries", enabled: { dev: true, staging: true, prod: true }, rollout: 25 },
  { id: "f3", name: "CSV v2 export", flagKey: "csv-v2", enabled: { dev: true, staging: false, prod: false } },
]

const envs = [
  { id: "dev", label: "Dev" },
  { id: "staging", label: "Staging" },
  { id: "prod", label: "Prod" },
]

const deliveries: WebhookLogDelivery[] = [
  { id: "d1", event: "report.exported", status: 200, time: "14:02", duration: "182ms", payload: '{ "id": "rpt_81k2" }', response: "OK" },
  { id: "d2", event: "member.invited", status: 500, time: "13:58", duration: "2.1s", payload: '{ "email": "hana@northwind.io" }', response: "Internal Server Error" },
  { id: "d3", event: "alert.triggered", status: 0, time: "13:40", duration: "10s", response: "Timed out" },
]

const audit: AuditLogGroup[] = [
  {
    id: "today",
    label: "Today",
    entries: [
      { id: "a1", actor: people.priya, action: "invited", target: "hana@northwind.io", time: "14:32", tone: "create" },
      { id: "a2", actor: people.mateo, action: "rotated", target: "Production key", time: "11:05", tone: "security" },
    ],
  },
  {
    id: "yesterday",
    label: "Yesterday",
    entries: [{ id: "a3", actor: people.priya, action: "deleted", target: "Q2 forecast", time: "09:12", tone: "delete" }],
  },
]

const changelog: ChangelogListEntry[] = [
  { id: "c1", date: "Oct 21", version: "v4.2", title: "Scheduled exports", kinds: ["new"], body: "Send any dashboard as CSV on a schedule." },
  { id: "c2", date: "Oct 14", version: "v4.1", title: "Faster filters", kinds: ["improved", "fixed"] },
  { id: "c3", date: "Oct 02", version: "v4.0", title: "Legacy embeds", kinds: ["removed"] },
]

const roadmap: RoadmapBoardItem[] = [
  { id: "r1", title: "Scheduled exports", stage: "now", tag: "Exports", votes: 128 },
  { id: "r2", title: "Slack alerts", stage: "now", votes: 64 },
  { id: "r3", title: "Row-level security", stage: "next", tag: "Access", votes: 92 },
  { id: "r4", title: "Mobile app", stage: "later", votes: 41 },
]

const presence: PresenceAvatarsPerson[] = [
  { id: "p1", name: people.priya },
  { id: "p2", name: people.mateo },
  { id: "p3", name: people.hana, state: "idle" },
  { id: "p4", name: people.arjun, state: "away" },
  { id: "p5", name: people.sofia },
]

const thread: CommentThreadComment[] = [
  {
    id: "t1",
    author: people.priya,
    time: "2h",
    body: "West looks double counted.",
    replies: [{ id: "t2", author: people.mateo, time: "1h", body: "Good catch. Fixed in the model." }],
  },
]

const narrow = { width: "24rem", maxWidth: "100%" }
const wide = { width: "34rem", maxWidth: "100%" }
const top = { alignSelf: "flex-start", marginTop: 32 } as const

const CommentThreadDemo = () => {
  const [comments, setComments] = useState(thread)
  return (
    <CommentThread
      style={wide}
      comments={comments}
      onReply={(parentId, body) =>
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === parentId
              ? { ...comment, replies: [...(comment.replies ?? []), { id: `r${Date.now()}`, author: people.arjun, time: "now", body }] }
              : comment,
          ),
        )
      }
    />
  )
}

const LiveCursorsDemo = () => {
  const [spot, setSpot] = useState({ x: 200, y: 90 })
  return (
    <div
      onPointerMove={(event) => {
        const box = event.currentTarget.getBoundingClientRect()
        setSpot({ x: event.clientX - box.left + 8, y: event.clientY - box.top + 8 })
      }}
      style={{
        position: "relative",
        width: "30rem",
        maxWidth: "100%",
        height: 220,
        borderRadius: "var(--kg-radius-xl)",
        border: "1px solid var(--kg-border)",
        background: "var(--kg-surface-sunken)",
        overflow: "hidden",
      }}
    >
      <LiveCursorBadge name={people.priya} x={48} y={40} />
      <LiveCursorBadge name={people.mateo} status="typing" x={spot.x} y={spot.y} />
    </div>
  )
}

export const demos = [
  defineDemo({
    id: "notification-center",
    name: "Notification Center",
    category: "App Shell",
    description: "A bell with an unread count that opens All and Unread views.",
    exports: ["NotificationCenter"],
    height: 480,
    controls: { empty: { type: "boolean", default: false, label: "All read" } },
    render: ({ empty }) => (
      <div style={top}>
        <NotificationCenter
          notifications={empty ? notifications.map((item) => ({ ...item, read: true })) : notifications}
        />
      </div>
    ),
    code: () => `const notifications = [
  { id: "n1", title: "Priya commented on Q3 revenue", time: "4m", actor: "Priya Raman" },
  { id: "n2", title: "Weekly KPIs export is ready", time: "1h", actor: "Arjun Mehta" },
  { id: "n3", title: "Mateo shared Churn model", time: "2d", actor: "Mateo Alvarez", read: true },
]

<NotificationCenter notifications={notifications} onReadAll={() => {}} />`,
    accessibility: [
      "The trigger is named with the unread count, e.g. \"Notifications, 2 unread\".",
      "Non-modal dialog: Escape closes and returns focus. Tabs switch views; arrows move between items.",
      "Unread items say \"unread\" after the title.",
    ],
  }),
  defineDemo({
    id: "inbox-list",
    name: "Inbox List",
    category: "App Shell",
    description: "A triage list with unread weight and a selected row.",
    exports: ["InboxList"],
    render: () => <InboxList aria-label="Inbox" items={inbox} defaultValue="i2" style={narrow} />,
    code: () => `const threads = [
  { id: "i1", from: "Priya Raman", subject: "Region split looks off", preview: "West is double counted", time: "9:41", unread: true },
  { id: "i2", from: "Mateo Alvarez", subject: "Churn model is ready", preview: "Accuracy 0.91 on holdout", time: "Tue" },
  { id: "i3", from: "Hana Kobayashi", subject: "Access request", preview: "Finance workspace", time: "Mon", unread: true },
]

<InboxList aria-label="Inbox" items={threads} defaultValue="i2" />`,
    accessibility: [
      "Single-select listbox. Up and Down move, Home and End jump, Enter or Space selects.",
      "Unread rows are announced as \"Unread\" before the subject.",
    ],
  }),
  defineDemo({
    id: "user-menu",
    name: "User Menu",
    category: "App Shell",
    description: "Avatar trigger with an account header and menu items.",
    exports: ["UserMenu"],
    height: 400,
    controls: { showName: { type: "boolean", default: false, label: "Show name" } },
    render: ({ showName }) => (
      <div style={top}>
        <UserMenu name={people.priya} email="priya@northwind.io" status="online" showName={showName}>
          <DropdownMenuItem icon={<Settings />}>Settings</DropdownMenuItem>
          <DropdownMenuItem icon={<CreditCard />}>Billing</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem icon={<LogOut />}>Sign out</DropdownMenuItem>
        </UserMenu>
      </div>
    ),
    code: ({ showName }) =>
      jsx(
        "UserMenu",
        { name: people.priya, email: "priya@northwind.io", status: "online", showName },
        `<DropdownMenuItem icon={<Settings />}>Settings</DropdownMenuItem>\n<DropdownMenuItem icon={<CreditCard />}>Billing</DropdownMenuItem>\n<DropdownMenuSeparator />\n<DropdownMenuItem icon={<LogOut />}>Sign out</DropdownMenuItem>`,
      ),
    accessibility: [
      "APG menu button. Enter, Space or Down opens on the first item; Escape closes.",
      "Icon-only trigger is named \"Account menu for <name>\".",
    ],
  }),
  defineDemo({
    id: "workspace-switcher",
    name: "Workspace Switcher",
    category: "App Shell",
    description: "A searchable workspace list with a create row.",
    exports: ["WorkspaceSwitcher"],
    height: 400,
    render: () => (
      <div style={{ ...top, width: "15rem" }}>
        <WorkspaceSwitcher workspaces={workspaces} onCreate={() => {}} />
      </div>
    ),
    code: () => `const workspaces = [
  { id: "nw", name: "Northwind", meta: "Pro, 12 members" },
  { id: "lm", name: "Lumen Labs", meta: "Team, 31 members" },
  { id: "ot", name: "Otter Retail", meta: "Free" },
]

<WorkspaceSwitcher workspaces={workspaces} defaultValue="nw" onCreate={() => {}} />`,
    accessibility: [
      "The search field is an ARIA combobox: Up and Down move through matches, Enter switches.",
      "The trigger is named with the current workspace.",
    ],
  }),
  defineDemo({
    id: "team-switcher",
    name: "Team Switcher",
    category: "App Shell",
    description: "A menu of teams as radio items.",
    exports: ["TeamSwitcher"],
    height: 340,
    controls: { compact: { type: "boolean", default: false, label: "Compact" } },
    render: ({ compact }) => (
      <div style={top}>
        <TeamSwitcher teams={teams} compact={compact} onCreate={() => {}} />
      </div>
    ),
    code: ({ compact }) =>
      `const teams = [
  { id: "an", name: "Analytics", key: "AN" },
  { id: "gr", name: "Growth", key: "GR" },
  { id: "fi", name: "Finance", key: "FI" },
]

<TeamSwitcher teams={teams}${compact ? " compact" : ""} onCreate={() => {}} />`,
    accessibility: [
      "Menu button with a labelled radio group; the active team is aria-checked.",
      "Compact mode names the trigger \"Teams: <name>\".",
    ],
  }),
  defineDemo({
    id: "environment-switcher",
    name: "Environment Switcher",
    category: "App Shell",
    description: "Dev, staging and production, with production toned as a warning.",
    exports: ["EnvironmentSwitcher"],
    controls: { size: { type: "select", options: ["sm", "md"], default: "md" } },
    render: ({ size }) => <EnvironmentSwitcher aria-label="Environment" size={size} />,
    code: ({ size }) => jsx("EnvironmentSwitcher", { "aria-label": "Environment", size }, undefined, { size: "md" }),
    accessibility: ["Radio group with one tab stop. Arrow keys move and select."],
  }),
  defineDemo({
    id: "invite-members",
    name: "Invite Members",
    category: "Dashboard",
    description: "Email chips, a role and a send button.",
    exports: ["InviteMembers"],
    height: 300,
    render: () => <InviteMembers style={wide} onInvite={() => new Promise((resolve) => setTimeout(resolve, 600))} />,
    code: () => `<InviteMembers onInvite={(emails, role) => console.log(emails, role)} />`,
    accessibility: [
      "Enter, comma or space turns text into a chip; Backspace on an empty field removes the last one.",
      "Invalid addresses are flagged in words. A live region announces how many invites were sent.",
    ],
  }),
  defineDemo({
    id: "billing-usage",
    name: "Billing Usage",
    category: "Dashboard",
    description: "Metered usage for the period with a ring for days left.",
    exports: ["BillingUsage"],
    serverSafe: true,
    render: () => (
      <BillingUsage
        style={wide}
        period="Oct 1 - Oct 31"
        elapsedDays={24}
        totalDays={31}
        total="$184.20"
        items={[
          { id: "seats", label: "Seats", used: 11, limit: 12 },
          { id: "queries", label: "Queries", used: 41_200, limit: 50_000 },
          { id: "storage", label: "Storage", used: 52, limit: 50, format: (v) => `${v} GB` },
        ]}
      />
    ),
    code: () => `const meters = [
  { id: "seats", label: "Seats", used: 11, limit: 12 },
  { id: "queries", label: "Queries", used: 41200, limit: 50000 },
  { id: "storage", label: "Storage", used: 52, limit: 50, format: (v: number) => \`\${v} GB\` },
]

<BillingUsage
  period="Oct 1 - Oct 31"
  elapsedDays={24}
  totalDays={31}
  total="$184.20"
  items={meters}
/>`,
    accessibility: ["A named region; each item is a meter with value text such as \"41,200 of 50,000\"."],
  }),
  defineDemo({
    id: "quota-bar",
    name: "Quota Bar",
    category: "Dashboard",
    description: "Usage against a limit, amber near it and hatched past it.",
    exports: ["QuotaBar"],
    serverSafe: true,
    controls: {
      used: { type: "number", min: 0, max: 120, default: 72 },
      size: { type: "select", options: ["sm", "md"], default: "md" },
    },
    render: ({ used, size }) => <QuotaBar style={narrow} label="Queries" used={used} limit={100} size={size} />,
    code: ({ used, size }) => jsx("QuotaBar", { label: "Queries", used, limit: 100, size }, undefined, { size: "md" }),
    accessibility: ["role=\"meter\" with aria-valuetext; past the limit it adds \"limit reached\"."],
  }),
  defineDemo({
    id: "trial-countdown",
    name: "Trial Countdown",
    category: "Dashboard",
    description: "Days left on a trial as a draining ring.",
    exports: ["TrialCountdown"],
    serverSafe: true,
    controls: {
      daysLeft: { type: "number", min: 0, max: 14, default: 9 },
      variant: { type: "select", options: ["card", "inline"], default: "card" },
    },
    render: ({ daysLeft, variant }) => (
      <TrialCountdown
        style={{ width: "22rem", maxWidth: "100%" }}
        daysLeft={daysLeft}
        totalDays={14}
        plan="Pro trial"
        variant={variant}
        action={<Button size="sm">Upgrade</Button>}
      />
    ),
    code: ({ daysLeft, variant }) => `<TrialCountdown
  daysLeft={${daysLeft}}
  totalDays={14}
  plan="Pro trial"${variant === "card" ? "" : `
  variant="${variant}"`}
  action={<Button size="sm">Upgrade</Button>}
/>`,
    accessibility: ["The days left are written out; the ring is decorative."],
  }),
  defineDemo({
    id: "plan-badge",
    name: "Plan Badge",
    category: "Dashboard",
    description: "The plan a workspace is on.",
    exports: ["PlanBadge"],
    serverSafe: true,
    controls: { tier: { type: "select", options: ["free", "pro", "team", "enterprise"], default: "pro" } },
    render: ({ tier }) => <PlanBadge tier={tier} />,
    code: ({ tier }) => `<PlanBadge tier="${tier}" />`,
    accessibility: ["Plain text; the tier name is the content."],
  }),
  defineDemo({
    id: "plan-summary",
    name: "Plan Summary",
    category: "Dashboard",
    description: "The current plan on a billing page.",
    exports: ["PlanSummary"],
    serverSafe: true,
    render: () => (
      <PlanSummary
        style={wide}
        title="Current plan"
        tier="team"
        price="$96"
        cadence="per month"
        renewal="Renews Nov 1"
        features={["12 seats", "Unlimited dashboards", "SSO"]}
        actions={<Button size="sm">Change plan</Button>}
      />
    ),
    code: () => `<PlanSummary
  title="Current plan"
  tier="team"
  price="$96"
  cadence="per month"
  renewal="Renews Nov 1"
  features={["12 seats", "Unlimited dashboards", "SSO"]}
  actions={<Button size="sm">Change plan</Button>}
/>`,
    accessibility: ["A region named by its title."],
  }),
  defineDemo({
    id: "api-key-field",
    name: "API Key Field",
    category: "Dashboard",
    description: "A masked key with reveal, copy and a confirmed regenerate.",
    exports: ["ApiKeyField"],
    render: () => (
      <ApiKeyField
        style={wide}
        name="Production"
        meta="Last used 2h ago"
        value="nw_live_4eC39HqLyjWDarjtT1zdp7dc"
        onRegenerate={() => new Promise((resolve) => setTimeout(resolve, 600))}
      />
    ),
    code: () => `<ApiKeyField
  name="Production"
  meta="Last used 2h ago"
  value="nw_live_4eC39HqLyjWDarjtT1zdp7dc"
  onRegenerate={() => {}}
/>`,
    accessibility: [
      "Masked keys read as the prefix, \"hidden, ending in\", then the tail.",
      "Regenerate opens an inline alertdialog with focus on Cancel; Escape cancels and returns focus.",
    ],
  }),
  defineDemo({
    id: "secret-input",
    name: "Secret Input",
    category: "Forms",
    description: "A masked field with reveal and copy.",
    exports: ["SecretInput"],
    controls: { copyable: { type: "boolean", default: true } },
    render: ({ copyable }) => (
      <SecretInput style={narrow} aria-label="Signing secret" defaultValue="whsec_9f1Kq2LmP0aZ" copyable={copyable} />
    ),
    code: ({ copyable }) =>
      jsx("SecretInput", { "aria-label": "Signing secret", defaultValue: "whsec_9f1Kq2LmP0aZ", copyable }),
    accessibility: ["The reveal button is a toggle (aria-pressed). Copy is announced in a live region."],
  }),
  defineDemo({
    id: "copy-field",
    name: "Copy Field",
    category: "Forms",
    description: "A read-only value or command with a copy button.",
    exports: ["CopyField"],
    controls: { variant: { type: "select", options: ["field", "command"], default: "command" } },
    render: ({ variant }) =>
      variant === "command" ? (
        <CopyField style={narrow} variant="command" aria-label="install command" value="npm i @yogeshsaini/kitgrid" />
      ) : (
        <CopyField style={narrow} label="Project ID" value="prj_8f2k1q7Lx" />
      ),
    code: ({ variant }) =>
      variant === "command"
        ? `<CopyField variant="command" aria-label="install command" value="npm i @yogeshsaini/kitgrid" />`
        : `<CopyField label="Project ID" value="prj_8f2k1q7Lx" />`,
    accessibility: ["The copy button is named after the value's label. \"Copied\" is announced."],
  }),
  defineDemo({
    id: "webhook-log",
    name: "Webhook Log",
    category: "Dashboard",
    description: "Deliveries with status codes and disclosable bodies.",
    exports: ["WebhookLog"],
    height: 420,
    render: () => <WebhookLog style={wide} deliveries={deliveries} onRetry={() => {}} />,
    code: () => `const deliveries = [
  { id: "d1", event: "report.exported", status: 200, time: "14:02", duration: "182ms", response: "OK" },
  { id: "d2", event: "member.invited", status: 500, time: "13:58", duration: "2.1s", response: "Internal Server Error" },
  { id: "d3", event: "alert.triggered", status: 0, time: "13:40", duration: "10s", response: "Timed out" },
]

<WebhookLog deliveries={deliveries} onRetry={(id) => console.log(id)} />`,
    accessibility: [
      "Each row is a disclosure button (aria-expanded) that names the result in words.",
      "Retry is offered only for failures.",
    ],
  }),
  defineDemo({
    id: "audit-log",
    name: "Audit Log",
    category: "Dashboard",
    description: "Who did what, grouped by day.",
    exports: ["AuditLog"],
    serverSafe: true,
    render: () => <AuditLog style={wide} groups={audit} />,
    code: () => `const groups: AuditLogGroup[] = [
  {
    id: "today",
    label: "Today",
    entries: [
      { id: "a1", actor: "Priya Raman", action: "invited", target: "hana@northwind.io", time: "14:32", tone: "create" },
      { id: "a2", actor: "Mateo Alvarez", action: "rotated", target: "Production key", time: "11:05", tone: "security" },
    ],
  },
]

<AuditLog groups={groups} />`,
    accessibility: ["Each day is a region named by its heading; entries read as sentences."],
  }),
  defineDemo({
    id: "feature-flag-list",
    name: "Feature Flag List",
    category: "Dashboard",
    description: "Flags with a switch for one environment and tags for all.",
    exports: ["FeatureFlagList"],
    controls: { environment: { type: "select", options: ["dev", "staging", "prod"], default: "prod" } },
    render: ({ environment }) => <FeatureFlagList style={wide} flags={flags} environments={envs} environment={environment} />,
    code: ({ environment }) => `const flags = [
  { id: "f1", name: "New billing page", flagKey: "new-billing", enabled: { dev: true, staging: true, prod: false } },
  { id: "f2", name: "AI summaries", flagKey: "ai-summaries", enabled: { dev: true, staging: true, prod: true }, rollout: 25 },
  { id: "f3", name: "CSV v2 export", flagKey: "csv-v2", enabled: { dev: true, staging: false, prod: false } },
]
const environments = [
  { id: "dev", label: "Dev" },
  { id: "staging", label: "Staging" },
  { id: "prod", label: "Prod" },
]

<FeatureFlagList flags={flags} environments={environments} environment="${environment}" />`,
    accessibility: [
      "Switches are named \"<flag> in <environment>\".",
      "Environment tags say on or off in words.",
    ],
  }),
  defineDemo({
    id: "status-indicator",
    name: "Status Indicator",
    category: "Feedback",
    description: "Service health as a shaped mark plus words.",
    exports: ["StatusIndicator"],
    serverSafe: true,
    controls: {
      status: { type: "select", options: ["operational", "degraded", "partial", "outage", "maintenance"], default: "operational" },
      variant: { type: "select", options: ["dot", "pill"], default: "pill" },
      pulse: { type: "boolean", default: false },
    },
    render: ({ status, variant, pulse }) => <StatusIndicator status={status} variant={variant} pulse={pulse} />,
    code: ({ status, variant, pulse }) => jsx("StatusIndicator", { status, variant, pulse }, undefined, { variant: "dot" }),
    accessibility: ["Each state has its own glyph and label, so colour is never the only signal."],
  }),
  defineDemo({
    id: "uptime-bars",
    name: "Uptime Bars",
    category: "Dashboard",
    description: "Uptime over recent days, one bar per day.",
    exports: ["UptimeBars"],
    controls: { range: { type: "select", options: ["30", "60", "90"], default: "30" } },
    render: ({ range }) => <UptimeBars style={wide} label="Query API" days={days(Number(range))} />,
    code: ({ range }) => `const days: UptimeBarsDay[] = Array.from({ length: ${range} }, (_, index) => ({
  date: new Date(Date.UTC(2026, 9, ${25 - Number(range)} + index)).toISOString().slice(0, 10),
  status: index === ${Number(range) - 12} ? "down" : "up",
  uptime: index === ${Number(range) - 12} ? 97.9 : 100,
}))

<UptimeBars label="Query API" days={days} />`,
    accessibility: [
      "A roving list: Tab lands on today, arrows walk the days, Home and End jump.",
      "Every day carries its date, state and uptime as text.",
    ],
  }),
  defineDemo({
    id: "incident-timeline",
    name: "Incident Timeline",
    category: "Feedback",
    description: "Status updates for one incident, newest first.",
    exports: ["IncidentTimeline"],
    serverSafe: true,
    render: () => <IncidentTimeline style={narrow} aria-label="Slow dashboards" updates={incident} />,
    code: () => `const updates: IncidentTimelineUpdate[] = [
  { id: "u3", stage: "resolved", time: "15:10 UTC", message: "Query latency is back to normal." },
  { id: "u2", stage: "monitoring", time: "14:52 UTC", message: "A fix is live." },
  { id: "u1", stage: "investigating", time: "14:32 UTC", message: "Dashboards are loading slowly." },
]

<IncidentTimeline aria-label="Slow dashboards" updates={updates} />`,
    accessibility: ["An ordered list with <time> elements; stages are written out."],
  }),
  defineDemo({
    id: "deploy-status",
    name: "Deploy Status",
    category: "Dashboard",
    description: "Build steps as a pipeline.",
    exports: ["DeployStatus"],
    serverSafe: true,
    controls: { failed: { type: "boolean", default: false, label: "Fail tests" } },
    render: ({ failed }) => (
      <DeployStatus
        style={{ width: "20rem", maxWidth: "100%" }}
        aria-label="Deployment"
        steps={
          failed
            ? steps.map((step) =>
                step.id === "test" ? { ...step, state: "failed" } : step.id === "deploy" ? { ...step, state: "skipped" } : step,
              )
            : steps
        }
      />
    ),
    code: ({ failed }) => `const steps: DeployStatusStep[] = [
  { id: "install", label: "Install", state: "done", duration: "18s" },
  { id: "build", label: "Build", state: "done", duration: "1m 04s" },
  { id: "test", label: "Test", state: "${failed ? "failed" : "running"}", duration: "22s" },
  { id: "deploy", label: "Deploy", state: "${failed ? "skipped" : "queued"}" },
]

<DeployStatus aria-label="Deployment" steps={steps} />`,
    accessibility: ["The running step has aria-current=\"step\"; each state is written out."],
  }),
  defineDemo({
    id: "onboarding-checklist",
    name: "Onboarding Checklist",
    category: "Dashboard",
    description: "Setup steps with a progress ring.",
    exports: ["OnboardingChecklist"],
    height: 420,
    render: () => (
      <OnboardingChecklist
        style={narrow}
        onDismiss={() => {}}
        steps={[
          { id: "s1", label: "Connect a source", done: true },
          { id: "s2", label: "Build a dashboard", description: "Start from a template.", action: <Button size="sm">Open templates</Button> },
          { id: "s3", label: "Invite your team" },
          { id: "s4", label: "Set an alert" },
        ]}
      />
    ),
    code: () => `const steps = [
  { id: "s1", label: "Connect a source", done: true },
  { id: "s2", label: "Build a dashboard", description: "Start from a template.", action: <Button size="sm">Open templates</Button> },
  { id: "s3", label: "Invite your team" },
  { id: "s4", label: "Set an alert" },
]

<OnboardingChecklist steps={steps} onDismiss={() => {}} />`,
    accessibility: [
      "Progress is a labelled progressbar (\"1 of 4\").",
      "Each step is a disclosure button; done steps say \"done\".",
    ],
  }),
  defineDemo({
    id: "getting-started-cards",
    name: "Getting Started Cards",
    category: "Dashboard",
    description: "Next-step cards for a new workspace.",
    exports: ["GettingStartedCards"],
    serverSafe: true,
    render: () => (
      <GettingStartedCards
        style={{ width: "42rem", maxWidth: "100%" }}
        aria-label="Next steps"
        items={[
          { id: "g1", title: "Connect data", description: "Postgres or CSV.", icon: <Plug />, href: "#connect", done: true },
          { id: "g2", title: "Build a dashboard", description: "Start from a template.", icon: <LayoutDashboard />, href: "#build", meta: "5 min" },
          { id: "g3", title: "Invite your team", description: "Share what you find.", icon: <UserPlus />, href: "#invite", meta: "1 min" },
        ]}
      />
    ),
    code: () => `const items = [
  { id: "g1", title: "Connect data", description: "Postgres or CSV.", icon: <Plug />, href: "#connect", done: true },
  { id: "g2", title: "Build a dashboard", description: "Start from a template.", icon: <LayoutDashboard />, href: "#build", meta: "5 min" },
  { id: "g3", title: "Invite your team", description: "Share what you find.", icon: <UserPlus />, href: "#invite", meta: "1 min" },
]

<GettingStartedCards aria-label="Next steps" items={items} />`,
    accessibility: ["A list of links; done cards say \"Done\"."],
  }),
  defineDemo({
    id: "changelog-list",
    name: "Changelog List",
    category: "Data Display",
    description: "Product updates on a dated rail.",
    exports: ["ChangelogList"],
    serverSafe: true,
    render: () => <ChangelogList style={wide} aria-label="Changelog" entries={changelog} />,
    code: () => `const entries: ChangelogListEntry[] = [
  { id: "c1", date: "Oct 21", version: "v4.2", title: "Scheduled exports", kinds: ["new"], body: "Send any dashboard as CSV on a schedule." },
  { id: "c2", date: "Oct 14", version: "v4.1", title: "Faster filters", kinds: ["improved", "fixed"] },
  { id: "c3", date: "Oct 02", version: "v4.0", title: "Legacy embeds", kinds: ["removed"] },
]

<ChangelogList aria-label="Changelog" entries={entries} />`,
    accessibility: ["Each entry is an article with a heading and a <time> element."],
  }),
  defineDemo({
    id: "roadmap-board",
    name: "Roadmap Board",
    category: "Data Display",
    description: "Now, next and later.",
    exports: ["RoadmapBoard"],
    serverSafe: true,
    render: () => <RoadmapBoard items={roadmap} style={{ width: "44rem", maxWidth: "100%" }} />,
    code: () => `const items: RoadmapBoardItem[] = [
  { id: "r1", title: "Scheduled exports", stage: "now", tag: "Exports", votes: 128 },
  { id: "r2", title: "Slack alerts", stage: "now", votes: 64 },
  { id: "r3", title: "Row-level security", stage: "next", tag: "Access", votes: 92 },
  { id: "r4", title: "Mobile app", stage: "later", votes: 41 },
]

<RoadmapBoard items={items} />`,
    accessibility: [
      "Each column is a region named by its heading.",
      "Stage glyphs differ in shape (full, half, outline); vote counts are written out.",
    ],
  }),
  defineDemo({
    id: "poll",
    name: "Poll",
    category: "Forms",
    description: "Vote, then see the results.",
    exports: ["Poll"],
    controls: { closed: { type: "boolean", default: false } },
    render: ({ closed }) => (
      <Poll
        style={narrow}
        question="How often do you export reports?"
        closed={closed}
        options={[
          { id: "daily", label: "Daily", votes: 18 },
          { id: "weekly", label: "Weekly", votes: 41 },
          { id: "monthly", label: "Monthly", votes: 12 },
        ]}
      />
    ),
    code: ({ closed }) => `const options = [
  { id: "daily", label: "Daily", votes: 18 },
  { id: "weekly", label: "Weekly", votes: 41 },
  { id: "monthly", label: "Monthly", votes: 12 },
]

<Poll question="How often do you export reports?" options={options}${closed ? " closed" : ""} />`,
    accessibility: ["A fieldset of native radios; results announce the total in a live region."],
  }),
  defineDemo({
    id: "comment-thread",
    name: "Comment Thread",
    category: "Data Display",
    description: "Nested replies with inline reply boxes.",
    exports: ["CommentThread"],
    height: 420,
    render: () => <CommentThreadDemo />,
    code: () => `const comments = [
  {
    id: "t1",
    author: "Priya Raman",
    time: "2h",
    body: "West looks double counted.",
    replies: [{ id: "t2", author: "Mateo Alvarez", time: "1h", body: "Good catch. Fixed in the model." }],
  },
]

<CommentThread comments={comments} onReply={(parentId, body) => console.log(parentId, body)} />`,
    accessibility: [
      "Comments are articles named by their author; replies nest in ordered lists.",
      "The reply box takes focus. Cmd or Ctrl+Enter sends, Escape cancels and returns focus.",
    ],
  }),
  defineDemo({
    id: "reactions-bar",
    name: "Reactions Bar",
    category: "Actions",
    description: "Reaction counts as toggles, with a picker.",
    exports: ["ReactionsBar"],
    height: 240,
    render: () => (
      <ReactionsBar
        reactions={[
          { emoji: "+1", icon: <ThumbsUp />, label: "Agree", count: 4, reacted: true },
          { emoji: "tada", icon: <PartyPopper />, label: "Celebrate", count: 2 },
          { emoji: "eyes", icon: <Eye />, label: "Looking", count: 1 },
        ]}
        choices={[
          { emoji: "+1", icon: <ThumbsUp />, label: "Agree" },
          { emoji: "tada", icon: <PartyPopper />, label: "Celebrate" },
          { emoji: "eyes", icon: <Eye />, label: "Looking" },
          { emoji: "ship", icon: <Rocket />, label: "Ship it" },
          { emoji: "done", icon: <Check />, label: "Done" },
        ]}
      />
    ),
    code: () => `const choices = [
  { emoji: "+1", icon: <ThumbsUp />, label: "Agree" },
  { emoji: "tada", icon: <PartyPopper />, label: "Celebrate" },
  { emoji: "eyes", icon: <Eye />, label: "Looking" },
  { emoji: "ship", icon: <Rocket />, label: "Ship it" },
]

<ReactionsBar
  reactions={[
    { emoji: "+1", icon: <ThumbsUp />, label: "Agree", count: 4, reacted: true },
    { emoji: "tada", icon: <PartyPopper />, label: "Celebrate", count: 2 },
  ]}
  choices={choices}
/>`,
    accessibility: ["Each pill is a toggle button named \"<label>, <count>\"."],
  }),
  defineDemo({
    id: "presence-avatars",
    name: "Presence Avatars",
    category: "Data Display",
    description: "Who else is here, with a live mark.",
    exports: ["PresenceAvatars"],
    serverSafe: true,
    controls: {
      max: { type: "number", min: 1, max: 5, default: 4 },
      size: { type: "select", options: ["xs", "sm", "md"], default: "sm" },
    },
    render: ({ max, size }) => <PresenceAvatars people={presence} max={max} size={size} />,
    code: ({ max, size }) => `const people: PresenceAvatarsPerson[] = [
  { id: "p1", name: "Priya Raman" },
  { id: "p2", name: "Mateo Alvarez" },
  { id: "p3", name: "Hana Kobayashi", state: "idle" },
  { id: "p4", name: "Arjun Mehta", state: "away" },
  { id: "p5", name: "Sofia Lindqvist" },
]

<PresenceAvatars people={people}${max === 4 ? "" : ` max={${max}}`}${size === "sm" ? "" : ` size="${size}"`} />`,
    accessibility: ["A group named \"N people here\"; each face carries its name and state as text."],
  }),
  defineDemo({
    id: "live-cursor-badge",
    name: "Live Cursor Badge",
    category: "Data Display",
    description: "A collaborator's pointer with a name flag.",
    exports: ["LiveCursorBadge"],
    serverSafe: true,
    render: () => <LiveCursorsDemo />,
    code: () => `<div style={{ position: "relative", height: 220 }}>
  <LiveCursorBadge name="Priya Raman" x={48} y={40} />
  <LiveCursorBadge name="Mateo Alvarez" status="typing" x={200} y={90} />
</div>`,
    accessibility: ["role=\"img\" named by the person; glides on a spring that snaps under reduced motion."],
  }),
  defineDemo({
    id: "product-banner",
    name: "Product Banner",
    category: "Feedback",
    description: "An inline banner with an action.",
    exports: ["ProductBanner"],
    controls: {
      tone: { type: "select", options: ["accent", "info", "success", "warning", "danger", "neutral"], default: "warning" },
      dismissible: { type: "boolean", default: true },
    },
    render: ({ tone, dismissible }) => (
      <ProductBanner
        key={`${tone}-${dismissible}`}
        style={wide}
        tone={tone}
        icon={<Gauge />}
        title="92% of queries used."
        description="Resets Nov 1."
        dismissible={dismissible}
        action={<Button size="sm" variant="outline">Upgrade</Button>}
      />
    ),
    code: ({ tone, dismissible }) => `<ProductBanner
  tone="${tone}"
  icon={<Gauge />}
  title="92% of queries used."
  description="Resets Nov 1."${dismissible ? "\n  dismissible" : ""}
  action={<Button size="sm" variant="outline">Upgrade</Button>}
/>`,
    accessibility: ["The close button is named \"Dismiss\". Tone is paired with an icon and words."],
  }),
  defineDemo({
    id: "integration-card",
    name: "Integration Card",
    category: "Dashboard",
    description: "Connect or disconnect a service.",
    exports: ["IntegrationCard"],
    controls: { connected: { type: "boolean", default: false, label: "Connected" } },
    render: ({ connected }) => (
      <IntegrationCard
        key={String(connected)}
        style={{ width: "18rem", maxWidth: "100%" }}
        name={connected ? "Snowflake" : "Slack"}
        category={connected ? "Warehouse" : "Alerts"}
        logo={connected ? <Database /> : <MessageSquare />}
        description={connected ? "Sync tables every hour." : "Send alerts to a channel."}
        defaultConnected={connected}
        status={connected ? "Synced 4m ago" : undefined}
        onConnect={() => new Promise((resolve) => setTimeout(resolve, 700))}
      />
    ),
    code: ({ connected }) =>
      connected
        ? `<IntegrationCard
  name="Snowflake"
  category="Warehouse"
  logo={<Database />}
  description="Sync tables every hour."
  status="Synced 4m ago"
  defaultConnected
/>`
        : `<IntegrationCard
  name="Slack"
  category="Alerts"
  logo={<MessageSquare />}
  description="Send alerts to a channel."
  onConnect={() => {}}
/>`,
    accessibility: ["An article named by the service; the button says \"Connect <name>\" or \"Disconnect <name>\"."],
  }),
  defineDemo({
    id: "project-card",
    name: "Project Card",
    category: "Dashboard",
    description: "A project with its last deploy.",
    exports: ["ProjectCard"],
    serverSafe: true,
    controls: { state: { type: "select", options: ["ready", "building", "error", "queued"], default: "ready" } },
    render: ({ state }) => (
      <ProjectCard
        style={{ width: "20rem", maxWidth: "100%" }}
        name="Revenue"
        domain="revenue.northwind.app"
        href="#revenue"
        state={state}
        commit="Add region filter"
        branch="main"
        updated="12m ago"
      />
    ),
    code: ({ state }) => `<ProjectCard
  name="Revenue"
  domain="revenue.northwind.app"
  href="#revenue"
  state="${state}"
  commit="Add region filter"
  branch="main"
  updated="12m ago"
/>`,
    accessibility: ["One link per card (the name) stretched over the card; the deploy state is written out."],
  }),
]
