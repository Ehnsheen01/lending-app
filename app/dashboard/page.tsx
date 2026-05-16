"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import toast from "react-hot-toast"

export default function DashboardPage() {

  const [loan, setLoan] = useState<any>(null)
  const [loading, setLoading] = useState(true)

   const [payments, setPayments] =
  useState<any[]>([])

  useEffect(() => {
    fetchLoan()
  }, [])

  const fetchLoan = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      window.location.href = "/login"
      return
    }

    const { data, error } = await supabase
      .from("loans")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (!error && data) {

      setLoan(data)

    const { data: paymentData } =
    await supabase
      .from("payments")
      .select("*")
      .eq("loan_id", data.id)
      .order("payment_date", {
        ascending: false
      })
    
    setPayments(paymentData || [])
    }

    setLoading(false)

  } 

  const handleLogout = async () => {

    await supabase.auth.signOut()

    toast.success("Logged out successfully!")

    window.location.href = "/login"
  }

  const interest = loan ? loan.amount * 0.12 : 0

  const totalCollectible = loan
    ? loan.amount + interest
    : 0

  const weeklyAmortization = totalCollectible / 4

  const totalPaid =
  payments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount),
    0
  )

  const remainingBalance =
  totalCollectible - totalPaid

  const totalRetentionFund =
  payments.reduce(
    (sum, payment) =>
      sum + Number(payment.retention_fund || 0),
    0
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black text-white p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">

        <div>

          <h1 className="text-4xl font-bold">
            Borrower Dashboard
          </h1>

          <p className="text-emerald-400 mt-2">
            Welcome to A&L Alalay
          </p>

        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-2xl font-bold shadow-lg"
        >
          Logout
        </button>

      </div>

      {/* Loading */}
      {loading ? (

        <div className="text-center text-xl">
          Loading...
        </div>

      ) : (

        <>
          {/* Loan Cards */}
          <div className="grid gap-5 md:grid-cols-3">

            {/* Status Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/10">

              <p className="text-gray-300">
                Loan Status
              </p>

              <h2
                className={`text-3xl font-bold mt-3 ${
                  loan?.status === "Approved"
                    ? "text-emerald-400"
                    : loan?.status === "Rejected"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {loan ? loan.status : "No Active Loan"}
              </h2>

              {loan?.status === "Approved" && (

                <div className="mt-6 bg-emerald-500/20 border border-emerald-400 rounded-2xl p-5">

                  <h2 className="text-2xl font-bold text-emerald-300">
                    Loan Approved ✅
                  </h2>

                  <p className="mt-2 text-emerald-100">
                    Your loan has been approved. Please coordinate with A&L Alalay for release and collection schedule.
                  </p>

                </div>

              )}

            </div>

            {/* Loan Amount */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/10">

              <p className="text-gray-300">
                Loan Amount
              </p>

              <h2 className="text-3xl font-bold mt-3">
                ₱{loan ? Number(loan.amount).toFixed(2) : "0.00"}
              </h2>

            </div>

            {/* Weekly Amortization */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/10">

              <p className="text-gray-300">
                Weekly Amortization
              </p>

              <h2 className="text-3xl font-bold mt-3">
                ₱{loan ? weeklyAmortization.toFixed(2) : "0.00"}
              </h2>

            </div>

          </div>

          {/* Loan Summary */}
          {loan && (

            <div className="mt-10 bg-white/10 rounded-3xl p-8 border border-white/10">

              <h2 className="text-3xl font-bold mb-6">
                Latest Loan Application
              </h2>

              <div className="grid gap-4 md:grid-cols-2">

                <div>
                  <p className="text-gray-400">
                    Loan Purpose
                  </p>

                  <p className="text-xl mt-1">
                    {loan.purpose}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">
                    Total Collectible
                  </p>

                  <p className="text-xl mt-1">
                    ₱{totalCollectible.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">
                    Loan Term
                  </p>

                  <p className="text-xl mt-1">
                    {loan.term_months} Month
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">
                    Status
                  </p>

                  <p className="text-xl mt-1">
                    {loan.status}
                  </p>
                </div>

              </div>

            </div>

          )}

          {/* Payment Summary */}
          {loan && loan.status === "Approved" && (

            <div className="mt-10 bg-white/10 rounded-3xl p-8 border border-white/10">

              <h2 className="text-3xl font-bold mb-6">
                Payment Summary
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                <div>

                  <p className="text-gray-400">
                    Total Paid
                  </p>

                  <h2 className="text-3xl font-bold text-emerald-400 mt-2">
                    ₱{totalPaid.toFixed(2)}
                  </h2>

                </div>

                <div>

                  <p className="text-gray-400">
                    Remaining Balance
                  </p>

                  <h2 className="text-3xl font-bold text-yellow-400 mt-2">
                    ₱{remainingBalance.toFixed(2)}
                  </h2>

                  <div>

                  <p className="text-gray-400">
                    Loan Retention Fund
                  </p>

                  <h2 className="text-3xl font-bold text-cyan-400 mt-2">
                    ₱{totalRetentionFund.toFixed(2)}
                  </h2>

                </div>

                </div>

              </div>

            </div>

          )}

          {/* Payment History */}
          {payments.length > 0 && (

            <div className="mt-10 bg-white/10 rounded-3xl p-8 border border-white/10">

              <h2 className="text-3xl font-bold mb-6">
                Payment History
              </h2>

              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead>

                    <tr className="border-b border-white/10 text-gray-400">

                      <th className="py-3">
                        Date Paid
                      </th>

                      <th className="py-3">
                        Amortization
                      </th>

                      <th className="py-3">
                        Retention Fund
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {payments.map((payment) => (

                      <tr
                        key={payment.id}
                        className="border-b border-white/5"
                      >

                        <td className="py-4">
                          {new Date(
                            payment.payment_date
                          ).toLocaleDateString()}
                        </td>

                        <td className="py-4 text-emerald-300">
                          ₱{Number(payment.amount).toFixed(2)}
                        </td>

                        <td className="py-4 text-cyan-300">
                          ₱{Number(
                            payment.retention_fund || 0
                          ).toFixed(2)}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          )}

          {/* Actions */}
          <div className="mt-10 grid gap-5 md:grid-cols-2">

            <a
              href="/apply-loan"
              className="bg-emerald-700 hover:bg-emerald-800 rounded-3xl p-8 text-left transition-all block"
            >

              <h2 className="text-2xl font-bold">
                Apply for Loan
              </h2>

              <p className="mt-2 text-emerald-200">
                Submit a new loan application
              </p>

            </a>

            <button className="bg-white/10 hover:bg-white/20 rounded-3xl p-8 text-left transition-all border border-white/10">

              <h2 className="text-2xl font-bold">
                My Profile
              </h2>

              <p className="mt-2 text-gray-300">
                View and update account information
              </p>

            </button>

          </div>
        </>
      )}

    </div>
  )
}