"use client";
import { useState, useEffect, useMemo } from "react";
import VendorSidebar from "../sidebar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../../firebase";
import { useRouter } from "next/navigation";

const dummyPayments = [
  {
    id: 1,
    date: "2025-10-15",
    description: "October bookings payout",
    commission: 2000,
    payout: 18000,
    status: "Paid",
  },
  {
    id: 2,
    date: "2025-11-10",
    description: "November bookings payout",
    commission: 1500,
    payout: 15000,
    status: "Pending",
  },
  {
    id: 3,
    date: "2025-09-05",
    description: "Advance booking",
    commission: 500,
    payout: 4500,
    status: "Paid",
  },
];

export default function VendorPayments() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [payments, setPayments] = useState(dummyPayments);
  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router]);
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  if (!user) return null;

  const totalDue = useMemo(
    () =>
      payments
        .filter((p) => p.status !== "Paid")
        .reduce((s, p) => s + p.payout, 0),
    [payments]
  );
  const totalEarned = useMemo(
    () =>
      payments
        .filter((p) => p.status === "Paid")
        .reduce((s, p) => s + p.payout, 0),
    [payments]
  );

  const filtered = payments.filter((p) => {
    if (filter === "paid" && p.status !== "Paid") return false;
    if (filter === "pending" && p.status !== "Pending") return false;
    if (
      query &&
      !(p.description + p.date).toLowerCase().includes(query.toLowerCase())
    )
      return false;
    return true;
  });

  const requestPayout = () => {
    // placeholder: open payout flow or call API
    alert(`Payout requested for ₹${totalDue}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <VendorSidebar />
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-[#8B000F]">
                Payments & Payouts
              </h1>
              <p className="text-sm text-black/90 mt-1">
                Overview of your earnings, commissions, and pending payouts.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search payments"
                className="px-3 py-2 rounded-lg border w-56"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 rounded-lg border"
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
              <button
                onClick={requestPayout}
                className="px-4 py-2 bg-[#8B000F] text-white rounded-md"
              >
                Request Payout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-black/90">Total Earned</div>
              <div className="text-2xl font-bold text-black mt-2">
                ₹{totalEarned.toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-black/90">Pending Payout</div>
              <div className="text-2xl font-bold text-black mt-2">
                ₹{totalDue.toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-black/90">Commission (est.)</div>
              <div className="text-2xl font-bold text-black mt-2">
                ₹
                {payments
                  .reduce((s, p) => s + p.commission, 0)
                  .toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-black">
                Recent Transactions
              </h2>
              <div className="text-sm text-black/80">
                {filtered.length} records
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <div className="text-sm text-black">{p.date}</div>
                    <div className="text-black font-medium">
                      {p.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-black/90">
                      Commission: ₹{p.commission.toLocaleString()}
                    </div>
                    <div className="text-lg font-bold text-black">
                      ₹{p.payout.toLocaleString()}
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-white font-semibold ${
                          p.status === "Paid" ? "bg-green-600" : "bg-yellow-500"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
