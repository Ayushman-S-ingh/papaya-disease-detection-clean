import React from "react";
// src/components/common/ConfidenceBar.jsx
export default function ConfidenceBar({ value }) {
  const pct = Math.min(100, Math.max(0, Number(value)));
  const color =
    pct >= 90 ? "bg-green-500" :
    pct >= 70 ? "bg-lime-500"  :
    pct >= 50 ? "bg-yellow-500":
                "bg-red-400";

  return (
    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
      <div
        className={`${color} h-3 rounded-full transition-all duration-700`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}