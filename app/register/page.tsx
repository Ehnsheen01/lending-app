"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import toast from "react-hot-toast"

export default function RegisterPage() {

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [province, setProvince] = useState("")
  const [municipality, setMunicipality] = useState("")
  const [barangay, setBarangay] = useState("")
  const [postalCode, setPostalCode] = useState("")

  const [loading, setLoading] = useState(false)

  const provinces = [
    {
      name: "Agusan del Norte",
      postal: "8600",
      municipalities: [
        {
          name: "Cabadbaran City",
          barangays: ["Poblacion 1", "Poblacion 2", "Bayabas", "Kauswagan"]
        },
        {
          name: "Magallanes",
          barangays: ["Poblacion", "Buhang", "Guiasan", "Taod-oy"]
        },
      ],
    },
    {
      name: "Agusan del Sur",
      postal: "8500",
      municipalities: [
        {
          name: "Bayugan City",
          barangays: ["Taglatawan", "Hamogaway", "Poblacion"]
        },
      ],
    },
  ]

  const selectedProvince = provinces.find(
    (p) => p.name === province
  )

  const municipalities = selectedProvince?.municipalities || []

  const selectedMunicipality = municipalities.find(
    (m) => m.name === municipality
  )

  const barangays = selectedMunicipality?.barangays || []

  const handleProvinceChange = (value: string) => {
    setProvince(value)
    setMunicipality("")
    setBarangay("")

    const selected = provinces.find((p) => p.name === value)

    if (selected) {
      setPostalCode(selected.postal)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          province,
          municipality,
          barangay,
          postal_code: postalCode,
        },
      },
    })

    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Verification email sent!")

    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-black flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        <h1 className="text-4xl font-bold text-center text-emerald-800">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Register your borrower account
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
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4"
            required
          />

          <select
            value={province}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4"
            required
          >
            <option value="">Select Province</option>

            {provinces.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}

          </select>

          <select
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4"
            required
          >
            <option value="">Select Municipality</option>

            {municipalities.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}

          </select>

          <select
            value={barangay}
            onChange={(e) => setBarangay(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4"
            required
          >
            <option value="">Select Barangay</option>

            {barangays.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}

          </select>

          <input
            type="text"
            placeholder="Postal Code"
            value={postalCode}
            readOnly
            className="w-full border border-gray-300 rounded-xl px-5 py-4 bg-gray-100"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-5 py-4"
            required
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