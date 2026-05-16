"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import toast from "react-hot-toast"

export default function AdminPage() {

  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {

    const { data, error } = await supabase
      .from("loans")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    setLoans(data || [])
    setLoading(false)
  }

  const updateStatus = async (
    id: string,
    status: string
  ) => {

    const { error } = await supabase
      .from("loans")
      .update({ status })
      .eq("id", id)

    if (error) {
      toast.error(error.message)
      return
    }

    // Instant UI update
    setLoans((prevLoans) =>
      prevLoans.map((loan) =>
        loan.id === id
          ? { ...loan, status }
          : loan
      )
    )

    toast.success(`Loan ${status}`)
  }

  const handleLogout = async () => {

    await supabase.auth.signOut()

    toast.success("Logged out successfully!")

    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black text-white p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">

        <div>

          <h1 className="text-5xl font-bold">
            Admin Panel
          </h1>

          <p className="text-emerald-400 mt-2">
            Loan Management System
          </p>

        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-2xl font-bold shadow-lg"
        >
          Logout
        </button>

      </div>

      {loading ? (

        <div className="text-xl">
          Loading applications...
        </div>

      ) : (

        <div className="space-y-6">

          {loans.map((loan) => {

            const interest = Number(loan.amount) * 0.12

            const totalCollectible =
              Number(loan.amount) + interest

            const weeklyAmortization =
              totalCollectible / 4

            return (

              <div
                key={loan.id}
                className="bg-white/10 rounded-3xl p-6 border border-white/10"
              >

                {/* Loan Info */}
                <div className="grid gap-4 md:grid-cols-2">

                  <div>

                    <p className="text-gray-400">
                      Loan Amount
                    </p>

                    <h2 className="text-3xl font-bold mt-1">
                      ₱{Number(loan.amount).toFixed(2)}
                    </h2>

                  </div>

                  <div>

                    <p className="text-gray-400">
                      Status
                    </p>

                    <h2
                      className={`text-2xl font-bold mt-1 ${
                        String(loan.status)
                          .trim()
                          .toLowerCase() === "approved"
                          ? "text-emerald-400"
                          : String(loan.status)
                              .trim()
                              .toLowerCase() === "rejected"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {loan.status}
                    </h2>

                  </div>

                  <div>

                    <p className="text-gray-400">
                      Purpose
                    </p>

                    <p className="mt-1">
                      {loan.purpose}
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-400">
                      Weekly Amortization
                    </p>

                    <p className="mt-1">
                      ₱{weeklyAmortization.toFixed(2)}
                    </p>

                  </div>

                </div>

                {/* Buttons */}
                {String(loan.status)
                  .trim()
                  .toLowerCase() === "pending" ? (

                  <div className="flex gap-4 mt-6">

                    <button
                      onClick={() =>
                        updateStatus(
                          loan.id,
                          "Approved"
                        )
                      }
                      className="bg-emerald-600 hover:bg-emerald-700 px-5 py-3 rounded-xl font-bold"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          loan.id,
                          "Rejected"
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-bold"
                    >
                      Reject
                    </button>

                  </div>

                ) : (

                  <div className="mt-6">

                    <span className="bg-gray-700 text-white px-4 py-2 rounded-xl">
                      Action Completed
                    </span>

                  </div>

                )}

              </div>
            )
          })}

        </div>

      )}

    </div>
  )
}