"use client"

import Image from "next/image"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import toast from "react-hot-toast"

export default function LoginPage() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success("Login successful!")

    if (email === "adminalalay@gmail.com") {

        window.location.href = "/admin"

    } else {

      window.location.href = "/dashboard"

    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-black flex items-center justify-center px-4 py-10">

      {/* Background Glow */}
      <div className="absolute w-[700px] h-[700px] bg-emerald-500/10 blur-3xl rounded-full"></div>

      {/* Brand Header */}
      <div className="absolute top-6 left-6 flex items-center gap-3">

        <Image
          src="/logo.png"
          alt="A&L Alalay"
          width={50}
          height={50}
          className="rounded-full"
        />

        <div>

          <h2 className="text-white font-bold text-xl tracking-wide">
            A&L ALALAY
          </h2>

          <p className="text-emerald-400 text-xs tracking-[0.3em]">
            MICRO LENDING
          </p>

        </div>

      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-[35px] shadow-2xl overflow-hidden">

        {/* Top Section */}
        <div className="px-8 pt-10 pb-6 text-center">

          <Image
            src="/logo.png"
            alt="A&L Alalay Logo"
            width={150}
            height={150}
            className="mx-auto object-contain"
          />

          <h1 className="mt-4 text-4xl font-bold text-slate-800">
            A&L ALALAY
          </h1>

          <p className="mt-2 text-emerald-700 text-sm tracking-[0.2em]">
            MICRO LENDING MANAGEMENT SYSTEM
          </p>

          <div className="w-20 h-1 bg-yellow-500 rounded-full mx-auto mt-5"></div>

          <p className="mt-5 text-gray-500 text-sm">
            Building Dreams. Empowering Futures.
          </p>

        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="px-8 pb-10"
        >

          <div className="space-y-4">

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-5 py-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-5 py-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 py-4 rounded-xl bg-gradient-to-r from-emerald-900 to-emerald-600 text-white font-bold tracking-wider shadow-lg hover:opacity-90 transition"
          >
            {loading ? "SIGNING IN..." : "LOGIN"}
          </button>

          {/* Links */}
          <div className="mt-6 flex flex-col items-center gap-3">

            <a
              href="/register"
              className="text-emerald-700 font-semibold text-sm hover:underline"
            >
              Create Account
            </a>

            <a
              href="/forgot-password"
              className="text-emerald-700 font-semibold text-sm hover:underline"
            >
              Forgot Password?
            </a>

          </div>

          {/* Footer */}
          <div className="mt-8 pt-5 border-t border-gray-200 text-center">

            <p className="text-gray-500 text-sm">
              Secure • Trusted • Dedicated to Your Growth
            </p>

          </div>

        </form>

        {/* Bottom Decoration */}
        <div className="h-14 bg-gradient-to-r from-emerald-700 to-emerald-500 rounded-t-[50%]"></div>

      </div>

      {/* Copyright */}
      <div className="absolute bottom-4 text-center text-gray-400 text-xs">

        © {new Date().getFullYear()} A&L Alalay Micro Lending. All rights reserved.

      </div>

    </div>
  )
}