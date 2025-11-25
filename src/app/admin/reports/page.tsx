"use client";
import React from "react";

const sampleCsvRows = [
  ["id", "customer", "vendor", "date", "amount", "status"],
  [
    "b101",
    "Priya & Aman",
    "Dream Weddings",
    "2025-12-10",
    "45000",
    "Confirmed",
  ],
  ["b102", "Rohit & Neha", "Royal Banquets", "2026-01-15", "120000", "Pending"],
  ["b103", "Sakshi & Arjun", "TasteCater", "2026-02-20", "70000", "Completed"],
];

function downloadCSV(filename = "report.csv") {
  const csv = sampleCsvRows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function AdminReports() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-black mb-4">Reports</h2>
      <p className="text-sm text-black/90 mb-4">
        Generate and download reports.
      </p>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-black/90">Bookings report (sample)</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadCSV()}
              className="px-4 py-2 bg-[#8B000F] text-white rounded"
            >
              Download CSV
            </button>
            <button
              type="button"
              onClick={() => alert("Generate PDF not implemented in demo")}
              className="px-4 py-2 bg-white border rounded"
            >
              Generate PDF
            </button>
          </div>
        </div>
        <div className="mt-4 text-sm text-black/80">
          Sample rows included: {sampleCsvRows.length - 1}
        </div>
      </div>
    </div>
  );
}
