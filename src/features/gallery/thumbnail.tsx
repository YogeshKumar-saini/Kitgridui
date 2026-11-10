import {
  Component,
  type ErrorInfo,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { type Demo, defaultValues } from "@/features/demos/registry"

/* One pair of observers serves every tile. A tile mounts its live preview when it comes within
   `NEAR` of the viewport and unmounts once it drifts past `FAR`, so a long gallery only ever
   runs the handful of demos around the reader. The gap between the two is hysteresis: a tile
   on the boundary doesn't thrash. */

const NEAR = "480px 0px"
const FAR = "1800px 0px"

type Listener = (visible: boolean) => void
const nearListeners = new WeakMap<Element, Listener>()
const farListeners = new WeakMap<Element, Listener>()
let near: IntersectionObserver | undefined
let far: IntersectionObserver | undefined

const observers = () => {
  near ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) nearListeners.get(entry.target)?.(true)
    },
    { rootMargin: NEAR },
  )
  far ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (!entry.isIntersecting) farListeners.get(entry.target)?.(false)
    },
    { rootMargin: FAR },
  )
  return { near, far }
}

/* Mounting a dozen live demos in one frame janks the scroll, so mounts are metered out a couple
   per frame, nearest first by DOM order. */
const queue: (() => void)[] = []
let scheduled = false
const flush = () => {
  scheduled = false
  for (let i = 0; i < 2 && queue.length > 0; i++) queue.shift()?.()
  if (queue.length > 0) schedule()
}
const schedule = () => {
  if (scheduled) return
  scheduled = true
  requestAnimationFrame(flush)
}
const enqueue = (task: () => void) => {
  queue.push(task)
  schedule()
  return () => {
    const index = queue.indexOf(task)
    if (index !== -1) queue.splice(index, 1)
  }
}

export const useLazyMount = (ref: RefObject<HTMLElement | null>) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const { near: nearObserver, far: farObserver } = observers()
    let cancel: (() => void) | undefined
    nearListeners.set(node, () => {
      cancel?.()
      cancel = enqueue(() => setMounted(true))
    })
    farListeners.set(node, () => {
      cancel?.()
      setMounted(false)
    })
    nearObserver.observe(node)
    farObserver.observe(node)
    return () => {
      cancel?.()
      nearObserver.unobserve(node)
      farObserver.unobserve(node)
      nearListeners.delete(node)
      farListeners.delete(node)
    }
  }, [ref])
  return mounted
}

/* Scale-to-fit: the demo renders at a desktop-ish `base` width and is scaled down to the tile,
   so it looks like the real thing in miniature instead of a cramped reflow. */
let resizer: ResizeObserver | undefined
const resizeListeners = new WeakMap<Element, (width: number, height: number) => void>()

const useScaleToFit = (
  viewport: RefObject<HTMLElement | null>,
  canvas: RefObject<HTMLElement | null>,
  base: number,
) => {
  useEffect(() => {
    const node = viewport.current
    const inner = canvas.current
    if (!node || !inner) return
    resizer ??= new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        resizeListeners.get(entry.target)?.(width, height)
      }
    })
    resizeListeners.set(node, (width, height) => {
      const scale = Math.min(1, width / base)
      inner.style.width = `${width / scale}px`
      inner.style.height = `${height / scale}px`
      inner.style.transform = `scale(${scale})`
    })
    resizer.observe(node)
    return () => {
      resizer?.unobserve(node)
      resizeListeners.delete(node)
    }
  }, [viewport, canvas, base])
}

/** A broken demo (say, mid-edit) shows a quiet placeholder instead of taking the grid down. */
class ThumbBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("Gallery preview failed to render", error, info.componentStack)
  }
  override render() {
    return this.state.failed ? (
      <span className="font-mono text-kg-xs text-kg-fg">Preview unavailable</span>
    ) : (
      this.props.children
    )
  }
}

const ThumbContent = ({ demo }: { demo: Demo }) => {
  const values = useMemo(() => defaultValues(demo), [demo])
  return <>{demo.thumbnail ? demo.thumbnail() : demo.render(values as never)}</>
}

export const LiveThumb = ({
  demo,
  base,
  className = "",
}: {
  demo: Demo
  base: number
  className?: string
}) => {
  const viewport = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const mounted = useLazyMount(viewport)
  useScaleToFit(viewport, canvas, base)

  return (
    <div
      className={`relative min-h-0 overflow-hidden [contain:layout_paint] ${className}`}
      ref={viewport}
      aria-hidden="true"
    >
      <div
        ref={canvas}
        className="pointer-events-none absolute top-0 left-0 grid origin-top-left select-none data-[layout=center]:place-items-center data-[layout=center]:p-8 data-[layout=fill]:*:min-h-0 data-[layout=fill]:*:min-w-0 *:transition-opacity *:duration-300 *:ease-kg-out *:starting:opacity-0 motion-reduce:*:transition-none"
        data-layout={demo.thumbnail ? "center" : (demo.layout ?? "center")}
        data-mounted={mounted || undefined}
        inert
      >
        {mounted && (
          <ThumbBoundary>
            <ThumbContent demo={demo} />
          </ThumbBoundary>
        )}
      </div>
    </div>
  )
}
