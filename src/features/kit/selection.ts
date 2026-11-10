import { useSyncExternalStore } from "react"

const KEY = "kg-kit"
const listeners = new Set<() => void>()

const read = (): string[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]")
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : []
  } catch {
    return []
  }
}

let ids = read()

const write = (next: string[]) => {
  ids = [...new Set(next)]
  try {
    localStorage.setItem(KEY, JSON.stringify(ids))
  } catch {}
  for (const listener of listeners) listener()
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const NONE: string[] = []

// The server render (and hydration) sees an empty kit; the stored one arrives right after.
export const useKit = () => useSyncExternalStore(subscribe, () => ids, () => NONE)

export const kit = {
  has: (id: string) => ids.includes(id),
  toggle: (id: string) =>
    write(ids.includes(id) ? ids.filter((other) => other !== id) : [...ids, id]),
  set: write,
  clear: () => write([]),
}

export const kitLink = (list: readonly string[]) =>
  `${typeof window === "undefined" ? "" : window.location.origin}/kit?c=${list.join(",")}`
