"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/api"

interface User {
  id: number
  username: string
  phoneNumber?: string
  phone?: string
}

export default function Header() {
  const [me, setMe] = useState<User | null>(null)

  useEffect(() => {
    ;(async () => {
      const current = await getCurrentUser()
      setMe(current)
    })()
  }, [])

  if (!me) return null

  return (
    <header className="relative w-full h-48 mb-8">
      {/* banner background */}
      <Image
        src="/banner2.png"
        alt="Banner"
        fill
        className="object-cover"
        priority
      />

      {/* semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* avatar + username */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-4">
        <div className="h-26 w-26 rounded-full bg-blue-400 flex items-center justify-center text-3xl font-bold text-white">
          {me.username.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-white text-2xl font-semibold">
          {me.username}
        </h1>
      </div>
    </header>
  )
}
