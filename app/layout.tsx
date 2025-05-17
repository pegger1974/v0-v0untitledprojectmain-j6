import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"

// Force dynamic rendering
export const dynamic = "force-dynamic"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ScootX - The Ultimate Scooter Marketplace & Social",
  description:
    "Buy, sell, and connect with fellow scooter enthusiasts. Join the fastest growing scooter social and marketplace platform.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <div className="flex flex-col min-h-screen bg-black">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
