"use client"

import { supabase } from "@/lib/supabase"
import toast from "react-hot-toast"

export default function DashboardPage() {

  const handleLogout = async () => {

    await supabase.auth.signOut()

    toast.success("Logged out successfully!")

    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black text-white p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold">
            Borrower Dashboard
          </h1>

          <p className="text-emerald-400 mt-1">
            Welcome to A&L Alalay
          </p>

        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold"
        >
          Logout
        </button>

      </div>

      {/* Loan Overview */}
      <div className="grid gap-5 md:grid-cols-3">

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/10">

          <p className="text-gray-300">
            Loan Status
          </p>

          <h2 className="text-3xl font-bold mt-3">
            No Active Loan
          </h2>

        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/10">

          <p className="text-gray-300">
            Outstanding Balance
          </p>

          <h2 className="text-3xl font-bold mt-3">
            ₱0.00
          </h2>

        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/10">

          <p className="text-gray-300">
            Due Date
          </p>

          <h2 className="text-3xl font-bold mt-3">
            -- / -- / ----
          </h2>

        </div>

      </div>

      {/* Actions */}
      <div className="mt-10 grid gap-5 md:grid-cols-2">

        <button
          className="bg-emerald-700 hover:bg-emerald-800 rounded-3xl p-8 text-left transition-all"
        >

          <h2 className="text-2xl font-bold">
            Apply for Loan
          </h2>

          <p className="mt-2 text-emerald-200">
            Submit a new loan application
          </p>

        </button>

        <button
          className="bg-white/10 hover:bg-white/20 rounded-3xl p-8 text-left transition-all border border-white/10"
        >

          <h2 className="text-2xl font-bold">
            My Profile
          </h2>

          <p className="mt-2 text-gray-300">
            View and update account information
          </p>

        </button>

      </div>

    </div>
  )
}