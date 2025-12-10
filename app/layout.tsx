import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SessionProvider } from "@/components/providers/session-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Bridge",
    template: "%s | Bridge",
  },
  description:
    "A comprehensive learner platform connecting students with career opportunities through verified credentials, AI-powered career navigation, and professional networking.",
  keywords: ["education", "career", "skills", "learning", "opportunities", "networking", "credentials", "blockchain"],
  authors: [{ name: "Bridge Team" }],
  creator: "Bridge",
  generator: "TEAS Tech Foundations - Platform for Learning and Career Development",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Bridge",
    title: "Bridge - Connect Your Skills to Opportunities",
    description: "Connect your skills to opportunities with verified credentials and AI-powered career guidance",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bridge - Connect Your Skills to Opportunities",
    description: "Connect your skills to opportunities with verified credentials and AI-powered career guidance",
  },
  icons: {
    icon: [
      { url: "/bridge-logo.png" },
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/bridge-logo.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1f2e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
