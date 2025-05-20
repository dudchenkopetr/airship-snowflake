import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import { ToastProvider } from "@/hooks/use-toast"
import { ToastContainer } from "@/components/toast-container"
import { SkipToContent } from "@/components/skip-to-content"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Airship Snowflake Integration",
  description: "Manage your Snowflake connections and tables for Airship",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <SkipToContent />
          <Header />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  )
}
