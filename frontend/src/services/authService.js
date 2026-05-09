// src/services/authService.js

import axios from "axios";

// =========================
// BASE API URL
// =========================
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// =========================
// AUTH SERVICE
// =========================
export const authService = {

  // LOGIN
  login: async (
    email,
    password
  ) => {

    try {

      const response =
        await axios.post(
          `${API_URL}/api/auth/login`,
          {
            email,
            password,
          }
        );

      return response.data;

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      throw error;
    }
  },

  // REGISTER
  register: async (
    userData
  ) => {

    try {

      const response =
        await axios.post(
          `${API_URL}/api/auth/register`,
          userData
        );

      return response.data;

    } catch (error) {

      console.error(
        "Register error:",
        error
      );

      throw error;
    }
  },

  // GET CURRENT USER
  getMe: async () => {

    try {

      const token =
        localStorage.getItem(
          "access_token"
        );

      const response =
        await axios.get(
          `${API_URL}/api/auth/me`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

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