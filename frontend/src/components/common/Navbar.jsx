import React from "react";

// src/components/common/Navbar.jsx

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
    label: "Scan Leaf",
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



  const handleLogout = () => {

    logout();

    navigate("/login");

  };



  return (

    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* BRAND */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-bold text-green-700 text-lg"
        >

          <span className="text-2xl">
            🌿
          </span>

          <span className="hidden sm:inline">
            PapayaAI
          </span>

        </Link>



        {/* NAVIGATION */}
        <div className="flex items-center gap-1">

          {NAV_ITEMS.map((item) => (

            <Link
              key={item.to}
              to={item.to}

              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition

              ${
                pathname === item.to

                  ? "bg-green-50 text-green-700"

                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >

              <span>
                {item.icon}
              </span>

              <span className="hidden md:inline">
                {item.label}
              </span>

            </Link>

          ))}



          {/* ADMIN */}
          {user?.role === "admin" && (

            <Link
              to="/admin"

              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition

              ${
                pathname === "/admin"

                  ? "bg-purple-50 text-purple-700"

                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >

              <span>
                ⚙️
              </span>

              <span className="hidden md:inline">
                Admin
              </span>

            </Link>

          )}

        </div>



        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* USER INFO */}
          <div className="hidden sm:flex flex-col items-end">

            <p className="text-sm font-semibold text-gray-900">
              {user?.name}
            </p>

            <p className="text-xs text-gray-400 capitalize">
              {user?.role}
            </p>

          </div>



          {/* BACK BUTTON */}
          <button

            onClick={() => navigate(-1)}

            className="px-3 py-2 text-sm text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition font-medium"
          >
            ← Back
          </button>



          {/* LOGOUT */}
          <button

            onClick={handleLogout}

            className="px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
          >
            Sign Out
          </button>

        </div>

      </div>

    </nav>

  );

}