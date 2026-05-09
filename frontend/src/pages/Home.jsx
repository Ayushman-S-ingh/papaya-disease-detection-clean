import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "55px", marginBottom: "20px" }}>
        🌿 Papaya Disease Detection
      </h1>

      <p
        style={{
          maxWidth: "700px",
          fontSize: "20px",
          color: "#cbd5e1",
          marginBottom: "40px",
        }}
      >
        AI-powered papaya leaf disease detection system using
        Deep Learning and EfficientNetB0.
      </p>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/login">
          <button
            style={{
              padding: "15px 35px",
              border: "none",
              borderRadius: "10px",
              background: "#22c55e",
              color: "white",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </Link>

        <Link to="/signup">
          <button
            style={{
              padding: "15px 35px",
              border: "none",
              borderRadius: "10px",
              background: "#3b82f6",
              color: "white",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}