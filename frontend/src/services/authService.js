// src/services/authService.js

import { CapacitorHttp } from "@capacitor/core";

// =========================
// BASE API URL
// =========================

const API_URL =
  "https://papaya-disease-detection-ww35.onrender.com";

// =========================
// AUTH SERVICE
// =========================

export const authService = {

  // =========================
  // LOGIN
  // =========================

  login: async (
    email,
    password
  ) => {

    try {

      const response =
        await CapacitorHttp.post({

          url:
            `${API_URL}/api/auth/login`,

          headers: {
            "Content-Type":
              "application/json",
          },

          data: {
            email,
            password,
          },
        });

      return response.data;

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      throw error;
    }
  },

  // =========================
  // REGISTER
  // =========================

  register: async (
    userData
  ) => {

    try {

      const response =
        await CapacitorHttp.post({

          url:
            `${API_URL}/api/auth/register`,

          headers: {
            "Content-Type":
              "application/json",
          },

          data: userData,
        });

      return response.data;

    } catch (error) {

      console.error(
        "Register error:",
        error
      );

      throw error;
    }
  },

  // =========================
  // GET CURRENT USER
  // =========================

  getMe: async () => {

    try {

      const token =
        localStorage.getItem(
          "access_token"
        );

      const response =
        await CapacitorHttp.get({

          url:
            `${API_URL}/api/auth/me`,

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        });

      return response.data;

    } catch (error) {

      console.error(
        "Get user error:",
        error
      );

      throw error;
    }
  },
};