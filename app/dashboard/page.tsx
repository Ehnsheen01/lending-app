export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* Sidebar */}
      <aside className="w-72 bg-emerald-900 text-white p-6 hidden md:block">

        <div className="mb-10">
          <h1 className="text-3xl font-bold">
            A&L
          </h1>

          <p className="text-emerald-300 text-sm">
            Micro Lending System
          </p>
        </div>

        <nav className="space-y-3">

          <div className="bg-emerald-700 p-3 rounded-xl cursor-pointer">
            Dashboard
          </div>

          <div className="hover:bg-emerald-800 p-3 rounded-xl cursor-pointer transition">
            Loans
          </div>

          <div className="hover:bg-emerald-800 p-3 rounded-xl cursor-pointer transition">
            Borrowers
          </div>

          <div className="hover:bg-emerald-800 p-3 rounded-xl cursor-pointer transition">
            Collections
          </div>

          <div className="hover:bg-emerald-800 p-3 rounded-xl cursor-pointer transition">
            Staff
          </div>

          <div className="hover:bg-emerald-800 p-3 rounded-xl cursor-pointer transition">
            Reports
          </div>

        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Dashboard
            </h1>

            <p className="text-gray-500">
              Welcome to A&L Alalay Micro Lending
            </p>
          </div>

          <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-3 rounded-xl shadow">
            + New Loan
          </button>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">
              Total Active Loans
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-2">
              128
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">
              Today's Collections
            </p>

            <h2 className="text-3xl font-bold text-emerald-700 mt-2">
              ₱45,320
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">
              Pending Approvals
            </p>

            <h2 className="text-3xl font-bold text-yellow-600 mt-2">
              12
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">
              Overdue Accounts
            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">
              7
            </h2>
          </div>

        </div>

        {/* Recent Loans */}
        <div className="bg-white rounded-2xl shadow p-6">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-xl font-bold text-slate-800">
              Recent Loans
            </h2>

            <button className="text-emerald-700 font-medium">
              View All
            </button>

          </div>

          <table className="w-full">

            <thead>
              <tr className="text-left text-gray-500 border-b">

                <th className="pb-3">Borrower</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Collector</th>

              </tr>
            </thead>

            <tbody>

              <tr className="border-b">
                <td className="py-4">Juan Dela Cruz</td>
                <td>₱15,000</td>
                <td>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                    Pending
                  </span>
                </td>
                <td>Maria Santos</td>
              </tr>

              <tr className="border-b">
                <td className="py-4">Ana Reyes</td>
                <td>₱25,000</td>
                <td>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
                    Approved
                  </span>
                </td>
                <td>John Cruz</td>
              </tr>

            </tbody>

          </table>

        </div>

      </main>

    </div>
  )
}