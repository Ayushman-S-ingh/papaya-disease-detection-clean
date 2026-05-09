// src/services/predictionService.js

import axios from "axios";

// =========================
// BASE API URL
// =========================
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// =========================
// TOKEN HELPER
// =========================
const getAuthHeaders = () => {

  const token =
    localStorage.getItem(
      "access_token"
    );

  return {
    Authorization:
      `Bearer ${token}`,
  };
};

// =========================
// PREDICTION SERVICE
// =========================
export const predictionService = {

  // =========================
  // PREDICT DISEASE
  // =========================
  predict: async (
    file,
    notes = ""
  ) => {

    try {

      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      formData.append(
        "notes",
        notes
      );

      const response =
        await axios.post(
          `${API_URL}/api/predict`,
          formData,
          {
            headers: {
              ...getAuthHeaders(),
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      return response.data;

    } catch (error) {

      console.error(
        "Prediction error:",
        error.response?.data
      );

      throw error;
    }
  },

  // =========================
  // GET DASHBOARD SUMMARY
  // =========================
  getSummary: async () => {

    try {

      const response =
        await axios.get(
          `${API_URL}/api/analytics`,
          {
            headers:
              getAuthHeaders(),
          }
        );

      return response.data;

    } catch (error) {

      console.error(
        "Summary error:",
        error
      );

      throw error;
    }
  },

  // =========================
  // GET HISTORY
  // =========================
  getHistory: async () => {

    try {

      const response =
        await axios.get(
          `${API_URL}/api/history`,
          {
            headers:
              getAuthHeaders(),
          }
        );

      return response.data;

    } catch (error) {

      console.error(
        "History error:",
        error
      );

      throw error;
    }
  },

  // =========================
  // GET SINGLE PREDICTION
  // =========================
  getSinglePrediction:
    async (id) => {

    try {

      const response =
        await axios.get(
          `${API_URL}/api/history/${id}`,
          {
            headers:
              getAuthHeaders(),
          }
        );

      return response.data;

    } catch (error) {

      console.error(
        "Single prediction error:",
        error
      );

      throw error;
    }
  },

  // =========================
  // DELETE PREDICTION
  // =========================
  deletePrediction:
    async (id) => {

    try {

      const response =
        await axios.delete(
          `${API_URL}/api/history/${id}`,
          {
            headers:
              getAuthHeaders(),
          }
        );

      return response.data;

    } catch (error) {

      console.error(
        "Delete error:",
        error
      );

      throw error;
    }
  },

  // =========================
  // DOWNLOAD PDF REPORT
  // =========================
  getReport: async (
    predictionId
  ) => {

    try {

      const response =
        await axios.get(
          `${API_URL}/api/report/pdf/${predictionId}`,
          {
            responseType:
              "blob",

            headers:
              getAuthHeaders(),
          }
        );

      return response.data;

    } catch (error) {

      console.error(
        "Report download error:",
        error
      );

      throw error;
    }
  },
};