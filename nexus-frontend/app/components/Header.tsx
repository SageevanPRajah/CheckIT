"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, House, FileText, BookOpen } from "lucide-react"
import { clearTokens } from "@/lib/api"

export default function Header() {
  const router = useRouter()

  const handleLogout = () => {
    clearTokens()
    router.push("/login")
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-1xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* logo + nav (left) */}
        <div className="flex items-center gap-8">
          <Image
            src="/images/logo.png"
            alt="RoboticGen Logo"
            width={150}
            height={40}
          />

<nav className="flex ml-20 items-center gap-10 text-gray-600 whitespace-nowrap">
  <Link
    href="/feed"
    className="flex items-center gap-2 hover:text-gray-900"
  >
    <House size={18} />
    <span>Home</span>
  </Link>

  <Link
    href="/posts"
    className="flex items-center gap-2 hover:text-gray-900"
  >
    <FileText size={18} />
    <span>My&nbsp;Profile</span>
  </Link>

  <Link
    href="/process"
    className="flex items-center gap-2 hover:text-gray-900"
  >
    <BookOpen size={18} />
    <span>My&nbsp;Learnings</span>
  </Link>

  <Link
    href="/courses"
    className="flex items-center gap-2 hover:text-gray-900"
  >
    <BookOpen size={18} />
    <span>My&nbsp;Subscribe</span>
  </Link>
</nav>
        </div>

        {/* logout (right) */}
        <button
          onClick={handleLogout}
          className="flex items-center ml-150 gap-1 text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-100 transition"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  )
}
