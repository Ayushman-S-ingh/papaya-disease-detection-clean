import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function HistoryDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [prediction, setPrediction] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchPrediction();

  }, []);

  const fetchPrediction = async () => {

    try {

      const token = localStorage.getItem("access_token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/history/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPrediction(response.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  const deletePrediction = async () => {

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

      alert("Deleted successfully");

      navigate("/history");

    } catch (error) {

      console.error(error);

      alert("Delete failed");

    }
  };

  if (loading) {

    return (
      <h2 style={{ padding: "30px" }}>
        Loading...
      </h2>
    );
  }

  if (!prediction) {

    return (
      <h2 style={{ padding: "30px" }}>
        Prediction not found
      </h2>
    );
  }

  return (
    <div
      style={{
        padding: "40px",
        background: "#eef7f0",
        minHeight: "100vh",
      }}
    >

      <button
        onClick={() => navigate("/history")}
        style={{
          marginBottom: "20px",
          padding: "10px 16px",
          border: "none",
          background: "#166534",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "30px",
          maxWidth: "900px",
          margin: "auto",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        }}
      >

        <img
          src={`${import.meta.env.VITE_API_URL}${prediction.image_url}`}
          alt="leaf"
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            borderRadius: "16px",
            marginBottom: "20px",
          }}
        />

        <h1
          style={{
            color: "#14532d",
            marginBottom: "15px",
          }}
        >
          {prediction.disease_name}
        </h1>

        <h3>
          Confidence: {prediction.confidence.toFixed(2)}%
        </h3>

        <h3>
          Severity: {prediction.severity}
        </h3>

        <p
          style={{
            marginTop: "20px",
            lineHeight: "1.8",
            color: "#333",
          }}
        >
          {prediction.treatment}
        </p>

        <button
          onClick={deletePrediction}
          style={{
            marginTop: "30px",
            background: "#dc2626",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Delete Prediction
        </button>

      </div>

    </div>
  );
}