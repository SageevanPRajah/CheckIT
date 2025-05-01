"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginRequest, setTokens } from "@/lib/api"
import Image from "next/image"

export default function LoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        try {
            const data = await loginRequest({ username, password })
            // Save tokens in localStorage
            setTokens(data.access_token, data.refresh_token)
            // Navigate to courses
            router.push("/courses")
        } catch (err: any) {
            setError("Invalid username or password")
        }
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image src="/images/background.png" alt="Robotics background" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
                <div className="flex flex-col items-center mb-6">
                    <Image src="/images/logo.png" alt="RoboticGen Logo" width={200} height={50} className="mb-2" />
                    <p className="text-gray-700 text-sm">Empowering the Future Leaders of Technology</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="text-red-500 text-center">{error}</div>}

                    <div>
                        <input
                            type="text"
                            className="w-full border border-gray-300 p-3 rounded-md"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            className="w-full border border-gray-300 p-3 rounded-md"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="text-cyan-500 text-sm hover:underline"
                            onClick={() => alert("Password reset functionality")}
                        >
                            Forgot Password
                        </button>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-green-400 text-white py-3 rounded-md hover:bg-green-500 transition-colors"
                        >
                            Log in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

