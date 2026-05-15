"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import toast from "react-hot-toast"

export default function ApplyLoanPage() {

  const [amount, setAmount] = useState("")
  const [term, setTerm] = useState("")
  const [purpose, setPurpose] = useState("")
  const [loading, setLoading] = useState(false)

  const handleApply = async (e: React.FormEvent) => {

    e.preventDefault()

    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {

      toast.error("Please login first")

      setLoading(false)

      return
    }

    const { error } = await supabase
      .from("loans")
      .insert({

        user_id: user.id,
        amount: Number(amount),
        term_months: Number(term),
        purpose,

      })

    setLoading(false)

    if (error) {

      toast.error(error.message)

      return
    }

    toast.success("Loan application submitted!")

    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        <h1 className="text-4xl font-bold text-center text-emerald-800">
          Apply for Loan
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Submit your loan request
        </p>

        <form
          onSubmit={handleApply}
          className="space-y-4"
        >

          <input
            type="number"
            placeholder="Loan Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4"
            required
          />

          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4"
            required
          >
            <option value="">Select Loan Term</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
          </select>

          <textarea
            placeholder="Purpose of Loan"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4 h-32"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
          >
            {loading ? "SUBMITTING..." : "SUBMIT APPLICATION"}
          </button>

        </form>

      </div>

    </div>
  )
}