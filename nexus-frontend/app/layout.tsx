import './globals.css'
import { Inter } from 'next/font/google'
import React from 'react'

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
        {/* Simple navbar or header could go here */}
        <main className="min-h-screen bg-gray-50 p-4">
        <nav className="mb-4 space-x-4">
        <a href="/feed" className="text-blue-600 hover:underline">Home</a>
        <a href="/posts" className="text-blue-600 hover:underline">My Posts</a>
        <a href="/process" className="text-blue-600 hover:underline">My Learnings</a>
        <a href="/courses" className="text-blue-600 hover:underline">My Subcribe</a>
        </nav>
            {children}
        </main>
        </body>
        </html>
    )
}
