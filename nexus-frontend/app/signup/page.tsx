// nexus-frontend/app/signup/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          phoneNumber,
          role: "INSTRUCTOR", // default, hidden in the form
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Signup failed");
      }

      // on success, redirect to login
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background.png"
          alt="Robotics background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Signup Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/images/logo.png"
            alt="RoboticGen Logo"
            width={200}
            height={50}
            className="mb-2"
          />
          <p className="text-gray-700 text-sm">
            Empowering the Future Leaders of Technology
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-center">{error}</div>}

          <div>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded-md"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="email"
              className="w-full border border-gray-300 p-3 rounded-md"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="password"
              className="w-full border border-gray-300 p-3 rounded-md"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="tel"
              className="w-full border border-gray-300 p-3 rounded-md"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          {/* Hidden role field */}
          <input type="hidden" name="role" value="INSTRUCTOR" />

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-green-400 text-white py-3 rounded-md hover:bg-green-500 transition-colors"
            >
              Sign Up
            </button>
          </div>
          <div className="pt-2">
            <button
              type="button"
              className="w-full bg-white text-gray-700 py-3 rounded-md border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <FaGoogle className="text-lg" />
              Sign up with Google
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-cyan-500 hover:underline">
              Log in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
