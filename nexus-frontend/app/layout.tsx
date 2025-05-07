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
          <aside className="w-64 bg-white border-r">
            <nav className="mt-8 flex flex-col space-y-1">
              <Link
                href="/feed"
                className="flex items-center px-4 py-2 hover:bg-gray-100"
              >
                <House className="mr-3" /> Home
              </Link>
              <Link
                href="/posts"
                className="flex items-center px-4 py-2 hover:bg-gray-100"
              >
                <FileText className="mr-3" /> My Profile
              </Link>
              <Link
                href="/process"
                className="flex items-center px-4 py-2 hover:bg-gray-100"
              >
                <BookOpen className="mr-3" /> My Learnings
              </Link>
              <Link
                href="/courses"
                className="flex items-center px-4 py-2 hover:bg-gray-100"
              >
                <Bookmark className="mr-3" /> My Subscribe
              </Link>
            </nav>
          </aside>

          {/* main content */}
          <main className="flex-1 bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
