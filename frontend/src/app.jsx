import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";


// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Predict from "./pages/Predict";
import History from "./pages/History";
import HistoryDetails from "./pages/HistoryDetails";
import Analytics from "./pages/Analytics";
import Admin from "./pages/Admin";



function PrivateRoute({ children }) {

  const { user, loading } = useAuth();

  if (loading) {

    return (

      <div className="flex items-center justify-center h-screen">

        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"
        />

      </div>

    );

  }

  return user
    ? children
    : <Navigate to="/login" replace />;

}



function AdminRoute({ children }) {

  const { user } = useAuth();

  return user?.role === "admin"
    ? children
    : <Navigate to="/dashboard" replace />;

}



export default function App() {

  return (

    <AuthProvider>

      <Router>

        <Routes>

          {/* HOME */}
          <Route
            path="/"
            element={<Home />}
          />



          {/* LOGIN */}
          <Route
            path="/login"
            element={<Login />}
          />



          {/* SIGNUP */}
          <Route
            path="/signup"
            element={<Signup />}
          />



          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />



          {/* PREDICT */}
          <Route
            path="/predict"
            element={
              <PrivateRoute>
                <Predict />
              </PrivateRoute>
            }
          />



          {/* HISTORY */}
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            }
          />



          {/* HISTORY DETAILS */}
          <Route
            path="/history/:id"
            element={
              <PrivateRoute>
                <HistoryDetails />
              </PrivateRoute>
            }
          />



          {/* ANALYTICS */}
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <Analytics />
              </PrivateRoute>
            }
          />



          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>

                <AdminRoute>
                  <Admin />
                </AdminRoute>

              </PrivateRoute>
            }
          />



          {/* FALLBACK */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

      </Router>

    </AuthProvider>

  );

}