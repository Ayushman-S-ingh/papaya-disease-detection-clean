import React from "react";

export default function ConfidenceBar({ confidence }) {
  return (
    <div style={{ marginTop: "10px" }}>
      <p style={{ marginBottom: "8px" }}>
        Confidence: {confidence}%
      </p>

      <div
        style={{
          width: "100%",
          height: "12px",
          background: "#e5e7eb",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${confidence}%`,
            height: "100%",
            background: "#22c55e",
            borderRadius: "10px",
            transition: "0.4s",
          }}
        />
      </div>
    </div>
  );
}