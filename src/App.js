import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { DataProvider } from "./context/DataContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DynamicThemeProvider from "./components/DynamicThemeProvider.jsx";

/* Pages */
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import MarketHome from "./pages/market/MarketHome.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";

export default function App() {
  return (
    // AuthProvider must be outside the DynamicThemeProvider
    <AuthProvider>
      {/* DataProvider must be inside AuthProvider */}
      <DataProvider>
        {/* DynamicThemeProvider reads from AuthProvider */}
        <DynamicThemeProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Main App Layout */}
              {/* MarketHome is now the main layout for ALL logged-in users */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <MarketHome />
                </ProtectedRoute>
              } />

              {/* Admin Area */}
              <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminPanel />
                </ProtectedRoute>
              } />

            </Routes>
          </BrowserRouter>
        </DynamicThemeProvider>
      </DataProvider>
    </AuthProvider>
  );
}