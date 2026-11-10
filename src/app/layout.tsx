import type { Metadata, Viewport } from "next"
import { type ReactNode, Suspense } from "react"
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google"
import "@/styles/site.css"
import { AppShell } from "@/components/app-shell"

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" })
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })

export const metadata: Metadata = {
  title: { default: "kitgrid playground", template: "%s · kitgrid" },
  description:
    "kitgrid playground: accessible React components, motion with weight and a full commerce kit, all live.",
  icons: { icon: "/favicon.svg" },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#dfe9e6" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1c18" },
  ],
}

// Theme precedence: ?theme= (in the URL or the hash) > saved choice > OS preference.
const themeScript = `try {
  const fromUrl = (search) => new URLSearchParams(search).get("theme")
  const forced = fromUrl(location.search) || fromUrl(location.hash.split("?")[1] || "")
  const theme = forced === "dark" || forced === "light" ? forced : localStorage.getItem("kg-playground-theme")
  if (theme) document.documentElement.dataset.theme = theme
  else if (matchMedia("(prefers-color-scheme: dark)").matches) document.documentElement.dataset.theme = "dark"
} catch {}`

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${bricolage.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {/* The shell reads the query string, which needs a Suspense boundary to prerender. */}
        <Suspense>
          <AppShell>{children}</AppShell>
        </Suspense>
      </body>
    </html>
  )
}
