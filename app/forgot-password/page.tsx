"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import toast from "react-hot-toast"

export default function ForgotPasswordPage() {

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email)

    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Password reset email sent!")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-900 to-black px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        <h1 className="text-3xl font-bold text-center text-emerald-800 mb-6">
          Reset Password
        </h1>

        <form onSubmit={handleReset} className="space-y-5">

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </button>

        </form>

      </div>

    </div>
  )
}