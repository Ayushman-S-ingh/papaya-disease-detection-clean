import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function History() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {

    try {

      const token = localStorage.getItem("access_token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory(response.data.predictions);

    } catch (error) {

      console.error(
        "Failed to fetch history:",
        error.response?.data || error
      );

    } finally {

      setLoading(false);

    }

  };

  const deletePrediction = async (id) => {

    try {

      const token = localStorage.getItem("access_token");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/history/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory((prev) =>
        prev.filter((item) => item.id !== id)
      );

    } catch (error) {

      console.error(
        "Delete failed:",
        error.response?.data || error
      );

      alert("Delete failed");

    }

  };

  if (loading) {

    return (
      <>
        <Navbar />

        <h2
          style={{
            padding: "30px",
          }}
        >
          Loading history...
        </h2>
      </>
    );

  }

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
            marginBottom: "25px",
            color: "#1b4332",
            fontSize: "36px",
            fontWeight: "bold",
          }}
        >
          Prediction History
        </h1>

        {history.length === 0 ? (

          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "14px",
              fontSize: "18px",
            }}
          >
            No prediction history found.
          </div>

        ) : (

          <div
            style={{
              display: "grid",
              gap: "24px",
            }}
          >

            {history.map((item) => (

              <div
                key={item.id}

                onClick={() =>
                  navigate(`/history/${item.id}`)
                }

                style={{
                  background: "white",
                  borderRadius: "18px",
                  padding: "22px",
                  display: "flex",
                  gap: "24px",
                  alignItems: "center",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
              >

                {/* IMAGE */}
                <img
                  src={`${import.meta.env.VITE_API_URL}${item.image_url}`}
                  alt="leaf"
                  style={{
                    width: "170px",
                    height: "170px",
                    objectFit: "cover",
                    borderRadius: "14px",
                    border: "3px solid #d8f3dc",
                  }}
                />

                {/* DETAILS */}
                <div
                  style={{
                    flex: 1,
                  }}
                >

                  <h2
                    style={{
                      marginBottom: "14px",
                      color: "#081c15",
                      fontSize: "30px",
                      fontWeight: "bold",
                    }}
                  >
                    {item.disease_name}
                  </h2>

                  <p
                    style={{
                      marginBottom: "8px",
                      fontSize: "18px",
                    }}
                  >
                    <strong>Confidence:</strong>{" "}

                    {item.confidence > 1
                      ? item.confidence.toFixed(2)
                      : (item.confidence * 100).toFixed(2)
                    }%
                  </p>

                  <p
                    style={{
                      marginBottom: "8px",
                      fontSize: "18px",
                    }}
                  >
                    <strong>Severity:</strong>{" "}
                    {item.severity}
                  </p>

                  <p
                    style={{
                      marginBottom: "8px",
                      fontSize: "18px",
                    }}
                  >
                    <strong>Date:</strong>{" "}
                    {new Date(
                      item.created_at
                    ).toLocaleString()}
                  </p>

                  <div
                    style={{
                      marginTop: "14px",
                      background: "#f8f9fa",
                      padding: "14px",
                      borderRadius: "10px",
                    }}
                  >

                    <h3
                      style={{
                        marginBottom: "8px",
                        color: "#1b4332",
                      }}
                    >
                      Treatment Recommendation
                    </h3>

                    <p
                      style={{
                        color: "#444",
                        lineHeight: "1.7",
                      }}
                    >
                      {item.treatment}
                    </p>

                  </div>

                </div>

                {/* DELETE BUTTON */}
                <button

                  onClick={(e) => {

                    e.stopPropagation();

                    deletePrediction(item.id);

                  }}

                  style={{
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "12px 18px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  Delete
                </button>

              </div>

            ))}

          </div>

        )}

      </div>
    </>

  );

}