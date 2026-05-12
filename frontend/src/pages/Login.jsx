import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {

  const { login } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      const response = await login(
        form.email,
        form.password
      );

      console.log("LOGIN RESPONSE:", response);

      // SAFE USER CHECK
      const user = response?.user || {};

      if (user?.role === "admin") {

        navigate("/admin");

      } else {

        navigate("/dashboard");
      }

    } catch (err) {

      console.error(err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">

          <div className="text-6xl mb-3">🌿</div>

          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Sign in to your farmer account
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>

              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />

            </div>

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />

            </div>

            {error && (

              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">

                {error}

              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition text-lg"
            >

              {loading
                ? "Signing in..."
                : "Sign In"}

            </button>

          </form>

          <p className="text-center text-gray-500 mt-6 text-sm">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="text-green-600 font-semibold hover:underline"
            >
              Sign up free
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}