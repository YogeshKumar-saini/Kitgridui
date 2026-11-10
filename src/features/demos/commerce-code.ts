/** Prints plain data as a JavaScript literal for code snippets, wrapping past 72 characters. */
export const literal = (value: unknown, depth = 0): string => {
  const pad = "  ".repeat(depth + 1)
  const end = "  ".repeat(depth)
  const wrap = (open: string, close: string, items: string[], spaced: boolean) => {
    const flat = spaced ? `${open} ${items.join(", ")} ${close}` : `${open}${items.join(", ")}${close}`
    return flat.length <= 72 && !flat.includes("\n")
      ? flat
      : `${open}\n${items.map((item) => pad + item).join(",\n")},\n${end}${close}`
  }
  if (Array.isArray(value)) return wrap("[", "]", value.map((item) => literal(item, depth + 1)), false)
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value)
      .filter(([, entry]) => entry !== undefined)
      .map(
        ([key, entry]) =>
          `${/^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key)}: ${literal(entry, depth + 1)}`,
      )
    return entries.length ? wrap("{", "}", entries, true) : "{}"
  }
  return JSON.stringify(value)
}

/** `const name = <literal>` for the top of a snippet. */
export const declare = (name: string, value: unknown) => `const ${name} = ${literal(value)}`

/** Indents every line after the first, for JSX nested inside a snippet. */
export const indent = (code: string, spaces: number) =>
  code
    .split("\n")
    .map((line, index) => (index === 0 ? line : " ".repeat(spaces) + line))
    .join("\n")
