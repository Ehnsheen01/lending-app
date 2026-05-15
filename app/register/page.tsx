"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import toast from "react-hot-toast"

export default function RegisterPage() {

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    const user = data.user

    if (user) {

      await supabase.from("borrowers").insert({
        auth_id: user.id,
        full_name: fullName,
        email,
        phone,
        address,
      })

    }

    toast.success("Borrower account created!")

    setLoading(false)

    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-black flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        <h1 className="text-4xl font-bold text-center text-emerald-800">
          Borrower Registration
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Create your borrower account
        </p>

        <form
          onSubmit={handleRegister}
          className="space-y-4"
        >

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4"
          />

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
          >
            {loading ? "CREATING ACCOUNT..." : "REGISTER"}
          </button>

        </form>

      </div>

    </div>
  )
}