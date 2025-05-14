// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import React from 'react'
import Header from '@/app/components/Header'
import Link from 'next/link'
import { House, FileText, BookOpen, Bookmark } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Nexus Frontend',
  description: 'Next.js + TailwindCSS + Spring Boot backend example',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* top header */}
        <Header />

        <div className="flex min-h-[calc(100vh-64px)]">
          {/* sidebar */}
          

          {/* main content */}
          <main className="flex-1 bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
