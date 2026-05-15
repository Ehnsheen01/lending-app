"use client"

import { useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import toast from "react-hot-toast"

export default function ApplyLoanPage() {

  const [amount, setAmount] = useState("")
  const [purpose, setPurpose] = useState("")
  const [loading, setLoading] = useState(false)

  const loanAmount = Number(amount) || 0

  const maxFirstLoan = 3000

  const interest = useMemo(() => {
    return loanAmount * 0.12
  }, [loanAmount])

  const serviceFee = 50

  const retentionFund = 100

  const totalCollectible = useMemo(() => {
    return loanAmount + interest
  }, [loanAmount, interest])

  const releaseAmount = useMemo(() => {
    return loanAmount - serviceFee
  }, [loanAmount])

  const weeklyAmortization = useMemo(() => {
    return totalCollectible / 4
  }, [totalCollectible])

  const handleApply = async (e: React.FormEvent) => {

    e.preventDefault()

    setLoading(true)

    if (loanAmount > maxFirstLoan) {

      toast.error("Maximum first loan is ₱3,000 only")

      setLoading(false)

      return
    }

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
        amount: loanAmount,
        purpose,
        term_months: 1,

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

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8">

        <h1 className="text-4xl font-bold text-center text-emerald-800">
          Apply for Loan
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          First Cycle — 1 Month Weekly Collection
        </p>

        <form
          onSubmit={handleApply}
          className="space-y-5"
        >

          <div>

            <input
              type="number"
              max="3000"
              placeholder="Loan Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-5 py-4"
              required
            />

            <p className="text-sm text-red-500 mt-2">
              Maximum first loan amount is ₱3,000 only.
            </p>

          </div>

          <div className="w-full border border-gray-300 rounded-xl px-5 py-4 bg-gray-100 text-gray-700">
            Loan Term: 1 Month Cycle
          </div>

          <textarea
            placeholder="Purpose of Loan"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4 h-28"
            required
          />

          {/* Loan Summary */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3">

            <h2 className="text-xl font-bold text-emerald-800">
              Loan Summary
            </h2>

            <div className="flex justify-between">
              <span>Loan Amount</span>
              <span>₱{loanAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Interest (12%)</span>
              <span>₱{interest.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>₱{serviceFee.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Retention Fund</span>
              <span>₱{retentionFund.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-semibold text-emerald-800">
              <span>Release Amount</span>
              <span>₱{releaseAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Weekly Amortization</span>
              <span>₱{weeklyAmortization.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-lg font-bold border-t border-emerald-200 pt-3">
              <span>Total Collectible</span>
              <span>₱{totalCollectible.toFixed(2)}</span>
            </div>

          </div>

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