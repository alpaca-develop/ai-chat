import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from '@/context/AuthContext'
import { MaintenanceMode } from '@/components/MaintenanceMode'

// 環境変数からメンテナンスモード設定を取得
const ENABLE_MAINTENANCE_MODE = process.env.NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE === 'true'
const MAINTENANCE_MESSAGE = process.env.NEXT_PUBLIC_MAINTENANCE_MESSAGE

export const metadata: Metadata = {
  title: "alpa AI",
  description: "高度なAIチャットアプリ。自然な日本語での対話が可能です。",
  keywords: ["AI", "チャット", "alpa", "対話", "人工知能"],
  authors: [{ name: "alpa AI Team" }],
  creator: "alpa AI Team",
  publisher: "alpa AI Team",
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#ffffff',
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "alpa AI",
    description: "高度なAIチャットアプリ",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "alpa AI",
    description: "高度なAIチャットアプリ",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // メンテナンスモードが有効な場合はメンテナンス画面を表示
  if (ENABLE_MAINTENANCE_MODE) {
    return (
      <html lang="ja">
        <body>
          <MaintenanceMode message={MAINTENANCE_MESSAGE} />
        </body>
      </html>
    )
  }

  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}