import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QuizDeGogo - 全生命体の向学のために",
  description: "時間制限付きクイズシステム",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <SessionProvider>
          <nav className="bg-primary text-primary-foreground px-6 py-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold">QuizDeGogo</h1>
              <div className="space-x-4">
                <a href="/quiz" className="hover:underline">クイズ</a>
                <a href="/auth/signin" className="hover:underline">ログイン</a>
              </div>
            </div>
          </nav>
          <main className="min-h-screen bg-background">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}