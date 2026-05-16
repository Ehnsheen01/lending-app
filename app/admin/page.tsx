"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import toast from "react-hot-toast"

export default function AdminPage() {

  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [paymentAmounts, setPaymentAmounts] =
    useState<any>({})

  const [payments, setPayments] =
  useState<any[]>([])

  const [retentionAmounts, setRetentionAmounts] =
    useState<any>({})

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

    const { data: paymentData } =
    await supabase
        .from("payments")
        .select("*")

    setPayments(paymentData || [])

    setLoading(false)
  }

  const updateStatus = async (
    id: string,
    status: string
  ) => {

    const { error } = await supabase
      .from("loans")
      .update({
        status,

        approved_at:
            status === "Approved"
            ? new Date()
            : null,

        rejected_at:
            status === "Rejected"
            ? new Date()
            : null,
        })          
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

  const recordPayment = async (
    loanId: string,
    userId: string
  ) => {

    const amount =
      paymentAmounts[loanId]

    const retentionFund =
    retentionAmounts[loanId] || 0

    if (!amount) {
      toast.error("Enter payment amount")
      return
    }

    const { error } = await supabase
      .from("payments")
     .insert({
    loan_id: loanId,
    user_id: userId,
    amount: Number(amount),
    retention_fund: Number(retentionFund),
    })

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Payment recorded")

    setPaymentAmounts((prev: any) => ({
      ...prev,
      [loanId]: ""
    }))
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

            const normalizedStatus =
              String(loan.status)
                .trim()
                .toLowerCase()

            const interest =
              Number(loan.amount) * 0.12

            const totalCollectible =
              Number(loan.amount) + interest

            const loanPayments =
            payments.filter(
                (payment) =>
                payment.loan_id === loan.id
            )

            const totalPaid =
            loanPayments.reduce(
                (sum, payment) =>
                sum + Number(payment.amount),
                0
            )

            const remainingBalance =
            totalCollectible - totalPaid

            const today = new Date()

            const dueDate =
            loan.next_due_date
                ? new Date(loan.next_due_date)
                : null

            const isOverdue =
            dueDate &&
            today > dueDate &&
            remainingBalance > 0

            const penalty =
            isOverdue
                ? remainingBalance * 0.01
                : 0

            const finalBalance =
            remainingBalance + penalty

            const weeklyAmortization =
              totalCollectible / 4

            const minimumLRF = 50

            const totalWeeklyDue =
            weeklyAmortization + minimumLRF

            return (

              <div
                key={loan.id}
                className="bg-white/10 rounded-3xl p-6 border border-white/10"
              >

                <div className="grid md:grid-cols-2 gap-6">

                  <div>
                    <div className="mb-6">

                    <p className="text-gray-400">
                        Borrower
                    </p>

                    <h2 className="text-2xl font-bold mt-1">
                        {loan.full_name || "Unknown Borrower"}
                    </h2>

                    <p className="text-emerald-300 mt-1">
                        {loan.email}
                    </p>

                    </div>

                    <p className="text-gray-400">
                      Loan Amount
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                      ₱{Number(loan.amount).toFixed(2)}
                    </h2>

                    <div className="mt-6">

                      <p className="text-gray-400">
                        Purpose
                      </p>

                      <p className="mt-2">
                        {loan.purpose}
                      </p>

                    </div>

                  </div>

                <div>

                    <p className="text-gray-400">
                      Status
                    </p>

                    <h2 className={`text-3xl font-bold mt-2 ${
                        normalizedStatus === "approved"
                        ? "text-emerald-400"
                        : normalizedStatus === "rejected"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}>
                        
                    {loan.status}
                    </h2>

                    <div className="mt-6">

                        <p className="text-gray-400">
                            Weekly Amortization
                        </p>

                        <p className="mt-2">
                            ₱{weeklyAmortization.toFixed(2)}
                        </p>

                    </div>

                    <div className="mt-6">

                        <p className="text-gray-400">
                            Minimum LRF
                        </p>

                        <h2 className="text-2xl font-bold text-cyan-400 mt-2">
                            ₱{minimumLRF.toFixed(2)}
                        </h2>

                        </div>

                        <div className="mt-6">

                        <p className="text-gray-400">
                            Total Weekly Due
                        </p>

                        <h2 className="text-3xl font-bold text-emerald-300 mt-2">
                            ₱{totalWeeklyDue.toFixed(2)}
                        </h2>

                    </div>

                    <div className="mt-6">

                    <p className="text-gray-400">
                        Remaining Balance
                    </p>

                    <h2 className="text-2xl font-bold text-yellow-400 mt-2">
                        ₱{finalBalance.toFixed(2)}
                    </h2>

                    </div>

                    <div className="mt-4">

                    <p className="text-gray-400">
                        Penalty
                    </p>

                    <h2 className="text-2xl font-bold text-red-400 mt-2">
                        ₱{penalty.toFixed(2)}
                    </h2>

                    </div>

                  </div>

                </div>
                <div className="mt-6 grid md:grid-cols-2 gap-4">

                <div>

                    <p className="text-gray-400">
                    Date Applied
                    </p>

                    <p className="mt-1">
                    {new Date(
                        loan.created_at
                    ).toLocaleString()}
                    </p>

                </div>

                {loan.approved_at && (

                    <div>

                    <p className="text-gray-400">
                        Date Approved
                    </p>

                    <p className="mt-1 text-emerald-300">
                        {new Date(
                        loan.approved_at
                        ).toLocaleString()}
                    </p>

                    </div>

                )}

                {loan.rejected_at && (

                    <div>

                    <p className="text-gray-400">
                        Date Rejected
                    </p>

                    <p className="mt-1 text-red-300">
                        {new Date(
                        loan.rejected_at
                        ).toLocaleString()}
                    </p>

                    </div>

                )}

                </div>

                {/* Actions */}
                {normalizedStatus === "pending" && (

                  <div className="flex gap-4 mt-8">

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

                )}

                {/* Payment Recording */}
                {normalizedStatus === "approved" && (

                  <div className="mt-8 border-t border-white/10 pt-6">

                    <h2 className="text-xl font-bold mb-4">
                      Record Payment
                    </h2>

                    <div className="flex gap-4 flex-wrap">

                      <input
                        type="number"
                        placeholder="Payment Amount"
                        value={paymentAmounts[loan.id] || ""}
                        onChange={(e) =>
                          setPaymentAmounts((prev: any) => ({
                            ...prev,
                            [loan.id]: e.target.value
                          }))
                        }
                        className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white"
                      />

                      <input
                        type="number"
                        placeholder="LRF Amount"
                        value={retentionAmounts[loan.id] || ""}
                        onChange={(e) =>
                            setRetentionAmounts((prev: any) => ({
                            ...prev,
                            [loan.id]: e.target.value
                            }))
                        }
                        className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white"
                        />  

                      <button
                        onClick={() =>
                          recordPayment(
                            loan.id,
                            loan.user_id
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-bold"
                      >
                        Save Payment
                      </button>

                    </div>

                  </div>

                )}

                {/* Payment History */}
                {loanPayments.length > 0 && (

                <div className="mt-8 border-t border-white/10 pt-6">

                    <h2 className="text-2xl font-bold mb-4">
                    Payment History
                    </h2>

                    <div className="space-y-3">

                    {loanPayments.map((payment) => (

                        <div
                        key={payment.id}
                        className="bg-white/5 rounded-2xl p-4"
                        >

                        <div className="flex justify-between flex-wrap gap-4">

                            <div>

                            <p className="text-gray-400 text-sm">
                                Payment Date
                            </p>

                            <p>
                                {new Date(
                                payment.payment_date
                                ).toLocaleString()}
                            </p>

                            </div>

                            <div>

                                <p className="text-gray-400 text-sm">
                                    Amortization
                                </p>

                                <p className="text-emerald-300">
                                    ₱{Number(payment.amount).toFixed(2)}
                                </p>

                                </div>

                            <div>

                                <p className="text-gray-400 text-sm">
                                    LRF
                                </p>

                                <p className="text-cyan-300">
                                    ₱{Number(
                                    payment.retention_fund || 0
                                    ).toFixed(2)}
                                </p>

                            </div>

                            <div>

                                <p className="text-gray-400 text-sm">
                                    Total Paid
                                </p>

                                <p className="text-yellow-300">
                                    ₱{(
                                    Number(payment.amount) +
                                    Number(payment.retention_fund || 0)
                                    ).toFixed(2)}
                                </p>

                            </div>

                        </div>

                        </div>

                    ))}

                    </div>

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