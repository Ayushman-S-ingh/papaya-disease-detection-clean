import React, { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: "🏠",
  },
  {
    to: "/predict",
    label: "Scan",
    icon: "🔍",
  },
  {
    to: "/history",
    label: "History",
    icon: "📋",
  },
  {
    to: "/analytics",
    label: "Analytics",
    icon: "📊",
  },
];

export default function Navbar() {

  const { user, logout } = useAuth();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 border-b border-gray-200 shadow-sm">

      <div className="max-w-7xl mx-auto px-4">

        {/* TOP BAR */}
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2"
          >
            <span className="text-3xl">
              🌿
            </span>

            <div className="hidden sm:block">
              <h1 className="font-bold text-green-700 text-lg">
                PapayaAI
              </h1>

              <p className="text-xs text-gray-500">
                Disease Detection
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-2">

            {NAV_ITEMS.map((item) => (

              <Link
                key={item.to}
                to={item.to}

                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2

                ${
                  pathname === item.to
                    ? "bg-green-100 text-green-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>

            ))}

            {user?.role === "admin" && (
              <Link
                to="/admin"

                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2

                ${
                  pathname === "/admin"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                ⚙️ Admin
              </Link>
            )}

          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">

            {/* USER */}
            <div className="hidden lg:flex flex-col items-end">
              <p className="text-sm font-semibold text-gray-900">
                {user?.name}
              </p>

              <p className="text-xs text-gray-500 capitalize">
                {user?.role}
              </p>
            </div>

            {/* BACK */}
            <button
              onClick={() => navigate(-1)}

              className="hidden sm:block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              ← Back
            </button>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}

              className="hidden sm:block px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Sign Out
            </button>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}

              className="md:hidden text-2xl p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenu ? "✖" : "☰"}
            </button>

          </div>

        </div>

        {/* MOBILE MENU */}
        {mobileMenu && (

          <div className="md:hidden py-4 border-t border-gray-200 animate-fadeIn">

            <div className="flex flex-col gap-2">

              {NAV_ITEMS.map((item) => (

                <Link
                  key={item.to}
                  to={item.to}

                  onClick={() => setMobileMenu(false)}

                  className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3

                  ${
                    pathname === item.to
                      ? "bg-green-100 text-green-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>

              ))}

              {user?.role === "admin" && (
                <Link
                  to="/admin"

                  onClick={() => setMobileMenu(false)}

                  className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  ⚙️ Admin
                </Link>
              )}

              <button
                onClick={() => navigate(-1)}

                className="px-4 py-3 rounded-xl text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                ← Back
              </button>

              <button
                onClick={handleLogout}

                className="px-4 py-3 rounded-xl text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>

            </div>

          </div>

        )}

      </div>

    </nav>
  );
}