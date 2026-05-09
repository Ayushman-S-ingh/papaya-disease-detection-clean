// src/services/api.js

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// =========================
// MAIN REQUEST FUNCTION
// =========================
async function request(
  method,
  path,
  body = null,
  isFormData = false
) {

  const token = localStorage.getItem(
    "access_token"
  );

  const headers = {};

  if (token) {
    headers["Authorization"] =
      `Bearer ${token}`;
  }

  if (!isFormData) {
    headers["Content-Type"] =
      "application/json";
  }

  const response = await fetch(
    `${BASE_URL}${path}`,
    {
      method,
      headers,
      body: body
        ? (
            isFormData
              ? body
              : JSON.stringify(body)
          )
        : null,
    }
  );

  // =========================
  // AUTO REFRESH TOKEN
  // =========================
  if (response.status === 401) {

    const refreshed = await tryRefresh();

    if (refreshed) {

      return request(
        method,
        path,
        body,
        isFormData
      );
    }

    localStorage.clear();

    window.location.href = "/login";

    throw new Error(
      "Session expired"
    );
  }

  // =========================
  // HANDLE ERRORS
  // =========================
  if (!response.ok) {

    const err = await response
      .json()
      .catch(() => ({}));

    throw new Error(
      err.error ||
      `HTTP ${response.status}`
    );
  }

  return response.json();
}

// =========================
// REFRESH TOKEN
// =========================
async function tryRefresh() {

  const refresh =
    localStorage.getItem(
      "refresh_token"
    );

  if (!refresh) {
    return false;
  }

  try {

    const res = await fetch(
      `${BASE_URL}/api/auth/refresh`,
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${refresh}`,
          "Content-Type":
            "application/json",
        },
      }
    );

    if (!res.ok) {
      return false;
    }

    const data = await res.json();

    localStorage.setItem(
      "access_token",
      data.access_token
    );

    return true;

  } catch {

    return false;
  }
}

// =========================
// API METHODS
// =========================
export const api = {

  get: (path) =>
    request("GET", path),

  post: (path, body) =>
    request("POST", path, body),

  put: (path, body) =>
    request("PUT", path, body),

  delete: (path) =>
    request("DELETE", path),

  upload: (path, formData) =>
    request(
      "POST",
      path,
      formData,
      true
    ),
};

// =========================
// AUTH SERVICE
// =========================
export const authService = {

  login: (email, password) =>
    api.post(
      "/api/auth/login",
      {
        email,
        password,
      }
    ),

  register: (data) =>
    api.post(
      "/api/auth/register",
      data
    ),

  getMe: () =>
    api.get("/api/auth/me"),
};

// =========================
// PREDICTION SERVICE
// =========================
export const predictionService = {

  predict: (
    file,
    notes = ""
  ) => {

    const form = new FormData();

    form.append(
      "image",
      file
    );

    form.append(
      "notes",
      notes
    );

    return api.upload(
      "/api/predict",
      form
    );
  },

  getHistory: (
    params = {}
  ) => {

    const q =
      new URLSearchParams(
        params
      ).toString();

    return api.get(
      `/api/history?${q}`
    );
  },

  getSingle: (id) =>
    api.get(
      `/api/history/${id}`
    ),

  delete: (id) =>
    api.delete(
      `/api/history/${id}`
    ),

  getSummary: () =>
    api.get(
      "/api/analytics/summary"
    ),

  getTrends: (days) =>
    api.get(
      `/api/analytics/trends?days=${days}`
    ),

  getReport: async (id) => {

    const token =
      localStorage.getItem(
        "access_token"
      );

    const response = await fetch(
      `${BASE_URL}/api/report/pdf/${id}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to download report"
      );
    }

    return response.blob();
  },
};