"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import toast from "react-hot-toast"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()

  setLoading(true)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  console.log("LOGIN DATA:", data)
  console.log("LOGIN ERROR:", error)

  if (error) {
    toast.error(error.message)
    setLoading(false)
    return
  }

  toast.success("Login successful! Welcome to A&L Alalay.")

  window.location.href = "/dashboard"
 
  setLoading(false)
}

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-black flex items-center justify-center px-4">

      {/* Background Glow */}
      <div className="absolute w-[700px] h-[700px] bg-emerald-500/10 blur-3xl rounded-full"></div>

      {/* Top Brand */}
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
      <div className="relative z-10 w-full max-w-md rounded-[35px] bg-white shadow-2xl overflow-hidden">

        {/* Top Section */}
        <div className="px-10 pt-10 pb-6 text-center">

          <div className="flex justify-center mb-4">
            <Image
            src="/logo.png"
            alt="A&L Alalay Logo"
            width={180}
            height={180}
            className="mx-auto object-contain"
            />
          </div>

          <h1 className="text-5xl font-serif text-slate-800 font-bold">
            A&L ALALAY
          </h1>

          <p className="mt-2 text-emerald-600 tracking-[0.25em] text-sm font-medium">
            MICRO LENDING MANAGEMENT SYSTEM
          </p>

          <div className="w-20 h-1 bg-yellow-500 mx-auto rounded-full mt-5"></div>

          <p className="mt-6 text-gray-500">
            Building Dreams. Empowering Futures.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="px-10 pb-10 space-y-5"
        >

          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-5 py-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
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
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-900 to-emerald-600 text-white font-bold tracking-wider hover:scale-[1.02] transition-all shadow-lg"
          >
            {loading ? "SIGNING IN..." : "LOGIN"}
          </button>
          
           <div className="flex flex-col items-center gap-2 mt-4 text-sm">

           <a
           href="/register"
          className="text-emerald-700 hover:underline"
          >
         Create Account
          </a>

         <a
         href="/forgot-password"
         className="text-emerald-700 hover:underline"
          >
            Forgot Password?
         </a>

        </div>

          {/* Security Footer */}
          <div className="pt-6 text-center border-t border-gray-200">

            <p className="text-gray-500 text-sm">
              Secure • Trusted • Dedicated to Your Growth
            </p>

          </div>

        </form>

        {/* Bottom Wave */}
        <div className="h-16 bg-gradient-to-r from-emerald-700 to-emerald-500 rounded-t-[50%]"></div>

      </div>

      {/* Footer */}
      <div className="absolute bottom-5 text-gray-400 text-sm text-center">
        © {new Date().getFullYear()} A&L Alalay Micro Lending. All rights reserved.
      </div>

    </div>
  )
}