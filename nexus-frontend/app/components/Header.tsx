"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { authFetch, clearTokens } from "@/lib/api"
import { useEffect, useState } from "react"
import UserProfile from "./user-profile"

export default function Header() {
  const router = useRouter()
  const [username, setUsername] = useState<string>("")

  // fetch current user once
  useEffect(() => {
    authFetch<{ username: string }>("/auth/me", { method: "GET" })
      .then((u) => setUsername(u.username))
      .catch(() => setUsername(""))
  }, [])

  const handleLogout = () => {
    clearTokens()
    router.push("/login")
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="RoboticGen Logo"
            width={150}
            height={40}
          />
        </div>
        <div className="flex items-center gap-4">
          <UserProfile username={username} />
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-100 transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
