const hash = (seed: string | number) => {
  let h = 2166136261
  for (const ch of String(seed)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return h >>> 0
}

const uri = (body: string, w: number, h: number) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"><style>@media (prefers-reduced-motion:reduce){.s{display:none}}</style><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".09"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect width="${w}" height="${h}" fill="#8a93a0" fill-opacity=".16"/>${body}<rect class="s" y="0" width="${w * 0.6}" height="${h}" fill="url(#g)"><animate attributeName="x" from="${-w * 0.6}" to="${w}" dur="1.8s" repeatCount="indefinite"/></rect></svg>`,
  )}`

const block = (x: number, y: number, w: number, h: number, r: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#8a93a0" fill-opacity=".22"/>`

/** A neutral skeleton block in place of a photo: same seed, same shape. */
export const skeleton = (seed: string | number, w = 800, h = 1000) => {
  const n = hash(seed)
  const m = Math.min(w, h)
  const cx = w / 2
  const cy = h * 0.46
  const shapes = [
    `<circle cx="${cx}" cy="${cy}" r="${m * 0.22}" fill="#8a93a0" fill-opacity=".22"/>`,
    block(cx - m * 0.24, cy - m * 0.24, m * 0.48, m * 0.48, m * 0.06),
    block(cx - m * 0.3, cy - m * 0.14, m * 0.6, m * 0.28, m * 0.14),
    `<ellipse cx="${cx}" cy="${cy}" rx="${m * 0.28}" ry="${m * 0.18}" fill="#8a93a0" fill-opacity=".22"/>`,
  ]
  return uri(shapes[n % shapes.length] as string, w, h)
}

/** Frames of a skeleton object turning on a plinth, for ProductSpin demos. */
export const spinFrames = (count = 36, w = 800, h = 800) =>
  Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2
    const width = w * (0.22 + 0.16 * Math.abs(Math.cos(angle)))
    const mark = w / 2 + Math.sin(angle) * width * 0.38
    return uri(
      `<ellipse cx="${w / 2}" cy="${h * 0.74}" rx="${w * 0.3}" ry="${h * 0.05}" fill="#8a93a0" fill-opacity=".22"/>${block(w / 2 - width / 2, h * 0.3, width, h * 0.42, w * 0.04)}<rect x="${mark - w * 0.02}" y="${h * 0.34}" width="${w * 0.04}" height="${h * 0.34}" rx="${w * 0.02}" fill="#8a93a0" fill-opacity=".3"/>`,
      w,
      h,
    )
  })
