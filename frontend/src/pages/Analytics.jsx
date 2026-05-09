import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import axios from "axios";

export default function Analytics() {

  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:5000";

  useEffect(() => {

    fetchAnalytics();

  }, []);

  const fetchAnalytics = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem("access_token");

      const response = await axios.get(
        `${API_URL}/api/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(response.data);

      setError("");

    } catch (error) {

      console.error(
        "Analytics fetch failed:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.error ||
        "Failed to load analytics"
      );

    } finally {

      setLoading(false);

    }
  };

  // ─────────────────────────────────────────────

  if (loading) {

    return (
      <>
        <Navbar />

        <div
          style={{
            padding: "40px",
            fontSize: "22px",
            color: "#14532d",
          }}
        >
          Loading analytics...
        </div>
      </>
    );
  }

  // ─────────────────────────────────────────────

  if (error) {

    return (
      <>
        <Navbar />

        <div
          style={{
            padding: "40px",
          }}
        >

          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "20px",
              borderRadius: "12px",
              fontSize: "18px",
              maxWidth: "500px",
            }}
          >
            {error}
          </div>

        </div>
      </>
    );
  }

  // ─────────────────────────────────────────────

  return (

    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
          background: "#eef7f0",
          minHeight: "100vh",
        }}
      >

        <h1
          style={{
            color: "#1b4332",
            marginBottom: "30px",
            fontSize: "42px",
            fontWeight: "bold",
          }}
        >
          Analytics Dashboard
        </h1>

        {/* TOP CARDS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px,1fr))",
            gap: "20px",
          }}
        >

          <div style={cardStyle}>

            <div style={iconStyle}>
              📊
            </div>

            <h2>Total Predictions</h2>

            <p style={numberStyle}>
              {stats?.total_predictions || 0}
            </p>

          </div>

          <div style={cardStyle}>

            <div style={iconStyle}>
              ✅
            </div>

            <h2>Healthy Leaves</h2>

            <p style={numberStyle}>
              {stats?.healthy_predictions || 0}
            </p>

          </div>

          <div style={cardStyle}>

            <div style={iconStyle}>
              🦠
            </div>

            <h2>Disease Detections</h2>

            <p style={numberStyle}>
              {stats?.disease_predictions || 0}
            </p>

          </div>

        </div>

        {/* DISEASE BREAKDOWN */}

        <div
          style={{
            marginTop: "40px",
            background: "white",
            padding: "30px",
            borderRadius: "18px",
            boxShadow:
              "0 4px 14px rgba(0,0,0,0.08)",
          }}
        >

          <h2
            style={{
              marginBottom: "25px",
              fontSize: "28px",
              color: "#081c15",
            }}
          >
            Disease Breakdown
          </h2>

          {stats?.disease_breakdown?.length > 0 ? (

            stats.disease_breakdown.map(
              (item, index) => (

                <div
                  key={index}
                  style={{
                    marginBottom: "24px",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                      fontSize: "18px",
                    }}
                  >

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.count}
                    </span>

                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: "16px",
                      background: "#d8f3dc",
                      borderRadius: "20px",
                      overflow: "hidden",
                    }}
                  >

                    <div
                      style={{
                        width: `${item.percentage}%`,
                        height: "100%",
                        background: "#2d6a4f",
                        transition: "1s",
                      }}
                    />

                  </div>

                </div>

              )
            )

          ) : (

            <p
              style={{
                color: "#666",
                fontSize: "18px",
              }}
            >
              No analytics data available yet.
            </p>

          )}

        </div>

      </div>
    </>
  );
}

// ─────────────────────────────────────────────

const cardStyle = {

  background: "white",

  borderRadius: "18px",

  padding: "28px",

  boxShadow:
    "0 4px 14px rgba(0,0,0,0.08)",

  display: "flex",

  flexDirection: "column",

  gap: "10px",
};

// ─────────────────────────────────────────────

const iconStyle = {

  fontSize: "34px",

  width: "60px",

  height: "60px",

  borderRadius: "14px",

  background: "#eef7f0",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",
};

// ─────────────────────────────────────────────

const numberStyle = {

  fontSize: "48px",

  fontWeight: "bold",

  color: "#2d6a4f",

  marginTop: "10px",
};