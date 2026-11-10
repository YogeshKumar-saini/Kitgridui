/** The Paper Layers mark: a white sheet resting on a sage one, both edged in ink. */
export const Logo = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
    <rect
      x="9"
      y="9"
      width="20"
      height="20"
      rx="5"
      fill="var(--kg-paper-sage)"
      stroke="var(--kg-ink)"
      strokeWidth="2.5"
    />
    <rect
      x="3"
      y="3"
      width="20"
      height="20"
      rx="5"
      fill="var(--kg-surface)"
      stroke="var(--kg-ink)"
      strokeWidth="2.5"
    />
  </svg>
)
