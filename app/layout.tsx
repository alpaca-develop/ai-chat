import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Gemini AI チャットボット",
  description: "Google Gemini APIを使用した高度なAIチャットボット。自然な日本語での対話が可能です。",
  keywords: ["AI", "チャットボット", "Gemini", "Google", "対話", "人工知能"],
  authors: [{ name: "AI Bot Team" }],
  creator: "AI Bot Team",
  publisher: "AI Bot Team",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Gemini AI チャットボット",
    description: "Google Gemini APIを使用した高度なAIチャットボット",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "Gemini AI チャットボット",
    description: "Google Gemini APIを使用した高度なAIチャットボット",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}